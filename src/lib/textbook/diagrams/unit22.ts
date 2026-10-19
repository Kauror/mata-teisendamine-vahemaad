import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 22 "Loodusõnnetused" (lk 82–83; the chapter goes on
// after p 83, the package covers only these two pages). Original simplified
// teaching schematics drawn from the package mockups, not copies of the
// textbook photos (Laagna tee, the 2021 floods) and not real places, forecasts
// or warnings. The flood-safety and supplies pictures follow Päästeamet,
// Ole valmis! and WHO advice, not the textbook. Spread into DIAGRAMS.
// Region IDs, markers and positions follow UNIT22_DIAGRAMS.md exactly.
// Titles never name a region (a hotspot question shows the title): the
// package titles "Vihmast põhjustatud üleujutus" and "Merevee tõus tormiga"
// named the flooded road and the storm wind, so they were renamed. The roof
// region's label is "korras katus" (the package's "korras maja" did not say
// which part of the house it marks; its mockup already said "korras katus").
export const UNIT22_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u22-hazard-scenarios',
    title: 'Tavaline ilm ja loodusõnnetuse näited',
    description: 'Lihtsustatud kujuteldavad olukorrad, mitte päris sündmused. Neli kaarti: vasakul üleval kerge vihmasabin rohelise muru kohal, paremal üleval üleujutus, kus vesi ulatub maja akendeni, vasakul all rahulik päikesepaiste, paremal all tormikahju, kus tuul on murdnud puu vastu maja katust.',
    drawingNote: 'Four cards on a 2 × 2 grid (viewBox 360×300): top left a light cloud with a few thin drops over grass; top right a dark cloud with heavy rain and a house standing in water up to its windows; bottom left a sun over a green hill; bottom right a dark cloud, wind lines and a broken tree fallen onto a roof. No water in the storm card.',
    demo: false,
    regions: [
      { id: 'mild-rain', label: 'kerge vihmasabin', marker: 'A', position: 'vasak ülemine illustratsioon' },
      { id: 'flood', label: 'üleujutus', marker: 'B', position: 'parem ülemine illustratsioon' },
      { id: 'sunny', label: 'rahulik päikesepaiste', marker: 'C', position: 'vasak alumine illustratsioon' },
      { id: 'storm-damage', label: 'tormikahju', marker: 'D', position: 'parem alumine illustratsioon' }
    ]
  },
  {
    id: 'u22-prepared-home',
    title: 'Kuidas kodu valmistub ohtlikuks ilmaks?',
    description: 'Lihtsustatud skeem, mitte mõõtkavas. Maja vihmasajus: korras katus, maja vasakus nurgas vihmaveetoru, mis juhib vee maapinnal olevasse äravooluavasse, maja sees riiulile kõrgemale tõstetud esemed ja maja kõrval valmis pandud valmisoleku kott. Need ettevalmistused vähendavad kahju, kuid ei taga, et vesi kunagi majja ei pääse.',
    drawingNote: 'A house in the rain (viewBox 360×280): roof on top; a downpipe at the left corner into a ground drain; a cut-away room on the right with boxes on a high shelf and an arrow up from the floor; a packed bag on the ground to the right of the house. Cloud and rain top right.',
    demo: false,
    regions: [
      { id: 'drain', label: 'vihmavee äravool', marker: 'A', position: 'maja alumine vasak nurk' },
      { id: 'roof', label: 'korras katus', marker: 'B', position: 'maja ülaosa' },
      { id: 'high-storage', label: 'kõrgemale paigutatud esemed', marker: 'C', position: 'maja parempoolne osa' },
      { id: 'kit', label: 'valmisoleku kott', marker: 'D', position: 'parem alumine osa' }
    ]
  },
  {
    id: 'u22-estonia-weather',
    title: 'Eestis võimalikud ohtlikud ilmanähtused',
    description: 'Viis kõrvuti sümbolit, vasakult paremale: paduvihm (tume pilv ja tihe vihm), väga tugev tuul (tuules painduv puu ja lendav oks), tuisk (tuul kannab lund viltu edasi), pakane (madala näiduga sinine termomeeter ja jääpurikad) ning suur kuumus (lõõmav päike ja kõrge näiduga punane termomeeter).',
    drawingNote: 'Five tall cards in a row (viewBox 360×220): downpour cloud with dense rain and a puddle; a tree bending in the wind with a flying branch; snow driven sideways by wind lines over a drift; a cold blue thermometer with icicles (no snowflakes, so it is not the blizzard); a big sun, heat waves and a hot red thermometer.',
    demo: false,
    regions: [
      { id: 'downpour', label: 'paduvihm', marker: 'A', position: 'kõige vasakpoolsem sümbol' },
      { id: 'wind', label: 'väga tugev tuul', marker: 'B', position: 'vasakult teine sümbol' },
      { id: 'blizzard', label: 'tuisk', marker: 'C', position: 'keskmine sümbol' },
      { id: 'frost', label: 'pakane', marker: 'D', position: 'paremalt teine sümbol' },
      { id: 'heat', label: 'suur kuumus', marker: 'E', position: 'parempoolne sümbol' }
    ]
  },
  {
    id: 'u22-rain-flood',
    title: 'Kui vihma sajab liiga palju',
    description: 'Lihtsustatud läbilõige, mitte mõõtkavas. Vasakul üleval sajab pilvest tugevat vihma. Vesi ei jõua nõlval piisavalt kiiresti maasse imbuda ja voolab mööda maapinda alla tänavale. Tänava ääres on äravooluava, mis juhib vett torusse. Paremal madalas kohas on vesi kogunenud teele ja katab selle.',
    drawingNote: 'Cross-section (viewBox 360×260): a rain cloud top left; a grassy slope on the left with blue arrows of water running down its surface; a paved street with a curb drain and a pipe below it in the middle; the road dips on the right and the dip is full of water, a car standing in it up to its wheels.',
    demo: false,
    regions: [
      { id: 'cloud', label: 'sajupilv', marker: 'A', position: 'ülemine vasak osa' },
      { id: 'runoff', label: 'maapinnal voolav vesi', marker: 'B', position: 'keskmine vasak osa' },
      { id: 'drain', label: 'äravooluava', marker: 'C', position: 'keskmine parem osa' },
      { id: 'flooded-road', label: 'üleujutatud tee', marker: 'D', position: 'alumine parem osa' }
    ]
  },
  {
    id: 'u22-coastal-flood',
    title: 'Kui merevesi tõuseb',
    description: 'Lihtsustatud läbilõige, mitte mõõtkavas. Vasakul on meri, mille kohal puhub tugev tuul ranniku poole. Tuul on kuhjanud vett rannale, nii et veepind on tavalisest veepiirist kõrgemal ja katab paremal madala rannaala. Kõrgemal maal paremal asuv hoone jääb kuivaks.',
    drawingNote: 'Cross-section (viewBox 360×260): the sea on the left with waves, the dashed usual waterline below the raised water surface; three wind arrows over the sea pointing to the shore; the low shore on the right under the raised water (grass tufts and a fence half under water); higher ground on the far right with a house on it, dry.',
    demo: false,
    regions: [
      { id: 'sea', label: 'meri', marker: 'A', position: 'vasak alumine osa' },
      { id: 'wind', label: 'tormituul', marker: 'B', position: 'vasak ülemine osa' },
      { id: 'low-shore', label: 'madal rannik', marker: 'C', position: 'parem alumine osa' },
      { id: 'shore-house', label: 'rannikul asuv hoone', marker: 'D', position: 'parem ülemine osa' }
    ]
  },
  {
    id: 'u22-flood-safety',
    title: 'Ohutu ja ohtlik koht üleujutuse ajal',
    description: 'Lihtsustatud kujuteldavad olukorrad. Neli kaarti: vasakul üleval kõrge kuiv küngas, mille jalami juures on vesi; paremal üleval kuival maal asuv hoone, kuhu saab varju minna; vasakul all tee, mille on katnud voolav vesi; paremal all mahakukkunud elektrijuhe, mis ulatub veeloiku.',
    drawingNote: 'Four cards on a 2 × 2 grid (viewBox 360×300), all panels the same colour (no safe/danger tint): top left a high green hill with water only at its foot; top right a building with a door on dry ground; bottom left a road disappearing under moving water, a half-sunk sign post; bottom right a pole with a wire hanging down into a puddle and a spark.',
    demo: false,
    regions: [
      { id: 'high-ground', label: 'kuiv kõrgem koht', marker: 'A', position: 'vasak ülemine osa' },
      { id: 'floodwater', label: 'üleujutatud tee', marker: 'B', position: 'vasak alumine osa' },
      { id: 'power-line', label: 'langenud elektrijuhe', marker: 'C', position: 'parem alumine osa' },
      { id: 'dry-shelter', label: 'kuiv varjualune', marker: 'D', position: 'parem ülemine osa' }
    ]
  },
  {
    id: 'u22-prepared-kit',
    title: 'Valmisoleku asjad',
    description: 'Viis kaarti: üleval vasakult joogiveepudel, taskulamp ja patareidega raadio; all laetud akuga telefon ja paberil ametlik hoiatus hoiatusmärgiga. Need on õppematerjal, mitte mängus kogutavad asjad.',
    drawingNote: 'Three cards on top, two below (viewBox 360×280): a water bottle; a torch with its light beam; a radio with antenna, speaker, knob and a battery; a phone whose screen shows a full green battery; a paper notice with a warning triangle and text lines (drawn as shapes, no letters).',
    demo: false,
    regions: [
      { id: 'water', label: 'joogivesi', marker: 'A', position: 'vasak ülemine ese' },
      { id: 'flashlight', label: 'taskulamp', marker: 'B', position: 'keskmine ülemine ese' },
      { id: 'radio', label: 'patareiraadio', marker: 'C', position: 'parem ülemine ese' },
      { id: 'phone', label: 'laetud telefon', marker: 'D', position: 'vasak alumine ese' },
      { id: 'warning', label: 'ametlik hoiatus', marker: 'E', position: 'parem alumine ese' }
    ]
  }
];
