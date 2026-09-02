from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import re
import logging
import uuid
import jwt
import httpx
import ipaddress
from html import escape
from html.parser import HTMLParser
from urllib.parse import urlparse
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"

EMAIL_BASE_URL = "https://integrations.emergentagent.com"
EMAIL_KEY = os.environ.get("EMERGENT_EMAIL_KEY")
EMAIL_FROM_NAME = os.environ["EMAIL_FROM_NAME"]
OWNER_EMAIL = os.environ.get("OWNER_EMAIL", "")

_SHORTENERS = ("bit.ly", "tinyurl.com", "t.co", "is.gd", "cutt.ly", "goo.gl", "rebrand.ly")
_CRED_ASK = ("reply with your password", "reply with the code", "send your password", "cvv",
             "send us your password", "enter your password below", "confirm your card number",
             "your full card number", "seed phrase", "recovery phrase", "verify your card",
             "social security number", "confirm your bank details")
_HOSTISH = re.compile(r"\b(?:https?://)?((?:[a-z0-9-]+\.)+[a-z]{2,})", re.I)


def _host_ok(host: str) -> bool:
    if not host or "xn--" in host:
        return False
    try:
        ipaddress.ip_address(host)
        return False
    except ValueError:
        pass
    return not any(host == s or host.endswith("." + s) for s in _SHORTENERS)


def _same_site(shown: str, real: str) -> bool:
    return shown == real or real.endswith("." + shown) or shown.endswith("." + real)


class _EmailScan(HTMLParser):
    def __init__(self):
        super().__init__()
        self.tags, self.urls, self.anchors = set(), [], []
        self._href, self._text = None, []

    def handle_starttag(self, tag, attrs):
        self.tags.add(tag.lower())
        self.urls += [v for k, v in attrs if k.lower() in ("href", "src") and v]
        if tag.lower() == "a":
            self._href = dict((k.lower(), v) for k, v in attrs).get("href")
            self._text = []

    def handle_data(self, data):
        if self._href is not None:
            self._text.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "a" and self._href is not None:
            self.anchors.append((self._href, "".join(self._text)))
            self._href, self._text = None, []


def _assert_safe_email(subject: str, html: str) -> None:
    scan = _EmailScan()
    scan.feed(html)
    if scan.tags & {"form", "input", "textarea", "select"}:
        raise ValueError("No forms or input fields in email (G2)")
    body = f"{subject}\n{html}".lower()
    for p in _CRED_ASK:
        if p in body:
            raise ValueError(f"Email asks the recipient for credentials: {p!r} (G2)")
    for url in scan.urls:
        low = url.strip().lower()
        if low.startswith(("mailto:", "tel:", "cid:", "#")):
            continue
        if not low.startswith("https://"):
            raise ValueError(f"Email links/assets must be absolute https: {url!r} (G3)")
        host = urlparse(low).hostname or ""
        if not _host_ok(host) or urlparse(low).username is not None:
            raise ValueError(f"Shortened, numeric-host or credential-bearing URL: {url!r} (G3)")
    for href, text in scan.anchors:
        real = urlparse(href.strip().lower()).hostname or ""
        if not real:
            continue
        for m in _HOSTISH.finditer(text):
            if not _same_site(m.group(1).lower(), real):
                raise ValueError(f"Anchor text {m.group(1)!r} != real link host {real!r} (G3)")


async def send_email(*, to: str, subject: str, html: str) -> str | None:
    _assert_safe_email(subject, html)
    payload = {"to": [to], "subject": subject, "html": html, "from_name": EMAIL_FROM_NAME}
    async with httpx.AsyncClient(timeout=30) as client:
        resp = await client.post(
            f"{EMAIL_BASE_URL}/api/v1/email/send",
            headers={"X-Email-Key": EMAIL_KEY},
            json=payload,
        )
    resp.raise_for_status()
    return resp.json().get("id")


def _row(label: str, value: str) -> str:
    return f'<p style="margin:6px 0"><strong>{escape(label)} :</strong> {escape(value)}</p>'


def _table_html(title: str, rows_html: str) -> str:
    return (
        '<table role="presentation" width="100%"><tr><td style="padding:24px;'
        'font-family:Arial,sans-serif;color:#0A2A38">'
        f'<h2 style="margin:0 0 16px">{escape(title)}</h2>{rows_html}'
        f'<p style="font-size:12px;color:#888;margin-top:24px">Envoyé par le site {escape(EMAIL_FROM_NAME)}.</p>'
        "</td></tr></table>"
    )


