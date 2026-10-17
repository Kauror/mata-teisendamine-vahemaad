// DEMO unit 2 — "Taime osad". Synthetic, preview-only content; the second
// unit exists so the preview can show sequential unlocking (it opens when
// demo unit 1 is passed). Not textbook content and never shown to a child.

import { grouping, hotspot, matching, multi, ordering, questionsFor, single, trueFalse } from '@/content/textbook/authoring';
import type { Unit } from '@/lib/textbook/types';
import { DEMO_COURSE_ID, DEMO_SOURCES } from '@/content/textbook/textbook-demo/shared';

const UNIT_ID = 'demo-taim';
const O1 = 'demo-taim-o1';
const O2 = 'demo-taim-o2';
const O3 = 'demo-taim-o3';
const O4 = 'demo-taim-o4';
const question = questionsFor(UNIT_ID, DEMO_SOURCES);
const g = (n: number) => `demo-taim-g${String(n).padStart(2, '0')}`;
const id = (n: number) => `demo-taim-q${String(n).padStart(2, '0')}`;

const ROOT_JOB = 'imeb mullast vett ja hoiab taime kinni';
const LEAF_JOB = 'valmistab päikesevalguse abil taimele toitu';
const FLOWER_JOB = 'sellest areneb vili seemnetega';
const STEM_JOB = 'kannab lehti ja õisi ning juhib vett lehtedeni';

