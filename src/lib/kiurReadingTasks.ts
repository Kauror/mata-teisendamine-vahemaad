export type KiurReadingQuestionType =
  | 'detail'
  | 'tegevus'
  | 'koht'
  | 'tegelane'
  | 'omadus'
  | 'jareldus';

export type KiurReadingTask = {
  id: string;
  learner: 'kiur';
  subject: 'lugemine';
  exercise: 'loe-ja-vasta';
  sourceAuthor: string;
  sourceTitle: string;
  sourceCollection: string;
  sourceUrl?: string;
  text: string;
  question: string;
  options: string[];
  correctAnswer: string;
  evidenceText: string;
  questionType: KiurReadingQuestionType;
};

export const KIUR_READING_TASKS = [
  {
    "id": "01-suitsupaasuke",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SUITSUPÄÄSUKE",
    "sourceCollection": "Linnunädalad",
    "text": "Homme, 1. mail on Eesti Ornitoloogiaühingu sünnipäev, suur juubel. Kuna ühingu logo kaunistab suitsupääsuke, on vältimatu just tema nimetamine selle nädala linnuks. Eks aprilli lõpus ja mai alguses on alati ka suitsupääsukesi koju tagasi oodata.",
    "question": "Milline lind kaunistab Eesti Ornitoloogiaühingu logo?",
    "options": [
      "suitsupääsuke",
      "kuldnokk",
      "kägu",
      "ööbik"
    ],
    "correctAnswer": "suitsupääsuke",
    "evidenceText": "logo kaunistab suitsupääsuke",
    "questionType": "omadus"
  },
  {
    "id": "02-kuldnokk",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KULDNOKK",
    "sourceCollection": "Linnunädalad",
    "text": "Esimene kuldnokk käis mu koduaia pesakasti uudistamas juba veebruari keskel, kuid see oli juhuslik seikleja, päris oma kuldnokad saabusid 23. märtsil talviselt reisilt tagasi. Neli-viis kuud veetsid nad Lääne-Euroopas. Selleks paigaks võis olla Inglismaa või Holland, Iirimaa või Prantsusmaa, aga suure tõenäosusega hoopis Belgia, kus on hea kodune koos Eestist pärit europarlamendi liikmetega aega veeta.",
    "question": "Kus veetsid kuldnokad talve?",
    "options": [
      "Lääne-Euroopas",
      "Lõuna-Aafrikas",
      "Eestis",
      "Gröönimaal"
    ],
    "correctAnswer": "Lääne-Euroopas",
    "evidenceText": "Neli-viis kuud veetsid nad Lääne-Euroopas.",
    "questionType": "koht"
  },
  {
    "id": "03-suurnokk-vint",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SUURNOKK-VINT",
    "sourceCollection": "Linnunädalad",
    "text": "Suurnokk-vindi ehk suurnoka puhul ei teki küll hetkekski küsimust, kust ta oma nimetuse on saanud. Piisab pilgust talle näkku ja asi selge. Iseasi, kuidas õnnestuks talle seda pilku näkku heita, kui ta tegutseb enamasti varjatult puuvõrades. Aga just sellepärast räägimegi temast nüüd, mil puud pole veel lehte läinud.",
    "question": "Kus suurnokk-vint enamasti tegutseb?",
    "options": [
      "puuvõrades",
      "mererannas",
      "roostikus",
      "põllul"
    ],
    "correctAnswer": "puuvõrades",
    "evidenceText": "tegutseb enamasti varjatult puuvõrades",
    "questionType": "koht"
  },
  {
    "id": "04-huup",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HÜÜP",
    "sourceCollection": "Linnunädalad",
    "text": "Hüüp on roostike lind. Paikades, kus pole veekogusid, ei kasva üldjuhul ka pilliroogu ning ei ela hüüpe. Mõnes mõttes on neis paigus rahulikum elada, sest vanarahvas nägi ööhirmutajaks kutsutud linnus põhjendamatult tonti. Ennekõike selle pärast, et hüüp on lind, kelle huvitavat madalat häält, mis kostab justkui suurde tühja pudelisse puhumisena, on küll mitme kilomeetri taha kuulda, lindu ennast on aga vähesed näinud.",
    "question": "Millise elupaigaga on hüüp seotud?",
    "options": [
      "roostikuga",
      "männikuga",
      "kiviklibuga",
      "linnatänavaga"
    ],
    "correctAnswer": "roostikuga",
    "evidenceText": "Hüüp on roostike lind.",
    "questionType": "koht"
  },
  {
    "id": "05-vaikekoovitaja",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "VÄIKEKOOVITAJA",
    "sourceCollection": "Linnunädalad",
    "text": "Täiskuu ajal asus väikekoovitaja Aafrikast koduteele. Aprillis hakkame esimesi saabujaid kohtama. Mõnel aastal pisut varem, mõnel pisut hiljem, sõltuvalt Kuu faasidest.",
    "question": "Millal asus väikekoovitaja Aafrikast koduteele?",
    "options": [
      "täiskuu ajal",
      "jaanuaris",
      "sügisel",
      "keskpäeval"
    ],
    "correctAnswer": "täiskuu ajal",
    "evidenceText": "Täiskuu ajal asus väikekoovitaja Aafrikast koduteele.",
    "questionType": "tegevus"
  },
  {
    "id": "06-naerukajakas",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "NAERUKAJAKAS",
    "sourceCollection": "Linnunädalad",
    "text": "Nimetuse järgi peaks naerukajakas küll üks lõbus lind olema. Sest sarnase nimetusega on ta ka mõnedes muudes keeltes – kas või soomlaste naurulokki või sakslaste Lachmöwe. Või ka ladinakeelne Larus ridibundus, mis kõlalt iseenesestki naljakas tundub, ei tähenda samuti muud kui naervat kajakat. Tegelikult pole muidugi teada, kas naerukajakas üldse nalja mõistab ja kas ta kunagi millegi peale ka naerab, sest see inimeste naerukõkutamist meenutav häälitsus, mille järgi talle nimi antud, tähendab kajakate keeles hoopis midagi muud kui naeru.",
    "question": "Mille järgi on naerukajakas oma nime saanud?",
    "options": [
      "naeru meenutava häälitsuse järgi",
      "punase noka järgi",
      "pesa kuju järgi",
      "pika saba järgi"
    ],
    "correctAnswer": "naeru meenutava häälitsuse järgi",
    "evidenceText": "naerukõkutamist meenutav häälitsus",
    "questionType": "detail"
  },
  {
    "id": "07-sarvikputt",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SARVIKPÜTT",
    "sourceCollection": "Linnunädalad",
    "text": "Ainuüksi väljanägemine on sarvikpütil tähelepanuväärne ja vaatamist väärt. Kõige silmatorkavamad ongi tema niinimetatud sarved, milleks on kuldsed tutid silmade taga. Tema ladinakeelne nimetus Podiceps auritus rõhutabki just nende eesti keeles sarvedeks nimetatud tutikeste kuldsele värvusele.",
    "question": "Mis on sarvikpüti „sarved“ tegelikult?",
    "options": [
      "kuldsed tutid",
      "pikad sabasuled",
      "punased jalad",
      "must nokk"
    ],
    "correctAnswer": "kuldsed tutid",
    "evidenceText": "sarved, milleks on kuldsed tutid",
    "questionType": "detail"
  },
  {
    "id": "08-jogivastrik",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "JÕGIVÄSTRIK",
    "sourceCollection": "Linnunädalad",
    "text": "Jõgivästrikku tasub otsima minna jõgede äärest. Mida kiirevoolulisem jõgi, seda paremini jõgivästrikule sobib. Ehkki vene, saksa ja soome keeles nimetatakse teda hoopis mägivästrikuks. Ladina ja inglise keeles on ta aga hall västrik.",
    "question": "Millise koha juurest tasub jõgivästrikku otsida?",
    "options": [
      "jõgede äärest",
      "rabast",
      "kuusemetsast",
      "linnatornist"
    ],
    "correctAnswer": "jõgede äärest",
    "evidenceText": "Jõgivästrikku tasub otsima minna jõgede äärest.",
    "questionType": "detail"
  },
  {
    "id": "09-kagu",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KÄGU",
    "sourceCollection": "Linnunädalad",
    "text": "Kes siis käo kombel kukkuda ei oskaks! Tõenäoliselt on tegemist tuntuima linnuhäälega ja pole vist kedagi, kes ise poleks kordagi kukkunud. Iseasi, kui palju on neid, kes käo ära tunnevad, kui ta juhtub vastu lendama. Kindlasti palju-palju vähem.",
    "question": "Mille poolest on kägu tekstis eriti tuntud?",
    "options": [
      "hääle poolest",
      "pesa ehitamise poolest",
      "ujumise poolest",
      "punase kõhu poolest"
    ],
    "correctAnswer": "hääle poolest",
    "evidenceText": "tegemist tuntuima linnuhäälega",
    "questionType": "detail"
  },
  {
    "id": "10-must-karbsenapp",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "MUST-KÄRBSENÄPP",
    "sourceCollection": "Linnunädalad",
    "text": "Kel koduaias mõni pesakast üles pandud, on kindlasti must-kärbsenäpiga vägagi tuttav. See lind asustab pesakasti suurima heameelega ning on varmas ägedaid võitlusigi maha pidama tihaste või teiste liikidega, kes enne kärbsenäppide saabumist aprilli lõpus või mai alguses on pesakasti elama asunud. Väikestelt tihastelt või lepalinnult võib õnnestuda pesakast ka üle lüüa, kuid rasvatihase või põldvarblase käest pigem mitte. Võitlejahingega on must-kärbsenäpp igal juhul ega pelga ka endast tugevamatega jõudu katsuda.",
    "question": "Millise koha asustab must-kärbsenäpp hea meelega?",
    "options": [
      "pesakasti",
      "roostiku",
      "kivikoopa",
      "liivaranna"
    ],
    "correctAnswer": "pesakasti",
    "evidenceText": "asustab pesakasti suurima heameelega",
    "questionType": "detail"
  },
  {
    "id": "11-laulurastas",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "LAULURÄSTAS",
    "sourceCollection": "Linnunädalad",
    "text": "Tänavusel talvel pole päris linnulauluvaba aega olnudki, pehmel talvel oleme talviseid linde kuulnud laulmas sageli. Küll tihaseid, küll rohevinte, musträstaidki. Aprillis, kui kohale jõudis laulurästas, hakkasid metsad ja pargid rõkkama aga hoopis uue hooga. Märtsis vilistasid kuuselatvades musträstad oma kurvatoonilisi meloodiaid, aprillis andsid nad aga justkui vahetuse üle laulurästastele.",
    "question": "Mis juhtus, kui laulurästas aprillis kohale jõudis?",
    "options": [
      "metsad ja pargid hakkasid rõkkama",
      "järved jäätusid",
      "linnud vaikisid",
      "sadas lund"
    ],
    "correctAnswer": "metsad ja pargid hakkasid rõkkama",
    "evidenceText": "hakkasid metsad ja pargid rõkkama",
    "questionType": "detail"
  },
  {
    "id": "12-vaankael",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "VÄÄNKAEL",
    "sourceCollection": "Linnunädalad",
    "text": "Külvilind on kohale jõudnud, põllumehi külvile kamandama: „Tee, tee, tee, tee...“ Nii tundis väänkaela vanarahvas. Pigem hõiskab väänkael siiski jõuliselt „piip-piip-piip-piip-piip...“ ja ennekõike hoidku nüüd sipelgad piip ja prillid, sest neid langeb väänkaela saagiks suve jooksul loendamatul hulgal. Ainuüksi ühe päeva jooksul toovat väänkael poegadele üle kümne tuhande sipelganuku.",
    "question": "Mida toovat väänkael poegadele väga palju?",
    "options": [
      "sipelganukke",
      "kirsikive",
      "kalu",
      "tammetõrusid"
    ],
    "correctAnswer": "sipelganukke",
    "evidenceText": "üle kümne tuhande sipelganuku",
    "questionType": "tegevus"
  },
  {
    "id": "13-tait",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "TAIT",
    "sourceCollection": "Linnunädalad",
    "text": "Seekord kirjutan punase noka ja nokatüvikuga veelinnust, kes möödunud nädalal Mõdriku kandis Virumaa Teataja ajakirjanikule ja Tartu teadlastele põnevaid ja mõistatuslikke hetki pakkus. See valge sabaalusega lind on tait ehk teisisõnu tiigikana. 1991. aastani oli tiigikana tema ainus ja ametlik nimetus. Mitte et ta kanaliste hulka kuuluks, hoopis ruiklaste.",
    "question": "Mis teine nimi on taidal?",
    "options": [
      "tiigikana",
      "merikotkas",
      "käblik",
      "rohevint"
    ],
    "correctAnswer": "tiigikana",
    "evidenceText": "tait ehk teisisõnu tiigikana",
    "questionType": "detail"
  },
  {
    "id": "14-tuttvart",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "TUTTVART",
    "sourceCollection": "Linnunädalad",
    "text": "Tuttvart on mustvalge lind. Nii paistab eemalt. Kui teda lähemalt silmitseme, märkame kõigepealt kollast silma ning seejärel ka musta sulestiku sinakaid-pruunikaid toone. Emaslinnul ju valget polegi ja ega tegelikult ka musta mitte, pigem ongi tema hoopis tumepruun.",
    "question": "Mis värvi silm hakkab tuttvardil lähemalt silma?",
    "options": [
      "kollane",
      "sinine",
      "punane",
      "roheline"
    ],
    "correctAnswer": "kollane",
    "evidenceText": "märkame kõigepealt kollast silma",
    "questionType": "detail"
  },
  {
    "id": "15-oobik",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "ÖÖBIK",
    "sourceCollection": "Linnunädalad",
    "text": "Ööbiku laulmine toovat sooja öö kaasa, niisama nagu lõoke toovat lõunasooja ja pääsuke päevasooja. See vanarahvatarkus iseloomustab hästi nende lindude saabumisaegu. Ööbik on üks viimaseid tulijaid. Aga mitmed teised öölaulikud jõuavad veelgi hiljem pärale.",
    "question": "Milline tulija on ööbik tekstis?",
    "options": [
      "üks viimaseid tulijaid",
      "kõige esimene tulija",
      "talvelind",
      "paigalind"
    ],
    "correctAnswer": "üks viimaseid tulijaid",
    "evidenceText": "Ööbik on üks viimaseid tulijaid.",
    "questionType": "omadus"
  },
  {
    "id": "16-ruut",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "RÜÜT",
    "sourceCollection": "Linnunädalad",
    "text": "Kas olete kunagi kohtunud selle kurvameelselt hüüdva rabalinnuga? Kui kevadel-suvel lagerabasse pole sattunud, siis tõenäoliselt mitte. Aga see kohtumine oleks kindlasti seda väikest vaeva väärt, isegi sääskede massirünnakud on tühiasi võrreldes elamusega, mida üks rüüt rabamaastikus pakkuda võib. Seega tasub just juunis suunduda lähimasse rappa, olgu selleks siis Tudu või Ohepalu või mõni kolmas soomaastik.",
    "question": "Kuhu tasub rüüdi kohtamiseks juunis minna?",
    "options": [
      "rappa",
      "sadamasse",
      "linnaparki",
      "viljapõllule"
    ],
    "correctAnswer": "rappa",
    "evidenceText": "tasub just juunis suunduda lähimasse rappa",
    "questionType": "detail"
  },
  {
    "id": "17-kivitaks",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KIVITÄKS",
    "sourceCollection": "Linnunädalad",
    "text": "Rändlinde saabub iga päevaga lõunamaareisilt tagasi üha rohkem ja rohkem. Aprilli keskpaigast alates hakkasid öö varjus naasma ka halli-musta-valgekirjud kivitäksid. Need on varblasesuurused linnukesed, keda pole küll teab kui palju, kuid kes sageli inimese läheduses elupaiga sisse seavad ning seetõttu ka silma hakkavad. Kõige sagedamini kohtame kivitäkse mererannikul ja põldudevahelistes kivihunnikutes, kuid ka asulates meeldib neile elada.",
    "question": "Kus kohtame kivitäkse kõige sagedamini?",
    "options": [
      "mererannikul ja kivihunnikutes",
      "roostikus ja rabas",
      "ainult linnatornis",
      "sügaval kuusikus"
    ],
    "correctAnswer": "mererannikul ja kivihunnikutes",
    "evidenceText": "Kõige sagedamini kohtame kivitäkse mererannikul ja põldudevahelistes kivihunnikutes",
    "questionType": "koht"
  },
  {
    "id": "18-sotkas",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SÕTKAS",
    "sourceCollection": "Linnunädalad",
    "text": "Kas oskate arvata, mida ühist on vene kirjanikul Nikolai Gogolil (1809–1852) ja 1995. aastal valminud Bondi-filmil „Goldeneye“? Gogoli tuntumad teosed on „Surnud hinged“, „Revident“ ja „Õhtud külas Dikanka lähedal“, kuid ühtki neist ega ka muid Gogoli teoseid pole „Goldeneye“ stsenaariumiks kasutatud. Seos on hoopis selline, et nii Gogol kui ka goldeneye tähendavad eesti keeles sõtkast, üks vene, teine inglise keeles. Märtsis algas suur sõtkaste läbiränne, mai keskpaigani kestva rändeperioodi jooksul lendas siit läbi umbes pool miljonit sõtkast.",
    "question": "Mida tähendavad tekstis Gogol ja goldeneye eesti keeles?",
    "options": [
      "sõtkast",
      "kuldnokka",
      "laglet",
      "rähni"
    ],
    "correctAnswer": "sõtkast",
    "evidenceText": "nii Gogol kui ka goldeneye tähendavad eesti keeles sõtkast",
    "questionType": "tegevus"
  },
  {
    "id": "19-metskurvits",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "METSKURVITS",
    "sourceCollection": "Linnunädalad",
    "text": "Metskurvitsa ehk suupärasemalt nepi mängulendude aeg on kestnud juba üle kahe kuu ja ees on veel enam kui kuu. Märtsis jõuavad nad tavaliselt Lääne-Euroopast tagasi ning aprilli algupoolel alustavad niisketes metsatukkades asuvate pesitsusalade kohal õhtuseid lennutiire. Sealjuures vaheldumisi krooksudes ja piiksudes. See on tõeline nepiromantika, kui nad pärast päikeseloojangut üle metsaäärse taluõue tiirutavad.",
    "question": "Millal tiirutavad metskurvitsad üle metsaäärse taluõue?",
    "options": [
      "pärast päikeseloojangut",
      "keskpäeval",
      "enne koitu",
      "talveööl"
    ],
    "correctAnswer": "pärast päikeseloojangut",
    "evidenceText": "pärast päikeseloojangut üle metsaäärse taluõue tiirutavad",
    "questionType": "tegevus"
  },
  {
    "id": "20-vainurastas",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "VAINURÄSTAS",
    "sourceCollection": "Linnunädalad",
    "text": "Eestis elava viie rästaliigi seas on vainurästas pesamuna. Kõige pisem. Aga kuna rästad ei kuulu sugugi mitte meie väiksemate laululindude hulka, vaid vastupidi, hoopis kogukamate, siis ei ole ka vainurästas laululindude seas üldsegi mitte väikest kasvu. Tema 70-grammine kaal ületab meie pisima linnu, pöialpoisi kaalu enam kui kümme korda.",
    "question": "Milline on vainurästas teiste Eesti rästaste seas?",
    "options": [
      "kõige pisem",
      "kõige suurem",
      "kõige värvilisem",
      "kõige raskem"
    ],
    "correctAnswer": "kõige pisem",
    "evidenceText": "Kõige pisem.",
    "questionType": "omadus"
  },
  {
    "id": "21-rukkiraak",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "RUKKIRÄÄK",
    "sourceCollection": "Linnunädalad",
    "text": "Rukkirääk on üks salapärasemaid tiivulisi meie linnustikus. Kõik on tema rääksumist kuulnud, aga vähesed teda näinud. Veel tänapäevalgi arvatakse, et ta rändab talveks jala lõunamaale ja tagasi. See pole muidugi tõsi, ta on päris hea lendaja, aga armastab ennekõike jalgsi liikuda.",
    "question": "Mida on paljud rukkiräägu puhul kuulnud?",
    "options": [
      "rääksumist",
      "ujumist",
      "nokaga toksimist",
      "tiivaplaginat"
    ],
    "correctAnswer": "rääksumist",
    "evidenceText": "Kõik on tema rääksumist kuulnud",
    "questionType": "tegevus"
  },
  {
    "id": "22-pruunselg-poosalind",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "PRUUNSELG-PÕÕSALIND",
    "sourceCollection": "Linnunädalad",
    "text": "Pruunselg-põõsalindu jätkub kõikjale. Alates sellest, kui ta mai keskpaiku Aafrikast naasis. Tõsi küll, metsas teda üldjuhul pole, vaid ikka seal, kus on avarust ja põõsaid. Põõsalinnud vajavad põõsaid.",
    "question": "Kus pruunselg-põõsalind üldjuhul elab?",
    "options": [
      "avaruse ja põõsastega kohtades",
      "sügavas metsas",
      "avamerel",
      "kõrgel mäel"
    ],
    "correctAnswer": "avaruse ja põõsastega kohtades",
    "evidenceText": "seal, kus on avarust ja põõsaid",
    "questionType": "koht"
  },
  {
    "id": "23-kaosulane",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KÄOSULANE",
    "sourceCollection": "Linnunädalad",
    "text": "Kui oleme ajaloos õppinud, et sulased tegid tööd peremeeste heaks ja eks teevad tänapäeva taludeski, siis olgu kohe öeldud, et käosulane ei ole tegelikult käo sulane. Käo sulasteks nimetatakse neid linde, kes käopojad suureks kasvatavad, kelle pessa parasiit kägu oma munad poetab, ning nendeks ohvriteks on meil kõige sagedamini hoopiski linavästrik, hall-kärbsenäpp, kõrkja-roolind, võsaraat, sookiur ja punarind. Käosulane sai kunagi, kui lindudele nimetusi pandi, selleks ekslikult ja jäigi seda nimetust kandma. Üheski teises keeles seda kollase alapoole ja roheka seljaga linnukest käo nimega ei seostata.",
    "question": "Kas käosulane on tegelikult käo sulane?",
    "options": [
      "ei ole",
      "on alati",
      "on ainult talvel",
      "on ainult öösel"
    ],
    "correctAnswer": "ei ole",
    "evidenceText": "käosulane ei ole tegelikult käo sulane",
    "questionType": "detail"
  },
  {
    "id": "24-oosorr",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "ÖÖSORR",
    "sourceCollection": "Linnunädalad",
    "text": "Just suviti muutub looduses ka öösiti põnevaks, elu keeb kõikjal. Ja parim aeg suvise ööeluga tutvumiseks on mõistagi juunikuu, mil ööd kõige valgemad ja lühemad. Öösorri kohtamiseks on parimad võimalused rabamännikutes ja nõmmemetsades, aga ka puisniitudel ja raiesmikel. Öösel peab öösorr jahti lendavatele putukatele.",
    "question": "Kus on öösorri kohtamiseks parimad võimalused?",
    "options": [
      "rabamännikutes ja nõmmemetsades",
      "linnatänavatel",
      "merel",
      "viljapõllul"
    ],
    "correctAnswer": "rabamännikutes ja nõmmemetsades",
    "evidenceText": "Öösorri kohtamiseks on parimad võimalused rabamännikutes ja nõmmemetsades",
    "questionType": "koht"
  },
  {
    "id": "25-suurkoovitaja",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SUURKOOVITAJA",
    "sourceCollection": "Linnunädalad",
    "text": "Suurkoovitaja on kõige suurem kurvitsaline, keda meil kohata võib. Justkui väiksemat sorti hani patseeriks heinamaal … aga nokk reedab, et see ei saa olla ükski teine lind. Sellist pikka ja kaardus nokka teistel pole. Tahtmatult tekib küsimus: kas see talle tüliks pole?",
    "question": "Mis reedab, et lind on suurkoovitaja?",
    "options": [
      "pikk ja kaardus nokk",
      "sinine saba",
      "punased jalad",
      "valge kõht"
    ],
    "correctAnswer": "pikk ja kaardus nokk",
    "evidenceText": "Sellist pikka ja kaardus nokka teistel pole.",
    "questionType": "detail"
  },
  {
    "id": "26-tuttputt",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "TUTTPÜTT",
    "sourceCollection": "Linnunädalad",
    "text": "Mitmesugustel veekogudel, nii merelahtedel kui ka järvedel, isegi suurematel tiikidel ja jõesoppides võib kohata elutsemas vahvaid tutiga veelinde, kel toredad triibulised järglased kannul sibavad. Ja mis seal salata, väiksemana ka isa-ema seljas ratsutavad, pugedes mõnusalt sulgede vahele sooja. Tuttpütt on meie püttide seas suurim ja arvukaim, seetõttu ka kõige tuntum. Eesti peale kokku pesitseb neid paar-kolm tuhat paari.",
    "question": "Mida teevad väiksed tuttpütipojad isa-ema seljas?",
    "options": [
      "ratsutavad",
      "kaevavad",
      "laulavad",
      "püüavad putukaid"
    ],
    "correctAnswer": "ratsutavad",
    "evidenceText": "väiksemana ka isa-ema seljas ratsutavad",
    "questionType": "tegevus"
  },
  {
    "id": "27-piiritaja",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "PIIRITAJA",
    "sourceCollection": "Linnunädalad",
    "text": "Kõik me oleme suvises taevas neid musti, alati kiirustavaid ja teravalt kriiskavaid ehk piiritavaid pikatiivalisi pääsukesesarnaseid linde märganud. Kõrva kriibib nende kisa kindlasti, nägemiseks tarvitseb vaid pea kuklasse ajada. Vähe on neid, kes piiritajat ka muul moel näinud kui lendavana. Sest lennates suurem osa piiritaja elust möödubki.",
    "question": "Kuidas näeb inimene piiritajat kõige sagedamini?",
    "options": [
      "lendavana",
      "ujumas",
      "puutüvel ronimas",
      "maas kõndimas"
    ],
    "correctAnswer": "lendavana",
    "evidenceText": "Vähe on neid, kes piiritajat ka muul moel näinud kui lendavana.",
    "questionType": "tegevus"
  },
  {
    "id": "28-punaselg-ogija",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "PUNASELG-ÕGIJA",
    "sourceCollection": "Linnunädalad",
    "text": "Punaselg-õgija on üks omapärane lind. Suurus nagu varblasel, kombed nagu kullil. Väljanägemine nagu väikesel röövlil, aga tegemist on väga andeka laululinnuga. Tõsi küll, tema laul pole teab mis vali, aga kel õnne laulvale isaslinnule lähedale sattuda, see võib saada korraliku kontserdielamuse. Nimelt on punaselg-õgija väga osav teiste linnulaulude matkija ja nii võibki tema esituses saada ülevaate kogu ümbruskonna linnustikust.",
    "question": "Mida oskab punaselg-õgija väga hästi matkida?",
    "options": [
      "teiste linnulaulusid",
      "inimeste samme",
      "koerte haukumist",
      "vihma häält"
    ],
    "correctAnswer": "teiste linnulaulusid",
    "evidenceText": "väga osav teiste linnulaulude matkija",
    "questionType": "tegevus"
  },
  {
    "id": "29-korkja-roolind",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KÕRKJA-ROOLIND",
    "sourceCollection": "Linnunädalad",
    "text": "Roolinde elab meil mitut liiki ja enamikul on välimuse järgi raske vahet teha, kuid kõrkja-roolind on eriline. Temale piisab vaid pilgust näkku ja pilt selge. Kui teda tunda. Nimelt on kõrkja-roolinnul nii tähelepanuväärne lai hele kulmutriip, et see paistab kaugele.",
    "question": "Mis paistab kõrkja-roolinnul kaugele?",
    "options": [
      "lai hele kulmutriip",
      "punane nokk",
      "pikk tutt",
      "kollane silm"
    ],
    "correctAnswer": "lai hele kulmutriip",
    "evidenceText": "lai hele kulmutriip",
    "questionType": "detail"
  },
  {
    "id": "30-tommukajakas",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "TÕMMUKAJAKAS",
    "sourceCollection": "Linnunädalad",
    "text": "Kajakaid kohtame kõikjal, küll rannikul, saartel, linnades, rände ajal ka sisemaa põldudel. Võib tunduda, et ühed kajakad kõik, mõned lihtsalt suuremat, teised väiksemat kasvu. Ka talvel on mere ääres ja linnades neid üksjagu, mõned Rakvereski. Aga päris nii see pole, et ühed kajakad kõik, Eestis pesitseb kuus kajakaliiki. Ja tõmmukajakas, kellest seekord juttu tuleb, on nende seas ainuke kaugrändur.",
    "question": "Mitu kajakaliiki pesitseb Eestis?",
    "options": [
      "kuus",
      "kaks",
      "kümme",
      "üks"
    ],
    "correctAnswer": "kuus",
    "evidenceText": "Eestis pesitseb kuus kajakaliiki",
    "questionType": "detail"
  },
  {
    "id": "31-soo-roolind",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SOO-ROOLIND",
    "sourceCollection": "Linnunädalad",
    "text": "Mina seda lindu nägupidi ära ei tunneks, kui ta mulle kusagil vaikides vastu trehvaks. Ega vist enamik linnuteadlasigi teda põgusa välise vaatluse põhjal teistest roolindudest eristada ei suudaks. Küll aga lähemalt uurides. Soo-roolinnu äratundmiseks on vaja kuulda tema laulu ja see on selline, mis teinud linnu kuulsaks üle maailma. Tema laul on ainulaadne.",
    "question": "Mida on vaja soo-roolinnu äratundmiseks kuulda?",
    "options": [
      "tema laulu",
      "tiivaplaginat",
      "vee sulinat",
      "jala krõbinat"
    ],
    "correctAnswer": "tema laulu",
    "evidenceText": "Soo-roolinnu äratundmiseks on vaja kuulda tema laulu",
    "questionType": "tegevus"
  },
  {
    "id": "32-metsis",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "METSIS",
    "sourceCollection": "Linnunädalad",
    "text": "Metsis on uhke lind. Õigemini, kevadel mängiva metsisekuke nägemine on uhke vaatepilt. Aprillis on kuked kõige enam mänguhoos. Ainult et nende imetlemine sealjuures eriti reaalne polegi.",
    "question": "Millal on metsisekuked kõige enam mänguhoos?",
    "options": [
      "aprillis",
      "detsembris",
      "augustis",
      "jaanuaris"
    ],
    "correctAnswer": "aprillis",
    "evidenceText": "Aprillis on kuked kõige enam mänguhoos.",
    "questionType": "tegevus"
  },
  {
    "id": "33-alk",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "ALK",
    "sourceCollection": "Linnunädalad",
    "text": "Alk meil päris igapäevane lind ei ole. Vähemalt suuremal osal Eestist. Ega sisemaal ei kohta teda niikuinii mitte kunagi, sest sinna pole tal asja, alk kuulub kokku merega. Samas, ega Võsu rannas ka alki ei kohta, olgugi et on meri.",
    "question": "Millega kuulub alk kokku?",
    "options": [
      "merega",
      "põlluga",
      "linnatänavaga",
      "kuusemetsaga"
    ],
    "correctAnswer": "merega",
    "evidenceText": "alk kuulub kokku merega",
    "questionType": "detail"
  },
  {
    "id": "34-karkjalg",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KARKJALG",
    "sourceCollection": "Linnunädalad",
    "text": "Kummalise nimetuse ja väljanägemisega lind – karkjalg – Eestis üldjuhul ei pesitse, kuid viimastel aastakümnetel on vahetevahel siia imekombel siiski sattunud. Esimest korda vaadeldi teda Tallinnas Paljassaares 1997. aastal ning kui minul oli õnne 2013. aasta maikuus karkjalaga Harjumaal Vandjalas kohtuda, oli see alles seitsmes karkjala kohtamine Eestis. Ning pärast seda pole ta siia igal aastal sattunud, küll aga 2015 Tartumaale ja 2016 Pärnumaale ning 2022 koguni pesitses üks karkjalapaar Pärnumaal Valgerannas. Ja ka mullu toimus tõenäoliselt Pärnumaal pesitsemine. Niisiis tasub eriti kuumalainete aegu tähelepanelik olla, sest mine tea, miks ei võiks mõni isend ka Lääne-Viru maakonda sattuda… Igal juhul on ta lind, kelle kohtudes kohe ära tunneks, sest segamini pole teda kellegagi ajada, sarnaseid „kloune“ linnuriigis rohkem pole.",
    "question": "Kas karkjalg pesitseb Eestis üldjuhul?",
    "options": [
      "ei pesitse",
      "pesitseb igas aias",
      "pesitseb ainult linnas",
      "pesitseb igal saarel"
    ],
    "correctAnswer": "ei pesitse",
    "evidenceText": "Eestis üldjuhul ei pesitse",
    "questionType": "detail"
  },
  {
    "id": "35-vihitaja",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "VIHITAJA",
    "sourceCollection": "Linnunädalad",
    "text": "Vihitajat kohtame jõe ääres. Tõsi, võime trehvata ka mõne järvekese kaldal või mererannikul, aga tema teine nimetuski – jõgitilder reedab vihitaja lemmikelupaiga. Nüüd, juulis-augustis kipuvad vihitajale juba lõunamaareisi mõtted pähe, aga enne vaja veel lapsed suureks kasvatada. Põhja pool pesitsenud vihitajaid aga kohtab juba läbirändel. Minna on kaugele, vihitajad veedavad talve Kesk- või Lõuna-Aafrikas, Indias ja Austraalias.",
    "question": "Mis reedab vihitaja lemmikelupaiga?",
    "options": [
      "teine nimetus jõgitilder",
      "sinine sulestik",
      "punane saba",
      "pesa kuju"
    ],
    "correctAnswer": "teine nimetus jõgitilder",
    "evidenceText": "teine nimetuski – jõgitilder reedab vihitaja lemmikelupaiga",
    "questionType": "detail"
  },
  {
    "id": "36-vaenukagu",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "VAENUKÄGU",
    "sourceCollection": "Linnunädalad",
    "text": "Mõnda lindu kohtab Eestis päris harva. Vaenukägu on üks sellistest. Aga kui kas või korragi temaga õnnestub kokku trehvata, jääb eluks ajaks meelde. Ta ju näeb nii vahva välja! Olgugi et pungi hiilgeajad on jäänud möödunud sajandi kaheksakümnendatesse, kannab vaenukägu punkarisoengut uhkelt edasi.",
    "question": "Mida kannab vaenukägu uhkelt edasi?",
    "options": [
      "punkarisoengut",
      "valget mütsi",
      "pikka saba",
      "kuldset tuti"
    ],
    "correctAnswer": "punkarisoengut",
    "evidenceText": "kannab vaenukägu punkarisoengut uhkelt edasi",
    "questionType": "tegevus"
  },
  {
    "id": "37-valge-toonekurg",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "VALGE-TOONEKURG",
    "sourceCollection": "Linnunädalad",
    "text": "Toonekurepojad on suureks kasvanud. Peagi õpivad lendama. Aga on ka viimane aeg, ligi kaks kuud on pesas kasvamisega vaeva nähtud. Augustipäevad saavad olema selleks, et harjuda iseseisva eluga ning koguda elutarkust. Kuu lõpus tuleb juba ette võtta tõsine reis tuhandete kilomeetrite taha, Türgi ja Iisraeli kaudu Egiptusesse, kust edasi piki Niiluse kallast Lõuna-Aafrikasse välja.",
    "question": "Mida õpivad toonekurepojad peagi tegema?",
    "options": [
      "lendama",
      "ujuma",
      "kaevama",
      "laulma"
    ],
    "correctAnswer": "lendama",
    "evidenceText": "Peagi õpivad lendama.",
    "questionType": "tegevus"
  },
  {
    "id": "38-hahk",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HAHK",
    "sourceCollection": "Linnunädalad",
    "text": "Eks isahahal ole sama lame laup, aga tal on vähemalt kevadel uhke pulmaülikond: pealt valge, alt must, eest roosakas ja kaelalt heleroheline. Praegu, keset suve, pole aga neilgi millegagi uhkeldada. Ebamäärase sulestikuga suuri parte ei osata ehk hahkadeks pidadagi, küll aga tuntakse paremini pruuni kaitsevärvusega hahaemasid, sest nemad osutavad inimkonnale väga olulist teenust. Üldse mitte eesmärgipäraselt, aga ometi nii, et nad ise sellest kuidagi kahjustada ei saa. Nimelt on haha udusuled, mida emahahk pesal haududes oma rinnalt pesavooderduseks kitkub, kõige kergem ja soojem materjal, millega vooderdatakse nii jopesid kui ka magamiskotte.",
    "question": "Milleks kasutatakse haha udusulgi?",
    "options": [
      "jopede ja magamiskottide vooderdamiseks",
      "pesakastide tegemiseks",
      "munade värvimiseks",
      "nokkade teritamiseks"
    ],
    "correctAnswer": "jopede ja magamiskottide vooderdamiseks",
    "evidenceText": "vooderdatakse nii jopesid kui ka magamiskotte",
    "questionType": "detail"
  },
  {
    "id": "39-hall-karbsenapp",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HALL-KÄRBSENÄPP",
    "sourceCollection": "Linnunädalad",
    "text": "Juba mai lõpust on paljudel meist koduaias toimetamas üks tagasihoidliku väljanägemisega vaikne linnuke. Sulestik on tal hallides toonides, alapool heledam, rinnal tumedamad triibud. Kuna hall-kärbsenäpil ka õiget laulu pole, võikski ta jääda märkamata, kuid nähtavaks oskab ta ennast käitumisega teha. Hall-kärbsenäpp ei pelga inimest, seetõttu jagab meelsasti inimesega ka elupaika. Tema lemmikistumiskohad võivad asuda aiateibal või hernekepil, aiatooli seljatoel või pesunööril.",
    "question": "Kas hall-kärbsenäpp pelgab inimest?",
    "options": [
      "ei pelga",
      "pelgab alati",
      "pelgab ainult suvel",
      "pelgab ainult metsas"
    ],
    "correctAnswer": "ei pelga",
    "evidenceText": "Hall-kärbsenäpp ei pelga inimest",
    "questionType": "detail"
  },
  {
    "id": "40-mustpea-poosalind",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "MUSTPEA-PÕÕSALIND",
    "sourceCollection": "Linnunädalad",
    "text": "Peaaegu et kolm viimast kuud on mustpea-põõsalind võimaldanud meil kuulata imepuhta kõlaga kaunist linnulaulu. Vähemalt minu kõrva jaoks kõlavad tema lauldavad flöödihelid kuidagi eriti selge ja kõlava tämbriga. Nüüdseks hakkab küll lauluaeg läbi saama, aga eks tuleval kevadel, juba aprillis on ta taas platsis. Mustpea-põõsalinnu laulu peetakse meie laululindude seas kolmanda koha vääriliseks ööbiku ja laulurästa järel.",
    "question": "Millise koha vääriliseks peetakse mustpea-põõsalinnu laulu?",
    "options": [
      "kolmanda koha",
      "esimese koha",
      "viimase koha",
      "kümnenda koha"
    ],
    "correctAnswer": "kolmanda koha",
    "evidenceText": "laulu peetakse meie laululindude seas kolmanda koha vääriliseks",
    "questionType": "detail"
  },
  {
    "id": "41-merisk",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "MERISK",
    "sourceCollection": "Linnunädalad",
    "text": "Rahvasuus meriharakaks või randharakaks kutsutavad mustvalged pika punase noka ning punaste jalgade ja punaste silmadega rannikulinnud, äsja ellu astunud meriskinoorukite vanemad, saabusid talvitusaladelt, milleks olid Lääne-Euroopa mererannad, juba märtsi lõpus või aprilli alguses. Siis nad kohe ka sobiva ranna välja valisid. Sest nende elu on ikka mererannikuga seotud, olgu suvel või talvel. Siin on nad üpris lärmakad ja meiesuguste vastu usaldamatud.",
    "question": "Millise nokaga on merisk tekstis kirjeldatud?",
    "options": [
      "pika punase nokaga",
      "lühikese sinise nokaga",
      "laia kollase nokaga",
      "musta kõvera nokaga"
    ],
    "correctAnswer": "pika punase nokaga",
    "evidenceText": "pika punase noka",
    "questionType": "detail"
  },
  {
    "id": "42-salu-lehelind",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SALU-LEHELIND",
    "sourceCollection": "Linnunädalad",
    "text": "Salu-lehelind saabus juba aprilli lõpupäevadel. Praegu ei kipu tema laulu enam kuulma, sest peamine lauluaeg on möödas, pesitsusaeg läbi. Mais-juunis kostus see kõikjal, kus puid-põõsaid kasvamas – metsades, võsastikes, puisniitudel. Isegi linnaparkides ja rabamännikutes. Sest salu-lehelind, olles ise küll üks meie pisemaid linde, on ka üks arvukamaid.",
    "question": "Millal saabus salu-lehelind?",
    "options": [
      "aprilli lõpupäevadel",
      "jaanuari alguses",
      "septembri keskel",
      "detsembris"
    ],
    "correctAnswer": "aprilli lõpupäevadel",
    "evidenceText": "Salu-lehelind saabus juba aprilli lõpupäevadel.",
    "questionType": "tegevus"
  },
  {
    "id": "43-hanilane",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HÄNILANE",
    "sourceCollection": "Linnunädalad",
    "text": "Kui juhtute kollast linavästrikku kohtama, pole see ei sidrunit mängiv ega kollatõbine linavästrik, vaid hoopis hänilane. Linavästriku sugulane on ta aga küll ja mitmes teises keeles kannabki tegelikult kollase linavästriku nimetust. Näiteks soome ja vene keeles. Eesti keeles nimetati teda aga aastakümneid tagasi lambahänilaseks.",
    "question": "Mis lind pole kollane linavästrik tekstis tegelikult?",
    "options": [
      "linavästrik",
      "hänilane",
      "rasvatihane",
      "hallrästas"
    ],
    "correctAnswer": "hänilane",
    "evidenceText": "vaid hoopis hänilane",
    "questionType": "detail"
  },
  {
    "id": "44-raastapaasuke",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "RÄÄSTAPÄÄSUKE",
    "sourceCollection": "Linnunädalad",
    "text": "Niisama nagu oleksid keraamikud tööta ilma savita, oleks ilma selle ehitusmaterjalita räästapääsukesedki pesadeta. Kuigi laulusalm ütleb: „Pääsuke mu akna taga poegadele pesa teeb, kord ta kannab kõrsi nokas, kord toob pehmeid ebemeid…“, on nii suitsu- kui ka räästapääsukestel olulisim ehitusmaterjal siiski savi. Kõrsi ja pehmemat ainest läheb tarvis alles siis, kui savist kumer ehitis räästa alla on õnnestunud mätsida. Räästapääsukesed jäävad hätta, kui savi ümbruskonnas ei leidu ja ka põuaperioodil.",
    "question": "Mis on räästapääsukese olulisim ehitusmaterjal?",
    "options": [
      "savi",
      "kivid",
      "käbid",
      "tammetõrud"
    ],
    "correctAnswer": "savi",
    "evidenceText": "olulisim ehitusmaterjal siiski savi",
    "questionType": "detail"
  },
  {
    "id": "45-randtiir",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "RANDTIIR",
    "sourceCollection": "Linnunädalad",
    "text": "Tiirudel on praegu tõsised tiirutamise ajad käsil. Eriti randtiirudel. On ju selle linnu käes absoluutne lindude rändeteekonna pikkuse rekord. Mitte ükski teine lind ei läbi kaks korda aastas rännuteedel randtiiruga ligilähedasigi vahemaid. Isegi kui randtiirud otse pesitsusaladelt talvitusaladele lendaks, oleksid nad kindlad rekordiomanikud, sest nende kõige põhjapoolsemad pesitsusalad asuvad Arktikas ja talvitusalad lausa Antarktikas.",
    "question": "Mis rekord on randtiiri käes?",
    "options": [
      "rändeteekonna pikkuse rekord",
      "munade suuruse rekord",
      "laulu pikkuse rekord",
      "pesa kõrguse rekord"
    ],
    "correctAnswer": "rändeteekonna pikkuse rekord",
    "evidenceText": "rändeteekonna pikkuse rekord",
    "questionType": "detail"
  },
  {
    "id": "46-kanepilind",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KANEPILIND",
    "sourceCollection": "Linnunädalad",
    "text": "Kanepilinde ootasime talvepuhkuselt tagasi juba märtsis, kuu lõpus on nad tavaliselt kohal. Tõsi küll, enamasti oodatakse eelkõige kuldnokki, lõokesi ja kiivitajaid, sest neid linde tuntakse paremini. Kanepilinde igaüks ei tunne, aga ometi on nad tundma õppimist väärt. Pesitsevad ju nemadki sageli meie koduaedades, parkides ja kalmistutel nii nagu kuldnokad. Ainult et nemad ei vaja pesitsemiseks pesakaste, vaid tihedaid põõsaid.",
    "question": "Mida vajavad kanepilinnud pesitsemiseks?",
    "options": [
      "tihedaid põõsaid",
      "pesakaste",
      "rannakive",
      "puuõõnsusi"
    ],
    "correctAnswer": "tihedaid põõsaid",
    "evidenceText": "ei vaja pesitsemiseks pesakaste, vaid tihedaid põõsaid",
    "questionType": "tegevus"
  },
  {
    "id": "47-tuuletallaja",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "TUULETALLAJA",
    "sourceCollection": "Linnunädalad",
    "text": "Inimesed nimetavad tuuletallajaiks tühikargajaid, kelle vehklemisest mingit tulemust ei paista. Linnuriigis aga kannab õigustatult seda nimetust lind, kes tuule tallamisega endale „leiba teenib“. Nii et kui tuuletallaja tühja tuult tallaks, oleks ta ammugi välja surnud. Temale ei ole tuul tühi. Tuuletallaja leiab oma saagi peamiselt maapinnalt, kuid varitseb seda õhust.",
    "question": "Kust leiab tuuletallaja oma saagi peamiselt?",
    "options": [
      "maapinnalt",
      "vee alt",
      "puukoore alt",
      "õunapuult"
    ],
    "correctAnswer": "maapinnalt",
    "evidenceText": "leiab oma saagi peamiselt maapinnalt",
    "questionType": "koht"
  },
  {
    "id": "48-ohakalind",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "OHAKALIND",
    "sourceCollection": "Linnunädalad",
    "text": "Ohakalindu kohates võib esmapilgul tekkida kahtlus, kas mõni puurilind on koduaknast välja pääsenud. Selliseid kauneid kirju sulestikuga vidistajaid oleme ju siin põhjapoolkeral harjunud pigem puurides pidama ja metsalinnud näevad tagasihoidlikumad välja. Kuid ohakalind on tegelikult meil täiesti tavaline looduslik linnuliik, vaatamata veidi eksootilisele sulestikule. Ka igas Lääne-Virumaa pargis ja suuremates aedades. Ega tal ju teab mis imevärve polegi – punane nägu, kollane tiivatriip, valged põsed, kõhu- ja sabaalune, mustad tiivad, saba, pealagi ja kukal, pruunikas selg ja rind.",
    "question": "Milline nägu on ohakalinnul tekstis mainitud?",
    "options": [
      "punane",
      "sinine",
      "roheline",
      "hall"
    ],
    "correctAnswer": "punane",
    "evidenceText": "punane nägu",
    "questionType": "omadus"
  },
  {
    "id": "49-lepalind",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "LEPALIND",
    "sourceCollection": "Linnunädalad",
    "text": "Lapsed pakivad ranitsaid ning sätivad kooli minema, lepalinnud aga pugivad veel viimaseid eestimaiseid putukaid ning sätivad sulgi Aafrika-reisiks korda. Lepalind on nimetuse saanud „lepakarva“ rinnaesisest ja sabast. Isegi kui näeme teda vaid hetkeks, enne kui ta varjuda jõuab, võimaldab tema ergas saba ta ära määrata. Teisi „tulisabasid“ meie värvuliste hulgas pole.",
    "question": "Mille järgi saab lepalindu hästi ära määrata?",
    "options": [
      "erksa saba järgi",
      "sinise noka järgi",
      "pikkade jalgade järgi",
      "valge pea järgi"
    ],
    "correctAnswer": "erksa saba järgi",
    "evidenceText": "võimaldab tema ergas saba ta ära määrata",
    "questionType": "detail"
  },
  {
    "id": "50-must-toonekurg",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "MUST-TOONEKURG",
    "sourceCollection": "Linnunädalad",
    "text": "Õige pea, septembris, lahkuvad meilt pikale rännuteele viimased must-toonekured. Ei ole muidugi mõtet õue joosta ega traatidelt mustavaid toonekureparvi otsida, seal istuvad hoopis väiksemad linnud. Must-toonekurge näeme üldse väga harva, mitte ainult sügisel. Ka kevadel ja suvel me neid eriti ei näe, kuna must-toonekured erinevalt valge-toonekurgedest hoiduvad inimestest eemale, laante sügavustesse.",
    "question": "Miks näeme must-toonekurge harva?",
    "options": [
      "ta hoidub inimestest eemale",
      "ta elab ainult linnas",
      "ta ei oska lennata",
      "ta on väga lärmakas"
    ],
    "correctAnswer": "ta hoidub inimestest eemale",
    "evidenceText": "hoiduvad inimestest eemale",
    "questionType": "detail"
  }
] satisfies KiurReadingTask[];

function isValidKiurReadingTask(task: KiurReadingTask) {
  return task.learner === 'kiur'
    && task.subject === 'lugemine'
    && task.exercise === 'loe-ja-vasta'
    && task.text.trim().length > 0
    && task.question.trim().length > 0
    && task.options.length === 4
    && new Set(task.options).size === task.options.length
    && task.options.includes(task.correctAnswer)
    && task.evidenceText.trim().length > 0
    && task.text.includes(task.evidenceText)
    && task.sourceTitle.trim().length > 0
    && task.sourceAuthor.trim().length > 0;
}

export function getValidKiurReadingTasks() {
  const validTasks = KIUR_READING_TASKS.filter(isValidKiurReadingTask);

  if (process.env.NODE_ENV !== 'production' && validTasks.length !== KIUR_READING_TASKS.length) {
    const invalidIds = KIUR_READING_TASKS
      .filter((task) => !isValidKiurReadingTask(task))
      .map((task) => task.id);
    console.warn('Invalid Kiur reading tasks were skipped:', invalidIds);
  }

  return validTasks;
}
