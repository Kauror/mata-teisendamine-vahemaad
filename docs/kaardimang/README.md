# Kaardimäng

Kiuri maailmakaardimäng Loodusõpetuse all: `/kiur/loodusopetus/kaardimang`.
Lapsevanema eelvaade on aadressil `/vanem/kaardimang`; vanema ala jaotis „Kaardimäng“ näitab ka andmete ulatust ja Kiuri edenemist.
Mäng ei ole õpiku osa (see on paralleelne õppetükkidega 10–22), ei anna tähti ja vajab internetiühendust.

## Mis on sees

- **Seitse vaadet:** Maailm, Euroopa, Aasia, Aafrika, Ameerika, Austraalia ja Okeaania ning Antarktika. Igas vaates saab valida „Uuri kaarti“ või „Mängi“.
- **25 õpperühma** pakettidest (`MAAILMAJAOD_JA_TASEMED.json`), mis on täiendatud nii, et iga riik kuulub vähemalt ühte rühma. Kaardivaateid on kokku 32, igal oma eelnevalt projitseeritud kaart.
- **194 sihtriiki:** kõik 193 ÜRO liiget ja Vatikan. Palestiina, Kosovo ja Taiwan on kaardil ning „Uuri“ selgitab nende staatust neutraalselt, aga hinnatud küsimustes neid ei ole.
- **Maailmas** on õpiku järgi kuus mandrit, kuus maailmajagu ja viis ookeani. Vaikne ookean on puudutatav kaardi mõlemal serval. Venemaa, Kasahstan ja Türgi on maailmajagude küsimustes jagatud Euroopa ja Aasia vahel.
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
- Tähed: neid ei anta, kuni reward-v2 kasutus on eraldi kokku lepitud.
- Windowsi brauser lipuemojisid ei kuva (seal paistavad tähed, nt „GH“). Telefonides on lipud olemas.
