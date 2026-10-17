# Kaardimäng – andmeaudit

Andmeversioon **2026-10-17.1**, ehitatud 2026-10-17. EKI loendi seis: 21. august 2026.

**Kõik kohustuslikud kontrollid läbitud.**

## Allikad

| Andmed | Allikas | sha256 |
| --- | --- | --- |
| Natural Earth 5.1.2, Admin 0 countries 1:10m, Germany point of view (Crimea in Ukraine; Northern Cyprus in Cyprus; Somaliland in Somalia) | https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_admin_0_countries_deu.geojson | `fc4d56c6bc256f77…` |
| Natural Earth 5.1.2, populated places 1:10m (capital coordinates only; names come from EKI) | https://raw.githubusercontent.com/nvkelso/natural-earth-vector/v5.1.2/geojson/ne_10m_populated_places_simple.geojson | `fd3fa867a320cbd5…` |
| Eesti Keele Instituut, Maailma maade nimed, seis 21.08.2026 (country and capital names, independence marking) | https://teatmik.eki.ee/teatmik/maailma-maade-nimed/ | `4f0956ced5ccb9a7…` |
| EKI corrections to the list (reviewed by hand; already reflected in the main list) | https://teatmik.eki.ee/teatmik/parandused-maailma-maade-nimestikus/ | `830138e5ace8fc82…` |
| UN M49 standard country or area codes (regions, sub-regions, ISO codes) | https://unstats.un.org/unsd/methodology/m49/overview/ | `b9048114f6e7f2ab…` |
| United Nations member states (193) | https://www.un.org/en/about-us/member-states | `930af37ccad5838d…` |

## Kokkuvõte

- Mängu sihtriike: **194** (ÜRO liikmed 193 + Vatikan).
- Ainult avastamiseks (ei ole hinnatud küsimuste sihtmärk): Palestiina, Kosovo, Taiwan.
- Pealinnaküsimustes kasutatavaid pealinnu: 184.
- Pealinnapunktid: 204 riigi sees, 0 ranniku lähedal (≤30 km lihtsustatud rannajoonest), 0 väljas, 0 ilma asukohata.

## Maailmajaod ja õpperühmad

| Maailmajagu | Riike | Pealinnaküsimusega | Õpperühmad (riike / kaardil puudutatav) |
| --- | ---: | ---: | --- |
| Euroopa | 44 | 43 | Baltikum 3/3; Põhjamaad 5/5; Lääne-Euroopa 11/10; Kesk-Euroopa 9/9; Lõuna-Euroopa 10/10; Ida-Euroopa 7/7; Balkani piirkond 8/8 |
| Aasia | 47 | 45 | Ida-Aasia 5/5; Kagu-Aasia 11/10; Lõuna-Aasia 9/9; Kesk-Aasia 5/5; Lääne-Aasia 18/17 |
| Aafrika | 54 | 52 | Põhja-Aafrika 6/6; Lääne-Aafrika 16/15; Kesk-Aafrika 9/9; Ida-Aafrika 18/18; Lõuna-Aafrika 5/5 |
| Ameerika | 35 | 34 | USA, Kanada ja Mehhiko 3/3; Kesk-Ameerika 8/8; Kariibid 13/9; Lõuna-Ameerika 12/12 |
| Austraalia ja Okeaania | 14 | 10 | Austraalia ja Uus-Meremaa 2/2; Melaneesia 4/4; Mikroneesia 5/5; Polüneesia 3/3 |
| Antarktika | 0 | 0 | – |

Riigid, mida mõnes õpperühma vaates puudutada ei saa (liiga väikesed), küsitakse seal vastusenuppudega („Mis riik on esile tõstetud?“).

## Pealinnade erandid

