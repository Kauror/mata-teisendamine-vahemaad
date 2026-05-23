# Pikkuste harjutaja

Mobiilisõbralik eestikeelne matemaatika harjutusrakendus pikkusühikute jaoks (mm, cm, dm, m, km).

## Tehnoloogiad
- Next.js (App Router) + TypeScript
- SQLite (`/data/maths-game.sqlite`)
- Docker + Docker Compose

## Kohalik arendus (VS Code)
1. Ava projekt VS Code'is.
2. Käivita:
   ```bash
   npm install
   npm run dev
   ```
3. Ava brauseris `http://localhost:3000`.

## Dockeris käivitamine
```bash
docker compose up -d --build
```
Rakendus on aadressil `http://localhost:3000`.

## Unraid (Docker Compose)
1. Loo Unraidis kaust projektile (näiteks `/mnt/user/appdata/pikkuste-harjutaja`).
2. Kopeeri sinna kõik projektifailid.
3. Käivita samas kaustas:
   ```bash
   docker compose up -d --build
   ```
4. Ava rakendus port 3000 kaudu.

## Andmebaasi asukoht ja varundus
- Andmebaasifail: `/data/maths-game.sqlite` (containeris).
- Compose mount: `./data:/data`, seega hostis fail on `data/maths-game.sqlite`.
- Varundus: peata container ja kopeeri `data/maths-game.sqlite` turvalisse kohta.

## API marsruudid
- `GET /api/history`
- `GET /api/history/[id]`
- `POST /api/history`
- `DELETE /api/history`
