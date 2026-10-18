import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 17 "Eesti geograafiline asend" (lk 66–67). Two
// hemisphere schematics, then three maps drawn from simplified Natural Earth
// 1:110m public-domain outlines (not survey maps, not legal borders). Spread
// into DIAGRAMS. Region IDs, markers and labels follow UNIT17_DIAGRAMS.md.
// No title names a region: in a hotspot question the title is still read out.
export const UNIT17_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u17-hemispheres',
    title: 'Poolkerad',
    description: 'Kaks lihtsustatud Maa skeemi kõrvuti. Vasakul ringil jagab ekvaator Maa põhjapoolkeraks (ülemine pool) ja lõunapoolkeraks (alumine pool). Paremal ringil jagab nullmeridiaan Maa läänepoolkeraks (vasak pool) ja idapoolkeraks (parem pool).',
    drawingNote: 'Two disks side by side (viewBox 360×220). Left disk split by a horizontal dashed equator into top and bottom halves; right disk split by a vertical dashed prime meridian into left and right halves. In lessons the northern and eastern halves are tinted; in a hotspot question all four halves look alike.',
    demo: false,
    regions: [
      { id: 'north', label: 'põhjapoolkera', marker: 'A', position: 'vasaku ringi ülemine osa' },
      { id: 'south', label: 'lõunapoolkera', marker: 'B', position: 'vasaku ringi alumine osa' },
      { id: 'west', label: 'läänepoolkera', marker: 'C', position: 'parema ringi vasak osa' },
      { id: 'east', label: 'idapoolkera', marker: 'D', position: 'parema ringi parem osa' }
    ]
  },
  {
    id: 'u17-world-location',
    title: 'Eesti asukoht maailmakaardil',
    description: 'Lihtsustatud maailmakaart kuue mandriga, mitte mõõtkavas. Üleval paremal on suurim manner Euraasia, selle loodeosas on punane täpp Eesti kohal. Euraasiast lõunas on Aafrika, vasakul üleval Põhja-Ameerika ja all Lõuna-Ameerika, paremal all Austraalia ja kõige all Antarktis.',
    drawingNote: 'Equirectangular world map from world_continent_paths.json drawn at half scale (viewBox 360×180), six continents plus neutral Oceania islands. In lessons Eurasia is tinted and a red dot marks Estonia (59° N, 25° E, not to scale); in a hotspot question every continent looks alike and there is no dot.',
    demo: false,
    regions: [
      { id: 'eurasia', label: 'Euraasia', marker: 'A', position: 'ülemine parem suur maismaa' },
      { id: 'africa', label: 'Aafrika', marker: 'B', position: 'keskmine maismaa' },
      { id: 'north-america', label: 'Põhja-Ameerika', marker: 'C', position: 'ülemine vasak maismaa' },
      { id: 'south-america', label: 'Lõuna-Ameerika', marker: 'D', position: 'alumine vasak maismaa' },
      { id: 'australia', label: 'Austraalia', marker: 'E', position: 'alumine parem maismaa' },
      { id: 'antarctica', label: 'Antarktis', marker: 'F', position: 'kõige alumine maismaa' }
    ]
  },
  {
    id: 'u17-baltic-region',
    title: 'Läänemere ümbruse riigid',
    description: 'Lihtsustatud kaart Läänemere ümbrusest, riigipiirid on üldistatud. Eesti on Läänemere idakaldal. Eestist põhjas üle Soome lahe on Soome, läänes üle Läänemere Rootsi, lõunas Läti, idas Venemaa ja Lätist lõunas Leedu.',
    drawingNote: 'Natural Earth 1:110m country outlines from u17-baltic-country-paths.json, cropped to the eastern Baltic (viewBox 360×385). Estonia (with schematic Saaremaa and Hiiumaa), Latvia, Lithuania, Finland, Sweden and Russia are regions; Norway, Belarus, Poland and Denmark are grey context. In lessons Estonia is yellow; in a hotspot question all six regions look alike.',
    demo: false,
    regions: [
      { id: 'estonia', label: 'Eesti', marker: 'A', position: 'keskmine väike ala' },
      { id: 'finland', label: 'Soome', marker: 'B', position: 'ülemine keskosa' },
      { id: 'sweden', label: 'Rootsi', marker: 'C', position: 'vasak keskosa' },
      { id: 'latvia', label: 'Läti', marker: 'D', position: 'alumine keskosa' },
      { id: 'russia', label: 'Venemaa', marker: 'E', position: 'parempoolne ala' },
      { id: 'lithuania', label: 'Leedu', marker: 'F', position: 'kõige alumine ala' }
    ]
  },
  {
    id: 'u17-estonia-waters',
    title: 'Eestit ümbritsevad veekogud',
    description: 'Lihtsustatud kaart Eestist ja seda ümbritsevatest veekogudest. Eestist läänes on avar Läänemeri, põhjas Eesti ja Soome vahel kitsas Soome laht, edelas Eesti ja Läti vahel Liivi laht ning idapiiril sisemaa järv Peipsi järv.',
    drawingNote: 'Natural Earth 1:110m outlines zoomed on Estonia (viewBox 360×180) with schematic Saaremaa and Hiiumaa; Estonia is yellow in every mode. Sea is the background; Lake Peipus is an illustrative oval on the eastern border, darker than the sea and outlined, to tell an inland lake from the sea.',
    demo: false,
    regions: [
      { id: 'baltic-sea', label: 'Läänemeri', marker: 'A', position: 'vasakul paiknev suur veeala' },
      { id: 'gulf-finland', label: 'Soome laht', marker: 'B', position: 'ülemine kitsas veeala' },
      { id: 'gulf-riga', label: 'Liivi laht', marker: 'C', position: 'alumine keskmine veeala' },
      { id: 'lake-peipus', label: 'Peipsi järv', marker: 'D', position: 'parempoolne veekogu' }
    ]
  }
];