| Riik | Pealinn(ad) | Pealinnaküsimuses | Märkus |
| --- | --- | --- | --- |
| Holland | Amsterdam (pealinn) | jah | Amsterdam on põhiseaduse järgi pealinn. Valitsus ja parlament asuvad Haagis. |
| Holland | Haag (valitsuse asukoht) | ei |  |
| Vatikan | – | ei | Vatikan on linnriik: kogu riik on üks väike linn Rooma sees. Eraldi pealinna ei ole. |
| Indoneesia | Jakarta (pealinn) | jah | Indoneesia ehitab uut pealinna Nusantarat, kuid EKI 21.08.2026 loendi järgi on pealinn Jakarta. |
| Iisrael | Jeruusalemm (kuulutatud pealinn) | ei | Iisrael on kuulutanud oma pealinnaks Jeruusalemma, kuid enamik riike ei ole seda tunnustanud. |
| Iisrael | Tel Aviv (valitsusasutuste asukoht) | ei | Enamiku riikide saatkonnad asuvad Tel Avivis. |
| Malaisia | Kuala Lumpur (pealinn) | jah | Paljud valitsusasutused asuvad Putrajayas. |
| Malaisia | Putrajaya (valitsuse asukoht) | ei |  |
| Sri Lanka | Sri Jayawardenepura Kotte (seadusandlik pealinn) | ei | Parlament asub Sri Jayawardenepura Kottes. |
| Sri Lanka | Colombo (valitsusasutuste asukoht) | ei | Colombo on suurim linn ja paljude valitsusasutuste asukoht. |
| Benin | Porto-Novo (pealinn) | jah | Valitsus asub suures osas Cotonous. |
| Burundi | Gitega (pealinn) | jah | Gitega on pealinn alates 2019. aastast; varem oli see Bujumbura. |
| Elevandiluurannik | Yamoussoukro (pealinn) | jah | Suurim linn ja paljude asutuste asukoht on Abidjan. |
| Ekvatoriaal-Guinea | Ciudad de la Paz (pealinn) | jah | Ciudad de la Paz on pealinn alates 2. jaanuarist 2026. Varem oli pealinn Malabo. |
| Svaasimaa | Mbabane (halduspealinn) | ei | Mbabane on halduspealinn. |
| Svaasimaa | Lobamba (seadusandlik pealinn) | ei | Lobambas asuvad parlament ja kuninglik residents. |
| Lõuna-Aafrika Vabariik | Pretoria (halduspealinn) | ei | Pretorias asub valitsus. |
| Lõuna-Aafrika Vabariik | Kaplinn (seadusandlik pealinn) | ei | Kaplinnas asub parlament. |
| Lõuna-Aafrika Vabariik | Bloemfontein (kohtuvõimu pealinn) | ei | Bloemfonteinis asub ülemkohus. |
| Tansaania | Dodoma (pealinn) | jah | Suurim linn on Dar es Salaam. |
| Boliivia | Sucre (pealinn) | ei | Sucre on põhiseaduse järgi pealinn. |
| Boliivia | La Paz (valitsuse asukoht) | ei | La Pazis asuvad valitsus ja parlament. |
| Kiribati | Bairiki/Tarawa (pealinn) | ei | Valitsusasutused asuvad Tarawa atollil, peamiselt Bairikil. |
| Marshalli Saared | Uliga/Majuro (pealinn) | ei | Pealinn asub Majuro atollil. |
| Naoero | Yaren (valitsusasutuste asukoht) | ei | Naurul ei ole ametlikku pealinna. Valitsusasutused asuvad Yarenis. |
| Tuvalu | Vaiaku/Funafuti (pealinn) | ei | Valitsusasutused asuvad Funafuti atollil Vaiaku külas. |
| Palestiina | Rām Allāh (valitsuse asukoht) | ei |  |
| Kosovo | Prishtina (pealinn) | ei |  |
| Taiwan | Taibei (valitsuse asukoht) | ei |  |

## Geomeetria otsused

