import type { DiagramLayout } from '@/app/components/textbook/diagrams/diagramLayout';

// Unit 20 "Vulkaanid": label, marker and note positions, spread into
// DIAGRAM_LAYOUTS. Plain numbers (not the shared font-size constants):
// diagramLayout.ts imports this file, so importing values back would be a
// cycle. 13 = NOTE_FONT_SIZE.
const NOTE = 13;

// The three-panel pictures (layer growth, volcano states): panels 112 wide at
// x 6, 124 and 242, labels centred under the drawing, wrapped inside the panel.
export const U20_PANEL_X = [6, 124, 242] as const;
export const U20_PANEL_WIDTH = 112;
const panelLabel = (index: number) => ({ x: U20_PANEL_X[index] + U20_PANEL_WIDTH / 2, y: 196, anchor: 'middle' as const, fontSize: 12, wrap: 104 });

export const U20_DIAGRAM_LAYOUTS: Record<string, DiagramLayout> = {
  'u20-magma-lava': {
    width: 360,
    height: 250,
    regions: {
      underground: { label: { x: 190, y: 247, anchor: 'middle', fontSize: 13 }, marker: { x: 190, y: 222 } },
      surface: { label: { x: 354, y: 82, anchor: 'end', fontSize: 13, wrap: 120 }, marker: { x: 304, y: 128 } },
      crust: { label: { x: 10, y: 176, anchor: 'start', fontSize: 13 }, marker: { x: 50, y: 200 } }
    },
    notes: [
      { text: 'maapind', label: { x: 10, y: 142, anchor: 'start', fontSize: NOTE } }
    ]
  },
  'u20-volcano-cutaway': {
    width: 360,
    height: 280,
    regions: {
      crater: { label: { x: 150, y: 86, anchor: 'end', fontSize: 14 }, marker: { x: 180, y: 76 } },
      conduit: { label: { x: 170, y: 150, anchor: 'end', fontSize: 14 }, marker: { x: 180, y: 154 } },
      chamber: { label: { x: 8, y: 206, anchor: 'start', fontSize: 14 }, marker: { x: 180, y: 250 } },
      'lava-flow': { label: { x: 354, y: 102, anchor: 'end', fontSize: 14 }, marker: { x: 266, y: 140 } },
      'ash-cloud': { label: { x: 144, y: 32, anchor: 'end', fontSize: 14 }, marker: { x: 232, y: 30 } }
    }
  },
  'u20-eruption-products': {
    width: 360,
    height: 250,
    regions: {
      ash: { label: { x: 112, y: 40, anchor: 'end', fontSize: 14 }, marker: { x: 170, y: 38 } },
      lava: { label: { x: 354, y: 226, anchor: 'end', fontSize: 14 }, marker: { x: 266, y: 168 } },
      rocks: { label: { x: 354, y: 126, anchor: 'end', fontSize: 14 }, marker: { x: 290, y: 76 } }
    }
  },
  'u20-layers-growth': {
    width: 360,
    height: 236,
    regions: {
      fresh: { label: panelLabel(0), marker: { x: 62, y: 60 } },
      cooled: { label: panelLabel(1), marker: { x: 180, y: 60 } },
      'new-layer': { label: panelLabel(2), marker: { x: 298, y: 60 } }
    },
    // Step numbers: lessons and feedback only (the arrows show the order in a question).
    notes: [
      { text: '1. etapp', label: { x: 12, y: 20, anchor: 'start', fontSize: NOTE } },
      { text: '2. etapp', label: { x: 130, y: 20, anchor: 'start', fontSize: NOTE } },
      { text: '3. etapp', label: { x: 248, y: 20, anchor: 'start', fontSize: NOTE } }
    ]
  },
  'u20-volcano-locations': {
    width: 360,
    height: 240,
    regions: {
      boundary: { label: { x: 200, y: 24, anchor: 'middle', fontSize: 13 }, marker: { x: 200, y: 88 } },
      hotspot: { label: { x: 354, y: 236, anchor: 'end', fontSize: 13 }, marker: { x: 290, y: 88 } },
      'quiet-interior': { label: { x: 8, y: 60, anchor: 'start', fontSize: 13, wrap: 124 }, marker: { x: 56, y: 128 } }
    },
    // Plate and mantle names: lessons and feedback only.
    notes: [
      { text: 'laam', label: { x: 12, y: 164, anchor: 'start', fontSize: NOTE } },
      { text: 'laam', label: { x: 350, y: 164, anchor: 'end', fontSize: NOTE } },
      { text: 'vahevöö', label: { x: 8, y: 226, anchor: 'start', fontSize: NOTE } }
    ]
  },
  'u20-volcano-states': {
    width: 360,
    height: 236,
    regions: {
      erupting: { label: panelLabel(0), marker: { x: 28, y: 50 } },
      dormant: { label: panelLabel(1), marker: { x: 146, y: 50 } },
      extinct: { label: panelLabel(2), marker: { x: 264, y: 50 } }
    },
    notes: [
      { text: 'väljamõeldud näited', label: { x: 12, y: 20, anchor: 'start', fontSize: NOTE } }
    ]
  },
  'u20-geysers': {
    width: 360,
    height: 250,
    regions: {
      geyser: { label: { x: 244, y: 40, anchor: 'end', fontSize: 14 }, marker: { x: 282, y: 60 } },
      spring: { label: { x: 8, y: 98, anchor: 'start', fontSize: 14 }, marker: { x: 136, y: 132 } },
      groundwater: { label: { x: 8, y: 232, anchor: 'start', fontSize: 14 }, marker: { x: 46, y: 184 } },
      'heated-rock': { label: { x: 354, y: 228, anchor: 'end', fontSize: 14, wrap: 100 }, marker: { x: 192, y: 232 } }
    }
  }
};

// Component file per diagram, relative to src/app/components/textbook/diagrams/
// (the layout test reads the hit areas from the source).
export const U20_DIAGRAM_FILES: Record<string, string> = {
  'u20-magma-lava': 'unit20/MagmaLavaDiagram.tsx',
  'u20-volcano-cutaway': 'unit20/VolcanoCutawayDiagram.tsx',
  'u20-eruption-products': 'unit20/EruptionProductsDiagram.tsx',
  'u20-layers-growth': 'unit20/LayersGrowthDiagram.tsx',
  'u20-volcano-locations': 'unit20/VolcanoLocationsDiagram.tsx',
  'u20-volcano-states': 'unit20/VolcanoStatesDiagram.tsx',
  'u20-geysers': 'unit20/GeysersDiagram.tsx'
};
