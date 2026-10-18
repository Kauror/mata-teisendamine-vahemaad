import type { DiagramLayout } from '@/app/components/textbook/diagrams/diagramLayout';

// Unit 21 "Maavärinad": label, marker and note positions, spread into
// DIAGRAM_LAYOUTS. Plain numbers (not the shared font-size constants):
// diagramLayout.ts imports this file, so importing values back would be a
// cycle. 13 = NOTE_FONT_SIZE. Long safety labels wrap inside their own panel.
const NOTE = 13;

// The three-panel pictures (tsunami stages, tsunami warnings, after the
// quake): panels 112 wide at x 6, 124 and 242, labels centred under the drawing.
export const U21_PANEL_X = [6, 124, 242] as const;
export const U21_PANEL_WIDTH = 112;
const panelLabel = (index: number) => ({ x: U21_PANEL_X[index] + U21_PANEL_WIDTH / 2, y: 190, anchor: 'middle' as const, fontSize: 12, wrap: 108 });

export const U21_DIAGRAM_LAYOUTS: Record<string, DiagramLayout> = {
  'u21-plate-stress': {
    width: 360,
    height: 250,
    regions: {
      locked: { label: { x: 91, y: 52, anchor: 'middle', fontSize: 13, wrap: 150 }, marker: { x: 94, y: 128 } },
      'stored-stress': { label: { x: 91, y: 238, anchor: 'middle', fontSize: 13 }, marker: { x: 40, y: 222 } },
      slip: { label: { x: 269, y: 58, anchor: 'middle', fontSize: 13 }, marker: { x: 300, y: 150 } }
    },
    // Panel captions ("after" names the slip): lessons and feedback only.
    notes: [
      { text: '1. enne nihet', label: { x: 14, y: 20, anchor: 'start', fontSize: NOTE } },
      { text: '2. pärast nihet', label: { x: 192, y: 20, anchor: 'start', fontSize: NOTE } }
    ]
  },
  'u21-focus-waves': {
    width: 360,
    height: 260,
    regions: {
      focus: { label: { x: 190, y: 196, anchor: 'start', fontSize: 14 }, marker: { x: 175, y: 190 } },
      epicenter: { label: { x: 175, y: 24, anchor: 'middle', fontSize: 14 }, marker: { x: 175, y: 40 } },
      waves: { label: { x: 354, y: 132, anchor: 'end', fontSize: 14 }, marker: { x: 246, y: 216 } },
      fault: { label: { x: 8, y: 252, anchor: 'start', fontSize: 14 }, marker: { x: 126, y: 240 } }
    },
    notes: [
      { text: 'maapind', label: { x: 8, y: 58, anchor: 'start', fontSize: NOTE } }
    ]
  },
  'u21-world-locations': {
    width: 360,
    height: 196,
    regions: {
      japan: { label: { x: 356, y: 104, anchor: 'end', fontSize: 13 }, marker: { x: 318, y: 60 } },
      iceland: { label: { x: 150, y: 64, anchor: 'end', fontSize: 13 }, marker: { x: 158, y: 31 } },
      chile: { label: { x: 124, y: 152, anchor: 'start', fontSize: 13 }, marker: { x: 109, y: 129 } },
      estonia: { label: { x: 222, y: 26, anchor: 'start', fontSize: 13 }, marker: { x: 206, y: 37 } }
    }
  },
  'u21-tsunami-stages': {
    width: 360,
    height: 236,
    regions: {
      seafloor: { label: panelLabel(0), marker: { x: 66, y: 168 } },
      'open-ocean': { label: panelLabel(1), marker: { x: 180, y: 54 } },
      coast: { label: panelLabel(2), marker: { x: 300, y: 136 } }
    },
    // Step captions ("avameri", "rannik" name the answers): lessons and feedback only.
    notes: [
      { text: '1. põhjus', label: { x: 12, y: 20, anchor: 'start', fontSize: NOTE } },
      { text: '2. avameri', label: { x: 130, y: 20, anchor: 'start', fontSize: NOTE } },
      { text: '3. rannik', label: { x: 248, y: 20, anchor: 'start', fontSize: NOTE } }
    ]
  },
  'u21-tsunami-warnings': {
    width: 360,
    height: 236,
    regions: {
      'strong-shaking': { label: panelLabel(0), marker: { x: 70, y: 124 } },
      'water-change': { label: panelLabel(1), marker: { x: 172, y: 108 } },
      'sea-roar': { label: panelLabel(2), marker: { x: 298, y: 96 } }
    }
  },
  'u21-coastal-escape': {
    width: 360,
    height: 220,
    regions: {
      'high-ground': { label: { x: 354, y: 100, anchor: 'end', fontSize: 13, wrap: 150 }, marker: { x: 316, y: 34 } },
      'inland-route': { label: { x: 250, y: 176, anchor: 'middle', fontSize: 13, wrap: 170 }, marker: { x: 206, y: 112 } },
      beach: { label: { x: 6, y: 120, anchor: 'start', fontSize: 13 }, marker: { x: 104, y: 178 } }
    },
    notes: [
      { text: 'meri', label: { x: 10, y: 206, anchor: 'start', fontSize: NOTE, onShape: true } }
    ]
  },
  'u21-drop-cover-hold': {
    width: 360,
    height: 320,
    regions: {
      drop: { label: { x: 92, y: 144, anchor: 'middle', fontSize: 13, wrap: 164 }, marker: { x: 92, y: 40 } },
      cover: { label: { x: 268, y: 144, anchor: 'middle', fontSize: 13, wrap: 164 }, marker: { x: 268, y: 40 } },
      hold: { label: { x: 92, y: 302, anchor: 'middle', fontSize: 13, wrap: 164 }, marker: { x: 92, y: 198 } },
      window: { label: { x: 268, y: 302, anchor: 'middle', fontSize: 13, wrap: 164 }, marker: { x: 268, y: 234 } }
    }
  },
  'u21-outdoors': {
    width: 360,
    height: 220,
    regions: {
      'open-area': { label: { x: 180, y: 210, anchor: 'middle', fontSize: 13 }, marker: { x: 180, y: 176 } },
      building: { label: { x: 6, y: 18, anchor: 'start', fontSize: 13 }, marker: { x: 54, y: 104 } },
      'power-lines': { label: { x: 354, y: 18, anchor: 'end', fontSize: 13 }, marker: { x: 305, y: 96 } }
    }
  },
  'u21-aftershock-safety': {
    width: 360,
    height: 236,
    regions: {
      'fallen-wire': { label: panelLabel(1), marker: { x: 196, y: 124 } },
      'damaged-wall': { label: panelLabel(0), marker: { x: 62, y: 112 } },
      radio: { label: panelLabel(2), marker: { x: 316, y: 84 } }
    }
  }
};

// Component file per diagram, relative to src/app/components/textbook/diagrams/
// (the layout test reads the hit areas from the source).
export const U21_DIAGRAM_FILES: Record<string, string> = {
  'u21-plate-stress': 'unit21/PlateStressDiagram.tsx',
  'u21-focus-waves': 'unit21/FocusWavesDiagram.tsx',
  'u21-world-locations': 'unit21/WorldLocationsDiagram.tsx',
  'u21-tsunami-stages': 'unit21/TsunamiStagesDiagram.tsx',
  'u21-tsunami-warnings': 'unit21/TsunamiWarningsDiagram.tsx',
  'u21-coastal-escape': 'unit21/CoastalEscapeDiagram.tsx',
  'u21-drop-cover-hold': 'unit21/DropCoverHoldDiagram.tsx',
  'u21-outdoors': 'unit21/OutdoorsDiagram.tsx',
  'u21-aftershock-safety': 'unit21/AftershockSafetyDiagram.tsx'
};
