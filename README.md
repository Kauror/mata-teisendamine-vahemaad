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

## Dockeris käivitamine

```bash
docker compose up -d --build
```

Rakendus on aadressil `http://localhost:3000`.

## Unraid (Docker Compose)

1. Loo Unraidis projektile kaust (näiteks `/mnt/user/appdata/pikkuste-harjutaja`).
2. Kopeeri sinna kõik projektifailid.
3. Käivita samas kaustas:
   ```bash
   docker compose up -d --build
   ```
4. Ava rakendus port 3000 kaudu.

## Andmebaasi asukoht ja varundus

- Andmebaasifail: `/data/maths-game.sqlite` (containeris).
- Compose mount: `./data:/data`, seega hostis on fail `data/maths-game.sqlite`.
- Varundus: peata container ja kopeeri `data/maths-game.sqlite` turvalisse kohta.

## Skriptid

- `npm run dev` – arendusserver
- `npm run build` – Next.js produktsiooni build (loob ka route/types failid)
- `npm run start` – produktsiooniserver
- `npm run lint` – ESLint
- `npm run typecheck` – täielik tüübikontroll (`next build && tsc --noEmit`)
- `npm run validate:science` – kontrollib loodusõpetuse ülesannete terviklikkust

## Struktuur

- `src/app` – lehed ja API marsruudid (App Router). API on kaustas `src/app/api`.
- `src/lib` – andmebaas, harjutuste loogika, tähtede/poe/võistluse loogika.
- `src/data` – staatilised ülesannete andmed (nt loodusõpetus).
