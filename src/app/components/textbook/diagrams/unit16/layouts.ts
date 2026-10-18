import type { DiagramLayout } from '@/app/components/textbook/diagrams/diagramLayout';
import type { RegionTwin } from '@/app/components/textbook/diagrams/DiagramFrame';

// Unit 16 "Maailmameri": label, marker and note positions, spread into
// DIAGRAM_LAYOUTS. Plain numbers (not the shared font-size constants):
// diagramLayout.ts imports this file, so importing values back would be a
// cycle. 15 = LABEL_FONT_SIZE, 13 = NOTE_FONT_SIZE.
const LABEL = 15;
const NOTE = 13;
// Ocean names on the world map: smaller, wrapped onto two lines in the water.
const MAP_LABEL = 12;
const MAP_WRAP = 60;

// The world map: the 720 × 360 Natural Earth geometry drawn at half size, so
// the map is 360 × 180 and one map unit is one degree (x = longitude + 180,
// y = 90 − latitude).
export const U16_MAP_SCALE = 0.5;
export const U16_MAP = { width: 360, height: 180 } as const;

export const U16_DIAGRAM_LAYOUTS: Record<string, DiagramLayout> = {
  'u16-land-water': {
    width: 360,
    height: 170,
    regions: {
      land: { label: { x: 64, y: 136, anchor: 'middle', fontSize: LABEL }, marker: { x: 64, y: 82 } },
      water: { label: { x: 230, y: 136, anchor: 'middle', fontSize: LABEL }, marker: { x: 230, y: 82 } }
    },
    // Rounded shares (USGS): lessons and feedback only, never asked as exact numbers.
    notes: [
      { text: 'Kogu Maa pind', label: { x: 180, y: 34, anchor: 'middle', fontSize: NOTE } },
      { text: 'umbes 29%', label: { x: 64, y: 160, anchor: 'middle', fontSize: NOTE } },
      { text: 'umbes 71%', label: { x: 230, y: 160, anchor: 'middle', fontSize: NOTE } }
    ]
  },
  // Markers sit in open water well away from coasts; the map test checks every
  // one against the real coastlines and the ocean's latitude/longitude range.
  'u16-five-oceans': {
    width: 360,
    height: 180,
    regions: {
      // Left edge (≈ 142° W, 2° N); the right-edge twin is U16_PACIFIC_TWIN.
      pacific: { label: { x: 38, y: 112, anchor: 'middle', fontSize: MAP_LABEL, wrap: MAP_WRAP }, marker: { x: 38, y: 88 } },
      // ≈ 25° W, 4° N, between Brazil and West Africa.
      atlantic: { label: { x: 163, y: 110, anchor: 'middle', fontSize: MAP_LABEL, wrap: MAP_WRAP }, marker: { x: 155, y: 86 } },
      // ≈ 75° E, 20° S.
      indian: { label: { x: 258, y: 112, anchor: 'middle', fontSize: MAP_LABEL, wrap: MAP_WRAP }, marker: { x: 255, y: 110 } },
      // ≈ 50° E, 77° N, north of Europe.
      arctic: { label: { x: 230, y: 12, anchor: 'middle', fontSize: MAP_LABEL }, marker: { x: 230, y: 13 } },
      // ≈ 65° E, 62° S, off Antarctica (south of 60° S).
      southern: { label: { x: 255, y: 154, anchor: 'middle', fontSize: MAP_LABEL }, marker: { x: 245, y: 152 } }
    }
  },
  'u16-water-forms': {
    width: 360,
    height: 190,
    regions: {
      sea: { label: { x: 62, y: 176, anchor: 'middle', fontSize: LABEL }, marker: { x: 44, y: 78 } },
      strait: { label: { x: 180, y: 176, anchor: 'middle', fontSize: LABEL }, marker: { x: 180, y: 78 } },
      bay: { label: { x: 298, y: 176, anchor: 'middle', fontSize: LABEL }, marker: { x: 298, y: 96 } }
    }
  },
  // A vertical chain (it reads on a phone): Baltic at the top, Atlantic at the bottom.
  'u16-baltic-connection': {
    width: 360,
    height: 300,
    regions: {
      baltic: { label: { x: 180, y: 35, anchor: 'middle', fontSize: LABEL }, marker: { x: 180, y: 30 } },
      straits: { label: { x: 180, y: 115, anchor: 'middle', fontSize: LABEL }, marker: { x: 180, y: 110 } },
      'north-sea': { label: { x: 180, y: 195, anchor: 'middle', fontSize: LABEL }, marker: { x: 180, y: 190 } },
      atlantic: { label: { x: 180, y: 275, anchor: 'middle', fontSize: LABEL }, marker: { x: 180, y: 270 } }
    },
    notes: [
      { text: 'vesi liigub mõlemat pidi', label: { x: 146, y: 155, anchor: 'start', fontSize: NOTE } }
    ]
  }
};

// The Pacific's second place: the right edge of the map (≈ 164° E, 18° N),
// clear of New Guinea. Same region, same button; the label sits in the open
// water east of the Philippines.
export const U16_PACIFIC_TWIN: RegionTwin = {
  hit: { x: 302, y: 44, width: 56, height: 60 },
  marker: { x: 344, y: 72 },
  label: { x: 357, y: 60, anchor: 'end', fontSize: MAP_LABEL, wrap: MAP_WRAP }
};

// Component file per diagram, relative to src/app/components/textbook/diagrams/
// (the layout test reads the hit areas from the source).
export const U16_DIAGRAM_FILES: Record<string, string> = {
  'u16-land-water': 'unit16/LandWaterDiagram.tsx',
  'u16-five-oceans': 'unit16/FiveOceansDiagram.tsx',
  'u16-water-forms': 'unit16/WaterFormsDiagram.tsx',
  'u16-baltic-connection': 'unit16/BalticConnectionDiagram.tsx'
};
