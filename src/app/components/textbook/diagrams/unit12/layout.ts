import type { DiagramLayout } from '@/app/components/textbook/diagrams/diagramLayout';

// Unit 12 "Kaart": label and marker positions (see diagramLayout.ts, which
// spreads these in). Type-only import, so there is no runtime cycle; the font
// sizes are literal for the same reason (15 = LABEL_FONT_SIZE, 13 = NOTE_FONT_SIZE).
export const UNIT12_DIAGRAM_LAYOUTS: Record<string, DiagramLayout> = {
  'u12-globe-flatmap': {
    width: 360,
    height: 230,
    regions: {
      globe: { label: { x: 96, y: 222, anchor: 'middle', fontSize: 15 }, marker: { x: 96, y: 98 } },
      'flat-map': { label: { x: 276, y: 222, anchor: 'middle', fontSize: 15 }, marker: { x: 276, y: 105 } }
    }
  },
  'u12-orange-peel': {
    width: 360,
    height: 220,
    regions: {
      orange: { label: { x: 88, y: 210, anchor: 'middle', fontSize: 15 }, marker: { x: 88, y: 112 } },
      'peel-pieces': { label: { x: 354, y: 22, anchor: 'end', fontSize: 15 }, marker: { x: 262, y: 108 } }
    }
  },
  // Two panels (8–183 and 197–372); the labels sit under their own panel,
  // one per row because together they are wider than the picture.
  'u12-aerial-vs-map': {
    width: 380,
    height: 265,
    regions: {
      'aerial-panel': { label: { x: 8, y: 243, anchor: 'start', fontSize: 15 }, marker: { x: 30, y: 200 } },
      'map-panel': { label: { x: 372, y: 261, anchor: 'end', fontSize: 15 }, marker: { x: 219, y: 200 } }
    },
    notes: [
      { text: 'joonistus, mitte foto', label: { x: 8, y: 15, anchor: 'start', fontSize: 13 } }
    ]
  },
  // Map 8–264 × 24–332, legend box 272–396. Markers sit beside the small
  // features (bridge, museum) so they never cover the symbol to be found.
  'u12-legend-town': {
    width: 400,
    height: 340,
    regions: {
      river: { label: { x: 84, y: 206, anchor: 'start', fontSize: 15 }, marker: { x: 62, y: 72 } },
      park: { label: { x: 184, y: 274, anchor: 'middle', fontSize: 15 }, marker: { x: 184, y: 270 } },
      building: { label: { x: 126, y: 44, anchor: 'middle', fontSize: 15 }, marker: { x: 124, y: 82 } },
      bridge: { label: { x: 88, y: 158, anchor: 'start', fontSize: 15 }, marker: { x: 94, y: 148 } },
      museum: { label: { x: 262, y: 134, anchor: 'end', fontSize: 13 }, marker: { x: 246, y: 76 } },
      legend: { label: { x: 334, y: 46, anchor: 'middle', fontSize: 12 }, marker: { x: 334, y: 304 } }
    }
  }
};

// Component file per diagram, relative to diagrams/ (for the layout test).
export const UNIT12_DIAGRAM_FILES: Record<string, string> = {
  'u12-globe-flatmap': 'unit12/GlobeFlatMapDiagram.tsx',
  'u12-orange-peel': 'unit12/OrangePeelDiagram.tsx',
  'u12-aerial-vs-map': 'unit12/AerialMapDiagram.tsx',
  'u12-legend-town': 'unit12/LegendTownDiagram.tsx'
};
