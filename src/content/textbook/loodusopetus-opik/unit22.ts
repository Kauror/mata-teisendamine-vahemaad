// Õpik lk 82–83 (peatükk jätkub edasistel lehekülgedel) + eraldi märgistatud ametlikud ohutusallikad.
// Integratsioon vanema eelvaatesse; staatus "ready" ei tähenda lapsele avaldamist.
// Ära saada lapse kliendile vastusevõtmeid.
// 2026-10-17.2 = the package's 2026-10-17.1 with four integration fixes: q009 and q094 had two
// defensible hotspot answers (the sunny card is also safe ordinary weather; the fallen wire is also
// a place to keep away from), the flood-safety caption said only safe places are ever chosen
// (q080 and q094 ask for dangerous ones), and the table row "Kelduv" is "Kelder".
import type { Unit } from '@/lib/textbook/types';

export const unit22: Unit = {
  "id": "lo-opik-u22",
  "courseId": "loodusopetus-opik",
  "number": 22,
  "title": "Loodusõnnetused",
  "pages": {
    "from": 82,
    "to": 83,
    "note": "Õpiku peatükk jätkub pärast lk 83; kaasa antud materjal hõlmab ainult lk 82–83. Ametlikud ohutusjuhised on märgistatud lisaallikatena."
  },
  "status": "ready",
  "contentVersion": "2026-10-17.2",
  "objectives": [
    {
      "id": "lo-opik-u22-o1",
      "description": "Selgitan, millal tavaline loodusnähtus muutub loodusõnnetuseks.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ]
    },
    {
      "id": "lo-opik-u22-o2",
      "description": "Mõistan, miks loodusõnnetuseks valmistumine vähendab kahju, ehkki loodusnähtust ennast ei saa alati peatada.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        }
      ]
    },
    {
      "id": "lo-opik-u22-o3",
      "description": "Tunnen Eestis ohtlikuks muutuda võivaid ilmanähtusi ja oskan neid eristada.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        },
        {
          "kind": "supplementary",
          "url": "https://www.olevalmis.ee/et-simple/torm-tugev-tuul-aike-ja-sademed",
          "attribution": "Ole valmis! — Torm (lihtsas keeles)",
          "note": "Tormi ajal varju, hoidumine puudest ja lendavatest esemetest."
        },
        {
          "kind": "supplementary",
          "url": "https://www.ilmateenistus.ee/ilmatarkus/kasulik-teada/kui-ilm-muutub-ohtlikuks/pakane/",
          "attribution": "Ilmateenistus — Pakane",
          "note": "Kihiline soe riietus ja külmakahjustuste vältimine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.ilmateenistus.ee/ilmatarkus/kasulik-teada/kui-ilm-muutub-ohtlikuks/kuumalaine-ehk-palavus/",
          "attribution": "Ilmateenistus — Kuumalaine ehk palavus",
          "note": "Vee joomine, päikese eest kaitsmine ja füüsilise koormuse piiramine."
        }
      ]
    },
    {
      "id": "lo-opik-u22-o4",
      "description": "Selgitan, kuidas tugev vihm, vee halb imbumine ja äravool võivad põhjustada üleujutuse.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ]
    },
    {
      "id": "lo-opik-u22-o5",
      "description": "Eristan vihmast põhjustatud üleujutust ning tormiga kaasnevat merevee tõusu.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ]
    },
    {
      "id": "lo-opik-u22-o6",
      "description": "Tunnen üleujutuse tagajärgi ja oskan lihtsate olukordade põhjal ohtu märgata.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        },
        {
          "kind": "textbook",
          "pages": "83"
        }
      ]
    },
    {
      "id": "lo-opik-u22-o7",
      "description": "Valin üleujutuse ja tugeva tormi korral lapsele ohutu käitumise.",
      "required": true,
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.olevalmis.ee/et-simple/torm-tugev-tuul-aike-ja-sademed",
          "attribution": "Ole valmis! — Torm (lihtsas keeles)",
          "note": "Tormi ajal varju, hoidumine puudest ja lendavatest esemetest."
        },
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        }
      ]
    },
    {
      "id": "lo-opik-u22-o8",
      "description": "Tean, kuidas perega ohtlikuks ilmaks valmistuda ja ametlikku hoiatust järgida.",
      "required": true,
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.ilmateenistus.ee/ilm/prognoosid/hoiatused/",
          "attribution": "Keskkonnaagentuuri Ilmateenistus — Hoiatused",
          "note": "Ohtliku ilma hoiatused ja ametlik prognoos."
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/uudised/meeletuletus-kuidas-kaeituda-kui-saad-ee-alarmi-3602",
          "attribution": "Päästeamet — EE-ALARM (2026)",
          "note": "Loe hoiatuse juhiseid ja käitu vastavalt olukorrale."
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u22-l1",
      "title": "Millal loodus muutub ohtlikuks?",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u22-o1",
        "lo-opik-u22-o2"
      ],
      "sections": [
        {
          "id": "lo-opik-u22-s001",
          "title": "Loodusnähtus on osa igapäevaelust",
          "blocks": [
            {
              "id": "lo-opik-u22-b001",
              "type": "paragraph",
              "text": "Tuul, vihm, lumi, päikesepaiste ja udu on tavalised loodusnähtused. Mujal maailmas võib ette tulla ka maavärinaid ja vulkaanipurskeid. Loodusnähtus ise ei tähenda veel, et on juhtunud loodusõnnetus.",
              "source": {
                "kind": "textbook",
                "pages": "82"
              }
            },
            {
              "id": "lo-opik-u22-b002",
              "type": "definition",
              "term": "Loodusnähtus",
              "definition": "Looduses toimuv nähtus, näiteks vihm, tuul, tuisk või maavärin.",
              "source": {
                "kind": "textbook",
                "pages": "82"
              }
            },
            {
              "id": "lo-opik-u22-b003",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Vihm või tuul ei ole alati ohtlik.",
                "Ohtu hinnatakse selle järgi, mis toimub ja keda see võib kahjustada."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s002",
          "title": "Loodusõnnetus kahjustab inimesi või nende elukeskkonda",
          "blocks": [
            {
              "id": "lo-opik-u22-b004",
              "type": "paragraph",
              "text": "Kui loodusnähtus muutub nii võimsaks, et ohustab elu või tervist ning võib tekitada suurt kahju, nimetatakse olukorda loodusõnnetuseks. Näiteks võivad puruneda majad ja teed või hävida põldudel kasvatatud saak.",
              "source": {
                "kind": "textbook",
                "pages": "82"
              }
            },
            {
              "id": "lo-opik-u22-b005",
              "type": "definition",
              "term": "Loodusõnnetus",
              "definition": "Ohtlik loodusest lähtuv sündmus, mis põhjustab või võib põhjustada inimestele ja nende varale tõsist kahju.",
              "source": {
                "kind": "textbook",
                "pages": "82"
              }
            },
            {
              "id": "lo-opik-u22-b006",
              "type": "diagram",
              "diagramId": "u22-hazard-scenarios",
              "caption": "Sama piirkonna tavalisest vihmast erinev üleujutus ja tormikahju on lihtsustatud näited, mitte päris sündmused.",
              "source": {
                "kind": "textbook",
                "pages": "82"
              }
            },
            {
              "id": "lo-opik-u22-b007",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Tähtis pole ainult ilm, vaid ka võimalik oht inimestele ja varale."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s003",
          "title": "Inimene saab õnnetuse mõju vähendada",
          "blocks": [
            {
              "id": "lo-opik-u22-b008",
              "type": "paragraph",
              "text": "Inimene ei saa peatada laamade liikumist ega keelata tormil tekkida. Küll aga saab ohte jälgida, mõnikord nende eest ette hoiatada ning ehitada vastupidavamaid hooneid. Mõne ohu mõju saab inimene ka ise vähendada, näiteks vältides ohtlikku kohta.",
              "source": {
                "kind": "textbook",
                "pages": "82"
              }
            },
            {
              "id": "lo-opik-u22-b009",
              "type": "paragraph",
              "text": "Õpik toob näite Jaapanist: seal valmistutakse maavärinateks tugevamate hoonete, kaitserajatiste ning kooliõppustega. Need abinõud ei välista õnnetust, vaid aitavad vähendada selle tagajärgi.",
              "source": {
                "kind": "textbook",
                "pages": "82"
              }
            },
            {
              "id": "lo-opik-u22-b010",
              "type": "comparison",
              "title": "Kahte asja tuleb eristada",
              "columns": [
                {
                  "heading": "Loodusnähtus",
                  "points": [
                    "Torm või maavärin võib tekkida ka siis, kui inimesed on valmistunud.",
                    "Selle täpset aega ja mõju ei pruugi olla võimalik ette teada."
                  ]
                },
                {
                  "heading": "Inimeste valmisolek",
                  "points": [
                    "Hoiatused, tugevad hooned ja harjutamine aitavad ohtu vähendada.",
                    "Ohutum käitumine võib päästa elusid."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u22-b011",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Valmistumine ei kaota looduses toimuvat, aga aitab vähendada kahju."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s004",
          "title": "Harjutame juba enne ohtu",
          "blocks": [
            {
              "id": "lo-opik-u22-b012",
              "type": "diagram",
              "diagramId": "u22-prepared-home",
              "caption": "Pildil on maja ja selle ümber valmidust toetavad tegevused: korras vihmavee äravool, kõrgemale tõstetud asjad ja vajalikud vahendid.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
                "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
                "note": "Kodused varud, ohuteave ja perega valmistumine."
              }
            },
            {
              "id": "lo-opik-u22-b013",
              "type": "paragraph",
              "text": "Peres tasub läbi rääkida, kuidas ohuhoiatust märgata ja mida ohu korral teha. Harjutamisel on mõte just siis, kui päris oht veel ei ähvarda.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
                "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
                "note": "Kodused varud, ohuteave ja perega valmistumine."
              }
            },
            {
              "id": "lo-opik-u22-b014",
              "type": "enrichment",
              "variant": "extra",
              "title": "Õpikust edasi",
              "body": [
                "Hoonete ehitamise ja suurte kaitserajatiste eest vastutavad täiskasvanud ning spetsialistid. Lapse ülesanne on märgata ohtu, järgida juhiseid ja otsida vajaduse korral täiskasvanu abi."
              ]
            },
            {
              "id": "lo-opik-u22-b015",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Õppus on ettevalmistus, mitte märk sellest, et õnnetus on juba alanud."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u22-l2",
      "title": "Millised ilmaohud võivad Eestis tekkida?",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u22-o3",
        "lo-opik-u22-o6"
      ],
      "sections": [
        {
          "id": "lo-opik-u22-s005",
          "title": "Eestis on olulised ilmaoludest lähtuvad ohud",
          "blocks": [
            {
              "id": "lo-opik-u22-b016",
              "type": "paragraph",
              "text": "Õpik nimetab Eestis esineda võivate ohtlike ilmanähtustena paduvihma ja üleujutusi, väga tugevat tuult või keeristormi, tugevat lumesadu ja tuisku, pikalt kestvat pakast ning kaua püsivat suurt kuumust.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b017",
              "type": "list",
              "ordered": false,
              "items": [
                "Paduvihm ja üleujutused",
                "Väga tugev tuul või keeristorm",
                "Tugev lumesadu ja tuisk",
                "Pikalt kestev pakane",
                "Kaua püsiv suur kuumus"
              ]
            },
            {
              "id": "lo-opik-u22-b018",
              "type": "diagram",
              "diagramId": "u22-estonia-weather",
              "caption": "Viis üldistatud ilmastikuolukorda: tugev sadu, torm, tuisk, pakane ja kuumus.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b019",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Eestis ei ole kõigi maailma piirkondade ohud võrdselt tõenäolised.",
                "Õpiku näited keskenduvad eriti ohtlikule ilmale."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s006",
          "title": "Paduvihm ja väga tugev tuul",
          "blocks": [
            {
              "id": "lo-opik-u22-b020",
              "type": "paragraph",
              "text": "Paduvihma ajal võib lühikese ajaga maha sadada palju vett. Vesi võib koguneda teedele ning jõuda keldritesse. Väga tugev tuul võib murda puid, liigutada lahtisi esemeid ja tekitada ohtlikke olukordi.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b021",
              "type": "paragraph",
              "text": "Tormi ajal püsi võimaluse korral turvalises hoones ja eemal akendest. Väljas väldi murdumisohtlikke puid ja tuulega lendavaid esemeid.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.olevalmis.ee/et-simple/torm-tugev-tuul-aike-ja-sademed",
                "attribution": "Ole valmis! — Torm (lihtsas keeles)",
                "note": "Tormi ajal varju, hoidumine puudest ja lendavatest esemetest."
              }
            },
            {
              "id": "lo-opik-u22-b022",
              "type": "comparison",
              "title": "Mis on erinev?",
              "columns": [
                {
                  "heading": "Paduvihm",
                  "points": [
                    "Ohtu tekitab suur veehulk.",
                    "Tänavad ja madalad kohad võivad üle ujutada."
                  ]
                },
                {
                  "heading": "Tugev tuul",
                  "points": [
                    "Ohtu tekitavad tuule jõud ja lendavad esemed.",
                    "Puud ja oksad võivad murduda."
                  ]
                }
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s007",
          "title": "Tuisk ja pakane",
          "blocks": [
            {
              "id": "lo-opik-u22-b023",
              "type": "paragraph",
              "text": "Tuisus kannab tuul lund edasi ning nähtavus võib muutuda väga halvaks. Pikalt kestev tugev külm ehk pakane võib ohustada inimest, kui ta ei ole piisavalt soojalt riides.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b024",
              "type": "paragraph",
              "text": "Kui pead tugeva külmaga õue minema, riietu kihiliselt ja kaitse külma eest käsi, jalgu ning pead. Tuisu või väga tugeva pakase korral tuleks väljas käimist vähendada.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.ilmateenistus.ee/ilmatarkus/kasulik-teada/kui-ilm-muutub-ohtlikuks/pakane/",
                "attribution": "Ilmateenistus — Pakane",
                "note": "Kihiline soe riietus ja külmakahjustuste vältimine."
              }
            },
            {
              "id": "lo-opik-u22-b025",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Tuisk ühendab lume ja tuule.",
                "Pakase puhul on peamine oht pikaajaline tugev külm."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s008",
          "title": "Pikaajaline kuumus",
          "blocks": [
            {
              "id": "lo-opik-u22-b026",
              "type": "paragraph",
              "text": "Õpikus on Eesti võimalike loodusõnnetuste hulgas ka kaua püsiv suur kuumus. See on erinev üksikust meeldivalt soojast päevast: pikalt kestev kuumus võib koormata inimese tervist.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b027",
              "type": "paragraph",
              "text": "Kuuma ilma korral on mõistlik olla jahedamas või varjulises kohas, juua vett ning pidada nõu täiskasvanuga. Väldi kuumuse ajal liigset füüsilist pingutust.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.ilmateenistus.ee/ilmatarkus/kasulik-teada/kui-ilm-muutub-ohtlikuks/kuumalaine-ehk-palavus/",
                "attribution": "Ilmateenistus — Kuumalaine ehk palavus",
                "note": "Vee joomine, päikese eest kaitsmine ja füüsilise koormuse piiramine."
              }
            },
            {
              "id": "lo-opik-u22-b028",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Ilmastikunähtus muutub eriti ohtlikuks siis, kui sellega kaasneb oht tervisele või suur kahju."
              ]
            },
            {
              "id": "lo-opik-u22-b029",
              "type": "enrichment",
              "variant": "extra",
              "title": "Veel üks seos",
              "body": [
                "Ka Eestis võib maa nõrgalt väriseda, kuid tugevad maavärinad on siin harvad. Seda käsitlesime 21. õppetükis. Väide „Eestis ei saa maavärinat üldse olla” ei ole õige."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u22-l3",
      "title": "Üleujutused: kust tuleb nii palju vett?",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u22-o4",
        "lo-opik-u22-o5"
      ],
      "sections": [
        {
          "id": "lo-opik-u22-s009",
          "title": "Kui vett tuleb rohkem, kui ära mahub",
          "blocks": [
            {
              "id": "lo-opik-u22-b030",
              "type": "paragraph",
              "text": "Üleujutus tekib siis, kui vesi katab maa-ala, mis tavaliselt on kuiv. Õpiku järgi võib tugev vihm tuua vett rohkem, kui pinnas suudab sisse imada ja jõed ära juhtida.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b031",
              "type": "definition",
              "term": "Üleujutus",
              "definition": "Olukord, kus tavaliselt kuiv ala jääb vee alla.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b032",
              "type": "diagram",
              "diagramId": "u22-rain-flood",
              "caption": "Lihtsustatud skeem: tugev vihm, veepinnal voolav vesi, äravool ja üleujutatud tänav.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b033",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Tugev vihmasadu → vett ei jõua piisavalt imbuda ega ära voolata → võimalik üleujutus."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s010",
          "title": "Miks võib linnatänav üle ujutada?",
          "blocks": [
            {
              "id": "lo-opik-u22-b034",
              "type": "paragraph",
              "text": "Linnas on palju kõva kattega pindu: teid, kõnniteid ja parkimisplatse. Vesi ei imbu neist läbi samamoodi nagu mullast. Kui sademeveesüsteem ei jõua vett piisavalt kiiresti ära juhtida, koguneb vesi madalamatesse kohtadesse.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.epa.gov/caddis/urbanization-stormwater-runoff",
                "attribution": "US EPA — Urbanization and Stormwater Runoff",
                "note": "Kõvakattega linnapind vähendab vee maasse imbumist."
              }
            },
            {
              "id": "lo-opik-u22-b035",
              "type": "paragraph",
              "text": "Õpiku fotol on üleujutus Tallinnas Laagna teel, kus tugev vihm muutis autotee ajutiselt järvesarnaseks. Sellist olukorda ei tohi pidada tavaliseks lompides mängimiseks.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b036",
              "type": "table",
              "headers": [
                "Koht",
                "Mis võib juhtuda?"
              ],
              "rows": [
                [
                  "Kõvakattega tänav",
                  "Vesi ei imbu kiiresti pinnasesse."
                ],
                [
                  "Madal autotee",
                  "Vesi võib koguneda ja liikluse peatada."
                ],
                [
                  "Kelder või madal korrus",
                  "Vesi võib siseneda hoonesse."
                ]
              ],
              "caption": "Lihtsustatud näited, mitte päris mõõtmised."
            },
            {
              "id": "lo-opik-u22-b037",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Vees oleva tee sügavust ja ohte ei näe alati pinnalt."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s011",
          "title": "Rannikul võib vee tõsta torm",
          "blocks": [
            {
              "id": "lo-opik-u22-b038",
              "type": "paragraph",
              "text": "Õpik selgitab, et üleujutusi tuleb ette ka madalatel mererannikutel. Tugev tuul võib kuhjata merevett rannikule ning tõsta seal ajutiselt veetaset.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b039",
              "type": "diagram",
              "diagramId": "u22-coastal-flood",
              "caption": "Madal rannik, merelt puhuv tormituul ja tõusnud veepiir on näidatud lihtsustatud skeemina.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b040",
              "type": "comparison",
              "title": "Kaks võimalikku üleujutuse põhjust",
              "columns": [
                {
                  "heading": "Paduvihm",
                  "points": [
                    "Palju vett sajab otse maa peale.",
                    "Imbumine ja äravool ei pruugi vee hulgaga sammu pidada."
                  ]
                },
                {
                  "heading": "Torm merel",
                  "points": [
                    "Tugev tuul kuhjab vett madalale rannikule.",
                    "Merevee tase võib tõusta ka ilma suure kohaliku vihmata."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u22-b041",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Üleujutuse põhjus võib olla tugev sadu või rannikule tõusev merevesi."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s012",
          "title": "Mis on tulvavesi?",
          "blocks": [
            {
              "id": "lo-opik-u22-b042",
              "type": "paragraph",
              "text": "Õpiku pildiallkiri nimetab tulvaveeks olukorda, kus veetase tõuseb väga kiiresti. 2021. aasta Kesk- ja Lääne-Euroopa tulvad on õpikus toodud näide ulatuslikust kahjust. See on ajalooline näide, mitte arv, mida tuleks pähe õppida.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b043",
              "type": "definition",
              "term": "Tulvavesi",
              "definition": "Kiiresti tõusva veetasemega seotud üleujutusvesi; selline üleujutus võib tekkida ja muutuda ohtlikuks lühikese ajaga.",
              "source": {
                "kind": "textbook",
                "pages": "83"
              }
            },
            {
              "id": "lo-opik-u22-b044",
              "type": "paragraph",
              "text": "Kiirelt liikuv vesi võib kaasa haarata esemeid ja olla ohtlik ka siis, kui see ei paista väga sügav.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
                "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
                "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
              }
            },
            {
              "id": "lo-opik-u22-b045",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Ära mine tulvavette uudistama, sest vool ja veealused takistused võivad olla ohtlikud."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u22-l4",
      "title": "Kuidas loodusõnnetuseks valmistuda ja ohutult tegutseda?",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u22-o7",
        "lo-opik-u22-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u22-s013",
          "title": "Hoiatus on võimalus ette valmistuda",
          "blocks": [
            {
              "id": "lo-opik-u22-b046",
              "type": "paragraph",
              "text": "Ilmateenistus annab Eestis välja hoiatusi ohtlike ilmaolude kohta. Hoiatust tasub lugeda koos täiskasvanuga: oluline on teada, kus ja millal ohtu oodatakse ning milliseid juhiseid antakse.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.ilmateenistus.ee/ilm/prognoosid/hoiatused/",
                "attribution": "Keskkonnaagentuuri Ilmateenistus — Hoiatused",
                "note": "Ohtliku ilma hoiatused ja ametlik prognoos."
              }
            },
            {
              "id": "lo-opik-u22-b047",
              "type": "paragraph",
              "text": "Eestis kasutatakse ilmahoiatustel kolme ohutaset. Värv või number annab märku ohu tõsidusest, kuid kõige tähtsam on tähele panna hoiatuse teksti ja ametlikke käitumisjuhiseid.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.ilmateenistus.ee/ilmatarkus/kasulik-teada/hoiatuste-kriteeriumid/",
                "attribution": "Keskkonnaagentuur — Hoiatuste tasemed",
                "note": "Hoiatuste kolm ohutaset; fikseeritud konkreetseid piirmäärasid ei testita."
              }
            },
            {
              "id": "lo-opik-u22-b048",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Hoiatus ei tähenda, et kahju kindlasti tekib.",
                "Ära ignoreeri hoiatust: see aitab enne ohu saabumist valmistuda."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s014",
          "title": "Kodune valmistumine",
          "blocks": [
            {
              "id": "lo-opik-u22-b049",
              "type": "paragraph",
              "text": "Pere saab enne tormi või üleujutust valmis panna joogivee, vajaliku toidu, taskulambi, telefoni laadimise võimaluse ja raadio. Oluline on teada, kellega ühendust võtta ning kus asub ohutu koht.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
                "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
                "note": "Kodused varud, ohuteave ja perega valmistumine."
              }
            },
            {
              "id": "lo-opik-u22-b050",
              "type": "diagram",
              "diagramId": "u22-prepared-kit",
              "caption": "Lihtsustatud varustuse näide: joogivesi, taskulamp, raadio, laetud telefon ja ametlik hoiatus.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
                "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
                "note": "Kodused varud, ohuteave ja perega valmistumine."
              }
            },
            {
              "id": "lo-opik-u22-b051",
              "type": "paragraph",
              "text": "Kui elad üleujutusohuga kohas, saab pere vajaduse korral tõsta olulised asjad veetasemest kõrgemale ja jälgida ametlikke juhiseid. Elektri väljalülitamine ning ehitustööd kuuluvad täiskasvanutele, mitte lapsele.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.rescue.ee/et/ueleujutus",
                "attribution": "Päästeamet — Üleujutus",
                "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
              }
            },
            {
              "id": "lo-opik-u22-b052",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Valmistumine toimub enne ohu tekkimist, koos täiskasvanuga."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s015",
          "title": "Kui vesi tõuseb: ära mine vette",
          "blocks": [
            {
              "id": "lo-opik-u22-b053",
              "type": "paragraph",
              "text": "Päästeameti ja WHO juhised on selged: ära mine üleujutatud tänavale ega veega täitunud keldrisse. Ära proovi veest läbi kõndida, ujuda ega autoga läbi sõita. Veepinna all võib olla auke, tugev vool või elektrioht.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.rescue.ee/et/ueleujutus",
                "attribution": "Päästeamet — Üleujutus",
                "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
              }
            },
            {
              "id": "lo-opik-u22-b054",
              "type": "diagram",
              "diagramId": "u22-flood-safety",
              "caption": "Neli tähistatud kohta: kuiv kõrgem paik, üleujutatud sõidutee, langenud elektrijuhe ja kuiv varjualune. Loe küsimust hoolikalt: mõnikord tuleb leida ohutu, mõnikord ohtlik koht.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
                "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
                "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
              }
            },
            {
              "id": "lo-opik-u22-b055",
              "type": "paragraph",
              "text": "Kui vesi tungib hoonesse, järgi päästjate ja täiskasvanute juhiseid. Vajaduse korral liigu ohutusse kõrgemasse kohta. Ära lülita vees seistes elektriseadmeid sisse ega välja.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
                "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
                "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
              }
            },
            {
              "id": "lo-opik-u22-b056",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Üleujutusvesi ei ole mängukoht.",
                "Veega kokku puutunud elektriseadmeid ei tohi katsuda."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u22-s016",
          "title": "Pärast ohtu tegutse rahulikult",
          "blocks": [
            {
              "id": "lo-opik-u22-b057",
              "type": "paragraph",
              "text": "Kui suur oht on möödas, ei pruugi kahjustatud tee või hoone veel ohutu olla. Oota ametlikku infot ning lase täiskasvanutel ja spetsialistidel kontrollida elektrisüsteeme ja võimalikke kahjustusi.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
                "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
                "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
              }
            },
            {
              "id": "lo-opik-u22-b058",
              "type": "paragraph",
              "text": "Kui inimese elu või tervis on vahetus ohus, kutsu abi numbril 112. Kui saad telefoni ohuteavituse, loe selle juhiseid ja räägi täiskasvanuga. Ohuteade võib nõuda erinevates olukordades erinevat tegutsemist.",
              "source": {
                "kind": "supplementary",
                "url": "https://www.rescue.ee/et/uudised/meeletuletus-kuidas-kaeituda-kui-saad-ee-alarmi-3602",
                "attribution": "Päästeamet — EE-ALARM (2026)",
                "note": "Loe hoiatuse juhiseid ja käitu vastavalt olukorrale."
              }
            },
            {
              "id": "lo-opik-u22-b059",
              "type": "externalResource",
              "title": "Päästeameti nõuanded üleujutuse puhuks",
              "intro": "Loe koos täiskasvanuga, kuidas ohuks valmistuda ning millistest kohtadest tuleb hoiduda.",
              "url": "https://www.rescue.ee/et/ueleujutus",
              "publisher": "Päästeamet",
              "resourceType": "article",
              "observe": "Mida teha enne üleujutust ja mille juurde ei tohi vee tõustes minna?"
            },
            {
              "id": "lo-opik-u22-b060",
              "type": "externalResource",
              "title": "Eesti ilmahoiatused",
              "intro": "Uuri koos täiskasvanuga, kas sinu piirkonnas on praegu aktiivseid hoiatusi.",
              "url": "https://www.ilmateenistus.ee/ilm/prognoosid/hoiatused/",
              "publisher": "Keskkonnaagentuuri Ilmateenistus",
              "resourceType": "article",
              "observe": "Kas näed hoiatuse piirkonda ja kehtivusaega?"
            },
            {
              "id": "lo-opik-u22-b061",
              "type": "keyFact",
              "title": "Jäta meelde!",
              "items": [
                "Ohtu märgates räägi täiskasvanuga ja järgi ametlikke juhiseid.",
                "Vahetu ohu korral on hädaabinumber 112.",
                "Pärast üleujutust mine ohtlikku kohta tagasi alles siis, kui see on tunnistatud ohutuks."
              ]
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u22-q001",
      "unitId": "lo-opik-u22",
      "stem": "Millal nimetatakse ohtlikku loodusnähtust loodusõnnetuseks?",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-definition",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Loodusõnnetusega kaasneb tõsine oht inimestele või ulatuslik kahju.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kui see ohustab inimeste elu või tervist ja võib põhjustada suurt kahju."
          },
          {
            "id": "i2",
            "text": "Kui ilm on ebatavaline, isegi kui kedagi ei ohusta."
          },
          {
            "id": "i3",
            "text": "Kui sajab vihma mitmel järjestikusel päeval, kuigi kahju ei teki."
          },
          {
            "id": "i4",
            "text": "Kui õues on lihtsalt ebamugav olla."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q002",
      "unitId": "lo-opik-u22",
      "stem": "Milline loetletud nähtus on tavaline loodusnähtus, mis ei ole iseenesest õnnetus?",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-normal",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tavaline vihmasabin ei tähenda automaatselt ohtu ega suurt kahju.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kerge vihmasabin pargis."
          },
          {
            "id": "i2",
            "text": "Torm, mis rebib maja katuse."
          },
          {
            "id": "i3",
            "text": "Üleujutus, mis lõhub teid."
          },
          {
            "id": "i4",
            "text": "Tugev maavärin, mis tekitab vigastusi."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q003",
      "unitId": "lo-opik-u22",
      "stem": "Milline olukord näitab loodusõnnetuse tekitatud suurt kahju?",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-damage",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab tagajärgedena muu hulgas majade ja teede kahjustumist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Majad ja teed võivad puruneda."
          },
          {
            "id": "i2",
            "text": "Tavalise saju järel muutub muru märjaks."
          },
          {
            "id": "i3",
            "text": "Mõõduka tuulega kõiguvad puude oksad."
          },
          {
            "id": "i4",
            "text": "Päikesepaistelisel päeval kuivavad lombid."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q004",
      "unitId": "lo-opik-u22",
      "stem": "Milline olukord sobib kõige paremini loodusõnnetuse näiteks?",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-example",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Suurt kahju põhjustav üleujutus on loodusõnnetuse näide.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Üleujutus kahjustab mitut kodu."
          },
          {
            "id": "i2",
            "text": "Tavaline vihm kastab kuivavat muru."
          },
          {
            "id": "i3",
            "text": "Päeva jooksul läheb jahedamaks, kuid kõik on ohutud."
          },
          {
            "id": "i4",
            "text": "Vaiksel hommikul on põllu kohal udu."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q005",
      "unitId": "lo-opik-u22",
      "stem": "Kas iga tugev vihmahoog on automaatselt loodusõnnetus?",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-rain-context",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Oht ja tagajärjed eristavad tavalist loodusnähtust loodusõnnetusest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Ei, oluline on ka see, millist ohtu ja kahju see tekitab."
          },
          {
            "id": "i2",
            "text": "Jah, igasugune vihm on alati loodusõnnetus."
          },
          {
            "id": "i3",
            "text": "Jah, isegi siis, kui vihm ei tekita mingit ohtu."
          },
          {
            "id": "i4",
            "text": "Ei, sest isegi paduvihm ei saa kunagi üleujutust tekitada."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q006",
      "unitId": "lo-opik-u22",
      "stem": "Miks võib sama tugev tuul ühes kohas palju rohkem kahju teha kui teises?",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-consequences",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ohtu mõjutavad peale loodusnähtuse tugevuse ka inimeste asukoht ning ehitised.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kahju sõltub ka sellest, mis tuule teele jääb ja kui kaitstud on inimesed."
          },
          {
            "id": "i2",
            "text": "Sest kõik hooned on tuule vastu alati ühtemoodi tugevad."
          },
          {
            "id": "i3",
            "text": "Sest tugeva tuule ajal ei saa puude asukoht kahju mõjutada."
          },
          {
            "id": "i4",
            "text": "Sest kahju sõltub üksnes sellest, mis kell tuul algab."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q007",
      "unitId": "lo-opik-u22",
      "stem": "Millised väited loodusõnnetuste kohta on õiged?",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-principles",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Loodusõnnetused võivad olla erinevad ja tuua kaasa kahju inimestele ning varale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Ohtlik sündmus võib rikkuda teid ja hooneid."
          },
          {
            "id": "i2",
            "text": "Mõni tavaline loodusnähtus võib tugevnedes muutuda ohtlikuks."
          },
          {
            "id": "i3",
            "text": "Iga udu on tingimata suur loodusõnnetus."
          },
          {
            "id": "i4",
            "text": "Loodusõnnetus tähendab alati vulkaanipurset."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u22-q008",
      "unitId": "lo-opik-u22",
      "stem": "Miks ei piisa lause „täna sadas vihma” põhjal otsustamiseks, et toimus loodusõnnetus?",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-info-needed",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õnnetuse määratlemiseks on vaja teada olukorra ohtlikkust ja tagajärgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Puudub teave selle kohta, kas sadu tekitas ohtu või suurt kahju."
          },
          {
            "id": "i2",
            "text": "Sest iga vihmasadu on juba ilma kahjuta loodusõnnetus."
          },
          {
            "id": "i3",
            "text": "Sest vihm ei saa kunagi ohustada inimeste elu."
          },
          {
            "id": "i4",
            "text": "Sest loodusõnnetuse puhul ei ole oluline, kas kodud said kahjustada."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q009",
      "unitId": "lo-opik-u22",
      "stem": "Leia skeemilt olukord, kus sajab vihma, kuid see on tavaline ja ohutu.",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-normal",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pildil on kerge sadu ilma ohtliku tagajärjeta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-hazard-scenarios",
        "correctRegionId": "mild-rain"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-hazard-scenarios"
      }
    },
    {
      "id": "lo-opik-u22-q010",
      "unitId": "lo-opik-u22",
      "stem": "Leia pildilt olukord, kus majad ja tänavad on vee tõttu ohus.",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-flood-pick",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutatud tänav ja hooned kujutavad suurt ohtu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-hazard-scenarios",
        "correctRegionId": "flood"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-hazard-scenarios"
      }
    },
    {
      "id": "lo-opik-u22-q011",
      "unitId": "lo-opik-u22",
      "stem": "Jaota olukorrad: igapäevane loodusnähtus või ohtlik loodusõnnetus.",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-examples-sort",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Oluline on oht ja võimalik suur kahju, mitte üksnes nähtuse nimi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "normal",
            "text": "Tavaline nähtus"
          },
          {
            "id": "disaster",
            "text": "Loodusõnnetus"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Tavaline kevadine vihmasabin"
          },
          {
            "id": "i2",
            "text": "Tuul liigutab tasakesi puulehti"
          },
          {
            "id": "i3",
            "text": "Torm lõhub maju ja vigastab inimesi"
          },
          {
            "id": "i4",
            "text": "Üleujutus kahjustab mitut kodu"
          }
        ],
        "correctGroupByItem": {
          "i1": "normal",
          "i2": "normal",
          "i3": "disaster",
          "i4": "disaster"
        }
      }
    },
    {
      "id": "lo-opik-u22-q012",
      "unitId": "lo-opik-u22",
      "stem": "Ühenda olukord ja selle peamine tunnus.",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-damage",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tavalist ja ohtlikku olukorda aitab eristada mõju inimestele ning elukeskkonnale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Kerge vihmasabin"
          },
          {
            "id": "p2",
            "text": "Purustav torm"
          },
          {
            "id": "p3",
            "text": "Väike udu hommikul"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Ei tekita kirjelduses tõsist kahju"
          },
          {
            "id": "c2",
            "text": "Ohustab inimesi ja ehitisi"
          },
          {
            "id": "c3",
            "text": "Vähendab nähtavust, kuid õnnetust pole kirjeldatud"
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
      "id": "lo-opik-u22-q013",
      "unitId": "lo-opik-u22",
      "stem": "Sea näite sündmused põhjusest tagajärjeni.",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-disaster-chain",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vihmast võib saada suur kahju, kui vesi ei pääse ära ja jõuab hoonetesse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Algab väga tugev vihmasadu."
          },
          {
            "id": "i2",
            "text": "Vesi koguneb madalale tänavale."
          },
          {
            "id": "i3",
            "text": "Vesi tungib majadesse ja põhjustab kahju."
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
      "id": "lo-opik-u22-q014",
      "unitId": "lo-opik-u22",
      "stem": "Koolilaps ütleb: „Täna tuiskas, järelikult oli kindlasti loodusõnnetus.” Mida vastad?",
      "primaryObjectiveId": "lo-opik-u22-o1",
      "variantGroupId": "lo-opik-u22-o1-assess-claim",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hinda tuisu tugevust ja selle mõju, mitte ainult nähtuse nime.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tuisk võib olla ohtlik, kuid üksnes selle nimetamine ei tõesta loodusõnnetust."
          },
          {
            "id": "i2",
            "text": "Kui lund sajab, on see alati loodusõnnetus, ka ohuta."
          },
          {
            "id": "i3",
            "text": "Tuisk ei saa kunagi olla ohtlik."
          },
          {
            "id": "i4",
            "text": "Tuisku saab loodusõnnetuseks nimetada üksnes suvel."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q015",
      "unitId": "lo-opik-u22",
      "stem": "Milleks korraldatakse koolides maavärinaõppusi?",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-drills",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õppusel harjutatakse turvalist käitumist enne päris ohtu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Et lapsed oskaksid ohu korral õigesti tegutseda."
          },
          {
            "id": "i2",
            "text": "Et ennustada täpselt järgmise maavärina sekundit."
          },
          {
            "id": "i3",
            "text": "Et kontrollida, kas kõik lauad on ühepikkused."
          },
          {
            "id": "i4",
            "text": "Et panna maavärin kooli ajal varem lõppema."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q016",
      "unitId": "lo-opik-u22",
      "stem": "Mida püütakse saavutada maavärinakindlamate hoonetega?",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-strong-buildings",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vastupidavam ehitus vähendab maavärina võimalikku mõju.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vähendada hoone purunemise ja inimeste vigastamise ohtu."
          },
          {
            "id": "i2",
            "text": "Et muuta maavärina kolle sügavamaks."
          },
          {
            "id": "i3",
            "text": "Et vältida maavärinast sõltumata kõiki võimalikke kahjustusi."
          },
          {
            "id": "i4",
            "text": "Et tagada, et majas pole pärast tugevamat maavärinat vaja kunagi kontrollida."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q017",
      "unitId": "lo-opik-u22",
      "stem": "Mida kirjeldab õpiku näide Jaapanist?",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-japan",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab Jaapanis tugevamaid maju, ranniku kaitserajatisi ja õppusi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Hoonete tugevdamist ja laste ohutusõppusi."
          },
          {
            "id": "i2",
            "text": "Et Jaapanis ei ehitata maavärina tõttu kõrgeid maju."
          },
          {
            "id": "i3",
            "text": "Et maavärinapiirkondades pole harjutamist vaja."
          },
          {
            "id": "i4",
            "text": "Et üksainus kaitsevall suudab igasuguse tsunami alati peatada."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q018",
      "unitId": "lo-opik-u22",
      "stem": "Mida teeb hoiatussüsteem?",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-warnings",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hoiatus aitab ohu korral varem tegutseda, kuid ei kõrvalda loodusnähtust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        },
        {
          "kind": "supplementary",
          "url": "https://www.ilmateenistus.ee/ilm/prognoosid/hoiatused/",
          "attribution": "Keskkonnaagentuuri Ilmateenistus — Hoiatused",
          "note": "Ohtliku ilma hoiatused ja ametlik prognoos."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Annab ohu kohta infot, et inimesed saaksid valmistuda."
          },
          {
            "id": "i2",
            "text": "Teatab, et oht on juba kindlasti möödas."
          },
          {
            "id": "i3",
            "text": "Asendab vajaduse ametlikke tegevusjuhiseid järgida."
          },
          {
            "id": "i4",
            "text": "Saab anda alati mitu nädalat varem täpse aja ja koha."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q019",
      "unitId": "lo-opik-u22",
      "stem": "Kas tugevate hoonete ehitamine peatab maavärina?",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-protection-not-prevention",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Valmistumine vähendab tagajärgi, mitte ei lõpeta Maa sisemisi liikumisi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Ei, see vähendab võimalikke kahjustusi."
          },
          {
            "id": "i2",
            "text": "Jah, sest tugeva hoone läheduses ei saa maapind väriseda."
          },
          {
            "id": "i3",
            "text": "Jah, kuid ainult siis, kui hoonel on rohkem kui kümme korrust."
          },
          {
            "id": "i4",
            "text": "Ei, ning tugevam ehitis ei saa ka inimeste ohtu mõjutada."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q020",
      "unitId": "lo-opik-u22",
      "stem": "Miks ei piisa ainult suurest kaitsevallist rannas?",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-limits",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üks abinõu ei anna täielikku garantiid; oluline on mitmekülgne valmistumine.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Suur oht võib kaitserajatisest üle jõuda, seetõttu on vaja ka hoiatusi ja põgenemisplaani."
          },
          {
            "id": "i2",
            "text": "Sest mereäärset kaitsevalli ei saa üldse kasutada."
          },
          {
            "id": "i3",
            "text": "Sest hoiatusi pole pärast kaitsevalli ehitamist enam vaja."
          },
          {
            "id": "i4",
            "text": "Sest üksainus kaitsevahend muudab kogu ranniku igas olukorras ohutuks."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q021",
      "unitId": "lo-opik-u22",
      "stem": "Millised tegevused aitavad loodusõnnetuse mõju vähendada?",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-measures",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õppused ja ohutum ehitus vähendavad võimalikke tagajärgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Ohutusõppuste korraldamine."
          },
          {
            "id": "i2",
            "text": "Hoonete ehitamine sobivate ohutusnõuetega."
          },
          {
            "id": "i3",
            "text": "Kõigi ohuhoiatuste ignoreerimine."
          },
          {
            "id": "i4",
            "text": "Laste saatmine ohtlikku kohta uudistama."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u22-q022",
      "unitId": "lo-opik-u22",
      "stem": "Mis vahe on ohu ennustamisel ja ohu ärahoidmisel?",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-forecast-v-stop",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hoiatused annavad aega valmistuda, kuid ei juhi looduse jõude.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        },
        {
          "kind": "supplementary",
          "url": "https://www.ilmateenistus.ee/ilm/prognoosid/hoiatused/",
          "attribution": "Keskkonnaagentuuri Ilmateenistus — Hoiatused",
          "note": "Ohtliku ilma hoiatused ja ametlik prognoos."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Prognoos aitab valmis olla, kuid ei pruugi loodusnähtust ära hoida."
          },
          {
            "id": "i2",
            "text": "Need on üks ja sama: prognoos muudab ilma kindlalt ohutuks."
          },
          {
            "id": "i3",
            "text": "Ennustamine aitab ainult pärast seda, kui oht on juba möödas."
          },
          {
            "id": "i4",
            "text": "Ilmaennustus näitab alati täpset aega, kuid mitte ühtegi võimalikku mõju."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q023",
      "unitId": "lo-opik-u22",
      "stem": "Leia skeemilt maja juures koht, mille korrashoid aitab vihmaveel ära voolata.",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-drain-pick",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vee äravoolusüsteemi korrashoid võib vähendada veekogunemise ohtu.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-prepared-home",
        "correctRegionId": "drain"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-prepared-home"
      }
    },
    {
      "id": "lo-opik-u22-q024",
      "unitId": "lo-opik-u22",
      "stem": "Leia skeemilt ettevalmistatud hädavajalike asjade kott.",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-kit-pick",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Valmisoleku kott aitab vajalikud esemed kiiresti kaasa võtta.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-prepared-home",
        "correctRegionId": "kit"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-prepared-home"
      }
    },
    {
      "id": "lo-opik-u22-q025",
      "unitId": "lo-opik-u22",
      "stem": "Ühenda valmistumise näide ja selle eesmärk.",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-drills",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ettevalmistused mõjutavad inimese valmisolekut, mitte loodusnähtuse teket.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        },
        {
          "kind": "supplementary",
          "url": "https://www.ilmateenistus.ee/ilm/prognoosid/hoiatused/",
          "attribution": "Keskkonnaagentuuri Ilmateenistus — Hoiatused",
          "note": "Ohtliku ilma hoiatused ja ametlik prognoos."
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Maavärinaõppus"
          },
          {
            "id": "p2",
            "text": "Vastupidavam hoone"
          },
          {
            "id": "p3",
            "text": "Ilmahoiatus"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Ohtlikus olukorras tegutsemise harjutamine"
          },
          {
            "id": "c2",
            "text": "Purunemisohu vähendamine"
          },
          {
            "id": "c3",
            "text": "Aeg enne ohtu valmistuda"
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
      "id": "lo-opik-u22-q026",
      "unitId": "lo-opik-u22",
      "stem": "Jaota tegevused: kas need aitavad ohu mõju vähendada?",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-actions",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Harjutamine ja hoiatuste kuulamine aitavad õigel ajal tegutseda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "helps",
            "text": "Vähendab riski"
          },
          {
            "id": "bad",
            "text": "Ei aita riski vähendada"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Õppida evakuatsioonitee selgeks"
          },
          {
            "id": "i2",
            "text": "Jälgida ametlikku hoiatust"
          },
          {
            "id": "i3",
            "text": "Naerda õppustel osalejate üle ja mitte kuulata"
          },
          {
            "id": "i4",
            "text": "Eirata teadet võimalikust tormist"
          }
        ],
        "correctGroupByItem": {
          "i1": "helps",
          "i2": "helps",
          "i3": "bad",
          "i4": "bad"
        }
      }
    },
    {
      "id": "lo-opik-u22-q027",
      "unitId": "lo-opik-u22",
      "stem": "Pane ettevalmistava pere tegevused loogilisse järjekorda.",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-family-plan",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Valmisolek tähendab plaani, varustuse ja tegevuste harjutamise ühendamist.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Pere arutab võimalikke kohalikke ohte."
          },
          {
            "id": "i2",
            "text": "Leitakse ohutu koht ja vajalikud vahendid."
          },
          {
            "id": "i3",
            "text": "Harjutatakse, mida ohu korral teha."
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
      "id": "lo-opik-u22-q028",
      "unitId": "lo-opik-u22",
      "stem": "Kuulutatakse välja tugev tormihoiatus. Milline tegevus näitab mõistlikku valmistumist?",
      "primaryObjectiveId": "lo-opik-u22-o2",
      "variantGroupId": "lo-opik-u22-o2-warning-response",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hoiatusele reageeritakse selle sisu järgi ja ohutult, mitte ohtu otsides.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.ilmateenistus.ee/ilm/prognoosid/hoiatused/",
          "attribution": "Keskkonnaagentuuri Ilmateenistus — Hoiatused",
          "note": "Ohtliku ilma hoiatused ja ametlik prognoos."
        },
        {
          "kind": "supplementary",
          "url": "https://www.olevalmis.ee/et-simple/torm-tugev-tuul-aike-ja-sademed",
          "attribution": "Ole valmis! — Torm (lihtsas keeles)",
          "note": "Tormi ajal varju, hoidumine puudest ja lendavatest esemetest."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Pere vaatab ametlikke juhiseid ja paneb vajalikud vahendid valmis."
          },
          {
            "id": "i2",
            "text": "Lähen tugeva tuule ajal puude alla, et purunevaid oksi näha."
          },
          {
            "id": "i3",
            "text": "Hoiatus on kindlasti vale, kui parasjagu akna taga tuult pole."
          },
          {
            "id": "i4",
            "text": "Kui hoiatus tuleb telefoni, ei ole vaja selle sisu lugeda."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q029",
      "unitId": "lo-opik-u22",
      "stem": "Milline on õpikus nimetatud Eesti võimalik ilmaoht?",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-heavy-rain",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik loetleb ohtlike nähtuste hulgas paduvihma ja üleujutused.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Paduvihm ja üleujutus."
          },
          {
            "id": "i2",
            "text": "Tavaline mõõdukas tuul õues."
          },
          {
            "id": "i3",
            "text": "Nõrk vihmasabin ilma kahjuta."
          },
          {
            "id": "i4",
            "text": "Lühike meeldivalt soe pärastlõuna."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q030",
      "unitId": "lo-opik-u22",
      "stem": "Milline ilmastikunähtus tähendab tuulega edasi kanduvat lund?",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-blizzard",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tuisu ajal kannab tuul lund edasi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tuisk."
          },
          {
            "id": "i2",
            "text": "Udu, mis tekib niiske õhu jahtumisel."
          },
          {
            "id": "i3",
            "text": "Pakaseline ilm, kus lund ei saja ega tuiska."
          },
          {
            "id": "i4",
            "text": "Kerge lumesadu täielikus tuulevaikuses."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q031",
      "unitId": "lo-opik-u22",
      "stem": "Mida tähendab pikalt kestev pakane?",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-frost",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pakane on tugev külm, mis kestes võib tervist ohustada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Pika aja vältel püsiv tugev külm."
          },
          {
            "id": "i2",
            "text": "Mõneminutiline külm tuuleiil suvel."
          },
          {
            "id": "i3",
            "text": "Ühekordne hommikune udu."
          },
          {
            "id": "i4",
            "text": "Päeva jooksul vahelduv kerge vihmasadu."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q032",
      "unitId": "lo-opik-u22",
      "stem": "Millist suvist ilmaohtu nimetab õpik?",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-heat",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku loetelus on ka pikalt kestev suur kuumus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kaua püsiv suur kuumus."
          },
          {
            "id": "i2",
            "text": "Kergelt soe suvepäev ilma tugeva kuumuseta."
          },
          {
            "id": "i3",
            "text": "Üksik päikesepaiste pärast jahedat hommikut."
          },
          {
            "id": "i4",
            "text": "Tavaline päev, kus ilm muutub pisut soojemaks."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q033",
      "unitId": "lo-opik-u22",
      "stem": "Miks võib tugev lumesadu koos tuulega olla ohtlikum kui nõrk lumesadu?",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-visibility",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tuul kannab lund õhus ja võib muuta liiklemise keeruliseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        },
        {
          "kind": "supplementary",
          "url": "https://www.olevalmis.ee/et-simple/torm-tugev-tuul-aike-ja-sademed",
          "attribution": "Ole valmis! — Torm (lihtsas keeles)",
          "note": "Tormi ajal varju, hoidumine puudest ja lendavatest esemetest."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tuisuga võib nähtavus tugevasti halveneda ja liiklemine muutuda raskeks."
          },
          {
            "id": "i2",
            "text": "Sest tuisk tekib ainult siis, kui lumi juba on sulanud."
          },
          {
            "id": "i3",
            "text": "Sest tuul ei saa lume liikumist ega nähtavust mõjutada."
          },
          {
            "id": "i4",
            "text": "Sest lumesaju tugevus ei saa kunagi muuta liikumist raskemaks."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q034",
      "unitId": "lo-opik-u22",
      "stem": "Miks ei ole üks soe suvepäev sama mis pikaajaline ohtlik kuumus?",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-heat-diff",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik räägib kaua püsivast suurest kuumusest, mitte igast soojast päevast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Pikalt püsiv suur kuumus võib tervist palju enam koormata."
          },
          {
            "id": "i2",
            "text": "Üks soe päev on alati sama ohtlik kui nädalaid kestev kuumus."
          },
          {
            "id": "i3",
            "text": "Kuumus mõjutab inimesi ainult siis, kui samal ajal sajab lund."
          },
          {
            "id": "i4",
            "text": "Kaua kestev suur kuumus pole kuidagi erinev mõõdukast soojast ilmast."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q035",
      "unitId": "lo-opik-u22",
      "stem": "Millised nähtused esinevad õpiku Eesti ilmaohtude loetelus?",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-list",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik loetleb tugevad tormid ja tuisud võimalike ilmaohtudena.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Tugev tuisk."
          },
          {
            "id": "i2",
            "text": "Väga tugev tuul."
          },
          {
            "id": "i3",
            "text": "Igapäevane nõrk udu kui eraldi suurõnnetus."
          },
          {
            "id": "i4",
            "text": "Tavaline mõõdukas kevadilm."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u22-q036",
      "unitId": "lo-opik-u22",
      "stem": "Mille poolest erinevad pakane ja tuisk?",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-winter-compare",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pakane kirjeldab temperatuuri, tuisk lume ja tuule koosmõju.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Pakane tähendab tugevat külma; tuisk tähendab tuulega edasi kanduvat lund."
          },
          {
            "id": "i2",
            "text": "Pakane tähendab kiiret lumesadu; tuisk tähendab tugevat külma ilma lumeta."
          },
          {
            "id": "i3",
            "text": "Tuisk tähendab alati vihma; pakane tähendab ainult tugevat tuult."
          },
          {
            "id": "i4",
            "text": "Need on sama nähtuse kaks sõna ega erine üksteisest."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q037",
      "unitId": "lo-opik-u22",
      "stem": "Puuduta skeemil tugevat lumesadu koos tuulega kujutavat osa.",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-blizzard",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tuisku kujutavad lendav lumi ja tugev tuul.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-estonia-weather",
        "correctRegionId": "blizzard"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-estonia-weather"
      }
    },
    {
      "id": "lo-opik-u22-q038",
      "unitId": "lo-opik-u22",
      "stem": "Leia skeemilt pikaajalise suure kuumuse näide.",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-heat",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tugeva kuumuse sümbol on kuumalaine kujutis.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-estonia-weather",
        "correctRegionId": "heat"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-estonia-weather"
      }
    },
    {
      "id": "lo-opik-u22-q039",
      "unitId": "lo-opik-u22",
      "stem": "Leia skeemilt väga tugeva tuule näide.",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-wind",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tormituulega seotud skeemi osas painduvad puud ja lendavad esemed.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-estonia-weather",
        "correctRegionId": "wind"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-estonia-weather"
      }
    },
    {
      "id": "lo-opik-u22-q040",
      "unitId": "lo-opik-u22",
      "stem": "Jaga nähtused: talvine külmaoht või teistsugune ilmaoht.",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-groups",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pakane ja tuisk on külma või lumega seotud nähtused; kuumus ja paduvihm on teistsugused.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "winter",
            "text": "Talvine külma- või lumega seotud oht"
          },
          {
            "id": "other",
            "text": "Muu ilmaoht"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Pikalt kestev pakane"
          },
          {
            "id": "i2",
            "text": "Tugev tuisk"
          },
          {
            "id": "i3",
            "text": "Kuumalaine"
          },
          {
            "id": "i4",
            "text": "Paduvihm"
          }
        ],
        "correctGroupByItem": {
          "i1": "winter",
          "i2": "winter",
          "i3": "other",
          "i4": "other"
        }
      }
    },
    {
      "id": "lo-opik-u22-q041",
      "unitId": "lo-opik-u22",
      "stem": "Ühenda nähtus ja kirjeldus.",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-weather-pairs",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Neid nähtusi saab eristada sademete, tuule ja temperatuuri järgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Paduvihm"
          },
          {
            "id": "p2",
            "text": "Tuisk"
          },
          {
            "id": "p3",
            "text": "Pakane"
          },
          {
            "id": "p4",
            "text": "Kuumalaine"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Lühikese ajaga sajab palju vihma"
          },
          {
            "id": "c2",
            "text": "Tuul kannab õhus lund"
          },
          {
            "id": "c3",
            "text": "Püsib väga tugev külm"
          },
          {
            "id": "c4",
            "text": "Suur kuumus kestab pikalt"
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
      "id": "lo-opik-u22-q042",
      "unitId": "lo-opik-u22",
      "stem": "Ilmateade lubab tugevat külma ja tuulega lendavat lund. Mis on peamine ohu kombinatsioon?",
      "primaryObjectiveId": "lo-opik-u22-o3",
      "variantGroupId": "lo-opik-u22-o3-blizzard-frost",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kirjeldatud olukorras esinevad korraga tugev külm ja tuisk.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Pakane ja tuisk."
          },
          {
            "id": "i2",
            "text": "Ainult kuumalaine ja tormituul ilma lumeta."
          },
          {
            "id": "i3",
            "text": "Ainult tugev vihm ning merevee tõus."
          },
          {
            "id": "i4",
            "text": "Tavaline udu ja soe suvine päev."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q043",
      "unitId": "lo-opik-u22",
      "stem": "Mis on üleujutus?",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-definition",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutuse korral jäävad tavaliselt kuivad kohad vee alla.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vesi katab maa-ala, mis on tavaliselt kuiv."
          },
          {
            "id": "i2",
            "text": "Kui vihma sajab, kuid kogu vesi voolab ära."
          },
          {
            "id": "i3",
            "text": "Kui jõgi voolab tavapäraselt oma sängis."
          },
          {
            "id": "i4",
            "text": "Kui tee on märg, aga kuiv maa ei jää veekihi alla."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q044",
      "unitId": "lo-opik-u22",
      "stem": "Mis võib Eestis tugeva vihmaga üleujutust põhjustada?",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-rainfall",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vee hulk võib ületada pinnase imamisvõime ja äravoolu kiiruse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vett sajab rohkem, kui jõutakse maasse imada ja ära juhtida."
          },
          {
            "id": "i2",
            "text": "Kui vihma sajab vähem, kui jõgi ära juhtida suudab."
          },
          {
            "id": "i3",
            "text": "Kui pinnas imeb kogu vihma kiiresti sisse."
          },
          {
            "id": "i4",
            "text": "Kui madalal kohal on äravool küllaldane ja vesi ei kogune."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q045",
      "unitId": "lo-opik-u22",
      "stem": "Milline koht on õpiku pildi järgi tugeva vihmaga üle ujutatud?",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-laagna",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku fotol on näidatud vett täis Tallinna Laagna teed.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tallinna Laagna tee."
          },
          {
            "id": "i2",
            "text": "Tallinna Vabaduse väljak."
          },
          {
            "id": "i3",
            "text": "Tartu Raekoja plats."
          },
          {
            "id": "i4",
            "text": "Pärnu rannapromenaad."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q046",
      "unitId": "lo-opik-u22",
      "stem": "Mis roll on jõgedel üleujutuse tekkimise selgituses?",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-rivers",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui vett tuleb liiga palju, ei pruugi jõed seda piisavalt kiiresti ära juhtida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Jõed võivad suure veehulga ärajuhtimisega hätta jääda."
          },
          {
            "id": "i2",
            "text": "Nad saavad iga üleujutuse kindlasti ära hoida."
          },
          {
            "id": "i3",
            "text": "Nad juhivad vihmavee alati ühtlaselt mägede tippu."
          },
          {
            "id": "i4",
            "text": "Nad hakkavad suure saju korral alati kiiremini voolama ega saa üle kallaste tõusta."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q047",
      "unitId": "lo-opik-u22",
      "stem": "Miks võib linnatänavale tekkida sügav veekiht?",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-urban",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vee kogunemine sõltub sademete hulgast ning äravoolust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Sademevett koguneb kiiremini, kui see imbub või ära voolab."
          },
          {
            "id": "i2",
            "text": "Sest igal tänaval imendub vihm alati otse asfaldisse."
          },
          {
            "id": "i3",
            "text": "Sest tänaval saab vesi koguneda vaid siis, kui meri asub kõrval."
          },
          {
            "id": "i4",
            "text": "Sest kõvakattega teedel ei liigu vihmavesi üldse."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q048",
      "unitId": "lo-opik-u22",
      "stem": "Mida tähendab lause „vesi ei jõua piisavalt kiiresti maasse imbuda”?",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-soil",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui imbumine on aeglasem kui sademevee lisandumine, jääb osa veest pinnale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vesi jääb rohkem maapinnale ja võib mujale voolata."
          },
          {
            "id": "i2",
            "text": "Vesi kaob kohe, nii et pinnale ei jää midagi."
          },
          {
            "id": "i3",
            "text": "Pinnas suudab vett vastu võtta alati kiiremini, kui seda sajab."
          },
          {
            "id": "i4",
            "text": "Vihmavesi muutub igas pinnases kindlasti mereveeks."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q049",
      "unitId": "lo-opik-u22",
      "stem": "Millised olukorrad võivad paduvihma ajal vee kogunemisele kaasa aidata?",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-drain-limits",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutuse tõenäosust suurendab liiga suur veehulk või aeglane äravool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Sademeveetorud ei jõua vett piisavalt kiiresti ära juhtida."
          },
          {
            "id": "i2",
            "text": "Pinnas on juba veest küllastunud."
          },
          {
            "id": "i3",
            "text": "Vihm lõppeb ja kõik kohad on kuivad."
          },
          {
            "id": "i4",
            "text": "Maapinnale vett ei saabu."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u22-q050",
      "unitId": "lo-opik-u22",
      "stem": "Mis juhtub, kui tugev vihm jätkub ja madalasse kohta tuleb rohkem vett kui sealt välja liigub?",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-lowspot",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutuse korral võib vett lisanduda kiiremini, kui see ära voolab.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Veetase võib selles kohas tõusta."
          },
          {
            "id": "i2",
            "text": "Vesi kaob alati kiiremini, mida rohkem sajab."
          },
          {
            "id": "i3",
            "text": "Madalasse kohta ei saa vesi kunagi koguneda."
          },
          {
            "id": "i4",
            "text": "Vee juurdevool ja äravool ei mõjuta veetaset."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q051",
      "unitId": "lo-opik-u22",
      "stem": "Puuduta skeemil ala, kuhu vihmavesi on teel kogunenud.",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-road-pick",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Madalal teel kogunenud vesi on näide võimalikust üleujutusest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-rain-flood",
        "correctRegionId": "flooded-road"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-rain-flood"
      }
    },
    {
      "id": "lo-opik-u22-q052",
      "unitId": "lo-opik-u22",
      "stem": "Leia skeemilt osa, mis aitab vihmavett tänavalt ära juhtida.",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-drain-pick",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Äravooluava aitab vihmavett ära juhtida, kui süsteem töötab.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-rain-flood",
        "correctRegionId": "drain"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-rain-flood"
      }
    },
    {
      "id": "lo-opik-u22-q053",
      "unitId": "lo-opik-u22",
      "stem": "Sea vihmast tekkiva üleujutuse sündmused õigesse järjekorda.",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-rain-chain",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõigepealt tuleb palju vett, seejärel koguneb äravoolust üle jääv vesi madalasse kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Algab tugev vihmasadu."
          },
          {
            "id": "i2",
            "text": "Osa veest ei jõua pinnasesse imbuda ega ära voolata."
          },
          {
            "id": "i3",
            "text": "Vesi koguneb madalale teele."
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
      "id": "lo-opik-u22-q054",
      "unitId": "lo-opik-u22",
      "stem": "Rühmita väited: kas see võib vihmavee üleujutust suurendada?",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-flood-sort",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutuse oht suureneb, kui vett tuleb palju ja selle äravool on takistatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "risk",
            "text": "Suurendab vee kogunemise ohtu"
          },
          {
            "id": "other",
            "text": "Ei suurenda kirjelduses vee kogunemist"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Suur vihmasadu lühikese ajaga"
          },
          {
            "id": "i2",
            "text": "Äravoolutee on ummistunud"
          },
          {
            "id": "i3",
            "text": "Vihm lõpeb ja äravool töötab hästi"
          },
          {
            "id": "i4",
            "text": "Lühike kuiv ilm"
          }
        ],
        "correctGroupByItem": {
          "i1": "risk",
          "i2": "risk",
          "i3": "other",
          "i4": "other"
        }
      }
    },
    {
      "id": "lo-opik-u22-q055",
      "unitId": "lo-opik-u22",
      "stem": "Ühenda koht ja üleujutuse selgitus.",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-location-effects",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vesi liigub ja koguneb kohtadesse sõltuvalt pinnast, reljeefist ning äravoolust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Madal linnatänav"
          },
          {
            "id": "p2",
            "text": "Kelder"
          },
          {
            "id": "p3",
            "text": "Jõgi"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Vesi võib koguneda lohku"
          },
          {
            "id": "c2",
            "text": "Vesi võib liikuda hoone kõige madalamasse ossa"
          },
          {
            "id": "c3",
            "text": "Suur veehulk võib voolusängist välja tõusta"
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
      "id": "lo-opik-u22-q056",
      "unitId": "lo-opik-u22",
      "stem": "Pärast paduvihma on maja ees madal koht vee all. Milline selgitus on kõige tõenäolisem?",
      "primaryObjectiveId": "lo-opik-u22-o4",
      "variantGroupId": "lo-opik-u22-o4-application",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutus võib alata sellest, et pinnas ja äravool ei tule vee hulgaga toime.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vett saabus kiiremini, kui see maasse imbus ja ära voolas."
          },
          {
            "id": "i2",
            "text": "Madalale kohale sattus liiga palju päikesekiirgust."
          },
          {
            "id": "i3",
            "text": "Äravool töötas suure saju ajal palju kiiremini kui tavaliselt."
          },
          {
            "id": "i4",
            "text": "Kohale ei tulnud vihmavett ning lähedal ei olnud veekogu."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q057",
      "unitId": "lo-opik-u22",
      "stem": "Mis võib madalal mererannikul tõsta veetaset?",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-wind",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab rannikul üleujutuse põhjusena tormist tingitud merevee tõusu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tugev tormituul kuhjab merevett ranniku poole."
          },
          {
            "id": "i2",
            "text": "Merevee tase rannal tõuseb ainult tuulevaikusega."
          },
          {
            "id": "i3",
            "text": "Kogu merevesi voolab tormi ajal tingimata rannikult eemale."
          },
          {
            "id": "i4",
            "text": "Rannal tõuseb veetase ainult jõest tuleva veega."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q058",
      "unitId": "lo-opik-u22",
      "stem": "Kus võib tormist tingitud merevee tõus kõige otsesemalt üleujutust tekitada?",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-low-coast",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Madal rannik võib merevee tõusu korral kergemini vee alla jääda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Madalal rannikualal."
          },
          {
            "id": "i2",
            "text": "Kõrgel künkal, mida tõusnud veetase ei ulatu katma."
          },
          {
            "id": "i3",
            "text": "Sügaval sisemaal asuval kõrgustikul."
          },
          {
            "id": "i4",
            "text": "Kõrgel rannakaljul, mis jääb veepiirist ülespoole."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q059",
      "unitId": "lo-opik-u22",
      "stem": "Milline nähtus on õpikus nimetatud rannikualade üleujutuse võimaliku põhjusena?",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-sea-level",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku näide seob rannikuuputuse tugeva tuulega tõusnud mereveega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tormiga tõusnud mereveetase."
          },
          {
            "id": "i2",
            "text": "Tavaline nõrk meretuul ilma vee taseme muutuseta."
          },
          {
            "id": "i3",
            "text": "Päikeseline päev, kui meretase ei tõuse."
          },
          {
            "id": "i4",
            "text": "Kergevihm sisemaal, kus merevesi ei ulatu rannikuni."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q060",
      "unitId": "lo-opik-u22",
      "stem": "Milline veekogu võib oma tõusnud veetasemega rannikul maad üle ujutada?",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-sea",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Merevee tase võib tormi ajal rannas ajutiselt tõusta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Meri."
          },
          {
            "id": "i2",
            "text": "Vihmaveerenn maja katusel."
          },
          {
            "id": "i3",
            "text": "Mäetipul olev lumekiht."
          },
          {
            "id": "i4",
            "text": "Väike põllulomp, millel pole merega ühendust."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q061",
      "unitId": "lo-opik-u22",
      "stem": "Mis vahe on tugeva vihma ja rannikul mereveetõusu põhjustatud üleujutusel?",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-difference",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutuste tekkepõhjused võivad olla erinevad: vihm või kõrge mereveetase.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Esimeses lisandub vesi peamiselt sademetest, teises kuhjatakse merevett rannikule."
          },
          {
            "id": "i2",
            "text": "Mõlemad tekivad alati ainult suure jõe üle kallaste tõusust."
          },
          {
            "id": "i3",
            "text": "Merevee tõus rannal nõuab alati samas kohas tugevat vihma."
          },
          {
            "id": "i4",
            "text": "Tugev vihm saab üleujutuse põhjustada ainult mererannikul."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q062",
      "unitId": "lo-opik-u22",
      "stem": "Kas tormiga tõusnud merevesi võib põhjustada üleujutuse ka ilma kohaliku paduvihmata?",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-no-rain",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mererannikul võib ohu põhjustada tuulest tingitud veetaseme tõus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Jah, tuul võib iseseisvalt merevee taset rannas tõsta."
          },
          {
            "id": "i2",
            "text": "Ei, rannikul peab alati samal ajal vihma sadama."
          },
          {
            "id": "i3",
            "text": "Ei, tormituul ei saa merevee taset kunagi mõjutada."
          },
          {
            "id": "i4",
            "text": "Jah, kuid ainult siis, kui lähedal pole ühtegi inimest."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q063",
      "unitId": "lo-opik-u22",
      "stem": "Millised väited merega seotud üleujutuse kohta on õiged?",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-coastal-rules",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Torm ja ranniku madal asend võivad koos üleujutusriski suurendada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Madal rannik võib jääda tõusva merevee alla."
          },
          {
            "id": "i2",
            "text": "Tugev tormituul võib veetaset rannal tõsta."
          },
          {
            "id": "i3",
            "text": "Mereveetõus ei saa kunagi hooneid kahjustada."
          },
          {
            "id": "i4",
            "text": "Üleujutus tekib igas paigas ainult jõest."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u22-q064",
      "unitId": "lo-opik-u22",
      "stem": "Miks võib üks madal rannaala üleujutada, kuid lähedane kõrge kalju jääda kuivaks?",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-height",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõrgem maa asub veetasemest kõrgemal ja võib jääda kuivaks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vee ulatus sõltub muu hulgas maapinna kõrgusest."
          },
          {
            "id": "i2",
            "text": "Sest üleujutus ei sõltu üldse maapinna kõrgusest."
          },
          {
            "id": "i3",
            "text": "Sest tõusnud merevesi peab jõudma alati igale kõrgusele."
          },
          {
            "id": "i4",
            "text": "Sest ükskõik kui madal meri on, kõik rannad ujutatakse alati üle."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q065",
      "unitId": "lo-opik-u22",
      "stem": "Leia skeemilt tugev tuul, mis lükkab vett rannikule.",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-wind",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tormituul võib kuhjata vett ranniku poole.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-coastal-flood",
        "correctRegionId": "wind"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-coastal-flood"
      }
    },
    {
      "id": "lo-opik-u22-q066",
      "unitId": "lo-opik-u22",
      "stem": "Leia skeemilt madal rannikuala, kuhu meri võib tõusta.",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-low-coast",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Madalal rannal on üleujutusoht veetaseme tõustes suurem.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-coastal-flood",
        "correctRegionId": "low-shore"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-coastal-flood"
      }
    },
    {
      "id": "lo-opik-u22-q067",
      "unitId": "lo-opik-u22",
      "stem": "Rühmita põhjused: paduvihm või tormiga tõusnud merevesi.",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-causes-group",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vihmavee kogunemine ja tormiga rannikule kuhjunud merevesi on eri põhjustega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "rain",
            "text": "Vihmast tingitud üleujutus"
          },
          {
            "id": "sea",
            "text": "Merevee tõusust tingitud üleujutus"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Vihma tuleb rohkem, kui pinnas imab"
          },
          {
            "id": "i2",
            "text": "Sademeveesüsteem ei jõua vett ära juhtida"
          },
          {
            "id": "i3",
            "text": "Tugev meretuul kuhjab vett rannikule"
          },
          {
            "id": "i4",
            "text": "Meri katab madala rannariba"
          }
        ],
        "correctGroupByItem": {
          "i1": "rain",
          "i2": "rain",
          "i3": "sea",
          "i4": "sea"
        }
      }
    },
    {
      "id": "lo-opik-u22-q068",
      "unitId": "lo-opik-u22",
      "stem": "Ühenda olukord kõige tõenäolisema selgitusega.",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-scenario-pairs",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutuse põhjus sõltub sademetest, vee liikumisest ja maapinna kõrgusest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Tänav pärast suurt paduvihma"
          },
          {
            "id": "p2",
            "text": "Madal rannik tugevate meretuultega"
          },
          {
            "id": "p3",
            "text": "Kõrge kivine rannik veetasemest kõrgemal"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Sadevesi ei jõua ära voolata"
          },
          {
            "id": "c2",
            "text": "Merevesi kuhjub rannale"
          },
          {
            "id": "c3",
            "text": "Vesi ei pruugi selle kõrguseni ulatuda"
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
      "id": "lo-opik-u22-q069",
      "unitId": "lo-opik-u22",
      "stem": "Sea merevee tõusust tingitud üleujutuse etapid õigesse järjekorda.",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-sea-chain",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tormituul võib tõsta rannal merevee taset kuni üleujutuseni.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Merel puhub tugev tuul."
          },
          {
            "id": "i2",
            "text": "Tuul kuhjab vett madala ranniku poole."
          },
          {
            "id": "i3",
            "text": "Vesi ulatub tavaliselt kuivale rannamaale."
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
      "id": "lo-opik-u22-q070",
      "unitId": "lo-opik-u22",
      "stem": "Rannakülas pole sadanud, kuid tugev meretuul on tõstnud veetaset tänavale. Mis seda selgitab?",
      "primaryObjectiveId": "lo-opik-u22-o5",
      "variantGroupId": "lo-opik-u22-o5-apply-sea",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kirjeldatud juhtumis on ohu allikas rannikule kuhjunud merevesi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tormiga kaasnev merevee tõus."
          },
          {
            "id": "i2",
            "text": "Madal rannik jäi kuivaks, sest seal ei saa meri kunagi tõusta."
          },
          {
            "id": "i3",
            "text": "Teed kattis vihmavesi, kuigi kirjelduses pole vihma olnud."
          },
          {
            "id": "i4",
            "text": "Üleujutus sai tulla ainult sellest, et läheduses oli jõgi."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q071",
      "unitId": "lo-opik-u22",
      "stem": "Millist kahju võivad tugevad loodusnähtused tekitada?",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-property",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab majade ja teede purunemist ning saagi hävimist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "82"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kahjustada teid ja maju ning hävitada põllusaaki."
          },
          {
            "id": "i2",
            "text": "Mõnikord tekivad ainult väiksed lombid, ent hooneid ei saa kahjustuda."
          },
          {
            "id": "i3",
            "text": "Kahju piirdub alati üksnes lumesaju ajal kadunud nähtavusega."
          },
          {
            "id": "i4",
            "text": "Kõik loodusõnnetused mööduvad ilma inimesele või varale kahju tekitamata."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q072",
      "unitId": "lo-opik-u22",
      "stem": "Milline liiklusoht on õpiku Laagna tee näite puhul kõige selgem?",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-road",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku pildil on tänav üleujutatud, nii et autoga liikumine võib olla ohtlik.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Autotee on veega kaetud."
          },
          {
            "id": "i2",
            "text": "Autoteel puhub ainult nõrk tuul."
          },
          {
            "id": "i3",
            "text": "Teel on tavaline kuiv liiklus."
          },
          {
            "id": "i4",
            "text": "Tänavavalgustus on fotol sisse lülitatud."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q073",
      "unitId": "lo-opik-u22",
      "stem": "Kuidas nimetab õpiku pildiallkiri kiiresti tõusva veetasemega üleujutusvett?",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-flash",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku pildiallkirjas nimetatakse kiiret veetaseme tõusu tulvaveeks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Tulvavesi."
          },
          {
            "id": "i2",
            "text": "Sadevesi, mis langeb maapinnale ja voolab tavaliselt ära."
          },
          {
            "id": "i3",
            "text": "Põhjavesi, mis asub maa all."
          },
          {
            "id": "i4",
            "text": "Merevesi, mis tõuseb rannikul aeglaselt ja ühtlaselt."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q074",
      "unitId": "lo-opik-u22",
      "stem": "Milline kodu osa on üleujutuse korral eriti ohustatud, sest see paikneb sageli maa all?",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-basement",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vesi võib koguneda madalale ja tungida keldrisse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Kelder."
          },
          {
            "id": "i2",
            "text": "Esimese korruse aknast kõrgem pööning."
          },
          {
            "id": "i3",
            "text": "Hoone kõrgem katusehari."
          },
          {
            "id": "i4",
            "text": "Teise korruse ülemine rõdu."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q075",
      "unitId": "lo-opik-u22",
      "stem": "Miks võib üleujutatud tänav olla ohtlik isegi siis, kui vee pind näib rahulik?",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-hidden-depth",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Veepind ei näita usaldusväärselt sügavust ega veealuseid takistusi.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vee all võivad olla augud, vool ja muud nähtamatud ohud."
          },
          {
            "id": "i2",
            "text": "Sest vees ei saa elektrist tekkida ühtegi ohtu."
          },
          {
            "id": "i3",
            "text": "Sest rahulikuna näiv vesi on alati madal ja puhas."
          },
          {
            "id": "i4",
            "text": "Sest kõik üleujutatud teed on sõidukitele alati läbitavad."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q076",
      "unitId": "lo-opik-u22",
      "stem": "Miks nimetatakse kiiret veetaseme tõusu eriti ohtlikuks?",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-speed",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kiirelt tõusva veega tuleb valmis olla lühikese aja jooksul.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        },
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Inimestel võib jääda vähe aega veest eemale liikuda."
          },
          {
            "id": "i2",
            "text": "Sest vesi voolab alati aeglasemalt, kui veetase kiiresti tõuseb."
          },
          {
            "id": "i3",
            "text": "Sest kiiret veetaseme muutust saab alati pikalt ette näha."
          },
          {
            "id": "i4",
            "text": "Sest kiire üleujutus ei saa kunagi lõhkuda ühtegi teed."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q077",
      "unitId": "lo-opik-u22",
      "stem": "Millised on üleujutuse võimalikud tagajärjed?",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-effects",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik kirjeldab vee sattumist tänavatele, keldritesse ja põldudele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Keldritesse tungib vesi."
          },
          {
            "id": "i2",
            "text": "Teed või põllud jäävad vee alla."
          },
          {
            "id": "i3",
            "text": "Kõik elektrijuhtmed muutuvad automaatselt ohutuks."
          },
          {
            "id": "i4",
            "text": "Üleujutus ei saa kunagi liiklust mõjutada."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u22-q078",
      "unitId": "lo-opik-u22",
      "stem": "Mida saad otsustada, kui tänav näeb välja nagu järv?",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-not-playground",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vee sügavus, vool ja muud ohud ei pruugi pinnalt nähtavad olla.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        },
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "See on võimalik üleujutusoht, mitte koht mängimiseks."
          },
          {
            "id": "i2",
            "text": "Üleujutatud teed võib alati ohutult läbida, kui sõiduk on suur."
          },
          {
            "id": "i3",
            "text": "Üleujutatud vesi on alati nii madal, et elektrioht puudub."
          },
          {
            "id": "i4",
            "text": "Kui teel pole näha laineid, ei saa seal peidus olla auke."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q079",
      "unitId": "lo-opik-u22",
      "stem": "Leia skeemilt koht, kus vesi on katnud tavaliselt kuiva maantee.",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-road",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutatud maantee ei ole enam ohutu liiklemiskoht.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-rain-flood",
        "correctRegionId": "flooded-road"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-rain-flood"
      }
    },
    {
      "id": "lo-opik-u22-q080",
      "unitId": "lo-opik-u22",
      "stem": "Leia ohusituatsiooni pildilt langenud elektrijuhtmega seotud oht.",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-wire-pick",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Langenud elektrijuhe ja vesi on ohtlik kooslus.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-flood-safety",
        "correctRegionId": "power-line"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-flood-safety"
      }
    },
    {
      "id": "lo-opik-u22-q081",
      "unitId": "lo-opik-u22",
      "stem": "Jaga kirjeldused: üleujutuse tagajärg või mitte.",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-impact-group",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutus tähendab tavaliselt kuiva maa-ala vee alla jäämist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "yes",
            "text": "Üleujutuse võimalik tagajärg"
          },
          {
            "id": "no",
            "text": "Ei ole siin üleujutuse tagajärg"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Vesi tungib keldrisse"
          },
          {
            "id": "i2",
            "text": "Autotee jääb vee alla"
          },
          {
            "id": "i3",
            "text": "Mõni puu õitseb kevadel"
          },
          {
            "id": "i4",
            "text": "Kuu ilmub öösel nähtavale"
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
      "id": "lo-opik-u22-q082",
      "unitId": "lo-opik-u22",
      "stem": "Ühenda üleujutuse märk ja sellega seotud oht.",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-impacts-match",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Erinevad märgid viitavad erinevatele ohtudele.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        },
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Veega kaetud sõidutee"
          },
          {
            "id": "p2",
            "text": "Vee alla jäänud kelder"
          },
          {
            "id": "p3",
            "text": "Vette ulatuv elektrijuhe"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Liiklus ei pruugi olla ohutu"
          },
          {
            "id": "c2",
            "text": "Hoonesse on tunginud vesi"
          },
          {
            "id": "c3",
            "text": "Võimalik elektrilöögioht"
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
      "id": "lo-opik-u22-q083",
      "unitId": "lo-opik-u22",
      "stem": "Järjesta üleujutuse olukord selle süvenemise järgi.",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-deepening",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Veetase võib üleujutuses tõusta ja muuta varem ohutu tee ohtlikuks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "83"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Tänav on algul kuiv."
          },
          {
            "id": "i2",
            "text": "Vesi hakkab madalasse kohta kogunema."
          },
          {
            "id": "i3",
            "text": "Veetase tõuseb ja tee muutub ohtlikuks."
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
      "id": "lo-opik-u22-q084",
      "unitId": "lo-opik-u22",
      "stem": "Näed tugeva vihma järel, et jalgtee on sügava veega kaetud. Mis on kõige targem järeldus?",
      "primaryObjectiveId": "lo-opik-u22-o6",
      "variantGroupId": "lo-opik-u22-o6-scenario",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutuse puhul tuleb hoiduda veest ja tegutseda ohutult.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vee sügavus ja vool on teadmata: otsin kuiva ohutu tee ning räägin täiskasvanuga."
          },
          {
            "id": "i2",
            "text": "Astun ise vette, et otsida jalale sobiv sügavus."
          },
          {
            "id": "i3",
            "text": "Ootan vee sees, kuni täiskasvanu kohale jõuab."
          },
          {
            "id": "i4",
            "text": "Proovin kõigepealt elektriliini juures vee kõrgust mõõta."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q085",
      "unitId": "lo-opik-u22",
      "stem": "Kuidas käituda üleujutatud tänavat nähes?",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-avoid-water",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Päästeamet soovitab üleujutatud piirkonnas mitte liikuda.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Väldi üleujutatud kohta ja otsi kuiva ohutut teed."
          },
          {
            "id": "i2",
            "text": "Vette võib minna, kui sõber arvab, et see on madal."
          },
          {
            "id": "i3",
            "text": "Vesi on ohutu, kui sellel pole näha kiiret voolu."
          },
          {
            "id": "i4",
            "text": "Lapsed võivad üleujutatud tee tavaliselt läbi kõndida, kui see tundub tuttav."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q086",
      "unitId": "lo-opik-u22",
      "stem": "Mida teha, kui üleujutusvesi ulatub elektriseadmeteni?",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-electric",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Märjad elektriseadmed ja vesi võivad põhjustada elektrilöögi. Laps ei tegele elektri väljalülitamisega vees.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Hoia neist eemale ja anna täiskasvanule teada."
          },
          {
            "id": "i2",
            "text": "Lülitan märja seadme ise sisse, et kontrollida selle tööd."
          },
          {
            "id": "i3",
            "text": "Lähen vee sisse, et jõuda elektrikilbini."
          },
          {
            "id": "i4",
            "text": "Proovin katkise juhtme ise veest välja tõsta."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q087",
      "unitId": "lo-opik-u22",
      "stem": "Kus tuleks tugeva tormi ajal võimaluse korral olla?",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-storm-shelter",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tormi ajal on turvalisem viibida hoones ja hoida akendest eemale.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.olevalmis.ee/et-simple/torm-tugev-tuul-aike-ja-sademed",
          "attribution": "Ole valmis! — Torm (lihtsas keeles)",
          "note": "Tormi ajal varju, hoidumine puudest ja lendavatest esemetest."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Turvalises hoones, eemal akendest."
          },
          {
            "id": "i2",
            "text": "Vana puu all, et oksad vihma eest kaitseksid."
          },
          {
            "id": "i3",
            "text": "Lahtisel väljakul suurte lendavate esemete kõrval."
          },
          {
            "id": "i4",
            "text": "Hoone rõdul, kuhu tuul vabalt ligi pääseb."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q088",
      "unitId": "lo-opik-u22",
      "stem": "Mida teha, kui näed maha kukkunud elektrijuhet?",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-down-wire",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maha kukkunud elektrijuhe võib olla pinge all.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.olevalmis.ee/et-simple/torm-tugev-tuul-aike-ja-sademed",
          "attribution": "Ole valmis! — Torm (lihtsas keeles)",
          "note": "Tormi ajal varju, hoidumine puudest ja lendavatest esemetest."
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Hoia eemale ja teavita täiskasvanut; vahetu ohu korral kutsutakse abi."
          },
          {
            "id": "i2",
            "text": "Puudutan juhet kuiva oksaga, et näha, kas see liigub."
          },
          {
            "id": "i3",
            "text": "Tõstan juhtme ise teelt kõrvale, et teised saaksid minna."
          },
          {
            "id": "i4",
            "text": "Lähen juhtme lähedale, et võtta sellest pilti."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q089",
      "unitId": "lo-opik-u22",
      "stem": "Miks ei tohi üleujutusveest läbi minna ka siis, kui see näib madal?",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-avoid-water",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutusvesi võib olla sügavam, kiirem või ohtlikum, kui väljast paistab.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vesi võib liikuda ja varjata ohtlikke kohti."
          },
          {
            "id": "i2",
            "text": "Sest vees olev auk on alati kohe näha."
          },
          {
            "id": "i3",
            "text": "Sest aeglasena näiv vesi ei saa liikuma hakata."
          },
          {
            "id": "i4",
            "text": "Sest üleujutatud tänav on alati sama ohutu kui madal lompi täis õu."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q090",
      "unitId": "lo-opik-u22",
      "stem": "Miks peab üleujutuse ajal veega täitunud keldrit vältima?",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-basement-risk",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vesi ja elekter on ohtlik kooslus; keldrisse minek võib lõksu jätta.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Seal võib olla vee- ja elektrioht ning väljapääs raskeneda."
          },
          {
            "id": "i2",
            "text": "Keldri üleujutus ei saa kunagi mõjutada elektriseadmeid."
          },
          {
            "id": "i3",
            "text": "Keldrisse kogunenud vesi on alati täiesti puhas."
          },
          {
            "id": "i4",
            "text": "Keldris on tõusva vee eest alati lihtsam põgeneda kui kõrgemal."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q091",
      "unitId": "lo-opik-u22",
      "stem": "Millised tegevused on tugeva tormi ajal ohutumad?",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-wind-safety",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tormi ajal väldi puid, lendavaid esemeid ja muid riske.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.olevalmis.ee/et-simple/torm-tugev-tuul-aike-ja-sademed",
          "attribution": "Ole valmis! — Torm (lihtsas keeles)",
          "note": "Tormi ajal varju, hoidumine puudest ja lendavatest esemetest."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Püsida võimaluse korral hoones."
          },
          {
            "id": "i2",
            "text": "Hoida eemale murdumisohtlikest puudest."
          },
          {
            "id": "i3",
            "text": "Minna üksiku vana puu alla varju."
          },
          {
            "id": "i4",
            "text": "Seista avatud akna ees lendavaid esemeid püüdmas."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u22-q092",
      "unitId": "lo-opik-u22",
      "stem": "Miks ei tohiks laps ise püüda üleujutuses elektrit välja lülitada?",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-child-electric",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laps peab elektriohust eemalduma ja abi kutsuma, mitte ise riskima.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Vesi ja elekter on ohtlikud; selliseid toiminguid teevad üksnes täiskasvanud ohutusnõudeid järgides."
          },
          {
            "id": "i2",
            "text": "Lapsel tuleb tingimata ise elektrisüsteemi kontrollida."
          },
          {
            "id": "i3",
            "text": "Kui käed on kuivad, on märg elektrikilp alati ohutu."
          },
          {
            "id": "i4",
            "text": "Elektriseadmete puudutamisel vee sees pole elektrilöögiohtu."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q093",
      "unitId": "lo-opik-u22",
      "stem": "Puuduta pildil kuiva kõrgemat kohta, kuhu võib vajaduse korral ohu eest liikuda.",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-higher-ground",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Võimaluse korral liigu ohutusse kuiva kõrgemasse kohta.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-flood-safety",
        "correctRegionId": "high-ground"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-flood-safety"
      }
    },
    {
      "id": "lo-opik-u22-q094",
      "unitId": "lo-opik-u22",
      "stem": "Leia pildilt koht, kus vesi on teed katnud ja kust ei tohi läbi minna.",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-floodwater-pick",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Üleujutusveest tuleb eemale hoida, mitte seda ületada.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-flood-safety",
        "correctRegionId": "floodwater"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-flood-safety"
      }
    },
    {
      "id": "lo-opik-u22-q095",
      "unitId": "lo-opik-u22",
      "stem": "Rühmita tegevused: ohutu või ohtlik üleujutuse ajal.",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-safety-sort",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Turvalised tegevused väldivad vett ja elektriohtu ning järgivad ametlikke juhiseid.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.who.int/europe/emergencies/situations/climate-crisis-extreme-weather/public-health-advice-on-protecting-your-health-before-during-and-after-floods",
          "attribution": "WHO Euroopa — Üleujutuse terviseohutus",
          "note": "Ära kõnni ega sõida üleujutusvees; märjad elektriseadmed ja tagasipöördumine."
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "safe",
            "text": "Ohutum tegu"
          },
          {
            "id": "risky",
            "text": "Ohtlik tegu"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Kuulan päästjate ja täiskasvanute juhiseid"
          },
          {
            "id": "i2",
            "text": "Püsin kuival turvalisel alal"
          },
          {
            "id": "i3",
            "text": "Lähen vee all oleva elektrijuhtme juurde"
          },
          {
            "id": "i4",
            "text": "Proovin tundmatu sügavusega veest läbi joosta"
          }
        ],
        "correctGroupByItem": {
          "i1": "safe",
          "i2": "safe",
          "i3": "risky",
          "i4": "risky"
        }
      }
    },
    {
      "id": "lo-opik-u22-q096",
      "unitId": "lo-opik-u22",
      "stem": "Ühenda oht ja ohutum käitumine.",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-risk-response",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Iga oht nõuab sobivat turvalist tegevust.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.olevalmis.ee/et-simple/torm-tugev-tuul-aike-ja-sademed",
          "attribution": "Ole valmis! — Torm (lihtsas keeles)",
          "note": "Tormi ajal varju, hoidumine puudest ja lendavatest esemetest."
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Üleujutatud tänav"
          },
          {
            "id": "p2",
            "text": "Maha kukkunud elektriliin"
          },
          {
            "id": "p3",
            "text": "Tugev tuul õues"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Valin kuiva ohutu teekonna"
          },
          {
            "id": "c2",
            "text": "Hoidun eemale ja teatan täiskasvanule"
          },
          {
            "id": "c3",
            "text": "Otsin turvalise varju hoones"
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
      "id": "lo-opik-u22-q097",
      "unitId": "lo-opik-u22",
      "stem": "Pane tegevused järjekorda, kui märkad üleujutatud teed.",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-flood-response",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ära mine ise vette; esmalt taga ohutus ja küsi abi.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Jään kuiva turvalisse kohta."
          },
          {
            "id": "i2",
            "text": "Teatan olukorrast täiskasvanule."
          },
          {
            "id": "i3",
            "text": "Liigun koos täiskasvanuga mööda ohutut teed või järgin päästjate juhiseid."
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
      "id": "lo-opik-u22-q098",
      "unitId": "lo-opik-u22",
      "stem": "Tuul on väga tugev ja üks suur puu kõigub ohtlikult. Mida teed?",
      "primaryObjectiveId": "lo-opik-u22-o7",
      "variantGroupId": "lo-opik-u22-o7-storm-choice",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tormiga hoia murdumisohtlikest puudest eemale.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.olevalmis.ee/et-simple/torm-tugev-tuul-aike-ja-sademed",
          "attribution": "Ole valmis! — Torm (lihtsas keeles)",
          "note": "Tormi ajal varju, hoidumine puudest ja lendavatest esemetest."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Lähen puust ja lendavatest esemetest eemale ning otsin turvalise hoone."
          },
          {
            "id": "i2",
            "text": "Seisan kõige suurema ja vanema puu all, et vihma vältida."
          },
          {
            "id": "i3",
            "text": "Jään võimaluse korral otse murduvate okste alla varju."
          },
          {
            "id": "i4",
            "text": "Lähen tuules lahtise ehitusmaterjali juurde uudistama."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q099",
      "unitId": "lo-opik-u22",
      "stem": "Kust saab Eestis ametlikku infot ohtliku ilma hoiatuste kohta?",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-weather-source",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ilmateenistus avaldab Eestis ilmahoiatusi.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.ilmateenistus.ee/ilm/prognoosid/hoiatused/",
          "attribution": "Keskkonnaagentuuri Ilmateenistus — Hoiatused",
          "note": "Ohtliku ilma hoiatused ja ametlik prognoos."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Keskkonnaagentuuri Ilmateenistuselt."
          },
          {
            "id": "i2",
            "text": "Sõbra kinnitamata sõnumist, mida ta nägi sotsiaalmeedias."
          },
          {
            "id": "i3",
            "text": "Juhuslikust videost, millel pole ametlikku teabeallikat."
          },
          {
            "id": "i4",
            "text": "Kellegi arvamusest ilma ilmaandmeid kontrollimata."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q100",
      "unitId": "lo-opik-u22",
      "stem": "Mida tasub enne võimalikku tormi koos perega valmis panna?",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-supplies",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Valmisolek hõlmab vajalikke varusid ja sidevahendeid.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Joogivesi, taskulamp ja telefoni laadimise võimalus."
          },
          {
            "id": "i2",
            "text": "Ainult mõned tühjad joogipudelid."
          },
          {
            "id": "i3",
            "text": "Taskulambi, mille patareid on puudu ja mis ei tööta."
          },
          {
            "id": "i4",
            "text": "Katkise telefoni, millega ei saa ühendust võtta."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q101",
      "unitId": "lo-opik-u22",
      "stem": "Mis number on Eestis vahetu elu- või terviseohu korral hädaabi kutsumiseks?",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-112",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vahetu ohu või vigastuse korral kasutatakse Eesti hädaabinumbrit 112.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "112."
          },
          {
            "id": "i2",
            "text": "1247."
          },
          {
            "id": "i3",
            "text": "1220."
          },
          {
            "id": "i4",
            "text": "110."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q102",
      "unitId": "lo-opik-u22",
      "stem": "Mida teha, kui saad telefonile ametliku ohuteavituse?",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-alert-action",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ohu korral võivad vajalikud tegevused olla erinevad; loe juhiseid.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/uudised/meeletuletus-kuidas-kaeituda-kui-saad-ee-alarmi-3602",
          "attribution": "Päästeamet — EE-ALARM (2026)",
          "note": "Loe hoiatuse juhiseid ja käitu vastavalt olukorrale."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Loe läbi, millise ohu ja tegevusjuhiste kohta teade käib."
          },
          {
            "id": "i2",
            "text": "Teade tuleb ilma lugemata kohe kustutada."
          },
          {
            "id": "i3",
            "text": "Tuleb automaatselt teha sama, mis eelmise hoiatuse ajal."
          },
          {
            "id": "i4",
            "text": "Piisab ainult sellest, et telefoni ekraanile ilmus sümbol."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q103",
      "unitId": "lo-opik-u22",
      "stem": "Miks ei saa ilmahoiatust pidada tõendiks, et kahju kindlasti tekib?",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-forecast",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hoiatus aitab riskiks valmistuda, kuid ei tähenda vältimatut õnnetust.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.ilmateenistus.ee/ilm/prognoosid/hoiatused/",
          "attribution": "Keskkonnaagentuuri Ilmateenistus — Hoiatused",
          "note": "Ohtliku ilma hoiatused ja ametlik prognoos."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Hoiatus kirjeldab võimalikku ohtu, mille täpne mõju sõltub olukorrast."
          },
          {
            "id": "i2",
            "text": "Hoiatus näitab, et kõigis kohtades tekib kindlasti sama kahju."
          },
          {
            "id": "i3",
            "text": "Kui hoiatus avaldatakse, siis kaotavad hooned igal juhul katuse."
          },
          {
            "id": "i4",
            "text": "Ükski hoiatatud nähtus ei saa üldse leebemaks osutuda."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q104",
      "unitId": "lo-opik-u22",
      "stem": "Miks võib patareidega töötav raadio kriisi ajal kasulik olla?",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-radio",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Raadio on üks võimalikest infoallikatest side- ja elektrikatkestuse ajal.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "See võib anda infot ka siis, kui tavaline internet või elekter ei tööta."
          },
          {
            "id": "i2",
            "text": "Raadio saab anda teateid ainult siis, kui internet on olemas."
          },
          {
            "id": "i3",
            "text": "Patareidega raadio vajab tööks alati elektrivõrku."
          },
          {
            "id": "i4",
            "text": "Raadio ei sobi ühegi ametliku teate kuulamiseks."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q105",
      "unitId": "lo-opik-u22",
      "stem": "Millised tegevused aitavad perel ohtlikuks ilmaks valmistuda?",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-prep-actions",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Plaani ja esmavajalike varude kokkuleppimine aitab kriisis.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "i1",
            "text": "Leppida kokku, kuidas vajaduse korral abi kutsuda."
          },
          {
            "id": "i2",
            "text": "Hoida vajalikud vahendid ja joogivesi valmis."
          },
          {
            "id": "i3",
            "text": "Ignoreerida kõiki hoiatusi."
          },
          {
            "id": "i4",
            "text": "Proovida üleujutatud keldris elektriseadmeid."
          }
        ],
        "correctOptionIds": [
          "i1",
          "i2"
        ]
      }
    },
    {
      "id": "lo-opik-u22-q106",
      "unitId": "lo-opik-u22",
      "stem": "Miks tuleks ametlikku ohuteavitust lugeda, mitte ainult selle märki või värvi vaadata?",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-message",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ohuteate sisu annab teada konkreetse tegevuse.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/uudised/meeletuletus-kuidas-kaeituda-kui-saad-ee-alarmi-3602",
          "attribution": "Päästeamet — EE-ALARM (2026)",
          "note": "Loe hoiatuse juhiseid ja käitu vastavalt olukorrale."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Sest eri ohtude korral võivad käitumisjuhised erineda."
          },
          {
            "id": "i2",
            "text": "Kõik ohuteated nõuavad täpselt sama tegevust."
          },
          {
            "id": "i3",
            "text": "Teate värv annab kõik vajalikud juhised edasi ilma tekstita."
          },
          {
            "id": "i4",
            "text": "Ohu korral ei ole kunagi vaja teada, kus oht asub."
          }
        ],
        "correctOptionId": "i1"
      }
    },
    {
      "id": "lo-opik-u22-q107",
      "unitId": "lo-opik-u22",
      "stem": "Puuduta valmisoleku skeemil joogivett.",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-water-pick",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Joogivesi on koduse valmisoleku oluline osa.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-prepared-kit",
        "correctRegionId": "water"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-prepared-kit"
      }
    },
    {
      "id": "lo-opik-u22-q108",
      "unitId": "lo-opik-u22",
      "stem": "Leia valmisoleku skeemilt patareidega töötav raadio.",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-radio",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Raadio võib aidata saada infot side- või elektrikatkestuse ajal.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u22-prepared-kit",
        "correctRegionId": "radio"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u22-prepared-kit"
      }
    },
    {
      "id": "lo-opik-u22-q109",
      "unitId": "lo-opik-u22",
      "stem": "Rühmita asjad: vajalik valmisolekuvarustus või muu ese.",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-kit-sort",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Oluline on, et vahendid oleksid päriselt kasutatavad.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "needed",
            "text": "Kasulik kriisivarudes"
          },
          {
            "id": "not",
            "text": "Ei asenda esmatähtsat varustust"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Joogivesi"
          },
          {
            "id": "i2",
            "text": "Taskulamp patareidega"
          },
          {
            "id": "i3",
            "text": "Tühja patareiga mittetöötav taskulamp"
          },
          {
            "id": "i4",
            "text": "Katkine mänguasi"
          }
        ],
        "correctGroupByItem": {
          "i1": "needed",
          "i2": "needed",
          "i3": "not",
          "i4": "not"
        }
      }
    },
    {
      "id": "lo-opik-u22-q110",
      "unitId": "lo-opik-u22",
      "stem": "Ühenda teave või vahend ja selle otstarve.",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-functions",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Erinevatel vahenditel on erinev ülesanne.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.ilmateenistus.ee/ilm/prognoosid/hoiatused/",
          "attribution": "Keskkonnaagentuuri Ilmateenistus — Hoiatused",
          "note": "Ohtliku ilma hoiatused ja ametlik prognoos."
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/juhend/vaeljaanded/kaitumisjuhised-kriisiolukordadeks",
          "attribution": "Päästeamet — Käitumisjuhised kriisiolukordadeks",
          "note": "Kodused varud, ohuteave ja perega valmistumine."
        },
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/ueleujutus",
          "attribution": "Päästeamet — Üleujutus",
          "note": "Valmistumine, vee vältimine, elektrioht ja evakueerumine."
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Ilmateenistuse hoiatus"
          },
          {
            "id": "p2",
            "text": "Patareiraadio"
          },
          {
            "id": "p3",
            "text": "Hädaabinumber 112"
          },
          {
            "id": "p4",
            "text": "Taskulamp"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Annab teada võimalikust ohtlikust ilmast"
          },
          {
            "id": "c2",
            "text": "Aitab infot saada ka elektrikatkestuse ajal"
          },
          {
            "id": "c3",
            "text": "Abi kutsumine vahetu ohu korral"
          },
          {
            "id": "c4",
            "text": "Valgustus elektri puudumisel"
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
      "id": "lo-opik-u22-q111",
      "unitId": "lo-opik-u22",
      "stem": "Pane ohuhoiatuse korral lapse sobivad tegevused järjekorda.",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-alert-sequence",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kõigepealt saadakse aru, mis oht on tulemas, seejärel tegutsetakse.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/uudised/meeletuletus-kuidas-kaeituda-kui-saad-ee-alarmi-3602",
          "attribution": "Päästeamet — EE-ALARM (2026)",
          "note": "Loe hoiatuse juhiseid ja käitu vastavalt olukorrale."
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "i1",
            "text": "Märkan ametlikku ohuhoiatust."
          },
          {
            "id": "i2",
            "text": "Loen hoiatuse koos täiskasvanuga läbi ja selgitan välja, mis oht ähvardab."
          },
          {
            "id": "i3",
            "text": "Tegutsen vastavalt olukorrale ja juhistele."
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
      "id": "lo-opik-u22-q112",
      "unitId": "lo-opik-u22",
      "stem": "Telefon annab tugeva tormi hoiatuse, kuid väljas on veel vaikne. Mis on mõistlik?",
      "primaryObjectiveId": "lo-opik-u22-o8",
      "variantGroupId": "lo-opik-u22-o8-early-warning",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hoiatus annab võimaluse enne ohu saabumist rahulikult valmistuda.",
      "sources": [
        {
          "kind": "supplementary",
          "url": "https://www.rescue.ee/et/uudised/meeletuletus-kuidas-kaeituda-kui-saad-ee-alarmi-3602",
          "attribution": "Päästeamet — EE-ALARM (2026)",
          "note": "Loe hoiatuse juhiseid ja käitu vastavalt olukorrale."
        },
        {
          "kind": "supplementary",
          "url": "https://www.olevalmis.ee/et-simple/torm-tugev-tuul-aike-ja-sademed",
          "attribution": "Ole valmis! — Torm (lihtsas keeles)",
          "note": "Tormi ajal varju, hoidumine puudest ja lendavatest esemetest."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "i1",
            "text": "Uurin hoiatuse kehtivust ja juhiseid koos täiskasvanuga ning valmistun."
          },
          {
            "id": "i2",
            "text": "Kui õues on praegu vaikne, on iga hoiatus kindlasti ekslik."
          },
          {
            "id": "i3",
            "text": "Otsustan hoiatuse tõsiduse ainult selle järgi, mis värvi on telefon."
          },
          {
            "id": "i4",
            "text": "Kui hoiatus on antud, ei ole vaja selle piirkonda ega aega lugeda."
          }
        ],
        "correctOptionId": "i1"
      }
    }
  ]
};
