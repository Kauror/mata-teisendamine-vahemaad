import type { DiagramLayout, LabelLayout } from '@/app/components/textbook/diagrams/diagramLayout';

// Unit 14 "Kaartide mitmekesisus": label, marker and note positions, spread
// into DIAGRAM_LAYOUTS. Plain numbers (not the shared font-size constants):
// diagramLayout.ts imports this file, so importing values back would be a
// cycle. 15 = LABEL_FONT_SIZE, 13 = NOTE_FONT_SIZE.
const LABEL = 15;
const NOTE = 13;

export const U14_DIAGRAM_LAYOUTS: Record<string, DiagramLayout> = {
  'u14-physical-features': {
    width: 360,
    height: 260,
    regions: {
      mountains: { label: { x: 90, y: 24, anchor: 'middle', fontSize: LABEL }, marker: { x: 90, y: 86 } },
      river: { label: { x: 188, y: 206, anchor: 'middle', fontSize: LABEL }, marker: { x: 198, y: 148 } },
      lake: { label: { x: 76, y: 246, anchor: 'middle', fontSize: LABEL }, marker: { x: 76, y: 196 } },
      island: { label: { x: 322, y: 186, anchor: 'middle', fontSize: LABEL }, marker: { x: 322, y: 166 } }
    }
  },
  'u14-political-elements': {
    width: 360,
    height: 270,
    regions: {
      country: { label: { x: 92, y: 238, anchor: 'middle', fontSize: LABEL }, marker: { x: 92, y: 186 } },
      border: { label: { x: 182, y: 265, anchor: 'middle', fontSize: LABEL }, marker: { x: 198, y: 72 } },
      capital: { label: { x: 92, y: 64, anchor: 'middle', fontSize: LABEL }, marker: { x: 121, y: 117 } },
      city: { label: { x: 264, y: 64, anchor: 'middle', fontSize: LABEL }, marker: { x: 280, y: 118 } }
    },
    // The made-up country names: lessons and feedback only.
    notes: [
      { text: 'Lepamaa', label: { x: 92, y: 144, anchor: 'middle', fontSize: NOTE } },
      { text: 'Kivimaa', label: { x: 262, y: 196, anchor: 'middle', fontSize: NOTE } }
    ]
  },
  'u14-map-pair': {
    width: 360,
    height: 230,
    regions: {
      physical: { label: { x: 91, y: 210, anchor: 'middle', fontSize: 14 }, marker: { x: 28, y: 48 } },
      political: { label: { x: 269, y: 210, anchor: 'middle', fontSize: 14 }, marker: { x: 206, y: 48 } }
    },
    // What each view puts first ("loodus" / "riigid" would answer the hotspot question): never in hotspot mode.
    notes: [
      { text: 'mäed ja veed', label: { x: 91, y: 20, anchor: 'middle', fontSize: NOTE } },
      { text: 'riigid ja piirid', label: { x: 269, y: 20, anchor: 'middle', fontSize: NOTE } }
    ]
  },
  'u14-population-map': {
    width: 360,
    height: 300,
    regions: {
      a: { label: { x: 64, y: 152, anchor: 'middle', fontSize: 14 }, marker: { x: 64, y: 116 } },
      b: { label: { x: 181, y: 152, anchor: 'middle', fontSize: 14, onShape: true }, marker: { x: 181, y: 116 } },
      c: { label: { x: 297, y: 152, anchor: 'middle', fontSize: 14 }, marker: { x: 297, y: 116 } }
    }
  }
};

// Text that is map data, drawn in EVERY mode (heading and legend), and the
// region letters drawn in lessons (in a hotspot question the markers carry
// them). Kept here so the layout test can prove they fit too.
export const U14_POPULATION_HEADING = { text: 'Elanike arv piirkondades', label: { x: 180, y: 22, anchor: 'middle', fontSize: 16 } satisfies LabelLayout };
export const U14_POPULATION_LEGEND = [
  { regionId: 'a', text: '4 000 elanikku', swatch: { x: 88, y: 211, width: 42, height: 20 }, label: { x: 140, y: 226, anchor: 'start', fontSize: 14 } satisfies LabelLayout },
  { regionId: 'c', text: '6 000 elanikku', swatch: { x: 88, y: 237, width: 42, height: 20 }, label: { x: 140, y: 252, anchor: 'start', fontSize: 14 } satisfies LabelLayout },
  { regionId: 'b', text: '9 000 elanikku', swatch: { x: 88, y: 263, width: 42, height: 20 }, label: { x: 140, y: 278, anchor: 'start', fontSize: 14 } satisfies LabelLayout }
] as const;
export const U14_POPULATION_LETTERS: Record<string, LabelLayout> = {
  a: { x: 64, y: 108, anchor: 'middle', fontSize: 26 },
  b: { x: 181, y: 108, anchor: 'middle', fontSize: 26, onShape: true },
  c: { x: 297, y: 108, anchor: 'middle', fontSize: 26 }
};

// Component file per diagram, relative to src/app/components/textbook/diagrams/
// (the layout test reads the hit areas from the source).
export const U14_DIAGRAM_FILES: Record<string, string> = {
  'u14-physical-features': 'unit14/PhysicalFeaturesDiagram.tsx',
  'u14-political-elements': 'unit14/PoliticalElementsDiagram.tsx',
  'u14-map-pair': 'unit14/MapPairDiagram.tsx',
  'u14-population-map': 'unit14/PopulationMapDiagram.tsx'
};
