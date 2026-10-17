// DEMO unit 1 — "Vesi ja selle olekud". Synthetic, preview-only content that
// exercises every framework feature (several lessons and sections, text +
// table + diagram blocks, an external resource, all six answer types, variant
// groups with more than one question, enough distinct groups for varied
// 20-question tests). Not textbook content and never shown to a child.

import { grouping, hotspot, matching, multi, ordering, questionsFor, single, trueFalse } from '@/content/textbook/authoring';
import type { Unit } from '@/lib/textbook/types';
import { DEMO_COURSE_ID, DEMO_SOURCES } from '@/content/textbook/textbook-demo/shared';

const UNIT_ID = 'demo-vesi';
const O1 = 'demo-vesi-o1';
const O2 = 'demo-vesi-o2';
const O3 = 'demo-vesi-o3';
const O4 = 'demo-vesi-o4';
const O5 = 'demo-vesi-o5';
const question = questionsFor(UNIT_ID, DEMO_SOURCES);
const g = (n: number) => `demo-vesi-g${String(n).padStart(2, '0')}`;
const id = (n: number) => `demo-vesi-q${String(n).padStart(2, '0')}`;

export const demoWaterUnit: Unit = {
  id: UNIT_ID,
  courseId: DEMO_COURSE_ID,
  number: 1,
  title: 'Vesi ja selle olekud',
  status: 'ready',
  contentVersion: '2026-10-17.1',
  objectives: [
    { id: O1, description: 'Oskan nimetada vee kolm olekut ja tuua näiteid.', required: true, sources: DEMO_SOURCES },
    { id: O2, description: 'Tean, et vesi jäätub 0 °C juures ja keeb 100 °C juures.', required: true, sources: DEMO_SOURCES },
    { id: O3, description: 'Oskan seletada sulamist, jäätumist, aurustumist ja kondenseerumist.', required: true, sources: DEMO_SOURCES },
    { id: O4, description: 'Oskan kirjeldada vee ringkäiku looduses.', required: true, sources: DEMO_SOURCES },
    { id: O5, description: 'Tean, miks jää ujub vee peal.', required: false, sources: DEMO_SOURCES }
  ],
  lessons: [
    {
      id: 'demo-vesi-l1',
      title: 'Vee kolm olekut',
      order: 1,
      required: true,
      objectiveIds: [O1, O2, O3, O5],
      sections: [
        {
          id: 'demo-vesi-l1-s1',
          title: 'Vesi on kõikjal',
          blocks: [
            { id: 'demo-vesi-b01', type: 'paragraph', text: 'See on näidisõppetükk. Siin on näha, kuidas õppetükk välja näeb: tekst, tabel, joonis ja meeldejäävad faktid.' },
            { id: 'demo-vesi-b02', type: 'heading', text: 'Vesi võib olla kolmes olekus' },
            {
              id: 'demo-vesi-b03',
              type: 'paragraph',
              text: [
                { text: 'Vesi võib olla ' },
                { text: 'tahke', emphasis: 'term' },
                { text: ' (jää ja lumi), ' },
                { text: 'vedel', emphasis: 'term' },
                { text: ' (vesi klaasis, vihmapiisad, meri) või ' },
                { text: 'gaasiline', emphasis: 'term' },
                { text: ' (veeaur õhus). Veeauru me ei näe.' }
              ]
            },
            { id: 'demo-vesi-b04', type: 'definition', term: 'Olek', definition: 'See, kas aine on tahke, vedel või gaasiline.' }
          ]
        },
        {
          id: 'demo-vesi-l1-s2',
          title: 'Kuju ja temperatuur',
          blocks: [
            {
              id: 'demo-vesi-b05',
              type: 'table',
              caption: 'Vee olekud',
              headers: ['Olek', 'Näide', 'Kuju'],
              rows: [
                ['tahke', 'jää, lumi', 'oma kindel kuju'],
                ['vedel', 'vesi klaasis, vihm', 'võtab anuma kuju'],
                ['gaasiline', 'veeaur õhus', 'täidab kogu ruumi']
              ]
            },
            {
              id: 'demo-vesi-b06',
              type: 'comparison',
              title: 'Jää ja vedel vesi',
              columns: [
                { heading: 'Jää', points: ['on tahke', 'hoiab oma kuju', 'tekib, kui vesi jahtub alla 0 °C', 'on veest kergem ja ujub vee peal'] },
                { heading: 'Vedel vesi', points: ['voolab', 'võtab anuma kuju', 'tekib, kui jää soojeneb üle 0 °C'] }
              ]
            },
            {
              id: 'demo-vesi-b07',
              type: 'keyFact',
              items: ['Vesi jäätub 0 °C juures.', 'Vesi keeb 100 °C juures.', 'Jää sulab, kui see soojeneb üle 0 °C.']
            }
          ]
        },
        {
          id: 'demo-vesi-l1-s3',
          title: 'Kuidas olek muutub',
          blocks: [
            {
              id: 'demo-vesi-b08',
              type: 'list',
              items: [
                [{ text: 'Sulamine', emphasis: 'strong' }, { text: ': jää muutub soojenedes veeks.' }],
                [{ text: 'Jäätumine', emphasis: 'strong' }, { text: ': vesi muutub jahtudes jääks.' }],
                [{ text: 'Aurustumine', emphasis: 'strong' }, { text: ': vesi muutub soojenedes veeauruks ja läheb õhku. Nii kuivab märg pesu.' }],
                [{ text: 'Kondenseerumine', emphasis: 'strong' }, { text: ': veeaur muutub jahtudes tagasi pisikesteks veepiiskadeks. Nii tekivad piisad külma klaasi peale ja udu peeglile.' }]
              ]
            },
            { id: 'demo-vesi-b09', type: 'keyFact', title: 'Jäta meelde!', items: ['Soojenedes: sulamine ja aurustumine.', 'Jahtudes: jäätumine ja kondenseerumine.'] },
            {
              id: 'demo-vesi-b10',
              type: 'enrichment',
              variant: 'fun_fact',
              title: 'Huvitav fakt',
              body: ['Igal lumehelbel on kuus haru. Kaht päris ühesugust lumehelvest on väga raske leida.']
            }
          ]
        }
      ]
    },
    {
      id: 'demo-vesi-l2',
      title: 'Vee ringkäik',
      order: 2,
      required: true,
      objectiveIds: [O4],
      sections: [
        {
          id: 'demo-vesi-l2-s1',
          title: 'Vesi liigub ringiga',
          blocks: [
            { id: 'demo-vesi-b11', type: 'diagram', diagramId: 'demo-water-cycle' },
            { id: 'demo-vesi-b12', type: 'caption', text: 'Päike soojendab vett, vesi aurustub, pilvest sajab vihma ja vesi jõuab tagasi merre.' },
            {
              id: 'demo-vesi-b13',
              type: 'list',
              ordered: true,
              items: [
                'Päike soojendab merede, järvede ja jõgede vett.',
                'Vesi aurustub ja tõuseb veeauruna üles.',
                'Kõrgel on õhk külmem. Veeaur jahtub ja kondenseerub pisikesteks piiskadeks: tekib pilv.',
                'Pilvest sajab vihma, lund või rahet. Neid nimetatakse sademeteks.',
                'Vihmavesi voolab jõgede kaudu tagasi merre ja kõik algab uuesti.'
              ]
            },
            { id: 'demo-vesi-b14', type: 'keyFact', items: ['Vee ringkäiku paneb liikuma Päikese soojus.', 'Meri ei saa tühjaks, sest vihm ja jõed toovad vee tagasi.'] }
          ]
        },
        {
          id: 'demo-vesi-l2-s2',
          title: 'Uuri veel',
          blocks: [
            {
              id: 'demo-vesi-b15',
              type: 'externalResource',
              title: 'Vesi Vikipeedias',
              intro: 'Vikipeedia artikkel veest. Lisalugemine täiskasvanuga koos – testis selle kohta küsimusi ei ole.',
              url: 'https://et.wikipedia.org/wiki/Vesi',
              publisher: 'Vikipeedia',
              resourceType: 'article',
              observe: 'Otsi artiklist, mis temperatuuril vesi keeb.'
            }
          ]
        }
      ]
    }
  ],
  questions: [
    /* ---- O1: olekud ---- */
    question({ id: id(1), stem: 'Mis olekus on jää?', primaryObjectiveId: O1, variantGroupId: g(1), cognitiveLevel: 'factual', explanation: 'Jää on tahke vesi: sellel on oma kindel kuju.', answer: single([['tahke', 'tahke'], ['vedel', 'vedel'], ['gaas', 'gaasiline']], 'tahke') }),
    question({ id: id(2), stem: 'Milline neist on tahke vesi?', primaryObjectiveId: O1, variantGroupId: g(1), cognitiveLevel: 'factual', explanation: 'Lumi on tahke vesi. Vihmapiisk on vedel ja veeaur gaasiline.', answer: single([['lumi', 'lumi'], ['vihm', 'vihmapiisk'], ['aur', 'veeaur']], 'lumi') }),
    question({ id: id(3), stem: 'Vali kõik vee olekud.', primaryObjectiveId: O1, variantGroupId: g(2), cognitiveLevel: 'factual', explanation: 'Vesi võib olla tahke, vedel või gaasiline. „Pehme“ ei ole olek.', answer: multi([['tahke', 'tahke'], ['vedel', 'vedel'], ['gaas', 'gaasiline'], ['pehme', 'pehme']], ['tahke', 'vedel', 'gaas']) }),
    question({ id: id(4), stem: 'Ühenda näide ja vee olek.', primaryObjectiveId: O1, variantGroupId: g(3), cognitiveLevel: 'factual', explanation: 'Jääpurikas on tahke, vesi klaasis on vedel ja veeaur on gaasiline.', answer: matching([['jääpurikas', 'tahke'], ['vesi klaasis', 'vedel'], ['veeaur õhus', 'gaasiline']]) }),
    question({ id: id(5), stem: 'Miks võtab vesi klaasis klaasi kuju?', primaryObjectiveId: O1, variantGroupId: g(14), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Vedel vesi voolab, sellel ei ole oma kindlat kuju. Seepärast võtab see anuma kuju.', answer: single([['voolab', 'Vedel vesi voolab ja võtab anuma kuju.'], ['tahke', 'Vesi on tahke.'], ['tombab', 'Klaas tõmbab vett enda poole.'], ['gaas', 'Vesi on gaasiline.']], 'voolab') }),
    question({ id: id(6), stem: 'Mille poolest erineb jää vedelast veest?', primaryObjectiveId: O1, variantGroupId: g(15), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Jää on tahke ja hoiab oma kuju. Vedel vesi voolab ja võtab anuma kuju.', misconception: 'Jää ja vesi on sama aine – vesi – lihtsalt eri olekus.', answer: single([['kuju', 'Jääl on oma kuju, vedel vesi võtab anuma kuju.'], ['soojem', 'Jää on alati vedelast veest soojem.'], ['ainet', 'Jää ei ole üldse vesi.'], ['vesi-kuju', 'Vedelal veel on oma kindel kuju.']], 'kuju') }),
    question({ id: id(7), stem: 'Rühmita: kas see vesi on tahke, vedel või gaasiline?', primaryObjectiveId: O1, variantGroupId: g(23), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Lumehelves ja jääpurikas on tahked, vihmapiisk ja merevesi on vedelad, veeaur õhus on gaasiline.', answer: grouping([['tahke', 'tahke'], ['vedel', 'vedel'], ['gaas', 'gaasiline']], [['lumehelves', 'tahke'], ['jääpurikas', 'tahke'], ['vihmapiisk', 'vedel'], ['merevesi', 'vedel'], ['veeaur õhus', 'gaas']]) }),
    question({ id: id(8), stem: 'Kalle valas mahla kitsast klaasist laia kaussi. Mis juhtus mahla kujuga?', primaryObjectiveId: O1, variantGroupId: g(31), cognitiveLevel: 'application', difficulty: 2, explanation: 'Mahl on vedelik. Vedelik võtab alati selle anuma kuju, kus ta parajasti on.', answer: single([['kauss', 'Mahl võttis kausi kuju.'], ['klaas', 'Mahl jäi klaasi kujuliseks.'], ['tahke', 'Mahl muutus tahkeks.']], 'kauss') }),

    /* ---- O2: temperatuurid ---- */
    question({ id: id(9), stem: 'Mis temperatuuril vesi jäätub?', primaryObjectiveId: O2, variantGroupId: g(4), cognitiveLevel: 'factual', explanation: 'Vesi jäätub 0 °C juures.', answer: single([['m10', '−10 °C'], ['0', '0 °C'], ['10', '10 °C'], ['100', '100 °C']], '0', true) }),
    question({ id: id(10), stem: 'Mis temperatuuril vesi keeb?', primaryObjectiveId: O2, variantGroupId: g(5), cognitiveLevel: 'factual', explanation: 'Vesi keeb 100 °C juures.', answer: single([['0', '0 °C'], ['50', '50 °C'], ['100', '100 °C'], ['200', '200 °C']], '100', true) }),
    question({ id: id(11), stem: 'Õige või vale? Jää sulab, kui see soojeneb üle 0 °C.', primaryObjectiveId: O2, variantGroupId: g(12), cognitiveLevel: 'factual', explanation: 'Õige. Üle 0 °C muutub jää vedelaks veeks.', answer: trueFalse(true) }),
    question({ id: id(12), stem: 'Õige või vale? Vesi keeb juba 50 °C juures.', primaryObjectiveId: O2, variantGroupId: g(13), cognitiveLevel: 'factual', explanation: 'Vale. Vesi keeb 100 °C juures. 50 °C vesi on lihtsalt kuum.', answer: trueFalse(false) }),
    question({ id: id(13), stem: 'Miks jäätuvad järved talvel, aga suvel mitte?', primaryObjectiveId: O2, variantGroupId: g(22), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Talvel on õhk külmem kui 0 °C. Järve vesi jahtub nii palju, et pealmine kiht jäätub.', answer: single([['kulm', 'Talvel on õhk külmem kui 0 °C ja vesi jahtub nii palju, et jäätub.'], ['vahem', 'Talvel on järvedes vähem vett.'], ['sool', 'Suvel on järvedes soolane vesi.'], ['paike', 'Talvel ei paista Päike üldse.']], 'kulm') }),
    question({ id: id(14), stem: 'Õues on −5 °C. Missugune on vesi lombis?', primaryObjectiveId: O2, variantGroupId: g(25), cognitiveLevel: 'application', explanation: '−5 °C on külmem kui 0 °C, nii et lombi vesi on jäätunud.', answer: single([['jaas', 'Lomp on jääs.'], ['keeb', 'Lomp keeb.'], ['soe', 'Lombi vesi on soe ja vedel.'], ['aur', 'Lombist on saanud veeaur.']], 'jaas') }),
    question({
      id: id(15),
      stem: 'Millistel päevadel võis lombivesi jäätuda?',
      context: { kind: 'table', caption: 'Õhutemperatuur keskpäeval', headers: ['Päev', 'Temperatuur'], rows: [['esmaspäev', '3 °C'], ['teisipäev', '−2 °C'], ['kolmapäev', '1 °C'], ['neljapäev', '−4 °C'], ['reede', '5 °C']] },
      primaryObjectiveId: O2,
      variantGroupId: g(26),
      cognitiveLevel: 'application',
      difficulty: 2,
      explanation: 'Vesi jäätub, kui on külmem kui 0 °C. Nii oli teisipäeval (−2 °C) ja neljapäeval (−4 °C).',
      answer: multi([['e', 'esmaspäeval'], ['t', 'teisipäeval'], ['k', 'kolmapäeval'], ['n', 'neljapäeval'], ['r', 'reedel']], ['t', 'n'])
    }),
    question({
      id: id(16),
      stem: 'Millal võis lombi jää sulama hakata?',
      context: { kind: 'table', caption: 'Õhutemperatuur ühel päeval', headers: ['Aeg', 'Temperatuur'], rows: [['hommikul', '−3 °C'], ['lõunal', '2 °C'], ['õhtul', '−1 °C']] },
      primaryObjectiveId: O2,
      variantGroupId: g(26),
      cognitiveLevel: 'application',
      difficulty: 2,
      explanation: 'Jää sulab, kui on soojem kui 0 °C. Nii oli ainult lõunal (2 °C).',
      answer: single([['hommik', 'hommikul'], ['louna', 'lõunal'], ['ohtu', 'õhtul']], 'louna', true)
    }),
    question({ id: id(17), stem: 'Järjesta vesi kõige külmemast kõige soojemani.', primaryObjectiveId: O2, variantGroupId: g(32), cognitiveLevel: 'application', difficulty: 2, explanation: 'Sügavkülmas on umbes −18 °C, külmkapis umbes 4 °C, kraanivesi on soojem ja veekeetjas keev vesi on 100 °C.', answer: ordering(['vesi sügavkülmast (−18 °C)', 'vesi külmkapist (4 °C)', 'vesi kraanist (15 °C)', 'keev vesi veekeetjast (100 °C)'], 'Kõige külmem', 'Kõige soojem') }),

    /* ---- O3: olekumuutused ---- */
    question({ id: id(18), stem: 'Kuidas nimetatakse seda, kui jää muutub veeks?', primaryObjectiveId: O3, variantGroupId: g(6), cognitiveLevel: 'factual', explanation: 'Kui jää muutub soojenedes veeks, nimetatakse seda sulamiseks.', answer: single([['sulamine', 'sulamine'], ['jaatumine', 'jäätumine'], ['aurustumine', 'aurustumine'], ['kondens', 'kondenseerumine']], 'sulamine') }),
    question({ id: id(19), stem: 'Kuidas nimetatakse seda, kui vesi muutub veeauruks?', primaryObjectiveId: O3, variantGroupId: g(7), cognitiveLevel: 'factual', explanation: 'Kui vesi muutub veeauruks ja läheb õhku, nimetatakse seda aurustumiseks.', answer: single([['sulamine', 'sulamine'], ['jaatumine', 'jäätumine'], ['aurustumine', 'aurustumine'], ['kondens', 'kondenseerumine']], 'aurustumine') }),
    question({ id: id(20), stem: 'Kuidas nimetatakse seda, kui veeaur muutub tagasi veepiiskadeks?', primaryObjectiveId: O3, variantGroupId: g(8), cognitiveLevel: 'factual', explanation: 'Kui veeaur jahtub ja muutub pisikesteks piiskadeks, nimetatakse seda kondenseerumiseks.', answer: single([['sulamine', 'sulamine'], ['jaatumine', 'jäätumine'], ['aurustumine', 'aurustumine'], ['kondens', 'kondenseerumine']], 'kondens') }),
    question({ id: id(21), stem: 'Ühenda muutus ja selle nimetus.', primaryObjectiveId: O3, variantGroupId: g(24), cognitiveLevel: 'factual', difficulty: 2, explanation: 'Jää → vesi on sulamine, vesi → jää on jäätumine, vesi → veeaur on aurustumine ja veeaur → vesi on kondenseerumine.', answer: matching([['jää muutub veeks', 'sulamine'], ['vesi muutub jääks', 'jäätumine'], ['vesi muutub veeauruks', 'aurustumine'], ['veeaur muutub veepiiskadeks', 'kondenseerumine']]) }),
    question({ id: id(22), stem: 'Miks tekivad külma joogiklaasi välisküljele veepiisad?', primaryObjectiveId: O3, variantGroupId: g(16), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Õhus on nähtamatut veeauru. Külma klaasi peal see jahtub ja kondenseerub piiskadeks.', misconception: 'Vesi ei imbu läbi klaasi – piisad tulevad õhust.', answer: single([['kondens', 'Õhus olev veeaur jahtub klaasi peal ja muutub piiskadeks.'], ['imbub', 'Vesi imbub läbi klaasi välja.'], ['jook', 'Jook aurustub läbi klaasi.'], ['lagi', 'Piisad tilguvad laest.']], 'kondens') }),
    question({ id: id(23), stem: 'Miks läheb vannitoa peegel pärast sooja dušši uduseks?', primaryObjectiveId: O3, variantGroupId: g(16), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Soe veeaur jahtub külma peegli peal ja muutub pisikesteks veepiiskadeks. See on kondenseerumine.', answer: single([['kondens', 'Soe veeaur jahtub peeglil ja muutub pisikesteks veepiiskadeks.'], ['sulab', 'Peegel hakkab sulama.'], ['aurustub', 'Peeglist aurustub vett.'], ['valgus', 'Lambi valgus teeb peegli uduseks.']], 'kondens') }),
    question({ id: id(24), stem: 'Miks kuivab märg pesu nööril?', primaryObjectiveId: O3, variantGroupId: g(17), cognitiveLevel: 'understanding', explanation: 'Pesus olev vesi aurustub: see muutub veeauruks ja läheb õhku.', answer: single([['aurustub', 'Vesi aurustub ja läheb õhku veeauruna.'], ['kulmub', 'Vesi külmub pesus kinni.'], ['kondens', 'Vesi kondenseerub pesu peale.'], ['imeb', 'Pesu neelab vee endasse ja vesi kaob ära.']], 'aurustub') }),
    question({ id: id(25), stem: 'Rühmita: kas see muutus toimub soojenedes või jahtudes?', primaryObjectiveId: O3, variantGroupId: g(18), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Sulamine ja aurustumine toimuvad soojenedes, jäätumine ja kondenseerumine jahtudes.', answer: grouping([['soe', 'soojenedes'], ['kulm', 'jahtudes']], [['sulamine', 'soe'], ['aurustumine', 'soe'], ['jäätumine', 'kulm'], ['kondenseerumine', 'kulm']]) }),
    question({
      id: id(26),
      stem: 'Mis juhtus kinnastes oleva veega?',
      context: { kind: 'text', paragraphs: ['Mari pani märjad kindad sooja radiaatori peale. Hommikuks olid kindad kuivad.'] },
      primaryObjectiveId: O3,
      variantGroupId: g(27),
      cognitiveLevel: 'application',
      difficulty: 2,
      explanation: 'Soojus pani kinnastes oleva vee aurustuma. Vesi läks õhku veeauruna.',
      answer: single([['aurustus', 'See aurustus soojuse mõjul.'], ['jaatus', 'See jäätus.'], ['kondens', 'See kondenseerus kinnastele.'], ['kivi', 'See muutus kivimiks.']], 'aurustus')
    }),
    question({ id: id(27), stem: 'Sa tahad, et jääkuubik sulaks kiiresti. Kuhu see panna?', primaryObjectiveId: O3, variantGroupId: g(28), cognitiveLevel: 'application', explanation: 'Jää sulab soojenedes. Soojas kohas saab jää kõige kiiremini soojust.', answer: single([['soe', 'sooja tuppa päikese kätte'], ['kulmik', 'sügavkülma'], ['lumi', 'lumehange sisse']], 'soe') }),

    /* ---- O4: vee ringkäik ---- */
    question({ id: id(28), stem: 'Mis paneb vee ringkäigu liikuma?', primaryObjectiveId: O4, variantGroupId: g(9), cognitiveLevel: 'factual', explanation: 'Päikese soojus paneb vee aurustuma ja nii algab vee ringkäik.', answer: single([['paike', 'Päikese soojus'], ['kuu', 'Kuu valgus'], ['kalad', 'kalade liikumine']], 'paike') }),
    question({ id: id(29), stem: 'Kus vee ringkäigus vesi aurustub? Näita joonisel.', primaryObjectiveId: O4, variantGroupId: g(10), cognitiveLevel: 'factual', explanation: 'Päike soojendab merd ja merest aurustub vesi.', answer: hotspot('demo-water-cycle', 'sea') }),
    question({ id: id(30), stem: 'Mis on sademed?', primaryObjectiveId: O4, variantGroupId: g(11), cognitiveLevel: 'factual', explanation: 'Sademed on vesi, mis langeb pilvest maale: vihm, lumi või rahe.', answer: single([['sademed', 'Vihm, lumi või rahe, mis langeb pilvest maale.'], ['pilved', 'Pilved taevas.'], ['meri', 'Vesi meres.'], ['aur', 'Veeaur õhus.']], 'sademed') }),
    question({ id: id(31), stem: 'Vali kõik, mis on sademed.', primaryObjectiveId: O4, variantGroupId: g(21), cognitiveLevel: 'factual', explanation: 'Vihm, lumi ja rahe on sademed. Tuul ja päikesepaiste ei ole vesi.', answer: multi([['vihm', 'vihm'], ['lumi', 'lumi'], ['rahe', 'rahe'], ['tuul', 'tuul'], ['paike', 'päikesepaiste']], ['vihm', 'lumi', 'rahe']) }),
    question({ id: id(32), stem: 'Pane vee ringkäigu sammud õigesse järjekorda.', primaryObjectiveId: O4, variantGroupId: g(19), cognitiveLevel: 'understanding', difficulty: 3, explanation: 'Päike soojendab vett, vesi aurustub, veeaur jahtub ja tekib pilv, pilvest sajab ja vesi voolab tagasi merre.', answer: ordering(['Päike soojendab merevett.', 'Vesi aurustub ja tõuseb veeauruna üles.', 'Veeaur jahtub ja tekib pilv.', 'Pilvest sajab vihma.', 'Vihmavesi voolab jõgede kaudu merre.'], 'Esimene', 'Viimane') }),
    question({ id: id(33), stem: 'Miks tekivad pilved kõrgel taevas?', primaryObjectiveId: O4, variantGroupId: g(20), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Kõrgel on õhk külmem. Seal veeaur jahtub ja kondenseerub pisikesteks piiskadeks – nii tekib pilv.', answer: single([['kulm', 'Kõrgel on õhk külmem ja veeaur muutub seal pisikesteks piiskadeks.'], ['soe', 'Kõrgel on õhk soojem kui maa peal.'], ['kosmos', 'Pilved tulevad kosmosest.'], ['suits', 'Tuul teeb pilvi suitsust.']], 'kulm') }),
    question({ id: id(34), stem: 'Miks ei saa meri tühjaks, kuigi sellest aurustub kogu aeg vett?', primaryObjectiveId: O4, variantGroupId: g(33), cognitiveLevel: 'understanding', difficulty: 2, explanation: 'Aurustunud vesi sajab vihmana tagasi ning jõed toovad vee merre. Vesi liigub ringiga.', answer: single([['tagasi', 'Vihm ja jõed toovad vee tagasi merre.'], ['uus', 'Merre ei tule kunagi uut vett.'], ['ei', 'Merest ei aurustu üldse vett.'], ['kalad', 'Kalad teevad uut vett.']], 'tagasi') }),
    question({ id: id(35), stem: 'Kus veeaur jahtub ja muutub pisikesteks veepiiskadeks? Näita joonisel.', primaryObjectiveId: O4, variantGroupId: g(29), cognitiveLevel: 'application', difficulty: 2, explanation: 'Kõrgel taevas veeaur jahtub ja kondenseerub. Nii tekib pilv.', answer: hotspot('demo-water-cycle', 'cloud') }),
    question({
      id: id(36),
      stem: 'Kuhu läks lompide vesi?',
      context: { kind: 'text', paragraphs: ['Pärast vihma olid tänaval lombid. Päike paistis terve päeva ja õhtuks olid lombid kadunud.'] },
      primaryObjectiveId: O4,
      variantGroupId: g(30),
      cognitiveLevel: 'application',
      difficulty: 2,
      explanation: 'Päike soojendas lompe ja vesi aurustus. Veeaur läks õhku ja võib hiljem pilvest uuesti alla sadada.',
      answer: single([['aur', 'See aurustus ja läks õhku veeauruna.'], ['jaa', 'See muutus jääks.'], ['kuu', 'Kuu tõmbas selle ära.'], ['liiv', 'See muutus liivaks.']], 'aur')
    }),

    /* ---- O5 (not required): practice only ---- */
    question({ id: id(37), stem: 'Miks ujub jää vee peal?', primaryObjectiveId: O5, variantGroupId: g(34), cognitiveLevel: 'understanding', eligibility: { practice: true, test: false }, explanation: 'Jää on veest kergem, sellepärast see ujub.', answer: single([['kergem', 'Jää on veest kergem.'], ['raskem', 'Jää on veest raskem.'], ['kuum', 'Jää on veest soojem.']], 'kergem') })
  ]
};
