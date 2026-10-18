import type { DiagramLayout } from '@/app/components/textbook/diagrams/diagramLayout';

// Unit 17 "Eesti geograafiline asend": label, marker and note positions,
// spread into DIAGRAM_LAYOUTS, plus the map geometry the components and the
// unit test share. Plain numbers (not the shared font-size constants):
// diagramLayout.ts imports this file, so importing values back would be a
// cycle. Never rename this file to `layout.ts` (Next.js route layout).

// u17-hemispheres: two disks side by side.
export const HEMI_LEFT = { cx: 90, cy: 105, r: 72 };
export const HEMI_RIGHT = { cx: 270, cy: 105, r: 72 };

// Maps: each draws its source geometry inside <g transform="translate(tx ty)
// scale(s)">, so a source point (x, y) lands at (s·x + tx, s·y + ty) in the
// picture. The world paths are 720×360 equirectangular (x = 2·(lon + 180),
// y = 2·(90 − lat)); the Baltic paths are 780×595 (x = 30·(lon − 10),
// y = 35·(70 − lat)), cropped here to the eastern Baltic.
export type MapTransform = { s: number; tx: number; ty: number };
export const WORLD_MAP: MapTransform = { s: 0.5, tx: 0, ty: 0 };
export const BALTIC_MAP: MapTransform = { s: 0.72, tx: -108, ty: -43.2 };
export const WATERS_MAP: MapTransform = { s: 0.95, tx: -218.5, ty: -285 };
export const mapTransform = (map: MapTransform) => `translate(${map.tx} ${map.ty}) scale(${map.s})`;
export const toPicture = (map: MapTransform, point: { x: number; y: number }) => ({ x: map.s * point.x + map.tx, y: map.s * point.y + map.ty });

// Estonia on the world map: 59° N, 25° E in world-path units (a dot, not to scale).
export const WORLD_ESTONIA = { x: 2 * (25 + 180), y: 2 * (90 - 59) };

// The 1:110m outline has no islands. Schematic Saaremaa and Hiiumaa (in Baltic
// path units, after their real extents: Saaremaa ≈ 21.8–23.4° E, 57.9–58.6° N;
// Hiiumaa ≈ 22.0–23.0° E, 58.7–59.1° N). Part of Estonia.
export const SAAREMAA = 'M356 413 L366 401 L383 397 L397 400 L398 407 L388 414 L377 423 L366 427 L361 421 Z';
export const HIIUMAA = 'M362 390 L370 383 L386 382 L391 387 L383 393 L368 395 Z';
// Lake Peipus as an illustrative oval on the Estonian–Russian border
// (≈ 27.2–27.9° E, 58.0–59.0° N), NOT a surveyed shoreline.
export const PEIPUS = { cx: 528, cy: 405, rx: 9, ry: 24 };

