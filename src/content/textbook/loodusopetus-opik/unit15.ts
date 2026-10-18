// Unit 15 — Mandrid ja maailmajaod. Õpik lk 60–63.
// Schoolbook system: SIX continents and SIX world parts. See SOURCE_ALIGNMENT.md.
// Ready for parent preview, not automatically published to the real learner.
import type { Unit } from '@/lib/textbook/types';
export const unit15: Unit = {
  "id": "lo-opik-u15",
  "courseId": "loodusopetus-opik",
  "number": 15,
  "title": "Mandrid ja maailmajaod",
  "pages": {
    "from": 60,
    "to": 63
  },
  "status": "ready",
  "contentVersion": "2026-10-17.1",
  "objectives": [
    {
      "id": "lo-opik-u15-o1",
      "description": "Tean, et suurem osa Maa pinnast on kaetud veega, ning eristan mandrit ja saart.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ]
    },
    {
      "id": "lo-opik-u15-o2",
      "description": "Oskan nimetada õpiku järgi kuut mandrit ja tunnen nende nimesid kaardil.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ]
    },
    {
      "id": "lo-opik-u15-o3",
      "description": "Tean, milline on suurim ja väikseim manner ning kuidas mandrid Maal paiknevad.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ]
    },
    {
      "id": "lo-opik-u15-o4",
      "description": "Oskan selgitada, mille poolest erinevad manner ja maailmajagu.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        },
        {
          "kind": "textbook",
          "pages": "62"
        }
      ]
    },
    {
      "id": "lo-opik-u15-o5",
      "description": "Oskan nimetada kuut maailmajagu ja selgitada Euroopa–Aasia ning Ameerika näite abil nende seoseid mandritega.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        },
        {
          "kind": "textbook",
          "pages": "62"
        },
        {
          "kind": "textbook",
          "pages": "63"
        }
      ]
    },
    {
      "id": "lo-opik-u15-o6",
      "description": "Oskan maailmakaardil leida mandreid ja maailmajagusid ning lugeda kaardi pealkirja ja selgitusi.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        },
        {
          "kind": "textbook",
          "pages": "61"
        }
      ]
    },
    {
      "id": "lo-opik-u15-o7",
      "description": "Tunnen Euroopa, Aasia, Aafrika, Ameerika ning Austraalia ja Okeaania põhilisi õpikus kirjeldatud eripärasid.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        },
        {
          "kind": "textbook",
          "pages": "63"
        }
      ]
    },
    {
      "id": "lo-opik-u15-o8",
      "description": "Tean, mida tähendavad Antarktis ja Antarktika ning miks Antarktisel ei ole püsielanikke.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        },
        {
          "kind": "textbook",
          "pages": "61"
        },
        {
          "kind": "textbook",
          "pages": "62"
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u15-l1",
      "title": "Maismaa ja vesi",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u15-o1",
        "lo-opik-u15-o3"
      ],
      "sections": [
        {
          "id": "lo-opik-u15-l1-s1",
          "title": "Suurem osa Maast on vee all",
          "blocks": [
            {
              "id": "lo-opik-u15-b001",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "text": "Kui vaadata Maad kosmosest, paistab silma suur hulk sinist vett. Maismaa moodustab maakera pinnast umbes kolmandiku, ülejäänud pinna katab vesi. Maismaal asuvad mandrid ja saared."
            },
            {
              "id": "lo-opik-u15-b002",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "term": "Maismaa",
              "definition": "Maa pinna osa, mida ei kata meri ega ookean."
            },
            {
              "id": "lo-opik-u15-b003",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "diagramId": "u15-land-water",
              "description": "Skeem, kus Maa pinnast ligikaudu kolm kümnendikku on maismaa ja seitse kümnendikku vesi.",
              "caption": "Maad katab rohkem vesi kui maismaa. Õpiku „umbes kolmandik” on ümardatud kirjeldus."
            },
            {
              "id": "lo-opik-u15-b004",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "items": [
                "Suurem osa Maa pinnast on kaetud veega.",
                "Maismaad on umbes kolmandik Maa pinnast."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u15-l1-s2",
          "title": "Saared ja suured maismaaosad",
          "blocks": [
            {
              "id": "lo-opik-u15-b005",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "text": "Vesi ümbritseb väga paljusid saari ja kuut tohutut maismaaosa. Neid suuri maismaaosi nimetatakse mandriteks. Mõned mandrid on omavahel ühendatud kitsa maaribaga."
            },
            {
              "id": "lo-opik-u15-b006",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "term": "Manner",
              "definition": "Väga suur maismaaosa. Õpikus eristatakse kuut mandrit."
            },
            {
              "id": "lo-opik-u15-b007",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "term": "Saar",
              "definition": "Maismaaosa, mida ümbritseb igast küljest vesi ja mis on mandrist palju väiksem."
            },
            {
              "id": "lo-opik-u15-b008",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "text": "Manner ja saar on mõlemad maismaa, kuid manner on hiigelsuur. Kaardil ei tähenda kaks lähestikku asuvat mandrit tingimata üht mandrit: näiteks Ameerika kaks mandrit on ühendatud kitsa maaribaga."
            }
          ]
        },
        {
          "id": "lo-opik-u15-l1-s3",
          "title": "Maismaa ei ole kõikjal võrdselt",
          "blocks": [
            {
              "id": "lo-opik-u15-b009",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "text": "Maismaa ja vesi paiknevad Maal ebaühtlaselt. Põhjapoolkeral leidub maismaad rohkem kui lõunapoolkeral. See ei tähenda, et põhjapoolkeral oleks maismaad rohkem kui vett: vesi katab suurema osa mõlemast poolkerast."
            },
            {
              "id": "lo-opik-u15-b010",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "items": [
                "Põhjapoolkeral on maismaad rohkem kui lõunapoolkeral.",
                "Mõlemal poolkeral katab suurema osa pinnast vesi."
              ]
            },
            {
              "id": "lo-opik-u15-b011",
              "type": "enrichment",
              "source": {
                "kind": "supplementary",
                "url": "https://science.nasa.gov/earth/oceans/europa-water-world-infographic/",
                "attribution": "NASA Science, Maa pinna maismaa ja vee osakaal"
              },
              "variant": "extra",
              "title": "Lisateadmine: täpsem osakaal",
              "body": [
                "NASA andmetel on maismaad ligikaudu 29% ning veega kaetud pinda umbes 71%. Õpiku „umbes kolmandik” aitab seda lihtsamalt meeles pidada. Täpseid protsente pole testi jaoks vaja."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u15-l2",
      "title": "Kuus mandrit",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u15-o2",
        "lo-opik-u15-o3",
        "lo-opik-u15-o6"
      ],
      "sections": [
        {
          "id": "lo-opik-u15-l2-s1",
          "title": "Kuus suurt maismaaosa",
          "blocks": [
            {
              "id": "lo-opik-u15-b012",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "text": "Õpiku järgi on mandreid kuus: Euraasia, Aafrika, Põhja-Ameerika, Lõuna-Ameerika, Austraalia ja Antarktis. Neid on lihtsam õppida kaardi abil. Vaatle, kus asub iga manner ja millised neist paiknevad teineteise lähedal."
            },
            {
              "id": "lo-opik-u15-b013",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "diagramId": "u15-world-continents",
              "description": "Maailmakaardi looduslike maismaakontuuride järgi kujutatud kuus mandrit. Euraasia on üks manner.",
              "caption": "Kuus mandrit. Maismaakontuurid on üldistatud, et kaart oleks väikesel ekraanil loetav."
            },
            {
              "id": "lo-opik-u15-b014",
              "type": "list",
              "items": [
                "Euraasia",
                "Aafrika",
                "Põhja-Ameerika",
                "Lõuna-Ameerika",
                "Austraalia",
                "Antarktis"
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u15-l2-s2",
          "title": "Suurim ja väikseim",
          "blocks": [
            {
              "id": "lo-opik-u15-b015",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "text": "Mandrid on erineva suurusega. Kõige suurem manner on Euraasia, kõige väiksem on Austraalia. Õpiku järgi on Euraasia pindala Austraalia omast umbes seitse korda suurem."
            },
            {
              "id": "lo-opik-u15-b016",
              "type": "comparison",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "title": "Kaks eri suurusega mandrit",
              "columns": [
                {
                  "heading": "Euraasia",
                  "points": [
                    "Kõige suurem manner.",
                    "Hõlmab Euroopa ja Aasia ala."
                  ]
                },
                {
                  "heading": "Austraalia",
                  "points": [
                    "Kõige väiksem manner.",
                    "Kuulub maailmajaosse Austraalia ja Okeaania."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u15-b017",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "items": [
                "Suurim manner: Euraasia.",
                "Väikseim manner: Austraalia."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u15-l2-s3",
          "title": "Kas mandrid on omavahel ühendatud?",
          "blocks": [
            {
              "id": "lo-opik-u15-b018",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "text": "Osa mandreid on teineteisest ookeaniga eraldatud, osa on ühendatud kitsaste maismaaribadega. Aafrika on Euraasiaga maismaad pidi ühendatud. Põhja-Ameerikat ja Lõuna-Ameerikat ühendab Kesk-Ameerika kitsas maismaaosa."
            },
            {
              "id": "lo-opik-u15-b019",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "text": "See, et kahe mandri vahel on kitsas maaühendus, ei tähenda, et neid tuleb õpiku jaotuses üheks mandriks lugeda. Maailmakaart aitab neid ühendusi märgata."
            },
            {
              "id": "lo-opik-u15-b020",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "60"
              },
              "items": [
                "Aafrika ja Euraasia on maismaad pidi ühendatud.",
                "Põhja- ja Lõuna-Ameerika on omavahel maismaad pidi ühendatud."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u15-l3",
      "title": "Kuus maailmajagu",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u15-o4",
        "lo-opik-u15-o5",
        "lo-opik-u15-o6"
      ],
      "sections": [
        {
          "id": "lo-opik-u15-l3-s1",
          "title": "Manner ja maailmajagu ei ole päris sama",
          "blocks": [
            {
              "id": "lo-opik-u15-b021",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "text": "Maailma võib jagada mandriteks, aga ka maailmajagudeks. Manner tähendab eelkõige suurt maismaaosa. Maailmajagu on laiem piirkond, mida on kujundanud ka inimeste ajalugu, tavad ja kultuur. See võib hõlmata terve mandri, osa mandrist või mitu mandrit koos saarte ja ümbritsevate vetealadega. Maailmajao piir ei pruugi olla mererand ega muu looduslik piir."
            },
            {
              "id": "lo-opik-u15-b022",
              "type": "comparison",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "title": "Milles on vahe?",
              "columns": [
                {
                  "heading": "Manner",
                  "points": [
                    "Suur maismaaosa.",
                    "Õpikus on neid kuus."
                  ]
                },
                {
                  "heading": "Maailmajagu",
                  "points": [
                    "Ajaloo ja kultuuriga seotud suur piirkond.",
                    "Võib hõlmata tervet mandrit, osa sellest või mitut mandrit koos saartega."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u15-b023",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "items": [
                "Mandreid ja maailmajagusid on õpiku järgi võrdselt kuus.",
                "Nende nimed ja piirid ei ole siiski alati samad."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u15-l3-s2",
          "title": "Kuue maailmajao nimed",
          "blocks": [
            {
              "id": "lo-opik-u15-b024",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "text": "Õpikus on kuus maailmajagu: Euroopa, Aasia, Aafrika, Ameerika, Austraalia ja Okeaania ning Antarktika. Mõtle, millised nimed on mandritega samad ja millised erinevad."
            },
            {
              "id": "lo-opik-u15-b025",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "diagramId": "u15-world-parts",
              "description": "Maailmakaart kuue maailmajao nimemarkeriga. Euroopa ja Aasia on eraldi markerid Euraasias; Ameerika marker hõlmab mõttes põhja- ja lõunaosa.",
              "caption": "Maailmajagude kuus nimetust. Euroopa ja Aasia vahele ei ole siin tõmmatud riigipiiri."
            },
            {
              "id": "lo-opik-u15-b026",
              "type": "list",
              "items": [
                "Euroopa",
                "Aasia",
                "Aafrika",
                "Ameerika",
                "Austraalia ja Okeaania",
                "Antarktika"
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u15-l3-s3",
          "title": "Üks manner ja kaks maailmajagu",
          "blocks": [
            {
              "id": "lo-opik-u15-b027",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "text": "Euraasia on üks suur manner, kuid sellel asuvad kaks maailmajagu: Euroopa ja Aasia. Euroopa ja Aasia vaheline kokkuleppeline piir ei ole ookean. See on hea näide, miks maailmajagu ei tähenda alati üht eraldi mandrit."
            },
            {
              "id": "lo-opik-u15-b028",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "items": [
                "Euraasia = üks manner.",
                "Euroopa + Aasia = kaks maailmajagu Euraasia alal."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u15-l3-s4",
          "title": "Kaks mandrit ja üks maailmajagu",
          "blocks": [
            {
              "id": "lo-opik-u15-b029",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "text": "Ameerika on üks maailmajagu, kuhu kuuluvad Põhja-Ameerika ja Lõuna-Ameerika mandrid ning neid ümbritsevad saared. Austraalia ja Okeaania maailmajagu hõlmab Austraalia mandrit ning palju Vaikse ookeani saari."
            },
            {
              "id": "lo-opik-u15-b030",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "diagramId": "u15-continent-worldpart-links",
              "description": "Kaks kõrvutist skeemi. Vasakul on üks manner, Euraasia, millel asuvad kaks maailmajagu, Euroopa ja Aasia. Paremal on üks maailmajagu, Ameerika, kuhu kuuluvad kaks mandrit, Põhja- ja Lõuna-Ameerika.",
              "caption": "Vasakul: üks manner → kaks maailmajagu. Paremal: kaks mandrit → üks maailmajagu."
            },
            {
              "id": "lo-opik-u15-b031",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "caption": "Nimede selgitus",
              "headers": [
                "Manner",
                "Maailmajagu"
              ],
              "rows": [
                [
                  "Euraasia",
                  "Euroopa ja Aasia"
                ],
                [
                  "Põhja-Ameerika ja Lõuna-Ameerika",
                  "Ameerika"
                ],
                [
                  "Austraalia",
                  "Austraalia ja Okeaania"
                ],
                [
                  "Antarktis",
                  "Antarktika"
                ]
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u15-l4",
      "title": "Maailmajagude nägu",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u15-o7",
        "lo-opik-u15-o8",
        "lo-opik-u15-o6"
      ],
      "sections": [
        {
          "id": "lo-opik-u15-l4-s1",
          "title": "Euroopa ja Aasia",
          "blocks": [
            {
              "id": "lo-opik-u15-b032",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "63"
              },
              "text": "Euroopa on Euraasia mandri osa. Õpik kirjeldab Euroopat tihedalt asustatud maailmajaona. Aasias asuvad maailma kõrgeimad mäed ning maailma sügavaim maismaanõgu. Aasias on ka väga suure rahvaarvuga riigid India ja Hiina."
            },
            {
              "id": "lo-opik-u15-b033",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "text": "Õpiku pildiallkirja järgi elab Aasias ligikaudu 60% maailma rahvastikust. Täpne osakaal ajas muutub, kuid see näitab, kui suur osa inimestest elab Aasias."
            },
            {
              "id": "lo-opik-u15-b034",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "63"
              },
              "items": [
                "Euroopa ja Aasia asuvad mõlemad Euraasia mandril.",
                "Aasias on maailma kõrgeimad mäed."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u15-l4-s2",
          "title": "Aafrika ja Ameerika",
          "blocks": [
            {
              "id": "lo-opik-u15-b035",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "63"
              },
              "text": "Aafrikat kirjeldab õpik kõige soojema kliimaga maailmajaona. Seal on suuri kuivi kõrbealasid ja vihmarohkeid metsi, kus elab palju eri looma- ja taimeliike."
            },
            {
              "id": "lo-opik-u15-b036",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "62"
              },
              "text": "Ameerika maailmajagu ühendab Põhja- ja Lõuna-Ameerika. Selle lääneosas kulgeb pikk mäestikuvöönd; mitmes selle vööndi paigas esineb vulkaanipurskeid ja maavärinaid."
            },
            {
              "id": "lo-opik-u15-b037",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "63"
              },
              "items": [
                "Aafrikas leidub nii kõrbi kui ka vihmametsi.",
                "Ameerika maailmajagu hõlmab kahte mandrit."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u15-l4-s3",
          "title": "Austraalia ja Okeaania",
          "blocks": [
            {
              "id": "lo-opik-u15-b038",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "63"
              },
              "text": "Austraalia ja Okeaania maailmajagu hõlmab Austraalia mandrit ja paljusid ookeanisaari. Seal elab omapäraseid loomi ja kasvab taimi, keda mujal maailmas ei kohta."
            },
            {
              "id": "lo-opik-u15-b039",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "63"
              },
              "text": "Ära aja segamini Austraalia mandrit ja Austraalia ja Okeaania maailmajagu: teine on laiem ning sinna kuulub ka palju saari."
            },
            {
              "id": "lo-opik-u15-b040",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "63"
              },
              "items": [
                "Austraalia on manner.",
                "Austraalia ja Okeaania on maailmajagu, mis hõlmab ka saari."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u15-l4-s4",
          "title": "Antarktis ja Antarktika",
          "blocks": [
            {
              "id": "lo-opik-u15-b041",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "62"
              },
              "text": "Antarktis on lõunapooluse ümbruses asuv manner. Seda katab väga paks jääkiht. Antarktika on maailmajagu, mille keskmes asub Antarktise manner."
            },
            {
              "id": "lo-opik-u15-b042",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "62"
              },
              "text": "Antarktisel ei ole püsielanikke. Teadlased ja jaamade töötajad viibivad seal ajutiselt, et uurida loodust ja ilma. Õpiku näites viibivad uurijad seal tavaliselt aasta või vähem."
            },
            {
              "id": "lo-opik-u15-b043",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "62"
              },
              "items": [
                "Antarktis = manner.",
                "Antarktika = maailmajagu.",
                "Antarktisel ei ole püsielanikke, kuid seal tegutsevad uurimisjaamad."
              ]
            },
            {
              "id": "lo-opik-u15-b044",
              "type": "externalResource",
              "title": "Vaata Antarktise uurimisjaama",
              "intro": "Uuri koos täiskasvanuga, kuidas teadlased jäisel mandril töötavad.",
              "url": "https://www.nsf.gov/od/opp/ail/palmer-station",
              "publisher": "U.S. National Science Foundation",
              "resourceType": "article",
              "observe": "Milliseid töid tehakse uurimisjaamas ka talvel?"
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u15-l5",
      "title": "Tunne mandrit ja maailmajagu kaardil",
      "order": 5,
      "required": true,
      "objectiveIds": [
        "lo-opik-u15-o2",
        "lo-opik-u15-o4",
        "lo-opik-u15-o5",
        "lo-opik-u15-o6",
        "lo-opik-u15-o7",
        "lo-opik-u15-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u15-l5-s1",
          "title": "Üks maailm, kaks viisi jaotada",
          "blocks": [
            {
              "id": "lo-opik-u15-b045",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "60–61"
              },
              "text": "Võrdle kahte maailmakaarti. Esimesel on kuus mandrit, teisel kuus maailmajagu. Vaata kaardi pealkirja ja selgitust enne, kui ütled, mida on kujutatud. Sama suur maismaaosa võib mõnel kaardil kanda üht nime ja teisel kahte nime."
            },
            {
              "id": "lo-opik-u15-b046",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "diagramId": "u15-continent-worldpart-links",
              "caption": "Meeldetuletus: Euraasia on üks manner, aga Euroopa ja Aasia on kaks maailmajagu."
            },
            {
              "id": "lo-opik-u15-b047",
              "type": "list",
              "ordered": true,
              "items": [
                "Loe kaardi pealkiri: kas „Mandrid” või „Maailmajaod”?",
                "Vaata, milline piirkond või nimi on märgitud.",
                "Vali vastus selle järgi, mida kaardil küsitakse."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u15-l5-s2",
          "title": "Leia seosed",
          "blocks": [
            {
              "id": "lo-opik-u15-b048",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "60–63"
              },
              "text": "Pane tähele nelja olulist seost: Euraasia jaguneb Euroopa ja Aasia maailmajagudeks. Ameerika maailmajagu koosneb kahest mandrist. Austraalia on manner, kuid Austraalia ja Okeaania maailmajagu hõlmab ka saari. Antarktise manner asub Antarktika maailmajaos."
            },
            {
              "id": "lo-opik-u15-b049",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "60–63"
              },
              "caption": "Neli olulist seost",
              "headers": [
                "Mida küsitakse?",
                "Õige näide"
              ],
              "rows": [
                [
                  "Üks manner, kaks maailmajagu",
                  "Euraasia → Euroopa ja Aasia"
                ],
                [
                  "Kaks mandrit, üks maailmajagu",
                  "Põhja- ja Lõuna-Ameerika → Ameerika"
                ],
                [
                  "Manner ja saared",
                  "Austraalia → Austraalia ja Okeaania"
                ],
                [
                  "Manner ja selle maailmajagu",
                  "Antarktis → Antarktika"
                ]
              ]
            },
            {
              "id": "lo-opik-u15-b050",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "60–63"
              },
              "items": [
                "Mandreid on kuus, maailmajagusid samuti kuus.",
                "Kõige tähtsam on tunda nende erinevust, mitte ainult arvu."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u15-l5-s3",
          "title": "Õppetüki kokkuvõte",
          "blocks": [
            {
              "id": "lo-opik-u15-b051",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "60–63"
              },
              "title": "Ma tean, et…",
              "items": [
                "Maad katab rohkem vesi kui maismaa.",
                "Mandreid on kuus ja maailmajagusid kuus.",
                "Euraasia on suurim ning Austraalia väikseim manner.",
                "Euraasia mandril on Euroopa ja Aasia maailmajaod.",
                "Ameerika maailmajagu koosneb Põhja- ja Lõuna-Ameerika mandritest.",
                "Antarktisel ei ole püsielanikke."
              ]
            },
            {
              "id": "lo-opik-u15-b052",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "61"
              },
              "text": "Kui mõni nimi veel segamini läheb, vaata kaarte uuesti. Harjutamisel saad iga teema kohta järgmise küsimuse, kuni oled kõigile õpieesmärkidele õigesti vastanud."
            },
            {
              "id": "lo-opik-u15-b053",
              "type": "externalResource",
              "title": "Vaata maailmajaotusi teise nurga alt",
              "intro": "National Geographic selgitab seitsme mandri süsteemi. See erineb meie õpiku kuue mandri süsteemist; võrdle neid vaid uudishimust.",
              "url": "https://www.nationalgeographic.org/national-geographic-map-policy",
              "publisher": "National Geographic Society",
              "resourceType": "article",
              "observe": "Millised õpiku Euraasia mandri osad on seal lahku löödud?"
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u15-q001",
      "unitId": "lo-opik-u15",
      "stem": "Mis katab suurema osa Maa pinnast?",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-water-majority",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Suurem osa Maa pinnast on kaetud veega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "vesi"
          },
          {
            "id": "o2",
            "text": "maismaa"
          },
          {
            "id": "o3",
            "text": "mets"
          },
          {
            "id": "o4",
            "text": "jää"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q002",
      "unitId": "lo-opik-u15",
      "stem": "Õige või vale? Maismaa katab Maast rohkem kui pool.",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-water-majority",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Maismaa moodustab ligikaudu kolmandiku Maa pinnast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "yes",
            "text": "Õige"
          },
          {
            "id": "no",
            "text": "Vale"
          }
        ],
        "correctOptionId": "no",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u15-q003",
      "unitId": "lo-opik-u15",
      "stem": "Kui suur osa Maa pinnast on õpiku järgi ligikaudu maismaa?",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-one-third",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik ütleb, et maismaa on umbes üks kolmandik maakera pinnast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "umbes kolmandik"
          },
          {
            "id": "o2",
            "text": "umbes pool"
          },
          {
            "id": "o3",
            "text": "umbes kolmveerand"
          },
          {
            "id": "o4",
            "text": "peaaegu kogu pind"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q004",
      "unitId": "lo-opik-u15",
      "stem": "Vali kõik väited, mis käivad mandri kohta.",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-continent-definition",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Manner on tohutu maismaaosa; õpiku järgi on neid kuus ning osa on omavahel ühendatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "See on väga suur maismaaosa."
          },
          {
            "id": "o2",
            "text": "Õpikus on mandreid kuus."
          },
          {
            "id": "o3",
            "text": "See koosneb ainult merest."
          },
          {
            "id": "o4",
            "text": "Mõned mandrid on omavahel maaribaga seotud."
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2",
          "o4"
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o2"
      ]
    },
    {
      "id": "lo-opik-u15-q005",
      "unitId": "lo-opik-u15",
      "stem": "Mis on saar?",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-island-definition",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Saar on maismaaosa, mida ümbritseb igast küljest vesi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "igast küljest veega ümbritsetud maismaaosa"
          },
          {
            "id": "o2",
            "text": "suur ookean"
          },
          {
            "id": "o3",
            "text": "mandri kõrgeim mägi"
          },
          {
            "id": "o4",
            "text": "alati kahe mandri vahel olev maaühendus"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q006",
      "unitId": "lo-opik-u15",
      "stem": "Kas saar ja manner on mõlemad maismaa?",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-island-vs-continent",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõlemad on maismaa, kuid mandrid on tohutult suured.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Jah, kuid mandrid on saartest palju suuremad."
          },
          {
            "id": "o2",
            "text": "Ei, saar on alati magevesi."
          },
          {
            "id": "o3",
            "text": "Ei, manner on ookean."
          },
          {
            "id": "o4",
            "text": "Jah, aga kõik saared on suuremad kui mandrid."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q007",
      "unitId": "lo-opik-u15",
      "stem": "Miks paistab Maa kosmosest suuresti sinine?",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-water-majority",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa pinnast katab enamasti vesi, mis paistab kosmosefotodel sinise alana.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Suurt osa pinnast katab vesi."
          },
          {
            "id": "o2",
            "text": "Mandrid on kõik sinised."
          },
          {
            "id": "o3",
            "text": "Maismaa on alati kaetud jääga."
          },
          {
            "id": "o4",
            "text": "Kõik pilved on sinised."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q008",
      "unitId": "lo-opik-u15",
      "stem": "Vaata jaotusskeemi. Puuduta seda osa, mis katab suurema osa Maa pinnast.",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-water-visual",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Skeemil tähistab suurem ala vett.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-land-water",
        "correctRegionId": "water"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-land-water"
      }
    },
    {
      "id": "lo-opik-u15-q009",
      "unitId": "lo-opik-u15",
      "stem": "Puuduta jaotusskeemil maismaa osa.",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-water-visual",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maismaa moodustab ligikaudu kolm kümnendikku skeemist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-land-water",
        "correctRegionId": "land"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-land-water"
      }
    },
    {
      "id": "lo-opik-u15-q010",
      "unitId": "lo-opik-u15",
      "stem": "Kaks last vaidlevad. Üks ütleb, et suurem osa Maast on mered, teine ütleb, et maismaa. Kummal on õigus?",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-water-majority",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vett on Maa pinnal rohkem kui maismaad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Sellel, kes ütleb, et vesi katab enamiku pinnast."
          },
          {
            "id": "o2",
            "text": "Sellel, kes ütleb, et maismaa katab enamiku pinnast."
          },
          {
            "id": "o3",
            "text": "Mõlemal, sest vett ja maismaad on võrdselt."
          },
          {
            "id": "o4",
            "text": "Kummalgi pole, sest Maal on ainult jää."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q011",
      "unitId": "lo-opik-u15",
      "stem": "Rühmita näited: mis on maismaa ja mis on vesi?",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-land-water-examples",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrid ja saared on maismaa; ookeanid ja mered on veekogud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "maa",
            "text": "maismaa"
          },
          {
            "id": "vesi",
            "text": "vesi"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "saar"
          },
          {
            "id": "i2",
            "text": "manner"
          },
          {
            "id": "i3",
            "text": "ookean"
          },
          {
            "id": "i4",
            "text": "meri"
          }
        ],
        "correctGroupByItem": {
          "i1": "maa",
          "i2": "maa",
          "i3": "vesi",
          "i4": "vesi"
        }
      }
    },
    {
      "id": "lo-opik-u15-q012",
      "unitId": "lo-opik-u15",
      "stem": "Milline järeldus on õige, kui saarte ümber on vesi?",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-island-definition",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Saar on veega ümbritsetud maismaaosa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ka saared kuuluvad maismaa hulka."
          },
          {
            "id": "o2",
            "text": "Saared ei kuulu Maa pinna hulka."
          },
          {
            "id": "o3",
            "text": "Iga saar on eraldi manner."
          },
          {
            "id": "o4",
            "text": "Saared saavad olla üksnes Antarktisel."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q013",
      "unitId": "lo-opik-u15",
      "stem": "Mida saab järeldada väitest „maismaad on ligikaudu kolmandik Maa pinnast”?",
      "primaryObjectiveId": "lo-opik-u15-o1",
      "variantGroupId": "lo-opik-u15-g-one-third",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui umbes kolmandik on maismaa, on ülejäänud umbes kaks kolmandikku vesi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vett on ligikaudu kaks kolmandikku."
          },
          {
            "id": "o2",
            "text": "Vett ja maismaad on ühepalju."
          },
          {
            "id": "o3",
            "text": "Maa on peamiselt kuiv."
          },
          {
            "id": "o4",
            "text": "Mandreid on kolm."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q014",
      "unitId": "lo-opik-u15",
      "stem": "Mitu mandrit on selle õpiku järgi?",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-six-continents",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus kasutatakse kuue mandri jaotust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "6"
          },
          {
            "id": "o2",
            "text": "5"
          },
          {
            "id": "o3",
            "text": "7"
          },
          {
            "id": "o4",
            "text": "8"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q015",
      "unitId": "lo-opik-u15",
      "stem": "Vali kõik õpiku kuue mandri nimed.",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-continent-list",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrid: Euraasia, Aafrika, Põhja-Ameerika, Lõuna-Ameerika, Austraalia, Antarktis. Euroopa kuulub Euraasia koosseisu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Euraasia"
          },
          {
            "id": "o2",
            "text": "Aafrika"
          },
          {
            "id": "o3",
            "text": "Põhja-Ameerika"
          },
          {
            "id": "o4",
            "text": "Lõuna-Ameerika"
          },
          {
            "id": "o5",
            "text": "Austraalia"
          },
          {
            "id": "o6",
            "text": "Antarktis"
          },
          {
            "id": "o7",
            "text": "Euroopa"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2",
          "o3",
          "o4",
          "o5",
          "o6"
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o5"
      ]
    },
    {
      "id": "lo-opik-u15-q016",
      "unitId": "lo-opik-u15",
      "stem": "Kas Euroopa on õpiku järgi omaette manner?",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-europe-not-continent",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku kuue mandri jaotuses on Euroopa Euraasia mandri osa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ei, Euroopa kuulub Euraasia mandrisse."
          },
          {
            "id": "o2",
            "text": "Jah, Euroopa on seitsmes manner."
          },
          {
            "id": "o3",
            "text": "Ei, Euroopa asub Aafrika mandril."
          },
          {
            "id": "o4",
            "text": "Jah, Euroopa on Ameerika mandri osa."
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o5"
      ]
    },
    {
      "id": "lo-opik-u15-q017",
      "unitId": "lo-opik-u15",
      "stem": "Milline nendest on õpiku järgi manner?",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-antarctica-continent",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktis on manner; Antarktika on maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Antarktis"
          },
          {
            "id": "o2",
            "text": "Antarktika"
          },
          {
            "id": "o3",
            "text": "Euroopa"
          },
          {
            "id": "o4",
            "text": "Okeaania"
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o8"
      ]
    },
    {
      "id": "lo-opik-u15-q018",
      "unitId": "lo-opik-u15",
      "stem": "Millised neist on Ameerika kaks mandrit?",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-americas-two-continents",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ameerika maailmajagu hõlmab Põhja- ja Lõuna-Ameerika mandrit.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Põhja-Ameerika"
          },
          {
            "id": "o2",
            "text": "Lõuna-Ameerika"
          },
          {
            "id": "o3",
            "text": "Ameerika maailmajagu"
          },
          {
            "id": "o4",
            "text": "Euroopa"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2"
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o5"
      ]
    },
    {
      "id": "lo-opik-u15-q019",
      "unitId": "lo-opik-u15",
      "stem": "Miks ei ole Põhja-Ameerika ja Lõuna-Ameerika selle õpiku järgi üks manner?",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-americas-two-continents",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku järgi on need kaks mandrit, mis on maismaad pidi ühendatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Õpiku jaotuses loetakse need kaheks mandriks, kuigi maismaa ühendab neid."
          },
          {
            "id": "o2",
            "text": "Sest nende vahel puudub igasugune maaühendus."
          },
          {
            "id": "o3",
            "text": "Sest Ameerika on ainult ookeani nimi."
          },
          {
            "id": "o4",
            "text": "Sest mõlemad asuvad Euroopa sees."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q020",
      "unitId": "lo-opik-u15",
      "stem": "Millises paaris on mõlemad nimed selle õpiku mandrid?",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-continent-pairs",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aafrika ja Austraalia on mandrid. Euroopa ning Aasia on Euraasia maailmajaod.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Aafrika ja Austraalia"
          },
          {
            "id": "o2",
            "text": "Euroopa ja Aasia"
          },
          {
            "id": "o3",
            "text": "Euroopa ja Ameerika"
          },
          {
            "id": "o4",
            "text": "Okeaania ja Antarktika"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q021",
      "unitId": "lo-opik-u15",
      "stem": "Rühmita nimed mandriteks ja maailmajagudeks. Iga nimi paiguta siinses ülesandes sinna, kuhu see õpiku kuue jaotuse järgi kuulub.",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-continent-region-sort",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus on Euraasia ning mõlemad Ameerika maismaaosad mandrid; Euroopa, Aasia ja Ameerika on maailmajaod.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "mander",
            "text": "manner"
          },
          {
            "id": "jagu",
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
            "text": "Lõuna-Ameerika"
          },
          {
            "id": "i4",
            "text": "Euroopa"
          },
          {
            "id": "i5",
            "text": "Aasia"
          },
          {
            "id": "i6",
            "text": "Ameerika"
          }
        ],
        "correctGroupByItem": {
          "i1": "mander",
          "i2": "mander",
          "i3": "mander",
          "i4": "jagu",
          "i5": "jagu",
          "i6": "jagu"
        }
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o4",
        "lo-opik-u15-o5"
      ]
    },
    {
      "id": "lo-opik-u15-q022",
      "unitId": "lo-opik-u15",
      "stem": "Ühenda mandrid neile omase õpikus kirjeldatud tunnusega.",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-continents-attributes",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on suurim, Austraalia väikseim ja Antarktis jäine lõunamanner.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Euraasia"
          },
          {
            "id": "p2",
            "text": "Austraalia"
          },
          {
            "id": "p3",
            "text": "Antarktis"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "kõige suurem manner"
          },
          {
            "id": "c2",
            "text": "kõige väiksem manner"
          },
          {
            "id": "c3",
            "text": "lõunapoolusel asuv jäine manner"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2",
          "p3": "c3"
        }
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o3",
        "lo-opik-u15-o8"
      ]
    },
    {
      "id": "lo-opik-u15-q023",
      "unitId": "lo-opik-u15",
      "stem": "Näita mandrite maailmakaardil Aafrikat.",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-map-africa",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aafrika manner paikneb Euraasiast lõuna pool ja Atlandi ning India ookeani vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-continents",
        "correctRegionId": "africa"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-continents"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o6"
      ]
    },
    {
      "id": "lo-opik-u15-q024",
      "unitId": "lo-opik-u15",
      "stem": "Näita mandrite maailmakaardil Austraaliat.",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-map-australia",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Austraalia asub kaardi kaguosas ja on kuuest mandrist väikseim.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-continents",
        "correctRegionId": "australia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-continents"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o6"
      ]
    },
    {
      "id": "lo-opik-u15-q025",
      "unitId": "lo-opik-u15",
      "stem": "Näita mandrite maailmakaardil Euraasiat.",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-map-eurasia",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia ulatub kaardi põhjaosas Euroopast üle Aasia ida poole.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-continents",
        "correctRegionId": "eurasia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-continents"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o6"
      ]
    },
    {
      "id": "lo-opik-u15-q026",
      "unitId": "lo-opik-u15",
      "stem": "Näita mandrite maailmakaardil Põhja-Ameerikat.",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-map-north-america",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja-Ameerika asub maailmakaardi vasakus ülaosas, kui kaardi keskpunktis on nullmeridiaan.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-continents",
        "correctRegionId": "north-america"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-continents"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o6"
      ]
    },
    {
      "id": "lo-opik-u15-q027",
      "unitId": "lo-opik-u15",
      "stem": "Näita mandrite maailmakaardil Lõuna-Ameerikat.",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-map-south-america",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõuna-Ameerika asub Põhja-Ameerikast lõuna pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-continents",
        "correctRegionId": "south-america"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-continents"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o6"
      ]
    },
    {
      "id": "lo-opik-u15-q028",
      "unitId": "lo-opik-u15",
      "stem": "Näita mandrite maailmakaardil Antarktist.",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-map-antarctica",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktis asub lõunapooluse ümbruses maailmakaardi allosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-continents",
        "correctRegionId": "antarctica"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-continents"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o6",
        "lo-opik-u15-o8"
      ]
    },
    {
      "id": "lo-opik-u15-q029",
      "unitId": "lo-opik-u15",
      "stem": "Mille poolest erinevad nimetused „Põhja-Ameerika” ja „Ameerika”?",
      "primaryObjectiveId": "lo-opik-u15-o2",
      "variantGroupId": "lo-opik-u15-g-americas-two-continents",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja-Ameerika on üks kahest Ameerika mandrist; Ameerika on maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Põhja-Ameerika on manner, Ameerika maailmajagu."
          },
          {
            "id": "o2",
            "text": "Põhja-Ameerika on ookean, Ameerika manner."
          },
          {
            "id": "o3",
            "text": "Need on selles õpikus kaks täiesti samasugust mandrit."
          },
          {
            "id": "o4",
            "text": "Mõlemad on ainult Aasia muud nimed."
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o5"
      ]
    },
    {
      "id": "lo-opik-u15-q030",
      "unitId": "lo-opik-u15",
      "stem": "Milline on maailma suurim manner selle õpiku järgi?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-eurasia-largest",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on kuuest mandrist kõige suurem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Euraasia"
          },
          {
            "id": "o2",
            "text": "Austraalia"
          },
          {
            "id": "o3",
            "text": "Aafrika"
          },
          {
            "id": "o4",
            "text": "Antarktis"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q031",
      "unitId": "lo-opik-u15",
      "stem": "Milline on väikseim manner?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-australia-smallest",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Austraalia on õpiku järgi kõige väiksem manner.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Austraalia"
          },
          {
            "id": "o2",
            "text": "Antarktis"
          },
          {
            "id": "o3",
            "text": "Põhja-Ameerika"
          },
          {
            "id": "o4",
            "text": "Aafrika"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q032",
      "unitId": "lo-opik-u15",
      "stem": "Umbes mitu korda on Euraasia Austraaliast suurem?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-size-ratio",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik ütleb, et Euraasia on Austraaliast umbes seitse korda suurem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "7 korda"
          },
          {
            "id": "o2",
            "text": "2 korda"
          },
          {
            "id": "o3",
            "text": "20 korda"
          },
          {
            "id": "o4",
            "text": "100 korda"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q033",
      "unitId": "lo-opik-u15",
      "stem": "Millisel poolkeral on rohkem maismaad?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-north-more-land",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maismaad on põhjapoolkeral rohkem kui lõunapoolkeral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "põhjapoolkeral"
          },
          {
            "id": "o2",
            "text": "lõunapoolkeral"
          },
          {
            "id": "o3",
            "text": "täpselt võrdselt"
          },
          {
            "id": "o4",
            "text": "ainult ekvaatoril"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q034",
      "unitId": "lo-opik-u15",
      "stem": "Millised mandrid on maismaad pidi seotud?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-land-bridges",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aafrika–Euraasia ning Põhja–Lõuna-Ameerika vahel on maismaaühendus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Aafrika ja Euraasia"
          },
          {
            "id": "o2",
            "text": "Põhja-Ameerika ja Lõuna-Ameerika"
          },
          {
            "id": "o3",
            "text": "Austraalia ja Antarktis"
          },
          {
            "id": "o4",
            "text": "Austraalia ja Aafrika"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2"
        ]
      }
    },
    {
      "id": "lo-opik-u15-q035",
      "unitId": "lo-opik-u15",
      "stem": "Kas maismaaühendus Aafrika ja Euraasia vahel teeb neist õpiku järgi ühe mandri?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-africa-eurasia-bridge",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku mandrite jaotuses loetakse Aafrikat ja Euraasiat kaheks mandriks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ei, õpikus on need kaks eraldi mandrit."
          },
          {
            "id": "o2",
            "text": "Jah, kõik ühendatud maismaa on alati üks manner."
          },
          {
            "id": "o3",
            "text": "Jah, aga ainult talvel."
          },
          {
            "id": "o4",
            "text": "Ei, sest Euraasia on saar."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q036",
      "unitId": "lo-opik-u15",
      "stem": "Milline lause kirjeldab õigesti maismaa jaotust?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-hemisphere-nuance",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maismaad on rohkem põhjapoolkeral, kuid vesi katab suurema osa mõlemast poolkerast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Põhjapoolkeral on maismaad rohkem, kuid ka seal on vett rohkem kui maismaad."
          },
          {
            "id": "o2",
            "text": "Lõunapoolkeral on maismaad rohkem kui põhjapoolkeral."
          },
          {
            "id": "o3",
            "text": "Põhjapoolkera on tervenisti maismaa."
          },
          {
            "id": "o4",
            "text": "Lõunapoolkeral puudub maismaa."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q037",
      "unitId": "lo-opik-u15",
      "stem": "Miks ei ole mandrite paiknemine maailmakaardil sümmeetriline?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-uneven-land",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maismaa jaotub ebaühtlaselt põhjapoolkera ja lõunapoolkera vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Maismaa ja vesi paiknevad Maal ebaühtlaselt."
          },
          {
            "id": "o2",
            "text": "Kõik mandrid on täpselt ühesuurused."
          },
          {
            "id": "o3",
            "text": "Kõik mandrid asuvad ekvaatoril."
          },
          {
            "id": "o4",
            "text": "Mered asuvad vaid põhjapoolkeral."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q038",
      "unitId": "lo-opik-u15",
      "stem": "Järjesta mandrid suuruse kirjelduste põhjal: suurimast väiksemani.",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-size-ranking-three",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on suurim ja Austraalia väikseim; Aafrika jääb nende vahele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Euraasia — suurim"
          },
          {
            "id": "s2",
            "text": "Aafrika — Euraasiast väiksem, Austraaliast suurem"
          },
          {
            "id": "s3",
            "text": "Austraalia — väikseim"
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3"
        ],
        "firstLabel": "Suurim",
        "lastLabel": "Väikseim"
      }
    },
    {
      "id": "lo-opik-u15-q039",
      "unitId": "lo-opik-u15",
      "stem": "Kahel lapsel on eri kaardid. Üks otsib suurimat mandrit ja teine väikseimat. Millise paari peavad nad leidma?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-extremes-pair",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Suurim on Euraasia, väikseim Austraalia.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Euraasia ja Austraalia"
          },
          {
            "id": "o2",
            "text": "Aasia ja Euroopa"
          },
          {
            "id": "o3",
            "text": "Antarktika ja Ameerika"
          },
          {
            "id": "o4",
            "text": "Aafrika ja Euraasia"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q040",
      "unitId": "lo-opik-u15",
      "stem": "Järjesta need kolm mandrit maailmakaardil üldiselt põhjast lõunasse.",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-north-to-south-map",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nende mandrite põhiosas paikneb Põhja-Ameerika kõrgematel laiustel, seejärel Lõuna-Ameerika ning kõige lõunas Antarktis.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Põhja-Ameerika"
          },
          {
            "id": "s2",
            "text": "Lõuna-Ameerika"
          },
          {
            "id": "s3",
            "text": "Antarktis"
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3"
        ],
        "firstLabel": "Põhja pool",
        "lastLabel": "Lõuna pool"
      }
    },
    {
      "id": "lo-opik-u15-q041",
      "unitId": "lo-opik-u15",
      "stem": "Milline järgmistest väidetest on õpiku mandrite kaardi põhjal õige?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-southern-continent-where",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktis paikneb lõunapooluse ümbruses ja Austraaliast lõuna pool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Antarktis paikneb palju lõuna pool Austraaliat."
          },
          {
            "id": "o2",
            "text": "Austraalia paikneb Põhja-Ameerikast põhja pool."
          },
          {
            "id": "o3",
            "text": "Antarktis asub põhjapoolusel."
          },
          {
            "id": "o4",
            "text": "Aafrika asub täielikult põhjapoolkeral."
          }
        ],
        "correctOptionId": "o1"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-continents"
      }
    },
    {
      "id": "lo-opik-u15-q042",
      "unitId": "lo-opik-u15",
      "stem": "Kui Põhja- ja Lõuna-Ameerika vahel on kitsas maaühendus, mida võib õpiku kuue mandri jaotuse kohta öelda?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-landbridge-consequence",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrite jaotuses võivad maismaad pidi ühendatud alad olla eri mandrid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Need jäävad ikkagi kaheks mandriks."
          },
          {
            "id": "o2",
            "text": "Need muutuvad Austraalia osaks."
          },
          {
            "id": "o3",
            "text": "Neil ei saa olla ühist maailmajao nime."
          },
          {
            "id": "o4",
            "text": "Neist peab saama Euroopa osa."
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o2"
      ]
    },
    {
      "id": "lo-opik-u15-q043",
      "unitId": "lo-opik-u15",
      "stem": "Tabel näitab õpiku kahte äärmust. Milline järeldus on õige?",
      "primaryObjectiveId": "lo-opik-u15-o3",
      "variantGroupId": "lo-opik-u15-g-size-from-table",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on suurim ja Austraalia väikseim manner.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Euraasia on Austraaliast suurem."
          },
          {
            "id": "o2",
            "text": "Austraalia on Euraasiast suurem."
          },
          {
            "id": "o3",
            "text": "Mõlemad on täpselt ühesuurused."
          },
          {
            "id": "o4",
            "text": "Aafrika peab olema kõigist suurem."
          }
        ],
        "correctOptionId": "o1"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Manner",
          "Õpiku kirjeldus"
        ],
        "rows": [
          [
            "Euraasia",
            "suurim"
          ],
          [
            "Austraalia",
            "väikseim"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u15-q044",
      "unitId": "lo-opik-u15",
      "stem": "Mida tähendab mõiste „maailmajagu”?",
      "primaryObjectiveId": "lo-opik-u15-o4",
      "variantGroupId": "lo-opik-u15-g-region-definition",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmajagu on suur piirkond, mille jaotust mõjutavad ka ajalugu ja kultuur.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "suur ajaloo ja kultuuriga seotud maailma piirkond"
          },
          {
            "id": "o2",
            "text": "ainult üks riik"
          },
          {
            "id": "o3",
            "text": "ainult ookean"
          },
          {
            "id": "o4",
            "text": "ainult kauge saar"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q045",
      "unitId": "lo-opik-u15",
      "stem": "Mida peetakse mandri määramisel eelkõige silmas?",
      "primaryObjectiveId": "lo-opik-u15-o4",
      "variantGroupId": "lo-opik-u15-g-continent-vs-culture",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Manner on eelkõige suur maismaaosa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "suurt maismaaosa"
          },
          {
            "id": "o2",
            "text": "riigikeelt"
          },
          {
            "id": "o3",
            "text": "pealinnade arvu"
          },
          {
            "id": "o4",
            "text": "elanike rahvust"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q046",
      "unitId": "lo-opik-u15",
      "stem": "Õige või vale? Maailmajagu peab alati olema igast küljest ookeaniga eraldatud.",
      "primaryObjectiveId": "lo-opik-u15-o4",
      "variantGroupId": "lo-opik-u15-g-worldpart-not-water",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vale. Euroopa ja Aasia vahel ei ole kogu piiri ulatuses ookeani.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "yes",
            "text": "Õige"
          },
          {
            "id": "no",
            "text": "Vale"
          }
        ],
        "correctOptionId": "no",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u15-q047",
      "unitId": "lo-opik-u15",
      "stem": "Milline võrdlus kirjeldab mandrit ja maailmajagu kõige paremini?",
      "primaryObjectiveId": "lo-opik-u15-o4",
      "variantGroupId": "lo-opik-u15-g-basic-comparison",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmajagu ei pea kattuma ühe suure maismaaosaga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Manner on maismaaosa, maailmajagu võib hõlmata ka saari ning arvestada ajalugu ja kultuuri."
          },
          {
            "id": "o2",
            "text": "Manner on riik, maailmajagu on linn."
          },
          {
            "id": "o3",
            "text": "Manner ja maailmajagu on igas õpikus alati sama asi."
          },
          {
            "id": "o4",
            "text": "Manner tähendab ainult mäestikku."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q048",
      "unitId": "lo-opik-u15",
      "stem": "Miks võib üks manner jaguneda kaheks maailmajaoks?",
      "primaryObjectiveId": "lo-opik-u15-o4",
      "variantGroupId": "lo-opik-u15-g-worldpart-culture",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Näiteks Euraasia mandril on Euroopa ja Aasia maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Maailmajagude piire mõjutavad peale looduse ka ajalugu ja kultuur."
          },
          {
            "id": "o2",
            "text": "Üks manner peab alati olema kaks saart."
          },
          {
            "id": "o3",
            "text": "Igal maailmajaol on oma ookean."
          },
          {
            "id": "o4",
            "text": "Manner kaotab siis maismaa."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q049",
      "unitId": "lo-opik-u15",
      "stem": "Kas maailmajagu võib koosneda kahest mandrist?",
      "primaryObjectiveId": "lo-opik-u15-o4",
      "variantGroupId": "lo-opik-u15-g-americas-two-continents",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ameerika maailmajagu hõlmab kahte mandrit.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Jah, Ameerika on selle näiteks."
          },
          {
            "id": "o2",
            "text": "Ei, see on võimatu."
          },
          {
            "id": "o3",
            "text": "Jah, aga üksnes Euroopa puhul."
          },
          {
            "id": "o4",
            "text": "Ainult siis, kui neil ei ole elanikke."
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o5"
      ]
    },
    {
      "id": "lo-opik-u15-q050",
      "unitId": "lo-opik-u15",
      "stem": "Rühmita väited: kas need käivad mandri või maailmajao kohta?",
      "primaryObjectiveId": "lo-opik-u15-o4",
      "variantGroupId": "lo-opik-u15-g-term-grouping",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on manner ja Euroopa maailmajagu; nende mõistete rõhuasetused erinevad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
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
            "id": "w",
            "text": "maailmajagu"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "määratletakse peamiselt suure maismaaosana"
          },
          {
            "id": "i2",
            "text": "piirides arvestatakse ka inimeste ajalugu"
          },
          {
            "id": "i3",
            "text": "näiteks Euraasia"
          },
          {
            "id": "i4",
            "text": "näiteks Euroopa"
          }
        ],
        "correctGroupByItem": {
          "i1": "m",
          "i2": "w",
          "i3": "m",
          "i4": "w"
        }
      }
    },
    {
      "id": "lo-opik-u15-q051",
      "unitId": "lo-opik-u15",
      "stem": "Mari näeb kaardil ainult Euraasia nime, teisel kaardil Euroopa ja Aasia nimesid. Mis on kõige tõenäolisem põhjus?",
      "primaryObjectiveId": "lo-opik-u15-o4",
      "variantGroupId": "lo-opik-u15-g-two-map-reason",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Manner Euraasia vastab kahele maailmajaole: Euroopa ja Aasia.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Esimene kaart näitab mandreid, teine maailmajagusid."
          },
          {
            "id": "o2",
            "text": "Kaardid ei kujuta Maad."
          },
          {
            "id": "o3",
            "text": "Euroopa on äkki muutunud ookeaniks."
          },
          {
            "id": "o4",
            "text": "Mõlemad kaardid peavad valed olema."
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o5"
      ]
    },
    {
      "id": "lo-opik-u15-q052",
      "unitId": "lo-opik-u15",
      "stem": "Vali kõik õiged väited.",
      "primaryObjectiveId": "lo-opik-u15-o4",
      "variantGroupId": "lo-opik-u15-g-summary-concepts",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmajao ja mandri piirid ning nimetused ei lange alati kokku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Maailmajao piir ei pruugi olla looduslik piir."
          },
          {
            "id": "o2",
            "text": "Manner tähendab väga suurt maismaaosa."
          },
          {
            "id": "o3",
            "text": "Iga maailmajagu on kindlasti täpselt üks manner."
          },
          {
            "id": "o4",
            "text": "Maailmajaod võivad arvestada kultuurilugu."
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
      "id": "lo-opik-u15-q053",
      "unitId": "lo-opik-u15",
      "stem": "Ühenda seletus õige mõistega.",
      "primaryObjectiveId": "lo-opik-u15-o4",
      "variantGroupId": "lo-opik-u15-g-definitions-match",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Manner, maailmajagu ja saar on eri mõisted.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "suur maismaaosa"
          },
          {
            "id": "p2",
            "text": "ajaloo ja kultuuriga seotud suurem piirkond"
          },
          {
            "id": "p3",
            "text": "väiksem maismaaosa, mida igast küljest ümbritseb vesi"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "manner"
          },
          {
            "id": "c2",
            "text": "maailmajagu"
          },
          {
            "id": "c3",
            "text": "saar"
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
      "id": "lo-opik-u15-q054",
      "unitId": "lo-opik-u15",
      "stem": "Kuidas peaksid vastama, kui ühel maailmakaardil on Euraasia ja teisel Euroopa ning Aasia?",
      "primaryObjectiveId": "lo-opik-u15-o4",
      "variantGroupId": "lo-opik-u15-g-valid-two-maps",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrite ja maailmajagude kaart jaotavad Maad erinevalt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Mõlemad võivad õiged olla, sest kasutatakse eri jaotust."
          },
          {
            "id": "o2",
            "text": "Vastama peab alati, et Ameerika on sama mis Euraasia."
          },
          {
            "id": "o3",
            "text": "Üks kaart peab näitama ainult meresid."
          },
          {
            "id": "o4",
            "text": "Kui nimed erinevad, ei kujuta kumbki Maad."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q055",
      "unitId": "lo-opik-u15",
      "stem": "Mitu maailmajagu on õpiku järgi?",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-six-worldparts",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus on kuus maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "6"
          },
          {
            "id": "o2",
            "text": "4"
          },
          {
            "id": "o3",
            "text": "7"
          },
          {
            "id": "o4",
            "text": "9"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q056",
      "unitId": "lo-opik-u15",
      "stem": "Vali kõik kuue maailmajao nimetused õpiku järgi.",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-worldparts-list",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuus maailmajagu: Euroopa, Aasia, Aafrika, Ameerika, Austraalia ja Okeaania, Antarktika.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Euroopa"
          },
          {
            "id": "o2",
            "text": "Aasia"
          },
          {
            "id": "o3",
            "text": "Aafrika"
          },
          {
            "id": "o4",
            "text": "Ameerika"
          },
          {
            "id": "o5",
            "text": "Austraalia ja Okeaania"
          },
          {
            "id": "o6",
            "text": "Antarktika"
          },
          {
            "id": "o7",
            "text": "Euraasia"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2",
          "o3",
          "o4",
          "o5",
          "o6"
        ]
      }
    },
    {
      "id": "lo-opik-u15-q057",
      "unitId": "lo-opik-u15",
      "stem": "Millised kaks maailmajagu asuvad Euraasia mandril?",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-europe-not-continent",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia mandril asuvad Euroopa ja Aasia maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Euroopa"
          },
          {
            "id": "o2",
            "text": "Aasia"
          },
          {
            "id": "o3",
            "text": "Ameerika"
          },
          {
            "id": "o4",
            "text": "Antarktika"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2"
        ]
      }
    },
    {
      "id": "lo-opik-u15-q058",
      "unitId": "lo-opik-u15",
      "stem": "Kuidas nimetatakse ühte maailmajagu, kuhu kuuluvad Põhja- ja Lõuna-Ameerika?",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-americas-two-continents",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ameerika on üks maailmajagu, mis hõlmab kaht mandrit.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ameerika"
          },
          {
            "id": "o2",
            "text": "Euraasia"
          },
          {
            "id": "o3",
            "text": "Antarktika"
          },
          {
            "id": "o4",
            "text": "Austraalia ja Okeaania"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q059",
      "unitId": "lo-opik-u15",
      "stem": "Kuidas nimetatakse maailmajagu, kuhu kuuluvad Austraalia manner ja palju ookeanisaari?",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-australia-oceania",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Austraalia ja Okeaania on maailmajagu, kuhu kuulub Austraalia manner ja palju saari.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Austraalia ja Okeaania"
          },
          {
            "id": "o2",
            "text": "Euraasia"
          },
          {
            "id": "o3",
            "text": "Põhja-Ameerika"
          },
          {
            "id": "o4",
            "text": "Euroopa"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q060",
      "unitId": "lo-opik-u15",
      "stem": "Milline tabelirida näitab õigesti üht mandrit ja kahte maailmajagu?",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-europe-not-continent",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on üks manner, mis hõlmab kahte maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Euraasia → Euroopa ja Aasia"
          },
          {
            "id": "o2",
            "text": "Austraalia → Põhja- ja Lõuna-Ameerika"
          },
          {
            "id": "o3",
            "text": "Antarktis → Euroopa ja Aasia"
          },
          {
            "id": "o4",
            "text": "Aafrika → Ameerika ja Antarktika"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q061",
      "unitId": "lo-opik-u15",
      "stem": "Ühenda nimi õigete seostega.",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-worldpart-relation-match",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrite ja maailmajagude nimetused ei kattu alati.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
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
            "text": "Ameerika maailmajagu"
          },
          {
            "id": "p3",
            "text": "Austraalia ja Okeaania"
          },
          {
            "id": "p4",
            "text": "Antarktika maailmajagu"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Euroopa ja Aasia maailmajaod"
          },
          {
            "id": "c2",
            "text": "Põhja- ja Lõuna-Ameerika mandrid"
          },
          {
            "id": "c3",
            "text": "Austraalia manner ning saared"
          },
          {
            "id": "c4",
            "text": "Antarktise manner"
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
      "id": "lo-opik-u15-q062",
      "unitId": "lo-opik-u15",
      "stem": "Milline väide Ameerika kohta on õige?",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-americas-two-continents",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ameerika hõlmab Põhja- ja Lõuna-Ameerikat.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ameerika maailmajagu hõlmab kahte mandrit."
          },
          {
            "id": "o2",
            "text": "Ameerika on õpiku ainus manner."
          },
          {
            "id": "o3",
            "text": "Ameerika asub ainult Euraasias."
          },
          {
            "id": "o4",
            "text": "Ameerika maailmajaos asub Antarktis."
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o2"
      ]
    },
    {
      "id": "lo-opik-u15-q063",
      "unitId": "lo-opik-u15",
      "stem": "Rühmita nimed: millised on mandrid ja millised maailmajaod?",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-continent-region-sort",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia ja Põhja-Ameerika on mandrid; Euroopa, Aasia, Ameerika ja Austraalia ja Okeaania on maailmajaod.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
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
            "id": "w",
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
            "text": "Ameerika"
          },
          {
            "id": "i4",
            "text": "Euroopa"
          },
          {
            "id": "i5",
            "text": "Aasia"
          },
          {
            "id": "i6",
            "text": "Austraalia ja Okeaania"
          }
        ],
        "correctGroupByItem": {
          "i1": "m",
          "i2": "m",
          "i3": "w",
          "i4": "w",
          "i5": "w",
          "i6": "w"
        }
      }
    },
    {
      "id": "lo-opik-u15-q064",
      "unitId": "lo-opik-u15",
      "stem": "Mis on tähtsaim erinevus nimetuste „Austraalia” ja „Austraalia ja Okeaania” vahel?",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-australia-oceania",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Austraalia ja Okeaania hõlmab lisaks Austraalia mandrile ka saari.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Esimene on manner, teine seda ja saari hõlmav maailmajagu."
          },
          {
            "id": "o2",
            "text": "Esimene on ookean ja teine jõgi."
          },
          {
            "id": "o3",
            "text": "Need on kaks sama mandri eri pealinna."
          },
          {
            "id": "o4",
            "text": "Teine tähendab ainult Antarktist."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q065",
      "unitId": "lo-opik-u15",
      "stem": "Kaardile on kirjutatud „Mandrid”. Millise nime valid suurele maismaaosale, kus asuvad Euroopa ja Aasia?",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-europe-not-continent",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrite kaardil kasutatakse nime Euraasia.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Euraasia"
          },
          {
            "id": "o2",
            "text": "Euroopa"
          },
          {
            "id": "o3",
            "text": "Aasia"
          },
          {
            "id": "o4",
            "text": "Okeaania"
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o6"
      ]
    },
    {
      "id": "lo-opik-u15-q066",
      "unitId": "lo-opik-u15",
      "stem": "Kaardile on kirjutatud „Maailmajaod”. Millised kaks nime asuvad Euraasia alal?",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-europe-not-continent",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmajagude kaardil on Euraasia alal Euroopa ja Aasia.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Euroopa"
          },
          {
            "id": "o2",
            "text": "Aasia"
          },
          {
            "id": "o3",
            "text": "Põhja-Ameerika"
          },
          {
            "id": "o4",
            "text": "Antarktika"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2"
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o6"
      ]
    },
    {
      "id": "lo-opik-u15-q067",
      "unitId": "lo-opik-u15",
      "stem": "Kuidas lahendada kaardiülesanne, milles küsitakse üht maailmajagu, kuid näidatakse kahte Ameerika mandrit?",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-americas-two-continents",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja- ja Lõuna-Ameerika koos kuuluvad Ameerika maailmajakku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vasta „Ameerika”."
          },
          {
            "id": "o2",
            "text": "Vasta „Euraasia”."
          },
          {
            "id": "o3",
            "text": "Vasta „Antarktika”."
          },
          {
            "id": "o4",
            "text": "Ülesandel pole õiget vastust."
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o6"
      ]
    },
    {
      "id": "lo-opik-u15-q068",
      "unitId": "lo-opik-u15",
      "stem": "Vali tabelist õige seos.",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-antarctica-continent",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktis on manner, Antarktika on maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Antarktis → Antarktika"
          },
          {
            "id": "o2",
            "text": "Antarktis → Okeaania"
          },
          {
            "id": "o3",
            "text": "Euraasia → Ameerika"
          },
          {
            "id": "o4",
            "text": "Austraalia → Aasia"
          }
        ],
        "correctOptionId": "o1"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Mõiste",
          "Tüüp"
        ],
        "rows": [
          [
            "Antarktis",
            "manner"
          ],
          [
            "Antarktika",
            "maailmajagu"
          ]
        ]
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o8"
      ]
    },
    {
      "id": "lo-opik-u15-q069",
      "unitId": "lo-opik-u15",
      "stem": "Võrdlusskeemil on näidatud kaks juhtumit. Puuduta näidet, milles üks manner hõlmab kahte maailmajagu.",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-links-eurasia",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on üks manner, kus asuvad Euroopa ja Aasia maailmajaod.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-continent-worldpart-links",
        "correctRegionId": "eurasia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-continent-worldpart-links"
      }
    },
    {
      "id": "lo-opik-u15-q070",
      "unitId": "lo-opik-u15",
      "stem": "Võrdlusskeemil on näidatud kaks juhtumit. Puuduta näidet, milles kaks mandrit kuuluvad ühte maailmajagu.",
      "primaryObjectiveId": "lo-opik-u15-o5",
      "variantGroupId": "lo-opik-u15-g-americas-two-continents",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja- ja Lõuna-Ameerika kuuluvad Ameerika maailmajakku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-continent-worldpart-links",
        "correctRegionId": "america"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-continent-worldpart-links"
      }
    },
    {
      "id": "lo-opik-u15-q071",
      "unitId": "lo-opik-u15",
      "stem": "Milline pealkiri sobib kaardile, kus on Euraasia, Aafrika ja Austraalia mandrid?",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-map-title-continents",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on mandri nimi, seega on kaart mandrite kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Mandrid"
          },
          {
            "id": "o2",
            "text": "Maailmajaod"
          },
          {
            "id": "o3",
            "text": "Riikide pealinnad"
          },
          {
            "id": "o4",
            "text": "Eesti maakonnad"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q072",
      "unitId": "lo-opik-u15",
      "stem": "Milline pealkiri sobib kaardile, kus on Euroopa, Aasia ja Ameerika maailmajaod?",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-map-title-worldparts",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa ja Aasia on õpiku kuuejaotuse järgi maailmajaod.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Maailmajaod"
          },
          {
            "id": "o2",
            "text": "Mandrid"
          },
          {
            "id": "o3",
            "text": "Ookeanide sügavus"
          },
          {
            "id": "o4",
            "text": "Riigipiirid"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q073",
      "unitId": "lo-opik-u15",
      "stem": "Mis aitab aru saada, mida kaardi värvid ja märgid tähendavad?",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-map-legend",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Legend selgitab kaardil kasutatavaid värve ja märke.",
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
            "id": "o1",
            "text": "kaardi legend"
          },
          {
            "id": "o2",
            "text": "kaardi taga olev tühi leht"
          },
          {
            "id": "o3",
            "text": "ainult kaardi suurus"
          },
          {
            "id": "o4",
            "text": "ainult kaardi valmistamise aasta"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q074",
      "unitId": "lo-opik-u15",
      "stem": "Miks tuleb enne vastamist kaardi pealkirja vaadata?",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-why-read-title",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pealkiri määrab, mille kohta küsimus käib.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Et teada, kas kujutatud on näiteks mandreid või maailmajagusid."
          },
          {
            "id": "o2",
            "text": "Et teada ainult paberi hinda."
          },
          {
            "id": "o3",
            "text": "Et lugeda riigi rahvaarv läbi."
          },
          {
            "id": "o4",
            "text": "Sest kõik kaardid on ühesugused."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q075",
      "unitId": "lo-opik-u15",
      "stem": "Ühenda kaardi pealkiri sobivate nimedega.",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-map-title-match",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrite ja maailmajagude kaardid kasutavad eri nimeloendeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Mandrid"
          },
          {
            "id": "p2",
            "text": "Maailmajaod"
          },
          {
            "id": "p3",
            "text": "Veekogud"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Euraasia, Põhja-Ameerika, Austraalia"
          },
          {
            "id": "c2",
            "text": "Euroopa, Ameerika, Austraalia ja Okeaania"
          },
          {
            "id": "c3",
            "text": "mered ja ookeanid"
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
      "id": "lo-opik-u15-q076",
      "unitId": "lo-opik-u15",
      "stem": "Rühmita: millisele kaardile nimi kuulub? Ükski nimi ei esine siin korraga mõlemas rühmas.",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-continent-region-sort",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrite kaardi nimed erinevad maailmajagude kaardi nimedest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "m",
            "text": "Mandrite kaart"
          },
          {
            "id": "w",
            "text": "Maailmajagude kaart"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Euraasia"
          },
          {
            "id": "i2",
            "text": "Lõuna-Ameerika"
          },
          {
            "id": "i3",
            "text": "Euroopa"
          },
          {
            "id": "i4",
            "text": "Aasia"
          },
          {
            "id": "i5",
            "text": "Ameerika"
          },
          {
            "id": "i6",
            "text": "Antarktis"
          }
        ],
        "correctGroupByItem": {
          "i1": "m",
          "i2": "m",
          "i3": "w",
          "i4": "w",
          "i5": "w",
          "i6": "m"
        }
      }
    },
    {
      "id": "lo-opik-u15-q077",
      "unitId": "lo-opik-u15",
      "stem": "Puuduta maailmajagude skeemil Euroopat.",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-region-map-europe",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa asub Euraasia lääneosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-parts",
        "correctRegionId": "europe"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-parts"
      }
    },
    {
      "id": "lo-opik-u15-q078",
      "unitId": "lo-opik-u15",
      "stem": "Puuduta maailmajagude skeemil Aasiat.",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-region-map-asia",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aasia asub Euraasia idaosas ning hõlmab väga suurt ala.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-parts",
        "correctRegionId": "asia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-parts"
      }
    },
    {
      "id": "lo-opik-u15-q079",
      "unitId": "lo-opik-u15",
      "stem": "Puuduta maailmajagude skeemil Aafrikat.",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-map-africa",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aafrika paikneb Euroopa lõuna pool ja ulatub üle ekvaatori.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-parts",
        "correctRegionId": "africa"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-parts"
      }
    },
    {
      "id": "lo-opik-u15-q080",
      "unitId": "lo-opik-u15",
      "stem": "Puuduta maailmajagude skeemil Ameerikat.",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-region-map-america",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ameerika maailmajagu hõlmab Põhja- ja Lõuna-Ameerika.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-parts",
        "correctRegionId": "america"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-parts"
      }
    },
    {
      "id": "lo-opik-u15-q081",
      "unitId": "lo-opik-u15",
      "stem": "Puuduta maailmajagude skeemil Austraaliat ja Okeaaniat.",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-region-map-oceania",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Austraalia ja Okeaania hõlmab Austraalia mandrit ja ümbritsevaid ookeanisaari.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-parts",
        "correctRegionId": "australia-oceania"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-parts"
      }
    },
    {
      "id": "lo-opik-u15-q082",
      "unitId": "lo-opik-u15",
      "stem": "Puuduta maailmajagude skeemil Antarktikat.",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-map-antarctica",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktika on lõunapooluse ümbruses paiknev maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-parts",
        "correctRegionId": "antarctica"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-parts"
      }
    },
    {
      "id": "lo-opik-u15-q083",
      "unitId": "lo-opik-u15",
      "stem": "Kui kaardil on Euraasia eraldi märgitud, kas see kaart kujutab mandreid või maailmajagusid?",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-map-title-continents",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euraasia on selles õpikus manner.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "mandreid"
          },
          {
            "id": "o2",
            "text": "maailmajagusid"
          },
          {
            "id": "o3",
            "text": "riike"
          },
          {
            "id": "o4",
            "text": "linnade tänavaid"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q084",
      "unitId": "lo-opik-u15",
      "stem": "Järjesta sammud maailmakaardi ülesande lahendamiseks.",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-map-method",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pealkiri ja legend aitavad määrata, mida kaardil näidatakse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "60–61"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Loe kaardi pealkiri."
          },
          {
            "id": "s2",
            "text": "Vaata legendi või selgitust."
          },
          {
            "id": "s3",
            "text": "Leia küsitud ala ja vali vastus."
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3"
        ],
        "firstLabel": "Kõigepealt",
        "lastLabel": "Lõpuks"
      }
    },
    {
      "id": "lo-opik-u15-q085",
      "unitId": "lo-opik-u15",
      "stem": "Kaardil on silt „Maailmajaod”. Milline nimi peab sel kaardil kuuluma Austraalia mandri ja saarte juurde?",
      "primaryObjectiveId": "lo-opik-u15-o6",
      "variantGroupId": "lo-opik-u15-g-australia-oceania",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailmajagude kaardil on nimi Austraalia ja Okeaania.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "61"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Austraalia ja Okeaania"
          },
          {
            "id": "o2",
            "text": "Euraasia"
          },
          {
            "id": "o3",
            "text": "Antarktis"
          },
          {
            "id": "o4",
            "text": "Lõuna-Ameerika"
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o5"
      ]
    },
    {
      "id": "lo-opik-u15-q086",
      "unitId": "lo-opik-u15",
      "stem": "Millises maailmajaos asuvad maailma kõrgeimad mäed?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-asia-high-mountains",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku järgi on maailma kõrgeimad mäed Aasias.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Aasias"
          },
          {
            "id": "o2",
            "text": "Euroopas"
          },
          {
            "id": "o3",
            "text": "Ameerikas"
          },
          {
            "id": "o4",
            "text": "Antarktikas"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q087",
      "unitId": "lo-opik-u15",
      "stem": "Milline maailmajagu asub Euraasia lääneosas?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-europe-in-eurasia",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa paikneb Euraasia lääneosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Euroopa"
          },
          {
            "id": "o2",
            "text": "Aafrika"
          },
          {
            "id": "o3",
            "text": "Ameerika"
          },
          {
            "id": "o4",
            "text": "Antarktika"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q088",
      "unitId": "lo-opik-u15",
      "stem": "Millise maailmajao kohta ütleb õpik, et seal on nii kuivi kõrbi kui ka vihmametsi?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-africa-deserts-rainforest",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aafrikas leidub tohutuid kõrbealasid ja liigirikkaid vihmametsi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Aafrika"
          },
          {
            "id": "o2",
            "text": "Euroopa"
          },
          {
            "id": "o3",
            "text": "Antarktika"
          },
          {
            "id": "o4",
            "text": "Austraalia ja Okeaania"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q089",
      "unitId": "lo-opik-u15",
      "stem": "Millise maailmajao lääneosas on pikk mäestikuvöönd, kus esineb vulkaane ja maavärinaid?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-america-west-mountains",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik kirjeldab Ameerika lääneosas ulatuvat mäestikuvööndit.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ameerika"
          },
          {
            "id": "o2",
            "text": "Antarktika"
          },
          {
            "id": "o3",
            "text": "Austraalia ja Okeaania"
          },
          {
            "id": "o4",
            "text": "Euroopa"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q090",
      "unitId": "lo-opik-u15",
      "stem": "Millises maailmajaos on palju mujal maailmas haruldasi või ainult seal elavaid loomi ja kasvavaid taimi?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-australia-unique-nature",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik rõhutab Austraalia ja Okeaania omapärast loodust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Austraalia ja Okeaania"
          },
          {
            "id": "o2",
            "text": "Euroopa"
          },
          {
            "id": "o3",
            "text": "Antarktika"
          },
          {
            "id": "o4",
            "text": "Ameerika"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q091",
      "unitId": "lo-opik-u15",
      "stem": "Millised kaks väga suure rahvaarvuga riiki asuvad õpiku järgi Aasias?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-asia-india-china",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "India ja Hiina asuvad Aasias ning on väga suure rahvaarvuga riigid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "India"
          },
          {
            "id": "o2",
            "text": "Hiina"
          },
          {
            "id": "o3",
            "text": "Brasiilia"
          },
          {
            "id": "o4",
            "text": "Kanada"
          }
        ],
        "correctOptionIds": [
          "o1",
          "o2"
        ]
      }
    },
    {
      "id": "lo-opik-u15-q092",
      "unitId": "lo-opik-u15",
      "stem": "Ühenda maailmajagu ja talle iseloomulik õpiku kirjeldus.",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-features-match",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Igal maailmajaol on õpikus erinevad looduslikud ja inimeste paiknemise tunnused.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Euroopa"
          },
          {
            "id": "p2",
            "text": "Aasia"
          },
          {
            "id": "p3",
            "text": "Aafrika"
          },
          {
            "id": "p4",
            "text": "Austraalia ja Okeaania"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Euraasia lääneosa, tihe asustus"
          },
          {
            "id": "c2",
            "text": "maailma kõrgeimad mäed"
          },
          {
            "id": "c3",
            "text": "suured kõrbed ja vihmametsad"
          },
          {
            "id": "c4",
            "text": "palju ainulaadseid liike"
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
      "id": "lo-opik-u15-q093",
      "unitId": "lo-opik-u15",
      "stem": "Milline väide Aafrika kohta sobib õpikuga?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-africa-deserts-rainforest",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aafrikas on eri kliima- ja loodusolud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Seal on nii kuivi kõrbealasid kui ka vihmarohkeid metsi."
          },
          {
            "id": "o2",
            "text": "Kogu Aafrika on aasta läbi jääga kaetud."
          },
          {
            "id": "o3",
            "text": "Aafrikas ei ole ühtegi taime."
          },
          {
            "id": "o4",
            "text": "Aafrika kuulub Ameerika maailmajakku."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q094",
      "unitId": "lo-opik-u15",
      "stem": "Miks ei saa öelda, et kogu Aafrika on ainult kõrb?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-africa-deserts-rainforest",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik kirjeldab Aafrikas nii kõrbeid kui ka vihmametsi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Sest Aafrikas on ka vihmametsi."
          },
          {
            "id": "o2",
            "text": "Sest Aafrika on ainult meri."
          },
          {
            "id": "o3",
            "text": "Sest seal on ainult jääväljad."
          },
          {
            "id": "o4",
            "text": "Sest Aafrikas on üksnes mäed."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q095",
      "unitId": "lo-opik-u15",
      "stem": "Vali maailmajaod, mille kohta õpik räägib maailma kõrgeimatest mägedest, suurtest kõrbetest või omapärasest loomastikust.",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-regions-with-features",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aasias asuvad kõrgeimad mäed, Aafrikas on suured kõrbed ning Austraalia ja Okeaania on tuntud omapärase loomastiku poolest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62–63"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Euroopa"
          },
          {
            "id": "o2",
            "text": "Aasia"
          },
          {
            "id": "o3",
            "text": "Aafrika"
          },
          {
            "id": "o4",
            "text": "Austraalia ja Okeaania"
          },
          {
            "id": "o5",
            "text": "Ameerika"
          },
          {
            "id": "o6",
            "text": "Euraasia"
          }
        ],
        "correctOptionIds": [
          "o2",
          "o3",
          "o4"
        ]
      }
    },
    {
      "id": "lo-opik-u15-q096",
      "unitId": "lo-opik-u15",
      "stem": "Rühmita kirjeldused sobivasse maailmajakku.",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-three-features-group",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõik tunnused on kirjeldatud õpiku lehekülgedel 62–63.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62–63"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "asia",
            "text": "Aasia"
          },
          {
            "id": "africa",
            "text": "Aafrika"
          },
          {
            "id": "america",
            "text": "Ameerika"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "maailma kõrgeimad mäed"
          },
          {
            "id": "i2",
            "text": "India ja Hiina asuvad siin"
          },
          {
            "id": "i3",
            "text": "kuivad kõrbed ja vihmametsad"
          },
          {
            "id": "i4",
            "text": "läänerannikul pikk mäestikuvöönd"
          }
        ],
        "correctGroupByItem": {
          "i1": "asia",
          "i2": "asia",
          "i3": "africa",
          "i4": "america"
        }
      }
    },
    {
      "id": "lo-opik-u15-q097",
      "unitId": "lo-opik-u15",
      "stem": "Milline seos Euroopa ja Aasia vahel on õige?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-europe-not-continent",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Euroopa ja Aasia paiknevad ühe Euraasia mandri eri osades.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Mõlemad on Euraasia mandri osad."
          },
          {
            "id": "o2",
            "text": "Mõlemad on eraldi ookeanid."
          },
          {
            "id": "o3",
            "text": "Mõlemad on Antarktise osad."
          },
          {
            "id": "o4",
            "text": "Euroopa asub Ameerika maailmajagus."
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o5"
      ]
    },
    {
      "id": "lo-opik-u15-q098",
      "unitId": "lo-opik-u15",
      "stem": "Õpilane otsib kaardilt maailma kõrgeimate mägede piirkonda. Millist maailmajagu peab ta uurima?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-asia-high-mountains",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maailma kõrgeimad mäed paiknevad Aasias.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Aasia"
          },
          {
            "id": "o2",
            "text": "Antarktika"
          },
          {
            "id": "o3",
            "text": "Euroopa"
          },
          {
            "id": "o4",
            "text": "Austraalia ja Okeaania"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q099",
      "unitId": "lo-opik-u15",
      "stem": "Loe kirjeldust. Millist maailmajagu kirjeldatakse?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-america-west-mountains",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ameerika lääneosas kulgeb pikk mäestikuvöönd, kus esineb maavärinaid ja vulkaanipurskeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ameerikat"
          },
          {
            "id": "o2",
            "text": "Euroopat"
          },
          {
            "id": "o3",
            "text": "Antarktikat"
          },
          {
            "id": "o4",
            "text": "Austraaliat ja Okeaaniat"
          }
        ],
        "correctOptionId": "o1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Selles maailmajaos ulatub põhjast lõunasse kaks mandrit. Lääneosas kulgeb pikk mäestikuvöönd, kus võib ette tulla maavärinaid ja vulkaanipurskeid."
        ]
      }
    },
    {
      "id": "lo-opik-u15-q100",
      "unitId": "lo-opik-u15",
      "stem": "Kirjelduses on kuivad kõrbed ja vihmametsad. Milline maailmajagu sobib?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-africa-deserts-rainforest",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik toob selle looduse mitmekesisuse näitena Aafrika.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Aafrika"
          },
          {
            "id": "o2",
            "text": "Antarktika"
          },
          {
            "id": "o3",
            "text": "Euroopa"
          },
          {
            "id": "o4",
            "text": "Ameerika"
          }
        ],
        "correctOptionId": "o1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Selles maailmajaos leidub väga kuivi kõrbeid ja vihmarohkeid metsi."
        ]
      }
    },
    {
      "id": "lo-opik-u15-q101",
      "unitId": "lo-opik-u15",
      "stem": "Ühenda vihjed õige maailmajaoga.",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-clue-matching",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aasial, Aafrikal ning Austraalial ja Okeaanial on õpikus nimetatud eripärad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Kõrgeimad mäed ning India ja Hiina"
          },
          {
            "id": "p2",
            "text": "Kõrbed koos vihmametsadega"
          },
          {
            "id": "p3",
            "text": "Omapärased liigid ja palju saari"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Aasia"
          },
          {
            "id": "c2",
            "text": "Aafrika"
          },
          {
            "id": "c3",
            "text": "Austraalia ja Okeaania"
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
      "id": "lo-opik-u15-q102",
      "unitId": "lo-opik-u15",
      "stem": "Millise maailmajao juurde peaks kaardimäng panema sildi „palju ainult siin elavaid liike”?",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-australia-unique-nature",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Austraalia ja Okeaania on õpiku järgi erilise loomastiku ning taimestikuga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Austraalia ja Okeaania"
          },
          {
            "id": "o2",
            "text": "Euroopa"
          },
          {
            "id": "o3",
            "text": "Antarktika"
          },
          {
            "id": "o4",
            "text": "Ameerika"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q103",
      "unitId": "lo-opik-u15",
      "stem": "Järjesta kaardi vaatamise kolm tegevust, et leida õpikust tuntud Aafrika kõrbe- ja vihmametsapiirkonnad.",
      "primaryObjectiveId": "lo-opik-u15-o7",
      "variantGroupId": "lo-opik-u15-g-africa-activity-order",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõigepealt tuleb leida Aafrika, siis lugeda, millist loodust seal kirjeldatakse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "63"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Otsi maailmajagude kaardilt Aafrika."
          },
          {
            "id": "s2",
            "text": "Uuri Aafrika loodusolude kirjeldust."
          },
          {
            "id": "s3",
            "text": "Järelda, et Aafrikas võib olla nii kõrbeid kui ka vihmametsi."
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3"
        ],
        "firstLabel": "Kõigepealt",
        "lastLabel": "Viimasena"
      }
    },
    {
      "id": "lo-opik-u15-q104",
      "unitId": "lo-opik-u15",
      "stem": "Mis on Antarktis?",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-continent",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktis on lõunapoolusel asuv suur jäine manner.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "lõunapooluse ümbruses olev manner"
          },
          {
            "id": "o2",
            "text": "lõunapooluse lähedane riigi pealinn"
          },
          {
            "id": "o3",
            "text": "põhjapoolkera meri"
          },
          {
            "id": "o4",
            "text": "ainult Euroopa teine nimi"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q105",
      "unitId": "lo-opik-u15",
      "stem": "Mis on Antarktika?",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-continent",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktika on maailmajagu; Antarktis on manner.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "maailmajagu, mille keskmes on Antarktise manner"
          },
          {
            "id": "o2",
            "text": "Põhja-Ameerika teine nimi"
          },
          {
            "id": "o3",
            "text": "Aafrika suurim kõrb"
          },
          {
            "id": "o4",
            "text": "Aasia lääneosa"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q106",
      "unitId": "lo-opik-u15",
      "stem": "Kas Antarktisel on püsielanikke?",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-no-permanent",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktisel ei ole püsielanikke; uurimisjaamades töötatakse ajutiselt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ei, seal töötavad inimesed ajutiselt."
          },
          {
            "id": "o2",
            "text": "Jah, seal elab miljoneid inimesi püsivalt."
          },
          {
            "id": "o3",
            "text": "Jah, seal asub maailma rahvarohkeim linn."
          },
          {
            "id": "o4",
            "text": "Antarktisel elavad ainult inimesed, mitte loomad."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q107",
      "unitId": "lo-opik-u15",
      "stem": "Mis katab suurema osa Antarktise mandrist?",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-ice",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktise mandrit katab väga paks jää.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "paks jääkiht"
          },
          {
            "id": "o2",
            "text": "tihe troopiline vihmamets"
          },
          {
            "id": "o3",
            "text": "liivakõrb ilma jääta"
          },
          {
            "id": "o4",
            "text": "suured põllud"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q108",
      "unitId": "lo-opik-u15",
      "stem": "Mida inimesed Antarktisel peamiselt uurimisjaamades teevad?",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-science",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktisel tegutsevad teadlased ja jaamade töötajad, et uurida loodust ning ilma.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "uurivad loodust ja ilma"
          },
          {
            "id": "o2",
            "text": "ehitavad troopilisi rannakuurorte"
          },
          {
            "id": "o3",
            "text": "kasvatavad aastaringselt troopilist metsa"
          },
          {
            "id": "o4",
            "text": "kaevandavad koolidele pliiatseid"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q109",
      "unitId": "lo-opik-u15",
      "stem": "Miks ei ole Antarktisel tavapäraseid püsiasulaid?",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-hard-climate",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktise karm külm kliima teeb aastaringse tavaelu väga keeruliseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Seal on väga külm ja elutingimused on karmid."
          },
          {
            "id": "o2",
            "text": "Sest seal ei saa üldse kõndida."
          },
          {
            "id": "o3",
            "text": "Sest see asub ekvaatoril."
          },
          {
            "id": "o4",
            "text": "Sest kõik maad on seal linnadega kaetud."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q110",
      "unitId": "lo-opik-u15",
      "stem": "Kas ajutine teadlaste viibimine Antarktisel tähendab, et seal on püsielanikke?",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-no-permanent",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Uurimisjaamades viibitakse ajutiselt; see ei võrdu püsiva elanikkonnaga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ei, ajutiselt töötamine ei tähenda püsielanikkonda."
          },
          {
            "id": "o2",
            "text": "Jah, iga ajutine külaline on püsielanik."
          },
          {
            "id": "o3",
            "text": "Jah, sest uurimisjaamad on riigid."
          },
          {
            "id": "o4",
            "text": "Ei, sest Antarktisel pole üldse inimesi käinud."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q111",
      "unitId": "lo-opik-u15",
      "stem": "Milline paar sobib õigesti kokku?",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-continent",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktis on manner, Antarktika on maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Antarktis — manner; Antarktika — maailmajagu"
          },
          {
            "id": "o2",
            "text": "Antarktika — ookean; Antarktis — linn"
          },
          {
            "id": "o3",
            "text": "Antarktis — maailmajagu; Antarktika — saar"
          },
          {
            "id": "o4",
            "text": "Antarktis — Aafrika osa; Antarktika — Aasia osa"
          }
        ],
        "correctOptionId": "o1"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o5"
      ]
    },
    {
      "id": "lo-opik-u15-q112",
      "unitId": "lo-opik-u15",
      "stem": "Vali kõik õiged väited Antarktise kohta.",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-facts",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktis on jääga kaetud ning teadlased töötavad seal, kuid püsielanikke ei ole.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Seda katab paks jää."
          },
          {
            "id": "o2",
            "text": "Seal töötavad teadlased."
          },
          {
            "id": "o3",
            "text": "Seal ei ole püsielanikke."
          },
          {
            "id": "o4",
            "text": "Seal on troopilised vihmametsad."
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
      "id": "lo-opik-u15-q113",
      "unitId": "lo-opik-u15",
      "stem": "Puuduta maailmajagude kaardil Antarktika piirkonda.",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-map-antarctica",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktika asub kaardi allosas lõunapooluse ümbruses.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u15-world-parts",
        "correctRegionId": "antarctica"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u15-world-parts"
      },
      "relatedObjectiveIds": [
        "lo-opik-u15-o6"
      ]
    },
    {
      "id": "lo-opik-u15-q114",
      "unitId": "lo-opik-u15",
      "stem": "Uurija elab kaks kuud Antarktise jaamas. Milline väide on kõige täpsem?",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-no-permanent",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ajutine uurimistöö Antarktisel ei tähenda, et seal on püsielanikkond.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ta töötab ajutiselt mandril, kus ei ole püsielanikke."
          },
          {
            "id": "o2",
            "text": "Ta on nüüd automaatselt uue riigi president."
          },
          {
            "id": "o3",
            "text": "Ta elab Aasias."
          },
          {
            "id": "o4",
            "text": "See tõestab, et Antarktisel on suur püsielanikkond."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q115",
      "unitId": "lo-opik-u15",
      "stem": "Loe kirjeldust ja vali maailmajao nimi.",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-continent",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõunapooluse ümbruses asub Antarktika maailmajagu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Antarktika"
          },
          {
            "id": "o2",
            "text": "Aafrika"
          },
          {
            "id": "o3",
            "text": "Ameerika"
          },
          {
            "id": "o4",
            "text": "Euroopa"
          }
        ],
        "correctOptionId": "o1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Siin asub jääga kaetud Antarktise manner. Inimesed töötavad uurimisjaamades, kuid alalisi elanikke ei ole."
        ]
      }
    },
    {
      "id": "lo-opik-u15-q116",
      "unitId": "lo-opik-u15",
      "stem": "Milline on õigustatud järeldus tekstist „Antarktisel ei ole püsielanikke, kuid seal töötavad teadlased”?",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctica-no-permanent",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ajutiselt töötavad inimesed võivad seal viibida ka ilma püsielanikkonnata.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Seal võib ajutiselt inimesi olla."
          },
          {
            "id": "o2",
            "text": "Sinna ei ole kunagi ühtki inimest sattunud."
          },
          {
            "id": "o3",
            "text": "Seal on rohkem inimesi kui Aasias."
          },
          {
            "id": "o4",
            "text": "Teadlased asuvad ainult Aafrikas."
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u15-q117",
      "unitId": "lo-opik-u15",
      "stem": "Rühmita mõisted: Antarktise kohta käivad või mitte?",
      "primaryObjectiveId": "lo-opik-u15-o8",
      "variantGroupId": "lo-opik-u15-g-antarctic-grouping",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktisel on paks jää ja uurimisjaamad, kuid mitte troopilist metsa ega suurt püsielanikkonda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "62"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "y",
            "text": "Antarktise kohta käib"
          },
          {
            "id": "n",
            "text": "Antarktise kohta ei käi"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "paks jääkate"
          },
          {
            "id": "i2",
            "text": "lõunapooluse ümbrus"
          },
          {
            "id": "i3",
            "text": "uurimisjaamad"
          },
          {
            "id": "i4",
            "text": "püsiv suur linnarahvastik"
          },
          {
            "id": "i5",
            "text": "troopilised vihmametsad"
          }
        ],
        "correctGroupByItem": {
          "i1": "y",
          "i2": "y",
          "i3": "y",
          "i4": "n",
          "i5": "n"
        }
      }
    }
  ]
};
