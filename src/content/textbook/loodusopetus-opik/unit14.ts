// Unit 14 — Kaartide mitmekesisus. Õpik lk 58–59.
// Ready for the parent-controlled publication switch; keep unpublished until approved.
// The fictional examples and datasets are labelled as such, not real geography.
// Question IDs, variant-group IDs and source references are stable.
import type { Unit } from '@/lib/textbook/types';

export const unit14: Unit = {
  "id": "lo-opik-u14",
  "courseId": "loodusopetus-opik",
  "number": 14,
  "title": "Kaartide mitmekesisus",
  "pages": {
    "from": 58,
    "to": 59
  },
  "status": "ready",
  "contentVersion": "2026-10-17.1",
  "objectives": [
    {
      "id": "lo-opik-u14-o1",
      "description": "Oskan selgitada, miks eri inimesed kasutavad kaarte ja kuidas kaart aitab leida vajalikku teavet.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ]
    },
    {
      "id": "lo-opik-u14-o2",
      "description": "Tunnen füüsilist kaarti ja oskan sealt otsida mägesid, jõgesid, järvi, meresid ja muid loodusobjekte.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ]
    },
    {
      "id": "lo-opik-u14-o3",
      "description": "Tean, mida näitab riikide ehk poliitiline kaart: riigid, nende piirid ja sageli pealinnad.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "58–59"
        }
      ]
    },
    {
      "id": "lo-opik-u14-o4",
      "description": "Oskan võrrelda füüsilist ja poliitilist kaarti ning selgitada nende erinevat otstarvet.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ]
    },
    {
      "id": "lo-opik-u14-o5",
      "description": "Tean, mis on atlas, ja mõistan, miks seal on palju erinevaid kaarte.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ]
    },
    {
      "id": "lo-opik-u14-o6",
      "description": "Tunnen mitut liiki teemakaarte ning tean, mida näitavad rahvastiku-, ajaloo-, mullastiku- ja liikluskaardid.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ]
    },
    {
      "id": "lo-opik-u14-o7",
      "description": "Oskan valida küsimuse või olukorra jaoks sobiva kaardi.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "58–59"
        }
      ]
    },
    {
      "id": "lo-opik-u14-o8",
      "description": "Oskan lihtsal teemakaardil kasutada pealkirja ja legendi ning teha ainult kujutatud andmetele tuginevaid järeldusi.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        },
        {
          "kind": "textbook",
          "pages": "52–53"
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u14-l1",
      "title": "Kaarte on vaja paljudel inimestel",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u14-o1",
        "lo-opik-u14-o7"
      ],
      "sections": [
        {
          "id": "lo-opik-u14-l1-s1",
          "title": "Kellel on kaarti vaja?",
          "blocks": [
            {
              "id": "lo-opik-u14-b001",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "text": "Kaarte kasutavad oma igapäevatöös näiteks lendurid, meremehed, reisikorraldajad, meteoroloogid ja kullerid. Kaarti võib vaja minna ka matkajal, reisijal või inimesel, kes otsib võõras linnas õiget tänavat."
            },
            {
              "id": "lo-opik-u14-b002",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "text": "Igal inimesel on oma küsimus. Kuller tahab leida aadressi, meremees ohutut laevateed ning ilmateadlane ehk meteoroloog tahab uurida ilma. Kõigi jaoks ei pruugi olla kõige kasulikum üks ja sama kaart."
            },
            {
              "id": "lo-opik-u14-b003",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "items": [
                "Kaarte kasutatakse liikumiseks, asukoha leidmiseks ja maailma uurimiseks.",
                "Õige kaardi valimine sõltub sellest, mida tahad teada."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u14-l1-s2",
          "title": "Kaart võib näidata ka nähtamatuid andmeid",
          "blocks": [
            {
              "id": "lo-opik-u14-b004",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "text": "Kaardile saab kanda mägesid, jõgesid, teid ja linnu. Need on asjad, mida me maastikul näeme. Kuid kaart võib näidata ka andmeid, mida ei saa niisama silmaga vaadata, näiteks seda, kui palju inimesi mingis piirkonnas elab."
            },
            {
              "id": "lo-opik-u14-b005",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "text": "Kaartidel olevad värvid, jooned, märgid ja selgitused aitavad paljude andmete seast olulise üles leida. Seetõttu võib hea kaart anda kiiresti edasi teavet, mille kirjeldamiseks kuluks palju lehekülgi teksti."
            },
            {
              "id": "lo-opik-u14-b006",
              "type": "comparison",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "title": "Kaks eri küsimust",
              "columns": [
                {
                  "heading": "Mida näen maastikul?",
                  "points": [
                    "Mägi, jõgi või järv.",
                    "Tee, sild või linn."
                  ]
                },
                {
                  "heading": "Mida saan teada andmetest?",
                  "points": [
                    "Kui palju inimesi piirkonnas elab.",
                    "Kus liigub rohkem autosid."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u14-l1-s3",
          "title": "Paberkaart ja kaardiäpp",
          "blocks": [
            {
              "id": "lo-opik-u14-b007",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "text": "Õpiku järgi on paberkaardi lugemise oskus tähtis ka siis, kui oled harjunud kasutama nutitelefoni kaardiäppi. Mõlemal juhul tuleb aru saada, mida kaart näitab ja mida selle märgid tähendavad."
            },
            {
              "id": "lo-opik-u14-b008",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "text": "Enne kaardi vaatamist küsi endalt: mida ma otsin? Milline kaart aitaks kõige paremini vastust leida?"
            },
            {
              "id": "lo-opik-u14-b009",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "items": [
                "Kaardiäpis ja paberkaardil tuleb osata kaardimärke ja teavet lugeda.",
                "Üks kaart ei pea vastama kõigile küsimustele."
              ]
            },
            {
              "id": "lo-opik-u14-b010",
              "type": "externalResource",
              "title": "Uuri, mida üks kaart saab näidata",
              "intro": "Loe koos vanemaga näiteid füüsilistest, poliitilistest ja muudest kaartidest.",
              "url": "https://education.nationalgeographic.org/resource/map/",
              "publisher": "National Geographic Education",
              "resourceType": "article",
              "observe": "Otsi erineva eesmärgiga kaarte. Mille poolest need erinevad?"
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u14-l2",
      "title": "Füüsiline kaart ja riikide kaart",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u14-o2",
        "lo-opik-u14-o3",
        "lo-opik-u14-o4"
      ],
      "sections": [
        {
          "id": "lo-opik-u14-l2-s1",
          "title": "Füüsiline kaart kujutab loodust",
          "blocks": [
            {
              "id": "lo-opik-u14-b011",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "text": "Kui tahad teada, kus asuvad kõrged mäed või pikad jõed, võta appi füüsiline kaart. Sellel kujutatakse Maa loodust: ookeane ja meresid, mägesid ja madalikke, poolsaari ja saari, järvi ning jõgesid."
            },
            {
              "id": "lo-opik-u14-b012",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "term": "Füüsiline kaart",
              "definition": "Kaart, mis kujutab Maa loodust, näiteks pinnamoodi ja veekogusid."
            },
            {
              "id": "lo-opik-u14-b013",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "diagramId": "u14-physical-features",
              "description": "Väljamõeldud maastiku lihtne skeem: mäed, jõgi, järv ja saar. See ei ole päris koha kaart.",
              "caption": "Õppimiseks loodud väljamõeldud maastik, mitte mõne päris riigi kaart."
            },
            {
              "id": "lo-opik-u14-b014",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "items": [
                "Füüsiliselt kaardilt otsi mägesid, madalikke ja veekogusid.",
                "Loodusobjektid ei ole sama mis riigipiirid."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u14-l2-s2",
          "title": "Riikide ehk poliitiline kaart",
          "blocks": [
            {
              "id": "lo-opik-u14-b015",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "text": "Kui soovid teada, kus mingi riik asub või millised on tema naaberriigid, vaata riikide kaarti ehk poliitilist kaarti. Sellele on kantud riigid ja nende piirid ning sageli ka pealinnad ja mõned suuremad linnad."
            },
            {
              "id": "lo-opik-u14-b016",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "term": "Riikide kaart ehk poliitiline kaart",
              "definition": "Kaart, mis kujutab riike, nende piire ja sageli ka pealinnu."
            },
            {
              "id": "lo-opik-u14-b017",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "diagramId": "u14-political-elements",
              "description": "Õppimiseks väljamõeldud kahe riigi kaart riigipiiri, pealinna ja teise linnaga. Päris riikide piire pole kujutatud.",
              "caption": "Kõik nimed ja piirid sellel skeemil on välja mõeldud."
            },
            {
              "id": "lo-opik-u14-b018",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "items": [
                "Poliitilisel kaardil on eriti olulised riigid ja nendevahelised piirid.",
                "Pealinnu ja suuremaid linnu võid samuti näha."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u14-l2-s3",
          "title": "Sama piirkond, kaks erinevat kaarti",
          "blocks": [
            {
              "id": "lo-opik-u14-b019",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "text": "Sama piirkonda saab kujutada nii füüsilisel kui ka poliitilisel kaardil. Esimene pöörab tähelepanu loodusele, teine riikidele ja nende piiridele. Mõlemal kaardil võib olla ka muud teavet, kuid nende peamine eesmärk on erinev."
            },
            {
              "id": "lo-opik-u14-b020",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "diagramId": "u14-map-pair",
              "description": "Kahe kõrvuti väljamõeldud sama piirkonna kaardi võrdlus. Vasakul pinnamood ja jõed, paremal riigipiirid ja linnad.",
              "caption": "Vasakul füüsiline kaart, paremal poliitiline kaart. Mõlemad kujutavad sama väljamõeldud ala."
            },
            {
              "id": "lo-opik-u14-b021",
              "type": "comparison",
              "source": {
                "kind": "textbook",
                "pages": "58"
              },
              "title": "Millal kumba kasutada?",
              "columns": [
                {
                  "heading": "Füüsiline kaart",
                  "points": [
                    "Mägede ja madalike uurimiseks.",
                    "Jõgede, järvede, merede ja saarte leidmiseks."
                  ]
                },
                {
                  "heading": "Poliitiline kaart",
                  "points": [
                    "Riikide ja nende piiride uurimiseks.",
                    "Pealinnade ja naaberriikide leidmiseks."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u14-b022",
              "type": "enrichment",
              "variant": "extra",
              "title": "Lisateadmine",
              "body": [
                "Päris kaartidel võivad loodusobjektid, riigipiirid ja linnad olla koos. Kaardi liigi määrab see, millisele teabele kaart eelkõige keskendub."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u14-l3",
      "title": "Atlas on kaardiraamat",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u14-o5",
        "lo-opik-u14-o7"
      ],
      "sections": [
        {
          "id": "lo-opik-u14-l3-s1",
          "title": "Mis on atlas?",
          "blocks": [
            {
              "id": "lo-opik-u14-b023",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "text": "Atlas on kaardiraamat. See sisaldab peale füüsiliste ja riikide kaartide veel palju teisigi kaarte. Seetõttu saab atlasest ühe suure kaardi asemel uurida väga erinevaid teemasid."
            },
            {
              "id": "lo-opik-u14-b024",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "term": "Atlas",
              "definition": "Kaardiraamat ehk mitmest kaardist koosnev kogumik."
            },
            {
              "id": "lo-opik-u14-b025",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "items": [
                "Atlas ei ole üksainus kaart, vaid kaartide kogumik.",
                "Atlases on eri eesmärkide jaoks eri kaardid."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u14-l3-s2",
          "title": "Üks piirkond, mitu küsimust",
          "blocks": [
            {
              "id": "lo-opik-u14-b026",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "text": "Oletame, et tahad uurida Euroopat. Kõrgemate mägede kohta saad vastuse füüsiliselt kaardilt. Riikide piirid leiad poliitiliselt kaardilt. Kui tahad teada, kus elab palju inimesi, valid rahvastikukaardi."
            },
            {
              "id": "lo-opik-u14-b027",
              "type": "list",
              "ordered": true,
              "items": [
                "Mõtle välja küsimus, millele tahad vastust.",
                "Otsi atlasest sobivat liiki kaart.",
                "Loe kaardi pealkirja ja selgitusi, enne kui vastad."
              ]
            },
            {
              "id": "lo-opik-u14-b028",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "text": "Kaarte võib vaadelda ka üksteise kõrval. Siis saad samast piirkonnast teada mitut erinevat asja."
            }
          ]
        },
        {
          "id": "lo-opik-u14-l3-s3",
          "title": "Atlase eelis",
          "blocks": [
            {
              "id": "lo-opik-u14-b029",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "text": "Kui atlas sisaldab mitut erinevat kaarti, ei pea kõiki andmeid ühele suurele kaardile kokku suruma. Nii on vajalikku teavet lihtsam eraldi otsida."
            },
            {
              "id": "lo-opik-u14-b030",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "title": "Kontrolli end",
              "items": [
                "Atlas on kaardiraamat.",
                "Atlases võivad olla füüsilised, poliitilised ja mitmesugused teised kaardid.",
                "Kõigepealt vali küsimuse järgi õige kaart."
              ]
            },
            {
              "id": "lo-opik-u14-b031",
              "type": "enrichment",
              "variant": "fun_fact",
              "title": "Huvitav fakt",
              "body": [
                "Kaardikogumikke saab tänapäeval vaadata ka arvutis. Õpikus tutvustatud atlas on siiski eeskätt kaardiraamat; ka digikaardil tuleb mõista, mida parajasti näidatakse."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u14-l4",
      "title": "Teemakaardid jutustavad erinevaid lugusid",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u14-o6",
        "lo-opik-u14-o7",
        "lo-opik-u14-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u14-l4-s1",
          "title": "Rahvastiku- ja ajalookaardid",
          "blocks": [
            {
              "id": "lo-opik-u14-b032",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "text": "Rahvastikukaardid annavad ülevaate sellest, kui palju inimesi mingis piirkonnas elab. Ajalookaart kujutab minevikku, näiteks seda, kuidas kunagi paiknesid maakonnad või kus toimusid ajaloolised sündmused."
            },
            {
              "id": "lo-opik-u14-b033",
              "type": "comparison",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "title": "Mida kaardilt otsida?",
              "columns": [
                {
                  "heading": "Rahvastikukaart",
                  "points": [
                    "Kui palju elanikke on eri piirkondades.",
                    "Kus elab rohkem või vähem inimesi, kui kaardi andmed seda näitavad."
                  ]
                },
                {
                  "heading": "Ajalookaart",
                  "points": [
                    "Millised olid piirid kunagisel ajal.",
                    "Kus toimusid mineviku sündmused."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u14-b034",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "text": "Õpiku ajalookaardil on näiteks näidatud Eesti maakondi umbes 800 aasta eest. See ei tähenda, et toonased piirid oleksid täpselt samad mis praegused."
            },
            {
              "id": "lo-opik-u14-b035",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "items": [
                "Rahvastikukaart räägib inimestest ja nende paiknemisest.",
                "Ajalookaart näitab minevikku, mitte tingimata tänapäeva."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u14-l4-s2",
          "title": "Mullastik, liiklus, päikesepaiste ja muud teemad",
          "blocks": [
            {
              "id": "lo-opik-u14-b036",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "text": "Mullastikukaart aitab uurida, kus asuvad erinevad mullad ja kus võib leiduda viljakaid muldi. Liikluskaardilt saab uurida, millistel teedel sõidab rohkem autosid ja kus juhtub rohkem liiklusõnnetusi."
            },
            {
              "id": "lo-opik-u14-b037",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "text": "Kaart võib kujutada ka päikesepaiste kestust, ilma, loomastikku, koolide paiknemist, mesindust, marjakasvatust või metsandust. Peaaegu kõigest, mille asukohta või paiknemist saab näidata, võib teha kaardi."
            },
            {
              "id": "lo-opik-u14-b038",
              "type": "definition",
              "term": "Teemakaart",
              "definition": "Kaart, mis kujutab kindlat teemat, näiteks elanike arvu, muldi või liiklust.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/educational-resources/map-mysteries",
                "attribution": "USGS — Map Mysteries"
              }
            },
            {
              "id": "lo-opik-u14-b039",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "caption": "Näiteid eri kaartide eesmärkidest",
              "headers": [
                "Kaart",
                "Millisele küsimusele vastab?"
              ],
              "rows": [
                [
                  "Mullastikukaart",
                  "Kus on eri tüüpi või viljakamad mullad?"
                ],
                [
                  "Liikluskaart",
                  "Millistel teedel on kõige rohkem liiklust?"
                ],
                [
                  "Päikesepaiste kestuse kaart",
                  "Kus paistab päike kauem?"
                ],
                [
                  "Ilmakaart",
                  "Milline on ilm eri paikades?"
                ],
                [
                  "Loomastikukaart",
                  "Kus elavad erinevad loomad?"
                ]
              ]
            },
            {
              "id": "lo-opik-u14-b040",
              "type": "externalResource",
              "title": "Tutvu Eesti mullastikukaardi võimalustega",
              "intro": "Maa- ja Ruumiameti ametlik kirjeldus selgitab, milliseid mullastikuandmeid ja kaardikihte saab vaadata. See lisamaterjal pole testis kohustuslik.",
              "url": "https://geoportaal.maaamet.ee/est/kaardirakendused/mullastiku-kaart/mullastiku-kaardirakenduse-kirjeldus-p158.html",
              "publisher": "Maa- ja Ruumiamet",
              "resourceType": "article",
              "observe": "Millist teavet mullastiku kaart näitab? Soovi korral ava lehelt kaardirakendus."
            },
            {
              "id": "lo-opik-u14-b041",
              "type": "enrichment",
              "variant": "extra",
              "title": "Lisateadmine",
              "body": [
                "Arvutis saab mõnikord eri teemade kaardikihte sisse ja välja lülitada. Nii saab uurida sama ala mitmel moel, ilma et kõik märgid oleksid korraga nähtavad."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u14-l4-s3",
          "title": "Loeme üht väljamõeldud rahvastikukaarti",
          "blocks": [
            {
              "id": "lo-opik-u14-b042",
              "type": "paragraph",
              "text": "Sellel harjutuskaardil on kolm väljamõeldud piirkonda. Kaardi pealkiri on „Elanike arv piirkondades”. Vasakpoolses piirkonnas A elab 4 000, keskmises piirkonnas B 9 000 ja parempoolses piirkonnas C 6 000 inimest."
            },
            {
              "id": "lo-opik-u14-b043",
              "type": "paragraph",
              "text": "Kaardi legend aitab värve ja andmeid mõista: heledam ala tähendab selles näites väiksemat elanike arvu, tumedam suuremat. See värvide tähendus kehtib just selle kaardi kohta."
            },
            {
              "id": "lo-opik-u14-b044",
              "type": "diagram",
              "diagramId": "u14-population-map",
              "description": "Täiesti väljamõeldud kolme piirkonna rahvastikukaart. Vasakul A: 4 000 inimest, keskel B: 9 000 ja paremal C: 6 000. Värvi sügavus vastab elanike arvu suurusele.",
              "caption": "Väljamõeldud piirkonnad A, B ja C. Need arvud ei kirjelda päris Eesti asulaid."
            },
            {
              "id": "lo-opik-u14-b045",
              "type": "table",
              "caption": "Sama väljamõeldud näide arvudega",
              "headers": [
                "Piirkond",
                "Elanike arv"
              ],
              "rows": [
                [
                  "A (vasakul)",
                  "4 000"
                ],
                [
                  "B (keskel)",
                  "9 000"
                ],
                [
                  "C (paremal)",
                  "6 000"
                ]
              ]
            },
            {
              "id": "lo-opik-u14-b046",
              "type": "keyFact",
              "items": [
                "Kõige rohkem inimesi elab piirkonnas B.",
                "Kõige vähem inimesi elab piirkonnas A.",
                "Kaardi värve tuleb tõlgendada selle kaardi legendi järgi."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u14-l4-s4",
          "title": "Mida üks kaart ei ütle?",
          "blocks": [
            {
              "id": "lo-opik-u14-b047",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "text": "Rahvastikukaardilt saad teada elanike arvu, kuid see ei ütle üksinda, millises piirkonnas on kõige viljakam muld. Selleks vajad teistsuguse teemaga kaarti."
            },
            {
              "id": "lo-opik-u14-b048",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "text": "Kaarti lugedes vaata pealkirja, vajaduse korral ka legendi ja kaardi andmete aega. Ajaloolisi piire ei tohi segamini ajada tänapäevaste piiridega."
            },
            {
              "id": "lo-opik-u14-b049",
              "type": "externalResource",
              "title": "Millist teavet kaart võib kujutada?",
              "intro": "Ameerika geoloogiateenistuse õppematerjal pakub näiteid topograafilistest ja temaatilistest kaartidest.",
              "url": "https://www.usgs.gov/educational-resources/map-mysteries",
              "publisher": "U.S. Geological Survey",
              "resourceType": "article",
              "observe": "Võrdle eri kaartide pealkirju ja seda, milliseid andmeid need näitavad."
            },
            {
              "id": "lo-opik-u14-b050",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "59"
              },
              "title": "Ma tean, et…",
              "items": [
                "Kaarte on palju liike.",
                "Füüsiline kaart kujutab loodust, poliitiline riike ja piire.",
                "Atlas on kaardiraamat.",
                "Rahvastiku-, ajaloo-, mullastiku- ja liikluskaart vastavad eri küsimustele.",
                "Järeldus peab tuginema andmetele, mida kaart tegelikult näitab."
              ]
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u14-q001",
      "unitId": "lo-opik-u14",
      "stem": "Milline amet on õpikus nimetatud kaartide kasutajana?",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g001",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meteoroloog ehk ilmateadlane kasutab kaarte ilma uurimiseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "meteoroloog"
          },
          {
            "id": "b",
            "text": "pagariabiline"
          },
          {
            "id": "c",
            "text": "pillimeister"
          },
          {
            "id": "d",
            "text": "näitleja"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q002",
      "unitId": "lo-opik-u14",
      "stem": "Millised neist on õpikus kaartide kasutajatena nimetatud?",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g002",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku näited on lendurid, meremehed, reisikorraldajad, meteoroloogid ja kullerid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "kullerid"
          },
          {
            "id": "b",
            "text": "lendurid"
          },
          {
            "id": "c",
            "text": "meremehed"
          },
          {
            "id": "d",
            "text": "meteoroloogid"
          },
          {
            "id": "e",
            "text": "mitte keegi neist"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c",
          "d"
        ]
      }
    },
    {
      "id": "lo-opik-u14-q003",
      "unitId": "lo-opik-u14",
      "stem": "Miks võib kulleril kaarti vaja minna?",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g003",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaart aitab kulleril leida vajalikku aadressi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Aadressi leidmiseks."
          },
          {
            "id": "b",
            "text": "Raamatu lugemiseks."
          },
          {
            "id": "c",
            "text": "Toidu küpsetamiseks."
          },
          {
            "id": "d",
            "text": "Kella parandamiseks."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q004",
      "unitId": "lo-opik-u14",
      "stem": "Kes võib kaardi abil kavandada mereteekonda?",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g004",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meremeestele on kaart abiks teekonna ja asukoha leidmisel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "meremees"
          },
          {
            "id": "b",
            "text": "hambaarst"
          },
          {
            "id": "c",
            "text": "raamatukoguhoidja"
          },
          {
            "id": "d",
            "text": "maaler"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q005",
      "unitId": "lo-opik-u14",
      "stem": "Miks ei sobi kõigile ametitele alati üks ja sama kaart?",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g005",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lendur, meteoroloog ja kuller otsivad kaardilt eri liiki teavet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Tööülesanded vajavad erinevat teavet."
          },
          {
            "id": "b",
            "text": "Kõik kaardid peavad olema üht värvi."
          },
          {
            "id": "c",
            "text": "Kaardil ei saa näidata kohti."
          },
          {
            "id": "d",
            "text": "Kaarti saab lugeda ainult ühe korra."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q006",
      "unitId": "lo-opik-u14",
      "stem": "Millist teavet saab kaardiga kujutada, kuigi seda ei näe otse maastikul?",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g006",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Elanike arv on andmestik, mida võib piirkondade kaupa kaardile kanda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "piirkonna elanike arvu"
          },
          {
            "id": "b",
            "text": "ühe mäe kuju"
          },
          {
            "id": "c",
            "text": "jõe asukohta"
          },
          {
            "id": "d",
            "text": "järve kallast"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q007",
      "unitId": "lo-opik-u14",
      "stem": "Õige või vale? Kaardi lugemise oskus on kasulik ka siis, kui tavaliselt kasutad telefoni kaardiäppi.",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g007",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku järgi tuleb osata kaardi sisu lugeda nii paberilt kui ka ekraanilt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Õige"
          },
          {
            "id": "b",
            "text": "Vale"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q008",
      "unitId": "lo-opik-u14",
      "stem": "Miks võib kaart anda kiire ülevaate paljudest andmetest?",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g008",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaart koondab asukohti ja teavet visuaalselt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaart näitab paiknemist ja eri andmeid kujundite ning märkidega."
          },
          {
            "id": "b",
            "text": "Kaardil pole ühtegi kokkulepet."
          },
          {
            "id": "c",
            "text": "Kaart näitab alati ainult teid."
          },
          {
            "id": "d",
            "text": "Kaardil ei saa olla teksti."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q009",
      "unitId": "lo-opik-u14",
      "stem": "Meteoroloog valmistab ette ülevaadet Eesti homsest ilmast. Millist kaarti ta eelkõige vajab?",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g009",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ilmakaart kujutab ilma eri paikades.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58–59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "ilmakaarti"
          },
          {
            "id": "b",
            "text": "riigipiiride kaarti"
          },
          {
            "id": "c",
            "text": "mullastikukaarti"
          },
          {
            "id": "d",
            "text": "ajalookaarti"
          }
        ],
        "correctOptionId": "a"
      },
      "relatedObjectiveIds": [
        "lo-opik-u14-o7"
      ]
    },
    {
      "id": "lo-opik-u14-q010",
      "unitId": "lo-opik-u14",
      "stem": "Inimene sõidab esimest korda võõrasse linna ning otsib tänavat. Millisest teabest on kasu?",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g010",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tänavate ja aadresside kaart aitab liikumisel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "tänavatest ja aadressidest"
          },
          {
            "id": "b",
            "text": "mineviku maakonnapiiridest"
          },
          {
            "id": "c",
            "text": "erinevate muldade tüüpidest"
          },
          {
            "id": "d",
            "text": "päikesepaiste aastasest kestusest"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q011",
      "unitId": "lo-opik-u14",
      "stem": "Reisikorraldaja tahab ühes piirkonnas näidata nii linnu kui vaatamisväärsusi. Mis põhimõte aitab kaarti valida?",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g011",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Enne kaardi valimist tuleb mõelda küsimusele ja otsitavale teabele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Valin kaardi vajaliku teabe järgi."
          },
          {
            "id": "b",
            "text": "Valin alati kaardi, kus on kõige rohkem riigipiire."
          },
          {
            "id": "c",
            "text": "Valin alati ainult ajalookaardi."
          },
          {
            "id": "d",
            "text": "Kaartide erinevusi ei pea arvestama."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q012",
      "unitId": "lo-opik-u14",
      "stem": "Milline väide sobib õpiku selgitusega kõige paremini?",
      "primaryObjectiveId": "lo-opik-u14-o1",
      "variantGroupId": "lo-opik-u14-g012",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardid võivad kujutada nii maastiku objekte kui ka arvulisi andmeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaardile saab kanda ka sellist teavet nagu rahvaarv."
          },
          {
            "id": "b",
            "text": "Kaart näitab üksnes palja silmaga nähtavaid objekte."
          },
          {
            "id": "c",
            "text": "Kaart peab sisaldama ainult mägesid."
          },
          {
            "id": "d",
            "text": "Ühel kaardil on kõik võimalikud andmed korraga."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q013",
      "unitId": "lo-opik-u14",
      "stem": "Kust otsid kõrgete mägede asukohta?",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g013",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Füüsiline kaart näitab mägesid ja muud pinnamoodi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "füüsiliselt kaardilt"
          },
          {
            "id": "b",
            "text": "riikide piiride loendist"
          },
          {
            "id": "c",
            "text": "rahvastikukaardilt"
          },
          {
            "id": "d",
            "text": "ajalookalendrist"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q014",
      "unitId": "lo-opik-u14",
      "stem": "Milline neist on füüsilisel kaardil kujutatav loodusobjekt?",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g014",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Füüsiline kaart keskendub loodusele, näiteks jõgedele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "jõgi"
          },
          {
            "id": "b",
            "text": "riigipiir"
          },
          {
            "id": "c",
            "text": "pealinn kui halduskeskus"
          },
          {
            "id": "d",
            "text": "maakonna valimisringkond"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q015",
      "unitId": "lo-opik-u14",
      "stem": "Vali kõik loodusobjektid, mida õpik nimetab füüsilise kaardi juures.",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g015",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Füüsiline kaart näitab järvi, mägesid, ookeane ja saari; poliitilise kaardi keskne teave on riigipiirid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "järved"
          },
          {
            "id": "b",
            "text": "mäed"
          },
          {
            "id": "c",
            "text": "ookeanid"
          },
          {
            "id": "d",
            "text": "saared"
          },
          {
            "id": "e",
            "text": "riigipiirid kui riikidevahelised kokkulepped"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c",
          "d"
        ]
      }
    },
    {
      "id": "lo-opik-u14-q016",
      "unitId": "lo-opik-u14",
      "stem": "Kuidas nimetatakse kaarti, mille põhiülesanne on näidata Maa loodust?",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g016",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Füüsiline kaart kujutab loodust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "füüsiline kaart"
          },
          {
            "id": "b",
            "text": "poliitiline kaart"
          },
          {
            "id": "c",
            "text": "rahvastikukaart"
          },
          {
            "id": "d",
            "text": "liikluskaart"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q017",
      "unitId": "lo-opik-u14",
      "stem": "Miks sobib füüsiline kaart jõgede uurimiseks?",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g013",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jõed on loodusobjektid ning füüsiline kaart toob need esile.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Sellel kujutatakse veekogusid ja pinnamoodi."
          },
          {
            "id": "b",
            "text": "Sellel näidatakse ainult riigipiire."
          },
          {
            "id": "c",
            "text": "Sellel antakse kõigi linnade rahvaarvud."
          },
          {
            "id": "d",
            "text": "Sellel näidatakse ainult valimistulemusi."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q018",
      "unitId": "lo-opik-u14",
      "stem": "Mis ühendab mäestikku, saart ja järve kaardil?",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g017",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Füüsiline kaart kujutab selliseid loodusobjekte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kõik on loodusega seotud geograafilised objektid."
          },
          {
            "id": "b",
            "text": "Kõik on riikide pealinnad."
          },
          {
            "id": "c",
            "text": "Kõik on ajaloolised sündmused."
          },
          {
            "id": "d",
            "text": "Kõik on sõidukite liigid."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q019",
      "unitId": "lo-opik-u14",
      "stem": "Rühmita nähtused: loodusobjekt või inimese määratud piir?",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g018",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jõgi, järv ja mägi on loodusobjektid. Riigipiir on inimese määratud piir.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "loodus",
            "text": "loodusobjekt"
          },
          {
            "id": "piir",
            "text": "riigipiir"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "jõgi"
          },
          {
            "id": "i2",
            "text": "järv"
          },
          {
            "id": "i3",
            "text": "mägi"
          },
          {
            "id": "i4",
            "text": "riikidevaheline piir"
          }
        ],
        "correctGroupByItem": {
          "i1": "loodus",
          "i2": "loodus",
          "i3": "loodus",
          "i4": "piir"
        }
      },
      "relatedObjectiveIds": [
        "lo-opik-u14-o3"
      ]
    },
    {
      "id": "lo-opik-u14-q020",
      "unitId": "lo-opik-u14",
      "stem": "Mida aitab füüsiline kaart uurida, kuid riikide kaart ei pruugi sama selgelt esile tuua?",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g019",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Füüsiline kaart toob esile loodusobjektid ning pinnamoe.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "pinnamoodi ja veekogusid"
          },
          {
            "id": "b",
            "text": "ainult riikide ametlikke nimesid"
          },
          {
            "id": "c",
            "text": "üksnes riigipiiride kuju"
          },
          {
            "id": "d",
            "text": "pealinnade halduslikku staatust"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q021",
      "unitId": "lo-opik-u14",
      "stem": "Puuduta joonisel kõrgete mägede ala.",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g020",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mäestik paikneb skeemi ülemises vasakpoolses osas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u14-physical-features",
        "correctRegionId": "mountains"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u14-physical-features"
      }
    },
    {
      "id": "lo-opik-u14-q022",
      "unitId": "lo-opik-u14",
      "stem": "Puuduta joonisel jõge.",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g021",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jõgi on sinise joonega kujutatud voolav veekogu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u14-physical-features",
        "correctRegionId": "river"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u14-physical-features"
      }
    },
    {
      "id": "lo-opik-u14-q023",
      "unitId": "lo-opik-u14",
      "stem": "Puuduta joonisel järve.",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g022",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Järv on maismaal asuv veekogu, mida kujutab sinine veepind.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u14-physical-features",
        "correctRegionId": "lake"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u14-physical-features"
      }
    },
    {
      "id": "lo-opik-u14-q024",
      "unitId": "lo-opik-u14",
      "stem": "Milline oleks sobiv allikas, et otsida, kus paikneb suur poolsaar?",
      "primaryObjectiveId": "lo-opik-u14-o2",
      "variantGroupId": "lo-opik-u14-g013",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Poolsaar on looduslik maismaavorm, mida saab otsida füüsiliselt kaardilt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "füüsiline kaart"
          },
          {
            "id": "b",
            "text": "üksnes telefoniraamat"
          },
          {
            "id": "c",
            "text": "rahvastiku tabel"
          },
          {
            "id": "d",
            "text": "mineviku sündmuste loend"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q025",
      "unitId": "lo-opik-u14",
      "stem": "Kuidas nimetatakse riikide kaarti teisiti?",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g023",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riikide kaart ja poliitiline kaart tähendavad selles õpikus sama.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "poliitiline kaart"
          },
          {
            "id": "b",
            "text": "mullastikukaart"
          },
          {
            "id": "c",
            "text": "füüsiline kaart"
          },
          {
            "id": "d",
            "text": "ilmakaart"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q026",
      "unitId": "lo-opik-u14",
      "stem": "Milline teave on riikide kaardil eriti oluline?",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g024",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Poliitiline kaart keskendub riikidele ja nende piiridele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "riikide piirid"
          },
          {
            "id": "b",
            "text": "jõgede sügavus"
          },
          {
            "id": "c",
            "text": "pinnase viljakus"
          },
          {
            "id": "d",
            "text": "liiklusõnnetuste arv"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q027",
      "unitId": "lo-opik-u14",
      "stem": "Mis asulad võivad olla riikide kaardile märgitud?",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g025",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riikide kaardil võib näha pealinnu ja muid suuremaid linnu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "pealinnad"
          },
          {
            "id": "b",
            "text": "ainult mahajäetud kaevandused"
          },
          {
            "id": "c",
            "text": "ainult mägikülad"
          },
          {
            "id": "d",
            "text": "ainult merel asuvad laevad"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q028",
      "unitId": "lo-opik-u14",
      "stem": "Vali kõik, mis on poliitilise kaardi tavapärane sisu.",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g026",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiirid, riigid ja sageli pealinnad on poliitilise kaardi põhiteave.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "riikide nimed"
          },
          {
            "id": "b",
            "text": "riigipiirid"
          },
          {
            "id": "c",
            "text": "pealinnad"
          },
          {
            "id": "d",
            "text": "iga põllu mullatüüp"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c"
        ]
      }
    },
    {
      "id": "lo-opik-u14-q029",
      "unitId": "lo-opik-u14",
      "stem": "Miks sobib poliitiline kaart naaberriikide leidmiseks?",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g027",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Naaberriikide leidmisel vaadatakse riikide ühiseid piire.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Seal on näidatud riigid ja nende piirid."
          },
          {
            "id": "b",
            "text": "Seal on alati vaid taimeliigid."
          },
          {
            "id": "c",
            "text": "Seal on ainult õhutemperatuur."
          },
          {
            "id": "d",
            "text": "Seal puuduvad kõik kohanimed."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q030",
      "unitId": "lo-opik-u14",
      "stem": "Riigipiir ja jõgi võivad kaardil mõlemad olla jooned. Kumb neist märgib riikidevahelist kokkulepitud piiri?",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g028",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiir eristab riike, jõgi on looduslik vooluveekogu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "riigipiir"
          },
          {
            "id": "b",
            "text": "jõgi"
          },
          {
            "id": "c",
            "text": "mäeahelik"
          },
          {
            "id": "d",
            "text": "järv"
          }
        ],
        "correctOptionId": "a"
      },
      "relatedObjectiveIds": [
        "lo-opik-u14-o4"
      ]
    },
    {
      "id": "lo-opik-u14-q031",
      "unitId": "lo-opik-u14",
      "stem": "Õige või vale? Poliitiline kaart võib lisaks piiridele näidata ka mõnda linna.",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g029",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku järgi võib riikide kaart näidata pealinnu ning suuremaid linnu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Õige"
          },
          {
            "id": "b",
            "text": "Vale"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q032",
      "unitId": "lo-opik-u14",
      "stem": "Mis vahe on riigipiiril ja pealinnal?",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g030",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiir on maa-alade eraldusjoon, pealinn on linn.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Piir eraldab riike, pealinn on asula."
          },
          {
            "id": "b",
            "text": "Pealinn on alati jõgi."
          },
          {
            "id": "c",
            "text": "Piir tähistab ainult metsa."
          },
          {
            "id": "d",
            "text": "Pealinn on riigist väljaspool olev manner."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q033",
      "unitId": "lo-opik-u14",
      "stem": "Puuduta skeemil riigipiiri.",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g031",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Katkendlik piirijoon eristab skeemi väljamõeldud riike.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u14-political-elements",
        "correctRegionId": "border"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u14-political-elements"
      }
    },
    {
      "id": "lo-opik-u14-q034",
      "unitId": "lo-opik-u14",
      "stem": "Puuduta skeemil pealinna märki.",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g032",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tähega on skeemil tähistatud väljamõeldud riigi pealinn.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u14-political-elements",
        "correctRegionId": "capital"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u14-political-elements"
      }
    },
    {
      "id": "lo-opik-u14-q035",
      "unitId": "lo-opik-u14",
      "stem": "Otsid Euroopa riikide nimesid ja piire. Milline kaardiliik sobib?",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g027",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riikide paiknemist uuritakse poliitiliselt kaardilt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Euroopa poliitiline kaart"
          },
          {
            "id": "b",
            "text": "ainult mullastikukaart"
          },
          {
            "id": "c",
            "text": "ainult jõgede kaart"
          },
          {
            "id": "d",
            "text": "Eesti metsanduskaart"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q036",
      "unitId": "lo-opik-u14",
      "stem": "Rühmita kaardimärgid: kas see on poliitilise kaardi keskne teave või mitte?",
      "primaryObjectiveId": "lo-opik-u14-o3",
      "variantGroupId": "lo-opik-u14-g033",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riikide kaardi teave on riigid, piirid ja pealinnad. Mullatüüp ning päikesepaiste kuuluvad teistele teemakaartidele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58–59"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "poliit",
            "text": "riikide kaardi põhiteave"
          },
          {
            "id": "muu",
            "text": "muu kaarditeema"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "riiginimi"
          },
          {
            "id": "i2",
            "text": "riigipiir"
          },
          {
            "id": "i3",
            "text": "pealinn"
          },
          {
            "id": "i4",
            "text": "mullatüüp"
          },
          {
            "id": "i5",
            "text": "päikesepaiste kestus"
          }
        ],
        "correctGroupByItem": {
          "i1": "poliit",
          "i2": "poliit",
          "i3": "poliit",
          "i4": "muu",
          "i5": "muu"
        }
      },
      "relatedObjectiveIds": [
        "lo-opik-u14-o6"
      ]
    },
    {
      "id": "lo-opik-u14-q037",
      "unitId": "lo-opik-u14",
      "stem": "Milline paar on õige?",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g034",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Füüsiline kaart näitab peamiselt loodust, poliitiline kaart riike ja piire.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "füüsiline kaart – loodus; poliitiline kaart – riigid"
          },
          {
            "id": "b",
            "text": "füüsiline kaart – riigid; poliitiline kaart – mullad"
          },
          {
            "id": "c",
            "text": "füüsiline kaart – liiklus; poliitiline kaart – ilm"
          },
          {
            "id": "d",
            "text": "füüsiline kaart – koolid; poliitiline kaart – meresügavused"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q038",
      "unitId": "lo-opik-u14",
      "stem": "Puuduta kaardipaari seda vaadet, mis toob esile mäed ja jõe.",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g035",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vasakpoolne vaade näitab loodust ehk on füüsilise kaardi näide.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u14-map-pair",
        "correctRegionId": "physical"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u14-map-pair"
      }
    },
    {
      "id": "lo-opik-u14-q039",
      "unitId": "lo-opik-u14",
      "stem": "Puuduta kaardipaari seda vaadet, mis on mõeldud riigipiiride uurimiseks.",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g036",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Parempoolne vaade näitab väljamõeldud riigipiire ja linnamärke.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u14-map-pair",
        "correctRegionId": "political"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u14-map-pair"
      }
    },
    {
      "id": "lo-opik-u14-q040",
      "unitId": "lo-opik-u14",
      "stem": "Sama maa-ala kujutatakse kahel kaardil. Miks need võivad näidata eri asju?",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g037",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardid võivad keskenduda loodusobjektidele või riigipiiridele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaardid on tehtud eri eesmärkide jaoks."
          },
          {
            "id": "b",
            "text": "Maa-ala peab iga päev muutma kuju."
          },
          {
            "id": "c",
            "text": "Ühel kaardil ei tohi olla teksti."
          },
          {
            "id": "d",
            "text": "Ühel kaardil ei saa olla värve."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q041",
      "unitId": "lo-opik-u14",
      "stem": "Ühenda kaardiliik sellega, mida sellelt eelkõige uurid.",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g034",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Füüsiline kaart annab looduse, poliitiline kaart riigijaotuse ülevaate.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "füüsiline kaart"
          },
          {
            "id": "p2",
            "text": "poliitiline kaart"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "mäed, järved ja jõed"
          },
          {
            "id": "c2",
            "text": "riigid, piirid ja pealinnad"
          },
          {
            "id": "x1",
            "text": "terviseandmed igas haiglas"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2"
        }
      }
    },
    {
      "id": "lo-opik-u14-q042",
      "unitId": "lo-opik-u14",
      "stem": "Rühmita nimetused selle järgi, millisele kaardile need eelkõige kuuluvad.",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g038",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mäed ja veekogud on loodusobjektid; riigid ja pealinnad on poliitilise kaardi teave.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "f",
            "text": "füüsiline"
          },
          {
            "id": "p",
            "text": "poliitiline"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "mäestik"
          },
          {
            "id": "i2",
            "text": "madalik"
          },
          {
            "id": "i3",
            "text": "ookean"
          },
          {
            "id": "i4",
            "text": "riigipiir"
          },
          {
            "id": "i5",
            "text": "pealinn"
          },
          {
            "id": "i6",
            "text": "naaberriigi nimi"
          }
        ],
        "correctGroupByItem": {
          "i1": "f",
          "i2": "f",
          "i3": "f",
          "i4": "p",
          "i5": "p",
          "i6": "p"
        }
      }
    },
    {
      "id": "lo-opik-u14-q043",
      "unitId": "lo-opik-u14",
      "stem": "Õige või vale? Füüsiline ja poliitiline kaart võivad kujutada ühte ja sama piirkonda.",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g039",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sama piirkonda saab kujutada mitmesuguse eesmärgiga kaartidel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Õige"
          },
          {
            "id": "b",
            "text": "Vale"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q044",
      "unitId": "lo-opik-u14",
      "stem": "Miks ei ole õige väita, et füüsilisel kaardil ei saa mitte kunagi olla linna nime?",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g040",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi liiki määrab põhiline kujutatud teema; muud märgid pole välistatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaart võib sisaldada ka muud teavet, kuigi keskendub loodusele."
          },
          {
            "id": "b",
            "text": "Kõik kaardid on identsed."
          },
          {
            "id": "c",
            "text": "Linnad on veekogud."
          },
          {
            "id": "d",
            "text": "Riike pole olemas."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q045",
      "unitId": "lo-opik-u14",
      "stem": "Marta uurib piirkonna mägesid, Jaan aga selle riigipiire. Kumba kaarti kummale soovitad?",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g041",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mäestikud on füüsilisel kaardil, piirid poliitilisel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Marta – füüsiline; Jaan – poliitiline."
          },
          {
            "id": "b",
            "text": "Marta – poliitiline; Jaan – mullastiku."
          },
          {
            "id": "c",
            "text": "Mõlemale ainult rahvastikukaart."
          },
          {
            "id": "d",
            "text": "Mõlemale ainult ajalookaart."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q046",
      "unitId": "lo-opik-u14",
      "stem": "Kaardi peal on mäeahelikud, jõed ja järved eriti rõhutatult. Milline on selle kaardi põhieesmärk?",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g035",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mäed, jõed ja järved on looduse elemendid; tegemist on füüsilise kaardi eesmärgiga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "looduse kujutamine"
          },
          {
            "id": "b",
            "text": "riigipiiride võrdlemine"
          },
          {
            "id": "c",
            "text": "elanike arvu võrdlemine"
          },
          {
            "id": "d",
            "text": "liiklusõnnetuste kujutamine"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q047",
      "unitId": "lo-opik-u14",
      "stem": "Kaardil on riigid eri värvidega ja nende vahel selged piirijooned. Mis tüüpi kaardiga on kõige tõenäolisemalt tegemist?",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g036",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigid ja piirid on poliitilise kaardi keskne teave.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "poliitilise kaardiga"
          },
          {
            "id": "b",
            "text": "mullastikukaardiga"
          },
          {
            "id": "c",
            "text": "päikesepaiste kaardiga"
          },
          {
            "id": "d",
            "text": "järvede sügavuste kaardiga"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q048",
      "unitId": "lo-opik-u14",
      "stem": "Vali kõik väited, mis selgitavad õigesti kahe kaardi erinevust.",
      "primaryObjectiveId": "lo-opik-u14-o4",
      "variantGroupId": "lo-opik-u14-g042",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Loodusobjektid ja riigipiirid on erinevad põhiteemad; mõlemat saab kujutada sama ala kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "Füüsiline kaart aitab otsida pinnamoodi."
          },
          {
            "id": "b",
            "text": "Poliitiline kaart aitab leida naaberriike."
          },
          {
            "id": "c",
            "text": "Samast piirkonnast võib koostada mõlemad."
          },
          {
            "id": "d",
            "text": "Poliitiline kaart peab näitama iga mäe kõrgust."
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c"
        ]
      }
    },
    {
      "id": "lo-opik-u14-q049",
      "unitId": "lo-opik-u14",
      "stem": "Mis on atlas?",
      "primaryObjectiveId": "lo-opik-u14-o5",
      "variantGroupId": "lo-opik-u14-g043",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlas on kaardiraamat ehk kaartide kogumik.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "kaardiraamat"
          },
          {
            "id": "b",
            "text": "üksainus liiklusmärk"
          },
          {
            "id": "c",
            "text": "kompassinõel"
          },
          {
            "id": "d",
            "text": "ilmatermomeeter"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q050",
      "unitId": "lo-opik-u14",
      "stem": "Millised kaardid võivad atlases olla?",
      "primaryObjectiveId": "lo-opik-u14-o5",
      "variantGroupId": "lo-opik-u14-g044",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlas sisaldab erinevaid kaarte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "füüsilised kaardid"
          },
          {
            "id": "b",
            "text": "poliitilised kaardid"
          },
          {
            "id": "c",
            "text": "rahvastikukaardid"
          },
          {
            "id": "d",
            "text": "ainult sõnadeta tühjad lehed"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c"
        ]
      }
    },
    {
      "id": "lo-opik-u14-q051",
      "unitId": "lo-opik-u14",
      "stem": "Milline sõna tähendab selles peatükis kaardiraamatut?",
      "primaryObjectiveId": "lo-opik-u14-o5",
      "variantGroupId": "lo-opik-u14-g043",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku mõiste on atlas = kaardiraamat.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "atlas"
          },
          {
            "id": "b",
            "text": "ilmakaart"
          },
          {
            "id": "c",
            "text": "mõõtkava"
          },
          {
            "id": "d",
            "text": "riigipiir"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q052",
      "unitId": "lo-opik-u14",
      "stem": "Miks on atlasest sageli rohkem teavet leida kui ühest kaardist?",
      "primaryObjectiveId": "lo-opik-u14-o5",
      "variantGroupId": "lo-opik-u14-g045",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eri kaardid annavad samast või eri piirkondadest mitut liiki teavet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Seal on eri teemade jaoks mitu kaarti."
          },
          {
            "id": "b",
            "text": "Seal on alati ainult riigipiirid."
          },
          {
            "id": "c",
            "text": "Kõik kaardid näitavad täpselt sama."
          },
          {
            "id": "d",
            "text": "Atlases ei ole kaarte."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q053",
      "unitId": "lo-opik-u14",
      "stem": "Miks on atlases kasulik hoida eri teemade kaarte eraldi?",
      "primaryObjectiveId": "lo-opik-u14-o5",
      "variantGroupId": "lo-opik-u14-g045",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eri teabekihtide eraldi esitamine teeb otsimise lihtsamaks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Ühel kaardil ei pea kõiki andmeid kokku kuhjama."
          },
          {
            "id": "b",
            "text": "Kaardid peavad olema ilma pealkirjata."
          },
          {
            "id": "c",
            "text": "Loodus ja riigid ei saa kunagi ühel lehel olla."
          },
          {
            "id": "d",
            "text": "Kõik kohanimed peavad kaduma."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q054",
      "unitId": "lo-opik-u14",
      "stem": "Õige või vale? Atlases võib olla nii Euroopa füüsiline kaart kui ka Euroopa riikide kaart.",
      "primaryObjectiveId": "lo-opik-u14-o5",
      "variantGroupId": "lo-opik-u14-g044",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlas sisaldab mitut liiki kaarte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Õige"
          },
          {
            "id": "b",
            "text": "Vale"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q055",
      "unitId": "lo-opik-u14",
      "stem": "Millest sõltub see, millise atlase kaardi avad?",
      "primaryObjectiveId": "lo-opik-u14-o5",
      "variantGroupId": "lo-opik-u14-g013",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Küsimus määrab, millist kaarti vajad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "sellest, mida teada tahan"
          },
          {
            "id": "b",
            "text": "ainult kaardi lehe värvist"
          },
          {
            "id": "c",
            "text": "ainult atlase kaane paksusest"
          },
          {
            "id": "d",
            "text": "ainult sellest, kas kaardil on palju teksti"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q056",
      "unitId": "lo-opik-u14",
      "stem": "Tee sobiv tegevuste järjekord atlasest vastuse otsimisel.",
      "primaryObjectiveId": "lo-opik-u14-o5",
      "variantGroupId": "lo-opik-u14-g047",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Küsimus tuleb enne kaardi valikut; seejärel loetakse kaarti ja leitakse vastus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Mõtle, mida tahad teada."
          },
          {
            "id": "s2",
            "text": "Leia atlasest sobiva teemaga kaart."
          },
          {
            "id": "s3",
            "text": "Loe pealkirja ja tingmärke."
          },
          {
            "id": "s4",
            "text": "Otsi kaardilt vastus."
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3",
          "s4"
        ],
        "firstLabel": "Esimene",
        "lastLabel": "Viimane"
      }
    },
    {
      "id": "lo-opik-u14-q057",
      "unitId": "lo-opik-u14",
      "stem": "Õpilane soovib leida atlase abil Euroopa kõrgeid mägesid. Millise lehekülje peaks ta avama?",
      "primaryObjectiveId": "lo-opik-u14-o5",
      "variantGroupId": "lo-opik-u14-g013",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõrged mäed on loodusobjektid, seega sobib füüsiline kaart.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Euroopa füüsilise kaardi"
          },
          {
            "id": "b",
            "text": "Euroopa riikide piiride loendi"
          },
          {
            "id": "c",
            "text": "Eesti liiklusõnnetuste kaardi"
          },
          {
            "id": "d",
            "text": "Eesti koolide paiknemise kaardi"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q058",
      "unitId": "lo-opik-u14",
      "stem": "Kaks õpilast avavad atlases eri kaardid sama piirkonna kohta. Üks uurib mägesid, teine riike. Milline järeldus on õige?",
      "primaryObjectiveId": "lo-opik-u14-o5",
      "variantGroupId": "lo-opik-u14-g048",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üks atlas võib sisaldada sama maa-ala füüsilist ja poliitilist kaarti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Samast alast saab atlasest eri teavet."
          },
          {
            "id": "b",
            "text": "Üks kaart peab kindlasti vale olema."
          },
          {
            "id": "c",
            "text": "Atlases ei tohi sama ala korduda."
          },
          {
            "id": "d",
            "text": "Kõigil kaartidel peab olema sama teema."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q059",
      "unitId": "lo-opik-u14",
      "stem": "Ühenda atlasest otsitav teave sobiva kaardilehega.",
      "primaryObjectiveId": "lo-opik-u14-o5",
      "variantGroupId": "lo-opik-u14-g048",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardiraamatu eri kaardilehed vastavad eri küsimustele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "mäestikud"
          },
          {
            "id": "p2",
            "text": "riigipiirid"
          },
          {
            "id": "p3",
            "text": "elanike arv"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "füüsiline kaart"
          },
          {
            "id": "c2",
            "text": "poliitiline kaart"
          },
          {
            "id": "c3",
            "text": "rahvastikukaart"
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
      "id": "lo-opik-u14-q060",
      "unitId": "lo-opik-u14",
      "stem": "Mis on rahvastikukaardi üks ülesanne?",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g049",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku järgi annab rahvastikukaart ülevaate elanike arvust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Näidata, kui palju inimesi piirkondades elab."
          },
          {
            "id": "b",
            "text": "Näidata üksnes riigipiire."
          },
          {
            "id": "c",
            "text": "Näidata ainult järvede sügavust."
          },
          {
            "id": "d",
            "text": "Näidata ainult kivimite koostist."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q061",
      "unitId": "lo-opik-u14",
      "stem": "Milline kaart kujutab minevikus toimunud sündmusi?",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g050",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ajalookaart kujutab minevikku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "ajalookaart"
          },
          {
            "id": "b",
            "text": "ilmakaart"
          },
          {
            "id": "c",
            "text": "mullastikukaart"
          },
          {
            "id": "d",
            "text": "füüsiline kaart"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q062",
      "unitId": "lo-opik-u14",
      "stem": "Milliselt kaardilt võib otsida viljakamaid muldi?",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g051",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mullastikukaardil näidatakse muldade paiknemist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "mullastikukaardilt"
          },
          {
            "id": "b",
            "text": "poliitiliselt kaardilt"
          },
          {
            "id": "c",
            "text": "rahvastikukaardilt"
          },
          {
            "id": "d",
            "text": "mereteede kaardilt"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q063",
      "unitId": "lo-opik-u14",
      "stem": "Milliselt kaardilt saab uurida, kus on rohkem liiklusõnnetusi?",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g052",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Liikluskaart võib näidata liikluskoormust ja õnnetusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "liikluskaardilt"
          },
          {
            "id": "b",
            "text": "ajalookaardilt"
          },
          {
            "id": "c",
            "text": "poliitiliselt kaardilt"
          },
          {
            "id": "d",
            "text": "ookeanide kaardilt"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q064",
      "unitId": "lo-opik-u14",
      "stem": "Milline kaart aitab uurida, kus päike paistab kauem?",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g053",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Päikesepaiste kestust saab kujutada eraldi kaardil.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "päikesepaiste kestuse kaart"
          },
          {
            "id": "b",
            "text": "riikide kaart"
          },
          {
            "id": "c",
            "text": "mullastikukaart"
          },
          {
            "id": "d",
            "text": "ajalookaart"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q065",
      "unitId": "lo-opik-u14",
      "stem": "Vali kõik õpikus näiteks toodud kaarditeemad.",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g054",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab loomastiku, mesinduse, marjakasvatuse ja metsanduse kaartide võimalikkust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "loomastik"
          },
          {
            "id": "b",
            "text": "mesindus"
          },
          {
            "id": "c",
            "text": "marjakasvatus"
          },
          {
            "id": "d",
            "text": "metsandus"
          },
          {
            "id": "e",
            "text": "ühesugune kohustuslik kaart igaks ülesandeks"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c",
          "d"
        ]
      }
    },
    {
      "id": "lo-opik-u14-q066",
      "unitId": "lo-opik-u14",
      "stem": "Mis on ajalookaardi ja tänapäevase poliitilise kaardi peamine erinevus?",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g055",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ajalookaardi eesmärk on kujutada minevikku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Ajalookaart võib näidata endisi piire ja sündmusi."
          },
          {
            "id": "b",
            "text": "Ajalookaart näitab alati homset ilma."
          },
          {
            "id": "c",
            "text": "Poliitiline kaart näitab ainult muldi."
          },
          {
            "id": "d",
            "text": "Nendel kaartidel ei ole kunagi teavet."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q067",
      "unitId": "lo-opik-u14",
      "stem": "Miks ei ole rahvastikukaart ja füüsiline kaart sama otstarbega?",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g056",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rahvastikukaardi põhiteema on elanike arv, füüsilisel kaardil loodus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Üks keskendub inimestele, teine loodusele."
          },
          {
            "id": "b",
            "text": "Mõlemad näitavad ainult riigipiire."
          },
          {
            "id": "c",
            "text": "Rahvastikukaart ei saa näidata asukohti."
          },
          {
            "id": "d",
            "text": "Füüsiline kaart näitab alati elanike palka."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q068",
      "unitId": "lo-opik-u14",
      "stem": "Ühenda kaardiliik ja sellele iseloomulik teave.",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g057",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eri teemakaardid kirjeldavad eri nähtusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "ajalookaart"
          },
          {
            "id": "p2",
            "text": "mullastikukaart"
          },
          {
            "id": "p3",
            "text": "liikluskaart"
          },
          {
            "id": "p4",
            "text": "rahvastikukaart"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "kunagised maakonnapiirid"
          },
          {
            "id": "c2",
            "text": "muldade paiknemine"
          },
          {
            "id": "c3",
            "text": "autode hulk eri teedel"
          },
          {
            "id": "c4",
            "text": "elanike arv piirkonnas"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2",
          "p3": "c3",
          "p4": "c4"
        }
      }
    },
    {
      "id": "lo-opik-u14-q069",
      "unitId": "lo-opik-u14",
      "stem": "Rühmita nimetused selle järgi, kas kaart räägib inimestest ja ühiskonnast või looduskeskkonnast.",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g058",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rahvastik, liiklus ja koolid on inimeste tegevusega seotud; muld ja loomastik looduskeskkonnaga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "i",
            "text": "inimeste tegevus või rahvastik"
          },
          {
            "id": "l",
            "text": "looduskeskkond"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "elanike arv"
          },
          {
            "id": "i2",
            "text": "liiklusvoog"
          },
          {
            "id": "i3",
            "text": "koolide paiknemine"
          },
          {
            "id": "i4",
            "text": "mullatüübid"
          },
          {
            "id": "i5",
            "text": "loomastiku paiknemine"
          }
        ],
        "correctGroupByItem": {
          "i1": "i",
          "i2": "i",
          "i3": "i",
          "i4": "l",
          "i5": "l"
        }
      }
    },
    {
      "id": "lo-opik-u14-q070",
      "unitId": "lo-opik-u14",
      "stem": "Milline väide näitab õigesti, et kaart ei pea kujutama vaid silmaga nähtavaid asju?",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g059",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Andmeid, näiteks õnnetuste hulka, saab kujutada kaartidel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaardile võib kanda ka liiklusõnnetuste arvu."
          },
          {
            "id": "b",
            "text": "Kaardile ei saa kanda ühtegi arvu."
          },
          {
            "id": "c",
            "text": "Kõik kaardid on ainult mägedest."
          },
          {
            "id": "d",
            "text": "Kaardid näitavad vaid üksikuid puid."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q071",
      "unitId": "lo-opik-u14",
      "stem": "Kas atlas võib sisaldada nii muldade kui ka koolide paiknemise kaarte?",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g054",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik ütleb, et kaardi võib teha peaaegu ükskõik millise ruumiliselt kujutatava nähtuse kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Jah, kaartide teemad võivad olla väga erinevad."
          },
          {
            "id": "b",
            "text": "Ei, ainult mäed on lubatud."
          },
          {
            "id": "c",
            "text": "Ei, koolide asukohti pole võimalik kujutada."
          },
          {
            "id": "d",
            "text": "Ei, atlas on üksainus maakaart."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q072",
      "unitId": "lo-opik-u14",
      "stem": "Õpiku näitel kujutatakse kaardil Eesti maakondi umbes 800 aastat tagasi. Millist kaardiliiki see illustreerib?",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g050",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mineviku maakonnapiiride kaardil on ajalooline teema.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "ajalookaarti"
          },
          {
            "id": "b",
            "text": "homset ilmakaarti"
          },
          {
            "id": "c",
            "text": "liikluskaarti"
          },
          {
            "id": "d",
            "text": "füüsilist kõrguskaarti"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q073",
      "unitId": "lo-opik-u14",
      "stem": "Teadlane tahab võrrelda muldade paiknemist kahes piirkonnas. Mis liiki andmeid ta vajab?",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g051",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mullastikuandmed aitavad uurida muldade erinevusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "mullastikuandmeid"
          },
          {
            "id": "b",
            "text": "ainult riigipiiride nimesid"
          },
          {
            "id": "c",
            "text": "ainult ajaloolisi lahinguid"
          },
          {
            "id": "d",
            "text": "ainult lennuliine"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q074",
      "unitId": "lo-opik-u14",
      "stem": "Vali kõik näited, mida võiks kujutada teemakaardil.",
      "primaryObjectiveId": "lo-opik-u14-o6",
      "variantGroupId": "lo-opik-u14-g060",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui nähtusel on geograafiline paiknemine, saab selle kohta koostada teemakaardi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "koolide paiknemine"
          },
          {
            "id": "b",
            "text": "metsa levik"
          },
          {
            "id": "c",
            "text": "autode hulk teedel"
          },
          {
            "id": "d",
            "text": "eri paikade päikesepaiste kestus"
          },
          {
            "id": "e",
            "text": "väide, millel puudub igasugune asukoht"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c",
          "d"
        ]
      }
    },
    {
      "id": "lo-opik-u14-q075",
      "unitId": "lo-opik-u14",
      "stem": "Milline kaart aitab eelkõige leida riikide pealinnu?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g025",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Poliitilisel kaardil võib näha pealinnu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "58"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "poliitiline kaart"
          },
          {
            "id": "b",
            "text": "mullastikukaart"
          },
          {
            "id": "c",
            "text": "päikesepaiste kaart"
          },
          {
            "id": "d",
            "text": "loomastikukaart"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q076",
      "unitId": "lo-opik-u14",
      "stem": "Kui tahad teada, kui palju inimesi piirkonnas elab, miks on rahvastikukaart sobivaim?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g049",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rahvastikukaart on loodud elanike andmete kujutamiseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "See käsitleb elanike arvu ja paiknemist."
          },
          {
            "id": "b",
            "text": "See näitab ainult mere sügavust."
          },
          {
            "id": "c",
            "text": "See koosneb ainult riigipiiridest."
          },
          {
            "id": "d",
            "text": "See ei näita ühtki piirkonda."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q077",
      "unitId": "lo-opik-u14",
      "stem": "Miks ei pruugi mullastikukaart vastata küsimusele, kus on kõige pikemad jõed?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g063",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jõgede otsimiseks sobib füüsiline kaart, muldade uurimiseks mullastikukaart.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaardid keskenduvad eri teemadele."
          },
          {
            "id": "b",
            "text": "Mullastikukaart ei saa sisaldada värve."
          },
          {
            "id": "c",
            "text": "Jõed ei paikne Maa peal."
          },
          {
            "id": "d",
            "text": "Kõik kaardid on ühe otstarbega."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q078",
      "unitId": "lo-opik-u14",
      "stem": "Vali kõik õiged küsimuse ja kaardi paarid.",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g064",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mäed, piirid, minevik ja mullad vajavad erinevat kaartide teavet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "kõrge mägi – füüsiline kaart"
          },
          {
            "id": "b",
            "text": "riigipiir – poliitiline kaart"
          },
          {
            "id": "c",
            "text": "kunagine maakonnapiir – ajalookaart"
          },
          {
            "id": "d",
            "text": "viljakamad mullad – mullastikukaart"
          },
          {
            "id": "e",
            "text": "homne sadu – ajalookaart"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c",
          "d"
        ]
      }
    },
    {
      "id": "lo-opik-u14-q079",
      "unitId": "lo-opik-u14",
      "stem": "Matkaja tahab teada, millises piirkonnas paiknevad mäestikud. Millist kaarti soovitad?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g013",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mäestike asukohta leiab füüsiliselt kaardilt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "füüsilist kaarti"
          },
          {
            "id": "b",
            "text": "rahvastikukaarti"
          },
          {
            "id": "c",
            "text": "poliitilist kaarti üksnes riigipiiridega"
          },
          {
            "id": "d",
            "text": "koolide kaarti"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q080",
      "unitId": "lo-opik-u14",
      "stem": "Õpilane küsib: „Millised riigid piirnevad üksteisega?” Mis kaart annab parima vastuse?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g027",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Naaberriike saab leida riigipiire kujutavalt kaardilt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "poliitiline kaart"
          },
          {
            "id": "b",
            "text": "ilmakaart"
          },
          {
            "id": "c",
            "text": "liikluskaart"
          },
          {
            "id": "d",
            "text": "mullastikukaart"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q081",
      "unitId": "lo-opik-u14",
      "stem": "Ajaloolane võrdleb tänapäevaseid ja sajanditetaguseid maakonnapiire. Milliseid kaarte tal vaja on?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g067",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mineviku ja tänapäeva piiride võrdlemiseks on vaja eri aegade kaarte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "ajalookaarte ja tänapäevast piiride kaarti"
          },
          {
            "id": "b",
            "text": "ainult tänast ilmakaarti"
          },
          {
            "id": "c",
            "text": "ainult järvede sügavuste kaarti"
          },
          {
            "id": "d",
            "text": "ainult mullastikukaarti"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q082",
      "unitId": "lo-opik-u14",
      "stem": "Aednik tahab teada, kus paiknevad viljakamad mullad. Millise kaardi ta valib?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g051",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mullastikukaart aitab muldi uurida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "mullastikukaardi"
          },
          {
            "id": "b",
            "text": "riikide kaardi"
          },
          {
            "id": "c",
            "text": "ajalookaardi"
          },
          {
            "id": "d",
            "text": "rahvastikukaardi"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q083",
      "unitId": "lo-opik-u14",
      "stem": "Liikluskorraldaja otsib teid, kus sõidab kõige rohkem autosid. Mida ta uurib?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g052",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Liikluskaardilt võib näha autode hulka eri teedel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "liikluskaarti"
          },
          {
            "id": "b",
            "text": "metsakaarti"
          },
          {
            "id": "c",
            "text": "ajalookaarti"
          },
          {
            "id": "d",
            "text": "poliitilist kaarti"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q084",
      "unitId": "lo-opik-u14",
      "stem": "Päikeseenergiast huvitatud õpilane küsib, kus on aasta jooksul kauem päikest. Millise kaardi valib?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g053",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Päikesepaiste kestuse kaart näitab eri piirkondade päikesepaistet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "päikesepaiste kestuse kaardi"
          },
          {
            "id": "b",
            "text": "riigipiiride kaardi"
          },
          {
            "id": "c",
            "text": "mullastikukaardi"
          },
          {
            "id": "d",
            "text": "laevateede kaardi"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q085",
      "unitId": "lo-opik-u14",
      "stem": "Õpilased uurivad, kus elab kõige rohkem inimesi. Milline kaart sobib neile?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g049",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rahvastikukaart kujutab elanike arvu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "rahvastikukaart"
          },
          {
            "id": "b",
            "text": "füüsiline kaart ainult mägedega"
          },
          {
            "id": "c",
            "text": "mullastikukaart"
          },
          {
            "id": "d",
            "text": "ajalookaart"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q086",
      "unitId": "lo-opik-u14",
      "stem": "Loodusuurija otsib kaarti, mis näitab, kus elavad eri loomaliigid. Milline teema sobib?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g071",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab loomastiku kohta koostatavaid kaarte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "loomastik"
          },
          {
            "id": "b",
            "text": "riigipiirid"
          },
          {
            "id": "c",
            "text": "liiklusõnnetused"
          },
          {
            "id": "d",
            "text": "pealinnad"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q087",
      "unitId": "lo-opik-u14",
      "stem": "Uus õpetaja tahab teada, kus piirkondades paiknevad koolid. Mis teemaga kaart sobib?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g072",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Koolide paiknemist saab ruumis kujutada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "koolide paiknemise kaart"
          },
          {
            "id": "b",
            "text": "ainult mäeahelike kaart"
          },
          {
            "id": "c",
            "text": "ainult järvede kaart"
          },
          {
            "id": "d",
            "text": "ainult ajalooliste piiride kaart"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q088",
      "unitId": "lo-opik-u14",
      "stem": "Reisija uurib samal ajal nii riigipiire kui ka mäestikke. Milline lahendus on kõige mõistlikum?",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g073",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eri teabe jaoks on kasulik võrrelda mitut kaarti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Võrdlen poliitilist ja füüsilist kaarti."
          },
          {
            "id": "b",
            "text": "Vaatan ainult mullastikukaarti."
          },
          {
            "id": "c",
            "text": "Eeldan, et kõik kaardid annavad sama vastuse."
          },
          {
            "id": "d",
            "text": "Ei kasuta ühtegi kaarti."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q089",
      "unitId": "lo-opik-u14",
      "stem": "Vali sobivate kaartide kasutamise õige järjekord.",
      "primaryObjectiveId": "lo-opik-u14-o7",
      "variantGroupId": "lo-opik-u14-g047",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õige tööjärjekord algab küsimuse määratlemisest ja lõpeb andmete lugemisega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Sõnastan küsimuse."
          },
          {
            "id": "s2",
            "text": "Valin kaardiliigi."
          },
          {
            "id": "s3",
            "text": "Vaatan pealkirja ja legendi."
          },
          {
            "id": "s4",
            "text": "Loen kaardilt vastuse."
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3",
          "s4"
        ],
        "firstLabel": "Esimene",
        "lastLabel": "Viimane"
      }
    },
    {
      "id": "lo-opik-u14-q090",
      "unitId": "lo-opik-u14",
      "stem": "Mida tähendab harjutuskaardi pealkiri „Elanike arv piirkondades”?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g075",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pealkiri ütleb, milliseid andmeid kaart kujutab.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaart näitab elanike arvu."
          },
          {
            "id": "b",
            "text": "Kaart näitab pinnamoe kõrgust."
          },
          {
            "id": "c",
            "text": "Kaart näitab riigipiire."
          },
          {
            "id": "d",
            "text": "Kaart näitab järvede sügavust."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u14-population-map"
      }
    },
    {
      "id": "lo-opik-u14-q091",
      "unitId": "lo-opik-u14",
      "stem": "Mille järgi saad teada, mida teatud värv kaardil tähendab?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g076",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Legend selgitab kaardi värvide ja märkide tähendusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52–53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "kaardi legendi järgi"
          },
          {
            "id": "b",
            "text": "kaardi kõrval oleva tühja lehe järgi"
          },
          {
            "id": "c",
            "text": "ainult kaardipaberi suuruse järgi"
          },
          {
            "id": "d",
            "text": "ainult riigi suuruse järgi"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q092",
      "unitId": "lo-opik-u14",
      "stem": "Harjutuskaardil on piirkonnas B 9 000 elanikku. Mida näitab arv 9 000?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g077",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi teema on elanike arv, mitte veekogud ega piirid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "B piirkonna elanike arvu"
          },
          {
            "id": "b",
            "text": "B piirkonna järvede arvu"
          },
          {
            "id": "c",
            "text": "B riigipiiri pikkust"
          },
          {
            "id": "d",
            "text": "B mere sügavust"
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "caption": "Väljamõeldud kolme piirkonna elanike arv",
        "headers": [
          "Piirkond",
          "Elanike arv"
        ],
        "rows": [
          [
            "A",
            "4 000"
          ],
          [
            "B",
            "9 000"
          ],
          [
            "C",
            "6 000"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u14-q093",
      "unitId": "lo-opik-u14",
      "stem": "Miks ei saa rahvastikukaardi elanike arvust üksinda teada, kus muld on kõige viljakam?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g078",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Viljakamate muldade jaoks on vaja mullastikuandmeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Rahvastikukaart ei anna selle kohta andmeid."
          },
          {
            "id": "b",
            "text": "Kõigil inimestel on samasugune muld."
          },
          {
            "id": "c",
            "text": "Viljakust näitab alati elanike arv."
          },
          {
            "id": "d",
            "text": "Mullad asuvad ainult linnades."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q094",
      "unitId": "lo-opik-u14",
      "stem": "Kui värvide tähendus on igal kaardil legendis selgitatud, miks ei tohi tumedat värvi alati ühtmoodi tõlgendada?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g076",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Värvide tähenduse määrab konkreetse kaardi legend.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Erinevatel kaartidel võib värv tähendada erinevat asja."
          },
          {
            "id": "b",
            "text": "Tume värv tähistab alati pealinna."
          },
          {
            "id": "c",
            "text": "Tume värv tähistab alati mäge."
          },
          {
            "id": "d",
            "text": "Tume värv pole kaartidel kunagi lubatud."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q095",
      "unitId": "lo-opik-u14",
      "stem": "Kaardil on inimeste arv, teisel kaardil liiklus. Mida saad kahe kaardi kohta järeldada?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g079",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Teemakaardil tuleb alati arvestada, milline nähtus on kaardil kujutatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Need kujutavad eri teemasid."
          },
          {
            "id": "b",
            "text": "Neist kumbki ei ole kaart."
          },
          {
            "id": "c",
            "text": "Mõlemad näitavad tingimata riigipiire."
          },
          {
            "id": "d",
            "text": "Andmed tähendavad kindlasti sama."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q096",
      "unitId": "lo-opik-u14",
      "stem": "Miks tuleb ajalookaardi juures vaadata, millist aega see kujutab?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g055",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ajaloolised kaardid kujutavad minevikku; praegused piirid võivad erineda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Piirid ja muud nähtused võivad aja jooksul muutuda."
          },
          {
            "id": "b",
            "text": "Ajalookaardil ei tohi olla nimesid."
          },
          {
            "id": "c",
            "text": "Tänapäeva riigid on alati püsinud muutumatuna."
          },
          {
            "id": "d",
            "text": "Kaardi aeg ei mõjuta midagi."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u14-q097",
      "unitId": "lo-opik-u14",
      "stem": "Mida võimaldab väljamõeldud piirkondade A, B ja C rahvastikukaart kindlalt võrrelda?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g081",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardil on antud elanike arvud 4 000, 9 000 ja 6 000.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "elanike arvu"
          },
          {
            "id": "b",
            "text": "muldade viljakust"
          },
          {
            "id": "c",
            "text": "järvede sügavust"
          },
          {
            "id": "d",
            "text": "riigipiiride vanust"
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "caption": "Väljamõeldud kolme piirkonna elanike arv",
        "headers": [
          "Piirkond",
          "Elanike arv"
        ],
        "rows": [
          [
            "A",
            "4 000"
          ],
          [
            "B",
            "9 000"
          ],
          [
            "C",
            "6 000"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u14-q098",
      "unitId": "lo-opik-u14",
      "stem": "Puuduta joonisel piirkonda, kus elab kõige rohkem inimesi.",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g082",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõige rohkem inimesi elab B-s: 9 000. See on harjutuse väljamõeldud andmestik.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u14-population-map",
        "correctRegionId": "b"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u14-population-map"
      }
    },
    {
      "id": "lo-opik-u14-q099",
      "unitId": "lo-opik-u14",
      "stem": "Puuduta joonisel piirkonda, kus elab kõige vähem inimesi.",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g082",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõige vähem inimesi elab A-s: 4 000.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u14-population-map",
        "correctRegionId": "a"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u14-population-map"
      }
    },
    {
      "id": "lo-opik-u14-q100",
      "unitId": "lo-opik-u14",
      "stem": "Puuduta joonisel piirkonda, kus elab rohkem inimesi kui A-s, kuid vähem kui B-s.",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g082",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Piirkonnas C elab 6 000 inimest, mis jääb 4 000 ja 9 000 vahele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u14-population-map",
        "correctRegionId": "c"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u14-population-map"
      }
    },
    {
      "id": "lo-opik-u14-q101",
      "unitId": "lo-opik-u14",
      "stem": "Järjesta väljamõeldud piirkonnad elanike arvu järgi väiksemast suuremani.",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g082",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "4 000 < 6 000 < 9 000, seega järjekord A, C, B.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "A: 4 000"
          },
          {
            "id": "s2",
            "text": "C: 6 000"
          },
          {
            "id": "s3",
            "text": "B: 9 000"
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3"
        ],
        "firstLabel": "Väikseim elanike arv",
        "lastLabel": "Suurim elanike arv"
      },
      "context": {
        "kind": "table",
        "caption": "Väljamõeldud kolme piirkonna elanike arv",
        "headers": [
          "Piirkond",
          "Elanike arv"
        ],
        "rows": [
          [
            "A",
            "4 000"
          ],
          [
            "B",
            "9 000"
          ],
          [
            "C",
            "6 000"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u14-q102",
      "unitId": "lo-opik-u14",
      "stem": "Millises väljamõeldud piirkonnas elab täpselt 6 000 inimest?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g082",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tabelis on C piirkonna elanike arv 6 000.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "A"
          },
          {
            "id": "b",
            "text": "B"
          },
          {
            "id": "c",
            "text": "C"
          },
          {
            "id": "d",
            "text": "üheski neist"
          }
        ],
        "correctOptionId": "c"
      },
      "context": {
        "kind": "table",
        "caption": "Väljamõeldud kolme piirkonna elanike arv",
        "headers": [
          "Piirkond",
          "Elanike arv"
        ],
        "rows": [
          [
            "A",
            "4 000"
          ],
          [
            "B",
            "9 000"
          ],
          [
            "C",
            "6 000"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u14-q103",
      "unitId": "lo-opik-u14",
      "stem": "Milline väljamõeldud tee on tabeli põhjal kõige suurema liiklusega?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g087",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jõe teel sõidab tabeli järgi 3 000 autot päevas, mis on teistest rohkem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Männi tee"
          },
          {
            "id": "b",
            "text": "Jõe tee"
          },
          {
            "id": "c",
            "text": "Kase tee"
          },
          {
            "id": "d",
            "text": "Kõigil on täpselt sama palju autosid"
          }
        ],
        "correctOptionId": "b"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Tee",
          "Autosid päevas"
        ],
        "rows": [
          [
            "Männi tee",
            "1 200"
          ],
          [
            "Jõe tee",
            "3 000"
          ],
          [
            "Kase tee",
            "900"
          ]
        ],
        "caption": "Väljamõeldud liiklusandmed"
      }
    },
    {
      "id": "lo-opik-u14-q104",
      "unitId": "lo-opik-u14",
      "stem": "Järjesta väljamõeldud teed autode arvu järgi väiksemast suuremani.",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g087",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "900 < 1 200 < 3 000.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Kase tee: 900"
          },
          {
            "id": "s2",
            "text": "Männi tee: 1 200"
          },
          {
            "id": "s3",
            "text": "Jõe tee: 3 000"
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3"
        ],
        "firstLabel": "Vähem autosid",
        "lastLabel": "Rohkem autosid"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Tee",
          "Autosid päevas"
        ],
        "rows": [
          [
            "Männi tee",
            "1 200"
          ],
          [
            "Jõe tee",
            "3 000"
          ],
          [
            "Kase tee",
            "900"
          ]
        ],
        "caption": "Väljamõeldud liiklusandmed"
      }
    },
    {
      "id": "lo-opik-u14-q105",
      "unitId": "lo-opik-u14",
      "stem": "Millises väljamõeldud piirkonnas oli tabeli järgi kõige rohkem päikesepaiste tunde?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g089",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rannavere 1 800 tundi on suurim näit.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Rannavere"
          },
          {
            "id": "b",
            "text": "Metsala"
          },
          {
            "id": "c",
            "text": "Mäeküla"
          },
          {
            "id": "d",
            "text": "Kõik võrdselt"
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Piirkond",
          "Päikesepaiste tunde aastas"
        ],
        "rows": [
          [
            "Rannavere",
            "1 800"
          ],
          [
            "Metsala",
            "1 500"
          ],
          [
            "Mäeküla",
            "1 650"
          ]
        ],
        "caption": "Väljamõeldud päikesepaiste andmed"
      }
    },
    {
      "id": "lo-opik-u14-q106",
      "unitId": "lo-opik-u14",
      "stem": "Millise järelduse saad väljamõeldud elanike arvu tabelist teha?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g082",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tabel näitab elanike arvu: B 9 000 ja A 4 000. Ülejäänud väidete jaoks andmeid ei ole.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "B-s elab rohkem inimesi kui A-s."
          },
          {
            "id": "b",
            "text": "B-s on kindlasti viljakaim muld."
          },
          {
            "id": "c",
            "text": "A-s on kindlasti kõige kõrgemad mäed."
          },
          {
            "id": "d",
            "text": "C-s sajab kindlasti kõige vähem."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "caption": "Väljamõeldud kolme piirkonna elanike arv",
        "headers": [
          "Piirkond",
          "Elanike arv"
        ],
        "rows": [
          [
            "A",
            "4 000"
          ],
          [
            "B",
            "9 000"
          ],
          [
            "C",
            "6 000"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u14-q107",
      "unitId": "lo-opik-u14",
      "stem": "Väljamõeldud piirkondade kaardil tähistab tumedam värv rohkem elanikke. Vali kõik õiged väited.",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g082",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Andmed on A 4 000, B 9 000 ja C 6 000; mullastiku kohta ei saa järeldust teha.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59",
          "note": "Harjutusandmed on õppimiseks välja mõeldud; õpik lk 59 toetab kaardiliiki, mitte neid arve."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "B-s on kõige rohkem elanikke."
          },
          {
            "id": "b",
            "text": "A-s on kõige vähem elanikke."
          },
          {
            "id": "c",
            "text": "C-s elab rohkem inimesi kui A-s."
          },
          {
            "id": "d",
            "text": "B-s on kindlasti kõige viljakam muld."
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "c"
        ]
      },
      "context": {
        "kind": "table",
        "caption": "Väljamõeldud kolme piirkonna elanike arv",
        "headers": [
          "Piirkond",
          "Elanike arv"
        ],
        "rows": [
          [
            "A",
            "4 000"
          ],
          [
            "B",
            "9 000"
          ],
          [
            "C",
            "6 000"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u14-q108",
      "unitId": "lo-opik-u14",
      "stem": "Milles seisneb viga, kui keegi vaatab 800 aasta tagust ajalookaarti ja ütleb, et seal on kindlasti tänased maakonnapiirid?",
      "primaryObjectiveId": "lo-opik-u14-o8",
      "variantGroupId": "lo-opik-u14-g055",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ajaloolisi ja tänapäevaseid piire ei tohi automaatselt samastada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "59"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Ta ei arvesta, et kaardi andmed kujutavad minevikku."
          },
          {
            "id": "b",
            "text": "Ta peab kaarti liiga värviliseks."
          },
          {
            "id": "c",
            "text": "Ta luges ära kaardi leheküljenumbri."
          },
          {
            "id": "d",
            "text": "Ta ei mõõtnud jõgede pikkusi."
          }
        ],
        "correctOptionId": "a"
      }
    }
  ]
};
