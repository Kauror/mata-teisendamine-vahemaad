# Harjutaja

Mobiilisõbralik eestikeelne õpirakendus kahele lapsele (Kiur ja Kirsi). Lapsed
harjutavad matemaatikat, inglise keelt, lugemist ja loodusõpetust, teenivad selle
eest tähti ⭐ ning saavad neid vanema seatud poes kulutada. Rahulik, suurte
kaartide ja pastelsete värvidega lapsesõbralik kujundus.

> Rakendus kuvab pealkirjana „Harjutamine".

## Lapsed ja ained

Avalehel valitakse roll (Kiur / Kirsi / Vanem). Iga lapse töölaud näitab tema
harjutusi ja päevategevusi.

**Kiur**
- Matemaatika: mõõtühikud (pikkused), kahekohalise arvu jagamine, arvud 10000
  piires, ring ja ringjoon, korrutamine, mustrid, tekstülesanded
- Inglise keel: sõnasprint
- Lugemine: loe ja vasta
- Loodusõpetus: segaharjutus (140 ülesannet – pildid, lugemine, sobitamine,
  järjestamine ja andmed)

**Kirsi**
- Matemaatika: loendamine, arvutamine 10 ja 20 piires, suurem/väiksem kuni 100,
  segaülesanded
- Lugemine: pilt ja sõna, esimene häälik

**Mõlemad**
- Kordamine: kogutud vigade põhjal koostatud kordusharjutus

## Tähed, pood ja võistlus

- **Õpipunktid (tähed):** harjutuste eest teenitakse tähti (väärtus väheneb päeva
  jooksul, on päevane ülempiir, lisaks õpiseeria-boonused ja auhinnareeglid).
- **Pood:** vanem loob esemeid hinnaga; laps ostab neid tähtede eest. Lapsed
  saavad tähti ka teineteisele kinkida.
- **Päevategevused:** vanema lisatud ülesanded (vajadusel kinnitamisega) ja ühine
  päevaboonus.
- **Kuu karikavõistlus:** iga päev saab rohkem harjutanud laps karika; kuu lõpus
  saab enim karikaid kogunud laps tähtede auhinna (eeldusel, et harjutati üle
  poole kuu päevadest).
- **Eilse kokkuvõte:** lapse töölaual avaneb kord päevas hüpik, mis näitab eile
  teenitud tähti ja nende allikaid.

## Vanema ala (`/vanem`)

Päevategevuste haldus ja kinnitamine, pood, tähtede ja karikate käsitsi muutmine,
harjutuste nähtavuse seaded, auhinnareeglid, teadetetahvel, kuu auhinna määramine
ja parooli vahetus.

## Tehnoloogiad

- Next.js 15 (App Router) + React 19 + TypeScript
- better-sqlite3 (SQLite, `/data/maths-game.sqlite`)
- Docker + Docker Compose
- Koduekraani ikoon / PWA manifest (`src/app/manifest.ts`, `src/app/icon.png`)

## Kohalik arendus (VS Code)

1. Ava projekt VS Code'is.
2. Käivita:
   ```bash
   npm install
   npm run dev
   ```
3. Ava brauseris `http://localhost:3000`.

## Produktsiooni seaded (kohustuslik enne käivitamist)

Produktsioonis keeldub rakendus käivitumast, kui turvakonfiguratsioon puudub.
Käivitusskript (`npm start` → `scripts/verified-start.ts`) kontrollib
autentimist, varundab ja verifitseerib andmebaasi ning alles siis käivitab
Next.js-i. Seadista keskkonnamuutujad enne `docker compose` käivitamist:

1. Kopeeri näidisfail ja täida väärtused:
   ```bash
   cp .env.example .env
   ```
2. Genereeri PIN-koodi räsi (ära kunagi salvesta PIN-i avatekstina):
   ```bash
   npm run auth:hash -- 1234   # väljund läheb APP_ACCESS_PIN_HASH väärtuseks
   ```
   > **NB!** Räsi sisaldab `$`-märke (`scrypt$v=1$N=...`). Docker Compose asendab
   > jutumärgita ja topeltjutumärkides väärtustes muutujaid, seega **pane räsi
   > alati ÜKSIKutesse jutumärkidesse**, mille Compose võtab sõna-sõnalt:
   > ```
   > APP_ACCESS_PIN_HASH='scrypt$v=1$N=16384,r=8,p=1$...$...'
   > ```
   > Kontrolli enne käivitamist `docker compose config` väljundist, et räsi jäi muutmata.
3. Genereeri seansisaladus (vähemalt 32 märki):
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
   ```

Kohustuslikud muutujad `.env` failis:

| Muutuja | Kirjeldus |
| --- | --- |
| `APP_ACCESS_PIN_HASH` | Pere PIN-koodi scrypt-räsi (`npm run auth:hash`). |
| `APP_SESSION_SECRET_CURRENT` | Seansiküpsiste allkirjastamise saladus (≥ 32 märki). |
| `APP_ORIGIN` | Täpne avalik päritolu, **peab olema HTTPS**, ilma lõpukaldkriipsu/teeta (nt `https://harjutaja.example.com`). |
| `OFFLINE_PROTOCOL_V2_ENABLED` | `1` lülitab sisse offline-protokolli v2 (ping reklaamib ja server aktsepteerib v2). Väärtus `0`/puudu jätab kasutusele v1. |

