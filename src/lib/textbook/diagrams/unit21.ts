import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 21 "Maavärinad" (lk 78–81). Original teaching
// schematics, not copies of the textbook pictures and not to scale. The world
// map uses the shared Natural Earth continent outlines; its dots mark areas,
// not exact faults, and no coastline stands for a plate boundary. The safety
// pictures follow today's CDC/USGS/NOAA advice (stay inside and drop, cover,
// hold on; outdoors stay in the open; on the coast go high or inland), not the
// outdated textbook advice on p 81. Spread into DIAGRAMS.
// Region IDs, labels, markers and positions follow UNIT21_DIAGRAMS.md exactly.
// Titles never name a region (the hotspot question shows the title): the
// package titles "Maavärina kolle ja epitsenter" and "Küki, varju, hoia kinni"
// were renamed for that reason.
export const UNIT21_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u21-plate-stress',
    title: 'Miks maavärin algab?',
    description: 'Lihtsustatud skeem, mitte mõõtkavas. Kaks kõrvuti pilti samast kivimilõigust. Vasakul: kaks kivimiplokki suruvad teineteise poole, nende kokkupuutekoht on kinni jäänud ja kivimitesse koguneb pinge. Paremal: pinge vabaneb järsu nihkena ning üks plokk on teise suhtes nihkunud.',
    drawingNote: 'Two panels side by side (viewBox 360×250). Left "before": two rock blocks pressing together (red arrows), a jagged locked contact at the top of the crack, bent layers and compression arrows low in the rock. Right "after": the same crack with one block jumped up, a short green arrow showing the sudden slip.',
    demo: false,
    regions: [
      { id: 'locked', label: 'takerdunud kivimite koht', marker: 'A', position: 'vasaku paneeli keskmine märk' },
      { id: 'stored-stress', label: 'kogunenud pinge', marker: 'B', position: 'vasakpoolne alumine märk' },
      { id: 'slip', label: 'järsk nihkumine', marker: 'C', position: 'parempoolne märk' }
    ]
  },
  {
    id: 'u21-focus-waves',
    title: 'Maavärin maapinna läbilõikes',
    description: 'Lihtsustatud läbilõige, mitte mõõtkavas. Maa sees on kaldu murrang, millel kivimid liikusid. Murrangul sügaval on maavärina kolle, kust levivad igas suunas ringikujulised seismilised lained. Otse kolde kohal maapinnal on epitsenter.',
    drawingNote: 'Ground cross-section (viewBox 360×260): grass line on top, rock layers below. A slanted fault line from bottom left towards the surface. A red focus dot on the fault deep in the rock, dashed concentric wave rings around it, a dotted vertical line up to the epicentre dot on the surface directly above.',
    demo: false,
    regions: [
      { id: 'focus', label: 'maavärina kolle', marker: 'A', position: 'keskmine alumine märk' },
      { id: 'epicenter', label: 'epitsenter', marker: 'B', position: 'keskmine ülemine märk' },
      { id: 'waves', label: 'seismilised lained', marker: 'C', position: 'parempoolne alumine märk' },
      { id: 'fault', label: 'murrang', marker: 'D', position: 'vasakpoolne alumine märk' }
    ]
  },
  {
    id: 'u21-world-locations',
    title: 'Maavärinate piirkonnad maailmakaardil',
    description: 'Lihtsustatud maailmakaart Natural Earthi üldistatud kontuuridega. Neli tähist märgivad piirkondi: Jaapani ümbrus Aasia idarannikul, Islandi ümbrus Atlandi ookeani põhjaosas, Tšiili rannik Lõuna-Ameerika läänerannikul ja Eesti ümbrus Läänemere ääres. Tähised näitavad piirkondi, mitte täpseid murranguid ega laamapiire.',
    drawingNote: 'Equirectangular world map (viewBox 360×230) from the shared Natural Earth continent outlines, latitudes about 80° N to 60° S. Four dots with rings: Japan, Iceland, the Chile coast and Estonia. No plate boundaries are drawn.',
    demo: false,
    regions: [
      { id: 'japan', label: 'Jaapani ümbrus', marker: 'A', position: 'kaardi parem ülemine tähis' },
      { id: 'iceland', label: 'Islandi ümbrus', marker: 'B', position: 'kaardi ülemine keskmine vasakpoolne tähis' },
      { id: 'chile', label: 'Tšiili rannik', marker: 'C', position: 'kaardi vasak alumine tähis' },
      { id: 'estonia', label: 'Eesti ümbrus', marker: 'D', position: 'kaardi ülemine keskmine parempoolne tähis' }
    ]
  },
  {
    id: 'u21-tsunami-stages',
    title: 'Kuidas tsunami tekib?',
    description: 'Lihtsustatud skeem, mitte mõõtkavas. Kolm paneeli: esimeses nihkub merepõhi järsku ja tõukab vett, teises liigub avamerel madal ja pikk laine, kolmandas jõuab vesi rannikule ning tungib kiire üleujutusena maismaale.',
    drawingNote: 'Three panels side by side (viewBox 360×230): 1) sea over a seafloor with a sudden step and an up arrow; 2) open sea with a long, low bulge on the surface; 3) a sloping shore where the water has risen and runs up onto the land.',
    demo: false,
    regions: [
      { id: 'seafloor', label: 'merepõhja järsk nihkumine', marker: 'A', position: 'esimese paneeli tähis' },
      { id: 'open-ocean', label: 'laine avamerel', marker: 'B', position: 'keskmise paneeli tähis' },
      { id: 'coast', label: 'laine rannikul', marker: 'C', position: 'viimase paneeli tähis' }
    ]
  },
  {
    id: 'u21-tsunami-warnings',
    title: 'Kolm looduslikku tsunamihoiatust',
    description: 'Kolm pildikaarti. Vasakul raputab tugev maavärin rannikumaja. Keskel on meri rannast järsku taandunud ja merepõhi paistab. Paremal kostab merelt tugev ebatavaline mühin. Ka üks märk on piisav, et kohe kõrgemale või sisemaale liikuda.',
    drawingNote: 'Three cards side by side (viewBox 360×220): a shaking house with zigzag shake marks; a beach where the waterline has pulled far back (old waterline dashed, arrow seaward); a sea with curved sound arcs above the waves.',
    demo: false,
    regions: [
      { id: 'strong-shaking', label: 'tugev või pikk maavärin', marker: 'A', position: 'vasaku paneeli tähis' },
      { id: 'water-change', label: 'merevee kiire taandumine või tõus', marker: 'B', position: 'keskmise paneeli tähis' },
      { id: 'sea-roar', label: 'ebatavaline tugev meremühin', marker: 'C', position: 'parema paneeli tähis' }
    ]
  },
  {
    id: 'u21-coastal-escape',
    title: 'Tsunamiohu korral liigu rannikust eemale',
    description: 'Lihtsustatud rannikuprofiil, mitte päris evakuatsioonikaart. Vasakul on meri ja madal rand, keskel viib roheline nool mööda teed sisemaale ja üles, paremal on kõrgem ohutum küngas. Päris rannikul järgi kohalikke evakuatsioonisilte.',
    drawingNote: 'Side profile (viewBox 360×220): sea at the left, a low sandy beach, land rising to a hill at the right. A green route arrow climbs from the beach inland to the hilltop.',
    demo: false,
    regions: [
      { id: 'high-ground', label: 'kõrgem ohutum piirkond', marker: 'A', position: 'parem ülemine tähis' },
      { id: 'inland-route', label: 'sisemaale viiv evakuatsioonisuund', marker: 'B', position: 'keskmine tähis' },
      { id: 'beach', label: 'tsunamiohus rand', marker: 'C', position: 'vasak alumine tähis' }
    ]
  },
  {
    id: 'u21-drop-cover-hold',
    title: 'Maavärin toas',
    description: 'Neli pildikaarti. Esimeses kükitab inimene põrandale. Teises varjub ta tugeva laua alla. Kolmandas hoiab ta laua all laua jalast kinni. Neljandas on aken, mille klaas võib raputamise ajal puruneda, seega tuleb aknast eemale hoida.',
    drawingNote: 'Four cards side by side (viewBox 360×200): a person dropping to hands and knees; the person under a sturdy table; the person under the table holding a table leg; a cracking window with glass shards.',
    demo: false,
    regions: [
      { id: 'drop', label: 'kükitamine', marker: 'A', position: 'esimese paneeli tähis' },
      { id: 'cover', label: 'laua alla varjumine', marker: 'B', position: 'teise paneeli tähis' },
      { id: 'hold', label: 'lauast kinni hoidmine', marker: 'C', position: 'kolmanda paneeli tähis' },
      { id: 'window', label: 'ohtlik akna lähedus', marker: 'D', position: 'neljanda paneeli tähis' }
    ]
  },
  {
    id: 'u21-outdoors',
    title: 'Maavärin õues',
    description: 'Õuevaade. Vasakul on kõrge hoone akende ja fassaadiga, kust võib raputamise ajal asju alla kukkuda. Keskel on avatud muruplats. Paremal on elektripostid ja juhtmed. Avatud ala on üldjuhul turvalisem; hoia eemale hoonetest, puudest ja elektriliinidest.',
    drawingNote: 'Outdoor scene (viewBox 360×220): a tall building with windows at the left, an open lawn in the middle, two utility poles with sagging wires at the right.',
    demo: false,
    regions: [
      { id: 'open-area', label: 'avatud ohutum ala', marker: 'A', position: 'keskmine tähis' },
      { id: 'building', label: 'hoone sein ja aknad', marker: 'B', position: 'vasakpoolne tähis' },
      { id: 'power-lines', label: 'elektriliinid', marker: 'C', position: 'parempoolne tähis' }
    ]
  },
  {
    id: 'u21-aftershock-safety',
    title: 'Ohud pärast maavärinat',
    description: 'Kolm pildikaarti. Vasakul on pragunenud ja kahjustatud hoonesein, mis võib järeltõuke ajal veel kukkuda. Keskel on postilt maha kukkunud elektrijuhe, millest tuleb eemale hoida. Paremal on patareiga töötav raadio, millest saab kuulata ametlikke teateid.',
    drawingNote: 'Three cards side by side (viewBox 360×210): a wall with a zigzag crack and fallen pieces; a utility pole with a wire hanging down to the ground with a spark; a small battery radio with antenna and sound waves.',
    demo: false,
    regions: [
      { id: 'fallen-wire', label: 'mahakukkunud elektrijuhe', marker: 'A', position: 'keskmine tähis' },
      { id: 'damaged-wall', label: 'kahjustatud hooneosa', marker: 'B', position: 'vasakpoolne tähis' },
      { id: 'radio', label: 'patareiraadio', marker: 'C', position: 'parempoolne tähis' }
    ]
  }
];
