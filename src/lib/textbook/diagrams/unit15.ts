import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 15 "Mandrid ja maailmajaod" (lk 60–63). The world
// maps draw real land outlines (Natural Earth, public domain, generalised;
// diagrams/data/world_continent_paths.json) — not copies of the textbook maps
// and with no country or Europe–Asia border. Six continents and six world
// parts, as the textbook counts them. Spread into DIAGRAMS. Region IDs,
// labels, markers and positions follow UNIT15_DIAGRAMS.md exactly. Titles
// name no region (they stay visible in hotspot questions).
export const UNIT15_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u15-land-water',
    title: 'Maa pinna jaotus',
    description: 'Riba, mis kujutab kogu Maa pinda. Vasakpoolne väiksem osa on maismaa, umbes 29 protsenti ehk ligikaudu kolmandik. Parempoolne suurem osa on vesi, umbes 71 protsenti.',
    drawingNote: 'One horizontal bar of 100 cells (viewBox 360×170): 29 green land cells on the left, 71 blue water cells on the right. In lessons a caption under the bar gives the rounded percentages.',
    demo: false,
    regions: [
      { id: 'land', label: 'maismaa', marker: 'A', position: 'vasakpoolne väiksem osa' },
      { id: 'water', label: 'vesi', marker: 'B', position: 'parempoolne suurem osa' }
    ]
  },
  {
    id: 'u15-world-continents',
    title: 'Kuus mandrit',
    description: 'Maailmakaart, põhi on üleval. Vasakul ülal Põhja-Ameerika, selle all Lõuna-Ameerika. Keskel ülal suur Euraasia, selle all Aafrika. Paremal all Austraalia ja kaardi kõige alumises osas Antarktis. Euraasia on üks manner.',
    drawingNote: 'Equirectangular world map from world_continent_paths.json scaled to 360×180 (viewBox 360×200, sea background). Six continents in six light tints, Eurasia one shape. Lesson labels sit in the sea next to each continent.',
    demo: false,
    regions: [
      { id: 'north-america', label: 'Põhja-Ameerika', marker: 'A', position: 'vasakpoolne ülemine maismaaala' },
      { id: 'south-america', label: 'Lõuna-Ameerika', marker: 'B', position: 'vasakpoolne alumine maismaaala' },
      { id: 'eurasia', label: 'Euraasia', marker: 'C', position: 'suur ülemine parempoolne maismaaala' },
      { id: 'africa', label: 'Aafrika', marker: 'D', position: 'keskosa maismaaala' },
      { id: 'australia', label: 'Austraalia', marker: 'E', position: 'parempoolne alumine maismaaala' },
      { id: 'antarctica', label: 'Antarktis', marker: 'F', position: 'kõige alumine maismaaala' }
    ]
  },
  {
    id: 'u15-world-parts',
    title: 'Kuus maailmajagu',
    description: 'Maailmakaart ühevärvilise maismaaga, põhi on üleval. Märgid näitavad kuut maailmajagu: Ameerika hõlmab vasakul nii põhja- kui ka lõunapoolset mandrit; Euroopa on Euraasia lääneosas ja Aasia idaosas; Aafrika on keskel; Austraalia ja Okeaania on paremal all koos Vaikse ookeani saartega; Antarktika on kõige all. Euroopa ja Aasia vahele ei ole joont tõmmatud.',
    drawingNote: 'The same world map in one neutral land colour plus the Oceania island outlines (viewBox 360×200). No region fills and no border lines: six markers mark the world parts; a bracket joins the two Americas to the America marker between them.',
    demo: false,
    regions: [
      { id: 'america', label: 'Ameerika', marker: 'A', position: 'vasakpoolne keskala, kahe Ameerika vahel' },
      { id: 'europe', label: 'Euroopa', marker: 'B', position: 'Euraasia läänepoolne ala' },
      { id: 'asia', label: 'Aasia', marker: 'C', position: 'suur Euraasia idapoolne ala' },
      { id: 'africa', label: 'Aafrika', marker: 'D', position: 'kaardi keskosa' },
      { id: 'australia-oceania', label: 'Austraalia ja Okeaania', marker: 'E', position: 'kaardi alumine parem ala' },
      { id: 'antarctica', label: 'Antarktika', marker: 'F', position: 'kõige alumine ala' }
    ]
  },
  {
    id: 'u15-continent-worldpart-links',
    title: 'Manner ja maailmajagu',
    description: 'Kaks võrdlusskeemi. Vasakul üks manner, Euraasia, mis jaguneb kaheks maailmajaoks, Euroopaks ja Aasiaks. Paremal kaks mandrit, Põhja- ja Lõuna-Ameerika, mis moodustavad koos ühe maailmajao, Ameerika.',
    drawingNote: 'Two framed panels side by side (viewBox 360×250). Left: one big box (continent) with arrows to two smaller boxes (world parts). Right: two boxes (continents) with arrows into one box (world part). Box words in lessons only; hotspot mode shows the bare boxes and arrows.',
    demo: false,
    regions: [
      { id: 'eurasia', label: 'Euraasia: üks manner ja kaks maailmajagu', marker: 'A', position: 'vasakpoolne võrdlusskeem' },
      { id: 'america', label: 'Ameerika: kaks mandrit ja üks maailmajagu', marker: 'B', position: 'parempoolne võrdlusskeem' }
    ]
  }
];