async def notify_owner(subject: str, html: str) -> None:
    if not OWNER_EMAIL:
        logging.getLogger(__name__).warning("OWNER_EMAIL non configuré — notification email ignorée")
        return
    try:
        await send_email(to=OWNER_EMAIL, subject=subject, html=html)
    except Exception:
        logging.getLogger(__name__).exception("Envoi de la notification email échoué")


class BookingIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=30)
    date: str = Field(pattern=r"^\d{4}-\d{2}-\d{2}$")
    slot: str = Field(min_length=2, max_length=20)


class Booking(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    date: str
    slot: str
    created_at: str


app = FastAPI()
api_router = APIRouter(prefix="/api")


class ContactIn(BaseModel):
    name: str = Field(min_length=2, max_length=120)
    email: EmailStr
    phone: Optional[str] = Field(default=None, max_length=30)
    objective: str = Field(min_length=2, max_length=120)
    message: str = Field(min_length=5, max_length=3000)


class Lead(BaseModel):
    id: str
    name: str
    email: str
    phone: Optional[str] = None
    objective: str
    message: str
    created_at: str


class LoginIn(BaseModel):
    email: EmailStr
    password: str


def create_token(email: str) -> str:
    payload = {
        "sub": email,
        "role": "admin",
        "exp": datetime.now(timezone.utc) + timedelta(hours=12),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


async def get_admin(request: Request):
    auth = request.headers.get("Authorization", "")
    if not auth.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Non authentifié")
    try:
        payload = jwt.decode(auth[7:], os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=401, detail="Token invalide")
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Session expirée")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token invalide")


@api_router.get("/")
async def root():
    return {"message": "Popec Run API"}


@api_router.post("/contact", response_model=Lead)
async def create_contact(input: ContactIn):
    doc = {
        "id": str(uuid.uuid4()),
        **input.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.leads.insert_one(doc)
    doc.pop("_id", None)
    await notify_owner(
        "Nouvelle demande de contact — Popec Run",
        _table_html("Nouvelle demande de contact", "".join([
            _row("Nom", doc["name"]),
            _row("Email", doc["email"]),
            _row("Téléphone", doc["phone"] or "—"),
            _row("Objectif", doc["objective"]),
            _row("Message", doc["message"]),
        ])),
    )
    return Lead(**doc)


@api_router.post("/auth/login")
async def login(input: LoginIn):
    email = input.email.lower()
    if email != os.environ["ADMIN_EMAIL"].lower() or input.password != os.environ["ADMIN_PASSWORD"]:
        raise HTTPException(status_code=401, detail="Identifiants incorrects")
    return {"token": create_token(email), "email": email}


@api_router.get("/leads", response_model=List[Lead])
async def list_leads(admin=Depends(get_admin)):
    docs = await db.leads.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return [Lead(**d) for d in docs]


@api_router.delete("/leads/{lead_id}")
async def delete_lead(lead_id: str, admin=Depends(get_admin)):
    result = await db.leads.delete_one({"id": lead_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Demande introuvable")
    return {"deleted": True}


@api_router.post("/booking", response_model=Booking)
async def create_booking(input: BookingIn):
    doc = {
        "id": str(uuid.uuid4()),
        **input.model_dump(),
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.bookings.insert_one(doc)
    doc.pop("_id", None)
    await notify_owner(
        "Nouvelle réservation de bilan — Popec Run",
        _table_html("Nouvelle réservation de bilan", "".join([
            _row("Nom", doc["name"]),
            _row("Email", doc["email"]),
            _row("Téléphone", doc["phone"] or "—"),
            _row("Date souhaitée", doc["date"]),
            _row("Créneau", doc["slot"]),
        ])),
    )
    return Booking(**doc)


@api_router.get("/bookings", response_model=List[Booking])
async def list_bookings(admin=Depends(get_admin)):
    docs = await db.bookings.find({}, {"_id": 0}).sort("date", 1).to_list(500)
    return [Booking(**d) for d in docs]


@api_router.delete("/bookings/{booking_id}")
async def delete_booking(booking_id: str, admin=Depends(get_admin)):
    result = await db.bookings.delete_one({"id": booking_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Réservation introuvable")
    return {"deleted": True}


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
