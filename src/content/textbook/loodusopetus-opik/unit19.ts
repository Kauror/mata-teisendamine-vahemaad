// Authored textbook material: Unit 19 — Maakera siseehitus (pp 70–73).
// Page 73 is explicitly optional enrichment; it has no mandatory test questions.
import type { Unit } from '@/lib/textbook/types';

export const unit19: Unit = {
  "id": "lo-opik-u19",
  "courseId": "loodusopetus-opik",
  "number": 19,
  "title": "Maakera siseehitus",
  "pages": {
    "from": 70,
    "to": 73
  },
  "status": "ready",
  "contentVersion": "2026-10-17.1",
  "objectives": [
    {
      "id": "lo-opik-u19-o1",
      "description": "Oskan selgitada, kuidas teadlased Maa sisemust uurivad ka siis, kui sinna puurida ei saa.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ]
    },
    {
      "id": "lo-opik-u19-o2",
      "description": "Oskan nimetada maakera peamisi kihte ja seada need väljast sissepoole õigesse järjekorda.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ]
    },
    {
      "id": "lo-opik-u19-o3",
      "description": "Tean, mis on maakoor, ja oskan võrrelda mandrilise ja ookeanilise maakoore paksust.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ]
    },
    {
      "id": "lo-opik-u19-o4",
      "description": "Oskan selgitada vahevöö asukohta, kuumust ja seda, miks kivimid võivad väga aeglaselt liikuda.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ]
    },
    {
      "id": "lo-opik-u19-o5",
      "description": "Eristan vedelat välistuuma ja tahket sisetuuma ning tean tuuma peamist koostist.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ]
    },
    {
      "id": "lo-opik-u19-o6",
      "description": "Tean, mis on laamad ja kuidas need on seotud maakoore ning jäiga ülemise vahevööga.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ]
    },
    {
      "id": "lo-opik-u19-o7",
      "description": "Oskan selgitada, et laamad liiguvad aeglaselt ja nende piiridel võib toimuda maavärinaid või vulkaanipurskeid.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-fast-do-tectonic-plates-move",
          "attribution": "USGS — How fast do tectonic plates move?",
          "note": "Laamade kiirus on erinev, tavaliselt mõni sentimeeter aastas."
        }
      ]
    },
    {
      "id": "lo-opik-u19-o8",
      "description": "Tunnen õpiku seitsme suure laama nimetusi ja leian näiteid nende ligikaudsest asukohast skeemil.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u19-l1",
      "title": "Maa sisse ei saa piiluda",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u19-o1",
        "lo-opik-u19-o2"
      ],
      "sections": [
        {
          "id": "lo-opik-u19-s001",
          "title": "Kui suur on maakera?",
          "blocks": [
            {
              "id": "lo-opik-u19-b001",
              "type": "paragraph",
              "text": "Maa läbimõõt on ligi 13 000 kilomeetrit. Maa sisemust ei saa lihtsalt lahti lõigata ega silmaga vaadata. Teadlased teavad siiski, et maakera on kihilise ehitusega.",
              "source": {
                "kind": "textbook",
                "pages": "70"
              }
            },
            {
              "id": "lo-opik-u19-b002",
              "type": "definition",
              "term": "Läbimõõt",
              "definition": "Kaugus kera ühest servast läbi keskpunkti teise servani."
            },
            {
              "id": "lo-opik-u19-b003",
              "type": "keyFact",
              "items": [
                "Maa läbimõõt on ligi 13 000 km.",
                "Me ei saa otse Maa keskpunkti vaadata."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u19-s002",
          "title": "Kuidas teada, mis peitub maa sees?",
          "blocks": [
            {
              "id": "lo-opik-u19-b004",
              "type": "paragraph",
              "text": "Õpikus on näiteks toodud umbes 12 kilomeetri sügavune puurauk. Maa keskpunkt on sellest sadu kordi sügavamal. Seepärast uurivad teadlased ka vulkaanide kivimeid ning maavärinatest lähtuvaid laineid. Lainete liikumine aitab mõista, millised ained Maa sisemuses on.",
              "source": {
                "kind": "textbook",
                "pages": "70"
              }
            },
            {
              "id": "lo-opik-u19-b005",
              "type": "diagram",
              "diagramId": "u19-evidence",
              "caption": "Kolm vihjet Maa sisemuse kohta: puurauk, vulkaaniline kivim ja maavärina lained.",
              "source": {
                "kind": "textbook",
                "pages": "70"
              }
            },
            {
              "id": "lo-opik-u19-b006",
              "type": "table",
              "headers": [
                "Uurimisviis",
                "Mida sellest teada saab?"
              ],
              "rows": [
                [
                  "Puuraugud",
                  "Mida leidub maakoore ülemistes osades."
                ],
                [
                  "Vulkaanidest pärit kivimid",
                  "Milliseid sulakivimeid jõuab Maa seest pinnale."
                ],
                [
                  "Maavärina lained",
                  "Kuidas lained levivad Maa eri sügavustes ja kihtides."
                ]
              ],
              "caption": "Teadlaste kolm vihjet"
            },
            {
              "id": "lo-opik-u19-b007",
              "type": "enrichment",
              "title": "Teadlase töö",
              "body": [
                "Maavärinalaineid ei pea Maa sees nägema: neid mõõdetakse maapinnal olevate seadmetega. Nii saab kaudselt uurida väga sügavaid kihte."
              ],
              "variant": "extra"
            }
          ]
        },
        {
          "id": "lo-opik-u19-s003",
          "title": "Maa kolm peamist kihti",
          "blocks": [
            {
              "id": "lo-opik-u19-b008",
              "type": "paragraph",
              "text": "Maa kolm peamist osa on maakoor, vahevöö ja tuum. Kõige väljaspool on väga õhuke maakoor. Selle all on paks vahevöö. Maa keskosas asub metallirikas tuum, millel on vedel väline ja tahke sisemine osa.",
              "source": {
                "kind": "textbook",
                "pages": "71"
              }
            },
            {
              "id": "lo-opik-u19-b009",
              "type": "diagram",
              "diagramId": "u19-earth-layers",
              "caption": "Maakoore, vahevöö, välistuuma ja sisetuuma läbilõige. Õhuke maakoor on skeemil eraldi suuremana näidatud.",
              "source": {
                "kind": "textbook",
                "pages": "71"
              }
            },
            {
              "id": "lo-opik-u19-b010",
              "type": "list",
              "items": [
                "Maakoor on kõige välimine kiht.",
                "Vahevöö jääb maakoore alla.",
                "Tuum on Maa keskel."
              ],
              "ordered": true
            },
            {
              "id": "lo-opik-u19-b011",
              "type": "keyFact",
              "items": [
                "Väljast sissepoole: maakoor → vahevöö → tuum."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u19-l2",
      "title": "Maakoor: õhuke kivimikiht",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u19-o3"
      ],
      "sections": [
        {
          "id": "lo-opik-u19-s004",
          "title": "Mis on maakoor?",
          "blocks": [
            {
              "id": "lo-opik-u19-b012",
              "type": "paragraph",
              "text": "Maakoor on Maa kõige pealmine tahke kiht. See koosneb kõvadest kivimitest. Maakera suurusega võrreldes on maakoor väga õhuke, kuigi siin asuvad mäed, mandrid ja ookeanipõhi.",
              "source": {
                "kind": "textbook",
                "pages": "70"
              }
            },
            {
              "id": "lo-opik-u19-b013",
              "type": "definition",
              "term": "Maakoor",
              "definition": "Maa kõige välimine tahke, kivimitest koosnev kiht."
            },
            {
              "id": "lo-opik-u19-b014",
              "type": "keyFact",
              "items": [
                "Maakoor koosneb kõvadest kivimitest.",
                "Maakoort leidub nii mandrite kui ka ookeanide all."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u19-s005",
          "title": "Mandrite ja ookeanide all pole maakoor ühepaksune",
          "blocks": [
            {
              "id": "lo-opik-u19-b015",
              "type": "paragraph",
              "text": "Õpiku järgi on mandriline maakoor keskmiselt umbes 40 km paks ja ookeaniline maakoor umbes 7 km paks. Kõrgete mäestike all võib maakoor olla veelgi paksem, kuni umbes 80 km. Need on ligikaudsed näitajad: iga koha paksus pole täpselt sama.",
              "source": {
                "kind": "textbook",
                "pages": "70"
              }
            },
            {
              "id": "lo-opik-u19-b016",
              "type": "diagram",
              "diagramId": "u19-crust-thickness",
              "caption": "Kolm kõrvuti maakoore paksuse näidet: ookeani all ligikaudu 7 km, mandri all 40 km ja mäestiku all kuni 80 km. Numbritega tulbad on proportsionaalsed.",
              "source": {
                "kind": "textbook",
                "pages": "70"
              }
            },
            {
              "id": "lo-opik-u19-b017",
              "type": "table",
              "headers": [
                "Piirkond",
                "Õpiku ligikaudne paksus"
              ],
              "rows": [
                [
                  "Ookeani all",
                  "7 km"
                ],
                [
                  "Mandri all",
                  "40 km"
                ],
                [
                  "Mäestiku all",
                  "kuni 80 km"
                ]
              ],
              "caption": "Maakoore paksus oleneb asukohast"
            },
            {
              "id": "lo-opik-u19-b018",
              "type": "keyFact",
              "items": [
                "Mandrite all on maakoor keskmiselt paksem kui ookeanide all."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u19-s006",
          "title": "Võrdle, mitte ära arva joonise järgi",
          "blocks": [
            {
              "id": "lo-opik-u19-b019",
              "type": "paragraph",
              "text": "Kui joonisel tundub ookeaniline maakoor peenike ning mandriline palju paksem, on see kooskõlas õpiku näidetega. Väikesel ekraanil ei saa sentimeetreid kaardilt ega jooniselt mõõta. Kasuta alati joonisele kirjutatud arve.",
              "source": {
                "kind": "textbook",
                "pages": "70"
              }
            },
            {
              "id": "lo-opik-u19-b020",
              "type": "comparison",
              "title": "Maakoore kaks tüüpi",
              "columns": [
                {
                  "heading": "Mandriline maakoor",
                  "points": [
                    "Keskmiselt paksem (õpikus 40 km).",
                    "Võib olla eriti paks mäestike all.",
                    "On üldiselt vanem kui ookeaniline maakoor."
                  ]
                },
                {
                  "heading": "Ookeaniline maakoor",
                  "points": [
                    "Keskmiselt õhem (õpikus 7 km).",
                    "Moodustab ookeanipõhja all oleva maakoore."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u19-b021",
              "type": "enrichment",
              "title": "Huvitav teada",
              "body": [
                "Mandriline maakoor võib sisaldada väga vanu kivimeid. Ookeanipõhja maakoor uueneb laamade liikumise käigus, mistõttu on see üldiselt noorem."
              ],
              "variant": "extra"
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u19-l3",
      "title": "Vahevöö ja Maa tuum",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u19-o2",
        "lo-opik-u19-o4",
        "lo-opik-u19-o5"
      ],
      "sections": [
        {
          "id": "lo-opik-u19-s007",
          "title": "Vahevöö on paks ja kuum",
          "blocks": [
            {
              "id": "lo-opik-u19-b022",
              "type": "paragraph",
              "text": "Maakoore all paikneb vahevöö, mis ulatub ligikaudu 2900 km sügavusele. Sügavamal on üldiselt kuumem.",
              "source": {
                "kind": "textbook",
                "pages": "71"
              }
            },
            {
              "id": "lo-opik-u19-b023",
              "type": "paragraph",
              "text": "Tänapäevase geoloogia järgi on vahevöö kivimid valdavalt tahked, kuid väga pika aja jooksul saavad need suure kuumuse ja rõhu mõjul aeglaselt deformeeruda ning liikuda.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.bgs.ac.uk/discovering-geology/earth-hazards/earthquakes/what-causes-earthquakes/",
                "attribution": "British Geological Survey",
                "note": "Seismiliste lainete abil uuritakse Maa sisemust; jäik litosfäär hõlmab maakoore ja ülemise vahevöö."
              }
            },
            {
              "id": "lo-opik-u19-b024",
              "type": "definition",
              "term": "Vahevöö",
              "definition": "Maakoore ja tuuma vahele jääv väga paks kuum kivimikiht."
            },
            {
              "id": "lo-opik-u19-b025",
              "type": "enrichment",
              "title": "Õpiku lihtsustus",
              "body": [
                "Õpik kirjeldab vahevöö ainet osaliselt sulanuna ja selle aeglast voolamist. Täpsemalt: enamik vahevööst on tahke kivim, mis võib miljonite aastate jooksul aeglaselt voolata. Kohati tekib sulakivim ehk magma."
              ],
              "variant": "extra"
            },
            {
              "id": "lo-opik-u19-b026",
              "type": "keyFact",
              "items": [
                "Vahevöö ulatub umbes 2900 km sügavusele.",
                "Vahevöö ei ole üks suur vedela magma meri."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u19-s008",
          "title": "Sulakivim ja vulkaanid",
          "blocks": [
            {
              "id": "lo-opik-u19-b027",
              "type": "paragraph",
              "text": "Maa sees võib teatud kohtades tekkida sulanud kivimit ehk magmat. Kui magma jõuab vulkaanipurske ajal maapinnale, nimetatakse seda laavaks. Vahevöö kivimite aeglane liikumine ja magma teke ei ole täpselt sama asi.",
              "source": {
                "kind": "textbook",
                "pages": "71"
              }
            },
            {
              "id": "lo-opik-u19-b028",
              "type": "comparison",
              "title": "Vahevöö ja magma",
              "columns": [
                {
                  "heading": "Vahevöö",
                  "points": [
                    "Valdavalt tahke, väga kuum kivim.",
                    "Liigub ja deformeerub väga aeglaselt."
                  ]
                },
                {
                  "heading": "Magma",
                  "points": [
                    "Kohati tekkinud sulanud kivim.",
                    "Võib vulkaani kaudu pinnale tõusta."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u19-b029",
              "type": "keyFact",
              "items": [
                "Vahevöö on valdavalt tahke. Magmat leidub vaid teatud kohtades."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u19-s009",
          "title": "Välistuum ja sisetuum",
          "blocks": [
            {
              "id": "lo-opik-u19-b030",
              "type": "paragraph",
              "text": "Maakera keskel asub peamiselt rauast ja niklist koosnev tuum. Selle välimine osa on vedel välistuum ning kõige keskmine osa on tahke sisetuum. Sisetuum võib olla ligikaudu 6000 °C kuum, kuid püsib tohutu rõhu tõttu tahkena.",
              "source": {
                "kind": "textbook",
                "pages": "71"
              }
            },
            {
              "id": "lo-opik-u19-b031",
              "type": "definition",
              "term": "Välistuum",
              "definition": "Maa tuuma vedel välimine osa."
            },
            {
              "id": "lo-opik-u19-b032",
              "type": "definition",
              "term": "Sisetuum",
              "definition": "Maa tuuma tahke kõige sisemine osa."
            },
            {
              "id": "lo-opik-u19-b033",
              "type": "diagram",
              "diagramId": "u19-earth-layers",
              "caption": "Maa kihid väljast sissepoole; välistuum on vedel, sisetuum tahke.",
              "source": {
                "kind": "textbook",
                "pages": "71"
              }
            },
            {
              "id": "lo-opik-u19-b034",
              "type": "keyFact",
              "items": [
                "Tuum sisaldab peamiselt rauda ja niklit.",
                "Välistuum on vedel, sisetuum tahke."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u19-s010",
          "title": "Kihid ja sügavused",
          "blocks": [
            {
              "id": "lo-opik-u19-b035",
              "type": "paragraph",
              "text": "Õpiku läbilõikejoonisel on kirjas ligikaudsed sügavusvahemikud. Maakoore paksus sõltub kohast ning vahevöö algab eri piirkondades erineval sügavusel. Allpool olevad arvud on lihtsustatud joonise orientiirid, mitte täpsed piirid igas kohas.",
              "source": {
                "kind": "textbook",
                "pages": "71"
              }
            },
            {
              "id": "lo-opik-u19-b036",
              "type": "table",
              "headers": [
                "Kiht",
                "Ligikaudne sügavus õpiku joonisel"
              ],
              "rows": [
                [
                  "Maakoor",
                  "0–80 km (paksus varieerub)"
                ],
                [
                  "Vahevöö",
                  "maakoore alt kuni 2900 km"
                ],
                [
                  "Välistuum",
                  "2900–5100 km"
                ],
                [
                  "Sisetuum",
                  "5100–6378 km"
                ]
              ],
              "caption": "Kaugus maapinnast Maa keskme suunas"
            },
            {
              "id": "lo-opik-u19-b037",
              "type": "diagram",
              "diagramId": "u19-earth-layers",
              "caption": "Maa siseehituse läbilõige. Maakoort ei saa päris mõõtkavas hästi nähtavaks teha.",
              "source": {
                "kind": "textbook",
                "pages": "71"
              }
            },
            {
              "id": "lo-opik-u19-b038",
              "type": "keyFact",
              "items": [
                "Maa keskpunkt asub umbes 6370 km sügavusel.",
                "Õpiku kihipiirid on ligikaudsed."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u19-l4",
      "title": "Laamad liiguvad aeglaselt",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u19-o6",
        "lo-opik-u19-o7",
        "lo-opik-u19-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u19-s011",
          "title": "Maakera välimine jäik kest koosneb suurtest tükkidest",
          "blocks": [
            {
              "id": "lo-opik-u19-b039",
              "type": "paragraph",
              "text": "Maakoor ei moodusta ühtainust katkestamatut plaati. Maa välimine jäik kivimiline kest on jaotunud suurteks laamadeks. Õpik võrdleb seda mõranenud munakoorega ning nimetab laamasid lihtsustatult maakoore tükkideks.",
              "source": {
                "kind": "textbook",
                "pages": "72"
              }
            },
            {
              "id": "lo-opik-u19-b040",
              "type": "paragraph",
              "text": "Teaduslik täpsustus: laama koosseisu kuulub maakoor ja jäik osa ülemisest vahevööst. Seda jäika välimist kesta nimetatakse litosfääriks.",
              "source": {
                "kind": "supplementary",
                "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
                "attribution": "USGS — Inside the Earth",
                "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
              }
            },
            {
              "id": "lo-opik-u19-b041",
              "type": "definition",
              "term": "Litosfäär",
              "definition": "Maa jäik välimine kivimiline kest, mis koosneb maakoorest ja ülemise vahevöö jäigast osast.",
              "source": {
                "kind": "supplementary",
                "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
                "attribution": "USGS — Inside the Earth",
                "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
              }
            },
            {
              "id": "lo-opik-u19-b042",
              "type": "definition",
              "term": "Laam",
              "definition": "Maa välimise jäiga kivimilise kesta suur liikuv osa, kuhu kuulub maakoor ja osa ülemisest vahevööst."
            },
            {
              "id": "lo-opik-u19-b043",
              "type": "diagram",
              "diagramId": "u19-plate-motion",
              "caption": "Kaks jäika laama ning nende all aeglaselt deformeeruv vahevöö. Laamade piir on tähistatud.",
              "source": {
                "kind": "textbook",
                "pages": "72"
              }
            },
            {
              "id": "lo-opik-u19-b044",
              "type": "keyFact",
              "items": [
                "Laam ei koosne ainult maakoorest.",
                "Maa välimine jäik kest on tükkideks jaotunud."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u19-s012",
          "title": "Kui kiiresti liiguvad laamad?",
          "blocks": [
            {
              "id": "lo-opik-u19-b045",
              "type": "paragraph",
              "text": "Laamad liiguvad väga aeglaselt. Õpik toob mõne laama kohta näiteks 3–4 cm ning kiiremate laamade kohta 10–16 cm aastas.",
              "source": {
                "kind": "textbook",
                "pages": "72"
              }
            },
            {
              "id": "lo-opik-u19-b046",
              "type": "paragraph",
              "text": "Laamade kiirus ja suund on erinevad: sageli on liikumine mõni sentimeeter aastas, umbes sama kiiresti kui kasvavad küüned. Õpiku arvud on näited, mitte igale laamale alati kehtivad kiirused.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/faqs/how-fast-do-tectonic-plates-move",
                "attribution": "USGS — How fast do tectonic plates move?",
                "note": "Laamade kiirus on erinev, tavaliselt mõni sentimeeter aastas."
              }
            },
            {
              "id": "lo-opik-u19-b047",
              "type": "table",
              "headers": [
                "Aeg",
                "Kui laam liigub 4 cm aastas"
              ],
              "rows": [
                [
                  "1 aasta",
                  "4 cm"
                ],
                [
                  "5 aastat",
                  "20 cm"
                ],
                [
                  "10 aastat",
                  "40 cm"
                ]
              ],
              "caption": "Lihtne arvutusnäide: kiirus on ülesandes kogu aja sama"
            },
            {
              "id": "lo-opik-u19-b048",
              "type": "keyFact",
              "items": [
                "Laamade liikumist mõõdetakse tavaliselt sentimeetrites aastas.",
                "Kõik laamad ei liigu sama kiiresti."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u19-s013",
          "title": "Mida võib laamade piiril juhtuda?",
          "blocks": [
            {
              "id": "lo-opik-u19-b049",
              "type": "paragraph",
              "text": "Kui laamad liiguvad, tekivad nende piiridel pinged. Mõnikord võivad kivimid järsku nihkuda ja põhjustada maavärina. Paljud vulkaanid paiknevad samuti laamade piiride lähedal. See ei tähenda, et igal laamapiiril peaks alati vulkaan olema.",
              "source": {
                "kind": "textbook",
                "pages": "72"
              }
            },
            {
              "id": "lo-opik-u19-b050",
              "type": "diagram",
              "diagramId": "u19-plate-motion",
              "caption": "Skeem näitab kahe laama piiri. Nooled märgivad võimalikku liikumissuunda, mitte kindla piirkonna tegelikku liikumist.",
              "source": {
                "kind": "textbook",
                "pages": "72"
              }
            },
            {
              "id": "lo-opik-u19-b051",
              "type": "comparison",
              "title": "Laamade liikumise kaks võimalikku märki",
              "columns": [
                {
                  "heading": "Maavärin",
                  "points": [
                    "Kivimid nihkuvad ja maapind võib väriseda.",
                    "Paljud maavärinad toimuvad laamade piiride juures."
                  ]
                },
                {
                  "heading": "Vulkaan",
                  "points": [
                    "Kohati jõuab magma pinnale.",
                    "Paljud vulkaanid paiknevad laamade piiride lähedal."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u19-b052",
              "type": "keyFact",
              "items": [
                "Laamade aeglane liikumine võib põhjustada maavärinaid ja vulkaanipurskeid."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u19-s014",
          "title": "Suured laamad maailmakaardil",
          "blocks": [
            {
              "id": "lo-opik-u19-b053",
              "type": "paragraph",
              "text": "Õpiku kaardil on nimetatud seitse suurt laama: Põhja-Ameerika, Lõuna-Ameerika, Euraasia, Aafrika, Vaikse ookeani, Austraalia ja Antarktika laam. Lisaks on Maal palju väiksemaid laamasid. Nimede järgi saab sageli aimata laama ligikaudset asukohta, kuid laamad ei järgi täpselt mandrite ega riikide piire.",
              "source": {
                "kind": "textbook",
                "pages": "72"
              }
            },
            {
              "id": "lo-opik-u19-b054",
              "type": "diagram",
              "diagramId": "u19-plate-world",
              "caption": "Maailmakaardile kantud seitsme õpikus nimetatud suure laama ligikaudsed asukohatähised; laamade tegelikke piire kaardil ei kujutata.",
              "source": {
                "kind": "textbook",
                "pages": "72"
              }
            },
            {
              "id": "lo-opik-u19-b055",
              "type": "list",
              "items": [
                "Põhja-Ameerika laam ja Lõuna-Ameerika laam",
                "Euraasia laam ja Aafrika laam",
                "Vaikse ookeani laam",
                "Austraalia laam ja Antarktika laam"
              ]
            },
            {
              "id": "lo-opik-u19-b056",
              "type": "keyFact",
              "items": [
                "Õpiku kaardil on seitse suurt laama ja lisaks palju väiksemaid.",
                "Laama nimi ei tähenda, et kogu laam asub ainult sama nimega mandri all."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u19-l5",
      "title": "Lisa: Mandrite triiv ja Pangaea",
      "order": 5,
      "required": false,
      "objectiveIds": [],
      "sections": [
        {
          "id": "lo-opik-u19-s015",
          "title": "Alfred Wegeneri idee",
          "blocks": [
            {
              "id": "lo-opik-u19-b057",
              "type": "paragraph",
              "text": "Õpiku lisaloos tutvustatakse Alfred Wegenerit. Ta esitas 1912. aastal mõtte, et mandrid pole alati praeguses asendis olnud, vaid võivad väga pika aja jooksul liikuda.",
              "source": {
                "kind": "textbook",
                "pages": "73"
              }
            },
            {
              "id": "lo-opik-u19-b058",
              "type": "definition",
              "term": "Mandrite triiv",
              "definition": "Mandrite asukoha väga aeglane muutumine Maa ajaloo jooksul."
            },
            {
              "id": "lo-opik-u19-b059",
              "type": "enrichment",
              "title": "Ajalugu",
              "body": [
                "Wegener kogus tõendeid, näiteks mandrite kuju ning sarnased kivimid ja fossiilid eri maailmajagudes. Tema idee muutus laamtektoonika teooria üheks oluliseks eelkäijaks."
              ],
              "variant": "extra"
            }
          ]
        },
        {
          "id": "lo-opik-u19-s016",
          "title": "Pangaea — ammune hiidmanner",
          "blocks": [
            {
              "id": "lo-opik-u19-b060",
              "type": "paragraph",
              "text": "Õpiku järgi moodustasid praegused mandrid kunagi suure ühise hiidmandri, mida nimetatakse Pangaeaks. Hiljem eraldusid mandriosad aeglaselt. Mandrid on geoloogilise aja jooksul kokku liikunud ja lahku triivinud korduvalt.",
              "source": {
                "kind": "textbook",
                "pages": "73"
              }
            },
            {
              "id": "lo-opik-u19-b061",
              "type": "diagram",
              "diagramId": "u19-continental-drift",
              "caption": "Kaks lihtsustatud vaadet: minevikus üheks maismaamassiiviks ühendunud mandrid ja tänapäeval eraldunud maismaa. Ei ole täpne geoloogiline rekonstruktsioon.",
              "source": {
                "kind": "textbook",
                "pages": "73"
              }
            },
            {
              "id": "lo-opik-u19-b062",
              "type": "enrichment",
              "title": "Vabatahtlik mõtlemisülesanne",
              "body": [
                "Vaata kahte joonist. Millised mandrite servad paistavad justkui pusletükid? Ühe servi meenutava kuju põhjal ei saa siiski kõike tõestada — teadlased kasutavad ka kivimite ja fossiilide tõendeid."
              ],
              "variant": "fun_fact"
            },
            {
              "id": "lo-opik-u19-b063",
              "type": "externalResource",
              "title": "Wegeneri mandrite triivi tõendid",
              "url": "https://www.usgs.gov/educational-resources/wegeners-puzzling-continental-drift-evidence",
              "publisher": "USGS",
              "intro": "Vabatahtlik lisalugemine ja õppematerjal mandrite liikumise tõenditest.",
              "observe": "Tõenditeks ei ole ainult mandrite kuju, vaid ka kivimite ning fossiilide sarnasused.",
              "resourceType": "article"
            },
            {
              "id": "lo-opik-u19-b064",
              "type": "keyFact",
              "items": [
                "Pangaea on ammuse hiidmandri nimi.",
                "Lisaosa ei kuulu kohustusliku testi küsimuste hulka."
              ]
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u19-q001",
      "unitId": "lo-opik-u19",
      "stem": "Mis aitab teadlastel uurida Maa sisemuse sügavamaid kihte?",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g001",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärinalained läbivad Maa sisemust ja nende liikumine annab teavet kihtide kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Maavärina lained"
          },
          {
            "id": "i2",
            "text": "Pilvede kuju"
          },
          {
            "id": "i3",
            "text": "Tuule suund"
          },
          {
            "id": "i4",
            "text": "Merevee värvus"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q002",
      "unitId": "lo-opik-u19",
      "stem": "Miks näitavad maavärina lained Maa sisemuse kohta midagi, mida puurauk ei näita?",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g001",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärinalained liiguvad Maa sisemuses palju sügavamale kui puurauk.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Lained läbivad sügavaid kihte"
          },
          {
            "id": "i2",
            "text": "Lained puurivad kivimisse auke"
          },
          {
            "id": "i3",
            "text": "Lained tekivad ainult tuumas"
          },
          {
            "id": "i4",
            "text": "Lained muudavad kõik kivimid vedelaks"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q003",
      "unitId": "lo-opik-u19",
      "stem": "Milliseid proove saavad teadlased vulkaanidest?",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g002",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaanilise tegevusega jõuab Maa sisemusest pärit kivimainet maapinnale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kivimiproove"
          },
          {
            "id": "i2",
            "text": "Pilveproove sisetuumast"
          },
          {
            "id": "i3",
            "text": "Sisetuumast rauatükke"
          },
          {
            "id": "i4",
            "text": "Mandrite keskpunktide proove"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q004",
      "unitId": "lo-opik-u19",
      "stem": "Miks uuritakse vulkaanipursete kivimeid?",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g002",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaanidest saab infot magmast ja kivimitest, kuid mitte otse Maa tuumast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Need annavad teavet Maa sees tekkinud sulakivimi kohta"
          },
          {
            "id": "i2",
            "text": "Need näitavad täpselt iga tuumakihi piiri"
          },
          {
            "id": "i3",
            "text": "Need on pärit alati Maa sisetuumast"
          },
          {
            "id": "i4",
            "text": "Need tõestavad, et kogu vahevöö on vedel"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q005",
      "unitId": "lo-opik-u19",
      "stem": "Kui sügav puurauk on õpikus näitena nimetatud?",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g003",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku leheküljel 70 tuuakse näide 12 kilomeetri sügavusest puuraugust. Seda ei esitata 2026. aasta maailmarekordina.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Umbes 12 km"
          },
          {
            "id": "i2",
            "text": "Umbes 1200 km"
          },
          {
            "id": "i3",
            "text": "Umbes 2900 km"
          },
          {
            "id": "i4",
            "text": "Umbes 13 000 km"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q006",
      "unitId": "lo-opik-u19",
      "stem": "Teadlased puurivad 12 km sügavusele. Kas nad jõuavad Maa keskpunkti?",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g003",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa raadius on umbes 6370 km; 12 km ei ulatu keskpunkti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Ei, keskpunkt on tuhandete kilomeetrite sügavusel"
          },
          {
            "id": "i2",
            "text": "Jah, sest Maa keskpunkt on 12 km sügavusel"
          },
          {
            "id": "i3",
            "text": "Jah, iga puurauk läbib tuuma"
          },
          {
            "id": "i4",
            "text": "Ei, sest Maa sees pole kivimeid"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q007",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: teadlased saavad kõiki Maa kihte oma silmaga näha.",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g004",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Me ei saa kõiki Maa kihte oma silmaga näha; teadlased kasutavad kaudseid mõõtmisi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
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
      "id": "lo-opik-u19-q008",
      "unitId": "lo-opik-u19",
      "stem": "Vali õpikus nimetatud Maa sisemuse uurimise viisid.",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g005",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus kirjeldatakse puurauke, vulkaanilisi kivimeid ja maavärinalaineid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Puuraukude uurimine"
          },
          {
            "id": "i2",
            "text": "Vulkaanidest pärit kivimite uurimine"
          },
          {
            "id": "i3",
            "text": "Maavärinalainete uurimine"
          },
          {
            "id": "i4",
            "text": "Pilvede kõrguse mõõtmine"
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2",
          "i3"
        ]
      }
    },
    {
      "id": "lo-opik-u19-q009",
      "unitId": "lo-opik-u19",
      "stem": "Rühmita uurimisviisid selle järgi, kas need aitavad Maa sisemust uurida.",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g005",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärinalained, puuraugud ja vulkaanilised kivimid annavad Maa sisemuse kohta teavet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "jah",
            "text": "Aitab uurida"
          },
          {
            "id": "ei",
            "text": "Ei ole selleks sobiv"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Maavärinalainete salvestamine"
          },
          {
            "id": "i2",
            "text": "Puuraugust kivimiproovi võtmine"
          },
          {
            "id": "i3",
            "text": "Vulkaanikivimi uurimine"
          },
          {
            "id": "i4",
            "text": "Vihmapiiskade loendamine"
          }
        ],
        "correctGroupByItem": {
          "i1": "jah",
          "i2": "jah",
          "i3": "jah",
          "i4": "ei"
        }
      }
    },
    {
      "id": "lo-opik-u19-q010",
      "unitId": "lo-opik-u19",
      "stem": "Vaata skeemi. Puuduta maavärinalainete uurimist tähistavat kohta.",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g001",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärinalainete mõõtmine aitab hinnata Maa sisemist kihistust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-evidence",
        "correctRegionId": "waves"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-evidence"
      }
    },
    {
      "id": "lo-opik-u19-q011",
      "unitId": "lo-opik-u19",
      "stem": "Vaata skeemi. Milline tähis näitab puuraugu kaudu uurimist?",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g003",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Puurauk võimaldab uurida maakoore suhteliselt väikest sügavust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-evidence",
        "correctRegionId": "borehole"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-evidence"
      }
    },
    {
      "id": "lo-opik-u19-q012",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta joonisel kohta, kust saab vulkaanilisi kivimiproove.",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g002",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaaniline kivim võib anda teavet maa seest pärit ainete kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-evidence",
        "correctRegionId": "volcano"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-evidence"
      }
    },
    {
      "id": "lo-opik-u19-q013",
      "unitId": "lo-opik-u19",
      "stem": "Ühenda meetod ja see, mida sellega uuritakse.",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g005",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eri uurimisviisid annavad Maa kohta eri tüüpi teavet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Puurauk"
          },
          {
            "id": "p2",
            "text": "Maavärinalained"
          },
          {
            "id": "p3",
            "text": "Vulkaanilised kivimid"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "maakoore kivimid"
          },
          {
            "id": "c2",
            "text": "lainete levimine läbi Maa"
          },
          {
            "id": "c3",
            "text": "sulakivimi päritolu ja koostis"
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
      "id": "lo-opik-u19-q014",
      "unitId": "lo-opik-u19",
      "stem": "Millises järjekorras saab teadlane lainete põhjal Maa sisemust uurida?",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g001",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõõtmiste põhjal saab teadlane teha kaudseid järeldusi Maa sisemuse kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Toimub maavärin."
          },
          {
            "id": "i2",
            "text": "Mõõteriistad salvestavad maavärinalained."
          },
          {
            "id": "i3",
            "text": "Teadlane võrdleb lainete saabumist eri kohtades."
          },
          {
            "id": "i4",
            "text": "Teadlane teeb järeldusi Maa kihtide kohta."
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
      "id": "lo-opik-u19-q015",
      "unitId": "lo-opik-u19",
      "stem": "Kui suur on Maa läbimõõt õpiku järgi ligikaudu?",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g006",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus märgitakse, et Maa läbimõõt on ligi 13 000 kilomeetrit.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "13 000 km"
          },
          {
            "id": "i2",
            "text": "130 km"
          },
          {
            "id": "i3",
            "text": "12 km"
          },
          {
            "id": "i4",
            "text": "300 km"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q016",
      "unitId": "lo-opik-u19",
      "stem": "Ühenda näide ja selle uurimisviis.",
      "primaryObjectiveId": "lo-opik-u19-o1",
      "variantGroupId": "lo-opik-u19-g005",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Need on kolm erinevat viisi Maa sisemuse kohta andmete kogumiseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Mõõdetakse lainete kiirusi."
          },
          {
            "id": "p2",
            "text": "Võetakse kivim maakoore alt."
          },
          {
            "id": "p3",
            "text": "Uuritakse pärast purset kivimit."
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "maavärinalainete uurimine"
          },
          {
            "id": "c2",
            "text": "puuraugu uurimine"
          },
          {
            "id": "c3",
            "text": "vulkaanilise materjali uurimine"
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
      "id": "lo-opik-u19-q017",
      "unitId": "lo-opik-u19",
      "stem": "Millised on Maa kolm peamist kihti?",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g007",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Peamised kihid on maakoor, vahevöö ja tuum.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Maakoor"
          },
          {
            "id": "i2",
            "text": "Vahevöö"
          },
          {
            "id": "i3",
            "text": "Tuum"
          },
          {
            "id": "i4",
            "text": "Pilvkate"
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2",
          "i3"
        ]
      }
    },
    {
      "id": "lo-opik-u19-q018",
      "unitId": "lo-opik-u19",
      "stem": "Milline kiht on Maa kõige välimine?",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g008",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõige välimine tahke kiht on maakoor.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Maakoor"
          },
          {
            "id": "i2",
            "text": "Vahevöö"
          },
          {
            "id": "i3",
            "text": "Välistuum"
          },
          {
            "id": "i4",
            "text": "Sisetuum"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q019",
      "unitId": "lo-opik-u19",
      "stem": "Mis paikneb maakoore ja tuuma vahel?",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g009",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahevöö jääb maakoore alla ja tuuma peale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vahevöö"
          },
          {
            "id": "i2",
            "text": "Pilvekiht"
          },
          {
            "id": "i3",
            "text": "Sisetuum"
          },
          {
            "id": "i4",
            "text": "Merevesi"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q020",
      "unitId": "lo-opik-u19",
      "stem": "Milline osa asub Maa keskosas?",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g010",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa keskosas on tuum.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tuum"
          },
          {
            "id": "i2",
            "text": "Maakoor"
          },
          {
            "id": "i3",
            "text": "Ookean"
          },
          {
            "id": "i4",
            "text": "Atmosfäär"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q021",
      "unitId": "lo-opik-u19",
      "stem": "Järjesta Maa kolm põhikihti väljast sissepoole.",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g011",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pinnalt keskpunkti liikudes läbitakse maakoor, vahevöö ja tuum.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Maakoor"
          },
          {
            "id": "i2",
            "text": "Vahevöö"
          },
          {
            "id": "i3",
            "text": "Tuum"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Esimene",
        "lastLabel": "Viimane"
      }
    },
    {
      "id": "lo-opik-u19-q022",
      "unitId": "lo-opik-u19",
      "stem": "Järjesta Maa neli nimetatud osa väljast keskpunkti suunas.",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g011",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tuum jaguneb vedelaks välistuumaks ja tahkeks sisetuumaks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Maakoor"
          },
          {
            "id": "i2",
            "text": "Vahevöö"
          },
          {
            "id": "i3",
            "text": "Välistuum"
          },
          {
            "id": "i4",
            "text": "Sisetuum"
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
      "id": "lo-opik-u19-q023",
      "unitId": "lo-opik-u19",
      "stem": "Vali kõik õiged väited Maa kihtide kohta.",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g012",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahevöö on maakoore all ja sisetuum asub keskel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Vahevöö on maakoore all."
          },
          {
            "id": "i2",
            "text": "Sisetuum paikneb Maa kõige keskmises osas."
          },
          {
            "id": "i3",
            "text": "Maakoor on välistuuma sees."
          },
          {
            "id": "i4",
            "text": "Sisetuum on maakoorest väljaspool."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u19-q024",
      "unitId": "lo-opik-u19",
      "stem": "Miks räägitakse nii kolmest suurest kihist kui ka neljast osast?",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g007",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kolm peamist osa on maakoor, vahevöö ja tuum; tuumal on kaks osa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tuum jaguneb välistuumaks ja sisetuumaks"
          },
          {
            "id": "i2",
            "text": "Maakoor jaguneb päikeseks ja kuuks"
          },
          {
            "id": "i3",
            "text": "Vahevöö asub väljaspool Maad"
          },
          {
            "id": "i4",
            "text": "Tuum on ainult üks tahke kest"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q025",
      "unitId": "lo-opik-u19",
      "stem": "Ühenda Maa osa ja selle asukoht.",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g013",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Järjekord väljast sissepoole algab maakoorest ja lõpeb sisetuumaga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Maakoor"
          },
          {
            "id": "p2",
            "text": "Vahevöö"
          },
          {
            "id": "p3",
            "text": "Sisetuum"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "kõige peal"
          },
          {
            "id": "c2",
            "text": "maakoore ja tuuma vahel"
          },
          {
            "id": "c3",
            "text": "kõige keskel"
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
      "id": "lo-opik-u19-q026",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta Maa läbilõikes kõige välimist kihti näitavat tähist.",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g008",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maakoor on Maa õhuke kõige välimine kiht.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-earth-layers",
        "correctRegionId": "crust"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-earth-layers"
      }
    },
    {
      "id": "lo-opik-u19-q027",
      "unitId": "lo-opik-u19",
      "stem": "Leia jooniselt vahevöö asukoht.",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g009",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahevöö paikneb maakoore ja tuuma vahel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-earth-layers",
        "correctRegionId": "mantle"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-earth-layers"
      }
    },
    {
      "id": "lo-opik-u19-q028",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta kõige sisemist osa tähistavat tähist.",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g010",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sisetuum asub maakera keskmes.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-earth-layers",
        "correctRegionId": "inner-core"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-earth-layers"
      }
    },
    {
      "id": "lo-opik-u19-q029",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: Maa keskel asub vahevöö.",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g014",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa keskel asub tuum; vahevöö jääb sellest väljapoole.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
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
      "id": "lo-opik-u19-q030",
      "unitId": "lo-opik-u19",
      "stem": "Sukeldud mõttes Maa pinnalt keskpunkti. Mis on õige liikumise järjekord?",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g011",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa kihid paiknevad korrapäraselt väljast sissepoole.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Maakoor → vahevöö → välistuum → sisetuum"
          },
          {
            "id": "i2",
            "text": "Vahevöö → maakoor → sisetuum → välistuum"
          },
          {
            "id": "i3",
            "text": "Tuum → maakoor → vahevöö → õhk"
          },
          {
            "id": "i4",
            "text": "Maakoor → sisetuum → vahevöö → välistuum"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q031",
      "unitId": "lo-opik-u19",
      "stem": "Millised kaks paari on õigesti kirjeldatud?",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g012",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maakoor on väljas ja vahevöö keskel, tuum sügavamal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Maakoor — välimine kiht"
          },
          {
            "id": "i2",
            "text": "Vahevöö — maakoore ja tuuma vahel"
          },
          {
            "id": "i3",
            "text": "Välistuum — kõige pealmine kiht"
          },
          {
            "id": "i4",
            "text": "Sisetuum — ookeani all olev maakoor"
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u19-q032",
      "unitId": "lo-opik-u19",
      "stem": "Rühmita osad asukoha järgi: milline on kõige välimine ning millised sügavamal?",
      "primaryObjectiveId": "lo-opik-u19-o2",
      "variantGroupId": "lo-opik-u19-g015",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maakoor on väljas, ülejäänud kolm on selle all.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "outer",
            "text": "Kõige välimine"
          },
          {
            "id": "deeper",
            "text": "Sügavamal"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Maakoor"
          },
          {
            "id": "i2",
            "text": "Vahevöö"
          },
          {
            "id": "i3",
            "text": "Välistuum"
          },
          {
            "id": "i4",
            "text": "Sisetuum"
          }
        ],
        "correctGroupByItem": {
          "i1": "outer",
          "i2": "deeper",
          "i3": "deeper",
          "i4": "deeper"
        }
      }
    },
    {
      "id": "lo-opik-u19-q033",
      "unitId": "lo-opik-u19",
      "stem": "Millest koosneb maakoor?",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g016",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maakoor koosneb tahketest kivimitest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kõvadest kivimitest"
          },
          {
            "id": "i2",
            "text": "Pilvedest"
          },
          {
            "id": "i3",
            "text": "Ainult veest"
          },
          {
            "id": "i4",
            "text": "Puhtast rauast"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q034",
      "unitId": "lo-opik-u19",
      "stem": "Kui paks on õpiku järgi mandriline maakoor keskmiselt?",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g017",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku näide mandrilise maakoore keskmise paksuse kohta on umbes 40 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "40 km"
          },
          {
            "id": "i2",
            "text": "7 km"
          },
          {
            "id": "i3",
            "text": "2900 km"
          },
          {
            "id": "i4",
            "text": "6000 km"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q035",
      "unitId": "lo-opik-u19",
      "stem": "Kui paks on õpiku järgi ookeaniline maakoor keskmiselt?",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g018",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku näide ookeanilise maakoore keskmise paksuse kohta on umbes 7 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "7 km"
          },
          {
            "id": "i2",
            "text": "40 km"
          },
          {
            "id": "i3",
            "text": "5100 km"
          },
          {
            "id": "i4",
            "text": "13 000 km"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q036",
      "unitId": "lo-opik-u19",
      "stem": "Kui paks võib maakoor õpiku järgi mõne mäestiku all olla?",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g019",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus on kõige paksema maakoore näiteks märgitud kuni umbes 80 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kuni umbes 80 km"
          },
          {
            "id": "i2",
            "text": "Ainult 1 km"
          },
          {
            "id": "i3",
            "text": "Täpselt 2900 km"
          },
          {
            "id": "i4",
            "text": "Üle 6000 km"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q037",
      "unitId": "lo-opik-u19",
      "stem": "Kus on maakoor üldjuhul paksem?",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g020",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrite all on maakoor õpiku järgi keskmiselt umbes 40 km ja ookeanide all 7 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Mandri all"
          },
          {
            "id": "i2",
            "text": "Ookeani all"
          },
          {
            "id": "i3",
            "text": "Kõikjal täpselt sama paks"
          },
          {
            "id": "i4",
            "text": "Ainult saartel"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q038",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: maakoor on kõikjal Maa peal ühepaksune.",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g021",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maakoore paksus varieerub mandritel, ookeanide all ja mäestike piirkonnas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
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
      "id": "lo-opik-u19-q039",
      "unitId": "lo-opik-u19",
      "stem": "Milline maakoor on üldiselt vanem?",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g022",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik ütleb, et mandriline maakoor on üldiselt ookeanilisest vanem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Mandriline maakoor"
          },
          {
            "id": "i2",
            "text": "Ookeaniline maakoor"
          },
          {
            "id": "i3",
            "text": "Mõlemad on alati sama vanad"
          },
          {
            "id": "i4",
            "text": "Maakoor tekib iga päev uuesti"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q040",
      "unitId": "lo-opik-u19",
      "stem": "Tabelis on 7 km, 40 km ja 80 km. Milline väärtus sobib õpiku järgi ookeanilise maakoore tüüpiliseks paksuseks?",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g018",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeanilise maakoore keskmiseks näiteks on õpikus umbes 7 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "7 km"
          },
          {
            "id": "i2",
            "text": "40 km"
          },
          {
            "id": "i3",
            "text": "80 km"
          },
          {
            "id": "i4",
            "text": "2900 km"
          }
        ],
        "correctOptionId": "i1"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Kirje",
          "Paksus"
        ],
        "rows": [
          [
            "A",
            "7 km"
          ],
          [
            "B",
            "40 km"
          ],
          [
            "C",
            "80 km"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u19-q041",
      "unitId": "lo-opik-u19",
      "stem": "Järjesta tüüpilised näited maakoore paksuse järgi õhemast paksemani.",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g023",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku võrdluses on 7 km vähem kui 40 km ja 80 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Ookeani all (7 km)"
          },
          {
            "id": "i2",
            "text": "Mandri all (40 km)"
          },
          {
            "id": "i3",
            "text": "Mäestiku all (kuni 80 km)"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Esimene",
        "lastLabel": "Viimane"
      }
    },
    {
      "id": "lo-opik-u19-q042",
      "unitId": "lo-opik-u19",
      "stem": "Ühenda piirkond õpiku ligikaudse maakoore paksusega.",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g023",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Paksused on õpiku näited, mitte iga piirkonna muutumatud arvud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Ookeani all"
          },
          {
            "id": "p2",
            "text": "Mandri all"
          },
          {
            "id": "p3",
            "text": "Mäestiku all"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "7 km"
          },
          {
            "id": "c2",
            "text": "40 km"
          },
          {
            "id": "c3",
            "text": "kuni 80 km"
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
      "id": "lo-opik-u19-q043",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta joonisel ookeanilise maakoore näidet.",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g018",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ookeaniline maakoor on sellel võrdlusjoonisel kõige õhem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-crust-thickness",
        "correctRegionId": "oceanic"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-crust-thickness"
      }
    },
    {
      "id": "lo-opik-u19-q044",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta mandrilise maakoore keskmise paksuse näidet.",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g017",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mandrilise maakoore keskmise näide on umbes 40 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-crust-thickness",
        "correctRegionId": "continental"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-crust-thickness"
      }
    },
    {
      "id": "lo-opik-u19-q045",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta kõige paksema mäestikualuse maakoore näidet.",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g019",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mäestike all võib maakoor olla umbes 80 km paks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-crust-thickness",
        "correctRegionId": "mountain"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-crust-thickness"
      }
    },
    {
      "id": "lo-opik-u19-q046",
      "unitId": "lo-opik-u19",
      "stem": "Kuidas eristada maakoort tuumast?",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g008",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maakoor on tahke kivimiline väliskiht, tuum paikneb sügaval Maa sees.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Maakoor on õhuke kivimiline pindmine kiht"
          },
          {
            "id": "i2",
            "text": "Maakoor on Maa keskel olev raud"
          },
          {
            "id": "i3",
            "text": "Maakoor asub sisetuumast sügavamal"
          },
          {
            "id": "i4",
            "text": "Maakoor koosneb ainult vedelast kivimist"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q047",
      "unitId": "lo-opik-u19",
      "stem": "Võrdle õpiku arve: 7 km ja 40 km. Kumb näide on paksem?",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g020",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "40 km on suurem kui 7 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "40 km ehk mandriline maakoor"
          },
          {
            "id": "i2",
            "text": "7 km ehk ookeaniline maakoor"
          },
          {
            "id": "i3",
            "text": "Mõlemad on sama paksud"
          },
          {
            "id": "i4",
            "text": "Numbrite põhjal ei saa võrrelda"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q048",
      "unitId": "lo-opik-u19",
      "stem": "Millised väited maakoore kohta sobivad õpikuga?",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g024",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maakoor on kivimiline väliskiht, mille paksus on eri paikades erinev.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Maakoor on kõvadest kivimitest."
          },
          {
            "id": "i2",
            "text": "Maakoor esineb ka ookeanide all."
          },
          {
            "id": "i3",
            "text": "Maakoor on kogu Maa ulatuses täpselt 40 km paks."
          },
          {
            "id": "i4",
            "text": "Maakoor on Maa kõige sügavam kiht."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u19-q049",
      "unitId": "lo-opik-u19",
      "stem": "Rühmita näited õpiku tüüpilise maakoore paksuse järgi.",
      "primaryObjectiveId": "lo-opik-u19-o3",
      "variantGroupId": "lo-opik-u19-g023",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku näidetes on ookeaniline maakoor 7 km, mandriline 40 km ja mäestiku all kuni 80 km.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "70"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "thin",
            "text": "Umbes 7 km"
          },
          {
            "id": "thick",
            "text": "Umbes 40 km või rohkem"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Ookeani all"
          },
          {
            "id": "i2",
            "text": "Tavalise mandri all"
          },
          {
            "id": "i3",
            "text": "Kõrge mäestiku all"
          }
        ],
        "correctGroupByItem": {
          "i1": "thin",
          "i2": "thick",
          "i3": "thick"
        }
      }
    },
    {
      "id": "lo-opik-u19-q050",
      "unitId": "lo-opik-u19",
      "stem": "Millise sügavuseni ulatub vahevöö ligikaudu?",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g025",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahevöö ulatub maakoore alt umbes 2900 km sügavuseni.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "2900 km"
          },
          {
            "id": "i2",
            "text": "7 km"
          },
          {
            "id": "i3",
            "text": "40 km"
          },
          {
            "id": "i4",
            "text": "13 000 km"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q051",
      "unitId": "lo-opik-u19",
      "stem": "Kus asub vahevöö?",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g009",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahevöö jääb maakoore alla ja tuuma ümber.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Maakoore ja tuuma vahel"
          },
          {
            "id": "i2",
            "text": "Pilvede kohal"
          },
          {
            "id": "i3",
            "text": "Sisetuumast sügavamal"
          },
          {
            "id": "i4",
            "text": "Ainult ookeanides"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q052",
      "unitId": "lo-opik-u19",
      "stem": "Milline kirjeldus on vahevöö kohta teaduslikult õigem?",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g026",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "USGSi ja BGSi selgituse järgi on vahevöö valdavalt tahke, kuid voolab geoloogilise aja jooksul väga aeglaselt.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "See on enamasti tahke kuum kivim, mis võib väga aeglaselt deformeeruda"
          },
          {
            "id": "i2",
            "text": "See on suur tühi õõnsus"
          },
          {
            "id": "i3",
            "text": "See koosneb peamiselt mereveest"
          },
          {
            "id": "i4",
            "text": "See koosneb ainult õhust"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q053",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: kogu vahevöö koosneb vabalt loksuvast vedelast magmast.",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g026",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Enamik vahevööst on tahke. Kohati saab tekkida sulakivim.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
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
      "id": "lo-opik-u19-q054",
      "unitId": "lo-opik-u19",
      "stem": "Mis juhtub Maa sees üldiselt sügavamale liikudes temperatuuriga?",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g027",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üldiselt on Maa sisemuses sügavamal kuumem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Temperatuur tõuseb"
          },
          {
            "id": "i2",
            "text": "Temperatuur muutub alati nulliks"
          },
          {
            "id": "i3",
            "text": "Temperatuur langeb kogu aeg"
          },
          {
            "id": "i4",
            "text": "Temperatuur ei muutu mitte kunagi"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q055",
      "unitId": "lo-opik-u19",
      "stem": "Kuidas saab tahke vahevöö liikuda?",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g028",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõrgel temperatuuril ja suure rõhu all saab tahke kivim pika aja jooksul voolata.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.bgs.ac.uk/discovering-geology/earth-hazards/earthquakes/what-causes-earthquakes/",
          "attribution": "British Geological Survey",
          "note": "Seismiliste lainete abil uuritakse Maa sisemust; jäik litosfäär hõlmab maakoore ja ülemise vahevöö."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Väga pika aja jooksul kivim deformeerub aeglaselt"
          },
          {
            "id": "i2",
            "text": "Kõik kivimid hüppavad igal sekundil ühest kohast teise"
          },
          {
            "id": "i3",
            "text": "Vahevöö ei saa üldse liikuda"
          },
          {
            "id": "i4",
            "text": "Ainult veeaur surub kivimeid"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q056",
      "unitId": "lo-opik-u19",
      "stem": "Mida nimetatakse magmaks?",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g029",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magma on Maa sees tekkinud sulakivim, mida võib leiduda teatud piirkondades.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Maa sees olevat sulanud kivimit"
          },
          {
            "id": "i2",
            "text": "Tahket sisetuuma"
          },
          {
            "id": "i3",
            "text": "Meres lahustunud soola"
          },
          {
            "id": "i4",
            "text": "Igat maakoore kivimit"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q057",
      "unitId": "lo-opik-u19",
      "stem": "Mis saab magmast siis, kui see jõuab maapinnale?",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g030",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maapinnale jõudnud magma on laava.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Seda nimetatakse laavaks"
          },
          {
            "id": "i2",
            "text": "See muutub sisetuumaks"
          },
          {
            "id": "i3",
            "text": "Seda nimetatakse mandriks"
          },
          {
            "id": "i4",
            "text": "See muutub automaatselt jääks"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q058",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta Maa läbilõikel kuuma kivimilise vahevöö tähist.",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g009",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahevöö asub maakoorest sügavamal ja tuumast väljaspool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-earth-layers",
        "correctRegionId": "mantle"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-earth-layers"
      }
    },
    {
      "id": "lo-opik-u19-q059",
      "unitId": "lo-opik-u19",
      "stem": "Ühenda aine ja selle kirjeldus.",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g029",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahevöö on kiht, magma sulakivim Maa sees ja laava pinnale jõudnud magma.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Vahevöö"
          },
          {
            "id": "p2",
            "text": "Magma"
          },
          {
            "id": "p3",
            "text": "Laava"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "väga paks, valdavalt tahke kuum kivimikiht"
          },
          {
            "id": "c2",
            "text": "sulanud kivim Maa sees"
          },
          {
            "id": "c3",
            "text": "maapinnale jõudnud magma"
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
      "id": "lo-opik-u19-q060",
      "unitId": "lo-opik-u19",
      "stem": "Rühmita näited õigesti.",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g030",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahevöö on peamiselt tahke, magma ja laava on sulanud kivim.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.bgs.ac.uk/discovering-geology/earth-hazards/earthquakes/what-causes-earthquakes/",
          "attribution": "British Geological Survey",
          "note": "Seismiliste lainete abil uuritakse Maa sisemust; jäik litosfäär hõlmab maakoore ja ülemise vahevöö."
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "rock",
            "text": "Valdavalt tahke kivim"
          },
          {
            "id": "molten",
            "text": "Sulanud kivim"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Vahevöö põhimass"
          },
          {
            "id": "i2",
            "text": "Magma"
          },
          {
            "id": "i3",
            "text": "Vahevöö enamik sügavusel"
          },
          {
            "id": "i4",
            "text": "Vulkaanipurske laava"
          }
        ],
        "correctGroupByItem": {
          "i1": "rock",
          "i2": "molten",
          "i3": "rock",
          "i4": "molten"
        }
      }
    },
    {
      "id": "lo-opik-u19-q061",
      "unitId": "lo-opik-u19",
      "stem": "Õpikus on kirjas, et vahevöö ulatub 2900 km sügavusele. Mis jääb selle all sügavamale?",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g031",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahevööst sügavamal algab tuum.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tuum"
          },
          {
            "id": "i2",
            "text": "Õhk"
          },
          {
            "id": "i3",
            "text": "Maakoor"
          },
          {
            "id": "i4",
            "text": "Maapinna mets"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q062",
      "unitId": "lo-opik-u19",
      "stem": "Miks võib tahke vahevöö aja jooksul deformeeruda?",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g028",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuumad kivimid võivad väga pika aja jooksul aeglaselt muutuda ja liikuda.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.bgs.ac.uk/discovering-geology/earth-hazards/earthquakes/what-causes-earthquakes/",
          "attribution": "British Geological Survey",
          "note": "Seismiliste lainete abil uuritakse Maa sisemust; jäik litosfäär hõlmab maakoore ja ülemise vahevöö."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kõrge temperatuuri ja suure rõhu tõttu"
          },
          {
            "id": "i2",
            "text": "Sest vahevöö on täidetud õhuga"
          },
          {
            "id": "i3",
            "text": "Sest tuul liigutab sügavaid kivimeid"
          },
          {
            "id": "i4",
            "text": "Sest kogu vahevöö on jääst"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q063",
      "unitId": "lo-opik-u19",
      "stem": "Milline väärtus kirjeldab vahevöö alumist piiri, mitte maakoore tüüpilist paksust?",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g025",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "7, 40 ja 80 km on õpiku maakoore paksuse näited, 2900 km on vahevöö alumise piiri sügavus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "2900 km"
          },
          {
            "id": "i2",
            "text": "7 km"
          },
          {
            "id": "i3",
            "text": "40 km"
          },
          {
            "id": "i4",
            "text": "80 km"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q064",
      "unitId": "lo-opik-u19",
      "stem": "Milline lause ei tekita ekslikku kujutlust laamade liikumisest?",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g032",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamad on jäigad kivimiosad, mis liiguvad aeglaselt; vahevöö ei ole vedel meri.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Jäigad laamad liiguvad väga aeglaselt vahevöö peal"
          },
          {
            "id": "i2",
            "text": "Jäigad laamad ujuvad kiirelt vedela magma meres"
          },
          {
            "id": "i3",
            "text": "Laamad on ainult vedelast metallist"
          },
          {
            "id": "i4",
            "text": "Laamad asuvad tuuma sees"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q065",
      "unitId": "lo-opik-u19",
      "stem": "Vali õiged väited vahevöö kohta.",
      "primaryObjectiveId": "lo-opik-u19-o4",
      "variantGroupId": "lo-opik-u19-g026",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahevöö on paks kuum kivimikiht, mis on valdavalt tahke.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Vahevöö paikneb maakoore ja tuuma vahel."
          },
          {
            "id": "i2",
            "text": "Vahevöö on valdavalt tahke."
          },
          {
            "id": "i3",
            "text": "Kogu vahevöö on vedel magmameri."
          },
          {
            "id": "i4",
            "text": "Vahevöö asub pilvede kohal."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u19-q066",
      "unitId": "lo-opik-u19",
      "stem": "Millistest metallidest koosneb Maa tuum peamiselt?",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g033",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab tuuma peamisteks koostisosadeks raua ja nikli.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Rauast ja niklist"
          },
          {
            "id": "i2",
            "text": "Kullast ja hõbedast"
          },
          {
            "id": "i3",
            "text": "Alumiiniumist ja plastist"
          },
          {
            "id": "i4",
            "text": "Jääst ja liivast"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q067",
      "unitId": "lo-opik-u19",
      "stem": "Milline on välistuuma olek?",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g034",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa välistuum on vedel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vedel"
          },
          {
            "id": "i2",
            "text": "Tahke nagu maakoor"
          },
          {
            "id": "i3",
            "text": "Ainult gaasiline"
          },
          {
            "id": "i4",
            "text": "Mitte ühtegi ainet ei ole"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q068",
      "unitId": "lo-opik-u19",
      "stem": "Milline on sisetuum?",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g035",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa sisetuum on tahke.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tahke"
          },
          {
            "id": "i2",
            "text": "Vedel nagu välistuum"
          },
          {
            "id": "i3",
            "text": "Ainult gaasiline"
          },
          {
            "id": "i4",
            "text": "Õõnes"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q069",
      "unitId": "lo-opik-u19",
      "stem": "Miks püsib väga kuum sisetuum tahke?",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g036",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku järgi hoiab tohutu rõhk sisetuuma tahkena.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Seal on tohutu rõhk"
          },
          {
            "id": "i2",
            "text": "Sest sisetuum on külmem kui maakoor"
          },
          {
            "id": "i3",
            "text": "Sest sisetuum koosneb jääst"
          },
          {
            "id": "i4",
            "text": "Sest sisetuum asub merepõhjas"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q070",
      "unitId": "lo-opik-u19",
      "stem": "Kui kuum võib sisetuum õpiku järgi ligikaudu olla?",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g037",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus antakse sisetuuma ligikaudseks temperatuuriks kuni 6000 kraadi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kuni umbes 6000 °C"
          },
          {
            "id": "i2",
            "text": "Umbes 6 °C"
          },
          {
            "id": "i3",
            "text": "Umbes 40 °C"
          },
          {
            "id": "i4",
            "text": "Umbes −20 °C"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q071",
      "unitId": "lo-opik-u19",
      "stem": "Umbes millisel sügavusel algab Maa tuum?",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g025",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahevöö ja tuuma piir paikneb ligikaudu 2900 km sügavusel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "2900 km"
          },
          {
            "id": "i2",
            "text": "7 km"
          },
          {
            "id": "i3",
            "text": "40 km"
          },
          {
            "id": "i4",
            "text": "80 km"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q072",
      "unitId": "lo-opik-u19",
      "stem": "Umbes millisest sügavusest algab sisetuum õpiku joonisel?",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g038",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku joonisel algab sisetuum ligikaudu 5100 km sügavusel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "5100 km"
          },
          {
            "id": "i2",
            "text": "7 km"
          },
          {
            "id": "i3",
            "text": "40 km"
          },
          {
            "id": "i4",
            "text": "2900 meetrit"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q073",
      "unitId": "lo-opik-u19",
      "stem": "Millised kaks väidet on õiged?",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g039",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tuum koosneb vedelast välistuumast ja tahkest sisetuumast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Välistuum on vedel."
          },
          {
            "id": "i2",
            "text": "Sisetuum on tahke."
          },
          {
            "id": "i3",
            "text": "Välistuum on maakoore peal."
          },
          {
            "id": "i4",
            "text": "Sisetuum on palju külmem kui maapind."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u19-q074",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta joonisel vedelat välistuuma.",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g034",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Välistuum on vahevöö ja sisetuuma vahel paiknev vedel kiht.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-earth-layers",
        "correctRegionId": "outer-core"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-earth-layers"
      }
    },
    {
      "id": "lo-opik-u19-q075",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta joonisel tahket sisetuuma.",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g010",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sisetuum on Maa kõige keskmine, tohutu rõhu all tahke osa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-earth-layers",
        "correctRegionId": "inner-core"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-earth-layers"
      }
    },
    {
      "id": "lo-opik-u19-q076",
      "unitId": "lo-opik-u19",
      "stem": "Ühenda Maa tuuma osa ja selle omadus.",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g039",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Välistuum on vedel, sisetuum tahke ja tuum koosneb peamiselt rauast-niklist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Välistuum"
          },
          {
            "id": "p2",
            "text": "Sisetuum"
          },
          {
            "id": "p3",
            "text": "Tuum tervikuna"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "vedel metall"
          },
          {
            "id": "c2",
            "text": "tahke metall"
          },
          {
            "id": "c3",
            "text": "koosneb peamiselt rauast ja niklist"
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
      "id": "lo-opik-u19-q077",
      "unitId": "lo-opik-u19",
      "stem": "Rühmita Maa siseosad oleku järgi.",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g039",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maakoor, suurem osa vahevööst ja sisetuum on tahked; välistuum vedel.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "solid",
            "text": "Tahke"
          },
          {
            "id": "liquid",
            "text": "Vedel"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Maakoor"
          },
          {
            "id": "i2",
            "text": "Vahevöö põhimass"
          },
          {
            "id": "i3",
            "text": "Välistuum"
          },
          {
            "id": "i4",
            "text": "Sisetuum"
          }
        ],
        "correctGroupByItem": {
          "i1": "solid",
          "i2": "solid",
          "i3": "liquid",
          "i4": "solid"
        }
      }
    },
    {
      "id": "lo-opik-u19-q078",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: sisetuum on tahke sellepärast, et Maa keskmes on väga külm.",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g036",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sisetuum on väga kuum, kuid tohutu rõhk hoiab selle tahkena.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
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
      "id": "lo-opik-u19-q079",
      "unitId": "lo-opik-u19",
      "stem": "Järjesta maakoorest sügavamale jäävad osad väljast keskpunkti suunas.",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g011",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sisetuum paikneb välistuuma sees, kõige keskel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Vahevöö"
          },
          {
            "id": "i2",
            "text": "Välistuum"
          },
          {
            "id": "i3",
            "text": "Sisetuum"
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Esimene",
        "lastLabel": "Viimane"
      }
    },
    {
      "id": "lo-opik-u19-q080",
      "unitId": "lo-opik-u19",
      "stem": "Milline väide selgitab välistuuma ja sisetuuma paiknemist?",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g035",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Välistuum ümbritseb sisetuuma.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Sisetuum asub välistuuma sees"
          },
          {
            "id": "i2",
            "text": "Välistuum asub maakoore kohal"
          },
          {
            "id": "i3",
            "text": "Sisetuum ümbritseb kogu vahevööd"
          },
          {
            "id": "i4",
            "text": "Välistuum asub väljaspool Maad"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q081",
      "unitId": "lo-opik-u19",
      "stem": "Milline sisemine osa on vedel, kui kasutada tabelit?",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g034",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tabelis on ainult välistuum vedel.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Välistuum"
          },
          {
            "id": "i2",
            "text": "Sisetuum"
          },
          {
            "id": "i3",
            "text": "Maakoor"
          },
          {
            "id": "i4",
            "text": "Vahevöö põhimass"
          }
        ],
        "correctOptionId": "i1"
      },
      "context": {
        "kind": "table",
        "headers": [
          "Osa",
          "Olek"
        ],
        "rows": [
          [
            "Maakoor",
            "tahke"
          ],
          [
            "Vahevöö põhimass",
            "tahke"
          ],
          [
            "Välistuum",
            "vedel"
          ],
          [
            "Sisetuum",
            "tahke"
          ]
        ]
      }
    },
    {
      "id": "lo-opik-u19-q082",
      "unitId": "lo-opik-u19",
      "stem": "Kumb võrdlus on õige?",
      "primaryObjectiveId": "lo-opik-u19-o5",
      "variantGroupId": "lo-opik-u19-g036",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõrge rõhk võimaldab sisetuumal olla kuumana tahke.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "71"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Sisetuum on väga kuum ja tahke; välistuum vedel"
          },
          {
            "id": "i2",
            "text": "Sisetuum on jääkülm ja vedel; välistuum tahke"
          },
          {
            "id": "i3",
            "text": "Mõlemad koosnevad õhust"
          },
          {
            "id": "i4",
            "text": "Sisetuum on paberist ja välistuum veest"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q083",
      "unitId": "lo-opik-u19",
      "stem": "Mida nimetatakse laamaks?",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g040",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laam on Maa välise jäiga kivimilise kesta suur osa.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Maa välimise jäiga kesta suureks liikuvaks tükiks"
          },
          {
            "id": "i2",
            "text": "Pilve liikumiseks"
          },
          {
            "id": "i3",
            "text": "Vaikse ookeani veekihiks"
          },
          {
            "id": "i4",
            "text": "Maa sisetuumaks"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q084",
      "unitId": "lo-opik-u19",
      "stem": "Milline väide laama ehituse kohta on teaduslikult täpne?",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g041",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jäik laam sisaldab nii maakoort kui ka osa ülemisest vahevööst.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Laam hõlmab maakoort ja jäika ülemise vahevöö osa"
          },
          {
            "id": "i2",
            "text": "Laam koosneb ainult õhust"
          },
          {
            "id": "i3",
            "text": "Laam hõlmab Maa sisetuuma"
          },
          {
            "id": "i4",
            "text": "Laam on eraldiseisev vedel kivimitükk"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q085",
      "unitId": "lo-opik-u19",
      "stem": "Millise võrdluse toob õpik laamadest rääkides?",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g040",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik võrdleb maakoore tükilisust mõranenud munakoorega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Mõranenud munakoor"
          },
          {
            "id": "i2",
            "text": "Ühe suure tervikliku rauakera"
          },
          {
            "id": "i3",
            "text": "Läbipaistva klaaspalli"
          },
          {
            "id": "i4",
            "text": "Pehme pilvepadja"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q086",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: Maa kõige välimine jäik kivimiline kest on üksainus liikumatu tükk.",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g040",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa välimine jäik kest koosneb paljudest suurtest ja väiksematest laamadest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
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
      "id": "lo-opik-u19-q087",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: laam võib ulatuda ka ookeani alla.",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g042",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamad võivad hõlmata nii mandrite all kui ka ookeanide all paiknevat välimist jäika kivimikihti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
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
        "correctOptionId": "yes",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u19-q088",
      "unitId": "lo-opik-u19",
      "stem": "Mis kuulub laama koosseisu lisaks maakoorele?",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g041",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laam sisaldab maakoort ja jäika osa ülemisest vahevööst.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Jäik ülemise vahevöö osa"
          },
          {
            "id": "i2",
            "text": "Vedel välistuum"
          },
          {
            "id": "i3",
            "text": "Tahke sisetuum"
          },
          {
            "id": "i4",
            "text": "Maa atmosfäär"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q089",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta liikumisskeemil vasakpoolset jäika laama.",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g043",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamad paiknevad vahevöö aeglaselt deformeeruva osa kohal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-motion",
        "correctRegionId": "left-plate"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-motion"
      }
    },
    {
      "id": "lo-opik-u19-q090",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta liikumisskeemil parempoolset jäika laama.",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g043",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ka paremal pool laamapiiri on jäik laam.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-motion",
        "correctRegionId": "right-plate"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-motion"
      }
    },
    {
      "id": "lo-opik-u19-q091",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta skeemil kahe laama vahelist piiri.",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g044",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamadevaheline piir on kahe jäiga laama kokkupuutekoht.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-motion",
        "correctRegionId": "boundary"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-motion"
      }
    },
    {
      "id": "lo-opik-u19-q092",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta skeemil laamade all olevat vahevöö osa.",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g045",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamade all asuv vahevöö kivim võib väga pika aja jooksul deformeeruda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-motion",
        "correctRegionId": "mantle"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-motion"
      }
    },
    {
      "id": "lo-opik-u19-q093",
      "unitId": "lo-opik-u19",
      "stem": "Võrdle mõisteid „maakoor” ja „laam”. Vali õiged väited.",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g041",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamad on suuremad jäigad osad kui üksnes maakoor.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Maakoor on Maa kõige välimine kivimikiht."
          },
          {
            "id": "i2",
            "text": "Laam hõlmab maakoort ja jäika ülemist vahevööd."
          },
          {
            "id": "i3",
            "text": "Laam on Maa keskel asuv vedel tuum."
          },
          {
            "id": "i4",
            "text": "Maakoor on alati ainult üks terve tükk."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u19-q094",
      "unitId": "lo-opik-u19",
      "stem": "Rühmita väited: mis kuulub jäiga laama koosseisu?",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g041",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laam koosneb maakoorest ja jäigast ülemise vahevöö osast.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/dynamic/inside.html",
          "attribution": "USGS — Inside the Earth",
          "note": "Vahevöö on peamiselt tahke; laamad hõlmavad jäika maakoort ja ülemise vahevöö osa."
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "yes",
            "text": "Kuulub laama koosseisu"
          },
          {
            "id": "no",
            "text": "Ei kuulu laama koosseisu"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Maakoor"
          },
          {
            "id": "i2",
            "text": "Jäik ülemise vahevöö osa"
          },
          {
            "id": "i3",
            "text": "Vedela välistuuma metall"
          },
          {
            "id": "i4",
            "text": "Maa sisetuum"
          }
        ],
        "correctGroupByItem": {
          "i1": "yes",
          "i2": "yes",
          "i3": "no",
          "i4": "no"
        }
      }
    },
    {
      "id": "lo-opik-u19-q095",
      "unitId": "lo-opik-u19",
      "stem": "Ühenda mõisted õigete seletustega.",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g046",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maakoor on üks kiht; laam hõlmab jäika kivimkesta; vahevöö jääb sügavamale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Maakoor"
          },
          {
            "id": "p2",
            "text": "Laam"
          },
          {
            "id": "p3",
            "text": "Vahevöö"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Maa kõige välimine kivimikiht"
          },
          {
            "id": "c2",
            "text": "Maa välimise jäiga kesta liikuv tükk"
          },
          {
            "id": "c3",
            "text": "maakoore ja tuuma vaheline kuum kivimikiht"
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
      "id": "lo-opik-u19-q096",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: riigipiirid peavad alati langema kokku laamapiiridega.",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g047",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Riigipiirid on inimeste kokkulepped, laamapiirid on geoloogilised piirid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
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
      "id": "lo-opik-u19-q097",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: lisaks suurtele laamadele on palju väiksemaid laamasid.",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g048",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus öeldakse, et lisaks seitsmele nimetatud suurele laamale on palju väiksemaid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
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
        "correctOptionId": "yes",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u19-q098",
      "unitId": "lo-opik-u19",
      "stem": "Millest laam päriselt koosneb?",
      "primaryObjectiveId": "lo-opik-u19-o6",
      "variantGroupId": "lo-opik-u19-g049",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laam on jäik kivimiline osa Maa väliskestas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Jäikadest kivimitest"
          },
          {
            "id": "i2",
            "text": "Vabalt voolavast mereveest"
          },
          {
            "id": "i3",
            "text": "Ainult õhust"
          },
          {
            "id": "i4",
            "text": "Ainult kuumast vedelast rauast"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q099",
      "unitId": "lo-opik-u19",
      "stem": "Kui kiiresti liiguvad laamad tavaliselt?",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g050",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamade liikumine on enamasti vaid mõni sentimeeter aastas.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-fast-do-tectonic-plates-move",
          "attribution": "USGS — How fast do tectonic plates move?",
          "note": "Laamade kiirus on erinev, tavaliselt mõni sentimeeter aastas."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Mõne sentimeetri võrra aastas"
          },
          {
            "id": "i2",
            "text": "Mitu kilomeetrit sekundis"
          },
          {
            "id": "i3",
            "text": "Mitte kunagi"
          },
          {
            "id": "i4",
            "text": "Tuhat kilomeetrit päevas"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q100",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: kõik laamad liiguvad alati ühesuguse kiirusega.",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g050",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamade kiirused ja suunad on erinevad.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-fast-do-tectonic-plates-move",
          "attribution": "USGS — How fast do tectonic plates move?",
          "note": "Laamade kiirus on erinev, tavaliselt mõni sentimeeter aastas."
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
      "id": "lo-opik-u19-q101",
      "unitId": "lo-opik-u19",
      "stem": "Milline loodusnähtus võib olla seotud laamade piiridel tekkivate pingetega?",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g051",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamapiiridel võib kivimite järsk liikumine vallandada maavärina.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Maavärin"
          },
          {
            "id": "i2",
            "text": "Vikerkaar"
          },
          {
            "id": "i3",
            "text": "Tavaline vihmasadu"
          },
          {
            "id": "i4",
            "text": "Kuu faasid"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q102",
      "unitId": "lo-opik-u19",
      "stem": "Milline nähtus on sageli seotud laamade piiride piirkondadega?",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g052",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Paljud vulkaanid paiknevad laamapiiride lähedal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vulkaanipurse"
          },
          {
            "id": "i2",
            "text": "Pilvede liikumine"
          },
          {
            "id": "i3",
            "text": "Lumikelluke"
          },
          {
            "id": "i4",
            "text": "Päikesevarjutus"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q103",
      "unitId": "lo-opik-u19",
      "stem": "Miks võib laamade liikumine põhjustada maavärinat?",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g051",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aeglane liikumine võib tekitada pinget, mis vabaneb järsu nihkega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kivimites koguneb pinge ja võib toimuda järsk nihe"
          },
          {
            "id": "i2",
            "text": "Laamad koosnevad merelainetest"
          },
          {
            "id": "i3",
            "text": "Kõik laamad sulavad ühe hetkega"
          },
          {
            "id": "i4",
            "text": "Kuu jõuab Maa sisse"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q104",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: igal laamapiiril asub kindlasti tegutsev vulkaan.",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g052",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaane on paljude laamapiiride juures, kuid mitte igal piiril.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
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
      "id": "lo-opik-u19-q105",
      "unitId": "lo-opik-u19",
      "stem": "Kui laam liigub 4 cm aastas, kui kaugele liigub see 5 aastaga?",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g053",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "5 × 4 cm = 20 cm. Näites on kiirus kogu aja sama.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "20 cm"
          },
          {
            "id": "i2",
            "text": "5 cm"
          },
          {
            "id": "i3",
            "text": "4 m"
          },
          {
            "id": "i4",
            "text": "40 km"
          }
        ],
        "correctOptionId": "i1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Oletame, et laama kiirus on kõigil viiel aastal 4 cm/aastas."
        ]
      }
    },
    {
      "id": "lo-opik-u19-q106",
      "unitId": "lo-opik-u19",
      "stem": "Kui laam liigub ühtlase kiirusega 3 cm aastas, kui kaugele liigub see 10 aastaga?",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g053",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "10 × 3 cm = 30 cm, kui kiirus ei muutu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "30 cm"
          },
          {
            "id": "i2",
            "text": "3 cm"
          },
          {
            "id": "i3",
            "text": "300 km"
          },
          {
            "id": "i4",
            "text": "13 000 km"
          }
        ],
        "correctOptionId": "i1"
      },
      "context": {
        "kind": "text",
        "paragraphs": [
          "Lihtne ülesanne: kiirus 3 cm aastas, aeg 10 aastat."
        ]
      }
    },
    {
      "id": "lo-opik-u19-q107",
      "unitId": "lo-opik-u19",
      "stem": "Järjesta võrdsete aastate jooksul liikunud vahemaad väiksemast suuremani.",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g054",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "2 < 5 < 10 < 20 sentimeetrit.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "2 cm"
          },
          {
            "id": "i2",
            "text": "5 cm"
          },
          {
            "id": "i3",
            "text": "10 cm"
          },
          {
            "id": "i4",
            "text": "20 cm"
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
      "id": "lo-opik-u19-q108",
      "unitId": "lo-opik-u19",
      "stem": "Ühenda nähtus ja põhjus.",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g055",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamad liiguvad aeglaselt, aga pinge võib vabaneda järsku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Maavärin"
          },
          {
            "id": "p2",
            "text": "Vulkaanipurse"
          },
          {
            "id": "p3",
            "text": "Laama aeglane liikumine"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Kivimite järsk nihkumine"
          },
          {
            "id": "c2",
            "text": "Magma jõudmine maapinnale"
          },
          {
            "id": "c3",
            "text": "Mõni sentimeeter aastas"
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
      "id": "lo-opik-u19-q109",
      "unitId": "lo-opik-u19",
      "stem": "Miks märkame laamade liikumise tagajärgi, kuigi nad liiguvad aeglaselt?",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g056",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pika aja jooksul toimuv liikumine võib muuta maapinda ja tekitada pingeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Liikumine toimub väga pika aja jooksul ja pinge võib järsku vabaneda"
          },
          {
            "id": "i2",
            "text": "Laamad liiguvad alati palja silmaga nähtavalt iga minut"
          },
          {
            "id": "i3",
            "text": "Maa sisemus ei muutu kunagi"
          },
          {
            "id": "i4",
            "text": "Laamad on pilved"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q110",
      "unitId": "lo-opik-u19",
      "stem": "Kui ühest piirkonnast leitakse palju maavärinaid ja vulkaane, mida tasuks kaardilt otsida?",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g057",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamapiirid on sageli seotud maavärinate ja vulkaanidega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Laamapiiride asukohti"
          },
          {
            "id": "i2",
            "text": "Ainult linnade tänavanimesid"
          },
          {
            "id": "i3",
            "text": "Riikide lipuvärve"
          },
          {
            "id": "i4",
            "text": "Ilmateate kuufaaside rida"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q111",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: õpiku arvud 3–4 cm ning 10–16 cm on iga laama muutumatud kiirused.",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g050",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku arvud on näited. Laamade tegelik liikumiskiirus on laamati ja asukohati erinev.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-fast-do-tectonic-plates-move",
          "attribution": "USGS — How fast do tectonic plates move?",
          "note": "Laamade kiirus on erinev, tavaliselt mõni sentimeeter aastas."
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
      "id": "lo-opik-u19-q112",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta skeemil kohta, kus laamad kokku puutuvad ja võivad tekkida pinged.",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g044",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamapiiri juures võivad kivimites koguneda pinged.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-motion",
        "correctRegionId": "boundary"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-motion"
      }
    },
    {
      "id": "lo-opik-u19-q113",
      "unitId": "lo-opik-u19",
      "stem": "Rühmita liikumise tagajärjed ja nendega mitteseotud nähtused.",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g055",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärinad ja paljud vulkaanipursked võivad olla seotud laamade liikumisega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "related",
            "text": "Võib olla seotud laamade liikumisega"
          },
          {
            "id": "other",
            "text": "Ei teki laamade liikumisest"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Maavärin"
          },
          {
            "id": "i2",
            "text": "Mõned vulkaanipursked"
          },
          {
            "id": "i3",
            "text": "Vikerkaar"
          },
          {
            "id": "i4",
            "text": "Tavaline päikeseloojang"
          }
        ],
        "correctGroupByItem": {
          "i1": "related",
          "i2": "related",
          "i3": "other",
          "i4": "other"
        }
      }
    },
    {
      "id": "lo-opik-u19-q114",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: maavärin tähendab, et terve laam liigub pidevalt kilomeetreid sekundis.",
      "primaryObjectiveId": "lo-opik-u19-o7",
      "variantGroupId": "lo-opik-u19-g058",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamade üldine liikumine on aeglane, kuid maavärinaga kaasneb järsk kohalik nihkumine.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
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
      "id": "lo-opik-u19-q115",
      "unitId": "lo-opik-u19",
      "stem": "Mitu suurt laama on õpiku maailmakaardil nimetatud?",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g048",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku joonisel on nimetatud seitse suurt laama. See pole ammendav loend kõigist Maa laamadest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Seitse"
          },
          {
            "id": "i2",
            "text": "Kaks"
          },
          {
            "id": "i3",
            "text": "Kolm"
          },
          {
            "id": "i4",
            "text": "Kakskümmend viis"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q116",
      "unitId": "lo-opik-u19",
      "stem": "Millise ookeani järgi on üks suur laam nime saanud?",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g059",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üks suurematest laamadest kannab Vaikse ookeani nime.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vaikse ookeani"
          },
          {
            "id": "i2",
            "text": "Läänemere"
          },
          {
            "id": "i3",
            "text": "Peipsi järve"
          },
          {
            "id": "i4",
            "text": "Soome lahe"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q117",
      "unitId": "lo-opik-u19",
      "stem": "Milline suur laam on nimetatud Põhja-Ameerika järgi?",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g060",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku kaardil on märgitud Põhja-Ameerika laam.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Põhja-Ameerika laam"
          },
          {
            "id": "i2",
            "text": "Euraasia laam"
          },
          {
            "id": "i3",
            "text": "Aafrika laam"
          },
          {
            "id": "i4",
            "text": "Antarktika laam"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q118",
      "unitId": "lo-opik-u19",
      "stem": "Milline suur laam on nimetatud Lõuna-Ameerika järgi?",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g061",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab Lõuna-Ameerika laama.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Lõuna-Ameerika laam"
          },
          {
            "id": "i2",
            "text": "Vaikse ookeani laam"
          },
          {
            "id": "i3",
            "text": "Austraalia laam"
          },
          {
            "id": "i4",
            "text": "Euraasia laam"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q119",
      "unitId": "lo-opik-u19",
      "stem": "Milline laam hõlmab suurt osa Euraasia piirkonnast?",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g062",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku kaardil on Euraasia laam.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Euraasia laam"
          },
          {
            "id": "i2",
            "text": "Lõuna-Ameerika laam"
          },
          {
            "id": "i3",
            "text": "Antarktika laam"
          },
          {
            "id": "i4",
            "text": "Austraalia laam"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q120",
      "unitId": "lo-opik-u19",
      "stem": "Milline laam kannab Aafrika nime?",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g063",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku seitsme suure laama seas on Aafrika laam.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Aafrika laam"
          },
          {
            "id": "i2",
            "text": "Põhja-Ameerika laam"
          },
          {
            "id": "i3",
            "text": "Austraalia laam"
          },
          {
            "id": "i4",
            "text": "Vaikse ookeani laam"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q121",
      "unitId": "lo-opik-u19",
      "stem": "Milline suur laam on nimetatud Austraalia järgi?",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g064",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku loetelus on Austraalia laam.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Austraalia laam"
          },
          {
            "id": "i2",
            "text": "Euraasia laam"
          },
          {
            "id": "i3",
            "text": "Põhja-Ameerika laam"
          },
          {
            "id": "i4",
            "text": "Vaikse ookeani laam"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q122",
      "unitId": "lo-opik-u19",
      "stem": "Milline suur laam on nimetatud Antarktika järgi?",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g065",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku kaardil on ka Antarktika laam.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Antarktika laam"
          },
          {
            "id": "i2",
            "text": "Aafrika laam"
          },
          {
            "id": "i3",
            "text": "Euraasia laam"
          },
          {
            "id": "i4",
            "text": "Austraalia laam"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u19-q123",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: õpiku seitsme suure laama nimekiri hõlmab kõiki Maa laamasid.",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g048",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lisaks seitsmele õpikus nimetatud suurele laamale on palju väiksemaid laamasid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
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
      "id": "lo-opik-u19-q124",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta maailmaskeemil Vaikse ookeani laama ligikaudset asukohta.",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g059",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaikse ookeani laama ligikaudne asukoht on Vaikse ookeani piirkonnas, mitte mandrilise riigipiiri järgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-world",
        "correctRegionId": "pacific"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-world"
      }
    },
    {
      "id": "lo-opik-u19-q125",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta maailmaskeemil Euraasia laama tähist.",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g062",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku näites hõlmab Euraasia laam suurt osa Euraasia piirkonnast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-world",
        "correctRegionId": "eurasia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-world"
      }
    },
    {
      "id": "lo-opik-u19-q126",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta maailmaskeemil Aafrika laama tähist.",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g063",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aafrika laam paikneb suuresti Aafrika piirkonnas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-world",
        "correctRegionId": "africa"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-world"
      }
    },
    {
      "id": "lo-opik-u19-q127",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta maailmaskeemil Antarktika laama tähist.",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g065",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antarktika laam paikneb Maa lõunapoolseima mandri ümbruses.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-world",
        "correctRegionId": "antarctica"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-world"
      }
    },
    {
      "id": "lo-opik-u19-q128",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta maailmaskeemil Põhja-Ameerika laama tähist.",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g060",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhja-Ameerika laam paikneb suuresti Põhja-Ameerika piirkonnas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-world",
        "correctRegionId": "north-america"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-world"
      }
    },
    {
      "id": "lo-opik-u19-q129",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta maailmaskeemil Lõuna-Ameerika laama tähist.",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g061",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõuna-Ameerika laam paikneb suuresti Lõuna-Ameerika piirkonnas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-world",
        "correctRegionId": "south-america"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-world"
      }
    },
    {
      "id": "lo-opik-u19-q130",
      "unitId": "lo-opik-u19",
      "stem": "Puuduta maailmaskeemil Austraalia laama tähist.",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g064",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Austraalia laam paikneb Austraalia piirkonna ümber.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u19-plate-world",
        "correctRegionId": "australia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u19-plate-world"
      }
    },
    {
      "id": "lo-opik-u19-q131",
      "unitId": "lo-opik-u19",
      "stem": "Millised õpiku suure laama nimetused on õiged?",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g066",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab Vaikse ookeani, Euraasia ja Aafrika laama, kuid mitte Läänemere ega Soome lahe laama.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Vaikse ookeani laam"
          },
          {
            "id": "i2",
            "text": "Euraasia laam"
          },
          {
            "id": "i3",
            "text": "Aafrika laam"
          },
          {
            "id": "i4",
            "text": "Läänemere laam"
          },
          {
            "id": "i5",
            "text": "Soome lahe laam"
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2",
          "i3"
        ]
      }
    },
    {
      "id": "lo-opik-u19-q132",
      "unitId": "lo-opik-u19",
      "stem": "Ühenda suure laama nimi selle ligikaudse asukohapiirkonnaga.",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g067",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laama nimi annab sageli vihje ligikaudsele asukohale; tegelikud laamapiirid ei ole mandri piiridega identsed.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Antarktika laam"
          },
          {
            "id": "p2",
            "text": "Austraalia laam"
          },
          {
            "id": "p3",
            "text": "Vaikse ookeani laam"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Maa lõunapoolseima mandri ümbrus"
          },
          {
            "id": "c2",
            "text": "Austraalia piirkond"
          },
          {
            "id": "c3",
            "text": "Vaikse ookeani piirkond"
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
      "id": "lo-opik-u19-q133",
      "unitId": "lo-opik-u19",
      "stem": "Vali kaks eri suure laama nime, mis viitavad Ameerika piirkondadele.",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g068",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpikus on nimetatud nii Põhja-Ameerika kui ka Lõuna-Ameerika laam.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Põhja-Ameerika laam"
          },
          {
            "id": "i2",
            "text": "Lõuna-Ameerika laam"
          },
          {
            "id": "i3",
            "text": "Euraasia laam"
          },
          {
            "id": "i4",
            "text": "Antarktika laam"
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u19-q134",
      "unitId": "lo-opik-u19",
      "stem": "Õige või vale: laamade piirid kulgevad täpselt kõigi riigipiiride järgi.",
      "primaryObjectiveId": "lo-opik-u19-o8",
      "variantGroupId": "lo-opik-u19-g047",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamapiirid on geoloogilised piirid, mis ei järgi riigipiire.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "72"
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
    }
  ]
};