export const demoPlantUnit: Unit = {
  id: UNIT_ID,
  courseId: DEMO_COURSE_ID,
  number: 2,
  title: 'Taime osad',
  status: 'ready',
  contentVersion: '2026-10-17.1',
  objectives: [
    { id: O1, description: 'Oskan nimetada õistaime osad: juur, vars, leht ja õis.', required: true, sources: DEMO_SOURCES },
    { id: O2, description: 'Tean, mis on juure ja varre ülesanne.', required: true, sources: DEMO_SOURCES },
    { id: O3, description: 'Tean, et leht valmistab päikesevalguse abil taimele toitu.', required: true, sources: DEMO_SOURCES },
    { id: O4, description: 'Tean, et õiest areneb vili ja viljas on seemned.', required: true, sources: DEMO_SOURCES }
  ],
  lessons: [
    {
      id: 'demo-taim-l1',
      title: 'Taime osad ja nende ülesanded',
      order: 1,
      required: true,
      objectiveIds: [O1, O2, O3],
      sections: [
        {
          id: 'demo-taim-l1-s1',
          title: 'Neli osa',
          blocks: [
            { id: 'demo-taim-b01', type: 'paragraph', text: 'See on teine näidisõppetükk. See avaneb, kui esimese näidisõppetüki test on sooritatud.' },
            { id: 'demo-taim-b02', type: 'diagram', diagramId: 'demo-plant-parts' },
            { id: 'demo-taim-b03', type: 'caption', text: 'Õistaime osad ülevalt alla: õis, leht, vars ja mulla all juur.' },
            { id: 'demo-taim-b04', type: 'definition', term: 'Õistaim', definition: 'Taim, millel on õied. Õitest arenevad viljad ja seemned.' }
          ]
        },
        {
          id: 'demo-taim-l1-s2',
          title: 'Mida iga osa teeb?',
          blocks: [
            {
              id: 'demo-taim-b05',
              type: 'table',
              caption: 'Taime osad',
              headers: ['Osa', 'Kus see on?', 'Mida see teeb?'],
              rows: [
                ['juur', 'mulla all', ROOT_JOB],
                ['vars', 'juure ja õie vahel', STEM_JOB],
                ['leht', 'varre küljes', LEAF_JOB],
                ['õis', 'taime ülemises osas', FLOWER_JOB]
              ]
            },
            {
              id: 'demo-taim-b06',
              type: 'paragraph',
              text: [
                { text: 'Leht vajab toidu valmistamiseks ' },
                { text: 'päikesevalgust', emphasis: 'term' },
                { text: '. Pimedas ei saa leht toitu valmistada, seepärast jääb taim pimedas nõrgaks ja kollaseks. Toataimede lehed pöörduvad akna poole, kus on kõige rohkem valgust.' }
              ]
            },
            { id: 'demo-taim-b07', type: 'keyFact', items: ['Juur imeb vett ja hoiab taime kinni.', 'Vars viib vee lehtedeni.', 'Leht valmistab päikesevalguse abil toitu.'] }
          ]
        }
      ]
    },
    {
      id: 'demo-taim-l2',
      title: 'Õiest seemneni',
      order: 2,
      required: true,
      objectiveIds: [O4],
      sections: [
        {
          id: 'demo-taim-l2-s1',
          title: 'Taime elu',
          blocks: [
            {
              id: 'demo-taim-b08',
              type: 'list',
              ordered: true,
              items: ['Seemnest kasvab idu.', 'Idust kasvab noor taim.', 'Taim kasvab suureks ja õitseb.', 'Õiest areneb vili, milles on seemned.', 'Seemnest võib kasvada uus taim.']
            },
            {
              id: 'demo-taim-b09',
              type: 'paragraph',
              text: 'Mesilased ja teised putukad koguvad õitest magusat nektarit. Samal ajal kannavad nad õietolmu õielt õiele ja aitavad nii viljadel tekkida.'
            },
            { id: 'demo-taim-b10', type: 'keyFact', items: ['Õiest areneb vili.', 'Viljas on seemned.', 'Seemnest kasvab uus taim.'] },
            { id: 'demo-taim-b11', type: 'enrichment', variant: 'extra', title: 'Lisateadmine', body: ['Mõnel taimel, näiteks võilillel, lendavad seemned tuulega kaugele. Nii jõuavad uued taimed kasvama uutesse kohtadesse.'] }
          ]
        }
      ]
    }
  ],
  questions: [
    /* ---- O1: taime osad ---- */
    question({ id: id(1), stem: 'Näita joonisel taime juurt.', primaryObjectiveId: O1, variantGroupId: g(1), cognitiveLevel: 'factual', explanation: 'Juur on taime alumine osa, mis kasvab mulla all.', answer: hotspot('demo-plant-parts', 'root') }),
    question({ id: id(2), stem: 'Näita joonisel taime õit.', primaryObjectiveId: O1, variantGroupId: g(1), cognitiveLevel: 'factual', explanation: 'Õis on taime ülemine osa.', answer: hotspot('demo-plant-parts', 'flower') }),
    question({ id: id(3), stem: 'Vali kõik õistaime osad.', primaryObjectiveId: O1, variantGroupId: g(2), cognitiveLevel: 'factual', explanation: 'Õistaime osad on juur, vars, leht ja õis. Muld ei ole taime osa – taim kasvab mullas.', misconception: 'Muld on taime kasvukoht, mitte taime osa.', answer: multi([['juur', 'juur'], ['vars', 'vars'], ['leht', 'leht'], ['muld', 'muld'], ['ois', 'õis']], ['juur', 'vars', 'leht', 'ois']) }),
    question({ id: id(4), stem: 'Milline taime osa kasvab mulla all?', primaryObjectiveId: O1, variantGroupId: g(3), cognitiveLevel: 'factual', explanation: 'Juur kasvab mulla all.', answer: single([['juur', 'juur'], ['ois', 'õis'], ['leht', 'leht'], ['vili', 'vili']], 'juur') }),
    question({ id: id(5), stem: 'Järjesta taime osad ülevalt alla.', primaryObjectiveId: O1, variantGroupId: g(4), cognitiveLevel: 'factual', explanation: 'Kõige üleval on õis, selle all vars ja kõige all mulla sees juur.', answer: ordering(['õis', 'vars', 'juur'], 'Kõige ülemine', 'Kõige alumine') }),
    question({ id: id(6), stem: 'Ühenda taime osa ja selle ülesanne.', primaryObjectiveId: O1, relatedObjectiveIds: [O2, O3, O4], variantGroupId: g(5), cognitiveLevel: 'understanding', difficulty: 2, explanation: `Juur ${ROOT_JOB}, vars ${STEM_JOB}, leht ${LEAF_JOB} ja õiest areneb vili.`, answer: matching([['juur', ROOT_JOB], ['vars', STEM_JOB], ['leht', LEAF_JOB], ['õis', FLOWER_JOB]]) }),

    /* ---- O2: juur ja vars ---- */
    question({ id: id(7), stem: 'Mari kastab taime. Millise osa kaudu jõuab vesi mullast taimesse? Näita joonisel.', primaryObjectiveId: O2, variantGroupId: g(6), cognitiveLevel: 'application', difficulty: 2, explanation: 'Juur imeb mullast vett. Sealt liigub vesi varre kaudu lehtedeni.', answer: hotspot('demo-plant-parts', 'root') }),
    question({ id: id(8), stem: 'Mis on juure ülesanne?', primaryObjectiveId: O2, variantGroupId: g(7), cognitiveLevel: 'factual', explanation: 'Juur imeb mullast vett ja hoiab taime mullas kinni.', answer: single([['juur', 'Imeb mullast vett ja hoiab taime kinni.'], ['toit', 'Valmistab päikesevalguse abil toitu.'], ['putukad', 'Meelitab ligi putukaid.'], ['seemned', 'Teeb seemneid.']], 'juur') }),
    question({ id: id(9), stem: 'Mis on varre ülesanne?', primaryObjectiveId: O2, variantGroupId: g(8), cognitiveLevel: 'factual', explanation: 'Vars kannab lehti ja õisi ning juhib vett juurtest lehtedeni.', answer: single([['vars', 'Kannab lehti ja õisi ning juhib vett lehtedeni.'], ['muld', 'Hoiab mulla paigal.'], ['seemned', 'Teeb seemneid.'], ['toit', 'Valmistab pimedas toitu.']], 'vars') }),
    question({ id: id(10), stem: 'Õige või vale? Juured hoiavad taime mullas kinni.', primaryObjectiveId: O2, variantGroupId: g(9), cognitiveLevel: 'factual', explanation: 'Õige. Juured hoiavad taime kinni, et tuul seda välja ei tõmbaks.', answer: trueFalse(true) }),
    question({ id: id(11), stem: 'Miks ei kuku suur puu tuulega kergesti ümber?', primaryObjectiveId: O2, variantGroupId: g(10), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Puul on suured ja tugevad juured, mis hoiavad seda maas kinni.', answer: single([['juured', 'Tugevad juured hoiavad seda maas kinni.'], ['lehed', 'Lehed on nii rasked.'], ['oied', 'Õied hoiavad puud paigal.'], ['tuhi', 'Puu on seest tühi.']], 'juured') }),
    question({ id: id(12), stem: 'Miks hakkab lõigatud lill vaasis ilma veeta närtsima?', primaryObjectiveId: O2, variantGroupId: g(11), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Lõigatud lillel ei ole juuri. Vars saab vett viia ainult siis, kui vaasis on vett.', answer: single([['vesi', 'Varrel ei ole vett, mida lehtede ja õieni viia.'], ['kulm', 'Lillel on vaasis liiga külm.'], ['ois', 'Õis sööb lehed ära.'], ['vaas', 'Vaas on lille jaoks liiga suur.']], 'vesi') }),
    question({
      id: id(13),
      stem: 'Mis on kõige tõenäolisem põhjus?',
      context: { kind: 'text', paragraphs: ['Juku istutas kaks ühesugust taime. Ühel neist lõikas ta kogemata juured ära. Mõne päeva pärast oli see taim närtsinud, teine aga kasvas edasi.'] },
      primaryObjectiveId: O2,
      variantGroupId: g(12),
      cognitiveLevel: 'application',
      difficulty: 3,
      explanation: 'Ilma juurteta ei saanud taim mullast vett ja närtsis.',
      answer: single([['vesi', 'Juurteta taim ei saanud mullast vett.'], ['valgus', 'Juurteta taim sai liiga palju valgust.'], ['varastas', 'Teine taim võttis kogu vee endale.'], ['roheline', 'Juured teevad taime rohelisemaks.']], 'vesi')
    }),
    question({ id: id(14), stem: 'Toalill on närtsinud ja muld potis on täiesti kuiv. Mida teha?', primaryObjectiveId: O2, variantGroupId: g(13), cognitiveLevel: 'application', explanation: 'Taim vajab vett. Kui mulda kasta, saavad juured vett imeda.', answer: single([['kasta', 'Kasta mulda, et juured saaksid vett.'], ['loika', 'Lõigata lehed ära.'], ['kapp', 'Panna lill pimedasse kappi.'], ['varvi', 'Värvida lehed roheliseks.']], 'kasta') }),
    question({ id: id(15), stem: 'Rühmita: kas seda teeb juur või leht?', primaryObjectiveId: O2, relatedObjectiveIds: [O3], variantGroupId: g(14), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Juur imeb vett ja hoiab taime kinni. Leht püüab päikesevalgust ja valmistab toitu.', answer: grouping([['juur', 'juur'], ['leht', 'leht']], [['imeb mullast vett', 'juur'], ['hoiab taime kinni', 'juur'], ['püüab päikesevalgust', 'leht'], ['valmistab taimele toitu', 'leht']]) }),

    /* ---- O3: leht ---- */
    question({ id: id(16), stem: 'Mis on lehe ülesanne?', primaryObjectiveId: O3, variantGroupId: g(15), cognitiveLevel: 'factual', explanation: 'Leht valmistab päikesevalguse abil taimele toitu.', answer: single([['toit', 'Valmistab päikesevalguse abil taimele toitu.'], ['vesi', 'Imeb mullast vett.'], ['kinni', 'Hoiab taime mullas kinni.'], ['seemned', 'Teeb seemneid.']], 'toit') }),
    question({ id: id(17), stem: 'Mida vajab leht toidu valmistamiseks?', primaryObjectiveId: O3, variantGroupId: g(16), cognitiveLevel: 'factual', explanation: 'Leht vajab toidu valmistamiseks päikesevalgust.', answer: single([['valgus', 'päikesevalgust'], ['pimedus', 'pimedust'], ['liiv', 'liiva'], ['lumi', 'lund']], 'valgus') }),
    question({ id: id(18), stem: 'Õige või vale? Taime lehed valmistavad toitu ka täielikus pimeduses.', primaryObjectiveId: O3, variantGroupId: g(17), cognitiveLevel: 'factual', explanation: 'Vale. Toidu valmistamiseks vajab leht valgust.', answer: trueFalse(false) }),
    question({ id: id(19), stem: 'Miks pöörduvad toataime lehed akna poole?', primaryObjectiveId: O3, variantGroupId: g(18), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Akna juures on kõige rohkem valgust ja lehed vajavad valgust toidu valmistamiseks.', answer: single([['valgus', 'Lehed püüavad valgust, mida on akna juures kõige rohkem.'], ['kulm', 'Akna juures on külmem.'], ['oue', 'Lehed tahavad õue minna.'], ['tuul', 'Aknast puhub tuul lehed sinna.']], 'valgus') }),
    question({ id: id(20), stem: 'Miks jääb taim pimedas kapis nõrgaks?', primaryObjectiveId: O3, variantGroupId: g(19), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Pimedas ei saa lehed toitu valmistada ja taim jääb ilma toiduta.', answer: single([['toit', 'Pimedas ei saa lehed toitu valmistada.'], ['valgus', 'Kapis on liiga palju valgust.'], ['ruum', 'Kapis on taimel liiga palju ruumi.'], ['juured', 'Pimedas kasvavad juured liiga kiiresti.']], 'toit') }),
    question({ id: id(21), stem: 'Taim seisis kaks nädalat pimedas keldris. Miks läksid ta lehed kollaseks?', primaryObjectiveId: O3, variantGroupId: g(19), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Keldris ei olnud valgust, nii et lehed ei saanud toitu valmistada.', answer: single([['valgus', 'Keldris ei olnud valgust toidu valmistamiseks.'], ['vesi', 'Keldris oli liiga palju vett.'], ['soe', 'Keldris oli liiga soe.'], ['vanus', 'Lehed lähevad alati kahe nädala pärast kollaseks.']], 'valgus') }),
    question({
      id: id(22),
      stem: 'Mida see katse näitab?',
      context: { kind: 'table', caption: 'Kolm ühesugust taime kahe nädala pärast', headers: ['Taim', 'Kus kasvas', 'Kahe nädala pärast'], rows: [['A', 'aknalaual', 'roheline ja kasvanud'], ['B', 'pimedas kapis', 'kollane ja nõrk'], ['C', 'toa keskel varjus', 'roheline, kasvas vähe']] },
      primaryObjectiveId: O3,
      variantGroupId: g(20),
      cognitiveLevel: 'application',
      difficulty: 3,
      explanation: 'Mida rohkem valgust taim sai, seda paremini ta kasvas. Taim vajab kasvamiseks valgust.',
      answer: single([['valgus', 'Taim vajab kasvamiseks valgust.'], ['pimedus', 'Taim vajab kasvamiseks pimedust.'], ['ei', 'Valgus ei mõjuta taime kasvu.'], ['kapp', 'Taim kasvab kapis kõige paremini.']], 'valgus')
    }),
    question({ id: id(23), stem: 'Kuhu panna toataim, mis vajab palju valgust? Vali kõik sobivad kohad.', primaryObjectiveId: O3, variantGroupId: g(21), cognitiveLevel: 'application', difficulty: 2, explanation: 'Valgust armastav taim kasvab hästi päikesepaistelisel aknalaual või suvel rõdul. Keldris ja kapis on pime.', answer: multi([['aken', 'päikesepaistelisele aknalauale'], ['rodu', 'suvel rõdule'], ['kelder', 'pimedasse keldrisse'], ['kapp', 'kapi sisse']], ['aken', 'rodu']) }),

    /* ---- O4: õis, vili, seeme ---- */
    question({ id: id(24), stem: 'Millest areneb vili?', primaryObjectiveId: O4, variantGroupId: g(22), cognitiveLevel: 'factual', explanation: 'Vili areneb õiest.', answer: single([['ois', 'õiest'], ['juur', 'juurest'], ['leht', 'lehest'], ['muld', 'mullast']], 'ois') }),
    question({ id: id(25), stem: 'Kus on õistaime seemned?', primaryObjectiveId: O4, variantGroupId: g(23), cognitiveLevel: 'factual', explanation: 'Õistaime seemned on viljas.', answer: single([['vili', 'viljas'], ['juur', 'juures'], ['leht', 'lehes'], ['vars', 'varres']], 'vili') }),
    question({ id: id(26), stem: 'Õige või vale? Seemnest võib kasvada uus taim.', primaryObjectiveId: O4, variantGroupId: g(31), cognitiveLevel: 'factual', explanation: 'Õige. Seemnest kasvab idu ja sellest uus taim.', answer: trueFalse(true) }),
    question({ id: id(27), stem: 'Järjesta taime elu, alustades seemnest.', primaryObjectiveId: O4, variantGroupId: g(24), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Seemnest kasvab idu, idust noor taim, taim õitseb ja õiest areneb vili seemnetega.', answer: ordering(['seeme', 'idu', 'noor taim', 'õitsev taim', 'vili seemnetega'], 'Esimene', 'Viimane') }),
    question({ id: id(28), stem: 'Kuidas aitavad mesilased taimi?', primaryObjectiveId: O4, variantGroupId: g(25), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Mesilased kannavad õietolmu õielt õiele ja aitavad nii viljadel tekkida.', answer: single([['tolm', 'Kannavad õietolmu õielt õiele ja aitavad viljadel tekkida.'], ['vesi', 'Toovad taimele vett.'], ['juured', 'Kaevavad juurtele augud.'], ['lehed', 'Söövad vanad lehed ära.']], 'tolm') }),
    question({ id: id(29), stem: 'Rühmita: kas see aitab taimel paljuneda või toituda?', primaryObjectiveId: O4, relatedObjectiveIds: [O2, O3], variantGroupId: g(26), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Õis ja seeme aitavad teha uusi taimi (paljuneda). Leht ja juur aitavad taimel toituda.', answer: grouping([['paljunemine', 'paljunemine'], ['toitumine', 'toitumine']], [['õis', 'paljunemine'], ['seeme', 'paljunemine'], ['leht', 'toitumine'], ['juur', 'toitumine']]) }),
    question({ id: id(30), stem: 'Ühenda sõna ja selle tähendus.', primaryObjectiveId: O4, variantGroupId: g(30), cognitiveLevel: 'understanding', explanation: 'Seemnest kasvab uus taim, idu on seemnest kasvanud pisike taim, viljas on seemned ja õiest areneb vili.', answer: matching([['seeme', 'sellest kasvab uus taim'], ['idu', 'seemnest kasvanud pisike taim'], ['vili', 'selles on seemned'], ['õis', 'sellest areneb vili']]) }),
    question({
      id: id(31),
      stem: 'Mis on need pruunid terad ja mis neist võib kasvada?',
      context: { kind: 'text', paragraphs: ['Liisa korjas õunapuult õuna ja lõikas selle pooleks. Õuna keskel olid väikesed pruunid terad.'] },
      primaryObjectiveId: O4,
      variantGroupId: g(27),
      cognitiveLevel: 'application',
      difficulty: 2,
      explanation: 'Õun on vili ja pruunid terad on seemned. Seemnest võib kasvada uus õunapuu.',
      answer: single([['seemned', 'Seemned, millest võib kasvada uus õunapuu.'], ['juured', 'Juured, millest kasvavad lehed.'], ['lehed', 'Kokku kuivanud lehed.'], ['oied', 'Õied, mis pole veel avanenud.']], 'seemned')
    }),
    question({ id: id(32), stem: 'Aednik korjab kõik õied ära enne, kui need avanevad. Mis juhtub viljadega?', primaryObjectiveId: O4, variantGroupId: g(28), cognitiveLevel: 'application', difficulty: 3, explanation: 'Viljad arenevad õitest. Kui õisi ei ole, ei teki ka vilju.', answer: single([['ei', 'Vilju ei teki, sest viljad arenevad õitest.'], ['rohkem', 'Vilju tuleb rohkem.'], ['juured', 'Viljad kasvavad juurtele.'], ['sama', 'Midagi ei muutu.']], 'ei') }),
    question({ id: id(33), stem: 'Millisest taime osast areneb hiljem vili? Näita joonisel.', primaryObjectiveId: O4, variantGroupId: g(29), cognitiveLevel: 'application', explanation: 'Vili areneb õiest, mis on taime ülemises osas.', answer: hotspot('demo-plant-parts', 'flower') })
  ]
};
