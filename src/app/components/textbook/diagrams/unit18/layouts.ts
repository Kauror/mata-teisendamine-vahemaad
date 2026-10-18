import type { DiagramLayout } from '@/app/components/textbook/diagrams/diagramLayout';

// Unit 18 "Euroopa kaart": label, marker and note positions, spread into
// DIAGRAM_LAYOUTS. Plain numbers (not the shared font-size constants):
// diagramLayout.ts imports this file, so importing values back would be a
// cycle. The maps are 360 units wide, so a 44 px tap area at 360 px needs
// 56 units; markers sit on the textbook's coordinates (UNIT18_DIAGRAMS.md).
const LABEL = 12;
const SMALL = 11;
const NOTE = 11;

// The Europe maps are crops of the 900 × 540 country data (see europeMap.tsx):
// view = (data − origin) · scale.
export const U18_BORDERS_VIEW = { originX: 0, originY: 0, scale: 0.4 };
export const U18_COUNTRIES_VIEW = { originX: 135, originY: 48, scale: 0.54 };
// The world map: view = (data − origin) · scale on the 720 × 360 continents.
export const U18_WORLD_VIEW = { originX: 0, originY: 10, scale: 0.5 };

export const U18_DIAGRAM_LAYOUTS: Record<string, DiagramLayout> = {
  'u18-europe-world': {
    width: 360,
    height: 160,
    regions: {
      europe: { label: { x: 190, y: 42, anchor: 'middle', fontSize: LABEL }, marker: { x: 195, y: 34 } },
      asia: { label: { x: 282, y: 66, anchor: 'middle', fontSize: LABEL }, marker: { x: 280, y: 54 } },
      africa: { label: { x: 200, y: 101, anchor: 'middle', fontSize: LABEL }, marker: { x: 200, y: 97 } },
      'north-america': { label: { x: 72, y: 54, anchor: 'middle', fontSize: LABEL }, marker: { x: 70, y: 52 } }
    },
    // The other continents and the continent Europe and Asia share: lessons and feedback only.
    notes: [
      { text: 'Euraasia', label: { x: 300, y: 26, anchor: 'middle', fontSize: NOTE } },
      { text: 'Lõuna-Ameerika', label: { x: 108, y: 114, anchor: 'middle', fontSize: NOTE } },
      { text: 'Austraalia', label: { x: 312, y: 118, anchor: 'middle', fontSize: NOTE } },
      { text: 'Antarktis', label: { x: 180, y: 156, anchor: 'middle', fontSize: NOTE } }
    ]
  },
  'u18-europe-borders': {
    width: 360,
    height: 216,
    regions: {
      atlantic: { label: { x: 4, y: 132, anchor: 'start', fontSize: LABEL, wrap: 76 }, marker: { x: 32, y: 115 } },
      arctic: { label: { x: 180, y: 14, anchor: 'middle', fontSize: LABEL }, marker: { x: 158, y: 15 } },
      mediterranean: { label: { x: 165, y: 202, anchor: 'middle', fontSize: LABEL }, marker: { x: 144, y: 194 } },
      'black-sea': { label: { x: 222, y: 160, anchor: 'middle', fontSize: LABEL }, marker: { x: 223, y: 158 } },
      caspian: { label: { x: 300, y: 205, anchor: 'middle', fontSize: LABEL }, marker: { x: 281, y: 163 } },
      ural: { label: { x: 356, y: 32, anchor: 'end', fontSize: LABEL }, marker: { x: 312, y: 72 } }
    }
  },
  'u18-europe-area': {
    width: 360,
    height: 246,
    regions: {
      russia: { label: { x: 300, y: 100, anchor: 'middle', fontSize: LABEL, wrap: 100 }, marker: { x: 277, y: 104 } },
      ukraine: { label: { x: 210, y: 154, anchor: 'middle', fontSize: LABEL }, marker: { x: 209, y: 149 } },
      france: { label: { x: 66, y: 166, anchor: 'middle', fontSize: LABEL }, marker: { x: 68, y: 162 } },
      spain: { label: { x: 52, y: 214, anchor: 'middle', fontSize: LABEL }, marker: { x: 39, y: 208 } },
      sweden: { label: { x: 140, y: 64, anchor: 'middle', fontSize: LABEL }, marker: { x: 136, y: 58 } }
    }
  },
  'u18-europe-population': {
    width: 360,
    height: 246,
    regions: {
      russia: { label: { x: 300, y: 100, anchor: 'middle', fontSize: LABEL, wrap: 100 }, marker: { x: 277, y: 104 } },
      germany: { label: { x: 108, y: 133, anchor: 'middle', fontSize: SMALL }, marker: { x: 107, y: 136 } },
      uk: { label: { x: 2, y: 80, anchor: 'start', fontSize: SMALL }, marker: { x: 44, y: 117 } },
      france: { label: { x: 62, y: 170, anchor: 'middle', fontSize: SMALL }, marker: { x: 68, y: 169 } },
      italy: { label: { x: 128, y: 200, anchor: 'middle', fontSize: SMALL }, marker: { x: 119, y: 191 } }
    }
  }
};

// Component file per diagram, relative to src/app/components/textbook/diagrams/
// (the layout test reads the hit areas from the source).
export const U18_DIAGRAM_FILES: Record<string, string> = {
  'u18-europe-world': 'unit18/EuropeWorldDiagram.tsx',
  'u18-europe-borders': 'unit18/EuropeBordersDiagram.tsx',
  'u18-europe-area': 'unit18/EuropeAreaDiagram.tsx',
  'u18-europe-population': 'unit18/EuropePopulationDiagram.tsx'
};
