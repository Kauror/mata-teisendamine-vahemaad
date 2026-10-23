# Kaardimäng

Kiuri maailmakaardimäng Loodusõpetuse all: `/kiur/loodusopetus/kaardimang`.
Lapsevanema eelvaade on aadressil `/vanem/kaardimang`; vanema ala jaotis „Kaardimäng“ näitab ka andmete ulatust ja Kiuri edenemist.
Mäng ei ole õpiku osa (see on paralleelne õppetükkidega 10–22) ja vajab internetiühendust. Tähti annab ainult perevõistluse lõpp.

## Mis on sees

- **Kaheksa vaadet:** Eesti, Maailm, Euroopa, Aasia, Aafrika, Ameerika, Austraalia ja Okeaania ning Antarktika. Igas vaates saab valida „Uuri kaarti“ või „Mängi“.
- **25 õpperühma** pakettidest (`MAAILMAJAOD_JA_TASEMED.json`), mis on täiendatud nii, et iga riik kuulub vähemalt ühte rühma. Kaardivaateid on kokku 32, igal oma eelnevalt projitseeritud kaart.
- **194 sihtriiki:** kõik 193 ÜRO liiget ja Vatikan. Palestiina, Kosovo ja Taiwan on kaardil ning „Uuri“ selgitab nende staatust neutraalselt, aga hinnatud küsimustes neid ei ole.
- **Maailmas** on õpiku järgi kuus mandrit, kuus maailmajagu ja viis ookeani ning 16 merd ja lahte. Vaikne ookean on puudutatav kaardi mõlemal serval. Venemaa, Kasahstan ja Türgi on maailmajagude küsimustes jagatud Euroopa ja Aasia vahel.
- **Antarktikas** on Antarktis, lõunapoolus, Lõuna-Jäämeri, ümbritsevad ookeanid ja mandrite tipud. Riike ega pealinnu seal ei ole.
- **Küsimused:**
  - leia riik kaardilt,
  - mis riik on esile tõstetud (vastusenupud),
  - riigi pealinn (vastusenupud),
  - millise riigi pealinn see on (kaardilt),
  - leia manner, maailmajagu, ookean või lõunapoolus.
- **Raskusastmed:**
  - Avastaja: tuntumad riigid, kolm vastusevarianti, pealinnaküsimusi ei ole.
  - Rändur: kõik riigid ja pealinnaküsimused.
  - Geograaf: lisaks „millise riigi pealinn see on“ ja neli vastusevarianti.
- **Voor** on kuni 8 küsimust. Väikese rühma puhul on voor lühem: iga koht tuleb kuni kaks korda, eri viisil ja mitte järjest. Esimese vale vastuse järel tuleb vihje, teise järel näidatakse õige vastus. Vale vastust ei nimetata „halvaks“. Varem eksitud kohad tulevad sagedamini tagasi.

## Perevõistlus

Kaardimäng on kogu pere jaoks (Kauri otsused 19.10, backlog KM-02).
- **Mängijad:** Kiur ja Kirsi mängivad oma lehtedelt (`?player=kiur|kirsi`). Kairi ja Kaur mängivad vanema alast („Mängi Kairina / Kaurina“, vanema sessioon). Eelvaade jääb eraldi ja võistlusesse ei loe.
- **Tase:** igal mängijal on oma tase, mille määrab vanem. Algväärtused: Kirsi Avastaja, Kiur Rändur, vanemad Geograaf.
- **Võistlus:** vanem avab võistluse nime, kaartide ja päevade arvuga ning määrab tähed 1.–3. kohale (vaikimisi 20 / 10 / 5). Korraga käib üks võistlus. Võistluse saab lõpetada varem või pikendada ning see lõpeb ise pärast viimast päeva.
- **Kaardid võistluse ajal:** mängijatele on lahti ainult võistluse kaardid. Teised kohad on lukus („🔒 Võistluse ajal kinni“) ja server keeldub neil voorust. Kui võistlust ei käi, on kõik lahti; eelvaade ei ole kunagi lukus.
- **Võistluse lõpetamine** (vanema alas), kolm võimalust:
  - „Lõpeta kohe“ – esikolmik saab auhinnad;
  - „Tühista ilma auhindadeta“ – keegi ei saa tähti ega medalit, tabel jääb ajalukku märkega „tühistatud“;
  - „Kustuta täielikult“ – nagu võistlust poleks olnudki: punktid ja tabel kaovad, mängitud voorud jäävad harjutuseks ja õpitud kohad õpituks. Lõppenud (auhinnad jagatud) võistlust kustutada ei saa.
  Migratsioon 15 lisab võistlusele oleku „tühistatud“.