Valikulised: `APP_SESSION_SECRET_PREVIOUS` (saladuse rotatsioon),
`MATHS_GAME_DB_FILE`, `MATHS_GAME_BACKUP_DIR`. Kõik on kirjeldatud failis
`.env.example`.

> HTTPS on kohustuslik. Rakendus kuulab `127.0.0.1:3000` ja eeldab, et ees on
> TLS-i lõpetav pöördproksü (nt Nginx/Caddy/Traefik), mis serveerib
> `APP_ORIGIN`-is nimetatud aadressi. Rakendust ei tohi avada otse üle HTTP.

## Dockeris käivitamine

Kui `.env` on täidetud:

```bash
docker compose up -d --build
```

Rakendus on kättesaadav pöördproksü kaudu `APP_ORIGIN`-is (konteiner ise kuulab
`127.0.0.1:3000`). Konteineri tervisekontroll (`healthcheck`) pärib
`/api/offline/ping`, seega „healthy" tähendab ka edukalt verifitseeritud
andmebaasi.

## Unraid (Docker Compose)

1. Loo Unraidis projektile kaust (näiteks `/mnt/user/appdata/pikkuste-harjutaja`).
2. Kopeeri sinna kõik projektifailid ja loo `.env` (vt ülalt).
3. Käivita samas kaustas:
   ```bash
   docker compose up -d --build
   ```
4. Suuna pöördproksü HTTPS-liiklus konteineri porti 3000.

## Andmebaasi asukoht ja varundus

- Andmebaasifail: `/data/maths-game.sqlite` (containeris).
- Compose mount: `./data:/data`, seega hostis on fail `data/maths-game.sqlite`.
- Automaatne varundus: iga käivituse ajal teeb `verified-start` WAL-turvalise
  koopia (SQLite backup API) kausta `MATHS_GAME_BACKUP_DIR` (vaikimisi
  `data/backups/`) ja verifitseerib andmebaasi terviklikkuse.
- Käsitsi varundus: peata container ja kopeeri `data/maths-game.sqlite`.

## Skriptid

- `npm run dev` – arendusserver
- `npm run build` – produktsiooni build (Next.js + teenindustöötaja)
- `npm run start` – verifitseeritud produktsiooniserver (autentimise ja
  andmebaasi kontroll, seejärel `next start`)
- `npm run start:next` – Next.js server ilma verifitseerimiskihita (ainult arendus)
- `npm run auth:hash -- <pin>` – genereerib `APP_ACCESS_PIN_HASH` väärtuse
- `npm run db:startup` – ainult andmebaasi varundus + verifitseerimine
- `npm run lint` – ESLint
- `npm run typecheck` – tüübikontroll (`tsc --noEmit`)
- `npm test` – ühiktestid (Vitest)
- `npm run test:e2e` – brauseripõhised Playwright-testid
- `npm run validate:science` – kontrollib loodusõpetuse ülesannete terviklikkust

## Testimine ja CI

- `npm test` – ühiktestid (Vitest), sh. tasu-, migratsiooni- ja sünkroonitestid.
- `npm run test:e2e` – arendusrežiimi brauseri-smoke (`e2e/`, Chromium + WebKit):
  käivitus, marsruutimine, PIN-värav. Enne esimest korda: `npm run test:e2e:install`.
- `npm run test:e2e:prod` – **produktsiooni-buildi** teenindustöötaja testid
  (`e2e-prod/`): ehitab rakenduse, käivitab `next start` ja kontrollib reaalses
  Chromiumis teenindustöötaja registreerimise, paigalduse (kogu app-shell'i
  eelvahemällu võtmine) ja võrguühenduseta taaslaadimise.
- `.github/workflows/ci.yml` käivitab lint + tüübikontroll + ühiktestid, mõlemad
  Playwright-komplektid ning **ehitab ja käivitab `docker compose` kaudu
  produktsiooni-image'i** (release-gate) koos tervisekontrolliga.

> Physical iPhone Add-to-Home-Screen ja pikaajaline mitmeseadme-sünk tuleb enne
> lõplikku väljalaset siiski käsitsi üle kontrollida — automaattestid katavad
> teenindustöötaja paigalduse ja võrguühenduseta taaslaadimise, mitte iOS
> koduekraani käitumist.

## Struktuur

- `src/app` – lehed ja API marsruudid (App Router). API on kaustas `src/app/api`.
- `src/lib` – andmebaas, harjutuste loogika, tähtede/poe/võistluse loogika.
- `src/data` – staatilised ülesannete andmed (nt loodusõpetus).
