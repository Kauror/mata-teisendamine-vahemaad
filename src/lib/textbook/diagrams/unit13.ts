import type { DiagramDefinition } from '@/lib/textbook/diagramRegistry';

// Loodusõpetus õpik, unit 13 "Kaardi mõõtkava". Original teaching schematics
// of invented places — no textbook map, no real coastline. Spread into
// DIAGRAMS in diagramRegistry.ts. The drawn lengths agree with the stated
// scales inside each picture, but a picture never stands for real screen
// centimetres: the lengths a calculation needs are always written out.
export const UNIT13_DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'u13-area-detail',
    title: 'Kaardi ala ja üksikasjad',
    description: 'Lihtsustatud skeem, väljamõeldud kohad. Kolm kõrvuti kaardivaadet. Vasakul on väga suur piirkond kahe suure maismaa ja ühe tärniga, väikseid teid pole. Keskel on üks saar mõne asula ja teega. Paremal on väike ala paljude tänavate, hoonete ja pargiga.',
    drawingNote: 'Three framed mini-maps side by side (viewBox 420×250), hit areas 120×145 each with 14-unit gaps. Left: two big land masses on sea, one star, no roads. Middle: one island with four town dots and two roads. Right: a street grid with building blocks and a green park. Labels below the frames.',
    demo: false,
    regions: [
      { id: 'large-area', label: 'suur piirkond', marker: 'A', position: 'vasakpoolne kaardivaade' },
      { id: 'regional', label: 'piirkonna kaart', marker: 'B', position: 'keskmine kaardivaade' },
      { id: 'neighbourhood', label: 'väikese ala kaart', marker: 'C', position: 'parempoolne kaardivaade' }
    ]
  },
  {
    id: 'u13-scale-forms',
    title: 'Mõõtkava kolm kuju',
    description: 'Kolm rida, mis näitavad sama mõõtkava. Ülemises reas on jaotustega joon, mille algus on 0 ja lõpp 50 km: kogu joon tähistab 50 km looduses. Keskmises reas on kirjas 1 cm – 50 km. Alumises reas on kirjas 1 : 5 000 000. Kõik kolm tähendavad, et 1 cm kaardil vastab 50 km-le looduses; joone pikkus ekraanil ei ole 1 cm.',
    drawingNote: 'Three cards stacked (viewBox 480×260): top a scale bar with end ticks labelled 0 and 50 km; middle the text "1 cm – 50 km"; bottom the text "1 : 5 000 000". Lesson names at the right of each card. The bar length is the picture\'s map unit (MAP_CM), the same unit the measured-distance picture uses.',
    demo: false,
    regions: [
      { id: 'bar', label: 'joonmõõtkava', marker: 'A', position: 'ülemine rida' },
      { id: 'verbal', label: 'võrdlusmõõtkava', marker: 'B', position: 'keskmine rida' },
      { id: 'numeric', label: 'arvmõõtkava', marker: 'C', position: 'alumine rida' }
    ]
  },
  {
    id: 'u13-measured-distance',
    title: 'Vahemaa arvutamine kaardilt',
    description: 'Skeem, väljamõeldud punktid. Vasakul punkt A ja paremal punkt B, nende vahel sirge lõik. Lõigu kohal on kirjas: kaardil 2 cm. All on infotahvel: mõõtkava 1 : 3 000 000 ehk 1 cm – 30 km. Kaugus looduses on 2 × 30 km = 60 km. Ekraanil ei ole lõik päriselt 2 cm pikk.',
    drawingNote: 'Two place dots A (x=60) and B (x=360) joined by a straight line (viewBox 420×250), with a tick at its middle splitting it into two equal 1 cm map units; "kaardil: 2 cm" above, and an info panel below with "1 : 3 000 000", "1 cm – 30 km" and a small graded bar of one map unit. The segment is exactly twice the panel\'s 1 cm bar.',
    demo: false,
    regions: [
      { id: 'start', label: 'esimene koht', marker: 'A', position: 'vasakpoolne punkt' },
      { id: 'end', label: 'teine koht', marker: 'B', position: 'parempoolne punkt' },
      { id: 'segment', label: 'kaardil mõõdetud sirglõik', marker: 'C', position: 'kahe punkti vaheline keskmine lõik' },
      { id: 'scale', label: 'mõõtkava', marker: 'D', position: 'skeemi alumine infotahvel' }
    ]
  },
  {
    id: 'u13-direct-vs-route',
    title: 'Linnulennult ja mööda teed',
    description: 'Skeem, väljamõeldud kohad. Kaks punkti samal kõrgusel. Nende vahel on ülemine sirge joon ja alumine kaarduv tee, mis algab ja lõpeb samades punktides ning on sirgest joonest pikem. All paremal on kell, mis tähistab sõiduaega.',
    drawingNote: 'Endpoints (60,90) and (335,90) (viewBox 440×260). A solid straight line between them; a dashed road that bows down through the same endpoints, a cubic Bézier with control points (150,175) and (255,175) whose length is computed and tested to be longer. A small clock at the bottom right.',
    demo: false,
    regions: [
      { id: 'direct', label: 'linnulennuline vahemaa', marker: 'A', position: 'ülemine sirge joon' },
      { id: 'road', label: 'teekond mööda teed', marker: 'B', position: 'alumine kaarduv joon' },
      { id: 'clock', label: 'sõiduaeg', marker: 'C', position: 'parem alumine sümbol' }
    ]
  }
];