- **Punktid** tulevad päeva kolmest esimesest voorust võistluse kaartidel; iga alustatud voor kasutab ühe neist, nii et vooru uuesti alustamine ei aita. Õige vastus esimesel katsel annab uue koha eest 3 punkti, varem nähtud koha eest 2 ja õpitud koha eest 1. Pärast vihjet on 1 punkt, näidatud vastuse eest 0; miinuspunkte ei ole. Lisaks +1, kui vastad kiiremini kui Avastaja 20 s, Rändur 10 s või Geograaf 5 s. Aega mõõdab server alates sellest, kui küsimus ekraanile ilmus.
- **Õpitud koht** = õige esimesel katsel kahel eri päeval.
- **Järjestus:** punktid; viigi korral otsustab võistluse ajal õpitud uute kohtade arv. Täielik viik jagab kohta.
- **Lõpus** saavad esikolm medali. Lapsed saavad lisaks tähed (`point_ledger.source = 'kaardimang_prize'`, ainult üks kord, `kaardimang_awards`). Tähed lähevad päris koha järgi: vanem esikolmikus ei tõsta lapsi ülespoole.
- **Kus näha:** avalehel on tabel 1.–4. koht. Laste lehtedel on Kaardimängu kaart, kus näeb võistlust ja medaleid. „Mille eest tähti saab“ nimetab avatud võistluse auhinnad.
- **Andmebaas:** migratsioon 14 (`kaardimang_competition`). See ehitab `kaardimang_rounds` ja `kaardimang_target_stats` uuesti, et lubada Kairit ja Kauri; kõik vanad read kopeeritakse. Lisaks tabelid `kaardimang_player_settings`, `kaardimang_competitions`, `kaardimang_points` ja `kaardimang_awards`.
- **Reeglid** on failis `src/lib/kaardimang/competition.ts`, server failides `src/lib/server/kaardimang/competition.ts` ja `rounds.ts`.

## Saavutused

Igal mängijal on oma saavutuste riiul (backlog KM-03). See on Kaardimängu avalehel; laste lehe kaardil on teenitud saavutused väikeste ikoonidena.
- **Terve rühm selgeks:** Eesti maakonnad (15), maakonnakeskused (15), mandrid (6), ookeanid (5), mered (16), Euroopa riigid.
- **Astmetega:**
  - pealinnad või maakonnakeskused: 10 → 25 → 50 → 100;
  - läbitud voorud: 10 → 25 → 50 → 100;
  - mängitud päevi järjest: 3 → 7 → 14.
- **Võistlus:** „Esikolmikus“ (mõni medal), „Võitja“ (1. koht).
- **„Õpitud“** tähendab sama, mis võistluses: õige esimesel katsel kahel eri päeval.
- **Andmed:** saavutusi ei salvestata. Need arvutatakse iga lugemise ajal mängu enda tabelitest, nagu rakenduse teised saavutused (`lib/achievements.ts`). Kood: `src/lib/server/kaardimang/achievements.ts`.

## Mered

Maailma kaardi õpperühm „Mered“ (backlog KM-01): 16 merd ja lahte, küsimus „Leia Vahemeri.“, vastatakse kaardil.
- **Õpikust (5. peatükk, 16. teema):** Läänemeri, Põhjameri, Vahemeri, Soome laht, Bengali laht, Guinea laht, Pärsia laht.
- **Tuntumad lisaks** (Kauri valik 23.10): Must meri, Punane meri, Kariibi meri, Araabia meri, Lõuna-Hiina meri, Liivi laht, Botnia laht, Mehhiko laht, Hudsoni laht.
- **Kujud** on Natural Earth 10m merepolügoonidest (`ne_10m_geography_marine_polys`, pinned `sources.json`-is).
  - Vahemeri on põhibassein koos 11 nimelise osaga (Aadria, Joonia, Egeuse meri jne).
  - Must meri on koos Aasovi merega.
