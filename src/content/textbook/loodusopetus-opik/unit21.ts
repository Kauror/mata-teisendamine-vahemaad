// Unit 21 — Maavärinad. Õpik lk 78–81; kasutaja allika põhjal kirjutatud õppematerjal + tänapäevased ohutusjuhised.
// Ready for the parent-controlled publication switch; keep unpublished until approved.
// Safety advice follows today's CDC/USGS/NOAA guidance (drop, cover, hold on), not the outdated p 81 advice.
// Question IDs, variant-group IDs and source references are stable. 2026-10-17.2 = the package's
// 2026-10-17.1 with three integration fixes (q034 stem plural, q041 distractor, q109 explanation).
import type { Unit } from '@/lib/textbook/types';

export const unit21: Unit = {
  "id": "lo-opik-u21",
  "courseId": "loodusopetus-opik",
  "number": 21,
  "title": "Maavärinad",
  "pages": {
    "from": 78,
    "to": 81
  },
  "status": "ready",
  "contentVersion": "2026-10-17.2",
  "objectives": [
    {
      "id": "lo-opik-u21-o1",
      "description": "Oskan selgitada, kuidas laamade ja kivimite pingete äkiline vabanemine põhjustab maavärina.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes",
          "attribution": "USGS — The Science of Earthquakes",
          "note": "Maavärin tekib järsust murranguliikumisest; kolle ja epitsenter."
        }
      ]
    },
    {
      "id": "lo-opik-u21-o2",
      "description": "Eristan joonisel maavärina kollet, epitsentrit ja seismilisi laineid.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes",
          "attribution": "USGS — The Science of Earthquakes",
          "note": "Maavärin tekib järsust murranguliikumisest; kolle ja epitsenter."
        },
        {
          "kind": "supplementary",
          "url": "https://earthquake.usgs.gov/data/dyfi/background.php",
          "attribution": "USGS — What is intensity?",
          "note": "Suurim värisemine ja kahju ei pruugi olla epitsentris; pinnas ja hooned mõjutavad intensiivsust."
        }
      ]
    },
    {
      "id": "lo-opik-u21-o3",
      "description": "Tean, miks maavärinaid toimub palju laamade servaaladel ja tunnen näiteid maavärinaohtlikest piirkondadest.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes",
          "attribution": "USGS — The Science of Earthquakes",
          "note": "Maavärin tekib järsust murranguliikumisest; kolle ja epitsenter."
        }
      ]
    },
    {
      "id": "lo-opik-u21-o4",
      "description": "Tean, et tugevad maavärinad on Eestis haruldased, ning tunnen 1976. aasta Osmussaare maavärina näidet.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        },
        {
          "kind": "supplementary",
          "url": "https://egt.ee/uudised/eesti-maavarinad-kajastavad-laamade-liikumist",
          "attribution": "Eesti Geoloogiateenistus — Eesti maavärinad",
          "note": "25.10.1976 Osmussaare maavärin, magnituud umbes 4,5."
        },
        {
          "kind": "supplementary",
          "url": "https://egt.ee/tegevusvaldkonnad-ja-eesmargid/geoloogia-ja-elukeskkond/seismoloogilised-uuringud-ja-seire",
          "attribution": "Eesti Geoloogiateenistus — Seismoloogilised uuringud ja seire",
          "note": "Seismilised sündmused võivad olla looduslikud või inimtekkelised; arv \"100 maavärinat aastas\" ei ole kontrollitud fakt."
        }
      ]
    },
    {
      "id": "lo-opik-u21-o5",
      "description": "Mõistan, kuidas merepõhja järsk liikumine võib tekitada tsunami ja miks see võib rannikul ohtlikuks muutuda.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/special-topics/subduction-zone-science/science/faqs",
          "attribution": "USGS — Subduction zone science FAQs",
          "note": "Tsunami tekib vee kiirel nihkumisel; mitte iga merealune maavärin ei tekita tsunamit."
        }
      ]
    },
    {
      "id": "lo-opik-u21-o6",
      "description": "Tunnen tsunami võimalikke looduslikke hoiatusmärke ja oskan valida ohutu evakuatsioonisuuna.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/jetstream/prep-you",
          "attribution": "NOAA — Tsunami preparedness",
          "note": "Tugev või pikk raputus, vee muutumine ja mürin; kohe evakueerumine, ametlikku teadet ootamata."
        }
      ]
    },
    {
      "id": "lo-opik-u21-o7",
      "description": "Oskan valida maavärina ajal õige käitumise siseruumis ja õues.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
          "attribution": "CDC — Stay safe during an earthquake",
          "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-should-i-do-during-earthquake",
          "attribution": "USGS — What should I do during an earthquake?",
          "note": "Ära jookse raputamise ajal trepist ega välja; väldi aknaid ja lahtisi juhtmeid."
        }
      ]
    },
    {
      "id": "lo-opik-u21-o8",
      "description": "Oskan pärast maavärinat märgata ohte, arvestada järeltõugetega ja järgida ametlikke juhiseid.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
          "attribution": "CDC — Stay safe during an earthquake",
          "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u21-l1",
      "title": "Miks maa väriseb?",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u21-o1",
        "lo-opik-u21-o2"
      ],
      "sections": [
        {
          "id": "lo-opik-u21-s001",
          "title": "Laamad liiguvad kogu aeg",
          "blocks": [
            {
              "id": "lo-opik-u21-b001",
              "type": "paragraph",
              "text": "Maakera kõige välimine jäik kivimikiht on jagunenud suurteks laamadeks. Laamad liiguvad üksteise suhtes aeglaselt. Mõnes kohas jäävad nende servad või kivimiplokid aga üksteise taha kinni.",
              "source": {
                "kind": "textbook",
                "pages": "78"
              }
            },
            {
              "id": "lo-opik-u21-b002",
              "type": "paragraph",
              "text": "Kui liikumine takerdub, kasvab kivimites pinge. Pinge vabanemisel võib piki murrangut toimuda järsk nihkumine ning maapind hakkab värisema.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes",
                "attribution": "USGS — The Science of Earthquakes",
                "note": "Maavärin tekib järsust murranguliikumisest; kolle ja epitsenter."
              }
            },
            {
              "id": "lo-opik-u21-b003",
              "type": "diagram",
              "diagramId": "u21-plate-stress",
              "caption": "Lihtsustatud skeem näitab kinni jäänud kivimeid, kogunevat pinget ja äkilist nihkumist.",
              "source": {
                "kind": "textbook",
                "pages": "78"
              }
            },
            {
              "id": "lo-opik-u21-b004",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Laamad liiguvad väga aeglaselt.",
                "Järsk nihkumine ja pinge vabanemine põhjustavad maavärina."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u21-s002",
          "title": "Värisemise põhjustavad lained",
          "blocks": [
            {
              "id": "lo-opik-u21-b005",
              "type": "paragraph",
              "text": "Kui kivimid järsku liiguvad, levib vabanev energia Maa sees lainetena. Neid nimetatakse seismilisteks laineteks. Kui lained jõuavad maapinnani, tunneme raputamist.",
              "source": {
                "kind": "textbook",
                "pages": "78"
              }
            },
            {
              "id": "lo-opik-u21-b006",
              "type": "definition",
              "term": "Seismilised lained",
              "definition": "Maavärina käigus tekkinud energia lained, mis levivad läbi Maa ja mööda selle pinda.",
              "source": {
                "kind": "textbook",
                "pages": "78"
              }
            },
            {
              "id": "lo-opik-u21-b007",
              "type": "paragraph",
              "text": "Õpik võrdleb neid vette visatud kivi tekitatud lainetega. Võrdlus aitab ette kujutada, kuidas häiritud kohast hakkavad lained levima, kuid kivimis ei liigu vesi.",
              "source": {
                "kind": "textbook",
                "pages": "78"
              }
            },
            {
              "id": "lo-opik-u21-b008",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Seismilised lained panevad maapinna võnkuma."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u21-s003",
          "title": "Kolle on maa sees, epitsenter maapinnal",
          "blocks": [
            {
              "id": "lo-opik-u21-b009",
              "type": "paragraph",
              "text": "Maavärina kolle on koht Maa sees, kus järsk purunemine või nihkumine algab. Epitsenter on koht maapinnal otse kolde kohal. Need ei ole üks ja sama koht.",
              "source": {
                "kind": "textbook",
                "pages": "78"
              }
            },
            {
              "id": "lo-opik-u21-b010",
              "type": "diagram",
              "diagramId": "u21-focus-waves",
              "caption": "Koldepunkt maa sees, otse selle kohal paiknev epitsenter ja sealt levivad seismilised lained.",
              "source": {
                "kind": "textbook",
                "pages": "78"
              }
            },
            {
              "id": "lo-opik-u21-b011",
              "type": "definition",
              "term": "Maavärina kolle",
              "definition": "Koht Maa sees, kus maavärina järsk nihkumine algab.",
              "source": {
                "kind": "textbook",
                "pages": "78"
              }
            },
            {
              "id": "lo-opik-u21-b012",
              "type": "definition",
              "term": "Epitsenter",
              "definition": "Punkt maapinnal otse maavärina kolde kohal.",
              "source": {
                "kind": "textbook",
                "pages": "78"
              }
            }
          ]
        },
        {
          "id": "lo-opik-u21-s004",
          "title": "Kõige suurem kahju ei pea olema epitsentris",
          "blocks": [
            {
              "id": "lo-opik-u21-b013",
              "type": "paragraph",
              "text": "Õpik kirjeldab maavärina kõige tugevamat mõju epitsentri ümbruses. Sageli ongi raputamine seal tugev, kuid see ei ole absoluutne reegel: mõju sõltub ka kivimitest, pehmest pinnasest, kolde sügavusest ja hoonete ehitusest.",
              "source": {
                "kind": "supplementary",
                "url": "https://earthquake.usgs.gov/data/dyfi/background.php",
                "attribution": "USGS — What is intensity?",
                "note": "Suurim värisemine ja kahju ei pruugi olla epitsentris; pinnas ja hooned mõjutavad intensiivsust."
              }
            },
            {
              "id": "lo-opik-u21-b014",
              "type": "comparison",
              "title": "Ära aja segi",
              "columns": [
                {
                  "heading": "Kolle",
                  "points": [
                    "Asub maa sees.",
                    "Järsk nihkumine algab siin."
                  ]
                },
                {
                  "heading": "Epitsenter",
                  "points": [
                    "Asub maapinnal otse kolde kohal.",
                    "Ei tähenda automaatselt kõige suuremat purustust."
                  ]
                },
                {
                  "heading": "Lained",
                  "points": [
                    "Levivad kolde ümbrusest laiali.",
                    "Panevad maapinna värisema."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u21-b015",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Kolle = maa sees.",
                "Epitsenter = selle kohal maapinnal.",
                "Purustuste suurus sõltub mitmest asjaolust."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u21-l2",
      "title": "Kus maa väriseb?",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u21-o3",
        "lo-opik-u21-o4"
      ],
      "sections": [
        {
          "id": "lo-opik-u21-s005",
          "title": "Maavärinaid on palju laamade servadel",
          "blocks": [
            {
              "id": "lo-opik-u21-b016",
              "type": "paragraph",
              "text": "Enamik maavärinaid toimub laamade piiride lähedal. Seal võivad kivimiplokid üksteise vastu liikuda, kinni jääda ja järsku nihkuda.",
              "source": {
                "kind": "textbook",
                "pages": "79"
              }
            },
            {
              "id": "lo-opik-u21-b017",
              "type": "paragraph",
              "text": "Näiteks esineb maavärinaid Jaapani ümbruses, Vaikse ookeani idaranniku piirkondades ning Vahemere ümbruses. Ka Islandi all kulgeb laamapiir. Maavärinaid võib toimuda ka laamade sisemuses.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes",
                "attribution": "USGS — The Science of Earthquakes",
                "note": "Maavärin tekib järsust murranguliikumisest; kolle ja epitsenter."
              }
            },
            {
              "id": "lo-opik-u21-b018",
              "type": "diagram",
              "diagramId": "u21-world-locations",
              "caption": "Lihtsustatud maailmakaardil on märgitud mitu tuntud maavärinapiirkonda ja Eesti näitena stabiilsemas piirkonnas.",
              "source": {
                "kind": "textbook",
                "pages": "79"
              }
            },
            {
              "id": "lo-opik-u21-b019",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Palju maavärinaid toimub laamade piiridel.",
                "Väljaspool laamapiire on maavärinad võimalikud, kuid paljudes piirkondades harvemad."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u21-s006",
          "title": "Miks Eestis tuntakse maavärinaid harva?",
          "blocks": [
            {
              "id": "lo-opik-u21-b020",
              "type": "paragraph",
              "text": "Eesti paikneb suure laama sisemuses, kaugel enamikust aktiivsetest laamapiiridest. Seetõttu on tugevad, inimestele tuntavad maavärinad Eestis haruldased, kuid mitte võimatud.",
              "source": {
                "kind": "textbook",
                "pages": "79"
              }
            },
            {
              "id": "lo-opik-u21-b021",
              "type": "paragraph",
              "text": "Geoloogiateenistus jälgib Eestis maapinna võnkumisi. Mõnikord võivad mõõteriistad registreerida ka nõrku maavärinaid. Samuti eristatakse looduslikke maavärinaid inimtekkelistest seismilistest sündmustest, näiteks lõhkamistest.",
              "source": {
                "kind": "supplementary",
                "url": "https://egt.ee/tegevusvaldkonnad-ja-eesmargid/geoloogia-ja-elukeskkond/seismoloogilised-uuringud-ja-seire",
                "attribution": "Eesti Geoloogiateenistus — Seismoloogilised uuringud ja seire",
                "note": "Seismilised sündmused võivad olla looduslikud või inimtekkelised; arv \"100 maavärinat aastas\" ei ole kontrollitud fakt."
              }
            },
            {
              "id": "lo-opik-u21-b022",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Eestis võib maavärinaid toimuda, kuid tugevaid esineb väga harva."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u21-s007",
          "title": "1976. aasta Osmussaare maavärin",
          "blocks": [
            {
              "id": "lo-opik-u21-b023",
              "type": "paragraph",
              "text": "25. oktoobril 1976 toimus Osmussaare lähedal Eesti üks tugevamaid mõõdetud maavärinaid. Eesti Geoloogiateenistuse andmetel oli selle magnituud ligikaudu 4,5.",
              "source": {
                "kind": "supplementary",
                "url": "https://egt.ee/uudised/eesti-maavarinad-kajastavad-laamade-liikumist",
                "attribution": "Eesti Geoloogiateenistus — Eesti maavärinad",
                "note": "25.10.1976 Osmussaare maavärin, magnituud umbes 4,5."
              }
            },
            {
              "id": "lo-opik-u21-b024",
              "type": "paragraph",
              "text": "Õpiku kirjelduses tekkis Osmussaarel pangavarenguid ja ühe kivihoone seina suur pragu. Raputamist tunti ka Tallinnas: kõikusid lambid ja klirisesid aknad.",
              "source": {
                "kind": "textbook",
                "pages": "79"
              }
            },
            {
              "id": "lo-opik-u21-b025",
              "type": "table",
              "headers": [
                "Küsimus",
                "Vastus"
              ],
              "rows": [
                [
                  "Millal?",
                  "25. oktoobril 1976."
                ],
                [
                  "Kus?",
                  "Osmussaare lähedal."
                ],
                [
                  "Kas mõju tunti ka mujal?",
                  "Jah, näiteks Tallinnas."
                ]
              ],
              "caption": "Õpiku ajalooline näide"
            },
            {
              "id": "lo-opik-u21-b026",
              "type": "enrichment",
              "title": "Arvud vajavad kuupäeva",
              "variant": "extra",
              "body": [
                "Õpik toob välja ligikaudu sada nõrka Eesti maavärinat aastas. Seda arvu ei kasuta me ajatu kontrollküsimusena: tänapäevane seire registreerib ka inimtekkelisi raputusi ning tegelik aastane maavärinate arv tuleb võtta uuemast uuringust."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u21-s008",
          "title": "Kus oleks targem ehitada?",
          "blocks": [
            {
              "id": "lo-opik-u21-b027",
              "type": "paragraph",
              "text": "Maavärinaohtlikes piirkondades aitavad ohtu vähendada vastupidavamad hooned ja harjutatud tegutsemisplaan. Oluline pole ainult see, kui suur on maavärin, vaid ka see, milline on ehitis ja millisel pinnasel see asub.",
              "source": {
                "kind": "supplementary",
                "url": "https://earthquake.usgs.gov/data/dyfi/background.php",
                "attribution": "USGS — What is intensity?",
                "note": "Suurim värisemine ja kahju ei pruugi olla epitsentris; pinnas ja hooned mõjutavad intensiivsust."
              }
            },
            {
              "id": "lo-opik-u21-b028",
              "type": "diagram",
              "diagramId": "u21-plate-stress",
              "caption": "Laamapiiri näidisskeem: järsk nihe võib raputada pinda ka kaugemal.",
              "source": {
                "kind": "textbook",
                "pages": "79"
              }
            },
            {
              "id": "lo-opik-u21-b029",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Maavärinapiirkonna tundmine ja tugevam ehitus vähendavad ohtu."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u21-l3",
      "title": "Tsunami — ohtlik hiidlaine",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u21-o5",
        "lo-opik-u21-o6"
      ],
      "sections": [
        {
          "id": "lo-opik-u21-s009",
          "title": "Mis on tsunami?",
          "blocks": [
            {
              "id": "lo-opik-u21-b030",
              "type": "paragraph",
              "text": "Tsunami on suurte merelainete seeria, mis võib tekkida siis, kui suur veemass järsku liikuma pannakse. Üks tuntud põhjus on veealune maavärin, mille käigus merepõhi nihkub ja tõstab või langetab selle kohal olevat vett.",
              "source": {
                "kind": "textbook",
                "pages": "80"
              }
            },
            {
              "id": "lo-opik-u21-b031",
              "type": "paragraph",
              "text": "Mitte iga merealune maavärin ei tekita tsunamit. Tsunami võib tekkida ka suure veealuse maalihke või vulkaanilise tegevuse tõttu.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/special-topics/subduction-zone-science/science/faqs",
                "attribution": "USGS — Subduction zone science FAQs",
                "note": "Tsunami tekib vee kiirel nihkumisel; mitte iga merealune maavärin ei tekita tsunamit."
              }
            },
            {
              "id": "lo-opik-u21-b032",
              "type": "definition",
              "term": "Tsunami",
              "definition": "Äkilise suure veemassi nihkumise tõttu tekkinud ohtlik merelainete seeria.",
              "source": {
                "kind": "textbook",
                "pages": "80"
              }
            },
            {
              "id": "lo-opik-u21-b033",
              "type": "diagram",
              "diagramId": "u21-tsunami-stages",
              "caption": "Merepõhja järsk nihkumine, lainete levik avamerel ja vee mõju rannikul.",
              "source": {
                "kind": "textbook",
                "pages": "80"
              }
            }
          ]
        },
        {
          "id": "lo-opik-u21-s010",
          "title": "Avamerel ja rannas on tsunami erinev",
          "blocks": [
            {
              "id": "lo-opik-u21-b034",
              "type": "paragraph",
              "text": "Avamerel võib tsunami laine olla lauge ja laeval vähe märgatav. Madalamas rannikuvees võib see aeglustuda, kerkida kõrgemaks ning tungida suure jõuga maismaale.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
                "attribution": "NOAA — Tsunamis",
                "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
              }
            },
            {
              "id": "lo-opik-u21-b035",
              "type": "paragraph",
              "text": "Tsunami ei pruugi saabuda ühe kõrge veeseinana. See võib sarnaneda kiire üleujutusega. Ohtlikke laineid võib olla mitu ning esimene ei pruugi olla suurim.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
                "attribution": "NOAA — Tsunamis",
                "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
              }
            },
            {
              "id": "lo-opik-u21-b036",
              "type": "comparison",
              "title": "Tsunami eri kohtades",
              "columns": [
                {
                  "heading": "Avamerel",
                  "points": [
                    "Laine võib olla madal ja väga pikk.",
                    "Liigub väga kiiresti."
                  ]
                },
                {
                  "heading": "Ranniku lähedal",
                  "points": [
                    "Vesi võib kuhjuda ja jõuga maismaale tungida.",
                    "Oht püsib mitme laine jooksul."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u21-b037",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Avamere madal laine võib rannikul muutuda väga ohtlikuks.",
                "Esimene tsunami laine ei pruugi olla kõige suurem."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u21-s011",
          "title": "Märka tsunami looduslikke hoiatusmärke",
          "blocks": [
            {
              "id": "lo-opik-u21-b038",
              "type": "paragraph",
              "text": "Kui oled mere ääres ja tunned tugevat või pikalt kestvat maavärinat, võib see olla tsunami looduslik hoiatus. Samuti võib merevesi ebatavaliselt kiiresti taanduda või tõusta. Mõnikord kostab merelt tugev mühin.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.noaa.gov/jetstream/prep-you",
                "attribution": "NOAA — Tsunami preparedness",
                "note": "Tugev või pikk raputus, vee muutumine ja mürin; kohe evakueerumine, ametlikku teadet ootamata."
              }
            },
            {
              "id": "lo-opik-u21-b039",
              "type": "paragraph",
              "text": "Kõiki neid märke ei pruugi alati esineda. Ühest usaldusväärsest ohumärgist piisab, et hakata ohutult tegutsema.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
                "attribution": "NOAA — Tsunamis",
                "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
              }
            },
            {
              "id": "lo-opik-u21-b040",
              "type": "diagram",
              "diagramId": "u21-tsunami-warnings",
              "caption": "Kolm võimalikku tsunami märki: tugev raputamine, äkiliselt muutuv rannavesi ja ebatavaline mühin.",
              "source": {
                "kind": "textbook",
                "pages": "80"
              }
            },
            {
              "id": "lo-opik-u21-b041",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Ära mine merevee taandumist vaatama!",
                "Ära oota rannas ametlikku teadet, kui märkad looduslikku hoiatust."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u21-s012",
          "title": "Ohutu tee viib kõrgemale ja sisemaale",
          "blocks": [
            {
              "id": "lo-opik-u21-b042",
              "type": "paragraph",
              "text": "Kui rannas oli tugev või pikk maavärin, kaitse end esmalt raputamise ajal. Niipea kui saad turvaliselt liikuda, mine kiiresti kõrgemale või sisemaale. Järgi evakuatsioonitähiseid ja ametnike juhiseid.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.noaa.gov/jetstream/prep-you",
                "attribution": "NOAA — Tsunami preparedness",
                "note": "Tugev või pikk raputus, vee muutumine ja mürin; kohe evakueerumine, ametlikku teadet ootamata."
              }
            },
            {
              "id": "lo-opik-u21-b043",
              "type": "diagram",
              "diagramId": "u21-coastal-escape",
              "caption": "Rannalt ohutusse kõrgemasse piirkonda või sisemaale viiv evakuatsioonisuund.",
              "source": {
                "kind": "textbook",
                "pages": "80"
              }
            },
            {
              "id": "lo-opik-u21-b044",
              "type": "list",
              "ordered": true,
              "items": [
                "Ära jää randa vett jälgima.",
                "Liigu ohutusse kõrgemasse kohta või sisemaale.",
                "Hoia täiskasvanute lähedusse ja järgi kohalikke ohuteateid.",
                "Ära mine tagasi enne, kui ametiasutused ütlevad, et see on ohutu."
              ]
            },
            {
              "id": "lo-opik-u21-b045",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Tugev/pikk maavärin rannikul → pärast raputuse lõppu kiiresti kõrgemale või sisemaale."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u21-l4",
      "title": "Kuidas maavärina ajal õigesti tegutseda?",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u21-o7",
        "lo-opik-u21-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u21-s013",
          "title": "Siseruumis: küki, varju, hoia kinni",
          "blocks": [
            {
              "id": "lo-opik-u21-b046",
              "type": "paragraph",
              "text": "Kui oled maavärina ajal hoones, ära jookse raputamise kestel välja ega keldrisse. Küki põrandale, varju tugeva laua alla või kaitse pea ja kael ning hoia kinni, kuni värisemine lakkab.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
                "attribution": "CDC — Stay safe during an earthquake",
                "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
              }
            },
            {
              "id": "lo-opik-u21-b047",
              "type": "diagram",
              "diagramId": "u21-drop-cover-hold",
              "caption": "Kolm järjestikust maavärina-aegset kaitsetoimingut ning akna kui ohu märk.",
              "source": {
                "kind": "textbook",
                "pages": "81"
              }
            },
            {
              "id": "lo-opik-u21-b048",
              "type": "list",
              "ordered": true,
              "items": [
                "Küki põrandale — nii ei kuku kergesti.",
                "Varju tugeva laua alla ja kaitse pead ning kaela.",
                "Hoia kinni, kuni raputamine lõpeb."
              ]
            },
            {
              "id": "lo-opik-u21-b049",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Kui oled sees, jää raputamise ajal sisse.",
                "Küki – varju – hoia kinni."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u21-s014",
          "title": "Õues: liigu eemale sellest, mis võib kukkuda",
          "blocks": [
            {
              "id": "lo-opik-u21-b050",
              "type": "paragraph",
              "text": "Kui oled juba õues, jää õue. Mine võimaluse korral avatud paika, eemale hoonetest, akendest, puudest ja elektriliinidest. Kaitse oma pead.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
                "attribution": "CDC — Stay safe during an earthquake",
                "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
              }
            },
            {
              "id": "lo-opik-u21-b051",
              "type": "diagram",
              "diagramId": "u21-outdoors",
              "caption": "Õues on tähistatud avatud turvalisem ala, hoone lähedus ja elektrijuhtmed.",
              "source": {
                "kind": "textbook",
                "pages": "81"
              }
            },
            {
              "id": "lo-opik-u21-b052",
              "type": "comparison",
              "title": "Erinev koht, erinev tegevus",
              "columns": [
                {
                  "heading": "Hoones",
                  "points": [
                    "Ära jookse raputamise ajal välja.",
                    "Küki, varju tugeva laua alla ja hoia kinni."
                  ]
                },
                {
                  "heading": "Õues",
                  "points": [
                    "Liigu avatud alale.",
                    "Hoia hoonetest, puudest ja juhtmetest eemale."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u21-b053",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Õues väldi ohtlikke kukkumiskohti ja elektriliine."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u21-s015",
          "title": "Pärast raputamist tuleb ohtusid uuesti hinnata",
          "blocks": [
            {
              "id": "lo-opik-u21-b054",
              "type": "paragraph",
              "text": "Pärast maavärinat võivad tulla järeltõuked. Nende täpset algusaega ei ole võimalik usaldusväärselt ette öelda. Vaata ette kahjustatud hoonete, klaasikildude ja langenud elektrijuhtmete eest. Kui hoone on ohtlik, lahku sellest pärast raputuse lõppu ohutult ja täiskasvanute juhendamisel.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/faqs/what-should-i-do-during-earthquake",
                "attribution": "USGS — What should I do during an earthquake?",
                "note": "Ära jookse raputamise ajal trepist ega välja; väldi aknaid ja lahtisi juhtmeid."
              }
            },
            {
              "id": "lo-opik-u21-b055",
              "type": "paragraph",
              "text": "Otsi turvalises paigas teavet ametlikest ohuteadetest ja hoia täiskasvanute lähedusse. Elektrikatkestuse korral võib kasuks tulla patareidel töötav raadio.",
              "source": {
                "kind": "textbook",
                "pages": "81"
              }
            },
            {
              "id": "lo-opik-u21-b056",
              "type": "diagram",
              "diagramId": "u21-aftershock-safety",
              "caption": "Pärast maavärinat: langenud elektrijuhe, kahjustatud sein ja ametlikke teateid edastav raadio.",
              "source": {
                "kind": "textbook",
                "pages": "81"
              }
            },
            {
              "id": "lo-opik-u21-b057",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Ära puuduta langenud elektrijuhet.",
                "Ole valmis järeltõukeks.",
                "Järgi täiskasvanute ja päästjate juhiseid."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u21-s016",
          "title": "Pane õpiku juhised tänapäevasesse korda",
          "blocks": [
            {
              "id": "lo-opik-u21-b058",
              "type": "paragraph",
              "text": "Õpiku lk 81 soovitab raputamise ajal hoonest lahkuda või võimaluse korral keldrisse varjuda. Tänapäevased USGSi ja CDC üldjuhised rõhutavad vastupidist: kui oled toas, jää raputamise ajaks sisse ja varju. Hoonest välju alles siis, kui raputamine on lõppenud ja lahkumine on ohutu.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
                "attribution": "CDC — Stay safe during an earthquake",
                "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
              }
            },
            {
              "id": "lo-opik-u21-b059",
              "type": "table",
              "headers": [
                "Olukord",
                "Turvalisem tegevus"
              ],
              "rows": [
                [
                  "Oled klassiruumis ja maa hakkab värisema.",
                  "Küki, varju tugeva laua alla, hoia kinni."
                ],
                [
                  "Oled tänaval.",
                  "Liigu hoonetest ja elektriliinidest eemale avatud kohta."
                ],
                [
                  "Oled pärast tugevat raputust rannal.",
                  "Liigu kiiresti kõrgemale või sisemaale."
                ],
                [
                  "Näed maha langenud elektrijuhet.",
                  "Ära puuduta, hoia eemale ja teavita täiskasvanut."
                ]
              ],
              "caption": "Neli näidet, neli õiget otsust"
            },
            {
              "id": "lo-opik-u21-b060",
              "type": "enrichment",
              "title": "Miks on eri juhised?",
              "variant": "extra",
              "body": [
                "Maavärinate kohta on ohutussoovitused ajaga muutunud. Lapsele ei tohiks õpetada välja jooksmist, kui hoone alles väriseb: langevad osad ja klaasid on ohtlikud. Kohalikud päästjad võivad anda olukorrale vastavaid täpsemaid korraldusi."
              ]
            },
            {
              "id": "lo-opik-u21-b061",
              "type": "externalResource",
              "title": "Maavärina ohutusjuhis",
              "intro": "Vabatahtlik täiskasvanuga uurimiseks.",
              "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
              "publisher": "CDC",
              "resourceType": "article",
              "observe": "Leia juhis Drop, Cover, Hold On."
            },
            {
              "id": "lo-opik-u21-b062",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Tunne tekkepõhjusi ja tegutse ohutult: maavärinad on ettearvamatud, kuid valmistuda saab."
              ]
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u21-q001",
      "unitId": "lo-opik-u21",
      "stem": "Mis võib juhtuda, kui liikuvate laamade servad jäävad üksteise taha kinni?",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-stress-a",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kinni jäänud kivimiplokid takistavad liikumist ning nende vahel koguneb pinge.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kivimitesse koguneb pinge."
          },
          {
            "id": "i2",
            "text": "Laamade liikumine lakkab igaveseks."
          },
          {
            "id": "i3",
            "text": "Kõik kivimid muutuvad mereveeks."
          },
          {
            "id": "i4",
            "text": "Maavärin ei saa enam toimuda."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q002",
      "unitId": "lo-opik-u21",
      "stem": "Miks võib aeglaselt liikuvate laamade juures toimuda järsk maavärin?",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-stress-a",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Liikumine võib takerduda; kui kivimid järele annavad, toimub järsk nihe.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Pinged kuhjuvad ja vabanevad järsu nihkena."
          },
          {
            "id": "i2",
            "text": "Laamad põrkavad iga päev kokku nagu pallid."
          },
          {
            "id": "i3",
            "text": "Maa pöörlemine katkeb hetkeks."
          },
          {
            "id": "i4",
            "text": "Ookeanilained raputavad kogu maakera."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q003",
      "unitId": "lo-opik-u21",
      "stem": "Mis vabastab kivimitesse kogunenud pinge maavärina alguses?",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-stress-b",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärin on seotud kivimite järsu nihkumise ja sellest vabaneva energiaga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes",
          "attribution": "USGS — The Science of Earthquakes",
          "note": "Maavärin tekib järsust murranguliikumisest; kolle ja epitsenter."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kivimite järsk nihkumine murrangul"
          },
          {
            "id": "i2",
            "text": "Pilvede liikumine üle mägede"
          },
          {
            "id": "i3",
            "text": "Vulkaanide väljalülitumine"
          },
          {
            "id": "i4",
            "text": "Merevee aurustumine"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q004",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: iga maavärin algab sellest, et kogu maakoor liigub korraga ühe tükina.",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-stress-b",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärin algab tavaliselt ühe murrangu piirkonnas toimuvast järsust nihkest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
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
      "id": "lo-opik-u21-q005",
      "unitId": "lo-opik-u21",
      "stem": "Millised väited kirjeldavad laamade liikumist õigesti?",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-movement-slow",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamad liiguvad aeglaselt ning takerdumise tõttu võib kivimites pinge kasvada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Laamad liiguvad tavaliselt väga aeglaselt."
          },
          {
            "id": "i2",
            "text": "Kivimiplokid võivad omavahel takerduda."
          },
          {
            "id": "i3",
            "text": "Laamad liiguvad üksnes maavärina toimumise hetkel."
          },
          {
            "id": "i4",
            "text": "Laamad ei saa kunagi pinget koguda."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u21-q006",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: kui laamad liiguvad aeglaselt, ei saa need maavärinat tekitada.",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-movement-slow",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aeglase liikumise ajal saab kuhjuda pinge, mis vallandub järsu nihkena.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
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
      "id": "lo-opik-u21-q007",
      "unitId": "lo-opik-u21",
      "stem": "Sea maavärina tekkimine õigesse järjekorda.",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-cause-sequence",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Liikumine ja pinge kuhjumine eelnevad järsule nihkele; seejärel levivad lained.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Laamad liiguvad aeglaselt."
          },
          {
            "id": "i2",
            "text": "Kivimiplokid takerduvad ja pinge koguneb."
          },
          {
            "id": "i3",
            "text": "Toimub järsk nihkumine."
          },
          {
            "id": "i4",
            "text": "Maapind hakkab lainete tõttu värisema."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ],
        "firstLabel": "Algus",
        "lastLabel": "Lõpp"
      }
    },
    {
      "id": "lo-opik-u21-q008",
      "unitId": "lo-opik-u21",
      "stem": "Milline sündmuste jada kirjeldab maavärinat õigesti?",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-cause-sequence",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõigepealt koguneb pinge, siis toimub järsk nihe ja lõpuks levivad lained.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Pinge koguneb → kivimid nihkuvad → lained levivad"
          },
          {
            "id": "i2",
            "text": "Lained levivad → pinge kaob enne liikumist → laamad tarduvad"
          },
          {
            "id": "i3",
            "text": "Merevesi tõuseb → maa pöörleb → kivimid liiguvad"
          },
          {
            "id": "i4",
            "text": "Pilved kogunevad → mägi vajub → laam tekib"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q009",
      "unitId": "lo-opik-u21",
      "stem": "Leia joonisel koht, kus liikumine on takerdunud.",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-stress-pick",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Liikumine takerdub näites kahe kivimiploki kokkupuutepiirkonnas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-plate-stress",
        "correctRegionId": "locked"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-plate-stress"
      }
    },
    {
      "id": "lo-opik-u21-q010",
      "unitId": "lo-opik-u21",
      "stem": "Milline tähis näitab kivimites kogunevat pinget?",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-stress-pick",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Skeemi nooled tähistavad pinge kogunemist enne järsku nihkumist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-plate-stress",
        "correctRegionId": "stored-stress"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-plate-stress"
      }
    },
    {
      "id": "lo-opik-u21-q011",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta skeemil äkilise nihkumise piirkonda.",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-stress-pick",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärina tekkega seotud järsk nihe toimub murrangul.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-plate-stress",
        "correctRegionId": "slip"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-plate-stress"
      }
    },
    {
      "id": "lo-opik-u21-q012",
      "unitId": "lo-opik-u21",
      "stem": "Ühenda sündmus ja selle tähendus.",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-cause-sequence",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamade aeglane liikumine, pinge kogunemine ja järsk nihe on seotud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Laama aeglane liikumine"
          },
          {
            "id": "p2",
            "text": "Kivimite takerdumine"
          },
          {
            "id": "p3",
            "text": "Äkiline nihe"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "muudab kivimiplokkide asendit"
          },
          {
            "id": "c2",
            "text": "võimaldab pingel kuhjuda"
          },
          {
            "id": "c3",
            "text": "vabastab maavärina energia"
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
      "id": "lo-opik-u21-q013",
      "unitId": "lo-opik-u21",
      "stem": "Rühmita väited: kas need kirjeldavad maavärina tekkimist?",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-cause-yesno",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärina tekkimist selgitavad takerdumine, pinge ja järsk nihe.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "jah",
            "text": "Seotud maavärina tekkega"
          },
          {
            "id": "ei",
            "text": "Ei selgita maavärina tekkimist"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Kivimiplokid takerduvad."
          },
          {
            "id": "i2",
            "text": "Kivimites kasvab pinge."
          },
          {
            "id": "i3",
            "text": "Piki murrangut toimub järsk nihkumine."
          },
          {
            "id": "i4",
            "text": "Päike paistab mägedele."
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
      "id": "lo-opik-u21-q014",
      "unitId": "lo-opik-u21",
      "stem": "Mida tähendab maavärin?",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-what-is-earthquake",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärin tähendab maapinna võnkumist Maa sisemiste pingete vabanemise tõttu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Maapinna värisemist, mille põhjustavad Maa sisemised protsessid"
          },
          {
            "id": "i2",
            "text": "Ainult merevee kõrget lainet"
          },
          {
            "id": "i3",
            "text": "Ainult vulkaanituha langemist"
          },
          {
            "id": "i4",
            "text": "Tuule tekitatud võnkumist pilvedes"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q015",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: maavärin ja vulkaanipurse tähendavad täpselt sama sündmust.",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-what-is-earthquake",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärina puhul vabanevad kivimites pinged; vulkaanipurskel jõuab pinnale vulkaaniline materjal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
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
      "id": "lo-opik-u21-q016",
      "unitId": "lo-opik-u21",
      "stem": "Kuidas nimetatakse kivimite purunemis- või nihkumispinda, millel maavärin võib tekkida?",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-what-is-fault",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Murrangul võivad kivimiplokid üksteise suhtes järsku nihkuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes",
          "attribution": "USGS — The Science of Earthquakes",
          "note": "Maavärin tekib järsust murranguliikumisest; kolle ja epitsenter."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Murranguks"
          },
          {
            "id": "i2",
            "text": "Pilvepiiriks"
          },
          {
            "id": "i3",
            "text": "Jõekääruks"
          },
          {
            "id": "i4",
            "text": "Rannajooneks"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q017",
      "unitId": "lo-opik-u21",
      "stem": "Vali laused, mis sobivad maavärina põhjust selgitama.",
      "primaryObjectiveId": "lo-opik-u21-o1",
      "variantGroupId": "lo-opik-u21-stress-a",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärina põhjuseks on pingete kuhjumine ja järsk vabastav nihkumine.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Laamad liiguvad aeglaselt."
          },
          {
            "id": "i2",
            "text": "Kivimites võib pinge koguneda."
          },
          {
            "id": "i3",
            "text": "Pinge võib vabaneda järsu nihkega."
          },
          {
            "id": "i4",
            "text": "Maavärin algab alati rannal."
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
      "id": "lo-opik-u21-q018",
      "unitId": "lo-opik-u21",
      "stem": "Mis on maavärina kolle?",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-focus-term",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kolle on maavärina alguskoht Maa sees.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Koht maa sees, kust maavärina järsk nihkumine algab"
          },
          {
            "id": "i2",
            "text": "Maa pöörlemistelje ülemine ots"
          },
          {
            "id": "i3",
            "text": "Koht, kuhu kõik mereveed kogunevad"
          },
          {
            "id": "i4",
            "text": "Iga maavärinas kahjustatud maja"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q019",
      "unitId": "lo-opik-u21",
      "stem": "Mis on maavärina epitsenter?",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-epicenter-term",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Epitsenter asub maapinnal otse maa-aluse kolde kohal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Koht maapinnal otse kolde kohal"
          },
          {
            "id": "i2",
            "text": "Kõige sügavam koht maailmameres"
          },
          {
            "id": "i3",
            "text": "Koht maa sees alati 3000 km sügavusel"
          },
          {
            "id": "i4",
            "text": "Kogu ala, kus lained levivad"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q020",
      "unitId": "lo-opik-u21",
      "stem": "Vali seismiliste lainete kohta õiged väited.",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-seismic-term",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Seismilised lained levivad maavärina koldest ja võivad maapinda raputada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Lained levivad läbi Maa."
          },
          {
            "id": "i2",
            "text": "Lained võivad panna maapinna võnkuma."
          },
          {
            "id": "i3",
            "text": "Seismilised lained on alati merelained."
          },
          {
            "id": "i4",
            "text": "Lained tekivad ainult pilvedes."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u21-q021",
      "unitId": "lo-opik-u21",
      "stem": "Miks paiknevad kolle ja epitsenter eri kohtades?",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-focus-epi-rel",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Need on erinevas sügavuses, kuid sama vertikaali kohal paiknevad kohad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kolle asub maa sees, epitsenter on selle kohal pinnal."
          },
          {
            "id": "i2",
            "text": "Kolle on alati meres, epitsenter alati metsas."
          },
          {
            "id": "i3",
            "text": "Kolle on nähtamatu ookean, epitsenter jõgi."
          },
          {
            "id": "i4",
            "text": "Epitsenter on alati sügavamal kui kolle."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q022",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: maavärina epitsenter asub maavärina kolde kohal maapinnal.",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-focus-epi-rel",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärina epitsenter on pinnapunkt otse kolde kohal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
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
      "id": "lo-opik-u21-q023",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta läbilõikel maavärina kollet.",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-focus-term",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kolle on skeemil maa-alune punkti kujuline maavärina alguskoht.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-focus-waves",
        "correctRegionId": "focus"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-focus-waves"
      }
    },
    {
      "id": "lo-opik-u21-q024",
      "unitId": "lo-opik-u21",
      "stem": "Leia skeemilt epitsenter.",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-epicenter-term",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Epitsenter on maapinnal otse kolde kohal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-focus-waves",
        "correctRegionId": "epicenter"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-focus-waves"
      }
    },
    {
      "id": "lo-opik-u21-q025",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta skeemil seismiliste lainete tähist.",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-seismic-term",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Seismilised lained levivad maavärina koldest läbi kivimite.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-focus-waves",
        "correctRegionId": "waves"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-focus-waves"
      }
    },
    {
      "id": "lo-opik-u21-q026",
      "unitId": "lo-opik-u21",
      "stem": "Milline tähis märgib kivimite murrangut?",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-fault-diagram",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Murrang on lõhe või nihkepind, millel kivimid liikusid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-focus-waves",
        "correctRegionId": "fault"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-focus-waves"
      }
    },
    {
      "id": "lo-opik-u21-q027",
      "unitId": "lo-opik-u21",
      "stem": "Järjesta lihtsustatud sündmused nende algusest pinnale mõju jõudmiseni.",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-focus-order",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Seismilised lained kannavad Maa sees vabanenud energia pinnale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Maa sees algab järsk nihkumine."
          },
          {
            "id": "i2",
            "text": "Koldest levivad seismilised lained."
          },
          {
            "id": "i3",
            "text": "Lained jõuavad maapinnani."
          },
          {
            "id": "i4",
            "text": "Inimesed tunnevad maapinna värisemist."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ],
        "firstLabel": "Algus",
        "lastLabel": "Lõpp"
      }
    },
    {
      "id": "lo-opik-u21-q028",
      "unitId": "lo-opik-u21",
      "stem": "Ühenda mõiste ja asukoht või kirjeldus.",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-focus-epi-rel",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kolle, epitsenter ja lained tähendavad kolme eri asja.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Kolle"
          },
          {
            "id": "p2",
            "text": "Epitsenter"
          },
          {
            "id": "p3",
            "text": "Seismilised lained"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "maavärina alguskoht maa sees"
          },
          {
            "id": "c2",
            "text": "kolde kohal maapinnal"
          },
          {
            "id": "c3",
            "text": "maa sees ja pinnal leviv võnkumine"
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
      "id": "lo-opik-u21-q029",
      "unitId": "lo-opik-u21",
      "stem": "Rühmita kirjeldused nende asukoha järgi.",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-focus-group",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kolle asub maa sees ning epitsenter selle kohal pinnal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "earth",
            "text": "Maa sees"
          },
          {
            "id": "surface",
            "text": "Maapinnal"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Maavärina alguskoht ehk kolle"
          },
          {
            "id": "i2",
            "text": "Seismiliste lainete alguskoht"
          },
          {
            "id": "i3",
            "text": "Epitsenter"
          },
          {
            "id": "i4",
            "text": "Inimene tunneb maapinna raputamist"
          }
        ],
        "correctGroupByItem": {
          "i1": "earth",
          "i2": "earth",
          "i3": "surface",
          "i4": "surface"
        }
      }
    },
    {
      "id": "lo-opik-u21-q030",
      "unitId": "lo-opik-u21",
      "stem": "Kas kõige suuremad purustused peavad olema alati täpselt epitsentris?",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-intensity-nuance",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Epitsenter on asukohamõiste, mitte kindel suurima kahju punkt.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        },
        {
          "kind": "supplementary",
          "url": "https://earthquake.usgs.gov/data/dyfi/background.php",
          "attribution": "USGS — What is intensity?",
          "note": "Suurim värisemine ja kahju ei pruugi olla epitsentris; pinnas ja hooned mõjutavad intensiivsust."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Ei, mõju sõltub ka pinnasest, hoonetest ja maavärinast."
          },
          {
            "id": "i2",
            "text": "Jah, alati on suurim kahju epitsentris."
          },
          {
            "id": "i3",
            "text": "Ei, epitsentris ei värise kunagi."
          },
          {
            "id": "i4",
            "text": "Jah, mujal maavärinat tunda ei saa."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q031",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: kaks sama kauget kohta võivad maavärinat erinevalt tunda.",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-intensity-nuance",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pehme pinnas, hoonete erinevused ja laine levimine võivad raputamist mõjutada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        },
        {
          "kind": "supplementary",
          "url": "https://earthquake.usgs.gov/data/dyfi/background.php",
          "attribution": "USGS — What is intensity?",
          "note": "Suurim värisemine ja kahju ei pruugi olla epitsentris; pinnas ja hooned mõjutavad intensiivsust."
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
      "id": "lo-opik-u21-q032",
      "unitId": "lo-opik-u21",
      "stem": "Millega võrreldakse õpikus seismiliste lainete levikut?",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-analogy-waves",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku võrdluses levivad lained kivi vette kukkumise kohast eemale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vette kukkunud kivi ümber levivate lainetega"
          },
          {
            "id": "i2",
            "text": "Õhupalli värvi muutumisega"
          },
          {
            "id": "i3",
            "text": "Puu lehtede sügisese värvumisega"
          },
          {
            "id": "i4",
            "text": "Jõe külmumisega"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q033",
      "unitId": "lo-opik-u21",
      "stem": "Mida näitab veelaine võrdlus maavärinalainete kohta?",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-analogy-waves",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Võrdluses levib energia edasi, kuid see ei tähenda vee liikumist läbi kivimite.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Häiritud kohast levib võnkumine edasi."
          },
          {
            "id": "i2",
            "text": "Maa sees voolab lausa ookeanivesi."
          },
          {
            "id": "i3",
            "text": "Lained liiguvad ainult maapinnal."
          },
          {
            "id": "i4",
            "text": "Kivimid muutuvad veeks."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q034",
      "unitId": "lo-opik-u21",
      "stem": "Millised väited epitsentri asukoha kohta on õiged?",
      "primaryObjectiveId": "lo-opik-u21-o2",
      "variantGroupId": "lo-opik-u21-epi-above",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Epitsenter on pinnapunkt maa-aluse kolde kohal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "78"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Epitsenter asub maapinnal."
          },
          {
            "id": "i2",
            "text": "Epitsenter asub kolde kohal."
          },
          {
            "id": "i3",
            "text": "Epitsenter peab asuma ookeani põhjas."
          },
          {
            "id": "i4",
            "text": "Epitsenter ja kolle on sama sügavusega."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u21-q035",
      "unitId": "lo-opik-u21",
      "stem": "Kus toimub suur osa maailma maavärinatest?",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-edge-majority",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Enamik maavärinaid on seotud laamapiiride ja sealsete murrangutega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Laamade piiride lähedal"
          },
          {
            "id": "i2",
            "text": "Ainult polaarjoonel"
          },
          {
            "id": "i3",
            "text": "Ainult suurte jõgede suudmetes"
          },
          {
            "id": "i4",
            "text": "Üksnes kõrbete keskosas"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q036",
      "unitId": "lo-opik-u21",
      "stem": "Miks esineb laamade piiridel palju maavärinaid?",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-edge-majority",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamapiiridel on kivimiplokkide suhteline liikumine sagedane.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Seal võivad kivimid takerduda ja järsku nihkuda."
          },
          {
            "id": "i2",
            "text": "Seal ei liigu kivimid kunagi."
          },
          {
            "id": "i3",
            "text": "Seal on alati kõige rohkem vihma."
          },
          {
            "id": "i4",
            "text": "Seal tekitavad lainetust üksnes laevad."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q037",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: kõik maailma maavärinad toimuvad ainult laamade piiridel.",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-edge-not-all",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärinaid võib toimuda ka laamade sisemuses, kuigi neid on paljudes sellistes piirkondades harvem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
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
      "id": "lo-opik-u21-q038",
      "unitId": "lo-opik-u21",
      "stem": "Kas kaugel laamade piiridest võib siiski maavärin toimuda?",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-edge-not-all",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Väiksemaid või harvemaid maavärinaid leidub ka laamade sisemuses.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Jah, mõnikord toimub maavärinaid ka laama sees."
          },
          {
            "id": "i2",
            "text": "Ei, laama sees ei saa kivim üldse nihkuda."
          },
          {
            "id": "i3",
            "text": "Ainult siis, kui sinna voolab kuumaveeallikas."
          },
          {
            "id": "i4",
            "text": "Ainult siis, kui kaardile joonistatakse uus riik."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q039",
      "unitId": "lo-opik-u21",
      "stem": "Millises õpitud piirkonnas esineb sageli tugevaid maavärinaid?",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-world-japan",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jaapan asub aktiivsete laamapiiride piirkonnas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Jaapani ümbruses"
          },
          {
            "id": "i2",
            "text": "Eesti keskosas igal nädalal"
          },
          {
            "id": "i3",
            "text": "Sahara kõigi osade keskel"
          },
          {
            "id": "i4",
            "text": "Lõunapoolusel iga päev"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q040",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta lihtsustatud maailmakaardil Jaapani ümbrust.",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-world-japan",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jaapan asub Ida-Aasia lähedal Vaikse ookeani loodeserval.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-world-locations",
        "correctRegionId": "japan"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-world-locations"
      }
    },
    {
      "id": "lo-opik-u21-q041",
      "unitId": "lo-opik-u21",
      "stem": "Milline Euroopa lähedal asuv saar paikneb aktiivsel laamapiiril?",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-world-iceland",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Islandi all kulgeb Atlandi ookeani keskaheliku piirkonna laamapiir.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Island"
          },
          {
            "id": "i2",
            "text": "Sardiinia"
          },
          {
            "id": "i3",
            "text": "Saaremaa"
          },
          {
            "id": "i4",
            "text": "Gotland"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q042",
      "unitId": "lo-opik-u21",
      "stem": "Leia kaardilt Islandi ümbruse tähis.",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-world-iceland",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Island paikneb Atlandi ookeani põhjaosas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-world-locations",
        "correctRegionId": "iceland"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-world-locations"
      }
    },
    {
      "id": "lo-opik-u21-q043",
      "unitId": "lo-opik-u21",
      "stem": "Millise mandri lääneranniku lähedal on tugevate maavärinate piirkondi?",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-world-chile",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõuna-Ameerika Vaikse ookeani ranniku lähedal kulgeb aktiivne laamapiir.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Lõuna-Ameerika"
          },
          {
            "id": "i2",
            "text": "Austraalia kõigi osade keskosa"
          },
          {
            "id": "i3",
            "text": "Antarktis igas kohas"
          },
          {
            "id": "i4",
            "text": "Aafrika ainult Sahara keskosas"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q044",
      "unitId": "lo-opik-u21",
      "stem": "Näita skeemkaardil Tšiili ümbruse tähist.",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-world-chile",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tšiili paikneb Lõuna-Ameerika läänerannikul.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-world-locations",
        "correctRegionId": "chile"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-world-locations"
      }
    },
    {
      "id": "lo-opik-u21-q045",
      "unitId": "lo-opik-u21",
      "stem": "Leia kaardilt Eesti ümbrus kui väiksema maavärinaohuga näidispiirkond.",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-world-estonia",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti paikneb kaugel paljudest aktiivsetest laamapiiridest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-world-locations",
        "correctRegionId": "estonia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-world-locations"
      }
    },
    {
      "id": "lo-opik-u21-q046",
      "unitId": "lo-opik-u21",
      "stem": "Rühmita näited õpitud geograafilise mustri järgi.",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-regions-sort",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jaapan, Island ja Tšiili on aktiivsetes maavärinapiirkondades; Eestis on tugevad maavärinad haruldased.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "frequent",
            "text": "Aktiivse laamapiiri lähedal"
          },
          {
            "id": "less",
            "text": "Kaugel aktiivsest laamapiirist"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Jaapani ümbrus"
          },
          {
            "id": "i2",
            "text": "Islandi ümbrus"
          },
          {
            "id": "i3",
            "text": "Tšiili rannik"
          },
          {
            "id": "i4",
            "text": "Eesti"
          }
        ],
        "correctGroupByItem": {
          "i1": "frequent",
          "i2": "frequent",
          "i3": "frequent",
          "i4": "less"
        }
      }
    },
    {
      "id": "lo-opik-u21-q047",
      "unitId": "lo-opik-u21",
      "stem": "Miks asuvad mõned vulkaanid ja maavärinaalad samades kohtades?",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-quakes-volcano",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamade piirid on sagedased nii vulkaanide kui ka maavärinate piirkonnad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Mõlemad võivad olla seotud laamade liikumisega."
          },
          {
            "id": "i2",
            "text": "Vulkaanid toodavad kõik maailma maavärinad."
          },
          {
            "id": "i3",
            "text": "Iga maavärin peab sisaldama laavapurset."
          },
          {
            "id": "i4",
            "text": "Seismilised lained on alati kuum vesi."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q048",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: igale maavärinale järgneb samas kohas kindlasti vulkaanipurse.",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-quakes-volcano",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärin ja vulkaanipurse võivad olla seotud laamadega, kuid ei toimu alati koos.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
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
      "id": "lo-opik-u21-q049",
      "unitId": "lo-opik-u21",
      "stem": "Reisid Jaapanisse. Milleks tasuks võrreldes Eestiga rohkem valmistuda?",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-world-japan",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jaapanis on maavärinaoht suurem, seetõttu on ohutusvõtted olulised.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Maavärina ajal õigesti tegutsemiseks"
          },
          {
            "id": "i2",
            "text": "Eestis tavapärasest tugevamaks vihmaks"
          },
          {
            "id": "i3",
            "text": "Üksnes polaarööst tingitud pimeduseks"
          },
          {
            "id": "i4",
            "text": "Pidevaks maakoore täielikuks sulamiseks"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q050",
      "unitId": "lo-opik-u21",
      "stem": "Ühenda piirkond ja õige selgitus.",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-location-match",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärinate esinemise sagedus sõltub piirkonna geoloogilisest ehitusest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Jaapan"
          },
          {
            "id": "p2",
            "text": "Island"
          },
          {
            "id": "p3",
            "text": "Eesti"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Vaikse ookeani aktiivne maavärinapiirkond"
          },
          {
            "id": "c2",
            "text": "Atlandi põhjaosa laamapiiri näide"
          },
          {
            "id": "c3",
            "text": "suhteliselt kaugel aktiivsetest laamapiiridest"
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
      "id": "lo-opik-u21-q051",
      "unitId": "lo-opik-u21",
      "stem": "Vali õiged väited maavärinate paiknemise kohta.",
      "primaryObjectiveId": "lo-opik-u21-o3",
      "variantGroupId": "lo-opik-u21-risk-vary",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamade servadel toimub palju maavärinaid, kuid seismilisus on võimalik ka mujal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Maavärinaid toimub palju laamade servadel."
          },
          {
            "id": "i2",
            "text": "Maavärinaid võib toimuda ka laamade sisemuses."
          },
          {
            "id": "i3",
            "text": "Kõik maailma piirkonnad on ühtemoodi maavärinaohtlikud."
          },
          {
            "id": "i4",
            "text": "Kõik maavärinad toimuvad üksnes ookeanides."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u21-q052",
      "unitId": "lo-opik-u21",
      "stem": "Kas tugevad maavärinad on Eestis tavalised?",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-est-rare",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eestis on tugevad inimeste tuntavad maavärinad harvad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Ei, neid tuleb ette harva."
          },
          {
            "id": "i2",
            "text": "Jah, iga nädal."
          },
          {
            "id": "i3",
            "text": "Jah, igal hommikul."
          },
          {
            "id": "i4",
            "text": "Ei, kuid ka nõrgad raputused on füüsikaliselt võimatud."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q053",
      "unitId": "lo-opik-u21",
      "stem": "Miks on tugevad maavärinad Eestis haruldasemad kui Jaapanis?",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-est-rare",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti asub laama siseosas; Jaapan aktiivsete laamapiiride juures.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Eesti asub aktiivsetest laamapiiridest kaugemal."
          },
          {
            "id": "i2",
            "text": "Eestis ei ole kivimeid."
          },
          {
            "id": "i3",
            "text": "Jaapanis on rohkem pilvi."
          },
          {
            "id": "i4",
            "text": "Eesti asub täpselt Maa tuuma kohal."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q054",
      "unitId": "lo-opik-u21",
      "stem": "Millise Eesti saare lähedal toimus 1976. aasta tuntud maavärin?",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-osm-place",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "1976. aasta maavärina kese oli Osmussaare lähistel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        },
        {
          "kind": "supplementary",
          "url": "https://egt.ee/uudised/eesti-maavarinad-kajastavad-laamade-liikumist",
          "attribution": "Eesti Geoloogiateenistus — Eesti maavärinad",
          "note": "25.10.1976 Osmussaare maavärin, magnituud umbes 4,5."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Osmussaare"
          },
          {
            "id": "i2",
            "text": "Kihnu"
          },
          {
            "id": "i3",
            "text": "Ruhnu"
          },
          {
            "id": "i4",
            "text": "Naissaare"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q055",
      "unitId": "lo-opik-u21",
      "stem": "Mis aastal toimus õpikus kirjeldatud Osmussaare maavärin?",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-osm-year",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku näide on 1976. aastast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        },
        {
          "kind": "supplementary",
          "url": "https://egt.ee/uudised/eesti-maavarinad-kajastavad-laamade-liikumist",
          "attribution": "Eesti Geoloogiateenistus — Eesti maavärinad",
          "note": "25.10.1976 Osmussaare maavärin, magnituud umbes 4,5."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "1976"
          },
          {
            "id": "i2",
            "text": "1918"
          },
          {
            "id": "i3",
            "text": "1991"
          },
          {
            "id": "i4",
            "text": "2024"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q056",
      "unitId": "lo-opik-u21",
      "stem": "Mis kuus toimus 1976. aasta Osmussaare maavärin?",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-osm-year",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti Geoloogiateenistuse järgi toimus see 25. oktoobril 1976.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        },
        {
          "kind": "supplementary",
          "url": "https://egt.ee/uudised/eesti-maavarinad-kajastavad-laamade-liikumist",
          "attribution": "Eesti Geoloogiateenistus — Eesti maavärinad",
          "note": "25.10.1976 Osmussaare maavärin, magnituud umbes 4,5."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Oktoobris"
          },
          {
            "id": "i2",
            "text": "Jaanuaris"
          },
          {
            "id": "i3",
            "text": "Juunis"
          },
          {
            "id": "i4",
            "text": "Detsembris"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q057",
      "unitId": "lo-opik-u21",
      "stem": "Milliseid mõjusid kirjeldab õpik 1976. aasta Osmussaare maavärina puhul?",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-osm-effects",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik kirjeldab pangavaringuid ja hoone seinakahjustust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Osmussaare pangal varises kivimeid."
          },
          {
            "id": "i2",
            "text": "Ühe kivihoone seina tekkis pragu."
          },
          {
            "id": "i3",
            "text": "Kogu Eesti vajus mere alla."
          },
          {
            "id": "i4",
            "text": "Tallinnas purskas vulkaan."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u21-q058",
      "unitId": "lo-opik-u21",
      "stem": "Kas Osmussaare maavärinat oli tunda ka Tallinnas?",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-osm-tallinn",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõned tallinlased tundsid raputamist ning märkasid esemete liikumist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Jah, näiteks kõikusid laelambid ja klirisesid aknad."
          },
          {
            "id": "i2",
            "text": "Ei, laineid ei saa maa sees levitada."
          },
          {
            "id": "i3",
            "text": "Jah, kuid kõik Tallinna hooned varisesid."
          },
          {
            "id": "i4",
            "text": "Ei, seda märkas ainult üks merelaev."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q059",
      "unitId": "lo-opik-u21",
      "stem": "Mis oli 1976. aasta Osmussaare maavärina ligikaudne magnituud Eesti Geoloogiateenistuse järgi?",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-osm-magnitude",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti Geoloogiateenistus nimetab magnituudiks ligikaudu 4,5.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        },
        {
          "kind": "supplementary",
          "url": "https://egt.ee/uudised/eesti-maavarinad-kajastavad-laamade-liikumist",
          "attribution": "Eesti Geoloogiateenistus — Eesti maavärinad",
          "note": "25.10.1976 Osmussaare maavärin, magnituud umbes 4,5."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "4,5"
          },
          {
            "id": "i2",
            "text": "0,0"
          },
          {
            "id": "i3",
            "text": "10,5"
          },
          {
            "id": "i4",
            "text": "18,0"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q060",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: Eestis ei saa mitte kunagi maavärinat toimuda.",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-est-rare",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eestis toimub maavärinaid, kuigi tugevad on harvad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
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
      "id": "lo-opik-u21-q061",
      "unitId": "lo-opik-u21",
      "stem": "Laps ütleb: „Eestis ei saa maa väriseda.” Milline näide parandab selle väite?",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-osm-case",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Osmussaare 1976. aasta maavärin näitab, et maavärinad on Eestis võimalikud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "1976. aasta Osmussaare maavärin"
          },
          {
            "id": "i2",
            "text": "Iga-aastane päikesetõus"
          },
          {
            "id": "i3",
            "text": "Läänemere tavalised lained"
          },
          {
            "id": "i4",
            "text": "Kevadine lindude ränne"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q062",
      "unitId": "lo-opik-u21",
      "stem": "Leia lihtsustatud kaardilt Eesti ümbrus.",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-osm-place",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Osmussaar asub Eesti rannikumeres; selles maailmakaardis on Eesti ümbrus tähistatud üldistatult.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-world-locations",
        "correctRegionId": "estonia"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-world-locations"
      }
    },
    {
      "id": "lo-opik-u21-q063",
      "unitId": "lo-opik-u21",
      "stem": "Järjesta näite kirjeldus sündmuse kulgemise järgi.",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-osm-effects",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõigepealt toimus maavärin, siis levis selle mõju kaugemale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Osmussaare lähistel toimus maavärin."
          },
          {
            "id": "i2",
            "text": "Seismilised lained levisid ümbruses."
          },
          {
            "id": "i3",
            "text": "Saarel täheldati kahjustusi."
          },
          {
            "id": "i4",
            "text": "Ka Tallinnas märgati raputamist."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ],
        "firstLabel": "Algus",
        "lastLabel": "Lõpp"
      }
    },
    {
      "id": "lo-opik-u21-q064",
      "unitId": "lo-opik-u21",
      "stem": "Ühenda piirkond ja sinna sobiv kirjeldus.",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-est-global",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti ja Jaapan erinevad aktiivsete laamapiiride kauguse poolest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Eesti"
          },
          {
            "id": "p2",
            "text": "Jaapani piirkond"
          },
          {
            "id": "p3",
            "text": "Osmussaar"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "tugevad maavärinad haruldased"
          },
          {
            "id": "c2",
            "text": "maavärinaid sageli"
          },
          {
            "id": "c3",
            "text": "Eesti tuntud maavärin 1976. aastal"
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
      "id": "lo-opik-u21-q065",
      "unitId": "lo-opik-u21",
      "stem": "Vali õiged väited Eesti maavärinate kohta.",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-est-claims",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eesti ei ole seismiliselt täiesti vaikne, kuid suuri maavärinaid esineb harva.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Tugevaid maavärinaid juhtub Eestis harva."
          },
          {
            "id": "i2",
            "text": "1976. aastal toimus Osmussaare maavärin."
          },
          {
            "id": "i3",
            "text": "Maavärina lained võivad jõuda kaugemale maavärina koldest."
          },
          {
            "id": "i4",
            "text": "Eesti on täiesti ilma kivimiteta."
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
      "id": "lo-opik-u21-q066",
      "unitId": "lo-opik-u21",
      "stem": "Vali geoloogiateenistuse seirega kooskõlas olev väide.",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-est-data",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Seismoseire registreerib lisaks maavärinatele näiteks lõhkamistest tingitud võnkeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        },
        {
          "kind": "supplementary",
          "url": "https://egt.ee/tegevusvaldkonnad-ja-eesmargid/geoloogia-ja-elukeskkond/seismoloogilised-uuringud-ja-seire",
          "attribution": "Eesti Geoloogiateenistus — Seismoloogilised uuringud ja seire",
          "note": "Seismilised sündmused võivad olla looduslikud või inimtekkelised; arv \"100 maavärinat aastas\" ei ole kontrollitud fakt."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Seismoseire võib registreerida ka inimtekkelisi võnkeid."
          },
          {
            "id": "i2",
            "text": "Kõik võnked on tingitud tsunamist."
          },
          {
            "id": "i3",
            "text": "Iga registreeritud võnge hävitab hoone."
          },
          {
            "id": "i4",
            "text": "Iga võnge on suure magnituudiga maavärin."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q067",
      "unitId": "lo-opik-u21",
      "stem": "Miks ei saa õpiku „umbes sada nõrka maavärinat aastas” käsitleda igal aastal täpse ja muutumatu arvuna?",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-est-data",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku arv on ajas muutuv väide ning seismoseire peab eristama ka inimtekkelisi sündmusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        },
        {
          "kind": "supplementary",
          "url": "https://egt.ee/tegevusvaldkonnad-ja-eesmargid/geoloogia-ja-elukeskkond/seismoloogilised-uuringud-ja-seire",
          "attribution": "Eesti Geoloogiateenistus — Seismoloogilised uuringud ja seire",
          "note": "Seismilised sündmused võivad olla looduslikud või inimtekkelised; arv \"100 maavärinat aastas\" ei ole kontrollitud fakt."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Seire ja aastate tegelik sündmuste arv võivad erineda."
          },
          {
            "id": "i2",
            "text": "Maa peal pole mõõteseadmeid."
          },
          {
            "id": "i3",
            "text": "Igal aastal toimub kindlasti sama arv maavärinaid."
          },
          {
            "id": "i4",
            "text": "Aastaarv sõltub ainult ilmast."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q068",
      "unitId": "lo-opik-u21",
      "stem": "Kaks õpilast võrdlevad Eesti ja Jaapani maavärinaohtu. Milline järeldus on täpne?",
      "primaryObjectiveId": "lo-opik-u21-o4",
      "variantGroupId": "lo-opik-u21-est-compare",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamapiiride lähedus aitab seletada piirkondlikku erinevust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "79"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Jaapanis on maavärinaoht üldiselt suurem, kuid Eestis on maavärinad võimalikud."
          },
          {
            "id": "i2",
            "text": "Mõlemas riigis on maavärinaoht täpselt ühesugune."
          },
          {
            "id": "i3",
            "text": "Eestis ei ole maapinda, mis võiks väriseda."
          },
          {
            "id": "i4",
            "text": "Jaapanis ei liigu laamad kunagi."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q069",
      "unitId": "lo-opik-u21",
      "stem": "Mis on tsunami?",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-meaning",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tsunami koosneb ohtlikest merelainetest, mille võib tekitada vee järsk nihkumine.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Äkilise veemassi nihkumise tagajärjel tekkinud merelainete seeria"
          },
          {
            "id": "i2",
            "text": "Iga tavaline mere tõusu- ja mõõnalaine"
          },
          {
            "id": "i3",
            "text": "Ainult tugeva tuule loodud üksik vahune laine"
          },
          {
            "id": "i4",
            "text": "Iga veepinna värvimuutus"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q070",
      "unitId": "lo-opik-u21",
      "stem": "Milline sündmus võib põhjustada tsunami?",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-trigger",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Veealune maavärin võib merepõhja liigutades suure veemassi liikuma panna.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/special-topics/subduction-zone-science/science/faqs",
          "attribution": "USGS — Subduction zone science FAQs",
          "note": "Tsunami tekib vee kiirel nihkumisel; mitte iga merealune maavärin ei tekita tsunamit."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Merepõhja äkiline nihkumine suure maavärina ajal"
          },
          {
            "id": "i2",
            "text": "Aeglased pilved mere kohal"
          },
          {
            "id": "i3",
            "text": "Tavaline rannal puhuv briis"
          },
          {
            "id": "i4",
            "text": "Jõe vee tavapärane voolamine"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q071",
      "unitId": "lo-opik-u21",
      "stem": "Miks võib merepõhja järsk tõus tsunami tekitada?",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-trigger",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Merepõhja kiire üles- või allaliikumine võib suruda vett liikuma.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "See nihutab suurt hulka selle kohal olevat vett."
          },
          {
            "id": "i2",
            "text": "See lõpetab Maa pöörlemise."
          },
          {
            "id": "i3",
            "text": "See muudab kogu merevee korraga tahkeks."
          },
          {
            "id": "i4",
            "text": "See muudab kõik merelained väiksemaks."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q072",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: iga ookeanipõhjas toimuv maavärin tekitab suure tsunami.",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-not-every",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tsunami tekkeks on vaja piisavat vee nihkumist; iga merealune maavärin seda ei põhjusta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/special-topics/subduction-zone-science/science/faqs",
          "attribution": "USGS — Subduction zone science FAQs",
          "note": "Tsunami tekib vee kiirel nihkumisel; mitte iga merealune maavärin ei tekita tsunamit."
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
      "id": "lo-opik-u21-q073",
      "unitId": "lo-opik-u21",
      "stem": "Kas tsunami võib tekkida ka ilma maavärinata?",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-other",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vett võivad kiiresti liigutada ka maalihked ja vulkaanilised sündmused.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/special-topics/subduction-zone-science/science/faqs",
          "attribution": "USGS — Subduction zone science FAQs",
          "note": "Tsunami tekib vee kiirel nihkumisel; mitte iga merealune maavärin ei tekita tsunamit."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Jah, näiteks suure maalihke või vulkaanilise tegevuse tõttu."
          },
          {
            "id": "i2",
            "text": "Ei, tsunami ainus võimalik põhjus on maavärin."
          },
          {
            "id": "i3",
            "text": "Ainult siis, kui tuul puhub põhjast."
          },
          {
            "id": "i4",
            "text": "Ainult siis, kui meres on laevad."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q074",
      "unitId": "lo-opik-u21",
      "stem": "Miks muutub tsunami ranniku lähedal eriti ohtlikuks?",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-coast",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ranna lähedal võib veemass veesügavuse vähenedes kerkida ning maismaale tungida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Madalamas vees võib laine kasvada ja vesi paiskuda maismaale."
          },
          {
            "id": "i2",
            "text": "Sügavamal saab laine alati kõrgemaks."
          },
          {
            "id": "i3",
            "text": "Vesi kaob enne randa alati täielikult."
          },
          {
            "id": "i4",
            "text": "Laine muutub rannal seisvaks jääks."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q075",
      "unitId": "lo-opik-u21",
      "stem": "Millised väited tsunami kohta avamerel on õiged?",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-open",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Avamerel võib laine olla madal, ent rannikul ohtlik.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Tsunami võib avamerel olla madal."
          },
          {
            "id": "i2",
            "text": "Avamerel võib tsunami olla laeval raskesti märgatav."
          },
          {
            "id": "i3",
            "text": "Avamerel on tsunami alati kümnete meetrite kõrgune."
          },
          {
            "id": "i4",
            "text": "Tsunami ei saa avamerel liikuda."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u21-q076",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: tsunami saabub alati ühe suure murduva veeseinana.",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-manywaves",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tsunami võib meenutada kiiresti tõusvat üleujutust ja sisaldada mitut lainet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
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
      "id": "lo-opik-u21-q077",
      "unitId": "lo-opik-u21",
      "stem": "Kas tsunami võib koosneda mitmest lainest?",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-manywaves",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tsunami on sageli lainete seeria; oht võib püsida kaua.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Jah, ja esimene ei pruugi olla suurim."
          },
          {
            "id": "i2",
            "text": "Ei, alati saabub ainult üks laine."
          },
          {
            "id": "i3",
            "text": "Jah, kuid kõik lained on ühe sentimeetri kõrgused."
          },
          {
            "id": "i4",
            "text": "Ei, kui maavärin on lõppenud, kaovad kõik lained."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q078",
      "unitId": "lo-opik-u21",
      "stem": "Leia joonisel merepõhja järsu nihkumise koht.",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-trigger",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Merepõhja järsk vertikaalne nihe võib nihutada vee liikuma.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-tsunami-stages",
        "correctRegionId": "seafloor"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-tsunami-stages"
      }
    },
    {
      "id": "lo-opik-u21-q079",
      "unitId": "lo-opik-u21",
      "stem": "Milline tähis näitab tsunamit avamerel?",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-open",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Avamerel võib tsunami olla suhteliselt madal ja pikk laine.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-tsunami-stages",
        "correctRegionId": "open-ocean"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-tsunami-stages"
      }
    },
    {
      "id": "lo-opik-u21-q080",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta joonisel tsooni, kus vesi võib maismaale tungida.",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-coast",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rannikul võib tsunami tekitada kiire üleujutuse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-tsunami-stages",
        "correctRegionId": "coast"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-tsunami-stages"
      }
    },
    {
      "id": "lo-opik-u21-q081",
      "unitId": "lo-opik-u21",
      "stem": "Sea tsunami lihtsustatud kujunemise etapid õigesse järjekorda.",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-order",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Merepõhja liikumine võib käivitada lainete seeria, mis levib rannikuni.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Merepõhi nihkub järsku."
          },
          {
            "id": "i2",
            "text": "Suur veemass hakkab liikuma."
          },
          {
            "id": "i3",
            "text": "Lained levivad üle mere."
          },
          {
            "id": "i4",
            "text": "Vesi jõuab rannikule ja võib tungida maismaale."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ],
        "firstLabel": "Algus",
        "lastLabel": "Lõpp"
      }
    },
    {
      "id": "lo-opik-u21-q082",
      "unitId": "lo-opik-u21",
      "stem": "Ühenda nähtus ja selle kirjeldus.",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-meaning",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tsunami võib näida avamerel rahulik, kuid rannikul olla hävitav.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Merepõhja nihkumine"
          },
          {
            "id": "p2",
            "text": "Tsunami avamerel"
          },
          {
            "id": "p3",
            "text": "Tsunami rannas"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "võib suure veemassi liikuma panna"
          },
          {
            "id": "c2",
            "text": "võib olla vähe märgatav"
          },
          {
            "id": "c3",
            "text": "võib põhjustada kiire üleujutuse"
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
      "id": "lo-opik-u21-q083",
      "unitId": "lo-opik-u21",
      "stem": "Rühmita väited: kas kirjeldus sobib tsunami kohta?",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-group",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tsunami võib tekkida kiire veemassi nihkumise tõttu, kuid mitte iga maavärina järel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "yes",
            "text": "Sobib tsunami kohta"
          },
          {
            "id": "no",
            "text": "Ei ole õige üldväide"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Võib tekkida merepõhja nihkumisest."
          },
          {
            "id": "i2",
            "text": "Võib tulla mitme lainena."
          },
          {
            "id": "i3",
            "text": "Võib rannikul üle ujutada."
          },
          {
            "id": "i4",
            "text": "Tekib igast merealusest maavärinast."
          }
        ],
        "correctGroupByItem": {
          "i1": "yes",
          "i2": "yes",
          "i3": "yes",
          "i4": "no"
        }
      }
    },
    {
      "id": "lo-opik-u21-q084",
      "unitId": "lo-opik-u21",
      "stem": "Kuidas erineb tsunami tavalisest tuulelainest?",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-inland",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tsunami tekitab vee suuremahuline liikumine, mitte ainult tavaline tuul.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tsunami võib liikuma panna väga suure veemassi ja ulatuda sügavale rannikule."
          },
          {
            "id": "i2",
            "text": "Tsunami sõltub alati ainult tuule kiirusest."
          },
          {
            "id": "i3",
            "text": "Tsunami ei saa vette puutudes ohtlik olla."
          },
          {
            "id": "i4",
            "text": "Tsunami ei liigu kunagi avamerel."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q085",
      "unitId": "lo-opik-u21",
      "stem": "Laeva pealt märgatakse merel väikest veetaseme muutust, kuid rannikul tekib tugev üleujutus. Mis võib seda selgitada?",
      "primaryObjectiveId": "lo-opik-u21-o5",
      "variantGroupId": "lo-opik-u21-tsunami-scenario",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tsunamilainete käitumine muutub madalamas rannikuvees.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tsunami võib avamerel olla madal, kuid rannikul tõusta ja paisuda."
          },
          {
            "id": "i2",
            "text": "Rannas on vesi alati sügavam kui avamerel."
          },
          {
            "id": "i3",
            "text": "Tsunami saab tekkida ainult rannaäärses jões."
          },
          {
            "id": "i4",
            "text": "Merepõhja nihkumine ei liiguta kunagi vett."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q086",
      "unitId": "lo-opik-u21",
      "stem": "Mis võib olla rannas tsunami looduslik hoiatusmärk?",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-shaking",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tugev või pikk maavärin mere ääres on oluline looduslik hoiatus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/jetstream/prep-you",
          "attribution": "NOAA — Tsunami preparedness",
          "note": "Tugev või pikk raputus, vee muutumine ja mürin; kohe evakueerumine, ametlikku teadet ootamata."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tugev või pikalt kestnud maavärin"
          },
          {
            "id": "i2",
            "text": "Pilvitu taevas"
          },
          {
            "id": "i3",
            "text": "Kerge meretuul"
          },
          {
            "id": "i4",
            "text": "Tavaline päikeseloojang"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q087",
      "unitId": "lo-opik-u21",
      "stem": "Milline merevee muutus võib hoiatada tsunami eest?",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-water",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ebatavaline järsk merevee muutus võib olla looduslik hoiatus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vee väga kiire ja ebatavaline taandumine või tõus"
          },
          {
            "id": "i2",
            "text": "Tavaline mõõn igal õhtul"
          },
          {
            "id": "i3",
            "text": "Vee värvi muutus pärast vihma"
          },
          {
            "id": "i4",
            "text": "Lainete kerge loksumine tuulega"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q088",
      "unitId": "lo-opik-u21",
      "stem": "Mis võib lisaks raputamisele ja vee taandumisele viidata tsunamile?",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-roar",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "NOAA loetleb ka ebatavalise tugeva meremühina võimaliku märgina.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/jetstream/prep-you",
          "attribution": "NOAA — Tsunami preparedness",
          "note": "Tugev või pikk raputus, vee muutumine ja mürin; kohe evakueerumine, ametlikku teadet ootamata."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Ebatavaline tugev mühin merelt"
          },
          {
            "id": "i2",
            "text": "Linnulaul kaugel metsas"
          },
          {
            "id": "i3",
            "text": "Tasane vihmasabin"
          },
          {
            "id": "i4",
            "text": "Jalgrataste veeremine"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q089",
      "unitId": "lo-opik-u21",
      "stem": "Millised väited tsunami võimalike ohumärkide kohta on õiged?",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-no-all-signs",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Isegi üks looduslik hoiatusmärk võib tähendada, et tuleb rannikult kiiresti eemalduda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Tugev või pikk maavärin rannikul võib olla hoiatus."
          },
          {
            "id": "i2",
            "text": "Ebatavaline merevee kiire muutumine võib olla hoiatus."
          },
          {
            "id": "i3",
            "text": "Ohutuks tegutsemiseks peavad alati esinema kõik märgid."
          },
          {
            "id": "i4",
            "text": "Tsunamihoiatus saab tulla ainult telefonist."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u21-q090",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: kui rannikul oli tugev maavärin, tuleb enne lahkumist kindlasti oodata telefonis ametlikku hoiatust.",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-wait",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Loodusliku hoiatuse korral ei pruugi ametlik teade õigeks ajaks jõuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/jetstream/prep-you",
          "attribution": "NOAA — Tsunami preparedness",
          "note": "Tugev või pikk raputus, vee muutumine ja mürin; kohe evakueerumine, ametlikku teadet ootamata."
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
      "id": "lo-opik-u21-q091",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta skeemil tugeva maavärina tähist.",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-shaking",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tugev või pikalt kestnud maavärin võib rannikul olla tsunamihoiatus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-tsunami-warnings",
        "correctRegionId": "strong-shaking"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-tsunami-warnings"
      }
    },
    {
      "id": "lo-opik-u21-q092",
      "unitId": "lo-opik-u21",
      "stem": "Leia jooniselt merevee järsu taandumise tähis.",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-water",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Merevee ebatavaline taandumine või tõus võib tsunami eest hoiatada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-tsunami-warnings",
        "correctRegionId": "water-change"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-tsunami-warnings"
      }
    },
    {
      "id": "lo-opik-u21-q093",
      "unitId": "lo-opik-u21",
      "stem": "Milline tähis kujutab ebatavalist tugevat mühinat merelt?",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-roar",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Merelt kostev tugev ebatavaline mürin võib olla hoiatus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-tsunami-warnings",
        "correctRegionId": "sea-roar"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-tsunami-warnings"
      }
    },
    {
      "id": "lo-opik-u21-q094",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta rannikukaardil kõrgemal asuvat turvalisemat piirkonda.",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-coast-safe-place",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõrgem ja rannikust kaugem koht on tsunamiohu korral turvalisem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-coastal-escape",
        "correctRegionId": "high-ground"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-coastal-escape"
      }
    },
    {
      "id": "lo-opik-u21-q095",
      "unitId": "lo-opik-u21",
      "stem": "Leia jooniselt rannikust eemale ja sisemaa poole viiv teekond.",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-coast-safe-place",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Evakuatsioonisuund viib rannast eemale sisemaale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-coastal-escape",
        "correctRegionId": "inland-route"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-coastal-escape"
      }
    },
    {
      "id": "lo-opik-u21-q096",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta joonisel piirkonda, kuhu tsunamihoiatusel jääda ei tohi.",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-coast-unsafe",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Rannal on tsunami ajal ohtlik; liigu kõrgemale või sisemaale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-coastal-escape",
        "correctRegionId": "beach"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-coastal-escape"
      }
    },
    {
      "id": "lo-opik-u21-q097",
      "unitId": "lo-opik-u21",
      "stem": "Oled rannas, maa väriseb tugevalt ja värisemine lõpeb. Mida teed?",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-right-decision",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tugeva või pika maavärina järel tuleb rannikult kiiresti ohutusse kohta liikuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/jetstream/prep-you",
          "attribution": "NOAA — Tsunami preparedness",
          "note": "Tugev või pikk raputus, vee muutumine ja mürin; kohe evakueerumine, ametlikku teadet ootamata."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Liigun kohe kõrgemale või sisemaale."
          },
          {
            "id": "i2",
            "text": "Jään vaatama, kas vesi taandub."
          },
          {
            "id": "i3",
            "text": "Lähen vee piirile filmima."
          },
          {
            "id": "i4",
            "text": "Ootan ainult seni, kuni kõik teised on lahkunud."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q098",
      "unitId": "lo-opik-u21",
      "stem": "Näed, et merevesi taandub rannalt ebatavaliselt kiiresti. Kuidas käitud?",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-water",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Äkiline merevee taandumine võib olla tsunami looduslik hoiatus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Lahkun kohe rannikult kõrgemale või sisemaale."
          },
          {
            "id": "i2",
            "text": "Kõnnin paljandunud merepõhja uudistama."
          },
          {
            "id": "i3",
            "text": "Ootan ranna ääres järgmist lainet."
          },
          {
            "id": "i4",
            "text": "Püüan ebatavalist nähtust vee juures pildistada."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q099",
      "unitId": "lo-opik-u21",
      "stem": "Pane rannikul pärast tugevat maavärinat toimimise sammud õigesse järjekorda.",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-prep-order",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Esmalt kaitse end raputamise eest; seejärel evakueeru tsunamiohu piirkonnast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/jetstream/prep-you",
          "attribution": "NOAA — Tsunami preparedness",
          "note": "Tugev või pikk raputus, vee muutumine ja mürin; kohe evakueerumine, ametlikku teadet ootamata."
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Kaitsen end esmalt raputamise ajal."
          },
          {
            "id": "i2",
            "text": "Kui on ohutu liikuda, lahkun kiiresti rannast."
          },
          {
            "id": "i3",
            "text": "Liigun kõrgemale või sisemaale."
          },
          {
            "id": "i4",
            "text": "Jään ohutusse kohta ja jälgin ametlikke teateid."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ],
        "firstLabel": "Algus",
        "lastLabel": "Lõpp"
      }
    },
    {
      "id": "lo-opik-u21-q100",
      "unitId": "lo-opik-u21",
      "stem": "Ühenda tsunami võimalik märk õige tegevusega.",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-warning-match",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Looduslike märkide ja evakuatsioonitähiste järgi tuleb kiiresti ohutusse kohta minna.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Vesi taandub kiiresti"
          },
          {
            "id": "p2",
            "text": "Tugev raputus rannikul"
          },
          {
            "id": "p3",
            "text": "Evakuatsioonisilt"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "ära mine vee äärde vaatama"
          },
          {
            "id": "c2",
            "text": "pärast raputust lahku kõrgemale"
          },
          {
            "id": "c3",
            "text": "järgi ohutusse kohta viivat suunda"
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
      "id": "lo-opik-u21-q101",
      "unitId": "lo-opik-u21",
      "stem": "Rühmita tegevused.",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-warning-group",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tsunami korral tuleb eemale liikuda, mitte jääda randa uudistama.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "safe",
            "text": "Ohutum tegevus"
          },
          {
            "id": "unsafe",
            "text": "Ohtlik tegevus"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Liigun rannast kõrgemale."
          },
          {
            "id": "i2",
            "text": "Järgin evakuatsioonimärke."
          },
          {
            "id": "i3",
            "text": "Ootan, kuni saan laine lähedalt filmida."
          },
          {
            "id": "i4",
            "text": "Lähen taandunud merepõhjale jalutama."
          }
        ],
        "correctGroupByItem": {
          "i1": "safe",
          "i2": "safe",
          "i3": "unsafe",
          "i4": "unsafe"
        }
      }
    },
    {
      "id": "lo-opik-u21-q102",
      "unitId": "lo-opik-u21",
      "stem": "Millal võib pärast tsunamihoiatust randa tagasi minna?",
      "primaryObjectiveId": "lo-opik-u21-o6",
      "variantGroupId": "lo-opik-u21-tsunami-return",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tsunami võib tulla mitme lainena, mistõttu ametlik ohuteade on tähtis.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "80"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/education/resource-collections/ocean-coasts/tsunamis",
          "attribution": "NOAA — Tsunamis",
          "note": "Tsunamihoiatusmärgid ja rannikult kõrgemale/sisemaale liikumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kui ametiasutused ütlevad, et oht on möödas."
          },
          {
            "id": "i2",
            "text": "Kohe pärast esimest lainet."
          },
          {
            "id": "i3",
            "text": "Kohe, kui ilm läheb päikeseliseks."
          },
          {
            "id": "i4",
            "text": "Siis, kui telefonile rohkem sõnumeid ei tule."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q103",
      "unitId": "lo-opik-u21",
      "stem": "Mida teha toas, kui tugev maavärin algab?",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-indoor-drop",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Siseruumis on üldine soovitus küki, varju, hoia kinni.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
          "attribution": "CDC — Stay safe during an earthquake",
          "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kükitada, varjuda tugeva laua alla ja hoida kinni."
          },
          {
            "id": "i2",
            "text": "Joosta kohe trepist alla tänavale."
          },
          {
            "id": "i3",
            "text": "Sõita liftiga alumisele korrusele."
          },
          {
            "id": "i4",
            "text": "Seista suurte akende lähedal, et välja vaadata."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q104",
      "unitId": "lo-opik-u21",
      "stem": "Millised maavärinaaegsed tegevused aitavad end toas kaitsta?",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-indoor-why",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Toas kaitse end langevate esemete eest ja ära kiirusta välja.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
          "attribution": "CDC — Stay safe during an earthquake",
          "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Varjun tugeva laua alla."
          },
          {
            "id": "i2",
            "text": "Hoian akendest eemale."
          },
          {
            "id": "i3",
            "text": "Jooksen tugeva raputuse ajal trepist alla."
          },
          {
            "id": "i4",
            "text": "Kasutan lifti."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u21-q105",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: tavaliselt tuleks tugeva raputamise ajal ruumist kohe õue joosta.",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-indoor-drop",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Välja jooksmine raputamise ajal suurendab kukkumise ja langevate osade ohtu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-should-i-do-during-earthquake",
          "attribution": "USGS — What should I do during an earthquake?",
          "note": "Ära jookse raputamise ajal trepist ega välja; väldi aknaid ja lahtisi juhtmeid."
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
      "id": "lo-opik-u21-q106",
      "unitId": "lo-opik-u21",
      "stem": "Kuhu minna, kui oled juba maavärina ajal õues?",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-outdoor-open",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õues väldi kohti, kust võib midagi peale kukkuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
          "attribution": "CDC — Stay safe during an earthquake",
          "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Võimaluse korral avatud kohta, eemale hoonetest ja juhtmetest."
          },
          {
            "id": "i2",
            "text": "Kõrge müüri alla varju."
          },
          {
            "id": "i3",
            "text": "Elektriposti vahetusse lähedusse."
          },
          {
            "id": "i4",
            "text": "Hoonete klaasseinte kõrvale."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q107",
      "unitId": "lo-opik-u21",
      "stem": "Maavärin algab, kui istud klassis laua taga. Milline on ohutum tegevus?",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-indoor-drop",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õige üldvõte siseruumis on kükitamine, varjumine ja kinni hoidmine.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
          "attribution": "CDC — Stay safe during an earthquake",
          "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Lähen laua alla, kaitsen pead ja hoian kinni."
          },
          {
            "id": "i2",
            "text": "Jooksen kohe klassist välja."
          },
          {
            "id": "i3",
            "text": "Seisan aknalaua peale."
          },
          {
            "id": "i4",
            "text": "Jooksen trepist keldrisse."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q108",
      "unitId": "lo-opik-u21",
      "stem": "Seisad õues hoone ja elektriposti vahel, kui maa hakkab värisema. Mida teed?",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-outdoor-open",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õues on turvalisem olla eemal hoonetest, puudest ja elektriliinidest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
          "attribution": "CDC — Stay safe during an earthquake",
          "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Liigun ohutult avatud alale, eemale kukkuvatest esemetest."
          },
          {
            "id": "i2",
            "text": "Jään otse elektriposti alla."
          },
          {
            "id": "i3",
            "text": "Haaran kinni elektrijuhtmest."
          },
          {
            "id": "i4",
            "text": "Seisan suurte akende all."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q109",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta joonisel esimest tegevust: kükitamine.",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-indoor-diagram-drop",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Alusta kükitamisest: põrandal ei kaota sa tasakaalu ega kuku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-drop-cover-hold",
        "correctRegionId": "drop"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-drop-cover-hold"
      }
    },
    {
      "id": "lo-opik-u21-q110",
      "unitId": "lo-opik-u21",
      "stem": "Leia jooniselt tugeva laua alla varjumise tähis.",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-indoor-why",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laua all saab kaitsta pead ja kaela langevate esemete eest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-drop-cover-hold",
        "correctRegionId": "cover"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-drop-cover-hold"
      }
    },
    {
      "id": "lo-opik-u21-q111",
      "unitId": "lo-opik-u21",
      "stem": "Milline tähis kujutab laua jalast kinni hoidmist?",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-dch-order",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laua või muu varjualuse külge hoitakse kinni kuni raputamise lõpuni.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-drop-cover-hold",
        "correctRegionId": "hold"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-drop-cover-hold"
      }
    },
    {
      "id": "lo-opik-u21-q112",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta joonisel kohta, millest tuleks raputamise ajal eemale hoida.",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-protect-head",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Purunev aknaklaas on raputamise ajal ohtlik.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-drop-cover-hold",
        "correctRegionId": "window"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-drop-cover-hold"
      }
    },
    {
      "id": "lo-opik-u21-q113",
      "unitId": "lo-opik-u21",
      "stem": "Leia õuejoonisel avatud, üldiselt turvalisem ala.",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-outdoor-open",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Avatud kohas on vähem akendest ja hoonetest kukkuvaid esemeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-outdoors",
        "correctRegionId": "open-area"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-outdoors"
      }
    },
    {
      "id": "lo-opik-u21-q114",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta õuejoonisel hoone fassaadi lähedust kui ohu näidet.",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-outdoors-diagram-build",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Raputamise ajal võivad fassaadilt osad alla kukkuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-outdoors",
        "correctRegionId": "building"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-outdoors"
      }
    },
    {
      "id": "lo-opik-u21-q115",
      "unitId": "lo-opik-u21",
      "stem": "Milline tähis näitab elektriliinide piirkonda, millest tuleb eemale hoida?",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-outdoors-diagram-wire",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Elektriliinid võivad maavärina käigus kahjustuda või maha kukkuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-outdoors",
        "correctRegionId": "power-lines"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-outdoors"
      }
    },
    {
      "id": "lo-opik-u21-q116",
      "unitId": "lo-opik-u21",
      "stem": "Järjesta kolm peamist kaitsetoimingut.",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-dch-order",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Küki – varju – hoia kinni on lihtsalt meeldejääv ohutusvõte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
          "attribution": "CDC — Stay safe during an earthquake",
          "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Küki."
          },
          {
            "id": "i2",
            "text": "Varju tugeva laua alla."
          },
          {
            "id": "i3",
            "text": "Hoia kinni, kuni raputamine lakkab."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3"
        ],
        "firstLabel": "Algus",
        "lastLabel": "Lõpp"
      }
    },
    {
      "id": "lo-opik-u21-q117",
      "unitId": "lo-opik-u21",
      "stem": "Ühenda olukord ja sellele sobiv tegevus.",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-safety-match",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Siseruumis ja õues on eri riskid, kuid mõlemal juhul tuleb vältida kukkuvaid esemeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Olen klassiruumis."
          },
          {
            "id": "p2",
            "text": "Olen õues."
          },
          {
            "id": "p3",
            "text": "Seisan akna kõrval."
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "varjun tugeva laua alla"
          },
          {
            "id": "c2",
            "text": "liigun avatud kohta"
          },
          {
            "id": "c3",
            "text": "hoian klaasist eemale"
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
      "id": "lo-opik-u21-q118",
      "unitId": "lo-opik-u21",
      "stem": "Rühmita käitumised ohutumateks ja ohtlikumateks.",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-safety-sort",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Siseruumis varju, ära torma välja ega kasuta lifti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
          "attribution": "CDC — Stay safe during an earthquake",
          "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "safe",
            "text": "Ohutum maavärina ajal"
          },
          {
            "id": "unsafe",
            "text": "Ohtlik maavärina ajal"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Kükitan ja varjun laua alla."
          },
          {
            "id": "i2",
            "text": "Hoidun aknast eemale."
          },
          {
            "id": "i3",
            "text": "Jooksen raputamise ajal trepist välja."
          },
          {
            "id": "i4",
            "text": "Kasutan lifti."
          }
        ],
        "correctGroupByItem": {
          "i1": "safe",
          "i2": "safe",
          "i3": "unsafe",
          "i4": "unsafe"
        }
      }
    },
    {
      "id": "lo-opik-u21-q119",
      "unitId": "lo-opik-u21",
      "stem": "Mida kaitsta, kui tugevat lauda kohe käepärast pole?",
      "primaryObjectiveId": "lo-opik-u21-o7",
      "variantGroupId": "lo-opik-u21-protect-head",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui tugeva laua alla ei pääse, küki ohutusse kohta ja kaitse pead ning kaela.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
          "attribution": "CDC — Stay safe during an earthquake",
          "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Pead ja kaela käsivartega"
          },
          {
            "id": "i2",
            "text": "Ainult jalanõusid"
          },
          {
            "id": "i3",
            "text": "Ainult oma telefoni"
          },
          {
            "id": "i4",
            "text": "Ainult koolikotti"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q120",
      "unitId": "lo-opik-u21",
      "stem": "Mis on järeltõuge?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-aftershock-meaning",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pärast suurt maavärinat võib samas piirkonnas tulla uusi raputusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes",
          "attribution": "USGS — The Science of Earthquakes",
          "note": "Maavärin tekib järsust murranguliikumisest; kolle ja epitsenter."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Peamaavärinale järgnev täiendav maavärin"
          },
          {
            "id": "i2",
            "text": "Maavärinale alati eelnev vulkaanipurse"
          },
          {
            "id": "i3",
            "text": "Ainult merevee tavaline liikumine"
          },
          {
            "id": "i4",
            "text": "Pilve varju jõudmine"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q121",
      "unitId": "lo-opik-u21",
      "stem": "Miks tuleb pärast esimest maavärinat edasi ettevaatlik olla?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-aftershock-meaning",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Järeltõuked, purunenud klaas, juhtmed ja kahjustatud hooned nõuavad tähelepanu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Võivad tulla järeltõuked ja kahjustatud ehitised on ohtlikud."
          },
          {
            "id": "i2",
            "text": "Kõik ohtlikud asjad muutuvad kohe ohutuks."
          },
          {
            "id": "i3",
            "text": "Kõik elektrijuhtmed muutuvad tugevamaks."
          },
          {
            "id": "i4",
            "text": "Lõppenud raputamine tähendab alati tsunamiohu lõppu."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q122",
      "unitId": "lo-opik-u21",
      "stem": "Mida teha, kui näed pärast maavärinat maha langenud elektrijuhet?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-fallen-wire",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mahakukkunud juhe võib olla voolu all. Ära puuduta seda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.cdc.gov/earthquakes/safety/stay-safe-during-an-earthquake.html",
          "attribution": "CDC — Stay safe during an earthquake",
          "note": "Siseruumis jää sisse: kükitamine, varjumine, kinni hoidmine; õues jää õue ja eemaldu ohtudest."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Hoian sellest eemale ja teavitan täiskasvanut."
          },
          {
            "id": "i2",
            "text": "Lükkan selle pulgaga eemale."
          },
          {
            "id": "i3",
            "text": "Proovin juhtme ise üles tõsta."
          },
          {
            "id": "i4",
            "text": "Astun sellest teadlikult üle."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q123",
      "unitId": "lo-opik-u21",
      "stem": "Kelle juhiseid peaks laps pärast maavärinat järgima?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-adult-help",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Täiskasvanud, päästjad ja ametlikud ohuteated aitavad ohutuid otsuseid teha.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Usaldusväärsete täiskasvanute ja päästjate"
          },
          {
            "id": "i2",
            "text": "Esimese tundmatu inimese suvalisi käske"
          },
          {
            "id": "i3",
            "text": "Ainult interneti naljapiltide"
          },
          {
            "id": "i4",
            "text": "Inimese, kes kutsub tagasi ohtlikku hoonesse"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q124",
      "unitId": "lo-opik-u21",
      "stem": "Kust tasub elektri või interneti katkemisel vajaduse korral infot saada?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-official-alerts",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Patareiraadio võib aidata ohuteateid kuulata ka elektrikatkestuse korral.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Patareidega töötavast raadiost või ametlike kanalite kaudu"
          },
          {
            "id": "i2",
            "text": "Ainult teadmata päritoluga kuulujutust"
          },
          {
            "id": "i3",
            "text": "Juhtmeid katsudes"
          },
          {
            "id": "i4",
            "text": "Lahkudes üksi ohtlikule rannikule"
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q125",
      "unitId": "lo-opik-u21",
      "stem": "Millised tegevused on sobivad pärast tugeva raputuse lõppu?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-damaged-building",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pärast raputust hinnatakse riske, hoitakse ohtudest eemale ja järgitakse juhiseid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Kontrollin, kas väljapääs on ohutu."
          },
          {
            "id": "i2",
            "text": "Järgin päästjate ja täiskasvanute juhiseid."
          },
          {
            "id": "i3",
            "text": "Puudutan maha kukkunud elektrijuhet."
          },
          {
            "id": "i4",
            "text": "Torman tagasi silmanähtavalt kahjustatud hoonesse."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u21-q126",
      "unitId": "lo-opik-u21",
      "stem": "Millal on sobiv pärast maavärinat ohtlikust hoonest eemalduda?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-after-safe-exit",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Raputamise ajal varju; seejärel hinda väljapääsu ohutust ja järgi päästjate juhiseid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-should-i-do-during-earthquake",
          "attribution": "USGS — What should I do during an earthquake?",
          "note": "Ära jookse raputamise ajal trepist ega välja; väldi aknaid ja lahtisi juhtmeid."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Pärast raputamise lõppu, kui väljapääs on ohutu, järgides juhiseid."
          },
          {
            "id": "i2",
            "text": "Keset tugevaimat värisemist mööda treppi joostes."
          },
          {
            "id": "i3",
            "text": "Ainult siis, kui aknad pole kordagi värisenud."
          },
          {
            "id": "i4",
            "text": "Enne kui kontrollid, kas ümbruses on allakukkunud esemeid."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q127",
      "unitId": "lo-opik-u21",
      "stem": "Puuduta joonisel maha kukkunud elektrijuhet.",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-fallen-wire",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Elektrijuhtmest tuleb pärast maavärinat eemale hoida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-aftershock-safety",
        "correctRegionId": "fallen-wire"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-aftershock-safety"
      }
    },
    {
      "id": "lo-opik-u21-q128",
      "unitId": "lo-opik-u21",
      "stem": "Milline tähis näitab kahjustatud hooneosa?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-damaged-building",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Katkine fassaad või sein võib järeltõuke ajal olla ohtlik.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-aftershock-safety",
        "correctRegionId": "damaged-wall"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-aftershock-safety"
      }
    },
    {
      "id": "lo-opik-u21-q129",
      "unitId": "lo-opik-u21",
      "stem": "Leia jooniselt patareiraadio.",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-after-radio-diagram",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Patareidega töötava raadioga saab kuulata ametlikke teateid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u21-aftershock-safety",
        "correctRegionId": "radio"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u21-aftershock-safety"
      }
    },
    {
      "id": "lo-opik-u21-q130",
      "unitId": "lo-opik-u21",
      "stem": "Sea turvalisem käitumine pärast maavärinat loogilisse järjekorda.",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-after-steps",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ohte tuleb hinnata enne liikumist ning täita ametlikke juhiseid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Ootan, kuni tugev raputamine on lõppenud."
          },
          {
            "id": "i2",
            "text": "Hindan ohte enda ümber, näiteks klaasi ja juhtmeid."
          },
          {
            "id": "i3",
            "text": "Liigun vajaduse korral ohutusse kohta koos täiskasvanuga."
          },
          {
            "id": "i4",
            "text": "Kuulan ametlikke teateid ja olen valmis järeltõukeks."
          }
        ],
        "correctOrder": [
          "i1",
          "i2",
          "i3",
          "i4"
        ],
        "firstLabel": "Algus",
        "lastLabel": "Lõpp"
      }
    },
    {
      "id": "lo-opik-u21-q131",
      "unitId": "lo-opik-u21",
      "stem": "Ühenda nähtus ja õige käitumine.",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-after-match",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pärast maavärinat on oluline märgata kahjustusi ja kuulata ametlikku teavet.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Kahjustatud sein"
          },
          {
            "id": "p2",
            "text": "Langenud elektrijuhe"
          },
          {
            "id": "p3",
            "text": "Ohuteade raadiost"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "hoian eemale"
          },
          {
            "id": "c2",
            "text": "ei puuduta"
          },
          {
            "id": "c3",
            "text": "kuulan ametlikke juhiseid"
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
      "id": "lo-opik-u21-q132",
      "unitId": "lo-opik-u21",
      "stem": "Millised tegevused sobivad pärast maavärinat?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-after-steps",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Järeltõugete ja kahjustuste tõttu tuleb olla ettevaatlik.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Hoian juhtmetest eemale."
          },
          {
            "id": "i2",
            "text": "Kuulan ametlikke teateid."
          },
          {
            "id": "i3",
            "text": "Lähen rusudesse mängima."
          },
          {
            "id": "i4",
            "text": "Puudutan lõhkist elektrikaablit."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u21-q133",
      "unitId": "lo-opik-u21",
      "stem": "Õige või vale: kui esialgne raputamine lakkab, ei ole enam ühtegi maavärinaga seotud ohtu.",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-aftershock-meaning",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Järeltõuked ja kahjustatud ehitised võivad jätkuvalt ohtu kujutada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
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
      "id": "lo-opik-u21-q134",
      "unitId": "lo-opik-u21",
      "stem": "Maavärin lõppes, kuid oled endiselt mere ääres ja raputus oli tugev. Mis on kõige olulisem järgmine samm?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-after-beach",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pärast tugevat või pikka ranniku maavärinat tuleb kiiresti ohutusse kohta lahkuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.noaa.gov/jetstream/prep-you",
          "attribution": "NOAA — Tsunami preparedness",
          "note": "Tugev või pikk raputus, vee muutumine ja mürin; kohe evakueerumine, ametlikku teadet ootamata."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Liigun tsunamiohu tõttu kiiresti kõrgemale või sisemaale."
          },
          {
            "id": "i2",
            "text": "Jään mere äärde esimest lainet ootama."
          },
          {
            "id": "i3",
            "text": "Lähen randa telefoniga filmima."
          },
          {
            "id": "i4",
            "text": "Lähen kahjustatud rannahoonesse varju."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q135",
      "unitId": "lo-opik-u21",
      "stem": "Pärast raputamist kostab ametlik ohuteade, kuid internet ei tööta. Mida teed?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-official-alerts",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ametlikku teavet saab jälgida ka raadiost; interneti puudumine ei muuda hoiatust tühiseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Järgin ohuteadet koos täiskasvanuga ja hoian end turvalises kohas."
          },
          {
            "id": "i2",
            "text": "Lähen ohtlikku piirkonda infot kontrollima."
          },
          {
            "id": "i3",
            "text": "Eiran ohuteadet, sest telefonis pole internetti."
          },
          {
            "id": "i4",
            "text": "Katsun elektriliini, et kontrollida, kas vool on tagasi."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u21-q136",
      "unitId": "lo-opik-u21",
      "stem": "Kas oskame maavärina järgseid järeltõukeid täpse minuti pealt ette öelda?",
      "primaryObjectiveId": "lo-opik-u21-o8",
      "variantGroupId": "lo-opik-u21-after-cannot-predict",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pärast maavärinat võib tulla järeltõukeid, kuid nende täpset ajastust ei saa ette öelda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "81"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/programs/earthquake-hazards/science-earthquakes",
          "attribution": "USGS — The Science of Earthquakes",
          "note": "Maavärin tekib järsust murranguliikumisest; kolle ja epitsenter."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Ei, täpset hetke ei saa usaldusväärselt ette öelda."
          },
          {
            "id": "i2",
            "text": "Jah, iga järeltõuge toimub täpselt tunni järel."
          },
          {
            "id": "i3",
            "text": "Jah, kõik järeltõuked lõpevad ühel ja samal ajal."
          },
          {
            "id": "i4",
            "text": "Ei, sest järeltõukeid looduses üldse ei ole."
          }
        ],
        "correctOptionId": "i1"
      }
    }
  ]
};
