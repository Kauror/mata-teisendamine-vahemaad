import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 18 "Euroopa kaart" (lk 68–69). Real maps drawn from
// local, generalised Natural Earth outlines (public domain): the shared
// six-continent silhouettes and the 1:110m countries of Europe. Teaching maps,
// not legal borders; Crimea is drawn as part of Ukraine. Spread into DIAGRAMS.
// Region IDs, labels, markers and positions follow UNIT18_DIAGRAMS.md. The
// titles name no region (a title is shown in hotspot questions too).
export const UNIT18_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u18-europe-world',
    title: 'Maailmajaod maailmakaardil',
    description: 'Lihtsustatud maailmakaart kuue mandriga. Euraasia mandri lääneosas on esile tõstetud Euroopa, idaosas Aasia; nende vahel on kokkuleppeline piir, mitte ookean. Euroopast lõuna pool on Aafrika ja Atlandi ookeani taga vasakul Põhja-Ameerika. Kaart on õppimiseks üldistatud.',
    drawingNote: 'Equirectangular world map from world_continent_paths.json (viewBox 360×160). Eurasia is split along the conventional Ural – Ural river – Caspian – Caucasus – Black Sea – Bosporus line by two clip paths: Europe tinted in lessons, Asia tinted differently, a dashed divide. In hotspot mode every continent has the same neutral land colour and no divide is drawn.',
    demo: false,
    regions: [
      { id: 'europe', label: 'Euroopa', marker: 'A', position: 'ülemine keskosa' },
      { id: 'asia', label: 'Aasia', marker: 'B', position: 'ülemine parempoolne ala' },
      { id: 'africa', label: 'Aafrika', marker: 'C', position: 'keskmine alumine ala' },
      { id: 'north-america', label: 'Põhja-Ameerika', marker: 'D', position: 'ülemine vasakpoolne ala' }
    ]
  },
  {
    id: 'u18-europe-borders',
    title: 'Euroopa piirid',
    description: 'Euroopa kaart riigipiiridega. Läänes ja loodes on Atlandi ookean, põhjas Põhja-Jäämeri, lõunas Vahemeri, mis eraldab Euroopat Aafrikast. Kagus on Must meri ja Kaspia meri, idas kulgeb Uurali mäestik. Asukohad on ligikaudsed.',
    drawingNote: 'Europe country outlines (u18-europe-country-paths.json, viewBox 360×216) on a water background. Five water markers (Atlantic west, Arctic north, Mediterranean south, Black Sea and Caspian south-east) and one land marker on the Urals. The Ural ridge is drawn in lessons and feedback only.',
    demo: false,
    regions: [
      { id: 'atlantic', label: 'Atlandi ookean', marker: 'A', position: 'vasak keskmine veeala' },
      { id: 'arctic', label: 'Põhja-Jäämeri', marker: 'B', position: 'ülemine veeala' },
      { id: 'mediterranean', label: 'Vahemeri', marker: 'C', position: 'alumine keskne veeala' },
      { id: 'black-sea', label: 'Must meri', marker: 'D', position: 'keskosast paremale jääv veeala' },
      { id: 'caspian', label: 'Kaspia meri', marker: 'E', position: 'parempoolne veeala' },
      { id: 'ural', label: 'Uurali mäestik', marker: 'F', position: 'ülemine parempoolne maa-ala' }
    ]
  },
  {
    id: 'u18-europe-area',
    title: 'Pindalalt suured riigid',
    description: 'Euroopa kaart riigipiiridega, esile on tõstetud õpikus nimetatud pindalalt suured riigid: idas Venemaa, selle kõrval Ukraina, läänes Prantsusmaa, edelas Hispaania ja põhjas Rootsi. Venemaast on näha ainult osa, riik jätkub kaugele Aasiasse.',
    drawingNote: 'Europe country outlines cropped to lon −12…62, lat 34…72 (viewBox 360×246). Russia, Ukraine, France, Spain and Sweden tinted in lessons; in hotspot mode they have the neutral land colour like every other country, with letter markers only.',
    demo: false,
    regions: [
      { id: 'russia', label: 'Venemaa (nähtav osa)', marker: 'A', position: 'parempoolne ala' },
      { id: 'ukraine', label: 'Ukraina', marker: 'B', position: 'keskosast paremale jääv ala' },
      { id: 'france', label: 'Prantsusmaa', marker: 'C', position: 'vasakpoolne keskmine ala' },
      { id: 'spain', label: 'Hispaania', marker: 'D', position: 'alumine vasak ala' },
      { id: 'sweden', label: 'Rootsi', marker: 'E', position: 'ülemine keskmine ala' }
    ]
  },
  {
    id: 'u18-europe-population',
    title: 'Rahvaarvult suured riigid',
    description: 'Euroopa kaart riigipiiridega, esile on tõstetud õpikus nimetatud rahvaarvult suured riigid: idas Venemaa, Euroopa keskel Saksamaa, loodes saartel Ühendkuningriik, läänes Prantsusmaa ja lõunas Itaalia. Venemaast on näha ainult osa, riik jätkub kaugele Aasiasse.',
    drawingNote: 'Same crop as u18-europe-area (viewBox 360×246). Russia, Germany, the United Kingdom, France and Italy tinted in lessons; neutral with letter markers in hotspot mode. Tap areas of the four western countries are offset so that they never overlap.',
    demo: false,
    regions: [
      { id: 'russia', label: 'Venemaa (nähtav osa)', marker: 'A', position: 'parempoolne ala' },
      { id: 'germany', label: 'Saksamaa', marker: 'B', position: 'keskmine ala' },
      { id: 'uk', label: 'Ühendkuningriik', marker: 'C', position: 'vasak ülemine ala' },
      { id: 'france', label: 'Prantsusmaa', marker: 'D', position: 'vasak keskmine ala' },
      { id: 'italy', label: 'Itaalia', marker: 'E', position: 'alumine keskmine ala' }
    ]
  }
];
