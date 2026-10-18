import { UNIT11_DIAGRAMS } from '@/lib/textbook/diagrams/unit11';
import { UNIT12_DIAGRAMS } from '@/lib/textbook/diagrams/unit12';
import { UNIT13_DIAGRAMS } from '@/lib/textbook/diagrams/unit13';
import { UNIT14_DIAGRAMS } from '@/lib/textbook/diagrams/unit14';
import { UNIT21_DIAGRAMS } from '@/lib/textbook/diagrams/unit21';

// The diagrams content may reference — data only. Every `diagram` block,
// `diagram` question context and `diagram_hotspot` question names one of these
// IDs, and the validator refuses anything else. The React SVG component for
// each ID lives in the UI layer (one component per diagram, keyed by `id`);
// it MUST draw exactly the regions listed here, each as a tappable element
// carrying its region ID.
//
// Regions are stable IDs, never pixel coordinates. A region has:
//  - `label`: its real name, shown in lessons and in feedback after answering;
//  - `marker`: a neutral letter drawn on the diagram in hotspot questions,
//    where labels are hidden (otherwise the question answers itself);
//  - `position`: a neutral Estonian description for the accessible list of
//    region buttons ("A – kõige ülemine osa"), which also must not give the
//    answer away.

export type DiagramRegion = {
  id: string;
  label: string;
  marker: string;
  position: string;
};

export type DiagramDefinition = {
  id: string;
  title: string;
  // Accessible description of the whole picture (aria-label / figcaption).
  description: string;
  // What the UI component should draw (authoring note for the SVG builder).
  drawingNote: string;
  // Preview-only demo diagram.
  demo: boolean;
  regions: DiagramRegion[];
};

