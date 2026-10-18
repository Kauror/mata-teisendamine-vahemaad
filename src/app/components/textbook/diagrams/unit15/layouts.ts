import type { DiagramLayout, LabelLayout } from '@/app/components/textbook/diagrams/diagramLayout';

// Unit 15 "Mandrid ja maailmajaod": label, marker and note positions, spread
// into DIAGRAM_LAYOUTS. Plain numbers (not the shared font-size constants):
// diagramLayout.ts imports this file, so importing values back would be a
// cycle. 13 = NOTE_FONT_SIZE.
//
// The world maps draw world_continent_paths.json (720 × 360) at half size, so
// the map is 360 × 180 and a strip below it holds the Antarctic label; every
// position here is in those halved units. Labels sit on the land or the sea
// with the usual light halo.
const LABEL = 14;
const NOTE = 13;

export const U15_WORLD_MAP = { width: 360, height: 180, scale: 0.5 } as const;

export const U15_DIAGRAM_LAYOUTS: Record<string, DiagramLayout> = {
  'u15-land-water': {
    width: 360,
    height: 170,
    regions: {
      land: { label: { x: 65, y: 44, anchor: 'middle', fontSize: 15 }, marker: { x: 65, y: 86 } },
      water: { label: { x: 227, y: 44, anchor: 'middle', fontSize: 15 }, marker: { x: 227, y: 86 } }
    },
    // The rounded shares: lessons and feedback only (in a hotspot question "the smaller part" is the task).
    notes: [
      { text: 'umbes 29%', label: { x: 65, y: 140, anchor: 'middle', fontSize: NOTE } },
      { text: 'umbes 71%', label: { x: 227, y: 140, anchor: 'middle', fontSize: NOTE } },
      { text: 'Maismaad on ligikaudu kolmandik.', label: { x: 180, y: 162, anchor: 'middle', fontSize: NOTE } }
    ]
  },
  'u15-world-continents': {
    width: 360,
    height: 206,
    regions: {
      'north-america': { label: { x: 84, y: 52, anchor: 'middle', fontSize: LABEL }, marker: { x: 64, y: 46 } },
      'south-america': { label: { x: 120, y: 124, anchor: 'middle', fontSize: LABEL }, marker: { x: 112, y: 112 } },
      eurasia: { label: { x: 280, y: 42, anchor: 'middle', fontSize: LABEL }, marker: { x: 280, y: 36 } },
      africa: { label: { x: 198, y: 100, anchor: 'middle', fontSize: LABEL }, marker: { x: 198, y: 96 } },
      australia: { label: { x: 356, y: 150, anchor: 'end', fontSize: LABEL }, marker: { x: 308, y: 118 } },
      antarctica: { label: { x: 190, y: 198, anchor: 'middle', fontSize: LABEL }, marker: { x: 190, y: 172 } }
    }
  },
  'u15-world-parts': {
    width: 360,
    height: 206,
    regions: {
      america: { label: { x: 66, y: 104, anchor: 'middle', fontSize: LABEL }, marker: { x: 86, y: 80 } },
      europe: { label: { x: 186, y: 38, anchor: 'middle', fontSize: LABEL }, marker: { x: 190, y: 44 } },
      asia: { label: { x: 284, y: 56, anchor: 'middle', fontSize: LABEL }, marker: { x: 272, y: 52 } },
      africa: { label: { x: 198, y: 100, anchor: 'middle', fontSize: LABEL }, marker: { x: 196, y: 96 } },
      'australia-oceania': { label: { x: 356, y: 148, anchor: 'end', fontSize: LABEL, wrap: 120 }, marker: { x: 306, y: 120 } },
      antarctica: { label: { x: 190, y: 198, anchor: 'middle', fontSize: LABEL }, marker: { x: 190, y: 172 } }
    }
  },
  'u15-continent-worldpart-links': {
    width: 360,
    height: 250,
    regions: {
      eurasia: { label: { x: 91, y: 196, anchor: 'middle', fontSize: NOTE, wrap: 160 }, marker: { x: 91, y: 206 } },
      america: { label: { x: 269, y: 196, anchor: 'middle', fontSize: NOTE, wrap: 160 }, marker: { x: 269, y: 206 } }
    }
  }
};

// The comparison diagram: a legend drawn in every mode (it only says which
// box shape is a continent and which a world part, the same on both sides),
// and the box words, drawn in lessons and after answering only (in a hotspot
// question the bare boxes and arrows are the picture). Kept here so the
// unit test can prove they fit inside their boxes.
export type U15Box = { x: number; y: number; width: number; height: number; kind: 'continent' | 'part'; words: string[] };

export const U15_LINK_LEGEND = [
  { kind: 'continent' as const, swatch: { x: 40, y: 8, width: 26, height: 16 }, text: 'manner', label: { x: 72, y: 21, anchor: 'start', fontSize: NOTE } satisfies LabelLayout },
  { kind: 'part' as const, swatch: { x: 180, y: 8, width: 26, height: 16 }, text: 'maailmajagu', label: { x: 212, y: 21, anchor: 'start', fontSize: NOTE } satisfies LabelLayout }
];

export const U15_LINK_PANELS: Record<string, { x: number; y: number; width: number; height: number }> = {
  eurasia: { x: 4, y: 32, width: 174, height: 214 },
  america: { x: 182, y: 32, width: 174, height: 214 }
};

export const U15_LINK_BOXES: Record<string, U15Box[]> = {
  eurasia: [
    { x: 36, y: 46, width: 110, height: 40, kind: 'continent', words: ['Euraasia'] },
    { x: 10, y: 124, width: 78, height: 40, kind: 'part', words: ['Euroopa'] },
    { x: 94, y: 124, width: 78, height: 40, kind: 'part', words: ['Aasia'] }
  ],
  america: [
    { x: 186, y: 46, width: 82, height: 46, kind: 'continent', words: ['Põhja-', 'Ameerika'] },
    { x: 272, y: 46, width: 82, height: 46, kind: 'continent', words: ['Lõuna-', 'Ameerika'] },
    { x: 214, y: 124, width: 110, height: 40, kind: 'part', words: ['Ameerika'] }
  ]
};
export const U15_BOX_WORD_SIZE = NOTE;

// Arrows from continent boxes to world-part boxes (start → end, in diagram units).
export const U15_LINK_ARROWS: Record<string, Array<{ from: [number, number]; to: [number, number] }>> = {
  eurasia: [
    { from: [76, 88], to: [52, 120] },
    { from: [106, 88], to: [130, 120] }
  ],
  america: [
    { from: [227, 94], to: [252, 120] },
    { from: [313, 94], to: [288, 120] }
  ]
};

// Component file per diagram, relative to src/app/components/textbook/diagrams/
// (the layout test reads the hit areas from the source).
export const U15_DIAGRAM_FILES: Record<string, string> = {
  'u15-land-water': 'unit15/LandWaterDiagram.tsx',
  'u15-world-continents': 'unit15/WorldContinentsDiagram.tsx',
  'u15-world-parts': 'unit15/WorldPartsDiagram.tsx',
  'u15-continent-worldpart-links': 'unit15/ContinentWorldPartLinksDiagram.tsx'
};