- **Laht on oma mere osa:** Soome, Liivi või Botnia lahe puudutamine on „Leia Läänemeri.“ küsimusele õige vastus. Vastupidi ei kehti: kui küsitakse Soome lahte, siis Läänemere puudutamine on vale.
- **Neutraalsed puudutused:** maa või avaookeani puudutamine ei ole vale vastus, mäng palub puudutada mere keskele.
- **Andmed:** eraldi skript `scripts/kaardimang/build-seas.ts` ja oma versioon (`SEAS_DATA_VERSION`). Fail `public/kaardimang/seas/` laotakse maailma kaardi peale; maailma kaart ise ei muutu.
  - Skript kontrollib, et projektsioon klapib olemasoleva `world.json`-iga, ja keeldub muidu kirjutamast.
  - Mängus on näha ja puudutatavad ainult küsimusega seotud alad.

## Eesti

Kõige lihtsam etapp, Kirsi jaoks: 15 maakonda ja nende keskused.
- **Avastaja:** tuntumad maakonnad (Harju-, Hiiu-, Ida-Viru-, Pärnu-, Saare- ja Tartumaa). Küsimused on „Leia kaardilt Harjumaa.“ ja „Mis maakond on kaardil esile tõstetud?“.
- **Rändur:** kõik maakonnad, lisaks „Mis on Harjumaa keskus?“ (nuppudel maakonnakeskused).
- **Geograaf:** lisaks „Millise maakonna keskus on Pärnu? Puuduta seda maakonda kaardil.“
- **Nimed:** küsimustes on igapäevane -maa nimi, „Uuri“ näitab ka ametlikku nime („Harju maakond“).
- **Kaart:** ruudukujuline (1000 × 1000), et ruudukujuline kaardikast ei lõikaks Hiiu- ja Saaremaad ega Ida-Virumaad ära. Peipsi, Pihkva järv, Võrtsjärv ja Narva veehoidla on lõigatud maast välja ja paistavad veena. Naabrid (Soome, Läti, Venemaa) on taustaks.
- **Andmed:** eraldi skript `scripts/kaardimang/build-estonia.ts` ja oma versioon (`ESTONIA_DATA_VERSION`). Fail asub kaustas `public/kaardimang/eesti/`, sest maailma ehitus tühjendab kausta `maps/`. Maailma kaardid ja kataloog jäid baidi täpsusega samaks.
  ```bash
  npx tsx scripts/kaardimang/build-estonia.ts <kaust, kus on admin-1, riikide ja järvede GeoJSON>
  ```
- **Allikad:** maakonnad on Natural Earth 5.1.2 admin-1 failist, järved Natural Earth 10m järvedest. Keskuste koordinaadid on Vikipeediast ja Wikidatast, viited on `sources.json`-is. Skript kontrollib, et iga keskus on oma maakonna sees.
- Natural Earth kasutab vanu ISO koode (EE-37 jne), aga maakonnad ise on samad.

## Kaart ei liigu iseenesest

Iga õpperühm on eraldi, ette lõigatud kaart, mis ei hüppa vooru ajal.
Uus küsimus muudab ainult värve, esiletõstu, silte ja teksti, sest sama `<svg>` jääb kogu vooru ajaks paigale.

Mängija võib kaarti ise suurendada (kuni 8×) ja lohistada, aga ainult kaardi kasti sees:
- telefonis kahe sõrmega näpistades, arvutis hiirerattaga;
- nuppudega + ja −, ning ⟲ näitab jälle kogu kaarti.

