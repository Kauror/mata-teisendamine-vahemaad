// Unit 16 - Maailmameri. Õpik lk 64-65.
// Parent-preview READY; not published to the real child.
import type { Unit } from '@/lib/textbook/types';
export const unit16: Unit = {
  "id": "lo-opik-u16",
  "courseId": "loodusopetus-opik",
  "number": 16,
  "title": "Maailmameri",
  "pages": {
    "from": 64,
    "to": 65
  },
  "status": "ready",
  "contentVersion": "2026-10-17.2",
  "objectives": [
    {
      "id": "lo-opik-u16-o1",
      "description": "Tean, et suurem osa Maa pinnast on kaetud soolase veega, ning oskan tuua magevee näiteid.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ]
    },
    {
      "id": "lo-opik-u16-o2",
      "description": "Oskan selgitada, mis on maailmameri ja kuidas ookeanid sellega seotud on.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ]
    },
    {
      "id": "lo-opik-u16-o3",
      "description": "Oskan nimetada kõik viis ookeani.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ]
    },
    {
      "id": "lo-opik-u16-o4",
      "description": "Oskan maailmakaardil leida viis ookeani ning kirjeldada nende asukohta mandrite suhtes.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ]
    },
    {
      "id": "lo-opik-u16-o5",
      "description": "Mõistan, kuidas mandrid ja kokkuleppelised piirid ookeane eristavad.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ]
    },
    {
      "id": "lo-opik-u16-o6",
      "description": "Oskan eristada merd, väina ja lahte ning kasutada neid mõisteid kaardil.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ]
    },
    {
      "id": "lo-opik-u16-o7",
      "description": "Tean, kus asub Läänemeri, ning mõistan selle seost Atlandi ookeaniga.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        },
        {
          "kind": "supplementary",
          "url": "https://stateofthebalticsea.helcom.fi/overview/about-the-baltic-sea/",
          "attribution": "HELCOM"
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u16-l1",
      "title": "Vesi Maal",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u16-o1"
      ],
      "sections": [
        {
          "id": "lo-opik-u16-s001",
          "title": "Enamik Maast on vee all",
          "blocks": [
            {
              "id": "lo-opik-u16-b001",
              "type": "paragraph",
              "text": "Kui vaatad Maad kosmosest, näed palju sinist. Suurem osa maakera pinnast on kaetud veega. See vesi on enamasti soolane ning moodustab maailmamere.",
              "source": {
                "kind": "textbook",
                "pages": "64"
              }
            },
            {
              "id": "lo-opik-u16-b002",
              "type": "diagram",
              "diagramId": "u16-land-water",
              "caption": "Maa pinnast on ligikaudu 71% vee all ja 29% maismaa. Arvud on ümardatud. Tulp näitab ainult osakaalu, mitte seda, kus maismaa ja vesi asuvad.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/water-science-school/science/how-much-water-there-earth",
                "attribution": "USGS Water Science School"
              }
            },
            {
              "id": "lo-opik-u16-b003",
              "type": "keyFact",
              "items": [
                "Maa pinnal on vett rohkem kui maismaad.",
                "Maailmameres on soolane vesi."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u16-s002",
          "title": "Soolane ja mage vesi",
          "blocks": [
            {
              "id": "lo-opik-u16-b004",
              "type": "paragraph",
              "text": "Maailmamere vesi on soolane. Magevett leidub jõgedes ja paljudes järvedes, maa sees ning külmade polaaralade jääs. Maal on magevett palju vähem kui soolast vett.",
              "source": {
                "kind": "textbook",
                "pages": "64"
              }
            },
            {
              "id": "lo-opik-u16-b005",
              "type": "comparison",
              "title": "Kaks veeliiki",
              "columns": [
                {
                  "heading": "Soolane vesi",
                  "points": [
                    "ookeanid ja mered",
                    "maailmamere peamine vesi"
                  ]
                },
                {
                  "heading": "Magevesi",
                  "points": [
                    "jõed ja paljud järved",
                    "põhjavesi ja liustike jää"
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u16-b006",
              "type": "keyFact",
              "items": [
                "Ookean ja meri on soolase vee veekogud.",
                "Magevett leidub jõgedes, järvedes, maa sees ja jääs."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u16-s003",
          "title": "Kui palju vett Maal leidub?",
          "blocks": [
            {
              "id": "lo-opik-u16-b007",
              "type": "paragraph",
              "text": "Soolast ookeanivett on Maa veest peaaegu kõik. Kuid ära aja segamini kahte arvu: kui suur osa Maa pinnast on vee all ja kui suur osa kogu Maa veest asub ookeanides.",
              "source": {
                "kind": "textbook",
                "pages": "64"
              }
            },
            {
              "id": "lo-opik-u16-b008",
              "type": "enrichment",
              "variant": "extra",
              "title": "Lisateadmine: kaks eri protsenti",
              "body": [
                "USGS-i hinnangul katab vesi ligikaudu 71% Maa pinnast, kuid ookeanides paikneb umbes 96,5% Maa veest. Need protsendid võrdlevad erinevaid asju."
              ]
            },
            {
              "id": "lo-opik-u16-b009",
              "type": "externalResource",
              "title": "Kui palju vett on Maal?",
              "intro": "USGS-i pildid ja selgitused aitavad mõista, kus Maa vesi asub.",
              "url": "https://www.usgs.gov/water-science-school/science/how-much-water-there-earth",
              "publisher": "USGS",
              "observe": "Vaata, milline osa kogu Maa veest paikneb ookeanides ja milline jääs ning maa sees.",
              "resourceType": "article"
            },
            {
              "id": "lo-opik-u16-b010",
              "type": "keyFact",
              "items": [
                "Vesi katab enamiku Maa pinnast.",
                "Enamik Maa veest on maailmameres."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u16-l2",
      "title": "Üks maailmameri, viis ookeani",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u16-o2",
        "lo-opik-u16-o3",
        "lo-opik-u16-o4",
        "lo-opik-u16-o5"
      ],
      "sections": [
        {
          "id": "lo-opik-u16-s004",
          "title": "Maailmameri on üks tervik",
          "blocks": [
            {
              "id": "lo-opik-u16-b011",
              "type": "definition",
              "term": "Maailmameri",
              "definition": "Maakeral olev ühtne, omavahel ühendatud suur soolase vee väli."
            },
            {
              "id": "lo-opik-u16-b012",
              "type": "paragraph",
              "text": "Kuigi me anname suurtele veeväljadele eri nimesid, on ookeanide vesi omavahel ühendatud. Seepärast räägime ühest maailmamerest.",
              "source": {
                "kind": "textbook",
                "pages": "64"
              }
            },
            {
              "id": "lo-opik-u16-b013",
              "type": "definition",
              "term": "Ookean",
              "definition": "Maailmamere kõige suurem osa."
            },
            {
              "id": "lo-opik-u16-b014",
              "type": "keyFact",
              "items": [
                "Maailmameri on üks ühendatud veeala.",
                "Ookeanid on selle kõige suuremad osad."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u16-s005",
          "title": "Viie ookeani nimed",
          "blocks": [
            {
              "id": "lo-opik-u16-b015",
              "type": "paragraph",
              "text": "Meie õpikus eristatakse viit ookeani: Vaikne ookean, Atlandi ookean, India ookean, Põhja-Jäämeri ja Lõuna-Jäämeri.",
              "source": {
                "kind": "textbook",
                "pages": "64"
              }
            },
            {
              "id": "lo-opik-u16-b016",
              "type": "table",
              "headers": [
                "Ookean",
                "Kus see kaardil asub?"
              ],
              "rows": [
                [
                  "Vaikne ookean",
                  "Ameerikast läänes, Aasia ja Austraalia juures; maailmakaardi mõlemal serval"
                ],
                [
                  "Atlandi ookean",
                  "Ameerika ning Euroopa ja Aafrika vahel"
                ],
                [
                  "India ookean",
                  "Aafrikast idas, Aasiast lõunas ja Austraaliast läänes"
                ],
                [
                  "Põhja-Jäämeri",
                  "Maakera põhjaosas, põhjapooluse ümbruses"
                ],
                [
                  "Lõuna-Jäämeri",
                  "Antarktise ümber maakera lõunaosas"
                ]
              ],
              "caption": "Ookeanide asukoht õpiku maailmakaardi järgi"
            },
            {
              "id": "lo-opik-u16-b017",
              "type": "keyFact",
              "items": [
                "Ookeane on viis.",
                "Vaikne, Atlandi, India, Põhja-Jäämeri ja Lõuna-Jäämeri."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u16-s006",
          "title": "Leia ookeanid kaardilt",
          "blocks": [
            {
              "id": "lo-opik-u16-b018",
              "type": "diagram",
              "diagramId": "u16-five-oceans",
              "caption": "Maailmakaart on tehtud päris maismaakontuuridest. Vaata, kus ookeanid asuvad mandrite suhtes.",
              "source": {
                "kind": "textbook",
                "pages": "64-65"
              }
            },
            {
              "id": "lo-opik-u16-b019",
              "type": "paragraph",
              "text": "Maailmakaart näitab ümmarguse Maa pinda tasapinnal. Vaikne ookean paistab mõnel kaardil mõlemal serval, kuigi on ikka üks ja seesama ookean.",
              "source": {
                "kind": "textbook",
                "pages": "65"
              }
            },
            {
              "id": "lo-opik-u16-b020",
              "type": "keyFact",
              "items": [
                "Vaikne ookean ei muutu kaardi serval kaheks ookeaniks.",
                "Põhja-Jäämeri asub põhjas, Lõuna-Jäämeri lõunas."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u16-s007",
          "title": "Kus lõpeb üks ookean?",
          "blocks": [
            {
              "id": "lo-opik-u16-b021",
              "type": "paragraph",
              "text": "Manner aitab eristada ookeanide piirkondi. Ent maailmameres ei ole veele tõmmatud nähtavaid piire. Eriti lõunapoolkeral, kus ookeanide lõunaosad kokku puutuvad, on piirid kokkuleppelised.",
              "source": {
                "kind": "textbook",
                "pages": "65"
              }
            },
            {
              "id": "lo-opik-u16-b022",
              "type": "enrichment",
              "variant": "extra",
              "title": "Lisateadmine: piiride kokkulepped",
              "body": [
                "Ka kaartidel kujutatud Lõuna-Jäämere piiri asukoht põhineb rahvusvahelistel kokkulepetel ning seda võib eri kaartidel veidi erinevalt näha."
              ]
            },
            {
              "id": "lo-opik-u16-b023",
              "type": "externalResource",
              "title": "Mitu ookeani maailmas on?",
              "intro": "NOAA selgitab, miks üht maailmamerd jaotatakse viieks ookeaniks.",
              "url": "https://oceanservice.noaa.gov/facts/howmanyoceans.html",
              "publisher": "NOAA",
              "observe": "Miks on ookeani piirid osaliselt kokkuleppelised?",
              "resourceType": "article"
            },
            {
              "id": "lo-opik-u16-b024",
              "type": "keyFact",
              "items": [
                "Mandrid eraldavad osa ookeanide piirkondi.",
                "Lõunas on ookeanidevahelised piirid kokkuleppelised."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u16-l3",
      "title": "Mered, väinad ja lahed",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u16-o6"
      ],
      "sections": [
        {
          "id": "lo-opik-u16-s008",
          "title": "Mered on ookeanide osad",
          "blocks": [
            {
              "id": "lo-opik-u16-b025",
              "type": "paragraph",
              "text": "Igas ookeanis leidub meresid. Meri on tavaliselt ookeanist väiksem ning asub sageli maismaa lähedal või on osaliselt maismaaga ümbritsetud. Näiteks on Läänemeri Atlandi ookeani osa.",
              "source": {
                "kind": "textbook",
                "pages": "65"
              }
            },
            {
              "id": "lo-opik-u16-b026",
              "type": "diagram",
              "diagramId": "u16-water-forms",
              "caption": "Kolm veeala kuju: meri, väin ja laht. Skeem on väljamõeldud rannik, mitte päris maailma kaart.",
              "source": {
                "kind": "textbook",
                "pages": "65"
              }
            },
            {
              "id": "lo-opik-u16-b027",
              "type": "keyFact",
              "items": [
                "Meri on tavaliselt ookeanist väiksem soolase vee ala.",
                "Meri võib olla maailmamere üks osa."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u16-s009",
          "title": "Väin ühendab veealasid",
          "blocks": [
            {
              "id": "lo-opik-u16-b028",
              "type": "definition",
              "term": "Väin",
              "definition": "Kitsam veeala, mis paikneb kahe maismaaosa vahel ja ühendab veealasid."
            },
            {
              "id": "lo-opik-u16-b029",
              "type": "paragraph",
              "text": "Väina kaudu saab vesi liikuda ühest merest teise. Kaardil võid väina ära tunda kitsast sinisest läbipääsust kahe maismaaosa vahel.",
              "source": {
                "kind": "textbook",
                "pages": "65"
              }
            },
            {
              "id": "lo-opik-u16-b030",
              "type": "keyFact",
              "items": [
                "Väin ühendab veealasid.",
                "Väin on maismaaosade vahel kitsas veetee."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u16-s010",
          "title": "Laht ulatub maismaasse",
          "blocks": [
            {
              "id": "lo-opik-u16-b031",
              "type": "definition",
              "term": "Laht",
              "definition": "Mere või ookeani osa, mis ulatub maismaa sisse ning on osaliselt maismaaga ümbritsetud."
            },
            {
              "id": "lo-opik-u16-b032",
              "type": "paragraph",
              "text": "Kui merevesi ulatub rannajoonel maismaa sisse, moodustub laht. Maailmakaardilt võid leida näiteks Soome lahe ja Guinea lahe.",
              "source": {
                "kind": "textbook",
                "pages": "65"
              }
            },
            {
              "id": "lo-opik-u16-b033",
              "type": "table",
              "headers": [
                "Mõiste",
                "Mille järgi ära tunned?"
              ],
              "rows": [
                [
                  "meri",
                  "ookeaniga seotud veeala, sageli osaliselt maismaaga ümbritsetud"
                ],
                [
                  "väin",
                  "kitsas ühendustee kahe veeala vahel"
                ],
                [
                  "laht",
                  "maismaa sisse ulatuv veeosa"
                ]
              ],
              "caption": "Kolm kaardimõistet"
            },
            {
              "id": "lo-opik-u16-b034",
              "type": "keyFact",
              "items": [
                "Väin ühendab veealasid.",
                "Laht ulatub maismaa sisse.",
                "Meri on osa maailmamerest."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u16-l4",
      "title": "Läänemeri ja Atlandi ookean",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u16-o7"
      ],
      "sections": [
        {
          "id": "lo-opik-u16-s011",
          "title": "Meie kodumeri",
          "blocks": [
            {
              "id": "lo-opik-u16-b035",
              "type": "paragraph",
              "text": "Eesti rannikul asub Läänemeri. See on meie kodumeri. Läänemeri ei ole iseseisev ookean, vaid Atlandi ookeani osa.",
              "source": {
                "kind": "textbook",
                "pages": "65"
              }
            },
            {
              "id": "lo-opik-u16-b036",
              "type": "diagram",
              "diagramId": "u16-baltic-connection",
              "caption": "Lihtsustatud seoseskeem aitab jälgida Läänemere ühendust suurema ookeaniga.",
              "source": {
                "kind": "textbook",
                "pages": "65"
              }
            },
            {
              "id": "lo-opik-u16-b037",
              "type": "keyFact",
              "items": [
                "Läänemeri asub Eesti ääres.",
                "Läänemeri kuulub Atlandi ookeani."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u16-s012",
          "title": "Veeühendus Läänemerest Atlandini",
          "blocks": [
            {
              "id": "lo-opik-u16-b038",
              "type": "paragraph",
              "text": "Läänemeri on Põhjamerega ühendatud Taani väinade kaudu. Põhjameri on Atlandi ookeani osa. Nii on Läänemeri ühenduses maailmamerega.",
              "source": {
                "kind": "supplementary",
                "url": "https://stateofthebalticsea.helcom.fi/overview/about-the-baltic-sea/",
                "attribution": "HELCOM"
              }
            },
            {
              "id": "lo-opik-u16-b039",
              "type": "table",
              "headers": [
                "Ühenduse järjekord",
                "Veeala"
              ],
              "rows": [
                [
                  "1",
                  "Läänemeri"
                ],
                [
                  "2",
                  "Taani väinad"
                ],
                [
                  "3",
                  "Põhjameri"
                ],
                [
                  "4",
                  "Atlandi ookean"
                ]
              ],
              "caption": "Läänemere ühendus Atlandi ookeaniga (skeem)"
            },
            {
              "id": "lo-opik-u16-b040",
              "type": "keyFact",
              "items": [
                "Läänemeri on maailmamerega ühendatud Taani väinade ja Põhjamere kaudu.",
                "Väinade kaudu pääseb vesi eri merede vahel liikuma."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u16-s013",
          "title": "Teeme veel ühe kaardiringi",
          "blocks": [
            {
              "id": "lo-opik-u16-b041",
              "type": "paragraph",
              "text": "Leia kaardilt Eesti ja Läänemeri. Seejärel leia Atlandi ookean, mille osa meie kodumeri on. Nüüd tead, kuidas väike meri on seotud suure maailmamerega.",
              "source": {
                "kind": "textbook",
                "pages": "65"
              }
            },
            {
              "id": "lo-opik-u16-b042",
              "type": "comparison",
              "title": "Suur ja väike",
              "columns": [
                {
                  "heading": "Atlandi ookean",
                  "points": [
                    "suur maailmamere osa",
                    "selle ääres asuvad mitmed mered"
                  ]
                },
                {
                  "heading": "Läänemeri",
                  "points": [
                    "Eesti kodumeri",
                    "kuulub Atlandi ookeani"
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u16-b043",
              "type": "keyFact",
              "items": [
                "Ookeane on viis.",
                "Mered, väinad ja lahed on ookeanidega seotud veealad.",
                "Meie Läänemeri on Atlandi ookeani osa."
              ]
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u16-q001",
      "unitId": "lo-opik-u16",
      "stem": "Mis katab suurema osa Maa pinnast?",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-water-more-than-land",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vesi katab suurema osa Maa pinnast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "maismaa"
          },
          {
            "id": "2",
            "text": "vesi"
          },
          {
            "id": "3",
            "text": "metsad"
          },
          {
            "id": "4",
            "text": "jääväljad"
          }
        ],
        "correctOptionId": "2"
      }
    },
    {
      "id": "lo-opik-u16-q002",
      "unitId": "lo-opik-u16",
      "stem": "Õige või vale? Maal on maismaad rohkem kui veega kaetud pinda.",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-water-more-than-land",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Maa pindalast on suurem osa vee all.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
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
      "id": "lo-opik-u16-q003",
      "unitId": "lo-opik-u16",
      "stem": "Milline on maailmamere vesi?",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-world-ocean-salty",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmameri koosneb soolasest veest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "magevesi"
          },
          {
            "id": "2",
            "text": "soolane vesi"
          },
          {
            "id": "3",
            "text": "põhjavesi"
          },
          {
            "id": "4",
            "text": "jõevesi"
          }
        ],
        "correctOptionId": "2"
      }
    },
    {
      "id": "lo-opik-u16-q004",
      "unitId": "lo-opik-u16",
      "stem": "Milline väide käib maailmamere kohta?",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-world-ocean-salty",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmameri on ühendatud suur soolase vee ala.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Maailmameres on valdavalt soolane vesi."
          },
          {
            "id": "2",
            "text": "Maailmameres ei ole ühtki saart."
          },
          {
            "id": "3",
            "text": "Maailmameri on väiksem kui Läänemeri."
          },
          {
            "id": "4",
            "text": "Maailmameri koosneb ainult jõgedest."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q005",
      "unitId": "lo-opik-u16",
      "stem": "Vali kõik paigad, kust õpiku järgi võib leida magevett.",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-freshwater-sources",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magevett leidub jõgedes, järvedes, maa sees ja jääs.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "1",
            "text": "jõgedest"
          },
          {
            "id": "2",
            "text": "järvedest"
          },
          {
            "id": "3",
            "text": "põhjaveest"
          },
          {
            "id": "4",
            "text": "polaaralade jääst"
          },
          {
            "id": "5",
            "text": "ookeanis olevast mereveest"
          }
        ],
        "correctOptionIds": [
          "1",
          "2",
          "3",
          "4"
        ]
      }
    },
    {
      "id": "lo-opik-u16-q006",
      "unitId": "lo-opik-u16",
      "stem": "Rühmita, kus leidub magevett ja kus soolast vett.",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-freshwater-sources",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jõgede ja liustike vesi on mage, mered ja ookeanid on soolased.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "mage",
            "text": "Magevesi"
          },
          {
            "id": "soolane",
            "text": "Soolane vesi"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "jõgi"
          },
          {
            "id": "i2",
            "text": "ookean"
          },
          {
            "id": "i3",
            "text": "liustikujää"
          },
          {
            "id": "i4",
            "text": "meri"
          }
        ],
        "correctGroupByItem": {
          "i1": "mage",
          "i2": "soolane",
          "i3": "mage",
          "i4": "soolane"
        }
      }
    },
    {
      "id": "lo-opik-u16-q007",
      "unitId": "lo-opik-u16",
      "stem": "Õige või vale? Polaaralade jääväljades leidub magevett.",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-freshwater-in-ice",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jah. Polaaralade jääväljades paikneb magevett.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
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
      "id": "lo-opik-u16-q008",
      "unitId": "lo-opik-u16",
      "stem": "Teadlane uurib liustiku jääd. Millisest veeliigist jää enamasti tekkis?",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-freshwater-in-ice",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Liustikujää tekib peamiselt lumest ja on magevesi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "soolasest ookeaniveest"
          },
          {
            "id": "2",
            "text": "mageveest, mis sadas lumena"
          },
          {
            "id": "3",
            "text": "naftast"
          },
          {
            "id": "4",
            "text": "ookeani põhjaliivast"
          }
        ],
        "correctOptionId": "2"
      }
    },
    {
      "id": "lo-opik-u16-q009",
      "unitId": "lo-opik-u16",
      "stem": "Milline väide sobib õpikuga?",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-salt-vs-fresh-classify",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Peaaegu kogu Maa vesi on kogunenud maailmamerre.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Enamik Maa veest on ookeanides."
          },
          {
            "id": "2",
            "text": "Enamik Maa veest on jõgedes."
          },
          {
            "id": "3",
            "text": "Kogu Maa vesi on mage."
          },
          {
            "id": "4",
            "text": "Ookeanide vesi asub ainult maa all."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q010",
      "unitId": "lo-opik-u16",
      "stem": "Õpilane otsib Maa soolase vee peamist varu. Kuhu ta peaks vaatama?",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-salt-vs-fresh-classify",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeanid on Maa soolase vee suurim varu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "ookeanidesse"
          },
          {
            "id": "2",
            "text": "jõgedesse"
          },
          {
            "id": "3",
            "text": "mageveejärvedesse"
          },
          {
            "id": "4",
            "text": "liustikesse"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q011",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta joonisel seda osa, mis katab Maa pinnast suurema ala.",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-water-more-than-land",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa pinnast on ligikaudu 71% vee all.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-land-water",
        "correctRegionId": "water"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-land-water"
      }
    },
    {
      "id": "lo-opik-u16-q012",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta joonisel maismaa osa.",
      "primaryObjectiveId": "lo-opik-u16-o1",
      "variantGroupId": "lo-opik-u16-g-land-water-diagram",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maismaad on Maa pinnast vähem kui veega kaetud pinda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-land-water",
        "correctRegionId": "land"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-land-water"
      }
    },
    {
      "id": "lo-opik-u16-q013",
      "unitId": "lo-opik-u16",
      "stem": "Mis on maailmameri?",
      "primaryObjectiveId": "lo-opik-u16-o2",
      "variantGroupId": "lo-opik-u16-g-one-ocean",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmameri on üks suur omavahel ühendatud soolase vee ala.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "ühtne suur soolase vee väli Maal"
          },
          {
            "id": "2",
            "text": "ainult Läänemeri"
          },
          {
            "id": "3",
            "text": "ainult põhjapoolkera meri"
          },
          {
            "id": "4",
            "text": "kõik maailma mageveejärved"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q014",
      "unitId": "lo-opik-u16",
      "stem": "Miks kasutatakse nime maailmameri ainsuses, kuigi ookeane on viis?",
      "primaryObjectiveId": "lo-opik-u16-o2",
      "variantGroupId": "lo-opik-u16-g-one-ocean",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeanid on omavahel seotud ning moodustavad ühe maailmamere.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Ookeanid moodustavad ühendatud veeala."
          },
          {
            "id": "2",
            "text": "Neli ookeani on tegelikult järved."
          },
          {
            "id": "3",
            "text": "Ookeanid on üksteisest täiesti eraldatud."
          },
          {
            "id": "4",
            "text": "Iga ookean on mageveeline."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q015",
      "unitId": "lo-opik-u16",
      "stem": "Mille kõige suuremad osad on ookeanid?",
      "primaryObjectiveId": "lo-opik-u16-o2",
      "variantGroupId": "lo-opik-u16-g-ocean-part",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeanid on maailmamere kõige suuremad osad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "maailmamere"
          },
          {
            "id": "2",
            "text": "kõikide jõgede"
          },
          {
            "id": "3",
            "text": "mandrite"
          },
          {
            "id": "4",
            "text": "jääväljade"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q016",
      "unitId": "lo-opik-u16",
      "stem": "Milline väide kirjeldab Atlandi ookeani õigesti?",
      "primaryObjectiveId": "lo-opik-u16-o2",
      "variantGroupId": "lo-opik-u16-g-ocean-part",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean on üks viiest maailmamere suurest osast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Atlandi ookean on maailmamere osa."
          },
          {
            "id": "2",
            "text": "Maailmameri on Atlandi ookeani väike laht."
          },
          {
            "id": "3",
            "text": "Iga ookean on ainult mageveega."
          },
          {
            "id": "4",
            "text": "Ookeanid on alati mandritest väiksemad."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q017",
      "unitId": "lo-opik-u16",
      "stem": "Järjesta mõisted suuremast tervikust selle osade poole.",
      "primaryObjectiveId": "lo-opik-u16-o2",
      "variantGroupId": "lo-opik-u16-g-hierarchy-world-ocean",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmameri jaguneb ookeanideks, ookeanides asuvad mered.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "maailmameri"
          },
          {
            "id": "i2",
            "text": "ookean"
          },
          {
            "id": "i3",
            "text": "meri"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ]
      }
    },
    {
      "id": "lo-opik-u16-q018",
      "unitId": "lo-opik-u16",
      "stem": "Milline järjestus kirjeldab õigesti ühtsest suurest veeväljast väiksema osani?",
      "primaryObjectiveId": "lo-opik-u16-o2",
      "variantGroupId": "lo-opik-u16-g-hierarchy-world-ocean",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meri on tavaliselt ookeani osa, ookean maailmamere osa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "maailmameri, ookean, meri"
          },
          {
            "id": "2",
            "text": "meri, maailmameri, ookean"
          },
          {
            "id": "3",
            "text": "ookean, järv, maailmameri"
          },
          {
            "id": "4",
            "text": "jõgi, mägi, maailmameri"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q019",
      "unitId": "lo-opik-u16",
      "stem": "Õige või vale? Kaks eri ookeanides sõitvat laeva paiknevad siiski sama ühendatud maailmamere osades.",
      "primaryObjectiveId": "lo-opik-u16-o2",
      "variantGroupId": "lo-opik-u16-g-connected-despite-names",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jah. Erinevad ookeaninimed ei tähenda eraldi suletud veekogusid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
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
      "id": "lo-opik-u16-q020",
      "unitId": "lo-opik-u16",
      "stem": "Vali kõik maailmamere kohta sobivad väited.",
      "primaryObjectiveId": "lo-opik-u16-o2",
      "variantGroupId": "lo-opik-u16-g-connected-despite-names",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmameri ühendab ookeane ning nendes paiknevaid meresid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "1",
            "text": "See on ühtne veeväli."
          },
          {
            "id": "2",
            "text": "Selle suurimad osad on ookeanid."
          },
          {
            "id": "3",
            "text": "See koosneb ainult mageveest."
          },
          {
            "id": "4",
            "text": "Selle osad saavad olla mered."
          }
        ],
        "correctOptionIds": [
          "1",
          "2",
          "4"
        ]
      }
    },
    {
      "id": "lo-opik-u16-q021",
      "unitId": "lo-opik-u16",
      "stem": "Õige või vale? Maailmamerel on ainult üks ookeani nimi.",
      "primaryObjectiveId": "lo-opik-u16-o2",
      "variantGroupId": "lo-opik-u16-g-not-only-one-name",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ei. Ühte maailmamerd jaotatakse viieks nimetatud ookeaniks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
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
      "id": "lo-opik-u16-q022",
      "unitId": "lo-opik-u16",
      "stem": "Loetelus on viis eri nimega ookeani. Mis neid seob?",
      "primaryObjectiveId": "lo-opik-u16-o2",
      "variantGroupId": "lo-opik-u16-g-global-water-puzzle",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Erinevate nimedega ookeanid on ühe ühendatud soolase vee ala osad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Need moodustavad ühise maailmamere."
          },
          {
            "id": "2",
            "text": "Need on viis lahutatud mageveejärve."
          },
          {
            "id": "3",
            "text": "Need katavad kokku ainult 1% Maast."
          },
          {
            "id": "4",
            "text": "Neid ühendavad vaid jõed."
          }
        ],
        "correctOptionId": "1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Kaardil on Vaikne ookean, Atlandi ookean, India ookean, Põhja-Jäämeri ja Lõuna-Jäämeri."
        ]
      }
    },
    {
      "id": "lo-opik-u16-q023",
      "unitId": "lo-opik-u16",
      "stem": "Mitu ookeani on meie õpiku jaotuse järgi?",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-ocean-count",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik eristab viit ookeani.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "3"
          },
          {
            "id": "2",
            "text": "4"
          },
          {
            "id": "3",
            "text": "5"
          },
          {
            "id": "4",
            "text": "6"
          }
        ],
        "correctOptionId": "3"
      }
    },
    {
      "id": "lo-opik-u16-q024",
      "unitId": "lo-opik-u16",
      "stem": "Õige või vale? Õpiku järgi on Lõuna-Jäämeri üks viiest ookeanist.",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-ocean-count",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab viie ookeani seas ka Lõuna-Jäämerd.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
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
      "id": "lo-opik-u16-q025",
      "unitId": "lo-opik-u16",
      "stem": "Vali kõik õpikus nimetatud ookeanid.",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-select-five",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Viis ookeani on Vaikne, Atlandi, India, Põhja-Jäämeri ja Lõuna-Jäämeri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "1",
            "text": "Vaikne ookean"
          },
          {
            "id": "2",
            "text": "Atlandi ookean"
          },
          {
            "id": "3",
            "text": "India ookean"
          },
          {
            "id": "4",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "5",
            "text": "Lõuna-Jäämeri"
          },
          {
            "id": "6",
            "text": "Läänemeri"
          },
          {
            "id": "7",
            "text": "Soome laht"
          }
        ],
        "correctOptionIds": [
          "1",
          "2",
          "3",
          "4",
          "5"
        ]
      }
    },
    {
      "id": "lo-opik-u16-q026",
      "unitId": "lo-opik-u16",
      "stem": "Millises vastuses on ainult ookeanid?",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-select-five",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "India, Vaikne ja Põhja-Jäämeri on ookeanid; ülejäänute hulgas on mered, laht või järv.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "India ookean, Vaikne ookean, Põhja-Jäämeri"
          },
          {
            "id": "2",
            "text": "India ookean, Läänemeri, Soome laht"
          },
          {
            "id": "3",
            "text": "Põhjameri, Läänemeri, Soome laht"
          },
          {
            "id": "4",
            "text": "Atlandi ookean, Läänemeri, Peipsi järv"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q027",
      "unitId": "lo-opik-u16",
      "stem": "Milline nimetatud veekogu on ookean?",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-names-not-seas",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaikne ookean on üks viiest ookeanist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Läänemeri"
          },
          {
            "id": "2",
            "text": "Soome laht"
          },
          {
            "id": "3",
            "text": "Vaikne ookean"
          },
          {
            "id": "4",
            "text": "Põhjameri"
          }
        ],
        "correctOptionId": "3"
      }
    },
    {
      "id": "lo-opik-u16-q028",
      "unitId": "lo-opik-u16",
      "stem": "Mille poolest erineb Läänemeri Atlandi ookeanist?",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-names-not-seas",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänemeri on meri, mis kuulub Atlandi ookeani.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Läänemeri on meri, Atlandi ookean on ookean."
          },
          {
            "id": "2",
            "text": "Läänemeri on maailmajagu."
          },
          {
            "id": "3",
            "text": "Atlandi ookean on järv."
          },
          {
            "id": "4",
            "text": "Läänemeri on suurem kui maailmameri."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q029",
      "unitId": "lo-opik-u16",
      "stem": "Vali õpiku kaks jäämere nime.",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-polar-names",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja- ja Lõuna-Jäämeri on kahe polaarpiirkonna ookeanid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "1",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "2",
            "text": "Lõuna-Jäämeri"
          },
          {
            "id": "3",
            "text": "Läänemeri"
          },
          {
            "id": "4",
            "text": "Vahemeri"
          }
        ],
        "correctOptionIds": [
          "1",
          "2"
        ]
      }
    },
    {
      "id": "lo-opik-u16-q030",
      "unitId": "lo-opik-u16",
      "stem": "Ühenda ookean polaarpiirkonnaga.",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-polar-names",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja-Jäämeri asub põhjas, Lõuna-Jäämeri Antarktise ümber.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "p2",
            "text": "Lõuna-Jäämeri"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "põhjapooluse ümbrus"
          },
          {
            "id": "c2",
            "text": "Antarktise ümbrus"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2"
        }
      }
    },
    {
      "id": "lo-opik-u16-q031",
      "unitId": "lo-opik-u16",
      "stem": "Vali kolm ookeani, mille nimes ei ole sõna \"jäämeri\".",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-three-nonpolar",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaikne, Atlandi ja India ookean on teised kolm viiest ookeanist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "1",
            "text": "Vaikne ookean"
          },
          {
            "id": "2",
            "text": "Atlandi ookean"
          },
          {
            "id": "3",
            "text": "India ookean"
          },
          {
            "id": "4",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "5",
            "text": "Lõuna-Jäämeri"
          }
        ],
        "correctOptionIds": [
          "1",
          "2",
          "3"
        ]
      }
    },
    {
      "id": "lo-opik-u16-q032",
      "unitId": "lo-opik-u16",
      "stem": "Õpilane tahab valida kaardilt ühe ookeani, mis pole jäämeri. Milline vastus sobib?",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-three-nonpolar",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean on ookean, mis ei ole polaarnimega jäämeri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Atlandi ookean"
          },
          {
            "id": "2",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "3",
            "text": "Lõuna-Jäämeri"
          },
          {
            "id": "4",
            "text": "Läänemeri"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q033",
      "unitId": "lo-opik-u16",
      "stem": "Puuduva ookeani leidmine: Vaikne, Atlandi, India, Põhja-Jäämeri ja ...?",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-set-completion",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Viies ookean on Lõuna-Jäämeri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Lõuna-Jäämeri"
          },
          {
            "id": "2",
            "text": "Läänemeri"
          },
          {
            "id": "3",
            "text": "Vahemeri"
          },
          {
            "id": "4",
            "text": "Soome laht"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q034",
      "unitId": "lo-opik-u16",
      "stem": "Rühmita nimetused: ookeanid või muud veekogud.",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-ocean-or-not",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeanid on maailmamere suured osad; Läänemeri on meri, Soome laht laht.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "oc",
            "text": "Ookeanid"
          },
          {
            "id": "other",
            "text": "Muud veekogud"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "India ookean"
          },
          {
            "id": "i2",
            "text": "Atlandi ookean"
          },
          {
            "id": "i3",
            "text": "Läänemeri"
          },
          {
            "id": "i4",
            "text": "Soome laht"
          }
        ],
        "correctGroupByItem": {
          "i1": "oc",
          "i2": "oc",
          "i3": "other",
          "i4": "other"
        }
      }
    },
    {
      "id": "lo-opik-u16-q035",
      "unitId": "lo-opik-u16",
      "stem": "Mitu ookeani on tabelis?",
      "primaryObjectiveId": "lo-opik-u16-o3",
      "variantGroupId": "lo-opik-u16-g-classify-in-table",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tabelis on neli ookeani: Vaikne, India, Atlandi ja Lõuna-Jäämeri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "2"
          },
          {
            "id": "2",
            "text": "3"
          },
          {
            "id": "3",
            "text": "4"
          },
          {
            "id": "4",
            "text": "5"
          }
        ],
        "correctOptionId": "3"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Nimetus",
          "Tüüp"
        ],
        "rows": [
          [
            "Vaikne ookean",
            "ookean"
          ],
          [
            "India ookean",
            "ookean"
          ],
          [
            "Läänemeri",
            "meri"
          ],
          [
            "Atlandi ookean",
            "ookean"
          ],
          [
            "Lõuna-Jäämeri",
            "ookean"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u16-q036",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta maailmakaardil Vaikset ookeani.",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-map-pacific",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaikne ookean asub Ameerika ning Aasia/Austraalia vahel ja paistab tavalise maailmakaardi mõlemal serval.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-five-oceans",
        "correctRegionId": "pacific"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-five-oceans"
      }
    },
    {
      "id": "lo-opik-u16-q037",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta maailmakaardil Atlandi ookeani.",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-map-atlantic",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean asub Ameerika ning Euroopa ja Aafrika vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-five-oceans",
        "correctRegionId": "atlantic"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-five-oceans"
      }
    },
    {
      "id": "lo-opik-u16-q038",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta maailmakaardil India ookeani.",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-map-indian",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "India ookean asub Aafrikast idas, Aasiast lõunas ja Austraaliast läänes.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-five-oceans",
        "correctRegionId": "indian"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-five-oceans"
      }
    },
    {
      "id": "lo-opik-u16-q039",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta maailmakaardil Põhja-Jäämerd.",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-map-arctic",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja-Jäämeri ümbritseb põhjapoolust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-five-oceans",
        "correctRegionId": "arctic"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-five-oceans"
      }
    },
    {
      "id": "lo-opik-u16-q040",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta maailmakaardil Lõuna-Jäämerd.",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-map-southern",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõuna-Jäämeri asub Antarktise ümber.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-five-oceans",
        "correctRegionId": "southern"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-five-oceans"
      }
    },
    {
      "id": "lo-opik-u16-q041",
      "unitId": "lo-opik-u16",
      "stem": "Milline ookean asub Ameerika ning Euroopa ja Aafrika vahel?",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-atlantic-location",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean paikneb läänes Ameerika ning idas Euroopa ja Aafrika vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Vaikne ookean"
          },
          {
            "id": "2",
            "text": "Atlandi ookean"
          },
          {
            "id": "3",
            "text": "India ookean"
          },
          {
            "id": "4",
            "text": "Põhja-Jäämeri"
          }
        ],
        "correctOptionId": "2"
      }
    },
    {
      "id": "lo-opik-u16-q042",
      "unitId": "lo-opik-u16",
      "stem": "Millise ookeani leiad Aafrikast ida pool ja Aasiast lõuna pool?",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-indian-location",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "India ookean paikneb Aafrika, Aasia ja Austraalia vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "India ookeani"
          },
          {
            "id": "2",
            "text": "Põhja-Jäämere"
          },
          {
            "id": "3",
            "text": "Atlandi ookeani"
          },
          {
            "id": "4",
            "text": "Lõuna-Jäämere"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q043",
      "unitId": "lo-opik-u16",
      "stem": "Milline ookean jääb Ameerika ja Aasia vahele?",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-pacific-location",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaikne ookean paikneb Ameerika ja Aasia vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Vaikne ookean"
          },
          {
            "id": "2",
            "text": "Atlandi ookean"
          },
          {
            "id": "3",
            "text": "India ookean"
          },
          {
            "id": "4",
            "text": "Põhja-Jäämeri"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q044",
      "unitId": "lo-opik-u16",
      "stem": "Milline ookean asub põhjapooluse lähedal?",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-arctic-location",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja-Jäämeri paikneb põhjapooluse ümbruses.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Atlandi ookean"
          },
          {
            "id": "2",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "3",
            "text": "India ookean"
          },
          {
            "id": "4",
            "text": "Lõuna-Jäämeri"
          }
        ],
        "correctOptionId": "2"
      }
    },
    {
      "id": "lo-opik-u16-q045",
      "unitId": "lo-opik-u16",
      "stem": "Milline ookean ümbritseb Antarktist?",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-southern-location",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktise ümber asub Lõuna-Jäämeri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "India ookean"
          },
          {
            "id": "2",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "3",
            "text": "Lõuna-Jäämeri"
          },
          {
            "id": "4",
            "text": "Atlandi ookean"
          }
        ],
        "correctOptionId": "3"
      }
    },
    {
      "id": "lo-opik-u16-q046",
      "unitId": "lo-opik-u16",
      "stem": "Leia jooniselt Antarktise ümber paiknev ookean.",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-map-southern",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõuna-Jäämeri paikneb maakera lõunaosas Antarktise juures.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-five-oceans",
        "correctRegionId": "southern"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-five-oceans"
      }
    },
    {
      "id": "lo-opik-u16-q047",
      "unitId": "lo-opik-u16",
      "stem": "Leia jooniselt ookean, mille keskosa on põhjapooluse ümbruses.",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-map-arctic",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja-Jäämeri paikneb põhjapooluse ümbruses.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-five-oceans",
        "correctRegionId": "arctic"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-five-oceans"
      }
    },
    {
      "id": "lo-opik-u16-q048",
      "unitId": "lo-opik-u16",
      "stem": "Ühenda ookean selle asukohaga.",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-ocean-map-pairing",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeanide asukoha määrab see, milliste mandrite juures need paiknevad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
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
            "text": "India ookean"
          },
          {
            "id": "p3",
            "text": "Lõuna-Jäämeri"
          },
          {
            "id": "p4",
            "text": "Põhja-Jäämeri"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Ameerika ning Euroopa ja Aafrika vahel"
          },
          {
            "id": "c2",
            "text": "Aafrika, Aasia ja Austraalia vahel"
          },
          {
            "id": "c3",
            "text": "Antarktise ümber"
          },
          {
            "id": "c4",
            "text": "põhjapooluse ümbruses"
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
      "id": "lo-opik-u16-q049",
      "unitId": "lo-opik-u16",
      "stem": "Rühmita ookeanid nende asukoha järgi.",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-ocean-position-categories",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja- ja Lõuna-Jäämeri on polaaralade juures.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "polar",
            "text": "Polaaralade juures"
          },
          {
            "id": "other",
            "text": "Suured ookeanid mujal maailmas"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "i2",
            "text": "Lõuna-Jäämeri"
          },
          {
            "id": "i3",
            "text": "Vaikne ookean"
          },
          {
            "id": "i4",
            "text": "India ookean"
          },
          {
            "id": "i5",
            "text": "Atlandi ookean"
          }
        ],
        "correctGroupByItem": {
          "i1": "polar",
          "i2": "polar",
          "i3": "other",
          "i4": "other",
          "i5": "other"
        }
      }
    },
    {
      "id": "lo-opik-u16-q050",
      "unitId": "lo-opik-u16",
      "stem": "Miks on mõnel maailmakaardil Vaikne ookean nii vasakul kui ka paremal serval?",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-map-pacific-edges",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa pind on kerakujuline ja laotatud kaardiks; Vaikne ookean on sellest hoolimata üks ookean.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Tasapinnaliseks tehtud maailmakaart katkestab ühe ühendatud ookeani pildi servades."
          },
          {
            "id": "2",
            "text": "Maailmas on kaks Vaikset ookeani."
          },
          {
            "id": "3",
            "text": "Vesi liigub ainult läänest itta."
          },
          {
            "id": "4",
            "text": "Vaikne ookean on hoopis järv."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q051",
      "unitId": "lo-opik-u16",
      "stem": "Maailmakaardil on sinine ala Euroopast läänes, kuid Lõuna-Ameerikast idas. Mis ookean see on?",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-world-map-inference",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandi ookean asub Euroopa ja Ameerika vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Atlandi ookean"
          },
          {
            "id": "2",
            "text": "India ookean"
          },
          {
            "id": "3",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "4",
            "text": "Vaikne ookean"
          }
        ],
        "correctOptionId": "1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Vaatle maailmakaardi mandrite asukohti: Euroopa paremal, Lõuna-Ameerika vasakul."
        ]
      }
    },
    {
      "id": "lo-opik-u16-q052",
      "unitId": "lo-opik-u16",
      "stem": "Ühenda ookean ja lihtne kaardivihje.",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-ocean-directions-match",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaikne, Atlandi ja India ookean on eristatavad mandrite asukoha järgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Vaikne ookean"
          },
          {
            "id": "p2",
            "text": "Atlandi ookean"
          },
          {
            "id": "p3",
            "text": "India ookean"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Ameerika lääneranniku ääres"
          },
          {
            "id": "c2",
            "text": "Ameerika idaranniku ääres"
          },
          {
            "id": "c3",
            "text": "Aasiast lõunas"
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
      "id": "lo-opik-u16-q053",
      "unitId": "lo-opik-u16",
      "stem": "Milline ookean on Ameerika idaranniku läheduses?",
      "primaryObjectiveId": "lo-opik-u16-o4",
      "variantGroupId": "lo-opik-u16-g-classify-map-oceans",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ameerika idarannikut uhub Atlandi ookean.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "64-65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Atlandi ookean"
          },
          {
            "id": "2",
            "text": "India ookean"
          },
          {
            "id": "3",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "4",
            "text": "Lõuna-Jäämeri"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q054",
      "unitId": "lo-opik-u16",
      "stem": "Millises piirkonnas on õpiku järgi ookeanide vahelised piirid eriti kokkuleppelised?",
      "primaryObjectiveId": "lo-opik-u16-o5",
      "variantGroupId": "lo-opik-u16-g-boundaries-south",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeanide lõunaosad on ühendatud ja piirid seal kokkuleppelised.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "lõunapoolkeral, kus ookeanide lõunaosad kohtuvad"
          },
          {
            "id": "2",
            "text": "ainult Eesti järvedel"
          },
          {
            "id": "3",
            "text": "iga mäe tipus"
          },
          {
            "id": "4",
            "text": "ainult kõrbetes"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q055",
      "unitId": "lo-opik-u16",
      "stem": "Miks ei saa lõunas alati ookeanide vahele tõmmata nähtavat piiri?",
      "primaryObjectiveId": "lo-opik-u16-o5",
      "variantGroupId": "lo-opik-u16-g-boundaries-south",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmamere osade kokkupuutealad ei ole vees nähtavate joontega eraldatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Vesi on seal ühendatud ning piirid on inimeste kokkulepe."
          },
          {
            "id": "2",
            "text": "Seal pole ühtki veepiiska."
          },
          {
            "id": "3",
            "text": "Ookeanid on seal betoonseinaga eraldatud."
          },
          {
            "id": "4",
            "text": "Seal on ainult järved."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q056",
      "unitId": "lo-opik-u16",
      "stem": "Mis aitab maailmameres eri ookeanide piirkondi eristada?",
      "primaryObjectiveId": "lo-opik-u16-o5",
      "variantGroupId": "lo-opik-u16-g-continents-divide",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrid paiknevad ookeanide eri osade vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "mandrite paiknemine"
          },
          {
            "id": "2",
            "text": "pilvede kuju"
          },
          {
            "id": "3",
            "text": "teede pikkus"
          },
          {
            "id": "4",
            "text": "linnade arv"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q057",
      "unitId": "lo-opik-u16",
      "stem": "Õige või vale? Mandrid paiknevad ookeanide vahel, kuid kõik ookeanid pole üksteisest täiesti eraldatud.",
      "primaryObjectiveId": "lo-opik-u16-o5",
      "variantGroupId": "lo-opik-u16-g-continents-divide",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeanid on ühe maailmamere osad, mandrid aitavad neid piirkondi eristada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
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
      "id": "lo-opik-u16-q058",
      "unitId": "lo-opik-u16",
      "stem": "Kaardil on kahe ookeani vahel joon avaveel. Mida see joon näitab?",
      "primaryObjectiveId": "lo-opik-u16-o5",
      "variantGroupId": "lo-opik-u16-g-border-not-wall",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeanidevahelised piirid võivad olla kaardil kokkuleppelised, mitte füüsilised takistused.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "kokkuleppelist piiri kahe piirkonna vahel"
          },
          {
            "id": "2",
            "text": "vees seisvat betoonmüüri"
          },
          {
            "id": "3",
            "text": "kohustuslikku laevateed"
          },
          {
            "id": "4",
            "text": "jõe suuet"
          }
        ],
        "correctOptionId": "1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Joon on tõmmatud meres, kus kummalgi pool on vaba veeväli."
        ]
      }
    },
    {
      "id": "lo-opik-u16-q059",
      "unitId": "lo-opik-u16",
      "stem": "Õige või vale? Ookeani piiril on alati nähtav sein, mis vett ei lase läbi.",
      "primaryObjectiveId": "lo-opik-u16-o5",
      "variantGroupId": "lo-opik-u16-g-border-not-wall",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vesi saab ookeanide vahel liikuda. Piirid on sageli kokkuleppelised.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
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
      "id": "lo-opik-u16-q060",
      "unitId": "lo-opik-u16",
      "stem": "Kolm ookeani puutuvad lõunas kokku. Milline väide on õige?",
      "primaryObjectiveId": "lo-opik-u16-o5",
      "variantGroupId": "lo-opik-u16-g-boundaries-south",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõunas ei määra ookeanide piire alati mandrid, mistõttu kasutatakse kokkuleppeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Piiride täpne asukoht võib sõltuda kokkuleppest."
          },
          {
            "id": "2",
            "text": "Nad on kolm täiesti eraldi suletud järve."
          },
          {
            "id": "3",
            "text": "Nende vahel on alati maismaariba."
          },
          {
            "id": "4",
            "text": "Iga ookean peab olema mageveega."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q061",
      "unitId": "lo-opik-u16",
      "stem": "Vali kaks õiget väidet ookeanide piiride kohta.",
      "primaryObjectiveId": "lo-opik-u16-o5",
      "variantGroupId": "lo-opik-u16-g-continents-and-south",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrid aitavad piirkondi eristada, kuid lõunapoolkeral on piirid osalt kokkuleppelised.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "1",
            "text": "Mandrid aitavad ookeane eristada."
          },
          {
            "id": "2",
            "text": "Lõunas on osa ookeanidevahelisi piire kokkuleppelised."
          },
          {
            "id": "3",
            "text": "Igal ookeanil on eraldi suletud vesi."
          },
          {
            "id": "4",
            "text": "Ookeanidel on alati müürid vahel."
          }
        ],
        "correctOptionIds": [
          "1",
          "2"
        ]
      }
    },
    {
      "id": "lo-opik-u16-q062",
      "unitId": "lo-opik-u16",
      "stem": "Millist järeldust saab teha kokkuleppelise ookeanipiiri kohta?",
      "primaryObjectiveId": "lo-opik-u16-o5",
      "variantGroupId": "lo-opik-u16-g-interpret-border-map",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeanipiiri näitamine kaardil ei tähenda, et looduses oleks samas kohas selgelt nähtav joon.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Piiri asukoht tuleneb kaardikokkuleppest, mitte vees nähtavast joonest."
          },
          {
            "id": "2",
            "text": "Seda piiri saab määrata vee värvi järgi."
          },
          {
            "id": "3",
            "text": "Ookeanid ei puutu kunagi kokku."
          },
          {
            "id": "4",
            "text": "Ookeanid paiknevad ainult ühel poolkeral."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q063",
      "unitId": "lo-opik-u16",
      "stem": "Miks saab eri nimedega ookeanides sõita ühest teise?",
      "primaryObjectiveId": "lo-opik-u16-o5",
      "variantGroupId": "lo-opik-u16-g-one-ocean",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeanide vesi on ühendatud ühtseks maailmamereks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Need on ühendatud maailmamere osad."
          },
          {
            "id": "2",
            "text": "Kõik ookeanid on kuivad."
          },
          {
            "id": "3",
            "text": "Laev peab alati maismaal sõitma."
          },
          {
            "id": "4",
            "text": "Nende vahel on ainult liumägi."
          }
        ],
        "correctOptionId": "1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u16-o2"
      ]
    },
    {
      "id": "lo-opik-u16-q064",
      "unitId": "lo-opik-u16",
      "stem": "Mida nimetatakse mereks?",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-sea-definition",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meri on tavaliselt ookeanist väiksem soolase vee ala.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "tavaliselt ookeanist väiksemat soolase vee ala"
          },
          {
            "id": "2",
            "text": "kahest mäest koosnevat ala"
          },
          {
            "id": "3",
            "text": "mandrivahelist kuiva teed"
          },
          {
            "id": "4",
            "text": "iga mageveejärve"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q065",
      "unitId": "lo-opik-u16",
      "stem": "Õige või vale? Mered asuvad sageli maismaa lähedal ja on tavaliselt ookeanidest väiksemad.",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-sea-definition",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mered on tavaliselt ookeanist väiksemad ja sageli osaliselt maismaaga ümbritsetud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
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
      "id": "lo-opik-u16-q066",
      "unitId": "lo-opik-u16",
      "stem": "Mis on väin?",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-strait-definition",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Väin on kitsam vesi kahe maismaaosa vahel ning ühendab veealasid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "kitsas veeala, mis ühendab veealasid"
          },
          {
            "id": "2",
            "text": "merepõhja kõrgem mägi"
          },
          {
            "id": "3",
            "text": "ookeanist eraldatud kõrb"
          },
          {
            "id": "4",
            "text": "metsade vahel voolav tuul"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q067",
      "unitId": "lo-opik-u16",
      "stem": "Milline sõna sobib veealale, mis kulgeb kahe saare vahel ja ühendab meresid?",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-strait-definition",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kahe maismaaosa vahele jääv ühendustee on väin.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "väin"
          },
          {
            "id": "2",
            "text": "mägi"
          },
          {
            "id": "3",
            "text": "kõrb"
          },
          {
            "id": "4",
            "text": "jääväli"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q068",
      "unitId": "lo-opik-u16",
      "stem": "Mis on laht?",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-bay-definition",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laht on mere või ookeani osa, mis ulatub maismaa sisse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "maismaa sisse ulatuv veeala"
          },
          {
            "id": "2",
            "text": "ookeani kohal olev pilv"
          },
          {
            "id": "3",
            "text": "kahe mäe vaheline jääorg"
          },
          {
            "id": "4",
            "text": "mandri kõige kõrgem tipp"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q069",
      "unitId": "lo-opik-u16",
      "stem": "Miks nimetatakse rannajoone sissesopistust laheks?",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-bay-definition",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laht on osaliselt maismaaga ümbritsetud mereveeala.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Merevesi ulatub seal maismaa sisse."
          },
          {
            "id": "2",
            "text": "Seal pole vett."
          },
          {
            "id": "3",
            "text": "See on alati täisringikujuline järv."
          },
          {
            "id": "4",
            "text": "Laht asub ainult jõepõhjas."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q070",
      "unitId": "lo-opik-u16",
      "stem": "Ühenda mõiste ja selgitus.",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-match-waterforms",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meri on maailmamere osa; väin ühendab veealasid; laht ulatub maismaasse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "meri"
          },
          {
            "id": "p2",
            "text": "väin"
          },
          {
            "id": "p3",
            "text": "laht"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "ookeaniga ühendatud väiksem soolase vee ala"
          },
          {
            "id": "c2",
            "text": "kitsas veeühendus kahe maismaaosa vahel"
          },
          {
            "id": "c3",
            "text": "maismaa sisse ulatuv veeala"
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
      "id": "lo-opik-u16-q071",
      "unitId": "lo-opik-u16",
      "stem": "Rühmita veealade kirjeldused.",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-group-waterforms",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sõnade eristamiseks vaata, kas vesi ühendab kahte ala, ulatub maismaasse või on meri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "strait",
            "text": "Väin"
          },
          {
            "id": "bay",
            "text": "Laht"
          },
          {
            "id": "sea",
            "text": "Meri"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "kitsas mereühendus kahe maaosa vahel"
          },
          {
            "id": "i2",
            "text": "ranniku sissesopistus, kuhu meri ulatub"
          },
          {
            "id": "i3",
            "text": "suurem soolase vee ala ranniku juures"
          }
        ],
        "correctGroupByItem": {
          "i1": "strait",
          "i2": "bay",
          "i3": "sea"
        }
      }
    },
    {
      "id": "lo-opik-u16-q072",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta joonisel väina.",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-hotspot-waterforms",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Väin on kitsas ühendustee kahe veeala vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-water-forms",
        "correctRegionId": "strait"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-water-forms"
      }
    },
    {
      "id": "lo-opik-u16-q073",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta joonisel lahte.",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-hotspot-waterforms",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laht ulatub maismaasse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-water-forms",
        "correctRegionId": "bay"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-water-forms"
      }
    },
    {
      "id": "lo-opik-u16-q074",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta joonisel merd.",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-sea-hotspot",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meri on suurem soolase vee ala maismaa juures.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-water-forms",
        "correctRegionId": "sea"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-water-forms"
      }
    },
    {
      "id": "lo-opik-u16-q075",
      "unitId": "lo-opik-u16",
      "stem": "Rannikukaardil ulatub sinine veeosa pikalt maismaa sisse. Mis see on?",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-bay-definition",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maismaa sisse ulatuv merevee osa on laht.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "laht"
          },
          {
            "id": "2",
            "text": "mägi"
          },
          {
            "id": "3",
            "text": "kõrb"
          },
          {
            "id": "4",
            "text": "poolsaar"
          }
        ],
        "correctOptionId": "1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Rannajoon teeb suure sissesopistuse, kuhu ulatub merevesi."
        ]
      }
    },
    {
      "id": "lo-opik-u16-q076",
      "unitId": "lo-opik-u16",
      "stem": "Kaardil on kaks merd, mida ühendab kitsas veetee. Mis on selle veetee nimi?",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-strait-definition",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Väin ühendab kahe maismaaosa vahel veealasid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "väin"
          },
          {
            "id": "2",
            "text": "mägi"
          },
          {
            "id": "3",
            "text": "soolajärv"
          },
          {
            "id": "4",
            "text": "mets"
          }
        ],
        "correctOptionId": "1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Kaks suurt veekogu paiknevad teineteise kõrval. Maismaa vahele jääb kitsas veeriba."
        ]
      }
    },
    {
      "id": "lo-opik-u16-q077",
      "unitId": "lo-opik-u16",
      "stem": "Mis tunnus eristab väina lahest?",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-distinguish-sea-strait-bay",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Väin on ühendustee, laht on ranniku sissesopistus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Väin ühendab kahte veeala, laht ulatub maismaa sisse."
          },
          {
            "id": "2",
            "text": "Laht on alati mageveega."
          },
          {
            "id": "3",
            "text": "Väin asub ainult kõrbes."
          },
          {
            "id": "4",
            "text": "Väin on kindlasti suurem kui ookean."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q078",
      "unitId": "lo-opik-u16",
      "stem": "Milline õpiku kaardil olev nimi tähistab lahte?",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-examples-bays",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome laht on laht, mitte ookean.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Soome laht"
          },
          {
            "id": "2",
            "text": "Atlandi ookean"
          },
          {
            "id": "3",
            "text": "India ookean"
          },
          {
            "id": "4",
            "text": "Lõuna-Jäämeri"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q079",
      "unitId": "lo-opik-u16",
      "stem": "Vali kõik nimetused, mis sisaldavad lahe nime.",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-examples-bays",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome, Guinea ja Bengali laht on õpiku kaardil lahed.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "1",
            "text": "Soome laht"
          },
          {
            "id": "2",
            "text": "Guinea laht"
          },
          {
            "id": "3",
            "text": "India ookean"
          },
          {
            "id": "4",
            "text": "Vaikne ookean"
          },
          {
            "id": "5",
            "text": "Bengali laht"
          }
        ],
        "correctOptionIds": [
          "1",
          "2",
          "5"
        ]
      }
    },
    {
      "id": "lo-opik-u16-q080",
      "unitId": "lo-opik-u16",
      "stem": "Millises vastuses on kaks veekogu õigesti liigitatud?",
      "primaryObjectiveId": "lo-opik-u16-o6",
      "variantGroupId": "lo-opik-u16-g-gulf-of-finland-group",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome laht on laht ja Läänemeri meri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Soome laht - laht; Läänemeri - meri"
          },
          {
            "id": "2",
            "text": "Soome laht - ookean; Läänemeri - mandriosa"
          },
          {
            "id": "3",
            "text": "Atlandi ookean - laht; Läänemeri - jõgi"
          },
          {
            "id": "4",
            "text": "Lõuna-Jäämeri - järv; Soome laht - saar"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q081",
      "unitId": "lo-opik-u16",
      "stem": "Mis on Eesti kodumeri?",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-home",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti kodumeri on Läänemeri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Läänemeri"
          },
          {
            "id": "2",
            "text": "India ookean"
          },
          {
            "id": "3",
            "text": "Vaikne ookean"
          },
          {
            "id": "4",
            "text": "Lõuna-Jäämeri"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q082",
      "unitId": "lo-opik-u16",
      "stem": "Õige või vale? Läänemeri asub Eesti ranniku ääres.",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-home",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti piirneb Läänemerega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
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
      "id": "lo-opik-u16-q083",
      "unitId": "lo-opik-u16",
      "stem": "Millise ookeani osa on Läänemeri?",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-atlantic-part",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänemeri on Atlandi ookeani osa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Atlandi ookeani"
          },
          {
            "id": "2",
            "text": "India ookeani"
          },
          {
            "id": "3",
            "text": "Vaikse ookeani"
          },
          {
            "id": "4",
            "text": "Lõuna-Jäämere"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q084",
      "unitId": "lo-opik-u16",
      "stem": "Miks loetakse Läänemeri Atlandi ookeani osaks?",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-atlantic-part",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänemeri on Taani väinade ja Põhjamere kaudu Atlandiga ühendatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        },
        {
          "kind": "supplementary",
          "url": "https://stateofthebalticsea.helcom.fi/overview/about-the-baltic-sea/",
          "attribution": "HELCOM"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "See on Atlandi ookeaniga veeteede kaudu ühendatud."
          },
          {
            "id": "2",
            "text": "See paikneb Vaikse ookeani keskel."
          },
          {
            "id": "3",
            "text": "See on maailmamerest eraldatud mageveejärv."
          },
          {
            "id": "4",
            "text": "See on suurem kui Atlandi ookean."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q085",
      "unitId": "lo-opik-u16",
      "stem": "Õige või vale? Läänemeri on üks viiest ookeanist.",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-not-ocean",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ei. Läänemeri on meri, Atlandi ookeani osa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
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
      "id": "lo-opik-u16-q086",
      "unitId": "lo-opik-u16",
      "stem": "Milline väide Läänemere kohta on õige?",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-not-ocean",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku järgi on ookeane viis ja Läänemeri kuulub Atlandi ookeani.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Läänemeri on meri, mitte kuues ookean."
          },
          {
            "id": "2",
            "text": "Läänemeri on kuues ookean."
          },
          {
            "id": "3",
            "text": "Läänemeri on manner."
          },
          {
            "id": "4",
            "text": "Läänemeri on maakera kõige suurem ookean."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q087",
      "unitId": "lo-opik-u16",
      "stem": "Millist ühendust näitab skeem Läänemere ja Atlandi ookeani vahel?",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-link-passage",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänemeri on Atlandi ookeaniga ühendatud Taani väinade ja Põhjamere kaudu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        },
        {
          "kind": "supplementary",
          "url": "https://stateofthebalticsea.helcom.fi/overview/about-the-baltic-sea/",
          "attribution": "HELCOM"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Taani väinad ning Põhjameri"
          },
          {
            "id": "2",
            "text": "India ookean ning Kuu"
          },
          {
            "id": "3",
            "text": "Põhja-Jäämeri ning Sahara"
          },
          {
            "id": "4",
            "text": "Vaikne ookean ning Antarktis"
          }
        ],
        "correctOptionId": "1"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-baltic-connection"
      }
    },
    {
      "id": "lo-opik-u16-q088",
      "unitId": "lo-opik-u16",
      "stem": "Järjesta Läänemere ühendus Atlandi ookeani suunas.",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-route",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Veeühendus kulgeb Läänemerest Taani väinade kaudu Põhjamerre ja Atlandi ookeani.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        },
        {
          "kind": "supplementary",
          "url": "https://stateofthebalticsea.helcom.fi/overview/about-the-baltic-sea/",
          "attribution": "HELCOM"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Läänemeri"
          },
          {
            "id": "i2",
            "text": "Taani väinad"
          },
          {
            "id": "i3",
            "text": "Põhjameri"
          },
          {
            "id": "i4",
            "text": "Atlandi ookean"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ]
      }
    },
    {
      "id": "lo-opik-u16-q089",
      "unitId": "lo-opik-u16",
      "stem": "Järjesta veeteekond Atlandi ookeanist Läänemerre.",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-route",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Atlandilt pääseb Põhjamere kaudu Taani väinadesse ja sealt Läänemerre.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        },
        {
          "kind": "supplementary",
          "url": "https://stateofthebalticsea.helcom.fi/overview/about-the-baltic-sea/",
          "attribution": "HELCOM"
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
            "text": "Põhjameri"
          },
          {
            "id": "i3",
            "text": "Taani väinad"
          },
          {
            "id": "i4",
            "text": "Läänemeri"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ]
      }
    },
    {
      "id": "lo-opik-u16-q090",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta skeemil Läänemerd.",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-diagram",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänemeri on Eesti kodumeri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-baltic-connection",
        "correctRegionId": "baltic"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-baltic-connection"
      }
    },
    {
      "id": "lo-opik-u16-q091",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta skeemil ookeani, mille osa Läänemeri on.",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-atlantic-part",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänemeri kuulub Atlandi ookeani.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-baltic-connection",
        "correctRegionId": "atlantic"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-baltic-connection"
      }
    },
    {
      "id": "lo-opik-u16-q092",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta skeemil kitsaid veeühendusi.",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-region-strait",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Taani väinad ühendavad Läänemere ja Põhjamere.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        },
        {
          "kind": "supplementary",
          "url": "https://stateofthebalticsea.helcom.fi/overview/about-the-baltic-sea/",
          "attribution": "HELCOM"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-baltic-connection",
        "correctRegionId": "straits"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-baltic-connection"
      }
    },
    {
      "id": "lo-opik-u16-q093",
      "unitId": "lo-opik-u16",
      "stem": "Puuduta skeemil merd, mis jääb Taani väinade ja Atlandi ookeani vahele.",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-region-north-sea",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Taani väinadest läänes paikneb Põhjameri, Atlandi ookeani osa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        },
        {
          "kind": "supplementary",
          "url": "https://stateofthebalticsea.helcom.fi/overview/about-the-baltic-sea/",
          "attribution": "HELCOM"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u16-baltic-connection",
        "correctRegionId": "north-sea"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u16-baltic-connection"
      }
    },
    {
      "id": "lo-opik-u16-q094",
      "unitId": "lo-opik-u16",
      "stem": "Ühenda nimetus ja roll.",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-pairs",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänemeri on seotud Atlandiga Taani väinade ja Põhjamere kaudu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        },
        {
          "kind": "supplementary",
          "url": "https://stateofthebalticsea.helcom.fi/overview/about-the-baltic-sea/",
          "attribution": "HELCOM"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Läänemeri"
          },
          {
            "id": "p2",
            "text": "Taani väinad"
          },
          {
            "id": "p3",
            "text": "Põhjameri"
          },
          {
            "id": "p4",
            "text": "Atlandi ookean"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Eesti kodumeri"
          },
          {
            "id": "c2",
            "text": "kitsad ühendusteed"
          },
          {
            "id": "c3",
            "text": "Läänemere ja Atlandi vaheline meri"
          },
          {
            "id": "c4",
            "text": "ookean, kuhu Läänemeri kuulub"
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
      "id": "lo-opik-u16-q095",
      "unitId": "lo-opik-u16",
      "stem": "Milline järeldus sobib joonisega?",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-family",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänemeri on Atlandi ookeaniga ühendatud ja kuulub maailmamerre.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        },
        {
          "kind": "supplementary",
          "url": "https://stateofthebalticsea.helcom.fi/overview/about-the-baltic-sea/",
          "attribution": "HELCOM"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Läänemeri on osa ühendatud maailmamerest."
          },
          {
            "id": "2",
            "text": "Läänemeri on eraldi mageveejärv."
          },
          {
            "id": "3",
            "text": "Atlandi ookean ei puutu ühegi merega kokku."
          },
          {
            "id": "4",
            "text": "Taani väinad on mandrid."
          }
        ],
        "correctOptionId": "1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Skeem: Läänemeri - Taani väinad - Põhjameri - Atlandi ookean."
        ]
      }
    },
    {
      "id": "lo-opik-u16-q096",
      "unitId": "lo-opik-u16",
      "stem": "Milline laht asub Läänemere osana Eesti põhjaranniku juures?",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-sea-gulf",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome laht on Läänemere osa Eesti põhjaranniku juures.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Soome laht"
          },
          {
            "id": "2",
            "text": "Bengali laht"
          },
          {
            "id": "3",
            "text": "Guinea laht"
          },
          {
            "id": "4",
            "text": "Pärsia laht"
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q097",
      "unitId": "lo-opik-u16",
      "stem": "Milline on õige seos?",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-hierarchy",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome laht kuulub Läänemerre ja Läänemeri Atlandi ookeani.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "1",
            "text": "Soome laht on Läänemere osa ja Läänemeri Atlandi ookeani osa."
          },
          {
            "id": "2",
            "text": "Läänemeri on Soome lahe osa ja Soome laht Vaikse ookeani osa."
          },
          {
            "id": "3",
            "text": "Atlandi ookean asub Peipsi järves."
          },
          {
            "id": "4",
            "text": "India ookean asub Läänemeres."
          }
        ],
        "correctOptionId": "1"
      }
    },
    {
      "id": "lo-opik-u16-q098",
      "unitId": "lo-opik-u16",
      "stem": "Rühmita veekogud tüübi järgi.",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-classification",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänemeri ja Põhjameri on mered; Atlandi ookean on ookean; Soome laht on laht.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "sea",
            "text": "Meri"
          },
          {
            "id": "ocean",
            "text": "Ookean"
          },
          {
            "id": "bay",
            "text": "Laht"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Läänemeri"
          },
          {
            "id": "i2",
            "text": "Põhjameri"
          },
          {
            "id": "i3",
            "text": "Atlandi ookean"
          },
          {
            "id": "i4",
            "text": "Soome laht"
          }
        ],
        "correctGroupByItem": {
          "i1": "sea",
          "i2": "sea",
          "i3": "ocean",
          "i4": "bay"
        }
      }
    },
    {
      "id": "lo-opik-u16-q099",
      "unitId": "lo-opik-u16",
      "stem": "Järjesta veealad väiksemast osast suurema tervikuni.",
      "primaryObjectiveId": "lo-opik-u16-o7",
      "variantGroupId": "lo-opik-u16-g-baltic-hierarchy",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome laht on Läänemere osa, Läänemeri kuulub Atlandi ookeani ning ookean maailmamerre.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "65"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Soome laht"
          },
          {
            "id": "i2",
            "text": "Läänemeri"
          },
          {
            "id": "i3",
            "text": "Atlandi ookean"
          },
          {
            "id": "i4",
            "text": "maailmameri"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ]
      }
    }
  ]
};
