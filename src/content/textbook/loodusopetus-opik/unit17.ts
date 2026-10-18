// Unit 17: Eesti geograafiline asend. Textbook pp. 66-67.
// Full answer keys are server-side only. Bump contentVersion when editing.
import type { Unit } from '@/lib/textbook/types';

export const unit17: Unit = {
  "id": "lo-opik-u17",
  "courseId": "loodusopetus-opik",
  "number": 17,
  "title": "Eesti geograafiline asend",
  "pages": {
    "from": 66,
    "to": 67
  },
  "status": "ready",
  "contentVersion": "2026-10-17.1",
  "objectives": [
    {
      "id": "lo-opik-u17-o1",
      "description": "Oskan selgitada, mida tähendab geograafiline asend, ning kirjeldada asukohta ilmakaarte ja loodusobjektidega.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ]
    },
    {
      "id": "lo-opik-u17-o2",
      "description": "Tean, miks Eesti paikneb ekvaatorist põhja pool ehk põhjapoolkeral.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ]
    },
    {
      "id": "lo-opik-u17-o3",
      "description": "Tean, miks Eesti paikneb nullmeridiaanist ida pool ehk idapoolkeral.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ]
    },
    {
      "id": "lo-opik-u17-o4",
      "description": "Oskan nimetada Eesti mandri ja maailmajao ning kirjeldada asukohta neis.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ]
    },
    {
      "id": "lo-opik-u17-o5",
      "description": "Oskan kirjeldada Eesti asukohta Läänemere ja Soome lahe suhtes.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ]
    },
    {
      "id": "lo-opik-u17-o6",
      "description": "Mõistan riigipiiri ja naaberriigi mõistet ning et piir võib järgida looduslikku objekti.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ]
    },
    {
      "id": "lo-opik-u17-o7",
      "description": "Oskan nimetada Eesti kaks maismaanaabrit ja nende ilmakaaresuuna.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ]
    },
    {
      "id": "lo-opik-u17-o8",
      "description": "Oskan nimetada Eesti kaks meretagust naabrit ning eristada neid maismaanaabritest.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u17-l1",
      "title": "Kuidas kirjeldada Eesti asukohta?",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u17-o1",
        "lo-opik-u17-o2",
        "lo-opik-u17-o3"
      ],
      "sections": [
        {
          "id": "lo-opik-u17-s001",
          "title": "Geograafiline asend aitab koha leida",
          "blocks": [
            {
              "id": "lo-opik-u17-b001",
              "type": "paragraph",
              "text": "Maal on palju riike. Kui tahame selgitada, kus üks riik asub, kirjeldame selle geograafilist asendit. Me ei pea ütlema aadressi: riigi asukohta saab kirjeldada ilmakaarte, mandrite, maailmajagude ja tähtsate veekogude abil.",
              "source": {
                "kind": "textbook",
                "pages": "66"
              }
            },
            {
              "id": "lo-opik-u17-b002",
              "type": "definition",
              "term": "Geograafiline asend",
              "definition": "Mingi paiga asukoht teiste paikade või tähtsate loodusobjektide suhtes. Seda kirjeldatakse muu hulgas ilmakaarte abil."
            },
            {
              "id": "lo-opik-u17-b003",
              "type": "list",
              "items": [
                "Ilmakaared: põhi, lõuna, ida ja lääs.",
                "Suured maa-alad: manner ja maailmajagu.",
                "Maakera pooled: poolkerad, mida aitavad määrata ekvaator ja nullmeridiaan."
              ]
            },
            {
              "id": "lo-opik-u17-b004",
              "type": "keyFact",
              "items": [
                "Asukohta saab kirjeldada ilmakaarte ja tuntud paikade suhtes.",
                "Geograafiline asend ei ole sama mis tänava-aadress."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u17-s002",
          "title": "Ekvaator jagab Maa kaheks",
          "blocks": [
            {
              "id": "lo-opik-u17-b005",
              "type": "paragraph",
              "text": "Ekvaator on kujuteldav joon ümber Maa keskkoha. Sellest põhja poole jääb põhjapoolkera ja lõuna poole lõunapoolkera. Eesti asub ekvaatorist põhja pool.",
              "source": {
                "kind": "textbook",
                "pages": "66"
              }
            },
            {
              "id": "lo-opik-u17-b006",
              "type": "diagram",
              "diagramId": "u17-hemispheres",
              "caption": "Vasakpoolsel gloobusel on näidatud põhja- ja lõunapoolkera. Parempoolsel gloobusel näitame ida- ja läänepoolkera. Joonis on mõistete selgitamiseks.",
              "source": {
                "kind": "textbook",
                "pages": "66"
              }
            },
            {
              "id": "lo-opik-u17-b007",
              "type": "keyFact",
              "items": [
                "Eesti asub ekvaatorist põhja pool.",
                "Seega paikneb Eesti põhjapoolkeral."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u17-s003",
          "title": "Nullmeridiaanist ida pool",
          "blocks": [
            {
              "id": "lo-opik-u17-b008",
              "type": "paragraph",
              "text": "Nullmeridiaan on kujuteldav joon põhjapoolusest lõunapooluseni. Nullmeridiaanist ida pool asub idapoolkera ning sellest lääne pool läänepoolkera. Eesti on nullmeridiaanist ida pool.",
              "source": {
                "kind": "textbook",
                "pages": "66"
              }
            },
            {
              "id": "lo-opik-u17-b009",
              "type": "comparison",
              "title": "Kaks eri jaotust",
              "columns": [
                {
                  "heading": "Ekvaator",
                  "points": [
                    "eristab põhja- ja lõunapoolkera",
                    "Eesti on põhjapoolkeral"
                  ]
                },
                {
                  "heading": "Nullmeridiaan",
                  "points": [
                    "eristab ida- ja läänepoolkera",
                    "Eesti on idapoolkeral"
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u17-b010",
              "type": "keyFact",
              "items": [
                "Eesti on idapoolkeral.",
                "Eesti asub korraga nii põhja- kui ka idapoolkeral."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u17-l2",
      "title": "Eesti maailmakaardil",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u17-o4"
      ],
      "sections": [
        {
          "id": "lo-opik-u17-s004",
          "title": "Mandri nimi on Euraasia",
          "blocks": [
            {
              "id": "lo-opik-u17-b011",
              "type": "paragraph",
              "text": "Meie õpiku kuue mandri jaotuses kuulub Eesti Euraasia mandrile. Euraasia on maailma suurim manner. Eesti asub Euraasia loodeosas.",
              "source": {
                "kind": "textbook",
                "pages": "66"
              }
            },
            {
              "id": "lo-opik-u17-b012",
              "type": "diagram",
              "diagramId": "u17-world-location",
              "caption": "Maailmakaardil on Euraasia manner ja Eesti asukoht tähistatud. Eesti on mandriga võrreldes nii väike, et täpselt tema suurust maailmakaardilt lugeda ei saa.",
              "source": {
                "kind": "textbook",
                "pages": "66"
              }
            },
            {
              "id": "lo-opik-u17-b013",
              "type": "keyFact",
              "items": [
                "Manner: Euraasia.",
                "Eesti paikneb Euraasia loodeosas."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u17-s005",
          "title": "Maailmajagu on Euroopa",
          "blocks": [
            {
              "id": "lo-opik-u17-b014",
              "type": "paragraph",
              "text": "Euraasia manner koosneb meie õpiku jaotuses kahest maailmajaost: Euroopast ja Aasiast. Eesti kuulub Euroopa maailmajakku. Euroopa piires asub Eesti põhjaosas.",
              "source": {
                "kind": "textbook",
                "pages": "66-67"
              }
            },
            {
              "id": "lo-opik-u17-b015",
              "type": "comparison",
              "title": "Kaks erinevat mõistet",
              "columns": [
                {
                  "heading": "Manner",
                  "points": [
                    "Euraasia",
                    "Eesti asub mandri loodeosas"
                  ]
                },
                {
                  "heading": "Maailmajagu",
                  "points": [
                    "Euroopa",
                    "Eesti asub maailmajao põhjaosas"
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u17-b016",
              "type": "keyFact",
              "items": [
                "Eesti manner on Euraasia ja maailmajagu Euroopa.",
                "Euroopa ei ole meie õpiku kuue mandri jaotuses omaette manner."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u17-s006",
          "title": "Leia Eesti Euroopast",
          "blocks": [
            {
              "id": "lo-opik-u17-b017",
              "type": "diagram",
              "diagramId": "u17-baltic-region",
              "caption": "Tegelikest üldistatud riigikontuuridest koostatud Läänemere ümbruse kaart. Eesti, naabrite ja merede asukohti saab jälgida ühes vaates.",
              "source": {
                "kind": "textbook",
                "pages": "67"
              }
            },
            {
              "id": "lo-opik-u17-b018",
              "type": "paragraph",
              "text": "Euroopa on suur maailmajagu. Eesti on selle põhjapoolses osas, Läänemere ääres. Euraasia on palju suurem kui Euroopa: seal paikneb lisaks Euroopale ka Aasia.",
              "source": {
                "kind": "textbook",
                "pages": "66-67"
              }
            },
            {
              "id": "lo-opik-u17-b019",
              "type": "keyFact",
              "items": [
                "Kui otsid Eestit maailmakaardilt, vaata Euraasia loodeosa.",
                "Kui otsid Eestit Euroopa kaardilt, vaata Läänemere idaosa."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u17-l3",
      "title": "Eesti ja teda ümbritsevad veekogud",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u17-o5"
      ],
      "sections": [
        {
          "id": "lo-opik-u17-s007",
          "title": "Läänemere idakallas",
          "blocks": [
            {
              "id": "lo-opik-u17-b020",
              "type": "paragraph",
              "text": "Eesti paikneb Läänemere idarannikul. See tähendab, et Läänemeri jääb Eesti suhtes suuresti lääne poole. Ka Eesti saared paiknevad Läänemeres.",
              "source": {
                "kind": "textbook",
                "pages": "67"
              }
            },
            {
              "id": "lo-opik-u17-b021",
              "type": "diagram",
              "diagramId": "u17-estonia-waters",
              "caption": "Eesti asub Läänemere idakaldal. Joonisel saab leida Läänemere, Soome lahe, Liivi lahe ning Peipsi järve.",
              "source": {
                "kind": "textbook",
                "pages": "67"
              }
            },
            {
              "id": "lo-opik-u17-b022",
              "type": "keyFact",
              "items": [
                "Eesti asub Läänemere idakaldal.",
                "Idakallas on mere idapoolne kallas, mitte mere läänekallas."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u17-s008",
          "title": "Soome lahe lõunakallas",
          "blocks": [
            {
              "id": "lo-opik-u17-b023",
              "type": "paragraph",
              "text": "Eesti põhjarannik asub Soome lahe lõunakaldal. Soome laht on Läänemere osa. Lahe vastaskaldal põhja pool asub Soome.",
              "source": {
                "kind": "textbook",
                "pages": "67"
              }
            },
            {
              "id": "lo-opik-u17-b024",
              "type": "table",
              "headers": [
                "Mis veekogu?",
                "Eesti asub..."
              ],
              "rows": [
                [
                  "Läänemeri",
                  "idakaldal"
                ],
                [
                  "Soome laht",
                  "lõunakaldal"
                ]
              ],
              "caption": "Nii saad Eestit kahe veekogu abil kirjeldada."
            },
            {
              "id": "lo-opik-u17-b025",
              "type": "keyFact",
              "items": [
                "Eesti on Soome lahe lõunakaldal.",
                "Soome asub teisel pool Soome lahte põhjas."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u17-s009",
          "title": "Mis on Eesti ümber veel?",
          "blocks": [
            {
              "id": "lo-opik-u17-b026",
              "type": "paragraph",
              "text": "Eesti lääneosas on Läänemeri ja selle lahed. Eesti kagupoolse piiri lähedal asub Peipsi järv, mille kaudu kulgeb osa Eesti ja Venemaa piirist. Veekogud aitavad meil asukohti kaardil ära tunda.",
              "source": {
                "kind": "textbook",
                "pages": "67"
              }
            },
            {
              "id": "lo-opik-u17-b027",
              "type": "enrichment",
              "variant": "extra",
              "title": "Lisateadmine: laht ja järv",
              "body": [
                "Eesti lääneosas asuv Liivi laht on samuti Läänemere osa. Peipsi ei ole meri, vaid suur järv. Need on kaardil head orientiirid, kuid täpsemaid nimede loendeid pole selle õpikutesti jaoks vaja."
              ]
            },
            {
              "id": "lo-opik-u17-b028",
              "type": "externalResource",
              "title": "Uuri Eesti kaarti",
              "intro": "Ava Maa- ja Ruumiameti kaart ning leia Eesti põhjarannik, Läänemeri ja Soome laht.",
              "url": "https://xgis.maaamet.ee/xgis2/page/app/maainfo",
              "publisher": "Maa- ja Ruumiamet",
              "resourceType": "interactive",
              "observe": "Kus asub Tallinn Soome lahe suhtes? Kus on Eesti läänerannik?"
            },
            {
              "id": "lo-opik-u17-b029",
              "type": "keyFact",
              "items": [
                "Eesti geograafilist asendit kirjeldavad nii maismaa kui veekogud."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u17-l4",
      "title": "Riigipiirid ja Eesti naabrid",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u17-o6",
        "lo-opik-u17-o7",
        "lo-opik-u17-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u17-s010",
          "title": "Mis on riigipiir?",
          "blocks": [
            {
              "id": "lo-opik-u17-b030",
              "type": "paragraph",
              "text": "Riigipiir on kokku lepitud piir, mis eraldab kahe riigi territooriumi. Kaardil näitame piiri joonega. Piir võib järgida jõge või järve, aga võib kulgeda ka nii, et looduses selget eraldavat joont pole.",
              "source": {
                "kind": "textbook",
                "pages": "67"
              }
            },
            {
              "id": "lo-opik-u17-b031",
              "type": "definition",
              "term": "Riigipiir",
              "definition": "Kahe riigi vahel kokku lepitud piir, kus ühe riigi territoorium lõpeb ja teise oma algab."
            },
            {
              "id": "lo-opik-u17-b032",
              "type": "definition",
              "term": "Naaberriik",
              "definition": "Riik, millega on ühine piir. Eesti õpik eristab ka meretaguseid naabreid."
            },
            {
              "id": "lo-opik-u17-b033",
              "type": "keyFact",
              "items": [
                "Kaardil märgitakse riigipiir kokkuleppelise joonega.",
                "Riigipiir ei pea alati kattuma jõe, järve või mäestikuga."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u17-s011",
          "title": "Kaks maismaanaabrit",
          "blocks": [
            {
              "id": "lo-opik-u17-b034",
              "type": "paragraph",
              "text": "Eestil on kaks maismaanaabrit: Läti asub lõunas ja Venemaa idas. Maismaanaabri juurde saab liikuda üle maismaapiiri. Osa Eesti ja Venemaa piirist järgib veekogusid.",
              "source": {
                "kind": "textbook",
                "pages": "67"
              }
            },
            {
              "id": "lo-opik-u17-b035",
              "type": "diagram",
              "diagramId": "u17-baltic-region",
              "caption": "Võrdle Eesti ja tema ümber paiknevate riikide asukohti. Õpiku maismaanaabrid on lõunas Läti ja idas Venemaa.",
              "source": {
                "kind": "textbook",
                "pages": "67"
              }
            },
            {
              "id": "lo-opik-u17-b036",
              "type": "table",
              "headers": [
                "Naaberriik",
                "Ilmakaar Eestist",
                "Liik"
              ],
              "rows": [
                [
                  "Läti",
                  "lõunas",
                  "maismaanaaber"
                ],
                [
                  "Venemaa",
                  "idas",
                  "maismaanaaber"
                ]
              ]
            },
            {
              "id": "lo-opik-u17-b037",
              "type": "keyFact",
              "items": [
                "Eestist lõunas on Läti.",
                "Eestist idas on Venemaa."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u17-s012",
          "title": "Kaks meretagust naabrit",
          "blocks": [
            {
              "id": "lo-opik-u17-b038",
              "type": "paragraph",
              "text": "Eestil on ka kaks meretagust naabrit: Soome põhjas teisel pool Soome lahte ja Rootsi läänes teisel pool Läänemerd. Nendeni ei saa Eestist otse üle kuiva maismaapiiri minna.",
              "source": {
                "kind": "textbook",
                "pages": "67"
              }
            },
            {
              "id": "lo-opik-u17-b039",
              "type": "table",
              "headers": [
                "Naaberriik",
                "Ilmakaar Eestist",
                "Liik"
              ],
              "rows": [
                [
                  "Soome",
                  "põhjas",
                  "meretagune naaber"
                ],
                [
                  "Rootsi",
                  "läänes",
                  "meretagune naaber"
                ]
              ]
            },
            {
              "id": "lo-opik-u17-b040",
              "type": "keyFact",
              "items": [
                "Soome on põhja pool üle Soome lahe.",
                "Rootsi on lääne pool üle Läänemere."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u17-s013",
          "title": "Neli naabrit kokku",
          "blocks": [
            {
              "id": "lo-opik-u17-b041",
              "type": "comparison",
              "title": "Eesti naaberriigid",
              "columns": [
                {
                  "heading": "Maismaanaabrid",
                  "points": [
                    "Läti: lõunas",
                    "Venemaa: idas"
                  ]
                },
                {
                  "heading": "Meretagused naabrid",
                  "points": [
                    "Soome: põhjas",
                    "Rootsi: läänes"
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u17-b042",
              "type": "paragraph",
              "text": "Eesti on üks kolmest Balti riigist. Teised kaks on Läti ja Leedu. Leedu asub Eestist lõuna pool, aga Eesti ja Leedu vahel paikneb Läti. Seepärast ei ole Leedu Eesti otsene naaberriik.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.studyinestonia.ee/index.php/estonia/state",
                "attribution": "Study in Estonia"
              }
            },
            {
              "id": "lo-opik-u17-b043",
              "type": "enrichment",
              "variant": "extra",
              "title": "Huvitav teada: Baltikum",
              "body": [
                "Balti riigid on Eesti, Läti ja Leedu. Ära aja segamini mõisteid \"Balti riigid\" ja \"Eesti naaberriigid\". Eesti naabrid on õpiku järgi neli riiki: Läti, Venemaa, Soome ja Rootsi."
              ]
            },
            {
              "id": "lo-opik-u17-b044",
              "type": "keyFact",
              "items": [
                "Eesti neli naabrit: Läti, Venemaa, Soome ja Rootsi.",
                "Maismaal Läti ja Venemaa; üle mere Soome ja Rootsi."
              ]
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u17-q001",
      "unitId": "lo-opik-u17",
      "stem": "Mida tähendab geograafiline asend?",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-definition-asend",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geograafiline asend kirjeldab, kus paik asub teiste paikade või loodusobjektide suhtes.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Koha asukohta teiste paikade ja loodusobjektide suhtes."
          },
          {
            "id": "c2",
            "text": "Riigi lipu värve."
          },
          {
            "id": "c3",
            "text": "Selle riigi kõige pikemat jõge."
          },
          {
            "id": "c4",
            "text": "Ainult riigi tänavaaadressi."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q002",
      "unitId": "lo-opik-u17",
      "stem": "Millised mõisted sobivad riigi geograafilise asendi kirjeldamiseks? Vali kõik.",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-description-tools",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Asukoha kirjeldamiseks kasutatakse ilmakaari, poolkerasid, mandreid ja loodusobjekte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "c1",
            "text": "ilmakaared"
          },
          {
            "id": "c2",
            "text": "poolkera"
          },
          {
            "id": "c3",
            "text": "manner"
          },
          {
            "id": "c4",
            "text": "tähtis meri"
          },
          {
            "id": "c5",
            "text": "lipu värvid"
          },
          {
            "id": "c6",
            "text": "riigi hümn"
          }
        ],
        "correctOptionIds": [
          "c1",
          "c2",
          "c3",
          "c4"
        ]
      }
    },
    {
      "id": "lo-opik-u17-q003",
      "unitId": "lo-opik-u17",
      "stem": "Kumb lause kirjeldab Eesti geograafilist asendit?",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-description-nature",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänemeri on loodusobjekt ja idakallas määrab selle suhtes asukoha.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Eesti asub Läänemere idakaldal."
          },
          {
            "id": "c2",
            "text": "Eesti lipul on kolm värvi."
          },
          {
            "id": "c3",
            "text": "Eestis on palju koole."
          },
          {
            "id": "c4",
            "text": "Eesti hümn on laul."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q004",
      "unitId": "lo-opik-u17",
      "stem": "Mis aitab kirjeldada, kas paik asub teisest kohast idas või läänes?",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-direction-asend",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ilmakaared näitavad kirjeldada asukohta teiste paikade suhtes.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "ilmakaared"
          },
          {
            "id": "c2",
            "text": "rahvaarv"
          },
          {
            "id": "c3",
            "text": "aastaajad"
          },
          {
            "id": "c4",
            "text": "riigilipp"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q005",
      "unitId": "lo-opik-u17",
      "stem": "Rühmita väited: kas need kirjeldavad asukohta või mitte?",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-description-nature",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Asukohta kirjeldavad ilmakaared ja looduse paiknemine; lipp ja koolipäev seda ei tee.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "asukoht",
            "text": "Asukoht"
          },
          {
            "id": "muu",
            "text": "Muu teave"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Euroopa põhjaosas"
          },
          {
            "id": "i2",
            "text": "Läänemere ääres"
          },
          {
            "id": "i3",
            "text": "lipus on sinine värv"
          },
          {
            "id": "i4",
            "text": "koolipäev kestab mitu tundi"
          }
        ],
        "correctGroupByItem": {
          "i1": "asukoht",
          "i2": "asukoht",
          "i3": "muu",
          "i4": "muu"
        }
      }
    },
    {
      "id": "lo-opik-u17-q006",
      "unitId": "lo-opik-u17",
      "stem": "Millised loodusobjektid sobivad asukoha kirjeldamiseks?",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-description-tools",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Meri, järv, jõgi ja mäestik on loodusobjektid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "c1",
            "text": "meri"
          },
          {
            "id": "c2",
            "text": "järv"
          },
          {
            "id": "c3",
            "text": "jõgi"
          },
          {
            "id": "c4",
            "text": "mäestik"
          },
          {
            "id": "c5",
            "text": "hümn"
          },
          {
            "id": "c6",
            "text": "riigilipp"
          }
        ],
        "correctOptionIds": [
          "c1",
          "c2",
          "c3",
          "c4"
        ]
      }
    },
    {
      "id": "lo-opik-u17-q007",
      "unitId": "lo-opik-u17",
      "stem": "Jäärjesta Eesti asukoha nimetused suuremast maa-alast väiksemani.",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-scale-of-location",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa kuulub Euraasia koosseisu ja Eesti asub Euroopas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Euraasia manner"
          },
          {
            "id": "i2",
            "text": "Euroopa maailmajagu"
          },
          {
            "id": "i3",
            "text": "Eesti riik"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Suurim",
        "lastLabel": "Väikseim"
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o4"
      ]
    },
    {
      "id": "lo-opik-u17-q008",
      "unitId": "lo-opik-u17",
      "stem": "Milline kirjeldus aitaks välismaalasel Eesti maailmakaardilt leida?",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-description-nature",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geograafilisest asukohast räägib Euroopa põhjaosa ja Läänemere mainimine.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Euroopa põhjaosas, Läänemere ääres."
          },
          {
            "id": "c2",
            "text": "Ilus ja tore maa."
          },
          {
            "id": "c3",
            "text": "Siin elab palju õpilasi."
          },
          {
            "id": "c4",
            "text": "Meie lipul on kolm värvi."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q009",
      "unitId": "lo-opik-u17",
      "stem": "Liisa kirjutab Eesti kohta ühe lause. Milline sobib geograafilise asendi kirjeldamiseks?",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-description-nature",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhjapoolkera näitab Maa peal asukohta kirjeldada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Eesti on põhjapoolkeral."
          },
          {
            "id": "c2",
            "text": "Eesti rahvuslind on suitsupääsuke."
          },
          {
            "id": "c3",
            "text": "Tallinnas on palju tänavaid."
          },
          {
            "id": "c4",
            "text": "Eesti lipp on sinimustvalge."
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Liisa ülesanne on kirjutada asukohast, mitte Eesti sümbolitest."
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o2"
      ]
    },
    {
      "id": "lo-opik-u17-q010",
      "unitId": "lo-opik-u17",
      "stem": "Ühenda asukoha kirjeldamisel kasutatav mõiste näitega.",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-describe-matching",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Idapool on ilmakaart, Euraasia manner, Euroopa maailmajagu ja Soome laht veekogu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "ilmakaar"
          },
          {
            "id": "p2",
            "text": "manner"
          },
          {
            "id": "p3",
            "text": "maailmajagu"
          },
          {
            "id": "p4",
            "text": "veekogu"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "idapool"
          },
          {
            "id": "c2",
            "text": "Euraasia"
          },
          {
            "id": "c3",
            "text": "Euroopa"
          },
          {
            "id": "c4",
            "text": "Soome laht"
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
      "id": "lo-opik-u17-q011",
      "unitId": "lo-opik-u17",
      "stem": "Õige või vale? Ühe riigi asukohta saab kirjeldada nii ilmakaarte kui ka mandri abil.",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-description-tools",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jah. Asendi kirjeldamiseks kasutatakse mitut liiki mõisteid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
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
      "id": "lo-opik-u17-q012",
      "unitId": "lo-opik-u17",
      "stem": "Milline tabeli rida annab Eesti kohta asukohateavet?",
      "primaryObjectiveId": "lo-opik-u17-o1",
      "variantGroupId": "lo-opik-u17-g-description-nature",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rida B kirjeldab asukohta: Eesti asub Euroopas ja Läänemere kaldal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Rida B"
          },
          {
            "id": "c2",
            "text": "Rida A"
          },
          {
            "id": "c3",
            "text": "Rida C"
          },
          {
            "id": "c4",
            "text": "Ükski rida ei sobi"
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Rida",
          "Kirjeldus"
        ],
        "rows": [
          [
            "A",
            "Eesti lipp on kolmevärviline."
          ],
          [
            "B",
            "Eesti on Euroopas Läänemere ääres."
          ],
          [
            "C",
            "Eesti rahvuslill on rukkilill."
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u17-q013",
      "unitId": "lo-opik-u17",
      "stem": "Millises poolkeras asub Eesti ekvaatori suhtes?",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-north-estonia",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub ekvaatorist põhja pool, seega põhjapoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "põhjapoolkeral"
          },
          {
            "id": "c2",
            "text": "lõunapoolkeral"
          },
          {
            "id": "c3",
            "text": "ekvaatori täpsel joonel"
          },
          {
            "id": "c4",
            "text": "kõigil poolkeradel korraga"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q014",
      "unitId": "lo-opik-u17",
      "stem": "Millised kaks poolkera eraldab ekvaator?",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-equator-divider",
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
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "põhja- ja lõunapoolkera"
          },
          {
            "id": "c2",
            "text": "ida- ja läänepoolkera"
          },
          {
            "id": "c3",
            "text": "Euroopa ja Aasia"
          },
          {
            "id": "c4",
            "text": "Eesti ja Läti"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q015",
      "unitId": "lo-opik-u17",
      "stem": "Puuduta joonisel põhjapoolkera.",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-north-hotspot",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaatorist põhja poole jääb põhjapoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u17-hemispheres",
        "correctRegionId": "north"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-hemispheres"
      }
    },
    {
      "id": "lo-opik-u17-q016",
      "unitId": "lo-opik-u17",
      "stem": "Puuduta joonisel lõunapoolkera.",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-south-hotspot",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaatorist lõuna poole jääb lõunapoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u17-hemispheres",
        "correctRegionId": "south"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-hemispheres"
      }
    },
    {
      "id": "lo-opik-u17-q017",
      "unitId": "lo-opik-u17",
      "stem": "Miks asub Eesti põhjapoolkeral?",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-north-estonia",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja- ja lõunapoolkera eristab ekvaator; Eesti asub sellest põhja pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Eesti jääb ekvaatorist põhja poole."
          },
          {
            "id": "c2",
            "text": "Eesti jääb nullmeridiaanist läände."
          },
          {
            "id": "c3",
            "text": "Eesti on oma suuruselt väike."
          },
          {
            "id": "c4",
            "text": "Eesti asub mere kaldal."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q018",
      "unitId": "lo-opik-u17",
      "stem": "Õige või vale? Eesti asub ekvaatorist lõuna pool.",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-north-estonia",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Eesti asub ekvaatorist põhja pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
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
      "id": "lo-opik-u17-q019",
      "unitId": "lo-opik-u17",
      "stem": "Õige või vale? Ekvaator jaotab Maa kaheks poolkeraks.",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-equator-divider",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaator on kujuteldav ring, mis eristab põhja- ja lõunapoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
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
      "id": "lo-opik-u17-q020",
      "unitId": "lo-opik-u17",
      "stem": "Rühmita: kas asukoht on ekvaatorist põhja või lõuna pool?",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-hemi-groups",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub põhjapoolkeral; lõunapoolkera paikneb ekvaatorist lõuna pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "north",
            "text": "Põhjas"
          },
          {
            "id": "south",
            "text": "Lõunas"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Eesti paiknemine"
          },
          {
            "id": "i2",
            "text": "põhjapoolkera"
          },
          {
            "id": "i3",
            "text": "lõunapoolkera"
          },
          {
            "id": "i4",
            "text": "ekvaatorist lõuna pool asuv maa"
          }
        ],
        "correctGroupByItem": {
          "i1": "north",
          "i2": "north",
          "i3": "south",
          "i4": "south"
        }
      }
    },
    {
      "id": "lo-opik-u17-q021",
      "unitId": "lo-opik-u17",
      "stem": "Millist joont vaadata, kui tahad teada, kas Eesti on põhja- või lõunapoolkeral?",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-equator-vs-prime",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja ja lõuna jaotuse määrab ekvaator.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "ekvaatorit"
          },
          {
            "id": "c2",
            "text": "nullmeridiaani"
          },
          {
            "id": "c3",
            "text": "riigipiiri Lätiga"
          },
          {
            "id": "c4",
            "text": "Läänemere rannajoont"
          }
        ],
        "correctOptionId": "c1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o3"
      ]
    },
    {
      "id": "lo-opik-u17-q022",
      "unitId": "lo-opik-u17",
      "stem": "Kui reisija liigub gloobusel ekvaatorist põhja poole, millisesse poolkerasse ta jõüab?",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-hemi-application",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaatorist põhja pool asub põhjapoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "põhjapoolkerale"
          },
          {
            "id": "c2",
            "text": "läänepoolkerale"
          },
          {
            "id": "c3",
            "text": "ainult idapoolkerale"
          },
          {
            "id": "c4",
            "text": "lõunapoolkerale"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q023",
      "unitId": "lo-opik-u17",
      "stem": "Kumb vaatleja on põhjapoolkeral?",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-hemi-application",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaatleja B paikneb ekvaatorist põhja pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Vaatleja B"
          },
          {
            "id": "c2",
            "text": "Vaatleja A"
          },
          {
            "id": "c3",
            "text": "mõlemad"
          },
          {
            "id": "c4",
            "text": "mitte kumbki"
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Vaatleja",
          "Asukoht"
        ],
        "rows": [
          [
            "A",
            "ekvaatorist lõuna pool"
          ],
          [
            "B",
            "ekvaatorist põhja pool"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u17-q024",
      "unitId": "lo-opik-u17",
      "stem": "Vali kõik väited, mis Eesti kohta sobivad.",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-north-estonia",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti paikneb ekvaatorist põhja pool, mitte ekvaatoril.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "c1",
            "text": "Eesti asub ekvaatorist põhjas."
          },
          {
            "id": "c2",
            "text": "Eesti asub põhjapoolkeral."
          },
          {
            "id": "c3",
            "text": "Eesti asub lõunapoolkeral."
          },
          {
            "id": "c4",
            "text": "Ekvaator kulgeb läbi Eesti."
          }
        ],
        "correctOptionIds": [
          "c1",
          "c2"
        ]
      }
    },
    {
      "id": "lo-opik-u17-q025",
      "unitId": "lo-opik-u17",
      "stem": "Millises poolkeras asub Eesti nullmeridiaani suhtes?",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-east-estonia",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub nullmeridiaanist ida pool ehk idapoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "idapoolkeral"
          },
          {
            "id": "c2",
            "text": "läänepoolkeral"
          },
          {
            "id": "c3",
            "text": "ainult lõunapoolkeral"
          },
          {
            "id": "c4",
            "text": "nullmeridiaani täpsel joonel"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q026",
      "unitId": "lo-opik-u17",
      "stem": "Millise kahe poolkera jaotust aitab määrata nullmeridiaan?",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-prime-divider",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaani kasutatakse ida- ja läänepoolkera eristamiseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "ida- ja läänepoolkera"
          },
          {
            "id": "c2",
            "text": "põhja- ja lõunapoolkera"
          },
          {
            "id": "c3",
            "text": "Euroopa ja Aasia"
          },
          {
            "id": "c4",
            "text": "Läti ja Eesti"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q027",
      "unitId": "lo-opik-u17",
      "stem": "Puuduta joonisel idapoolkera.",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-east-hotspot",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaanist ida poole jääb idapoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u17-hemispheres",
        "correctRegionId": "east"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-hemispheres"
      }
    },
    {
      "id": "lo-opik-u17-q028",
      "unitId": "lo-opik-u17",
      "stem": "Puuduta joonisel läänepoolkera.",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-west-hotspot",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaanist lääne pool asub läänepoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u17-hemispheres",
        "correctRegionId": "west"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-hemispheres"
      }
    },
    {
      "id": "lo-opik-u17-q029",
      "unitId": "lo-opik-u17",
      "stem": "Miks nimetatakse Eestit idapoolkeral asuvaks riigiks?",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-east-estonia",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ida- ja läänepoolkera eristamiseks kasutatakse nullmeridiaani.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Sest Eesti on nullmeridiaanist ida pool."
          },
          {
            "id": "c2",
            "text": "Sest Eesti asub Läänemere ääres."
          },
          {
            "id": "c3",
            "text": "Sest Eesti asub ekvaatorist põhjas."
          },
          {
            "id": "c4",
            "text": "Sest Euroopa on väike maailmajagu."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q030",
      "unitId": "lo-opik-u17",
      "stem": "Õige või vale? Eesti asub nullmeridiaanist lääne pool.",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-east-estonia",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Eesti asub nullmeridiaanist ida pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
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
      "id": "lo-opik-u17-q031",
      "unitId": "lo-opik-u17",
      "stem": "Kuhu kulgeb nullmeridiaan gloobusel?",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-prime-shape",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaan kulgeb põhjapooluselt lõunapooluseni.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "põhjapooluselt lõunapooluseni"
          },
          {
            "id": "c2",
            "text": "ümber ekvaatori"
          },
          {
            "id": "c3",
            "text": "Eesti-Läti piiri mööõda"
          },
          {
            "id": "c4",
            "text": "ainult ümber Põhja-Jäämere"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q032",
      "unitId": "lo-opik-u17",
      "stem": "Ühenda joon ja selle abil eristatavad poolkerad.",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-compare-lines",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaator eristab põhja/lõuna ja nullmeridiaan ida/lääne poolkerad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
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
            "text": "põhja ja lõuna"
          },
          {
            "id": "c2",
            "text": "ida ja lääne"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2"
        }
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o2"
      ]
    },
    {
      "id": "lo-opik-u17-q033",
      "unitId": "lo-opik-u17",
      "stem": "Rühmita kirjeldused idapoolkera või läänepoolkera alla.",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-east-west-classify",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub nullmeridiaanist ida pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
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
            "text": "Eesti"
          },
          {
            "id": "i2",
            "text": "nullmeridiaanist idas"
          },
          {
            "id": "i3",
            "text": "nullmeridiaanist läänes"
          },
          {
            "id": "i4",
            "text": "läänepoolkera"
          }
        ],
        "correctGroupByItem": {
          "i1": "east",
          "i2": "east",
          "i3": "west",
          "i4": "west"
        }
      }
    },
    {
      "id": "lo-opik-u17-q034",
      "unitId": "lo-opik-u17",
      "stem": "Mis aitab otsustada, kas paik on ida- või läänepoolkeral?",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-prime-divider",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nullmeridiaan on ida- ja läänepoolkera jaotuse aluseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "nullmeridiaan"
          },
          {
            "id": "c2",
            "text": "ekvaator"
          },
          {
            "id": "c3",
            "text": "Läänemeri"
          },
          {
            "id": "c4",
            "text": "Soome laht"
          }
        ],
        "correctOptionId": "c1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o2"
      ]
    },
    {
      "id": "lo-opik-u17-q035",
      "unitId": "lo-opik-u17",
      "stem": "Milline poolkerapaar kirjeldab Eesti asukohta õigesti?",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-combined-hemi",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti on ekvaatorist põhjas ja nullmeridiaanist idas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "põhja- ja idapoolkera"
          },
          {
            "id": "c2",
            "text": "lõuna- ja idapoolkera"
          },
          {
            "id": "c3",
            "text": "põhja- ja läänepoolkera"
          },
          {
            "id": "c4",
            "text": "lõuna- ja läänepoolkera"
          }
        ],
        "correctOptionId": "c1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o2"
      ]
    },
    {
      "id": "lo-opik-u17-q036",
      "unitId": "lo-opik-u17",
      "stem": "Kaarel asub nullmeridiaanist ida pool ja ekvaatorist põhjas. Mis on tema poolkerad?",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-combined-hemi",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaatori järgi on Kaarel põhjapoolkeral ja nullmeridiaani järgi idapoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "ida- ja põhjapoolkera"
          },
          {
            "id": "c2",
            "text": "lääne- ja lõunapoolkera"
          },
          {
            "id": "c3",
            "text": "ainult idapoolkera"
          },
          {
            "id": "c4",
            "text": "lääne- ja põhjapoolkera"
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Kaarel vaatab gloobust ja määrab kahe joone abil oma asukohta."
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o2"
      ]
    },
    {
      "id": "lo-opik-u17-q037",
      "unitId": "lo-opik-u17",
      "stem": "Vali kõik Eesti asukoha kohta õiged poolkeraväited.",
      "primaryObjectiveId": "lo-opik-u17-o3",
      "variantGroupId": "lo-opik-u17-g-combined-hemi",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaatorist põhjas ja nullmeridiaanist idas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "c1",
            "text": "Eesti on idapoolkeral."
          },
          {
            "id": "c2",
            "text": "Eesti on põhjapoolkeral."
          },
          {
            "id": "c3",
            "text": "Eesti on läänepoolkeral."
          },
          {
            "id": "c4",
            "text": "Eesti on lõunapoolkeral."
          }
        ],
        "correctOptionIds": [
          "c1",
          "c2"
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o2"
      ]
    },
    {
      "id": "lo-opik-u17-q038",
      "unitId": "lo-opik-u17",
      "stem": "Mis mandril Eesti asub meie õpiku kuue mandri jaotuse järgi?",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-continent-name",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub Euraasia mandril.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Euraasias"
          },
          {
            "id": "c2",
            "text": "Aafrikas"
          },
          {
            "id": "c3",
            "text": "Põhja-Ameerikas"
          },
          {
            "id": "c4",
            "text": "Austraalias"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q039",
      "unitId": "lo-opik-u17",
      "stem": "Mis maailmajakku Eesti kuulub?",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-worldpart-name",
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
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Euroopasse"
          },
          {
            "id": "c2",
            "text": "Aasiasse"
          },
          {
            "id": "c3",
            "text": "Aafrikasse"
          },
          {
            "id": "c4",
            "text": "Ameerikasse"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q040",
      "unitId": "lo-opik-u17",
      "stem": "Puuduta maailmakaardil mandrit, kus Eesti asub.",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-continent-name",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub Euraasia mandri loodeosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u17-world-location",
        "correctRegionId": "eurasia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-world-location"
      }
    },
    {
      "id": "lo-opik-u17-q041",
      "unitId": "lo-opik-u17",
      "stem": "Milline mõistepaar kirjeldab Eesti asukohta õigesti?",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-worldpart-name",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on manner, Euroopa on maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "manner Euraasia, maailmajagu Euroopa"
          },
          {
            "id": "c2",
            "text": "manner Euroopa, maailmajagu Euraasia"
          },
          {
            "id": "c3",
            "text": "manner Aafrika, maailmajagu Euroopa"
          },
          {
            "id": "c4",
            "text": "manner Ameerika, maailmajagu Aasia"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q042",
      "unitId": "lo-opik-u17",
      "stem": "Millises Euraasia osas Eesti paikneb?",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-northwestern-eurasia",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti paikneb Euraasia loodeosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "loodeosas"
          },
          {
            "id": "c2",
            "text": "kagupoolses osas"
          },
          {
            "id": "c3",
            "text": "lõunapoolses osas"
          },
          {
            "id": "c4",
            "text": "idapoolses servas Vaikse ookeani ääres"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q043",
      "unitId": "lo-opik-u17",
      "stem": "Millises Euroopa osas Eesti paikneb meie õpiku kirjelduse järgi?",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-northern-europe",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti paikneb Euroopa põhjaosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "põhjaosas"
          },
          {
            "id": "c2",
            "text": "kaguosas"
          },
          {
            "id": "c3",
            "text": "lääneranniku kaugeimas tipus"
          },
          {
            "id": "c4",
            "text": "lõunapoolses otsas"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q044",
      "unitId": "lo-opik-u17",
      "stem": "Miks saab Eesti kohta ölda nii \"Euraasias\" kui ka \"Euroopas\"?",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-eurasia-europe",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti paikneb Euroopa maailmajaos, mis on osa Euraasia mandrist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Euroopa on maailmajagu Euraasia mandril."
          },
          {
            "id": "c2",
            "text": "Euraasia on linn Eestis."
          },
          {
            "id": "c3",
            "text": "Euroopa ja Euraasia on alati sama mõiste."
          },
          {
            "id": "c4",
            "text": "Eesti paikneb korraga kahel eraldi mandril."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q045",
      "unitId": "lo-opik-u17",
      "stem": "Milliseks kaheks maailmajaoks jaotatakse Euraasia mandrit?",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-eurasia-two-parts",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia mandril on Euroopa ja Aasia maailmajaod.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "c1",
            "text": "Euroopa"
          },
          {
            "id": "c2",
            "text": "Aasia"
          },
          {
            "id": "c3",
            "text": "Antarktika"
          },
          {
            "id": "c4",
            "text": "Ameerika"
          }
        ],
        "correctOptionIds": [
          "c1",
          "c2"
        ]
      }
    },
    {
      "id": "lo-opik-u17-q046",
      "unitId": "lo-opik-u17",
      "stem": "Jäärjesta mõisted alates mandrist kuni riigini.",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-scale-of-location",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia mandril paikneb Euroopa maailmajagu; Eestis on oma riigipiir.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Euraasia"
          },
          {
            "id": "i2",
            "text": "Euroopa"
          },
          {
            "id": "i3",
            "text": "Eesti"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Manner",
        "lastLabel": "Riik"
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o1"
      ]
    },
    {
      "id": "lo-opik-u17-q047",
      "unitId": "lo-opik-u17",
      "stem": "Ühenda piirkond ja Eesti asend seal.",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-north-northwest-matching",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti on Euraasia loodeosas ning Euroopa põhjaosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Euraasia manner"
          },
          {
            "id": "p2",
            "text": "Euroopa maailmajagu"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "loodeosas"
          },
          {
            "id": "c2",
            "text": "põhjaosas"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2"
        }
      }
    },
    {
      "id": "lo-opik-u17-q048",
      "unitId": "lo-opik-u17",
      "stem": "Õige või vale? Meie õpiku kuue mandri jaotuses on Euroopa omaette manner.",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-world-part-vs-continent",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Euroopa on maailmajagu Euraasia mandril.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
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
      "id": "lo-opik-u17-q049",
      "unitId": "lo-opik-u17",
      "stem": "Mis lause sobib pildi kohta kõige paremini?",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-northwestern-eurasia",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmakaardil on Eesti tähistatud Euraasia loodeosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Eesti asub Euraasia loodeosas."
          },
          {
            "id": "c2",
            "text": "Eesti on Austraalia lõunaservas."
          },
          {
            "id": "c3",
            "text": "Eesti on Aafrika kagurannikul."
          },
          {
            "id": "c4",
            "text": "Eesti on Põhja-Ameerika keskel."
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-world-location"
      }
    },
    {
      "id": "lo-opik-u17-q050",
      "unitId": "lo-opik-u17",
      "stem": "Rühmita nimetused: kas manner, maailmajagu või riik?",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-classification-group",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on manner, Euroopa ja Aasia maailmajaod, Eesti riik.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "manner",
            "text": "Manner"
          },
          {
            "id": "jagu",
            "text": "Maailmajagu"
          },
          {
            "id": "riik",
            "text": "Riik"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Euraasia"
          },
          {
            "id": "i2",
            "text": "Euroopa"
          },
          {
            "id": "i3",
            "text": "Eesti"
          },
          {
            "id": "i4",
            "text": "Aasia"
          }
        ],
        "correctGroupByItem": {
          "i1": "manner",
          "i2": "jagu",
          "i3": "riik",
          "i4": "jagu"
        }
      }
    },
    {
      "id": "lo-opik-u17-q051",
      "unitId": "lo-opik-u17",
      "stem": "Mati vaatab Euroopa kaarti. Kus ta peaks Eestit otsima?",
      "primaryObjectiveId": "lo-opik-u17-o4",
      "variantGroupId": "lo-opik-u17-g-northern-europe",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub Euroopa põhjaosas, Läänemere idarannikul.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Euroopa põhjaosast Läänemere juurest"
          },
          {
            "id": "c2",
            "text": "Euroopa lõunaosast Vahemere keskelt"
          },
          {
            "id": "c3",
            "text": "Aafrika kõrbest"
          },
          {
            "id": "c4",
            "text": "Austraalia läänerannikult"
          }
        ],
        "correctOptionId": "c1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o5"
      ]
    },
    {
      "id": "lo-opik-u17-q052",
      "unitId": "lo-opik-u17",
      "stem": "Millisel Läänemere kaldal Eesti asub?",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-baltic-eastern-shore",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub Läänemere idakaldal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "idakaldal"
          },
          {
            "id": "c2",
            "text": "läänekaldal"
          },
          {
            "id": "c3",
            "text": "lõunakaldal"
          },
          {
            "id": "c4",
            "text": "Läänemeri ei puutu Eestiga kokku"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q053",
      "unitId": "lo-opik-u17",
      "stem": "Millisel Soome lahe kaldal Eesti asub?",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-gulf-southern-shore",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub Soome lahe lõunakaldal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "lõunakaldal"
          },
          {
            "id": "c2",
            "text": "põhjakaldal"
          },
          {
            "id": "c3",
            "text": "idapoolses otsas Venemaast idas"
          },
          {
            "id": "c4",
            "text": "Soome lahel pole kallast"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q054",
      "unitId": "lo-opik-u17",
      "stem": "Puuduta kaardil Läänemere avaosa Eestist lääne pool.",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-baltic-hotspot",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti paikneb Läänemere idakaldal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u17-estonia-waters",
        "correctRegionId": "baltic-sea"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-estonia-waters"
      }
    },
    {
      "id": "lo-opik-u17-q055",
      "unitId": "lo-opik-u17",
      "stem": "Puuduta kaardil Soome lahte.",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-gulf-hotspot",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti põhjarannik on Soome lahe lõunakaldal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u17-estonia-waters",
        "correctRegionId": "gulf-finland"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-estonia-waters"
      }
    },
    {
      "id": "lo-opik-u17-q056",
      "unitId": "lo-opik-u17",
      "stem": "Ühenda veekogu ja kallas, millel Eesti asub.",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-shores-match",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub Läänemere ida- ja Soome lahe lõunakaldal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
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
            "text": "Soome laht"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "idakallas"
          },
          {
            "id": "c2",
            "text": "lõunakallas"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2"
        }
      }
    },
    {
      "id": "lo-opik-u17-q057",
      "unitId": "lo-opik-u17",
      "stem": "Õige või vale? Soome laht on Läänemere osa.",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-waters-true",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jah. Soome laht on Läänemere laht.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
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
      "id": "lo-opik-u17-q058",
      "unitId": "lo-opik-u17",
      "stem": "Millise veekogu kaldal on suur osa Eesti põhjarannikust?",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-gulf-southern-shore",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti põhjarannik paikneb Soome lahe lõunakaldal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Soome lahe"
          },
          {
            "id": "c2",
            "text": "India ookeani"
          },
          {
            "id": "c3",
            "text": "Vahemere"
          },
          {
            "id": "c4",
            "text": "Mustamere"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q059",
      "unitId": "lo-opik-u17",
      "stem": "Vali kõik Eesti asukohta õigesti kirjeldavad väited.",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-shores-match",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub Läänemere idakaldal ja Soome lahe lõunakaldal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "c1",
            "text": "Läänemere idakaldal"
          },
          {
            "id": "c2",
            "text": "Soome lahe lõunakaldal"
          },
          {
            "id": "c3",
            "text": "Läänemere läänekaldal"
          },
          {
            "id": "c4",
            "text": "Soome lahe põhjakaldal"
          }
        ],
        "correctOptionIds": [
          "c1",
          "c2"
        ]
      }
    },
    {
      "id": "lo-opik-u17-q060",
      "unitId": "lo-opik-u17",
      "stem": "Mis riik asub Soome lahe teisel kaldal Eestist põhja pool?",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-gulf-opposite",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome asub Soome lahe põhjakaldal, Eesti selle lõunakaldal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Soome"
          },
          {
            "id": "c2",
            "text": "Läti"
          },
          {
            "id": "c3",
            "text": "Leedu"
          },
          {
            "id": "c4",
            "text": "Rootsi"
          }
        ],
        "correctOptionId": "c1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o8"
      ]
    },
    {
      "id": "lo-opik-u17-q061",
      "unitId": "lo-opik-u17",
      "stem": "Kus asub Läänemere avaosa Eestist vaadates?",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-baltic-west",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti paikneb Läänemere idakaldal, nii et suur osa mereveest jääb läände.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "peamiselt läänes"
          },
          {
            "id": "c2",
            "text": "peamiselt idas"
          },
          {
            "id": "c3",
            "text": "ainult kaugel lõunas"
          },
          {
            "id": "c4",
            "text": "otse Euraasia sisemuses"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q062",
      "unitId": "lo-opik-u17",
      "stem": "Kui kaardil on meri Eestist lääne pool, kummal merekaldal on Eesti?",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-baltic-west",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui maa jääb merest ida poole, asub ta mere idakaldal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "idakaldal"
          },
          {
            "id": "c2",
            "text": "läänekaldal"
          },
          {
            "id": "c3",
            "text": "põhjakaldal"
          },
          {
            "id": "c4",
            "text": "mõlemal kaldal korraga"
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Vaata kujuteldavat kaarti. Põhi on üleval ja meri asub Eestist vasakul ehk läänes."
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o1"
      ]
    },
    {
      "id": "lo-opik-u17-q063",
      "unitId": "lo-opik-u17",
      "stem": "Reisija vaatab Eesti ja Soome vahelist veekogu. Mis veekogu ta näeb?",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-gulf-opposite",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti ja Soome vahel on Soome laht.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Soome laht"
          },
          {
            "id": "c2",
            "text": "Põhja-Jäämeri"
          },
          {
            "id": "c3",
            "text": "India ookean"
          },
          {
            "id": "c4",
            "text": "Peipsi järv"
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Kaardil asub Soome Eesti põhja pool. Nende vahel on merevesi."
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o8"
      ]
    },
    {
      "id": "lo-opik-u17-q064",
      "unitId": "lo-opik-u17",
      "stem": "Milline asukohakirjeldus vastab tabelile?",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-shores-match",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asendit kirjeldavad koos kaks rannikut.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Eesti on Läänemere ida- ja Soome lahe lõunakaldal."
          },
          {
            "id": "c2",
            "text": "Eesti on mõlema veekogu põhjakaldal."
          },
          {
            "id": "c3",
            "text": "Eesti asub Läänemere läänekaldal."
          },
          {
            "id": "c4",
            "text": "Soome laht paikneb Eestist lõuna pool."
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Veekogu",
          "Eesti asend"
        ],
        "rows": [
          [
            "Läänemeri",
            "idakallas"
          ],
          [
            "Soome laht",
            "lõunakallas"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u17-q065",
      "unitId": "lo-opik-u17",
      "stem": "Ühenda veekogu liigi ja õpikus nimetatud näitega.",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-water-categories",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läänemeri on meri, Soome laht laht ja Peipsi järv.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        },
        {
          "kind": "supplementary",
          "url": "https://www.entsyklopeedia.ee/artikkel/eesti_asend",
          "attribution": "Eesti Entsüklopeedia"
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
            "text": "laht"
          },
          {
            "id": "p3",
            "text": "järv"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Läänemeri"
          },
          {
            "id": "c2",
            "text": "Soome laht"
          },
          {
            "id": "c3",
            "text": "Peipsi"
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
      "id": "lo-opik-u17-q066",
      "unitId": "lo-opik-u17",
      "stem": "Mis on riigipiir?",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-border-definition",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiir näitab, kus ühe riigi territoorium lõpeb ja teise algab.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Kahe riigi territooriumi eraldav kokku lepitud piir."
          },
          {
            "id": "c2",
            "text": "Iga tee kahe linna vahel."
          },
          {
            "id": "c3",
            "text": "Ainult mäetipp."
          },
          {
            "id": "c4",
            "text": "Lause riigilipul."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q067",
      "unitId": "lo-opik-u17",
      "stem": "Millega kujutatakse riigipiiri kaardil?",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-border-map",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiir on kaardil joon.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "joonega"
          },
          {
            "id": "c2",
            "text": "ainult pilvega"
          },
          {
            "id": "c3",
            "text": "ainult lipuga"
          },
          {
            "id": "c4",
            "text": "heledama taeva värviga"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q068",
      "unitId": "lo-opik-u17",
      "stem": "Millise loodusobjekti järgi võib riigipiir kulgeda?",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-border-nature",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiir võib järgida jõge või muud loodusobjekti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "jõe"
          },
          {
            "id": "c2",
            "text": "riigilipu"
          },
          {
            "id": "c3",
            "text": "koolimaja kella"
          },
          {
            "id": "c4",
            "text": "laulu sõnade"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q069",
      "unitId": "lo-opik-u17",
      "stem": "Õige või vale? Riigipiir kulgeb alati jõe või mäestiku järgi.",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-border-notalways-natural",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiir võib olla kokku lepitud ka ilma selge loodusliku piirijooneta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
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
      "id": "lo-opik-u17-q070",
      "unitId": "lo-opik-u17",
      "stem": "Mida tähendab naaberriik?",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-neighbour-definition",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Naaberriigid on riigid, mille vahel kulgeb riigipiir.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Riik, millega jagatakse piiri."
          },
          {
            "id": "c2",
            "text": "Riik, kus on alati sama keel."
          },
          {
            "id": "c3",
            "text": "Riik, millel on sama suur lipp."
          },
          {
            "id": "c4",
            "text": "Riik, mis asub alati samal mandril võimalikult kaugel."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q071",
      "unitId": "lo-opik-u17",
      "stem": "Miks on riigipiir kaardil tavaliselt joon?",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-border-map",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiiri joon on kartograafiline tähistus, mitte tingimata maastikul nähtav sein.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Nii näitab kaart kahe riigi territooriume eristada."
          },
          {
            "id": "c2",
            "text": "Sest looduses on iga riigi ümber paks must sein."
          },
          {
            "id": "c3",
            "text": "Sest kaardil ei tohi olla veekogusid."
          },
          {
            "id": "c4",
            "text": "Sest iga riigi piir on põhjas."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q072",
      "unitId": "lo-opik-u17",
      "stem": "Vali kõik, mis võivad olla riigipiiri paiknemise aluseks.",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-border-notalways-natural",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Piir võib järgida veekogu või muud loodusobjekti, kuid võib olla ka kokkuleppeline joon.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "c1",
            "text": "jõgi"
          },
          {
            "id": "c2",
            "text": "järv"
          },
          {
            "id": "c3",
            "text": "kokku lepitud maa-alade eraldusjoon"
          },
          {
            "id": "c4",
            "text": "mäestik"
          },
          {
            "id": "c5",
            "text": "riigihümni viis"
          }
        ],
        "correctOptionIds": [
          "c1",
          "c2",
          "c3",
          "c4"
        ]
      }
    },
    {
      "id": "lo-opik-u17-q073",
      "unitId": "lo-opik-u17",
      "stem": "Rühmita riigipiiri kohta käivad väited.",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-natural-classify",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiir võib olla looduslikku objekti järgiv või kokku lepitud maa-alade eraldusjoon.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "possible",
            "text": "Võimalik"
          },
          {
            "id": "incorrect",
            "text": "Vale arusaam"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "piir võib kulgeda mööõda jõge"
          },
          {
            "id": "i2",
            "text": "piir võib olla kokkuleppeline"
          },
          {
            "id": "i3",
            "text": "piir peab alati olema nähtav müur"
          },
          {
            "id": "i4",
            "text": "piir kulgeb alati mäestikus"
          }
        ],
        "correctGroupByItem": {
          "i1": "possible",
          "i2": "possible",
          "i3": "incorrect",
          "i4": "incorrect"
        }
      }
    },
    {
      "id": "lo-opik-u17-q074",
      "unitId": "lo-opik-u17",
      "stem": "Kahe riigi piiri ühe osa paikneb järves. Kas selline piir on võimalik?",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-border-water",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiir võib kulgeda veekogus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Jah, piir võib järgida veekogu."
          },
          {
            "id": "c2",
            "text": "Ei, riigipiir kulgeb ainult maanteel."
          },
          {
            "id": "c3",
            "text": "Ei, piir ei saa kunagi vett puudutada."
          },
          {
            "id": "c4",
            "text": "Jah, aga ainult siis, kui järv on kuiv."
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Oletame, et riigid leppisid kokku, et piir kulgeb järves."
        ]
      }
    },
    {
      "id": "lo-opik-u17-q075",
      "unitId": "lo-opik-u17",
      "stem": "Kahe riigi vahel ei ole jõge ega mäestikku. Kas neil saab ikkagi olla riigipiir?",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-border-notalways-natural",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiir on kokku lepitud ja võib kulgeda ka ilma loodusliku takistuseta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Jah, piir võib olla kokkuleppeline joon."
          },
          {
            "id": "c2",
            "text": "Ei, riigid peavad olema üks riik."
          },
          {
            "id": "c3",
            "text": "Ei, piir vajab alati jõge."
          },
          {
            "id": "c4",
            "text": "Jah, aga ainult meres."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q076",
      "unitId": "lo-opik-u17",
      "stem": "Milline seos on riigipiiril ja naaberriigil?",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-neighbour-and-border",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riikidel, mida nimetatakse naabriteks, on omavaheline piir.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Naaberriike eraldab nendevaheline riigipiir."
          },
          {
            "id": "c2",
            "text": "Naaberriigid ei tohi kunagi piiri jagada."
          },
          {
            "id": "c3",
            "text": "Piir on alati ainult merepõhjas."
          },
          {
            "id": "c4",
            "text": "Naaberriigil peab olema sama pealinn."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q077",
      "unitId": "lo-opik-u17",
      "stem": "Mida saab tabeli põhjal järeldada?",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-border-interpret-table",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiir ei pea alati järgima loodusobjekti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Piir saab kulgeda nii veekogu järgi kui ka kokkuleppelise joonena."
          },
          {
            "id": "c2",
            "text": "Piir kulgeb alati ainult jões."
          },
          {
            "id": "c3",
            "text": "Piir asub alati ainult mäestikus."
          },
          {
            "id": "c4",
            "text": "Riigipiiri ei ole võimalik kaardile märkida."
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Piirilõik",
          "Kirjeldus"
        ],
        "rows": [
          [
            "A",
            "Kulgeb mööõda järve."
          ],
          [
            "B",
            "Kulgeb üle tasase maa kokkuleppelise joonena."
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u17-q078",
      "unitId": "lo-opik-u17",
      "stem": "Millised on Eesti kaks maismaanaabrit?",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-land-names",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti kaks maismaanaabrit on Läti ja Venemaa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "c1",
            "text": "Läti"
          },
          {
            "id": "c2",
            "text": "Venemaa"
          },
          {
            "id": "c3",
            "text": "Soome"
          },
          {
            "id": "c4",
            "text": "Rootsi"
          }
        ],
        "correctOptionIds": [
          "c1",
          "c2"
        ]
      }
    },
    {
      "id": "lo-opik-u17-q079",
      "unitId": "lo-opik-u17",
      "stem": "Mis riik asub Eesti lõunanaabrina?",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-latvia-south",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läti on Eesti lõunanaaber.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Läti"
          },
          {
            "id": "c2",
            "text": "Soome"
          },
          {
            "id": "c3",
            "text": "Rootsi"
          },
          {
            "id": "c4",
            "text": "Norra"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q080",
      "unitId": "lo-opik-u17",
      "stem": "Mis riik asub Eestist idas?",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-russia-east",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Venemaa on Eesti idanaaber.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Venemaa"
          },
          {
            "id": "c2",
            "text": "Rootsi"
          },
          {
            "id": "c3",
            "text": "Soome"
          },
          {
            "id": "c4",
            "text": "Taani"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q081",
      "unitId": "lo-opik-u17",
      "stem": "Puuduta kaardil Lätit.",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-latvia-hotspot",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läti paikneb Eestist lõuna pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u17-baltic-region",
        "correctRegionId": "latvia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-baltic-region"
      }
    },
    {
      "id": "lo-opik-u17-q082",
      "unitId": "lo-opik-u17",
      "stem": "Puuduta kaardil Venemaad.",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-russia-hotspot",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Venemaa paikneb Eestist ida pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u17-baltic-region",
        "correctRegionId": "russia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-baltic-region"
      }
    },
    {
      "id": "lo-opik-u17-q083",
      "unitId": "lo-opik-u17",
      "stem": "Ühenda Eesti maismaanaaber tema asukohaga.",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-land-direction-match",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eestist lõuna jääb Läti, ida poole Venemaa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Läti"
          },
          {
            "id": "p2",
            "text": "Venemaa"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "lõunas"
          },
          {
            "id": "c2",
            "text": "idas"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2"
        }
      }
    },
    {
      "id": "lo-opik-u17-q084",
      "unitId": "lo-opik-u17",
      "stem": "Õige või vale? Läti on Eesti maismaanaaber.",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-latvia-truth",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jah. Eesti ja Läti vaheline piir kulgeb maismaal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
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
      "id": "lo-opik-u17-q085",
      "unitId": "lo-opik-u17",
      "stem": "Miks nimetatakse Lätit Eesti maismaanaabriks?",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-latvia-truth",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti ja Läti vahel on maismaapiir.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Eesti ja Läti jagavad maismaapiiri."
          },
          {
            "id": "c2",
            "text": "Nende vahel on ainult Soome laht."
          },
          {
            "id": "c3",
            "text": "Mõlemal on sama pealinn."
          },
          {
            "id": "c4",
            "text": "Läti asub Eestist lääne pool üle mere."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q086",
      "unitId": "lo-opik-u17",
      "stem": "Ühenda liikumissuund ja riik, kuhu Eesti piiri ületades võid jõuda.",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-land-direction-match",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaks maismaasuunda on lõunas Läti ja idas Venemaa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "lõuna poole"
          },
          {
            "id": "p2",
            "text": "ida poole"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Läti"
          },
          {
            "id": "c2",
            "text": "Venemaa"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2"
        }
      }
    },
    {
      "id": "lo-opik-u17-q087",
      "unitId": "lo-opik-u17",
      "stem": "Millisesse naaberriiki võid üle Eesti lõunapoolse maismaapiiri liikudes jõuda?",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-latvia-south",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti lõunapiirist teisel pool on Läti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Lätti"
          },
          {
            "id": "c2",
            "text": "Soome"
          },
          {
            "id": "c3",
            "text": "Rootsi"
          },
          {
            "id": "c4",
            "text": "Ameerikasse"
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Reisid Eestist maismaad mööõda lõuna poole."
        ]
      }
    },
    {
      "id": "lo-opik-u17-q088",
      "unitId": "lo-opik-u17",
      "stem": "Milline riik on Eesti idapiiri teisel pool?",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-russia-east",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eestist ida pool on Venemaa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Venemaa"
          },
          {
            "id": "c2",
            "text": "Läti"
          },
          {
            "id": "c3",
            "text": "Soome"
          },
          {
            "id": "c4",
            "text": "Rootsi"
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Sõidad Eesti idapiiri lähedale."
        ]
      }
    },
    {
      "id": "lo-opik-u17-q089",
      "unitId": "lo-opik-u17",
      "stem": "Milline riik EI ole Eesti maismaanaaber?",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-land-names",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome paikneb Eestist teisel pool Soome lahte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Soome"
          },
          {
            "id": "c2",
            "text": "Läti"
          },
          {
            "id": "c3",
            "text": "Venemaa"
          },
          {
            "id": "c4",
            "text": "mõlemad Läti ja Venemaa on maismaanaabrid"
          }
        ],
        "correctOptionId": "c1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o8"
      ]
    },
    {
      "id": "lo-opik-u17-q090",
      "unitId": "lo-opik-u17",
      "stem": "Millisel tabeli real on mõlemad Eesti maismaanaabrid õigesti?",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-land-names",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti maismaanaabrid on Läti ja Venemaa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Rida B"
          },
          {
            "id": "c2",
            "text": "Rida A"
          },
          {
            "id": "c3",
            "text": "Rida C"
          },
          {
            "id": "c4",
            "text": "Ükski rida"
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Rida",
          "Riigid"
        ],
        "rows": [
          [
            "A",
            "Soome ja Rootsi"
          ],
          [
            "B",
            "Läti ja Venemaa"
          ],
          [
            "C",
            "Soome ja Läti"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u17-q091",
      "unitId": "lo-opik-u17",
      "stem": "Rühmita asukoha kirjeldused Eesti naabri järgi.",
      "primaryObjectiveId": "lo-opik-u17-o7",
      "variantGroupId": "lo-opik-u17-g-land-direction-match",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läti asub lõunas ja Venemaa idas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "lv",
            "text": "Läti"
          },
          {
            "id": "ru",
            "text": "Venemaa"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Eesti lõunanaaber"
          },
          {
            "id": "i2",
            "text": "Eesti idanaaber"
          },
          {
            "id": "i3",
            "text": "maismaapiir Eestist lõuna pool"
          },
          {
            "id": "i4",
            "text": "maismaapiir Eestist ida pool"
          }
        ],
        "correctGroupByItem": {
          "i1": "lv",
          "i2": "ru",
          "i3": "lv",
          "i4": "ru"
        }
      }
    },
    {
      "id": "lo-opik-u17-q092",
      "unitId": "lo-opik-u17",
      "stem": "Millised on Eesti kaks meretagust naabrit?",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-sea-names",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti meretagused naabrid on Soome ja Rootsi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "c1",
            "text": "Soome"
          },
          {
            "id": "c2",
            "text": "Rootsi"
          },
          {
            "id": "c3",
            "text": "Läti"
          },
          {
            "id": "c4",
            "text": "Venemaa"
          }
        ],
        "correctOptionIds": [
          "c1",
          "c2"
        ]
      }
    },
    {
      "id": "lo-opik-u17-q093",
      "unitId": "lo-opik-u17",
      "stem": "Mis riik asub Eestist põhja pool üle Soome lahe?",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-finland-north",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome asub Eesti põhja pool Soome lahe taga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Soome"
          },
          {
            "id": "c2",
            "text": "Rootsi"
          },
          {
            "id": "c3",
            "text": "Venemaa"
          },
          {
            "id": "c4",
            "text": "Läti"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q094",
      "unitId": "lo-opik-u17",
      "stem": "Mis riik asub Eestist lääne pool üle Läänemere?",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-sweden-west",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rootsi on Eesti läänepoolne meretagune naaber.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Rootsi"
          },
          {
            "id": "c2",
            "text": "Soome"
          },
          {
            "id": "c3",
            "text": "Läti"
          },
          {
            "id": "c4",
            "text": "Venemaa"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q095",
      "unitId": "lo-opik-u17",
      "stem": "Puuduta kaardil Soomet.",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-finland-hotspot",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome paikneb Eestist põhja pool üle Soome lahe.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u17-baltic-region",
        "correctRegionId": "finland"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-baltic-region"
      }
    },
    {
      "id": "lo-opik-u17-q096",
      "unitId": "lo-opik-u17",
      "stem": "Puuduta kaardil Rootsit.",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-sweden-hotspot",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rootsi on Eestist läänes üle Läänemere.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u17-baltic-region",
        "correctRegionId": "sweden"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u17-baltic-region"
      }
    },
    {
      "id": "lo-opik-u17-q097",
      "unitId": "lo-opik-u17",
      "stem": "Ühenda Eesti meretagune naaber suunaga.",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-sea-direction-match",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome on põhjanaaber ja Rootsi läänenaaber.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Soome"
          },
          {
            "id": "p2",
            "text": "Rootsi"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "põhjas"
          },
          {
            "id": "c2",
            "text": "läänes"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2"
        }
      }
    },
    {
      "id": "lo-opik-u17-q098",
      "unitId": "lo-opik-u17",
      "stem": "Vali kõik Eesti neli õpikus nimetatud naaberriiki.",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-four-neighbours",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti neli naabrit on Läti, Venemaa, Soome ja Rootsi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "c1",
            "text": "Läti"
          },
          {
            "id": "c2",
            "text": "Venemaa"
          },
          {
            "id": "c3",
            "text": "Soome"
          },
          {
            "id": "c4",
            "text": "Rootsi"
          },
          {
            "id": "c5",
            "text": "Leedu"
          },
          {
            "id": "c6",
            "text": "Poola"
          }
        ],
        "correctOptionIds": [
          "c1",
          "c2",
          "c3",
          "c4"
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o7"
      ]
    },
    {
      "id": "lo-opik-u17-q099",
      "unitId": "lo-opik-u17",
      "stem": "Rühmita Eesti neli naabrit nende liigi järgi.",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-type-of-neighbours",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läti ja Venemaa on maismaanaabrid; Soome ja Rootsi asuvad üle mere.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "land",
            "text": "Maismaanaaber"
          },
          {
            "id": "sea",
            "text": "Meretagune naaber"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Läti"
          },
          {
            "id": "i2",
            "text": "Venemaa"
          },
          {
            "id": "i3",
            "text": "Soome"
          },
          {
            "id": "i4",
            "text": "Rootsi"
          }
        ],
        "correctGroupByItem": {
          "i1": "land",
          "i2": "land",
          "i3": "sea",
          "i4": "sea"
        }
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o7"
      ]
    },
    {
      "id": "lo-opik-u17-q100",
      "unitId": "lo-opik-u17",
      "stem": "Mis veekogu eraldab Eestit põhjanaabrist Soomest?",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-finland-sea",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti ja Soome vahel paikneb Soome laht.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Soome laht"
          },
          {
            "id": "c2",
            "text": "Peipsi järv"
          },
          {
            "id": "c3",
            "text": "India ookean"
          },
          {
            "id": "c4",
            "text": "Vahemeri"
          }
        ],
        "correctOptionId": "c1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o5"
      ]
    },
    {
      "id": "lo-opik-u17-q101",
      "unitId": "lo-opik-u17",
      "stem": "Mis meri jääb Eesti ja Rootsi vahele?",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-sweden-sea",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti ja Rootsi vahele jääb Läänemeri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Läänemeri"
          },
          {
            "id": "c2",
            "text": "Vahemeri"
          },
          {
            "id": "c3",
            "text": "Must meri"
          },
          {
            "id": "c4",
            "text": "Punane meri"
          }
        ],
        "correctOptionId": "c1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o5"
      ]
    },
    {
      "id": "lo-opik-u17-q102",
      "unitId": "lo-opik-u17",
      "stem": "Õige või vale? Eesti meretagused naabrid on Soome ja Rootsi.",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-sea-names",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jah. Soome on põhjas ja Rootsi läänes.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
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
      "id": "lo-opik-u17-q103",
      "unitId": "lo-opik-u17",
      "stem": "Miks ei saa Eestist Rootsi liikuda üle ühise maismaapiiri?",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-sweden-sea",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti ja Rootsi on meretagused naabrid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Rootsi asub Eesti suhtes üle Läänemere."
          },
          {
            "id": "c2",
            "text": "Rootsi paikneb Eesti kagunurgas."
          },
          {
            "id": "c3",
            "text": "Eesti ja Rootsi on sama riik."
          },
          {
            "id": "c4",
            "text": "Rootsi asub Soome lahe lõunakaldal."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q104",
      "unitId": "lo-opik-u17",
      "stem": "Milline tabeli rida kirjeldab Eestit õigesti?",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-four-neighbours",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Läti ja Venemaa on maismaanaabrid ning Soome ja Rootsi meretagused.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Rida C"
          },
          {
            "id": "c2",
            "text": "Rida A"
          },
          {
            "id": "c3",
            "text": "Rida B"
          },
          {
            "id": "c4",
            "text": "Ükski"
          }
        ],
        "correctOptionId": "c1"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Rida",
          "Maismaanaabrid",
          "Meretagused naabrid"
        ],
        "rows": [
          [
            "A",
            "Soome, Rootsi",
            "Läti, Venemaa"
          ],
          [
            "B",
            "Läti, Rootsi",
            "Venemaa, Soome"
          ],
          [
            "C",
            "Läti, Venemaa",
            "Soome, Rootsi"
          ]
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u17-o7"
      ]
    },
    {
      "id": "lo-opik-u17-q105",
      "unitId": "lo-opik-u17",
      "stem": "Kas Leedu kuulub Eesti nelja otsese naaberriigi hulka?",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-baltic-vs-neighbour",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Leedu kuulub Balti riikide hulka, kuid Eesti ja Leedu vahel paikneb Läti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        },
        {
          "kind": "supplementary",
          "url": "https://www.studyinestonia.ee/index.php/estonia/state",
          "attribution": "Study in Estonia"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Ei, Eesti ja Leedu vahel on Läti."
          },
          {
            "id": "c2",
            "text": "Jah, Leedu asub Soome lahe taga."
          },
          {
            "id": "c3",
            "text": "Jah, Leedu on Rootsi teine nimi."
          },
          {
            "id": "c4",
            "text": "Ei, Leedu asub Aafrikas."
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q106",
      "unitId": "lo-opik-u17",
      "stem": "Milline paar kirjeldab Eesti naabreid õigesti?",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-sweden-west",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Soome asub Eestist põhjas, Rootsi läänes.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "põhjas Soome, läänes Rootsi"
          },
          {
            "id": "c2",
            "text": "põhjas Läti, läänes Venemaa"
          },
          {
            "id": "c3",
            "text": "põhjas Rootsi, läänes Soome"
          },
          {
            "id": "c4",
            "text": "põhjas Leedu, läänes Poola"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q107",
      "unitId": "lo-opik-u17",
      "stem": "Milline vastus sisaldab ainult meretaguseid naabreid?",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-sea-names",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõlemad meretagused naabrid on Soome ja Rootsi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "67"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "c1",
            "text": "Soome ja Rootsi"
          },
          {
            "id": "c2",
            "text": "Läti ja Venemaa"
          },
          {
            "id": "c3",
            "text": "Soome ja Läti"
          },
          {
            "id": "c4",
            "text": "Venemaa ja Rootsi"
          }
        ],
        "correctOptionId": "c1"
      }
    },
    {
      "id": "lo-opik-u17-q108",
      "unitId": "lo-opik-u17",
      "stem": "Järjesta sammud, et ekvaatori abil Eesti poolkera määrata.",
      "primaryObjectiveId": "lo-opik-u17-o2",
      "variantGroupId": "lo-opik-u17-g-equator-steps",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ekvaatorist põhja pool asub põhjapoolkera.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Leia gloobuselt ekvaator."
          },
          {
            "id": "i2",
            "text": "Vaata, kas Eesti asub sellest põhjas või lõunas."
          },
          {
            "id": "i3",
            "text": "Järelda, et Eesti on põhjapoolkeral."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Esimene samm",
        "lastLabel": "Viimane samm"
      }
    },
    {
      "id": "lo-opik-u17-q109",
      "unitId": "lo-opik-u17",
      "stem": "Järjesta sammud, et teada saada, kummal Läänemere kaldal asub Eesti.",
      "primaryObjectiveId": "lo-opik-u17-o5",
      "variantGroupId": "lo-opik-u17-g-shore-steps",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti on Läänemerest idas, seega mere idakaldal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Leia kaardilt Läänemeri."
          },
          {
            "id": "i2",
            "text": "Leia kaardilt Eesti ja võrdle asukohta merega."
          },
          {
            "id": "i3",
            "text": "Järelda, et Eesti asub mere idakaldal."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Alusta",
        "lastLabel": "Lõpeta"
      }
    },
    {
      "id": "lo-opik-u17-q110",
      "unitId": "lo-opik-u17",
      "stem": "Järjesta kaardilt naaberriigi leidmise sammud.",
      "primaryObjectiveId": "lo-opik-u17-o6",
      "variantGroupId": "lo-opik-u17-g-boundary-steps",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardil märgitud piirijoon aitab naaberriiki leida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Leia kaardilt Eesti."
          },
          {
            "id": "i2",
            "text": "Leia Eesti ja teise riigi vaheline piirijoon."
          },
          {
            "id": "i3",
            "text": "Vaata, milline riik on piirijoone teisel pool."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Alusta",
        "lastLabel": "Lõpeta"
      }
    },
    {
      "id": "lo-opik-u17-q111",
      "unitId": "lo-opik-u17",
      "stem": "Järjesta Eesti naaberriigid põhjast päripäeva, liikudes ilmakaarte järgi.",
      "primaryObjectiveId": "lo-opik-u17-o8",
      "variantGroupId": "lo-opik-u17-g-compass-neighbours",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja poolt päripäeva on ilmakaared põhi, ida, lõuna, lääs. Nii paiknevad ka õpiku neli naabrit.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "66-67"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Soome (põhi)"
          },
          {
            "id": "i2",
            "text": "Venemaa (ida)"
          },
          {
            "id": "i3",
            "text": "Läti (lõuna)"
          },
          {
            "id": "i4",
            "text": "Rootsi (lääs)"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ],
        "firstLabel": "Põhjast",
        "lastLabel": "Päripäeva"
      }
    }
  ]
};
