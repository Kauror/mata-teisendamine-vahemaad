// Harjutaja textbook chapter 13. Authored from textbook pp.54–57, with
// clearly attributed optional additions. Do not show as published until
// a parent explicitly enables it through the existing parent UI.
import type { Unit } from '@/lib/textbook/types';

export const unit13: Unit = {
  "id": "lo-opik-u13",
  "courseId": "loodusopetus-opik",
  "number": 13,
  "title": "Kaardi mõõtkava",
  "pages": {
    "from": 54,
    "to": 57
  },
  "status": "ready",
  "contentVersion": "2026-10-17.1",
  "objectives": [
    {
      "id": "lo-opik-u13-o1",
      "description": "Mõistan, miks kujutatakse kaardil tegelikke mõõtmeid ja vahemaid vähendatult.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ]
    },
    {
      "id": "lo-opik-u13-o2",
      "description": "Oskan selgitada, miks väiksemat piirkonda saab kaardil kujutada üksikasjalikumalt.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "54–55"
        }
      ]
    },
    {
      "id": "lo-opik-u13-o3",
      "description": "Tean, mida mõõtkava näitab ja kuidas lugeda mõõtkava 1 : N.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        },
        {
          "kind": "supplementary",
          "url": "https://www.ga.gov.au/scientific-topics/national-location-information/topographic-maps-data/basics/what-is-map-scale",
          "attribution": "Geoscience Australia — What is Map Scale?"
        }
      ]
    },
    {
      "id": "lo-opik-u13-o4",
      "description": "Tunnen joonmõõtkava, võrdlusmõõtkava ja arvmõõtkava ning tean, kuidas need väljendavad sama suurust.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ]
    },
    {
      "id": "lo-opik-u13-o5",
      "description": "Oskan teisendada sentimeetreid meetriteks ja kilomeetriteks, et mõista arvmõõtkava.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "55–56"
        }
      ]
    },
    {
      "id": "lo-opik-u13-o6",
      "description": "Oskan mõõtkava järgi arvutada kaardil antud lõigu tegeliku linnulennulise pikkuse.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ]
    },
    {
      "id": "lo-opik-u13-o7",
      "description": "Oskan võrrelda kaht arvmõõtkava ja otsustada, milline kaart kujutab sama piirkonda suuremalt.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "54–55"
        },
        {
          "kind": "supplementary",
          "url": "https://www.ga.gov.au/scientific-topics/national-location-information/topographic-maps-data/basics/what-is-map-scale",
          "attribution": "Geoscience Australia — What is Map Scale?"
        }
      ]
    },
    {
      "id": "lo-opik-u13-o8",
      "description": "Mõistan erinevust linnulennulise kauguse, teekonna pikkuse ja kohalejõudmise aja vahel.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "56–57"
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u13-l1",
      "title": "Kaardil on kõik väiksem",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u13-o1",
        "lo-opik-u13-o2"
      ],
      "sections": [
        {
          "id": "lo-opik-u13-l1-s1",
          "title": "Miks on vaja vähendada?",
          "blocks": [
            {
              "id": "lo-opik-u13-b001",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "54"
              },
              "text": "Ükski riik, saar, meri, mäestik ega linn ei mahu tavalisele kaardile oma tegelikus suuruses. Kaart kujutab neid palju kordi väiksemalt. Nii saab suur maa-ala mahtuda paberile või ekraanile."
            },
            {
              "id": "lo-opik-u13-b002",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "54"
              },
              "text": "Kui joonistaksime Eesti kaardile tegelikus suuruses, peaks paber olema peaaegu sama suur kui Eesti ise. Selle asemel vähendatakse kõiki mõõtmeid kindla suhte järgi."
            },
            {
              "id": "lo-opik-u13-b003",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "54"
              },
              "term": "Vähendamine kaardil",
              "definition": "Tegelike vahemaade kujutamine kaardil palju lühemate lõikudena."
            },
            {
              "id": "lo-opik-u13-b004",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "54"
              },
              "items": [
                "Kaart on pärismaailmast vähendatud kujutis.",
                "Kõigi kohtade, teede ja teiste objektide tegelikke mõõtmeid ei saa tavalisel kaardil näidata."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u13-l1-s2",
          "title": "Maailmakaart ja Eesti kaart",
          "blocks": [
            {
              "id": "lo-opik-u13-b005",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "54"
              },
              "text": "Maailmakaardile peab mahtuma kogu Maa. Sellel paistab Eesti väga väike. Kui teha kaart ainult Eestist, saab sama riiki kujutada palju suuremalt ja märkida peale rohkem linnu."
            },
            {
              "id": "lo-opik-u13-b006",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "54"
              },
              "text": "Klassi seinal olev suurem kaart võib mahutada rohkem nimesid kui väike õpikukaart. Tähtis on nii kujutatava piirkonna suurus, kaardi mõõtkava kui ka kaardi füüsiline või ekraanil nähtav suurus."
            },
            {
              "id": "lo-opik-u13-b007",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "54"
              },
              "diagramId": "u13-area-detail",
              "description": "Kolm väljamõeldud kaardivaadet: väga suur piirkond väheste sümbolitega, keskmine piirkond ning väike asula paljude teede ja hoonetega.",
              "caption": "Sama põhimõte: väiksemat ala näitaval kaardil saab tavaliselt eristada rohkem detaile. Need on näidisskeemid, mitte päris Eesti kaart."
            },
            {
              "id": "lo-opik-u13-b008",
              "type": "comparison",
              "source": {
                "kind": "textbook",
                "pages": "54"
              },
              "title": "Mida ühel või teisel kaardil näha on?",
              "columns": [
                {
                  "heading": "Maailmakaart",
                  "points": [
                    "Näitab väga suurt ala.",
                    "Riigid ja suuremad linnad on väikesed.",
                    "Väikeste tänavate nimed sinna tavaliselt ei mahu."
                  ]
                },
                {
                  "heading": "Linnakaart",
                  "points": [
                    "Näitab üht väiksemat ala.",
                    "Tänavad ja hooned on suuremalt.",
                    "Sinna saab märkida rohkem kohalikke kohti."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u13-l1-s3",
          "title": "Kõik andmed ei mahu ühele kaardile",
          "blocks": [
            {
              "id": "lo-opik-u13-b009",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "54"
              },
              "text": "Mida väiksemalt on maa-ala kujutatud, seda keerulisem on kaardile kanda väikseid teid, külasid või lahesoppe. Seepärast valib kaardi tegija, mis teave on selle kaardi jaoks kõige olulisem."
            },
            {
              "id": "lo-opik-u13-b010",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "54"
              },
              "text": "Kui tahad leida Eesti asukoha maailmas, kasuta maailmakaarti. Kui tahad leida lähimat tänavat või parki, kasuta üksikasjalikumat piirkonnakaarti."
            },
            {
              "id": "lo-opik-u13-b011",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "54"
              },
              "items": [
                "Väga suure ala kaardil on vähem väikseid üksikasju.",
                "Väikese ala kaardil saab näidata rohkem kohti ja väiksemaid objekte."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u13-l2",
      "title": "Mis on mõõtkava?",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u13-o3",
        "lo-opik-u13-o4",
        "lo-opik-u13-o5",
        "lo-opik-u13-o7"
      ],
      "sections": [
        {
          "id": "lo-opik-u13-l2-s1",
          "title": "Mida mõõtkava näitab?",
          "blocks": [
            {
              "id": "lo-opik-u13-b012",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "text": "Selleks et teada saada, kui palju on päris vahemaid kaardil vähendatud, vaata kaardi mõõtkava. See võimaldab arvutada, kui kaugel kaks kohta tegelikult teineteisest asuvad."
            },
            {
              "id": "lo-opik-u13-b013",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "term": "Mõõtkava",
              "definition": "Kaardil ja looduses mõõdetud sama vahemaa pikkuste suhe; see näitab, mitu korda on vahemaid kaardil vähendatud."
            },
            {
              "id": "lo-opik-u13-b014",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "text": "Näiteks mõõtkava 1 : 5 000 000 tähendab: 1 sentimeeter kaardil vastab looduses 5 000 000 sentimeetrile. See on 50 kilomeetrit."
            },
            {
              "id": "lo-opik-u13-b015",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "items": [
                "Arvmõõtkavas 1 : N on võrreldavad ühikud samad.",
                "Mõõtkava aitab kaardilt leida tegelikke vahemaid."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u13-l2-s2",
          "title": "Kolm viisi sama mõõtkava näitamiseks",
          "blocks": [
            {
              "id": "lo-opik-u13-b016",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "text": "Õpikus kasutatakse kolme mõõtkava kuju: joonmõõtkava, võrdlusmõõtkava ja arvmõõtkava. Need võivad kõik kirjeldada täpselt sama vähendamist."
            },
            {
              "id": "lo-opik-u13-b017",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "diagramId": "u13-scale-forms",
              "caption": "Kolm võrdväärset näidet: 1 cm kaardil vastab 50 km looduses. SVG-skeemi joone pikkus ekraanil ei võrdu tingimata 1 cm-ga."
            },
            {
              "id": "lo-opik-u13-b018",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "caption": "Kolm mõõtkava kuju",
              "headers": [
                "Liik",
                "Näide",
                "Kuidas seda lugeda?"
              ],
              "rows": [
                [
                  "Joonmõõtkava",
                  "Märgitud joon: 0 kuni 50 km",
                  "Joone lõik näitab tegelikku kaugust."
                ],
                [
                  "Võrdlusmõõtkava",
                  "1 cm – 50 km",
                  "1 cm kaardil kujutab 50 km looduses."
                ],
                [
                  "Arvmõõtkava",
                  "1 : 5 000 000",
                  "1 cm kaardil vastab 5 000 000 cm looduses."
                ]
              ]
            },
            {
              "id": "lo-opik-u13-b019",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "items": [
                "Joonmõõtkava on tähistatud joon.",
                "Võrdlusmõõtkava ütleb kaugused sõnade ja ühikutega.",
                "Arvmõõtkava on kahe arvu suhe."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u13-l2-s3",
          "title": "Kuidas sentimeetrid kilomeetriteks teisendada?",
          "blocks": [
            {
              "id": "lo-opik-u13-b020",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "text": "Arvmõõtkavas on mõlemad arvud sama ühikuga. Kui mõõdad kaardil sentimeetrites, saad looduses ka esmalt sentimeetrid. Seejärel teisenda need kilomeetriteks."
            },
            {
              "id": "lo-opik-u13-b021",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "caption": "Pikkusühikud",
              "headers": [
                "Ühikute seos",
                "Tähendus"
              ],
              "rows": [
                [
                  "100 cm = 1 m",
                  "Ühes meetris on 100 sentimeetrit."
                ],
                [
                  "1 000 m = 1 km",
                  "Ühes kilomeetris on 1 000 meetrit."
                ],
                [
                  "100 000 cm = 1 km",
                  "Ühes kilomeetris on 100 000 sentimeetrit."
                ]
              ]
            },
            {
              "id": "lo-opik-u13-b022",
              "type": "list",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "ordered": true,
              "items": [
                "Arvmõõtkava 1 : 5 000 000 tähendab 1 cm kaardil = 5 000 000 cm looduses.",
                "5 000 000 cm : 100 = 50 000 m.",
                "50 000 m : 1 000 = 50 km.",
                "Järelikult 1 cm kaardil = 50 km looduses."
              ]
            },
            {
              "id": "lo-opik-u13-b023",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "items": [
                "Sentimeetritest kilomeetriteks: jaga 100 000-ga.",
                "Näide: 3 000 000 cm = 30 km; 5 000 000 cm = 50 km."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u13-l2-s4",
          "title": "Suurem ja väiksem mõõtkava",
          "blocks": [
            {
              "id": "lo-opik-u13-b024",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "text": "Õpiku Hiiumaa kaart näitab tervet saart; kõrvale on toodud Kärdla ümbruse üksikasjalikum kaart. Viimasel on väiksem ala suuremalt kujutatud ja sinna mahub rohkem kohanimesid ning teid."
            },
            {
              "id": "lo-opik-u13-b025",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "text": "Mõõtkavu võrreldes võib arvude suurus esialgu segadusse ajada. 1 : 100 000 on suurem mõõtkava kui 1 : 1 000 000, sest sama 1 cm kaardil tähistab esimesel juhul väiksemat vahemaad looduses."
            },
            {
              "id": "lo-opik-u13-b026",
              "type": "comparison",
              "source": {
                "kind": "textbook",
                "pages": "55"
              },
              "title": "Kaks mõõtkava",
              "columns": [
                {
                  "heading": "1 : 100 000",
                  "points": [
                    "1 cm = 1 km looduses.",
                    "Suurem mõõtkava.",
                    "Sama suurel kaardilehel saab väikest ala kujutada detailsemalt."
                  ]
                },
                {
                  "heading": "1 : 1 000 000",
                  "points": [
                    "1 cm = 10 km looduses.",
                    "Väiksem mõõtkava.",
                    "Sama suurel kaardilehel mahub peale suurem ala."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u13-b027",
              "type": "enrichment",
              "variant": "extra",
              "title": "Lisateadmine: mida tähendab „suurem mõõtkava”?",
              "body": [
                "Mõõtkava on murd: 1/100 000 on suurem kui 1/1 000 000. Seepärast tähendab väiksema nimetajaga arvmõõtkava suuremat mõõtkava."
              ],
              "source": {
                "kind": "supplementary",
                "url": "https://www.ga.gov.au/scientific-topics/national-location-information/topographic-maps-data/basics/what-is-map-scale",
                "attribution": "Geoscience Australia — What is Map Scale?"
              }
            },
            {
              "id": "lo-opik-u13-b028",
              "type": "externalResource",
              "title": "Miks arvmõõtkava võrreldakse nii?",
              "intro": "Geoscience Australia selgitab arvmõõtkava koos näidetega 1 : 100 000 ja 1 : 5 000 000.",
              "url": "https://www.ga.gov.au/scientific-topics/national-location-information/topographic-maps-data/basics/what-is-map-scale",
              "publisher": "Geoscience Australia",
              "resourceType": "article",
              "observe": "Pane tähele: kuidas muutub 1 cm tegelik kaugus, kui mõõtkava nimetaja kasvab?"
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u13-l3",
      "title": "Kuidas leida vahemaa kaardilt?",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u13-o5",
        "lo-opik-u13-o6",
        "lo-opik-u13-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u13-l3-s1",
          "title": "Kolm sammu",
          "blocks": [
            {
              "id": "lo-opik-u13-b029",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "text": "Kaardilt kahe koha linnulennulise kauguse leidmiseks on vaja mõõta kaardil nendevaheline sirglõik ja teada mõõtkava."
            },
            {
              "id": "lo-opik-u13-b030",
              "type": "list",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "ordered": true,
              "items": [
                "Mõõda kahe koha vaheline sirglõik kaardil.",
                "Leia kaardilt mõõtkava ning teisenda see vajaduse korral sobivasse ühikusse.",
                "Korruta kaardil mõõdetud pikkus sellele vastava tegeliku pikkusega."
              ]
            },
            {
              "id": "lo-opik-u13-b031",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "items": [
                "Tegelik vahemaa = kaardil mõõdetud sentimeetrid × tegelikud kilomeetrid ühe kaardisentimeetri kohta."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u13-l3-s2",
          "title": "Õpiku näide: Tartu ja Võru",
          "blocks": [
            {
              "id": "lo-opik-u13-b032",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "text": "Õpikus mõõdetakse Tartu ja Võru vahemaa kaardil: 2 cm. Kaardi mõõtkava on 1 : 3 000 000 ehk 1 cm kaardil vastab 30 km looduses."
            },
            {
              "id": "lo-opik-u13-b033",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "diagramId": "u13-measured-distance",
              "caption": "Näide: kaardil on punktide vahele märgitud 2 cm ja mõõtkava 1 : 3 000 000. Ekraanil kuvatava joone pikkus ei ole füüsiliselt mõõdetav 2 cm."
            },
            {
              "id": "lo-opik-u13-b034",
              "type": "list",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "ordered": true,
              "items": [
                "Mõõdetud kaardilõik on 2 cm.",
                "1 : 3 000 000 tähendab 1 cm = 30 km.",
                "2 × 30 km = 60 km.",
                "Tartu ja Võru linnulennuline vahemaa on õpiku näites ligikaudu 60 km."
              ]
            },
            {
              "id": "lo-opik-u13-b035",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "items": [
                "Kaardi mõõtkava tuleb enne korrutamist õigesti lugeda.",
                "2 cm × 30 km/cm = 60 km."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u13-l3-s3",
          "title": "Proovime teise arvuga",
          "blocks": [
            {
              "id": "lo-opik-u13-b036",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "text": "Kui kaardil on vahemaa 3 cm ja mõõtkava näitab 1 cm – 20 km, siis 3 × 20 = 60 km. Tegelik sirgjooneline vahemaa on 60 km."
            },
            {
              "id": "lo-opik-u13-b037",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "text": "Kui kaardi mõõtkava on 1 : 1 000 000, vastab 1 cm looduses 10 km-le. Kui kaardil on 4 cm, saad 4 × 10 = 40 km."
            },
            {
              "id": "lo-opik-u13-b038",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "caption": "Harjutusnäited (väljamõeldud kohad)",
              "headers": [
                "Kaardi vahemaa",
                "Mõõtkava",
                "Tegelik sirgjooneline vahemaa"
              ],
              "rows": [
                [
                  "2 cm",
                  "1 cm – 30 km",
                  "60 km"
                ],
                [
                  "3 cm",
                  "1 cm – 20 km",
                  "60 km"
                ],
                [
                  "4 cm",
                  "1 : 1 000 000",
                  "40 km"
                ],
                [
                  "5 cm",
                  "1 cm – 5 km",
                  "25 km"
                ]
              ]
            },
            {
              "id": "lo-opik-u13-b039",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "text": "Õpiku leheküljel 56 palutakse mõõta ka Kuressaare ja Pärnu vahemaa. Seda tuleb teha just sama trükitud kaardi mõõtkava arvestades. Rakenduses ei anta Kuressaare–Pärnu jaoks väljamõeldud mõõdetud sentimeetreid ega hinnata vastust ekraanil joonlauaga mõõdetud pikkuse järgi."
            },
            {
              "id": "lo-opik-u13-b040",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "text": "Oluline on kasutada kaardi mõõtkava, mitte oletada kaugust joonise välimuse järgi. Ekraanil võivad kaardijoonised muuta suurust, seetõttu on selles õppeprogrammis arvutuseks vajalik pikkus ülesandes alati kirjas."
            },
            {
              "id": "lo-opik-u13-b041",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "items": [
                "Kui 1 cm vastab 20 km-le, siis 3 cm vastab 60 km-le.",
                "Kontrolli enne vastamist, millist ühikut vastuses küsitakse."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u13-l3-s4",
          "title": "Mida saab kaardilt mõõta?",
          "blocks": [
            {
              "id": "lo-opik-u13-b042",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "text": "Sirgjooneline kaugus tähendab, kui pikk oleks üks sirge joon kahe koha vahel. Seda kutsutakse linnulennuliseks kauguseks."
            },
            {
              "id": "lo-opik-u13-b043",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "text": "Päriselus kulgevad teed sageli kurvide, sildade ja asulate kaudu. Teed mööda läbitav maa võib seepärast olla linnulennulisest vahemaast pikem."
            },
            {
              "id": "lo-opik-u13-b044",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "diagramId": "u13-direct-vs-route",
              "caption": "Sama kahe punkti vahele on tõmmatud sirge joon ja kurviline teekond. Mõlemad on väljamõeldud näited."
            },
            {
              "id": "lo-opik-u13-b045",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "56"
              },
              "items": [
                "Mõõtes kaardil kahe punkti sirglõiku, arvutad linnulennulise vahemaa.",
                "Tee pikkus ja sõiduaeg ei pruugi sellega võrdsed olla."
              ]
            },
            {
              "id": "lo-opik-u13-b046",
              "type": "externalResource",
              "title": "Mõõda vahemaad Eesti kaardil",
              "intro": "Maa- ja Ruumiameti kaardirakenduses saad muuta kaardi mõõtkava ja uurida päris kohti.",
              "url": "https://geoportaal.maaamet.ee/est/abi-ja-juhised/xgis/kuidas-maarata-kaardiaknas-kindel-mootkava/15/",
              "publisher": "Maa- ja Ruumiamet",
              "resourceType": "article",
              "observe": "Mis juhtub kaardi detailidega, kui suumid sisse? Vaata kaardi serval olevat mõõtkava."
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u13-l4",
      "title": "Lisa: vahemaid arvestame ka ajas",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u13-o2",
        "lo-opik-u13-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u13-l4-s1",
          "title": "Kas kaugel tähendab ka kaua?",
          "blocks": [
            {
              "id": "lo-opik-u13-b047",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "57"
              },
              "text": "Sageli ei huvita meid ainult kilomeetrid, vaid see, kui kaua kulub kohalejõudmiseks. Sama vahemaa läbimine võib võtta erineva aja sõltuvalt sõidukist, teest ja oludest."
            },
            {
              "id": "lo-opik-u13-b048",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "57"
              },
              "text": "Õpik võrdleb vanaaegseid ja tänapäevaseid liikumisviise. Hobuvankriga oli pikkade vahemaade läbimine aeglane. Tänapäeva auto ja lennukiga jõuame kaugemale oluliselt kiiremini."
            },
            {
              "id": "lo-opik-u13-b049",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "57"
              },
              "items": [
                "Kilomeetrid näitavad vahemaad.",
                "Minutid ja tunnid näitavad aega.",
                "Ühe ja sama vahemaa läbimiseks võib kuluda väga erinev aeg."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u13-l4-s2",
          "title": "Reisimine vanasti ja praegu",
          "blocks": [
            {
              "id": "lo-opik-u13-b050",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "57"
              },
              "text": "Õpik toob ajaloolised võrdlused: ligikaudu 200 aastat tagasi jõuti hobuvankriga tunnis umbes 15 km ja Tallinnast Pärnusse sõit võis kesta terve päeva. Ka esimesel liinibussil kulus selleks sõiduks umbes kuus tundi. Need on õpiku näited, mitte tänapäevased sõiduajad."
            },
            {
              "id": "lo-opik-u13-b051",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "57"
              },
              "text": "Õpiku järgi võttis merereis Euroopast Austraaliasse umbes sada aastat tagasi üle kolme kuu. Tänapäeval võib sinna lennukiga jõuda ligikaudu ööpäevaga, olenevalt lähtekohast, lennuühendustest ja ümberistumistest."
            },
            {
              "id": "lo-opik-u13-b052",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "57"
              },
              "text": "Maa kaugus ise ei ole vähenenud. Meie liikumisvahendid ja liikumisvõimalused on muutunud. Kiirem sõiduk võib muuta kaugemagi koha ajaliselt lähedasemaks."
            },
            {
              "id": "lo-opik-u13-b053",
              "type": "comparison",
              "source": {
                "kind": "textbook",
                "pages": "57"
              },
              "title": "Sama vahemaa, erinev aeg",
              "columns": [
                {
                  "heading": "Aeglasem liikumine",
                  "points": [
                    "Sama teekond kestab kauem.",
                    "Võib olla vaja rohkem puhkepause."
                  ]
                },
                {
                  "heading": "Kiirem liikumine",
                  "points": [
                    "Sama teekond kestab üldiselt vähem aega.",
                    "Kohalejõudmise aega mõjutavad siiski tee ja ilm."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u13-b054",
              "type": "enrichment",
              "variant": "extra",
              "title": "Lisateadmine: sõiduaja planeerimine",
              "body": [
                "Sõiduaeg ei sõltu üksnes kaugusest: arvesse tuleb võtta liikumiskiirust, teekonna valikut, liiklust ja peatusi. Seepärast ei saa ainult mõõtkava järgi kindlalt öelda, kui kaua teekond kestab."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u13-l4-s3",
          "title": "Millal on vaja vahemaad ja millal aega?",
          "blocks": [
            {
              "id": "lo-opik-u13-b055",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "57"
              },
              "caption": "Kaks eri küsimust",
              "headers": [
                "Küsimus",
                "Mida on vaja teada?"
              ],
              "rows": [
                [
                  "Kui kaugel on kaks kohta teineteisest?",
                  "Vahemaa (km või m)."
                ],
                [
                  "Kui kaua sõit kestab?",
                  "Aeg (min või h)."
                ],
                [
                  "Kui pikk on tee mööda maanteed?",
                  "Teekonna pikkus, mitte ainult sirgjooneline vahemaa."
                ]
              ]
            },
            {
              "id": "lo-opik-u13-b056",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "57"
              },
              "text": "Näiteks kaks linna võivad olla linnulennult 60 km kaugusel. Kuid tee nende vahel teeb käänakuid ning buss peatub teel. Sellepärast ei saa kaardil mõõdetud 60 km-st üksinda sõidu kestust välja arvutada."
            },
            {
              "id": "lo-opik-u13-b057",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "57"
              },
              "items": [
                "Mõõtkava abil leiad vahemaa.",
                "Aja leidmiseks vajad ka teadmisi liikumise kohta."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u13-l4-s4",
          "title": "Korda õpitut",
          "blocks": [
            {
              "id": "lo-opik-u13-b058",
              "type": "list",
              "ordered": true,
              "items": [
                "Kaardil on tegelikud vahemaad vähendatud.",
                "Mõõtkava näitab, mitu korda on vahemaad vähendatud.",
                "Joon-, võrdlus- ja arvmõõtkava võivad tähendada sama suhet.",
                "1 km = 100 000 cm.",
                "Tegelik vahemaa leitakse kaardil mõõdetud pikkust mõõtkavaga korrutades.",
                "Linnulennuline kaugus, maanteel läbitav teekond ja sõiduaeg on erinevad asjad."
              ]
            },
            {
              "id": "lo-opik-u13-b059",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "57"
              },
              "title": "Enne harjutamist kontrolli",
              "items": [
                "1 : 3 000 000 → 1 cm = 30 km.",
                "2 cm × 30 km/cm = 60 km.",
                "Kui küsimus küsib sõiduaega, ei piisa ainult vahemaast."
              ]
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u13-q001",
      "unitId": "lo-opik-u13",
      "stem": "Miks ei saa tervet Eestit tavalisele õpikukaardile joonistada tegelikus suuruses?",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g001",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti tegelikud mõõtmed on palju suuremad kui õpikuleht, seega tuleb neid vähendada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Eesti on kaardile mahtumiseks liiga suur."
          },
          {
            "id": "b",
            "text": "Eesti mõõtkava peab kõigil kaartidel sama olema."
          },
          {
            "id": "c",
            "text": "Riike saab kujutada ainult gloobusel."
          },
          {
            "id": "d",
            "text": "Kõik kaardid näitavad riike ühesuguses suuruses."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q002",
      "unitId": "lo-opik-u13",
      "stem": "Õige või vale? Tavalisel kaardil on riigi pikkus sentimeetrites sama mis päriselus.",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g001",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Kaardil on riigi tegelikud vahemaad vähendatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
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
        "correctOptionId": "b",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u13-q003",
      "unitId": "lo-opik-u13",
      "stem": "Mida tehakse tegelike vahemaadega, kui koostatakse paberkaart?",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g002",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi jaoks vähendatakse päris vahemaad, et need mahuksid lehele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Vähendatakse neid kindla suhte järgi."
          },
          {
            "id": "b",
            "text": "Suurendatakse neid alati kümme korda."
          },
          {
            "id": "c",
            "text": "Jäetakse kõik vahemaad kaardilt välja."
          },
          {
            "id": "d",
            "text": "Muudetakse kõik vahemaad võrdseks."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q004",
      "unitId": "lo-opik-u13",
      "stem": "Õige või vale? Maailmakaardil võib Eesti olla kujutatud palju väiksemalt kui Eesti enda kaardil.",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g003",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õige. Maailmakaardile peab mahtuma väga suur piirkond; Eesti kaardil saab riiki kujutada suuremalt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
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
        "correctOptionId": "a",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u13-q005",
      "unitId": "lo-opik-u13",
      "stem": "Miks paistab Eesti õpiku maailmakaardil väike?",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g003",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmakaardile mahub kogu Maa, mistõttu on Eesti seal väikeselt kujutatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaart peab kujutama kogu maailma korraga."
          },
          {
            "id": "b",
            "text": "Eesti on Maal kõige väiksem riik."
          },
          {
            "id": "c",
            "text": "Maailmakaardil suurendatakse linnu."
          },
          {
            "id": "d",
            "text": "Kõigil maailmakaartidel kujutatakse riike ühesuurustena."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q006",
      "unitId": "lo-opik-u13",
      "stem": "Vali kõik, mida kaardil tavaliselt tegelikkusega võrreldes vähendatakse.",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g004",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaart kujutab tegelikke mõõtmeid väiksemalt. Päris puud ei esitata ekraanil oma füüsilises suuruses.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "Riikidevahelised vahemaad"
          },
          {
            "id": "b",
            "text": "Linna eri paikade vahemaad"
          },
          {
            "id": "c",
            "text": "Jõgede kulgemise pikkused"
          },
          {
            "id": "d",
            "text": "Päris puu kõrgus peab ekraanil alati sama olema"
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
      "id": "lo-opik-u13-q007",
      "unitId": "lo-opik-u13",
      "stem": "Lapsed joonistavad oma kodutänava plaani väikesele paberile. Mis peab päris tänavaga võrreldes muutuma?",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g005",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Plaan mahub paberile ainult siis, kui tegelikke vahemaid näidatakse väiksemalt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Vahemaad tuleb paberile mahtumiseks vähendada."
          },
          {
            "id": "b",
            "text": "Kõik majad tuleb kujutada päriselust suuremana."
          },
          {
            "id": "c",
            "text": "Majadevahelised teed peavad kaduma."
          },
          {
            "id": "d",
            "text": "Tänav tuleb kõigepealt üles kaevata."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Koolilapsed tahavad joonistada ühele A4-le kogu oma pika tänava."
        ]
      }
    },
    {
      "id": "lo-opik-u13-q008",
      "unitId": "lo-opik-u13",
      "stem": "Rühmita väljendid: kas need kirjeldavad päris maastikku või selle vähendatud kujutist?",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g006",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardil kujutatakse maastiku mõõtmeid vähendatult, päris maastikus on mõõtmed tegelikud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "kaart",
            "text": "Kaart"
          },
          {
            "id": "loodus",
            "text": "Päris maastik"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Teedevaheline lõik joonistatakse mõne sentimeetri pikkuseks."
          },
          {
            "id": "i2",
            "text": "Tee kulgeb tegelikult mitme kilomeetri ulatuses."
          },
          {
            "id": "i3",
            "text": "Linnad on kujutatud paberil punktidena."
          },
          {
            "id": "i4",
            "text": "Hooned on oma tegelikus suuruses."
          }
        ],
        "correctGroupByItem": {
          "i1": "kaart",
          "i2": "loodus",
          "i3": "kaart",
          "i4": "loodus"
        }
      }
    },
    {
      "id": "lo-opik-u13-q009",
      "unitId": "lo-opik-u13",
      "stem": "Mis juhtuks, kui maailmakaart ei vähendaks üldse Maa vahemaid?",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g007",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tegelike mõõtmetega kaart oleks tohutult suur, mistõttu kaarte vähendatakse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "See ei mahuks tavalisele paberile ega ekraanile."
          },
          {
            "id": "b",
            "text": "See näitaks kõiki riike ühe punktina."
          },
          {
            "id": "c",
            "text": "See mahuks paremini väikesesse raamatusse."
          },
          {
            "id": "d",
            "text": "Kõik maailma linnad asuksid ühes kohas."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q010",
      "unitId": "lo-opik-u13",
      "stem": "Mis on õpiku sõnul kaartide tegemisel üks oluline põhjus vahemaid vähendada?",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g008",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailma tegelikud mõõtmed ei mahu paberile, seetõttu vähendatakse mõõtmeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Et suured alad mahuksid väikesele pinnale."
          },
          {
            "id": "b",
            "text": "Et muuta riigid päriselt väiksemaks."
          },
          {
            "id": "c",
            "text": "Et eemaldada kõik mered."
          },
          {
            "id": "d",
            "text": "Et kaardil poleks kunagi nimesid."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q011",
      "unitId": "lo-opik-u13",
      "stem": "Ühenda päriselu olukord ja selle kaardil kujutamise põhimõte.",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g009",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardile tuleb kõik mõõtmed vähendada ja sobitada valitud ala kaardi suurusega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Terve maailma kujutamine"
          },
          {
            "id": "p2",
            "text": "Väikese linnajao kujutamine"
          },
          {
            "id": "p3",
            "text": "Paberilehele mahtumine"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Väga suur maa-ala tuleb tugevalt vähendada."
          },
          {
            "id": "c2",
            "text": "Väiksemat ala saab kujutada suuremalt."
          },
          {
            "id": "c3",
            "text": "Tegelikud vahemaad asendatakse lühemate lõikudega."
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
      "id": "lo-opik-u13-q012",
      "unitId": "lo-opik-u13",
      "stem": "Kolm sõpra kasutavad sama pika tee märkimiseks paberil väga lühikest lõiku. Miks?",
      "primaryObjectiveId": "lo-opik-u13-o1",
      "variantGroupId": "lo-opik-u13-g010",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaart esitab tegeliku pika tee väikese lõiguna; looduses tee pikkus ei muutu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Sest nad kujutavad tegelikku teed vähendatult."
          },
          {
            "id": "b",
            "text": "Sest tee on vahepeal päriselt lühenenud."
          },
          {
            "id": "c",
            "text": "Sest mõõtkava muudab autode kiirust."
          },
          {
            "id": "d",
            "text": "Sest paberil teid joonistada ei tohi."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q013",
      "unitId": "lo-opik-u13",
      "stem": "Millisele kaardile mahuvad tavaliselt ühe linna üksikud tänavad?",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g011",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Linnakaart kujutab väiksemat piirkonda suuremalt, mistõttu mahub sinna rohkem kohalikke üksikasju.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Linnakaardile."
          },
          {
            "id": "b",
            "text": "Väikesele maailmakaardile."
          },
          {
            "id": "c",
            "text": "Päikesesüsteemi skeemile."
          },
          {
            "id": "d",
            "text": "Maailmakaardi riigipiiride loendisse."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q014",
      "unitId": "lo-opik-u13",
      "stem": "Õige või vale? Väikesel maailmakaardil võib näha iga Eesti kodutänava nime.",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g011",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Kui kaardil on kogu maailm, jäävad väiksed tänavad kujutamiseks liiga pisikeseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
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
        "correctOptionId": "b",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u13-q015",
      "unitId": "lo-opik-u13",
      "stem": "Milline kaart sobib paremini kodukoha pargi leidmiseks?",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g012",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Väikese piirkonna detailsemal kaardil saab näidata parke ja kohalikke tänavaid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kodukoha detailne kaart."
          },
          {
            "id": "b",
            "text": "Maailmakaart."
          },
          {
            "id": "c",
            "text": "Maailma ookeanide kaart."
          },
          {
            "id": "d",
            "text": "Planeetide orbiitide skeem."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q016",
      "unitId": "lo-opik-u13",
      "stem": "Miks ei märgita õpiku maailmakaardile kõiki Eesti linnu?",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g013",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui Eesti on maailmakaardil väga väike, ei mahu kõik linnanimed kaardile.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Väga väikesel kujutisel ei jätku nende näitamiseks ruumi."
          },
          {
            "id": "b",
            "text": "Neid linnu tegelikult ei ole."
          },
          {
            "id": "c",
            "text": "Linnanimed sobivad ainult gloobusele."
          },
          {
            "id": "d",
            "text": "Maailmakaart ei tohi näidata inimeste asulaid."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q017",
      "unitId": "lo-opik-u13",
      "stem": "Näita skeemil kaardivaadet, kus on kõige rohkem kohalikke tänavaid ja hooneid.",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g014",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Väikese piirkonna üksikasjalikul vaatel saab näidata tänavaid ja hooneid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u13-area-detail",
        "correctRegionId": "neighbourhood"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u13-area-detail"
      }
    },
    {
      "id": "lo-opik-u13-q018",
      "unitId": "lo-opik-u13",
      "stem": "Näita skeemil kaardivaadet, mis kujutab kõige suuremat maa-ala.",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g014",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Suurima ala vaates mahub kaardile rohkem maa-ala, kuid vähem kohalikke detaile.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u13-area-detail",
        "correctRegionId": "large-area"
      }
    },
    {
      "id": "lo-opik-u13-q019",
      "unitId": "lo-opik-u13",
      "stem": "Vali kõik, mida võiks üksikasjalikult näha linnakaardil, kuid mitte väiksel maailmakaardil.",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g015",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Linna väiksed objektid mahuvad detailsele kaardile. Mandrid on näha ka maailmakaardil.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "Kohaliku bussipeatuse asukoht"
          },
          {
            "id": "b",
            "text": "Kodu lähedane kitsas tänav"
          },
          {
            "id": "c",
            "text": "Väike mänguväljak"
          },
          {
            "id": "d",
            "text": "Maa suurimad mandrid"
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
      "id": "lo-opik-u13-q020",
      "unitId": "lo-opik-u13",
      "stem": "Kui joonistad ühele ühesuurusele paberile kogu Eesti asemel ainult oma kooli ümbruse, mida saad lisada?",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g016",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kooli ümbrust saab kaardil suuremalt kujutada, seepärast võib näidata rohkem väikseid detaile.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Rohkem väikseid teid ja hooneid."
          },
          {
            "id": "b",
            "text": "Kõik maailma ookeanid."
          },
          {
            "id": "c",
            "text": "Uued riigipiirid."
          },
          {
            "id": "d",
            "text": "Sama palju andmeid sõltumata mõõtkavast."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q021",
      "unitId": "lo-opik-u13",
      "stem": "Järjesta kaardid kujutatava maa-ala suuruse järgi, suurimast väikseimani.",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g017",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmakaart näitab suuremat ala kui Eesti kaart, linnakaart või kooli ümbruse kaart.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Maailmakaart"
          },
          {
            "id": "s2",
            "text": "Eesti kaart"
          },
          {
            "id": "s3",
            "text": "Ühe linna kaart"
          },
          {
            "id": "s4",
            "text": "Ühe kooliümbruse kaart"
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3",
          "s4"
        ]
      }
    },
    {
      "id": "lo-opik-u13-q022",
      "unitId": "lo-opik-u13",
      "stem": "Mida tähendab kaardi puhul „rohkem üksikasju”?",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g018",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üksikasjalikul kaardil saab näidata väiksemaid maastikuobjekte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaardil eristuvad ka väiksemad objektid, näiteks tänavad."
          },
          {
            "id": "b",
            "text": "Kaardil on tingimata rohkem riike."
          },
          {
            "id": "c",
            "text": "Kaardil on rohkem leheküljenumbreid."
          },
          {
            "id": "d",
            "text": "Kaardi värv peab olema heledam."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q023",
      "unitId": "lo-opik-u13",
      "stem": "Milline väide võrdleb sama mõõtu lehele tehtud kaarte õigesti?",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g019",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sama suure kaardilehe korral võimaldab väiksema ala kujutamine näidata objekte suuremalt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Väiksema piirkonna kaardil saab objekte kujutada suuremalt."
          },
          {
            "id": "b",
            "text": "Suurema piirkonna kaardil on alati rohkem üksikuid hooneid."
          },
          {
            "id": "c",
            "text": "Väiksemale piirkonnale keskendumine muudab looduses vahemaid."
          },
          {
            "id": "d",
            "text": "Kaardi mõõtkava ei mõjuta väikeste objektide nähtavust."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q024",
      "unitId": "lo-opik-u13",
      "stem": "Kärt tahab teada, milline tee viib kodust mänguväljakule. Millise kaardi peaks ta valima?",
      "primaryObjectiveId": "lo-opik-u13-o2",
      "variantGroupId": "lo-opik-u13-g020",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kohalike tänavate kaart näitab vajalikku teavet, mida maailmakaart ei mahuta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "54"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kodulähedaste tänavate detailse kaardi."
          },
          {
            "id": "b",
            "text": "Terve maailma kaardi."
          },
          {
            "id": "c",
            "text": "Kõikide mandrite nimetustega kaardi."
          },
          {
            "id": "d",
            "text": "Kaardi, millelt on tänavad eemaldatud."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Kärt elab väikeses linnas ning tahab minna jalgsi mänguväljakule."
        ]
      }
    },
    {
      "id": "lo-opik-u13-q025",
      "unitId": "lo-opik-u13",
      "stem": "Mida näitab kaardi mõõtkava?",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g021",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõõtkava näitab kaardil ja looduses oleva sama vahemaa suhet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kui palju on kaardil tegelikke vahemaid vähendatud."
          },
          {
            "id": "b",
            "text": "Kui palju inimesi kaarti loeb."
          },
          {
            "id": "c",
            "text": "Mitu linna on kaardil."
          },
          {
            "id": "d",
            "text": "Kui kaua kulub bussisõit."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q026",
      "unitId": "lo-opik-u13",
      "stem": "Õige või vale? Mõõtkava 1 : 5 000 000 tähendab, et 1 cm kaardil vastab 5 000 000 cm looduses.",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g022",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õige. Mõõtkavas 1 : N tuleb kõigepealt võrrelda sama mõõtühikut.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
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
        "correctOptionId": "a",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u13-q027",
      "unitId": "lo-opik-u13",
      "stem": "Mõõtkava on 1 : 3 000 000. Kui kasutad sentimeetreid, mida tähendab esimene arv 1?",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g023",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui mõõdetakse sentimeetrites, tähendab esimene arv 1 cm kaardil.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "1 cm kaardil."
          },
          {
            "id": "b",
            "text": "1 km kaardil."
          },
          {
            "id": "c",
            "text": "1 tund teel."
          },
          {
            "id": "d",
            "text": "1 linn kaardil."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q028",
      "unitId": "lo-opik-u13",
      "stem": "Mida väljendab arvmõõtkava 1 : 100 000?",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g024",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Arvmõõtkava võrdleb alati sama ühiku pikkusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "1 cm kaardil on 100 000 cm looduses."
          },
          {
            "id": "b",
            "text": "1 cm kaardil on 100 000 km looduses."
          },
          {
            "id": "c",
            "text": "100 000 cm kaardil on 1 cm looduses."
          },
          {
            "id": "d",
            "text": "1 cm kaardil on 100 000 minutit."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q029",
      "unitId": "lo-opik-u13",
      "stem": "Võrdle arvmõõtkava 1 : 1 000 000 osasid. Millises ühikus tuleb vahemaad võrrelda?",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g025",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Arvmõõtkava on pikkuste suhe ning võrdlemiseks peavad ühikud olema samad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Samas ühikus, näiteks cm kaardil ja cm looduses."
          },
          {
            "id": "b",
            "text": "Kaardil tundides, looduses kilomeetrites."
          },
          {
            "id": "c",
            "text": "Kaardil meetrites, looduses minutites."
          },
          {
            "id": "d",
            "text": "Mõõtühikud ei pea üldse sobima."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q030",
      "unitId": "lo-opik-u13",
      "stem": "Õige või vale? Mõõtkava 1 : 2 000 000 ütleb, et kaardil on vahemaa looduses olevast kaks miljonit korda pikem.",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g026",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Looduses on sama vahemaa kaks miljonit korda pikem kui kaardil.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
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
        "correctOptionId": "b",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u13-q031",
      "unitId": "lo-opik-u13",
      "stem": "Miks on mõõtkava vaja, kui tahad kaardilt kahe linna tegeliku kauguse leida?",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g027",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ilma mõõtkava teadmata ei saa paberil mõõdetud sentimeetreid usaldusväärselt kilomeetriteks teisendada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "See seob kaardil mõõdetud lõigu päris vahemaaga."
          },
          {
            "id": "b",
            "text": "See ütleb linnade elanike arvu."
          },
          {
            "id": "c",
            "text": "See näitab sõiduaja alati täpselt."
          },
          {
            "id": "d",
            "text": "See muudab linnade asukohti."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q032",
      "unitId": "lo-opik-u13",
      "stem": "Kahel eri kaardil on sama vahemaa eri pikkusega. Mis aitab teada saada, kui kaugel kohad tegelikult on?",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g028",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaartide kujutised võivad olla eri mõõtkavas. Tegelik kaugus leitakse vastava mõõtkava järgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kummagi kaardi mõõtkava."
          },
          {
            "id": "b",
            "text": "Ainult kaardi serva värv."
          },
          {
            "id": "c",
            "text": "Kaardile kirjutatud pealkirja pikkus."
          },
          {
            "id": "d",
            "text": "Ainult selle järgi, mitu pilti on raamatus."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q033",
      "unitId": "lo-opik-u13",
      "stem": "Vali kõik tõed arvmõõtkava 1 : 1 000 000 kohta.",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g029",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Arvmõõtkavas on vastavad ühikud ühesugused, ning tegu on pikkuste suhtega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "1 cm kaardil vastab 1 000 000 cm looduses."
          },
          {
            "id": "b",
            "text": "1 mm kaardil vastab 1 000 000 mm looduses."
          },
          {
            "id": "c",
            "text": "1 cm kaardil vastab 1 000 000 tunnile."
          },
          {
            "id": "d",
            "text": "Tegelikku vahemaad on vähendatud miljon korda."
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "d"
        ]
      }
    },
    {
      "id": "lo-opik-u13-q034",
      "unitId": "lo-opik-u13",
      "stem": "Milline võrdlus annab kõige otsesemalt edasi arvmõõtkava mõtte?",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g030",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Arvmõõtkava näitab pikkuste suhet kaardil ja looduses.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Pikkus kaardil : sama pikkus looduses."
          },
          {
            "id": "b",
            "text": "Sõiduaeg : bussi istekohtade arv."
          },
          {
            "id": "c",
            "text": "Linnad : kaardivärvid."
          },
          {
            "id": "d",
            "text": "Ilm : pilvede värv."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q035",
      "unitId": "lo-opik-u13",
      "stem": "Õige või vale? Kaardilõigu tegelikku pikkust võib alati leida ilma mõõtkava või muu vahemaateabeta.",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g031",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Kaardijoonise pikkus üksi ei ütle, mitu meetrit või kilomeetrit sellele looduses vastab.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
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
        "correctOptionId": "b",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u13-q036",
      "unitId": "lo-opik-u13",
      "stem": "Kaardi ääres seisab „1 cm – 50 km”. Mille jaoks on see teave?",
      "primaryObjectiveId": "lo-opik-u13-o3",
      "variantGroupId": "lo-opik-u13-g032",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõõtkava aitab teisendada kaardil mõõdetud lõike tegelikeks vahemaadeks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaardilõikude muutmiseks tegelikeks kaugusteks."
          },
          {
            "id": "b",
            "text": "Selleks, et arvutada linnade vanust."
          },
          {
            "id": "c",
            "text": "Selleks, et teada auto keskmist kiirust."
          },
          {
            "id": "d",
            "text": "Selleks, et määrata õhu temperatuuri."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q037",
      "unitId": "lo-opik-u13",
      "stem": "Kuidas nimetatakse mõõtkava, mida näidatakse jaotustega joonena?",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g033",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Joonmõõtkava kujutatakse jaotustega joonena.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Joonmõõtkava."
          },
          {
            "id": "b",
            "text": "Võrdlusmõõtkava."
          },
          {
            "id": "c",
            "text": "Arvmõõtkava."
          },
          {
            "id": "d",
            "text": "Ajaskaala."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q038",
      "unitId": "lo-opik-u13",
      "stem": "Näita skeemil joonmõõtkava.",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g033",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Joonmõõtkava on tähistega joon, näiteks 0–50 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u13-scale-forms",
        "correctRegionId": "bar"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u13-scale-forms"
      }
    },
    {
      "id": "lo-opik-u13-q039",
      "unitId": "lo-opik-u13",
      "stem": "Kuidas nimetatakse mõõtkava „1 cm – 50 km”?",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g034",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui mõõtkava ütleb 1 cm – 50 km, on tegu võrdlusmõõtkavaga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Võrdlusmõõtkava."
          },
          {
            "id": "b",
            "text": "Joonmõõtkava."
          },
          {
            "id": "c",
            "text": "Arvmõõtkava."
          },
          {
            "id": "d",
            "text": "Sõiduaeg."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q040",
      "unitId": "lo-opik-u13",
      "stem": "Näita skeemil võrdlusmõõtkava.",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g034",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Võrdlusmõõtkavas on kirjas näiteks „1 cm – 50 km”.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u13-scale-forms",
        "correctRegionId": "verbal"
      }
    },
    {
      "id": "lo-opik-u13-q041",
      "unitId": "lo-opik-u13",
      "stem": "Kuidas nimetatakse mõõtkava „1 : 5 000 000”?",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g035",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Arvmõõtkava kirjutatakse kahe arvu suhtena, näiteks 1 : 5 000 000.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Arvmõõtkava."
          },
          {
            "id": "b",
            "text": "Joonmõõtkava."
          },
          {
            "id": "c",
            "text": "Ilmakaare sümbol."
          },
          {
            "id": "d",
            "text": "Kaardi legend."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q042",
      "unitId": "lo-opik-u13",
      "stem": "Näita skeemil arvmõõtkava.",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g035",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Arvmõõtkava koosneb kahest arvust ja koolonist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u13-scale-forms",
        "correctRegionId": "numeric"
      }
    },
    {
      "id": "lo-opik-u13-q043",
      "unitId": "lo-opik-u13",
      "stem": "Ühenda iga mõõtkava kuju õige näitega.",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g036",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kolm näidet esitavad sama vahemaa suhet eri kujudes.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Joonmõõtkava"
          },
          {
            "id": "p2",
            "text": "Võrdlusmõõtkava"
          },
          {
            "id": "p3",
            "text": "Arvmõõtkava"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Jaotustega joon 0–50 km"
          },
          {
            "id": "c2",
            "text": "1 cm – 50 km"
          },
          {
            "id": "c3",
            "text": "1 : 5 000 000"
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
      "id": "lo-opik-u13-q044",
      "unitId": "lo-opik-u13",
      "stem": "Millised kaks kirjapilti tähendavad sama mõõtkava?",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g037",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "3 000 000 cm = 30 km, seega 1 cm – 30 km ja 1 : 3 000 000 on võrdsed.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "1 cm – 30 km"
          },
          {
            "id": "b",
            "text": "1 : 3 000 000"
          },
          {
            "id": "c",
            "text": "1 cm – 3 km"
          },
          {
            "id": "d",
            "text": "1 : 300 000"
          }
        ],
        "correctOptionIds": [
          "a",
          "b"
        ]
      }
    },
    {
      "id": "lo-opik-u13-q045",
      "unitId": "lo-opik-u13",
      "stem": "Vali arvmõõtkavale „1 : 5 000 000” vastav võrdlusmõõtkava.",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g038",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "5 000 000 cm = 50 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "1 cm – 50 km"
          },
          {
            "id": "b",
            "text": "1 cm – 5 km"
          },
          {
            "id": "c",
            "text": "1 cm – 500 km"
          },
          {
            "id": "d",
            "text": "1 cm – 500 m"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q046",
      "unitId": "lo-opik-u13",
      "stem": "Rühmita kirjapildid mõõtkava liigi järgi.",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g039",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kooloniga arvusuhe on arvmõõtkava; ühikutega kirje „1 cm – … km” on võrdlusmõõtkava.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "arv",
            "text": "Arvmõõtkava"
          },
          {
            "id": "vord",
            "text": "Võrdlusmõõtkava"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "1 : 1 000 000"
          },
          {
            "id": "i2",
            "text": "1 cm – 10 km"
          },
          {
            "id": "i3",
            "text": "1 : 3 000 000"
          },
          {
            "id": "i4",
            "text": "1 cm – 30 km"
          }
        ],
        "correctGroupByItem": {
          "i1": "arv",
          "i2": "vord",
          "i3": "arv",
          "i4": "vord"
        }
      }
    },
    {
      "id": "lo-opik-u13-q047",
      "unitId": "lo-opik-u13",
      "stem": "Õige või vale? Samal kaardil võib sama mõõtkava olla märgitud nii joonena kui ka arvude suhtena.",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g040",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õige. Õpiku Eesti kaardil on mõõtkava esitatud mitmel võrdväärsel kujul.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
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
        "correctOptionId": "a",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u13-q048",
      "unitId": "lo-opik-u13",
      "stem": "Mis on joonmõõtkava peamine tunnus?",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g041",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Joonmõõtkava on graafiline joon, mille jaotused näitavad tegelikke kaugusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Tegelik kaugus on näidatud jaotustega joonel."
          },
          {
            "id": "b",
            "text": "Mõõtkava on ainult ühes värvis."
          },
          {
            "id": "c",
            "text": "See näitab kohalejõudmise aega."
          },
          {
            "id": "d",
            "text": "See asendab kõik kohanimed."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q049",
      "unitId": "lo-opik-u13",
      "stem": "Miks võib üks kaart näidata mõõtkava kolmel erineval viisil?",
      "primaryObjectiveId": "lo-opik-u13-o4",
      "variantGroupId": "lo-opik-u13-g042",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Joon-, võrdlus- ja arvmõõtkava võivad esitada üht ja sama vähendamissuhet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Sama suurussuhet saab väljendada joone, sõnade või arvudega."
          },
          {
            "id": "b",
            "text": "Iga mõõtkava kuju näitab tingimata eri vahemaad."
          },
          {
            "id": "c",
            "text": "Mõõtkava muutub sõnade kirjutamisel."
          },
          {
            "id": "d",
            "text": "Joonmõõtkava tähistab ainult ilma."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q050",
      "unitId": "lo-opik-u13",
      "stem": "Mitu sentimeetrit on ühes meetris?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g043",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üks meeter võrdub 100 sentimeetriga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "100 cm"
          },
          {
            "id": "b",
            "text": "10 cm"
          },
          {
            "id": "c",
            "text": "1 000 cm"
          },
          {
            "id": "d",
            "text": "1 cm"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q051",
      "unitId": "lo-opik-u13",
      "stem": "Mitu meetrit on ühes kilomeetris?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g044",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üks kilomeeter võrdub 1 000 meetriga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "1 000 m"
          },
          {
            "id": "b",
            "text": "100 m"
          },
          {
            "id": "c",
            "text": "10 000 m"
          },
          {
            "id": "d",
            "text": "10 m"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q052",
      "unitId": "lo-opik-u13",
      "stem": "Mitu sentimeetrit on ühes kilomeetris?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g045",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1 km = 1 000 m = 100 000 cm.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "100 000 cm"
          },
          {
            "id": "b",
            "text": "1 000 cm"
          },
          {
            "id": "c",
            "text": "10 000 cm"
          },
          {
            "id": "d",
            "text": "1 000 000 cm"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q053",
      "unitId": "lo-opik-u13",
      "stem": "Õige või vale? 100 000 cm on sama pikkus kui 1 km.",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g045",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õige. 100 000 sentimeetrit on 1 kilomeeter.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
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
        "correctOptionId": "a",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u13-q054",
      "unitId": "lo-opik-u13",
      "stem": "Mitu kilomeetrit on 5 000 000 sentimeetrit?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g046",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "5 000 000 : 100 000 = 50 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "50 km"
          },
          {
            "id": "b",
            "text": "5 km"
          },
          {
            "id": "c",
            "text": "500 km"
          },
          {
            "id": "d",
            "text": "5000 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q055",
      "unitId": "lo-opik-u13",
      "stem": "Mitu kilomeetrit on 3 000 000 sentimeetrit?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g047",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "3 000 000 : 100 000 = 30 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "30 km"
          },
          {
            "id": "b",
            "text": "3 km"
          },
          {
            "id": "c",
            "text": "300 km"
          },
          {
            "id": "d",
            "text": "3000 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q056",
      "unitId": "lo-opik-u13",
      "stem": "Mõõtkava on 1 : 1 000 000. Mitu kilomeetrit vastab ühele sentimeetrile?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g048",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1 000 000 cm = 10 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "10 km"
          },
          {
            "id": "b",
            "text": "1 km"
          },
          {
            "id": "c",
            "text": "100 km"
          },
          {
            "id": "d",
            "text": "1000 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q057",
      "unitId": "lo-opik-u13",
      "stem": "Mõõtkava on 1 : 500 000. Mitu kilomeetrit vastab kaardil ühele sentimeetrile?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g049",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "500 000 cm = 5 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "5 km"
          },
          {
            "id": "b",
            "text": "0,5 km"
          },
          {
            "id": "c",
            "text": "50 km"
          },
          {
            "id": "d",
            "text": "500 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q058",
      "unitId": "lo-opik-u13",
      "stem": "Mõõtkava on 1 : 2 000 000. Mitu kilomeetrit vastab ühele sentimeetrile?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g050",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "2 000 000 : 100 000 = 20 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "20 km"
          },
          {
            "id": "b",
            "text": "2 km"
          },
          {
            "id": "c",
            "text": "200 km"
          },
          {
            "id": "d",
            "text": "2000 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q059",
      "unitId": "lo-opik-u13",
      "stem": "Mõõtkava on 1 : 10 000 000. Mitu kilomeetrit on looduses üks kaardisentimeeter?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g051",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "10 000 000 : 100 000 = 100 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "100 km"
          },
          {
            "id": "b",
            "text": "10 km"
          },
          {
            "id": "c",
            "text": "1000 km"
          },
          {
            "id": "d",
            "text": "1 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q060",
      "unitId": "lo-opik-u13",
      "stem": "Mõõtkava on 1 : 200 000. Mitu kilomeetrit vastab ühele sentimeetrile?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g052",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "200 000 : 100 000 = 2 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "2 km"
          },
          {
            "id": "b",
            "text": "20 km"
          },
          {
            "id": "c",
            "text": "0,2 km"
          },
          {
            "id": "d",
            "text": "200 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q061",
      "unitId": "lo-opik-u13",
      "stem": "Mõõtkava on 1 : 250 000. Mitu kilomeetrit vastab ühele sentimeetrile?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g053",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "250 000 : 100 000 = 2,5 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "2,5 km"
          },
          {
            "id": "b",
            "text": "25 km"
          },
          {
            "id": "c",
            "text": "0,25 km"
          },
          {
            "id": "d",
            "text": "250 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q062",
      "unitId": "lo-opik-u13",
      "stem": "Mõõtkava on 1 : 50 000. Kui pikk on looduses 1 cm kaardil?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g054",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "50 000 cm = 500 m.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "500 m"
          },
          {
            "id": "b",
            "text": "5 km"
          },
          {
            "id": "c",
            "text": "50 km"
          },
          {
            "id": "d",
            "text": "50 m"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q063",
      "unitId": "lo-opik-u13",
      "stem": "Ühenda arvmõõtkava ja sellele vastav kilomeetrite arv.",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g055",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jaga iga nimetaja 100 000-ga, et leida kilomeetrid ühele kaardisentimeetrile.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "1 : 100 000"
          },
          {
            "id": "p2",
            "text": "1 : 500 000"
          },
          {
            "id": "p3",
            "text": "1 : 1 000 000"
          },
          {
            "id": "p4",
            "text": "1 : 3 000 000"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "1 cm = 1 km"
          },
          {
            "id": "c2",
            "text": "1 cm = 5 km"
          },
          {
            "id": "c3",
            "text": "1 cm = 10 km"
          },
          {
            "id": "c4",
            "text": "1 cm = 30 km"
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
      "id": "lo-opik-u13-q064",
      "unitId": "lo-opik-u13",
      "stem": "Vali kõik õiged pikkuste võrdsused.",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g056",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1 km = 100 000 cm. Selle järgi saab kontrollida teisi võrdsusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "100 000 cm = 1 km"
          },
          {
            "id": "b",
            "text": "500 000 cm = 5 km"
          },
          {
            "id": "c",
            "text": "3 000 000 cm = 30 km"
          },
          {
            "id": "d",
            "text": "1 000 cm = 1 km"
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
      "id": "lo-opik-u13-q065",
      "unitId": "lo-opik-u13",
      "stem": "Kaardi arvmõõtkava on 1 : 3 000 000. Milline tehe muudab teise arvu sentimeetritest kilomeetriteks?",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g057",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sentimeetrite teisendamiseks kilomeetriteks tuleb arv jagada 100 000-ga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "3 000 000 : 100 000"
          },
          {
            "id": "b",
            "text": "3 000 000 × 100 000"
          },
          {
            "id": "c",
            "text": "3 000 000 + 100 000"
          },
          {
            "id": "d",
            "text": "3 000 000 : 10"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q066",
      "unitId": "lo-opik-u13",
      "stem": "Täida võrdluse mõte: kui 1 km = 100 000 cm, siis 600 000 cm on ...",
      "primaryObjectiveId": "lo-opik-u13-o5",
      "variantGroupId": "lo-opik-u13-g058",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "600 000 : 100 000 = 6 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "6 km"
          },
          {
            "id": "b",
            "text": "60 km"
          },
          {
            "id": "c",
            "text": "0,6 km"
          },
          {
            "id": "d",
            "text": "600 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q067",
      "unitId": "lo-opik-u13",
      "stem": "Õpiku kaardil mõõdeti Tartu ja Võru vahe 2 cm. Mõõtkava on 1 : 3 000 000. Kui suur on näites linnulennuline vahemaa?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g059",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1 cm = 30 km; 2 × 30 = 60 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "60 km"
          },
          {
            "id": "b",
            "text": "30 km"
          },
          {
            "id": "c",
            "text": "90 km"
          },
          {
            "id": "d",
            "text": "600 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q068",
      "unitId": "lo-opik-u13",
      "stem": "Kaardil mõõdetud lõik on 2 cm. Mõõtkava on 1 cm – 30 km. Mis on tegelik kaugus?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g059",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "2 × 30 km = 60 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "60 km"
          },
          {
            "id": "b",
            "text": "2 km"
          },
          {
            "id": "c",
            "text": "30 km"
          },
          {
            "id": "d",
            "text": "120 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q069",
      "unitId": "lo-opik-u13",
      "stem": "Kaardil on kahe küla vahe 3 cm. Võrdlusmõõtkava on 1 cm – 10 km. Mis on linnulennuline vahemaa?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g060",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "3 × 10 km = 30 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "30 km"
          },
          {
            "id": "b",
            "text": "3 km"
          },
          {
            "id": "c",
            "text": "10 km"
          },
          {
            "id": "d",
            "text": "300 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q070",
      "unitId": "lo-opik-u13",
      "stem": "Kaardil on kaks väljamõeldud küla 4 cm kaugusel. Mõõtkava 1 cm – 10 km. Mitu kilomeetrit on nende vahe?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g060",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "4 × 10 km = 40 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "40 km"
          },
          {
            "id": "b",
            "text": "10 km"
          },
          {
            "id": "c",
            "text": "14 km"
          },
          {
            "id": "d",
            "text": "400 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q071",
      "unitId": "lo-opik-u13",
      "stem": "Kaardil on kahe matkaraja punkti vahe 3 cm. Mõõtkava on 1 cm – 20 km. Kui kaugel on need punktid linnulennult?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g061",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "3 × 20 km = 60 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "60 km"
          },
          {
            "id": "b",
            "text": "20 km"
          },
          {
            "id": "c",
            "text": "23 km"
          },
          {
            "id": "d",
            "text": "600 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q072",
      "unitId": "lo-opik-u13",
      "stem": "Skeemil on linnade A ja B vahe kaardil 4 cm ning mõõtkava on 1 cm – 20 km. Mitu kilomeetrit on see looduses?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g061",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "4 × 20 km = 80 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "80 km"
          },
          {
            "id": "b",
            "text": "20 km"
          },
          {
            "id": "c",
            "text": "24 km"
          },
          {
            "id": "d",
            "text": "800 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q073",
      "unitId": "lo-opik-u13",
      "stem": "Mängukaardil on punktid P ja R teineteisest 5 cm kaugusel. Mõõtkava on 1 cm – 5 km. Leia tegelik vahemaa.",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g062",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "5 × 5 km = 25 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "25 km"
          },
          {
            "id": "b",
            "text": "5 km"
          },
          {
            "id": "c",
            "text": "10 km"
          },
          {
            "id": "d",
            "text": "50 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q074",
      "unitId": "lo-opik-u13",
      "stem": "Kaardil mõõdetud vahemaa on 6 cm. Arvmõõtkava 1 : 500 000. Leia tegelik vahemaa.",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g062",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1 cm = 5 km. 6 × 5 km = 30 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "30 km"
          },
          {
            "id": "b",
            "text": "6 km"
          },
          {
            "id": "c",
            "text": "3 km"
          },
          {
            "id": "d",
            "text": "300 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q075",
      "unitId": "lo-opik-u13",
      "stem": "Kaardi mõõtkava 1 : 5 000 000. Paberil mõõdeti kahe koha vahe 3 cm. Mitu kilomeetrit on vahe looduses?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g063",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1 cm = 50 km, 3 × 50 = 150 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "150 km"
          },
          {
            "id": "b",
            "text": "50 km"
          },
          {
            "id": "c",
            "text": "15 km"
          },
          {
            "id": "d",
            "text": "500 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q076",
      "unitId": "lo-opik-u13",
      "stem": "Kaardi mõõtkava 1 : 5 000 000. Kahe koha vahe kaardil on 1,5 cm. Mitu kilomeetrit on vahe looduses?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g063",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1 cm = 50 km; 1,5 × 50 km = 75 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "75 km"
          },
          {
            "id": "b",
            "text": "50 km"
          },
          {
            "id": "c",
            "text": "15 km"
          },
          {
            "id": "d",
            "text": "150 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q077",
      "unitId": "lo-opik-u13",
      "stem": "Kaardi mõõtkava on 1 : 1 000 000. Kaardil on lõik 2,5 cm. Milline on tegelik kaugus?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g064",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1 cm = 10 km; 2,5 × 10 km = 25 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "25 km"
          },
          {
            "id": "b",
            "text": "2,5 km"
          },
          {
            "id": "c",
            "text": "10 km"
          },
          {
            "id": "d",
            "text": "250 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q078",
      "unitId": "lo-opik-u13",
      "stem": "Kui mõõtkava on 1 cm – 20 km ning kaardil on vahe 3,5 cm, siis kui pikk on sirgjooneline vahemaa?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g064",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "3,5 × 20 km = 70 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "70 km"
          },
          {
            "id": "b",
            "text": "23,5 km"
          },
          {
            "id": "c",
            "text": "35 km"
          },
          {
            "id": "d",
            "text": "700 km"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q079",
      "unitId": "lo-opik-u13",
      "stem": "Järjesta näited tegeliku vahemaa järgi väiksemast suurimani.",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g065",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "A = 10 km, B = 30 km, C = 60 km ja D = 80 km. Seega järjestus on A, B, C, D.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "A: 2 cm, 1 cm – 5 km"
          },
          {
            "id": "s2",
            "text": "B: 3 cm, 1 cm – 10 km"
          },
          {
            "id": "s3",
            "text": "C: 2 cm, 1 cm – 30 km"
          },
          {
            "id": "s4",
            "text": "D: 4 cm, 1 cm – 20 km"
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3",
          "s4"
        ]
      }
    },
    {
      "id": "lo-opik-u13-q080",
      "unitId": "lo-opik-u13",
      "stem": "Ühenda antud kaardivahemaa selle tegeliku kaugusega. Kõigi näidete mõõtkava on 1 cm – 10 km.",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g066",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Korruta kaardil olev sentimeetrite arv kümnega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "1 cm kaardil"
          },
          {
            "id": "p2",
            "text": "2 cm kaardil"
          },
          {
            "id": "p3",
            "text": "3 cm kaardil"
          },
          {
            "id": "p4",
            "text": "4 cm kaardil"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "10 km"
          },
          {
            "id": "c2",
            "text": "20 km"
          },
          {
            "id": "c3",
            "text": "30 km"
          },
          {
            "id": "c4",
            "text": "40 km"
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
      "id": "lo-opik-u13-q081",
      "unitId": "lo-opik-u13",
      "stem": "Rühmita arvutused: kas tulemus on alla 50 km või vähemalt 50 km?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g067",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tulemused on vastavalt 20 km, 60 km, 40 km ja 60 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "alla",
            "text": "Alla 50 km"
          },
          {
            "id": "yle",
            "text": "Vähemalt 50 km"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "2 cm × 10 km/cm"
          },
          {
            "id": "i2",
            "text": "3 cm × 20 km/cm"
          },
          {
            "id": "i3",
            "text": "4 cm × 10 km/cm"
          },
          {
            "id": "i4",
            "text": "2 cm × 30 km/cm"
          }
        ],
        "correctGroupByItem": {
          "i1": "alla",
          "i2": "yle",
          "i3": "alla",
          "i4": "yle"
        }
      }
    },
    {
      "id": "lo-opik-u13-q082",
      "unitId": "lo-opik-u13",
      "stem": "Kaardi mõõtkava on 1 cm – 10 km. Milline tehe leiab 4 cm pikkuse kaardilõigu tegeliku pikkuse?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g068",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tegelik pikkus kilomeetrites on kaardisentimeetrid korrutatud km arvuga ühe sentimeetri kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "4 × 10"
          },
          {
            "id": "b",
            "text": "4 + 10"
          },
          {
            "id": "c",
            "text": "10 : 4"
          },
          {
            "id": "d",
            "text": "4 × 100 000 kilomeetrit"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q083",
      "unitId": "lo-opik-u13",
      "stem": "Milline on õige tegevuste järjekord, kui tahad kaardilt kahe koha kaugust leida?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g069",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik juhendab esmalt mõõtma, siis vaatama mõõtkava ning lõpuks vahemaad arvutama.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Mõõda kaardil kohtadevaheline sirglõik."
          },
          {
            "id": "s2",
            "text": "Leia ja loe kaardi mõõtkava."
          },
          {
            "id": "s3",
            "text": "Teisenda vajaduse korral ühikud."
          },
          {
            "id": "s4",
            "text": "Arvuta tegelik vahemaa."
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3",
          "s4"
        ]
      }
    },
    {
      "id": "lo-opik-u13-q084",
      "unitId": "lo-opik-u13",
      "stem": "Loe tabelit. Kui suur on kahe koha vahe näites B?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g070",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Näites B on 3 cm × 20 km/cm = 60 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "60 km"
          },
          {
            "id": "b",
            "text": "30 km"
          },
          {
            "id": "c",
            "text": "20 km"
          },
          {
            "id": "d",
            "text": "90 km"
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "caption": "Väljamõeldud kaartide andmed",
        "headers": [
          "Näide",
          "Kaardilõik",
          "Mõõtkava"
        ],
        "rows": [
          [
            "A",
            "2 cm",
            "1 cm – 10 km"
          ],
          [
            "B",
            "3 cm",
            "1 cm – 20 km"
          ],
          [
            "C",
            "4 cm",
            "1 cm – 5 km"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u13-q085",
      "unitId": "lo-opik-u13",
      "stem": "Näita skeemil mõõdetavat lõiku kahe tähistatud punkti vahel.",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g071",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardil mõõdetakse kahe koha vahelist sirglõiku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u13-measured-distance",
        "correctRegionId": "segment"
      }
    },
    {
      "id": "lo-opik-u13-q086",
      "unitId": "lo-opik-u13",
      "stem": "Näita skeemil kohta, kus on antud kaardi mõõtkava.",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g072",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõõtkava ütleb, millisele tegelikule pikkusele kaardil olev lõik vastab.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u13-measured-distance",
        "correctRegionId": "scale"
      }
    },
    {
      "id": "lo-opik-u13-q087",
      "unitId": "lo-opik-u13",
      "stem": "Kui arvutad vahemaad, mida tähendab korrutises 2 × 30 arv 2?",
      "primaryObjectiveId": "lo-opik-u13-o6",
      "variantGroupId": "lo-opik-u13-g073",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku Tartu–Võru näites on mõõdetud kaardilõik 2 cm.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaardil mõõdetud pikkust sentimeetrites."
          },
          {
            "id": "b",
            "text": "Kilomeetrite arvu ühes sentimeetris."
          },
          {
            "id": "c",
            "text": "Maailmajagude arvu."
          },
          {
            "id": "d",
            "text": "Bussi sõidutunde."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q088",
      "unitId": "lo-opik-u13",
      "stem": "Kumb mõõtkava on suurem: 1 : 100 000 või 1 : 1 000 000?",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g074",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1/100 000 on suurem kui 1/1 000 000. Väiksem nimetaja tähendab suuremat mõõtkava.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "1 : 100 000"
          },
          {
            "id": "b",
            "text": "1 : 1 000 000"
          },
          {
            "id": "c",
            "text": "Mõlemad on alati võrdsed."
          },
          {
            "id": "d",
            "text": "Neid ei saa omavahel võrrelda."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q089",
      "unitId": "lo-opik-u13",
      "stem": "Õige või vale? Arvmõõtkava 1 : 5 000 000 on suurem kui 1 : 500 000.",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g074",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. 1 : 500 000 on suurem mõõtkava, sest selle nimetaja on väiksem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
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
        "correctOptionId": "b",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u13-q090",
      "unitId": "lo-opik-u13",
      "stem": "Kummal kaardil kujutab sama 1 cm looduses väiksemat vahemaad?",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g075",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1 : 100 000 kaardil on 1 cm = 1 km; 1 : 1 000 000 kaardil 1 cm = 10 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "1 : 100 000 kaardil."
          },
          {
            "id": "b",
            "text": "1 : 1 000 000 kaardil."
          },
          {
            "id": "c",
            "text": "Mõlemal on alati 10 km."
          },
          {
            "id": "d",
            "text": "Kummalgi ei kujuta see mingit kaugust."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q091",
      "unitId": "lo-opik-u13",
      "stem": "Millise mõõtkavaga kaardile mahub sama suurusele lehele tavaliselt rohkem väikseid tänavaid?",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g076",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Suurema mõõtkavaga 1 : 10 000 kujutab väikest ala detailsemalt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "1 : 10 000"
          },
          {
            "id": "b",
            "text": "1 : 1 000 000"
          },
          {
            "id": "c",
            "text": "1 : 10 000 000"
          },
          {
            "id": "d",
            "text": "Kõik kaardid mahutavad samad tänavad."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q092",
      "unitId": "lo-opik-u13",
      "stem": "Järjesta mõõtkavad suuremast väiksemani.",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g077",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui esimene arv on alati 1, on väiksema nimetajaga mõõtkava suurem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "1 : 50 000"
          },
          {
            "id": "s2",
            "text": "1 : 100 000"
          },
          {
            "id": "s3",
            "text": "1 : 500 000"
          },
          {
            "id": "s4",
            "text": "1 : 5 000 000"
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3",
          "s4"
        ]
      }
    },
    {
      "id": "lo-opik-u13-q093",
      "unitId": "lo-opik-u13",
      "stem": "Kaks ühesuurust kaarti kujutavad sama kohta. Ühe mõõtkava on 1 : 100 000, teisel 1 : 1 000 000. Millisel joonistatakse sama tegelik tee pikema lõiguna?",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g078",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Suurema mõõtkava korral on sama tegelik vahemaa kaardil pikem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaardil 1 : 100 000."
          },
          {
            "id": "b",
            "text": "Kaardil 1 : 1 000 000."
          },
          {
            "id": "c",
            "text": "Mõlemal kujutatakse teed sama pikkusena."
          },
          {
            "id": "d",
            "text": "Tee ei mahu kummalegi kaardile."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q094",
      "unitId": "lo-opik-u13",
      "stem": "Vali kõik suuremad mõõtkavad kui 1 : 1 000 000.",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g079",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Suuremad mõõtkavad on need, mille nimetaja on väiksem kui miljon.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "1 : 50 000"
          },
          {
            "id": "b",
            "text": "1 : 100 000"
          },
          {
            "id": "c",
            "text": "1 : 5 000 000"
          },
          {
            "id": "d",
            "text": "1 : 500 000"
          }
        ],
        "correctOptionIds": [
          "a",
          "b",
          "d"
        ]
      }
    },
    {
      "id": "lo-opik-u13-q095",
      "unitId": "lo-opik-u13",
      "stem": "Mis muutub sama suurel lehel, kui mõõtkava läheb 1 : 1 000 000-lt 1 : 100 000-le?",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g080",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1 : 100 000 on suurem mõõtkava; sellega näeb sama suurusel lehel väiksemat ala detailsemalt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kujutatav maa-ala muutub väiksemaks ja objektid suuremaks."
          },
          {
            "id": "b",
            "text": "Kujutatav maa-ala muutub kümme korda suuremaks."
          },
          {
            "id": "c",
            "text": "Kõik objektid kaovad."
          },
          {
            "id": "d",
            "text": "Maanteede tegelik pikkus väheneb."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q096",
      "unitId": "lo-opik-u13",
      "stem": "Kaarte A ja B kirjeldatakse tabelis. Milline on suurema mõõtkavaga kaart?",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g081",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi A mõõtkava 1 : 200 000 on suurem kui B mõõtkava 1 : 2 000 000.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaart A"
          },
          {
            "id": "b",
            "text": "Kaart B"
          },
          {
            "id": "c",
            "text": "Mõlemad sama"
          },
          {
            "id": "d",
            "text": "Tabelist ei saa võrrelda"
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Kaart",
          "Arvmõõtkava",
          "1 cm looduses"
        ],
        "rows": [
          [
            "A",
            "1 : 200 000",
            "2 km"
          ],
          [
            "B",
            "1 : 2 000 000",
            "20 km"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u13-q097",
      "unitId": "lo-opik-u13",
      "stem": "Milline väide suurema mõõtkava kohta on õige?",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g082",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Suurem mõõtkava tähendab üksikasjalikumat esitust väiksema ala kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "See võimaldab sama kaardisuuruse juures väiksemat ala rohkem detailida."
          },
          {
            "id": "b",
            "text": "See tähendab alati maailma suuremat kujutamist."
          },
          {
            "id": "c",
            "text": "Selle teine arv on tingimata suurem."
          },
          {
            "id": "d",
            "text": "Sellel ei saa kasutada joonmõõtkava."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q098",
      "unitId": "lo-opik-u13",
      "stem": "Millises variandis on kaardid mõõtkava järgi õigesti võrreldud?",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g083",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1/500 000 on suurem kui 1/5 000 000, sest nimetaja on väiksem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "1 : 500 000 > 1 : 5 000 000"
          },
          {
            "id": "b",
            "text": "1 : 5 000 000 > 1 : 500 000"
          },
          {
            "id": "c",
            "text": "1 : 500 000 = 1 : 5 000 000"
          },
          {
            "id": "d",
            "text": "1 : 50 000 < 1 : 500 000"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q099",
      "unitId": "lo-opik-u13",
      "stem": "Hiiumaa ja Kärdla ümbruse kaardid on õpikus kõrvuti. Millisel kaardil on väiksem piirkond suurendatult?",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g084",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kärdla ümbruse kaart kujutab väiksemat piirkonda suuremalt ning näitab rohkem pisidetaile.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kärdla ümbruse kaardil."
          },
          {
            "id": "b",
            "text": "Terve Hiiumaa kaardil."
          },
          {
            "id": "c",
            "text": "Mõlemad peavad näitama kogu maailma."
          },
          {
            "id": "d",
            "text": "Kumbki ei ole kaart."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q100",
      "unitId": "lo-opik-u13",
      "stem": "Vali suurema mõõtkavaga kaardi kohta sobivad väited.",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g085",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Suurem mõõtkava tähendab väiksemat vähendamiskordajat ja suuremat joonist sama tegeliku vahemaa kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "Selle 1 : N nimetaja on väiksem."
          },
          {
            "id": "b",
            "text": "Sama vahemaa võtab kaardil rohkem ruumi."
          },
          {
            "id": "c",
            "text": "Sama lehe peal saab näidata väiksemat ala detailsemalt."
          },
          {
            "id": "d",
            "text": "Selle 1 : N nimetaja peab olema suurem."
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
      "id": "lo-opik-u13-q101",
      "unitId": "lo-opik-u13",
      "stem": "Ühenda kaart ja sama 1 cm-ga esitatud tegelik kaugus.",
      "primaryObjectiveId": "lo-opik-u13-o7",
      "variantGroupId": "lo-opik-u13-g086",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mida väiksem on nimetaja, seda väiksemat päris vahemaad kujutab sama sentimeeter.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "55"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "1 : 50 000"
          },
          {
            "id": "p2",
            "text": "1 : 100 000"
          },
          {
            "id": "p3",
            "text": "1 : 1 000 000"
          },
          {
            "id": "p4",
            "text": "1 : 5 000 000"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "500 m"
          },
          {
            "id": "c2",
            "text": "1 km"
          },
          {
            "id": "c3",
            "text": "10 km"
          },
          {
            "id": "c4",
            "text": "50 km"
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
      "id": "lo-opik-u13-q102",
      "unitId": "lo-opik-u13",
      "stem": "Mida tähendab linnulennuline kaugus?",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g087",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Linnulennuline kaugus mõõdetakse kahe punkti vahel mööda sirgjoont.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kahe koha vahelist sirgjoonelist kaugust."
          },
          {
            "id": "b",
            "text": "Sõiduks kuluvat aega."
          },
          {
            "id": "c",
            "text": "Kõigi teeäärsete peatuste arvu."
          },
          {
            "id": "d",
            "text": "Üksnes lennupiletite hinda."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q103",
      "unitId": "lo-opik-u13",
      "stem": "Miks võib maanteesõit olla pikem kui kaardilt mõõdetud linnulennuline kaugus?",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g088",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maantee ei kulge tavaliselt täiesti sirgelt. Seetõttu võib teekond olla pikem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Tee teeb kurve ja läbib eri kohti."
          },
          {
            "id": "b",
            "text": "Sest sentimeeter muutub autos pikemaks."
          },
          {
            "id": "c",
            "text": "Sest kaardi mõõtkava muudab loodust."
          },
          {
            "id": "d",
            "text": "Sest kahe linna asukohad muutuvad sõites."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q104",
      "unitId": "lo-opik-u13",
      "stem": "Näita skeemil kahe punkti vahelist sirgjoonelist kaugust.",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g089",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sirglõik näitab linnulennulist kaugust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u13-direct-vs-route",
        "correctRegionId": "direct"
      }
    },
    {
      "id": "lo-opik-u13-q105",
      "unitId": "lo-opik-u13",
      "stem": "Näita skeemil kurvilist teed, mida mööda sõites võivad kilomeetrid lisanduda.",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g089",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kurviline tee võib olla pikem kui samade punktide vaheline sirgjoon.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u13-direct-vs-route",
        "correctRegionId": "road"
      }
    },
    {
      "id": "lo-opik-u13-q106",
      "unitId": "lo-opik-u13",
      "stem": "Mida mõõdetakse tavaliselt tundides?",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g090",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tunnid mõõdavad aega; meetrid ja kilomeetrid mõõdavad vahemaad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "57"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kohalejõudmise aega."
          },
          {
            "id": "b",
            "text": "Riigi pindala."
          },
          {
            "id": "c",
            "text": "Kaardi pikkust."
          },
          {
            "id": "d",
            "text": "Saarte arvu."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q107",
      "unitId": "lo-opik-u13",
      "stem": "Vali kõik asjaolud, mis võivad mõjutada sõiduaega.",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g091",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sõidu kestust mõjutavad teekond, kiirus ja peatused, mitte kaardi värv.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "57"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "Liikumiskiirus"
          },
          {
            "id": "b",
            "text": "Teekonna pikkus"
          },
          {
            "id": "c",
            "text": "Peatused ja liiklus"
          },
          {
            "id": "d",
            "text": "Kaardi kaane värvus"
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
      "id": "lo-opik-u13-q108",
      "unitId": "lo-opik-u13",
      "stem": "Õige või vale? Kui lennuk on kiirem kui purjelaev, võib sama vahemaa läbimiseks kuluda vähem aega.",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g092",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õige. Õpikus võrreldakse kaugreise meritsi ja lennukiga; kiirem sõiduk lühendab sageli sõiduaega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "57"
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
        "correctOptionId": "a",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u13-q109",
      "unitId": "lo-opik-u13",
      "stem": "Miks tundub mõni kauge paik tänapäeval ajaliselt lähemal kui vanasti?",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g092",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Teekonna kilomeetrid ei kao. Kiirem transport võib lühendada kohalejõudmise aega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "57"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kiiremad sõidukid võivad sama tee läbida lühema ajaga."
          },
          {
            "id": "b",
            "text": "Mandritevahelised kilomeetrid on kadunud."
          },
          {
            "id": "c",
            "text": "Maa on palju väiksemaks muutunud."
          },
          {
            "id": "d",
            "text": "Kaart on muutnud maailma asukohti."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q110",
      "unitId": "lo-opik-u13",
      "stem": "Sama 40 km pikkuse tee läbimiseks kulub sõidukil A 1 tund ja sõidukil B 2 tundi. Kumb jõudis sama tee kiiremini läbida?",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g093",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sama vahemaa 1 tunniga läbinud sõiduk on kiirem kui see, millel kulus 2 tundi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "57"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Sõiduk A"
          },
          {
            "id": "b",
            "text": "Sõiduk B"
          },
          {
            "id": "c",
            "text": "Mõlemad kulutasid sama aja"
          },
          {
            "id": "d",
            "text": "Seda ei saa öelda, kuigi ajad on antud"
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Sõiduk",
          "Tee pikkus",
          "Sõiduaeg"
        ],
        "rows": [
          [
            "A",
            "40 km",
            "1 tund"
          ],
          [
            "B",
            "40 km",
            "2 tundi"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u13-q111",
      "unitId": "lo-opik-u13",
      "stem": "Rühmita: kas see on vahemaa või aja mõõtühik?",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g094",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahemaad mõõdetakse meetrites ja kilomeetrites; aega minutites ja tundides.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "57"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "dist",
            "text": "Vahemaa"
          },
          {
            "id": "time",
            "text": "Aeg"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "kilomeeter"
          },
          {
            "id": "i2",
            "text": "minut"
          },
          {
            "id": "i3",
            "text": "meeter"
          },
          {
            "id": "i4",
            "text": "tund"
          }
        ],
        "correctGroupByItem": {
          "i1": "dist",
          "i2": "time",
          "i3": "dist",
          "i4": "time"
        }
      }
    },
    {
      "id": "lo-opik-u13-q112",
      "unitId": "lo-opik-u13",
      "stem": "Ühenda küsimus sellega, mida on vaja teada.",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g095",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sirgjooneline kaugus, teekonna pikkus ja kohalejõudmise aeg ei ole sama suurus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "57"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Kui kaugel on kaks linna linnulennult?"
          },
          {
            "id": "p2",
            "text": "Kui pikk on maanteel läbitav tee?"
          },
          {
            "id": "p3",
            "text": "Millal jõuan kohale?"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Sirgjooneline vahemaa."
          },
          {
            "id": "c2",
            "text": "Teekonna tegelik pikkus."
          },
          {
            "id": "c3",
            "text": "Sõiduaeg ja väljumise aeg."
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
      "id": "lo-opik-u13-q113",
      "unitId": "lo-opik-u13",
      "stem": "Auto sõidab 80 km pikkust maanteed. Linnulennult on samade kohtade vahe 60 km. Miks arvud erinevad?",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g096",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maantee pikkus võib erineda sirgjoonelisest kaugusest; antud näites on see 20 km pikem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Maantee võib kulgeda kurvide ja ringiga."
          },
          {
            "id": "b",
            "text": "Mõõtkava muudab looduses vahemaad."
          },
          {
            "id": "c",
            "text": "80 km ja 60 km on alati sama arv."
          },
          {
            "id": "d",
            "text": "Autol on rohkem rattaid kui linnul."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q114",
      "unitId": "lo-opik-u13",
      "stem": "Kaks sihtkohta on linnulennult sama kaugel. Kas sinna kuluv sõiduaeg peab olema täpselt sama?",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g097",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sõiduaega mõjutavad peale linnulennulise kauguse ka teekond ja sõiduolud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "57"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Ei, teede pikkus, kiirus ja peatused võivad erineda."
          },
          {
            "id": "b",
            "text": "Jah, sama linnulennuline kaugus annab alati sama aja."
          },
          {
            "id": "c",
            "text": "Jah, kui mõlemad on kaardil märgitud."
          },
          {
            "id": "d",
            "text": "Ei, sest sentimeetreid ei tohi teisendada."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q115",
      "unitId": "lo-opik-u13",
      "stem": "Millist infot saab mõõtkava ja kaardil mõõdetud sirglõigu põhjal kõige otsesemalt arvutada?",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g098",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõõtkava lubab arvutada sirglõigu tegeliku pikkuse; aeg sõltub ka sõidutingimustest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kohtade linnulennulise kauguse."
          },
          {
            "id": "b",
            "text": "Bussi täpse kohalejõudmise aja."
          },
          {
            "id": "c",
            "text": "Kõigi autosõidul tehtavate peatuste arvu."
          },
          {
            "id": "d",
            "text": "Teele kulutatava kütuse täpse koguse."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u13-q116",
      "unitId": "lo-opik-u13",
      "stem": "Õige või vale? Kui kahe linna linnulennuline vahemaa on 60 km, on nendevaheline maanteetee alati samuti 60 km.",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g099",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Tee võib teha kurve ja olla 60 km-st pikem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "56"
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
        "correctOptionId": "b",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u13-q117",
      "unitId": "lo-opik-u13",
      "stem": "Järjesta mõisted: mida saad kaartidega võrdlemisel teada alates antud teabest kuni reisi planeerimiseni?",
      "primaryObjectiveId": "lo-opik-u13-o8",
      "variantGroupId": "lo-opik-u13-g100",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõõtkavast saab linnulennulise kauguse; seejärel planeeritakse teekond ning hinnatakse sõiduaega. Viimaste jaoks on vaja lisateavet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "57"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Mõõtkava kaardil"
          },
          {
            "id": "s2",
            "text": "Linnulennuline kaugus"
          },
          {
            "id": "s3",
            "text": "Teekonna pikkus"
          },
          {
            "id": "s4",
            "text": "Kohalejõudmise aeg"
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3",
          "s4"
        ]
      }
    }
  ]
};
