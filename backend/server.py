from dotenv import load_dotenv

load_dotenv()

from fastapi import FastAPI, APIRouter, HTTPException, Depends, Request
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import uuid
import jwt
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional
from datetime import datetime, timezone, timedelta

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

JWT_ALGORITHM = "HS256"

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
