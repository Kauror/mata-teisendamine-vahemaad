// Unit 12 — Kaart. Original textbook pages 50–53 reviewed against photographs.
// Keep separate from Units 10, 11 and 13; no map scale calculations (Unit 13).
// Optional supplemental information is separately attributed.
// Setting authoring status to ready does not publish anything to Kiur.

import type { Unit } from '@/lib/textbook/types';

export const unit12: Unit = {
  "id": "lo-opik-u12",
  "courseId": "loodusopetus-opik",
  "number": 12,
  "title": "Kaart",
  "pages": {
    "from": 50,
    "to": 53
  },
  "status": "ready",
  "contentVersion": "2026-10-17.1",
  "objectives": [
    {
      "id": "lo-opik-u12-o1",
      "description": "Oskan selgitada, mis on kaart ja mille poolest erineb see gloobusest.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ]
    },
    {
      "id": "lo-opik-u12-o2",
      "description": "Mõistan, miks kerakujulise Maa kujutamine tasasel kaardil tekitab moonutusi.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ]
    },
    {
      "id": "lo-opik-u12-o3",
      "description": "Tean, kes on kartograaf ja kuidas kaardi otstarve mõjutab selle sisu.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ]
    },
    {
      "id": "lo-opik-u12-o4",
      "description": "Tean, kuidas kogutakse kaardi jaoks andmeid mõõtmiste, aerofotode, satelliidifotode ja välitöödega.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ]
    },
    {
      "id": "lo-opik-u12-o5",
      "description": "Oskan võrrelda aerofotot ja kaarti ning selgitada, miks kaardil näidatakse valitud objekte.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "51–52"
        }
      ]
    },
    {
      "id": "lo-opik-u12-o6",
      "description": "Tean, mis on leppemärgid ja kaardi legend, ning oskan neid kasutada.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "52–53"
        },
        {
          "kind": "supplementary",
          "url": "https://geoportaal.maaamet.ee/est/abi-ja-juhised/xgis/kus-naen-leppemarkide-tahendusi/9/",
          "attribution": "Maa- ja Ruumiamet — leppemärgid ja legend"
        }
      ]
    },
    {
      "id": "lo-opik-u12-o7",
      "description": "Oskan tõlgendada näidiskaardi jõgede, parkide, hoonete ja teiste objektide kujutamisviise.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "52–53"
        }
      ]
    },
    {
      "id": "lo-opik-u12-o8",
      "description": "Oskan kaardi ja legendi abil leida vajaliku koha ning kasutada Tartu kesklinna kaardi näidet.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "52–53"
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u12-l1",
      "title": "Gloobusest kaardini",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u12-o1",
        "lo-opik-u12-o2"
      ],
      "sections": [
        {
          "id": "lo-opik-u12-l1-s1",
          "title": "Gloobus ja kaart",
          "blocks": [
            {
              "id": "lo-opik-u12-b001",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "text": [
                {
                  "text": "Gloobus",
                  "emphasis": "term"
                },
                {
                  "text": " kujutab kerakujulist Maad üsna täpselt. Kui aga tahame ühe maa, linna või mõne teise paiga kohta täpsemat teavet, on sageli mugavam kasutada "
                },
                {
                  "text": "kaarti",
                  "emphasis": "term"
                },
                {
                  "text": "."
                }
              ]
            },
            {
              "id": "lo-opik-u12-b002",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "term": "Kaart",
              "definition": "Maa vähendatud mudel tasapinnal."
            },
            {
              "id": "lo-opik-u12-b003",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "text": "Gloobus on kerakujuline mudel; kaart kujutab valitud ala tasasel pinnal, näiteks paberil või ekraanil. Mõlemad aitavad meil maailma tundma õppida."
            },
            {
              "id": "lo-opik-u12-b004",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "diagramId": "u12-globe-flatmap",
              "description": "Skeemil on kõrvuti kerakujuline gloobus ja tasane paberkaart; need on mudelid, mitte tegelikud kaardikujutised.",
              "caption": "Sama Maa, kaks erinevat kujutamisviisi. Näidisskeem."
            },
            {
              "id": "lo-opik-u12-b005",
              "type": "comparison",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "title": "Mis on neil ühist ja mis erinevat?",
              "columns": [
                {
                  "heading": "Gloobus",
                  "points": [
                    "Kerakujuline Maa mudel.",
                    "Näitab kogu maakera tervikuna.",
                    "Linna tänavad jäävad tavaliselt liiga väikeseks."
                  ]
                },
                {
                  "heading": "Kaart",
                  "points": [
                    "Tasapinnaline Maa mudel.",
                    "Võib näidata ühte linna või tervet maailma.",
                    "Mugav kaasa võtta või ekraanil uurida."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u12-l1-s2",
          "title": "Apelsinikoore katse",
          "blocks": [
            {
              "id": "lo-opik-u12-b006",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "text": "Kujuta ette, et apelsin on maakera ja selle koor on Maa pind. Kui püüad koore lauale täiesti siledalt laotada, pead seda kas lõikama, venitama või kokku suruma. Ilma lõhede ja muutusteta see ei õnnestu."
            },
            {
              "id": "lo-opik-u12-b007",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "diagramId": "u12-orange-peel",
              "caption": "Apelsini koor aitab mõista, miks kumerat pinda on raske tasapinnale viia. Näidisskeem."
            },
            {
              "id": "lo-opik-u12-b008",
              "type": "list",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "ordered": true,
              "items": [
                "Kujuta ette tervet ümmargust apelsini.",
                "Eemalda koor ja püüa see lauale laotada.",
                "Märka, kuhu tekivad lõhed, voldid või venitatud kohad.",
                "Mõtle: samasugune probleem tekib ka maakera tasaseks kaardiks kujutamisel."
              ]
            },
            {
              "id": "lo-opik-u12-b009",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "items": [
                "Kerakujulist pinda ei saa tasaseks muuta ilma lõigete või kuju muutumiseta.",
                "Seepärast ei saa kogu Maad kaardile moonutusteta kujutada."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u12-l1-s3",
          "title": "Miks kaart moonutab?",
          "blocks": [
            {
              "id": "lo-opik-u12-b010",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "text": [
                {
                  "text": "Moonutus",
                  "emphasis": "term"
                },
                {
                  "text": " tähendab, et kaardil ei ole mõne ala kuju, suurus või kaugus täpselt samasugune nagu Maal. Mõni piirkond näib väljavenitatud, teine kokkusurutud. See on seotud sellega, kuidas maakera kumer pind tasapinnal esitatakse."
                }
              ]
            },
            {
              "id": "lo-opik-u12-b011",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "text": "Suurt ala, näiteks tervet maailma, on keerulisem kujutada väikeste moonutustega kui väikest piirkonda, näiteks linnaosa. Just seetõttu on väikese maa-ala kaart kohalikuks orienteerumiseks tihti sobivam."
            },
            {
              "id": "lo-opik-u12-b012",
              "type": "paragraph",
              "text": "Maakera kumerat pinda saab tasasele kaardile üle kanda erineval viisil. Seetõttu võivad ka kaks maailmakaarti kujutada sama piirkonna suurust või kuju pisut erinevalt.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/faqs/how-are-different-map-projections-used",
                "attribution": "USGS — How are different map projections used?"
              }
            },
            {
              "id": "lo-opik-u12-b013",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "50"
              },
              "items": [
                "Kõik kogu maakera tasased kaardid sisaldavad mingisuguseid moonutusi.",
                "Kaardile ei saa korraga täiesti õigesti üle kanda kõiki Maa pindala, kuju, suuna ja kauguse omadusi."
              ]
            },
            {
              "id": "lo-opik-u12-b014",
              "type": "enrichment",
              "variant": "extra",
              "title": "Lisateadmine: moonutused eri kaartidel",
              "body": [
                "Õpikus näidatakse põhimõtet, et keskosa võib olla vähem moonutatud. See sõltub aga kaardiprojektsioonist: mõnel kaardil on kõige täpsem keskosa, mõnel teatud jooned või piirkonnad. Kaardi tegija valib meetodi vastavalt kaardi otstarbele."
              ],
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/faqs/how-are-different-map-projections-used",
                "attribution": "USGS — How are different map projections used?"
              }
            },
            {
              "id": "lo-opik-u12-b015",
              "type": "externalResource",
              "title": "Proovi apelsiniga kaardikatset",
              "intro": "National Geographicu õppematerjal näitab, miks kera kujutamine tasapinnal on keeruline.",
              "url": "https://education.nationalgeographic.org/resource/investigating-map-projections/",
              "publisher": "National Geographic Education",
              "resourceType": "article",
              "observe": "Mis juhtub apelsinikoorega, kui selle ümmargune pind tasaseks laotada?"
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u12-l2",
      "title": "Kuidas kaart valmib?",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u12-o3",
        "lo-opik-u12-o4"
      ],
      "sections": [
        {
          "id": "lo-opik-u12-l2-s1",
          "title": "Kes teeb kaarte?",
          "blocks": [
            {
              "id": "lo-opik-u12-b016",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "text": "Kaarte teevad kaardispetsialistid ehk kartograafid. Varem joonistati kaarte käsitsi, tänapäeval kasutatakse nende koostamiseks peamiselt arvuteid. Hea kaardi tegemine eeldab täpseid andmeid ja oskust neid selgelt esitada."
            },
            {
              "id": "lo-opik-u12-b017",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "term": "Kartograaf",
              "definition": "Kaardispetsialist, kes koostab ja kujundab kaarte."
            },
            {
              "id": "lo-opik-u12-b018",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "text": "Kõigepealt tuleb otsustada, milleks kaarti vaja on. Alles siis saab valida, mida sellele kanda. Mõnel kaardil on tähtsad teed ja majad, mõnel metsad või veekogud."
            },
            {
              "id": "lo-opik-u12-b019",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "items": [
                "Kaardi otstarve määrab, milliseid objekte ja andmeid kaardil näidatakse.",
                "Kaart peab näitama vajalikku teavet selgelt, mitte kõike korraga."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u12-l2-s2",
          "title": "Kaardi tegemise sammud",
          "blocks": [
            {
              "id": "lo-opik-u12-b020",
              "type": "list",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "ordered": true,
              "items": [
                "Otsusta, milleks kaarti kasutatakse.",
                "Vali, milliseid kohti, nähtusi või objekte on vaja näidata.",
                "Kogu andmed: mõõda, uuri fotosid ja kasuta muid usaldusväärseid allikaid.",
                "Joonista vajalikud objektid kaardile sobivate märkide ja värvidega.",
                "Kontrolli andmeid ja vajaduse korral täienda kaarti."
              ]
            },
            {
              "id": "lo-opik-u12-b021",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "text": "Maastikku võimalikult täpselt kujutades mõõdetakse maju, teid ja muid objekte ning kantakse need kaardile või plaanile. Selline töö võib võtta palju aega."
            },
            {
              "id": "lo-opik-u12-b022",
              "type": "enrichment",
              "variant": "fun_fact",
              "title": "Huvitav fakt",
              "body": [
                "Kaardi koostamisel võib vaja minna mitme eriala inimeste abi. Näiteks aitab loodust tundev inimene ära tunda veekogusid ja metsi, teede asjatundja aga liiklusteid."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u12-l2-s3",
          "title": "Aerofoto ja satelliidifoto",
          "blocks": [
            {
              "id": "lo-opik-u12-b023",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "text": "Suuremate alade kaardistamiseks kasutatakse sageli fotosid. Aerofoto on õhust, tavaliselt lennukilt, tehtud pilt maa- ja veepinnast. Satelliidifoto on kosmoses liikuvalt satelliidilt tehtud pilt."
            },
            {
              "id": "lo-opik-u12-b024",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "term": "Aerofoto",
              "definition": "Õhust, näiteks lennukilt, tehtud foto maa- ja veepinnast."
            },
            {
              "id": "lo-opik-u12-b025",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "term": "Satelliidifoto",
              "definition": "Kosmoses asuvalt satelliidilt tehtud pilt Maa pinnast."
            },
            {
              "id": "lo-opik-u12-b026",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "caption": "Kust foto pärineb?",
              "headers": [
                "Foto liik",
                "Kust see tehakse?",
                "Mida selle abil uuritakse?"
              ],
              "rows": [
                [
                  "Aerofoto",
                  "Õhust, näiteks lennukilt",
                  "Teid, maju ja maastikku"
                ],
                [
                  "Satelliidifoto",
                  "Kosmosest satelliidilt",
                  "Suuremaid maa-alasid ja maastikku"
                ]
              ]
            },
            {
              "id": "lo-opik-u12-b027",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "diagramId": "u12-aerial-vs-map",
              "caption": "Sama väljamõeldud piirkond kujutatud esmalt aerofoto moodi pildina ja seejärel lihtsustatud kaardina. Mõlemad on joonistatud näited, mitte päris aerofotod."
            }
          ]
        },
        {
          "id": "lo-opik-u12-l2-s4",
          "title": "Mõõtmine ja välitööd",
          "blocks": [
            {
              "id": "lo-opik-u12-b028",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "text": "Fotodelt võib näha jõge, metsa, hoonete katuseid ja teid. Kuid kõik oluline ei ole nende pealt nähtav. Näiteks ei selgu üksnes katusest, kas hoones asub muuseum või raamatukogu."
            },
            {
              "id": "lo-opik-u12-b029",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "text": "Seetõttu kogutakse vajaduse korral lisateavet välitöödel: minnakse kohale, vaadeldakse, mõõdetakse ja kontrollitakse, mis kohas tegelikult asub."
            },
            {
              "id": "lo-opik-u12-b030",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "51"
              },
              "items": [
                "Fotosid kasutatakse kaardi koostamisel, kuid neist alati ei piisa.",
                "Välitöödel saab täiendada ja kontrollida fotodelt saadud andmeid."
              ]
            },
            {
              "id": "lo-opik-u12-b031",
              "type": "externalResource",
              "title": "Kuidas Eestis ortofotosid tehakse?",
              "intro": "Maa- ja Ruumiamet näitab, kuidas lennukifotodest valmivad kaardistamiseks kasutatavad ortofotod.",
              "url": "https://maaruum.ee/blogi/kuidas-valmivad-ortofotod",
              "publisher": "Maa- ja Ruumiamet",
              "resourceType": "article",
              "observe": "Milliseid objekte saab õhust näha? Mida võib olla siiski vaja kohapeal kontrollida?"
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u12-l3",
      "title": "Leppemärgid, legend ja värvid",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u12-o5",
        "lo-opik-u12-o6",
        "lo-opik-u12-o7"
      ],
      "sections": [
        {
          "id": "lo-opik-u12-l3-s1",
          "title": "Mille poolest erineb aerofoto kaardist?",
          "blocks": [
            {
              "id": "lo-opik-u12-b032",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "text": "Aerofoto võib anda maapinnast täpse ja väga kirju ülevaate: näha on katuseid, puid, teid ja varjusid. Kuid kõiki kohti ei ole sealt lihtne ära tunda."
            },
            {
              "id": "lo-opik-u12-b033",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "text": "Kaardile kantakse kõige olulisemad nähtused ja objektid. Üksikud detailid asendatakse kokkulepitud märkide ja selgete värvidega. Nii on lihtsam üles leida näiteks jõgi, sild, bussipeatus või muuseum."
            },
            {
              "id": "lo-opik-u12-b034",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "diagramId": "u12-aerial-vs-map",
              "caption": "Võrdle kahe kujutise selgust: näidiskaart lihtsustab sama piirkonna objekte. See ei ole Tartu tegelik aerofoto ega Tartu ametlik kaart."
            },
            {
              "id": "lo-opik-u12-b035",
              "type": "comparison",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "title": "Aerofoto või kaart?",
              "columns": [
                {
                  "heading": "Aerofoto",
                  "points": [
                    "Näitab pildistamise hetkel nähtavat maastikku.",
                    "Näha on ka väikesi detaile ja varjusid.",
                    "Hoone otstarvet ei saa alati teada."
                  ]
                },
                {
                  "heading": "Kaart",
                  "points": [
                    "Näitab valitud objekte ja teavet.",
                    "Kasutab leppemärke ja värve.",
                    "Võib näidata asutuste nimetusi või liike."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u12-l3-s2",
          "title": "Mis on leppemärgid?",
          "blocks": [
            {
              "id": "lo-opik-u12-b036",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "term": "Leppemärgid",
              "definition": "Kaardil kasutatavad märgid objektide või nähtuste kujutamiseks."
            },
            {
              "id": "lo-opik-u12-b037",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "text": "Leppemärk võib olla näiteks väike sümbol muuseumi kohal, joon jõe kujutamiseks või värv pargi näitamiseks. Kaardi kasutaja peab teadma, mida need märgid tähendavad."
            },
            {
              "id": "lo-opik-u12-b038",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "diagramId": "u12-legend-town",
              "caption": "Väljamõeldud näidislinn ja selle leppemärgid. Värvid ja sümbolid on selle näidiskaardi omad."
            },
            {
              "id": "lo-opik-u12-b039",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "items": [
                "Leppemärgid muudavad kaardi selgemaks.",
                "Kõigil kaartidel ei pea olema täpselt samad sümbolid."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u12-l3-s3",
          "title": "Mis on kaardi legend?",
          "blocks": [
            {
              "id": "lo-opik-u12-b040",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "term": "Kaardi legend",
              "definition": "Kaardi leppemärkide seletus."
            },
            {
              "id": "lo-opik-u12-b041",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "text": "Kui sa ei tea, mida väike märk tähistab, vaata kaardi legendi. Legendist saad teada, millise märgiga tähistatakse näiteks muuseumi, teatrit, raamatukogu või silda."
            },
            {
              "id": "lo-opik-u12-b042",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "caption": "Õpiku Tartu kesklinna kaardi legendi objektide liigid",
              "headers": [
                "Koha või objekti liik",
                "Kuidas see võib kaardil olla kujutatud?"
              ],
              "rows": [
                [
                  "Muuseum",
                  "Eraldi muuseumimärgiga"
                ],
                [
                  "Teater",
                  "Eraldi teatrimärgiga"
                ],
                [
                  "Kino",
                  "Eraldi kinomärgiga"
                ],
                [
                  "Raamatukogu",
                  "Eraldi raamatukogumärgiga"
                ],
                [
                  "Sild",
                  "Sillamärgiga"
                ],
                [
                  "Järsak",
                  "Erilise joone või leppemärgiga"
                ],
                [
                  "Jõgi",
                  "Veekogu värvi ja kujuga"
                ],
                [
                  "Park",
                  "Värvitud ala"
                ],
                [
                  "Hoone",
                  "Hoone kujuga ala"
                ]
              ]
            },
            {
              "id": "lo-opik-u12-b043",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "items": [
                "Legendi abil saad teada, mida kaardil kasutatud märgid tähendavad.",
                "Kui kaardil on tundmatu märk, otsi selle seletus kõigepealt legendist."
              ]
            },
            {
              "id": "lo-opik-u12-b044",
              "type": "externalResource",
              "title": "Kust leida Eesti kaartide leppemärke?",
              "intro": "Maa- ja Ruumiameti eestikeelne juhend näitab, kust kaardirakenduse legendi avada.",
              "url": "https://geoportaal.maaamet.ee/est/abi-ja-juhised/xgis/kus-naen-leppemarkide-tahendusi/9/",
              "publisher": "Maa- ja Ruumiamet",
              "resourceType": "article",
              "observe": "Leia kaardirakenduses leppemärkide seletus ja võrdle seda õpiku legendiga."
            }
          ]
        },
        {
          "id": "lo-opik-u12-l3-s4",
          "title": "Mida värvid kaardil tähendavad?",
          "blocks": [
            {
              "id": "lo-opik-u12-b045",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "text": "Kaardil on värvidel kokkulepitud tähendus. Õpiku Tartu kesklinna kaardil on jõgi sinakas, pargid rohelised ja hooned hallikad. Erinevad leppemärgid näitavad näiteks muuseume ja sildu."
            },
            {
              "id": "lo-opik-u12-b046",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "caption": "Õpiku ja meie näidiskaardi värvide näited",
              "headers": [
                "Näide",
                "Värv või märk",
                "Mida see tähistab?"
              ],
              "rows": [
                [
                  "Jõgi",
                  "Sinine",
                  "Veeala"
                ],
                [
                  "Park",
                  "Roheline",
                  "Haljasala"
                ],
                [
                  "Hoone",
                  "Hall",
                  "Hoonete asukohad"
                ],
                [
                  "Muuseum",
                  "Muuseumimärk",
                  "Muuseumi asukoht"
                ]
              ]
            },
            {
              "id": "lo-opik-u12-b047",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "text": "Värve ja leppemärke tuleb tõlgendada konkreetse kaardi legendi järgi: eri liiki kaartidel võivad need tähistada erinevaid nähtusi."
            },
            {
              "id": "lo-opik-u12-b048",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "diagramId": "u12-legend-town",
              "caption": "Leia näidiskaardil jõgi, park, hooned, sild ja legend. Märgid on mõeldud harjutamiseks."
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u12-l4",
      "title": "Loeme Tartu kesklinna kaarti",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u12-o6",
        "lo-opik-u12-o7",
        "lo-opik-u12-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u12-l4-s1",
          "title": "Tartu kesklinn õpiku kaardil",
          "blocks": [
            {
              "id": "lo-opik-u12-b049",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "text": "Õpikus võrreldakse Tartu kesklinna aerofotot ja kaarti. Aerofotol on näha hoonete katuseid, tänavaid, puid ja Emajõge. Kaardil on need lihtsustatud, lisaks on sinna kantud kohanimesid ja asutuste leppemärke."
            },
            {
              "id": "lo-opik-u12-b050",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "text": "Kaardi abil saab otsida Tartu Mänguasjamuuseumi, Tartu Ülikooli peahoonet, Linnaraamatukogu, Raekoda, Emajõge ja Kaarisilda. Õpikus on näha ka Toomemägi, Toomkiriku varemed, Inglisild ja Kuradisild."
            },
            {
              "id": "lo-opik-u12-b051",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "items": [
                "Kaardil olev nimi või leppemärk aitab ära tunda koha, mida aerofotol ei pruugi olla võimalik kindlaks teha.",
                "Kohanimed ja märgid on kaardil loetavad, aga aerofoto näitab rohkem väljanägemist."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u12-l4-s2",
          "title": "Õpiku Tartu kaardi leppemärgid",
          "blocks": [
            {
              "id": "lo-opik-u12-b052",
              "type": "table",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "caption": "Näited õpiku Tartu kesklinna kaardilt",
              "headers": [
                "Kaardil nimetatud koht",
                "Objekti liik"
              ],
              "rows": [
                [
                  "Tartu Mänguasjamuuseum",
                  "muuseum"
                ],
                [
                  "Teatri Kodu",
                  "teater"
                ],
                [
                  "Elektriteater",
                  "kino"
                ],
                [
                  "Linnaraamatukogu",
                  "raamatukogu"
                ],
                [
                  "Kaarisild",
                  "sild"
                ],
                [
                  "Emajõgi",
                  "jõgi"
                ],
                [
                  "Toomemägi",
                  "park / haljasala"
                ],
                [
                  "Tartu Ülikooli peahoone",
                  "hoone"
                ]
              ]
            },
            {
              "id": "lo-opik-u12-b053",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "text": "Kui otsid muuseumi, vaata legendist muuseumimärki ja seejärel otsi seda kaardilt. Kui otsid jõge, uuri veekogu kujutist. Kui tahad leida silda, kasuta sillamärki ja jõe asukohta."
            },
            {
              "id": "lo-opik-u12-b054",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "items": [
                "Enne leppemärkide otsimist loe legendi.",
                "Kohanimed aitavad leppemärkidest täpse koha üles leida."
              ]
            },
            {
              "id": "lo-opik-u12-b055",
              "type": "externalResource",
              "title": "Vaata Tartut päris kaardil ja ortofotol",
              "intro": "Maa- ja Ruumiameti Maainfo kaardirakenduses saab otsida Tartut ning vahetada aluskaardi kaardilt ortofotole. See on lisamaterjal, mitte testi osa.",
              "url": "https://xgis.maaamet.ee/xgis2/page/app/maainfo",
              "publisher": "Maa- ja Ruumiamet",
              "resourceType": "interactive",
              "observe": "Otsi Tartu kesklinn ja Emajõgi. Võrdle kaardi leppemärke ortofoto katuste, teede ja puude pildiga."
            }
          ]
        },
        {
          "id": "lo-opik-u12-l4-s3",
          "title": "Harjutame kaardi kasutamist",
          "blocks": [
            {
              "id": "lo-opik-u12-b056",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "52"
              },
              "text": "Vaatame väljamõeldud näidiskaarti. Sellel on jõgi, sild, park, mõned hooned ja muuseumimärk. Värvid ja sümbolid on valitud nii, et saad harjutada õpikus õpitud kaardi lugemist."
            },
            {
              "id": "lo-opik-u12-b057",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "diagramId": "u12-legend-town",
              "caption": "Harjutuskaart ei ole Tartu kesklinna täpne kujutis. Siin õpime märke ja legendi lugema."
            },
            {
              "id": "lo-opik-u12-b058",
              "type": "list",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "items": [
                "Kui otsid muuseumi, leia kaardilt selle leppemärk.",
                "Kui otsid silda, vaata, kus tee ületab jõge.",
                "Kui leppemärk on arusaamatu, vaata legendi.",
                "Aerofotol otsi nähtavat välimust, kaardil aga nimetusi ja kokkulepitud märke."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u12-l4-s4",
          "title": "Mõisted ja meelespea",
          "blocks": [
            {
              "id": "lo-opik-u12-b059",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "term": "Kaart",
              "definition": "Maa vähendatud mudel tasapinnal."
            },
            {
              "id": "lo-opik-u12-b060",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "term": "Leppemärgid",
              "definition": "Kaardil kasutatavad märgid objektide kujutamiseks."
            },
            {
              "id": "lo-opik-u12-b061",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "term": "Kaardi legend",
              "definition": "Kaardi leppemärkide seletus."
            },
            {
              "id": "lo-opik-u12-b062",
              "type": "keyFact",
              "source": {
                "kind": "textbook",
                "pages": "53"
              },
              "title": "MA TEAN, ET…",
              "items": [
                "Kerakujulist Maad on tasapinnal keeruline kujutada.",
                "Kaarte teevad kartograafid.",
                "Kaart näitab olulisi objekte leppemärkide ja värvide abil.",
                "Kaardi legend selgitab, mida leppemärgid tähendavad."
              ]
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u12-q001",
      "unitId": "lo-opik-u12",
      "stem": "Mis on kaart?",
      "primaryObjectiveId": "lo-opik-u12-o1",
      "variantGroupId": "lo-opik-u12-g01",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaart on Maa vähendatud mudel tasapinnal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Maa vähendatud mudel tasapinnal."
          },
          {
            "id": "b",
            "text": "Maa suurune kera."
          },
          {
            "id": "c",
            "text": "Ainult kosmosest tehtud foto."
          },
          {
            "id": "d",
            "text": "Maa pöörlemistelg."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u12-q002",
      "unitId": "lo-opik-u12",
      "stem": "Millise kujuga on gloobus?",
      "primaryObjectiveId": "lo-opik-u12-o1",
      "variantGroupId": "lo-opik-u12-g02",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus on Maa kerakujuline mudel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Tasane nagu paberileht."
          },
          {
            "id": "b",
            "text": "Kerakujuline."
          },
          {
            "id": "c",
            "text": "Alati kuubikujuline."
          },
          {
            "id": "d",
            "text": "Kolmnurkne."
          }
        ],
        "correctOptionId": "b"
      }
    },
    {
      "id": "lo-opik-u12-q003",
      "unitId": "lo-opik-u12",
      "stem": "Millisele pinnale kujutatakse tavaline paberkaart?",
      "primaryObjectiveId": "lo-opik-u12-o1",
      "variantGroupId": "lo-opik-u12-g01",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Paberkaart on tasane; gloobus on kerakujuline.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "Kumerale kerapinnale."
          },
          {
            "id": "t",
            "text": "Tasapinnale."
          },
          {
            "id": "l",
            "text": "Ainult veepinnale."
          },
          {
            "id": "s",
            "text": "Läbipaistvale pallile."
          }
        ],
        "correctOptionId": "t"
      }
    },
    {
      "id": "lo-opik-u12-q004",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta joonisel gloobust.",
      "primaryObjectiveId": "lo-opik-u12-o1",
      "variantGroupId": "lo-opik-u12-g04",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus on joonisel ümmargune mudel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-globe-flatmap",
        "correctRegionId": "globe"
      }
    },
    {
      "id": "lo-opik-u12-q005",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta joonisel tasast kaarti.",
      "primaryObjectiveId": "lo-opik-u12-o1",
      "variantGroupId": "lo-opik-u12-g04",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tasane kaart on joonisel gloobuse kõrval.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-globe-flatmap",
        "correctRegionId": "flat-map"
      }
    },
    {
      "id": "lo-opik-u12-q006",
      "unitId": "lo-opik-u12",
      "stem": "Mis on gloobusel ja kaardil ühist?",
      "primaryObjectiveId": "lo-opik-u12-o1",
      "variantGroupId": "lo-opik-u12-g05",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus ja kaart aitavad mõlemad kujutada tegelikku Maad väiksemalt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Mõlemal on alati näha kõik tänavad."
          },
          {
            "id": "b",
            "text": "Mõlemad on vähendatud Maa mudelid."
          },
          {
            "id": "c",
            "text": "Mõlemad on kerakujulised."
          },
          {
            "id": "d",
            "text": "Mõlemal puuduvad kujutatud veekogud."
          }
        ],
        "correctOptionId": "b"
      }
    },
    {
      "id": "lo-opik-u12-q007",
      "unitId": "lo-opik-u12",
      "stem": "Miks on linna tänavate leidmiseks enamasti parem kaart kui gloobus?",
      "primaryObjectiveId": "lo-opik-u12-o1",
      "variantGroupId": "lo-opik-u12-g06",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Linna kaardil saab näidata tänavaid ja hooneid; gloobusel on need liiga väikesed.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaart saab kujutada väikest ala suurema üksikasjalikkusega."
          },
          {
            "id": "b",
            "text": "Gloobusel pole ühtegi riiki."
          },
          {
            "id": "c",
            "text": "Kaart kujutab alati kogu maailma."
          },
          {
            "id": "d",
            "text": "Gloobus näitab ainult meresid."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u12-q008",
      "unitId": "lo-opik-u12",
      "stem": "Rühmita kirjeldused gloobuse või kaardi juurde.",
      "primaryObjectiveId": "lo-opik-u12-o1",
      "variantGroupId": "lo-opik-u12-g07",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus on kera; kaart on tasane ja võib kujutada valitud ala detailselt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "g",
            "text": "Gloobus"
          },
          {
            "id": "k",
            "text": "Kaart"
          }
        ],
        "items": [
          {
            "id": "i0",
            "text": "kerakujuline mudel"
          },
          {
            "id": "i1",
            "text": "tasane paberileht"
          },
          {
            "id": "i2",
            "text": "kogu Maa nähtav ühe mudelina"
          },
          {
            "id": "i3",
            "text": "linna tänavaid saab detailselt kujutada"
          }
        ],
        "correctGroupByItem": {
          "i0": "g",
          "i1": "k",
          "i2": "g",
          "i3": "k"
        }
      }
    },
    {
      "id": "lo-opik-u12-q009",
      "unitId": "lo-opik-u12",
      "stem": "Sõber tahab võõras linnas bussipeatuse üles leida. Mis teda kõige rohkem aitab?",
      "primaryObjectiveId": "lo-opik-u12-o1",
      "variantGroupId": "lo-opik-u12-g06",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Bussipeatuse leidmiseks on vaja kohaliku piirkonna üksikasjalikku kaarti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Linna tänavakaart."
          },
          {
            "id": "b",
            "text": "Gloobus, millel on ainult mandrid."
          },
          {
            "id": "c",
            "text": "Maa kuju kujutav joonis."
          },
          {
            "id": "d",
            "text": "Foto tervest planeedist."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u12-q010",
      "unitId": "lo-opik-u12",
      "stem": "Milline mudel sobib paremini kogu Maa kui kera kuju näitamiseks?",
      "primaryObjectiveId": "lo-opik-u12-o1",
      "variantGroupId": "lo-opik-u12-g09",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus järgib Maa kerakujulist pinda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "g",
            "text": "Gloobus."
          },
          {
            "id": "l",
            "text": "Ainult ühe linna tänavaplaan."
          },
          {
            "id": "r",
            "text": "Raamatukogu korruseplaan."
          },
          {
            "id": "p",
            "text": "Pargi joonis."
          }
        ],
        "correctOptionId": "g"
      }
    },
    {
      "id": "lo-opik-u12-q011",
      "unitId": "lo-opik-u12",
      "stem": "Ühenda olukord kõige sobivama kujutisega.",
      "primaryObjectiveId": "lo-opik-u12-o1",
      "variantGroupId": "lo-opik-u12-g09",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gloobus sobib Maa terviku kujutamiseks; linnakaart ja plaan väikese ala vaatamiseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p0",
            "text": "Näidata, kuidas mandrid paiknevad keral."
          },
          {
            "id": "p1",
            "text": "Leida muuseumi tee Tartu kesklinnas."
          },
          {
            "id": "p2",
            "text": "Vaadata väikese pargi kõnniteid."
          }
        ],
        "choices": [
          {
            "id": "c0",
            "text": "gloobus"
          },
          {
            "id": "c1",
            "text": "linnakaart"
          },
          {
            "id": "c2",
            "text": "pargiplaan"
          }
        ],
        "correctPairs": {
          "p0": "c0",
          "p1": "c1",
          "p2": "c2"
        }
      }
    },
    {
      "id": "lo-opik-u12-q012",
      "unitId": "lo-opik-u12",
      "stem": "Mis tekib, kui kerakujulist Maad kujutatakse tasase kaardina?",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g11",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kumerat Maa pinda ei saa kogu ulatuses tasapinnal moonutusteta kujutada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "m",
            "text": "Mõningad moonutused."
          },
          {
            "id": "e",
            "text": "Täiesti muutumatu Maa pind."
          },
          {
            "id": "p",
            "text": "Päris mäed kaardipaberil."
          },
          {
            "id": "k",
            "text": "Kohustuslikud lõhed igal trükitud kaardil."
          }
        ],
        "correctOptionId": "m"
      }
    },
    {
      "id": "lo-opik-u12-q013",
      "unitId": "lo-opik-u12",
      "stem": "Mida tähendab kaardil moonutus?",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g12",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Moonutus muudab mõne piirkonna kujutatud kuju, suurust või teisi omadusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Mõni kuju või suurus on kaardil tegelikust erinev."
          },
          {
            "id": "b",
            "text": "Kaardil on kirjutatud riigi nimi."
          },
          {
            "id": "c",
            "text": "Kaardil kasutatakse leppemärki."
          },
          {
            "id": "d",
            "text": "Gloobus pöörleb ümber telje."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u12-q014",
      "unitId": "lo-opik-u12",
      "stem": "Miks kasutatakse õpikus kaardi selgitamiseks apelsini?",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g13",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Apelsin aitab ette kujutada kumerat pinda, mida püütakse tasaseks laotada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "Selle koor on kumer nagu Maa pind."
          },
          {
            "id": "o",
            "text": "Selle värv on alati sama mis maailmakaardil."
          },
          {
            "id": "n",
            "text": "Selle sees on riigipiirid."
          },
          {
            "id": "s",
            "text": "Sellel on tänavad."
          }
        ],
        "correctOptionId": "k"
      }
    },
    {
      "id": "lo-opik-u12-q015",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta joonisel tervet kerakujulist apelsini.",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g13",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Terve apelsin on joonisel kumer ja ümmargune.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-orange-peel",
        "correctRegionId": "orange"
      }
    },
    {
      "id": "lo-opik-u12-q016",
      "unitId": "lo-opik-u12",
      "stem": "Miks ei saa apelsinikoort ühe sileda katkematu lehena lauale laotada?",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g15",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kumera pinna tasaseks muutmisel peab seda lõikama, venitama või kokku suruma.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "Koor on olnud kumeral pinnal, mis ei muutu tasaseks lõhede või muutusteta."
          },
          {
            "id": "m",
            "text": "Apelsinikoor on alati metallist."
          },
          {
            "id": "n",
            "text": "Laua pind on liiga väike kõigi apelsinide jaoks."
          },
          {
            "id": "v",
            "text": "Apelsinil ei ole koort."
          }
        ],
        "correctOptionId": "k"
      }
    },
    {
      "id": "lo-opik-u12-q017",
      "unitId": "lo-opik-u12",
      "stem": "Vali kaks võimalikku moonutust tasasel maailmakaardil.",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g16",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tasane maailmakaart võib moonutada piirkondade kuju ja suurust; Maa ise ei muutu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "suur",
            "text": "Mõne ala kujutatud suurus erineb tegelikust."
          },
          {
            "id": "kuju",
            "text": "Mõne ala kujutatud kuju erineb tegelikust."
          },
          {
            "id": "telg",
            "text": "Maa kujuteldav telg muutub päriselt."
          },
          {
            "id": "meri",
            "text": "Mered kaovad tegelikust maailmast."
          }
        ],
        "correctOptionIds": [
          "suur",
          "kuju"
        ]
      }
    },
    {
      "id": "lo-opik-u12-q018",
      "unitId": "lo-opik-u12",
      "stem": "Millise kaardi puhul on kumerusest põhjustatud moonutusi tavaliselt lihtsam väikesena hoida?",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g17",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Väiksemat ala saab sobiva projektsiooni korral kujutada väiksemate moonutustega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "v",
            "text": "Ühe väikese linnaosa kaart."
          },
          {
            "id": "m",
            "text": "Kogu Maa üks suur tasane kaart."
          },
          {
            "id": "o",
            "text": "Terve maailma kaart, millel on kõik mered."
          },
          {
            "id": "k",
            "text": "Kõigi mandrite kaart ühel lehel."
          }
        ],
        "correctOptionId": "v"
      }
    },
    {
      "id": "lo-opik-u12-q019",
      "unitId": "lo-opik-u12",
      "stem": "Järjesta apelsinikoore katse sammud.",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g18",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõigepealt on apelsin ümmargune, siis kooritakse see ja proovitakse koort tasapinnale laotada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i0",
            "text": "Vaata tervet ümmargust apelsini."
          },
          {
            "id": "i1",
            "text": "Eemalda sellelt koor."
          },
          {
            "id": "i2",
            "text": "Proovi koort tasasel laual laiali laotada."
          },
          {
            "id": "i3",
            "text": "Märka tekkinud lõhesid või volte."
          }
        ],
        "correctOrder": [
          "i0",
          "i1",
          "i2",
          "i3"
        ]
      }
    },
    {
      "id": "lo-opik-u12-q020",
      "unitId": "lo-opik-u12",
      "stem": "Apelsinikoor kipub lauale asetades kortsu minema. Mida see aitab Maa kaardi kohta mõista?",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g15",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Koor näitab, miks kera pind ei kandu tasapinnale ilma muutusteta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "Kumerat pinda tuleb tasasel kujutisel mingil viisil muuta."
          },
          {
            "id": "g",
            "text": "Gloobus peab alati olema kortsus."
          },
          {
            "id": "p",
            "text": "Kõik kaardid tuleb teha apelsinikoorest."
          },
          {
            "id": "e",
            "text": "Kaardil ei tohi kunagi veekogusid kujutada."
          }
        ],
        "correctOptionId": "k"
      }
    },
    {
      "id": "lo-opik-u12-q021",
      "unitId": "lo-opik-u12",
      "stem": "Kaks maailmakaarti näitavad sama mandrit veidi erineva kujuga. Mis on sobiv seletus?",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g20",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eri kaardiprojektsioonid võivad kujutada sama piirkonna kuju erinevalt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "v",
            "text": "Need võivad kasutada erinevaid Maa pinna tasapinnale kujutamise viise."
          },
          {
            "id": "e",
            "text": "Mandri tegelik kuju muutub alati iga päev."
          },
          {
            "id": "j",
            "text": "Ühel kaardil on Maa kindlasti lapik."
          },
          {
            "id": "n",
            "text": "Kaartidel ei tohi mandreid kujutada."
          }
        ],
        "correctOptionId": "v"
      }
    },
    {
      "id": "lo-opik-u12-q022",
      "unitId": "lo-opik-u12",
      "stem": "Milline väide kirjeldab apelsinikatse tulemust kõige täpsemalt?",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g15",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Apelsinikoore katse illustreerib kumeruse ja tasapinna erinevust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kumerat koort ei saa täiesti sileda tervikuna laiali laotada."
          },
          {
            "id": "b",
            "text": "Koor jääb alati laual täpselt kerakujuliseks."
          },
          {
            "id": "c",
            "text": "Laiali laotamisel muutub apelsin suuremaks planeediks."
          },
          {
            "id": "d",
            "text": "Koor kaob, kui selle tasaseks vajutad."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u12-q023",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta joonisel laiali laotatud koore tükke.",
      "primaryObjectiveId": "lo-opik-u12-o2",
      "variantGroupId": "lo-opik-u12-g22",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Joonisel on kumerast apelsinist saadud kooretükid tasasele pinnale asetatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "50"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-orange-peel",
        "correctRegionId": "peel-pieces"
      }
    },
    {
      "id": "lo-opik-u12-q024",
      "unitId": "lo-opik-u12",
      "stem": "Kuidas nimetatakse kaardispetsialisti?",
      "primaryObjectiveId": "lo-opik-u12-o3",
      "variantGroupId": "lo-opik-u12-g23",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kartograaf on kaarte koostav ja kujundav spetsialist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "Kartograaf."
          },
          {
            "id": "g",
            "text": "Geoloog."
          },
          {
            "id": "a",
            "text": "Arheoloog."
          },
          {
            "id": "m",
            "text": "Meteoroloog."
          }
        ],
        "correctOptionId": "k"
      }
    },
    {
      "id": "lo-opik-u12-q025",
      "unitId": "lo-opik-u12",
      "stem": "Millega tehti kaarte enamasti vanasti?",
      "primaryObjectiveId": "lo-opik-u12-o3",
      "variantGroupId": "lo-opik-u12-g24",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik kirjeldab, et varem joonistati kaarte käsitsi, tänapäeval peamiselt arvutiga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "Käsitsi."
          },
          {
            "id": "a",
            "text": "Arvutimudeliga."
          },
          {
            "id": "s",
            "text": "Ainult satelliidiga."
          },
          {
            "id": "r",
            "text": "Robotprinteriga."
          }
        ],
        "correctOptionId": "k"
      }
    },
    {
      "id": "lo-opik-u12-q026",
      "unitId": "lo-opik-u12",
      "stem": "Millega tehakse tänapäeval enamik kaarte?",
      "primaryObjectiveId": "lo-opik-u12-o3",
      "variantGroupId": "lo-opik-u12-g25",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tänapäeval kasutatakse kaartide koostamiseks arvuteid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Arvutite abil."
          },
          {
            "id": "p",
            "text": "Ainult kriidiga tahvlile."
          },
          {
            "id": "k",
            "text": "Ainult käärides paberit."
          },
          {
            "id": "e",
            "text": "Ainult käsitsi puutüvele."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u12-q027",
      "unitId": "lo-opik-u12",
      "stem": "Millise küsimuse esitab kartograaf enne andmete kogumist?",
      "primaryObjectiveId": "lo-opik-u12-o3",
      "variantGroupId": "lo-opik-u12-g26",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Enne kaardi koostamist tuleb teada kaardi otstarvet, et valida vajalik teave.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "m",
            "text": "Milleks kaarti vaja on?"
          },
          {
            "id": "v",
            "text": "Mis värvi paber on kõige kallim?"
          },
          {
            "id": "l",
            "text": "Kas kaardil peab olema iga puuleht?"
          },
          {
            "id": "e",
            "text": "Kas foto on alati ilus?"
          }
        ],
        "correctOptionId": "m"
      }
    },
    {
      "id": "lo-opik-u12-q028",
      "unitId": "lo-opik-u12",
      "stem": "Miks ei kanta kaardile kõiki olemasolevaid andmeid?",
      "primaryObjectiveId": "lo-opik-u12-o3",
      "variantGroupId": "lo-opik-u12-g27",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardile valitakse otstarbega sobivad objektid; liiga palju teavet teeb kaardi segaseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kaart peab olema oma otstarbeks selge ja loetav."
          },
          {
            "id": "b",
            "text": "Maailmas ei ole ühtegi objekti."
          },
          {
            "id": "c",
            "text": "Kartograaf ei tohi hooneid näidata."
          },
          {
            "id": "d",
            "text": "Kaardil võib olla ainult üks värv."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u12-q029",
      "unitId": "lo-opik-u12",
      "stem": "Millises järjekorras saab kaarti kavandada?",
      "primaryObjectiveId": "lo-opik-u12-o3",
      "variantGroupId": "lo-opik-u12-g26",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõigepealt määratakse kaardi eesmärk ja sisu, seejärel kogutakse ning esitatakse andmed.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i0",
            "text": "Selgita välja, milleks kaarti vaja on."
          },
          {
            "id": "i1",
            "text": "Vali kaardil näidatavad objektid."
          },
          {
            "id": "i2",
            "text": "Kogu vajalikud andmed."
          },
          {
            "id": "i3",
            "text": "Kujuta andmed selgelt kaardil."
          }
        ],
        "correctOrder": [
          "i0",
          "i1",
          "i2",
          "i3"
        ]
      }
    },
    {
      "id": "lo-opik-u12-q030",
      "unitId": "lo-opik-u12",
      "stem": "Ühenda kaart selle põhieesmärgiga.",
      "primaryObjectiveId": "lo-opik-u12-o3",
      "variantGroupId": "lo-opik-u12-g29",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Erineva otstarbega kaartidel on olulised erinevad objektid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p0",
            "text": "Jalgrattateede kaart"
          },
          {
            "id": "p1",
            "text": "Muuseumide kaart"
          },
          {
            "id": "p2",
            "text": "Jõgede kaart"
          }
        ],
        "choices": [
          {
            "id": "c0",
            "text": "näitab rattaga liikumiseks sobivaid teid"
          },
          {
            "id": "c1",
            "text": "näitab muuseumide asukohti"
          },
          {
            "id": "c2",
            "text": "näitab veekogude paiknemist"
          }
        ],
        "correctPairs": {
          "p0": "c0",
          "p1": "c1",
          "p2": "c2"
        }
      }
    },
    {
      "id": "lo-opik-u12-q031",
      "unitId": "lo-opik-u12",
      "stem": "Linn tellib kaardi, mis aitab inimestel leida raamatukogusid. Mis peab seal eriti selgelt näha olema?",
      "primaryObjectiveId": "lo-opik-u12-o3",
      "variantGroupId": "lo-opik-u12-g30",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi sisu valitakse selle järgi, mida kasutaja peab leidma.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "r",
            "text": "Raamatukogude asukohad."
          },
          {
            "id": "m",
            "text": "Kõigi majade katusematerjal."
          },
          {
            "id": "t",
            "text": "Kõigi puude vanused."
          },
          {
            "id": "s",
            "text": "Ainult naaberriikide nimed."
          }
        ],
        "correctOptionId": "r"
      }
    },
    {
      "id": "lo-opik-u12-q032",
      "unitId": "lo-opik-u12",
      "stem": "Kool koostab kaarti ohututest kooliteedest. Millised andmed on otstarbekaardil kõige olulisemad?",
      "primaryObjectiveId": "lo-opik-u12-o3",
      "variantGroupId": "lo-opik-u12-g31",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Turvalise koolitee kaardi jaoks on tähtsad tänavad, kõnniteed ja ülekäigurajad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "u",
            "text": "Ülekäigurajad."
          },
          {
            "id": "t",
            "text": "Kõnniteed."
          },
          {
            "id": "r",
            "text": "Teed ja ristmikud."
          },
          {
            "id": "p",
            "text": "Kõigi õues kasvavate lillede värv."
          },
          {
            "id": "k",
            "text": "Majade katuste kaunistused."
          }
        ],
        "correctOptionIds": [
          "u",
          "t",
          "r"
        ]
      }
    },
    {
      "id": "lo-opik-u12-q033",
      "unitId": "lo-opik-u12",
      "stem": "Kaks kartograafi teevad samast linnast erinevaid kaarte. Miks nende kaardid võivad erineda?",
      "primaryObjectiveId": "lo-opik-u12-o3",
      "variantGroupId": "lo-opik-u12-g27",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sama piirkonna eri kaardid võivad rõhutada eri teemasid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "p",
            "text": "Neil võib olla erinev eesmärk ja seetõttu valitakse erinev teave."
          },
          {
            "id": "v",
            "text": "Linn muudab asukohta iga kaardi tegemisel."
          },
          {
            "id": "e",
            "text": "Kõik sama linna kaardid peavad olema täpselt identsed."
          },
          {
            "id": "l",
            "text": "Üks kartograaf peab alati kõik pargid kustutama."
          }
        ],
        "correctOptionId": "p"
      }
    },
    {
      "id": "lo-opik-u12-q034",
      "unitId": "lo-opik-u12",
      "stem": "Rühmita, millist teavet eri eesmärgiga kaardile kindlasti vaja on.",
      "primaryObjectiveId": "lo-opik-u12-o3",
      "variantGroupId": "lo-opik-u12-g29",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi eesmärk määrab, millist infot esile tuua.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "r",
            "text": "Rattateede kaart"
          },
          {
            "id": "m",
            "text": "Muuseumide kaart"
          }
        ],
        "items": [
          {
            "id": "i0",
            "text": "jalgrattaga sõidetavad teed"
          },
          {
            "id": "i1",
            "text": "rattatee ühendused"
          },
          {
            "id": "i2",
            "text": "muuseumide asukohad"
          },
          {
            "id": "i3",
            "text": "muuseumide nimed"
          }
        ],
        "correctGroupByItem": {
          "i0": "r",
          "i1": "r",
          "i2": "m",
          "i3": "m"
        }
      }
    },
    {
      "id": "lo-opik-u12-q035",
      "unitId": "lo-opik-u12",
      "stem": "Mis on aerofoto?",
      "primaryObjectiveId": "lo-opik-u12-o4",
      "variantGroupId": "lo-opik-u12-g34",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aerofoto on õhust tehtud pilt maa- ja veepinnast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o",
            "text": "Õhust, näiteks lennukilt, tehtud foto maapinnast."
          },
          {
            "id": "s",
            "text": "Alati merepõhjas tehtud foto."
          },
          {
            "id": "p",
            "text": "Ainult käsitsi joonistatud kaart."
          },
          {
            "id": "k",
            "text": "Kõigi riikide nimede nimekiri."
          }
        ],
        "correctOptionId": "o"
      }
    },
    {
      "id": "lo-opik-u12-q036",
      "unitId": "lo-opik-u12",
      "stem": "Kust tehakse satelliidifoto?",
      "primaryObjectiveId": "lo-opik-u12-o4",
      "variantGroupId": "lo-opik-u12-g35",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Satelliidifotod tehakse kosmosest satelliitidelt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "Kosmoses asuvalt satelliidilt."
          },
          {
            "id": "l",
            "text": "Ainult jalgsi maapinnalt."
          },
          {
            "id": "h",
            "text": "Ainult hoone keldrist."
          },
          {
            "id": "r",
            "text": "Kaardi legendist."
          }
        ],
        "correctOptionId": "k"
      }
    },
    {
      "id": "lo-opik-u12-q037",
      "unitId": "lo-opik-u12",
      "stem": "Kuidas nimetatakse tööviisi, mille käigus kogutakse andmeid kohapeal?",
      "primaryObjectiveId": "lo-opik-u12-o4",
      "variantGroupId": "lo-opik-u12-g36",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Välitöödel minnakse kohapeale, et andmeid uurida või kontrollida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "v",
            "text": "Välitööd."
          },
          {
            "id": "p",
            "text": "Paberikaardi voltimine."
          },
          {
            "id": "s",
            "text": "Kaardi pealkirja lugemine."
          },
          {
            "id": "t",
            "text": "Ekvaatori joonistamine."
          }
        ],
        "correctOptionId": "v"
      }
    },
    {
      "id": "lo-opik-u12-q038",
      "unitId": "lo-opik-u12",
      "stem": "Mis on aerofoto ja satelliidifoto peamine erinevus?",
      "primaryObjectiveId": "lo-opik-u12-o4",
      "variantGroupId": "lo-opik-u12-g35",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aerofoto tehakse näiteks lennukilt, satelliidifoto kosmoses asuvalt satelliidilt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Pildistamise koht: õhust või kosmosest."
          },
          {
            "id": "b",
            "text": "Aerofotol ei tohi jõgesid näha."
          },
          {
            "id": "c",
            "text": "Satelliidifotol on alati joonistatud leppemärgid."
          },
          {
            "id": "d",
            "text": "Aerofoto on alati mustvalge."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u12-q039",
      "unitId": "lo-opik-u12",
      "stem": "Miks tuleb mõnikord fotosid välitöödel täiendada?",
      "primaryObjectiveId": "lo-opik-u12-o4",
      "variantGroupId": "lo-opik-u12-g38",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Fotode põhjal ei pruugi näiteks selguda hoone otstarve; seda tuleb täpsustada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o",
            "text": "Kõiki vajalikke objekte või nende otstarvet ei pruugi fotodelt näha."
          },
          {
            "id": "b",
            "text": "Fotod teevad maapinna igal korral olematuks."
          },
          {
            "id": "m",
            "text": "Kartograaf ei tohi fotosid vaadata."
          },
          {
            "id": "a",
            "text": "Kõik aerofotod näitavad üksnes merd."
          }
        ],
        "correctOptionId": "o"
      }
    },
    {
      "id": "lo-opik-u12-q040",
      "unitId": "lo-opik-u12",
      "stem": "Ühenda andmete kogumise viis ja selle kirjeldus.",
      "primaryObjectiveId": "lo-opik-u12-o4",
      "variantGroupId": "lo-opik-u12-g39",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi jaoks kasutatakse mitmesuguseid andmeallikaid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p0",
            "text": "Aerofoto"
          },
          {
            "id": "p1",
            "text": "Satelliidifoto"
          },
          {
            "id": "p2",
            "text": "Välitöö"
          },
          {
            "id": "p3",
            "text": "Mõõtmine"
          }
        ],
        "choices": [
          {
            "id": "c0",
            "text": "pilt õhust"
          },
          {
            "id": "c1",
            "text": "pilt kosmosest"
          },
          {
            "id": "c2",
            "text": "andmete kogumine kohapeal"
          },
          {
            "id": "c3",
            "text": "objekti mõõtmete kindlakstegemine"
          }
        ],
        "correctPairs": {
          "p0": "c0",
          "p1": "c1",
          "p2": "c2",
          "p3": "c3"
        }
      }
    },
    {
      "id": "lo-opik-u12-q041",
      "unitId": "lo-opik-u12",
      "stem": "Vali, millised andmete kogumise viisid võivad kaardi koostamisel abiks olla.",
      "primaryObjectiveId": "lo-opik-u12-o4",
      "variantGroupId": "lo-opik-u12-g40",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi koostamisel saab kasutada mõõtmisi, fotosid ja välitöid, kuid andmed peavad olema kontrollitud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "m",
            "text": "Objektide mõõtmine."
          },
          {
            "id": "a",
            "text": "Aerofotode uurimine."
          },
          {
            "id": "s",
            "text": "Satelliidifotode uurimine."
          },
          {
            "id": "v",
            "text": "Välitöödel vaatlemine."
          },
          {
            "id": "o",
            "text": "Väljamõeldud andmete esitamine kontrollimata."
          }
        ],
        "correctOptionIds": [
          "m",
          "a",
          "s",
          "v"
        ]
      }
    },
    {
      "id": "lo-opik-u12-q042",
      "unitId": "lo-opik-u12",
      "stem": "Kaardistaja näeb fotol tundmatut suurt maja, kuid ei tea, kas see on kool. Mida tuleks teha?",
      "primaryObjectiveId": "lo-opik-u12-o4",
      "variantGroupId": "lo-opik-u12-g38",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ainuüksi katuse kuju järgi ei selgu, mis asutus hoones tegutseb.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "Kontrollida hoone otstarvet lisaandmetest või kohapeal."
          },
          {
            "id": "p",
            "text": "Märkida see küsimata kindlasti kooliks."
          },
          {
            "id": "e",
            "text": "Kustutada kõik teised hooned."
          },
          {
            "id": "s",
            "text": "Nimetada kogu ala ookeaniks."
          }
        ],
        "correctOptionId": "k"
      }
    },
    {
      "id": "lo-opik-u12-q043",
      "unitId": "lo-opik-u12",
      "stem": "Andmetabelis on märgitud: A = foto lennukilt, B = foto satelliidilt, C = kohapeal kontrollitud teave. Milline kirje on satelliidifoto?",
      "context": {
        "kind": "table",
        "headers": [
          "Tähis",
          "Andmete päritolu"
        ],
        "rows": [
          [
            "A",
            "Lennukilt"
          ],
          [
            "B",
            "Kosmoses olevalt satelliidilt"
          ],
          [
            "C",
            "Kohapealne vaatlus"
          ]
        ],
        "caption": "Kolm allikat"
      },
      "primaryObjectiveId": "lo-opik-u12-o4",
      "variantGroupId": "lo-opik-u12-g42",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Satelliidilt saadud foto on kirje B.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "A."
          },
          {
            "id": "b",
            "text": "B."
          },
          {
            "id": "c",
            "text": "C."
          },
          {
            "id": "d",
            "text": "Ükski neist."
          }
        ],
        "correctOptionId": "b"
      }
    },
    {
      "id": "lo-opik-u12-q044",
      "unitId": "lo-opik-u12",
      "stem": "Järjesta tegevused, kui tahad teha pargi käiguteede plaani.",
      "primaryObjectiveId": "lo-opik-u12-o4",
      "variantGroupId": "lo-opik-u12-g43",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Esmalt otsustatakse, mida näidata, siis kogutakse ja kontrollitakse andmed ning joonistatakse plaan.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i0",
            "text": "Võta eesmärgiks pargi käiguteede näitamine."
          },
          {
            "id": "i1",
            "text": "Uuri parki fotolt ja kogu olemasolevad andmed."
          },
          {
            "id": "i2",
            "text": "Kontrolli vajaduse korral teid pargis kohapeal."
          },
          {
            "id": "i3",
            "text": "Kanna sobivad teed plaanile."
          }
        ],
        "correctOrder": [
          "i0",
          "i1",
          "i2",
          "i3"
        ]
      }
    },
    {
      "id": "lo-opik-u12-q045",
      "unitId": "lo-opik-u12",
      "stem": "Milline allikas aitab kontrollida, kas aerofotol nähtav rada on praegu veel läbitav?",
      "primaryObjectiveId": "lo-opik-u12-o4",
      "variantGroupId": "lo-opik-u12-g44",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pärast pildistamist võis olukord muutuda; kohapealne vaatlus näitab praegust olukorda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "Kohapealne vaatlus."
          },
          {
            "id": "v",
            "text": "Ainult väga vana aerofoto."
          },
          {
            "id": "p",
            "text": "Kontrollimata oletus."
          },
          {
            "id": "u",
            "text": "Ainult foto pealkiri."
          }
        ],
        "correctOptionId": "k"
      }
    },
    {
      "id": "lo-opik-u12-q046",
      "unitId": "lo-opik-u12",
      "stem": "Mida näeb aerofotol tavaliselt selgemini kui lihtsustatud kaardil?",
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g45",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aerofotol näeme tegelikku maastikku, sealhulgas katuseid ja varjusid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "d",
            "text": "Hoonete katuseid ja maastiku pisidetaile."
          },
          {
            "id": "m",
            "text": "Muuseumide kokkuleppelisi sümboleid."
          },
          {
            "id": "l",
            "text": "Kaardi legendi."
          },
          {
            "id": "n",
            "text": "Kõigi linnade nimede tähestikku."
          }
        ],
        "correctOptionId": "d"
      }
    },
    {
      "id": "lo-opik-u12-q047",
      "unitId": "lo-opik-u12",
      "stem": "Mille abil näitab kaart objekte lihtsamalt kui aerofoto?",
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g46",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaart lihtsustab tegelikkust leppemärkide ja värvidega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "m",
            "text": "Leppemärkide ja värvide abil."
          },
          {
            "id": "f",
            "text": "Ainult ehitiste tegelike fotode abil."
          },
          {
            "id": "v",
            "text": "Ainult hoonete varjude abil."
          },
          {
            "id": "t",
            "text": "Ilma ühegi valikuta."
          }
        ],
        "correctOptionId": "m"
      }
    },
    {
      "id": "lo-opik-u12-q048",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta joonisel aerofotot meenutavat vaadet.",
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g47",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vasakpoolne joonistatud vaade meenutab aerofoto detailsust; see pole päris foto.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-aerial-vs-map",
        "correctRegionId": "aerial-panel"
      }
    },
    {
      "id": "lo-opik-u12-q049",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta joonisel lihtsustatud kaardivaadet.",
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g47",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Parempoolne näidis kujutab sama ala lihtsustatud kaardina.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "51"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-aerial-vs-map",
        "correctRegionId": "map-panel"
      }
    },
    {
      "id": "lo-opik-u12-q050",
      "unitId": "lo-opik-u12",
      "stem": "Miks on kaardil mõnda kohta kergem ära tunda kui aerofotol?",
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g48",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nimed ja kokkulepitud sümbolid aitavad olulist teavet kiiresti leida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "s",
            "text": "Kaart võib kasutada selgeid nimesid ja leppemärke."
          },
          {
            "id": "v",
            "text": "Kõik hooned on kaardil päriselt suuremad."
          },
          {
            "id": "i",
            "text": "Aerofoto näitab alati üksnes pilvi."
          },
          {
            "id": "p",
            "text": "Kaardil ei kujutata kunagi jõgesid."
          }
        ],
        "correctOptionId": "s"
      }
    },
    {
      "id": "lo-opik-u12-q051",
      "unitId": "lo-opik-u12",
      "stem": "Miks tundub aerofoto sageli kirjum kui kaart?",
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g49",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aerofotol on palju detaile; kaardile valitakse vaid olulised nähtused.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "See näitab palju nähtavaid detaile, ka neid, mis kaardile ei jõua."
          },
          {
            "id": "j",
            "text": "Sellel on alati rohkem legende."
          },
          {
            "id": "m",
            "text": "Sellel on ainult üks kujutatud objekt."
          },
          {
            "id": "p",
            "text": "Aerofotod on alati käsitsi maalitud."
          }
        ],
        "correctOptionId": "k"
      }
    },
    {
      "id": "lo-opik-u12-q052",
      "unitId": "lo-opik-u12",
      "stem": "Rühmita, kumb annab selle teabe tavaliselt paremini.",
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g50",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aerofoto näitab väljanägemist; kaart saab näidata nimesid ja kokkulepitud märke.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "f",
            "text": "Aerofoto"
          },
          {
            "id": "k",
            "text": "Kaart"
          }
        ],
        "items": [
          {
            "id": "i0",
            "text": "katuste tegelikud toonid ja varjud"
          },
          {
            "id": "i1",
            "text": "muuseumi asukoha erimärk"
          },
          {
            "id": "i2",
            "text": "üksikute puude pildiline välimus"
          },
          {
            "id": "i3",
            "text": "tänava ametlik nimi"
          }
        ],
        "correctGroupByItem": {
          "i0": "f",
          "i1": "k",
          "i2": "f",
          "i3": "k"
        }
      }
    },
    {
      "id": "lo-opik-u12-q053",
      "unitId": "lo-opik-u12",
      "stem": "Milline väide aerofoto kohta on õige?",
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g51",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pildilt näed hoonet, kuid tavaliselt mitte seda, milline asutus seal tegutseb.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "s",
            "text": "Aerofotol võib olla näha palju detaile, kuid hoone otstarve ei pruugi selguda."
          },
          {
            "id": "p",
            "text": "Aerofotol on alati iga muuseumi nimi."
          },
          {
            "id": "m",
            "text": "Aerofoto koosneb ainult leppemärkidest."
          },
          {
            "id": "v",
            "text": "Aerofotol ei ole võimalik jõge näha."
          }
        ],
        "correctOptionId": "s"
      }
    },
    {
      "id": "lo-opik-u12-q054",
      "unitId": "lo-opik-u12",
      "stem": "Sa tahad näha, kas hoonel on punane või hall katus. Millisest kujutisest oleks kõige rohkem abi?",
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g45",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aerofoto näitab hoonete tegelikku välimust ja katuseid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "f",
            "text": "Värvilisest aerofotost."
          },
          {
            "id": "k",
            "text": "Ainult leppemärkidega linnakaardist."
          },
          {
            "id": "l",
            "text": "Ainult kaardi legendist."
          },
          {
            "id": "m",
            "text": "Mandrite nimede tabelist."
          }
        ],
        "correctOptionId": "f"
      }
    },
    {
      "id": "lo-opik-u12-q055",
      "unitId": "lo-opik-u12",
      "stem": "Sa otsid tundmatus linnas muuseumi. Kumb allikas aitab selle asukohta tavaliselt paremini ära tunda?",
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g48",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi muuseumimärk ja nimi näitavad, millises hoones muuseum on.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "Muuseumi märgi ja nimega linnakaart."
          },
          {
            "id": "f",
            "text": "Nimetusteta aerofoto."
          },
          {
            "id": "p",
            "text": "Üksnes juhuslik foto puude latvadest."
          },
          {
            "id": "g",
            "text": "Gloobus, millel on ainult mandrid."
          }
        ],
        "correctOptionId": "k"
      }
    },
    {
      "id": "lo-opik-u12-q056",
      "unitId": "lo-opik-u12",
      "stem": "Pildi A peal on katuste värvid ja puud, pildi B peal tänavanimed ning muuseumimärgid. Milline pilt on tõenäolisemalt kaart?",
      "context": {
        "kind": "table",
        "headers": [
          "Pilt",
          "Mida sellel näeb?"
        ],
        "rows": [
          [
            "A",
            "katusevärvid, puud ja varjud"
          ],
          [
            "B",
            "tänavanimed, jõemärk ja muuseumimärgid"
          ]
        ],
        "caption": "Kaks sama piirkonna kujutist"
      },
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g54",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi tunneb ära nimede ja leppemärkide järgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "A."
          },
          {
            "id": "b",
            "text": "B."
          },
          {
            "id": "c",
            "text": "Mõlemad peavad olema aerofotod."
          },
          {
            "id": "d",
            "text": "Kumbki ei saa näidata linna."
          }
        ],
        "correctOptionId": "b"
      }
    },
    {
      "id": "lo-opik-u12-q057",
      "unitId": "lo-opik-u12",
      "stem": "Vaatad kaht pilti ühest linnast. Ühel näed hoonete päris katuseid, teisel ainult hoone kujulisi halle alasid. Miks need erinevad?",
      "primaryObjectiveId": "lo-opik-u12-o5",
      "variantGroupId": "lo-opik-u12-g49",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaart asendab palju detaile lihtsustatud kujutisega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "v",
            "text": "Kaart üldistab objekte; aerofoto näitab nende välimust."
          },
          {
            "id": "s",
            "text": "Kaardil on kõik majad ehitatud halliks."
          },
          {
            "id": "r",
            "text": "Aerofotol pole võimalik hooneid kujutada."
          },
          {
            "id": "p",
            "text": "Maapind muutub kaardi vaatamisel tasaseks."
          }
        ],
        "correctOptionId": "v"
      }
    },
    {
      "id": "lo-opik-u12-q058",
      "unitId": "lo-opik-u12",
      "stem": "Mida tähendab sõna „leppemärgid“ kaardil?",
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g56",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Leppemärgid tähistavad kaardil objekte ja nähtusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "Kokkulepitud märgid objektide kujutamiseks."
          },
          {
            "id": "b",
            "text": "Kohad, mida pole kunagi olemas olnud."
          },
          {
            "id": "c",
            "text": "Ainult kartograafide allkirjad."
          },
          {
            "id": "d",
            "text": "Juhuslikud plekid kaardipaberil."
          }
        ],
        "correctOptionId": "a"
      }
    },
    {
      "id": "lo-opik-u12-q059",
      "unitId": "lo-opik-u12",
      "stem": "Mis on kaardi legend?",
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g57",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Legend selgitab, mida kaardi leppemärgid tähendavad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "l",
            "text": "Kaardi leppemärkide seletus."
          },
          {
            "id": "k",
            "text": "Põhjapooluse teine nimi."
          },
          {
            "id": "s",
            "text": "Kaardi hoidmiseks mõeldud ümbris."
          },
          {
            "id": "a",
            "text": "Aerofoto liik."
          }
        ],
        "correctOptionId": "l"
      }
    },
    {
      "id": "lo-opik-u12-q060",
      "unitId": "lo-opik-u12",
      "stem": "Kust otsid kaardil tundmatu sümboli tähendust?",
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g58",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaardi legendist saad teada, mille tähistamiseks märki kasutatakse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "l",
            "text": "Legendi juurest."
          },
          {
            "id": "v",
            "text": "Ainult fotokaamera seest."
          },
          {
            "id": "p",
            "text": "Suvaliselt teiselt kaardilt."
          },
          {
            "id": "g",
            "text": "Gloobuse telje juurest."
          }
        ],
        "correctOptionId": "l"
      }
    },
    {
      "id": "lo-opik-u12-q061",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta joonisel kaardi legendi asukohta.",
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g59",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Legend on eraldi selgituskast kaardi servas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-legend-town",
        "correctRegionId": "legend"
      }
    },
    {
      "id": "lo-opik-u12-q062",
      "unitId": "lo-opik-u12",
      "stem": "Miks kasutatakse kaartidel leppemärke?",
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g60",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Leppemärkidega saab väheses ruumis näidata palju olulist teavet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "s",
            "text": "Need aitavad olulisi objekte selgelt ja lühidalt kujutada."
          },
          {
            "id": "v",
            "text": "Need muudavad kõik hooned nähtamatuks."
          },
          {
            "id": "p",
            "text": "Need asendavad vajaduse kaarte kunagi lugeda."
          },
          {
            "id": "k",
            "text": "Need sunnivad igal kaardil kasutama sama mõõtkava."
          }
        ],
        "correctOptionId": "s"
      }
    },
    {
      "id": "lo-opik-u12-q063",
      "unitId": "lo-opik-u12",
      "stem": "Kas muuseumi leppemärk peab kõikidel maailma kaartidel ühesugune olema?",
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g61",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Märgid võivad kaartidel erineda. Seetõttu tuleb lugeda kasutatava kaardi legendi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "e",
            "text": "Ei; selle täpset tähendust tuleb kontrollida konkreetse kaardi legendist."
          },
          {
            "id": "j",
            "text": "Jah; igal kaardil tähendab iga sümbol alati sama."
          },
          {
            "id": "m",
            "text": "Ei; seetõttu ei saa sümboleid üldse kasutada."
          },
          {
            "id": "p",
            "text": "Jah; sest muuseumid on igal pool ühesuguse kujuga."
          }
        ],
        "correctOptionId": "e"
      }
    },
    {
      "id": "lo-opik-u12-q064",
      "unitId": "lo-opik-u12",
      "stem": "Ühenda mõiste ja selle tähendus.",
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g57",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Leppemärk kujutab objekti ja legend selgitab märgi tähenduse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p0",
            "text": "Leppemärk"
          },
          {
            "id": "p1",
            "text": "Legend"
          },
          {
            "id": "p2",
            "text": "Kaart"
          }
        ],
        "choices": [
          {
            "id": "c0",
            "text": "kaardil kasutatav objekti tähistav märk"
          },
          {
            "id": "c1",
            "text": "nende märkide seletus"
          },
          {
            "id": "c2",
            "text": "Maa vähendatud mudel tasapinnal"
          }
        ],
        "correctPairs": {
          "p0": "c0",
          "p1": "c1",
          "p2": "c2"
        }
      }
    },
    {
      "id": "lo-opik-u12-q065",
      "unitId": "lo-opik-u12",
      "stem": "Mida saad teada legendist, milles on muuseumimärk ja sillamärk?",
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g63",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Legend selgitab kaardil kasutatud märkide tähendusi, mitte hoonete kogu teavet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "m",
            "text": "Millist märki kasutatakse muuseumi jaoks."
          },
          {
            "id": "s",
            "text": "Millist märki kasutatakse silla jaoks."
          },
          {
            "id": "o",
            "text": "Kõikide majade elanike vanused."
          },
          {
            "id": "i",
            "text": "Kõikide muuseumide täpsed sisuprogrammid."
          }
        ],
        "correctOptionIds": [
          "m",
          "s"
        ]
      }
    },
    {
      "id": "lo-opik-u12-q066",
      "unitId": "lo-opik-u12",
      "stem": "Kaardil on märk ★. Legend ütleb: ★ = muuseum. Mida tähistab ★ sellel kaardil?",
      "context": {
        "kind": "text",
        "paragraphs": [
          "Näidiskaardi legend: ★ — muuseum; ● — teater; ■ — raamatukogu.",
          "Märgid on selle näite jaoks valitud ega kehti automaatselt kõigil kaartidel."
        ]
      },
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g64",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Selle kaardi legendi järgi tähistab täht muuseumi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "m",
            "text": "Muuseumi."
          },
          {
            "id": "t",
            "text": "Teatrit."
          },
          {
            "id": "k",
            "text": "Kinosaali."
          },
          {
            "id": "r",
            "text": "Raamatukogu."
          }
        ],
        "correctOptionId": "m"
      }
    },
    {
      "id": "lo-opik-u12-q067",
      "unitId": "lo-opik-u12",
      "stem": "Kaardi legendis on kolm sümbolit. Millist märki peaks otsima, kui soovid leida raamatukogu?",
      "context": {
        "kind": "table",
        "headers": [
          "Märk",
          "Legend"
        ],
        "rows": [
          [
            "M",
            "muuseum"
          ],
          [
            "R",
            "raamatukogu"
          ],
          [
            "K",
            "kino"
          ],
          [
            "T",
            "teater"
          ]
        ],
        "caption": "Väljamõeldud näidiskaardi leppemärgid"
      },
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g64",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Legend ütleb, et raamatukogu sümbol on R.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "m",
            "text": "M — muuseum."
          },
          {
            "id": "r",
            "text": "R — raamatukogu."
          },
          {
            "id": "k",
            "text": "K — kino."
          },
          {
            "id": "t",
            "text": "T — teater."
          }
        ],
        "correctOptionId": "r"
      }
    },
    {
      "id": "lo-opik-u12-q068",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta näidiskaardil muuseumi märki.",
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g64",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Näidiskaardil on muuseumi jaoks eraldi leppemärk. Selle tähenduse saab teada legendist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-legend-town",
        "correctRegionId": "museum"
      }
    },
    {
      "id": "lo-opik-u12-q069",
      "unitId": "lo-opik-u12",
      "stem": "Kui kaardil puudub sulle vajaliku märgi seletus, milline käitumine on mõistlik?",
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g67",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tundmatut märki ei tohi suvaliselt tõlgendada; selle tähendust tuleb kontrollida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "u",
            "text": "Otsi kaardi lisaselgitus või teine usaldusväärne kaart."
          },
          {
            "id": "o",
            "text": "Oleta, et iga tundmatu märk tähistab alati muuseumi."
          },
          {
            "id": "s",
            "text": "Kustuta kõik teised leppemärgid."
          },
          {
            "id": "p",
            "text": "Eelda, et kaardil ei ole kunagi vigu."
          }
        ],
        "correctOptionId": "u"
      }
    },
    {
      "id": "lo-opik-u12-q070",
      "unitId": "lo-opik-u12",
      "stem": "Millist teavet kaart võib anda, kuigi aerofotol see ei paista?",
      "primaryObjectiveId": "lo-opik-u12-o6",
      "variantGroupId": "lo-opik-u12-g68",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaart võib lisada hoone funktsiooni tähistava märgi, mida fotol pole.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "n",
            "text": "Muuseumi leppemärk hoone juures."
          },
          {
            "id": "p",
            "text": "Päriselt hoone katusel olevad varjud."
          },
          {
            "id": "t",
            "text": "Puude lehtede tegelik värv fotohetkel."
          },
          {
            "id": "v",
            "text": "Teede fotol nähtav täpne pinnakatte toon."
          }
        ],
        "correctOptionId": "n"
      }
    },
    {
      "id": "lo-opik-u12-q071",
      "unitId": "lo-opik-u12",
      "stem": "Mis värviga on jõgi kujutatud õpiku Tartu kesklinna kaardi legendis?",
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g69",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku Tartu kaardil on jõgi sinaka alana.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "s",
            "text": "Sinisega."
          },
          {
            "id": "r",
            "text": "Rohelisega."
          },
          {
            "id": "h",
            "text": "Halliga."
          },
          {
            "id": "p",
            "text": "Punasega."
          }
        ],
        "correctOptionId": "s"
      }
    },
    {
      "id": "lo-opik-u12-q072",
      "unitId": "lo-opik-u12",
      "stem": "Milline värv tähistab õpiku Tartu kaardil parki?",
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g70",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku kaardi legendis tähistab roheline ala parki.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "r",
            "text": "Roheline."
          },
          {
            "id": "s",
            "text": "Sinine."
          },
          {
            "id": "h",
            "text": "Hall."
          },
          {
            "id": "m",
            "text": "Must."
          }
        ],
        "correctOptionId": "r"
      }
    },
    {
      "id": "lo-opik-u12-q073",
      "unitId": "lo-opik-u12",
      "stem": "Kuidas on õpiku Tartu kaardil hooned üldjuhul kujutatud?",
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g71",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hooned on kaardil lihtsustatud pindobjektid, õpiku kaardil hallikas toonis.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "h",
            "text": "Hallide hoonekujuliste aladena."
          },
          {
            "id": "j",
            "text": "Kõrgete ruumiliste piltidena koos varjudega."
          },
          {
            "id": "s",
            "text": "Ainult siniste jõgedena."
          },
          {
            "id": "m",
            "text": "Ainult muuseumimärgina."
          }
        ],
        "correctOptionId": "h"
      }
    },
    {
      "id": "lo-opik-u12-q074",
      "unitId": "lo-opik-u12",
      "stem": "Miks kasutatakse kaardi jõel ja pargil erinevaid värve?",
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g72",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Värvid aitavad kaardil erinevat liiki alasid ja nähtusi eristada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "e",
            "text": "Et erinevaid objekte oleks lihtsam ära tunda ja eristada."
          },
          {
            "id": "k",
            "text": "Sest tõelised jõed on alati värvitud."
          },
          {
            "id": "o",
            "text": "Sest kõik maailma kaardid kasutavad samu värve."
          },
          {
            "id": "v",
            "text": "Et kõik majad paistaksid suuremad."
          }
        ],
        "correctOptionId": "e"
      }
    },
    {
      "id": "lo-opik-u12-q075",
      "unitId": "lo-opik-u12",
      "stem": "Rühmita õpiku kaardi tähistused ja objektid.",
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g73",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jõgi on veeala, park haljasala ning hoone ja sild ehitised.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "v",
            "text": "Veeala"
          },
          {
            "id": "h",
            "text": "Haljasala"
          },
          {
            "id": "e",
            "text": "Ehitis"
          }
        ],
        "items": [
          {
            "id": "i0",
            "text": "sinine jõgi"
          },
          {
            "id": "i1",
            "text": "roheline park"
          },
          {
            "id": "i2",
            "text": "hall hoone"
          },
          {
            "id": "i3",
            "text": "kaardi sillamärk"
          }
        ],
        "correctGroupByItem": {
          "i0": "v",
          "i1": "h",
          "i2": "e",
          "i3": "e"
        }
      }
    },
    {
      "id": "lo-opik-u12-q076",
      "unitId": "lo-opik-u12",
      "stem": "Miks on kaardil hoone tavaliselt lihtsa kujuga, mitte fotoga katustest?",
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g74",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaart lihtsustab objektide välimust, et asukoht oleks loetav.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "l",
            "text": "Lihtne kujutis aitab hoone asukohta kiiresti näha."
          },
          {
            "id": "p",
            "text": "Hooned ongi looduses ainult hallid ristkülikud."
          },
          {
            "id": "a",
            "text": "Aerofotodel ei ole kunagi hooneid."
          },
          {
            "id": "v",
            "text": "Kaardil tuleb kõiki objekte värvida ühte värvi."
          }
        ],
        "correctOptionId": "l"
      }
    },
    {
      "id": "lo-opik-u12-q077",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta näidiskaardil jõge.",
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g69",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Näidiskaardi jõgi on sinine veekogu ala.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-legend-town",
        "correctRegionId": "river"
      }
    },
    {
      "id": "lo-opik-u12-q078",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta näidiskaardil parki.",
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g70",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Näidiskaardi park on roheline ala.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-legend-town",
        "correctRegionId": "park"
      }
    },
    {
      "id": "lo-opik-u12-q079",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta näidiskaardil tavalist hoonet.",
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g71",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Näidiskaardi tavaline hoone on hallikas pind.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-legend-town",
        "correctRegionId": "building"
      }
    },
    {
      "id": "lo-opik-u12-q080",
      "unitId": "lo-opik-u12",
      "stem": "Puuduta näidiskaardil silda.",
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g78",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Sild ületab näidiskaardil jõge.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u12-legend-town",
        "correctRegionId": "bridge"
      }
    },
    {
      "id": "lo-opik-u12-q081",
      "unitId": "lo-opik-u12",
      "stem": "Legend näitab: sinine = jõgi, roheline = park, hall = hoone. Millist värvi ala otsid, kui tahad leida pargi?",
      "context": {
        "kind": "table",
        "headers": [
          "Värv",
          "Objekt"
        ],
        "rows": [
          [
            "sinine",
            "jõgi"
          ],
          [
            "roheline",
            "park"
          ],
          [
            "hall",
            "hoone"
          ]
        ],
        "caption": "Selle näidiskaardi legend"
      },
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g70",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Antud legendi järgi on park märgitud rohelisega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "r",
            "text": "Rohelist."
          },
          {
            "id": "s",
            "text": "Sinist."
          },
          {
            "id": "h",
            "text": "Halli."
          },
          {
            "id": "p",
            "text": "Puna-valget."
          }
        ],
        "correctOptionId": "r"
      }
    },
    {
      "id": "lo-opik-u12-q082",
      "unitId": "lo-opik-u12",
      "stem": "Sõber ütleb, et sinine tähendab igal kaardil alati jõge. Kuidas seda väidet parandad?",
      "primaryObjectiveId": "lo-opik-u12-o7",
      "variantGroupId": "lo-opik-u12-g80",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku näidiskaardil on jõgi sinine, kuid värvide tähendused sõltuvad kaardist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "l",
            "text": "Kontrolli konkreetse kaardi legendi; eri kaartidel võivad värvid tähendada eri asju."
          },
          {
            "id": "o",
            "text": "Õige, sinine ei saa kunagi midagi muud tähendada."
          },
          {
            "id": "p",
            "text": "Legendi pole kunagi vaja vaadata."
          },
          {
            "id": "t",
            "text": "Sinine ei saa tähendada ühtegi veeala."
          }
        ],
        "correctOptionId": "l"
      }
    },
    {
      "id": "lo-opik-u12-q083",
      "unitId": "lo-opik-u12",
      "stem": "Milline jõgi on õpiku Tartu kesklinna kaardil?",
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g81",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku Tartu kesklinna kaardil on kujutatud Emajõgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "e",
            "text": "Emajõgi."
          },
          {
            "id": "n",
            "text": "Narva jõgi."
          },
          {
            "id": "p",
            "text": "Pärnu jõgi."
          },
          {
            "id": "k",
            "text": "Kasari jõgi."
          }
        ],
        "correctOptionId": "e"
      }
    },
    {
      "id": "lo-opik-u12-q084",
      "unitId": "lo-opik-u12",
      "stem": "Milline õpikus nimetatud koht on muuseum?",
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g82",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tartu Mänguasjamuuseum on muuseum ja on õpiku kaardil muuseumimärgiga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "m",
            "text": "Tartu Mänguasjamuuseum."
          },
          {
            "id": "k",
            "text": "Kaarisild."
          },
          {
            "id": "e",
            "text": "Emajõgi."
          },
          {
            "id": "r",
            "text": "Raekoda."
          }
        ],
        "correctOptionId": "m"
      }
    },
    {
      "id": "lo-opik-u12-q085",
      "unitId": "lo-opik-u12",
      "stem": "Milline Tartu kesklinna kaardil nimetatud paik on sild?",
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g83",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kaarisild on Emajõge ületav sild ja on õpiku kaardil nimetatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "k",
            "text": "Kaarisild."
          },
          {
            "id": "t",
            "text": "Toomemägi."
          },
          {
            "id": "v",
            "text": "Linnaraamatukogu."
          },
          {
            "id": "m",
            "text": "Tartu Mänguasjamuuseum."
          }
        ],
        "correctOptionId": "k"
      }
    },
    {
      "id": "lo-opik-u12-q086",
      "unitId": "lo-opik-u12",
      "stem": "Miks leiad Tartu Mänguasjamuuseumi asukoha kaardilt lihtsamini kui üksnes aerofotolt?",
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g84",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Muuseum on hoone, mille otstarvet fotolt ei pruugi ära tunda. Kaardil on nimi ja leppemärk.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "52"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "m",
            "text": "Kaardil saab näidata muuseumimärki ja nime."
          },
          {
            "id": "v",
            "text": "Aerofotodel ei ole üldse hooneid."
          },
          {
            "id": "s",
            "text": "Kaart näitab alati iga maja sisemust."
          },
          {
            "id": "k",
            "text": "Gloobus näitab muuseumi kõiki ruume."
          }
        ],
        "correctOptionId": "m"
      }
    },
    {
      "id": "lo-opik-u12-q087",
      "unitId": "lo-opik-u12",
      "stem": "Ühenda õpiku Tartu kaardil nimetatud koht ja selle liik.",
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g85",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Elektriteater on kino, Linnaraamatukogu on raamatukogu, Kaarisild sild ja Emajõgi jõgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p0",
            "text": "Elektriteater"
          },
          {
            "id": "p1",
            "text": "Linnaraamatukogu"
          },
          {
            "id": "p2",
            "text": "Kaarisild"
          },
          {
            "id": "p3",
            "text": "Emajõgi"
          }
        ],
        "choices": [
          {
            "id": "c0",
            "text": "kino"
          },
          {
            "id": "c1",
            "text": "raamatukogu"
          },
          {
            "id": "c2",
            "text": "sild"
          },
          {
            "id": "c3",
            "text": "jõgi"
          }
        ],
        "correctPairs": {
          "p0": "c0",
          "p1": "c1",
          "p2": "c2",
          "p3": "c3"
        }
      }
    },
    {
      "id": "lo-opik-u12-q088",
      "unitId": "lo-opik-u12",
      "stem": "Mis aitab kaardil eristada teatrit ja muuseumi, kui need asuvad eri hoonetes?",
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g86",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku Tartu kaardi legendis on teatri ja muuseumi jaoks eraldi leppemärgid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "s",
            "text": "Nende erinevad leppemärgid koos legendiga."
          },
          {
            "id": "o",
            "text": "Ainult hoonete katuste värvus aerofotol."
          },
          {
            "id": "v",
            "text": "Ainult linna suurus."
          },
          {
            "id": "t",
            "text": "Ainult gloobuse pöörlemine."
          }
        ],
        "correctOptionId": "s"
      }
    },
    {
      "id": "lo-opik-u12-q089",
      "unitId": "lo-opik-u12",
      "stem": "Soovid Tartu kesklinna kaardilt leida muuseumi. Mida teed esimesena?",
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g84",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Legendis toodud muuseumimärk aitab otsitava koha kaardilt üles leida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "l",
            "text": "Vaatan legendist muuseumimärki ja otsin seda kaardilt."
          },
          {
            "id": "k",
            "text": "Otsin üksnes iga hoone katusevärvi."
          },
          {
            "id": "s",
            "text": "Valin juhusliku silla."
          },
          {
            "id": "p",
            "text": "Eeldan, et iga hoone on muuseum."
          }
        ],
        "correctOptionId": "l"
      }
    },
    {
      "id": "lo-opik-u12-q090",
      "unitId": "lo-opik-u12",
      "stem": "Marta tahab minna Tartus etendust vaatama. Millist õpikus nimetatud kohta tuleks teatri leidmiseks vaadata?",
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g88",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku Tartu kesklinna kaardil on Teatri Kodu tähistatud teatrina.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "t",
            "text": "Teatri Kodu."
          },
          {
            "id": "m",
            "text": "Tartu Mänguasjamuuseum."
          },
          {
            "id": "j",
            "text": "Emajõgi."
          },
          {
            "id": "k",
            "text": "Kaarisild."
          }
        ],
        "correctOptionId": "t"
      }
    },
    {
      "id": "lo-opik-u12-q091",
      "unitId": "lo-opik-u12",
      "stem": "Milline loend sisaldab ainult õpiku Tartu kaardi sildu?",
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g83",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõik kolm nimetatud silda on õpiku Tartu kesklinna kaardil.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "s",
            "text": "Kaarisild, Inglisild ja Kuradisild."
          },
          {
            "id": "m",
            "text": "Kaarisild, Raekoda ja Emajõgi."
          },
          {
            "id": "p",
            "text": "Toomemägi, Kaarisild ja Raekoda."
          },
          {
            "id": "t",
            "text": "Tartu Ülikooli peahoone, Inglisild ja Linnaraamatukogu."
          }
        ],
        "correctOptionId": "s"
      }
    },
    {
      "id": "lo-opik-u12-q092",
      "unitId": "lo-opik-u12",
      "stem": "Vaata Tartu kaardilt valitud objektide tabelit. Milline tähis viitab raamatukogule?",
      "context": {
        "kind": "table",
        "headers": [
          "Tähis",
          "Koht"
        ],
        "rows": [
          [
            "A",
            "Emajõgi"
          ],
          [
            "B",
            "Kaarisild"
          ],
          [
            "C",
            "Linnaraamatukogu"
          ],
          [
            "D",
            "Elektriteater"
          ]
        ],
        "caption": "Õpiku Tartu kaardil nimetatud kohad"
      },
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g90",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tabelis on C = Linnaraamatukogu, mille liik on raamatukogu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "a",
            "text": "A."
          },
          {
            "id": "b",
            "text": "B."
          },
          {
            "id": "c",
            "text": "C."
          },
          {
            "id": "d",
            "text": "D."
          }
        ],
        "correctOptionId": "c"
      }
    },
    {
      "id": "lo-opik-u12-q093",
      "unitId": "lo-opik-u12",
      "stem": "Otsid Tartu kaardil jõe ületamiseks silda. Milliseid kaardi elemente on kõige kasulikum koos kasutada?",
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g91",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jõe kujutis, sillamärk ja legend aitavad leida, kus teed ületavad jõge.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "j",
            "text": "Jõe asukohta."
          },
          {
            "id": "s",
            "text": "Silla leppemärki."
          },
          {
            "id": "l",
            "text": "Kaardi legendi."
          },
          {
            "id": "k",
            "text": "Hoonete katusekivide värvi."
          },
          {
            "id": "p",
            "text": "Apelsinikoore lõhesid."
          }
        ],
        "correctOptionIds": [
          "j",
          "s",
          "l"
        ]
      }
    },
    {
      "id": "lo-opik-u12-q094",
      "unitId": "lo-opik-u12",
      "stem": "Sa näed kaardil kahte hoonet. Ühe juures on teatrimärk, teise juures muuseumimärk. Kuidas leiad koha, kus saab vaadata näidendit?",
      "primaryObjectiveId": "lo-opik-u12-o8",
      "variantGroupId": "lo-opik-u12-g86",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Teatrimärk näitab kaardil etenduskoha liiki; muuseumimärk tähistab teist objekti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "53"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "t",
            "text": "Otsin legendist teatrimärgi ja valin sellega tähistatud hoone."
          },
          {
            "id": "m",
            "text": "Valin muuseumimärgiga hoone, sest märgid tähendavad sama."
          },
          {
            "id": "f",
            "text": "Vaatan ainult katuste suurust."
          },
          {
            "id": "v",
            "text": "Valin tingimata jõe sinise ala."
          }
        ],
        "correctOptionId": "t"
      }
    }
  ]
};
