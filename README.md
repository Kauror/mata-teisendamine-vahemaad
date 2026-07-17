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
| `PARENT_PASSWORD_HASH` | Lapsevanema parooli scrypt-räsi; pole nõutud ainult siis, kui andmebaasis on kehtiv migreeritud räsi. |
| `APP_SESSION_SECRET_CURRENT` | Seansiküpsiste allkirjastamise saladus (≥ 32 märki). |
| `APP_ORIGIN` | Täpne avalik päritolu, **peab olema HTTPS**, ilma lõpukaldkriipsu/teeta (nt `https://harjutaja.example.com`). |
| `OFFLINE_PROTOCOL_V2_ENABLED` | Peab olema `1`; puuduv, `0` või vigane väärtus peatab käivituse ning protokolli v1 kirjutusi ei aktsepteerita. |

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

### Migratsiooni turvakontroll enne juurutust (RTM3-C02 / RTM4-C03)

Migratsioon 3 märkis kõik olemasolevad protokoll-v2 katsed ilma tasukomponentideta
`withheld`-iks ja migratsioon 4 pööras need tagasi `eligible`-iks. See edasi-tagasi
teisendus — ja kogu held-attempt väljalase — on ohutu **ainult siis**, kui andmebaasis
pole varasematest offline-buildidest pärit ehtsaid v2 katseid. Kontrolli seda enne
juurutust:

```bash
# Osuta elavale failile: skript teeb ise WAL-turvalise koopia (SQLite backup API)
# ja rakendab migratsioonid ühekordsele koopiale, nii et puuduv skeem ei anna viga.
npm run audit:v2 -- data/maths-game.sqlite
```

Skript:

- tuvastab, kas allikas juba sisaldab offline-skeemi (ehtne offline-eelne andmebaas
  loetakse õigesti, mitte ei anna „puuduva veeru" viga);
- **kukub läbi** (väljumiskood 1), kui leidub **ükskõik milline** varasem protokoll-v2
  katse — sh dokumenteeritud „`eligible` + komponendid" seisund, mida migratsioon 4 ei
  paranda — ja trükib iga katse valideerimise (grant, kataloog, poliitika, komponendid);
- auditeerib ka `daily_leaderboard` ja `monthly_competition_awards` ridu, mis vajaksid
  ümberarvutust.

Kui audit leiab v2 katseid, on tootmisjuurutus blokeeritud. Lepita ajalugu
käsitsi (vt `npm run leaderboard:rebuild` allpool) ja korda auditit uue
andmebaasikoopiaga, kuni see teatab nullist v2 katsest. Külmalt tehtud koopia
(container peatatud) saab kontrollida lipuga `--no-copy`.

### Ajaloolise edetabeli taastamine (RTM4-H03)

Kui varasem build jõudis juba kirjutada `daily_leaderboard` ridu, mis lugesid kinni
hoitud katset, ei paranda koodi uuendus neid automaatselt (parandus rakendub ainult
päeva ümberarvutusel). Ehita ridade ajalugu ühekordselt uuesti:

```bash
MATHS_GAME_DB_FILE=/data/maths-game.sqlite npm run leaderboard:rebuild
```

See arvutab iga päeva `attempts` tabelist parandatud filtriga uuesti ja lepitab kõik
juba välja antud kuud (idempotentne).

## Skriptid

- `npm run dev` – arendusserver
- `npm run build` – produktsiooni build (Next.js + teenindustöötaja)
- `npm run start` – verifitseeritud produktsiooniserver (autentimise ja
  andmebaasi kontroll, seejärel `next start`)
- `npm run start:next` – Next.js server ilma verifitseerimiskihita (ainult arendus)
- `npm run auth:hash -- <pin>` – genereerib `APP_ACCESS_PIN_HASH` väärtuse
- `npm run db:startup` – ainult andmebaasi varundus + verifitseerimine
- `npm run audit:v2 -- <db-fail>` – WAL-turvaline protokoll-v2 populatsiooni audit enne juurutust (RTM3-C02 / RTM4-C03)
- `npm run reward:v2 -- --learner=kiur|kirsi` – näitab tasu-v2 projektsiooni sisendkatseid muutmata andmebaasi
- `REWARD_V2_APPLY_CONFIRM=APPLY_COMPONENT_DELTAS npm run reward:v2 -- --learner=kiur|kirsi --apply` – rakendab projektsiooni ja aktiveerib v2 oleku ühe tehinguna; kasuta ainult pärast koopia peal läbiproovimist, väljundi kontrolli ja verifitseeritud varukoopiat
- `npm run leaderboard:rebuild` – ehitab `daily_leaderboard` ridade ajaloo uuesti + lepitab kuud (RTM4-H03)
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
  (`e2e-prod/`). Mida see **automaatselt** kontrollib: et genereeritud `/sw.js`
  eksisteerib ja sisaldab app-shell'i eelvahemälu manifesti (`SHELL_ROUTES`,
  `PRECACHE`, `BUILD_ID`, `installedAt`), et produktsiooniserver aktsepteerib
  allkirjastatud pere-seansi (ei suuna `/access`-ile) ja et rakendus registreerib
  teenindustöötaja. See **ei** kontrolli veel automaatselt tegelikku
  võrguühenduseta töövoogu (vt allpool).
- `.github/workflows/ci.yml` käivitab lint + tüübikontroll + ühiktestid, mõlemad
  Playwright-komplektid ning **ehitab ja käivitab `docker compose` kaudu
  produktsiooni-image'i** (release-gate) koos tervisekontrolliga.

### Käsitsi võrguühenduseta väljalaskevärav (RTM4-H02)

Toode on offline-first, kuid järgnev **ei ole veel automatiseeritud** ja tuleb enne
väljalaset käsitsi läbi teha (`next start` produktsiooni-buildil ja reaalsel iPhone'il
Add-to-Home-Screen kaudu):

- teenindustöötaja aktiveerub ja kogu app-shell (`/`, `/kiur`, `/kirsi`, `/test`,
  `/_next/*`) võetakse „kõik-või-mitte-midagi" põhimõttel eelvahemällu;
- `OfflineReadiness` jõuab `ready` seisundisse;
- brauseri võrk lülitatakse välja (lennukirežiim);
- `/`, `/kiur` ja `/kirsi` taaslaadimine töötab võrguühenduseta;
- harjutuse alustamine ja lõpetamine võrguühenduseta; aktiivse seansi täpne taastamine;
- taasühendumine ja üleslaadimine; vastuse kaotuse idempotentsus (sama katse ei dubleeru);
- kaks brauseri konteksti (Kiur + Kirsi) samal seadmel;
- ööpäeva vahetus ja hilinenud kuupiiri sünkroonimine;
- iga lubatud runner (matemaatika, inglise sprint, lugemine, loodusõpetus, kordamine).

**Väljalaskeblokeerija:** offline-tugi ei ole väljalaskevalmis enne, kui see käsitsi
värav on reaalsel seadmel läbitud.

> Physical iPhone Add-to-Home-Screen ja pikaajaline mitmeseadme-sünk tuleb enne
> lõplikku väljalaset siiski käsitsi üle kontrollida — automaattestid katavad
> teenindustöötaja paigalduse ja võrguühenduseta taaslaadimise, mitte iOS
> koduekraani käitumist.

## Struktuur

- `src/app` – lehed ja API marsruudid (App Router). API on kaustas `src/app/api`.
- `src/lib` – andmebaas, harjutuste loogika, tähtede/poe/võistluse loogika.
- `src/data` – staatilised ülesannete andmed (nt loodusõpetus).
