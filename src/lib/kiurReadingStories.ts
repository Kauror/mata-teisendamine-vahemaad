import type { KiurReadingQuestionType, KiurReadingTask } from '@/lib/kiurReadingTasks';

// Original texts for "Loe ja vasta", written for a 10–11-year-old (review
// 2026-11-20: the bank held only adult newspaper bird columns by one author).
// Each text has two or three questions: a detail, an inference («Miks…»,
// «Mida see näitab…») and/or a word read in context. Every question becomes
// one task; its id is `lugu-<story>-<a|b|c>` and never changes once shipped
// (the score verifier finds a task by id and checks its question and key).

export type KiurReadingTheme = 'jutud' | 'loodus' | 'Eesti' | 'igapäevaelu' | 'teadus';

type StoryQuestion = {
  question: string;
  options: [string, string, string, string];
  answer: string;
  evidence: string;
  type: KiurReadingQuestionType;
};

export type KiurReadingStory = {
  id: string;
  title: string;
  theme: KiurReadingTheme;
  text: string;
  questions: StoryQuestion[];
};

export const KIUR_READING_STORIES: KiurReadingStory[] = [
  {
    id: '01-kadunud-voti',
    title: 'Kadunud võti',
    theme: 'jutud',
    text: 'Mari jõudis koolist koju ja pistis käe taskusse. Võtit polnud. Ta otsis seljakotist, mütsist ja isegi saapast, aga võti oli kadunud. Väljas hakkas juba hämarduma ning lumi krudises jalge all. Mari mõtles hoolega, kus ta viimati käinud oli. Pärast tunde oli ta sõpradega mänguväljakul lumememme ehitanud ja kindad korraks lumehange visanud. Ta jooksis tagasi. Lumememm seisis seal, porgandist nina viltu. Mari kaevas kätega hanges ja tundis äkki midagi külma ja kõva. See oli tema võti, mis oli koos kinnastega taskust välja libisenud. Kodus pani ta võtme kohe nööri otsa ja sidus nööri koti külge.',
    questions: [
      { question: 'Kust Mari võtme lõpuks leidis?', options: ['mänguväljaku lumehangest', 'seljakoti põhjast', 'oma saapa seest', 'kooli riidehoiu nagi alt'], answer: 'mänguväljaku lumehangest', evidence: 'Mari kaevas kätega hanges', type: 'koht' },
      { question: 'Miks sidus Mari võtme koti külge?', options: ['et võti ei kaoks enam ära', 'et võtit oleks ilus vaadata', 'sest ema käskis nii teha', 'sest nöör oli üle jäänud'], answer: 'et võti ei kaoks enam ära', evidence: 'pani ta võtme kohe nööri otsa ja sidus nööri koti külge', type: 'jareldus' },
      { question: 'Mida tähendab tekstis sõna «hämarduma»?', options: ['minema pimedamaks', 'hakkama sadama', 'muutuma külmemaks', 'jääma vaikseks'], answer: 'minema pimedamaks', evidence: 'Väljas hakkas juba hämarduma', type: 'sona' }
    ]
  },
  {
    id: '02-voistlus',
    title: 'Jooksuvõistlus',
    theme: 'jutud',
    text: 'Kooli spordipäeval jooksid neljanda klassi poisid ümber staadioni. Kiur oli terve kuu harjutanud ja tahtis väga esimeseks tulla. Viimasel ringil oli ta teine, kohe Karli selja taga. Äkki komistas Karl ja kukkus muruservale. Ta haaras põlvest kinni ja ta nägu tõmbus valust krimpsu. Kiur oleks võinud mööda joosta ja võita. Selle asemel peatus ta, aitas Karli püsti ja talutas ta finišini. Teised jooksjad läksid neist mõlemast mööda. Õpetaja ütles pärast, et medalit Kiur seekord ei saanud, aga tema tegu meenub klassile kauem kui ükskõik milline võit. Karl tõi järgmisel päeval Kiurile tänutäheks kommi.',
    questions: [
      { question: 'Mitmendal kohal oli Kiur viimasel ringil enne Karli kukkumist?', options: ['teisel kohal', 'esimesel kohal', 'kolmandal kohal', 'viimasel kohal'], answer: 'teisel kohal', evidence: 'Viimasel ringil oli ta teine', type: 'detail' },
      { question: 'Mida näitab Kiuri tegu tema kohta?', options: ['et sõber on talle tähtsam kui võit', 'et ta ei viitsinud enam joosta', 'et ta kartis Karlist mööda minna', 'et ta tahtis, et õpetaja teda kiidaks'], answer: 'et sõber on talle tähtsam kui võit', evidence: 'Selle asemel peatus ta, aitas Karli püsti', type: 'jareldus' },
      { question: 'Mida tähendab tekstis «nägu tõmbus krimpsu»?', options: ['nägu muutus valust kortsu', 'nägu läks rõõmust punaseks', 'nägu jäi täiesti rahulikuks', 'nägu kattus mudaga'], answer: 'nägu muutus valust kortsu', evidence: 'ta nägu tõmbus valust krimpsu', type: 'sona' }
    ]
  },
  {
    id: '03-uus-naaber',
    title: 'Uus naaber',
    theme: 'jutud',
    text: 'Suvel kolis kõrvalmajja uus pere. Nende tütar Lena oli Mia-vanune, aga ta ei rääkinud peaaegu üldse eesti keelt, sest pere oli tulnud Ukrainast. Esimestel päevadel istus Lena üksi trepil ja vaatas, kuidas teised lapsed palli mängisid. Mia ei teadnud, mida öelda. Siis võttis ta kaks reketit ja sulgpalli ning ulatas ühe reketi Lenale. Mängimiseks polnud palju sõnu vaja. Kui pall lendas puu otsa, naersid nad mõlemad. Mõne nädala pärast oskas Lena juba öelda «Minu kord!» ja «Veel üks mäng!». Mia aga õppis vastu ukraina keeles sõna «дякую», mis tähendab «aitäh».',
    questions: [
      { question: 'Mida ulatas Mia Lenale?', options: ['sulgpalli reketi', 'jalgpalli', 'eesti keele õpiku', 'hüppenööri'], answer: 'sulgpalli reketi', evidence: 'ulatas ühe reketi Lenale', type: 'tegevus' },
      { question: 'Miks istus Lena alguses üksi trepil?', options: ['ta ei osanud veel teiste lastega rääkida', 'ta oli haige ja ei tohtinud joosta', 'talle ei meeldinud üldse mängida', 'ta ootas, et ema ta varsti poodi viiks'], answer: 'ta ei osanud veel teiste lastega rääkida', evidence: 'ta ei rääkinud peaaegu üldse eesti keelt', type: 'jareldus' },
      { question: 'Mida õppis Mia Lenalt?', options: ['ühe ukraina sõna', 'uue sulgpalli löögi', 'ühe ukraina laulu', 'puu otsa ronimise'], answer: 'ühe ukraina sõna', evidence: 'Mia aga õppis vastu ukraina keeles sõna', type: 'detail' }
    ]
  },
  {
    id: '04-koer-muki',
    title: 'Muki ja post',
    theme: 'jutud',
    text: 'Muki oli väike pruun koer, kes haukus iga kord, kui postiljon värava juurde tuli. Ta jooksis aia äärde, ajas kõrvad püsti ja klähvis nii valjult, kui suutis. Postiljon ainult naeratas ja pani ajalehe postkasti. Ühel hommikul aga Muki ei haukunud. Ta lamas kuudi ees ja vaatas väravat vaikselt. Peremees Jaan muutus murelikuks ja viis koera loomaarsti juurde. Selgus, et Mukil oli hammas valus. Pärast ravi oli Muki jälle endine: järgmisel päeval haukus ta postiljoni peale veel kõvemini kui varem. Jaan raputas pead, aga naeris samal ajal.',
    questions: [
      { question: 'Miks muutus Jaan murelikuks?', options: ['sest Muki ei haukunud nagu tavaliselt', 'sest postiljon ei toonud sel hommikul ajalehte', 'sest Muki jooksis aiast välja', 'sest kuudi katus oli katki'], answer: 'sest Muki ei haukunud nagu tavaliselt', evidence: 'Ühel hommikul aga Muki ei haukunud', type: 'jareldus' },
      { question: 'Mis Mukil viga oli?', options: ['tal oli hammas valus', 'tal oli käpp katki', 'tal oli kõht tühi', 'ta oli pikast jooksust väga väsinud'], answer: 'tal oli hammas valus', evidence: 'Mukil oli hammas valus', type: 'detail' },
      { question: 'Mida tähendab tekstis «oli jälle endine»?', options: ['käitus nii nagu varem', 'oli vanaks jäänud', 'oli muutunud vanemaks ja aeglasemaks', 'jäi päevaks magama'], answer: 'käitus nii nagu varem', evidence: 'Pärast ravi oli Muki jälle endine', type: 'sona' }
    ]
  },
  {
    id: '05-paat',
    title: 'Paat järvel',
    theme: 'jutud',
    text: 'Vanaisa lubas Sandril esimest korda ise sõudma hakata. Järv oli hommikul peegelsile ja udu hõljus kõrkjate kohal. Sander haaras aerudest, kuid paat hakkas hoopis ringiratast keerlema. Vanaisa ei naernud. Ta näitas, et mõlemat aeru tuleb tõmmata ühe korraga ja ühesuguse jõuga. Pärast mõnda proovimist liikus paat juba otse saare poole. Saare juures nägid nad kalakotkast, kes sukeldus vette ja tõusis õhku, kala küünte vahel. Tagasiteel olid Sandri peopesad punased, aga ta ei kurtnud. Kodus ütles ta emale uhkusega, et sõudis peaaegu kogu tee ise.',
    questions: [
      { question: 'Miks hakkas paat alguses ringiratast keerlema?', options: ['Sander tõmbas aere ebaühtlaselt', 'järvel puhus väga tugev tuul', 'paadi põhjas oli suur auk', 'vanaisa keeras paati nalja pärast ise'], answer: 'Sander tõmbas aere ebaühtlaselt', evidence: 'mõlemat aeru tuleb tõmmata ühe korraga ja ühesuguse jõuga', type: 'jareldus' },
      { question: 'Mida nägid nad saare juures?', options: ['kalakotkast, kes püüdis kala', 'luike koos poegadega', 'kopra pesa kõrkjate vahel kalda ääres', 'teist paati kaluritega'], answer: 'kalakotkast, kes püüdis kala', evidence: 'nägid nad kalakotkast, kes sukeldus vette', type: 'detail' },
      { question: 'Mida tähendab tekstis «peegelsile»?', options: ['täiesti siledaveeline', 'väga külm ja jäine', 'täis väikseid laineid', 'sinine nagu taevas'], answer: 'täiesti siledaveeline', evidence: 'Järv oli hommikul peegelsile', type: 'sona' }
    ]
  },
  {
    id: '06-kooliteater',
    title: 'Kooliteater',
    theme: 'jutud',
    text: 'Klass valmistas jõuluks ette näidendit ja Robin sai hundi rolli. Ta õppis kõik oma laused pähe, aga laval ununes äkki esimene lause. Saalis oli vaikus ja kõik vaatasid teda. Robini süda tagus. Siis meenus talle õpetaja nõuanne: kui sõnad kaovad, ütle oma sõnadega, mida tegelane tahab. Robin urises ja ütles: «Mul on nii kõht tühi, et sööksin kas või kingakarbi!» Saal hakkas naerma ja teised näitlejad jätkasid, nagu oleks kõik nii mõeldud. Pärast etendust kiitis õpetaja, et Robin ei andnud alla. Robini meelest oli see tema elu kõige põnevam õhtu.',
    questions: [
      { question: 'Millise rolli sai Robin?', options: ['hundi', 'jõuluvana', 'jänese', 'karu'], answer: 'hundi', evidence: 'Robin sai hundi rolli', type: 'tegelane' },
      { question: 'Mida tegi Robin, kui lause ununes?', options: ['ütles tegelase mõtte oma sõnadega', 'jooksis lavalt kiiresti minema', 'palus õpetajal lause talle sosinal ette öelda', 'jäi lõpuni vait ja ootas'], answer: 'ütles tegelase mõtte oma sõnadega', evidence: 'ütle oma sõnadega, mida tegelane tahab', type: 'tegevus' },
      { question: 'Mida näitab lause «Robini süda tagus»?', options: ['et Robin oli väga ärevil', 'et Robin oli haigeks jäänud', 'et Robin oli väga vihane', 'et Robinil oli igav'], answer: 'et Robin oli väga ärevil', evidence: 'Robini süda tagus', type: 'jareldus' }
    ]
  },
  {
    id: '07-talvine-matk',
    title: 'Talvine matk',
    theme: 'jutud',
    text: 'Isa ja Laura läksid suusamatkale Kõrvemaale. Rada viis läbi männimetsa ja üle külmunud raba. Mõne aja pärast märkas Laura lumel jälgi: kaks väikest ja kaks pikka jälge kõrvuti. Isa selgitas, et need on jänese jäljed. Jänes hüppab nii, et tagumised pikad käpad maanduvad esimestest ettepoole. Natuke edasi olid jäljed, mis meenutasid väikese koera omi, kuid kulgesid sirge reana. Need olid rebase jäljed. Lõunaks tegid nad lõkkeplatsil lõkke ja jõid termosest kuuma teed. Kui päike hakkas loojuma, keerasid nad tagasi, sest talvel läheb pimedaks juba nelja paiku.',
    questions: [
      { question: 'Kelle jäljed kulgesid sirge reana?', options: ['rebase', 'jänese', 'põdra', 'orava'], answer: 'rebase', evidence: 'Need olid rebase jäljed', type: 'detail' },
      { question: 'Miks keerasid nad juba pärastlõunal tagasi?', options: ['talvel läheb vara pimedaks', 'tee termoses sai otsa', 'Laura suusk läks katki', 'rajal oli liiga palju lund'], answer: 'talvel läheb vara pimedaks', evidence: 'talvel läheb pimedaks juba nelja paiku', type: 'jareldus' }
    ]
  },
  {
    id: '08-vanaema-aed',
    title: 'Vanaema peenar',
    theme: 'jutud',
    text: 'Kevadel andis vanaema Oskarile oma väikese peenra. Oskar külvas sinna redist, porgandit ja herneid. Ta tahtis, et kõik kasvaks kohe, ja kastis peenart iga päev kaks korda. Mõne aja pärast hakkasid redise lehed kolletama. Vanaema kaevas ühe taime välja ja näitas: juured olid märjad ja pehmed. «Taim vajab vett, aga ka õhku,» ütles ta. Oskar hakkas kastma ainult siis, kui muld oli pealt kuiv. Juuni alguses sõi ta oma esimese redise. See oli terav ja krõmpsuv. Oskar arvas, et poest ostetud redis pole kunagi nii hästi maitsenud.',
    questions: [
      { question: 'Miks hakkasid redise lehed kolletama?', options: ['Oskar kastis peenart liiga palju', 'peenrale ei paistnud üldse päike', 'linnud nokkisid taimi öösiti', 'vanaema unustas peenart rohida'], answer: 'Oskar kastis peenart liiga palju', evidence: 'juured olid märjad ja pehmed', type: 'jareldus' },
      { question: 'Millal hakkas Oskar pärast vanaema nõuannet kastma?', options: ['kui muld oli pealt kuiv', 'iga päev kaks korda', 'ainult vihmasel päeval', 'üks kord nädalas pühapäeva õhtul'], answer: 'kui muld oli pealt kuiv', evidence: 'ainult siis, kui muld oli pealt kuiv', type: 'detail' }
    ]
  },
  {
    id: '09-siil',
    title: 'Siil aias',
    theme: 'loodus',
    text: 'Siil on öine loom. Päeval magab ta lehehunnikus või põõsa all ja alles hämaruses läheb toitu otsima. Ta sööb usse, tigusid, mardikaid ja muid väikseid loomi, keda ta leiab hea haistmise abil. Seepärast on siil aias kasulik külaline. Sügisel sööb siil end paksuks, sest talve veedab ta talveunes. Siis aeglustub tema süda ja keha jahtub peaaegu sama külmaks kui ümbrus. Kui aias on kuhi lehti ja oksi, võib siil sinna talvepesa teha. Siilile ei tohi anda piima, sest see teeb tal kõhu haigeks. Janusele siilile sobib madal kauss puhast vett.',
    questions: [
      { question: 'Miks sööb siil sügisel end paksuks?', options: ['ta peab talveunes oma varudest elama', 'talvel on aias rohkem toitu', 'paks siil jookseb kiiremini', 'nii on tal lihtsam uusi okkaid kasvatada'], answer: 'ta peab talveunes oma varudest elama', evidence: 'talve veedab ta talveunes', type: 'jareldus' },
      { question: 'Mida sobib siilile juua anda?', options: ['puhast vett', 'sooja piima', 'magusat mahla', 'lahjat teed'], answer: 'puhast vett', evidence: 'sobib madal kauss puhast vett', type: 'detail' },
      { question: 'Mida tähendab tekstis «öine loom»?', options: ['loom, kes on ärkvel öösel', 'loom, kes kardab pimedust', 'loom, kes magab terve talve', 'loom, kes elab ainult metsas'], answer: 'loom, kes on ärkvel öösel', evidence: 'alles hämaruses läheb toitu otsima', type: 'sona' }
    ]
  },
  {
    id: '10-sipelgad',
    title: 'Sipelgate linn',
    theme: 'loodus',
    text: 'Kuusemetsas võib näha kõrget okastest ja okstest kuhja. See on kuklaste pesa ehk sipelgapesa. Ühes suures pesas võib elada sadu tuhandeid sipelgaid. Igal sipelgal on oma töö: ühed toovad toitu, teised hoolitsevad munade ja vastsete eest, kolmandad parandavad pesa. Pesa pealmine kiht on nagu katus, mis hoiab vihma ja külma eemal. Sügavamal pesas on soojem ja seal talvituvad sipelgad. Kuklased hävitavad palju metsakahjureid, sellepärast nimetatakse neid metsa sanitarideks. Pesa ei tohi kepiga lõhkuda, sest sipelgatel kulub selle parandamiseks palju jõudu.',
    questions: [
      { question: 'Miks nimetatakse kuklaseid metsa sanitarideks?', options: ['nad hävitavad metsakahjureid', 'nad koristavad metsast prügi', 'nad ravivad haigeid puid', 'nad toovad metsa uusi seemneid'], answer: 'nad hävitavad metsakahjureid', evidence: 'Kuklased hävitavad palju metsakahjureid', type: 'jareldus' },
      { question: 'Mida teeb pesa pealmine kiht?', options: ['hoiab vihma ja külma eemal', 'näitab teed teistele loomadele', 'kogub sipelgatele toitu', 'peidab pesa lindude eest'], answer: 'hoiab vihma ja külma eemal', evidence: 'hoiab vihma ja külma eemal', type: 'detail' }
    ]
  },
  {
    id: '11-raba',
    title: 'Rabas',
    theme: 'loodus',
    text: 'Raba on märg ja lage paik, kus kasvab peamiselt turbasammal. Sammal kasvab ülevalt edasi, aga alt sureb ja muutub aeglaselt turbaks. Ühe meetri turbakihi tekkimiseks kulub umbes tuhat aastat. Rabas kasvavad ka jõhvikad, mustikad ja kidurad männid. Männid on väikesed, sest märjas ja vaeses pinnases ei saa nad korralikult kasvada. Eestis on rabasid palju ja paljudesse on ehitatud laudteed. Laudteel tuleb püsida, sest raba pind võib olla petlik: ühel hetkel on see kindel, järgmisel võib jalg sügavale vajuda. Raba hoiab vett nagu suur käsn ja aitab nii vältida üleujutusi.',
    questions: [
      { question: 'Miks on rabamännid väikesed?', options: ['pinnas on märg ja toitainevaene', 'neid süüakse loomade poolt', 'need on istutatud alles hiljuti', 'raba kohal puhub alati tugev tuul'], answer: 'pinnas on märg ja toitainevaene', evidence: 'märjas ja vaeses pinnases ei saa nad korralikult kasvada', type: 'jareldus' },
      { question: 'Kui kaua kulub ühe meetri turbakihi tekkimiseks?', options: ['umbes tuhat aastat', 'umbes sada aastat', 'umbes kümme aastat', 'umbes üks suvi'], answer: 'umbes tuhat aastat', evidence: 'kulub umbes tuhat aastat', type: 'detail' },
      { question: 'Mida tähendab tekstis «petlik»?', options: ['see võib tunduda teistsugune, kui on', 'see on väga ilus, värviline ja lõhnav', 'see on alati kuiv ja kõva', 'see on kaetud jääga'], answer: 'see võib tunduda teistsugune, kui on', evidence: 'raba pind võib olla petlik', type: 'sona' }
    ]
  },
  {
    id: '12-mesilased',
    title: 'Mesilase tants',
    theme: 'loodus',
    text: 'Kui mesilane leiab palju õisi, lendab ta tarru tagasi ja hakkab tantsima. See ei ole lõbu pärast. Tantsuga räägib ta teistele mesilastele, kus toit asub. Kui õied on taru lähedal, tiirleb mesilane ringiratast. Kui õied on kaugel, teeb ta kaheksakujulist tantsu ja väristab tagakeha. Mida kauem ta väristab, seda kaugemal on õied. Tantsu suund näitab, mis suunas päikese suhtes tuleb lennata. Teised mesilased tunnevad tantsijalt ka õite lõhna. Nii jõuab kogu pere kiiresti parima toidu juurde. Selle avastas teadlane, kes vaatles mesilasi aastaid klaasseinaga tarus.',
    questions: [
      { question: 'Mida näitab mesilase pikk väristamine?', options: ['et õied on kaugel', 'et õied on väga lähedal', 'et tarru tuleb vaenlane', 'et mesi on valmis'], answer: 'et õied on kaugel', evidence: 'Mida kauem ta väristab, seda kaugemal on õied', type: 'jareldus' },
      { question: 'Kuidas sai teadlane mesilaste tantsu uurida?', options: ['vaatles neid klaasseinaga tarus', 'kuulas neid mikrofoniga öösel', 'luges sellest vanast raamatust', 'pani mesilastele väikesed sildid'], answer: 'vaatles neid klaasseinaga tarus', evidence: 'vaatles mesilasi aastaid klaasseinaga tarus', type: 'detail' }
    ]
  },
  {
    id: '13-lehed',
    title: 'Miks lehed langevad',
    theme: 'loodus',
    text: 'Sügisel muutuvad kaskede ja vahtrate lehed kollaseks ja punaseks ning langevad maha. Lehtede rohelise värvi annab aine, mida nimetatakse klorofülliks. Selle abil teeb puu päikesevalgusest endale toitu. Sügisel jääb valgust vähemaks ja puu laseb klorofüllil laguneda. Siis tulevad nähtavale kollased värvid, mis olid lehes kogu aeg peidus. Talvel oleks lehtedest puule kahju: neist aurab vett, aga külmunud maast ei saa puu vett juurde võtta. Lisaks koguneks lehtedele raske lumi ja oksad murduksid. Seepärast heidab lehtpuu lehed enne talve maha. Kuusel ja männil on okkad, mis on kaetud vahakihiga ja kaotavad vähe vett.',
    questions: [
      { question: 'Kust tulevad sügisel lehtede kollased värvid?', options: ['need olid lehes kogu aeg peidus', 'need tekivad öökülmast', 'need tulevad sügisel puu juurtest lehtedesse', 'need annab lehele vihm'], answer: 'need olid lehes kogu aeg peidus', evidence: 'mis olid lehes kogu aeg peidus', type: 'detail' },
      { question: 'Miks võivad kuusk ja mänd talvel okkad alles jätta?', options: ['okkad kaotavad vahakihi tõttu vähe vett', 'okastel ei püsi kunagi lumi', 'kuusk ja mänd ei vaja talvel üldse vett', 'okkad on talvel juba surnud'], answer: 'okkad kaotavad vahakihi tõttu vähe vett', evidence: 'kaetud vahakihiga ja kaotavad vähe vett', type: 'jareldus' },
      { question: 'Mida tähendab tekstis «heidab maha»?', options: ['laseb maha kukkuda', 'peidab maa alla', 'võtab endale tagasi', 'värvib ümber'], answer: 'laseb maha kukkuda', evidence: 'heidab lehtpuu lehed enne talve maha', type: 'sona' }
    ]
  },
  {
    id: '14-kobras',
    title: 'Kobras ehitab',
    theme: 'loodus',
    text: 'Kobras on Eesti suurim näriline. Tema esihambad on oranžid ja kasvavad kogu elu, sest puude närimisel need kuluvad. Kobras langetab jõe kaldal puid ja ehitab okstest, mudast ja kividest tammi. Tamm paisutab vee üles ja tekib tiik. Tiigi keskele ehitab kobras pesa ehk kopraonni, mille sissepääs on vee all. Nii ei pääse rebane ega hunt pessa. Kopratiigid on head paigad kaladele, konnadele ja lindudele. Inimestele teeb kobras vahel ka meelehärmi: tamm võib ujutada üle metsatee või põllu. Seepärast tuleb mõnikord tamm lammutada ja kobras elama asuda mujale.',
    questions: [
      { question: 'Miks on kopraonni sissepääs vee all?', options: ['et kiskjad ei pääseks pessa', 'et vesi ei voolaks onni sisse', 'et kobras saaks rohkem kala püüda', 'et onn oleks talvel soojem'], answer: 'et kiskjad ei pääseks pessa', evidence: 'Nii ei pääse rebane ega hunt pessa', type: 'jareldus' },
      { question: 'Mis värvi on kopra esihambad?', options: ['oranžid', 'valged', 'mustad', 'kollakashallid'], answer: 'oranžid', evidence: 'Tema esihambad on oranžid', type: 'omadus' },
      { question: 'Mida tähendab tekstis «meelehärm»?', options: ['pahandus ja tüli', 'suur rõõm', 'raske töö', 'hirm ja suur ehmatus'], answer: 'pahandus ja tüli', evidence: 'teeb kobras vahel ka meelehärmi', type: 'sona' }
    ]
  },
  {
    id: '15-seened',
    title: 'Seenel',
    theme: 'loodus',
    text: 'Seen, mida me metsas näeme, on ainult väike osa tervest seenest. Suurem osa elab maa all peenikeste niitidena, mida nimetatakse seeneniidistikuks. See võib laiuda mitme meetri ulatuses ja olla väga vana. Seeneniidistik aitab puudel vett ja toitaineid kätte saada, puu annab seenele vastu suhkrut. Nii elavad kask ja kasepuravik koos ning mõlemad saavad kasu. Seenel käies tuleb seen noaga ettevaatlikult maha lõigata või välja keerata, et niidistik jääks terveks. Võõrast seent ei tohi kunagi süüa, sest mõned seened on mürgised. Kahtluse korral tuleb küsida täiskasvanult, kes seeni hästi tunneb.',
    questions: [
      { question: 'Mida annab puu seenele?', options: ['suhkrut', 'vett', 'valgust', 'mulda'], answer: 'suhkrut', evidence: 'puu annab seenele vastu suhkrut', type: 'detail' },
      { question: 'Miks tuleb seen maha lõigata või välja keerata?', options: ['et maa-alune niidistik jääks terveks', 'et seen jääks korvis ilusam', 'et mürgist seent ära tunda', 'et järgmine seen kasvaks kiiremini suureks'], answer: 'et maa-alune niidistik jääks terveks', evidence: 'et niidistik jääks terveks', type: 'jareldus' }
    ]
  },
  {
    id: '16-laanemeri',
    title: 'Läänemeri',
    theme: 'loodus',
    text: 'Läänemeri on meie kodumeri. Selle vesi on palju vähem soolane kui ookeanis, sest merre voolab palju jõgesid ja ookeaniga ühendab seda vaid kitsas väin. Vähese soola tõttu elavad Läänemeres koos nii mereloomad, näiteks räim ja hüljes, kui ka mageveekalad, näiteks haug ja ahven. Läänemeri on madal: keskmiselt umbes viiekümne meetri sügavune. Talvel külmub osa merest, eriti Soome laht ja Liivi laht. Läänemere suurim mure on reostus. Põldudelt merre jõudev väetis paneb vetikad vohama. Kui vetikad surevad ja lagunevad, kaob vees hapnik ning kalad ei saa seal elada.',
    questions: [
      { question: 'Miks on Läänemere vesi vähem soolane kui ookeanis?', options: ['merre voolab palju jõgesid', 'meri on väga sügav ja külm', 'merre sajab vähe vihma', 'merel on palju saari'], answer: 'merre voolab palju jõgesid', evidence: 'merre voolab palju jõgesid', type: 'jareldus' },
      { question: 'Mis juhtub, kui vetikad surevad ja lagunevad?', options: ['vees kaob hapnik', 'meri muutub soolasemaks', 'vesi muutub selgemaks', 'meri külmub kiiremini'], answer: 'vees kaob hapnik', evidence: 'kaob vees hapnik', type: 'detail' },
      { question: 'Mida tähendab tekstis «vohama»?', options: ['väga kiiresti ja palju kasvama', 'aeglaselt ja vaikselt ära surema', 'värvi muutma', 'põhja vajuma'], answer: 'väga kiiresti ja palju kasvama', evidence: 'paneb vetikad vohama', type: 'sona' }
    ]
  },
  {
    id: '17-vanalinn',
    title: 'Tallinna vanalinn',
    theme: 'Eesti',
    text: 'Tallinna vanalinn on üks paremini säilinud keskaegseid linnu Põhja-Euroopas. Linna ümbritses kunagi kõrge kivimüür, millel oli üle neljakümne torni. Müür kaitses linnaelanikke vaenlaste eest ja öösiti suleti väravad. Paljud tornid on alles tänini ja neil on vahvad nimed, näiteks Paks Margareeta ja Kiek in de Kök. Viimane nimi tähendab vanas saksa keeles «piiluja kööki», sest tornist nägi otse linnakodanike köökidesse. Raekoja platsil on üle viiesaja aasta peetud turgu. Raekoja tornis seisab Vana Toomas, linnavalvuri kujuga tuulelipp, kellest on saanud Tallinna sümbol.',
    questions: [
      { question: 'Miks sai torn nimeks «piiluja kööki»?', options: ['sealt nägi linnaelanike köökidesse', 'tornis oli suur linnaköök', 'tornis küpsetati linnale leiba', 'torn seisis linna köögiviljaturu kõrval'], answer: 'sealt nägi linnaelanike köökidesse', evidence: 'tornist nägi otse linnakodanike köökidesse', type: 'jareldus' },
      { question: 'Kes on Vana Toomas?', options: ['linnavalvuri kujuga tuulelipp', 'raekoja esimene peremees', 'vanalinna kõige vanem torn', 'kuulus keskaegne kaupmees ja laevaomanik'], answer: 'linnavalvuri kujuga tuulelipp', evidence: 'linnavalvuri kujuga tuulelipp', type: 'tegelane' }
    ]
  },
  {
    id: '18-kaali',
    title: 'Kaali kraater',
    theme: 'Eesti',
    text: 'Saaremaal Kaali külas on ümmargune järv, mille ümber kõrguvad järsud vallid. See ei ole tavaline järv. Mitu tuhat aastat tagasi kukkus siia taevast suur raudmeteoriit. Atmosfääris purunes see tükkideks ja tükid lõid maapinda kraatreid. Suurimas kraatris on praegu järv, mille läbimõõt on umbes sada meetrit. Ümberringi leidub veel kaheksa väiksemat kraatrit. Plahvatus oli nii võimas, et põletas läheduses metsa. Teadlased on leidnud kraatrite ümbrusest väikesi metallitükke ja põlenud puidu jälgi. Muistsed inimesed pidasid paika pühaks ja võib-olla sündisid just selle sündmuse mälestusest mõned vanad muinasjutud.',
    questions: [
      { question: 'Mis tekitas Kaali kraatrid?', options: ['taevast kukkunud raudmeteoriit', 'vana vulkaani purse', 'inimeste kaevatud kaevandus', 'jääaja suured ja rasked liustikud'], answer: 'taevast kukkunud raudmeteoriit', evidence: 'kukkus siia taevast suur raudmeteoriit', type: 'detail' },
      { question: 'Mida näitavad põlenud puidu jäljed?', options: ['et plahvatus põletas metsa', 'et inimesed tegid seal lõket', 'et järve ääres oli kunagi küla', 'et piksenool lõi puusse'], answer: 'et plahvatus põletas metsa', evidence: 'põletas läheduses metsa', type: 'jareldus' },
      { question: 'Mida tähendab tekstis «läbimõõt»?', options: ['ringi laius ühest servast teiseni', 'vee sügavus järve keskel', 'kauguse mõõtmise tööriist', 'jalgsi teekond ümber terve järve'], answer: 'ringi laius ühest servast teiseni', evidence: 'mille läbimõõt on umbes sada meetrit', type: 'sona' }
    ]
  },
  {
    id: '19-laulupidu',
    title: 'Laulupidu',
    theme: 'Eesti',
    text: 'Esimene Eesti üldlaulupidu peeti Tartus 1869. aastal. Siis tuli kokku umbes tuhat lauljat ja pillimängijat. Tänapäeval peetakse laulupidu Tallinnas lauluväljakul ja laval võib korraga seista üle kahekümne tuhande laulja. Paljud lapsed laulavad koolikooris terve aasta, et peol osaleda. Peo eel liigub läbi Eesti tulerong: laulupeotuld kantakse käest kätte ja sellega süüdatakse lauluväljaku tornis tuli. Laulupidu on eestlastele väga tähtis. Kui Eesti ei olnud vaba, laulsid inimesed peol ühiselt isamaalisi laule ja tundsid, et nad on üks rahvas. Laulupeotraditsioon on kantud UNESCO vaimse kultuuripärandi nimekirja.',
    questions: [
      { question: 'Kus peeti esimene üldlaulupidu?', options: ['Tartus', 'Tallinnas', 'Pärnus', 'Viljandis'], answer: 'Tartus', evidence: 'peeti Tartus 1869. aastal', type: 'koht' },
      { question: 'Miks oli laulupidu tähtis ajal, kui Eesti ei olnud vaba?', options: ['ühine laul andis tunde, et ollakse üks rahvas', 'peol said kõik lauljad palju raha', 'laulupeol valiti riigile uus juht', 'peo ajal ei pidanud keegi tööl ega koolis käima'], answer: 'ühine laul andis tunde, et ollakse üks rahvas', evidence: 'tundsid, et nad on üks rahvas', type: 'jareldus' }
    ]
  },
  {
    id: '20-peipsi',
    title: 'Peipsi järv',
    theme: 'Eesti',
    text: 'Peipsi on Eesti suurim järv. See on nii suur, et vastaskallast ei paista ja tormi ajal tõusevad sellel kõrged lained nagu meres. Järve keskelt jookseb Eesti ja Venemaa piir. Peipsi on kalarikas: seal püütakse koha, latikat, haugi ja rääbist. Järve läänekaldal elavad vanausulised. Nende esivanemad põgenesid siia ligi kolmsada aastat tagasi Venemaalt, kuna neid taheti sundida usku muutma. Nende külades kasvatatakse suurtel peenardel sibulat ja müüakse seda teeäärsetel lettidel. Talvel külmub Peipsi kinni ja kalurid lähevad jääle talipüügile. Jääle minnes tuleb aga olla väga ettevaatlik.',
    questions: [
      { question: 'Miks tulid vanausulised Peipsi äärde?', options: ['neid taheti sundida usku muutma', 'Peipsis oli rohkem kala kui mujal', 'nad tahtsid sibulat kasvatada', 'Venemaal oli liiga külm'], answer: 'neid taheti sundida usku muutma', evidence: 'neid taheti sundida usku muutma', type: 'jareldus' },
      { question: 'Mida kasvatatakse vanausuliste külades suurtel peenardel?', options: ['sibulat', 'kartulit', 'kapsast', 'maasikaid'], answer: 'sibulat', evidence: 'kasvatatakse suurtel peenardel sibulat', type: 'detail' },
      { question: 'Mida tähendab tekstis «vastaskallas»?', options: ['järve teine kallas', 'kõrge järsk kallas', 'kallas, kus on sadam', 'liivane rannariba'], answer: 'järve teine kallas', evidence: 'vastaskallast ei paista', type: 'sona' }
    ]
  },
  {
    id: '21-lipp',
    title: 'Sinimustvalge',
    theme: 'Eesti',
    text: 'Eesti lipp on sinimustvalge. Esialgu oli see Eesti Üliõpilaste Seltsi lipp, mis õnnistati 1884. aastal Otepääl. Hiljem sai sellest kogu rahva lipp. Värvidele on antud mitu tähendust. Sinine meenutab taevast, järvi ja merd, must Eesti mulda ja rasket minevikku ning valge lootust ja kasetohtu. Nõukogude ajal oli sinimustvalge lipp keelatud ja seda hoiti salaja peidus. Mõni pere peitis lipu põranda alla või pööningule. Kui Eesti sai uuesti vabaks, heisati lipp 24. veebruaril 1989 Pika Hermanni torni. Lipupäeva tähistame 4. juunil, mil sinimustvalge lehvib paljude kodude ees.',
    questions: [
      { question: 'Kus õnnistati sinimustvalge lipp 1884. aastal?', options: ['Otepääl', 'Tallinnas', 'Tartus', 'Pärnus'], answer: 'Otepääl', evidence: 'õnnistati 1884. aastal Otepääl', type: 'koht' },
      { question: 'Miks peitsid pered lippu põranda alla või pööningule?', options: ['lipp oli tol ajal keelatud', 'lipp oli liiga suur kapis hoida', 'lipp kardeti ära määrida', 'lipp oli liiga vana kasutada'], answer: 'lipp oli tol ajal keelatud', evidence: 'Nõukogude ajal oli sinimustvalge lipp keelatud', type: 'jareldus' }
    ]
  },
  {
    id: '22-jaanipaev',
    title: 'Jaanipäev',
    theme: 'Eesti',
    text: 'Jaanipäev on aasta kõige valgemate ööde aeg. Jaaniõhtul, 23. juunil, süüdatakse kogu Eestis lõkked. Vanasti usuti, et lõke kaitseb kurjade jõudude eest ja toob head õnne. Inimesed hüppasid üle lõkke, laulsid ja tantsisid kiigel. Noored otsisid metsast sõnajalaõit, mis pidavat õitsema ainult jaaniööl. Tegelikult sõnajalg ei õitsegi, sest ta paljuneb eostega, aga lugu on sellegipoolest põnev. Mõnes kandis punuti lilledest pärgi ja pandi padja alla üheksa eri lille, et unes näha oma tulevast kaasat. Tänapäeval tähistatakse jaanipäeva tihti suvilas sõprade ja perega.',
    questions: [
      { question: 'Miks ei saa sõnajalaõit leida?', options: ['sõnajalg ei õitsegi', 'see õitseb ainult talvel', 'see kasvab ainult soos', 'õis on väga väike'], answer: 'sõnajalg ei õitsegi', evidence: 'Tegelikult sõnajalg ei õitsegi', type: 'jareldus' },
      { question: 'Mida usuti vanasti jaanilõkke kohta?', options: ['et see kaitseb kurja eest', 'et see toob vihma', 'et see peletab sääski', 'et see aitab põllul vilja kasvatada'], answer: 'et see kaitseb kurja eest', evidence: 'lõke kaitseb kurjade jõudude eest', type: 'detail' },
      { question: 'Mida tähendab tekstis «kaasa»?', options: ['abikaasa, elukaaslane', 'kaasas olev kott', 'pidulik riietus', 'hea sõber koolist või trennist'], answer: 'abikaasa, elukaaslane', evidence: 'et unes näha oma tulevast kaasat', type: 'sona' }
    ]
  },
  {
    id: '23-lahemaa',
    title: 'Lahemaa',
    theme: 'Eesti',
    text: 'Lahemaa on Eesti vanim rahvuspark. See loodi 1971. aastal, et kaitsta Põhja-Eesti loodust ja vana külaelu. Rahvuspargis on poolsaared, lahed, rabad ja metsad. Rannas ja metsades lebab hiigelsuuri kive, mida nimetatakse rändrahnudeks. Need kandis siia mandrijää jääajal. Mõni rahn on suurem kui maja. Lahemaa külades on säilinud vanu kalurimaju ja mõisaid, näiteks Palmse ja Sagadi mõis. Rahvuspargis tuleb liikuda märgitud radadel ja jätta loodus selliseks, nagu see oli. Seal elab karusid, ilveseid ja põtru, aga matkajad näevad neid harva, sest loomad on arad.',
    questions: [
      { question: 'Kes tõi rändrahnud Lahemaale?', options: ['mandrijää jääajal', 'vanad kalurid paatidega', 'meri tormi ajal', 'mõisnikud ehitamiseks'], answer: 'mandrijää jääajal', evidence: 'Need kandis siia mandrijää jääajal', type: 'detail' },
      { question: 'Miks näevad matkajad karusid ja ilveseid harva?', options: ['loomad on arad ja hoiavad eemale', 'neid elab rahvuspargis ainult talvel', 'need on viidud loomaaeda', 'matkajad käivad seal ainult öösel'], answer: 'loomad on arad ja hoiavad eemale', evidence: 'loomad on arad', type: 'jareldus' }
    ]
  },
  {
    id: '24-tartu-emajogi',
    title: 'Emajõe linn',
    theme: 'Eesti',
    text: 'Tartu on Eesti suuruselt teine linn ja seda kutsutakse vaimupealinnaks. Seal asub 1632. aastal asutatud Tartu Ülikool, mis on Eesti vanim ülikool. Läbi linna voolab Emajõgi. Vanasti sõitsid jõel lodjad, suured purjedega puulaevad, mis vedasid kaupa Peipsi ja Tartu vahel. Tänapäeval on üks lodi uuesti ehitatud ja suviti saab sellega sõita. Toomemäel on vana katedraali varemed ja Inglisild. Tudengid usuvad, et kui sillal hinge kinni hoida ja soov mõelda, läheb see täide. Tartus on ka AHHAA teaduskeskus, kus saab katsetada, kuidas maailm töötab.',
    questions: [
      { question: 'Mis olid lodjad?', options: ['suured purjedega puulaevad', 'kiired mootorpaadid', 'jõe ääres olevad suured kaubalaod', 'kaubaga vankrid'], answer: 'suured purjedega puulaevad', evidence: 'suured purjedega puulaevad', type: 'detail' },
      { question: 'Miks sõitsid lodjad vanasti Peipsi ja Tartu vahel?', options: ['et vedada kaupa', 'et püüda jõest kala', 'et viia tudengeid kooli', 'et võistelda kiiruses'], answer: 'et vedada kaupa', evidence: 'mis vedasid kaupa Peipsi ja Tartu vahel', type: 'jareldus' },
      { question: 'Mida tähendab tekstis «vaimupealinn»?', options: ['linn, mis on kuulus hariduse ja teaduse poolest', 'linn, kus elab kõige rohkem inimesi', 'linn, kus kummitavad vaimud', 'linn, kus asub riigi valitsus ja parlament'], answer: 'linn, mis on kuulus hariduse ja teaduse poolest', evidence: 'seda kutsutakse vaimupealinnaks', type: 'sona' }
    ]
  },
  {
    id: '25-taskuraha',
    title: 'Taskuraha',
    theme: 'igapäevaelu',
    text: 'Lisette saab iga nädal viis eurot taskuraha. Varem kulus see kohe kommidele ja kleepsudele. Siis nägi ta poes lauamängu, mis maksis kolmkümmend eurot. Ema soovitas tal teha plaani. Lisette jagas oma raha kaheks: kaks eurot võis ta kohe kulutada, kolm eurot pani ta purki. Ta joonistas purgile mängu pildi, et eesmärki mitte unustada. Mõnel nädalal oli raske, kui sõbrad poes limonaadi ostsid. Kümne nädala pärast lugesid nad emaga purgis raha üle. Seal oli kolmkümmend eurot. Lisette ostis mängu ja tundis, et see on palju toredam, kui oleks olnud kingitusena saadud mäng.',
    questions: [
      { question: 'Kui palju raha pani Lisette iga nädal purki?', options: ['kolm eurot', 'kaks eurot', 'viis eurot', 'kümme eurot'], answer: 'kolm eurot', evidence: 'kolm eurot pani ta purki', type: 'detail' },
      { question: 'Miks joonistas Lisette purgile mängu pildi?', options: ['et eesmärk meelde jääks', 'et purk oleks ilusam', 'et õde purki ei puutuks', 'sest ema palus seda teha'], answer: 'et eesmärk meelde jääks', evidence: 'et eesmärki mitte unustada', type: 'jareldus' },
      { question: 'Miks tundus mäng Lisettele eriti tore?', options: ['ta oli selle jaoks ise raha kogunud', 'see oli poe kõige kallim mäng', 'sõbrad olid seda mängu talle palju kiitnud', 'mängu karbis oli üllatus'], answer: 'ta oli selle jaoks ise raha kogunud', evidence: 'palju toredam, kui oleks olnud kingitusena saadud mäng', type: 'jareldus' }
    ]
  },
  {
    id: '26-bussisoit',
    title: 'Üksi bussiga',
    theme: 'igapäevaelu',
    text: 'Tänavu sügisel hakkas Kiur esimest korda üksi bussiga trenni sõitma. Enne esimest sõitu harjutasid nad isaga teekonda kaks korda koos. Isa näitas, kuidas lugeda sõiduplaani ja mis peatuses tuleb väljuda. Kiur pani telefoni äratuse helisema kaks peatust enne õiget peatust, et mitte mööda sõita. Bussis tuleb sõidukaart kohe validaatorisse panna ja istekoht vanemale inimesele loovutada, kui buss on täis. Ühel päeval jäi buss hiljaks. Kiur ei hakanud paanitsema, vaid saatis isale sõnumi ja ootas peatuses. Treener ütles, et parem hiljem kohale jõuda kui end ohtu seada.',
    questions: [
      { question: 'Miks pani Kiur telefoni äratuse helisema kaks peatust varem?', options: ['et ta ei sõidaks oma peatusest mööda', 'et isa teaks, et ta on juba bussis istunud', 'et buss jõuaks kiiremini kohale', 'et ta jõuaks enne trenni süüa'], answer: 'et ta ei sõidaks oma peatusest mööda', evidence: 'et mitte mööda sõita', type: 'jareldus' },
      { question: 'Mida tegi Kiur, kui buss hiljaks jäi?', options: ['saatis isale sõnumi ja ootas', 'kõndis jala treeningusse', 'läks tagasi koju', 'helistas treenerile ja nuttis'], answer: 'saatis isale sõnumi ja ootas', evidence: 'saatis isale sõnumi ja ootas peatuses', type: 'tegevus' },
      { question: 'Mida tähendab tekstis «loovutada»?', options: ['teisele ära andma', 'kinni hoidma', 'puhtaks tegema', 'endale ette tellima'], answer: 'teisele ära andma', evidence: 'istekoht vanemale inimesele loovutada', type: 'sona' }
    ]
  },
  {
    id: '27-pannkoogid',
    title: 'Pühapäeva pannkoogid',
    theme: 'igapäevaelu',
    text: 'Pühapäeva hommikul otsustas Hugo üllatada vanemaid pannkookidega. Ta leidis kokaraamatust retsepti: kaks muna, pool liitrit piima, kaks klaasi jahu, näpuotsaga soola ja lusikatäis suhkrut. Hugo vahustas munad, lisas piima ja segas sisse jahu. Tainas tuli aga tükiline. Vanaema oli kunagi õpetanud, et jahu tuleb lisada vähehaaval ja kogu aeg segada. Hugo kurnas taina läbi sõela ja tükid jäid sõelale. Esimene pannkook läks pannil katki, nagu ikka. Teine oli juba kuldpruun ja ümmargune. Kui vanemad ärkasid, oli laual kõrge pannkoogivirn ja moosipurk. Köögi koristasid nad pärast kõik koos.',
    questions: [
      { question: 'Miks tuli tainas tükiline?', options: ['jahu pandi korraga ja liiga kiiresti', 'piim oli liiga külm', 'munad olid vanad', 'tainas seisis enne küpsetamist liiga kaua'], answer: 'jahu pandi korraga ja liiga kiiresti', evidence: 'jahu tuleb lisada vähehaaval ja kogu aeg segada', type: 'jareldus' },
      { question: 'Kuidas sai Hugo tükkidest lahti?', options: ['kurnas taina läbi sõela', 'lisas veel piima', 'viskas taina ära', 'küpsetas tükid pannkookide sisse'], answer: 'kurnas taina läbi sõela', evidence: 'Hugo kurnas taina läbi sõela', type: 'tegevus' },
      { question: 'Mida tähendab tekstis «vähehaaval»?', options: ['väikeste kogustena järjest', 'kõik korraga', 'väga kiiresti', 'ainult natuke korraga ja kiiresti'], answer: 'väikeste kogustena järjest', evidence: 'jahu tuleb lisada vähehaaval', type: 'sona' }
    ]
  },
  {
    id: '28-raamatukogu',
    title: 'Raamatukogus',
    theme: 'igapäevaelu',
    text: 'Mia ei armastanud lugemist, sest raamatud tundusid talle igavad. Ühel päeval viis klassijuhataja klassi raamatukokku. Raamatukoguhoidja küsis Mialt, mis talle meeldib. «Hobused ja saladused,» vastas Mia. Raamatukoguhoidja ulatas talle raamatu tüdrukust, kes leidis talli pööningult vana kaardi. Mia luges esimese peatüki raamatukogus ära ja laenutas raamatu koju. Ta luges seda õhtul teki all taskulambi valgel, kuni silmad kinni vajusid. Kahe päeva pärast oli raamat läbi ja Mia tuli järgmist küsima. Raamatukoguhoidja naeratas ja ütles, et sellel sarjal on veel viis osa.',
    questions: [
      { question: 'Miks hakkas Mia lugemist nautima?', options: ['ta sai raamatu teemal, mis talle meeldis', 'õpetaja käskis tal iga päev palju lugeda', 'raamatus oli palju pilte', 'raamat oli väga lühike'], answer: 'ta sai raamatu teemal, mis talle meeldis', evidence: 'Hobused ja saladused', type: 'jareldus' },
      { question: 'Mida leidis raamatu peategelane talli pööningult?', options: ['vana kaardi', 'kasti kullaga', 'kadunud varsa', 'salajase ukse'], answer: 'vana kaardi', evidence: 'leidis talli pööningult vana kaardi', type: 'detail' },
      { question: 'Mida tähendab tekstis «laenutas»?', options: ['võttis ajutiselt kasutada', 'ostis endale päriseks', 'kinkis selle kellelegi teisele', 'kirjutas ümber'], answer: 'võttis ajutiselt kasutada', evidence: 'laenutas raamatu koju', type: 'sona' }
    ]
  },
  {
    id: '29-jalgratas',
    title: 'Katkine kumm',
    theme: 'igapäevaelu',
    text: 'Teel kooli tundis Oliver, et jalgratas hakkas loksuma. Esimene ratas oli tühjaks läinud. Õhtul võttis ta koos vanaisaga ratta lahti. Nad pumpasid sisekummi täis ja panid veega täidetud kaussi. Ühest kohast hakkasid tõusma väikesed mullid. Seal oligi auk, mille oli teinud terav klaasikild. Vanaisa näitas, kuidas kohta liivapaberiga karestada, liimi määrida ja paik peale suruda. Enne kummi tagasipanemist katsus Oliver hoolikalt rehvi seest üle, et klaasikild sinna ei jääks. Järgmisel hommikul sõitis ta kooli juba parandatud rattaga ja tundis end päris meistrina.',
    questions: [
      { question: 'Kuidas leidsid nad kummist augu?', options: ['vee all tõusid august mullid', 'nad kuulsid susinat', 'auk oli kohe näha', 'vanaisa katsus kummi kätega üle'], answer: 'vee all tõusid august mullid', evidence: 'Ühest kohast hakkasid tõusma väikesed mullid', type: 'tegevus' },
      { question: 'Miks katsus Oliver rehvi seest üle?', options: ['et klaasikild ei teeks uut auku', 'et rehv oleks puhtam', 'et liim kiiremini kuivaks', 'et leida rattast kadunud väikest mutrit'], answer: 'et klaasikild ei teeks uut auku', evidence: 'et klaasikild sinna ei jääks', type: 'jareldus' }
    ]
  },
  {
    id: '30-sorteerimine',
    title: 'Prügi kolme kasti',
    theme: 'igapäevaelu',
    text: 'Kooli klassis pandi üles kolm prügikasti: paberile, pakenditele ja olmejäätmetele. Alguses ajasid lapsed kastid segamini. Siis tegi klass katse. Ühe nädala jooksul kaaluti iga päev, kui palju prügi kogunes. Selgus, et üle poole prügist oli paber ja pakend, mida saab ringlusse võtta. Ümbertöödeldud paberist tehakse uut paberit ja plastpudelitest näiteks fliisi ja uusi pudeleid. Klass otsustas, et iga nädal vastutab kastide eest üks õpilaste paar. Kuu lõpus oli olmeprügi kast pooltühi. Kooli koristaja kiitis, et prügikotte tuli vahetada palju harvem kui varem.',
    questions: [
      { question: 'Mida näitas klassi katse?', options: ['et üle poole prügist sai ringlusse võtta', 'et lapsed tekitasid väga vähe prügi', 'et paberit ei saa kuidagi ümber töödelda', 'et prügikaste oli liiga vähe'], answer: 'et üle poole prügist sai ringlusse võtta', evidence: 'üle poole prügist oli paber ja pakend', type: 'jareldus' },
      { question: 'Mida tehakse plastpudelitest?', options: ['fliisi ja uusi pudeleid', 'uut paberit ja kartongi', 'klaasi ja peegleid', 'kütust ja küünlaid'], answer: 'fliisi ja uusi pudeleid', evidence: 'plastpudelitest näiteks fliisi ja uusi pudeleid', type: 'detail' },
      { question: 'Mida tähendab tekstis «ringlusse võtta»?', options: ['uuesti kasutusse viia', 'ära põletada', 'maha matta', 'ringiratast keerutada'], answer: 'uuesti kasutusse viia', evidence: 'mida saab ringlusse võtta', type: 'sona' }
    ]
  },
  {
    id: '31-kingitus',
    title: 'Kingitus vanaisale',
    theme: 'igapäevaelu',
    text: 'Vanaisa sai seitsekümmend aastat vanaks ja Emma ei teadnud, mida talle kinkida. Poes olid ainult lipsud ja kruusid, mida vanaisal oli juba küll. Siis meenus Emmale, et vanaisa rääkis tihti oma lapsepõlve suvedest, kui ta kalal käis ja paadiga merele sõitis. Emma otsis vanu fotosid, skaneeris need ema abiga ja kirjutas iga pildi alla küsimuse. Nii valmis album, kus oli palju tühje lehti. Sünnipäeval vaatas vanaisa albumit kaua ja hakkas rääkima. Ta rääkis lugusid, mida keegi polnud varem kuulnud. Emma kirjutas need tühjadele lehtedele üles. Vanaisa ütles, et see oli tema kõige parem kingitus.',
    questions: [
      { question: 'Miks jättis Emma albumisse tühje lehti?', options: ['et sinna vanaisa lood kirja panna', 'sest tal ei jätkunud fotosid', 'et vanaisa saaks sinna joonistada', 'sest album oli liiga suur'], answer: 'et sinna vanaisa lood kirja panna', evidence: 'Emma kirjutas need tühjadele lehtedele üles', type: 'jareldus' },
      { question: 'Miks ei sobinud poes olnud lipsud ja kruusid?', options: ['vanaisal oli neid juba küll', 'need olid liiga kallid', 'vanaisale ei meeldi kohv', 'pood oli sünnipäeva hommikul suletud'], answer: 'vanaisal oli neid juba küll', evidence: 'mida vanaisal oli juba küll', type: 'detail' }
    ]
  },
  {
    id: '32-ekraaniaeg',
    title: 'Ekraanivaba nädal',
    theme: 'igapäevaelu',
    text: 'Kevadel kutsus kool peresid ekraanivabale nädalale. Kõik pidid nädal aega jätma telefoni, mängukonsooli ja televiisori õhtuti välja. Martinile tundus see alguses võimatu. Esimesel õhtul ta tüdines ja vaatas lihtsalt lakke. Teisel õhtul tõi isa kapist välja vana malelaua. Martin kaotas kolm partiid järjest, aga neljanda võitis. Kolmandal päeval ehitasid nad õega tekkidest koopa ja lugesid seal raamatut. Nädala lõpus märkas Martin, et ta jäi õhtul kiiremini magama ja hommikul oli lihtsam ärgata. Ta ei loobunud telefonist päriseks, aga otsustas, et enne magamaminekut jääb see köögilauale.',
    questions: [
      { question: 'Mida märkas Martin nädala lõpus?', options: ['et ta jäi kiiremini magama', 'et ta oli maleturniiri võitnud', 'et telefon oli katki läinud', 'et õde oli talle pahane'], answer: 'et ta jäi kiiremini magama', evidence: 'ta jäi õhtul kiiremini magama', type: 'detail' },
      { question: 'Miks otsustas Martin jätta telefoni õhtuti köögilauale?', options: ['ta märkas, et ilma selleta magab ta paremini', 'isa keelas tal telefoni kasutada', 'telefon oli öösel vaja laadida', 'tal polnud enam üldse telefoni vaja'], answer: 'ta märkas, et ilma selleta magab ta paremini', evidence: 'hommikul oli lihtsam ärgata', type: 'jareldus' },
      { question: 'Mida tähendab tekstis «tüdines»?', options: ['hakkas igavlema', 'jäi haigeks', 'vihastas väga', 'jäi kohe sügavalt magama'], answer: 'hakkas igavlema', evidence: 'Esimesel õhtul ta tüdines', type: 'sona' }
    ]
  },
  {
    id: '33-sinine-taevas',
    title: 'Miks taevas on sinine',
    theme: 'teadus',
    text: 'Päikesevalgus tundub valge, kuid tegelikult on selles kõik vikerkaare värvid. Kui valgus jõuab Maa õhukihti, põrkab see vastu tillukesi õhuosakesi. Sinine valgus hajub õhus palju rohkem kui punane. Hajunud sinine valgus jõuab meie silma igast taevakohast ja seepärast näeme päeval sinist taevast. Õhtul on päike madalal ja valgus peab läbima palju paksema õhukihi. Siis hajub sinine valgus teel ära ja meieni jõuavad peamiselt punane ja oranž. Sellepärast on päikeseloojang punakas. Kuul ei ole õhku, mistõttu seal on taevas ka päeval must.',
    questions: [
      { question: 'Miks on päikeseloojang punakas?', options: ['sinine valgus hajub pika tee jooksul ära', 'õhtul muutub päike punasemaks', 'õhtul on õhus rohkem tolmu', 'meri peegeldab õhtul taevasse punast valgust'], answer: 'sinine valgus hajub pika tee jooksul ära', evidence: 'Siis hajub sinine valgus teel ära', type: 'jareldus' },
      { question: 'Milline on taevas päeval Kuul?', options: ['must', 'sinine', 'punane', 'valge'], answer: 'must', evidence: 'seal on taevas ka päeval must', type: 'detail' },
      { question: 'Mida tähendab tekstis «hajub»?', options: ['laiali minema eri suundadesse', 'kokku kogunema', 'soojemaks muutuma', 'ära kaduma igaveseks ajaks'], answer: 'laiali minema eri suundadesse', evidence: 'Sinine valgus hajub õhus palju rohkem kui punane', type: 'sona' }
    ]
  },
  {
    id: '34-vikerkaar',
    title: 'Vikerkaar',
    theme: 'teadus',
    text: 'Vikerkaart näeb siis, kui päike paistab selja tagant ja ees sajab vihma. Iga vihmapiisk töötab nagu väike prisma. Kui päikesekiir piiska siseneb, murdub see ja laguneb värvideks, peegeldub piisa tagaseinalt ning murdub uuesti välja tulles. Nii jõuavad meie silma eri värvid veidi eri nurkade all. Vikerkaarel on alati sama värvide järjekord: punane on väljas ja violetne sees. Mõnikord on näha ka teine, nõrgem vikerkaar, mille värvid on vastupidises järjekorras. Vikerkaart saab ise tekitada: seisa päikesepaistelisel päeval päikese poole seljaga ja pihusta aiavoolikust vett enda ette.',
    questions: [
      { question: 'Kus peab päike olema, et vikerkaart näha?', options: ['vaataja selja taga', 'otse vaataja ees', 'täpselt pea kohal', 'pilve taga peidus vaataja kohal'], answer: 'vaataja selja taga', evidence: 'päike paistab selja tagant', type: 'detail' },
      { question: 'Mida näitab katse aiavoolikuga?', options: ['et vikerkaare jaoks on vaja piisku ja päikest', 'et vikerkaar tekib ainult tormi ajal', 'et vesi on tegelikult värviline', 'et vikerkaart saab kodus käega puudutada'], answer: 'et vikerkaare jaoks on vaja piisku ja päikest', evidence: 'pihusta aiavoolikust vett enda ette', type: 'jareldus' }
    ]
  },
  {
    id: '35-magnet',
    title: 'Magnet ja kompass',
    theme: 'teadus',
    text: 'Magnetil on kaks poolust: põhjapoolus ja lõunapoolus. Erinevad poolused tõmbavad teineteist ligi, samad poolused tõukavad eemale. Ka Maa ise on nagu hiiglaslik magnet. Seepärast pöördub kompassi magnetnõel alati põhja-lõuna suunas. Meresõitjad on kompassi abil tee leidnud juba ligi tuhat aastat. Kompassi saab ise valmistada: hõõru õmblusnõela ühes suunas mitu korda vastu magnetit, torka nõel läbi korgitüki ja pane kork veekaussi. Nõel keerab end aeglaselt põhja-lõuna suunda. Kompassi lähedal ei tohi olla teisi magneteid ega rauast esemeid, sest need võivad nõela eksitada.',
    questions: [
      { question: 'Mis juhtub, kui panna kaks magnetit samade poolustega kokku?', options: ['need tõukavad teineteist eemale', 'need kleepuvad kõvasti kokku', 'need hakkavad soojenema', 'need kaotavad kohe kogu oma jõu'], answer: 'need tõukavad teineteist eemale', evidence: 'samad poolused tõukavad eemale', type: 'detail' },
      { question: 'Miks ei tohi kompassi lähedal olla rauast esemeid?', options: ['need võivad nõela valesse suunda tõmmata', 'need teevad kompassi raskemaks', 'need kriimustavad kompassi klaasi', 'need muudavad vee kausis jäiseks ja külmaks'], answer: 'need võivad nõela valesse suunda tõmmata', evidence: 'need võivad nõela eksitada', type: 'jareldus' },
      { question: 'Mida tähendab tekstis «eksitada»?', options: ['viia valele teele', 'jõuliselt lõhkuda', 'kiiresti peatada', 'üles äratada'], answer: 'viia valele teele', evidence: 'need võivad nõela eksitada', type: 'sona' }
    ]
  },
  {
    id: '36-kuu',
    title: 'Kuu, meie naaber',
    theme: 'teadus',
    text: 'Kuu on Maa ainus looduslik kaaslane. Ta ei helenda ise, vaid peegeldab päikesevalgust. Kuu tiirleb ümber Maa umbes kuu ajaga ja selle aja jooksul näeme teda erineva kujuga: noorkuust täiskuuni ja tagasi. Kuu pöörab Maa poole alati sama külje, seetõttu ei näe me maa pealt kunagi Kuu tagakülge. Kuu pinda katavad kraatrid, mis tekkisid meteoriitide kokkupõrgetest. Kuna Kuul pole tuult ega vihma, püsivad kraatrid ja isegi astronautide jalajäljed seal miljoneid aastaid. Esimesed inimesed astusid Kuule 1969. aastal. Kuu mõjutab ka Maad: tema tõmbejõud tekitab ookeanides tõusu ja mõõna.',
    questions: [
      { question: 'Miks püsivad astronautide jalajäljed Kuul nii kaua?', options: ['Kuul pole tuult ega vihma', 'Kuu pind on väga pehme', 'astronaudid kaitsesid jälgi', 'Kuul on alati pime'], answer: 'Kuul pole tuult ega vihma', evidence: 'Kuna Kuul pole tuult ega vihma', type: 'jareldus' },
      { question: 'Mida tekitab Kuu tõmbejõud Maal?', options: ['tõusu ja mõõna', 'tuult ja torme', 'maavärinaid', 'aastaaegu'], answer: 'tõusu ja mõõna', evidence: 'tekitab ookeanides tõusu ja mõõna', type: 'detail' },
      { question: 'Mida tähendab tekstis «kaaslane»?', options: ['taevakeha, mis tiirleb teise ümber', 'teine planeet samal orbiidil', 'Päikese lähim täht', 'sõber, kellega koos pikka reisi teha'], answer: 'taevakeha, mis tiirleb teise ümber', evidence: 'Kuu on Maa ainus looduslik kaaslane', type: 'sona' }
    ]
  },
  {
    id: '37-lumehelves',
    title: 'Lumehelbe sünd',
    theme: 'teadus',
    text: 'Lumehelves sünnib pilves, kus on väga külm. Õhus hõljuv veeaur külmub tillukese tolmukübeme ümber jääkristalliks. Kristall kasvab, sest sinna külmub juurde üha uut veeauru. Vee molekulid ühenduvad kindla nurga all ja seepärast on lumehelbel peaaegu alati kuus haru. Igal helbel on oma tee läbi pilve: see lendab läbi eri temperatuuriga ja eri niiskusega õhu. Sellepärast on kahte täpselt ühesugust lumehelvest peaaegu võimatu leida. Kui õhk on maapinna lähedal soe, sulab helves enne maha jõudmist ja sajab vihmana. Väga külma ilmaga on lumi kuiv ja krudiseb jalge all.',
    questions: [
      { question: 'Mitu haru on lumehelbel peaaegu alati?', options: ['kuus', 'neli', 'kaheksa', 'viis'], answer: 'kuus', evidence: 'lumehelbel peaaegu alati kuus haru', type: 'detail' },
      { question: 'Miks ei leia peaaegu kunagi kahte ühesugust lumehelvest?', options: ['iga helbe tee läbi pilve on erinev', 'lumehelbed sulavad liiga kiiresti', 'helbed on liiga väikesed nägemiseks', 'igas pilves on erinev tolm'], answer: 'iga helbe tee läbi pilve on erinev', evidence: 'Igal helbel on oma tee läbi pilve', type: 'jareldus' }
    ]
  },
  {
    id: '38-kaja',
    title: 'Kaja',
    theme: 'teadus',
    text: 'Heli on õhu võnkumine, mis liigub igas suunas edasi. Õhus liigub heli umbes kolmsada nelikümmend meetrit sekundis. Kui heli põrkab vastu kõrget kaljuseina või metsaserva ja tuleb tagasi, kuuleme kaja. Kaja kuulmiseks peab sein olema piisavalt kaugel, muidu sulavad hüüe ja kaja meie kõrvus kokku. Nahkhiired kasutavad kaja jahil. Nad kiljuvad nii kõrge häälega, et inimene seda ei kuule, ja kuulavad, kust kaja tagasi tuleb. Nii leiavad nad pimedas üles isegi väikese sääse. Sama mõtet kasutavad laevad, mis mõõdavad kajaloodiga mere sügavust.',
    questions: [
      { question: 'Miks ei kuule me kaja, kui sein on väga lähedal?', options: ['hüüe ja kaja sulavad kõrvus kokku', 'heli ei põrka lähedalt tagasi', 'lähedal sein neelab kogu heli', 'heli liigub lähedal liiga aeglaselt'], answer: 'hüüe ja kaja sulavad kõrvus kokku', evidence: 'muidu sulavad hüüe ja kaja meie kõrvus kokku', type: 'jareldus' },
      { question: 'Milleks kasutavad nahkhiired kaja?', options: ['saagi leidmiseks pimedas', 'teistele nahkhiirtele laulmiseks', 'vaenlaste peletamiseks', 'talveune ajal soojas püsimiseks'], answer: 'saagi leidmiseks pimedas', evidence: 'leiavad nad pimedas üles isegi väikese sääse', type: 'detail' },
      { question: 'Mida tähendab tekstis «põrkab»?', options: ['lööb vastu ja tuleb tagasi', 'kaob jäljetult ära', 'muutub seina lähedal järjest valjemaks', 'liigub läbi seina'], answer: 'lööb vastu ja tuleb tagasi', evidence: 'Kui heli põrkab vastu kõrget kaljuseina', type: 'sona' }
    ]
  },
  {
    id: '39-taim-valgus',
    title: 'Oa katse',
    theme: 'teadus',
    text: 'Loodusõpetuse tunnis tegi klass katse. Kaks potti said ühesuguse mulla ja ühesuguse oaseemne. Mõlemat kasteti samal ajal sama palju vett. Üks pott seisis aknalaual, teine pandi pimedasse kappi. Nädala pärast olid mõlemad seemned idanenud. Aknalaual kasvas tugev roheliste lehtedega taim. Kapis kasvas pikk, kõhn ja kahvatukollane vars, mille lehed olid tillukesed. Kapitaim oli valgust otsides venitanud end pikaks, aga ilma valguseta ei saanud ta toitu teha ega roheliseks muutuda. Klass jõudis järeldusele, et idanemiseks pole valgust vaja, kuid kasvamiseks on valgus hädavajalik.',
    questions: [
      { question: 'Miks said mõlemad potid sama mulla ja sama palju vett?', options: ['et ainus erinevus oleks valgus', 'sest mulda oli ainult ühte sorti', 'et potid oleksid sama rasked', 'sest õpetaja oli kiirustanud'], answer: 'et ainus erinevus oleks valgus', evidence: 'Üks pott seisis aknalaual, teine pandi pimedasse kappi', type: 'jareldus' },
      { question: 'Milline oli kapis kasvanud taim?', options: ['pikk, kõhn ja kahvatukollane', 'lühike, tugev ja tumeroheline', 'üldse mitte idanenud', 'õitega ja lopsakas'], answer: 'pikk, kõhn ja kahvatukollane', evidence: 'pikk, kõhn ja kahvatukollane vars', type: 'omadus' },
      { question: 'Mida tähendab tekstis «idanenud»?', options: ['seemnest on hakanud kasvama idu', 'seeme on ära mädanenud', 'seeme on vette uppunud', 'seeme on kuivaks ja kõvaks muutunud'], answer: 'seemnest on hakanud kasvama idu', evidence: 'olid mõlemad seemned idanenud', type: 'sona' }
    ]
  },
  {
    id: '40-suda',
    title: 'Süda, väsimatu pump',
    theme: 'teadus',
    text: 'Inimese süda on rusikasuurune lihas, mis asub rinnus veidi vasakul. See pumpab verd mööda soonestikku üle kogu keha. Veri viib kõigile keharakkudele hapnikku ja toitaineid ning toob tagasi jääkaineid. Puhkeolekus lööb lapse süda umbes kaheksakümmend kuni sada korda minutis. Kui jookseme, vajavad lihased rohkem hapnikku ja süda hakkab kiiremini lööma. Pulssi saab ise mõõta: pane kaks sõrme randmele pöidla poole ja loe, mitu lööki tunned viieteistkümne sekundi jooksul. Korruta see arv neljaga. Süda töötab ka siis, kui magame. Liikumine ja tervislik toit hoiavad südame tugevana.',
    questions: [
      { question: 'Miks lööb süda joostes kiiremini?', options: ['lihased vajavad rohkem hapnikku', 'süda väsib joostes ära', 'veri muutub joostes külmaks', 'kopsud jäävad joostes hetkeks seisma'], answer: 'lihased vajavad rohkem hapnikku', evidence: 'vajavad lihased rohkem hapnikku', type: 'jareldus' },
      { question: 'Mitmega tuleb korrutada 15 sekundi löögid, et saada pulss minutis?', options: ['neljaga', 'kahega', 'kuuega', 'kümnega'], answer: 'neljaga', evidence: 'Korruta see arv neljaga', type: 'detail' }
    ]
  },
  {
    id: '41-jaa-ujub',
    title: 'Miks jää ujub',
    theme: 'teadus',
    text: 'Enamik aineid muutub külmudes tihedamaks ja vajub vedelikus põhja. Vesi on teistsugune. Kui vesi külmub, asetuvad tema osakesed üksteisest veidi kaugemale ja moodustavad hõreda võre. Seepärast on jää kergem kui sama palju vett ja ujub pinnal. See on järvede elanikele väga tähtis. Talvel tekib järve pinnale jääkaas, mis hoiab all olevat vett soojemana. Järve põhjas püsib vesi umbes nelja kraadi soe ja kalad saavad seal talve üle elada. Kui jää vajuks põhja, võiks järv külmuda põhjani. Jää paisumist võib märgata ka siis, kui klaaspudel külmikus lõhki läheb.',
    questions: [
      { question: 'Miks võib klaaspudel vett täis külmikus lõhki minna?', options: ['vesi paisub külmudes', 'klaas tõmbub külmas kokku', 'vesi muutub külmudes raskemaks', 'külmikus on liiga vähe õhku'], answer: 'vesi paisub külmudes', evidence: 'Jää paisumist võib märgata', type: 'jareldus' },
      { question: 'Kui soe on talvel vesi järve põhjas?', options: ['umbes neli kraadi', 'umbes null kraadi', 'umbes kümme kraadi', 'alla nulli'], answer: 'umbes neli kraadi', evidence: 'püsib vesi umbes nelja kraadi soe', type: 'detail' },
      { question: 'Mida tähendab tekstis «hõre»?', options: ['mille osade vahel on palju ruumi', 'väga raske ja kõva', 'täiesti läbipaistev', 'kiiresti sulav ja väga külm'], answer: 'mille osade vahel on palju ruumi', evidence: 'moodustavad hõreda võre', type: 'sona' }
    ]
  },
  {
    id: '42-vanaema-kiri',
    title: 'Kiri tulevikku',
    theme: 'jutud',
    text: 'Klassijuhataja palus kõigil kirjutada kirja iseendale, mis avatakse alles kümne aasta pärast. Hanna istus kaua tühja paberi ees. Mida küll kirjutada inimesele, keda veel ei tunne? Lõpuks kirjutas ta, mis talle praegu meeldib: kass Triibu, sinine värv ja vahvlid moosiga. Ta kirjutas, et kardab pimedat, aga tahab saada loomaarstiks. Viimaseks lisas ta küsimuse: «Kas sa oled ikka veel sõber Liisaga?» Kirjad pandi ümbrikesse, kleebiti kinni ja viidi kooli seifi. Hanna mõtles õhtul, et kümne aasta pärast on ta kahekümneaastane. See tundus nii kauge ja samas põnev.',
    questions: [
      { question: 'Kelleks tahab Hanna saada?', options: ['loomaarstiks', 'õpetajaks', 'kunstnikuks', 'kokaks'], answer: 'loomaarstiks', evidence: 'tahab saada loomaarstiks', type: 'detail' },
      { question: 'Miks istus Hanna kaua tühja paberi ees?', options: ['tal oli raske kirjutada tulevasele endale', 'tal ei olnud pliiatsit', 'ta ei osanud veel kirjutada', 'ta oli õpetaja peale ülesande pärast pahane'], answer: 'tal oli raske kirjutada tulevasele endale', evidence: 'Mida küll kirjutada inimesele, keda veel ei tunne?', type: 'jareldus' }
    ]
  }
];

export function kiurReadingStoryTasks(stories: readonly KiurReadingStory[] = KIUR_READING_STORIES): KiurReadingTask[] {
  return stories.flatMap((story) => story.questions.map((question, index) => ({
    id: `lugu-${story.id}-${'abc'[index]}`,
    learner: 'kiur' as const,
    subject: 'lugemine' as const,
    exercise: 'loe-ja-vasta' as const,
    sourceAuthor: 'Harjutaja',
    sourceTitle: story.title,
    sourceCollection: `Harjutaja lood: ${story.theme}`,
    text: story.text,
    question: question.question,
    options: [...question.options],
    correctAnswer: question.answer,
    evidenceText: question.evidence,
    questionType: question.type
  })));
}
