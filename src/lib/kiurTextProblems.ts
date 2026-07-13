export type TextProblemTask = {
  id: string;
  question: string;
  answer: string;
  solution: string;
  acceptedAnswers?: string[];
};

export const kiurTextProblemPool: TextProblemTask[] = [
  {
    id: "tekst-001",
    question: "Ühel riiulil on 12 raamatut ja teisel riiulil 15 raamatut. Mitu raamatut on kahel riiulil kokku?",
    answer: "27 raamatut",
    solution: "12 + 15 = 27."
  },
  {
    id: "tekst-002",
    question: "Markusel oli 40 mängukaarti. Ta andis sõbrale 24 kaarti. Mitu kaarti jäi Markusele?",
    answer: "16 kaarti",
    solution: "40 - 24 = 16."
  },
  {
    id: "tekst-003",
    question: "Klassis on 9 karpi. Igas karbis on 3 pliiatsit. Mitu pliiatsit on kokku?",
    answer: "27 pliiatsit",
    solution: "9 × 3 = 27."
  },
  {
    id: "tekst-004",
    question: "Õpetaja jagas 21 õuna võrdselt 7 lapse vahel. Mitu õuna sai iga laps?",
    answer: "3 õuna",
    solution: "21 : 7 = 3."
  },
  {
    id: "tekst-005",
    question: "Põllumees müüs kartuleid 65 euro eest ja mett 38 euro eest. Kui palju raha sai ta kokku?",
    answer: "103 eurot",
    solution: "65 + 38 = 103."
  },
  {
    id: "tekst-006",
    question: "Kaupmehel oli 80 kg suhkrut. Ta müüs ära 45 kg. Mitu kilogrammi suhkrut jäi alles?",
    answer: "35 kg",
    solution: "80 - 45 = 35."
  },
  {
    id: "tekst-007",
    question: "Isal on 7 viieeurost rahatähte. Mitu eurot tal on?",
    answer: "35 eurot",
    solution: "7 × 5 = 35."
  },
  {
    id: "tekst-008",
    question: "Üks postmark maksab 10 senti. Mitu postmarki saab osta 3 euro ja 20 sendi eest?",
    answer: "32 postmarki",
    solution: "3 eurot 20 senti = 320 senti. 320 : 10 = 32."
  },
  {
    id: "tekst-009",
    question: "Mitu päeva on 5 nädalat ja 6 päeva?",
    answer: "41 päeva",
    solution: "5 nädalat = 35 päeva. 35 + 6 = 41."
  },
  {
    id: "tekst-010",
    question: "Mitu nädalat ja päeva on 45 päeva?",
    answer: "6 nädalat ja 3 päeva",
    solution: "45 : 7 = 6 nädalat ja jääb 3 päeva üle."
  },
  {
    id: "tekst-011",
    question: "Mitu millimeetrit on 5 cm ja 6 mm?",
    answer: "56 mm",
    solution: "5 cm = 50 mm. 50 + 6 = 56 mm."
  },
  {
    id: "tekst-012",
    question: "Mitu sentimeetrit ja millimeetrit on 25 mm?",
    answer: "2 cm ja 5 mm",
    solution: "25 mm = 20 mm + 5 mm = 2 cm ja 5 mm."
  },
  {
    id: "tekst-013",
    question: "Maia koduküla ühes servas on 12 talumaja. Teises servas on 7 maja rohkem. Mitu talumaja on Maia kodukülas kokku?",
    answer: "31 talumaja",
    solution: "Teises servas on 12 + 7 = 19 maja. Kokku 12 + 19 = 31."
  },
  {
    id: "tekst-014",
    question: "Kalle ostis jäätise, mis maksis 7 eurot. Kommid maksid 5 eurot rohkem kui jäätis. Mitu eurot maksid maiustused kokku?",
    answer: "19 eurot",
    solution: "Kommid maksid 7 + 5 = 12 eurot. Kokku 7 + 12 = 19."
  },
  {
    id: "tekst-015",
    question: "Kaidil oli pinalis 14 pliiatsit. Aivaril oli 8 pliiatsit vähem. Mitu pliiatsit oli Aivaril ja Kaidil kokku?",
    answer: "20 pliiatsit",
    solution: "Aivaril oli 14 - 8 = 6 pliiatsit. Kokku 14 + 6 = 20."
  },
  {
    id: "tekst-016",
    question: "Ema läheb magama kell 20 ja tõuseb kell 5. Mitu tundi ema magab?",
    answer: "9 tundi",
    solution: "Kell 20 kuni 24 on 4 tundi ja kell 0 kuni 5 on 5 tundi. 4 + 5 = 9."
  },
  {
    id: "tekst-017",
    question: "Isa läheb magama kell 22 ja tõuseb kell 6. Mitu tundi isa magab ja mitu tundi vähem on see kui emal, kes magas 9 tundi?",
    answer: "8 tundi, 1 tund vähem",
    solution: "Kell 22 kuni 24 on 2 tundi ja kell 0 kuni 6 on 6 tundi. 2 + 6 = 8. 9 - 8 = 1."
  },
  {
    id: "tekst-018",
    question: "Mall läheb magama kell 19 ja tõuseb kell 7. Mitu tundi Mall magab?",
    answer: "12 tundi",
    solution: "Kell 19 kuni 24 on 5 tundi ja kell 0 kuni 7 on 7 tundi. 5 + 7 = 12."
  },
  {
    id: "tekst-019",
    question: "Enn läheb magama 2 tundi hiljem kui Mall, kes läheb magama kell 19. Enn magab 8 tundi. Mis kell Enn magama läheb ja mis kell ta tõuseb?",
    answer: "läheb magama kell 21 ja tõuseb kell 5",
    solution: "19 + 2 = 21. Kell 21 + 8 tundi = kell 5."
  },
  {
    id: "tekst-020",
    question: "Isa tööpäev kestab kella 6-st kuni kella 17-ni. Mitu tundi isa töötab?",
    answer: "11 tundi",
    solution: "17 - 6 = 11."
  },
  {
    id: "tekst-021",
    question: "Peenral on 3 punast tulpi, 2 kollast tulpi, 4 roosat tulpi ja 5 nartsissi. Mitu tulpi on peenral kokku?",
    answer: "9 tulpi",
    solution: "Nartsissid ei ole tulbid. 3 + 2 + 4 = 9."
  },
  {
    id: "tekst-022",
    question: "Leia kaks suurimat täisarvu, mis sobivad lünka nii, et arv - 4 < 2.",
    answer: "5 ja 4",
    solution: "Arv peab olema väiksem kui 6. Kaks suurimat sobivat täisarvu on 5 ja 4."
  },
  {
    id: "tekst-023",
    question: "Raivo isa ootas autoga valgusfoori taga. Nende ees oli 3 autot ja taga 4 autot. Mitu autot ootas valgusfoori taga kokku?",
    answer: "8 autot",
    solution: "Tuleb lugeda ka Raivo isa auto. 3 + 1 + 4 = 8."
  },
  {
    id: "tekst-024",
    question: "Anu korjas rohkem seeni kui Kristel. Katrin korjas rohkem seeni kui Anu. Eve korjas nii palju seeni kui Kristel ja Katrin kokku. Kes korjas kõige rohkem seeni?",
    answer: "Eve",
    solution: "Eve kogus on Kristeli ja Katrini seente summa, seega on tal kõige rohkem."
  },
  {
    id: "tekst-025",
    question: "Tomatitaimel oli esimeses kobaras 5 tomatit. Kolmandas kobaras oli üks tomat vähem kui esimeses. Teises kobaras oli kaks tomatit rohkem kui kolmandas. Ülle noppis ära 3 tomatit. Mitu tomatit jäi taime külge?",
    answer: "12 tomatit",
    solution: "Kolmandas kobaras oli 4 tomatit. Teises oli 6 tomatit. Kokku 5 + 4 + 6 = 15. Alles jäi 15 - 3 = 12."
  },
  {
    id: "tekst-026",
    question: "Aseta arvude 9, 6, 2 ja 5 vahele tehtemärgid nii, et tulemus oleks väiksem kui 2.",
    answer: "9 - 6 + 2 - 5 = 0",
    solution: "9 - 6 + 2 - 5 = 0 ja 0 on väiksem kui 2."
  },
  {
    id: "tekst-027",
    question: "Andresel oli 8 pähklit. Ta leidis veel 7 pähklit, aga sõi vahepeal 5 pähklit ära. Mitu pähklit oli Andresel lõpuks?",
    answer: "10 pähklit",
    solution: "8 + 7 - 5 = 10."
  },
  {
    id: "tekst-028",
    question: "Järvel ujus üks part 8 pojaga ja teine part 7 pojaga. Mitu parti ujus järvel kokku?",
    answer: "17 parti",
    solution: "Esimeses peres on 1 + 8 = 9 parti. Teises peres on 1 + 7 = 8 parti. Kokku 9 + 8 = 17."
  },
  {
    id: "tekst-029",
    question: "Janal on 8 nukku. Anul on 5 nukku. Kadril ja Anul on kokku üks nukk rohkem kui Janal. Mitu nukku on Kadril?",
    answer: "4 nukku",
    solution: "Kadril ja Anul on kokku 8 + 1 = 9 nukku. Kadril on 9 - 5 = 4."
  },
  {
    id: "tekst-030",
    question: "Millised ühekohalised täisarvud sobivad lünka nii, et 8 - arv > 6?",
    answer: "0 ja 1",
    solution: "8 - 0 = 8 ja 8 - 1 = 7. Mõlemad on suuremad kui 6."
  },
  {
    id: "tekst-031",
    question: "Rivis seisis 10 poissi. Reinust eespool oli 6 poissi. Mitu poissi oli Reinust tagapool?",
    answer: "3 poissi",
    solution: "10 poisist tuleb maha arvata 6 poissi eespool ja Rein ise. 10 - 6 - 1 = 3."
  },
  {
    id: "tekst-032",
    question: "Anti on lühem kui Margus. Tiit ei ole pikem kui Anti. Kõik poisid on erineva pikkusega. Kes on kõige lühem?",
    answer: "Tiit",
    solution: "Anti on Margusest lühem. Tiit ei ole Antist pikem ja pikkused on erinevad, seega Tiit on Antist lühem."
  },
  {
    id: "tekst-033",
    question: "Ühe liilia varre küljes oli 5 õit. Kahe varre küljes oli kummalgi 4 õit. Kolme varre küljes oli igaühel 2 õit. Mitu õit oli liilial kokku?",
    answer: "19 õit",
    solution: "5 + 4 + 4 + 2 + 2 + 2 = 19."
  },
  {
    id: "tekst-034",
    question: "Kirjuta märkide asemele tehtemärgid nii, et võrdus oleks õige: 8 __ 2 = 1 __ 5.",
    answer: "8 - 2 = 1 + 5",
    solution: "8 - 2 = 6 ja 1 + 5 = 6."
  },
  {
    id: "tekst-035",
    question: "Kristel leidis 10 puravikku ja Katrin 8 puravikku. Kodus selgus, et 4 puravikku olid ussitanud ja 1 oli sapipuravik. Mitu puravikku jäi toiduks?",
    answer: "13 puravikku",
    solution: "Kokku oli 10 + 8 = 18 puravikku. Toiduks ei sobinud 4 + 1 = 5. Alles jäi 18 - 5 = 13."
  },
  {
    id: "tekst-036",
    question: "Tõnul kulus terviseraja läbimiseks 12 minutit ja Toomal 8 minutit. Poisid alustasid samal ajal. Mitme minuti pärast olid mõlemad poisid jooksu lõpetanud?",
    answer: "12 minuti pärast",
    solution: "Toomas lõpetas 8 minutiga, aga mõlemad olid lõpetanud alles siis, kui Tõnu lõpetas ehk 12 minuti pärast."
  },
  {
    id: "tekst-037",
    question: "Spordipäeval oli 8 võistkonda. Igas võistkonnas oli 9 last. Mitu last osales võistkondades kokku?",
    answer: "72 last",
    solution: "8 × 9 = 72."
  },
  {
    id: "tekst-038",
    question: "Õpetajal oli 7 karpi markereid. Igas karbis oli 6 markerit. Mitu markerit oli kokku?",
    answer: "42 markerit",
    solution: "7 × 6 = 42."
  },
  {
    id: "tekst-039",
    question: "Aia ehitamiseks pandi 5 sirgesse ritta võrdselt poste. Igas reas oli 12 posti. Mitu posti pandi kokku?",
    answer: "60 posti",
    solution: "5 × 12 = 60."
  },
  {
    id: "tekst-040",
    question: "Raamatukogus on 9 riiulit. Igal riiulil on 11 raamatut. Mitu raamatut on kokku?",
    answer: "99 raamatut",
    solution: "9 × 11 = 99."
  },
  {
    id: "tekst-041",
    question: "Lauamängus on 4 mängulauda. Igal mängulaual on 16 ruutu. Mitu ruutu on mängulaudadel kokku?",
    answer: "64 ruutu",
    solution: "4 × 16 = 64."
  },
  {
    id: "tekst-042",
    question: "Kuus last lugesid igaüks 15 minutit. Mitu minutit lugesid lapsed kokku?",
    answer: "90 minutit",
    solution: "6 × 15 = 90."
  },
  {
    id: "tekst-043",
    question: "Matkale sõitis 8 väikebussi. Igas bussis oli 12 kohta. Mitu kohta oli bussides kokku?",
    answer: "96 kohta",
    solution: "8 × 12 = 96."
  },
  {
    id: "tekst-044",
    question: "Laos oli 10 õunakotti. Igas kotis oli 8 kg õunu. Mitu kilogrammi õunu oli kokku?",
    answer: "80 kg",
    solution: "10 × 8 = 80."
  },
  {
    id: "tekst-045",
    question: "Ühes nädalas on 7 päeva. Mitu päeva on 9 nädalas?",
    answer: "63 päeva",
    solution: "9 × 7 = 63."
  },
  {
    id: "tekst-046",
    question: "Kiur sõitis rattaga 5 päeval järjest iga päev 18 km. Mitu kilomeetrit sõitis ta kokku?",
    answer: "90 km",
    solution: "5 × 18 = 90."
  },
  {
    id: "tekst-047",
    question: "Õpetajal oli 72 kleepsu. Ta jagas need võrdselt 8 lapse vahel. Mitu kleepsu sai iga laps?",
    answer: "9 kleepsu",
    solution: "72 : 8 = 9."
  },
  {
    id: "tekst-048",
    question: "Karbis oli 63 õuna. Need pandi võrdselt 7 korvi. Mitu õuna pandi igasse korvi?",
    answer: "9 õuna",
    solution: "63 : 7 = 9."
  },
  {
    id: "tekst-049",
    question: "96 cm pikkune pael lõigati 12 võrdseks tükiks. Kui pikk oli üks tükk?",
    answer: "8 cm",
    solution: "96 : 12 = 8."
  },
  {
    id: "tekst-050",
    question: "84 kg kartuleid pandi võrdselt 6 kotti. Mitu kilogrammi kartuleid pandi igasse kotti?",
    answer: "14 kg",
    solution: "84 : 6 = 14."
  },
  {
    id: "tekst-051",
    question: "Raamatus on 100 lehekülge. Kiur loeb iga päev sama palju ja lõpetab raamatu 10 päevaga. Mitu lehekülge loeb ta päevas?",
    answer: "10 lehekülge",
    solution: "100 : 10 = 10."
  },
  {
    id: "tekst-052",
    question: "81 kommi jagati võrdselt 9 lapse vahel. Mitu kommi sai iga laps?",
    answer: "9 kommi",
    solution: "81 : 9 = 9."
  },
  {
    id: "tekst-053",
    question: "Seitse ülesannet võtsid kokku 56 minutit. Iga ülesanne võttis sama kaua. Mitu minutit kulus ühele ülesandele?",
    answer: "8 minutit",
    solution: "56 : 7 = 8."
  },
  {
    id: "tekst-054",
    question: "48 m pikkune nöör lõigati 6 võrdseks osaks. Kui pikk oli üks osa?",
    answer: "8 m",
    solution: "48 : 6 = 8."
  },
  {
    id: "tekst-055",
    question: "90 mängukaarti pandi võrdselt 9 karpi. Mitu kaarti pandi igasse karpi?",
    answer: "10 kaarti",
    solution: "90 : 9 = 10."
  },
  {
    id: "tekst-056",
    question: "64 ruutu jagati võrdselt 8 ritta. Mitu ruutu oli igas reas?",
    answer: "8 ruutu",
    solution: "64 : 8 = 8."
  },
  {
    id: "tekst-057",
    question: "Raamatukogus oli 2450 raamatut. Sügisel toodi juurde 3200 raamatut. Mitu raamatut on nüüd raamatukogus?",
    answer: "5650 raamatut",
    solution: "2450 + 3200 = 5650."
  },
  {
    id: "tekst-058",
    question: "Matkarada on 7600 m pikk. Pere kõndis sellest 2850 m. Mitu meetrit jäi veel kõndida?",
    answer: "4750 m",
    solution: "7600 - 2850 = 4750."
  },
  {
    id: "tekst-059",
    question: "Laos oli 9180 kg vilja. Sellest müüdi 3470 kg. Mitu kilogrammi vilja jäi lattu?",
    answer: "5710 kg",
    solution: "9180 - 3470 = 5710."
  },
  {
    id: "tekst-060",
    question: "Ühes alevikus elab 4380 inimest. Teises alevikus elab 1275 inimest rohkem. Mitu inimest elab teises alevikus?",
    answer: "5655 inimest",
    solution: "4380 + 1275 = 5655."
  },
  {
    id: "tekst-061",
    question: "Staasionil on 10 000 istekohta. Võistluse ajal oli hõivatud 6425 kohta. Mitu kohta jäi vabaks?",
    answer: "3575 kohta",
    solution: "10 000 - 6425 = 3575."
  },
  {
    id: "tekst-062",
    question: "Kool kogus vanapaberit 2380 kg. Eesmärk oli koguda 5000 kg. Mitu kilogrammi on veel eesmärgist puudu?",
    answer: "2620 kg",
    solution: "5000 - 2380 = 2620."
  },
  {
    id: "tekst-063",
    question: "Kahe küla vahelise tee üks lõik on 3700 m ja teine lõik 4600 m. Kui pikk on tee kokku?",
    answer: "8300 m",
    solution: "3700 + 4600 = 8300."
  },
  {
    id: "tekst-064",
    question: "Õpilased jooksid aastas kokku 8500 ringi. Esimesel poolaastal jooksid nad 2750 ringi. Mitu ringi jooksid nad teisel poolaastal?",
    answer: "5750 ringi",
    solution: "8500 - 2750 = 5750."
  },
  {
    id: "tekst-065",
    question: "Kaardil on kolm vahemaad: 129 km, 56 km ja 93 km. Kui pikk on kogu teekond?",
    answer: "278 km",
    solution: "129 + 56 + 93 = 278."
  },
  {
    id: "tekst-066",
    question: "Klassil oli ekskursiooniks 10 000 eurot. Buss maksis 2850 eurot ja majutus 3190 eurot. Kui palju raha jäi alles?",
    answer: "3960 eurot",
    solution: "2850 + 3190 = 6040. 10 000 - 6040 = 3960."
  },
  {
    id: "tekst-067",
    question: "Muuseumis käis hommikul 1240 inimest, pärastlõunal 1875 inimest ja õhtul 960 inimest. Mitu inimest käis muuseumis kokku?",
    answer: "4075 inimest",
    solution: "1240 + 1875 + 960 = 4075."
  },
  {
    id: "tekst-068",
    question: "Talunikul oli 7200 kg kartuleid. Ta jättis endale 1800 kg ja müüs ülejäänud ära. Mitu kilogrammi kartuleid müüs ta?",
    answer: "5400 kg",
    solution: "7200 - 1800 = 5400."
  },
  {
    id: "tekst-069",
    question: "Üks jooksurada on 3850 m pikk ja teine 4200 m pikk. Mitme meetri võrra on teine rada pikem?",
    answer: "350 m",
    solution: "4200 - 3850 = 350."
  },
  {
    id: "tekst-070",
    question: "Rongisõit oli 9820 m pikk. Bussisõit oli sellest 1640 m lühem. Kui pikk oli bussisõit?",
    answer: "8180 m",
    solution: "9820 - 1640 = 8180."
  },
  {
    id: "tekst-071",
    question: "Ruudu külg on 8 cm. Kui pikk on ruudu ümbermõõt?",
    answer: "32 cm",
    solution: "Ruudul on 4 võrdset külge. 4 × 8 = 32."
  },
  {
    id: "tekst-072",
    question: "Ristküliku pikkus on 12 cm ja laius 5 cm. Kui pikk on ristküliku ümbermõõt?",
    answer: "34 cm",
    solution: "12 + 5 + 12 + 5 = 34."
  },
  {
    id: "tekst-073",
    question: "Ruudukujulisel mängulaual on 7 rida ja igas reas 7 ruutu. Mitu ruutu on mängulaual?",
    answer: "49 ruutu",
    solution: "7 × 7 = 49."
  },
  {
    id: "tekst-074",
    question: "Ristkülikukujulisel põrandal on 6 rida plaate ja igas reas 9 plaati. Mitu plaati on põrandal kokku?",
    answer: "54 plaati",
    solution: "6 × 9 = 54."
  },
  {
    id: "tekst-075",
    question: "Ristküliku ümbermõõt on 30 cm. Üks külg on 8 cm. Kui pikk on teine külg?",
    answer: "7 cm",
    solution: "Ristküliku kaks 8 cm külge annavad 16 cm. 30 - 16 = 14. Teised kaks küljed on võrdsed, seega 14 : 2 = 7."
  },
  {
    id: "tekst-076",
    question: "Ruudu ümbermõõt on 36 cm. Kui pikk on ruudu üks külg?",
    answer: "9 cm",
    solution: "36 : 4 = 9."
  },
  {
    id: "tekst-077",
    question: "Ristkülikukujuline aed on 14 m pikk ja 6 m lai. Kui palju aeda on vaja kogu aia ümber?",
    answer: "40 m",
    solution: "14 + 6 + 14 + 6 = 40."
  },
  {
    id: "tekst-078",
    question: "Ristküliku ümbermõõt on 50 m. Pikem külg on 15 m. Kui pikk on lühem külg?",
    answer: "10 m",
    solution: "Kaks pikemat külge on 15 + 15 = 30 m. 50 - 30 = 20 m. Kaks lühemat külge on võrdsed, seega 20 : 2 = 10."
  },
  {
    id: "tekst-079",
    question: "Ruudukujulise vaiba külg on 2 m. Kui palju paela on vaja ühe vaiba ääre ümber?",
    answer: "8 m",
    solution: "Ruudul on 4 võrdset külge. 4 × 2 = 8."
  },
  {
    id: "tekst-080",
    question: "Ruudukujulise tahvli külg on 9 dm. Kui pikk on tahvli ümbermõõt?",
    answer: "36 dm",
    solution: "4 × 9 = 36."
  },
  {
    id: "tekst-081",
    question: "Ristkülikukujuline rada on 18 m pikk ja 12 m lai. Kiur kõnnib selle ümber 3 korda. Mitu meetrit ta kõnnib?",
    answer: "180 m",
    solution: "Üks ring on 18 + 12 + 18 + 12 = 60 m. Kolm ringi on 3 × 60 = 180 m."
  },
  {
    id: "tekst-082",
    question: "Ruudukujuline liivakast on 3 m pikk ja 3 m lai. Mitu 1 m küljega ruutu mahub selle põhja?",
    answer: "9 ruutu",
    solution: "3 × 3 = 9."
  },
  {
    id: "tekst-083",
    question: "Ristkülikukujulisel ruudustikul on 8 rida ja 6 veergu. Mitu väikest ruutu on ruudustikus kokku?",
    answer: "48 ruutu",
    solution: "8 × 6 = 48."
  },
  {
    id: "tekst-084",
    question: "Ristküliku pikem külg on 10 cm ja lühem külg 4 cm. Kui pikk on ümbermõõt?",
    answer: "28 cm",
    solution: "10 + 4 + 10 + 4 = 28."
  },
  {
    id: "tekst-085",
    question: "Kolmele ringile märgiti igale ringile 8 punkti. Mitu punkti märgiti kokku?",
    answer: "24 punkti",
    solution: "3 × 8 = 24."
  },
  {
    id: "tekst-086",
    question: "Ühel lehel on 9 ümmargust kleepsu. Mitu kleepsu on 6 sellisel lehel?",
    answer: "54 kleepsu",
    solution: "6 × 9 = 54."
  },
  {
    id: "tekst-087",
    question: "Joonisel on 12 ringi. Neist 5 värviti siniseks. Mitu ringi jäi värvimata?",
    answer: "7 ringi",
    solution: "12 - 5 = 7."
  },
  {
    id: "tekst-088",
    question: "Ringjoonele pandi 4 märki nii, et iga kahe naabermärgi vahe on 3 cm. Kui pikk on kogu ringjoon?",
    answer: "12 cm",
    solution: "Ringjoon jaguneb 4 võrdseks vaheks. 4 × 3 = 12."
  },
  {
    id: "tekst-089",
    question: "Ühe ümmarguse laua ümber mahub 8 tooli. Mitu tooli mahub 3 sellise laua ümber?",
    answer: "24 tooli",
    solution: "3 × 8 = 24."
  },
  {
    id: "tekst-090",
    question: "Mustris on 5 rida ringe ja igas reas on 10 ringi. Mitu ringi on mustris kokku?",
    answer: "50 ringi",
    solution: "5 × 10 = 50."
  },
  {
    id: "tekst-091",
    question: "Mänguväljakul pandi 32 koonust võrdselt 4 ringi ümber. Mitu koonust pandi ühe ringi ümber?",
    answer: "8 koonust",
    solution: "32 : 4 = 8."
  },
  {
    id: "tekst-092",
    question: "Laual on 7 ruutu ja 6 ringi. Ringidel nurki ei ole, ruudul on 4 nurka. Mitu nurka on kujunditel kokku?",
    answer: "28 nurka",
    solution: "Ainult ruutudel on nurgad. 7 × 4 = 28."
  },
  {
    id: "tekst-093",
    question: "Ringjoonele märgiti 12 punast punkti ja 18 sinist punkti. Mitu punkti märgiti kokku?",
    answer: "30 punkti",
    solution: "12 + 18 = 30."
  },
  {
    id: "tekst-094",
    question: "Õpetaja joonistas 9 suurt ringi. Iga suure ringi sisse joonistas ta 4 väikest ringi. Mitu väikest ringi ta joonistas?",
    answer: "36 väikest ringi",
    solution: "9 × 4 = 36."
  },
  {
    id: "tekst-095",
    question: "Üks nöör on 3 m 40 cm pikk ja teine 2 m 60 cm pikk. Kui pikad on nöörid kokku?",
    answer: "6 m",
    solution: "3 m + 2 m = 5 m ja 40 cm + 60 cm = 100 cm = 1 m. Kokku 6 m."
  },
  {
    id: "tekst-096",
    question: "Kiur kõndis hommikul 750 m ja õhtul 1250 m. Mitu kilomeetrit ta kokku kõndis?",
    answer: "2 km",
    solution: "750 + 1250 = 2000 m = 2 km."
  },
  {
    id: "tekst-097",
    question: "Matkarada on 5 km 300 m pikk. Pere kõndis 1 km 800 m. Kui palju jäi veel kõndida?",
    answer: "3 km 500 m",
    solution: "5 km 300 m = 5300 m. 1 km 800 m = 1800 m. 5300 - 1800 = 3500 m = 3 km 500 m."
  },
  {
    id: "tekst-098",
    question: "9 m pikkusest nöörist lõigati ära 250 cm. Kui palju nööri jäi alles?",
    answer: "6 m 50 cm",
    solution: "9 m = 900 cm. 900 - 250 = 650 cm = 6 m 50 cm."
  },
  {
    id: "tekst-099",
    question: "Pliiats on 18 cm pikk ja pinal on 25 cm pikk. Mitme sentimeetri võrra on pinal pikem?",
    answer: "7 cm",
    solution: "25 - 18 = 7."
  },
  {
    id: "tekst-100",
    question: "Koolist raamatukoguni on 850 m ja raamatukogust koju 1200 m. Kui pikk on tee koolist koju raamatukogu kaudu?",
    answer: "2050 m",
    solution: "850 + 1200 = 2050."
  },
  {
    id: "tekst-101",
    question: "Kumb on pikem: 2 km 400 m või 2400 m?",
    answer: "need on võrdsed",
    solution: "2 km 400 m = 2400 m."
  },
  {
    id: "tekst-102",
    question: "Joon on 6 cm 8 mm pikk. Seda pikendati 7 mm võrra. Kui pikk on joon nüüd?",
    answer: "7 cm 5 mm",
    solution: "6 cm 8 mm = 68 mm. 68 + 7 = 75 mm = 7 cm 5 mm."
  },
  {
    id: "tekst-103",
    question: "Üks laud on 125 cm pikk ja teine 95 cm pikk. Kui pikad on lauad kokku?",
    answer: "220 cm",
    solution: "125 + 95 = 220."
  },
  {
    id: "tekst-104",
    question: "10 km pikkusest rajast kõnniti läbi 3750 m. Mitu meetrit jäi veel kõndida?",
    answer: "6250 m",
    solution: "10 km = 10 000 m. 10 000 - 3750 = 6250."
  },
  {
    id: "tekst-105",
    question: "Rattatee on 4 km pikk. Jooksurada on sellest 1600 m lühem. Kui pikk on jooksurada?",
    answer: "2400 m",
    solution: "4 km = 4000 m. 4000 - 1600 = 2400."
  },
  {
    id: "tekst-106",
    question: "12 dm pikkune pael lõigati 6 võrdseks osaks. Kui pikk oli üks osa sentimeetrites?",
    answer: "20 cm",
    solution: "12 dm = 120 cm. 120 : 6 = 20."
  },
  {
    id: "tekst-107",
    question: "Keldris on 5 kotti kartuleid. Igas kotis on 8 kg kartuleid. Mitu kilogrammi kartuleid on kokku?",
    answer: "40 kg",
    solution: "5 × 8 = 40."
  },
  {
    id: "tekst-108",
    question: "Köögis oli 25 kg jahu. Küpsetamiseks kasutati 9 kg ja pärast osteti juurde 12 kg. Mitu kilogrammi jahu on nüüd?",
    answer: "28 kg",
    solution: "25 - 9 + 12 = 28."
  },
  {
    id: "tekst-109",
    question: "Kass kaalub 4 kg. Koer kaalub 5 korda rohkem. Kui palju koer kaalub?",
    answer: "20 kg",
    solution: "4 × 5 = 20."
  },
  {
    id: "tekst-110",
    question: "Õunakast kaalub 18 kg ja pirnikast 14 kg. Kui palju kaaluvad kastid kokku?",
    answer: "32 kg",
    solution: "18 + 14 = 32."
  },
  {
    id: "tekst-111",
    question: "72 kg porgandeid pandi võrdselt 9 kasti. Mitu kilogrammi porgandeid pandi igasse kasti?",
    answer: "8 kg",
    solution: "72 : 9 = 8."
  },
  {
    id: "tekst-112",
    question: "Üks arbuus kaalub 3 kg. Mitu kilogrammi kaaluvad 7 arbuusi?",
    answer: "21 kg",
    solution: "7 × 3 = 21."
  },
  {
    id: "tekst-113",
    question: "Seljakotti võib panna kuni 15 kg asju. Raamatud kaaluvad 8 kg ja riided 6 kg. Mitu kilogrammi võib veel kotti panna?",
    answer: "1 kg",
    solution: "8 + 6 = 14. 15 - 14 = 1."
  },
  {
    id: "tekst-114",
    question: "Laos oli 100 kg riisi. Riis pakiti 10 kg kottidesse. Mitu kotti saadi?",
    answer: "10 kotti",
    solution: "100 : 10 = 10."
  },
  {
    id: "tekst-115",
    question: "Rong väljub kell 14:20. Sõit kestab 45 minutit. Mis kell rong kohale jõuab?",
    answer: "15:05",
    acceptedAnswers: ["15.05"],
    solution: "14:20 + 40 minutit = 15:00 ja veel 5 minutit = 15:05."
  },
  {
    id: "tekst-116",
    question: "Esimene tund algab kell 9:00 ja kestab 45 minutit. Siis on 10-minutiline vahetund ja pärast seda teine 45-minutiline tund. Mis kell teine tund lõpeb?",
    answer: "10:40",
    acceptedAnswers: ["10.40"],
    solution: "45 + 10 + 45 = 100 minutit. Kell 9:00 + 100 minutit = 10:40."
  },
  {
    id: "tekst-117",
    question: "Mitu kuud on 3 aastat ja 4 kuud?",
    answer: "40 kuud",
    solution: "3 aastat = 36 kuud. 36 + 4 = 40."
  },
  {
    id: "tekst-118",
    question: "Ühes nädalas on 7 päeva. Mitu päeva on 4 nädalas?",
    answer: "28 päeva",
    solution: "4 × 7 = 28."
  },
  {
    id: "tekst-119",
    question: "Suvevaheaeg kestab 12 nädalat. Mitu päeva see on?",
    answer: "84 päeva",
    solution: "12 × 7 = 84."
  },
  {
    id: "tekst-120",
    question: "Kell on 16:35. Treening algab 2 tunni ja 25 minuti pärast. Mis kell treening algab?",
    answer: "19:00",
    acceptedAnswers: ["19.00"],
    solution: "16:35 + 2 tundi = 18:35. 18:35 + 25 minutit = 19:00."
  }
];
