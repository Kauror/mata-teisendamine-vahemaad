import type { DiagramLayout } from '@/app/components/textbook/diagrams/diagramLayout';

// Unit 19 "Maakera siseehitus": label, marker and note positions, spread into
// DIAGRAM_LAYOUTS. Plain numbers (not the shared font-size constants):
// diagramLayout.ts imports this file, so importing values back would be a
// cycle. 15 = LABEL_FONT_SIZE, 13 = NOTE_FONT_SIZE.
const LABEL = 15;
const NOTE = 13;

// Earth cross-section: centre and layer radii. Mantle, outer core and inner
// core keep roughly the real proportions (2 900 / 2 200 / 1 200 km of a
// 6 400 km radius); the crust (0–80 km, far under 1 unit) is drawn 6 units
// thick so that it can be seen at all — the lesson note says so.
export const U19_EARTH = { cx: 112, cy: 150, crust: 105, mantle: 99, outerCore: 55, innerCore: 24 } as const;
// One row per layer on the right: its tap area, marker and lesson label.
export const U19_EARTH_ROWS = { x: 222, width: 134, top: [34, 96, 158, 220], height: 58 } as const;

// Crust thickness bars: proportional to the textbook's example figures.
export const U19_CRUST_SURFACE_Y = 70;
export const U19_CRUST_UNITS_PER_KM = 2.25;
export const U19_CRUST_KM = { oceanic: 7, continental: 40, mountain: 80 } as const;
export const U19_CRUST_COLUMNS = { oceanic: 61, continental: 180, mountain: 299 } as const;

// Evidence: three stacked cards.
export const U19_EVIDENCE_ROW_TOP = [6, 92, 178] as const;

const earthRow = (index: number) => U19_EARTH_ROWS.top[index] + U19_EARTH_ROWS.height / 2;
const evidenceRow = (index: number) => U19_EVIDENCE_ROW_TOP[index];