- Natural Earthi Saksamaa vaatenurga kaart: Krimm on Ukraina osa, Põhja-Küpros Küprose ja Somaliland Somaalia osa (ÜRO seisukoht).
- Liidetud alad: BRT → KAZ, USG → CUB (Baikonur ja Guantánamo kuuluvad vastavalt Kasahstanile ja Kuubale).
- Venemaa, Kasahstan ja Türgi on Maailmajagude küsimustes jagatud Uurali, Uurali jõe, Kaspia mere, Kuma–Manõtši nõo ja Bosporuse järgi; riigiküsimustes on nad tervikud.
- Prantsusmaa ülemeremaad (Prantsuse Guajaana, Guadeloupe, Martinique, Réunion, Mayotte) ja Hollandi Kariibi saared kuuluvad Maailmajagude/Mandrite küsimustes oma geograafilisse piirkonda.
- Lääne-Sahara, Kosovo, Palestiina ja Taiwan on kaardil eraldi, kuid ei ole hinnatud küsimuste sihtmärgid; Uuri-režiim selgitab nende staatust neutraalselt.
- Ookeanide küsimustes on iga ookeani kohal kindlad süvaookeani puutealad; Vaikne ookean on puudutatav kaardi mõlemal serval sama vastusena. Rannikute lähedal tehtud puudutus ei ole kunagi vale vastus.

## Kaardivaated

| Vaade | Sihtriike | Kaardil puudutatav | Väikeriigi markereid | Pealinnapunkte | Suurus |
| --- | ---: | ---: | ---: | ---: | ---: |
| world | 14 | 14 | 0 | 17 | 120 KB |
| antarctica | 0 | 0 | 1 | 0 | 54 KB |
| europe | 44 | 38 | 7 | 45 | 148 KB |
| europe-baltics | 3 | 3 | 0 | 3 | 17 KB |
| europe-nordic | 5 | 5 | 0 | 5 | 106 KB |
| europe-western | 11 | 10 | 2 | 12 | 95 KB |
| europe-central | 9 | 9 | 1 | 9 | 53 KB |
| europe-southern | 10 | 10 | 4 | 10 | 61 KB |
| europe-eastern | 7 | 7 | 0 | 8 | 126 KB |
| europe-balkans | 8 | 8 | 0 | 9 | 61 KB |
| asia | 47 | 38 | 10 | 53 | 127 KB |
| asia-east | 5 | 5 | 0 | 6 | 68 KB |
| asia-southeast | 11 | 10 | 1 | 13 | 95 KB |
| asia-south | 9 | 9 | 1 | 10 | 57 KB |
| asia-central | 5 | 5 | 0 | 5 | 36 KB |
| asia-west | 18 | 17 | 1 | 20 | 58 KB |
| africa | 54 | 47 | 6 | 58 | 82 KB |
| africa-north | 6 | 6 | 0 | 7 | 51 KB |
| africa-west | 16 | 15 | 0 | 16 | 32 KB |
| africa-central | 9 | 9 | 1 | 9 | 47 KB |
| africa-east | 18 | 18 | 3 | 18 | 41 KB |
| africa-south | 5 | 5 | 0 | 8 | 16 KB |
| americas | 35 | 22 | 12 | 36 | 170 KB |
| americas-north-large | 3 | 3 | 0 | 3 | 129 KB |
| americas-central | 8 | 8 | 0 | 8 | 40 KB |
| americas-caribbean | 13 | 9 | 7 | 13 | 36 KB |
| americas-south | 12 | 12 | 0 | 13 | 71 KB |
| oceania | 14 | 14 | 9 | 14 | 52 KB |
| oceania-australia-nz | 2 | 2 | 0 | 2 | 39 KB |
| oceania-melanesia | 4 | 4 | 0 | 4 | 23 KB |
| oceania-micronesia | 5 | 5 | 5 | 5 | 30 KB |
| oceania-polynesia | 3 | 3 | 1 | 3 | 8 KB |
