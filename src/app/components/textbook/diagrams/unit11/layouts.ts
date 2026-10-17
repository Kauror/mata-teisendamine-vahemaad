import type { DiagramLayout } from '@/app/components/textbook/diagrams/diagramLayout';
import type { Globe } from '@/app/components/textbook/diagrams/unit11/globeProjection';

// Unit 11 "Gloobus": label and marker positions (spread into DIAGRAM_LAYOUTS),
// and the globe geometry the components and the unit test share. This file
// must not import values from diagramLayout.ts (that module imports it).

// u11-axis-poles: the axis leans 23.4° from the vertical, top to the left.
export const AXIS_GLOBE = { cx: 150, cy: 145, r: 98 };
export const AXIS_TILT = 23.4;
// A point on the axis `distance` from the centre (positive = towards the north pole, up and left).
export function axisPoint(distance: number) {
  const angle = (AXIS_TILT * Math.PI) / 180;
  return { x: AXIS_GLOBE.cx - distance * Math.sin(angle), y: AXIS_GLOBE.cy - distance * Math.cos(angle) };
}
// u11-equator-parallels: seen from 8° above the equator plane.
export const PARALLELS_GLOBE: Globe = { cx: 170, cy: 135, r: 102, elevation: 8 };
export const PARALLEL_LATITUDE = 40;
// u11-meridians-estonia: seen straight at the equator, the prime meridian in the middle.
export const MERIDIANS_GLOBE: Globe = { cx: 190, cy: 150, r: 118, elevation: 0 };
export const OTHER_MERIDIAN = -45;
export const PLAIN_MERIDIAN = 45;
// Tallinn, roughly the middle of Estonia's north–south extent and on its longitude span.
export const ESTONIA = { latitude: 58.6, longitude: 25 };

export const UNIT11_LAYOUTS: Record<string, DiagramLayout> = {
  // Two globes side by side; each label wraps onto two lines under its globe.
  'u11-globe-types': {
    width: 340,
    height: 200,
    regions: {
      'relief-globe': { label: { x: 86, y: 172, anchor: 'middle', fontSize: 15, wrap: 156 }, marker: { x: 86, y: 84 } },
      'political-globe': { label: { x: 254, y: 172, anchor: 'middle', fontSize: 15, wrap: 156 }, marker: { x: 254, y: 84 } }
    }
  },
  'u11-axis-poles': {
    width: 300,
    height: 285,
    regions: {
      'north-pole': { label: { x: 128, y: 34, anchor: 'start', fontSize: 15 }, marker: { x: 111, y: 55 } },
      'south-pole': { label: { x: 180, y: 274, anchor: 'end', fontSize: 15 }, marker: { x: 189, y: 235 } },
      axis: { label: { x: 150, y: 196, anchor: 'middle', fontSize: 15 }, marker: { x: 150, y: 145 } }
    }
  },
  // Line markers sit on their line on the right; area markers on the left, between the lines.
  'u11-equator-parallels': {
    width: 340,
    height: 270,
    regions: {
      equator: { label: { x: 268, y: 133, anchor: 'end', fontSize: 15 }, marker: { x: 250, y: 144 } },
      'north-parallel': { label: { x: 170, y: 62, anchor: 'middle', fontSize: 14 }, marker: { x: 230, y: 77 } },
      'south-parallel': { label: { x: 170, y: 232, anchor: 'middle', fontSize: 14 }, marker: { x: 230, y: 207 } },
      'north-hemisphere': { label: { x: 170, y: 110, anchor: 'middle', fontSize: 15 }, marker: { x: 132, y: 116 } },
      'south-hemisphere': { label: { x: 170, y: 184, anchor: 'middle', fontSize: 15 }, marker: { x: 132, y: 177 } }
    }
  },
  // Hemisphere names in the top corners, line names under the globe near the lines' southern ends.
  'u11-meridians-estonia': {
    width: 380,
    height: 300,
    regions: {
      'other-meridian': { label: { x: 6, y: 292, anchor: 'start', fontSize: 15 }, marker: { x: 118, y: 209 } },
      'prime-meridian': { label: { x: 198, y: 292, anchor: 'start', fontSize: 15 }, marker: { x: 190, y: 215 } },
      estonia: { label: { x: 226, y: 55, anchor: 'start', fontSize: 15 }, marker: { x: 216, y: 49 } },
      'west-hemisphere': { label: { x: 6, y: 22, anchor: 'start', fontSize: 15 }, marker: { x: 153, y: 119 } },
      'east-hemisphere': { label: { x: 374, y: 22, anchor: 'end', fontSize: 15 }, marker: { x: 229, y: 119 } }
    },
    notes: [
      { text: 'ekvaator', label: { x: 302, y: 143, anchor: 'end', fontSize: 13 } }
    ]
  }
};

// Component source files (relative to diagrams/), for the layout test that reads their tap areas.
export const UNIT11_COMPONENT_FILES: Record<string, string> = {
  'u11-globe-types': 'unit11/GlobeTypesDiagram.tsx',
  'u11-axis-poles': 'unit11/AxisPolesDiagram.tsx',
  'u11-equator-parallels': 'unit11/EquatorParallelsDiagram.tsx',
  'u11-meridians-estonia': 'unit11/MeridiansEstoniaDiagram.tsx'
};
