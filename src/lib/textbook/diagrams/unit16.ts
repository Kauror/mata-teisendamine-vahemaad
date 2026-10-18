import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 16 "Maailmameri" (lk 64–65). Original teaching
// pictures, not copies of the textbook illustrations. The world map draws the
// real Natural Earth continent outlines (public domain, generalised); the other
// three are schematics. Spread into DIAGRAMS. Region IDs and markers follow
// UNIT16_DIAGRAMS.md exactly. Titles never name a region (hotspot secrecy).
export const UNIT16_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u16-land-water',
    title: 'Mis katab Maa pinda',
    description: 'Lihtne tulpjoonis, mitte kaart. Üks pikk tulp on jagatud kaheks: vasakul lühem roheline osa on maismaa (umbes 29 protsenti Maa pinnast), paremal palju pikem sinine osa on vesi (umbes 71 protsenti).',
    drawingNote: 'One horizontal bar (viewBox 360×170): a shorter green left part (29 % of the bar) and a much longer blue right part (71 %), split by a clean white gap. Percentages shown under the bar in lessons and feedback only.',
    demo: false,
    regions: [
      { id: 'land', label: 'maismaa', marker: 'A', position: 'tulba vasak, lühem osa' },
      { id: 'water', label: 'vesi', marker: 'B', position: 'tulba parem, pikem osa' }
    ]
  },
  {
    id: 'u16-five-oceans',
    title: 'Maailmakaart',
    description: 'Maailmakaart päris mandrite piirjoontega, põhi on üleval. Vasakul on Põhja- ja Lõuna-Ameerika, keskel Euroopa ja Aafrika, paremal Aasia ja Austraalia, all Antarktika. Vaikne ookean on Ameerikast läänes ning paistab kaardi mõlemal serval, kuigi see on üks ookean. Atlandi ookean on Ameerika ning Euroopa ja Aafrika vahel. India ookean on Aafrikast idas, Aasiast lõunas ja Austraaliast läänes. Põhja-Jäämeri on kaardi ülaosas põhjapooluse ümber. Lõuna-Jäämeri on Antarktika ümber; ookeanide piirid on seal kokkuleppelised.',
    drawingNote: 'Equirectangular world map (Natural Earth outlines from data/world_continent_paths.json, scaled ½ into a 360×180 map), North up, Americas left. Continuous blue ocean, no ocean boundary lines. Pacific marker A at BOTH side edges (one region, two tap areas), B Atlantic, C Indian, D Arctic, E Southern.',
    demo: false,
    regions: [
      { id: 'pacific', label: 'Vaikne ookean', marker: 'A', position: 'vesi kaardi vasakul ja paremal serval' },
      { id: 'atlantic', label: 'Atlandi ookean', marker: 'B', position: 'vesi kaardi keskel, Aafrikast vasakul' },
      { id: 'indian', label: 'India ookean', marker: 'C', position: 'vesi keskelt paremal ja allpool' },
      { id: 'arctic', label: 'Põhja-Jäämeri', marker: 'D', position: 'vesi kaardi ülaservas' },
      { id: 'southern', label: 'Lõuna-Jäämeri', marker: 'E', position: 'vesi kaardi allservas' }
    ]
  },
  {
    id: 'u16-water-forms',
    title: 'Kolm väljamõeldud rannikut',
    description: 'Kolm väljamõeldud ranniku pilti kõrvuti, mitte päris kohad. Vasakul on lai avaveeala maismaa ääres: meri. Keskel on kitsas veeriba kahe maismaa vahel, mis ühendab kaht suuremat veeala: väin. Paremal ulatub vesi sopina sügavale maismaa sisse: laht.',
    drawingNote: 'Three framed panels side by side (viewBox 360×190). Left: broad open water beside an irregular coast. Middle: two separate land masses with a narrow channel joining wider water at both ends. Right: sea water reaching deep into a land indentation. Fictional coasts.',
    demo: false,
    regions: [
      { id: 'sea', label: 'meri', marker: 'A', position: 'vasakpoolne pilt' },
      { id: 'strait', label: 'väin', marker: 'B', position: 'keskmine pilt' },
      { id: 'bay', label: 'laht', marker: 'C', position: 'parempoolne pilt' }
    ]
  },
  {
    id: 'u16-baltic-connection',
    title: 'Meie kodumere ühendus ookeaniga',
    description: 'Lihtsustatud seoseskeem, mitte kaart ega mõõtkavas: neli kasti üksteise all, nende vahel kahesuunalised nooled. Ülemine on Läänemeri, alumine Atlandi ookean. Läänemeri on Taani väinade kaudu ühenduses Põhjamerega ja Põhjameri Atlandi ookeaniga. Vesi võib liikuda mõlemas suunas.',
    drawingNote: 'Four rounded boxes stacked top to bottom (viewBox 360×300, a vertical chain reads on a phone), joined by double-headed arrows: Baltic (top) → Danish straits (narrow, dashed) → North Sea → Atlantic (bottom, widest). A topological connection, not a coastline map, a route or a current.',
    demo: false,
    regions: [
      { id: 'baltic', label: 'Läänemeri', marker: 'A', position: 'ülemine kast' },
      { id: 'straits', label: 'Taani väinad', marker: 'B', position: 'teine kast ülalt' },
      { id: 'north-sea', label: 'Põhjameri', marker: 'C', position: 'kolmas kast ülalt' },
      { id: 'atlantic', label: 'Atlandi ookean', marker: 'D', position: 'alumine kast' }
    ]
  }
];