export const U19_DIAGRAM_LAYOUTS: Record<string, DiagramLayout> = {
  'u19-earth-layers': {
    width: 360,
    height: 300,
    regions: {
      crust: { label: { x: 232, y: earthRow(0) + 5, anchor: 'start', fontSize: LABEL }, marker: { x: 242, y: earthRow(0) } },
      mantle: { label: { x: 232, y: earthRow(1) + 5, anchor: 'start', fontSize: LABEL }, marker: { x: 242, y: earthRow(1) } },
      'outer-core': { label: { x: 232, y: earthRow(2) + 5, anchor: 'start', fontSize: LABEL }, marker: { x: 242, y: earthRow(2) } },
      'inner-core': { label: { x: 232, y: earthRow(3) + 5, anchor: 'start', fontSize: LABEL }, marker: { x: 242, y: earthRow(3) } }
    },
    notes: [
      { text: 'Maakoor on joonisel paksem kui päriselt.', label: { x: 6, y: 294, anchor: 'start', fontSize: NOTE } }
    ]
  },
  'u19-crust-thickness': {
    width: 360,
    height: 306,
    regions: {
      oceanic: { label: { x: U19_CRUST_COLUMNS.oceanic, y: 284, anchor: 'middle', fontSize: NOTE, wrap: 116 }, marker: { x: U19_CRUST_COLUMNS.oceanic, y: 26 } },
      continental: { label: { x: U19_CRUST_COLUMNS.continental, y: 284, anchor: 'middle', fontSize: NOTE, wrap: 116 }, marker: { x: U19_CRUST_COLUMNS.continental, y: 26 } },
      mountain: { label: { x: U19_CRUST_COLUMNS.mountain, y: 284, anchor: 'middle', fontSize: NOTE, wrap: 116 }, marker: { x: U19_CRUST_COLUMNS.mountain, y: 26 } }
    },
    // The km figures would answer a hotspot question: lessons and feedback only.
    notes: [
      { text: 'Maakoore paksuse näited', label: { x: 180, y: 18, anchor: 'middle', fontSize: NOTE } },
      { text: 'umbes 7 km', label: { x: U19_CRUST_COLUMNS.oceanic, y: 106, anchor: 'middle', fontSize: NOTE } },
      { text: 'umbes 40 km', label: { x: U19_CRUST_COLUMNS.continental, y: 180, anchor: 'middle', fontSize: NOTE } },
      { text: 'kuni 80 km', label: { x: U19_CRUST_COLUMNS.mountain, y: 268, anchor: 'middle', fontSize: NOTE } }
    ]
  },
  'u19-evidence': {
    width: 360,
    height: 264,
    regions: {
      borehole: { label: { x: 166, y: evidenceRow(0) + 36, anchor: 'start', fontSize: 14 }, marker: { x: 178, y: evidenceRow(0) + 40 } },
      waves: { label: { x: 166, y: evidenceRow(1) + 36, anchor: 'start', fontSize: 14 }, marker: { x: 178, y: evidenceRow(1) + 40 } },
      volcano: { label: { x: 166, y: evidenceRow(2) + 36, anchor: 'start', fontSize: 14 }, marker: { x: 178, y: evidenceRow(2) + 40 } }
    },
    notes: [
      { text: 'kivimiproov sügavalt', label: { x: 166, y: evidenceRow(0) + 58, anchor: 'start', fontSize: NOTE } },
      { text: 'lained levivad läbi Maa', label: { x: 166, y: evidenceRow(1) + 58, anchor: 'start', fontSize: NOTE } },
      { text: 'sulakivim jõuab pinnale', label: { x: 166, y: evidenceRow(2) + 58, anchor: 'start', fontSize: NOTE } }
    ]
  },
  'u19-plate-motion': {
    width: 360,
    height: 260,
    regions: {
      'left-plate': { label: { x: 8, y: 82, anchor: 'start', fontSize: 12 }, marker: { x: 80, y: 110 } },
      'right-plate': { label: { x: 352, y: 82, anchor: 'end', fontSize: 12 }, marker: { x: 280, y: 110 } },
      boundary: { label: { x: 180, y: 26, anchor: 'middle', fontSize: 14 }, marker: { x: 180, y: 56 } },
      mantle: { label: { x: 180, y: 196, anchor: 'middle', fontSize: 14 }, marker: { x: 100, y: 190 } }
    },
    notes: [
      { text: 'kuum, valdavalt tahke kivim', label: { x: 180, y: 218, anchor: 'middle', fontSize: NOTE } },
      { text: 'Laamad liiguvad mõne cm aastas.', label: { x: 180, y: 252, anchor: 'middle', fontSize: NOTE } }
    ]
  },
  'u19-plate-world': {
    width: 360,
    height: 214,
    regions: {
      pacific: { label: { x: 4, y: 120, anchor: 'start', fontSize: 12, wrap: 100 }, marker: { x: 28, y: 100 } },
      'north-america': { label: { x: 90, y: 40, anchor: 'middle', fontSize: 12, wrap: 144 }, marker: { x: 86, y: 46 } },
      'south-america': { label: { x: 128, y: 104, anchor: 'middle', fontSize: 12, wrap: 144 }, marker: { x: 122, y: 108 } },
      eurasia: { label: { x: 270, y: 36, anchor: 'middle', fontSize: 12, wrap: 144 }, marker: { x: 260, y: 34 } },
      africa: { label: { x: 210, y: 86, anchor: 'middle', fontSize: 12, wrap: 144 }, marker: { x: 200, y: 88 } },
      australia: { label: { x: 356, y: 136, anchor: 'end', fontSize: 12, wrap: 144 }, marker: { x: 318, y: 118 } },
      antarctica: { label: { x: 220, y: 176, anchor: 'middle', fontSize: 12, wrap: 144 }, marker: { x: 208, y: 170 } }
    },
    notes: [
      { text: 'Tähis näitab laama ligikaudset kohta.', label: { x: 4, y: 197, anchor: 'start', fontSize: NOTE } },
      { text: 'Laamade piire kaardil ei ole.', label: { x: 4, y: 211, anchor: 'start', fontSize: NOTE } }
    ]
  },
  'u19-continental-drift': {
    width: 360,
    height: 240,
    regions: {
      pangaea: { label: { x: 90, y: 20, anchor: 'middle', fontSize: NOTE, wrap: 160 }, marker: { x: 90, y: 212 } },
      today: { label: { x: 270, y: 20, anchor: 'middle', fontSize: NOTE, wrap: 160 }, marker: { x: 270, y: 212 } }
    }
  }
};

// The small location dot drawn at each plate marker's position on the world map.
export const U19_PLATE_DOT_RADIUS = 4;

// Component file per diagram, relative to src/app/components/textbook/diagrams/
// (the layout test reads the hit areas from the source).
export const U19_DIAGRAM_FILES: Record<string, string> = {
  'u19-earth-layers': 'unit19/EarthLayersDiagram.tsx',
  'u19-crust-thickness': 'unit19/CrustThicknessDiagram.tsx',
  'u19-evidence': 'unit19/EvidenceDiagram.tsx',
  'u19-plate-motion': 'unit19/PlateMotionDiagram.tsx',
  'u19-plate-world': 'unit19/PlateWorldDiagram.tsx',
  'u19-continental-drift': 'unit19/ContinentalDriftDiagram.tsx'
};
