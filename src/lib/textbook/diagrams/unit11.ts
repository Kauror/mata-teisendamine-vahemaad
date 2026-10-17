import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 11 "Gloobus" (textbook pages 48–49). Original
// teaching schematics, not copies of the textbook photos, not maps: no real
// coastlines or borders. Spread into DIAGRAMS in diagramRegistry.ts; the SVG
// components are in src/app/components/textbook/diagrams/unit11/.
export const UNIT11_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u11-globe-types',
    title: 'Kaks eri liiki gloobust',
    description: 'Lihtsustatud skeem, mitte päris kaart. Kaks ühesugust gloobust kõrvuti. Vasakul on maismaa värvitud kõrguse järgi: madalam maa roheline, kõrgem kollakaspruun ja mäed pruunid. Paremal on sama maismaa jagatud mitmeks eri värvi alaks nagu riigid; piirid on välja mõeldud, mitte päris riigipiirid.',
    drawingNote: 'Two same-sized globes side by side (viewBox 340×200), the same schematic land on both. Left: blue sea, land coloured by height (green, tan, brown). Right: pale sea, the land split into invented coloured areas with white borders. Two-line labels under each globe.',
    demo: false,
    regions: [
      { id: 'relief-globe', label: 'Pinnamoodi kujutav gloobus', marker: 'A', position: 'vasakpoolne kera' },
      { id: 'political-globe', label: 'Riike kujutav gloobus', marker: 'B', position: 'parempoolne kera' }
    ]
  },
  {
    id: 'u11-axis-poles',
    title: 'Maa kujuteldav telg ja poolused',
    description: 'Lihtsustatud skeem, mitte mõõtkavas. Kera keskelt läheb läbi kaldu olev katkendjoon, kujuteldav pöörlemistelg. Telje ülemine ots puudutab kera põhjapoolusel ja alumine ots lõunapoolusel. Väike nool näitab, et Maa pöörleb ümber selle telje. Päris Maal ei ole telge, see on ainult mõtteline joon.',
    drawingNote: 'Globe centred at (150,145), r 98 (viewBox 300×285). A dashed axis tilted 23.4° from vertical through the centre, sticking out a little at both ends; dots where it meets the sphere (north pole up-left, south pole down-right); a small curved arrow round the axis above the north pole (west to east).',
    demo: false,
    regions: [
      { id: 'north-pole', label: 'Põhjapoolus', marker: 'A', position: 'telje ülemine ots' },
      { id: 'south-pole', label: 'Lõunapoolus', marker: 'B', position: 'telje alumine ots' },
      { id: 'axis', label: 'Pöörlemistelg', marker: 'C', position: 'läbi kera keskosa kulgev joon' }
    ]
  },
  {
    id: 'u11-equator-parallels',
    title: 'Ekvaator, paralleelid ja poolkerad',
    description: 'Lihtsustatud skeem, mitte mõõtkavas. Gloobus veidi ülevalt vaadatuna. Kera kõige laiemast kohast läheb ümber jäme punane joon, ekvaator. Selle kohal ja all on kumbki üks peenem joon, paralleel, mis kulgeb ekvaatoriga samas suunas ega puutu sellega kokku. Ekvaatorist ülespoole jääv osa on põhjapoolkera, allapoole jääv osa lõunapoolkera.',
    drawingNote: 'Globe at (170,135), r 102 (viewBox 340×270), seen from 8° above the equator plane (orthographic). Thick red equator; the 40° N and 40° S parallels as thinner arcs; the two hemispheres in different pale tints. Line markers on the right, hemisphere markers on the left.',
    demo: false,
    regions: [
      { id: 'equator', label: 'Ekvaator', marker: 'A', position: 'keskne horisontaalne joon' },
      { id: 'north-parallel', label: 'Paralleel põhjapoolkeral', marker: 'B', position: 'ülemine õhem joon' },
      { id: 'south-parallel', label: 'Paralleel lõunapoolkeral', marker: 'C', position: 'alumine õhem joon' },
      { id: 'north-hemisphere', label: 'Põhjapoolkera', marker: 'D', position: 'ala keskjoonest ülal' },
      { id: 'south-hemisphere', label: 'Lõunapoolkera', marker: 'E', position: 'ala keskjoonest all' }
    ]
  },
  {
    id: 'u11-meridians-estonia',
    title: 'Nullmeridiaan ja Eesti asukoht',
    description: 'Lihtsustatud suuna- ja asukohaskeem, mitte täpne kaart: riigipiire ja maismaad ei ole joonistatud. Gloobuse keskel läheb ülevalt alla punane nullmeridiaan. Vasakul ja paremal on kaks kõverat meridiaani; kõik meridiaanid saavad kokku põhja- ja lõunapoolusel. Keskelt läheb risti läbi heledam ekvaator. Nullmeridiaanist vasakule jääb läänepoolkera, paremale idapoolkera. Eesti täpp on ekvaatorist põhja pool ja nullmeridiaanist ida pool.',
    drawingNote: 'Globe at (190,150), r 118 (viewBox 380×300), seen straight at the equator (orthographic, prime meridian in the middle). Red straight prime meridian; meridians at 45° W (the marked "other" one) and 45° E (plain); a lighter straight equator; west and east halves in different pale tints; a yellow Estonia dot at 58.6° N, 25° E.',
    demo: false,
    regions: [
      { id: 'other-meridian', label: 'Teine meridiaan', marker: 'A', position: 'vasakpoolne kõver joon' },
      { id: 'prime-meridian', label: 'Nullmeridiaan', marker: 'B', position: 'keskne ülalt alla kulgev joon' },
      { id: 'estonia', label: 'Eesti', marker: 'C', position: 'väike punkt ülemises parempoolses alas' },
      { id: 'west-hemisphere', label: 'Läänepoolkera', marker: 'D', position: 'keskjoonest vasakule jääv ala' },
      { id: 'east-hemisphere', label: 'Idapoolkera', marker: 'E', position: 'keskjoonest paremale jääv ala' }
    ]
  }
];
