// Where each registered diagram puts its region labels and hotspot markers,
// as data, so a unit test can prove every label fits inside the picture at
// the font widths CI renders with (DejaVu Sans Bold: CI has no Nunito and its
// text is ~17 % wider than on a phone). The SVG components read these
// positions; nothing else positions a label.

export type TextAnchor = 'start' | 'middle' | 'end';
export type LabelLayout = {
  x: number;
  y: number;
  anchor: TextAnchor;
  fontSize: number;
  // Drawn on a dark shape: uses the light ink.
  onShape?: boolean;
};
export type MarkerLayout = { x: number; y: number };
export type RegionLayout = { label: LabelLayout; marker: MarkerLayout };
export type DiagramLayout = { width: number; height: number; regions: Record<string, RegionLayout> };

export const MARKER_RADIUS = 13;
export const MARKER_FONT_SIZE = 14;
export const LABEL_FONT_SIZE = 15;

export const DIAGRAM_LAYOUTS: Record<string, DiagramLayout> = {
  'demo-water-cycle': {
    width: 340,
    height: 240,
    regions: {
      sun: { label: { x: 52, y: 98, anchor: 'middle', fontSize: LABEL_FONT_SIZE }, marker: { x: 52, y: 50 } },
      sea: { label: { x: 70, y: 226, anchor: 'middle', fontSize: LABEL_FONT_SIZE, onShape: true }, marker: { x: 70, y: 216 } },
      cloud: { label: { x: 263, y: 67, anchor: 'middle', fontSize: LABEL_FONT_SIZE }, marker: { x: 263, y: 52 } },
      rain: { label: { x: 262, y: 172, anchor: 'middle', fontSize: LABEL_FONT_SIZE }, marker: { x: 264, y: 120 } }
    }
  },
  'demo-plant-parts': {
    width: 260,
    height: 300,
    regions: {
      flower: { label: { x: 168, y: 46, anchor: 'start', fontSize: LABEL_FONT_SIZE }, marker: { x: 130, y: 62 } },
      leaf: { label: { x: 206, y: 100, anchor: 'middle', fontSize: LABEL_FONT_SIZE }, marker: { x: 174, y: 128 } },
      stem: { label: { x: 116, y: 124, anchor: 'end', fontSize: LABEL_FONT_SIZE }, marker: { x: 130, y: 198 } },
      root: { label: { x: 176, y: 266, anchor: 'start', fontSize: LABEL_FONT_SIZE, onShape: true }, marker: { x: 130, y: 258 } }
    }
  }
};

// DejaVu Sans Bold advance widths in em (font units / 2048), for the letters
// diagram labels use. Unknown characters count as the widest glyph, so the
// estimate can only err on the generous side; 5 % is added on top.
const DEJAVU_BOLD_EM: Record<string, number> = {
  ' ': 713, a: 1382, b: 1466, c: 1214, d: 1466, e: 1389, f: 891, g: 1466, h: 1458, i: 702, j: 702, k: 1362, l: 702,
  m: 2134, n: 1458, o: 1407, p: 1466, q: 1466, r: 1010, s: 1219, t: 979, u: 1458, v: 1335, w: 1786, x: 1307, y: 1335, z: 1186,
  'ä': 1382, 'õ': 1407, 'ö': 1407, 'ü': 1458, 'š': 1219, 'ž': 1186,
  A: 1585, B: 1567, C: 1497, D: 1694, E: 1399, F: 1399, G: 1686, H: 1712, I: 768, J: 768, K: 1589, L: 1307, M: 2035,
  N: 1712, O: 1745, P: 1503, R: 1590, S: 1475, T: 1405, U: 1663, V: 1585, W: 2265, Z: 1405,
  'Ä': 1585, 'Õ': 1745, 'Ö': 1745, 'Ü': 1663, '-': 852, '–': 1024
};
const WIDEST = 2265;

export function estimateTextWidth(text: string, fontSize: number): number {
  let units = 0;
  for (const character of text) units += DEJAVU_BOLD_EM[character] ?? WIDEST;
  return (units / 2048) * fontSize * 1.05;
}

// Horizontal extent of a label as drawn.
export function labelExtent(label: LabelLayout, text: string): { left: number; right: number } {
  const width = estimateTextWidth(text, label.fontSize);
  if (label.anchor === 'start') return { left: label.x, right: label.x + width };
  if (label.anchor === 'end') return { left: label.x - width, right: label.x };
  return { left: label.x - width / 2, right: label.x + width / 2 };
}