export const DIAGRAMS: readonly DiagramDefinition[] = [
  {
    id: 'demo-plant-parts',
    title: 'Taime osad',
    description: 'Õistaim ülevalt alla: õis, leht, vars ja maa all juur.',
    drawingNote: 'Upright flowering plant on a soil line. Top to bottom: flower (top), one or two leaves on the stem, the stem, roots below the soil line.',
    demo: true,
    regions: [
      { id: 'flower', label: 'õis', marker: 'A', position: 'kõige ülemine osa' },
      { id: 'leaf', label: 'leht', marker: 'B', position: 'osa varre küljel' },
      { id: 'stem', label: 'vars', marker: 'C', position: 'pikk keskmine osa' },
      { id: 'root', label: 'juur', marker: 'D', position: 'osa mullapinna all' }
    ]
  },
  {
    id: 'demo-water-cycle',
    title: 'Vee ringkäik',
    description: 'Päike soojendab merd, vesi aurustub, ülal tekib pilv ja pilvest sajab vihma tagasi maale ja merre.',
    drawingNote: 'Sun top-left, sea bottom-left with wavy arrows rising (evaporation), a cloud top-right, rain falling from the cloud on the right. Arrows show the loop.',
    demo: true,
    regions: [
      { id: 'sun', label: 'Päike', marker: 'A', position: 'ülemine vasak nurk' },
      { id: 'sea', label: 'meri', marker: 'B', position: 'alumine vasak osa' },
      { id: 'cloud', label: 'pilv', marker: 'C', position: 'ülemine parem osa' },
      { id: 'rain', label: 'vihm', marker: 'D', position: 'parem keskmine osa' }
    ]
  },
  // Loodusõpetus õpik, unit 10 "Maa kuju". Original teaching schematics, not
  // copies of the textbook illustrations and not to scale.
  {
    id: 'u10-ancient-earth',
    title: 'Kujutlused Maa kujust',
    description: 'Lihtsustatud skeem, mitte mõõtkavas. Kolm kujutist üksteise all: ülemine on lame maaketas keset vett, keskmine on muistne lugu, kus kilpkonn kannab nelja elevanti ja nende peal kumerat maaketast, alumine on kerakujuline Maa ookeanide ja maismaaga.',
    drawingNote: 'Three stacked panels (viewBox 360×480). Top: flat land disk in perspective surrounded by water. Middle: a stylised giant turtle in the sea carrying four elephants that hold a domed land disk (a myth). Bottom: a shaded blue globe with a little green land.',
    demo: false,
    regions: [
      { id: 'flat-disk', label: 'lame Maa', marker: 'A', position: 'ülemine kujutis' },
      { id: 'turtle', label: 'elevandid ja kilpkonn', marker: 'B', position: 'keskmine kujutis' },
      { id: 'globe', label: 'kerakujuline Maa', marker: 'C', position: 'alumine kujutis' }
    ]
  },
  {
    id: 'u10-lunar-eclipse',
    title: 'Kuuvarjutus',
    description: 'Lihtsustatud skeem, mitte mõõtkavas: suurused ja kaugused ei ole õiged. Vasakul Päike, mille valgus liigub paremale. Keskel Maa ja selle taga paremale ulatuv vari. Paremal Kuu, mis on Maa varju sees.',
    drawingNote: 'Left to right on one line (viewBox 380×245): Sun with rays (x≈55), Earth (x≈190), Moon (x≈320) inside the pale shadow cone that Earth casts away from the Sun. Sunlight arrows point right. The Moon casts no shadow on Earth.',
    demo: false,
    regions: [
      { id: 'sun', label: 'Päike', marker: 'A', position: 'vasakpoolne ring' },
      { id: 'earth', label: 'Maa', marker: 'B', position: 'keskmine ring' },
      { id: 'moon', label: 'Kuu', marker: 'C', position: 'parempoolne ring' }
    ]
  },
  {
    id: 'u10-ship-horizon',
    title: 'Laev silmapiiri taga',
    description: 'Lihtsustatud skeem, mitte mõõtkavas. Vasakul kaldal seisab vaatleja ja vaatab üle kumera mere. Lähem laev on terve nähtav. Kaugema laeva kere on Maa kumeruse taga peidus, näha on ainult mast ja puri.',
    drawingNote: 'Side view over a gently curved sea (viewBox 380×260). Observer on a small shore at the left, a fully visible nearer sailing ship in the middle, and a farther ship on the right whose hull is hidden behind the bulge of the sea while its mast and sail stay above it.',
    demo: false,
    regions: [
      { id: 'observer', label: 'vaatleja', marker: 'A', position: 'vasakpoolne kujutis' },
      { id: 'near-ship', label: 'lähem laev', marker: 'B', position: 'keskmine laev' },
      { id: 'far-ship', label: 'kaugem laev', marker: 'C', position: 'parempoolne laev' }
    ]
  },
  {
    id: 'u10-observer-height',
    title: 'Kõrgemalt näeb kaugemale',
    description: 'Lihtsustatud skeem, mitte mõõtkavas. Sama kumera merepinna kohal on kaks vaatlejat: vasakul seisab inimene rannas, paremal seisab inimene kõrge torni tipus. Kummastki läheb vaatesiht silmapiirini; tornist vaadates on silmapiir kaugemal.',
    drawingNote: 'One curved water surface (viewBox 360×270). Left: a person on the beach with a short sight line touching the curve nearby. Right: a person on top of a tall lighthouse-like tower with a longer sight line touching the curve farther away. Both horizons are marked.',
    demo: false,
    regions: [
      { id: 'beach', label: 'rannalt', marker: 'A', position: 'vasakpoolne vaatluskoht' },
      { id: 'tower', label: 'tornist', marker: 'B', position: 'parempoolne vaatluskoht' }
    ]
  },
  // Later units keep their diagrams in their own file (src/lib/textbook/diagrams/).
  ...UNIT11_DIAGRAMS,
  ...UNIT12_DIAGRAMS,
  ...UNIT13_DIAGRAMS,
  ...UNIT14_DIAGRAMS,
  ...UNIT21_DIAGRAMS
];

const BY_ID = new Map(DIAGRAMS.map((diagram) => [diagram.id, diagram]));

export function getDiagram(id: string): DiagramDefinition | null {
  return BY_ID.get(id) ?? null;
}

export function isRegisteredDiagram(id: string): boolean {
  return BY_ID.has(id);
}

// Region IDs in drawing order; empty for an unknown diagram.
export function diagramRegionIds(id: string): string[] {
  return BY_ID.get(id)?.regions.map((region) => region.id) ?? [];
}

// Look-up interface the validator uses, so tests can pass their own registry.
export type DiagramLookup = (id: string) => DiagramDefinition | null;
export const defaultDiagramLookup: DiagramLookup = getDiagram;
