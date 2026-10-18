// Unit 18 — Euroopa kaart. Textbook pp. 68–69.
// Keys remain server-side; bump contentVersion for any content change.
import type { Unit } from '@/lib/textbook/types';

export const unit18: Unit = {
  "id": "lo-opik-u18",
  "courseId": "loodusopetus-opik",
  "number": 18,
  "title": "Euroopa kaart",
  "pages": {
    "from": 68,
    "to": 69
  },
  "status": "ready",
  "contentVersion": "2026-10-17.1",
  "objectives": [
    {
      "id": "lo-opik-u18-o1",
      "description": "Oskan selgitada, et Euroopa on Euraasia mandri lääneosas asuv maailmajagu.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ]
    },
    {
      "id": "lo-opik-u18-o2",
      "description": "Oskan nimetada Euroopa läänes, põhjas ja lõunas paiknevaid suuri veekogusid.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ]
    },
    {
      "id": "lo-opik-u18-o3",
      "description": "Tunnen õpiku järgi Euroopa ida- ja kagupiiri tähtsaid loodusobjekte.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ]
    },
    {
      "id": "lo-opik-u18-o4",
      "description": "Tean, et suurem osa Euroopast asub idapoolkeral, kuid osa jääb läänepoolkerale.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ]
    },
    {
      "id": "lo-opik-u18-o5",
      "description": "Tunnen õpikus pindalalt suurte Euroopa riikide näiteid ja leian need kaardilt.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ]
    },
    {
      "id": "lo-opik-u18-o6",
      "description": "Tunnen õpikus rahvaarvult suurte Euroopa riikide näiteid ja leian need kaardilt.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ]
    },
    {
      "id": "lo-opik-u18-o7",
      "description": "Eristan riigi pindala, rahvaarvu ja rahvastikutiheduse tähendust.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ]
    },
    {
      "id": "lo-opik-u18-o8",
      "description": "Oskan Euroopa kaardilt leida riike ning selgitada kaardi pealkirja, värvide ja tähiste tähendust.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u18-l1",
      "title": "Euroopa asukoht maailmakaardil",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u18-o1",
        "lo-opik-u18-o4"
      ],
      "sections": [
        {
          "id": "lo-opik-u18-s001",
          "title": "Euroopa on maailmajagu",
          "blocks": [
            {
              "id": "lo-opik-u18-b001",
              "type": "paragraph",
              "text": "Meie õpikus eristatakse kuut mandrit ja kuut maailmajagu. Euroopa on maailmajagu, mis asub Euraasia mandri lääneosas. Euraasia mandrisse kuuluvad ka Aasia alad. Euroopa ja Aasia vahele ei jää ookeani: need moodustavad suure ühise maismaa.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b002",
              "type": "definition",
              "term": "Maailmajagu",
              "definition": "Suur geograafiline ja ajalooline piirkond, näiteks Euroopa või Aasia."
            },
            {
              "id": "lo-opik-u18-b003",
              "type": "comparison",
              "title": "Manner ja maailmajagu",
              "columns": [
                {
                  "heading": "Manner",
                  "points": [
                    "Euraasia on üks suur maismaa.",
                    "Eesti asub Euraasia mandril."
                  ]
                },
                {
                  "heading": "Maailmajagu",
                  "points": [
                    "Euroopa ja Aasia on kaks maailmajagu.",
                    "Eesti asub Euroopa maailmajaos."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u18-b004",
              "type": "keyFact",
              "items": [
                "Euroopa on Euraasia mandri lääneosas.",
                "Euroopa ja Aasia on sama mandri eri maailmajaod."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u18-s002",
          "title": "Leia Euroopa maailmakaardilt",
          "blocks": [
            {
              "id": "lo-opik-u18-b005",
              "type": "diagram",
              "diagramId": "u18-europe-world",
              "caption": "Euroopa on tähistatud Euraasia lääneosas. Kaardil olevad piirkonnad on õppimiseks lihtsustatud, mitte täpsed maailmajaopiirid.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b006",
              "type": "paragraph",
              "text": "Vaata maailmakaarti. Euroopast lääne poole jääb Atlandi ookean, ida pool jätkub Euraasia maismaa Aasiana. Lõuna pool asub Aafrika. Eesti paikneb Euroopa põhjaosas. Seda teadmist saad kasutada Euroopa kaardi lugemisel.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b007",
              "type": "list",
              "items": [
                "Maailmakaardil otsi Euraasiat.",
                "Selle lääneosas otsi Euroopat.",
                "Euroopas otsi Läänemere ümbrust ja Eestit."
              ],
              "ordered": true
            },
            {
              "id": "lo-opik-u18-b008",
              "type": "keyFact",
              "items": [
                "Euroopa ei ole meie õpiku kuue mandri loendis eraldi manner.",
                "Euroopa on maailmajagu."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u18-s003",
          "title": "Euroopa asub peamiselt idapoolkeral",
          "blocks": [
            {
              "id": "lo-opik-u18-b009",
              "type": "paragraph",
              "text": "Nullmeridiaan jagab Maa ida- ja läänepoolkeraks. Suur osa Euroopast jääb nullmeridiaanist ida poole ehk idapoolkerale. Väiksem osa Euroopast ulatub ka läänepoolkerale. Euroopa paikneb põhjapoolkeral.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b010",
              "type": "comparison",
              "title": "Ära aja poolkerasid segamini",
              "columns": [
                {
                  "heading": "Ekvaator",
                  "points": [
                    "eristab põhja- ja lõunapoolkera",
                    "Euroopa asub põhjapoolkeral"
                  ]
                },
                {
                  "heading": "Nullmeridiaan",
                  "points": [
                    "eristab ida- ja läänepoolkera",
                    "Euroopa ulatub mõlemale poole nullmeridiaani"
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u18-b011",
              "type": "keyFact",
              "items": [
                "Suurem osa Euroopast on idapoolkeral.",
                "Väiksem osa Euroopast jääb läänepoolkerale."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u18-l2",
      "title": "Euroopa piirid ja naabrid",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u18-o2",
        "lo-opik-u18-o3"
      ],
      "sections": [
        {
          "id": "lo-opik-u18-s004",
          "title": "Läänes Atlandi ookean, põhjas Põhja-Jäämeri",
          "blocks": [
            {
              "id": "lo-opik-u18-b012",
              "type": "paragraph",
              "text": "Euroopat piirab läänest ja loodest Atlandi ookean. Euroopa põhjapoolsete alade taga asub Põhja-Jäämeri. Need on suured maailmamere osad. Kui vaatad kaarti, siis sõnad lääs ja põhi aitavad need veekogud üles leida.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b013",
              "type": "diagram",
              "diagramId": "u18-europe-borders",
              "caption": "Tähistega kaart näitab Euroopa ümber Atlandi ookeani, Põhja-Jäämerd, Vahemerd, Musta merd, Kaspia merd ja Uurali mäestikku.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b014",
              "type": "table",
              "headers": [
                "Ilmakaar Euroopa suhtes",
                "Loodusobjekt"
              ],
              "rows": [
                [
                  "lääs ja loode",
                  "Atlandi ookean"
                ],
                [
                  "põhi",
                  "Põhja-Jäämeri"
                ]
              ],
              "caption": "Euroopa kaks ookeanipiiri"
            },
            {
              "id": "lo-opik-u18-b015",
              "type": "keyFact",
              "items": [
                "Atlandi ookean on Euroopast läänes ja loodes.",
                "Põhja-Jäämeri on Euroopast põhjas."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u18-s005",
          "title": "Lõunas Vahemeri",
          "blocks": [
            {
              "id": "lo-opik-u18-b016",
              "type": "paragraph",
              "text": "Euroopa lõunaserval asub Vahemeri. Vahemeri eraldab Euroopat Aafrikast. Kaardil näed Vahemere põhjarannikul Euroopa alasid ja lõunarannikul Aafrikat. Meri on osa maailmamerest.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b017",
              "type": "definition",
              "term": "Vahemeri",
              "definition": "Meri Euroopa lõunaosas, mis jääb Euroopa ja Aafrika vahele."
            },
            {
              "id": "lo-opik-u18-b018",
              "type": "comparison",
              "title": "Leia õige suund",
              "columns": [
                {
                  "heading": "Lääs ja loode",
                  "points": [
                    "Atlandi ookean"
                  ]
                },
                {
                  "heading": "Põhi",
                  "points": [
                    "Põhja-Jäämeri"
                  ]
                },
                {
                  "heading": "Lõuna",
                  "points": [
                    "Vahemeri ja teisel pool seda Aafrika"
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u18-b019",
              "type": "keyFact",
              "items": [
                "Vahemeri jääb Euroopast lõuna poole.",
                "Vahemeri eraldab Euroopat Aafrikast."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u18-s006",
          "title": "Idas on Uurali mäestik",
          "blocks": [
            {
              "id": "lo-opik-u18-b020",
              "type": "paragraph",
              "text": "Euroopa idapiiriks nimetab õpik Uurali mäestikku. See asub Euraasia maismaal. Euroopa ja Aasia vaheline piir ei ole igal pool looduses selge sein või mereriba: piiri asukoht põhineb geograafilisel kokkuleppel.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b021",
              "type": "definition",
              "term": "Uurali mäestik",
              "definition": "Mäestik Euroopa ja Aasia kokkuleppelise piiri juures. Seda kasutatakse Euroopa idapiiri kirjeldamisel."
            },
            {
              "id": "lo-opik-u18-b022",
              "type": "keyFact",
              "items": [
                "Õpiku järgi märgib Euroopa idapiiri Uurali mäestik.",
                "Euroopa ja Aasia on omavahel maismaaga ühendatud."
              ]
            },
            {
              "id": "lo-opik-u18-b023",
              "type": "enrichment",
              "variant": "extra",
              "title": "Lisateadmine",
              "body": [
                "Euroopa ja Aasia piiritlemiseks kasutatakse erinevates allikates osaliselt erinevaid kokkuleppeid. Selles õppetükis kasutame õpiku lihtsustatud käsitlust."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u18-s007",
          "title": "Kagus Must meri ja Kaspia meri",
          "blocks": [
            {
              "id": "lo-opik-u18-b024",
              "type": "paragraph",
              "text": "Euroopa kagupiiri kirjeldab õpik Musta mere ja Kaspia mere abil. Vahemeri jääb Euroopa lõunaossa, Must meri ning Kaspia meri aga kagupoolse piiri juurde. Kaspia meri on nimele vaatamata ookeanist eraldatud väga suur siseveekogu. Õppimiseks piisab, kui oskad need kolm eri veekogu kaardil eristada.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b025",
              "type": "diagram",
              "diagramId": "u18-europe-borders",
              "caption": "Võrdle lõuna pool asuvat Vahemerd kagus asuvate Musta ja Kaspia merega.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b026",
              "type": "table",
              "headers": [
                "Suund",
                "Nimetus"
              ],
              "rows": [
                [
                  "lääs/loode",
                  "Atlandi ookean"
                ],
                [
                  "põhi",
                  "Põhja-Jäämeri"
                ],
                [
                  "lõuna",
                  "Vahemeri"
                ],
                [
                  "ida",
                  "Uurali mäestik"
                ],
                [
                  "kagu",
                  "Must meri ja Kaspia meri"
                ]
              ],
              "caption": "Õpiku Euroopa piiride meelespea"
            },
            {
              "id": "lo-opik-u18-b027",
              "type": "keyFact",
              "items": [
                "Must meri ja Kaspia meri asuvad Euroopa kagupoolsel piiril.",
                "Uurali mäestik on õpiku järgi idaosas."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u18-l3",
      "title": "Euroopa suurimad riigid pindala järgi",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u18-o5",
        "lo-opik-u18-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u18-s008",
          "title": "Euroopas on palju eri suurusega riike",
          "blocks": [
            {
              "id": "lo-opik-u18-b028",
              "type": "paragraph",
              "text": "Euroopas on palju riike. Mõnel neist on suur maa-ala, teisel üsna väike. Riigi pindala näitab, kui suure maa-ala riik hõlmab. Euroopa riike võrreldes tuleb vaadata ka seda, kuidas kaardil on pindala kujutatud.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b029",
              "type": "definition",
              "term": "Pindala",
              "definition": "Näitab, kui suur on mingi maa-ala, näiteks riigi territoorium. Suuri pindalasid väljendatakse tavaliselt ruutkilomeetrites."
            },
            {
              "id": "lo-opik-u18-b030",
              "type": "keyFact",
              "items": [
                "Riikide pindalad on väga erinevad.",
                "Riigi pindala ei näita, mitu inimest seal elab."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u18-s009",
          "title": "Õpiku suured riigid",
          "blocks": [
            {
              "id": "lo-opik-u18-b031",
              "type": "paragraph",
              "text": "Õpik nimetab Euroopa pindalalt suurte riikidena Venemaad, Ukrainat, Prantsusmaad, Hispaaniat ja Rootsit. Venemaa ulatub nii Euroopasse kui ka Aasiasse. Jätame meelde just õpikus nimetatud riigid, mitte ei hakka pähe õppima muutuvate andmestike põhjal koostatud täpset esikümne järjestust.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b032",
              "type": "diagram",
              "diagramId": "u18-europe-area",
              "caption": "Euroopa kaardil on esile tõstetud õpikus nimetatud pindalalt suured riigid: Venemaa, Ukraina, Prantsusmaa, Hispaania ja Rootsi. Venemaast on kaardivaates näha ainult üks osa; riik ulatub kaugemale Aasiasse.",
              "source": {
                "kind": "textbook",
                "pages": "69"
              }
            },
            {
              "id": "lo-opik-u18-b033",
              "type": "list",
              "items": [
                "Venemaa – ulatub Euraasias väga kaugele itta.",
                "Ukraina – Euroopa idaosas.",
                "Prantsusmaa – Lääne-Euroopas.",
                "Hispaania – Euroopa edelaosas.",
                "Rootsi – Põhja-Euroopas."
              ]
            },
            {
              "id": "lo-opik-u18-b034",
              "type": "keyFact",
              "items": [
                "Õpiku näited pindalalt suurtest Euroopa riikidest: Venemaa, Ukraina, Prantsusmaa, Hispaania ja Rootsi."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u18-s010",
          "title": "Kaardil võivad värvid tähistada pindala",
          "blocks": [
            {
              "id": "lo-opik-u18-b035",
              "type": "paragraph",
              "text": "Õpiku 69. lehekülje kaardil on osa riike kollase-oranžiga esile tõstetud. Kaardi legend selgitab, et värv näitab kümne pindalalt suurima hulka arvatud riike. Kõigil kaartidel ei tähenda kollane värv sama asja: loe alati kõigepealt kaardi pealkiri ja legend.",
              "source": {
                "kind": "textbook",
                "pages": "69"
              }
            },
            {
              "id": "lo-opik-u18-b036",
              "type": "table",
              "headers": [
                "Kaardi tähis",
                "Mida see tähendab selle õpiku kaardil?"
              ],
              "rows": [
                [
                  "Värvitud riik",
                  "Kuulub kaardil pindalalt kümne suurima hulka"
                ],
                [
                  "Ring ja number",
                  "Näitab rahvaarvu miljonites inimestes"
                ],
                [
                  "Riiginimi",
                  "Aitab riiki kaardilt leida"
                ]
              ],
              "caption": "Õpiku Euroopa kaardi legendi lugemine"
            },
            {
              "id": "lo-opik-u18-b037",
              "type": "keyFact",
              "items": [
                "Kaardi värvide tähendus tuleb alati legendist üle vaadata.",
                "Pindala ja rahvaarvu tähised annavad erinevat teavet."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u18-l4",
      "title": "Euroopa riikide rahvaarv ja kaardid",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u18-o6",
        "lo-opik-u18-o7",
        "lo-opik-u18-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u18-s011",
          "title": "Mõnes riigis elab palju, teises vähe inimesi",
          "blocks": [
            {
              "id": "lo-opik-u18-b038",
              "type": "paragraph",
              "text": "Riigi rahvaarv näitab, mitu inimest selles riigis elab. Õpik nimetab Euroopa suure rahvaarvuga riikidena Venemaad, Saksamaad, Ühendkuningriiki (Suurbritanniat), Prantsusmaad ja Itaaliat. Need näited ei ole samad mis pindalalt suurte riikide loend.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b039",
              "type": "definition",
              "term": "Rahvaarv",
              "definition": "Inimeste arv mingis riigis või piirkonnas."
            },
            {
              "id": "lo-opik-u18-b040",
              "type": "diagram",
              "diagramId": "u18-europe-population",
              "caption": "Kaardil on näidatud õpikus nimetatud suure rahvaarvuga Euroopa riigid: Venemaa, Saksamaa, Ühendkuningriik, Prantsusmaa ja Itaalia.",
              "source": {
                "kind": "textbook",
                "pages": "69"
              }
            },
            {
              "id": "lo-opik-u18-b041",
              "type": "keyFact",
              "items": [
                "Rahvaarv ütleb, kui palju inimesi riigis elab.",
                "Õpiku näited: Venemaa, Saksamaa, Ühendkuningriik, Prantsusmaa ja Itaalia."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u18-s012",
          "title": "Pindala ja rahvaarv ei ole üks ja sama",
          "blocks": [
            {
              "id": "lo-opik-u18-b042",
              "type": "paragraph",
              "text": "Võrdle kahte õpiku riikide loendit. Rootsi ja Hispaania on pindalalt suurte riikide näidete hulgas. Saksamaa ja Ühendkuningriik on rahvaarvult suurte riikide näidete hulgas. Venemaad ja Prantsusmaad nimetatakse mõlemas loendis. Pindalalt suur riik ei pea olema sama riik, kus elab kõige rohkem inimesi.",
              "source": {
                "kind": "textbook",
                "pages": "68"
              }
            },
            {
              "id": "lo-opik-u18-b043",
              "type": "comparison",
              "title": "Kaks eri võrdlust",
              "columns": [
                {
                  "heading": "Pindalalt suured",
                  "points": [
                    "Venemaa",
                    "Ukraina",
                    "Prantsusmaa",
                    "Hispaania",
                    "Rootsi"
                  ]
                },
                {
                  "heading": "Rahvaarvult suured",
                  "points": [
                    "Venemaa",
                    "Saksamaa",
                    "Ühendkuningriik",
                    "Prantsusmaa",
                    "Itaalia"
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u18-b044",
              "type": "keyFact",
              "items": [
                "Pindala mõõdab maa-ala.",
                "Rahvaarv loeb inimesi.",
                "Venemaa ja Prantsusmaa on õpiku mõlemas näidete loendis."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u18-s013",
          "title": "Rahvastikutihedus näitab inimeste paiknemist",
          "blocks": [
            {
              "id": "lo-opik-u18-b045",
              "type": "paragraph",
              "text": "Rahvaarv ütleb, kui palju inimesi kokku elab. Rahvastikutihedus aitab aga võrrelda, kui palju inimesi elab ühel ruutkilomeetril. Kui sama suurel maa-alal elab rohkem inimesi, on seal asustus tihedam. Õpiku rahvastikutiheduse kaardil näitab tumedam toon tihedamalt asustatud piirkondi, heledam toon hõredamalt asustatud piirkondi.",
              "source": {
                "kind": "textbook",
                "pages": "69"
              }
            },
            {
              "id": "lo-opik-u18-b046",
              "type": "definition",
              "term": "Rahvastikutihedus",
              "definition": "Inimeste arv ühe ruutkilomeetri maa-ala kohta."
            },
            {
              "id": "lo-opik-u18-b047",
              "type": "table",
              "headers": [
                "Õppepiirkond (väljamõeldud)",
                "Pindala",
                "Elanikke",
                "Elanikke 1 km² kohta"
              ],
              "rows": [
                [
                  "Kask",
                  "10 km²",
                  "100 inimest",
                  "10"
                ],
                [
                  "Meri",
                  "10 km²",
                  "300 inimest",
                  "30"
                ],
                [
                  "Mägi",
                  "10 km²",
                  "50 inimest",
                  "5"
                ]
              ],
              "caption": "Lihtsustatud arvutusnäide. Need ei ole päris riikide andmed."
            },
            {
              "id": "lo-opik-u18-b048",
              "type": "keyFact",
              "items": [
                "Rahvastikutihedus ei ole sama mis rahvaarv.",
                "Sama suure pindala puhul tähendab suurem rahvaarv tihedamat asustust."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u18-s014",
          "title": "Nii loed Euroopa temaatilist kaarti",
          "blocks": [
            {
              "id": "lo-opik-u18-b049",
              "type": "paragraph",
              "text": "Kaardil võib olla palju infot korraga. Õpiku Euroopa kaardil näitavad värvid suurte pindaladega riike ja ringides olevad arvud rahvaarvu. Kõrval oleval rahvastikutiheduse kaardil näitab varjundi tumedus hoopis seda, kus inimesed paiknevad tihedamalt. Arvud võivad aastate jooksul muutuda, seega ei kasuta me õpiku kaardile trükitud arve tänapäevaste rahvaarvudena.",
              "source": {
                "kind": "textbook",
                "pages": "69"
              }
            },
            {
              "id": "lo-opik-u18-b050",
              "type": "list",
              "items": [
                "1. Vaata kaardi pealkirja.",
                "2. Loe legendist, mida värvid ja sümbolid tähendavad.",
                "3. Otsi küsimuses nimetatud riik või piirkond.",
                "4. Võrdle märgitud andmeid ja tee järeldus."
              ]
            },
            {
              "id": "lo-opik-u18-b051",
              "type": "table",
              "headers": [
                "Küsimus",
                "Millist infot vajad?"
              ],
              "rows": [
                [
                  "Mis riik võtab rohkem ruumi?",
                  "Riigi pindala"
                ],
                [
                  "Kus elab rohkem inimesi kokku?",
                  "Riigi rahvaarv"
                ],
                [
                  "Kus on ühel ruutkilomeetril rohkem inimesi?",
                  "Rahvastikutihedus"
                ]
              ],
              "caption": "Vali õige kaardiinfo"
            },
            {
              "id": "lo-opik-u18-b052",
              "type": "keyFact",
              "items": [
                "Üks ja sama riik võib olla pindalalt suur, kuid mitte kõige suurema rahvaarvuga.",
                "Kaarti lugedes alusta pealkirjast ja legendist."
              ]
            },
            {
              "id": "lo-opik-u18-b053",
              "type": "externalResource",
              "title": "Avasta Euroopat – Euroopa Liidu õppemäng",
              "intro": "Võimalus vaadata Euroopa Liidu riike ja mängida vabatahtlikult. Euroopa Liit ei hõlma kõiki Euroopa riike.",
              "url": "https://learning-corner.learning.europa.eu/play-games/explore-europe-game_en",
              "publisher": "Euroopa Liit",
              "resourceType": "interactive",
              "observe": "Märka, et Euroopa Liidu riikide kaart ei ole sama mis kõigi Euroopa riikide kaart."
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u18-q001",
      "unitId": "lo-opik-u18",
      "stem": "Millise mandri lääneosas Euroopa asub?",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g001",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa on Euraasia mandri lääneosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Euraasia"
          },
          {
            "id": "b",
            "text": "Aafrika"
          },
          {
            "id": "c",
            "text": "Austraalia"
          },
          {
            "id": "d",
            "text": "Antarktise"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q002",
      "unitId": "lo-opik-u18",
      "stem": "Õige või vale? Meie õpiku järgi on Euraasia manner.",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g001",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku kuue mandri jaotuses on Euraasia manner.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "oige",
            "text": "Õige"
          },
          {
            "id": "vale",
            "text": "Vale"
          }
        ],
        "correctOptionId": "oige",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u18-q003",
      "unitId": "lo-opik-u18",
      "stem": "Millise maailmajao nimi sobib Euraasia lääneossa?",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g002",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa asub Euraasia mandri lääneosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Euroopa"
          },
          {
            "id": "b",
            "text": "Aasia"
          },
          {
            "id": "c",
            "text": "Aafrika"
          },
          {
            "id": "d",
            "text": "Ameerika"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q004",
      "unitId": "lo-opik-u18",
      "stem": "Millisesse maailmajakku kuulub Eesti?",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g003",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti kuulub Euroopa maailmajakku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Euroopa"
          },
          {
            "id": "b",
            "text": "Aasia"
          },
          {
            "id": "c",
            "text": "Aafrika"
          },
          {
            "id": "d",
            "text": "Austraalia ja Okeaania"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q005",
      "unitId": "lo-opik-u18",
      "stem": "Milline väide Euroopa kohta vastab õpikule?",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g004",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa on maailmajagu, mitte meie õpiku järgi eraldi manner.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Euroopa on maailmajagu."
          },
          {
            "id": "b",
            "text": "Euroopa on Euraasiast eraldi manner."
          },
          {
            "id": "c",
            "text": "Euroopa asub Aafrika keskel."
          },
          {
            "id": "d",
            "text": "Euroopa on ookean."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q006",
      "unitId": "lo-opik-u18",
      "stem": "Miks kuuluvad Euroopa ja Aasia meie õpikus ühe mandri koosseisu?",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g005",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa ja Aasia vahel ei ole neid eraldavat ookeani: tegu on Euraasia ühendatud maismaaga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Need moodustavad ühise Euraasia maismaa."
          },
          {
            "id": "b",
            "text": "Neid eraldab suur ookean."
          },
          {
            "id": "c",
            "text": "Kõigil nende riikidel on ühine pealinn."
          },
          {
            "id": "d",
            "text": "Mõlemad asuvad ainult lõunapoolkeral."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q007",
      "unitId": "lo-opik-u18",
      "stem": "Õige või vale? Euroopa ja Aasia on kaks maailmajagu, kuid kuuluvad samasse Euraasia mandrisse.",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g005",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Manner on Euraasia; maailmajaod Euroopa ja Aasia.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "oige",
            "text": "Õige"
          },
          {
            "id": "vale",
            "text": "Vale"
          }
        ],
        "correctOptionId": "oige",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u18-q008",
      "unitId": "lo-opik-u18",
      "stem": "Ühenda mõiste ja õige näide.",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g006",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on manner, Euroopa maailmajagu ja Euroopa paikneb Euraasia lääneosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "manner"
          },
          {
            "id": "p2",
            "text": "maailmajagu"
          },
          {
            "id": "p3",
            "text": "Euroopa paiknemine Euraasias"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Euraasia"
          },
          {
            "id": "c2",
            "text": "Euroopa"
          },
          {
            "id": "c3",
            "text": "lääneosas"
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
      "id": "lo-opik-u18-q009",
      "unitId": "lo-opik-u18",
      "stem": "Vali kõik õpikuga sobivad väited.",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g007",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa on maailmajagu Euraasia lääneosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Euroopa on maailmajagu."
          },
          {
            "id": "o2",
            "text": "Euroopa asub Euraasia lääneosas."
          },
          {
            "id": "o3",
            "text": "Euroopa on Aafrika osa."
          },
          {
            "id": "o4",
            "text": "Aasia on Euroopa läänepoolne ookean."
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2"
        ]
      }
    },
    {
      "id": "lo-opik-u18-q010",
      "unitId": "lo-opik-u18",
      "stem": "Vaata joonist. Puuduta Euroopa asukohta tähistavat piirkonda.",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g008",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa paikneb maailmakaardil Euraasia lääneosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-world",
        "correctRegionId": "europe"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-world"
      }
    },
    {
      "id": "lo-opik-u18-q011",
      "unitId": "lo-opik-u18",
      "stem": "Õpilane leiab kaardil Euraasia. Millist selle osa ta peaks vaatama, et leida Euroopat?",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g002",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa moodustab Euraasia läänepoolse maailmajao.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Lääneosa."
          },
          {
            "id": "b",
            "text": "Kõige idapoolsemat osa."
          },
          {
            "id": "c",
            "text": "Kesk-Aafrikat."
          },
          {
            "id": "d",
            "text": "Lõunapoolkera Antarktise juures."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Õpilane kasutab maailmakaarti ja soovib leida Euroopa maailmajao."
        ]
      }
    },
    {
      "id": "lo-opik-u18-q012",
      "unitId": "lo-opik-u18",
      "stem": "Rühmita kaardi nimetused: kas manner või maailmajagu?",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g006",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia ja Põhja-Ameerika on mandrid; Euroopa ja Aasia on maailmajaod.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "m",
            "text": "manner"
          },
          {
            "id": "j",
            "text": "maailmajagu"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Euraasia"
          },
          {
            "id": "i2",
            "text": "Põhja-Ameerika"
          },
          {
            "id": "i3",
            "text": "Euroopa"
          },
          {
            "id": "i4",
            "text": "Aasia"
          }
        ],
        "correctGroupByItem": {
          "i1": "m",
          "i2": "m",
          "i3": "j",
          "i4": "j"
        }
      }
    },
    {
      "id": "lo-opik-u18-q013",
      "unitId": "lo-opik-u18",
      "stem": "Milline ookean jääb Euroopast läände ja loodesse?",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g009",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean piirab Euroopat läänest ja loodest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Atlandi ookean"
          },
          {
            "id": "b",
            "text": "India ookean"
          },
          {
            "id": "c",
            "text": "Vaikne ookean"
          },
          {
            "id": "d",
            "text": "Lõuna-Jäämeri"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q014",
      "unitId": "lo-opik-u18",
      "stem": "Mis asub Euroopast põhjas?",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g010",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja-Jäämeri asub Euroopast põhja pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "b",
            "text": "Vahemeri"
          },
          {
            "id": "c",
            "text": "India ookean"
          },
          {
            "id": "d",
            "text": "Kaspia meri"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q015",
      "unitId": "lo-opik-u18",
      "stem": "Milline meri jääb Euroopa lõunasse?",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g011",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa lõunapiiril asub Vahemeri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Vahemeri"
          },
          {
            "id": "b",
            "text": "Läänemeri"
          },
          {
            "id": "c",
            "text": "Kaspia meri"
          },
          {
            "id": "d",
            "text": "Soome laht"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q016",
      "unitId": "lo-opik-u18",
      "stem": "Milline meri eraldab Euroopat Aafrikast?",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g012",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahemeri asub Euroopa ja Aafrika vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Vahemeri"
          },
          {
            "id": "b",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "c",
            "text": "Läänemeri"
          },
          {
            "id": "d",
            "text": "Kaspia meri"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q017",
      "unitId": "lo-opik-u18",
      "stem": "Õige või vale? Atlandi ookean on Euroopast valdavalt lääne pool.",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g009",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean asub Euroopast läänes ja loodes.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "oige",
            "text": "Õige"
          },
          {
            "id": "vale",
            "text": "Vale"
          }
        ],
        "correctOptionId": "oige",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u18-q018",
      "unitId": "lo-opik-u18",
      "stem": "Miks on Vahemeri Euroopa ja Aafrika asukoha selgitamisel tähtis?",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g012",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahemeri lahutab Euroopat Aafrikast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "See jääb nende vahele."
          },
          {
            "id": "b",
            "text": "See asub ainult Aasias."
          },
          {
            "id": "c",
            "text": "See on Uurali mäestiku teine nimi."
          },
          {
            "id": "d",
            "text": "See ühendab kõiki riike maismaaga."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q019",
      "unitId": "lo-opik-u18",
      "stem": "Ühenda veekogu ja suund Euroopa suhtes.",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g013",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean jääb läände ja loodesse, Põhja-Jäämeri põhja ning Vahemeri lõunasse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Atlandi ookean"
          },
          {
            "id": "p2",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "p3",
            "text": "Vahemeri"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "lääs/loode"
          },
          {
            "id": "c2",
            "text": "põhi"
          },
          {
            "id": "c3",
            "text": "lõuna"
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
      "id": "lo-opik-u18-q020",
      "unitId": "lo-opik-u18",
      "stem": "Rühmita: ookean või meri?",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g014",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean ja Põhja-Jäämeri on ookeanid; Vahemeri ja Must meri on mered.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "o",
            "text": "ookean"
          },
          {
            "id": "m",
            "text": "meri"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Atlandi ookean"
          },
          {
            "id": "i2",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "i3",
            "text": "Vahemeri"
          },
          {
            "id": "i4",
            "text": "Must meri"
          }
        ],
        "correctGroupByItem": {
          "i1": "o",
          "i2": "o",
          "i3": "m",
          "i4": "m"
        }
      }
    },
    {
      "id": "lo-opik-u18-q021",
      "unitId": "lo-opik-u18",
      "stem": "Vali kõik Euroopa lähedased veekogud, mida õpik nimetab läänes, põhjas või lõunas.",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g015",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab nendes suundades Atlandi ookeani, Põhja-Jäämerd ja Vahemerd.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Atlandi ookean"
          },
          {
            "id": "o2",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "o3",
            "text": "Vahemeri"
          },
          {
            "id": "o4",
            "text": "India ookean"
          },
          {
            "id": "o5",
            "text": "Vaikne ookean"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2",
          "o3"
        ]
      }
    },
    {
      "id": "lo-opik-u18-q022",
      "unitId": "lo-opik-u18",
      "stem": "Näita joonisel Atlandi ookeani.",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g009",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean asub Euroopast läänes.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-borders",
        "correctRegionId": "atlantic"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-borders"
      }
    },
    {
      "id": "lo-opik-u18-q023",
      "unitId": "lo-opik-u18",
      "stem": "Näita joonisel Põhja-Jäämerd.",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g010",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja-Jäämeri asub Euroopast põhja pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-borders",
        "correctRegionId": "arctic"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-borders"
      }
    },
    {
      "id": "lo-opik-u18-q024",
      "unitId": "lo-opik-u18",
      "stem": "Näita joonisel Vahemerd.",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g011",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahemeri asub Euroopast lõunas, Aafrika põhjaranniku juures.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-borders",
        "correctRegionId": "mediterranean"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-borders"
      }
    },
    {
      "id": "lo-opik-u18-q025",
      "unitId": "lo-opik-u18",
      "stem": "Aafrikast põhja poole sõitev laev ületab enne Euroopasse jõudmist suure mere. Millise?",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g012",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahemeri jääb Aafrika ja Euroopa vahele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Vahemere."
          },
          {
            "id": "b",
            "text": "Põhja-Jäämere."
          },
          {
            "id": "c",
            "text": "Kaspia mere."
          },
          {
            "id": "d",
            "text": "Lõuna-Jäämere."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Laev alustab Aafrika põhjarannikult ja suundub üle mere Euroopa lõunarannikule."
        ]
      }
    },
    {
      "id": "lo-opik-u18-q026",
      "unitId": "lo-opik-u18",
      "stem": "Järjesta need õppimise sammud, et leida kaardilt Euroopa lõunapiiri meri.",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g016",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõigepealt leia Euroopa ja suund, siis loe veekogu nimi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Vaata Euroopa asukohta kaardil."
          },
          {
            "id": "i2",
            "text": "Leia kaardil Euroopa lõunaosa."
          },
          {
            "id": "i3",
            "text": "Vaata, milline meri paikneb lõuna pool."
          },
          {
            "id": "i4",
            "text": "Loe mere nimi kaardilt."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ],
        "firstLabel": "Esimene",
        "lastLabel": "Viimane"
      }
    },
    {
      "id": "lo-opik-u18-q027",
      "unitId": "lo-opik-u18",
      "stem": "Milline mäestik märgib õpiku järgi Euroopa idapiiri?",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g017",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku Euroopa idapiiri peamiseks mäestikuks on Uuralid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Uurali mäestik"
          },
          {
            "id": "b",
            "text": "Alpid"
          },
          {
            "id": "c",
            "text": "Himaalaja"
          },
          {
            "id": "d",
            "text": "Andid"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q028",
      "unitId": "lo-opik-u18",
      "stem": "Milline meri on õpiku järgi Euroopa kagupiiri juures?",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g018",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Must meri on Euroopa kagupoolse piiri juures.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Must meri"
          },
          {
            "id": "b",
            "text": "Läänemeri"
          },
          {
            "id": "c",
            "text": "Põhjameri"
          },
          {
            "id": "d",
            "text": "Iiri meri"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q029",
      "unitId": "lo-opik-u18",
      "stem": "Milline teine veekogu on õpiku järgi kagupiiri juures?",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g019",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaspia meri on üks Euroopa kagupiiri juures nimetatud veekogudest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaspia meri"
          },
          {
            "id": "b",
            "text": "Vahemeri"
          },
          {
            "id": "c",
            "text": "Soome laht"
          },
          {
            "id": "d",
            "text": "Põhja-Jäämeri"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q030",
      "unitId": "lo-opik-u18",
      "stem": "Õige või vale? Õpiku järgi on Uurali mäestik Euroopa läänepiiril.",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g017",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Uurali mäestik on Euroopa idapiiri juures, mitte lääneosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "oige",
            "text": "Õige"
          },
          {
            "id": "vale",
            "text": "Vale"
          }
        ],
        "correctOptionId": "vale",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u18-q031",
      "unitId": "lo-opik-u18",
      "stem": "Vali kõik õpiku järgi Euroopa kaguosas piiri juures asuvad mered.",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g020",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab kagupiiri juures Musta merd ja Kaspia merd.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Must meri"
          },
          {
            "id": "o2",
            "text": "Kaspia meri"
          },
          {
            "id": "o3",
            "text": "Läänemeri"
          },
          {
            "id": "o4",
            "text": "Põhjameri"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2"
        ]
      }
    },
    {
      "id": "lo-opik-u18-q032",
      "unitId": "lo-opik-u18",
      "stem": "Mis vahe on Euroopa lääne- ja idapiiri selgitamisel õpiku järgi?",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g021",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänes on ookean, idas kasutatakse Uurali mäestikku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Läänes on Atlandi ookean, idas Uurali mäestik."
          },
          {
            "id": "b",
            "text": "Läänes on Uuralid, idas Atlandi ookean."
          },
          {
            "id": "c",
            "text": "Mõlemal pool on Vaikne ookean."
          },
          {
            "id": "d",
            "text": "Mõlemad piirid kulgevad mööda ekvaatorit."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q033",
      "unitId": "lo-opik-u18",
      "stem": "Miks ei ole Euroopa ja Aasia vahel pidevat ookeani?",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g005",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa ja Aasia on sama maismaa kaks maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Need on ühendatud Euraasia maismaana."
          },
          {
            "id": "b",
            "text": "Nende vahele jääb Vaikne ookean."
          },
          {
            "id": "c",
            "text": "Aasia koosneb ainult saartest."
          },
          {
            "id": "d",
            "text": "Uurali mäestik on ookean."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q034",
      "unitId": "lo-opik-u18",
      "stem": "Ühenda õpiku piiriga seotud objekt ja suund.",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g022",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Uuralid on idas, Must ja Kaspia meri kagus ning Atlandi ookean läänes.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Uurali mäestik"
          },
          {
            "id": "p2",
            "text": "Must meri ja Kaspia meri"
          },
          {
            "id": "p3",
            "text": "Atlandi ookean"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "ida"
          },
          {
            "id": "c2",
            "text": "kagu"
          },
          {
            "id": "c3",
            "text": "lääs/loode"
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
      "id": "lo-opik-u18-q035",
      "unitId": "lo-opik-u18",
      "stem": "Milline objekt on mäestik, mitte veekogu?",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g023",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Uurali mäestik on mäestik; ülejäänud on veekogud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Uurali mäestik"
          },
          {
            "id": "b",
            "text": "Must meri"
          },
          {
            "id": "c",
            "text": "Kaspia meri"
          },
          {
            "id": "d",
            "text": "Atlandi ookean"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q036",
      "unitId": "lo-opik-u18",
      "stem": "Vali kõik õpiku lihtsustatud Euroopa ida- ja kagupiiri tähised.",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g024",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku kirjelduses on idas Uuralid ning kagus Must ja Kaspia meri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Uurali mäestik"
          },
          {
            "id": "o2",
            "text": "Must meri"
          },
          {
            "id": "o3",
            "text": "Kaspia meri"
          },
          {
            "id": "o4",
            "text": "Vaikne ookean"
          },
          {
            "id": "o5",
            "text": "India ookean"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2",
          "o3"
        ]
      }
    },
    {
      "id": "lo-opik-u18-q037",
      "unitId": "lo-opik-u18",
      "stem": "Näita joonisel Uurali mäestiku asukohta.",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g017",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Uurali mäestik on Euroopa idapiiri juures.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-borders",
        "correctRegionId": "ural"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-borders"
      }
    },
    {
      "id": "lo-opik-u18-q038",
      "unitId": "lo-opik-u18",
      "stem": "Näita joonisel Musta mere asukohta.",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g018",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Must meri paikneb Euroopa kagupoolses piirkonnas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-borders",
        "correctRegionId": "black-sea"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-borders"
      }
    },
    {
      "id": "lo-opik-u18-q039",
      "unitId": "lo-opik-u18",
      "stem": "Näita joonisel Kaspia mere asukohta.",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g019",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaspia meri paikneb Mustast merest ida pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-borders",
        "correctRegionId": "caspian"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-borders"
      }
    },
    {
      "id": "lo-opik-u18-q040",
      "unitId": "lo-opik-u18",
      "stem": "Milline valik sobib puuduvasse tabelilahtrisse?",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g017",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku idaosa piiri juures on Uurali mäestik.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Uurali mäestik"
          },
          {
            "id": "b",
            "text": "Vahemeri"
          },
          {
            "id": "c",
            "text": "Atlandi ookean"
          },
          {
            "id": "d",
            "text": "Põhja-Jäämeri"
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Suund",
          "Objekt"
        ],
        "rows": [
          [
            "lääs",
            "Atlandi ookean"
          ],
          [
            "põhi",
            "Põhja-Jäämeri"
          ],
          [
            "ida",
            "?"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u18-q041",
      "unitId": "lo-opik-u18",
      "stem": "Millisel poolkeral asub suurem osa Euroopast?",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g025",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik ütleb, et suurem osa Euroopast jääb idapoolkerale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Idapoolkeral"
          },
          {
            "id": "b",
            "text": "Lõunapoolkeral"
          },
          {
            "id": "c",
            "text": "Läänepoolkeral"
          },
          {
            "id": "d",
            "text": "Mõlemad pooled on võrdselt suured."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q042",
      "unitId": "lo-opik-u18",
      "stem": "Õige või vale? Väike osa Euroopast ulatub läänepoolkerale.",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g026",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa ulatub nullmeridiaanist mõlemale poole.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "oige",
            "text": "Õige"
          },
          {
            "id": "vale",
            "text": "Vale"
          }
        ],
        "correctOptionId": "oige",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u18-q043",
      "unitId": "lo-opik-u18",
      "stem": "Milline joon eristab ida- ja läänepoolkera?",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g027",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaan aitab eristada ida- ja läänepoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Nullmeridiaan"
          },
          {
            "id": "b",
            "text": "Ekvaator"
          },
          {
            "id": "c",
            "text": "Põhjapolaarjoon"
          },
          {
            "id": "d",
            "text": "Läänemere rannajoon"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q044",
      "unitId": "lo-opik-u18",
      "stem": "Millisel põhja-lõuna jaotuse poolkeral paikneb Euroopa?",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g028",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa asub põhjapoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Põhjapoolkeral"
          },
          {
            "id": "b",
            "text": "Lõunapoolkeral"
          },
          {
            "id": "c",
            "text": "Ainult ekvaatoril"
          },
          {
            "id": "d",
            "text": "Ainult lõunapoolusel"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q045",
      "unitId": "lo-opik-u18",
      "stem": "Kas Euroopa jääb täielikult ühele ida-lääne poolkerale?",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g026",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Suurem osa Euroopast jääb idapoolkerale, osa läänepoolkerale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Ei, Euroopa ulatub ida- ja läänepoolkerale."
          },
          {
            "id": "b",
            "text": "Jah, ainult idapoolkerale."
          },
          {
            "id": "c",
            "text": "Jah, ainult läänepoolkerale."
          },
          {
            "id": "d",
            "text": "Euroopal ei ole poolkeradega seost."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q046",
      "unitId": "lo-opik-u18",
      "stem": "Miks ei ole õige öelda, et kogu Euroopa asub idapoolkeral?",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g026",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa ulatub mõlemale poole nullmeridiaani.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Osa Euroopast paikneb nullmeridiaanist läänes."
          },
          {
            "id": "b",
            "text": "Euroopa asub hoopis lõunapoolkeral."
          },
          {
            "id": "c",
            "text": "Euroopa on täpselt ekvaatoril."
          },
          {
            "id": "d",
            "text": "Nullmeridiaan kulgeb ainult ookeanis."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q047",
      "unitId": "lo-opik-u18",
      "stem": "Ühenda kujuteldav joon ja poolkerad, mida see eristab.",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g029",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaator eristab põhja- ja lõunapoolkera, nullmeridiaan ida- ja läänepoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
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
      }
    },
    {
      "id": "lo-opik-u18-q048",
      "unitId": "lo-opik-u18",
      "stem": "Vali kõik tõesed väited Euroopa poolkerade kohta.",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g030",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa paikneb põhjapoolkeral ja ulatub nii ida- kui ka läänepoolkerale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Euroopa asub põhjapoolkeral."
          },
          {
            "id": "o2",
            "text": "Euroopa suurem osa on idapoolkeral."
          },
          {
            "id": "o3",
            "text": "Euroopa on tervenisti läänepoolkeral."
          },
          {
            "id": "o4",
            "text": "Väike osa Euroopast on läänepoolkeral."
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2",
          "o4"
        ]
      }
    },
    {
      "id": "lo-opik-u18-q049",
      "unitId": "lo-opik-u18",
      "stem": "Rühmita jooned vastavalt sellele, mida need eristavad.",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g029",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaator jagab põhja/lõuna, nullmeridiaan ida/lääs.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "ns",
            "text": "põhi/lõuna"
          },
          {
            "id": "ew",
            "text": "ida/lääs"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "ekvaator"
          },
          {
            "id": "i2",
            "text": "nullmeridiaan"
          }
        ],
        "correctGroupByItem": {
          "i1": "ns",
          "i2": "ew"
        }
      }
    },
    {
      "id": "lo-opik-u18-q050",
      "unitId": "lo-opik-u18",
      "stem": "Vaatle olukorda. Milline järeldus on õige?",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g026",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaan eristab ida- ja läänepoolkera; osa Euroopast jääb mõlemale poole.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Euroopa ulatub mõlemale poole nullmeridiaani."
          },
          {
            "id": "b",
            "text": "Kogu Euroopa on läänepoolkeral."
          },
          {
            "id": "c",
            "text": "Nullmeridiaan jagab Euroopa põhja- ja lõunaosaks."
          },
          {
            "id": "d",
            "text": "Euroopa jääb tervikuna lõunapoolkerale."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Kaardil jookseb nullmeridiaan läbi Euroopa lääneosa. Osa Euroopast on joonest idas ja väiksem osa läänes."
        ]
      }
    },
    {
      "id": "lo-opik-u18-q051",
      "unitId": "lo-opik-u18",
      "stem": "Õpilane märgib Euroopa kaardile suurema ala idapoolkeral ja väiksema läänepoolkeral. Kas tema töö on õige?",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g025",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku järgi on suurem osa Euroopast idapoolkeral ja väiksem läänepoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Jah, see vastab õpikule."
          },
          {
            "id": "b",
            "text": "Ei, kogu Euroopa jääb läänepoolkerale."
          },
          {
            "id": "c",
            "text": "Ei, Euroopa paikneb lõunapoolkeral."
          },
          {
            "id": "d",
            "text": "Ei, Euroopa paikneb ainult nullmeridiaanil."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Õpilane jagas Euroopa nullmeridiaani järgi kaheks."
        ]
      }
    },
    {
      "id": "lo-opik-u18-q052",
      "unitId": "lo-opik-u18",
      "stem": "Loe väiteid ja vali ainus õige.",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g030",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa jääb põhjapoolkerale; ida-lääne jaotuses puudutab mõlemat poolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Euroopa asub põhjapoolkeral ning ida- ja läänepoolkeral."
          },
          {
            "id": "b",
            "text": "Euroopa asub ainult lõuna- ja idapoolkeral."
          },
          {
            "id": "c",
            "text": "Euroopa asub ainult lääne- ja lõunapoolkeral."
          },
          {
            "id": "d",
            "text": "Euroopa asub vaid ekvaatoril."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q053",
      "unitId": "lo-opik-u18",
      "stem": "Milline riik on õpiku pindalalt suurte Euroopa riikide loendis?",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g031",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab pindalalt suurte riikide seas Rootsit.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Rootsi"
          },
          {
            "id": "b",
            "text": "Belgia"
          },
          {
            "id": "c",
            "text": "Luksemburg"
          },
          {
            "id": "d",
            "text": "Malta"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q054",
      "unitId": "lo-opik-u18",
      "stem": "Milline Lääne-Euroopa riik on õpiku pindalalt suurte riikide seas?",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g032",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab Prantsusmaad pindalalt suurte seas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Prantsusmaa"
          },
          {
            "id": "b",
            "text": "Belgia"
          },
          {
            "id": "c",
            "text": "Madalmaad"
          },
          {
            "id": "d",
            "text": "Luksemburg"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q055",
      "unitId": "lo-opik-u18",
      "stem": "Milline Edela-Euroopa riik kuulub õpiku pindalalt suurte hulka?",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g033",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hispaania on üks õpikus nimetatud pindalalt suurtest Euroopa riikidest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Hispaania"
          },
          {
            "id": "b",
            "text": "Andorra"
          },
          {
            "id": "c",
            "text": "Monaco"
          },
          {
            "id": "d",
            "text": "Malta"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q056",
      "unitId": "lo-opik-u18",
      "stem": "Milline Euroopa idaosas asuv riik on õpiku pindalalt suurte seas?",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g034",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ukraina on üks õpikus nimetatud suure pindalaga Euroopa riikidest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Ukraina"
          },
          {
            "id": "b",
            "text": "Luksemburg"
          },
          {
            "id": "c",
            "text": "Malta"
          },
          {
            "id": "d",
            "text": "Andorra"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q057",
      "unitId": "lo-opik-u18",
      "stem": "Milline riik ulatub nii Euroopasse kui ka Aasiasse?",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g035",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Venemaa ulatub Euroopa ja Aasia aladele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Venemaa"
          },
          {
            "id": "b",
            "text": "Island"
          },
          {
            "id": "c",
            "text": "Portugal"
          },
          {
            "id": "d",
            "text": "Iirimaa"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q058",
      "unitId": "lo-opik-u18",
      "stem": "Miks ei tähenda „pindalalt suur riik” tingimata „palju elanikke”?",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g036",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pindala ja rahvaarv on eri suurused.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Pindala mõõdab maa-ala, rahvaarv inimesi."
          },
          {
            "id": "b",
            "text": "Pindala näitab ainult pealinnade arvu."
          },
          {
            "id": "c",
            "text": "Rahvaarv mõõdab teede pikkust."
          },
          {
            "id": "d",
            "text": "Kõigis suurtes riikides on alati sama rahvaarv."
          }
        ],
        "correctOptionId": "a"
      },
      "relatedObjectiveIds": [
        "lo-opik-u18-o7"
      ]
    },
    {
      "id": "lo-opik-u18-q059",
      "unitId": "lo-opik-u18",
      "stem": "Vali kõik õpiku pindalalt suurte Euroopa riikide näited.",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g037",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku loendis on Venemaa, Ukraina, Prantsusmaa, Hispaania ja Rootsi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Venemaa"
          },
          {
            "id": "o2",
            "text": "Ukraina"
          },
          {
            "id": "o3",
            "text": "Prantsusmaa"
          },
          {
            "id": "o4",
            "text": "Rootsi"
          },
          {
            "id": "o5",
            "text": "Belgia"
          },
          {
            "id": "o6",
            "text": "Malta"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2",
          "o3",
          "o4"
        ]
      }
    },
    {
      "id": "lo-opik-u18-q060",
      "unitId": "lo-opik-u18",
      "stem": "Ühenda õpikus nimetatud pindalalt suur riik ja selle asukoht.",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g038",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Need neli asukohta on toodud lugemismaterjalis.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Hispaania"
          },
          {
            "id": "p2",
            "text": "Rootsi"
          },
          {
            "id": "p3",
            "text": "Ukraina"
          },
          {
            "id": "p4",
            "text": "Prantsusmaa"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Euroopa edelaosa"
          },
          {
            "id": "c2",
            "text": "Põhja-Euroopa"
          },
          {
            "id": "c3",
            "text": "Euroopa idaosa"
          },
          {
            "id": "c4",
            "text": "Lääne-Euroopa"
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
      "id": "lo-opik-u18-q061",
      "unitId": "lo-opik-u18",
      "stem": "Milline väide Venemaa kohta aitab mõista Euroopa kaarti?",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g035",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Venemaa ulatub Euraasia mõlemasse maailmajakku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Venemaa ulatub nii Euroopasse kui Aasiasse."
          },
          {
            "id": "b",
            "text": "Venemaa on ainult Euroopa lääneosas."
          },
          {
            "id": "c",
            "text": "Venemaa on Aafrika saar."
          },
          {
            "id": "d",
            "text": "Venemaa on Vahemeri."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q062",
      "unitId": "lo-opik-u18",
      "stem": "Rühmita: õpiku pindala näidete loend või mitte.",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g037",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rootsi, Hispaania ja Ukraina kuuluvad õpiku viie pindala näite hulka.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "yes",
            "text": "õpiku pindala näidete loendis"
          },
          {
            "id": "no",
            "text": "selles viie riigi loendis ei ole"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Rootsi"
          },
          {
            "id": "i2",
            "text": "Hispaania"
          },
          {
            "id": "i3",
            "text": "Ukraina"
          },
          {
            "id": "i4",
            "text": "Belgia"
          },
          {
            "id": "i5",
            "text": "Malta"
          }
        ],
        "correctGroupByItem": {
          "i1": "yes",
          "i2": "yes",
          "i3": "yes",
          "i4": "no",
          "i5": "no"
        }
      }
    },
    {
      "id": "lo-opik-u18-q063",
      "unitId": "lo-opik-u18",
      "stem": "Leia Euroopa kaardilt Rootsi.",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g031",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rootsi asub Euroopa põhjaosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-area",
        "correctRegionId": "sweden"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-area"
      }
    },
    {
      "id": "lo-opik-u18-q064",
      "unitId": "lo-opik-u18",
      "stem": "Leia Euroopa kaardilt Hispaania.",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g033",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hispaania on Euroopa edelaosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-area",
        "correctRegionId": "spain"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-area"
      }
    },
    {
      "id": "lo-opik-u18-q065",
      "unitId": "lo-opik-u18",
      "stem": "Leia Euroopa kaardilt Ukraina.",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g034",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ukraina asub Euroopa idaosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-area",
        "correctRegionId": "ukraine"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-area"
      }
    },
    {
      "id": "lo-opik-u18-q066",
      "unitId": "lo-opik-u18",
      "stem": "Leia Euroopa kaardilt Prantsusmaa.",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g032",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Prantsusmaa on Lääne-Euroopas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-area",
        "correctRegionId": "france"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-area"
      }
    },
    {
      "id": "lo-opik-u18-q067",
      "unitId": "lo-opik-u18",
      "stem": "Leia Euroopa-vaatega kaardilt Venemaa.",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g039",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Venemaa ulatub ka Euroopa idaossa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-area",
        "correctRegionId": "russia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-area"
      }
    },
    {
      "id": "lo-opik-u18-q068",
      "unitId": "lo-opik-u18",
      "stem": "Milline riik jääb õpiku loendis oleva Rootsi suhtes rohkem lõunasse?",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g038",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hispaania on Euroopa edelaosas ja Rootsi põhjaosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Hispaania"
          },
          {
            "id": "b",
            "text": "Soome"
          },
          {
            "id": "c",
            "text": "Norra"
          },
          {
            "id": "d",
            "text": "Island"
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Võrdle õpiku pindalalt suurte riikide asukohti Euroopa kaardil."
        ]
      }
    },
    {
      "id": "lo-opik-u18-q069",
      "unitId": "lo-opik-u18",
      "stem": "Milline riik on õpiku rahvaarvult suurte Euroopa riikide loendis?",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g040",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab Saksamaad rahvaarvult suurte seas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Saksamaa"
          },
          {
            "id": "b",
            "text": "Monaco"
          },
          {
            "id": "c",
            "text": "Malta"
          },
          {
            "id": "d",
            "text": "Andorra"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q070",
      "unitId": "lo-opik-u18",
      "stem": "Millist saartel paiknevat riiki nimetab õpik suure rahvaarvuga Euroopa riigina?",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g041",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab Ühendkuningriiki rahvaarvult suurte riikide seas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Ühendkuningriiki"
          },
          {
            "id": "b",
            "text": "Islandit"
          },
          {
            "id": "c",
            "text": "Maltat"
          },
          {
            "id": "d",
            "text": "Küprost"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q071",
      "unitId": "lo-opik-u18",
      "stem": "Milline Lõuna-Euroopa riik on õpikus rahvaarvult suurte seas?",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g042",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Itaalia on õpiku suurte rahvaarvude loendis.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Itaalia"
          },
          {
            "id": "b",
            "text": "Malta"
          },
          {
            "id": "c",
            "text": "San Marino"
          },
          {
            "id": "d",
            "text": "Monaco"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q072",
      "unitId": "lo-opik-u18",
      "stem": "Milline riik kuulub õpiku nii pindala kui ka rahvaarvu näidete loendisse?",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g043",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Prantsusmaa on mõlemas õpiku loendis.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Prantsusmaa"
          },
          {
            "id": "b",
            "text": "Belgia"
          },
          {
            "id": "c",
            "text": "Andorra"
          },
          {
            "id": "d",
            "text": "Malta"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q073",
      "unitId": "lo-opik-u18",
      "stem": "Õige või vale? Õpik nimetab Venemaad ka rahvaarvult suurte Euroopa riikide seas.",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g044",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Venemaa on õpikus nii suure pindalaga kui suure rahvaarvuga riikide näidete seas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "oige",
            "text": "Õige"
          },
          {
            "id": "vale",
            "text": "Vale"
          }
        ],
        "correctOptionId": "oige",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u18-q074",
      "unitId": "lo-opik-u18",
      "stem": "Vali kõik õpiku rahvaarvult suurte Euroopa riikide näited.",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g045",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku rahvaarvu loendis on Venemaa, Saksamaa, Ühendkuningriik, Prantsusmaa ja Itaalia.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Venemaa"
          },
          {
            "id": "o2",
            "text": "Saksamaa"
          },
          {
            "id": "o3",
            "text": "Ühendkuningriik"
          },
          {
            "id": "o4",
            "text": "Itaalia"
          },
          {
            "id": "o5",
            "text": "Malta"
          },
          {
            "id": "o6",
            "text": "Island"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2",
          "o3",
          "o4"
        ]
      }
    },
    {
      "id": "lo-opik-u18-q075",
      "unitId": "lo-opik-u18",
      "stem": "Ühenda õpikus nimetatud suure rahvaarvuga riik ja tuntud asukohavihje.",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g046",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nii saad suured rahvaarvu näited kaardil asukohtadega seostada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Saksamaa"
          },
          {
            "id": "p2",
            "text": "Ühendkuningriik"
          },
          {
            "id": "p3",
            "text": "Itaalia"
          },
          {
            "id": "p4",
            "text": "Venemaa"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Euroopa keskosas"
          },
          {
            "id": "c2",
            "text": "saartel Euroopa lääneosas"
          },
          {
            "id": "c3",
            "text": "Euroopa lõunaosas"
          },
          {
            "id": "c4",
            "text": "ulatub ka Aasiasse"
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
      "id": "lo-opik-u18-q076",
      "unitId": "lo-opik-u18",
      "stem": "Milline väide riikide loendite kohta on õige?",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g036",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Suure pindalaga riigil ei pruugi olla kõige rohkem elanikke.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Rahvaarvult ja pindalalt suurte riikide näited ei ole täpselt samad."
          },
          {
            "id": "b",
            "text": "Kõigi Euroopa riikide pindala ja rahvaarv on võrdsed."
          },
          {
            "id": "c",
            "text": "Rootsi asub kõigil kaartidel Lõuna-Ameerikas."
          },
          {
            "id": "d",
            "text": "Pindala näitab mitu inimest riigis elab."
          }
        ],
        "correctOptionId": "a"
      },
      "relatedObjectiveIds": [
        "lo-opik-u18-o7"
      ]
    },
    {
      "id": "lo-opik-u18-q077",
      "unitId": "lo-opik-u18",
      "stem": "Rühmita õpiku näited: kas riik esineb rahvaarvu viie näite hulgas?",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g045",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku viie rahvaarvult suure riigi seas on Saksamaa, Itaalia ja Ühendkuningriik.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "yes",
            "text": "rahvaarvu loendis"
          },
          {
            "id": "no",
            "text": "selles viie riigi loendis ei ole"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Saksamaa"
          },
          {
            "id": "i2",
            "text": "Itaalia"
          },
          {
            "id": "i3",
            "text": "Ühendkuningriik"
          },
          {
            "id": "i4",
            "text": "Rootsi"
          },
          {
            "id": "i5",
            "text": "Hispaania"
          }
        ],
        "correctGroupByItem": {
          "i1": "yes",
          "i2": "yes",
          "i3": "yes",
          "i4": "no",
          "i5": "no"
        }
      }
    },
    {
      "id": "lo-opik-u18-q078",
      "unitId": "lo-opik-u18",
      "stem": "Miks ei pea suure pindalaga Rootsi olema ka õpiku viie kõige suurema rahvaarvuga riigi seas?",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g036",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigi pindala ei määra üksinda rahvaarvu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Suur maa-ala ja suur rahvaarv on eri tunnused."
          },
          {
            "id": "b",
            "text": "Kõigis Euroopa riikides on ühepalju inimesi."
          },
          {
            "id": "c",
            "text": "Rootsi ei asu Euroopas."
          },
          {
            "id": "d",
            "text": "Rahvaarv tähendab riigi rannajoone pikkust."
          }
        ],
        "correctOptionId": "a"
      },
      "relatedObjectiveIds": [
        "lo-opik-u18-o7"
      ]
    },
    {
      "id": "lo-opik-u18-q079",
      "unitId": "lo-opik-u18",
      "stem": "Leia Euroopa kaardilt Saksamaa.",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g040",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Saksamaa asub Euroopa keskosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-population",
        "correctRegionId": "germany"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-population"
      }
    },
    {
      "id": "lo-opik-u18-q080",
      "unitId": "lo-opik-u18",
      "stem": "Leia Euroopa kaardilt Ühendkuningriik.",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g041",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ühendkuningriik asub saartel Euroopa lääneosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-population",
        "correctRegionId": "uk"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-population"
      }
    },
    {
      "id": "lo-opik-u18-q081",
      "unitId": "lo-opik-u18",
      "stem": "Leia Euroopa kaardilt Itaalia.",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g042",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Itaalia paikneb Euroopa lõunaosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-population",
        "correctRegionId": "italy"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-population"
      }
    },
    {
      "id": "lo-opik-u18-q082",
      "unitId": "lo-opik-u18",
      "stem": "Leia rahvaarvu kaardilt Prantsusmaa.",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g032",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Prantsusmaa paikneb Lääne-Euroopas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-population",
        "correctRegionId": "france"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-population"
      }
    },
    {
      "id": "lo-opik-u18-q083",
      "unitId": "lo-opik-u18",
      "stem": "Leia Euroopa kaardilt Venemaa.",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g044",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Venemaa ulatub Euroopa idaossa ja kaugemale Aasiasse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-population",
        "correctRegionId": "russia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-population"
      }
    },
    {
      "id": "lo-opik-u18-q084",
      "unitId": "lo-opik-u18",
      "stem": "Millised kaks riiki kuuluvad mõlemasse õpiku suurte riikide näidete loendisse?",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g043",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõlemas õpiku loendis on Venemaa ja Prantsusmaa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Prantsusmaa"
          },
          {
            "id": "o2",
            "text": "Venemaa"
          },
          {
            "id": "o3",
            "text": "Rootsi"
          },
          {
            "id": "o4",
            "text": "Ühendkuningriik"
          },
          {
            "id": "o5",
            "text": "Saksamaa"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2"
        ]
      }
    },
    {
      "id": "lo-opik-u18-q085",
      "unitId": "lo-opik-u18",
      "stem": "Mida näitab riigi pindala?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g047",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pindala väljendab maa-ala suurust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kui suure maa-ala riik hõlmab."
          },
          {
            "id": "b",
            "text": "Mitu inimest riigis elab."
          },
          {
            "id": "c",
            "text": "Mitu tähte riigi nimes on."
          },
          {
            "id": "d",
            "text": "Kui kõrged on mäed."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q086",
      "unitId": "lo-opik-u18",
      "stem": "Mida näitab riigi rahvaarv?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g048",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rahvaarv väljendab riigis elavate inimeste arvu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kui palju inimesi riigis elab."
          },
          {
            "id": "b",
            "text": "Kui suur on maa-ala ruutkilomeetrites."
          },
          {
            "id": "c",
            "text": "Kui palju riigil on saari."
          },
          {
            "id": "d",
            "text": "Kui kaugel asub riik merest."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q087",
      "unitId": "lo-opik-u18",
      "stem": "Mida tähendab rahvastikutihedus?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g049",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rahvastikutihedus näitab, kui palju inimesi elab ühel ruutkilomeetril.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Inimeste arvu maa-ala ühe ruutkilomeetri kohta."
          },
          {
            "id": "b",
            "text": "Riigi kogupindala."
          },
          {
            "id": "c",
            "text": "Riigi pealinnade arvu."
          },
          {
            "id": "d",
            "text": "Riigi lipu värvide arvu."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q088",
      "unitId": "lo-opik-u18",
      "stem": "Millise mõõtühikuga väljendatakse sageli riigi pindala?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g050",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigi pindala väljendatakse sageli ruutkilomeetrites.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "ruutkilomeeter (km²)"
          },
          {
            "id": "b",
            "text": "miljon inimest"
          },
          {
            "id": "c",
            "text": "meeter sekundis"
          },
          {
            "id": "d",
            "text": "kraadi Celsiuse järgi"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q089",
      "unitId": "lo-opik-u18",
      "stem": "Õige või vale? Pindala ja rahvaarv tähendavad täpselt sama.",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g036",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pindala mõõdab maa-ala; rahvaarv loendab inimesi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "oige",
            "text": "Õige"
          },
          {
            "id": "vale",
            "text": "Vale"
          }
        ],
        "correctOptionId": "vale",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u18-q090",
      "unitId": "lo-opik-u18",
      "stem": "Mida tuleb võrrelda, kui küsitakse, millises riigis elab rohkem inimesi kokku?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g048",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Inimeste koguarvu näitab rahvaarv.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Rahvaarvu."
          },
          {
            "id": "b",
            "text": "Ainult pindala."
          },
          {
            "id": "c",
            "text": "Riigi lipu värve."
          },
          {
            "id": "d",
            "text": "Ainult rannajoont."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q091",
      "unitId": "lo-opik-u18",
      "stem": "Mis võib juhtuda kahe sama suure maa-alaga, kui ühel elab rohkem inimesi?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g051",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sama pindala puhul tähendab suurem rahvaarv suuremat asustustihedust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Seal on rahvastikutihedus suurem."
          },
          {
            "id": "b",
            "text": "Seal on alati vähem elanikke."
          },
          {
            "id": "c",
            "text": "Seal on automaatselt suurem pindala."
          },
          {
            "id": "d",
            "text": "Nende rahvastikutihedus on alati võrdne."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q092",
      "unitId": "lo-opik-u18",
      "stem": "Ühenda mõiste ja tähendus.",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g052",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pindala, rahvaarv ja rahvastikutihedus mõõdavad eri asju.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "pindala"
          },
          {
            "id": "p2",
            "text": "rahvaarv"
          },
          {
            "id": "p3",
            "text": "rahvastikutihedus"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "maa-ala suurus"
          },
          {
            "id": "c2",
            "text": "inimeste koguarv"
          },
          {
            "id": "c3",
            "text": "inimeste arv km² kohta"
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
      "id": "lo-opik-u18-q093",
      "unitId": "lo-opik-u18",
      "stem": "Rühmita väited: pindala või rahvaarv?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g053",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ruutkilomeetrid mõõdavad pindala, inimeste arv mõõdab rahvaarvu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "a",
            "text": "pindala"
          },
          {
            "id": "p",
            "text": "rahvaarv"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "500 km²"
          },
          {
            "id": "i2",
            "text": "40 km²"
          },
          {
            "id": "i3",
            "text": "80 000 elanikku"
          },
          {
            "id": "i4",
            "text": "10 000 inimest"
          }
        ],
        "correctGroupByItem": {
          "i1": "a",
          "i2": "a",
          "i3": "p",
          "i4": "p"
        }
      }
    },
    {
      "id": "lo-opik-u18-q094",
      "unitId": "lo-opik-u18",
      "stem": "Vali kõik sobivad väited rahvastikutiheduse kohta.",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g051",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rahvastikutihedus seob elanike arvu pindalaga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Võrdleb inimeste arvu maa-alaga."
          },
          {
            "id": "o2",
            "text": "Sama pindala korral on rohkemate elanikega kohas suurem tihedus."
          },
          {
            "id": "o3",
            "text": "Näitab ainult riigi piiri pikkust."
          },
          {
            "id": "o4",
            "text": "Tähendab alati sama mis kogurahvaarv."
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2"
        ]
      }
    },
    {
      "id": "lo-opik-u18-q095",
      "unitId": "lo-opik-u18",
      "stem": "Vaata näidet. Millises piirkonnas on kõige tihedam asustus?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g054",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meris on sama pindala kohta kõige rohkem inimesi: 30 inimest/km².",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Meris."
          },
          {
            "id": "b",
            "text": "Kases."
          },
          {
            "id": "c",
            "text": "Mäes."
          },
          {
            "id": "d",
            "text": "Kõigis on sama tihedus."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Näitepiirkond",
          "Pindala",
          "Elanikke"
        ],
        "rows": [
          [
            "Kask",
            "10 km²",
            "100"
          ],
          [
            "Meri",
            "10 km²",
            "300"
          ],
          [
            "Mägi",
            "10 km²",
            "50"
          ]
        ],
        "caption": "Väljamõeldud õppimisnäide, mitte Euroopa riikide andmed."
      }
    },
    {
      "id": "lo-opik-u18-q096",
      "unitId": "lo-opik-u18",
      "stem": "Vaata näidet. Millises piirkonnas elab kokku kõige vähem inimesi?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g054",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Näitepiirkonnas Mägi elab 50 inimest; see on kõige väiksem rahvaarv.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Mäes."
          },
          {
            "id": "b",
            "text": "Kases."
          },
          {
            "id": "c",
            "text": "Meris."
          },
          {
            "id": "d",
            "text": "Kõigis võrdselt."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Näitepiirkond",
          "Pindala",
          "Elanikke"
        ],
        "rows": [
          [
            "Kask",
            "10 km²",
            "100"
          ],
          [
            "Meri",
            "10 km²",
            "300"
          ],
          [
            "Mägi",
            "10 km²",
            "50"
          ]
        ],
        "caption": "Näiteandmed."
      }
    },
    {
      "id": "lo-opik-u18-q097",
      "unitId": "lo-opik-u18",
      "stem": "Vaata tabelit. Millise paari pindalad on võrdsed?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g055",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Piirkondadel A ja B on mõlemal 20 km² pindala.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Piirkonnad A ja B."
          },
          {
            "id": "b",
            "text": "Piirkonnad A ja C."
          },
          {
            "id": "c",
            "text": "Piirkonnad B ja C."
          },
          {
            "id": "d",
            "text": "Ühelgi pole võrdne pindala."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Näitepiirkond",
          "Pindala",
          "Elanikke"
        ],
        "rows": [
          [
            "A",
            "20 km²",
            "150"
          ],
          [
            "B",
            "20 km²",
            "250"
          ],
          [
            "C",
            "10 km²",
            "300"
          ]
        ],
        "caption": "Näiteandmed, mitte päris riigid."
      }
    },
    {
      "id": "lo-opik-u18-q098",
      "unitId": "lo-opik-u18",
      "stem": "Järjesta näitepiirkonnad rahvaarvu järgi väiksemast suuremani.",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g054",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Näiteandmed: Mägi 50, Kask 100 ja Meri 300 elanikku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Mägi"
          },
          {
            "id": "i2",
            "text": "Kask"
          },
          {
            "id": "i3",
            "text": "Meri"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Väikseim",
        "lastLabel": "Suurim"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Näitepiirkond",
          "Elanikke"
        ],
        "rows": [
          [
            "Kask",
            "100"
          ],
          [
            "Meri",
            "300"
          ],
          [
            "Mägi",
            "50"
          ]
        ],
        "caption": "Näiteandmed."
      }
    },
    {
      "id": "lo-opik-u18-q099",
      "unitId": "lo-opik-u18",
      "stem": "Kaardil on piirkond A 10 km² ja 50 elanikku, piirkond B 10 km² ja 150 elanikku. Kus elab ühe km² kohta rohkem inimesi?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g051",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sama pindala puhul elab piirkonnas B rohkem inimesi, seega on tihedus suurem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Piirkonnas B."
          },
          {
            "id": "b",
            "text": "Piirkonnas A."
          },
          {
            "id": "c",
            "text": "Mõlemas võrdselt."
          },
          {
            "id": "d",
            "text": "Ei saa võrrelda, sest pindalad on võrdsed."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Need on väljamõeldud näitepiirkonnad, mitte päris Euroopa riigid."
        ]
      }
    },
    {
      "id": "lo-opik-u18-q100",
      "unitId": "lo-opik-u18",
      "stem": "Mis aitab kaardi värvidest aru saada?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g056",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Legend selgitab kaardil kasutatud värve ja sümboleid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Legend"
          },
          {
            "id": "b",
            "text": "Riigi hümn"
          },
          {
            "id": "c",
            "text": "Kaardi paberi paksus"
          },
          {
            "id": "d",
            "text": "Pealinna vanus"
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q101",
      "unitId": "lo-opik-u18",
      "stem": "Mida tähistab õpiku 69. lehekülje kaardil värvitud riik?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g057",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku kaardi legend ütleb, et värv näitab kümmet pindalalt suurimat riiki.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Üht kaardil pindalalt kümne suurima hulka arvatud riiki."
          },
          {
            "id": "b",
            "text": "Mõnd riiki, kus ei ela inimesi."
          },
          {
            "id": "c",
            "text": "Mõnd üksnes Euroopa Liidu riiki."
          },
          {
            "id": "d",
            "text": "Kõige kõrgema mäega riiki."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q102",
      "unitId": "lo-opik-u18",
      "stem": "Mida näitab õpiku kaardil riigi juures ringis olev arv?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g058",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku kaardil tähistavad ringidega arvud miljonites inimestes rahvaarvu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Rahvaarvu miljonites inimestes."
          },
          {
            "id": "b",
            "text": "Mäe kõrgust meetrites."
          },
          {
            "id": "c",
            "text": "Riigi pindala km²."
          },
          {
            "id": "d",
            "text": "Autoteede arvu."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q103",
      "unitId": "lo-opik-u18",
      "stem": "Mida näitab rahvastikutiheduse kaart?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g059",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku rahvastikutiheduse kaart näitab inimeste paiknemise tihedust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kus inimesed elavad tihedamalt ja kus hõredamalt."
          },
          {
            "id": "b",
            "text": "Kui palju on igas riigis puid."
          },
          {
            "id": "c",
            "text": "Kus on Euroopa ja Aasia kokkuleppeline piir."
          },
          {
            "id": "d",
            "text": "Milline riik on pikim."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q104",
      "unitId": "lo-opik-u18",
      "stem": "Millest alustada, kui kaardil on eri värvid ja tähised?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g060",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Alusta pealkirjast ja legendist, et teada, mida kaart kujutab.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Pealkirja ja legendi lugemisest."
          },
          {
            "id": "b",
            "text": "Arvude juhuslikust liitmisest."
          },
          {
            "id": "c",
            "text": "Kaardi tagurpidi pööramisest."
          },
          {
            "id": "d",
            "text": "Kõigi riikide tähtede loendamisest."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q105",
      "unitId": "lo-opik-u18",
      "stem": "Miks ei tohi arvata, et igal kaardil tähendab tume värv rahvastikutihedust?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g056",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardil kasutatavaid värve tuleb tõlgendada konkreetse legendi järgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Värvi tähendus sõltub iga kaardi legendist."
          },
          {
            "id": "b",
            "text": "Tume värv tähendab alati sõda."
          },
          {
            "id": "c",
            "text": "Värvidel ei ole kaartidel kunagi tähendust."
          },
          {
            "id": "d",
            "text": "Kõik Euroopa kaardid näitavad samu numbreid."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q106",
      "unitId": "lo-opik-u18",
      "stem": "Kuidas erinevad Euroopa pindala ja rahvastikutiheduse kaardid?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g061",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi teema määrab, milliseid andmeid ta näitab.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Üks näitab maa-alade suurusega seotud teavet, teine asustuse tihedust."
          },
          {
            "id": "b",
            "text": "Mõlemad näitavad ainult lippe."
          },
          {
            "id": "c",
            "text": "Mõlemad näitavad ainult pealinnade kellaaegu."
          },
          {
            "id": "d",
            "text": "Teine kaart on alati tagurpidi."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q107",
      "unitId": "lo-opik-u18",
      "stem": "Ühenda kaardi tähis ja selle selgitus.",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g062",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi tähistest saab õigesti aru legendi abil.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "legend"
          },
          {
            "id": "p2",
            "text": "ringis arv õpiku kaardil"
          },
          {
            "id": "p3",
            "text": "oranž värv õpiku kaardil"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "selgitab sümboleid ja värve"
          },
          {
            "id": "c2",
            "text": "rahvaarv miljonites"
          },
          {
            "id": "c3",
            "text": "pindalalt kümne suurima hulka arvatud riik"
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
      "id": "lo-opik-u18-q108",
      "unitId": "lo-opik-u18",
      "stem": "Vali kõik õiged juhised kaardi lugemiseks.",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g060",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaarti tuleb lugeda pealkirja, legendi ja konkreetse koha järgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Vaata kaardi pealkirja."
          },
          {
            "id": "o2",
            "text": "Loe legendi."
          },
          {
            "id": "o3",
            "text": "Otsi küsimuses mainitud koht üles."
          },
          {
            "id": "o4",
            "text": "Eelda, et iga kaart kasutab samu värve."
          },
          {
            "id": "o5",
            "text": "Eelda, et õpiku rahvaarvud ei muutu."
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2",
          "o3"
        ]
      }
    },
    {
      "id": "lo-opik-u18-q109",
      "unitId": "lo-opik-u18",
      "stem": "Rühmita sümbolid: millist teavet need õpiku Euroopa kaardil väljendavad?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g062",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku kaardil näitab toon pindalalt suuri riike ning ringis arv rahvaarvu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "p",
            "text": "pindala"
          },
          {
            "id": "r",
            "text": "rahvaarv"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "oranžiga esile tõstetud riik"
          },
          {
            "id": "i2",
            "text": "ring arvuga 84"
          },
          {
            "id": "i3",
            "text": "ring arvuga 65"
          },
          {
            "id": "i4",
            "text": "pindalalt suurte riikide värvitoon"
          }
        ],
        "correctGroupByItem": {
          "i1": "p",
          "i2": "r",
          "i3": "r",
          "i4": "p"
        }
      }
    },
    {
      "id": "lo-opik-u18-q110",
      "unitId": "lo-opik-u18",
      "stem": "Mida saad järeldada kaardilt, kus riik on oranžiks värvitud, aga tema juures ringis numbrit pole?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g057",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Värv ja ring annavad eri teavet; ringi puudumine ei tõenda elanike puudumist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Ta kuulub kaardi pindala esile tõstetud riikide hulka; rahvaarv ei pruugi olla kaardile kirjutatud."
          },
          {
            "id": "b",
            "text": "Riigis ei ela kindlasti ühtegi inimest."
          },
          {
            "id": "c",
            "text": "Riik on kindlasti Euroopa Liidust väljas."
          },
          {
            "id": "d",
            "text": "Riigil pole üldse pindala."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q111",
      "unitId": "lo-opik-u18",
      "stem": "Järjesta sammud, kuidas õpiku Euroopa kaardilt vastust otsida.",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g060",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Selline järjekord väldib tähiste valesti mõistmist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Vaata kaardi pealkirja."
          },
          {
            "id": "i2",
            "text": "Loe legendi tähendusi."
          },
          {
            "id": "i3",
            "text": "Otsi õige riik kaardilt."
          },
          {
            "id": "i4",
            "text": "Tõlgenda selle värvi või tähist."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ],
        "firstLabel": "Esimene",
        "lastLabel": "Viimane"
      }
    },
    {
      "id": "lo-opik-u18-q112",
      "unitId": "lo-opik-u18",
      "stem": "Vaata näitlikku legendi. Mida tähendab sellel kaardil tume värv?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g059",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Selles näites selgitab legend, et tume värv tähistab tihedamat asustust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Tihedam asustus."
          },
          {
            "id": "b",
            "text": "Kõige väiksem pindala."
          },
          {
            "id": "c",
            "text": "Kindlasti suurim kogurahvaarv."
          },
          {
            "id": "d",
            "text": "Riigi pealinna asukoht."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Õppimiseks koostatud rahvastikutiheduse kaardi legend: tume toon = tihe asustus; hele toon = hõre asustus."
        ]
      }
    },
    {
      "id": "lo-opik-u18-q113",
      "unitId": "lo-opik-u18",
      "stem": "Mida tähendab sellel õpiku kaardil ringis olev arv 84?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g058",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku kaardil näitavad ringis arvud rahvaarvu miljonites; see ei ole tänapäeva ajakohastatud rahvaarv.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Ligikaudu 84 miljonit elanikku õpiku kaardi koostamise ajal."
          },
          {
            "id": "b",
            "text": "84 km² pindala."
          },
          {
            "id": "c",
            "text": "84 pealinna."
          },
          {
            "id": "d",
            "text": "84 kilomeetrit rannajoont."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Õpiku 69. lehekülje legend: ringis olev arv näitab miljonit inimest."
        ]
      }
    },
    {
      "id": "lo-opik-u18-q114",
      "unitId": "lo-opik-u18",
      "stem": "Näitekaardi pealkiri on „Euroopa rahvastikutihedus”. Mida on sellest kõige mõistlikum uurida?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g059",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rahvastikutiheduse kaart aitab võrrelda asustuse tihedust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Millistes piirkondades elatakse tihedamalt."
          },
          {
            "id": "b",
            "text": "Milline meri on kõige sügavam."
          },
          {
            "id": "c",
            "text": "Milline riik on oma pindalalt maailma suurim."
          },
          {
            "id": "d",
            "text": "Mis värvi on riikide lipud."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q115",
      "unitId": "lo-opik-u18",
      "stem": "Võrdle tabelit. Mis andmed aitavad otsustada, kummas näiteriigis elab rohkem inimesi kokku?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g063",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Elanike koguarvu võrdlemiseks on vaja rahvaarvu andmeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Rahvaarvu veerg."
          },
          {
            "id": "b",
            "text": "Pindala veerg üksinda."
          },
          {
            "id": "c",
            "text": "Riikide nime tähtede arv."
          },
          {
            "id": "d",
            "text": "Tabeli esimese veeru värv."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Näiteriik",
          "Pindala",
          "Rahvaarv"
        ],
        "rows": [
          [
            "Meri",
            "100 km²",
            "300"
          ],
          [
            "Kask",
            "200 km²",
            "150"
          ]
        ],
        "caption": "Väljamõeldud näiteandmed."
      }
    },
    {
      "id": "lo-opik-u18-q116",
      "unitId": "lo-opik-u18",
      "stem": "Mida näitab pindalalt suurte riikide kaart, mida rahvastikutiheduse kaart iseenesest ei näita?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g061",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pindala kaart toob esile maa-ala suuruse; rahvastikutiheduse kaart inimeste paiknemise.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Millised riigid on pindala poolest esile tõstetud."
          },
          {
            "id": "b",
            "text": "Kui palju inimesi elab igal km²-l."
          },
          {
            "id": "c",
            "text": "Millisel alal on suurem asustustihedus."
          },
          {
            "id": "d",
            "text": "Millistes linnades on rohkem õpilasi."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q117",
      "unitId": "lo-opik-u18",
      "stem": "Milline riik asub Euroopa edelaosas ja on õpiku pindala näidete seas?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g033",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hispaania paikneb Euroopa edelaosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Hispaania"
          },
          {
            "id": "b",
            "text": "Rootsi"
          },
          {
            "id": "c",
            "text": "Ukraina"
          },
          {
            "id": "d",
            "text": "Venemaa"
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-area"
      },
      "relatedObjectiveIds": [
        "lo-opik-u18-o5"
      ]
    },
    {
      "id": "lo-opik-u18-q118",
      "unitId": "lo-opik-u18",
      "stem": "Milline rahvaarvu näidete hulka kuuluv riik asub Euroopa lõunaosas?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g042",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Itaalia asub Euroopa lõunaosas ja on õpiku rahvaarvu näidete seas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Itaalia"
          },
          {
            "id": "b",
            "text": "Venemaa"
          },
          {
            "id": "c",
            "text": "Ühendkuningriik"
          },
          {
            "id": "d",
            "text": "Saksamaa"
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-population"
      },
      "relatedObjectiveIds": [
        "lo-opik-u18-o6"
      ]
    },
    {
      "id": "lo-opik-u18-q119",
      "unitId": "lo-opik-u18",
      "stem": "Miks ei saa õpiku vanalt kaardilt võetud rahvaarvu pidada alati tänapäeval täpseks?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g064",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rahvaarv ei püsi ajas muutumatuna; õpiku arvud kirjeldavad avaldamisaegseid hinnanguid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Rahvaarv muutub aja jooksul."
          },
          {
            "id": "b",
            "text": "Kaardil pole kunagi ühtegi arvu."
          },
          {
            "id": "c",
            "text": "Kõik inimesed kolivad samal päeval."
          },
          {
            "id": "d",
            "text": "Iga riigi pindala muutub iga nädal."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q120",
      "unitId": "lo-opik-u18",
      "stem": "Leia maailmakaardi jooniselt Aasia maailmajao ligikaudne asukoht.",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g065",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aasia paikneb Euraasia idaosas, Euroopa idapoolse naabrina.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-world",
        "correctRegionId": "asia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-world"
      }
    },
    {
      "id": "lo-opik-u18-q121",
      "unitId": "lo-opik-u18",
      "stem": "Leia maailmakaardi jooniselt Aafrika asukoht.",
      "primaryObjectiveId": "lo-opik-u18-o1",
      "variantGroupId": "lo-opik-u18-g066",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aafrika asub Euroopast lõuna pool, Vahemere taga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u18-europe-world",
        "correctRegionId": "africa"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u18-europe-world"
      }
    },
    {
      "id": "lo-opik-u18-q122",
      "unitId": "lo-opik-u18",
      "stem": "Järjesta Euroopa paiknemise järgi põhjast lõunasse: kõigepealt vesi, siis maailmajagu ja siis vesi.",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g067",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja-Jäämeri asub Euroopa põhja pool ja Vahemeri lõuna pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "i2",
            "text": "Euroopa"
          },
          {
            "id": "i3",
            "text": "Vahemeri"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Põhjas",
        "lastLabel": "Lõunas"
      }
    },
    {
      "id": "lo-opik-u18-q123",
      "unitId": "lo-opik-u18",
      "stem": "Järjesta Euroopa piiride uurimise näited läänest itta.",
      "primaryObjectiveId": "lo-opik-u18-o2",
      "variantGroupId": "lo-opik-u18-g068",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean piirab Euroopat läänest, Uuralid on idapiiri juures.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Atlandi ookean"
          },
          {
            "id": "i2",
            "text": "Euroopa maismaa"
          },
          {
            "id": "i3",
            "text": "Uurali mäestik"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Läänes",
        "lastLabel": "Idas"
      },
      "relatedObjectiveIds": [
        "lo-opik-u18-o3"
      ]
    },
    {
      "id": "lo-opik-u18-q124",
      "unitId": "lo-opik-u18",
      "stem": "Mis eristab õpiku käsitluses Uurali mäestikku Mustast ja Kaspia merest?",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g069",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Uuralid on mäestik, Must ja Kaspia meri on veekogud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Uuralid on mäestik; ülejäänud kaks on veekogud."
          },
          {
            "id": "b",
            "text": "Uuralid on meri ja ülejäänud kaks mäed."
          },
          {
            "id": "c",
            "text": "Kõik kolm on Euroopa pealinnad."
          },
          {
            "id": "d",
            "text": "Kõik kolm asuvad Ameerikas."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q125",
      "unitId": "lo-opik-u18",
      "stem": "Järjesta nimetatud objektid läänest itta.",
      "primaryObjectiveId": "lo-opik-u18-o3",
      "variantGroupId": "lo-opik-u18-g070",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean on Euroopast läänes, Must meri kagus ja Kaspia meri Mustast merest ida pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Atlandi ookean"
          },
          {
            "id": "i2",
            "text": "Must meri"
          },
          {
            "id": "i3",
            "text": "Kaspia meri"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Läänes",
        "lastLabel": "Idas"
      }
    },
    {
      "id": "lo-opik-u18-q126",
      "unitId": "lo-opik-u18",
      "stem": "Miks ei ole ekvaator ja nullmeridiaan sama joon?",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g071",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Need on kaks erinevat poolkerade jaotamise kujuteldavat joont.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Ekvaator eristab põhja ja lõunat, nullmeridiaan ida ja läänt."
          },
          {
            "id": "b",
            "text": "Mõlemad eristavad ainult riikide keeli."
          },
          {
            "id": "c",
            "text": "Nullmeridiaan kulgeb ainult põhjanabal."
          },
          {
            "id": "d",
            "text": "Ekvaator on Euroopa idapiir."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q127",
      "unitId": "lo-opik-u18",
      "stem": "Õpilane väidab, et Euroopa läänepoolkera osa on suurem kui idapoolkera osa. Kuidas teda parandada?",
      "primaryObjectiveId": "lo-opik-u18-o4",
      "variantGroupId": "lo-opik-u18-g072",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku järgi on suurem osa Euroopast idapoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Õpik ütleb, et idapoolkera osa on suurem."
          },
          {
            "id": "b",
            "text": "Euroopa asub tervenisti lõunapoolkeral."
          },
          {
            "id": "c",
            "text": "Euroopa ei kuulu kummalegi poolkerale."
          },
          {
            "id": "d",
            "text": "Ida ja läänt eristab ekvaator."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q128",
      "unitId": "lo-opik-u18",
      "stem": "Järjesta õpiku kolm riiki nende üldise asukoha järgi põhjast lõunasse.",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g073",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rootsi on Põhja-Euroopas, Prantsusmaa Lääne-Euroopas ja Hispaania edelas lõunapool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Rootsi"
          },
          {
            "id": "i2",
            "text": "Prantsusmaa"
          },
          {
            "id": "i3",
            "text": "Hispaania"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Põhjas",
        "lastLabel": "Lõunas"
      }
    },
    {
      "id": "lo-opik-u18-q129",
      "unitId": "lo-opik-u18",
      "stem": "Järjesta õpiku kolm riiki nende üldise asukoha järgi läänest itta.",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g074",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hispaania asub Euroopa edelaosas, Prantsusmaa lääneosas ja Ukraina idaosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Hispaania"
          },
          {
            "id": "i2",
            "text": "Prantsusmaa"
          },
          {
            "id": "i3",
            "text": "Ukraina"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Läänes",
        "lastLabel": "Idas"
      }
    },
    {
      "id": "lo-opik-u18-q130",
      "unitId": "lo-opik-u18",
      "stem": "Mida saab järeldada kaardist, millel Prantsusmaa ja Rootsi on pindala näidetena esile tõstetud?",
      "primaryObjectiveId": "lo-opik-u18-o5",
      "variantGroupId": "lo-opik-u18-g075",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab nii Prantsusmaad kui ka Rootsit pindalalt suurte riikide seas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Mõlemad on õpikus nimetatud pindalalt suurte riikide hulgas."
          },
          {
            "id": "b",
            "text": "Mõlemas elab täpselt sama palju inimesi."
          },
          {
            "id": "c",
            "text": "Mõlemad asuvad Lõuna-Euroopas."
          },
          {
            "id": "d",
            "text": "Mõlema riigi pealinn on sama."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q131",
      "unitId": "lo-opik-u18",
      "stem": "Järjesta rahvaarvu näidete riigid nende üldise asukoha järgi läänest itta.",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g076",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ühendkuningriik on läänes, Saksamaa keskosas ja Venemaa ida pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Ühendkuningriik"
          },
          {
            "id": "i2",
            "text": "Saksamaa"
          },
          {
            "id": "i3",
            "text": "Venemaa"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Läänes",
        "lastLabel": "Idas"
      }
    },
    {
      "id": "lo-opik-u18-q132",
      "unitId": "lo-opik-u18",
      "stem": "Järjesta riigid nende ligikaudse keskse asukoha järgi põhjast lõunasse.",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g077",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ühendkuningriigi keskosa paikneb Prantsusmaa keskosast põhjas ja Itaalia keskosa Prantsusmaa keskosast lõunas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Ühendkuningriik"
          },
          {
            "id": "i2",
            "text": "Prantsusmaa"
          },
          {
            "id": "i3",
            "text": "Itaalia"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Põhjas",
        "lastLabel": "Lõunas"
      }
    },
    {
      "id": "lo-opik-u18-q133",
      "unitId": "lo-opik-u18",
      "stem": "Vali riigid, mida õpik nimetab rahvaarvu näidete seas JA mis paiknevad Lääne-Euroopas.",
      "primaryObjectiveId": "lo-opik-u18-o6",
      "variantGroupId": "lo-opik-u18-g078",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Prantsusmaa ja Ühendkuningriik on õpikus rahvaarvult suurte riikide seas ning asuvad Euroopa lääneosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "68-69"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Prantsusmaa"
          },
          {
            "id": "o2",
            "text": "Ühendkuningriik"
          },
          {
            "id": "o3",
            "text": "Ukraina"
          },
          {
            "id": "o4",
            "text": "Soome"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2"
        ]
      }
    },
    {
      "id": "lo-opik-u18-q134",
      "unitId": "lo-opik-u18",
      "stem": "Kumb näitepiirkond on tihedamalt asustatud, kui nende pindalad on erinevad?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g079",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "A: 200 ÷ 20 = 10 inimest/km². B: 150 ÷ 10 = 15 inimest/km².",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "B (15 inimest/km²)."
          },
          {
            "id": "b",
            "text": "A (10 inimest/km²)."
          },
          {
            "id": "c",
            "text": "Mõlemad võrdselt."
          },
          {
            "id": "d",
            "text": "Võrdlemine on võimatu."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Näitepiirkond",
          "Pindala",
          "Elanikke"
        ],
        "rows": [
          [
            "A",
            "20 km²",
            "200"
          ],
          [
            "B",
            "10 km²",
            "150"
          ]
        ],
        "caption": "Väljamõeldud andmed."
      }
    },
    {
      "id": "lo-opik-u18-q135",
      "unitId": "lo-opik-u18",
      "stem": "Kui rahvaarv kahekordistub, aga piirkonna pindala ei muutu, mis juhtub rahvastikutihedusega?",
      "primaryObjectiveId": "lo-opik-u18-o7",
      "variantGroupId": "lo-opik-u18-g080",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sama pindala peal kaks korda rohkem inimesi tähendab kaks korda suuremat rahvastikutihedust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "See kahekordistub."
          },
          {
            "id": "b",
            "text": "See väheneb poole võrra."
          },
          {
            "id": "c",
            "text": "See jääb alati samaks."
          },
          {
            "id": "d",
            "text": "See muutub pindalaks."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q136",
      "unitId": "lo-opik-u18",
      "stem": "Millist kaarti tuleks valida, et uurida, kus inimesed on koondunud tihedamalt elama?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g081",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rahvastikutiheduse kaart näitab asustuse paiknemist, mitte üksnes inimeste koguarvu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Rahvastikutiheduse kaarti."
          },
          {
            "id": "b",
            "text": "Ainult riikide lippude kaarti."
          },
          {
            "id": "c",
            "text": "Mere sügavuskaarti."
          },
          {
            "id": "d",
            "text": "Ainult mägede kõrguskaarti."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u18-q137",
      "unitId": "lo-opik-u18",
      "stem": "Mida tähendab näitekaardil tume värv, kui legend ütleb „tume = hõre asustus”?",
      "primaryObjectiveId": "lo-opik-u18-o8",
      "variantGroupId": "lo-opik-u18-g082",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tuleb kasutada konkreetse kaardi legendi; värvide tähendused võivad erineda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "69"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Tumedad alad on sellel kaardil hõredamalt asustatud."
          },
          {
            "id": "b",
            "text": "Tumedad alad on kindlasti tihedamalt asustatud."
          },
          {
            "id": "c",
            "text": "Kõik tumedad alad on mered."
          },
          {
            "id": "d",
            "text": "Legendi ei saa kasutada."
          }
        ],
        "correctOptionId": "a"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Väljamõeldud näitekaardi legend: tume värv = hõre asustus; hele värv = tihe asustus."
        ]
      }
    }
  ]
};