Suurendus jääb küsimuste vahel samaks ja uus voor algab kogu kaardiga.
Sõrm, mis liigub üle 8 px, lohistab kaarti ja see ei ole vastus. Kui kaart pole suurendatud, kerib sama liigutus lehte.
Piirid jäävad suurendades peenikeseks ning täpid ja sildid jäävad ekraanil sama suureks.
Kood on failides `MapView.tsx` ja `mapZoom.ts`.

Riikidel, mis on liiga väikesed või kitsad, et neid umbes 10 px täpsusega puudutada, on täpp ja nähtav puuteala. Kui puutealad kattuksid (viis Kariibi väikesaart Kariibide vaates), küsitakse neid seal ainult vastusenuppudega.
Merre või rannikust kaugemale puudutamine pole kunagi vale vastus: mäng palub puudutada ookeani keskele või maad.

## Andmed ja nende uuesti ehitamine

Kõik allikad on kirjas failis `scripts/kaardimang/sources.json` koos URL-i ja sha256-räsiga.
Inimese tehtud otsused on ühes kohas, failis `scripts/kaardimang/curation.ts`: EKI nimi → ISO kood, õpperühmad, tuntud riigid, pealinnade rollid ja märkused, liidetud alad, ülemeremaad, Euroopa–Aasia piir ja ookeanide puutealad.

```bash
npx tsx scripts/kaardimang/build-map-data.ts <kaust allalaaditud failidega>
```

Skript kirjutab kolm asja:
- `src/content/kaardimang/catalog.json`
- `public/kaardimang/maps/<versioon>/*.json` (kokku umbes 2,1 MB, iga vaade laaditakse alles siis, kui seda vaja on)
- `docs/kaardimang/DATA_AUDIT.{md,json}`

Kui mõni kohustuslik kontroll ebaõnnestub, katkestab skript töö. Andmete muutmisel tõsta `DATA_VERSION` (`src/content/kaardimang/regions.ts`). Pooleli voor jätkub oma külmutatud küsimuste ja vastustega.

Toorallikad (13 MB GeoJSON-i) repos ei ole.

## Otsused, mida tasub teada

- **Geomeetria:** Natural Earth 1:10m, Saksamaa vaatenurk, sest vaikimisi kaardil on Krimm Venemaa osa. Siin on Krimm Ukraina, Põhja-Küpros Küprose ja Somaliland Somaalia osa. Baikonur on liidetud Kasahstaniga ja Guantánamo Kuubaga.
- **Nimed ja pealinnad** tulevad EKI loendist (seis 21.08.2026), näiteks Washington, Tokyo, Ciudad de la Paz ja Kiiev. Pealinna koordinaadid on Natural Earthist. Kolm pealinna, mida seal pole (Ciudad de la Paz, Ngerulmud ja Yaren), on võetud Vikipeediast koos viitega.
- **Pealinnaküsimuses** kasutatakse ainult ühest pealinna. Välja jäävad Lõuna-Aafrika Vabariik, Boliivia, Sri Lanka, Svaasimaa, Iisrael, Nauru, Kiribati, Marshalli Saared, Tuvalu ja Vatikan. „Uuri“ näitab nende puhul kõiki pealinnu koos rollidega. Täielik loend on failis `DATA_AUDIT.md`.
- **Küsimuste sõnastus** on vormis „Mis on riigi Jaapan pealinn?“, et 194 riiginime ei peaks omastavasse käändesse panema (vigade oht).
- **Andmebaas:** migratsioon 13 lisab ainult tabelid `kaardimang_rounds` ja `kaardimang_target_stats`. Mäng ei kirjuta tähti, katseid, ajalugu ega edetabelit. Eelvaate-õppija read lähtestatakse eraldi.

## Teadlikult tegemata

- Pealinnapunkti puudutamine kaardil ja naabrite küsimused. Kaur valis esimeseks versiooniks põhikomplekti.
- Tähed vastuste eest: neid ei anta. Tähti annab ainult perevõistluse lõpp (vt „Perevõistlus“).
- Windowsi brauser lipuemojisid ei kuva (seal paistavad tähed, nt „GH“). Telefonides on lipud olemas.
