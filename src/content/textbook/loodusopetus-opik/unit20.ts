// Õpik lk 74–77: autori koostatud eestikeelne õppematerjal, mitte õpiku fotode koopia.
// Authoritative declarative content. Integrate in parent preview; do NOT publish to Kiur automatically.
// 2026-10-17.2 = the package's 2026-10-17.1 with three integration fixes: q068 distractor o1 was
// unclear Estonian (now a fact one CAN read off a quiet volcano); q084 distractor o1 (spring
// temperature) is a real volcano-monitoring signal, so it is replaced by a plainly wrong one; and
// q072's stem repeated q009's word for word (validator warning), so it names its topic.
import type { Unit } from '@/lib/textbook/types';

export const unit20: Unit = {
  "id": "lo-opik-u20",
  "courseId": "loodusopetus-opik",
  "number": 20,
  "title": "Vulkaanid",
  "pages": {
    "from": 74,
    "to": 77
  },
  "status": "ready",
  "contentVersion": "2026-10-17.2",
  "objectives": [
    {
      "id": "lo-opik-u20-o1",
      "description": "Oskan selgitada, mis on magma ja laava ning kuidas magma võib Maa pinnale jõuda.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ]
    },
    {
      "id": "lo-opik-u20-o2",
      "description": "Tunnen vulkaani ehitust ja oskan joonisel näidata kraatrit, lõõri, magmakollet, laavat ja tuhapilve.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ]
    },
    {
      "id": "lo-opik-u20-o3",
      "description": "Oskan kirjeldada vulkaanipurske eri nähtusi, laava jahtumist ning vulkaani kujunemist.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ]
    },
    {
      "id": "lo-opik-u20-o4",
      "description": "Tean, miks paljud vulkaanid paiknevad laamade piiridel ja et vulkaane leidub ka mujal.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/volc/tectonics.html",
          "attribution": "USGS — Volcanoes and plate tectonics",
          "note": "Enamik vulkaane on laamapiiridel, kuid osa on laama sees."
        }
      ]
    },
    {
      "id": "lo-opik-u20-o5",
      "description": "Eristan parajasti purskavat, uinunud ja kustunud vulkaani õpiku lihtsustatud näidete järgi.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/observatories/yvo/news/active-dormant-and-extinct-clarifying-confusing-classifications",
          "attribution": "USGS — Active, dormant, extinct",
          "note": "Tegutsev ei tähenda alati parasjagu purskavat; liigitus on teaduslikult paindlik."
        }
      ]
    },
    {
      "id": "lo-opik-u20-o6",
      "description": "Oskan ära tunda vulkaaniohte ning tean, miks tuleb ametlikke hoiatusi ja evakuatsioonikorraldusi järgida.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-can-we-tell-when-a-volcano-will-erupt",
          "attribution": "USGS — Volcano monitoring and warning signs",
          "note": "Hoiatustunnused aitavad riske hinnata, kuid purset ei saa alati täpselt ennustada."
        }
      ]
    },
    {
      "id": "lo-opik-u20-o7",
      "description": "Oskan selgitada, miks inimesed elavad vulkaanide läheduses, kuigi seal esineb ohte.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-are-some-benefits-volcanic-eruptions",
          "attribution": "USGS — Benefits of volcanic eruptions",
          "note": "Pika aja jooksul võivad vulkaanilised kivimid muutuda viljakaks mullaks."
        }
      ]
    },
    {
      "id": "lo-opik-u20-o8",
      "description": "Tunnen kuumaveeallika ja geisri mõisteid ning eristan geisrit vulkaanipurskest.",
      "required": true,
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        },
        {
          "kind": "supplementary",
          "url": "https://www.nps.gov/yell/learn/nature/hydrothermal-features.htm",
          "attribution": "NPS Yellowstone — Hydrothermal features",
          "note": "Geisris purskab maa seest kuum vesi ja aur, mitte magma."
        }
      ]
    }
  ],
  "lessons": [
    {
      "id": "lo-opik-u20-l1",
      "title": "Magma muutub laavaks",
      "order": 1,
      "required": true,
      "objectiveIds": [
        "lo-opik-u20-o1",
        "lo-opik-u20-o3"
      ],
      "sections": [
        {
          "id": "lo-opik-u20-s001",
          "title": "Kuidas magma tekib?",
          "blocks": [
            {
              "id": "lo-opik-u20-b001",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "74"
              },
              "text": "Maa sees on väga kuum. Teatud piirkondades sulab osa kivimitest ja tekib sulakivim ehk magma. Kogu Maa sisemus ei ole siiski vedel: näiteks vahevöö on valdavalt tahke."
            },
            {
              "id": "lo-opik-u20-b002",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "74"
              },
              "term": "Magma",
              "definition": "Maa sisemuses olev sulanud kivim, milles võib olla ka gaase ja tahkeid osakesi."
            },
            {
              "id": "lo-opik-u20-b003",
              "type": "keyFact",
              "items": [
                "Magma paikneb Maa sees.",
                "Mitte kogu vahevöö ei ole sulanud."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u20-s002",
          "title": "Kuidas magma pinnale pääseb?",
          "blocks": [
            {
              "id": "lo-opik-u20-b004",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "74"
              },
              "text": "Magma võib tõusta maakoore lõhede ja vulkaani lõõri kaudu. Kui see jõuab pinnale, nimetame seda laavaks. Vulkaanipurse võib olla suhteliselt rahulik või plahvatuslik."
            },
            {
              "id": "lo-opik-u20-b005",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "74"
              },
              "diagramId": "u20-magma-lava",
              "caption": "Sama sulakivim: maa sees magma, maapinnale jõudes laava."
            },
            {
              "id": "lo-opik-u20-b006",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "74"
              },
              "term": "Laava",
              "definition": "Maapinnale või merepõhjale jõudnud magma."
            },
            {
              "id": "lo-opik-u20-b007",
              "type": "keyFact",
              "items": [
                "Maa sees = magma. Maa pinnal = laava."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u20-s003",
          "title": "Miks on pursked erinevad?",
          "blocks": [
            {
              "id": "lo-opik-u20-b008",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "74"
              },
              "text": "Magmas leiduvad gaasid ja magma omadused mõjutavad purset. Mõnikord voolab laava lõhest aeglasemalt välja, mõnikord paiskuvad õhku kuumad gaasid, tuhk ja kivimiosakesed. Kõik vulkaanid ei purska ühtemoodi."
            },
            {
              "id": "lo-opik-u20-b009",
              "type": "comparison",
              "title": "Purske kaks võimalikku ilmet",
              "columns": [
                {
                  "heading": "Voolav purse",
                  "points": [
                    "Laava liigub mööda maapinda.",
                    "Laava jahtub ja tardub kivimiks."
                  ]
                },
                {
                  "heading": "Plahvatuslik purse",
                  "points": [
                    "Õhku võib paiskuda tuhka ja kivimitükke.",
                    "Purskega võivad kaasneda kuumad gaasid."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u20-b010",
              "type": "keyFact",
              "items": [
                "Vulkaanipurse võib olla voolav või plahvatuslik.",
                "Ühel vulkaanil võivad eri aegadel olla erinevad pursked."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u20-l2",
      "title": "Vulkaani osad ja purske jäljed",
      "order": 2,
      "required": true,
      "objectiveIds": [
        "lo-opik-u20-o2",
        "lo-opik-u20-o3"
      ],
      "sections": [
        {
          "id": "lo-opik-u20-s004",
          "title": "Vulkaani sisemus ja tipp",
          "blocks": [
            {
              "id": "lo-opik-u20-b011",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "75"
              },
              "text": "Vulkaani sees asub magmakolle ehk koht, kuhu magma koguneb. Magma võib liikuda üles mööda lõõri. Vulkaani tipus või küljel on väljumisava; õpiku koonusvulkaani joonisel nimetatakse tippu ümbritsevat ava kraatriks."
            },
            {
              "id": "lo-opik-u20-b012",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "75"
              },
              "diagramId": "u20-volcano-cutaway",
              "caption": "Puudutatav vulkaani läbilõige: magmakolle, lõõr, kraater, laava ja tuhapilv."
            },
            {
              "id": "lo-opik-u20-b013",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "75"
              },
              "term": "Magmakolle",
              "definition": "Koht maa sees, kuhu magma koguneb."
            },
            {
              "id": "lo-opik-u20-b014",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "75"
              },
              "term": "Lõõr",
              "definition": "Läbipääs, mida mööda magma võib vulkaanis üles liikuda."
            },
            {
              "id": "lo-opik-u20-b015",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "75"
              },
              "term": "Kraater",
              "definition": "Vulkaani tipus või nõlval asuv lohk, milles võib paikneda purskeava."
            }
          ]
        },
        {
          "id": "lo-opik-u20-s005",
          "title": "Mida näeme purske ajal?",
          "blocks": [
            {
              "id": "lo-opik-u20-b016",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "75"
              },
              "text": "Purske ajal võib näha laavavoogu, vulkaanilist tuhka ja kivimitükke. Vulkaaniline tuhk ei ole põletatud puidu tuhk: see koosneb imepisikestest kivimi- ja klaasiosakestest."
            },
            {
              "id": "lo-opik-u20-b017",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "75"
              },
              "diagramId": "u20-eruption-products",
              "caption": "Laavavool nõlval, tuhapilv õhus ja purskel välja paiskuvad kivimitükid."
            },
            {
              "id": "lo-opik-u20-b018",
              "type": "definition",
              "source": {
                "kind": "supplementary",
                "url": "https://pubs.usgs.gov/gip/volc/text.html",
                "attribution": "USGS — Volcanoes",
                "note": "Vulkaani ehitus, purskete kujunemine ja kivimite kuhjumine."
              },
              "term": "Vulkaaniline tuhk",
              "definition": "Purskel tekkinud väga peened kivimi- ja klaasiosakesed."
            },
            {
              "id": "lo-opik-u20-b019",
              "type": "keyFact",
              "items": [
                "Laava voolab pinnal; tuhapilv tõuseb õhku.",
                "Vulkaanituhk võib kanduda tuulega kaugele."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u20-s006",
          "title": "Kuidas vulkaan kasvab?",
          "blocks": [
            {
              "id": "lo-opik-u20-b020",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "75"
              },
              "text": "Laava jahtub, tardub ja muutub tahkeks kivimiks. Kui pursked korduvad, võivad tardunud laava ja tuha kihid kuhjuda ning moodustada vulkaanikoonuse. Kõik vulkaanid ei ole kõrge koonuse kujulised, kuid õpiku läbilõige näitab üht levinud kuju."
            },
            {
              "id": "lo-opik-u20-b021",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "75"
              },
              "diagramId": "u20-layers-growth",
              "caption": "Kolm etappi: laava jõuab pinnale, tardub, uus kiht lisandub."
            },
            {
              "id": "lo-opik-u20-b022",
              "type": "list",
              "items": [
                "Magma jõuab pinnale ja on nüüd laava.",
                "Laava jahtub ja tardub kivimiks.",
                "Järgmise purske materjal võib lisada uue kihi."
              ]
            },
            {
              "id": "lo-opik-u20-b023",
              "type": "keyFact",
              "items": [
                "Tardunud laava on kivim.",
                "Korduvad pursked võivad kasvatada vulkaani."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u20-l3",
      "title": "Kus vulkaanid asuvad?",
      "order": 3,
      "required": true,
      "objectiveIds": [
        "lo-opik-u20-o4",
        "lo-opik-u20-o5"
      ],
      "sections": [
        {
          "id": "lo-opik-u20-s007",
          "title": "Miks just laamade piiril?",
          "blocks": [
            {
              "id": "lo-opik-u20-b024",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "76"
              },
              "text": "Maa välimine jäik kivimiline kest koosneb liikuvatest laamadest. Paljud vulkaanid paiknevad laamade piiridel, kus tekivad tingimused magma tõusmiseks maapinnale. Üks tuntud vulkaaniderohke piirkond kulgeb Vaikse ookeani ümber."
            },
            {
              "id": "lo-opik-u20-b025",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "76"
              },
              "diagramId": "u20-volcano-locations",
              "caption": "Skeem: vulkaan laamade piiril ja vulkaan laama sisemuses."
            },
            {
              "id": "lo-opik-u20-b026",
              "type": "keyFact",
              "items": [
                "Paljud vulkaanid paiknevad laamade piiridel.",
                "Laamade piiridel võib esineda nii vulkaane kui maavärinaid."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u20-s008",
          "title": "Aga vulkaane on ka mujal",
          "blocks": [
            {
              "id": "lo-opik-u20-b027",
              "type": "paragraph",
              "source": {
                "kind": "supplementary",
                "url": "https://pubs.usgs.gov/gip/volc/tectonics.html",
                "attribution": "USGS — Volcanoes and plate tectonics",
                "note": "Enamik vulkaane on laamapiiridel, kuid osa on laama sees."
              },
              "text": "Kõik vulkaanid ei ole laamade piiridel. Näiteks Hawaii vulkaanid on seotud nn kuuma täpiga laama sisemuses. Seega ei saa öelda, et vulkaan saab olla üksnes laamade piiril."
            },
            {
              "id": "lo-opik-u20-b028",
              "type": "comparison",
              "title": "Kaks võimalikku asukohta",
              "columns": [
                {
                  "heading": "Laamade piir",
                  "points": [
                    "Seal asub palju Maa vulkaane.",
                    "Laamade liikumine on sageli seotud magma tekkega."
                  ]
                },
                {
                  "heading": "Laama sisemus",
                  "points": [
                    "Seal võib asuda kuum täpp.",
                    "Näiteks Hawaii vulkaanid."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u20-b029",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "75"
              },
              "text": "Õpiku fotodel on näited eri piirkondadest: Fagradalsfjall Islandil (lk 74), Karõmi Kamtšatkal ja Anak Krakatau Indoneesias (lk 75). Need näited õpetavad vulkaanide asukohti, kuid nende praeguse purskeseisu kohta ei tehta fotodest järeldusi."
            }
          ]
        },
        {
          "id": "lo-opik-u20-s009",
          "title": "Purskav, uinunud ja kustunud",
          "blocks": [
            {
              "id": "lo-opik-u20-b030",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "76"
              },
              "text": "Õpik eristab tegutsevaid, uinunud ja kustunud vulkaane. Uinunud vulkaan praegu ei purska, kuid võib tulevikus uuesti pursata. Kustunuks nimetatakse vulkaani, mille puhul tulevast purset enam ei oodata."
            },
            {
              "id": "lo-opik-u20-b031",
              "type": "paragraph",
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/observatories/yvo/news/active-dormant-and-extinct-clarifying-confusing-classifications",
                "attribution": "USGS — Active, dormant, extinct",
                "note": "Tegutsev ei tähenda alati parasjagu purskavat; liigitus on teaduslikult paindlik."
              },
              "text": "Teaduslik täpsustus: sõna „tegutsev” ei tähenda alati, et laava parajasti voolaks. Teadlaste jaoks võib vulkaan olla aktiivne ka siis, kui see on ajutiselt vaikne. Täpset liigitust ei saa alati kindlalt määrata."
            },
            {
              "id": "lo-opik-u20-b032",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "76"
              },
              "diagramId": "u20-volcano-states",
              "caption": "Kolm skeemi: parajasti purskav, praegu vaikne, pikaajaliselt tegevuse lõpetanud vulkaan."
            },
            {
              "id": "lo-opik-u20-b033",
              "type": "keyFact",
              "items": [
                "Uinunud vulkaan võib uuesti pursata.",
                "Aktiivne vulkaan ei pruugi just praegu pursata."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u20-l4",
      "title": "Inimene ja vulkaan",
      "order": 4,
      "required": true,
      "objectiveIds": [
        "lo-opik-u20-o6",
        "lo-opik-u20-o7"
      ],
      "sections": [
        {
          "id": "lo-opik-u20-s010",
          "title": "Miks ikkagi elatakse seal?",
          "blocks": [
            {
              "id": "lo-opik-u20-b034",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "76"
              },
              "text": "Vulkaani läheduses elamine võib olla ohtlik, kuid seal leidub ka häid elutingimusi. Vanad vulkaanilised kivimid ja tuhk võivad aja jooksul murenedes ning mullaks muutudes anda viljaka pinnase, kus saab kasvatada taimi."
            },
            {
              "id": "lo-opik-u20-b035",
              "type": "paragraph",
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/faqs/what-are-some-benefits-volcanic-eruptions",
                "attribution": "USGS — Benefits of volcanic eruptions",
                "note": "Pika aja jooksul võivad vulkaanilised kivimid muutuda viljakaks mullaks."
              },
              "text": "Viljakas muld ei teki kuumast värskest laavast kohe. Kivimi murenemine ja mulla kujunemine võtab aega. Mõnes vulkaanilises piirkonnas kasutatakse ka maasoojust näiteks kütmiseks."
            },
            {
              "id": "lo-opik-u20-b036",
              "type": "table",
              "headers": [
                "Võimalus",
                "Millega arvestada"
              ],
              "rows": [
                [
                  "Viljakas muld",
                  "Tekib vulkaanilistest kivimitest aja jooksul."
                ],
                [
                  "Elukoht ja põllud",
                  "Tuleb arvestada võimaliku purske ohuga."
                ]
              ],
              "caption": "Ühes piirkonnas võib olla nii kasu kui oht"
            },
            {
              "id": "lo-opik-u20-b037",
              "type": "keyFact",
              "items": [
                "Vulkaanilised kivimid võivad aja jooksul anda viljakat mulda.",
                "See ei tähenda, et värskel laaval võiks põldu harida."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u20-s011",
          "title": "Millised ohud võivad kaasneda?",
          "blocks": [
            {
              "id": "lo-opik-u20-b038",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "76"
              },
              "text": "Laava võib hävitada teele jäävaid hooneid ja teid. Vulkaaniline tuhk halvendab nähtavust ja õhukvaliteeti. Mõne plahvatusliku purske ajal võivad mööda nõlva väga kiiresti liikuda kuumade gaaside, tuha ja kivimite vood. Need pole sama mis tavaline voolav laava."
            },
            {
              "id": "lo-opik-u20-b039",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "76"
              },
              "diagramId": "u20-eruption-products",
              "caption": "Eri ohud vulkaani juures: maapinnal laavavool, õhus tuhk ja purskavad kivimitükid."
            },
            {
              "id": "lo-opik-u20-b040",
              "type": "comparison",
              "title": "Ära aja segi",
              "columns": [
                {
                  "heading": "Laavavool",
                  "points": [
                    "Sulanud kivim voolab pinnal.",
                    "Võib matta teid ja ehitisi."
                  ]
                },
                {
                  "heading": "Kuum tuha- ja gaasivool",
                  "points": [
                    "Liigub maapinna lähedal mõnikord ülikiiresti.",
                    "On äärmiselt ohtlik."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u20-b041",
              "type": "keyFact",
              "items": [
                "Purske oht ei piirdu laavaga.",
                "Tuhk ja kuumad gaasivoolud võivad olla väga ohtlikud."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u20-s012",
          "title": "Kuidas teadlased ohtu jälgivad?",
          "blocks": [
            {
              "id": "lo-opik-u20-b042",
              "type": "paragraph",
              "source": {
                "kind": "supplementary",
                "url": "https://www.usgs.gov/faqs/how-can-we-tell-when-a-volcano-will-erupt",
                "attribution": "USGS — Volcano monitoring and warning signs",
                "note": "Hoiatustunnused aitavad riske hinnata, kuid purset ei saa alati täpselt ennustada."
              },
              "text": "Teadlased mõõdavad vulkaani juures näiteks maavärinaid, maapinna kerkimist ja gaaside muutumist. Nii saab mõnikord anda hoiatuse, kuid iga purske täpset algust, tugevust või kestust ei ole võimalik ette teada."
            },
            {
              "id": "lo-opik-u20-b043",
              "type": "table",
              "headers": [
                "Mida jälgitakse?",
                "Mida see võib tähendada?"
              ],
              "rows": [
                [
                  "Maavärinate sagenemine",
                  "Magma võib maa sees liikuda."
                ],
                [
                  "Maapinna paisumine",
                  "Maa all võib rõhk kasvada."
                ],
                [
                  "Gaaside muutumine",
                  "Vulkaani tegevus võib muutuda."
                ]
              ],
              "caption": "Hoiatusmärk ei tähenda alati kindlat purset"
            },
            {
              "id": "lo-opik-u20-b044",
              "type": "keyFact",
              "items": [
                "Teadlased saavad sageli ohumärke jälgida.",
                "Hoiatus ei ole kellapealt kindel ennustus."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u20-s013",
          "title": "Mida teha hoiatuse korral?",
          "blocks": [
            {
              "id": "lo-opik-u20-b045",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "76"
              },
              "text": "Kui ametiasutused hoiatavad vulkaaniohu eest või annavad evakuatsioonikorralduse, tuleb seda kohe järgida. Ohupiirkonda ei minda purskeid lähedalt vaatama. Ka vulkaanituhka ei tohi pidada tavaliseks ohutuks tolmuks."
            },
            {
              "id": "lo-opik-u20-b046",
              "type": "list",
              "items": [
                "Kuula ametlikku teavet ja järgi kohalikke juhiseid.",
                "Kui öeldakse, et piirkonnast tuleb lahkuda, lahku õigel ajal.",
                "Ära jää purskavat vulkaani pildistama ega mine tõkestatud alale."
              ]
            },
            {
              "id": "lo-opik-u20-b047",
              "type": "keyFact",
              "items": [
                "Kõige tähtsam on järgida ametlikke ohutusjuhiseid.",
                "Ei saa eeldada, et igast purskest jõuab viimasel hetkel põgeneda."
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "lo-opik-u20-l5",
      "title": "Kuumaveeallikad ja geisrid",
      "order": 5,
      "required": true,
      "objectiveIds": [
        "lo-opik-u20-o8"
      ],
      "sections": [
        {
          "id": "lo-opik-u20-s014",
          "title": "Miks võib allikavesi olla kuum?",
          "blocks": [
            {
              "id": "lo-opik-u20-b048",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "77"
              },
              "text": "Vulkaanilistes piirkondades võivad maa-alused kuumad kivimid soojendada põhjavett. Vesi liigub maa sees lõhede kaudu ja võib pinnale jõuda kuumaveeallikana."
            },
            {
              "id": "lo-opik-u20-b049",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "77"
              },
              "term": "Kuumaveeallikas",
              "definition": "Allikas, millest voolab maapinnale looduslikult soojenenud vesi."
            },
            {
              "id": "lo-opik-u20-b050",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "77"
              },
              "diagramId": "u20-geysers",
              "caption": "Skeem: maa all kuumenev vesi, kuumaveeallikas ja aeg-ajalt purskav geiser."
            },
            {
              "id": "lo-opik-u20-b051",
              "type": "keyFact",
              "items": [
                "Kuumaveeallikast väljub kuum vesi, mitte laava."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u20-s015",
          "title": "Mis teeb geisri eriliseks?",
          "blocks": [
            {
              "id": "lo-opik-u20-b052",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "77"
              },
              "text": "Geiser on eriline kuumaveeallikas, mis võib aeg-ajalt pursata kuuma vett ja auru. Kitsastes maa-alustes kanalites võib rõhk koguneda, kuni vesi ja aur välja paiskuvad. See ei ole vulkaanipurse, sest geiser ei purska magmat."
            },
            {
              "id": "lo-opik-u20-b053",
              "type": "definition",
              "source": {
                "kind": "textbook",
                "pages": "77"
              },
              "term": "Geiser",
              "definition": "Kuumaveeallikas, mis purskab aeg-ajalt kuuma vett ja auru."
            },
            {
              "id": "lo-opik-u20-b054",
              "type": "comparison",
              "title": "Erinev on see, mis välja tuleb",
              "columns": [
                {
                  "heading": "Vulkaan",
                  "points": [
                    "Magma võib jõuda pinnale laavana.",
                    "Purskega võib kaasneda tuhk ja kivimiosakesed."
                  ]
                },
                {
                  "heading": "Geiser",
                  "points": [
                    "Pinnale paiskuvad kuum vesi ja veeaur.",
                    "Geiser ei purska laavat."
                  ]
                }
              ]
            },
            {
              "id": "lo-opik-u20-b055",
              "type": "keyFact",
              "items": [
                "Geiser = kuum vesi + aur.",
                "Vulkaan = magma võib jõuda pinnale laavana."
              ]
            }
          ]
        },
        {
          "id": "lo-opik-u20-s016",
          "title": "Õpiku näited ja kordamine",
          "blocks": [
            {
              "id": "lo-opik-u20-b056",
              "type": "paragraph",
              "source": {
                "kind": "textbook",
                "pages": "77"
              },
              "text": "Õpiku fotodel on Strokkuri geiser Islandil ning kuumaveeallikate piirkond El Tatio Tšiilis. Need on näited maa-aluse kuumuse mõjust veele."
            },
            {
              "id": "lo-opik-u20-b057",
              "type": "diagram",
              "source": {
                "kind": "textbook",
                "pages": "77"
              },
              "diagramId": "u20-geysers",
              "caption": "Võrdle skeemil kuumaveeallikat ja purskavat geisrit."
            },
            {
              "id": "lo-opik-u20-b058",
              "type": "externalResource",
              "title": "Yellowstone’i kuumaveeallikad ja geisrid",
              "url": "https://www.nps.gov/yell/learn/nature/hydrothermal-features.htm",
              "publisher": "USA rahvusparkide teenistus (NPS)",
              "resourceType": "article",
              "intro": "Vabatahtlik lisalugemine.",
              "observe": "Uuri, miks kuumaveeallikas sageli voolab ning geiser võib perioodiliselt pursata."
            },
            {
              "id": "lo-opik-u20-b059",
              "type": "keyFact",
              "items": [
                "Magma on Maa sees; laava on pinnale jõudnud magma.",
                "Geisrist purskab vett ja auru, vulkaanist võib väljuda laavat ja tuhka."
              ]
            }
          ]
        }
      ]
    }
  ],
  "questions": [
    {
      "id": "lo-opik-u20-q001",
      "unitId": "lo-opik-u20",
      "stem": "Mis on magma?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g001",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magmaks nimetatakse Maa sisemuses olevat sulakivimit.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Jahtunud laavatükk"
          },
          {
            "id": "o2",
            "text": "Kuum vihmavesi"
          },
          {
            "id": "o3",
            "text": "Vulkaaniline tuhk"
          },
          {
            "id": "o4",
            "text": "Maa sees olev sulakivim"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q002",
      "unitId": "lo-opik-u20",
      "stem": "Mis on laava?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g002",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laava on magma, mis on jõudnud Maa pinnale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Maa pinnale jõudnud magma"
          },
          {
            "id": "o2",
            "text": "Iga kuum kivim Maa sees"
          },
          {
            "id": "o3",
            "text": "Geisrist paiskuv vesi"
          },
          {
            "id": "o4",
            "text": "Jahe põhjavesi"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q003",
      "unitId": "lo-opik-u20",
      "stem": "Kus nimetatakse sulakivimit magmaks?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g001",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa sisemuses on sulakivim magma.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ainult vulkaani välisnõlval"
          },
          {
            "id": "o2",
            "text": "Maa sees"
          },
          {
            "id": "o3",
            "text": "Pilvede kohal"
          },
          {
            "id": "o4",
            "text": "Jõe põhjas oleva liivana"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q004",
      "unitId": "lo-opik-u20",
      "stem": "Millal saab magmast laava?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g002",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa pinnale jõudnud magma on laava.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Kui seda puudutab vihm"
          },
          {
            "id": "o2",
            "text": "Kui vulkaan on juba kustunud"
          },
          {
            "id": "o3",
            "text": "Kui see jõuab Maa pinnale"
          },
          {
            "id": "o4",
            "text": "Kui see maa sees jahtub"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q005",
      "unitId": "lo-opik-u20",
      "stem": "Millisest ainest tekib magma?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g003",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Teatud piirkondades osa kivimeid sulab ja moodustub magma.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ainult mereveest"
          },
          {
            "id": "o2",
            "text": "Pilvede veepiiskadest"
          },
          {
            "id": "o3",
            "text": "Tavalisest pinnasemullast"
          },
          {
            "id": "o4",
            "text": "Osaliselt sulanud kivimist"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q006",
      "unitId": "lo-opik-u20",
      "stem": "Magma ja laava on seotud. Mis on nende kõige olulisem erinevus?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g004",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magma ja laava on sulakivimi nimetused sõltuvalt asukohast.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Asukoht: magma sees, laava pinnal"
          },
          {
            "id": "o2",
            "text": "Magma on vesi, laava on gaas"
          },
          {
            "id": "o3",
            "text": "Laava on alati külm"
          },
          {
            "id": "o4",
            "text": "Magma leidub ainult Islandil"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q007",
      "unitId": "lo-opik-u20",
      "stem": "Õige või vale: kogu Maa vahevöö on vedel magma.",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g005",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Enamik vahevööst on tahke, magma tekib teatud piirkondades.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/volc/text.html",
          "attribution": "USGS — Volcanoes",
          "note": "Vulkaani ehitus, purskete kujunemine ja kivimite kuhjumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Õige"
          },
          {
            "id": "o2",
            "text": "Vale"
          }
        ],
        "correctOptionId": "o2",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u20-q008",
      "unitId": "lo-opik-u20",
      "stem": "Miks võib magma maapinnale jõuda?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g006",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magma võib liikuda läbi kivimikesta lõhede ja vulkaani lõõri.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Meretuul toob selle maa seest välja"
          },
          {
            "id": "o2",
            "text": "Vihm muudab maa sees vee laavaks"
          },
          {
            "id": "o3",
            "text": "See võib liikuda üles mööda lõhesid ja vulkaani lõõri"
          },
          {
            "id": "o4",
            "text": "Kõik kivimid tõusevad ise pilvedesse"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q009",
      "unitId": "lo-opik-u20",
      "stem": "Millised väited on õiged?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g004",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Nimetused sõltuvad sulakivimi asukohast; geisris on vesi, mitte magma.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Geiser purskab vedelat magmat"
          },
          {
            "id": "o2",
            "text": "Magma on sama mis kuumaveeallikas"
          },
          {
            "id": "o3",
            "text": "Magma on sulakivim Maa sees"
          },
          {
            "id": "o4",
            "text": "Laava on pinnale jõudnud magma"
          }
        ],
        "correctOptionIds": [
          "o3",
          "o4"
        ]
      }
    },
    {
      "id": "lo-opik-u20-q010",
      "unitId": "lo-opik-u20",
      "stem": "Ühenda nähtus ja õige selgitus.",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g004",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magma ja laava on kivim, geiser purskab kuuma vett.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Magma"
          },
          {
            "id": "p2",
            "text": "Laava"
          },
          {
            "id": "p3",
            "text": "Geisri vesi"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Sulakivim Maa sees"
          },
          {
            "id": "c2",
            "text": "Pinnale jõudnud magma"
          },
          {
            "id": "c3",
            "text": "Maa sees kuumenenud vesi"
          }
        ],
        "correctPairs": {
          "p1": "c1",
          "p2": "c2",
          "p3": "c3"
        }
      },
      "relatedObjectiveIds": [
        "lo-opik-u20-o8"
      ]
    },
    {
      "id": "lo-opik-u20-q011",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta joonisel kohta, kus aine kannab nimetust magma.",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g001",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa sees on sulakivim magma; seda kohta näitab maa-alune piirkond.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-magma-lava",
        "correctRegionId": "underground"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-magma-lava"
      }
    },
    {
      "id": "lo-opik-u20-q012",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta joonisel kohta, kus aine kannab nimetust laava.",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g002",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa pinnale jõudnud sulakivim kannab nimetust laava.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-magma-lava",
        "correctRegionId": "surface"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-magma-lava"
      }
    },
    {
      "id": "lo-opik-u20-q013",
      "unitId": "lo-opik-u20",
      "stem": "Kujutle, et sulakivim väljub mäe küljel olevast lõhest ja voolab mööda maad. Mis aine see nüüd on?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g002",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pinnale jõudes nimetatakse magmat laavaks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Magma maa sees"
          },
          {
            "id": "o2",
            "text": "Tavaline allikavesi"
          },
          {
            "id": "o3",
            "text": "Vulkaaniline tuhk"
          },
          {
            "id": "o4",
            "text": "Laava"
          }
        ],
        "correctOptionId": "o4"
      },
      "relatedObjectiveIds": [
        "lo-opik-u20-o3"
      ]
    },
    {
      "id": "lo-opik-u20-q014",
      "unitId": "lo-opik-u20",
      "stem": "Uurimisjoonisel on kuum sulakivim veel sügaval maakoore all. Kuidas seda nimetatakse?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g001",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuni sulakivim on Maa sees, on see magma.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Magmaks"
          },
          {
            "id": "o2",
            "text": "Laavaks"
          },
          {
            "id": "o3",
            "text": "Geisriks"
          },
          {
            "id": "o4",
            "text": "Tuhapilveks"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q015",
      "unitId": "lo-opik-u20",
      "stem": "Pane õigesse järjekorda, mis võib juhtuda magmaga.",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g006",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magma tekib maa sees ja muutub pinnale jõudes laavaks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Osa kivimit sulab Maa sees."
          },
          {
            "id": "s2",
            "text": "Magma tõuseb lõhesid pidi üles."
          },
          {
            "id": "s3",
            "text": "Pinnale jõudnud magma on laava."
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3"
        ]
      }
    },
    {
      "id": "lo-opik-u20-q016",
      "unitId": "lo-opik-u20",
      "stem": "Jaga kirjeldused kaheks: kas maa sees magma või pinnal laava?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g007",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magma asub sees, laava on jõudnud pinnale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "g1",
            "text": "Magma"
          },
          {
            "id": "g2",
            "text": "Laava"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Sulakivim magmakoldes"
          },
          {
            "id": "i2",
            "text": "Sulanud kivim kraatrist väljudes"
          },
          {
            "id": "i3",
            "text": "Sulakivim sügaval kivimites"
          },
          {
            "id": "i4",
            "text": "Punakas vool vulkaani nõlval"
          }
        ],
        "correctGroupByItem": {
          "i1": "g1",
          "i2": "g2",
          "i3": "g1",
          "i4": "g2"
        }
      }
    },
    {
      "id": "lo-opik-u20-q017",
      "unitId": "lo-opik-u20",
      "stem": "Kus paikneb õpiku koonusvulkaani kraater?",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g008",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kraater on vulkaani tipul või küljel olev lohk, milles võib paikneda purskeava.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Magmakolde sügavaimas osas"
          },
          {
            "id": "o2",
            "text": "Ainult pilvede sees"
          },
          {
            "id": "o3",
            "text": "Maa keskpunktis"
          },
          {
            "id": "o4",
            "text": "Vulkaani tipu ümbruses"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q018",
      "unitId": "lo-opik-u20",
      "stem": "Mis on vulkaani lõõr?",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g009",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõõr on magma liikumistee vulkaanis.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Läbipääs, mida mööda magma võib liikuda üles"
          },
          {
            "id": "o2",
            "text": "Vulkaani pinnal kasvav puu"
          },
          {
            "id": "o3",
            "text": "Tuhapilv üle mere"
          },
          {
            "id": "o4",
            "text": "Vulkaanist eemal olev jõgi"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q019",
      "unitId": "lo-opik-u20",
      "stem": "Mis on magmakolle?",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g010",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magmakolle asub maa sees ja sinna võib magma koguneda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Tavaline mägijärv"
          },
          {
            "id": "o2",
            "text": "Koht maa sees, kuhu magma koguneb"
          },
          {
            "id": "o3",
            "text": "Kuhjatud vulkaanituhk lennukil"
          },
          {
            "id": "o4",
            "text": "Vulkaani kõrgeim tipp"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q020",
      "unitId": "lo-opik-u20",
      "stem": "Mis on tuhapilv?",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g011",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tuhapilves on peeni vulkaanilisi osakesi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Maa sees olev magmakolle"
          },
          {
            "id": "o2",
            "text": "Allikast pärit puhas veeaur"
          },
          {
            "id": "o3",
            "text": "Õhku kandunud peente vulkaaniliste osakeste pilv"
          },
          {
            "id": "o4",
            "text": "Maad kattev vedel magma"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q021",
      "unitId": "lo-opik-u20",
      "stem": "Mis on vulkaani nõlval voolav punakas sulakivim?",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g002",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui sulakivim voolab vulkaani välispinnal, on see laava.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Kraater"
          },
          {
            "id": "o2",
            "text": "Lõõr"
          },
          {
            "id": "o3",
            "text": "Magmakolle"
          },
          {
            "id": "o4",
            "text": "Laava"
          }
        ],
        "correctOptionId": "o4"
      },
      "relatedObjectiveIds": [
        "lo-opik-u20-o1"
      ]
    },
    {
      "id": "lo-opik-u20-q022",
      "unitId": "lo-opik-u20",
      "stem": "Mis eristab kraatrit lõõrist?",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g012",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kraater on pinnal paiknev osa, lõõr viib magma üles.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Kraater on pinnal lohk, lõõr on liikumistee kivimites"
          },
          {
            "id": "o2",
            "text": "Mõlemad on ainult allikaveega täidetud"
          },
          {
            "id": "o3",
            "text": "Kraater asub alati Maa keskpunktis"
          },
          {
            "id": "o4",
            "text": "Lõõr on vulkaani kõrval olev mets"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q023",
      "unitId": "lo-opik-u20",
      "stem": "Milline kirjeldus sobib magma teekonnaga?",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g006",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magma koguneb maa sees, liigub üles ning muutub pinnale jõudes laavaks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Mäenõlv → kuu → magmakolle"
          },
          {
            "id": "o2",
            "text": "Magmakolle → lõõr → pinnale jõudnud laava"
          },
          {
            "id": "o3",
            "text": "Tuhapilv → järv → magmakolle"
          },
          {
            "id": "o4",
            "text": "Pilved → kraater → põhjavesi"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q024",
      "unitId": "lo-opik-u20",
      "stem": "Millised on vulkaani ehituse osad?",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g013",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kraater, lõõr ja magmakolle kuuluvad õpiku vulkaani läbilõikesse.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Kraater"
          },
          {
            "id": "o2",
            "text": "Lõõr"
          },
          {
            "id": "o3",
            "text": "Magmakolle"
          },
          {
            "id": "o4",
            "text": "Ookeani hoovus"
          },
          {
            "id": "o5",
            "text": "Kaardi mõõtkava"
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
      "id": "lo-opik-u20-q025",
      "unitId": "lo-opik-u20",
      "stem": "Ühenda vulkaani osa selle kirjeldusega.",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g013",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaani osadel on eri ülesanded ja paiknemine.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Kraater"
          },
          {
            "id": "p2",
            "text": "Lõõr"
          },
          {
            "id": "p3",
            "text": "Magmakolle"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Lohk vulkaani tipus või küljel"
          },
          {
            "id": "c2",
            "text": "Magma liikumistee vulkaanis"
          },
          {
            "id": "c3",
            "text": "Magma kogunemise paik maa sees"
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
      "id": "lo-opik-u20-q026",
      "unitId": "lo-opik-u20",
      "stem": "Rühmita vulkaani osad nende asukoha järgi.",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g013",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magmakolle ja lõõri sügav osa on maa sees, laavavool on väljas ning tuhapilv õhus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "g1",
            "text": "Maa sees"
          },
          {
            "id": "g2",
            "text": "Maa pinnal või õhus"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Magmakolle"
          },
          {
            "id": "i2",
            "text": "Lõõri sügavam osa"
          },
          {
            "id": "i3",
            "text": "Laavavool nõlval"
          },
          {
            "id": "i4",
            "text": "Tuhapilv"
          }
        ],
        "correctGroupByItem": {
          "i1": "g1",
          "i2": "g1",
          "i3": "g2",
          "i4": "g2"
        }
      }
    },
    {
      "id": "lo-opik-u20-q027",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta vulkaani läbilõikel kraatrit.",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g008",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kraater asub vulkaani tipu ümber.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-volcano-cutaway",
        "correctRegionId": "crater"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-volcano-cutaway"
      }
    },
    {
      "id": "lo-opik-u20-q028",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta vulkaani läbilõikel magmakollet.",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g010",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magmakolle on joonisel maa sees laiem kogunemispiirkond.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-volcano-cutaway",
        "correctRegionId": "chamber"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-volcano-cutaway"
      }
    },
    {
      "id": "lo-opik-u20-q029",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta vulkaani läbilõikel lõõri.",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g009",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Lõõr on magmakoldest pinna poole suunduv läbipääs.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-volcano-cutaway",
        "correctRegionId": "conduit"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-volcano-cutaway"
      }
    },
    {
      "id": "lo-opik-u20-q030",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta vulkaani läbilõikel tuhapilve.",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g011",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tuhapilv on joonisel vulkaani kohal õhus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-volcano-cutaway",
        "correctRegionId": "ash-cloud"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-volcano-cutaway"
      }
    },
    {
      "id": "lo-opik-u20-q031",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta vulkaani läbilõikel laavavoolu.",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g014",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laava voolab joonisel vulkaani välisnõlval.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-volcano-cutaway",
        "correctRegionId": "lava-flow"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-volcano-cutaway"
      }
    },
    {
      "id": "lo-opik-u20-q032",
      "unitId": "lo-opik-u20",
      "stem": "Järjesta magma teekond vulkaani läbilõikes.",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g006",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku läbilõikel on magmakolle all, lõõr ülespoole ja laava pinnal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Magma koguneb magmakoldesse."
          },
          {
            "id": "s2",
            "text": "Magma liigub üles mööda lõõri."
          },
          {
            "id": "s3",
            "text": "Sulakivim väljub pinnale laavana."
          }
        ],
        "correctOrder": [
          "s1",
          "s2",
          "s3"
        ]
      }
    },
    {
      "id": "lo-opik-u20-q033",
      "unitId": "lo-opik-u20",
      "stem": "Millest koosneb vulkaaniline tuhk?",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g015",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaaniline tuhk tekib kivimi väga väikestest osakestest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/volc/text.html",
          "attribution": "USGS — Volcanoes",
          "note": "Vulkaani ehitus, purskete kujunemine ja kivimite kuhjumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vihmapiiskadest"
          },
          {
            "id": "o2",
            "text": "Puidu põletamise jääkidest"
          },
          {
            "id": "o3",
            "text": "Ainult merevees olevast soolast"
          },
          {
            "id": "o4",
            "text": "Väga peentest kivimi- ja klaasiosakestest"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q034",
      "unitId": "lo-opik-u20",
      "stem": "Mis juhtub laavaga, kui see jahtub piisavalt?",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g016",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jahtunud laava tardub kivimiks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "See tardub tahkeks kivimiks"
          },
          {
            "id": "o2",
            "text": "See muutub alati puhtaks veeks"
          },
          {
            "id": "o3",
            "text": "See kaob jäljetult"
          },
          {
            "id": "o4",
            "text": "Sellest saab kohe veeaur"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q035",
      "unitId": "lo-opik-u20",
      "stem": "Mida võib vulkaan peale laava välja paisata?",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g017",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Plahvatuslikud pursked võivad kaasa tuua tuhka, kuumi gaase ja kivimiosakesi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Tavalist õietolmu"
          },
          {
            "id": "o2",
            "text": "Tuhka, gaase ja kivimiosakesi"
          },
          {
            "id": "o3",
            "text": "Ainult jõevett"
          },
          {
            "id": "o4",
            "text": "Ainult lund"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q036",
      "unitId": "lo-opik-u20",
      "stem": "Kuidas võib vulkaanikoonus aja jooksul kasvada?",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g018",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Purskematerjal võib kihiti kuhjuda ja kõrgust suurendada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Pideval mäenõlva kulumisel"
          },
          {
            "id": "o2",
            "text": "Ainult puude kasvamisel"
          },
          {
            "id": "o3",
            "text": "Uute laava- ja tuhakihide kuhjumisel"
          },
          {
            "id": "o4",
            "text": "Ainult vihmavee kogunemisel"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q037",
      "unitId": "lo-opik-u20",
      "stem": "Milline purskenähtus voolab mööda maapinda?",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g019",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pinnal liikuv sulakivim on laavavool.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Tuhapilv taevas"
          },
          {
            "id": "o2",
            "text": "Tuules liikuv suitsupilv"
          },
          {
            "id": "o3",
            "text": "Päikesekiir"
          },
          {
            "id": "o4",
            "text": "Laavavool"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q038",
      "unitId": "lo-opik-u20",
      "stem": "Õige või vale: kõik vulkaanipursked on sama plahvatuslikud.",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g020",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Purse võib olla rahulikum voolamine või plahvatuslik.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Õige"
          },
          {
            "id": "o2",
            "text": "Vale"
          }
        ],
        "correctOptionId": "o2",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u20-q039",
      "unitId": "lo-opik-u20",
      "stem": "Miks võivad vulkaani nõlvadel näha mitut kivimikihti?",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g016",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Uued pursked võivad lisada kihte eelmiste peale.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Tuhk muutub alati päikeseks"
          },
          {
            "id": "o2",
            "text": "Eri pursked jätavad järjest uusi tardunud kihte"
          },
          {
            "id": "o3",
            "text": "Kogu vulkaan tekib ühest vihmahoost"
          },
          {
            "id": "o4",
            "text": "Mägi on seest ainult veest"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q040",
      "unitId": "lo-opik-u20",
      "stem": "Miks on tuhapilv seotud eelkõige õhuga?",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g015",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Peened osakesed võivad õhus levida ja tuulega edasi kanduda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Laava muutub ainult pilveks"
          },
          {
            "id": "o2",
            "text": "Iga tuhapilv asub veepõhjas"
          },
          {
            "id": "o3",
            "text": "Väiksed osakesed võivad purskel kõrgele õhku paiskuda"
          },
          {
            "id": "o4",
            "text": "Tuhk on alati vesi"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q041",
      "unitId": "lo-opik-u20",
      "stem": "Millised on vulkaanipurske võimalikud ilmingud?",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g017",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pursked võivad erineval määral kaasa tuua laavat, tuhka ja kivimitükke.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Kivimitükkide väljapaiskumine"
          },
          {
            "id": "o2",
            "text": "Ainult veeaurust koosnev geisripurse"
          },
          {
            "id": "o3",
            "text": "Maa telje pöördumise peatumine"
          },
          {
            "id": "o4",
            "text": "Laavavool"
          },
          {
            "id": "o5",
            "text": "Tuhapilv"
          }
        ],
        "correctOptionIds": [
          "o4",
          "o5",
          "o1"
        ]
      }
    },
    {
      "id": "lo-opik-u20-q042",
      "unitId": "lo-opik-u20",
      "stem": "Ühenda purskenähtus selle tagajärjega.",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g017",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Jahtumine tekitab kivimi, tuhk levib ning kihid võivad kuhjuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Laava jahtub"
          },
          {
            "id": "p2",
            "text": "Tuhka paiskub õhku"
          },
          {
            "id": "p3",
            "text": "Uus purse lisab kivimit"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Tekib tahke kivim"
          },
          {
            "id": "c2",
            "text": "Osakesed võivad tuulega levida"
          },
          {
            "id": "c3",
            "text": "Vulkaanikoonus võib kasvada"
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
      "id": "lo-opik-u20-q043",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta joonisel õhku tõusvat tuhapilve.",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g015",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Tuhapilv asub purske kohal õhus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-eruption-products",
        "correctRegionId": "ash"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-eruption-products"
      }
    },
    {
      "id": "lo-opik-u20-q044",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta joonisel vulkaani nõlval voolavat laavat.",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g019",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laavavool on vulkaani nõlval pinnal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-eruption-products",
        "correctRegionId": "lava"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-eruption-products"
      }
    },
    {
      "id": "lo-opik-u20-q045",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta joonisel paiskuvaid kivimitükke.",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g021",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kivimitükid on joonisel eraldi suuremad osakesed õhus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-eruption-products",
        "correctRegionId": "rocks"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-eruption-products"
      }
    },
    {
      "id": "lo-opik-u20-q046",
      "unitId": "lo-opik-u20",
      "stem": "Järjesta tegevused, mis selgitavad uue laavakihi kujunemist.",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g016",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Uus kivimikiht moodustub siis, kui laava jahtub ja tardub.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Vulkaanist väljub kuum laava."
          },
          {
            "id": "s2",
            "text": "Laava jahtub maapinnal."
          },
          {
            "id": "s3",
            "text": "Jahtunud laava tardub kivimiks."
          },
          {
            "id": "s4",
            "text": "Järgmine purse võib sellele uue kihi lisada."
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
      "id": "lo-opik-u20-q047",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta joonisel hetke, kus uus laavakiht on juba tardunud.",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g016",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Keskmine etapp näitab tardunud laavakihti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-layers-growth",
        "correctRegionId": "cooled"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-layers-growth"
      }
    },
    {
      "id": "lo-opik-u20-q048",
      "unitId": "lo-opik-u20",
      "stem": "Jaga kirjeldused õige purskenähtuse alla.",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g021",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laava voolab maapinnal; tuhk ja kivimid võivad paiskuda õhku.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "g1",
            "text": "Laavavool"
          },
          {
            "id": "g2",
            "text": "Tuhk või kivimiosakesed õhus"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Punakas sulakivim liigub nõlval"
          },
          {
            "id": "i2",
            "text": "Peen vulkaaniline tolm levib tuulega"
          },
          {
            "id": "i3",
            "text": "Kuuma sulakivimi voog jõuab teeni"
          },
          {
            "id": "i4",
            "text": "Purskel paiskuvad kivimitükid"
          }
        ],
        "correctGroupByItem": {
          "i1": "g1",
          "i2": "g2",
          "i3": "g1",
          "i4": "g2"
        }
      }
    },
    {
      "id": "lo-opik-u20-q049",
      "unitId": "lo-opik-u20",
      "stem": "Kus asub suur osa maailma vulkaanidest?",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g022",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Paljud vulkaanid asuvad liikuvate laamade piiridel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ainult kõrbete keskel"
          },
          {
            "id": "o2",
            "text": "Üksnes põhjapoolusel"
          },
          {
            "id": "o3",
            "text": "Ainult Eesti järvedes"
          },
          {
            "id": "o4",
            "text": "Laamade piirialadel"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q050",
      "unitId": "lo-opik-u20",
      "stem": "Millise ookeani ümbruses asub tuntud vulkaaniderohke vöönd?",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g023",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaikse ookeani ümbruses paikneb vulkaaniderohke tulevöönd.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/volc/tectonics.html",
          "attribution": "USGS — Volcanoes and plate tectonics",
          "note": "Enamik vulkaane on laamapiiridel, kuid osa on laama sees."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vaikse ookeani"
          },
          {
            "id": "o2",
            "text": "Põhja-Jäämere"
          },
          {
            "id": "o3",
            "text": "Läänemere"
          },
          {
            "id": "o4",
            "text": "Peipsi järve"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q051",
      "unitId": "lo-opik-u20",
      "stem": "Millise riigi vulkaani Fagradalsfjalli fotot näitab õpik?",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g024",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku foto näitab Fagradalsfjalli vulkaani Islandil.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
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
            "text": "Islandi"
          },
          {
            "id": "o3",
            "text": "Eesti"
          },
          {
            "id": "o4",
            "text": "Egiptuse"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q052",
      "unitId": "lo-opik-u20",
      "stem": "Millises riigis asub õpiku fotol nimetatud Anak Krakatau?",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g025",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Anak Krakatau asub Indoneesias.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Kanadas"
          },
          {
            "id": "o2",
            "text": "Poolas"
          },
          {
            "id": "o3",
            "text": "Indoneesias"
          },
          {
            "id": "o4",
            "text": "Rootsis"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q053",
      "unitId": "lo-opik-u20",
      "stem": "Millises piirkonnas asub õpikus kujutatud Karõmi vulkaan?",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g026",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik nimetab Karõmi vulkaani Kamtšatkal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Saharas"
          },
          {
            "id": "o2",
            "text": "Gröönimaal"
          },
          {
            "id": "o3",
            "text": "Antarktika sisemaal"
          },
          {
            "id": "o4",
            "text": "Kamtšatkal"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q054",
      "unitId": "lo-opik-u20",
      "stem": "Miks leidub paljudel laamade piiridel vulkaane?",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g022",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamade geoloogilised protsessid võivad aidata magmal pinnale jõuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/volc/tectonics.html",
          "attribution": "USGS — Volcanoes and plate tectonics",
          "note": "Enamik vulkaane on laamapiiridel, kuid osa on laama sees."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Sealne laamade liikumine võib soodustada magma teket ja tõusu"
          },
          {
            "id": "o2",
            "text": "Riigipiirid tõmbavad magmat"
          },
          {
            "id": "o3",
            "text": "Vulkaane saab ehitada ainult merre"
          },
          {
            "id": "o4",
            "text": "Päike soojendab seal maapinda eriliselt"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q055",
      "unitId": "lo-opik-u20",
      "stem": "Õige või vale: iga maailma vulkaan asub täpselt laamade piiril.",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g027",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "On ka laama sisemuses paiknevaid vulkaane, näiteks Hawaiil.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/volc/tectonics.html",
          "attribution": "USGS — Volcanoes and plate tectonics",
          "note": "Enamik vulkaane on laamapiiridel, kuid osa on laama sees."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Õige"
          },
          {
            "id": "o2",
            "text": "Vale"
          }
        ],
        "correctOptionId": "o2",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u20-q056",
      "unitId": "lo-opik-u20",
      "stem": "Milline näide kinnitab, et vulkaan võib asuda ka laama sisemuses?",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g027",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hawaiil on vulkaanid seotud laama sisemuse kuuma täpiga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/volc/tectonics.html",
          "attribution": "USGS — Volcanoes and plate tectonics",
          "note": "Enamik vulkaane on laamapiiridel, kuid osa on laama sees."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Tavaline allikas Saaremaal"
          },
          {
            "id": "o2",
            "text": "Peipsi järve kaldad"
          },
          {
            "id": "o3",
            "text": "Hawaii vulkaanid"
          },
          {
            "id": "o4",
            "text": "Riigipiir Eesti ja Läti vahel"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q057",
      "unitId": "lo-opik-u20",
      "stem": "Millised laused vulkaanide asukoha kohta on õiged?",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g028",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaane esineb nii laamade piiridel kui ka mõnes laamasisemuses asuvas piirkonnas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Kõik vulkaanid asuvad ühes riigis"
          },
          {
            "id": "o2",
            "text": "Vulkaanid tekivad ainult külma vee juures"
          },
          {
            "id": "o3",
            "text": "Paljud vulkaanid on laamade piiridel"
          },
          {
            "id": "o4",
            "text": "Mõned vulkaanid on laamade sisemuses"
          }
        ],
        "correctOptionIds": [
          "o3",
          "o4"
        ]
      }
    },
    {
      "id": "lo-opik-u20-q058",
      "unitId": "lo-opik-u20",
      "stem": "Ühenda õpiku vulkaan ja selle asukoht.",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g024",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Need kolm näidet on õpiku fotodel lehekülgedel 74–75.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Fagradalsfjall"
          },
          {
            "id": "p2",
            "text": "Karõmi"
          },
          {
            "id": "p3",
            "text": "Anak Krakatau"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Island"
          },
          {
            "id": "c2",
            "text": "Kamtšatka"
          },
          {
            "id": "c3",
            "text": "Indoneesia"
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
      "id": "lo-opik-u20-q059",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta asukohaskeemil laamade piiriala, kus võib kujuneda vulkaan.",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g022",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Skeemil on laamapiiri piirkond eraldi tähistatud.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-volcano-locations",
        "correctRegionId": "boundary"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-volcano-locations"
      }
    },
    {
      "id": "lo-opik-u20-q060",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta asukohaskeemil laama sees paiknevat vulkaani.",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g027",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuuma täpi näide on skeemil laama sisemuses.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-volcano-locations",
        "correctRegionId": "hotspot"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-volcano-locations"
      }
    },
    {
      "id": "lo-opik-u20-q061",
      "unitId": "lo-opik-u20",
      "stem": "Ülesandes on kirjeldatud laama sisemuses asuvat kuuma täppi. Kas seal võib olla vulkaan?",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g027",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laama sisemuse kuumad täpid on üks vulkaanide tekke võimalus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/volc/tectonics.html",
          "attribution": "USGS — Volcanoes and plate tectonics",
          "note": "Enamik vulkaane on laamapiiridel, kuid osa on laama sees."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ei, vulkaanid on alati ainult laamade piiridel"
          },
          {
            "id": "o2",
            "text": "Ainult siis, kui seal on riigipiir"
          },
          {
            "id": "o3",
            "text": "Ainult juhul, kui seal on geiser"
          },
          {
            "id": "o4",
            "text": "Jah, mõnel kuumal täpil võib olla vulkaan"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q062",
      "unitId": "lo-opik-u20",
      "stem": "Rühmita olukorrad võimaliku asukoha järgi.",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g029",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamade piirid ja kuumad täpid laama sees on kaks võimalikku olukorda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "g1",
            "text": "Laama piir"
          },
          {
            "id": "g2",
            "text": "Laama sisemus"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Koht, kus kaks laama kohtuvad"
          },
          {
            "id": "i2",
            "text": "Hawaii kuum täpp"
          },
          {
            "id": "i3",
            "text": "Merepõhja laamapiir"
          },
          {
            "id": "i4",
            "text": "Vulkaanikoonus kuuma täpi kohal"
          }
        ],
        "correctGroupByItem": {
          "i1": "g1",
          "i2": "g2",
          "i3": "g1",
          "i4": "g2"
        }
      }
    },
    {
      "id": "lo-opik-u20-q063",
      "unitId": "lo-opik-u20",
      "stem": "Kui teadlane leiab vulkaani Vaikse ookeani ümbruse laamapiirilt, kas see on ootamatu?",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g030",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaikse ookeani ümbruses on palju vulkaanilisi alasid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Jah, vulkaanid asuvad alati laama sees"
          },
          {
            "id": "o2",
            "text": "Ei, seal paikneb palju vulkaane"
          },
          {
            "id": "o3",
            "text": "Jah, vulkaane ei esine ookeanide ääres"
          },
          {
            "id": "o4",
            "text": "Jah, vulkaanid esinevad ainult Eestis"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q064",
      "unitId": "lo-opik-u20",
      "stem": "Märgi õiged järeldused.",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g031",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaanide asukohad sõltuvad geoloogilistest protsessidest, mitte riigipiiridest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Mõned vulkaanid võivad asuda piirist eemal"
          },
          {
            "id": "o2",
            "text": "Kõik aktiivsed vulkaanid asuvad samas mäestikus"
          },
          {
            "id": "o3",
            "text": "Laamapiirid on samad mis riigipiirid"
          },
          {
            "id": "o4",
            "text": "Laamapiiride uurimine võib aidata leida vulkaanilisi piirkondi"
          }
        ],
        "correctOptionIds": [
          "o4",
          "o1"
        ]
      }
    },
    {
      "id": "lo-opik-u20-q065",
      "unitId": "lo-opik-u20",
      "stem": "Mida tähendab õpiku järgi uinunud vulkaan?",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g032",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Uinunud vulkaan praegu ei purska, kuid võib tulevikus taas aktiivsemaks muutuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Alati jääga kaetud mägi"
          },
          {
            "id": "o2",
            "text": "Vulkaan, milles on ainult geisrid"
          },
          {
            "id": "o3",
            "text": "Iga tavapärane kivimägi"
          },
          {
            "id": "o4",
            "text": "Praegu vaikne vulkaan, mis võib uuesti pursata"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q066",
      "unitId": "lo-opik-u20",
      "stem": "Mida tähendab õpiku järgi kustunud vulkaan?",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g033",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kustunuks nimetatakse vulkaani, mille puhul tulevast purset enam ei oodata. Mõnikord on liigitus ebakindel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vulkaan, mille tulevast purset enam ei oodata"
          },
          {
            "id": "o2",
            "text": "Vulkaan, mis purskab iga tund"
          },
          {
            "id": "o3",
            "text": "Vulkaan, mis on kindlasti ookeanis"
          },
          {
            "id": "o4",
            "text": "Iga vulkaan, millest täna suitsu ei tule"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q067",
      "unitId": "lo-opik-u20",
      "stem": "Milline kirjeldus näitab, et vulkaan parasjagu purskab?",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g034",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kui vulkaan parasjagu purskab, toimub vulkaaniline väljapaiskumine.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ilm on pilvine"
          },
          {
            "id": "o2",
            "text": "Purskeavast väljub laavat või purskematerjali"
          },
          {
            "id": "o3",
            "text": "Lähedal kasvavad puud"
          },
          {
            "id": "o4",
            "text": "Pildil on vana kivim"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q068",
      "unitId": "lo-opik-u20",
      "stem": "Mida ei saa ainult praeguse vaikuse põhjal järeldada?",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g033",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Pikka aega vaikne vulkaan võib hiljem taas pursata.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Et praegu ei voola vulkaanist laavat"
          },
          {
            "id": "o2",
            "text": "Et piirkond võib olla rohtukasvanud"
          },
          {
            "id": "o3",
            "text": "Et vulkaan ei purska kunagi enam"
          },
          {
            "id": "o4",
            "text": "Et praegu ei ole purske nähtavaid märke"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q069",
      "unitId": "lo-opik-u20",
      "stem": "Mitu lihtsustatud seisundit nimetab õpik vulkaanide puhul?",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g035",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpik räägib tegutsevatest, uinunud ja kustunud vulkaanidest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ühe"
          },
          {
            "id": "o2",
            "text": "Kümme"
          },
          {
            "id": "o3",
            "text": "Kaksteist"
          },
          {
            "id": "o4",
            "text": "Kolm"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q070",
      "unitId": "lo-opik-u20",
      "stem": "Õige või vale: teadlaste keeles peab „aktiivne vulkaan” alati just sel hetkel purskama.",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g036",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aktiivne võib olla ka vulkaan, mis praegu ei purska, kuid on võimeline tulevikus purskama.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/observatories/yvo/news/active-dormant-and-extinct-clarifying-confusing-classifications",
          "attribution": "USGS — Active, dormant, extinct",
          "note": "Tegutsev ei tähenda alati parasjagu purskavat; liigitus on teaduslikult paindlik."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Õige"
          },
          {
            "id": "o2",
            "text": "Vale"
          }
        ],
        "correctOptionId": "o2",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u20-q071",
      "unitId": "lo-opik-u20",
      "stem": "Miks võib uinunud vulkaan vajada tähelepanu?",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g032",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vaikne periood ei pruugi tähendada vulkaani lõplikku lõppu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "See kaob järgmisel päeval"
          },
          {
            "id": "o2",
            "text": "See võib tulevikus uuesti pursata"
          },
          {
            "id": "o3",
            "text": "See muutub kindlasti geisriks"
          },
          {
            "id": "o4",
            "text": "Magma muutub alati lumeks"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q072",
      "unitId": "lo-opik-u20",
      "stem": "Millised väited vulkaanide seisundi kohta on õiged?",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g037",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaanide tegevus võib muutuda ning liigitus nõuab geoloogilisi andmeid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/observatories/yvo/news/active-dormant-and-extinct-clarifying-confusing-classifications",
          "attribution": "USGS — Active, dormant, extinct",
          "note": "Tegutsev ei tähenda alati parasjagu purskavat; liigitus on teaduslikult paindlik."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Teadlaste hinnang vulkaani seisundile võib ajas muutuda"
          },
          {
            "id": "o2",
            "text": "Kui vulkaan praegu ei purska, on see kindlasti kustunud"
          },
          {
            "id": "o3",
            "text": "Kõik maailma vulkaanid purskavad kogu aeg"
          },
          {
            "id": "o4",
            "text": "Uinunud vulkaan võib uuesti pursata"
          }
        ],
        "correctOptionIds": [
          "o4",
          "o1"
        ]
      }
    },
    {
      "id": "lo-opik-u20-q073",
      "unitId": "lo-opik-u20",
      "stem": "Ühenda vulkaani kirjeldus õpikus kasutatava lihtsustatud mõistega.",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g038",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Skeem eristab praegu purskavat, vaikset kuid potentsiaalselt aktiivset ja kustunuks hinnatud vulkaani.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Praegu purskab"
          },
          {
            "id": "p2",
            "text": "Praegu vaikne, võib veel pursata"
          },
          {
            "id": "p3",
            "text": "Tulevast purset enam ei oodata"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Purskav vulkaan"
          },
          {
            "id": "c2",
            "text": "Uinunud vulkaan"
          },
          {
            "id": "c3",
            "text": "Kustunud vulkaan"
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
      "id": "lo-opik-u20-q074",
      "unitId": "lo-opik-u20",
      "stem": "Kas ainult ühe foto põhjal, kus vulkaan praegu ei purska, saab selle kustunuks kuulutada?",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g039",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaani seisundit hinnatakse pikema ajaloo ja mõõtmiste abil, mitte ainult ühe vaikse hetke järgi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/observatories/yvo/news/active-dormant-and-extinct-clarifying-confusing-classifications",
          "attribution": "USGS — Active, dormant, extinct",
          "note": "Tegutsev ei tähenda alati parasjagu purskavat; liigitus on teaduslikult paindlik."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ei, vaja on ka vulkaani ajaloo ja seisundi uurimist"
          },
          {
            "id": "o2",
            "text": "Jah, iga vaikne foto tõestab kustumist"
          },
          {
            "id": "o3",
            "text": "Jah, kui pildil kasvab rohi"
          },
          {
            "id": "o4",
            "text": "Jah, kui foto on tehtud päeval"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q075",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta olekuskeemil vulkaani, mis parajasti purskab.",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g034",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Purske ajal väljub laava või purskematerjal.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-volcano-states",
        "correctRegionId": "erupting"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-volcano-states"
      }
    },
    {
      "id": "lo-opik-u20-q076",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta olekuskeemil praegu vaikset vulkaani, mis võib tulevikus uuesti pursata.",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g032",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Uinunud vulkaan ei purska praegu, kuid tulevikus võib pursata.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-volcano-states",
        "correctRegionId": "dormant"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-volcano-states"
      }
    },
    {
      "id": "lo-opik-u20-q077",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta olekuskeemil vulkaani, mille tulevast purset enam ei oodata.",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g033",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kustunuks hinnatud vulkaan on selles õppejoonises vana ja mitteaktiivne.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-volcano-states",
        "correctRegionId": "extinct"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-volcano-states"
      }
    },
    {
      "id": "lo-opik-u20-q078",
      "unitId": "lo-opik-u20",
      "stem": "Rühmita olukorrad lihtsustatud õpikunimetuse alla.",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g040",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Praegune purse ja tulevikus võimalik purse on erinevad seisundid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "g1",
            "text": "Praegu purskab"
          },
          {
            "id": "g2",
            "text": "Uinunud"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Näha on värske laavavool"
          },
          {
            "id": "i2",
            "text": "Vulkaan on praegu vaikne, kuid varem pursanud ja võib veel pursata"
          },
          {
            "id": "i3",
            "text": "Kraatrisse tõuseb parasjagu purskematerjali"
          },
          {
            "id": "i4",
            "text": "Praegu purskeid pole, kuid magma liikumise märke jälgitakse"
          }
        ],
        "correctGroupByItem": {
          "i1": "g1",
          "i2": "g2",
          "i3": "g1",
          "i4": "g2"
        }
      }
    },
    {
      "id": "lo-opik-u20-q079",
      "unitId": "lo-opik-u20",
      "stem": "Teadlased näevad mäel maapinna kerkimist, kuid laavat ei välju. Mida saab öelda?",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g036",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõned märgid viitavad võimalikule aktiivsusele, kuid need ei taga kindlat purset.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/observatories/yvo/news/active-dormant-and-extinct-clarifying-confusing-classifications",
          "attribution": "USGS — Active, dormant, extinct",
          "note": "Tegutsev ei tähenda alati parasjagu purskavat; liigitus on teaduslikult paindlik."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "See pole kunagi olnud vulkaan"
          },
          {
            "id": "o2",
            "text": "Vulkaan võib olla aktiivne, kuigi praegu ei purska"
          },
          {
            "id": "o3",
            "text": "Vulkaan on kindlasti kustunud"
          },
          {
            "id": "o4",
            "text": "Vulkaan purskab tingimata tunni pärast"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q080",
      "unitId": "lo-opik-u20",
      "stem": "Õige või vale: täna vaiksena paistev vulkaan võib mõne aja pärast uuesti pursata.",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g032",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Uinunud vulkaan võib tulevikus taas pursata.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Õige"
          },
          {
            "id": "o2",
            "text": "Vale"
          }
        ],
        "correctOptionId": "o1",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u20-q081",
      "unitId": "lo-opik-u20",
      "stem": "Milline vulkaanipurske nähtus võib halvendada õhukvaliteeti?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g041",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Peened tuhaosakesed võivad muuta õhu halvaks ja vähendada nähtavust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Puhas vihmavesi"
          },
          {
            "id": "o2",
            "text": "Tavaline hommikukaste"
          },
          {
            "id": "o3",
            "text": "Valge liiv lumel"
          },
          {
            "id": "o4",
            "text": "Vulkaaniline tuhk"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q082",
      "unitId": "lo-opik-u20",
      "stem": "Mida võib laavavool kahjustada?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g042",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuum laava võib põletada või matta oma teele jäävaid esemeid ja ehitisi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Teid, hooneid ja põlde oma teel"
          },
          {
            "id": "o2",
            "text": "Kaugemal paiknevaid merehoovuseid"
          },
          {
            "id": "o3",
            "text": "Ainult vulkaani sisemuses asuvaid kivimeid"
          },
          {
            "id": "o4",
            "text": "Mäenõlva veeriseid"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q083",
      "unitId": "lo-opik-u20",
      "stem": "Millist nähtust mõõdavad teadlased vulkaani juures võimaliku rahutuse märkamiseks?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g043",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magma liikumisega võivad kaasneda mõõdetavad maavärinad.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-can-we-tell-when-a-volcano-will-erupt",
          "attribution": "USGS — Volcano monitoring and warning signs",
          "note": "Hoiatustunnused aitavad riske hinnata, kuid purset ei saa alati täpselt ennustada."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vulkaanide ümbruse tuulesuunda"
          },
          {
            "id": "o2",
            "text": "Maavärinaid"
          },
          {
            "id": "o3",
            "text": "Vulkaanilise tuha osakeste suurust"
          },
          {
            "id": "o4",
            "text": "Kõigi maailma jõgede sügavust"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q084",
      "unitId": "lo-opik-u20",
      "stem": "Millist muutust saab vulkaani jälgimisel uurida?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g044",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Gaaside hulga ja koostise muutumine võib olla üks jälgitav ohumärk.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-can-we-tell-when-a-volcano-will-erupt",
          "attribution": "USGS — Volcano monitoring and warning signs",
          "note": "Hoiatustunnused aitavad riske hinnata, kuid purset ei saa alati täpselt ennustada."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Lähedal asuva kooli tunniplaani muutumist"
          },
          {
            "id": "o2",
            "text": "Tänava nime muutumist"
          },
          {
            "id": "o3",
            "text": "Vulkaanist eralduvate gaaside koostise muutumist"
          },
          {
            "id": "o4",
            "text": "Lainepikkuse muutumist koduraadios"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q085",
      "unitId": "lo-opik-u20",
      "stem": "Milline muutus võib viidata maa sees liikuvale magmale?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g044",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maapinna kuju muutumine võib olla märk maa-alusest rõhu muutusest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-can-we-tell-when-a-volcano-will-erupt",
          "attribution": "USGS — Volcano monitoring and warning signs",
          "note": "Hoiatustunnused aitavad riske hinnata, kuid purset ei saa alati täpselt ennustada."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Pilvede tavaline liikumine"
          },
          {
            "id": "o2",
            "text": "Päikese tõus hommikul"
          },
          {
            "id": "o3",
            "text": "Ookeani lainete arv"
          },
          {
            "id": "o4",
            "text": "Maapinna paisumine või kerkimine"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q086",
      "unitId": "lo-opik-u20",
      "stem": "Õige või vale: teadlased saavad iga vulkaanipurske täpse kellaaja alati ette teada.",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g045",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ohumärkide järgi saab sageli hoiatada, kuid iga purset ei saa täpselt ennustada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-can-we-tell-when-a-volcano-will-erupt",
          "attribution": "USGS — Volcano monitoring and warning signs",
          "note": "Hoiatustunnused aitavad riske hinnata, kuid purset ei saa alati täpselt ennustada."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Õige"
          },
          {
            "id": "o2",
            "text": "Vale"
          }
        ],
        "correctOptionId": "o2",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u20-q087",
      "unitId": "lo-opik-u20",
      "stem": "Miks tuleb vulkaanilist tuhka tõsiselt võtta?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g041",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaaniline tuhk ei ole ohutu dekoratsioon.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Tuhk on vaid ilus värv"
          },
          {
            "id": "o2",
            "text": "Peened osakesed võivad ohustada hingamist ja halvendada nähtavust"
          },
          {
            "id": "o3",
            "text": "See on alati ohutu lumi"
          },
          {
            "id": "o4",
            "text": "Tuhk puhastab automaatselt õhu"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q088",
      "unitId": "lo-opik-u20",
      "stem": "Milline väide on kuumade tuha- ja gaasivoolude kohta õige?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g046",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mõned plahvatuslike pursete kuumad gaasi- ja tuhavood liiguvad ülikiiresti.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-dangerous-are-pyroclastic-flows",
          "attribution": "USGS — Pyroclastic flow hazards",
          "note": "Väga kiiresti liikuvad kuumad tuha-, gaasi- ja kivimivoolud ei ole tavaline laava."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Need koosnevad ainult vihmast"
          },
          {
            "id": "o2",
            "text": "Neid saab turvaliselt jalgsi jälitada"
          },
          {
            "id": "o3",
            "text": "Need võivad liikuda väga kiiresti ja olla eluohtlikud"
          },
          {
            "id": "o4",
            "text": "Need on alati tavalised aeglased laavavoolud"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q089",
      "unitId": "lo-opik-u20",
      "stem": "Miks tuleb ametlikku evakuatsioonikorraldust järgida kohe?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g047",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Varajane lahkumine aitab ohtlikust piirkonnast eemale jõuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Sest siis saab vulkaani paremini pildistada"
          },
          {
            "id": "o2",
            "text": "Sest siis saab ohuala kiiresti avada"
          },
          {
            "id": "o3",
            "text": "Sest purse peab alati olema täpselt kell 12"
          },
          {
            "id": "o4",
            "text": "Ohud võivad areneda kiiresti ja piirkonda jäämine on ohtlik"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q090",
      "unitId": "lo-opik-u20",
      "stem": "Millised on võimalikud vulkaani hoiatusmärgid?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g043",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maavärinad, maapinna kuju ja gaaside muutused võivad aidata tegevust jälgida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-can-we-tell-when-a-volcano-will-erupt",
          "attribution": "USGS — Volcano monitoring and warning signs",
          "note": "Hoiatustunnused aitavad riske hinnata, kuid purset ei saa alati täpselt ennustada."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Maapinna paisumine"
          },
          {
            "id": "o2",
            "text": "Gaaside muutumine"
          },
          {
            "id": "o3",
            "text": "Päeva pikkuse tavapärane muutumine"
          },
          {
            "id": "o4",
            "text": "Lennuki lennusuuna muutumine"
          },
          {
            "id": "o5",
            "text": "Maavärinate sagenemine"
          }
        ],
        "correctOptionIds": [
          "o5",
          "o1",
          "o2"
        ]
      }
    },
    {
      "id": "lo-opik-u20-q091",
      "unitId": "lo-opik-u20",
      "stem": "Kohalik päästeteenistus annab korralduse lahkuda vulkaani lähedalt. Mida teha?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g047",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ametlik evakuatsioonikorraldus tähendab, et tuleb liikuda ohutusse kohta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Minna suuremat pilti tegema"
          },
          {
            "id": "o2",
            "text": "Lahkuda juhiste järgi võimalikult kiiresti"
          },
          {
            "id": "o3",
            "text": "Jääda kraatri juurde vaatama"
          },
          {
            "id": "o4",
            "text": "Oodata igal juhul laava ilmumiseni"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q092",
      "unitId": "lo-opik-u20",
      "stem": "Teadlased märkavad vulkaanis maavärinate sagenemist, kuid purset veel ei ole. Mis on mõistlik järeldus?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g045",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Hoiatusmärk võib viidata aktiivsusele, kuid ei määra üksinda purske aega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-can-we-tell-when-a-volcano-will-erupt",
          "attribution": "USGS — Volcano monitoring and warning signs",
          "note": "Hoiatustunnused aitavad riske hinnata, kuid purset ei saa alati täpselt ennustada."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vulkaan on kindlasti kustunud"
          },
          {
            "id": "o2",
            "text": "Hoiatusmärgid on kasutud"
          },
          {
            "id": "o3",
            "text": "See võib olla ohumärk, mida tuleb edasi jälgida"
          },
          {
            "id": "o4",
            "text": "Purse toimub kindlasti täpselt kell 12"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q093",
      "unitId": "lo-opik-u20",
      "stem": "Vulkaani lähedal on tee, millele võib jõuda laavavool. Milline otsus vähendab riski?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g047",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ohuala piiramine ja ametlike juhiste järgimine vähendavad kokkupuudet ohuga.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Avada tee turistidele pildistamiseks"
          },
          {
            "id": "o2",
            "text": "Sõita laavale võimalikult lähedale"
          },
          {
            "id": "o3",
            "text": "Oodata teele tulevat tuhka paljaste kätega"
          },
          {
            "id": "o4",
            "text": "Sulgeda ohtlik tee ja järgida ametlikke juhiseid"
          }
        ],
        "correctOptionId": "o4"
      },
      "context": {
        "kind": "text",
        "title": "Päästeteenistuse teade",
        "paragraphs": [
          "Vulkaani nõlvalt liigub laavavool tee suunas."
        ]
      }
    },
    {
      "id": "lo-opik-u20-q094",
      "unitId": "lo-opik-u20",
      "stem": "Rühmita tegevused ohututeks ja ohtlikeks.",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g047",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ametlikud juhised aitavad vältida ohtlikke olukordi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "g1",
            "text": "Ohutust suurendab"
          },
          {
            "id": "g2",
            "text": "Ohtu suurendab"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Järgin evakuatsioonikorraldust"
          },
          {
            "id": "i2",
            "text": "Lähen kraatrile lähemale pilti tegema"
          },
          {
            "id": "i3",
            "text": "Kuulan ametlikku teavet"
          },
          {
            "id": "i4",
            "text": "Jään keelualale laavat ootama"
          }
        ],
        "correctGroupByItem": {
          "i1": "g1",
          "i2": "g2",
          "i3": "g1",
          "i4": "g2"
        }
      }
    },
    {
      "id": "lo-opik-u20-q095",
      "unitId": "lo-opik-u20",
      "stem": "Ühenda jälgitav muutus sellega, mida teadlane mõõdab.",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g043",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaanitegevust jälgitakse mitme mõõtmise abil.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/how-can-we-tell-when-a-volcano-will-erupt",
          "attribution": "USGS — Volcano monitoring and warning signs",
          "note": "Hoiatustunnused aitavad riske hinnata, kuid purset ei saa alati täpselt ennustada."
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Sagenenud värinad"
          },
          {
            "id": "p2",
            "text": "Maa pind kerkib"
          },
          {
            "id": "p3",
            "text": "Muutub väljuv gaas"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Seismilised mõõtmised"
          },
          {
            "id": "c2",
            "text": "Maapinna liikumise mõõtmised"
          },
          {
            "id": "c3",
            "text": "Gaasianalüüs"
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
      "id": "lo-opik-u20-q096",
      "unitId": "lo-opik-u20",
      "stem": "Milliseid ohte tuleb vulkaanipurske korral arvestada?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g042",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Eri pursked võivad tekitada mitut liiki ohte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Kuum gaasi- ja tuhavool võib liikuda kiiresti"
          },
          {
            "id": "o2",
            "text": "Iga purske ajal sajab tingimata lund"
          },
          {
            "id": "o3",
            "text": "Kõik vulkaanipursked toimuvad ohutult"
          },
          {
            "id": "o4",
            "text": "Laavavool võib hooneid kahjustada"
          },
          {
            "id": "o5",
            "text": "Tuhk võib halvendada õhukvaliteeti"
          }
        ],
        "correctOptionIds": [
          "o4",
          "o5",
          "o1"
        ]
      }
    },
    {
      "id": "lo-opik-u20-q097",
      "unitId": "lo-opik-u20",
      "stem": "Miks võivad vulkaanide ümbruse mullad olla viljakad?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g048",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaanilised kivimid võivad pikema aja jooksul kujuneda mineraalirikkaks mullaks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-are-some-benefits-volcanic-eruptions",
          "attribution": "USGS — Benefits of volcanic eruptions",
          "note": "Pika aja jooksul võivad vulkaanilised kivimid muutuda viljakaks mullaks."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Laava on kohe külm vesi"
          },
          {
            "id": "o2",
            "text": "Tuhk on juba valmis joogivesi"
          },
          {
            "id": "o3",
            "text": "Muld tekib laavast ilma jahtumise või murenemise vajaduseta"
          },
          {
            "id": "o4",
            "text": "Vulkaanilised kivimid murenevad aja jooksul mullaks"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q098",
      "unitId": "lo-opik-u20",
      "stem": "Kas värske kuum laava sobib kohe põllumullaks?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g049",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Värske laava ei ole muld; mulla kujunemine võtab aega.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-are-some-benefits-volcanic-eruptions",
          "attribution": "USGS — Benefits of volcanic eruptions",
          "note": "Pika aja jooksul võivad vulkaanilised kivimid muutuda viljakaks mullaks."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ei, kivim peab kõigepealt jahtuma ja pikalt muutuma"
          },
          {
            "id": "o2",
            "text": "Jah, taimi saab kuumale laavale kohe külvata"
          },
          {
            "id": "o3",
            "text": "Jah, laava on puhas huumus"
          },
          {
            "id": "o4",
            "text": "Jah, laava on alati savimuld"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q099",
      "unitId": "lo-opik-u20",
      "stem": "Millise tegevuse jaoks võib viljakast vulkaanilisest mullast kasu olla?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g050",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Viljakal mullal on võimalik kasvatada põllukultuure.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Maa telje liigutamiseks"
          },
          {
            "id": "o2",
            "text": "Põlluharimiseks"
          },
          {
            "id": "o3",
            "text": "Merede temperatuuride mõõtmiseks"
          },
          {
            "id": "o4",
            "text": "Muldade keemilise koostise muutmiseks"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q100",
      "unitId": "lo-opik-u20",
      "stem": "Mida saab mõnes vulkaanilises piirkonnas lisaks mullale kasutada?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g051",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geotermilist soojust saab mõnes piirkonnas kasutada näiteks kütmiseks.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-are-some-benefits-volcanic-eruptions",
          "attribution": "USGS — Benefits of volcanic eruptions",
          "note": "Pika aja jooksul võivad vulkaanilised kivimid muutuda viljakaks mullaks."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ainult allikavett"
          },
          {
            "id": "o2",
            "text": "Vee pöörlemist jõgedes"
          },
          {
            "id": "o3",
            "text": "Maa sisemist soojust"
          },
          {
            "id": "o4",
            "text": "Ainult jäävett"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q101",
      "unitId": "lo-opik-u20",
      "stem": "Millise ohuga arvestatakse vulkaani lähedal elades?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g052",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaanid võivad olla ohtlikud ka siis, kui nende lähedal leidub häid põllumaid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Kuu kadumisega"
          },
          {
            "id": "o2",
            "text": "Maa magnetvälja täieliku kadumisega iga päev"
          },
          {
            "id": "o3",
            "text": "Merevee kohese jäätumisega"
          },
          {
            "id": "o4",
            "text": "Võimaliku purskega"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q102",
      "unitId": "lo-opik-u20",
      "stem": "Miks ei teki viljakas muld kohe pärast laavavoolu?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g048",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mulla teke on pikk looduslik protsess.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-are-some-benefits-volcanic-eruptions",
          "attribution": "USGS — Benefits of volcanic eruptions",
          "note": "Pika aja jooksul võivad vulkaanilised kivimid muutuda viljakaks mullaks."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Kivim peab jahtuma ja aja jooksul murenduma"
          },
          {
            "id": "o2",
            "text": "Sest laava jääb igaveseks vedelaks"
          },
          {
            "id": "o3",
            "text": "Sest vihm ei saagi maa peale sadada"
          },
          {
            "id": "o4",
            "text": "Sest vulkaanilised kivimid ei sisalda kunagi mineraale"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q103",
      "unitId": "lo-opik-u20",
      "stem": "Mis on vulkaanide lähedal elamise keskne vastuolu?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g053",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaanilistest pinnastest võib kasu olla, kuid purskeoht ei kao.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vulkaani läheduses pole kunagi vett"
          },
          {
            "id": "o2",
            "text": "Viljakas maa võib olla kasulik, kuid pursked ohtlikud"
          },
          {
            "id": "o3",
            "text": "Seal ei kasva mitte kunagi ühtegi taime"
          },
          {
            "id": "o4",
            "text": "Kõik elanikud elavad kraatris"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q104",
      "unitId": "lo-opik-u20",
      "stem": "Millised põhjused võivad inimesi vulkaanipiirkonda elama tuua?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g051",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkanism võib tuua nii viljakat mulda kui kasutatavat maasoojust, kuid ka ohte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-are-some-benefits-volcanic-eruptions",
          "attribution": "USGS — Benefits of volcanic eruptions",
          "note": "Pika aja jooksul võivad vulkaanilised kivimid muutuda viljakaks mullaks."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Mõnes piirkonnas kasutatav maasoojus"
          },
          {
            "id": "o2",
            "text": "Vulkaani täielik ohutus iga ilmaga"
          },
          {
            "id": "o3",
            "text": "Võimalus seista purske ajal kraatri serval"
          },
          {
            "id": "o4",
            "text": "Aja jooksul tekkinud viljakas põllumuld"
          }
        ],
        "correctOptionIds": [
          "o4",
          "o1"
        ]
      }
    },
    {
      "id": "lo-opik-u20-q105",
      "unitId": "lo-opik-u20",
      "stem": "Õige või vale: viljakas vulkaaniline muld muudab vulkaani ohutuks.",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g053",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Viljakas pinnas ei kõrvalda võimalikku vulkaanipurske ohtu.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Õige"
          },
          {
            "id": "o2",
            "text": "Vale"
          }
        ],
        "correctOptionId": "o2",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u20-q106",
      "unitId": "lo-opik-u20",
      "stem": "Ühenda nähtus pikaajalise tagajärjega.",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g054",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaanidel on nii pikaajalisi kasulikke mõjusid kui ka ohte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-are-some-benefits-volcanic-eruptions",
          "attribution": "USGS — Benefits of volcanic eruptions",
          "note": "Pika aja jooksul võivad vulkaanilised kivimid muutuda viljakaks mullaks."
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Vulkaaniline kivim murenenud"
          },
          {
            "id": "p2",
            "text": "Maa sisemine kuumus"
          },
          {
            "id": "p3",
            "text": "Ohtlik vulkaanipurse"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Võib kujuneda viljakas muld"
          },
          {
            "id": "c2",
            "text": "Võib kasutada kütmiseks"
          },
          {
            "id": "c3",
            "text": "Võib olla vaja evakueerida"
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
      "id": "lo-opik-u20-q107",
      "unitId": "lo-opik-u20",
      "stem": "Põllumees kaalub maad vana vulkaani jalamil. Mis on mõistlik põhjendus?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g050",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaaniline pinnas võib anda hea saagi, kuid ohutust tuleb eraldi arvestada.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vulkaanid ei purska kunagi teist korda"
          },
          {
            "id": "o2",
            "text": "Muld võib olla viljakas, kuid vulkaaniohtu tuleb hinnata"
          },
          {
            "id": "o3",
            "text": "Põld on kindlasti purske suhtes immuunne"
          },
          {
            "id": "o4",
            "text": "Värske laava sobib kohe külvamiseks"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q108",
      "unitId": "lo-opik-u20",
      "stem": "Sea viljaka mulla kujunemine lihtsustatud järjekorda.",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g048",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Muld kujuneb pika aja jooksul tardunud kivimi muutumisel.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-are-some-benefits-volcanic-eruptions",
          "attribution": "USGS — Benefits of volcanic eruptions",
          "note": "Pika aja jooksul võivad vulkaanilised kivimid muutuda viljakaks mullaks."
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Vulkaanist väljub laava."
          },
          {
            "id": "s2",
            "text": "Laava jahtub ja tardub kivimiks."
          },
          {
            "id": "s3",
            "text": "Kivim murendub pika aja jooksul."
          },
          {
            "id": "s4",
            "text": "Kujuneb muld, kus võivad taimed kasvada."
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
      "id": "lo-opik-u20-q109",
      "unitId": "lo-opik-u20",
      "stem": "Jaota laused kahte rühma.",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g055",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaanilises piirkonnas tuleb eristada võimalusi ja ohte.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "g1",
            "text": "Võimalik kasu"
          },
          {
            "id": "g2",
            "text": "Võimalik oht"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Viljakas põllumuld"
          },
          {
            "id": "i2",
            "text": "Tuhapilv halvendab õhku"
          },
          {
            "id": "i3",
            "text": "Mõnes piirkonnas saab kasutada maasoojust"
          },
          {
            "id": "i4",
            "text": "Laavavool võib teed rikkuda"
          }
        ],
        "correctGroupByItem": {
          "i1": "g1",
          "i2": "g2",
          "i3": "g1",
          "i4": "g2"
        }
      }
    },
    {
      "id": "lo-opik-u20-q110",
      "unitId": "lo-opik-u20",
      "stem": "Küla lähedal leidub hea põllumuld, kuid vulkaan on uinunud. Mis otsus on põhjendatud?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g056",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Viljakas muld ei tühista vajadust ohujuhiseid järgida.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Põldu võib harida, jälgides vulkaaniohu hoiatusi"
          },
          {
            "id": "o2",
            "text": "Võib kõik hoiatused eirata"
          },
          {
            "id": "o3",
            "text": "Võib purske ajal kraatrisse minna"
          },
          {
            "id": "o4",
            "text": "Tuleb arvata, et vulkaan on kindlasti kustunud"
          }
        ],
        "correctOptionId": "o1"
      },
      "context": {
        "kind": "text",
        "title": "Küla jalamil",
        "paragraphs": [
          "Põllumaa on viljakas. Vulkanoloogid jälgivad lähedast uinunud vulkaani."
        ]
      }
    },
    {
      "id": "lo-opik-u20-q111",
      "unitId": "lo-opik-u20",
      "stem": "Milline järeldus sobib väitega „vanad vulkaanilised kivimid on murenenud”?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g049",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Murenemine on osa mulla kujunemisest.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-are-some-benefits-volcanic-eruptions",
          "attribution": "USGS — Benefits of volcanic eruptions",
          "note": "Pika aja jooksul võivad vulkaanilised kivimid muutuda viljakaks mullaks."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Need muutuvad alati geisriks"
          },
          {
            "id": "o2",
            "text": "Nendest võis aja jooksul kujuneda viljakas muld"
          },
          {
            "id": "o3",
            "text": "Need peavad olema veel vedelad"
          },
          {
            "id": "o4",
            "text": "Neist ei saa kunagi midagi kasvada"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q112",
      "unitId": "lo-opik-u20",
      "stem": "Milline väide arvestab korraga nii kasu kui ka ohuga?",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g053",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaanide juures võivad korraga esineda head kasutusvõimalused ja tõsised riskid.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vulkanismil on alati ainult head tagajärjed"
          },
          {
            "id": "o2",
            "text": "Vulkanismil on alati ainult halvad tagajärjed"
          },
          {
            "id": "o3",
            "text": "Vulkaaniline muld võib olla viljakas, kuid purske korral tuleb järgida hoiatusi"
          },
          {
            "id": "o4",
            "text": "Viljakas muld tõrjub laava alati tagasi"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q113",
      "unitId": "lo-opik-u20",
      "stem": "Mis on geiser?",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g057",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geiser on kuumaveeallikas, mis võib pursata vett ja veeauru.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Laavat paiskav vulkaan"
          },
          {
            "id": "o2",
            "text": "Tavaline külm jõgi"
          },
          {
            "id": "o3",
            "text": "Alati jääga kaetud kraater"
          },
          {
            "id": "o4",
            "text": "Kuumaveeallikas, mis purskab aeg-ajalt kuuma vett ja auru"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q114",
      "unitId": "lo-opik-u20",
      "stem": "Mis on kuumaveeallikas?",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g058",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuumaveeallikast tõuseb või voolab pinnale soe või kuum põhjavesi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Allikas, millest väljub looduslikult soojenenud vesi"
          },
          {
            "id": "o2",
            "text": "Vulkaani laavavool"
          },
          {
            "id": "o3",
            "text": "Tuhapilv kõrgel taevas"
          },
          {
            "id": "o4",
            "text": "Maas peituv rauakivi"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q115",
      "unitId": "lo-opik-u20",
      "stem": "Mida purskab geiser?",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g057",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geiser purskab kuuma vett ning auru, mitte laavat.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Külma allikavett ja liiva"
          },
          {
            "id": "o2",
            "text": "Kuuma vett ja veeauru"
          },
          {
            "id": "o3",
            "text": "Laavat ja kivimitükke"
          },
          {
            "id": "o4",
            "text": "Kuuma kivimitolmu ja laavat"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q116",
      "unitId": "lo-opik-u20",
      "stem": "Mis soojendab sageli kuumaveeallika vett?",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g059",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Maa sees olev kuumus soojendab vett maa-aluses süsteemis.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Lumi mäetipus"
          },
          {
            "id": "o2",
            "text": "Külm tuul"
          },
          {
            "id": "o3",
            "text": "Maa-alused kuumad kivimid"
          },
          {
            "id": "o4",
            "text": "Päikesevalgus maa sees"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q117",
      "unitId": "lo-opik-u20",
      "stem": "Millise riigi geisrit Strokkurit on õpiku fotol kujutatud?",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g060",
      "cognitiveLevel": "factual",
      "difficulty": 1,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Õpiku lk 77 näitab Strokkuri geisrit Islandil.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Eesti"
          },
          {
            "id": "o2",
            "text": "Läti"
          },
          {
            "id": "o3",
            "text": "Maroko"
          },
          {
            "id": "o4",
            "text": "Islandi"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q118",
      "unitId": "lo-opik-u20",
      "stem": "Miks ei ole geisripurse sama mis vulkaanipurse?",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g061",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geisripurse on kuuma vee nähtus, vulkaanipurse toob pinnale vulkaanilist materjali.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Geiser paiskab vett ja auru, vulkaanis võib väljuda magma laavana"
          },
          {
            "id": "o2",
            "text": "Mõlemad paiskavad tingimata laavat"
          },
          {
            "id": "o3",
            "text": "Geisris pole vett"
          },
          {
            "id": "o4",
            "text": "Vulkaani sees pole kunagi sulakivimit"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q119",
      "unitId": "lo-opik-u20",
      "stem": "Miks võib põhjavesi vulkaanilise piirkonna läheduses kuumeneda?",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g059",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuumad kivimid annavad maa-alusele veele soojust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Tuuled suruvad jääd üles"
          },
          {
            "id": "o2",
            "text": "Maa-aluste kuumade kivimite tõttu"
          },
          {
            "id": "o3",
            "text": "Ainult päikesevalgus soojendab sügavat põhjavett"
          },
          {
            "id": "o4",
            "text": "Põhjavesi muutub ilma soojuseta keevaks"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q120",
      "unitId": "lo-opik-u20",
      "stem": "Õige või vale: igast kuumaveeallikast purskab regulaarselt geiser.",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g062",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Paljud kuumaveeallikad voolavad või ringlevad ilma geisripurseteta.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        },
        {
          "kind": "supplementary",
          "url": "https://www.nps.gov/yell/learn/nature/hydrothermal-features.htm",
          "attribution": "NPS Yellowstone — Hydrothermal features",
          "note": "Geisris purskab maa seest kuum vesi ja aur, mitte magma."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Õige"
          },
          {
            "id": "o2",
            "text": "Vale"
          }
        ],
        "correctOptionId": "o2",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u20-q121",
      "unitId": "lo-opik-u20",
      "stem": "Millised väited geisrite kohta on õiged?",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g062",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geisri nähtus põhineb maa-alusel kuumal veel ja aurul.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        },
        {
          "kind": "supplementary",
          "url": "https://www.nps.gov/yell/learn/nature/hydrothermal-features.htm",
          "attribution": "NPS Yellowstone — Hydrothermal features",
          "note": "Geisris purskab maa seest kuum vesi ja aur, mitte magma."
        }
      ],
      "answer": {
        "type": "multiple_selection",
        "options": [
          {
            "id": "o1",
            "text": "Geiser paiskab sulanud kivimeid"
          },
          {
            "id": "o2",
            "text": "Iga kuumaveeallikas on geiser"
          },
          {
            "id": "o3",
            "text": "Geiser purskab kuuma vett"
          },
          {
            "id": "o4",
            "text": "Geisri purskel võib tõusta auru"
          }
        ],
        "correctOptionIds": [
          "o3",
          "o4"
        ]
      }
    },
    {
      "id": "lo-opik-u20-q122",
      "unitId": "lo-opik-u20",
      "stem": "Ühenda mõiste õige kirjeldus.",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g061",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geiser ja allikas on vee nähtused, vulkaanis võib pinnale jõuda sulakivim.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "matching",
        "prompts": [
          {
            "id": "p1",
            "text": "Geiser"
          },
          {
            "id": "p2",
            "text": "Kuumaveeallikas"
          },
          {
            "id": "p3",
            "text": "Vulkaan"
          }
        ],
        "choices": [
          {
            "id": "c1",
            "text": "Aeg-ajalt purskav kuumaveeallikas"
          },
          {
            "id": "c2",
            "text": "Allikas, millest tuleb kuum vesi"
          },
          {
            "id": "c3",
            "text": "Võib paisata laavat, tuhka ja kivimitükke"
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
      "id": "lo-opik-u20-q123",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta joonisel geisrit.",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g057",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geiser on joonisel vesi- ja aurusambaga purskav kuumaveeallikas.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-geysers",
        "correctRegionId": "geyser"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-geysers"
      }
    },
    {
      "id": "lo-opik-u20-q124",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta joonisel rahulikult väljavoolavat kuumaveeallikat.",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g058",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Kuumaveeallikast voolab kuum vesi, kuid see ei pea purskama.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-geysers",
        "correctRegionId": "spring"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-geysers"
      }
    },
    {
      "id": "lo-opik-u20-q125",
      "unitId": "lo-opik-u20",
      "stem": "Puuduta joonisel maa sees olevat vett enne selle soojenemist.",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g059",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Põhjavesi voolab maa-alustes kivimilõhedes.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "diagram_hotspot",
        "diagramId": "u20-geysers",
        "correctRegionId": "groundwater"
      },
      "context": {
        "kind": "diagram",
        "diagramId": "u20-geysers"
      }
    },
    {
      "id": "lo-opik-u20-q126",
      "unitId": "lo-opik-u20",
      "stem": "Retkel näed, kuidas maast purskab kuum vesi ja aur, kuid laavat pole. Mis nähtusega on kõige tõenäolisemalt tegu?",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g057",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Aeg-ajalt kuuma vee ja auru purskamine on geisri tunnus.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Geisriga"
          },
          {
            "id": "o2",
            "text": "Laavavooluga"
          },
          {
            "id": "o3",
            "text": "Tavalise kuumaveeallikaga, mis ei purska"
          },
          {
            "id": "o4",
            "text": "Vulkaanituhaga"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q127",
      "unitId": "lo-opik-u20",
      "stem": "Rühmita väljapaiskuv aine selle allika järgi.",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g061",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geisrist tuleb vett ja auru, vulkaan võib paisata laavat ja tuhka.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        }
      ],
      "answer": {
        "type": "grouping",
        "groups": [
          {
            "id": "g1",
            "text": "Vulkaanipurse"
          },
          {
            "id": "g2",
            "text": "Geisripurse"
          }
        ],
        "items": [
          {
            "id": "i1",
            "text": "Laava"
          },
          {
            "id": "i2",
            "text": "Kuum vesi"
          },
          {
            "id": "i3",
            "text": "Veeaur"
          },
          {
            "id": "i4",
            "text": "Vulkaaniline tuhk"
          }
        ],
        "correctGroupByItem": {
          "i1": "g1",
          "i2": "g2",
          "i3": "g2",
          "i4": "g1"
        }
      }
    },
    {
      "id": "lo-opik-u20-q128",
      "unitId": "lo-opik-u20",
      "stem": "Järjesta geisri toimimise lihtsustatud sammud.",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g059",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geiser vajab maa-alust vett, kuumust ja sobivat rõhu kogunemise süsteemi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        },
        {
          "kind": "supplementary",
          "url": "https://www.nps.gov/yell/learn/nature/hydrothermal-features.htm",
          "attribution": "NPS Yellowstone — Hydrothermal features",
          "note": "Geisris purskab maa seest kuum vesi ja aur, mitte magma."
        }
      ],
      "answer": {
        "type": "ordering",
        "items": [
          {
            "id": "s1",
            "text": "Põhjavesi liigub maa-alustesse lõhedesse."
          },
          {
            "id": "s2",
            "text": "Kuumad kivimid soojendavad vett."
          },
          {
            "id": "s3",
            "text": "Maa-alune rõhk kasvab."
          },
          {
            "id": "s4",
            "text": "Kuum vesi ja aur võivad üles pursata."
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
      "id": "lo-opik-u20-q129",
      "unitId": "lo-opik-u20",
      "stem": "Mis võib koos magma liikumisega suurendada purske jõulisust?",
      "primaryObjectiveId": "lo-opik-u20-o1",
      "variantGroupId": "lo-opik-u20-g063",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Magmas olevad gaasid võivad suurendada rõhku ja soodustada plahvatuslikku purset.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "74"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/volc/text.html",
          "attribution": "USGS — Volcanoes",
          "note": "Vulkaani ehitus, purskete kujunemine ja kivimite kuhjumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Tavaline allikavesi vulkaani otsas"
          },
          {
            "id": "o2",
            "text": "Tuule suund vulkaani kohal"
          },
          {
            "id": "o3",
            "text": "Eemal toimuv vihmasadu"
          },
          {
            "id": "o4",
            "text": "Magmas leiduvad gaasid"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q130",
      "unitId": "lo-opik-u20",
      "stem": "Õige või vale: iga maailma vulkaan peab olema ühesuguse kõrge koonuse kujuga.",
      "primaryObjectiveId": "lo-opik-u20-o2",
      "variantGroupId": "lo-opik-u20-g064",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Vulkaane on eri kujuga; õpiku läbilõige kujutab üht levinud tüüpi.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        },
        {
          "kind": "supplementary",
          "url": "https://pubs.usgs.gov/gip/volc/text.html",
          "attribution": "USGS — Volcanoes",
          "note": "Vulkaani ehitus, purskete kujunemine ja kivimite kuhjumine."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Õige"
          },
          {
            "id": "o2",
            "text": "Vale"
          }
        ],
        "correctOptionId": "o2",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u20-q131",
      "unitId": "lo-opik-u20",
      "stem": "Vulkaanist eemal asuvas linnas sadestub tuhk, kuigi laavat linnani ei jõudnud. Mis võis tuhka kanda?",
      "primaryObjectiveId": "lo-opik-u20-o3",
      "variantGroupId": "lo-opik-u20-g065",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Peen vulkaaniline tuhk võib tuulega kaugele kanduda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "75"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vulkaani lõõr maa all"
          },
          {
            "id": "o2",
            "text": "Tuul"
          },
          {
            "id": "o3",
            "text": "Magmakolle maa sees"
          },
          {
            "id": "o4",
            "text": "Jahtunud maakoore kiht"
          }
        ],
        "correctOptionId": "o2"
      }
    },
    {
      "id": "lo-opik-u20-q132",
      "unitId": "lo-opik-u20",
      "stem": "Miks leidub mõnes piirkonnas nii maavärinaid kui vulkaane?",
      "primaryObjectiveId": "lo-opik-u20-o4",
      "variantGroupId": "lo-opik-u20-g066",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Laamade liikumine mõjutab paljude maavärinate ja vulkaanide paiknemist.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Vulkaani kohal peab alati olema järv"
          },
          {
            "id": "o2",
            "text": "Mõlemad toimuvad üksnes geisri juures"
          },
          {
            "id": "o3",
            "text": "Mõlemad võivad olla seotud liikuvate laamade piiridega"
          },
          {
            "id": "o4",
            "text": "Mõlemad tekivad ainult pilvedest"
          }
        ],
        "correctOptionId": "o3"
      }
    },
    {
      "id": "lo-opik-u20-q133",
      "unitId": "lo-opik-u20",
      "stem": "Õpik näitab vana vulkaani fotot, kus pole laavat. Mis lisateavet oleks vaja otsustamaks, kas see on kustunud?",
      "primaryObjectiveId": "lo-opik-u20-o5",
      "variantGroupId": "lo-opik-u20-g067",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ainult üks vaikne hetk ei näita, kas vulkaan võib uuesti pursata.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/observatories/yvo/news/active-dormant-and-extinct-clarifying-confusing-classifications",
          "attribution": "USGS — Active, dormant, extinct",
          "note": "Tegutsev ei tähenda alati parasjagu purskavat; liigitus on teaduslikult paindlik."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Ainult selle päeva pilvede värvi"
          },
          {
            "id": "o2",
            "text": "Kohaliku jalgpalliklubi nime"
          },
          {
            "id": "o3",
            "text": "Vulkaani fotokaamera marki"
          },
          {
            "id": "o4",
            "text": "Vulkaani purskeajalugu ja praeguse tegevuse mõõtmisi"
          }
        ],
        "correctOptionId": "o4"
      }
    },
    {
      "id": "lo-opik-u20-q134",
      "unitId": "lo-opik-u20",
      "stem": "Pärast kauget purset kandub linna õhku peen vulkaaniline tuhk. Mis on mõistlik?",
      "primaryObjectiveId": "lo-opik-u20-o6",
      "variantGroupId": "lo-opik-u20-g068",
      "cognitiveLevel": "application",
      "difficulty": 3,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Ka kaugemal vulkaanist võib tuhk ohustada tervist ja nähtavust.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Järgida kohalikke ametlikke juhiseid ja vältida tarbetut kokkupuudet tuhaga"
          },
          {
            "id": "o2",
            "text": "Pidada tuhka tavaliseks ohutuks lumeks"
          },
          {
            "id": "o3",
            "text": "Minna tuhapilve alla mängima"
          },
          {
            "id": "o4",
            "text": "Ignoreerida hingamishäiretega inimesi"
          }
        ],
        "correctOptionId": "o1"
      }
    },
    {
      "id": "lo-opik-u20-q135",
      "unitId": "lo-opik-u20",
      "stem": "Õige või vale: igas vulkaanilises piirkonnas on kohe pärast purset valmis viljakas põllumuld.",
      "primaryObjectiveId": "lo-opik-u20-o7",
      "variantGroupId": "lo-opik-u20-g069",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Mulla tekkeks on vaja aega ja sobivaid tingimusi; värske kuum laava ei ole muld.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "76"
        },
        {
          "kind": "supplementary",
          "url": "https://www.usgs.gov/faqs/what-are-some-benefits-volcanic-eruptions",
          "attribution": "USGS — Benefits of volcanic eruptions",
          "note": "Pika aja jooksul võivad vulkaanilised kivimid muutuda viljakaks mullaks."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Õige"
          },
          {
            "id": "o2",
            "text": "Vale"
          }
        ],
        "correctOptionId": "o2",
        "keepOptionOrder": true
      }
    },
    {
      "id": "lo-opik-u20-q136",
      "unitId": "lo-opik-u20",
      "stem": "Miks purskab geiser sageli vaid aeg-ajalt, mitte ei voola pidevalt?",
      "primaryObjectiveId": "lo-opik-u20-o8",
      "variantGroupId": "lo-opik-u20-g070",
      "cognitiveLevel": "understanding",
      "difficulty": 2,
      "eligibility": {
        "practice": true,
        "test": true
      },
      "explanation": "Geisri kitsastes kanalites koguneb rõhk ja seejärel võib kuum vesi välja paiskuda.",
      "sources": [
        {
          "kind": "textbook",
          "pages": "77"
        },
        {
          "kind": "supplementary",
          "url": "https://www.nps.gov/yell/learn/nature/hydrothermal-features.htm",
          "attribution": "NPS Yellowstone — Hydrothermal features",
          "note": "Geisris purskab maa seest kuum vesi ja aur, mitte magma."
        }
      ],
      "answer": {
        "type": "single_choice",
        "options": [
          {
            "id": "o1",
            "text": "Sest kõik geisrid on jäätunud"
          },
          {
            "id": "o2",
            "text": "Sest seal pole üldse vett"
          },
          {
            "id": "o3",
            "text": "Maa-aluses kanalis võib vee ja auru rõhk koguneda"
          },
          {
            "id": "o4",
            "text": "Sest geiser sisaldab alati laavat"
          }
        ],
        "correctOptionId": "o3"
      }
    }
  ]
};
