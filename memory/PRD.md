# PRD — Popec Run (Coach Sportif & Trail, Béziers)

## Problem statement (original)
"Application pour un coach sportif, qui se lance à son compte comme entrepreneur. Formulaire de prise de contacts, design moderne. Le coach s'appelle Popec run"

## User choices
- Style : nature/outdoor, tons verts et terreux, esprit trail et plein air
- Formulaire : stockage en base MongoDB + page admin pour consulter les demandes
- Prestations : mix running/trail + fitness (salle Fitness Park Béziers, Burning, Cross Training, Hydroxyde, remise en forme, coaching indiv/groupe). Coach diplômé BPJEPS
- Pas de section tarifs

## Architecture
- Frontend : React + Tailwind + framer-motion + lenis + react-fast-marquee + sonner (`/app/frontend`)
- Backend : FastAPI (`/app/backend/server.py`) — routes `/api/*`
- DB : MongoDB via MONGO_URL/DB_NAME, collection `leads`
- Auth admin : JWT (Bearer), identifiants dans backend/.env (ADMIN_EMAIL / ADMIN_PASSWORD / JWT_SECRET)

## Implémenté (2026-09-02)
- Landing page FR : hero cinétique (reveal ligne par ligne + parallax), marquee éditorial, manifeste 3 chapitres numérotés, bento grid 6 prestations avec filtres Tout/Outdoor/Salle, section À propos (BPJEPS + partenaire Fitness Park Béziers), formulaire de contact (nom, email, téléphone, objectif, message) avec toasts, footer éditorial
- API : POST /api/contact, POST /api/auth/login, GET /api/leads (auth), DELETE /api/leads/{id} (auth)
- Page admin /admin : login JWT, liste des demandes, suppression
- Identifiants admin : admin@popecrun.fr / PopecRun2026! (voir /app/memory/test_credentials.md)
- Photos réelles du coach intégrées (2026-09-02) : /app/frontend/public/images/ — hero (sled push), À propos (portrait souriant), manifeste ch.02 (wall ball HYROX), carte cours collectifs (traction sled)

## Backlog
- P1 : notification email au coach à chaque demande (Resend, intégration gérée Emergent)
- P1 : vraies photos du coach + liens Instagram/Strava réels
- P2 : section tarifs/formules (non demandée pour l'instant), témoignages, FAQ, mentions légales
- P2 : prise de rendez-vous en ligne (calendrier)
