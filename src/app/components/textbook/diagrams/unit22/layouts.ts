import type { DiagramLayout } from '@/app/components/textbook/diagrams/diagramLayout';

// Unit 22 "Loodusõnnetused": label, marker and note positions, spread into
// DIAGRAM_LAYOUTS. Plain numbers (not the shared font-size constants):
// diagramLayout.ts imports this file, so importing values back would be a
// cycle. Long labels wrap inside their own card.

// The 2 × 2 card pictures (hazard scenarios, flood safety): cards 174 × 144
// at x 4 / 182 and y 4 / 152; the label sits under the drawing in its card.
export const U22_CARD_X = [4, 182] as const;
export const U22_CARD_Y = [4, 152] as const;
export const U22_CARD_WIDTH = 174;
export const U22_CARD_HEIGHT = 144;
const cardLabel = (column: number, row: number, dy = 126) => ({ x: U22_CARD_X[column] + U22_CARD_WIDTH / 2, y: U22_CARD_Y[row] + dy, anchor: 'middle' as const, fontSize: 13, wrap: 164 });
const cardMarker = (column: number, row: number) => ({ x: U22_CARD_X[column] + 22, y: U22_CARD_Y[row] + 22 });

// The five weather cards: 68 wide, 71 apart from x 4.
export const U22_WEATHER_X = [4, 75, 146, 217, 288] as const;
export const U22_WEATHER_WIDTH = 68;
const weatherLabel = (index: number) => ({ x: U22_WEATHER_X[index] + U22_WEATHER_WIDTH / 2, y: 172, anchor: 'middle' as const, fontSize: 12, wrap: 66 });
const weatherMarker = (index: number) => ({ x: U22_WEATHER_X[index] + U22_WEATHER_WIDTH / 2, y: 26 });

// The supplies: three cards on top, two below, 112 × 132.
export const U22_KIT_CARDS = {
  water: { x: 4, y: 4 },
  flashlight: { x: 124, y: 4 },
  radio: { x: 244, y: 4 },
  phone: { x: 64, y: 144 },
  warning: { x: 184, y: 144 }
} as const;
export const U22_KIT_WIDTH = 112;
export const U22_KIT_HEIGHT = 132;
const kitLabel = (id: keyof typeof U22_KIT_CARDS) => ({ x: U22_KIT_CARDS[id].x + U22_KIT_WIDTH / 2, y: U22_KIT_CARDS[id].y + 106, anchor: 'middle' as const, fontSize: 13, wrap: 108 });
const kitMarker = (id: keyof typeof U22_KIT_CARDS) => ({ x: U22_KIT_CARDS[id].x + 20, y: U22_KIT_CARDS[id].y + 20 });

