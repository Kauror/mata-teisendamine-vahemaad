import type { DiagramLayout } from '@/app/components/textbook/diagrams/diagramLayout';

// Unit 13 "Kaardi mõõtkava": label, marker and note positions, spread into
// DIAGRAM_LAYOUTS (diagramLayout.ts). Type-only import: diagramLayout.ts
// imports this file, so no runtime values may flow back.
//
// All four pictures are 380 units wide (like the Unit 10 ones), so a 284 px
// phone picture still shows 14-unit labels at about 10.5 px.

const LABEL = 14;
const NOTE = 13;

// The component file of each diagram, relative to the diagrams folder (for
// diagramLayout.test.ts, which reads the hit areas from the source).
export const UNIT13_COMPONENT_FILES: Record<string, string> = {
  'u13-area-detail': 'unit13/AreaDetailDiagram.tsx',
  'u13-scale-forms': 'unit13/ScaleFormsDiagram.tsx',
  'u13-measured-distance': 'unit13/MeasuredDistanceDiagram.tsx',
  'u13-direct-vs-route': 'unit13/DirectVsRouteDiagram.tsx'
};

export const UNIT13_LAYOUTS: Record<string, DiagramLayout> = {
  // Three panels 112 × 140 at x = 8, 134, 260. Labels under them: the outer
  // two on one row (aligned to the outer edges), the middle one a row lower.
  'u13-area-detail': {
    width: 380,
    height: 240,
    regions: {
      'large-area': { label: { x: 8, y: 204, anchor: 'start', fontSize: LABEL }, marker: { x: 64, y: 158 } },
      regional: { label: { x: 190, y: 228, anchor: 'middle', fontSize: LABEL }, marker: { x: 190, y: 158 } },
      neighbourhood: { label: { x: 372, y: 204, anchor: 'end', fontSize: LABEL }, marker: { x: 316, y: 158 } }
    }
  },
  // Three cards 364 × 70; the name at the card's top left (lessons and
  // feedback only), the scale itself below it, the marker at the right.
  'u13-scale-forms': {
    width: 380,
    height: 240,
    regions: {
      bar: { label: { x: 22, y: 26, anchor: 'start', fontSize: LABEL }, marker: { x: 346, y: 41 } },
      verbal: { label: { x: 22, y: 104, anchor: 'start', fontSize: LABEL }, marker: { x: 346, y: 119 } },
      numeric: { label: { x: 22, y: 182, anchor: 'start', fontSize: LABEL }, marker: { x: 346, y: 197 } }
    }
  },
  'u13-measured-distance': {
    width: 380,
    height: 250,
    regions: {
      start: { label: { x: 8, y: 152, anchor: 'start', fontSize: LABEL }, marker: { x: 70, y: 82 } },
      end: { label: { x: 372, y: 152, anchor: 'end', fontSize: LABEL }, marker: { x: 310, y: 82 } },
      segment: { label: { x: 190, y: 64, anchor: 'middle', fontSize: LABEL }, marker: { x: 190, y: 134 } },
      scale: { label: { x: 20, y: 170, anchor: 'start', fontSize: LABEL }, marker: { x: 330, y: 224 } }
    },
    notes: [
      { text: '2 × 30 km = 60 km', label: { x: 190, y: 26, anchor: 'middle', fontSize: NOTE } }
    ]
  },
  'u13-direct-vs-route': {
    width: 380,
    height: 250,
    regions: {
      direct: { label: { x: 198, y: 58, anchor: 'middle', fontSize: LABEL }, marker: { x: 198, y: 90 } },
      road: { label: { x: 190, y: 196, anchor: 'middle', fontSize: LABEL }, marker: { x: 198, y: 154 } },
      clock: { label: { x: 376, y: 172, anchor: 'end', fontSize: LABEL }, marker: { x: 324, y: 192 } }
    }
  }
};
