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
- Retouches (2026-09-02) : palette verte remplacée par bleu (forest #0C3B4C, accent aqua #37E5FD), BPJEPS → DEUST Métiers de la Forme partout, Hydroxyde → Hyrox, Cross Training → Cross, "Conseils & préparation trail", sous-titre hero simplifié, fix zone grise photo hero (zoom permanent au lieu du décalage vertical)
- Évolutions (2026-09-02, 2e vague) : hero sur fond photo paysage avec voile bleu foncé (titre "S'entraîner sérieusement, sans se prendre au sérieux", boutons égaux), icônes Instagram cliquables (instagram.com/popec_run) dans nav/footer/admin, marquee "Fonctionnel", bio À propos à la 1re personne, badge partenaire pleine largeur centré, nouvelles photos (coucher de soleil manifeste ch1, ski-erg manifeste ch2, Spartan carte trail, photo groupe "Le coach" carte salle avec cadrage masquant le texte)
- Réservation en ligne : section #reservation (date + créneaux), POST/GET/DELETE /api/booking(s), onglets Demandes/Réservations dans /admin
- Emails : intégration Resend gérée Emergent prête (EMERGENT_EMAIL_KEY, EMAIL_FROM_NAME="Popec Run", gate anti-abus), notification au coach sur contact + réservation — EN ATTENTE de la vraie adresse email du coach (OWNER_EMAIL vide dans backend/.env)
- WhatsApp (2026-09-02, 3e vague) : contact privilégié WhatsApp 07 78 05 06 44 (wa.me/33778050644) — bulle flottante bas-droite avec message pré-rempli "Hey Popec ! Je voudrais quelques informations sur les coachings :)", le formulaire de contact ouvre WhatsApp avec le message composé (sauvegarde en base conservée), ligne contact WhatsApp dans la section contact. Photos manifesto : ch2 traction corde, ch3 ski-erg ; carte cours collectifs : wall ball HYROX

## Backlog
- En attente réponse client : intégration Claude (assistant visiteurs / assistant admin / générateur de mini-plan — choix du modèle et de la clé en suspens)

## Backlog
- P1 : notification email au coach à chaque demande (Resend, intégration gérée Emergent)
- P1 : vraies photos du coach + liens Instagram/Strava réels
- P2 : section tarifs/formules (non demandée pour l'instant), témoignages, FAQ, mentions légales
- P2 : prise de rendez-vous en ligne (calendrier)