export const U22_DIAGRAM_LAYOUTS: Record<string, DiagramLayout> = {
  'u22-hazard-scenarios': {
    width: 360,
    height: 300,
    regions: {
      'mild-rain': { label: cardLabel(0, 0), marker: cardMarker(0, 0) },
      flood: { label: cardLabel(1, 0), marker: cardMarker(1, 0) },
      sunny: { label: cardLabel(0, 1, 120), marker: cardMarker(0, 1) },
      'storm-damage': { label: cardLabel(1, 1), marker: cardMarker(1, 1) }
    }
  },
  'u22-prepared-home': {
    width: 360,
    height: 280,
    regions: {
      drain: { label: { x: 6, y: 268, anchor: 'start', fontSize: 13 }, marker: { x: 32, y: 196 } },
      roof: { label: { x: 120, y: 50, anchor: 'middle', fontSize: 13 }, marker: { x: 120, y: 96 } },
      'high-storage': { label: { x: 210, y: 136, anchor: 'start', fontSize: 12, wrap: 140 }, marker: { x: 140, y: 200 } },
      kit: { label: { x: 354, y: 268, anchor: 'end', fontSize: 13 }, marker: { x: 238, y: 200 } }
    }
  },
  'u22-estonia-weather': {
    width: 360,
    height: 220,
    regions: {
      downpour: { label: weatherLabel(0), marker: weatherMarker(0) },
      wind: { label: weatherLabel(1), marker: weatherMarker(1) },
      blizzard: { label: weatherLabel(2), marker: weatherMarker(2) },
      frost: { label: weatherLabel(3), marker: weatherMarker(3) },
      heat: { label: weatherLabel(4), marker: weatherMarker(4) }
    }
  },
  'u22-rain-flood': {
    width: 360,
    height: 260,
    regions: {
      cloud: { label: { x: 150, y: 30, anchor: 'start', fontSize: 13 }, marker: { x: 36, y: 34 } },
      runoff: { label: { x: 8, y: 222, anchor: 'start', fontSize: 13, wrap: 132 }, marker: { x: 56, y: 112 } },
      drain: { label: { x: 196, y: 140, anchor: 'middle', fontSize: 13 }, marker: { x: 182, y: 172 } },
      'flooded-road': { label: { x: 354, y: 252, anchor: 'end', fontSize: 13 }, marker: { x: 340, y: 186 } }
    }
  },
  'u22-coastal-flood': {
    width: 360,
    height: 260,
    regions: {
      sea: { label: { x: 14, y: 234, anchor: 'start', fontSize: 13, onShape: true }, marker: { x: 40, y: 222 } },
      wind: { label: { x: 90, y: 36, anchor: 'middle', fontSize: 13 }, marker: { x: 30, y: 96 } },
      'low-shore': { label: { x: 198, y: 252, anchor: 'middle', fontSize: 13 }, marker: { x: 220, y: 202 } },
      'shore-house': { label: { x: 354, y: 30, anchor: 'end', fontSize: 13, wrap: 120 }, marker: { x: 276, y: 72 } }
    },
    // The dashed line under the raised water: lessons and feedback only.
    notes: [
      { text: 'tavaline veepiir', label: { x: 8, y: 202, anchor: 'start', fontSize: 12, onShape: true } }
    ]
  },
  'u22-flood-safety': {
    width: 360,
    height: 300,
    regions: {
      'high-ground': { label: cardLabel(0, 0), marker: cardMarker(0, 0) },
      'dry-shelter': { label: cardLabel(1, 0), marker: cardMarker(1, 0) },
      floodwater: { label: cardLabel(0, 1), marker: cardMarker(0, 1) },
      'power-line': { label: cardLabel(1, 1, 120), marker: cardMarker(1, 1) }
    }
  },
  'u22-prepared-kit': {
    width: 360,
    height: 280,
    regions: {
      water: { label: kitLabel('water'), marker: kitMarker('water') },
      flashlight: { label: kitLabel('flashlight'), marker: kitMarker('flashlight') },
      radio: { label: kitLabel('radio'), marker: kitMarker('radio') },
      phone: { label: kitLabel('phone'), marker: kitMarker('phone') },
      warning: { label: kitLabel('warning'), marker: kitMarker('warning') }
    }
  }
};

// Component file per diagram, relative to src/app/components/textbook/diagrams/
// (the layout test reads the hit areas from the source).
export const U22_DIAGRAM_FILES: Record<string, string> = {
  'u22-hazard-scenarios': 'unit22/HazardScenariosDiagram.tsx',
  'u22-prepared-home': 'unit22/PreparedHomeDiagram.tsx',
  'u22-estonia-weather': 'unit22/EstoniaWeatherDiagram.tsx',
  'u22-rain-flood': 'unit22/RainFloodDiagram.tsx',
  'u22-coastal-flood': 'unit22/CoastalFloodDiagram.tsx',
  'u22-flood-safety': 'unit22/FloodSafetyDiagram.tsx',
  'u22-prepared-kit': 'unit22/PreparedKitDiagram.tsx'
};
