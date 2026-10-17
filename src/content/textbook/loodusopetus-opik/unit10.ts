// Unit 10 — Maa kuju. Authored from textbook pages 44–47 and the cited supplementary sources.
// This file is declarative content for the existing textbook learning framework.
// Its four diagrams (u10-*) are registered in src/lib/textbook/diagramRegistry.ts
// and drawn in src/app/components/textbook/diagrams/. The one photo (image block
// lo-opik-u10-b037) is public/textbook-images/nasa-apollo17-blue-marble.webp.
// The parent must preview and publish the unit; do not enable publication on import.

import type { Unit } from '@/lib/textbook/types';

export const unit10: Unit = {
  "id": "lo-opik-u10",
  "courseId": "loodusopetus-opik",
  "number": 10,
  "title": "Maa kuju",
  "pages": {
    "from": 44,
    "to": 47
  },
  "status": "ready",
  "contentVersion": "2026-10-17.1",
  "objectives": [
    {
      "id": "lo-opik-u10-o1",
      "description": "Oskan tuua näiteid muistsetest ettekujutustest Maa kuju kohta ja eristan neid teaduslikest teadmistest.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "44"
        }
      ]
    },
    {
      "id": "lo-opik-u10-o2",
      "description": "Tean, et Maa on ligikaudu kerakujuline, ja oskan selgitada, mida näitavad kosmosest tehtud fotod.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ]
    },
    {
      "id": "lo-opik-u10-o3",
      "description": "Mõistan, kuidas kuuvarjutuse ajal langeb Kuu peale Maa vari ja miks see aitab Maa kuju mõista.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ]
    },
    {
      "id": "lo-opik-u10-o4",
      "description": "Oskan selgitada, mis on silmapiir ehk horisont ja miks Maa ei lõpe silmapiiri taga.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ]
    },
    {
      "id": "lo-opik-u10-o5",
      "description": "Mõistan, miks kauge laeva alumine osa kaob enne ülemist ja miks kõrgemalt näeb kaugemale.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ]
    },
    {
      "id": "lo-opik-u10-o6",
      "description": "Tean esimese ümbermaailmareisi põhisündmusi ja selle seost Maa kuju mõistmisega.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "47"
        },
        {
          "kind": "supplementary",
          "url": "https://www.unesco.org/en/memory-world/first-voyage-circumnavigation-fernao-de-magalhaes-and-juan-sebastian-elcano-1519-1522",
          "attribution": "UNESCO Memory of the World"
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u10-l1",
      "title": "Muistsed ettekujutused Maast",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u10-o1"
      ],
      "sections": [
        {
          "id": "lo-opik-u10-l1-s1",
          "title": "Kuidas kujutati Maad ette?",
          "blocks": [
            {
              "id": "lo-opik-u10-b001",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "44"
              },
              "text": "Muistsetel aegadel oli inimestel Maa kujust üsna muinasjutuline ettekujutus. Näiteks arvati, et Maa on lame taldrik, mis ujub tohutu suures ookeanis. Maad peeti maailmaruumi keskpunktiks, mille ümber keerlesid Kuu ja Päike. Seda kõike kattis taevakuppel. Muinaskreekalased uskusid veel, et seda taevakuplit hoidis oma õlgadel jumal Atlas."
            },
            {
              "id": "lo-opik-u10-b002",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "44"
              },
              "items": [
                "Need on näited muistsetest ettekujutustest, mitte tänapäevased teaduslikud seletused.",
                "Erinevatel rahvastel olid erinevad lood Maa kujust."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u10-l1-s2",
          "title": "Ilmapuu ja vikerkaaresild",
          "blocks": [
            {
              "id": "lo-opik-u10-b003",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "44"
              },
              "text": "Osa muistseid rahvaid uskus, et maailm on kolmeosaline ilmapuu. Selle kõige ülemised oksad ulatusid taevasse, juur aga puudutas põrgut. Inimeste elupaiku ümbritses maailmameri, kus elutses hiiglaslik madu. Inimeste maailma ja nende kohal asuvat jumalate maailma ühendas vikerkaaresild."
            },
            {
              "id": "lo-opik-u10-b004",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "44"
              },
              "term": "Ilmapuu",
              "definition": "Muistse maailmapildi kujund: puu, mis ühendab eri maailmu."
            }
          ]
        },
        {
          "id": "lo-opik-u10-l1-s3",
          "title": "Elevandid ja kilpkonn",
          "blocks": [
            {
              "id": "lo-opik-u10-b005",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "44"
              },
              "text": "Osa rahvaid aga uskus, et Maad kannavad neli elevanti, kes seisavad maailmameres ujuval hiigelkilpkonnal. Maad kujutasid nad kumera kettana."
            },
            {
              "id": "lo-opik-u10-b006",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "44"
              },
              "diagramId": "u10-ancient-earth",
              "caption": "Võrdle muistset kujutluspilti ja Maa tänapäevast kerakuju näitavat mudelit. Skeem ei kujuta ajaloolisi illustratsioone täpselt."
            },
            {
              "id": "lo-opik-u10-b007",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "44"
              },
              "items": [
                "Muistsed inimesed püüdsid maailma mõista oma lugude ja tähelepanekute abil.",
                "Maa kuju selgitamiseks on vaja vaatlusi ja tõendeid."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u10-l2",
      "title": "Maa on kerakujuline",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u10-o2",
        "lo-opik-u10-o3"
      ],
      "sections": [
        {
          "id": "lo-opik-u10-l2-s1",
          "title": "Miks Maa tundub tasane?",
          "blocks": [
            {
              "id": "lo-opik-u10-b008",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "45"
              },
              "text": "Maakera on väga suur ja sellepärast ei ole maapinnal seistes lihtne aru saada, et Maa on ümmargune. Me näeme korraga ainult väikest osa Maa pinnast. Kui Maad vaadata piisavalt kaugelt, on selle kerakujuline kuju selgesti näha."
            },
            {
              "id": "lo-opik-u10-b009",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "45"
              },
              "term": "Maakera",
              "definition": "Meie koduplaneet Maa, mis on kujult ligikaudu kera."
            },
            {
              "id": "lo-opik-u10-b010",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "45"
              },
              "items": [
                "Maa ei ole lame ketas. Maa on ligikaudu kerakujuline.",
                "Maapinnal seistes näeme Maast ainult väikest osa."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u10-l2-s2",
          "title": "Kosmosest tehtud fotod",
          "blocks": [
            {
              "id": "lo-opik-u10-b011",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "45"
              },
              "text": "Maa kuju on hästi näha kosmosest tehtud fotodel. Astronaudid ja kosmoses olevad kaamerad saavad näidata Maad kaugelt. Ka rahvusvahelisest kosmosejaamast tehtud fotodel on näha Maa kumerust. Öistel fotodel paistavad heledad linnatuled ning mõnel fotol ka virmalised."
            },
            {
              "id": "lo-opik-u10-b037",
              "type": "image",
              "src": "/textbook-images/nasa-apollo17-blue-marble.webp",
              "alt": "Foto Maast kosmosest: ümmargune sinine planeet musta taeva taustal. Näha on Aafrika, Araabia poolsaar, Madagaskar, valged pilvekeerised ja all lõunapooluse ümbruse jää.",
              "width": 900,
              "height": 900,
              "credit": "NASA / Apollo 17 (foto AS17-148-22727)",
              "caption": "Apollo 17 astronaudid pildistasid Maad 7. detsembril 1972 teel Kuu poole. Fotol on näha Maa ümar kuju.",
              "source": {
                "kind": "supplementary",
                "url": "https://science.nasa.gov/resource/the-blue-marble/",
                "attribution": "NASA Johnson Space Center"
              }
            },
            {
              "id": "lo-opik-u10-b012",
              "type": "externalResource",
              "title": "Vaata päris fotot Maast: The Blue Marble",
              "intro": "NASA Apollo 17 astronaudid pildistasid Maad 1972. aastal teel Kuu poole. See on tõeline foto, mitte joonistus.",
              "url": "https://science.nasa.gov/resource/the-blue-marble/",
              "publisher": "NASA",
              "resourceType": "gallery",
              "imageCredit": "NASA Johnson Space Center",
              "observe": "Vaata Maa ümmargust serva, ookeane, pilvi ja maismaad."
            },
            {
              "id": "lo-opik-u10-b013",
              "type": "enrichment",
              "variant": "fun_fact",
              "title": "Huvitav fakt",
              "body": [
                "NASA avaldab ka satelliitide andmetest kokku pandud pilte Maast. Selline koondpilt ei ole sama mis üks foto: see koosneb mitmest vaatlusest."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u10-l2-s3",
          "title": "Kuuvarjutus – Maa vari Kuul",
          "blocks": [
            {
              "id": "lo-opik-u10-b014",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "45"
              },
              "text": "Maa peal olles saab selle kujust hästi aimu kuuvarjutuse ajal, sest siis langeb Kuule Maa vari. See oli üks asjaolu, mille põhjal inimesed juba mitu tuhat aastat tagasi hakkasid järeldama, et Maa on ümmargune."
            },
            {
              "id": "lo-opik-u10-b015",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "45"
              },
              "diagramId": "u10-lunar-eclipse",
              "caption": "Kuuvarjutuse ajal asub Maa Päikese ja Kuu vahel. Skeem ei ole mõõtkavas."
            },
            {
              "id": "lo-opik-u10-b016",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "45"
              },
              "items": [
                "Kuuvarjutuse ajal jääb Maa Päikese ja Kuu vahele.",
                "Maa vari liigub üle Kuu pinna; varju serv on kumer."
              ]
            },
            {
              "id": "lo-opik-u10-b017",
              "type": "externalResource",
              "title": "Vaata Maa ümarat varju Kuul",
              "intro": "NASA näitab Maa varju kuju mitmest eri kuuvarjutusest koostatud pildikoondisel. See ei ole üheainsa varjutuse foto.",
              "url": "https://science.nasa.gov/image-article/apod-2026-august-25-earths-shadow-visualized-with-lunar-eclipses/",
              "publisher": "NASA",
              "resourceType": "article",
              "observe": "Jälgi tumeda varju ümarat serva. Fotod on koondatud mitme kuuvarjutuse vaatlustest."
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u10-l3",
      "title": "Silmapiir ja laevad",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u10-o4",
        "lo-opik-u10-o5"
      ],
      "sections": [
        {
          "id": "lo-opik-u10-l3-s1",
          "title": "Mis on silmapiir?",
          "blocks": [
            {
              "id": "lo-opik-u10-b018",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "46"
              },
              "text": "Kui mererannas seista ja merele vaadata, tundub meile, et taevas ja meri saavad kauguses justkui kokku. See kokkupuutejoon on silmapiir ehk horisont. Sellest kaugemale pole võimalik näha, sest Maa kumeruse taha ei näe. Mere ääres me Maa kumerust ei märka, sest vaateväli on liiga kitsas."
            },
            {
              "id": "lo-opik-u10-b019",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "46"
              },
              "term": "Silmapiir ehk horisont",
              "definition": "Näiline joon, kus kauguses tunduvad maa või meri ja taevas kokku saavat."
            },
            {
              "id": "lo-opik-u10-b020",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "46"
              },
              "items": [
                "Maa ei lõpe silmapiiri taga.",
                "Silmapiiri kaugus sõltub muu hulgas sellest, kui kõrgel vaatleja asub."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u10-l3-s2",
          "title": "Kuidas laev silmapiiri taha kaob?",
          "blocks": [
            {
              "id": "lo-opik-u10-b021",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "46"
              },
              "text": "Maakera kumerust aitab mõista sadamast lahkuv laev. Kaugenedes paistab laev aina väiksemana. Lõpuks ulatub üle silmapiiri vaid laeva korsten või lipp. Laeva alumine osa kaob Maa kumeruse taha enne ülemist osa."
            },
            {
              "id": "lo-opik-u10-b022",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "46"
              },
              "diagramId": "u10-ship-horizon",
              "caption": "Kaugel oleva laeva kere jääb Maa kumeruse taha enne masti. Skeem on lihtsustatud."
            },
            {
              "id": "lo-opik-u10-b023",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "46"
              },
              "items": [
                "Laeva väiksemana paistmine tuleb kaugusest.",
                "See, et laeva alumine osa kaob enne ülemist, on seotud Maa kumerusega."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u10-l3-s3",
          "title": "Kõrgemalt näeb kaugemale",
          "blocks": [
            {
              "id": "lo-opik-u10-b024",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "46"
              },
              "text": "Selleks, et laeva uuesti näha, peab oma vaatevälja suurendama. Seda saab teha kõrgemale tõustes, näiteks tuletorni otsast vaadates: siis nihkub silmapiir kaugemale. Kui vaadata Maad kõrgemalt, näiteks lennukist, on vaateväli avaram ja maapinna kumerus paremini aimatav."
            },
            {
              "id": "lo-opik-u10-b025",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "46"
              },
              "diagramId": "u10-observer-height",
              "caption": "Kõrgemalt on silmapiir kaugemal. Vaatlejad ja kaugused on näidatud skeemina, mitte mõõtkavas."
            },
            {
              "id": "lo-opik-u10-b026",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "46"
              },
              "items": [
                "Rannal seistes on silmapiir lähemal.",
                "Kõrgemast vaatluspunktist, näiteks tuletorni tipust, võib näha kaugemale."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u10-l4",
      "title": "Esimene ümbermaailmareis",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u10-o6"
      ],
      "sections": [
        {
          "id": "lo-opik-u10-l4-s1",
          "title": "Maa ei lõpe silmapiiri taga",
          "blocks": [
            {
              "id": "lo-opik-u10-b027",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "47"
              },
              "text": "Pikkadel merereisidel selgus, et Maa ei lõpe silmapiiri taga ära. Meremehed mõistsid, et maapinna kumerus ei lase neil kaugemale näha. Kui laev liikus, nihkus ka silmapiir edasi."
            },
            {
              "id": "lo-opik-u10-b028",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "47"
              },
              "text": "Maa kerakujulisust mõistsid paljud teadlased juba ammu enne esimest ümbermaailmareisi. Pikk merereis ümber Maa andis aga uusi praktilisi tõendeid ja aitas mõista maailma suurust."
            },
            {
              "id": "lo-opik-u10-b029",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "47"
              },
              "items": [
                "Ümbermaailmareis ei olnud hetk, mil inimesed esimest korda Maa kerakuju avastasid.",
                "See näitas, et meritsi oli võimalik jõuda ümber maailma tagasi lähtekohta."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u10-l4-s2",
          "title": "Viis laeva läks teele, üks tuli tagasi",
          "blocks": [
            {
              "id": "lo-opik-u10-b030",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "47"
              },
              "text": "Esimene ümbermaailmareis tehti aastatel 1519–1522. Reis ise oli väga raske: alustati viie laeva ja umbes 270 mehega, kuid tagasi algpunkti jõudis kolm aastat hiljem kõigest üks laev 18 mehega. Ka reisi juht Fernão de Magalhães ise oli hukkunud."
            },
            {
              "id": "lo-opik-u10-b031",
              "type": "paragraph",
              "text": "Magalhães alustas ja juhtis reisi alguses. Pärast tema surma jõudis laev Victoria kodumaale tagasi Juan Sebastián Elcano juhtimisel.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.unesco.org/en/memory-world/first-voyage-circumnavigation-fernao-de-magalhaes-and-juan-sebastian-elcano-1519-1522",
                "attribution": "UNESCO Memory of the World"
              }
            },
            {
              "id": "lo-opik-u10-b032",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "47"
              },
              "caption": "Esimene ümbermaailmareis",
              "headers": [
                "Aeg",
                "Mis juhtus?"
              ],
              "rows": [
                [
                  "1519",
                  "Teekond algas viie laevaga."
                ],
                [
                  "1521",
                  "Magalhães hukkus reisi ajal."
                ],
                [
                  "1522",
                  "Elcano juhtimisel naasis laev Victoria."
                ]
              ]
            },
            {
              "id": "lo-opik-u10-b033",
              "type": "externalResource",
              "title": "Maailmareis Magalhãesi ja Elcano juhtimisel",
              "intro": "UNESCO tutvustab ajaloolisi dokumente esimesest ümbermaailmareisist.",
              "url": "https://www.unesco.org/en/memory-world/first-voyage-circumnavigation-fernao-de-magalhaes-and-juan-sebastian-elcano-1519-1522",
              "publisher": "UNESCO",
              "resourceType": "article",
              "observe": "Otsi tekstist reisijuhid Magalhães ja Elcano ning aastad 1519–1522."
            }
          ]
        },
        {
          "id": "lo-opik-u10-l4-s3",
          "title": "Ma tean, et…",
          "blocks": [
            {
              "id": "lo-opik-u10-b034",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "47"
              },
              "title": "MA TEAN, ET…",
              "items": [
                "Maa on kera kujuga. Seda näeb hästi kosmosest tehtud fotodel.",
                "Maa kujust saab aimu ka kuuvarjutuse ajal, kui Maa vari langeb Kuu peale.",
                "Silmapiiri taha jäävad laevad Maa kumeruse tõttu varju ning kõrgemalt näeb kaugemale.",
                "Esimene ümbermaailmareis toimus aastatel 1519–1522: selle alustas Magalhães ja lõpetas Elcano juhtimisel naasnud Victoria."
              ]
            },
            {
              "id": "lo-opik-u10-b035",
              "type": "enrichment",
              "variant": "extra",
              "title": "Lisateadmine: kas Maa on täiesti ümmargune?",
              "source": {
                "kind": "supplementary",
                "url": "https://science.nasa.gov/science-research/earth-science/water-energy-cycle/cryosphere/earths-paunch-helps-sharpen-ice-loss-estimates/",
                "attribution": "NASA Earth Science"
              },
              "body": [
                "Maa ei ole päris täiuslik kera: ta on pöörlemise tõttu pooluste juurest veidi lapikum ja ekvaatori kohal veidi laiem. Alguses piisab teadmisest, et Maa on peaaegu kerakujuline."
              ]
            },
            {
              "id": "lo-opik-u10-b036",
              "type": "externalResource",
              "title": "Miks Maa pole täiuslik kera?",
              "intro": "NASA selgitab, kuidas Maa pöörlemine mõjutab selle kuju. See on lisateadmine, mitte testimaterjal.",
              "url": "https://science.nasa.gov/science-research/earth-science/water-energy-cycle/cryosphere/earths-paunch-helps-sharpen-ice-loss-estimates/",
              "publisher": "NASA",
              "resourceType": "article"
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u10-q01",
      "unitId": "lo-opik-u10",
      "stem": "Millisena kujutas osa muistseid inimesi Maad ette?",
      "primaryObjectiveId": "lo-opik-u10-o1",
      "variantGroupId": "lo-opik-u10-g01",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus kirjeldatakse muistset ettekujutust Maast kui lamedast taldrikust või kettast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "44"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "ketas",
            "text": "Lameda taldriku või kettana"
          },
          {
            "id": "pall",
            "text": "Täpselt mõõdetud kerana"
          },
          {
            "id": "kuup",
            "text": "Kuubina"
          },
          {
            "id": "toru",
            "text": "Pika toruna"
          }
        ],
        "correctOptionId": "ketas"
      }
    },
    {
      "id": "lo-opik-u10-q02",
      "unitId": "lo-opik-u10",
      "stem": "Mille peal ujus Maa ühe muistse ettekujutuse järgi?",
      "primaryObjectiveId": "lo-opik-u10-o1",
      "variantGroupId": "lo-opik-u10-g02",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ühe muistse kujutluse järgi ujus lame Maa suure ookeani pinnal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "44"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "ookean",
            "text": "Tohutult suures ookeanis"
          },
          {
            "id": "pilv",
            "text": "Paksu pilve peal"
          },
          {
            "id": "kuu",
            "text": "Kuu peal"
          },
          {
            "id": "liiv",
            "text": "Liivakõrbes"
          }
        ],
        "correctOptionId": "ookean"
      }
    },
    {
      "id": "lo-opik-u10-q03",
      "unitId": "lo-opik-u10",
      "stem": "Kes hoidis ühe Vana-Kreeka müüdi järgi taevakuplit?",
      "primaryObjectiveId": "lo-opik-u10-o1",
      "variantGroupId": "lo-opik-u10-g03",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku järgi kujutati, et jumal Atlas hoidis taevakuplit oma õlgadel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "44"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "atlas",
            "text": "Jumal Atlas"
          },
          {
            "id": "zeus",
            "text": "Jumal Zeus"
          },
          {
            "id": "poseidon",
            "text": "Jumal Poseidon"
          },
          {
            "id": "helios",
            "text": "Päikesejumal Helios"
          }
        ],
        "correctOptionId": "atlas"
      }
    },
    {
      "id": "lo-opik-u10-q04",
      "unitId": "lo-opik-u10",
      "stem": "Millised loomad kandsid Maad ühe muistse kujutluse järgi?",
      "primaryObjectiveId": "lo-opik-u10-o1",
      "variantGroupId": "lo-opik-u10-g04",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ühes muistses loos seisid Maad kandvad elevandid hiigelkilpkonna seljas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "44"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "el",
            "text": "Elevandid hiigelkilpkonna seljas"
          },
          {
            "id": "kala",
            "text": "Suured kalad meres"
          },
          {
            "id": "madu",
            "text": "Hiiglaslik madu"
          },
          {
            "id": "linnud",
            "text": "Suured linnud"
          }
        ],
        "correctOptionId": "el"
      }
    },
    {
      "id": "lo-opik-u10-q05",
      "unitId": "lo-opik-u10",
      "stem": "Vali kõik õpikus kirjeldatud muistsed ettekujutused Maa kuju kohta.",
      "primaryObjectiveId": "lo-opik-u10-o1",
      "variantGroupId": "lo-opik-u10-g05",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus on kolm muistse maailmapildi näidet: taldrik, ilmapuu ning elevandid kilpkonnal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "44"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "taldrik",
            "text": "Maa on lameda taldriku sarnane."
          },
          {
            "id": "ilmapuu",
            "text": "Maailm on ilmapuu, mille osad ühendavad eri maailmu."
          },
          {
            "id": "kilpkonn",
            "text": "Maad kannavad elevandid hiigelkilpkonna seljas."
          },
          {
            "id": "foto",
            "text": "Maad on pildistatud kosmosest."
          },
          {
            "id": "kuuvari",
            "text": "Kuuvarjutuse ajal langeb Maa vari Kuu peale."
          }
        ],
        "correctOptionIds": [
          "taldrik",
          "ilmapuu",
          "kilpkonn"
        ]
      }
    },
    {
      "id": "lo-opik-u10-q06",
      "unitId": "lo-opik-u10",
      "stem": "Mis vahe on muistsetel kujutlustel ja tänapäevasel teaduslikul teadmisel Maa kujust?",
      "primaryObjectiveId": "lo-opik-u10-o1",
      "variantGroupId": "lo-opik-u10-g06",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vanad lood aitasid maailma ette kujutada. Maa kerakuju toetavad sõltumatud vaatlused ja tõendid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "44"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "toendid",
            "text": "Teaduslikku teadmist toetavad vaatlused ja tõendid."
          },
          {
            "id": "koik",
            "text": "Kõik vanad lood on kosmosefotodega kinnitatud."
          },
          {
            "id": "puudub",
            "text": "Neil pole mingit vahet."
          },
          {
            "id": "keel",
            "text": "Teadlased valivad Maa kuju keele põhjal."
          }
        ],
        "correctOptionId": "toendid"
      }
    },
    {
      "id": "lo-opik-u10-q07",
      "unitId": "lo-opik-u10",
      "stem": "Rühmita väited: muistne kujutlus või vaatlus?",
      "primaryObjectiveId": "lo-opik-u10-o1",
      "variantGroupId": "lo-opik-u10-g07",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Elevandid ja lame taldrik on muistsed kujutlused. Kosmosefotod ja kuuvarjutus on nähtused, mida saab vaadelda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "44"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "muistne",
            "text": "Muistne kujutlus"
          },
          {
            "id": "vaatlus",
            "text": "Vaatlus"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Maad kannavad elevandid kilpkonna seljas."
          },
          {
            "id": "i2",
            "text": "Maa on lame taldrik."
          },
          {
            "id": "i3",
            "text": "Kuuvarjutuse ajal langeb Kuule Maa vari."
          },
          {
            "id": "i4",
            "text": "Kosmosefotol on näha Maa ümar serv."
          }
        ],
        "correctGroupByItem": {
          "i1": "muistne",
          "i2": "muistne",
          "i3": "vaatlus",
          "i4": "vaatlus"
        }
      }
    },
    {
      "id": "lo-opik-u10-q08",
      "unitId": "lo-opik-u10",
      "stem": "Üks laps väidab: „Kõik muistsete inimeste jutud Maa kujust olid ühesugused.” Kuidas vastata?",
      "primaryObjectiveId": "lo-opik-u10-o1",
      "variantGroupId": "lo-opik-u10-g08",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Muistsetel rahvastel olid erinevad lood Maa ja maailma ülesehituse kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "44"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "mitu",
            "text": "Õpikus on mitu erinevat ettekujutust, seega see väide ei pea paika."
          },
          {
            "id": "jah",
            "text": "Jah, kõik rahvad uskusid ainult ilmapuud."
          },
          {
            "id": "jahi",
            "text": "Jah, kõik rahvad uskusid ainult kilpkonna."
          },
          {
            "id": "pole",
            "text": "Maa kuju kohta ei räägitud muistsetel aegadel üldse lugusid."
          }
        ],
        "correctOptionId": "mitu"
      }
    },
    {
      "id": "lo-opik-u10-q09",
      "unitId": "lo-opik-u10",
      "stem": "Mis kujuga on Maa?",
      "primaryObjectiveId": "lo-opik-u10-o2",
      "variantGroupId": "lo-opik-u10-g09",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa on ligikaudu kerakujuline. Kooliastmes räägime maakera kujust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "kera",
            "text": "Ligikaudu kera kujuga"
          },
          {
            "id": "lame",
            "text": "Täiesti lame"
          },
          {
            "id": "ruut",
            "text": "Ruudu kujuga"
          },
          {
            "id": "kolmnurk",
            "text": "Kolmnurga kujuga"
          }
        ],
        "correctOptionId": "kera"
      }
    },
    {
      "id": "lo-opik-u10-q10",
      "unitId": "lo-opik-u10",
      "stem": "Kust on võimalik Maa kuju tervikuna hästi näha?",
      "primaryObjectiveId": "lo-opik-u10-o2",
      "variantGroupId": "lo-opik-u10-g10",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Piisavalt kaugelt kosmosest näeme suuremat osa Maast korraga ja selle ümarat välisserva.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "kosmos",
            "text": "Piisavalt kaugelt kosmosest"
          },
          {
            "id": "lennuk",
            "text": "Lennukiaknast, kus paistab ainult osa Maa pinnast"
          },
          {
            "id": "maekorgus",
            "text": "Kõrge mäe tipust"
          },
          {
            "id": "rand",
            "text": "Mererannast"
          }
        ],
        "correctOptionId": "kosmos"
      }
    },
    {
      "id": "lo-opik-u10-q11",
      "unitId": "lo-opik-u10",
      "stem": "Mida saab kosmosest tehtud Maa fotol näha? Vali kõik sobivad.",
      "primaryObjectiveId": "lo-opik-u10-o2",
      "variantGroupId": "lo-opik-u10-g11",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kosmosefotodelt võib näha Maa ümarat serva, meresid ja pilvi, mitte Maa sisemust ega muistseid müüte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "serv",
            "text": "Maa ümarat serva"
          },
          {
            "id": "meri",
            "text": "Meresid ja ookeane"
          },
          {
            "id": "pilv",
            "text": "Pilvi"
          },
          {
            "id": "sisu",
            "text": "Maa sügavat sisemust"
          },
          {
            "id": "atlas",
            "text": "Taevakuplit hoidvat Atlast"
          }
        ],
        "correctOptionIds": [
          "serv",
          "meri",
          "pilv"
        ]
      }
    },
    {
      "id": "lo-opik-u10-q12",
      "unitId": "lo-opik-u10",
      "stem": "Miks tundub maapind jalgsi liikudes enamasti tasane?",
      "primaryObjectiveId": "lo-opik-u10-o2",
      "variantGroupId": "lo-opik-u10-g12",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa raadius on väga suur võrreldes inimese vaateväljaga; kohaliku pinna kumerust on raske märgata.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "suur",
            "text": "Maa on nii suur, et näeme sellest ainult väikest osa."
          },
          {
            "id": "muutub",
            "text": "Maa muutub iga päev lamedamaks."
          },
          {
            "id": "kaugel",
            "text": "Maa kumerus kaob ära, kui inimene on maapinnal."
          },
          {
            "id": "meri",
            "text": "Maa on ainult mere kohal kumer."
          }
        ],
        "correctOptionId": "suur"
      }
    },
    {
      "id": "lo-opik-u10-q13",
      "unitId": "lo-opik-u10",
      "stem": "Ühenda vaatluskoht ja see, mida seal Maa kohta märgata võib.",
      "primaryObjectiveId": "lo-opik-u10-o2",
      "variantGroupId": "lo-opik-u10-g13",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaatluskoht mõjutab, kui suurt osa Maast näeme; kosmosejaama ööfotol võivad paista linnatuled ja virmalised.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Rannal maapinnalt vaadates"
          },
          {
            "id": "p2",
            "text": "Piisavalt kaugelt kosmosest"
          },
          {
            "id": "p3",
            "text": "Kosmosejaama ööfotol"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Näha on vaid väike osa Maa pinnast."
          },
          {
            "id": "c2",
            "text": "Näha on Maa ümar välisserv ja väga suur osa planeedist."
          },
          {
            "id": "c3",
            "text": "Näha võivad olla linnatuled ja virmalised."
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2",
          "p3": "c3"
        }
      }
    },
    {
      "id": "lo-opik-u10-q14",
      "unitId": "lo-opik-u10",
      "stem": "Milline järeldus on õige?",
      "primaryObjectiveId": "lo-opik-u10-o2",
      "variantGroupId": "lo-opik-u10-g14",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Väikeselt osalt Maast vaadates ei ole kumerus hästi märgatav; kosmosest on näha palju suurem osa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "moot",
            "text": "Maa on väga suur, kuid siiski ligikaudu kerakujuline."
          },
          {
            "id": "lame",
            "text": "Maa on lame ja fotod näitavad teist planeeti."
          },
          {
            "id": "kahe",
            "text": "Maa muudab kosmosesse vaadates kuju."
          },
          {
            "id": "kuu",
            "text": "Kõik kosmosefotod on tehtud Kuult."
          }
        ],
        "correctOptionId": "moot"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Maa paistab maapinnalt väga laia ja tasase alana, kuid kosmosest on nähtav selle ümar piirjoon."
        ]
      }
    },
    {
      "id": "lo-opik-u10-q15",
      "unitId": "lo-opik-u10",
      "stem": "Näita joonisel kujutist, mis vastab Maa tänapäeval teadaolevale kujule.",
      "primaryObjectiveId": "lo-opik-u10-o2",
      "variantGroupId": "lo-opik-u10-g09",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Teadlaste vaatlused näitavad, et Maa on ligikaudu kerakujuline. Muistsed lame-Maa pildid on lood, mitte Maa tegelik kuju.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u10-ancient-earth",
        "correctRegionId": "globe"
      }
    },
    {
      "id": "lo-opik-u10-q16",
      "unitId": "lo-opik-u10",
      "stem": "Laps näeb mäe otsast kaugele. Kas see tähendab, et Maa peab olema lame?",
      "primaryObjectiveId": "lo-opik-u10-o2",
      "variantGroupId": "lo-opik-u10-g12",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa on piisavalt suur, et selle väikesed osad võivad inimese silmale tasased näida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "ei",
            "text": "Ei. Ka väga suure kera väike osa võib tunduda peaaegu tasane."
          },
          {
            "id": "jah",
            "text": "Jah. Kõrgelt nägemine tõestab alati, et Maa on lame."
          },
          {
            "id": "magi",
            "text": "Mäed muudavad maakera kohati täiesti lamedaks kettaks."
          },
          {
            "id": "ohk",
            "text": "Maa kuju sõltub ainult ilmast."
          }
        ],
        "correctOptionId": "ei"
      }
    },
    {
      "id": "lo-opik-u10-q17",
      "unitId": "lo-opik-u10",
      "stem": "Mis langeb Kuu peale kuuvarjutuse ajal?",
      "primaryObjectiveId": "lo-opik-u10-o3",
      "variantGroupId": "lo-opik-u10-g17",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuuvarjutuse ajal langeb Kuule Maa vari.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "maa",
            "text": "Maa vari"
          },
          {
            "id": "mer",
            "text": "Mere vari"
          },
          {
            "id": "pilv",
            "text": "Pilve vari"
          },
          {
            "id": "paike",
            "text": "Päikese vari"
          }
        ],
        "correctOptionId": "maa"
      }
    },
    {
      "id": "lo-opik-u10-q18",
      "unitId": "lo-opik-u10",
      "stem": "Milline taevakeha on kuuvarjutuse ajal Päikese ja Kuu vahel?",
      "primaryObjectiveId": "lo-opik-u10-o3",
      "variantGroupId": "lo-opik-u10-g18",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuuvarjutuse ajal on järjekord Päike – Maa – Kuu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "maa",
            "text": "Maa"
          },
          {
            "id": "marss",
            "text": "Marss"
          },
          {
            "id": "veenus",
            "text": "Veenus"
          },
          {
            "id": "kuu",
            "text": "Teine Kuu"
          }
        ],
        "correctOptionId": "maa"
      }
    },
    {
      "id": "lo-opik-u10-q19",
      "unitId": "lo-opik-u10",
      "stem": "Milline on Maa varju piirjoon Kuu pinnal?",
      "primaryObjectiveId": "lo-opik-u10-o3",
      "variantGroupId": "lo-opik-u10-g19",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuuvarjutuse ajal paistab Maa vari Kuul kumera servaga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "kumer",
            "text": "Kumer"
          },
          {
            "id": "sirge",
            "text": "Täiesti sirge nagu joonlauaga tõmmatud"
          },
          {
            "id": "ruut",
            "text": "Ruudukujuline"
          },
          {
            "id": "sakiline",
            "text": "Alati teravalt sakiline"
          }
        ],
        "correctOptionId": "kumer"
      }
    },
    {
      "id": "lo-opik-u10-q20",
      "unitId": "lo-opik-u10",
      "stem": "Miks aitab kuuvarjutus Maa kuju mõista?",
      "primaryObjectiveId": "lo-opik-u10-o3",
      "variantGroupId": "lo-opik-u10-g19",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa heidab Kuule kaarja varju, mis on kooskõlas Maa kerakuju kohta käivate teadmistega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "vari",
            "text": "Kuu peal on näha Maa kumera servaga vari."
          },
          {
            "id": "paistab",
            "text": "Kuu muutub sellepärast Maa kujuliseks."
          },
          {
            "id": "kuu",
            "text": "Kuuvari näitab ainult Kuu enda kuju."
          },
          {
            "id": "pilved",
            "text": "Kuuvarjutus näitab, et Maa on pilvedest tehtud."
          }
        ],
        "correctOptionId": "vari"
      }
    },
    {
      "id": "lo-opik-u10-q21",
      "unitId": "lo-opik-u10",
      "stem": "Miks muutub Kuu kuuvarjutuse ajal tumedamaks?",
      "primaryObjectiveId": "lo-opik-u10-o3",
      "variantGroupId": "lo-opik-u10-g21",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa blokeerib osa Päikese valgusest, mis muidu Kuuni jõuaks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "varjus",
            "text": "Kuu liigub Maa varju ja saab vähem otsest päikesevalgust."
          },
          {
            "id": "poord",
            "text": "Kuu muutub ise mustaks kiviks."
          },
          {
            "id": "meri",
            "text": "Mered Maal varjavad Kuud."
          },
          {
            "id": "paev",
            "text": "Päike kustub korraks ära."
          }
        ],
        "correctOptionId": "varjus"
      }
    },
    {
      "id": "lo-opik-u10-q22",
      "unitId": "lo-opik-u10",
      "stem": "Õige või vale? Kuuvarjutuse ajal heidab Kuu oma varju Maa peale.",
      "primaryObjectiveId": "lo-opik-u10-o3",
      "variantGroupId": "lo-opik-u10-g22",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Kui Maa vari langeb Kuule, on tegemist kuuvarjutusega. Kuu vari Maal on seotud päikesevarjutusega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "true",
            "text": "Õige"
          },
          {
            "id": "false",
            "text": "Vale"
          }
        ],
        "correctOptionId": "false",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u10-q23",
      "unitId": "lo-opik-u10",
      "stem": "Vali kõik õiged väited kuuvarjutuse kohta.",
      "primaryObjectiveId": "lo-opik-u10-o3",
      "variantGroupId": "lo-opik-u10-g17",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuuvarjutuse ajal on Maa Päikese ja Kuu vahel ning Maa vari langeb Kuule.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "vahel",
            "text": "Maa asub Päikese ja Kuu vahel."
          },
          {
            "id": "vari",
            "text": "Maa vari langeb Kuu pinnale."
          },
          {
            "id": "kuuvar",
            "text": "Kuu vari langeb Maa pinnale."
          },
          {
            "id": "paike",
            "text": "Päike lakkab korraks valgust kiirgamast."
          }
        ],
        "correctOptionIds": [
          "vahel",
          "vari"
        ]
      }
    },
    {
      "id": "lo-opik-u10-q24",
      "unitId": "lo-opik-u10",
      "stem": "Näita skeemil taevakeha, mis kuuvarjutuse ajal Päikese valguse Kuuni jõudmist takistab.",
      "primaryObjectiveId": "lo-opik-u10-o3",
      "variantGroupId": "lo-opik-u10-g18",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa asub Päikese ja Kuu vahel ning heidab Kuu suunas varju.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u10-lunar-eclipse",
        "correctRegionId": "earth"
      }
    },
    {
      "id": "lo-opik-u10-q25",
      "unitId": "lo-opik-u10",
      "stem": "Näita skeemil taevakeha, mille pinnale kuuvarjutuse ajal vari langeb.",
      "primaryObjectiveId": "lo-opik-u10-o3",
      "variantGroupId": "lo-opik-u10-g22",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuuvarjutuse ajal liigub Kuu Maa varju sisse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u10-lunar-eclipse",
        "correctRegionId": "moon"
      }
    },
    {
      "id": "lo-opik-u10-q26",
      "unitId": "lo-opik-u10",
      "stem": "Milline järjestus on kuuvarjutuse skeemil õige Päikesest alates?",
      "primaryObjectiveId": "lo-opik-u10-o3",
      "variantGroupId": "lo-opik-u10-g18",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuuvarjutuse ajal asub Maa Päikese ja Kuu vahel. Päikesest liikudes on järjekord Päike, Maa, Kuu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "45"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Päike"
          },
          {
            "id": "s2",
            "text": "Maa"
          },
          {
            "id": "s3",
            "text": "Kuu"
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3"
        ],
        "firstLabel": "Päikesest alates",
        "lastLabel": "Viimane taevakeha"
      }
    },
    {
      "id": "lo-opik-u10-q27",
      "unitId": "lo-opik-u10",
      "stem": "Mis on silmapiir ehk horisont?",
      "primaryObjectiveId": "lo-opik-u10-o4",
      "variantGroupId": "lo-opik-u10-g27",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Silmapiir ehk horisont on näiline piir maapinna või mere ja taeva vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "joon",
            "text": "Näiline piir, kus maa või meri ja taevas kauguses kokku saavad."
          },
          {
            "id": "sein",
            "text": "Maa pinna tegelik serv."
          },
          {
            "id": "algus",
            "text": "Kõige kaugem koht, kuhu inimene saab merel sõita."
          },
          {
            "id": "pilv",
            "text": "Pilvede alumine piir."
          }
        ],
        "correctOptionId": "joon"
      }
    },
    {
      "id": "lo-opik-u10-q28",
      "unitId": "lo-opik-u10",
      "stem": "Mis teine sõna tähendab sama mis silmapiir?",
      "primaryObjectiveId": "lo-opik-u10-o4",
      "variantGroupId": "lo-opik-u10-g28",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Silmapiiri teine nimetus on horisont.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "hor",
            "text": "Horisont"
          },
          {
            "id": "kra",
            "text": "Kraater"
          },
          {
            "id": "pool",
            "text": "Poolus"
          },
          {
            "id": "planeet",
            "text": "Planeet"
          }
        ],
        "correctOptionId": "hor"
      }
    },
    {
      "id": "lo-opik-u10-q29",
      "unitId": "lo-opik-u10",
      "stem": "Õige või vale? Maa lõpeb seal, kus meri näib taevaga kokku saavat.",
      "primaryObjectiveId": "lo-opik-u10-o4",
      "variantGroupId": "lo-opik-u10-g29",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Silmapiir on näiline piir; Maa jätkub selle taga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "true",
            "text": "Õige"
          },
          {
            "id": "false",
            "text": "Vale"
          }
        ],
        "correctOptionId": "false",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u10-q30",
      "unitId": "lo-opik-u10",
      "stem": "Miks ei saa rannalt näha kõike, mis asub kaugel mere taga?",
      "primaryObjectiveId": "lo-opik-u10-o4",
      "variantGroupId": "lo-opik-u10-g30",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa kumerus võib kauged objektid silmapiiri taha peita.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "kumer",
            "text": "Maa pind on kumer ja kaugel olevad objektid võivad jääda selle taha."
          },
          {
            "id": "ots",
            "text": "Meri lõpeb seal järsult."
          },
          {
            "id": "poole",
            "text": "Kõik laevad pööravad enne seda tagasi."
          },
          {
            "id": "nagemine",
            "text": "Maa pind on kogu ulatuses tasane ja peidab laevad valguse eest."
          }
        ],
        "correctOptionId": "kumer"
      }
    },
    {
      "id": "lo-opik-u10-q31",
      "unitId": "lo-opik-u10",
      "stem": "Kui inimene sõidab laevaga edasi, mis juhtub tema silmapiiriga?",
      "primaryObjectiveId": "lo-opik-u10-o4",
      "variantGroupId": "lo-opik-u10-g31",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Silmapiir on seotud vaatleja asukohaga. Edasi liikudes näeb ta uut, kaugemale ulatuvat merepinda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "liigub",
            "text": "Silmapiir nihkub koos vaatlejaga edasi."
          },
          {
            "id": "paigal",
            "text": "Silmapiir jääb alati samasse punkti merele."
          },
          {
            "id": "ots",
            "text": "Silmapiir muutub päris servaks."
          },
          {
            "id": "kaob",
            "text": "Kõik silmapiirid kaovad ära."
          }
        ],
        "correctOptionId": "liigub"
      }
    },
    {
      "id": "lo-opik-u10-q32",
      "unitId": "lo-opik-u10",
      "stem": "Milline neist väidetest kirjeldab silmapiiri õigesti?",
      "primaryObjectiveId": "lo-opik-u10-o4",
      "variantGroupId": "lo-opik-u10-g27",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Horisont on näiline joon, mida näeme mere või maa ja taeva piiril.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "nailine",
            "text": "Silmapiir on vaates nähtav piir, mitte Maa tegelik lõpp."
          },
          {
            "id": "sein",
            "text": "Silmapiir on püstine sein."
          },
          {
            "id": "viimane",
            "text": "Silmapiir on viimane koht maailmas."
          },
          {
            "id": "paike",
            "text": "Silmapiir tekib ainult öösel."
          }
        ],
        "correctOptionId": "nailine"
      }
    },
    {
      "id": "lo-opik-u10-q33",
      "unitId": "lo-opik-u10",
      "stem": "Sõber ütleb: „Kui me purjetame silmapiirini, kukume Maa servalt alla.” Mida vastata?",
      "primaryObjectiveId": "lo-opik-u10-o4",
      "variantGroupId": "lo-opik-u10-g29",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa on kerakujuline, nii et silmapiir ei tähenda selle lõppu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "jatkub",
            "text": "Maa jätkub silmapiiri taga; purjetades liigub ka silmapiir edasi."
          },
          {
            "id": "jah",
            "text": "Jah, silmapiiril on mere lõpp."
          },
          {
            "id": "liigub",
            "text": "Laev peab enne serva õhku tõusma."
          },
          {
            "id": "peit",
            "text": "Silmapiir on ainult veepinnal olev vari."
          }
        ],
        "correctOptionId": "jatkub"
      }
    },
    {
      "id": "lo-opik-u10-q34",
      "unitId": "lo-opik-u10",
      "stem": "Mõtle kahele vaatlejale: üks seisab rannas, teine tuletorni tipus. Kummal on silmapiir kaugemal?",
      "primaryObjectiveId": "lo-opik-u10-o4",
      "variantGroupId": "lo-opik-u10-g34",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõrgemast vaatluspunktist näeb Maa kumeruse tõttu kaugemale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "torn",
            "text": "Tuletorni tipus olijal"
          },
          {
            "id": "rand",
            "text": "Rannal seisjal"
          },
          {
            "id": "sama",
            "text": "Mõlemal on alati täpselt sama kaugel"
          },
          {
            "id": "ilm",
            "text": "Kõrgus ei mõjuta silmapiiri kaugust; määrab ainult ilm"
          }
        ],
        "correctOptionId": "torn"
      },
      "relatedObjectiveIds": [
        "lo-opik-u10-o5"
      ]
    },
    {
      "id": "lo-opik-u10-q35",
      "unitId": "lo-opik-u10",
      "stem": "Milline kirjeldus sobib olukorda?",
      "primaryObjectiveId": "lo-opik-u10-o4",
      "variantGroupId": "lo-opik-u10-g34",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõrgemale tõustes on silmapiir kaugemal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "kaug",
            "text": "Tornis olija näeb silmapiirini kaugemale."
          },
          {
            "id": "rand",
            "text": "Rannal olija näeb silmapiirini kaugemale."
          },
          {
            "id": "sein",
            "text": "Meri lõpeb torni all."
          },
          {
            "id": "tuul",
            "text": "Kõrgemal on horisont alati lähemal, kui tuul on tugev."
          }
        ],
        "correctOptionId": "kaug"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Mari vaatab merd madalalt rannalt. Tema sõber vaatab sama merd kõrgel tornis."
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u10-o5"
      ]
    },
    {
      "id": "lo-opik-u10-q36",
      "unitId": "lo-opik-u10",
      "stem": "Milline laeva osa kaob merel eemaldudes silmapiiri taha esimesena?",
      "primaryObjectiveId": "lo-opik-u10-o5",
      "variantGroupId": "lo-opik-u10-g36",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa kumeruse taha kaob laeva alumine osa enne masti, korstnat ja lippu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "kere",
            "text": "Kere ehk alumine osa"
          },
          {
            "id": "mast",
            "text": "Mast ehk ülemine osa"
          },
          {
            "id": "lipp",
            "text": "Lipp mastis"
          },
          {
            "id": "korsten",
            "text": "Korsten"
          }
        ],
        "correctOptionId": "kere"
      }
    },
    {
      "id": "lo-opik-u10-q37",
      "unitId": "lo-opik-u10",
      "stem": "Milline laeva osa võib kaugelt olla veel nähtav, kui kere on juba peidus?",
      "primaryObjectiveId": "lo-opik-u10-o5",
      "variantGroupId": "lo-opik-u10-g36",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui laeva kere on kumeruse taha peitunud, võib mast või lipp veel silmapiirist kõrgemale ulatuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "mast",
            "text": "Mast või lipp"
          },
          {
            "id": "kiil",
            "text": "Kere alumine kiil"
          },
          {
            "id": "tekk",
            "text": "Laeva põhjaplaat"
          },
          {
            "id": "ankur",
            "text": "Vees olev ankur"
          }
        ],
        "correctOptionId": "mast"
      }
    },
    {
      "id": "lo-opik-u10-q38",
      "unitId": "lo-opik-u10",
      "stem": "Rühmita tähelepanekud nende peamise põhjuse järgi.",
      "primaryObjectiveId": "lo-opik-u10-o5",
      "variantGroupId": "lo-opik-u10-g38",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaugus muudab laeva näiliselt väiksemaks. Vaatleja kõrgus muudab silmapiiri kaugust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "kaugus",
            "text": "Laeva kaugus"
          },
          {
            "id": "korgus",
            "text": "Vaatleja kõrgus"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Laev paistab kaugemale sõites väiksemana."
          },
          {
            "id": "i2",
            "text": "Sama laeva mast tundub kaugemalt vaadates lühem."
          },
          {
            "id": "i3",
            "text": "Tornist on silmapiir kaugemal kui rannalt."
          },
          {
            "id": "i4",
            "text": "Kõrgemalt näeb laeva kerest rohkem."
          }
        ],
        "correctGroupByItem": {
          "i1": "kaugus",
          "i2": "kaugus",
          "i3": "korgus",
          "i4": "korgus"
        }
      }
    },
    {
      "id": "lo-opik-u10-q39",
      "unitId": "lo-opik-u10",
      "stem": "Ühenda merel tehtud tähelepanek sobiva selgitusega.",
      "primaryObjectiveId": "lo-opik-u10-o5",
      "variantGroupId": "lo-opik-u10-g39",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaugus mõjutab laeva näivat suurust; Maa kumerus peidab kere ning kõrgemalt näeb kaugemale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Laev paistab väiksemana."
          },
          {
            "id": "p2",
            "text": "Laeva kere kaob enne masti."
          },
          {
            "id": "p3",
            "text": "Tornist näeb sama laeva paremini."
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Laev asub vaatlejast kaugemal."
          },
          {
            "id": "c2",
            "text": "Maa kumerus peidab laeva alumise osa."
          },
          {
            "id": "c3",
            "text": "Kõrgemal asuva vaatleja silmapiir on kaugemal."
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2",
          "p3": "c3"
        }
      }
    },
    {
      "id": "lo-opik-u10-q40",
      "unitId": "lo-opik-u10",
      "stem": "Milline väide on õige, kui laev on silmapiiri taga?",
      "primaryObjectiveId": "lo-opik-u10-o5",
      "variantGroupId": "lo-opik-u10-g40",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Silmapiiri taha kadumine ei tähenda, et laev oleks maailmast kadunud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "olemas",
            "text": "Laev võib endiselt merel olla, kuigi rannalt ei ole seda näha."
          },
          {
            "id": "kadus",
            "text": "Laev lakkas olemas olemast."
          },
          {
            "id": "uppus",
            "text": "Laev peab kindlasti uppunud olema."
          },
          {
            "id": "serv",
            "text": "Laev on kindlasti jõudnud mere servani."
          }
        ],
        "correctOptionId": "olemas"
      }
    },
    {
      "id": "lo-opik-u10-q41",
      "unitId": "lo-opik-u10",
      "stem": "Näita joonisel laeva, mille alumine osa jääb Maa kumeruse taha.",
      "primaryObjectiveId": "lo-opik-u10-o5",
      "variantGroupId": "lo-opik-u10-g41",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kauge laeva kere on horisondi taga, kuid mast võib veel näha olla.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u10-ship-horizon",
        "correctRegionId": "far-ship"
      }
    },
    {
      "id": "lo-opik-u10-q42",
      "unitId": "lo-opik-u10",
      "stem": "Näita skeemil kohta, kus vaatleja saab näha kaugema silmapiirini.",
      "primaryObjectiveId": "lo-opik-u10-o5",
      "variantGroupId": "lo-opik-u10-g34",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõrgemal, tuletorni otsas, on horisont kaugemal kui merepinnal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u10-observer-height",
        "correctRegionId": "tower"
      }
    },
    {
      "id": "lo-opik-u10-q43",
      "unitId": "lo-opik-u10",
      "stem": "Mis on parim viis püüda uuesti näha laeva, mis on just silmapiiri taha kadunud?",
      "primaryObjectiveId": "lo-opik-u10-o5",
      "variantGroupId": "lo-opik-u10-g34",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõrgemalt nihkub horisont kaugemale ja osa laevast võib uuesti nähtavale tulla.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "korgem",
            "text": "Minna kõrgemasse vaatluskohta, näiteks torni."
          },
          {
            "id": "kumm",
            "text": "Istuda rannal madalamale."
          },
          {
            "id": "binokkel",
            "text": "Võtta binokkel, kuid jääda samale kõrgusele."
          },
          {
            "id": "oodata",
            "text": "Oodata, kuni päike tõuseb kõrgemale."
          }
        ],
        "correctOptionId": "korgem"
      }
    },
    {
      "id": "lo-opik-u10-q44",
      "unitId": "lo-opik-u10",
      "stem": "Mida see vaatlus toetab?",
      "primaryObjectiveId": "lo-opik-u10-o5",
      "variantGroupId": "lo-opik-u10-g34",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaatleja kõrgemale tõustes nihkub horisont kaugemale ja laevast näeb rohkem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "46"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "korgus",
            "text": "Kõrgemalt näeb Maa kumeruse tõttu kaugemale."
          },
          {
            "id": "sirge",
            "text": "Maa on täiesti lame."
          },
          {
            "id": "laev",
            "text": "Laev muutub päriselt kõrgemast kohast vaadates suuremaks."
          },
          {
            "id": "silm",
            "text": "Silmapiir on rannal alati kaugemal kui tornis."
          }
        ],
        "correctOptionId": "korgus"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Vaatluskoht",
          "Nähtu"
        ],
        "rows": [
          [
            "Rand",
            "Laeva masti ots on veel näha, kere mitte."
          ],
          [
            "Kõrge torn",
            "Sama laeva kerest on rohkem näha."
          ]
        ],
        "caption": "Sama laev samal ajal"
      }
    },
    {
      "id": "lo-opik-u10-q45",
      "unitId": "lo-opik-u10",
      "stem": "Mis aastatel toimus esimene ümbermaailmareis?",
      "primaryObjectiveId": "lo-opik-u10-o6",
      "variantGroupId": "lo-opik-u10-g45",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus nimetatud esimene ümbermaailmareis toimus aastatel 1519–1522.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "47"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a1519",
            "text": "1519–1522"
          },
          {
            "id": "a1919",
            "text": "1919–1922"
          },
          {
            "id": "a1492",
            "text": "1492–1493"
          },
          {
            "id": "a2000",
            "text": "2000–2003"
          }
        ],
        "correctOptionId": "a1519"
      }
    },
    {
      "id": "lo-opik-u10-q46",
      "unitId": "lo-opik-u10",
      "stem": "Mitu laeva alustas õpikus kirjeldatud esimest ümbermaailmareisi?",
      "primaryObjectiveId": "lo-opik-u10-o6",
      "variantGroupId": "lo-opik-u10-g46",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1519. aastal asus teele viis laeva.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "47"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "viis",
            "text": "Viis"
          },
          {
            "id": "uks",
            "text": "Üks"
          },
          {
            "id": "kaks",
            "text": "Kaks"
          },
          {
            "id": "kym",
            "text": "Kümme"
          }
        ],
        "correctOptionId": "viis"
      }
    },
    {
      "id": "lo-opik-u10-q47",
      "unitId": "lo-opik-u10",
      "stem": "Mitu laeva jõudis sellelt esimeselt ümbermaailmareisilt alguskohta tagasi?",
      "primaryObjectiveId": "lo-opik-u10-o6",
      "variantGroupId": "lo-opik-u10-g47",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1522. aastal naasis retke alguskohta üks laev, Victoria.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "47"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "uks",
            "text": "Üks"
          },
          {
            "id": "viis",
            "text": "Viis"
          },
          {
            "id": "kolm",
            "text": "Kolm"
          },
          {
            "id": "null",
            "text": "Mitte ühtegi"
          }
        ],
        "correctOptionId": "uks"
      }
    },
    {
      "id": "lo-opik-u10-q48",
      "unitId": "lo-opik-u10",
      "stem": "Kes alustas ja juhtis alguses esimest ümbermaailmareisi?",
      "primaryObjectiveId": "lo-opik-u10-o6",
      "variantGroupId": "lo-opik-u10-g48",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Reisi alustas Fernão de Magalhães ehk Ferdinand Magellan.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "47"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "mag",
            "text": "Fernão de Magalhães"
          },
          {
            "id": "elc",
            "text": "Juan Sebastián Elcano"
          },
          {
            "id": "columbus",
            "text": "Christoph Kolumbus"
          },
          {
            "id": "da-gama",
            "text": "Vasco da Gama"
          }
        ],
        "correctOptionId": "mag"
      }
    },
    {
      "id": "lo-opik-u10-q49",
      "unitId": "lo-opik-u10",
      "stem": "Kes juhtis laeva Victoria, kui see ümbermaailmareisi lõpuks tagasi jõudis?",
      "primaryObjectiveId": "lo-opik-u10-o6",
      "variantGroupId": "lo-opik-u10-g49",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magalhães hukkus teel. Juan Sebastián Elcano juhtis laeva Victoria tagasiteel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "47"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "elc",
            "text": "Juan Sebastián Elcano"
          },
          {
            "id": "mag",
            "text": "Fernão de Magalhães"
          },
          {
            "id": "columbus",
            "text": "Christoph Kolumbus"
          },
          {
            "id": "da-gama",
            "text": "Vasco da Gama"
          }
        ],
        "correctOptionId": "elc"
      }
    },
    {
      "id": "lo-opik-u10-q50",
      "unitId": "lo-opik-u10",
      "stem": "Miks oli esimene ümbermaailmareis oluline Maa kuju mõistmiseks?",
      "primaryObjectiveId": "lo-opik-u10-o6",
      "variantGroupId": "lo-opik-u10-g50",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Merereis ümber maailma ja tagasijõudmine aitas kinnitada Maa kerakuju ja maailma suurust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "47"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "ring",
            "text": "Reis näitas, et ümber Maa saab liikuda ja lähtekohta tagasi jõuda."
          },
          {
            "id": "serv",
            "text": "Reis leidis Maa serva."
          },
          {
            "id": "pilt",
            "text": "Reis tegi esimesed kosmosefotod."
          },
          {
            "id": "kilp",
            "text": "Reis leidis Maa alt elevandid ja kilpkonna."
          }
        ],
        "correctOptionId": "ring"
      }
    },
    {
      "id": "lo-opik-u10-q51",
      "unitId": "lo-opik-u10",
      "stem": "Ühenda nimi või laev selle rolliga esimesel ümbermaailmareisil.",
      "primaryObjectiveId": "lo-opik-u10-o6",
      "variantGroupId": "lo-opik-u10-g48",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magalhães alustas retke, Elcano juhtimisel naasis Victoria.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "47"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Fernão de Magalhães"
          },
          {
            "id": "p2",
            "text": "Juan Sebastián Elcano"
          },
          {
            "id": "p3",
            "text": "Victoria"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Alustas retke juhina, kuid hukkus teel."
          },
          {
            "id": "c2",
            "text": "Juhtis viimase laeva kodumaale tagasi."
          },
          {
            "id": "c3",
            "text": "Laev, mis jõudis 1522. aastal tagasi."
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2",
          "p3": "c3"
        }
      }
    },
    {
      "id": "lo-opik-u10-q52",
      "unitId": "lo-opik-u10",
      "stem": "Õige või vale? Enne 1519. aastat ei olnud keegi arvanud, et Maa on kerakujuline.",
      "primaryObjectiveId": "lo-opik-u10-o6",
      "variantGroupId": "lo-opik-u10-g52",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Maa kerakuju kohta oli teaduslikke järeldusi tehtud juba antiikajal, näiteks kuuvarjutusi uurides.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "47"
        },
        {
          "kind": "supplementary",
          "url": "https://pwg.gsfc.nasa.gov/stargaze/Scolumb.htm",
          "attribution": "NASA GSFC, The Round Earth"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "true",
            "text": "Õige"
          },
          {
            "id": "false",
            "text": "Vale"
          }
        ],
        "correctOptionId": "false",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u10-q53",
      "unitId": "lo-opik-u10",
      "stem": "Pane sündmused õigesse ajalisse järjekorda.",
      "primaryObjectiveId": "lo-opik-u10-o6",
      "variantGroupId": "lo-opik-u10-g53",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1519. aastal asuti teele, Magalhães hukkus 1521. aastal ja Victoria naasis 1522. aastal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "47"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Viis laeva alustavad reisi."
          },
          {
            "id": "s2",
            "text": "Magalhães hukkub retke ajal."
          },
          {
            "id": "s3",
            "text": "Victoria jõuab Elcano juhtimisel tagasi."
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3"
        ],
        "firstLabel": "Kõige varem",
        "lastLabel": "Kõige hiljem"
      }
    },
    {
      "id": "lo-opik-u10-q54",
      "unitId": "lo-opik-u10",
      "stem": "Kuidas parandada lauset?",
      "primaryObjectiveId": "lo-opik-u10-o6",
      "variantGroupId": "lo-opik-u10-g54",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laevu oli alguses viis, tagasi jõudis üks. Magalhães ei elanud reisi lõpuni ja Victoria tõi tagasi Elcano.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "47"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "parandus",
            "text": "Magalhães hukkus retke ajal; lõpuks naasis Elcano juhtimisel üks laev."
          },
          {
            "id": "jah",
            "text": "See lause on juba täiesti õige."
          },
          {
            "id": "null",
            "text": "Ükski laev ei jõudnud kunagi tagasi."
          },
          {
            "id": "viis",
            "text": "Kõik viis laeva jõudsid Elcano juhtimisel tagasi."
          }
        ],
        "correctOptionId": "parandus"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Õpilase tekst: „Magalhães purjetas ise kolm aastat ja tõi kõik viis laeva tagasi.”"
        ]
      }
    }
  ]
};