export const U17_DIAGRAM_LAYOUTS: Record<string, DiagramLayout> = {
  // Lessons: the equator's halves labelled inside the left disk, the prime
  // meridian's under the right disk on either side of the line.
  'u17-hemispheres': {
    width: 360,
    height: 220,
    regions: {
      north: { label: { x: 90, y: 64, anchor: 'middle', fontSize: 13, wrap: 128 }, marker: { x: 90, y: 66 } },
      south: { label: { x: 90, y: 132, anchor: 'middle', fontSize: 13, wrap: 128 }, marker: { x: 90, y: 144 } },
      west: { label: { x: 267, y: 197, anchor: 'end', fontSize: 12, wrap: 104 }, marker: { x: 234, y: 105 } },
      east: { label: { x: 273, y: 197, anchor: 'start', fontSize: 12, wrap: 90 }, marker: { x: 306, y: 105 } }
    },
    notes: [
      { text: 'ekvaator', label: { x: 90, y: 100, anchor: 'middle', fontSize: 13 } },
      { text: 'nullmeridiaan', label: { x: 270, y: 22, anchor: 'middle', fontSize: 13 } }
    ]
  },
  'u17-world-location': {
    width: 360,
    height: 180,
    regions: {
      eurasia: { label: { x: 272, y: 48, anchor: 'middle', fontSize: 14 }, marker: { x: 280, y: 40 } },
      africa: { label: { x: 196, y: 100, anchor: 'middle', fontSize: 13 }, marker: { x: 197, y: 90 } },
      'north-america': { label: { x: 92, y: 50, anchor: 'middle', fontSize: 13 }, marker: { x: 95, y: 40 } },
      'south-america': { label: { x: 128, y: 116, anchor: 'middle', fontSize: 13 }, marker: { x: 126, y: 100 } },
      australia: { label: { x: 356, y: 152, anchor: 'end', fontSize: 13 }, marker: { x: 313, y: 112 } },
      antarctica: { label: { x: 220, y: 173, anchor: 'middle', fontSize: 13 }, marker: { x: 220, y: 164 } }
    },
    notes: [
      { text: 'Eesti', label: { x: 213, y: 24, anchor: 'start', fontSize: 12 } }
    ]
  },
  'u17-baltic-region': {
    width: 360,
    height: 385,
    regions: {
      estonia: { label: { x: 238, y: 250, anchor: 'middle', fontSize: 14 }, marker: { x: 238, y: 243 } },
      finland: { label: { x: 238, y: 122, anchor: 'middle', fontSize: 14 }, marker: { x: 238, y: 115 } },
      sweden: { label: { x: 46, y: 136, anchor: 'middle', fontSize: 14 }, marker: { x: 43, y: 129 } },
      latvia: { label: { x: 242, y: 304, anchor: 'middle', fontSize: 14 }, marker: { x: 241, y: 297 } },
      russia: { label: { x: 356, y: 222, anchor: 'end', fontSize: 14 }, marker: { x: 324, y: 259 } },
      lithuania: { label: { x: 198, y: 356, anchor: 'middle', fontSize: 14 }, marker: { x: 198, y: 348 } }
    },
    notes: [
      { text: 'Läänemeri', label: { x: 96, y: 292, anchor: 'middle', fontSize: 13 } },
      { text: 'Soome laht', label: { x: 232, y: 205, anchor: 'middle', fontSize: 13 } }
    ]
  },
  'u17-estonia-waters': {
    width: 360,
    height: 180,
    regions: {
      'baltic-sea': { label: { x: 62, y: 152, anchor: 'middle', fontSize: 14 }, marker: { x: 61, y: 125 } },
      'gulf-finland': { label: { x: 200, y: 54, anchor: 'middle', fontSize: 14 }, marker: { x: 240, y: 50 } },
      'gulf-riga': { label: { x: 178, y: 146, anchor: 'middle', fontSize: 14 }, marker: { x: 173, y: 128 } },
      'lake-peipus': { label: { x: 295, y: 154, anchor: 'middle', fontSize: 14 }, marker: { x: 283, y: 100 } }
    },
    // Land names: lessons and feedback only (in a hotspot question Estonia is still yellow).
    notes: [
      { text: 'Eesti', label: { x: 232, y: 96, anchor: 'middle', fontSize: 13 } },
      { text: 'Soome', label: { x: 250, y: 14, anchor: 'middle', fontSize: 13 } },
      { text: 'Läti', label: { x: 262, y: 176, anchor: 'middle', fontSize: 13 } },
      { text: 'Venemaa', label: { x: 356, y: 112, anchor: 'end', fontSize: 13 } }
    ]
  }
};

// Component file per diagram, relative to src/app/components/textbook/diagrams/
// (the layout test reads the hit areas from the source).
export const U17_DIAGRAM_FILES: Record<string, string> = {
  'u17-hemispheres': 'unit17/HemispheresDiagram.tsx',
  'u17-world-location': 'unit17/WorldLocationDiagram.tsx',
  'u17-baltic-region': 'unit17/BalticRegionDiagram.tsx',
  'u17-estonia-waters': 'unit17/EstoniaWatersDiagram.tsx'
};
