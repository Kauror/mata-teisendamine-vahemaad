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
  },
  {
    "id": "51-tulipart",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "TULIPART",
    "sourceCollection": "Linnunädalad",
    "text": "Veel kümmekonna aasta eest poleks osanud arvata, et Eestis pole tulipardi kohtamine enam mingi harukordne juhtum. See pigem hane kui parti meenutav eksoot on tavapärane pesitseja hoopiski Põhja-Aafrikas, Kesk- ja Sise-Aasias ning Kagu-Euroopas Türgis, Kreekas, Bulgaarias ja Rumeenias. Seega oluliselt soojema kliimaga aladel kui meie kodumaa.",
    "question": "Kus on tulipart tavapärane pesitseja?",
    "options": [
      "Põhja-Aafrikas ja Aasias",
      "Eestis igas maakonnas",
      "Gröönimaal",
      "Antarktikas"
    ],
    "correctAnswer": "Põhja-Aafrikas ja Aasias",
    "evidenceText": "tavapärane pesitseja hoopiski Põhja-Aafrikas, Kesk- ja Sise-Aasias",
    "questionType": "detail"
  },
  {
    "id": "52-nurmkana",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "NURMKANA",
    "sourceCollection": "Linnunädalad",
    "text": "Nurmkanaseltskond, keda me praegu ringi näeme sibamas, on suvine perekond – isa, ema ja lapsed. Niimoodi üheskoos veedavad nad aega kevadeni, mil otsivad omale paarilised. Ja praeguse seltskonna suurus oleneb sellest, kui paljudel lastel on õnnestunud ellu jääda. Nurmkanadel on paljulapselised pered, lapsi võib kooruda üle kahekümne!",
    "question": "Kes kuuluvad tekstis kirjeldatud nurmkanaseltskonda?",
    "options": [
      "isa, ema ja lapsed",
      "ainult isaslinnud",
      "ainult pojad",
      "kaks vanaema"
    ],
    "correctAnswer": "isa, ema ja lapsed",
    "evidenceText": "suvine perekond – isa, ema ja lapsed",
    "questionType": "detail"
  },
  {
    "id": "53-herilaseviu",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HERILASEVIU",
    "sourceCollection": "Linnunädalad",
    "text": "Herilaseviu on üks hilisemaid saabujaid rändlindude hulgas ning sellel on mõistagi kindel põhjus. Varem pole siin suhu pista suurt midagi, mis oleks talle nokka mööda. Nimelt on tema lemmikroog herilaste ja kimalaste vastsed ning neid varakevadel võtta pole. Tõsi küll, ta menüüsse kuuluvad ka konnad, rohutirtsud, hiired, linnupojad, mardikad ja muu taoline, aga alles siis, kui põhitoitu parasjagu silmapiiril pole.",
    "question": "Mis on herilaseviu lemmikroog?",
    "options": [
      "herilaste ja kimalaste vastsed",
      "pihlakamarjad",
      "kirsikivid",
      "vesiroosiseemned"
    ],
    "correctAnswer": "herilaste ja kimalaste vastsed",
    "evidenceText": "tema lemmikroog herilaste ja kimalaste vastsed",
    "questionType": "detail"
  },
  {
    "id": "54-kaelustuvi",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KAELUSTUVI",
    "sourceCollection": "Linnunädalad",
    "text": "Meigastel on turismihooaeg. Meigas ongi kaelustuvi, sel linnul on kaks nimetust. Terve septembri reisivad Soome ja Venemaa tuvidest turistid läbi Maarjamaa Lääne-Euroopa suunas. Sinnasamasse võtavad suuna ka meie endi tuvid. Vaid mõned üksikud jäävad talve uudistama.",
    "question": "Mis lind on meigas?",
    "options": [
      "kaelustuvi",
      "kodutuvi",
      "rabahani",
      "hallrästas"
    ],
    "correctAnswer": "kaelustuvi",
    "evidenceText": "Meigas ongi kaelustuvi",
    "questionType": "detail"
  },
  {
    "id": "55-rabahani",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "RABAHANI",
    "sourceCollection": "Linnunädalad",
    "text": "Märtsis-aprillis-mais ning septembrist novembrini peatuvad meie põldudel kümned tuhanded haned. Rabahanedel on pea ja kael tumepruunid, selg ja kõht hallikaspruunid. Mustal nokal on ere oranž muster, jalad on samuti erkoranžid, justkui helkurid liiklusohutuse tagamiseks. Laukhanesid saab neist eristada kirju kõhualuse järgi ning valge otsaesine aitab neid ära tunda lähemal vaatlusel.",
    "question": "Mis värvi muster on rabahane mustal nokal?",
    "options": [
      "ere oranž",
      "hele sinine",
      "tumeroheline",
      "valge"
    ],
    "correctAnswer": "ere oranž",
    "evidenceText": "Mustal nokal on ere oranž muster",
    "questionType": "detail"
  },
  {
    "id": "56-hobehaigur",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HÕBEHAIGUR",
    "sourceCollection": "Linnunädalad",
    "text": "Hõbehaigur on nii valge sulestikuga, kui üldse olla saab. Valge nagu luik ja üpris suur lind, kuid suuruselt jääb luigele siiski tublisti alla. Meie suurima linnu kühmnokk-luigega võrreldes on ta kehakaal ligi kümme korda väiksem. Samas ega tiibade siruulatus luige omast palju ei erinegi, ligikaudu 1,5 meetrit luige 2–2,4 meetri vastu.",
    "question": "Millise värvusega on hõbehaigru sulestik?",
    "options": [
      "valge",
      "must",
      "roheline",
      "sinine"
    ],
    "correctAnswer": "valge",
    "evidenceText": "Hõbehaigur on nii valge sulestikuga",
    "questionType": "detail"
  },
  {
    "id": "57-veetallaja",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "VEETALLAJA",
    "sourceCollection": "Linnunädalad",
    "text": "Värvus on kevadistel ja sügisestel veetallajatel üpris erinev. Kevaditi on kaelaküljed punakat tooni, sügiseti on linnud mustvalged, kuid ära tunneme nad ennekõike iseloomuliku vee tallamise tõttu. Tegelikult näeme seda, et need linnud püsivad vee peal kergelt kui korgid ning keerlevad ühe koha peal, napsates aina välkkiirete liigutustega vee pealt putukaid. Samal ajal teevad nende jalakesed vee all aktiivset tallamistööd, mille tõttu veeputukad pinnale tõusevad ning sedasi ta neid enda ümbert noppida saabki.",
    "question": "Mille järgi saab veetallajat tekstis ära tunda?",
    "options": [
      "vee tallamise järgi",
      "pika saba järgi",
      "punase noka järgi",
      "puutüvel ronimise järgi"
    ],
    "correctAnswer": "vee tallamise järgi",
    "evidenceText": "ära tunneme nad ennekõike iseloomuliku vee tallamise tõttu",
    "questionType": "detail"
  },
  {
    "id": "58-sookurg",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SOOKURG",
    "sourceCollection": "Linnunädalad",
    "text": "September on sookurgede rännuaeg. Kuresõpradele tõeline tipphetk. Ühelgi teisel ajal aastas pole meil nii palju sookurgi liikvel, eriti veel suurte seltskondadena. Meie oma sookurgedele lisandub suurte parvedena külalisi põhjast ja kirdest – Soomest, Karjalast ja Leningradi oblastist Venemaalt.",
    "question": "Millal on sookurgede rännuaeg?",
    "options": [
      "septembris",
      "jaanuaris",
      "juunis",
      "märtsis"
    ],
    "correctAnswer": "septembris",
    "evidenceText": "September on sookurgede rännuaeg.",
    "questionType": "detail"
  },
  {
    "id": "59-mansak",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "MÄNSAK",
    "sourceCollection": "Linnunädalad",
    "text": "Mänsakud on kõige häälekamad sügisel. Nende nurrumist on augustist saati koduõuelegi kuulda. Seda muidugi juhul, kui kodu metsaserval paikneb. Minul on see õnn ja harva juhtub, et mõni päev mänsakuta möödub. Linnas mänsakut ei kohta ning temaga kohtumiseks tuleb ette võtta metsas käik.",
    "question": "Kus tuleb mänsakuga kohtumiseks käia?",
    "options": [
      "metsas",
      "linnatänaval",
      "mererannas",
      "koolimajas"
    ],
    "correctAnswer": "metsas",
    "evidenceText": "temaga kohtumiseks tuleb ette võtta metsas käik",
    "questionType": "detail"
  },
  {
    "id": "60-hallrastas",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HALLRÄSTAS",
    "sourceCollection": "Linnunädalad",
    "text": "Rästaste parvi on septembris-oktoobris kõikjal ohtralt liikvel. Eelkõige just hallrästaid. Neil pole rändeteele asumisega sugugi kiiret. Hallrästaid märkame ka talvisel ajal, mõnes asulas üksikuna või paarikaupa, sageli aga suuremate salkadena ringi liikumas. Kuni on puudel-põõsastel õunu ja marju, on ka hallrästaid.",
    "question": "Mida peab olema puudel-põõsastel, et hallrästaid näha?",
    "options": [
      "õunu ja marju",
      "kalu ja konni",
      "käbisid ja kive",
      "sulgi ja oksi"
    ],
    "correctAnswer": "õunu ja marju",
    "evidenceText": "Kuni on puudel-põõsastel õunu ja marju, on ka hallrästaid.",
    "questionType": "detail"
  },
  {
    "id": "61-hobekajakas",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HÕBEKAJAKAS",
    "sourceCollection": "Linnunädalad",
    "text": "Hõbekajakat võime kohata erinevais paigus. Linnainimestele on ta tuttav tänavailt, saarlastele ja rannarahvale mererannikult ning maainimestele laukarabadest. Kuna noored hõbekajakad valivad elupaigaks enamasti selle, kus nad üles on kasvanud, ning elavad seal kogu elu, võibki neid tinglikult jagada rabakajakateks, linnakajakateks ja merekajakateks. Noored asuvad pesitsema alles neljandal eluaastal, kuid kui lindudel hästi läheb, võivad nad elada vähemalt 20-aastaseks.",
    "question": "Kuhu võib hõbekajakaid tekstis jagada?",
    "options": [
      "rabakajakateks, linnakajakateks ja merekajakateks",
      "ainult metsalindudeks",
      "ainult kodulindudeks",
      "laululindudeks ja rähnideks"
    ],
    "correctAnswer": "rabakajakateks, linnakajakateks ja merekajakateks",
    "evidenceText": "jagada rabakajakateks, linnakajakateks ja merekajakateks",
    "questionType": "detail"
  },
  {
    "id": "62-hallhani",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HALLHANI",
    "sourceCollection": "Linnunädalad",
    "text": "Hallhaned on kevadel väga varased saabujad. Esimesi võib läänesaartel trehvata veebruari lõpupäevil, kuid märtsi algusest peale on nende tulekul juba hoog sees. Kui tekib küsimus, kuidas aru saada, et saabujad just hallhaned, mitte raba- või laukhaned on, siis neid polegi väga raske eristada. Kui neid piisavalt lähedalt näeme. Nimelt on hallhanel suur üleni oranž nokk ja sulestik heledam kui teistel hanedel, ise on ta aga pisut suurem.",
    "question": "Milline nokk on hallhanel?",
    "options": [
      "suur üleni oranž nokk",
      "väike must nokk",
      "sinine nokk",
      "roheline nokk"
    ],
    "correctAnswer": "suur üleni oranž nokk",
    "evidenceText": "hallhanel suur üleni oranž nokk",
    "questionType": "detail"
  },
  {
    "id": "63-vaike-lehelind",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "VÄIKE-LEHELIND",
    "sourceCollection": "Linnunädalad",
    "text": "Väike-lehelinnu laul on küll vist kõigile inimestele tuttav. Hoopis vähem on muidugi neid, kes oskavad selle lauljat nimetada. Väga üksikud aga suudavad ta ka näo järgi ära tunda. Aprilli lõpust oleme kuulnud kõikjal, kus vähegi puid ja põõsaid kasvamas, tema tuttavat hitti „tsilp-tsalp-tsilp-tsalp…“.",
    "question": "Milline on väike-lehelinnu tuttav laul?",
    "options": [
      "tsilp-tsalp",
      "kuk-ku",
      "kraa-kraa",
      "piip-piip"
    ],
    "correctAnswer": "tsilp-tsalp",
    "evidenceText": "tuttavat hitti „tsilp-tsalp-tsilp-tsalp…“",
    "questionType": "detail"
  },
  {
    "id": "64-korvukrats",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KÕRVUKRÄTS",
    "sourceCollection": "Linnunädalad",
    "text": "Vahva nimetus sel linnul. Lind ise on ka põnev tegelane. Ja üldse mitte selline, kes peidab end metsasügavustes. Ta võib suisa meie koduaeda elama asuda, kui sealt sobivad tingimused leiab. Kõrge kuusehekk näiteks ja selles mõni vana haraka- või varesepesa.",
    "question": "Kuhu võib kõrvukräts sobivatel tingimustel elama asuda?",
    "options": [
      "koduaeda",
      "ainult avamerele",
      "kõrbe",
      "koolimajja"
    ],
    "correctAnswer": "koduaeda",
    "evidenceText": "Ta võib suisa meie koduaeda elama asuda",
    "questionType": "detail"
  },
  {
    "id": "65-kalakajakas",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KALAKAJAKAS",
    "sourceCollection": "Linnunädalad",
    "text": "Kalakajakas on meil üks tavalisemaid kajakaliike. Kohtame teda elutsemas ja pesitsemas nii rannikul ja saartel kui ka siseveekogudel ja rabades ning linnadeski. Tõsi küll, nii veidi väiksem pruunipäine naerukajakas kui ka tükk maad suurem hõbekajakas on arvukamad, kuid kalakajakaidki pesitseb meil 7000 – 10 000 paari. Piisavalt, et igaühele silma jääda.",
    "question": "Milline kajakaliik on kalakajakas Eestis?",
    "options": [
      "üks tavalisemaid kajakaliike",
      "kõige haruldasem lind",
      "ainult talvelind",
      "ainult puurilind"
    ],
    "correctAnswer": "üks tavalisemaid kajakaliike",
    "evidenceText": "Kalakajakas on meil üks tavalisemaid kajakaliike.",
    "questionType": "detail"
  },
  {
    "id": "66-lauk",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "LAUK",
    "sourceCollection": "Linnunädalad",
    "text": "Enamik laukusid naudib talve siiski Lääne-Euroopas või lausa Põhja-Aafrikas ning saabub meie vetele tagasi märtsis. Neid on lihtne kõigi teiste veelindude seas ära tunda, süsimusta sulestiku taustal helgib kaugele valge laubakilp. Lähemalt vaadeldes näeme ka punaseid silmi, mis pole sugugi magamatusest punased, vaid neile loomupärased.",
    "question": "Mille järgi on lauk teiste veelindude seas lihtne ära tunda?",
    "options": [
      "valge laubakilbi järgi",
      "kollase saba järgi",
      "sinise noka järgi",
      "pika kaela järgi"
    ],
    "correctAnswer": "valge laubakilbi järgi",
    "evidenceText": "helgib kaugele valge laubakilp",
    "questionType": "detail"
  },
  {
    "id": "67-soorudi",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SOORÜDI",
    "sourceCollection": "Linnunädalad",
    "text": "Ega esimese pilguga ei pruugi üldse tajudagi, et rannajoonel elu käib, sest need kuldnokastki väiksemad kahlajad, kel küll jalad ja nokk kuldnoka omadest oluliselt pikemad, sulanduvad ümbrusesse ideaalselt tänu oma säbrulisele sulestikule. Ära tunneme nad eelkõige musta kõhu järgi. Tulnud on nad Põhjala tundratest, kus asuvad soorüdi pesitsusalad. Tegelikult on soorüdil kaks alamliiki, keda Eestis võib kohata.",
    "question": "Mille järgi tunneme soorüdi eelkõige ära?",
    "options": [
      "musta kõhu järgi",
      "punase saba järgi",
      "sinise pea järgi",
      "kollase noka järgi"
    ],
    "correctAnswer": "musta kõhu järgi",
    "evidenceText": "Ära tunneme nad eelkõige musta kõhu järgi.",
    "questionType": "detail"
  },
  {
    "id": "68-hoburastas",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HOBURÄSTAS",
    "sourceCollection": "Linnunädalad",
    "text": "Hoburästastel on rändeaeg. Sellega seoses võib neid puristamas kuulda ka seal, kus neid pesitsusperioodil ei kohta. Kindlasti tasub neid otsida pihlapuude kasvukohtadest, sest pihlakamarjad on neile Eestis leiduvatest viljadest ühed lemmikumad. Hoburästas on kõigi rästaste seas suurim ning püstise kehahoiaku ja suurte tähnide tõttu rinnaesisel ka piisavalt hästi äratuntav.",
    "question": "Milliste puude kasvukohtadest tasub hoburästaid otsida?",
    "options": [
      "pihlapuude",
      "palmipuude",
      "õunapuude",
      "kuuskede"
    ],
    "correctAnswer": "pihlapuude",
    "evidenceText": "tasub neid otsida pihlapuude kasvukohtadest",
    "questionType": "detail"
  },
  {
    "id": "69-valgeposk-lagle",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "VALGEPÕSK-LAGLE",
    "sourceCollection": "Linnunädalad",
    "text": "Oktoobris on Lääne- ja Põhja-Eesti põllud, heinamaad ja rannakarjamaad lagledest tulvil. Niisama nagu kevadel aprillis-mais. Sest Eesti on just paraja koha peal, et teha üks pikem, nädalaid kestev rändepeatus teel arktiliselt Novaja Zemljalt Hollandisse. Just Hollandi madalad rohumaad sobivad valgepõsk-lagledele kõige paremini talve möödasaatmiseks, aga kuna ka meie põllud ja heinamaad on neile igati meele järele, ei raatsi nad sageli enne lume tulekut edasi lennata.",
    "question": "Kuhu on valgepõsk-lagled teel talve mööda saatma?",
    "options": [
      "Hollandisse",
      "Indiasse",
      "Austraaliasse",
      "Antarktikasse"
    ],
    "correctAnswer": "Hollandisse",
    "evidenceText": "teel arktiliselt Novaja Zemljalt Hollandisse",
    "questionType": "detail"
  },
  {
    "id": "70-valgeselg-kirjurahn",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "VALGESELG-KIRJURÄHN",
    "sourceCollection": "Linnunädalad",
    "text": "Mõnel aastal algab talv varakult. Vahel juba oktoobris, vahel esimeste novembripäevadega sajab paksu lume maha, tekitades jõulutunde. Ühel sellisel varase lumega aastal tegin esimesel lumisel laupäevahommikul kodutalu ümbruses Mõedakal väikese linnuretke ning kohtasin esmakordselt kodulepikus valgeselg-kirjurähni. Üllatus oli suur, sest olin selle linnuliigiga varem vaid mõned üksikud korrad kohtunud.",
    "question": "Millist lindu kohtas autor kodulepikus?",
    "options": [
      "valgeselg-kirjurähni",
      "kanada laglet",
      "auli",
      "kodukakku"
    ],
    "correctAnswer": "valgeselg-kirjurähni",
    "evidenceText": "kohtasin esmakordselt kodulepikus valgeselg-kirjurähni",
    "questionType": "detail"
  },
  {
    "id": "71-hakk",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HAKK",
    "sourceCollection": "Linnunädalad",
    "text": "Just oktoobris on hakinoorukite arvates see aeg, kus kodukandis juba piisavalt ringi vaadatud ning hing ihkab kaugemaid paiku kaeda. Said nad ju juba enne jaanipäeva tuule tiibadesse, olles esimese elukuu veetnud lärmakas ühiselamus kusagil kirikutornis või mujal müürilõhedes, õõnsate puudega mõisapargis või koguni korstnas. Muidugi on suur hulk noorukeid pärit ka maalt „üksiktaludest“, milleks on betoonist õõnsad kõrgepingepostid.",
    "question": "Millal tahavad hakinoorukid kaugemaid paiku vaadata?",
    "options": [
      "oktoobris",
      "jaanuaris",
      "aprillis",
      "juunis"
    ],
    "correctAnswer": "oktoobris",
    "evidenceText": "Just oktoobris on hakinoorukite arvates see aeg",
    "questionType": "detail"
  },
  {
    "id": "72-hallvares",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HALLVARES",
    "sourceCollection": "Linnunädalad",
    "text": "Lindude sügisränne on nüüdseks kestnud juba kuid, aga ikka on veel minejaid. On ka mahajääjaid, kellega koos veedame talve siinmail. Üks selline on vares, tuttav tegelane igaühele. Hallvares mõistagi, ehkki maainimene tunneb teda pigem lihtsalt varesena.",
    "question": "Kellega veedame teksti järgi talve siinmail?",
    "options": [
      "hallvaresega",
      "suitsupääsukesega",
      "väikekoovitajaga",
      "ööbikuga"
    ],
    "correctAnswer": "hallvaresega",
    "evidenceText": "Üks selline on vares, tuttav tegelane igaühele. Hallvares mõistagi",
    "questionType": "detail"
  },
  {
    "id": "73-kanada-lagle",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KANADA LAGLE",
    "sourceCollection": "Linnunädalad",
    "text": "Kanada on suur maa. Eestist koguni 220 korda suurem. Ja kanada lagle on suur lind, siinmail laiemalt levinud valgepõsk-laglest umbes 30 sentimeetri jagu pikem ja suurema tiibade siruulatusega. Seda muidugi juhul, kui ta on täiskasvanud.",
    "question": "Kummast linnust on kanada lagle tekstis suurem?",
    "options": [
      "valgepõsk-laglest",
      "pöialpoisist",
      "musträstast",
      "kodukakust"
    ],
    "correctAnswer": "valgepõsk-laglest",
    "evidenceText": "valgepõsk-laglest umbes 30 sentimeetri jagu pikem",
    "questionType": "detail"
  },
  {
    "id": "74-mustlagle",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "MUSTLAGLE",
    "sourceCollection": "Linnunädalad",
    "text": "Igal kevadel ja sügisel rändab Eestist läbi sadu tuhandeid hanesid ja laglesid, sealhulgas mustlagled. Septembris, oktoobris ja novembris lendab neid meie läänerannikut pidi läbi kümneid tuhandeid, kuid mõned sajad jäävad ka rannikule peatuma. Ja mitte üksnes läänerannikule, ka Lääne-Virumaa randades ja põldudel on nähtud neid toimetamas.",
    "question": "Millal rändavad mustlagled Eestist läbi?",
    "options": [
      "kevadel ja sügisel",
      "ainult jaanuaris",
      "ainult kesksuvel",
      "ainult jõulude ajal"
    ],
    "correctAnswer": "kevadel ja sügisel",
    "evidenceText": "Igal kevadel ja sügisel rändab Eestist läbi",
    "questionType": "detail"
  },
  {
    "id": "75-siisike",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SIISIKE",
    "sourceCollection": "Linnunädalad",
    "text": "Siisikesel on ilus nimetus. Küllap teataksegi siisikest selle poolest hästi, linnu enda aga tunnevad vähesed looduses ära. On ju ta õige pisike ning enamasti tegutseb kõrgetes puuvõrades, kust leiab toidu ning kuhu ehitab ka pesa. Pesitsusperioodil kohtab siisikesi meil hajusalt ja kindlasti jäävad nad linnurohkuse ja lehestiku varjus enamikul märkamata.",
    "question": "Kus tegutseb siisike enamasti?",
    "options": [
      "kõrgetes puuvõrades",
      "mererannas",
      "kooliõues",
      "põllumasinas"
    ],
    "correctAnswer": "kõrgetes puuvõrades",
    "evidenceText": "enamasti tegutseb kõrgetes puuvõrades",
    "questionType": "detail"
  },
  {
    "id": "76-kodukakk",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KODUKAKK",
    "sourceCollection": "Linnunädalad",
    "text": "Sügiselgi tasub õhtupimedas parki jalutama minna ning kuulatada, ehk kostub kodukakuisa kume „huuuuuu .... hu-hu-hu-hu-huu“. Sellega annab ta märku, et see park on tema territoorium ning kui mina või sina peaksime kodukakud olema, siis tuleks taanduda. Kui me aga kodukakud pole, siis võime õnnelikud olla, et meile selline meeliülendav looduselamus osaks sai.",
    "question": "Mida annab kodukakuisa oma huikega märku?",
    "options": [
      "et park on tema territoorium",
      "et vihma hakkab sadama",
      "et ta otsib kalu",
      "et tal on külm"
    ],
    "correctAnswer": "et park on tema territoorium",
    "evidenceText": "see park on tema territoorium",
    "questionType": "detail"
  },
  {
    "id": "77-kormoran",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KORMORAN",
    "sourceCollection": "Linnunädalad",
    "text": "Mäletan, et minu lapsepõlves käisid meie linnuhuvilised kormorane imetlemas Volga deltas ja mujal lõunapoolsetel aladel, kuhu tollal oli võimalik sõita. Meil selliseid eksoote ei elanud. Praegu aga hinnatakse Eesti kormoranipopulatsiooni suuruseks kuni 25 000 paari! Mingi kogus neist on end sisse seadnud ka Lääne-Virumaa piires Soome lahe rannikul ja ranniku lähedal väikesaartel.",
    "question": "Kui suureks hinnatakse Eesti kormoranipopulatsiooni?",
    "options": [
      "kuni 25 000 paari",
      "kuni 50 paari",
      "ainult üks paar",
      "üle miljoni paari"
    ],
    "correctAnswer": "kuni 25 000 paari",
    "evidenceText": "kuni 25 000 paari",
    "questionType": "detail"
  },
  {
    "id": "78-mustrastas",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "MUSTRÄSTAS",
    "sourceCollection": "Linnunädalad",
    "text": "Paljudel meist, ennekõike linnaelanikel, seisab ees terve talv koos musträstastega. Eriti aedlinnades meeldib musträstale niivõrd, et ta ei näe mingit mõtet riskantset rännuteed ette võtta. Kompostihunnikud, solgiaugud ja lindude toidumajad katavad ju talveperioodiks rikkaliku laua. Eriti siis, kui me ei unusta toidumajadesse ka õunu lisada.",
    "question": "Mis aitab musträstal talvel toitu leida?",
    "options": [
      "kompostihunnikud ja toidumajad",
      "sügav meri",
      "kõrged mäed",
      "liivaluited"
    ],
    "correctAnswer": "kompostihunnikud ja toidumajad",
    "evidenceText": "Kompostihunnikud, solgiaugud ja lindude toidumajad",
    "questionType": "detail"
  },
  {
    "id": "79-tamme-kirjurahn",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "TAMME-KIRJURÄHN",
    "sourceCollection": "Linnunädalad",
    "text": "Tamme-kirjurähni esmakordne pesitsemine Eestis tehti kindlaks 2000. aastal Räpinas, kümne aasta eest hinnati tema pesitsusaegseks arvukuseks Eestis juba 100–300 paari. Praegu pole tamme-kirjurähn ka meil Lääne-Virumaalgi mingi eriline haruldus, ühe paari pesitsuse tuvastas tänavu kevadel Vilja Padonik Rakvere tammikus, aga kuna seal võib neid alati kohata, polnud see kindlasti esimene pesitsus ja tõenäoliselt pesitseb seal rohkem kui üks paar. Ja pesitsevad nad Sagadis ja Vihulaski. Või näiteks Aasperes ja Kundas.",
    "question": "Kus tehti kindlaks tamme-kirjurähni esmakordne pesitsemine Eestis?",
    "options": [
      "Räpinas",
      "Tallinnas",
      "Käsmus",
      "Narvas"
    ],
    "correctAnswer": "Räpinas",
    "evidenceText": "esmakordne pesitsemine Eestis tehti kindlaks 2000. aastal Räpinas",
    "questionType": "detail"
  },
  {
    "id": "80-karvasjalg-viu",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KARVASJALG-VIU",
    "sourceCollection": "Linnunädalad",
    "text": "Karvasjalg-viu ehk taliviu on meie tavalisima kullilise hiireviu sugulane, kes meil ei pesitse, küll aga kasutab meie alasid transiitmaana. Nii nagu paljud rändlinnud. Ja tema sügisrände kõrghooaeg on oktoobris, kuid jätkub novembris. Kesk-Euroopas talvepuhkust pidavad taliviud on pärit Põhjamaadest ja Venemaalt, aga esimesed meist juba üle rännanud isendid võisid pärineda isegi Siberi tundratest.",
    "question": "Millal on karvasjalg-viu sügisrände kõrghooaeg?",
    "options": [
      "oktoobris",
      "juunis",
      "veebruaris",
      "detsembris"
    ],
    "correctAnswer": "oktoobris",
    "evidenceText": "tema sügisrände kõrghooaeg on oktoobris",
    "questionType": "detail"
  },
  {
    "id": "81-hangelind",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "HANGELIND",
    "sourceCollection": "Linnunädalad",
    "text": "Arktikas pesitsevate hangelindude rändeaeg on käes, mistõttu võib olla õnne neid ka meie mail näha. Kui mullu kohtas Lääne-Virumaal esimesi hangelinde Jaana Vain Käsmus 25. oktoobril, siis tänavu kohtas Viive Kiis üht isendit Kadrina vallas Ama külas juba 29. septembril. Kindlasti ei kuulu nad Eestis ega ka Lääne-Virumaal sageli kohatavate linnuliikide hulka.",
    "question": "Kus pesitsevad hangelinnud?",
    "options": [
      "Arktikas",
      "Lõuna-Aafrikas",
      "Eesti linnaparkides",
      "Vahemeres"
    ],
    "correctAnswer": "Arktikas",
    "evidenceText": "Arktikas pesitsevate hangelindude",
    "questionType": "detail"
  },
  {
    "id": "82-karmiinleevike",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KARMIINLEEVIKE",
    "sourceCollection": "Linnunädalad",
    "text": "November kipub olema meie kliimavöötmes küll vist kõige kõledam kuu. Kes ei ihkaks praegu viibida hoopis soojemal maal ... näiteks Indias? Meie tänane päevakangelane karmiinleevike veedabki praegu aega Indias või Kagu-Aasia maades ning ei kavatse veel niipea tagasi pöörduda. Tema jaoks on siin liiga külm ja toidulaud liiga kasin.",
    "question": "Kus veedab karmiinleevike praegu aega?",
    "options": [
      "Indias või Kagu-Aasias",
      "Eestis lume all",
      "Põhjanabal",
      "Läänemerel"
    ],
    "correctAnswer": "Indias või Kagu-Aasias",
    "evidenceText": "veedabki praegu aega Indias või Kagu-Aasia maades",
    "questionType": "detail"
  },
  {
    "id": "83-puukoristaja",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "PUUKORISTAJA",
    "sourceCollection": "Linnunädalad",
    "text": "Nüüd, kus miinuskraadid enam väga harvad külalised pole, sigineb koduaedadesse aina enam linnukesi uurima, kas toidumajad juba välja pandud ja neisse seemneid puistatud. Tihastega hästi seltsiv puukoristaja on talviti neis sage külaline. Ta on tihastest suurem ja tugevam ning konkurentsi korral paneb selle ka maksma. Sestap, kui toidumajal õnnestub jälgida puukoristaja ja rasvatihase duelli, võidab enamasti puukoristaja.",
    "question": "Kus on puukoristaja talviti sage külaline?",
    "options": [
      "toidumajades",
      "merel",
      "viljapõllul",
      "koolisaalis"
    ],
    "correctAnswer": "toidumajades",
    "evidenceText": "puukoristaja on talviti neis sage külaline",
    "questionType": "detail"
  },
  {
    "id": "84-rohevint",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "ROHEVINT",
    "sourceCollection": "Linnunädalad",
    "text": "Rohevinti võime oma koduaias kohata aasta ringi. Seda muidugi juhul, kui on täidetud tema nõutud tingimused. Talvel on tal aeda asja juhul, kui seal toidumaja olemas ja selles rikkalikult seemneid. Kevadel ja suvel on vaja aga pesitsemisvõimalust mõnes tihedas põõsas, hekis või kuusel.",
    "question": "Mida vajab rohevint talvel aias?",
    "options": [
      "toidumaja seemnetega",
      "kalatiiki",
      "liivakasti",
      "kõrget torni"
    ],
    "correctAnswer": "toidumaja seemnetega",
    "evidenceText": "toidumaja olemas ja selles rikkalikult seemneid",
    "questionType": "detail"
  },
  {
    "id": "85-varblased",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "VARBLASED",
    "sourceCollection": "Linnunädalad",
    "text": "Varblased hoiduvad alati meie lähedusse. Olgu või aasta kõige pimedam ja porisem aeg. Iseenesest on ju täitsa mõnus mõelda, et on olemas linnuliik, kes meid vajab. Samas teeb see nende elu meie omast sõltuvaks ja kui meie neid enam oma lähikonnas ei salli, on neil raske toime tulla.",
    "question": "Kelle lähedusse varblased tekstis hoiduvad?",
    "options": [
      "meie lähedusse",
      "ainult merele",
      "karude juurde",
      "sügavasse rabasse"
    ],
    "correctAnswer": "meie lähedusse",
    "evidenceText": "Varblased hoiduvad alati meie lähedusse.",
    "questionType": "detail"
  },
  {
    "id": "86-kukkurtihane",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KUKKURTIHANE",
    "sourceCollection": "Linnunädalad",
    "text": "Kukkurtihase nimetus võib tekitada arvamuse, et tegemist on Austraalia päritolu tihasega, kel on kukkur kõhu peal. Nii see muidugi pole, ka pole ta rahajõmm, kel kukkur vööl. Nimetuse on talle andnud hoopiski ta pesa, mis on Eesti lindude seas ainulaadne. Selle meisterlikkuse on ta tõepoolest Austraalia kukkurloomadelt üle võtnud, aga vaid väliselt.",
    "question": "Mis on andnud kukkurtihasele nime?",
    "options": [
      "tema pesa",
      "tema saba",
      "tema laul",
      "tema nokk"
    ],
    "correctAnswer": "tema pesa",
    "evidenceText": "Nimetuse on talle andnud hoopiski ta pesa",
    "questionType": "detail"
  },
  {
    "id": "87-siidisaba",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SIIDISABA",
    "sourceCollection": "Linnunädalad",
    "text": "„Peeglike, peeglike seina peal, milline lind on kauneim me maal?“ oleks siidisabal põhjust inimelamutes leiduvat edevat mööblitükki tülitada. Milline võiks vastus olla? Maitse asi, aga siidisabal oleks põhjust vastuseks enda nime oodata küll. Siidisaba on tõeline edevuse kehastus, vähemalt meie lindude hulgas.",
    "question": "Millise omaduse kehastus on siidisaba tekstis?",
    "options": [
      "edevuse",
      "arguse",
      "laiskuse",
      "kurjuse"
    ],
    "correctAnswer": "edevuse",
    "evidenceText": "Siidisaba on tõeline edevuse kehastus",
    "questionType": "detail"
  },
  {
    "id": "88-laanepuu",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "LAANEPÜÜ",
    "sourceCollection": "Linnunädalad",
    "text": "Laanepüüde elus on sügis huvitav aeg. Just nüüd leiavad nad paarilise kogu järgnevaks aastaks ning jaotavad territooriume. Pesitsemiseks läheb nagu kõigil lindudel ikka kevadel, aga kruntide ja paariliste jagamine toimub sügisel. Kui siis õnnestub uus naaber välja vihastada, on suur võimalus, et ta tormab kohale ja saamegi temaga tuttavaks.",
    "question": "Millal jagavad laanepüüd krunte ja paarilisi?",
    "options": [
      "sügisel",
      "jõuluööl",
      "jaanuaris",
      "kesksuvel"
    ],
    "correctAnswer": "sügisel",
    "evidenceText": "kruntide ja paariliste jagamine toimub sügisel",
    "questionType": "detail"
  },
  {
    "id": "89-kodutuvi",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KODUTUVI",
    "sourceCollection": "Linnunädalad",
    "text": "Kord eksinud vaene tütarlaps metsas ära. Ingel tulnud ta juurde ja andnud talle sulise kuue. Selle kuue varal lennanud ta metsast välja, kuid moondunud ise tuviks. Istuva tuvina hüüdnud ta: „Tu-vi, tu-vi!“",
    "question": "Milleks moondus tütarlaps tekstis?",
    "options": [
      "tuviks",
      "kajakaks",
      "rebaseks",
      "kalaks"
    ],
    "correctAnswer": "tuviks",
    "evidenceText": "moondunud ise tuviks",
    "questionType": "detail"
  },
  {
    "id": "90-tuttlooke",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "TUTTLÕOKE",
    "sourceCollection": "Linnunädalad",
    "text": "Tuttlõokesi elab Eestis vähe. Õigemini, nad on siin üpris haruldased. Või märgatakse neid vähem, kui tegelikult on, sest ka põldlõokesed kipuvad tutti pähe turritama ning kuna põldlõokesi on kevadel ja suvel avamaastik tihedalt täis, võib nende vahel mõni tuttlõoke märkamata jääda küll. Kuigi hea tahtmise korral võib teda kohata aasta ringi.",
    "question": "Milline lind on tuttlõoke Eestis?",
    "options": [
      "üpris haruldane",
      "kõige tavalisem aialind",
      "ainult puurilind",
      "kodulind"
    ],
    "correctAnswer": "üpris haruldane",
    "evidenceText": "nad on siin üpris haruldased",
    "questionType": "detail"
  },
  {
    "id": "91-piilpart",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "PIILPART",
    "sourceCollection": "Linnunädalad",
    "text": "Seda, et piilupart oli rongijuht, on meist igaüks kuulnud, aga looduses piilparti tõenäoliselt siiski kõik ära ei tunne. Tegemist on meie kõige pisema ujupardiga rikkalikus pardiperes. Sinikael-parti teavad-tunnevad kõik ja piilpart ongi vast tuntuse poolest järgmine, aga ujupartide peres on meil veel räga-, soo-, luitsnokk-, rääks- ja viupart.",
    "question": "Milline part on piilpart?",
    "options": [
      "kõige pisem ujupart",
      "kõige suurem hani",
      "rähn",
      "kajakas"
    ],
    "correctAnswer": "kõige pisem ujupart",
    "evidenceText": "meie kõige pisema ujupardiga",
    "questionType": "detail"
  },
  {
    "id": "92-kuhmnokk-luik",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KÜHMNOKK-LUIK",
    "sourceCollection": "Linnunädalad",
    "text": "„Valge nagu luik“ tavatsetakse öelda inimese kohta, kelle ihu pole päikest näinud. Luiged on kogu aeg päikese käes, kui päike paistab, aga ikka valged. Valged nagu lumi. Värvuse puhtuse poolest võiksid luiged inglitega võistelda.",
    "question": "Mis värvi on luiged tekstis?",
    "options": [
      "valged",
      "mustad",
      "rohelised",
      "sinised"
    ],
    "correctAnswer": "valged",
    "evidenceText": "Valged nagu lumi.",
    "questionType": "detail"
  },
  {
    "id": "93-laanerahn",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "LAANERÄHN",
    "sourceCollection": "Linnunädalad",
    "text": "Oleme varasemates Virumaa Teataja numbrites tutvunud juba mitme rähniliigiga, üks toredam kui teine. Tuttavaks on saanud pisike pruunitähniline väänkael, musta-valgekirjud suur-kirjurähn, väike-kirjurähn, tamme-kirjurähn ja valgeselg-kirjurähn, rohelise palituga hallpea-rähn ning suur punast mütsi kandev musträhn. Tänane päevakangelane laanerähn eristub neist kõigist. Ta on üleni musta-valgekirju, kuid valget leidub temas siiski omajagu rohkem kui musta.",
    "question": "Milline on laanerähni sulestik tekstis?",
    "options": [
      "musta-valgekirju",
      "üleni sinine",
      "roheline ja kollane",
      "punane ja pruun"
    ],
    "correctAnswer": "musta-valgekirju",
    "evidenceText": "Ta on üleni musta-valgekirju",
    "questionType": "detail"
  },
  {
    "id": "94-suur-kirjurahn",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "SUUR-KIRJURÄHN",
    "sourceCollection": "Linnunädalad",
    "text": "„Rähn on lindude puusepp. Neid on mitu venda, kõik peavad sedasama ametit,“ arvas rähnidest Carl Robert Jakobson ligi poolteist sajandit tagasi. Ja tõepoolest on vennad rähnid puusepa ametit pidanud aastasadu. Nokk on neil ju peitel, millega annab raiuda puusse nii kodukoopaid, toiduauke kui ka hädasignaale. Aga mida siiski teeb talvel see punase tutimütsiga isane suur-kirjurähn aiavärava kõveraks vajunud, pehkinud puust aiaposti otsas?",
    "question": "Millega võrreldakse rähni nokka?",
    "options": [
      "peitliga",
      "lusikaga",
      "pilliga",
      "aeruga"
    ],
    "correctAnswer": "peitliga",
    "evidenceText": "Nokk on neil ju peitel",
    "questionType": "detail"
  },
  {
    "id": "95-kruusel",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KRÜÜSEL",
    "sourceCollection": "Linnunädalad",
    "text": "Jõulude lähenedes võiks kirjutada mõnest linnust, kellel sulestikus rohkem või veel rohkem jõuluvana kuue värvi leidub. Näiteks leevikesest või käbilinnust või punarinnast. Mängin aga väikse vingerpussi ning kirjutan hoopiski linnust, kellel jalad ilusad punased. Tema üldine väljanägemine näib aga kaugelt vaadates hoopis mustvalge nagu toonekurel, ehkki temaga meil nüüd küll vähimatki sugulust pole.",
    "question": "Mis värvi jalad on krüüslil tekstis?",
    "options": [
      "punased",
      "sinised",
      "rohelised",
      "mustad"
    ],
    "correctAnswer": "punased",
    "evidenceText": "jalad ilusad punased",
    "questionType": "detail"
  },
  {
    "id": "96-leevike",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "LEEVIKE",
    "sourceCollection": "Linnunädalad",
    "text": "Leevike on jõululind. Miks just leevikest kõige sagedamini jõulukaartidel kujutatakse, aga mitte varblast või varest, seda pole raske ära arvata. Leevikese isaslinnu alapool on just jõuluvana kuuega ühte karva. Siis näebki postkaardil välja justkui punase kuuega jõuluvana ise talvisele õunapuule laskunud.",
    "question": "Miks sobib leevike jõulukaardile?",
    "options": [
      "isaslinnu alapool on jõuluvana kuuega ühte karva",
      "ta elab korstnas",
      "ta veab saani",
      "ta teeb kingitusi"
    ],
    "correctAnswer": "isaslinnu alapool on jõuluvana kuuega ühte karva",
    "evidenceText": "Leevikese isaslinnu alapool on just jõuluvana kuuega ühte karva.",
    "questionType": "detail"
  },
  {
    "id": "97-koldvint",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "KOLDVINT",
    "sourceCollection": "Linnunädalad",
    "text": "Kui mina lapsepõlves 1974. aastal oma esimese linnuraamatu, Eerik Kumari „Eesti lindude välimääraja“ sain, oli seal muude lindude seas kirjeldatud ka kanaari vinti. Tookord arvasin, et tegu on sama kanaarilinnuga, kelle paari klassivend puuris pidas. Hiljem sain muidugi teada, et kanaari vint ehk koldvint elab looduses Kanaari saartel, Madeiral ja Assooridel ning temast on aretatud puuris peetav kanaarilind.",
    "question": "Kus elab koldvint looduses?",
    "options": [
      "Kanaari saartel, Madeiral ja Assooridel",
      "Eestis igas aias",
      "Antarktikas",
      "Siberi tundras"
    ],
    "correctAnswer": "Kanaari saartel, Madeiral ja Assooridel",
    "evidenceText": "elab looduses Kanaari saartel, Madeiral ja Assooridel",
    "questionType": "detail"
  },
  {
    "id": "98-poialpoiss",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "PÖIALPOISS",
    "sourceCollection": "Linnunädalad",
    "text": "Lumivalgekese muinasjutus on tegelasteks seitse pöialpoissi, aga nendest täna juttu ei tule. Lind, kes kannab pöialpoisi nimetust, on samuti selle saanud oma väiksuse tõttu, tegemist on Euroopa pisima linnuga. Sümboolselt on selle linnukese valinud oma rahvuslinnuks üks Euroopa pisemaid riike Luksemburg. Eesti pisima linnu tiitlit kannab pöialpoiss samuti auga, meie suurima linnu kühmnokk-luigega võrreldes on ta koguni 2400 korda kergem.",
    "question": "Mille tõttu on pöialpoiss oma nime saanud?",
    "options": [
      "väiksuse tõttu",
      "pika noka tõttu",
      "punase saba tõttu",
      "tugeva hääle tõttu"
    ],
    "correctAnswer": "väiksuse tõttu",
    "evidenceText": "selle saanud oma väiksuse tõttu",
    "questionType": "detail"
  },
  {
    "id": "99-roohabekas",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "ROOHABEKAS",
    "sourceCollection": "Linnunädalad",
    "text": "Kui kuulutataks välja kõige efektsema välimusega lindude konkurss, oleks roohabekal küll põhjust sellel osaleda. Isaslinnu mustad sorakil „vuntsid“ annavad talle ikka väga vahva väljanägemise. Roostjaskollane seljasulestik mõlemal sugupoolel on samuti silmatorkav ning pikk ümara laieneva otsaga saba samuti. Sellise välimusega lind ei jää meie linnuriigis tõesti märkamatuks.",
    "question": "Mis annab isasele roohabekale vahva väljanägemise?",
    "options": [
      "mustad sorakil vuntsid",
      "sinine nokk",
      "valge laubakilp",
      "pikk kael"
    ],
    "correctAnswer": "mustad sorakil vuntsid",
    "evidenceText": "Isaslinnu mustad sorakil „vuntsid“",
    "questionType": "detail"
  },
  {
    "id": "100-aul",
    "learner": "kiur",
    "subject": "lugemine",
    "exercise": "loe-ja-vasta",
    "sourceAuthor": "Peep Veedla",
    "sourceTitle": "AUL",
    "sourceCollection": "Linnunädalad",
    "text": "Kohe lööb kalendris ette uue aastanumbri ning algab auli aasta. Mitte hiina horoskoobi järgi, vaid Eesti Ornitoloogiaühing on aastaks 2023 valinud aasta linnuks auli. Seega on aasta viimasel päeval tagumine aeg selle vahva sukelpardiga tutvust teha. Suure tõenäosusega aastavahetuse saluuti jälgides meil auliga kohtuda ei õnnestu, sest auli kodu on nüüd ja edaspidi kuni kevadeni Läänemeri, elukohaks merelained.",
    "question": "Milleks valis Eesti Ornitoloogiaühing auli aastaks 2023?",
    "options": [
      "aasta linnuks",
      "aasta putukaks",
      "rahvuslinnuks",
      "koduloomaks"
    ],
    "correctAnswer": "aasta linnuks",
    "evidenceText": "valinud aasta linnuks auli",
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
