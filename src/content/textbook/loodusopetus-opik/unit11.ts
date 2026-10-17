// Unit 11 — Gloobus. Textbook pages 48-49; corrected transcription and photographs reviewed.
// Supplementary statements and links are attributed to NASA, NOAA, and Royal Museums Greenwich.
// Declarative framework content. Register SVG diagrams before publishing.
// This ready authoring status does NOT publish it to Kiur.

import type { Unit } from '@/lib/textbook/types';

export const unit11: Unit = {
  "id": "lo-opik-u11",
  "courseId": "loodusopetus-opik",
  "number": 11,
  "title": "Gloobus",
  "pages": {
    "from": 48,
    "to": 49
  },
  "status": "ready",
  "contentVersion": "2026-10-17.1",
  "objectives": [
    {
      "id": "lo-opik-u11-o1",
      "description": "Tean, mis on gloobus ja miks nimetatakse seda Maa vähendatud ning lihtsustatud mudeliks.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ]
    },
    {
      "id": "lo-opik-u11-o2",
      "description": "Eristan maapinna kõrgusi kujutavat gloobust riike kujutavast gloobusest ning tean gloobuse võimalusi ja piire.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ]
    },
    {
      "id": "lo-opik-u11-o3",
      "description": "Tean, mis on Maa kujuteldav pöörlemistelg, põhjapoolus ja lõunapoolus.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        },
        {
          "kind": "supplementary",
          "url": "https://science.nasa.gov/earth/facts/",
          "attribution": "NASA Science — Facts About Earth"
        }
      ]
    },
    {
      "id": "lo-opik-u11-o4",
      "description": "Tean, et ekvaator jagab Maa põhja- ja lõunapoolkeraks, ning oskan neid gloobusel eristada.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ]
    },
    {
      "id": "lo-opik-u11-o5",
      "description": "Eristan paralleele ehk rööbikuid meridiaanidest ning tean, kuidas need gloobusel kulgevad.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        },
        {
          "kind": "supplementary",
          "url": "https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html",
          "attribution": "NOAA National Ocean Service — Latitude and longitude"
        }
      ]
    },
    {
      "id": "lo-opik-u11-o6",
      "description": "Tean, mis on nullmeridiaan ja kuidas selle järgi eristada ida- ning läänepoolkera.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        },
        {
          "kind": "supplementary",
          "url": "https://www.rmg.co.uk/stories/time/what-prime-meridian-why-it-greenwich",
          "attribution": "Royal Museums Greenwich — Prime Meridian"
        }
      ]
    },
    {
      "id": "lo-opik-u11-o7",
      "description": "Oskan ekvaatori ja nullmeridiaani järgi määrata, et Eesti asub põhja- ja idapoolkeral.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u11-l1",
      "title": "Gloobus on Maa mudel",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u11-o1",
        "lo-opik-u11-o2"
      ],
      "sections": [
        {
          "id": "lo-opik-u11-l1-s1",
          "title": "Väiksem ja lihtsam Maa",
          "blocks": [
            {
              "id": "lo-opik-u11-b001",
              "type": "paragraph",
              "text": "Maa on nii suur, et seda on raske endale ette kujutada. Selleks et maakeraga oleks lihtne tutvuda, on hea vaadata gloobust ehk Maa vähendatud ja lihtsustatud mudelit. Gloobuse pinnale joonistatud maismaa- ja mereosad paiknevad üksteise suhtes just nii, nagu need tegelikult maakeral asuvad.",
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            },
            {
              "id": "lo-opik-u11-b002",
              "type": "definition",
              "term": "Gloobus",
              "definition": "Maa vähendatud ja lihtsustatud mudel.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b003",
              "type": "keyFact",
              "items": [
                "Gloobus näitab Maa ligikaudset kerakuju ning maismaa ja mere paiknemist.",
                "Gloobusel on kogu Maa palju-palju väiksem kui tegelikult."
              ],
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            }
          ]
        },
        {
          "id": "lo-opik-u11-l1-s2",
          "title": "Gloobuseid on mitmesuguseid",
          "blocks": [
            {
              "id": "lo-opik-u11-b004",
              "type": "paragraph",
              "text": "Gloobuseid on mitmesuguseid: mõnel on kujutatud mägesid ja orge, mõnel aga riike ja pealinnu.",
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            },
            {
              "id": "lo-opik-u11-b005",
              "type": "diagram",
              "diagramId": "u11-globe-types",
              "caption": "Vasakul on maapinna kõrgusi ja madalusi kujutav gloobus, paremal riike eristav gloobus. Joonised on selgitavad skeemid, mitte täpsed maailma- või riigipiiride kaardid.",
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            },
            {
              "id": "lo-opik-u11-b006",
              "type": "comparison",
              "title": "Mida saab eri gloobustelt uurida?",
              "columns": [
                {
                  "heading": "Pinnamoodi kujutav gloobus",
                  "points": [
                    "Näitab kõrgemaid ja madalamaid maismaa-alasid.",
                    "Värvid aitavad eristada maapinna kõrgusi."
                  ]
                },
                {
                  "heading": "Riike kujutav gloobus",
                  "points": [
                    "Näitab riikide paiknemist.",
                    "Riigid võivad olla eristatud eri värvidega."
                  ]
                }
              ],
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            }
          ]
        },
        {
          "id": "lo-opik-u11-l1-s3",
          "title": "Kas gloobusest on reisil abi?",
          "blocks": [
            {
              "id": "lo-opik-u11-b007",
              "type": "paragraph",
              "text": "Reisile aga gloobusega minna ei saa: see on liiga suur, et teda taskusse või reisikotti pista. Pealegi poleks temast võõras linnas ka mingit abi, sest linn paistab gloobusel heal juhul vaid väikese täpina.",
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            },
            {
              "id": "lo-opik-u11-b008",
              "type": "paragraph",
              "text": "Kui tahad võrrelda maailma eri paiku, sobib gloobus hästi. Kui aga otsid võõras linnas kindlat tänavat, vajad palju üksikasjalikumat kaarti.",
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            },
            {
              "id": "lo-opik-u11-b009",
              "type": "keyFact",
              "items": [
                "Gloobus aitab näha kogu Maad.",
                "Väikese koha, näiteks ühe linnatänava, uurimiseks on gloobus liiga üldine."
              ],
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u11-l2",
      "title": "Maa telg ja poolused",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u11-o3"
      ],
      "sections": [
        {
          "id": "lo-opik-u11-l2-s1",
          "title": "Kujuteldav telg",
          "blocks": [
            {
              "id": "lo-opik-u11-b010",
              "type": "paragraph",
              "text": "Gloobus pöörleb ümber oma telje nagu Maagi, ainult Maa telg on kujuteldav. Mõlema teljed on ka ühtmoodi kaldu.",
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            },
            {
              "id": "lo-opik-u11-b011",
              "type": "paragraph",
              "text": "Maa pöörlemistelg on kujuteldav sirge, mis läbib Maa keskpunkti. Maal ei ole päriselt teljepulka, kuid gloobusel hoiab pulk mudelit paigal ja võimaldab seda keerutada.",
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            },
            {
              "id": "lo-opik-u11-b012",
              "type": "diagram",
              "diagramId": "u11-axis-poles",
              "caption": "Skeemil läbib kujuteldav telg Maa keskpunkti ning ulatub mõlema pooluseni. Telg on kaldu; tegelikul Maal ei ole teljepulka.",
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            }
          ]
        },
        {
          "id": "lo-opik-u11-l2-s2",
          "title": "Kus asuvad poolused?",
          "blocks": [
            {
              "id": "lo-opik-u11-b013",
              "type": "paragraph",
              "text": "Koht, kus Maa kujuteldav telg lõikuks Maa pinnaga, on poolus. Põhjapoolkeral nimetatakse seda põhjapooluseks ja lõunapoolkeral lõunapooluseks.",
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            },
            {
              "id": "lo-opik-u11-b014",
              "type": "definition",
              "term": "Põhjapoolus",
              "definition": "Maa kõige põhjapoolsem punkt.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b015",
              "type": "definition",
              "term": "Lõunapoolus",
              "definition": "Maa kõige lõunapoolsem punkt.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b016",
              "type": "keyFact",
              "items": [
                "Maa telg on kujuteldav, kuid gloobusel saab telge näidata.",
                "Telje kaks otsa on põhjapoolus ja lõunapoolus."
              ],
              "source": {
                "kind": "textbook",
                "pages": "48"
              }
            },
            {
              "id": "lo-opik-u11-b017",
              "type": "enrichment",
              "variant": "extra",
              "title": "Lisateadmine: Maa telg on kaldu",
              "body": [
                "NASA andmetel on Maa pöörlemistelg umbes 23,4 kraadi kaldu võrreldes Maa orbiidi tasandi ristsirgega. Just telje kalle aitab põhjustada aastaaegade vaheldumist. Selle arvu teadmine ei ole selles õppetükis vajalik."
              ],
              "source": {
                "kind": "supplementary",
                "url": "https://science.nasa.gov/earth/facts/",
                "attribution": "NASA Science — Facts About Earth"
              }
            },
            {
              "id": "lo-opik-u11-b018",
              "type": "externalResource",
              "title": "Uuri Maad kolmemõõtmeliselt",
              "intro": "NASA keskkonnas saad uurida Maa vaateid ja satelliitide tööd. See on päris teadusandmete keskkond, mitte meie õppejoonis.",
              "url": "https://eyes.nasa.gov/apps/earth/",
              "publisher": "NASA / JPL-Caltech",
              "resourceType": "interactive",
              "observe": "Vaata, kuidas keraline Maa on ekraanil pööratav. Püüa leida maa- ja veealasid."
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u11-l3",
      "title": "Ekvaator, paralleelid ja meridiaanid",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u11-o4",
        "lo-opik-u11-o5"
      ],
      "sections": [
        {
          "id": "lo-opik-u11-l3-s1",
          "title": "Ekvaator jagab Maa pooleks",
          "blocks": [
            {
              "id": "lo-opik-u11-b019",
              "type": "paragraph",
              "text": "Gloobusel on palju jooni, millest moodustub justkui võrk. Kõige tähtsam joon on ekvaator, mis jagab maakera kõige laiemast kohast pooleks: põhjapoolkeraks ja lõunapoolkeraks.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b020",
              "type": "definition",
              "term": "Ekvaator",
              "definition": "Joon, mis jaotab Maa põhja- ja lõunapoolkeraks.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b021",
              "type": "diagram",
              "diagramId": "u11-equator-parallels",
              "caption": "Keskel kulgev jämedam joon kujutab ekvaatorit. Sellest põhja pool on põhjapoolkera ja lõuna pool lõunapoolkera. Peenemad jooned on paralleelid.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b022",
              "type": "keyFact",
              "items": [
                "Ekvaatorist põhja pool asub põhjapoolkera.",
                "Ekvaatorist lõuna pool asub lõunapoolkera."
              ],
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            }
          ]
        },
        {
          "id": "lo-opik-u11-l3-s2",
          "title": "Paralleelid ehk rööbikud",
          "blocks": [
            {
              "id": "lo-opik-u11-b023",
              "type": "paragraph",
              "text": "Teised jooned, mis kulgevad nagu ekvaatorgi ida-läänesuunaliselt, on paralleelid ehk rööbikud.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b024",
              "type": "paragraph",
              "text": "Paralleelid kulgevad üksteisega rööbiti. Need ei kohtu omavahel. Ekvaator on samuti paralleel.",
              "source": {
                "kind": "supplementary",
                "url": "https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html",
                "attribution": "NOAA National Ocean Service — Latitude and longitude"
              }
            },
            {
              "id": "lo-opik-u11-b025",
              "type": "comparison",
              "title": "Paralleelid ja ekvaator",
              "columns": [
                {
                  "heading": "Ekvaator",
                  "points": [
                    "Üks kindel ja eriti tähtis paralleel.",
                    "Jagab Maa põhja- ja lõunapoolkeraks."
                  ]
                },
                {
                  "heading": "Teised paralleelid",
                  "points": [
                    "Kulgevad ekvaatoriga samas suunas.",
                    "Aitavad määrata asukohta põhja või lõuna pool."
                  ]
                }
              ],
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            }
          ]
        },
        {
          "id": "lo-opik-u11-l3-s3",
          "title": "Meridiaanid",
          "blocks": [
            {
              "id": "lo-opik-u11-b026",
              "type": "paragraph",
              "text": "Gloobusel jooksevad jooned ka põhja-lõunasuunaliselt. Neid nimetatakse meridiaanideks.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b027",
              "type": "paragraph",
              "text": "Meridiaanid ulatuvad põhjapooluselt lõunapoolusele ning kohtuvad poolustel. Erinevalt paralleelidest ei ole need üksteisega rööbiti.",
              "source": {
                "kind": "supplementary",
                "url": "https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html",
                "attribution": "NOAA National Ocean Service — Latitude and longitude"
              }
            },
            {
              "id": "lo-opik-u11-b028",
              "type": "diagram",
              "diagramId": "u11-meridians-estonia",
              "caption": "Põhjast lõunasse kulgevad meridiaanid, millest üks on nullmeridiaan. Eesti asukohta tähistab punkt põhjapoolkeral ja nullmeridiaanist ida pool. Skeem ei ole täpne maailmakaart.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b029",
              "type": "keyFact",
              "items": [
                "Paralleelid kulgevad ida-läänesuunaliselt.",
                "Meridiaanid kulgevad põhja-lõunasuunaliselt ja kohtuvad poolustel."
              ],
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b030",
              "type": "externalResource",
              "title": "Kuidas määratakse asukoht Maal?",
              "intro": "NOAA selgitab joonistega, kuidas paralleelid ja meridiaanid moodustavad asukoha määramise võrgu.",
              "url": "https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html",
              "publisher": "NOAA",
              "resourceType": "article",
              "observe": "Leia piltidelt ekvaator, paralleelid, meridiaanid ja poolused."
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u11-l4",
      "title": "Nullmeridiaan ja Eesti asukoht",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u11-o6",
        "lo-opik-u11-o7"
      ],
      "sections": [
        {
          "id": "lo-opik-u11-l4-s1",
          "title": "Nullmeridiaan",
          "blocks": [
            {
              "id": "lo-opik-u11-b031",
              "type": "paragraph",
              "text": "Ühele meridiaanidest on teadlased andnud nimeks nullmeridiaan. Nullmeridiaan jagab maakera idapoolkeraks ja läänepoolkeraks.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b032",
              "type": "definition",
              "term": "Nullmeridiaan",
              "definition": "Joon, mis jaotab Maa ida- ja läänepoolkeraks.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b033",
              "type": "paragraph",
              "text": "Nullmeridiaan on kokkuleppeline lähtejoon: selle pikkuskraad on 0°. See läbib Greenwichi Inglismaal. Kui ekvaator on Maa kuju järgi määratav, siis nullmeridiaani asukoht valiti inimeste kokkuleppel.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.rmg.co.uk/stories/time/what-prime-meridian-why-it-greenwich",
                "attribution": "Royal Museums Greenwich — Prime Meridian"
              }
            },
            {
              "id": "lo-opik-u11-b034",
              "type": "keyFact",
              "items": [
                "Ekvaator: põhi ja lõuna.",
                "Nullmeridiaan: ida ja lääs."
              ],
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            }
          ]
        },
        {
          "id": "lo-opik-u11-l4-s2",
          "title": "Kus on Eesti?",
          "blocks": [
            {
              "id": "lo-opik-u11-b035",
              "type": "paragraph",
              "text": "Ekvaatori ja nullmeridiaani järgi saab kindlaks teha, et Eesti asub põhjapoolkeral ja idapoolkeral. See tähendab, et ta asub ekvaatorist põhja pool ja nullmeridiaanist ida pool.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b036",
              "type": "diagram",
              "diagramId": "u11-meridians-estonia",
              "caption": "Skeemil paikneb Eesti tähis ekvaatorist põhja pool ja nullmeridiaanist ida pool. Jooned aitavad määrata poolkerad, kuid skeem ei näita tegelikke riigipiire.",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b037",
              "type": "keyFact",
              "items": [
                "Eesti asub põhjapoolkeral.",
                "Eesti asub idapoolkeral."
              ],
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            }
          ]
        },
        {
          "id": "lo-opik-u11-l4-s3",
          "title": "Ma tean, et…",
          "blocks": [
            {
              "id": "lo-opik-u11-b038",
              "type": "table",
              "headers": [
                "Mõiste",
                "Mida see tähendab?"
              ],
              "rows": [
                [
                  "gloobus",
                  "Maa vähendatud ja lihtsustatud mudel"
                ],
                [
                  "ekvaator",
                  "jaotab Maa põhja- ja lõunapoolkeraks"
                ],
                [
                  "nullmeridiaan",
                  "jaotab Maa ida- ja läänepoolkeraks"
                ],
                [
                  "põhjapoolus",
                  "Maa kõige põhjapoolsem punkt"
                ],
                [
                  "lõunapoolus",
                  "Maa kõige lõunapoolsem punkt"
                ]
              ],
              "caption": "Õpiku mõisted, lk 49",
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b039",
              "type": "keyFact",
              "items": [
                "Ekvaator ja nullmeridiaan jaotavad maakera poolkeradeks.",
                "Eesti asub põhja- ja idapoolkeral."
              ],
              "source": {
                "kind": "textbook",
                "pages": "49"
              }
            },
            {
              "id": "lo-opik-u11-b040",
              "type": "enrichment",
              "variant": "fun_fact",
              "title": "Huvitav fakt: miks just Greenwich?",
              "body": [
                "Maakeral ei ole looduses nähtavat nullmeridiaani. Erinevad maad kasutasid kunagi erinevaid lähtejooni, kuni rahvusvahelise kokkuleppe tulemusel hakati kasutama Greenwichi läbivat meridiaani."
              ],
              "source": {
                "kind": "supplementary",
                "url": "https://www.rmg.co.uk/stories/time/what-prime-meridian-why-it-greenwich",
                "attribution": "Royal Museums Greenwich — Prime Meridian"
              }
            },
            {
              "id": "lo-opik-u11-b041",
              "type": "externalResource",
              "title": "Nullmeridiaan Greenwichis",
              "intro": "Kuningliku observatooriumi selgitus nullmeridiaanist ja sellest, kuidas leppisime kokku ida ning lääne mõõtmise algusjoone.",
              "url": "https://www.rmg.co.uk/stories/time/what-prime-meridian-why-it-greenwich",
              "publisher": "Royal Museums Greenwich",
              "resourceType": "article",
              "observe": "Otsi artiklist, miks nullmeridiaani asukoht tuli kokku leppida."
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u11-q001",
      "unitId": "lo-opik-u11",
      "stem": "Mis on gloobus?",
      "primaryObjectiveId": "lo-opik-u11-o1",
      "variantGroupId": "lo-opik-u11-g001",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus on Maa vähendatud ja lihtsustatud mudel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "maa",
            "text": "Maa vähendatud ja lihtsustatud mudel"
          },
          {
            "id": "kuu",
            "text": "Kuu täpne foto"
          },
          {
            "id": "kaart",
            "text": "Väga suur linnaplaan"
          },
          {
            "id": "paike",
            "text": "Päikese mudel"
          }
        ],
        "correctOptionId": "maa"
      }
    },
    {
      "id": "lo-opik-u11-q002",
      "unitId": "lo-opik-u11",
      "stem": "Õige või vale? Gloobus on Maast suuremaks tehtud mudel.",
      "primaryObjectiveId": "lo-opik-u11-o1",
      "variantGroupId": "lo-opik-u11-g001",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Gloobus on Maast väga palju väiksem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
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
      "id": "lo-opik-u11-q003",
      "unitId": "lo-opik-u11",
      "stem": "Mida kujutatakse tavalisel gloobusel?",
      "primaryObjectiveId": "lo-opik-u11-o1",
      "variantGroupId": "lo-opik-u11-g002",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobuse pinnal on kujutatud maismaa ja vee paiknemine.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "meri",
            "text": "Maismaa- ja merealade paiknemist"
          },
          {
            "id": "ilm",
            "text": "Ainult tänast ilma"
          },
          {
            "id": "teed",
            "text": "Kõiki maailma tänavanimesid"
          },
          {
            "id": "kuud",
            "text": "Kuu kraatreid"
          }
        ],
        "correctOptionId": "meri"
      }
    },
    {
      "id": "lo-opik-u11-q004",
      "unitId": "lo-opik-u11",
      "stem": "Miks nimetatakse gloobust vähendatud mudeliks?",
      "primaryObjectiveId": "lo-opik-u11-o1",
      "variantGroupId": "lo-opik-u11-g003",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa on väga suur. Gloobus kujutab sama planeeti palju väiksemana.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "small",
            "text": "See on tegelikust Maast palju väiksem."
          },
          {
            "id": "large",
            "text": "See on Maast suurem."
          },
          {
            "id": "empty",
            "text": "See näitab ainult tühje alasid."
          },
          {
            "id": "turn",
            "text": "Seda on võimatu pöörata."
          }
        ],
        "correctOptionId": "small"
      }
    },
    {
      "id": "lo-opik-u11-q005",
      "unitId": "lo-opik-u11",
      "stem": "Vali kõik õiged väited gloobuse kohta.",
      "primaryObjectiveId": "lo-opik-u11-o1",
      "variantGroupId": "lo-opik-u11-g004",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus kujutab Maad vähendatult; väikeseid üksikasju sel tavaliselt ei näe.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "Gloobus on Maa mudel."
          },
          {
            "id": "b",
            "text": "Gloobusel saab uurida maismaa ja mere paiknemist."
          },
          {
            "id": "c",
            "text": "Gloobus on täpselt sama suur kui Maa."
          },
          {
            "id": "d",
            "text": "Kõik linnatänavad on gloobusel hästi nähtavad."
          }
        ],
        "correctOptionIds": [
          "a",
          "b"
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o2"
      ]
    },
    {
      "id": "lo-opik-u11-q006",
      "unitId": "lo-opik-u11",
      "stem": "Jaota kirjeldused: päris Maa või gloobus?",
      "primaryObjectiveId": "lo-opik-u11-o1",
      "variantGroupId": "lo-opik-u11-g005",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Päris Maal asuvad inimesed ja päris ookeanid. Gloobus on neid kujutav väike mudel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "maa",
            "text": "Päris Maa"
          },
          {
            "id": "gloobus",
            "text": "Gloobus"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Sellel asuvad tõelised mäed ja mered."
          },
          {
            "id": "i2",
            "text": "See mahub lauale."
          },
          {
            "id": "i3",
            "text": "See kujutab ookeane vähendatud suuruses."
          },
          {
            "id": "i4",
            "text": "Selle pinnal me tegelikult elame."
          }
        ],
        "correctGroupByItem": {
          "i1": "maa",
          "i2": "gloobus",
          "i3": "gloobus",
          "i4": "maa"
        }
      }
    },
    {
      "id": "lo-opik-u11-q007",
      "unitId": "lo-opik-u11",
      "stem": "Mati tahab korraga uurida, kuidas maailma maismaa- ja veealad paiknevad. Mida võiks ta kasutada?",
      "primaryObjectiveId": "lo-opik-u11-o1",
      "variantGroupId": "lo-opik-u11-g006",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus kujutab kogu Maa maismaa- ja veealade paiknemist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "globe",
            "text": "Gloobust"
          },
          {
            "id": "shoe",
            "text": "Kingakasti"
          },
          {
            "id": "clock",
            "text": "Seinakella"
          },
          {
            "id": "ruler",
            "text": "Joonlauda"
          }
        ],
        "correctOptionId": "globe"
      }
    },
    {
      "id": "lo-opik-u11-q008",
      "unitId": "lo-opik-u11",
      "stem": "Kati näeb laual kerakujulist mudelit, millel on mered ja mandrid. Mis mudel see tõenäoliselt on?",
      "primaryObjectiveId": "lo-opik-u11-o1",
      "variantGroupId": "lo-opik-u11-g007",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa kerakuju, mandreid ja meresid kujutav mudel on gloobus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "globe",
            "text": "Gloobus"
          },
          {
            "id": "lamp",
            "text": "Lamp"
          },
          {
            "id": "star",
            "text": "Tähekaardi leht"
          },
          {
            "id": "cup",
            "text": "Tass"
          }
        ],
        "correctOptionId": "globe"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Laual on pööratav kera. Selle pinnal on sinised veealad ja eri värvi maismaa."
        ]
      }
    },
    {
      "id": "lo-opik-u11-q009",
      "unitId": "lo-opik-u11",
      "stem": "Mida saab väikesel gloobusel paremini uurida kui ühe tänava pisiasju?",
      "primaryObjectiveId": "lo-opik-u11-o1",
      "variantGroupId": "lo-opik-u11-g008",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus näitab suurt tervikut ja väheseid üksikasju.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "relative",
            "text": "Mandrite ja ookeanide omavahelist paiknemist"
          },
          {
            "id": "house",
            "text": "Ühe maja uksekella asukohta"
          },
          {
            "id": "bus",
            "text": "Konkreetse bussipeatuse sõiduplaani"
          },
          {
            "id": "room",
            "text": "Klassitoa laudade asetust"
          }
        ],
        "correctOptionId": "relative"
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o2"
      ]
    },
    {
      "id": "lo-opik-u11-q010",
      "unitId": "lo-opik-u11",
      "stem": "Mida võib näidata eri värvidega pinnamoodi kujutav gloobus?",
      "primaryObjectiveId": "lo-opik-u11-o2",
      "variantGroupId": "lo-opik-u11-g011",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pinnamoodi näitaval gloobusel tähistavad värvid kõrgemaid ja madalamaid maa-alasid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "height",
            "text": "Kõrgemaid ja madalamaid alasid"
          },
          {
            "id": "capitals",
            "text": "Ainult pealinnade nimetusi"
          },
          {
            "id": "weather",
            "text": "Järgmise nädala temperatuuri"
          },
          {
            "id": "roads",
            "text": "Kõigi linnade tänavaid"
          }
        ],
        "correctOptionId": "height"
      }
    },
    {
      "id": "lo-opik-u11-q011",
      "unitId": "lo-opik-u11",
      "stem": "Milline gloobus aitab uurida mägesid ja orge? Vali joonisel.",
      "primaryObjectiveId": "lo-opik-u11-o2",
      "variantGroupId": "lo-opik-u11-g011",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pinnamoodi kujutav gloobus näitab maapinna kõrgusi ja madalusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-globe-types",
        "correctRegionId": "relief-globe"
      }
    },
    {
      "id": "lo-opik-u11-q012",
      "unitId": "lo-opik-u11",
      "stem": "Milline gloobus võib kujutada riike eri värvidega?",
      "primaryObjectiveId": "lo-opik-u11-o2",
      "variantGroupId": "lo-opik-u11-g012",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riike kujutava gloobuse värvid aitavad eristada riikide paiknemist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "countries",
            "text": "Riike kujutav gloobus"
          },
          {
            "id": "relief",
            "text": "Ainult pinnamoodi kujutav gloobus"
          },
          {
            "id": "weather",
            "text": "Pilvede foto"
          },
          {
            "id": "moon",
            "text": "Kuu mudel"
          }
        ],
        "correctOptionId": "countries"
      }
    },
    {
      "id": "lo-opik-u11-q013",
      "unitId": "lo-opik-u11",
      "stem": "Näita joonisel riike eristavat gloobust.",
      "primaryObjectiveId": "lo-opik-u11-o2",
      "variantGroupId": "lo-opik-u11-g012",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riike kujutaval gloobusel on riigid eristatud, sageli eri värvidega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-globe-types",
        "correctRegionId": "political-globe"
      }
    },
    {
      "id": "lo-opik-u11-q014",
      "unitId": "lo-opik-u11",
      "stem": "Ühenda gloobuse tüüp ja sellel uuritav info.",
      "primaryObjectiveId": "lo-opik-u11-o2",
      "variantGroupId": "lo-opik-u11-g013",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pinnamood tähendab maapinna kõrgusi. Riike kujutavalt gloobuselt leiab riigid ja nende pealinnad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Pinnamoodi kujutav gloobus"
          },
          {
            "id": "p2",
            "text": "Riike kujutav gloobus"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "mäed ja madalikud"
          },
          {
            "id": "c2",
            "text": "riigid ja pealinnad"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2"
        }
      }
    },
    {
      "id": "lo-opik-u11-q015",
      "unitId": "lo-opik-u11",
      "stem": "Miks ei sobi gloobus hästi võõras linnas tänava leidmiseks?",
      "primaryObjectiveId": "lo-opik-u11-o2",
      "variantGroupId": "lo-opik-u11-g014",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus kujutab korraga suurt osa Maast ja üksik linn paistab vaid väikese täpina.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "detail",
            "text": "Linnatänavad on gloobuse jaoks liiga väikesed üksikasjad."
          },
          {
            "id": "water",
            "text": "Kõik linnad asuvad vee all."
          },
          {
            "id": "north",
            "text": "Gloobusel puudub alati põhi."
          },
          {
            "id": "sea",
            "text": "Gloobus näitab ainult ookeane."
          }
        ],
        "correctOptionId": "detail"
      }
    },
    {
      "id": "lo-opik-u11-q016",
      "unitId": "lo-opik-u11",
      "stem": "Rühmita, millist teavet otsiksid kummaltki gloobuselt.",
      "primaryObjectiveId": "lo-opik-u11-o2",
      "variantGroupId": "lo-opik-u11-g015",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pinnamood näitab kõrgusi ja madalusi, riigigloobus riikide paiknemist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "relief",
            "text": "Pinnamood"
          },
          {
            "id": "country",
            "text": "Riigid"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "kus on kõrgemad maa-alad"
          },
          {
            "id": "i2",
            "text": "kus paiknevad eri riigid"
          },
          {
            "id": "i3",
            "text": "kus on madalikud"
          },
          {
            "id": "i4",
            "text": "missuguses maailma osas on riik"
          }
        ],
        "correctGroupByItem": {
          "i1": "relief",
          "i2": "country",
          "i3": "relief",
          "i4": "country"
        }
      }
    },
    {
      "id": "lo-opik-u11-q017",
      "unitId": "lo-opik-u11",
      "stem": "Liisa soovib uurida, kas ühes maailma piirkonnas on palju mägesid. Millist gloobust ta valib?",
      "primaryObjectiveId": "lo-opik-u11-o2",
      "variantGroupId": "lo-opik-u11-g016",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõrgemaid ja madalamaid alasid saab uurida pinnamoodi kujutavalt gloobuselt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "relief",
            "text": "Pinnamoodi kujutava gloobuse"
          },
          {
            "id": "political",
            "text": "Riike kujutava gloobuse, ainult riigivärvide järgi"
          },
          {
            "id": "clock",
            "text": "Kella"
          },
          {
            "id": "street",
            "text": "Ühe linna tänavaplaani"
          }
        ],
        "correctOptionId": "relief"
      }
    },
    {
      "id": "lo-opik-u11-q018",
      "unitId": "lo-opik-u11",
      "stem": "Õpilane tahab teada, kus asuvad eri riigid üksteise suhtes. Mida ta kasutab?",
      "primaryObjectiveId": "lo-opik-u11-o2",
      "variantGroupId": "lo-opik-u11-g017",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riike kujutaval gloobusel saab võrrelda riikide paiknemist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "country",
            "text": "Riike kujutavat gloobust"
          },
          {
            "id": "elevation",
            "text": "Mäestike kõrguste diagrammi"
          },
          {
            "id": "ruler",
            "text": "Joonlauda"
          },
          {
            "id": "stars",
            "text": "Tähtede kaarti"
          }
        ],
        "correctOptionId": "country"
      }
    },
    {
      "id": "lo-opik-u11-q019",
      "unitId": "lo-opik-u11",
      "stem": "Milline ülesanne vajab gloobuse asemel detailset linnakaarti?",
      "primaryObjectiveId": "lo-opik-u11-o2",
      "variantGroupId": "lo-opik-u11-g018",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus on väikeste tänavate ja majade leidmiseks liiga üldine.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "address",
            "text": "Leida võõras linnas ühe maja aadress"
          },
          {
            "id": "oceans",
            "text": "Näha, kus paiknevad ookeanid"
          },
          {
            "id": "hemisphere",
            "text": "Vaadata, millisel pool Maad on Euroopa"
          },
          {
            "id": "earth",
            "text": "Uurida Maa ligikaudset kuju"
          }
        ],
        "correctOptionId": "address"
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o1"
      ]
    },
    {
      "id": "lo-opik-u11-q020",
      "unitId": "lo-opik-u11",
      "stem": "Milline on Maa pöörlemistelg?",
      "primaryObjectiveId": "lo-opik-u11-o3",
      "variantGroupId": "lo-opik-u11-g021",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa pöörlemistelg on kujuteldav sirge. Gloobusel kasutatakse selle kujutamiseks sageli pulka.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        },
        {
          "kind": "supplementary",
          "url": "https://science.nasa.gov/earth/facts/",
          "attribution": "NASA Science — Facts About Earth"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "imaginary",
            "text": "Kujuteldav sirge läbi Maa keskpunkti"
          },
          {
            "id": "steel",
            "text": "Suur metallvarras läbi päris Maa"
          },
          {
            "id": "equator",
            "text": "Maa ümber kulgev ekvaator"
          },
          {
            "id": "sea",
            "text": "Ookeani kõige sügavam koht"
          }
        ],
        "correctOptionId": "imaginary"
      }
    },
    {
      "id": "lo-opik-u11-q021",
      "unitId": "lo-opik-u11",
      "stem": "Õige või vale? Päris Maa sees on gloobuse moodi pikk metallist telg.",
      "primaryObjectiveId": "lo-opik-u11-o3",
      "variantGroupId": "lo-opik-u11-g021",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Maa pöörlemistelg on kujuteldav; gloobusel on teljepulk.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        },
        {
          "kind": "supplementary",
          "url": "https://science.nasa.gov/earth/facts/",
          "attribution": "NASA Science — Facts About Earth"
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
      "id": "lo-opik-u11-q022",
      "unitId": "lo-opik-u11",
      "stem": "Kuidas nimetatakse Maa kõige põhjapoolsemat punkti?",
      "primaryObjectiveId": "lo-opik-u11-o3",
      "variantGroupId": "lo-opik-u11-g022",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa põhjapoolseim punkt on põhjapoolus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "north",
            "text": "põhjapoolus"
          },
          {
            "id": "south",
            "text": "lõunapoolus"
          },
          {
            "id": "equator",
            "text": "ekvaator"
          },
          {
            "id": "meridian",
            "text": "meridiaan"
          }
        ],
        "correctOptionId": "north"
      }
    },
    {
      "id": "lo-opik-u11-q023",
      "unitId": "lo-opik-u11",
      "stem": "Kuidas nimetatakse Maa kõige lõunapoolsemat punkti?",
      "primaryObjectiveId": "lo-opik-u11-o3",
      "variantGroupId": "lo-opik-u11-g023",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa lõunapoolseim punkt on lõunapoolus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "south",
            "text": "lõunapoolus"
          },
          {
            "id": "north",
            "text": "põhjapoolus"
          },
          {
            "id": "equator",
            "text": "ekvaator"
          },
          {
            "id": "parallel",
            "text": "paralleel"
          }
        ],
        "correctOptionId": "south"
      }
    },
    {
      "id": "lo-opik-u11-q024",
      "unitId": "lo-opik-u11",
      "stem": "Mille poolest erinevad Maa telg ja gloobuse telg?",
      "primaryObjectiveId": "lo-opik-u11-o3",
      "variantGroupId": "lo-opik-u11-g024",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Päris Maa pöörleb ümber kujuteldava telje. Mudelis saab telge kujutada päris pulgaga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "imaginary",
            "text": "Maa telg on kujuteldav, gloobuse telge näitab sageli pulk."
          },
          {
            "id": "bothreal",
            "text": "Mõlemad on päris metallvardad."
          },
          {
            "id": "none",
            "text": "Maal pole võimalik pöörlemist kirjeldada."
          },
          {
            "id": "water",
            "text": "Gloobuse telg on alati veest."
          }
        ],
        "correctOptionId": "imaginary"
      }
    },
    {
      "id": "lo-opik-u11-q025",
      "unitId": "lo-opik-u11",
      "stem": "Ühenda mõiste ja selle tähendus.",
      "primaryObjectiveId": "lo-opik-u11-o3",
      "variantGroupId": "lo-opik-u11-g025",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhjapoolus ja lõunapoolus on kujuteldava pöörlemistelje otsad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        },
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "põhjapoolus"
          },
          {
            "id": "p2",
            "text": "lõunapoolus"
          },
          {
            "id": "p3",
            "text": "Maa telg"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Maa kõige põhjapoolsem punkt"
          },
          {
            "id": "c2",
            "text": "Maa kõige lõunapoolsem punkt"
          },
          {
            "id": "c3",
            "text": "kujuteldav joon läbi Maa keskpunkti"
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
      "id": "lo-opik-u11-q026",
      "unitId": "lo-opik-u11",
      "stem": "Vali õiged väited Maa telje ja pooluste kohta.",
      "primaryObjectiveId": "lo-opik-u11-o3",
      "variantGroupId": "lo-opik-u11-g026",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa pöörleb ümber kujuteldava telje ja telje kaks otsa on poolused.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "Maa telg on kujuteldav."
          },
          {
            "id": "b",
            "text": "Telje otstes asuvad poolused."
          },
          {
            "id": "c",
            "text": "Põhjapoolus on Maa keskel."
          },
          {
            "id": "d",
            "text": "Maa ei saa ümber oma telje pöörelda."
          }
        ],
        "correctOptionIds": [
          "a",
          "b"
        ]
      }
    },
    {
      "id": "lo-opik-u11-q027",
      "unitId": "lo-opik-u11",
      "stem": "Näita joonisel põhjapoolust.",
      "primaryObjectiveId": "lo-opik-u11-o3",
      "variantGroupId": "lo-opik-u11-g027",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhjapoolus asub Maa kujuteldava telje põhjapoolses otsas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-axis-poles",
        "correctRegionId": "north-pole"
      }
    },
    {
      "id": "lo-opik-u11-q028",
      "unitId": "lo-opik-u11",
      "stem": "Näita joonisel lõunapoolust.",
      "primaryObjectiveId": "lo-opik-u11-o3",
      "variantGroupId": "lo-opik-u11-g027",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõunapoolus asub Maa kujuteldava telje lõunapoolses otsas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-axis-poles",
        "correctRegionId": "south-pole"
      }
    },
    {
      "id": "lo-opik-u11-q029",
      "unitId": "lo-opik-u11",
      "stem": "Näita joonisel kujuteldavat pöörlemistelge.",
      "primaryObjectiveId": "lo-opik-u11-o3",
      "variantGroupId": "lo-opik-u11-g028",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pöörlemistelg on joon, mis läbib Maa keskpunkti ja poolusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-axis-poles",
        "correctRegionId": "axis"
      }
    },
    {
      "id": "lo-opik-u11-q030",
      "unitId": "lo-opik-u11",
      "stem": "Järjesta paigad põhjapoolusest lõunapooluseni.",
      "primaryObjectiveId": "lo-opik-u11-o3",
      "variantGroupId": "lo-opik-u11-g029",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pöörlemistelg kulgeb põhjapoolusest läbi Maa keskpunkti lõunapooluseni.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "48"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "põhjapoolus"
          },
          {
            "id": "s2",
            "text": "Maa keskpunkt teljel"
          },
          {
            "id": "s3",
            "text": "lõunapoolus"
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3"
        ],
        "firstLabel": "Kõige põhjapoolsem",
        "lastLabel": "Kõige lõunapoolsem"
      }
    },
    {
      "id": "lo-opik-u11-q031",
      "unitId": "lo-opik-u11",
      "stem": "Millisteks poolkeradeks jagab ekvaator Maa?",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g031",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaator jagab Maa põhja- ja lõunapoolkeraks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "ns",
            "text": "põhja- ja lõunapoolkeraks"
          },
          {
            "id": "ew",
            "text": "ida- ja läänepoolkeraks"
          },
          {
            "id": "four",
            "text": "neljaks ookeaniks"
          },
          {
            "id": "states",
            "text": "riikideks"
          }
        ],
        "correctOptionId": "ns"
      }
    },
    {
      "id": "lo-opik-u11-q032",
      "unitId": "lo-opik-u11",
      "stem": "Õige või vale? Ekvaator eraldab põhjapoolkera lõunapoolkerast.",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g031",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õige. Ekvaator on põhja- ja lõunapoolkera piir.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
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
        "correctOptionId": "true",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u11-q033",
      "unitId": "lo-opik-u11",
      "stem": "Kus asub põhjapoolkera ekvaatori suhtes?",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g032",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhjapoolkera on ekvaatorist põhja pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "north",
            "text": "ekvaatorist põhja pool"
          },
          {
            "id": "south",
            "text": "ekvaatorist lõuna pool"
          },
          {
            "id": "east",
            "text": "ainult nullmeridiaanist ida pool"
          },
          {
            "id": "pole",
            "text": "ainult põhjapoolusel"
          }
        ],
        "correctOptionId": "north"
      }
    },
    {
      "id": "lo-opik-u11-q034",
      "unitId": "lo-opik-u11",
      "stem": "Kus asub lõunapoolkera ekvaatori suhtes?",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g033",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõunapoolkera on ekvaatorist lõuna pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "south",
            "text": "ekvaatorist lõuna pool"
          },
          {
            "id": "north",
            "text": "ekvaatorist põhja pool"
          },
          {
            "id": "east",
            "text": "nullmeridiaanist ida pool"
          },
          {
            "id": "west",
            "text": "nullmeridiaanist lääne pool"
          }
        ],
        "correctOptionId": "south"
      }
    },
    {
      "id": "lo-opik-u11-q035",
      "unitId": "lo-opik-u11",
      "stem": "Miks nimetatakse ekvaatorit Maa kõige tähtsamaks paralleeliks?",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g034",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaator on kõige laiemas kohas kulgev paralleel, mille järgi eristatakse põhjapoolkera ja lõunapoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "divide",
            "text": "See jagab Maa põhja- ja lõunapoolkeraks."
          },
          {
            "id": "polar",
            "text": "See ühendab kahte poolust."
          },
          {
            "id": "eastwest",
            "text": "See jagab Maa ida- ja läänepoolkeraks."
          },
          {
            "id": "capital",
            "text": "See tähistab kõiki pealinnu."
          }
        ],
        "correctOptionId": "divide"
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o5"
      ]
    },
    {
      "id": "lo-opik-u11-q036",
      "unitId": "lo-opik-u11",
      "stem": "Vali kõik õiged väited ekvaatori kohta.",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g035",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaator on põhjapoolkera ja lõunapoolkera eraldav joon.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "Ekvaator jagab Maa kaheks poolkeraks."
          },
          {
            "id": "b",
            "text": "Ekvaatorist lõuna pool asub lõunapoolkera."
          },
          {
            "id": "c",
            "text": "Ekvaator kulgeb läbi mõlema pooluse."
          },
          {
            "id": "d",
            "text": "Ekvaator jagab Maa ida- ja läänepoolkeraks."
          }
        ],
        "correctOptionIds": [
          "a",
          "b"
        ]
      }
    },
    {
      "id": "lo-opik-u11-q037",
      "unitId": "lo-opik-u11",
      "stem": "Rühmita: kuhu paik jääb ekvaatori suhtes?",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g036",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaatorist põhja poole jääb põhjapoolkera, lõuna poole lõunapoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "north",
            "text": "Põhjapoolkera"
          },
          {
            "id": "south",
            "text": "Lõunapoolkera"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "koht ekvaatorist põhja pool"
          },
          {
            "id": "i2",
            "text": "koht ekvaatorist lõuna pool"
          },
          {
            "id": "i3",
            "text": "põhjapoolus"
          },
          {
            "id": "i4",
            "text": "lõunapoolus"
          }
        ],
        "correctGroupByItem": {
          "i1": "north",
          "i2": "south",
          "i3": "north",
          "i4": "south"
        }
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o3"
      ]
    },
    {
      "id": "lo-opik-u11-q038",
      "unitId": "lo-opik-u11",
      "stem": "Näita joonisel ekvaatorit.",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g037",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaator kulgeb ümber Maa kõige laiemast kohast ja jagab Maa kaheks poolkeraks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-equator-parallels",
        "correctRegionId": "equator"
      }
    },
    {
      "id": "lo-opik-u11-q039",
      "unitId": "lo-opik-u11",
      "stem": "Näita joonisel põhjapoolkera.",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g038",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhjapoolkera on ekvaatorist ülespoole ehk põhja poole jääv pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-equator-parallels",
        "correctRegionId": "north-hemisphere"
      }
    },
    {
      "id": "lo-opik-u11-q040",
      "unitId": "lo-opik-u11",
      "stem": "Näita joonisel lõunapoolkera.",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g038",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõunapoolkera on ekvaatorist allapoole ehk lõuna poole jääv pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-equator-parallels",
        "correctRegionId": "south-hemisphere"
      }
    },
    {
      "id": "lo-opik-u11-q041",
      "unitId": "lo-opik-u11",
      "stem": "Rändur liigub üle ekvaatori põhjapoolkeralt lõuna poole. Millisesse poolkerasse ta jõuab?",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g039",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui ületada ekvaator põhjast lõuna suunas, jõutakse lõunapoolkerasse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "south",
            "text": "lõunapoolkerasse"
          },
          {
            "id": "north",
            "text": "põhjapoolkerasse tagasi"
          },
          {
            "id": "east",
            "text": "idapoolkerasse"
          },
          {
            "id": "west",
            "text": "läänepoolkerasse"
          }
        ],
        "correctOptionId": "south"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Laev sõidab üle ekvaatori põhjapoolkeralt lõuna suunas."
        ]
      }
    },
    {
      "id": "lo-opik-u11-q042",
      "unitId": "lo-opik-u11",
      "stem": "Järjesta nimetused põhjapoolusest lõunapooluseni.",
      "primaryObjectiveId": "lo-opik-u11-o4",
      "variantGroupId": "lo-opik-u11-g040",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhjapoolus on kõige põhjapoolsem, ekvaator Maa keskosas ja lõunapoolus kõige lõunapoolsem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "põhjapoolus"
          },
          {
            "id": "s2",
            "text": "põhjapoolkeral olev paralleel"
          },
          {
            "id": "s3",
            "text": "ekvaator"
          },
          {
            "id": "s4",
            "text": "lõunapoolkeral olev paralleel"
          },
          {
            "id": "s5",
            "text": "lõunapoolus"
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3",
          "s4",
          "s5"
        ],
        "firstLabel": "Kõige põhjapoolsem",
        "lastLabel": "Kõige lõunapoolsem"
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o3",
        "lo-opik-u11-o5"
      ]
    },
    {
      "id": "lo-opik-u11-q043",
      "unitId": "lo-opik-u11",
      "stem": "Kuidas nimetatakse ekvaatoriga samas suunas kulgevaid jooni?",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g041",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Paralleelid ehk rööbikud kulgevad ida-läänesuunaliselt, nagu ekvaator.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "parallel",
            "text": "paralleelid ehk rööbikud"
          },
          {
            "id": "meridian",
            "text": "meridiaanid"
          },
          {
            "id": "poles",
            "text": "poolused"
          },
          {
            "id": "continents",
            "text": "mandrid"
          }
        ],
        "correctOptionId": "parallel"
      }
    },
    {
      "id": "lo-opik-u11-q044",
      "unitId": "lo-opik-u11",
      "stem": "Õige või vale? Paralleelid on sama mis rööbikud.",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g041",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õige. Paralleele nimetatakse ka rööbikuteks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
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
        "correctOptionId": "true",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u11-q045",
      "unitId": "lo-opik-u11",
      "stem": "Kuidas nimetatakse põhja-lõunasuunaliselt kulgevaid jooni?",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g042",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meridiaanid kulgevad gloobusel põhja-lõunasuunaliselt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "meridian",
            "text": "meridiaanid"
          },
          {
            "id": "parallel",
            "text": "paralleelid"
          },
          {
            "id": "equator",
            "text": "ekvaatorid"
          },
          {
            "id": "poles",
            "text": "poolused"
          }
        ],
        "correctOptionId": "meridian"
      }
    },
    {
      "id": "lo-opik-u11-q046",
      "unitId": "lo-opik-u11",
      "stem": "Kus saavad meridiaanid kokku?",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g043",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meridiaanid kulgevad poolusest pooluseni ja kohtuvad poolustel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        },
        {
          "kind": "supplementary",
          "url": "https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html",
          "attribution": "NOAA National Ocean Service — Latitude and longitude"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "poles",
            "text": "poolustel"
          },
          {
            "id": "equator",
            "text": "ainult ekvaatoril"
          },
          {
            "id": "cities",
            "text": "pealinnades"
          },
          {
            "id": "nowhere",
            "text": "need ei saa kusagil kokku"
          }
        ],
        "correctOptionId": "poles"
      }
    },
    {
      "id": "lo-opik-u11-q047",
      "unitId": "lo-opik-u11",
      "stem": "Ühenda gloobuse joon ja selle tunnus.",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g044",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Paralleelid on ida-läänesuunalised, meridiaanid põhja-lõunasuunalised ning ekvaator jagab põhja- ja lõunapoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "paralleel"
          },
          {
            "id": "p2",
            "text": "meridiaan"
          },
          {
            "id": "p3",
            "text": "ekvaator"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "kulgeb ida-läänesuunaliselt"
          },
          {
            "id": "c2",
            "text": "kulgeb põhja-lõunasuunaliselt"
          },
          {
            "id": "c3",
            "text": "jagab Maa põhja- ja lõunapoolkeraks"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2",
          "p3": "c3"
        }
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o4"
      ]
    },
    {
      "id": "lo-opik-u11-q048",
      "unitId": "lo-opik-u11",
      "stem": "Millised väited meridiaanide kohta on õiged?",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g045",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meridiaanid ühendavad poolusi, mitte ei kulge ekvaatoriga rööbiti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        },
        {
          "kind": "supplementary",
          "url": "https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html",
          "attribution": "NOAA National Ocean Service — Latitude and longitude"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "Meridiaanid ulatuvad põhjapooluselt lõunapoolusele."
          },
          {
            "id": "b",
            "text": "Meridiaanid kohtuvad poolustel."
          },
          {
            "id": "c",
            "text": "Kõik meridiaanid on ekvaatoriga rööbiti."
          },
          {
            "id": "d",
            "text": "Meridiaanid kulgevad ainult ida-läänesuunaliselt."
          }
        ],
        "correctOptionIds": [
          "a",
          "b"
        ]
      }
    },
    {
      "id": "lo-opik-u11-q049",
      "unitId": "lo-opik-u11",
      "stem": "Rühmita gloobuse joonte omadused.",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g046",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Paralleelid on rööbiti, meridiaanid kohtuvad poolustel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        },
        {
          "kind": "supplementary",
          "url": "https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html",
          "attribution": "NOAA National Ocean Service — Latitude and longitude"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "paralleel",
            "text": "Paralleel"
          },
          {
            "id": "meridiaan",
            "text": "Meridiaan"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "ida-läänesuund"
          },
          {
            "id": "i2",
            "text": "põhja-lõunasuund"
          },
          {
            "id": "i3",
            "text": "samanimelised jooned on rööbiti"
          },
          {
            "id": "i4",
            "text": "jooned kohtuvad poolustel"
          }
        ],
        "correctGroupByItem": {
          "i1": "paralleel",
          "i2": "meridiaan",
          "i3": "paralleel",
          "i4": "meridiaan"
        }
      }
    },
    {
      "id": "lo-opik-u11-q050",
      "unitId": "lo-opik-u11",
      "stem": "Miks ei ole paralleelid ja meridiaanid sama asi?",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g047",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Paralleelid kulgevad ida-läänesuunaliselt, meridiaanid põhja-lõunasuunaliselt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "direction",
            "text": "Need kulgevad gloobusel eri suundades."
          },
          {
            "id": "real",
            "text": "Ühed on päris jooned maapinnal ja teised kujuteldavad."
          },
          {
            "id": "same",
            "text": "Need on täpselt sama joon teise nimega."
          },
          {
            "id": "colors",
            "text": "Neid saab eristada ainult värvi järgi."
          }
        ],
        "correctOptionId": "direction"
      }
    },
    {
      "id": "lo-opik-u11-q051",
      "unitId": "lo-opik-u11",
      "stem": "Näita joonisel ekvaatorist põhjapoolsemat paralleeli.",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g048",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhjapoolkeral kulgeb ekvaatoriga rööbiti põhjapoolne paralleel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-equator-parallels",
        "correctRegionId": "north-parallel"
      }
    },
    {
      "id": "lo-opik-u11-q052",
      "unitId": "lo-opik-u11",
      "stem": "Näita joonisel üht muud meridiaani kui nullmeridiaan.",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g049",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meridiaanid kulgevad poolusest pooluseni. Nullmeridiaan on vaid üks neist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        },
        {
          "kind": "supplementary",
          "url": "https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html",
          "attribution": "NOAA National Ocean Service — Latitude and longitude"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-meridians-estonia",
        "correctRegionId": "other-meridian"
      }
    },
    {
      "id": "lo-opik-u11-q053",
      "unitId": "lo-opik-u11",
      "stem": "Millise joonega on tegemist?",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g050",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhjapoolusest lõunapooluseni kulgev joon on meridiaan.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        },
        {
          "kind": "supplementary",
          "url": "https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html",
          "attribution": "NOAA National Ocean Service — Latitude and longitude"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "meridian",
            "text": "meridiaaniga"
          },
          {
            "id": "parallel",
            "text": "paralleeliga"
          },
          {
            "id": "equator",
            "text": "ekvaatoriga"
          },
          {
            "id": "pole",
            "text": "poolusega"
          }
        ],
        "correctOptionId": "meridian"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Gloobusel on joon, mis algab põhjapooluselt ja ulatub lõunapoolusele."
        ]
      }
    },
    {
      "id": "lo-opik-u11-q054",
      "unitId": "lo-opik-u11",
      "stem": "Milline võrdlus on õige?",
      "primaryObjectiveId": "lo-opik-u11-o5",
      "variantGroupId": "lo-opik-u11-g051",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Paralleelid on üksteise suhtes rööbiti, meridiaanid saavad poolustel kokku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        },
        {
          "kind": "supplementary",
          "url": "https://oceanservice.noaa.gov/education/tutorial_nautical_charts/nautical_charts02_information_2b.html",
          "attribution": "NOAA National Ocean Service — Latitude and longitude"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "right",
            "text": "Paralleelid on omavahel rööbiti; meridiaanid kohtuvad poolustel."
          },
          {
            "id": "reverse",
            "text": "Paralleelid kohtuvad poolustel; meridiaanid on rööbiti."
          },
          {
            "id": "none",
            "text": "Mõlemad joonte rühmad kohtuvad ainult ekvaatoril."
          },
          {
            "id": "invisible",
            "text": "Gloobusel neid jooni ei ole."
          }
        ],
        "correctOptionId": "right"
      }
    },
    {
      "id": "lo-opik-u11-q055",
      "unitId": "lo-opik-u11",
      "stem": "Mis on nullmeridiaan?",
      "primaryObjectiveId": "lo-opik-u11-o6",
      "variantGroupId": "lo-opik-u11-g052",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaan on kokkulepitud meridiaan, mille järgi eristatakse ida- ja läänepoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        },
        {
          "kind": "supplementary",
          "url": "https://www.rmg.co.uk/stories/time/what-prime-meridian-why-it-greenwich",
          "attribution": "Royal Museums Greenwich — Prime Meridian"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "zero",
            "text": "Üks meridiaan, mis on ida ja lääne eristamise lähtejoon."
          },
          {
            "id": "equator",
            "text": "Maa kõige laiemast kohast kulgev paralleel."
          },
          {
            "id": "pole",
            "text": "Maa kõige põhjapoolsem punkt."
          },
          {
            "id": "ocean",
            "text": "Maailma kõige suurem ookean."
          }
        ],
        "correctOptionId": "zero"
      }
    },
    {
      "id": "lo-opik-u11-q056",
      "unitId": "lo-opik-u11",
      "stem": "Millisteks poolkeradeks jaotatakse Maa nullmeridiaani järgi?",
      "primaryObjectiveId": "lo-opik-u11-o6",
      "variantGroupId": "lo-opik-u11-g053",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaani järgi eristatakse ida- ja läänepoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "ew",
            "text": "ida- ja läänepoolkeraks"
          },
          {
            "id": "ns",
            "text": "põhja- ja lõunapoolkeraks"
          },
          {
            "id": "dry",
            "text": "maismaaks ja ookeaniks"
          },
          {
            "id": "cold",
            "text": "soojaks ja külmaks"
          }
        ],
        "correctOptionId": "ew"
      }
    },
    {
      "id": "lo-opik-u11-q057",
      "unitId": "lo-opik-u11",
      "stem": "Õige või vale? Nullmeridiaan jagab Maa põhja- ja lõunapoolkeraks.",
      "primaryObjectiveId": "lo-opik-u11-o6",
      "variantGroupId": "lo-opik-u11-g053",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Põhja- ja lõunapoolkera eraldab ekvaator; nullmeridiaan eristab ida- ja läänepoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
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
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o4"
      ]
    },
    {
      "id": "lo-opik-u11-q058",
      "unitId": "lo-opik-u11",
      "stem": "Nullmeridiaan kuulub millisesse joonte rühma?",
      "primaryObjectiveId": "lo-opik-u11-o6",
      "variantGroupId": "lo-opik-u11-g054",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaan on üks meridiaanidest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "meridian",
            "text": "meridiaanide hulka"
          },
          {
            "id": "parallel",
            "text": "paralleelide hulka"
          },
          {
            "id": "continents",
            "text": "mandrite hulka"
          },
          {
            "id": "poles",
            "text": "pooluste hulka"
          }
        ],
        "correctOptionId": "meridian"
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o5"
      ]
    },
    {
      "id": "lo-opik-u11-q059",
      "unitId": "lo-opik-u11",
      "stem": "Miks on nullmeridiaani vaja?",
      "primaryObjectiveId": "lo-opik-u11-o6",
      "variantGroupId": "lo-opik-u11-g055",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaan on inimeste kokkulepitud lähtejoon, mis aitab määrata asukohta ida ja lääne suunas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        },
        {
          "kind": "supplementary",
          "url": "https://www.rmg.co.uk/stories/time/what-prime-meridian-why-it-greenwich",
          "attribution": "Royal Museums Greenwich — Prime Meridian"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "reference",
            "text": "Et oleks ühine algusjoon ida- ja läänepoolsete asukohtade eristamiseks."
          },
          {
            "id": "weather",
            "text": "Et mõõta selle abil õhutemperatuuri."
          },
          {
            "id": "sea",
            "text": "Et eraldada ookeanid maismaast."
          },
          {
            "id": "axis",
            "text": "Et Maa päriselt selle ümber pöörleks."
          }
        ],
        "correctOptionId": "reference"
      }
    },
    {
      "id": "lo-opik-u11-q060",
      "unitId": "lo-opik-u11",
      "stem": "Ühenda joon ja poolkerad, mida see eristab.",
      "primaryObjectiveId": "lo-opik-u11-o6",
      "variantGroupId": "lo-opik-u11-g056",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaator jagab Maa põhja/lõuna pooleks, nullmeridiaan ida/lääne pooleks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "ekvaator"
          },
          {
            "id": "p2",
            "text": "nullmeridiaan"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "põhja- ja lõunapoolkera"
          },
          {
            "id": "c2",
            "text": "ida- ja läänepoolkera"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2"
        }
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o4"
      ]
    },
    {
      "id": "lo-opik-u11-q061",
      "unitId": "lo-opik-u11",
      "stem": "Vali õiged väited nullmeridiaani kohta.",
      "primaryObjectiveId": "lo-opik-u11-o6",
      "variantGroupId": "lo-opik-u11-g057",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaan on põhja-lõunasuunaline meridiaan, mitte ekvaator.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "Nullmeridiaan on üks meridiaanidest."
          },
          {
            "id": "b",
            "text": "Nullmeridiaan aitab eristada ida- ja läänepoolkera."
          },
          {
            "id": "c",
            "text": "Nullmeridiaan on sama mis ekvaator."
          },
          {
            "id": "d",
            "text": "Nullmeridiaan kulgeb ainult ida-läänesuunaliselt."
          }
        ],
        "correctOptionIds": [
          "a",
          "b"
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o5"
      ]
    },
    {
      "id": "lo-opik-u11-q062",
      "unitId": "lo-opik-u11",
      "stem": "Näita joonisel nullmeridiaani.",
      "primaryObjectiveId": "lo-opik-u11-o6",
      "variantGroupId": "lo-opik-u11-g058",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaan on skeemil eraldi esile tõstetud meridiaan.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-meridians-estonia",
        "correctRegionId": "prime-meridian"
      }
    },
    {
      "id": "lo-opik-u11-q063",
      "unitId": "lo-opik-u11",
      "stem": "Millises poolkeras asub punkt, mis jääb nullmeridiaanist ida poole?",
      "primaryObjectiveId": "lo-opik-u11-o6",
      "variantGroupId": "lo-opik-u11-g059",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaanist ida pool asuv punkt on idapoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "east",
            "text": "idapoolkeral"
          },
          {
            "id": "west",
            "text": "läänepoolkeral"
          },
          {
            "id": "north",
            "text": "tingimata põhjapoolkeral"
          },
          {
            "id": "south",
            "text": "tingimata lõunapoolkeral"
          }
        ],
        "correctOptionId": "east"
      }
    },
    {
      "id": "lo-opik-u11-q064",
      "unitId": "lo-opik-u11",
      "stem": "Rühmita paigad nullmeridiaani suhtes.",
      "primaryObjectiveId": "lo-opik-u11-o6",
      "variantGroupId": "lo-opik-u11-g060",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaanist ida poole jääb idapoolkera; lääne poole läänepoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "east",
            "text": "Idapoolkera"
          },
          {
            "id": "west",
            "text": "Läänepoolkera"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "punkt nullmeridiaanist ida pool"
          },
          {
            "id": "i2",
            "text": "punkt nullmeridiaanist lääne pool"
          },
          {
            "id": "i3",
            "text": "teine punkt nullmeridiaani idaküljel"
          },
          {
            "id": "i4",
            "text": "teine punkt nullmeridiaani lääneküljel"
          }
        ],
        "correctGroupByItem": {
          "i1": "east",
          "i2": "west",
          "i3": "east",
          "i4": "west"
        }
      }
    },
    {
      "id": "lo-opik-u11-q065",
      "unitId": "lo-opik-u11",
      "stem": "Millistes poolkerades asub Eesti?",
      "primaryObjectiveId": "lo-opik-u11-o7",
      "variantGroupId": "lo-opik-u11-g063",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub ekvaatorist põhja pool ja nullmeridiaanist ida pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "ne",
            "text": "põhja- ja idapoolkeral"
          },
          {
            "id": "nw",
            "text": "põhja- ja läänepoolkeral"
          },
          {
            "id": "se",
            "text": "lõuna- ja idapoolkeral"
          },
          {
            "id": "sw",
            "text": "lõuna- ja läänepoolkeral"
          }
        ],
        "correctOptionId": "ne"
      }
    },
    {
      "id": "lo-opik-u11-q066",
      "unitId": "lo-opik-u11",
      "stem": "Õige või vale? Eesti asub lõuna- ja läänepoolkeral.",
      "primaryObjectiveId": "lo-opik-u11-o7",
      "variantGroupId": "lo-opik-u11-g063",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Eesti asub põhja- ja idapoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
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
      "id": "lo-opik-u11-q067",
      "unitId": "lo-opik-u11",
      "stem": "Kus asub Eesti ekvaatori suhtes?",
      "primaryObjectiveId": "lo-opik-u11-o7",
      "variantGroupId": "lo-opik-u11-g064",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub ekvaatorist põhja pool ja seepärast põhjapoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "north",
            "text": "ekvaatorist põhja pool"
          },
          {
            "id": "south",
            "text": "ekvaatorist lõuna pool"
          },
          {
            "id": "on",
            "text": "täpselt ekvaatoril"
          },
          {
            "id": "unknown",
            "text": "seda ei saa öelda"
          }
        ],
        "correctOptionId": "north"
      }
    },
    {
      "id": "lo-opik-u11-q068",
      "unitId": "lo-opik-u11",
      "stem": "Kus asub Eesti nullmeridiaani suhtes?",
      "primaryObjectiveId": "lo-opik-u11-o7",
      "variantGroupId": "lo-opik-u11-g065",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub nullmeridiaanist ida pool ja seepärast idapoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "east",
            "text": "nullmeridiaanist ida pool"
          },
          {
            "id": "west",
            "text": "nullmeridiaanist lääne pool"
          },
          {
            "id": "on",
            "text": "täpselt nullmeridiaanil"
          },
          {
            "id": "south",
            "text": "ekvaatorist lõuna pool"
          }
        ],
        "correctOptionId": "east"
      }
    },
    {
      "id": "lo-opik-u11-q069",
      "unitId": "lo-opik-u11",
      "stem": "Miks kuulub Eesti põhjapoolkerasse?",
      "primaryObjectiveId": "lo-opik-u11-o7",
      "variantGroupId": "lo-opik-u11-g066",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhjapoolkerasse kuuluvad kõik ekvaatorist põhja pool asuvad kohad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "equator",
            "text": "Eesti paikneb ekvaatorist põhja pool."
          },
          {
            "id": "zero",
            "text": "Eesti asub nullmeridiaanist lääne pool."
          },
          {
            "id": "polar",
            "text": "Eesti paikneb põhjapoolusel."
          },
          {
            "id": "shape",
            "text": "Eesti on gloobusel väikese täpina."
          }
        ],
        "correctOptionId": "equator"
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o4"
      ]
    },
    {
      "id": "lo-opik-u11-q070",
      "unitId": "lo-opik-u11",
      "stem": "Millised väited Eesti asukoha kohta on õiged?",
      "primaryObjectiveId": "lo-opik-u11-o7",
      "variantGroupId": "lo-opik-u11-g067",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti on põhjapoolkeral ning idapoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "a",
            "text": "Eesti on ekvaatorist põhja pool."
          },
          {
            "id": "b",
            "text": "Eesti on nullmeridiaanist ida pool."
          },
          {
            "id": "c",
            "text": "Eesti on ekvaatorist lõuna pool."
          },
          {
            "id": "d",
            "text": "Eesti on nullmeridiaanist lääne pool."
          }
        ],
        "correctOptionIds": [
          "a",
          "b"
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o4",
        "lo-opik-u11-o6"
      ]
    },
    {
      "id": "lo-opik-u11-q071",
      "unitId": "lo-opik-u11",
      "stem": "Ühenda Eesti asukoht ja joon, mille järgi selle kindlaks teed.",
      "primaryObjectiveId": "lo-opik-u11-o7",
      "variantGroupId": "lo-opik-u11-g068",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja ja lõunat määratakse ekvaatori järgi; ida ja läänt nullmeridiaani järgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Eesti asub põhjapoolkeral"
          },
          {
            "id": "p2",
            "text": "Eesti asub idapoolkeral"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "ekvaator"
          },
          {
            "id": "c2",
            "text": "nullmeridiaan"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2"
        }
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o4",
        "lo-opik-u11-o6"
      ]
    },
    {
      "id": "lo-opik-u11-q072",
      "unitId": "lo-opik-u11",
      "stem": "Näita joonisel Eesti asukohta.",
      "primaryObjectiveId": "lo-opik-u11-o7",
      "variantGroupId": "lo-opik-u11-g069",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Skeemil on Eesti ekvaatorist põhja ja nullmeridiaanist ida pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u11-meridians-estonia",
        "correctRegionId": "estonia"
      }
    },
    {
      "id": "lo-opik-u11-q073",
      "unitId": "lo-opik-u11",
      "stem": "Milline tabeli koht asub samades kahes poolkeras nagu Eesti?",
      "primaryObjectiveId": "lo-opik-u11-o7",
      "variantGroupId": "lo-opik-u11-g070",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti on ekvaatorist põhja ning nullmeridiaanist ida pool. Tabelis vastab sellele koht A.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
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
            "text": "D"
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Koht",
          "Ekvaatori suhtes",
          "Nullmeridiaani suhtes"
        ],
        "rows": [
          [
            "A",
            "põhja pool",
            "ida pool"
          ],
          [
            "B",
            "põhja pool",
            "lääne pool"
          ],
          [
            "C",
            "lõuna pool",
            "ida pool"
          ],
          [
            "D",
            "lõuna pool",
            "lääne pool"
          ]
        ],
        "caption": "Nelja kujuteldava koha paiknemine"
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o4",
        "lo-opik-u11-o6"
      ]
    },
    {
      "id": "lo-opik-u11-q074",
      "unitId": "lo-opik-u11",
      "stem": "Kuidas tuleb parandada skeemi, millel Eesti on märgitud ekvaatorist lõuna poole?",
      "primaryObjectiveId": "lo-opik-u11-o7",
      "variantGroupId": "lo-opik-u11-g071",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti peab paiknema ekvaatorist põhja pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "49"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "north",
            "text": "Tõsta Eesti tähis ekvaatorist põhja poole."
          },
          {
            "id": "south",
            "text": "Tõsta Eesti tähis veel lõuna poole."
          },
          {
            "id": "west",
            "text": "Jäta tähis lõunasse, kuid vii nullmeridiaanist lääne poole."
          },
          {
            "id": "equator",
            "text": "Tõsta Eesti tähis täpselt ekvaatorile."
          }
        ],
        "correctOptionId": "north"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Õpilane joonistas gloobuse skeemi ja märkis Eesti ekslikult ekvaatorist lõuna poole."
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u11-o4"
      ]
    }
  ]
};
