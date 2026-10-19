import { UNIT11_LAYOUTS } from '@/app/components/textbook/diagrams/unit11/layouts';
import { UNIT12_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit12/layouts';
import { UNIT13_LAYOUTS } from '@/app/components/textbook/diagrams/unit13/layouts';
import { U14_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit14/layouts';
import { U15_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit15/layouts';
import { U19_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit19/layouts';
import { U18_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit18/layouts';
import { U17_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit17/layouts';
import { U16_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit16/layouts';
import { U20_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit20/layouts';
import { U21_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit21/layouts';
import { U22_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit22/layouts';

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
  // Wrap onto further lines (LABEL_LINE_HEIGHT em apart) wider than this; y is the first baseline.
  wrap?: number;
};
export type MarkerLayout = { x: number; y: number };
export type RegionLayout = { label: LabelLayout; marker: MarkerLayout };
// A small explanatory caption inside the picture that is not a region label
// ("Maa vari", "silmapiir"). Notes are shown in lessons and after answering,
// never in a hotspot question, where they could point at the answer.
export type NoteLayout = { text: string; label: LabelLayout };
export type DiagramLayout = { width: number; height: number; regions: Record<string, RegionLayout>; notes?: NoteLayout[] };

export const MARKER_RADIUS = 13;
export const MARKER_FONT_SIZE = 14;
export const LABEL_FONT_SIZE = 15;
export const NOTE_FONT_SIZE = 13;

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
  },
  // Unit 10 "Maa kuju". Three stacked panels, 150 units tall each.
  'u10-ancient-earth': {
    width: 360,
    height: 480,
    regions: {
      'flat-disk': { label: { x: 180, y: 146, anchor: 'middle', fontSize: 16 }, marker: { x: 180, y: 74 } },
      turtle: { label: { x: 180, y: 306, anchor: 'middle', fontSize: 16 }, marker: { x: 180, y: 226 } },
      globe: { label: { x: 180, y: 466, anchor: 'middle', fontSize: 16 }, marker: { x: 180, y: 398 } }
    },
    notes: [
      { text: 'muistne ettekujutus', label: { x: 16, y: 24, anchor: 'start', fontSize: NOTE_FONT_SIZE } },
      { text: 'muistne lugu', label: { x: 16, y: 184, anchor: 'start', fontSize: NOTE_FONT_SIZE } },
      { text: 'tänapäeva teadmine', label: { x: 16, y: 344, anchor: 'start', fontSize: NOTE_FONT_SIZE } }
    ]
  },
  // Dark space background: every text uses the light ink.
  'u10-lunar-eclipse': {
    width: 380,
    height: 245,
    regions: {
      sun: { label: { x: 55, y: 204, anchor: 'middle', fontSize: 16, onShape: true }, marker: { x: 55, y: 198 } },
      earth: { label: { x: 190, y: 204, anchor: 'middle', fontSize: 16, onShape: true }, marker: { x: 190, y: 198 } },
      moon: { label: { x: 320, y: 204, anchor: 'middle', fontSize: 16, onShape: true }, marker: { x: 320, y: 198 } }
    },
    notes: [
      { text: 'Päikese valgus', label: { x: 132, y: 62, anchor: 'middle', fontSize: NOTE_FONT_SIZE, onShape: true } },
      { text: 'Maa vari', label: { x: 300, y: 86, anchor: 'middle', fontSize: NOTE_FONT_SIZE, onShape: true } }
    ]
  },
  'u10-ship-horizon': {
    width: 380,
    height: 260,
    regions: {
      observer: { label: { x: 6, y: 158, anchor: 'start', fontSize: LABEL_FONT_SIZE }, marker: { x: 32, y: 152 } },
      'near-ship': { label: { x: 128, y: 100, anchor: 'middle', fontSize: LABEL_FONT_SIZE }, marker: { x: 128, y: 95 } },
      'far-ship': { label: { x: 376, y: 118, anchor: 'end', fontSize: LABEL_FONT_SIZE }, marker: { x: 350, y: 122 } }
    },
    notes: [
      { text: 'vaatesiht', label: { x: 262, y: 168, anchor: 'middle', fontSize: NOTE_FONT_SIZE } }
    ]
  },
  'u10-observer-height': {
    width: 360,
    height: 270,
    regions: {
      beach: { label: { x: 102, y: 132, anchor: 'middle', fontSize: LABEL_FONT_SIZE }, marker: { x: 104, y: 126 } },
      tower: { label: { x: 226, y: 110, anchor: 'start', fontSize: LABEL_FONT_SIZE }, marker: { x: 246, y: 104 } }
    },
    notes: [
      { text: 'silmapiir', label: { x: 6, y: 250, anchor: 'start', fontSize: NOTE_FONT_SIZE, onShape: true } },
      { text: 'silmapiir', label: { x: 334, y: 268, anchor: 'end', fontSize: NOTE_FONT_SIZE, onShape: true } }
    ]
  },
  // Later units keep their layouts next to their components (diagrams/unitNN/layouts.ts; never `layout.ts`, which Next.js would take for a route layout).
  ...UNIT11_LAYOUTS,
  ...UNIT12_DIAGRAM_LAYOUTS,
  ...UNIT13_LAYOUTS,
  ...U14_DIAGRAM_LAYOUTS,
  ...U15_DIAGRAM_LAYOUTS,
  ...U19_DIAGRAM_LAYOUTS,
  ...U18_DIAGRAM_LAYOUTS,
  ...U17_DIAGRAM_LAYOUTS,
  ...U16_DIAGRAM_LAYOUTS,
  ...U20_DIAGRAM_LAYOUTS,
  ...U21_DIAGRAM_LAYOUTS,
  ...U22_DIAGRAM_LAYOUTS
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

export const LABEL_LINE_HEIGHT = 1.15;

// The lines a label is drawn on: one, unless `wrap` is set and the text is wider.
export function labelLines(label: LabelLayout, text: string): string[] {
  if (!label.wrap) return [text];
  const lines: string[] = [];
  for (const word of text.split(' ')) {
    const last = lines[lines.length - 1];
    if (last !== undefined && estimateTextWidth(`${last} ${word}`, label.fontSize) <= label.wrap) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}

// Baseline of a label's last line.
export function labelBottom(label: LabelLayout, text: string): number {
  return label.y + (labelLines(label, text).length - 1) * label.fontSize * LABEL_LINE_HEIGHT;
}

// Horizontal extent of a label as drawn (its widest line).
export function labelExtent(label: LabelLayout, text: string): { left: number; right: number } {
  const width = Math.max(...labelLines(label, text).map((line) => estimateTextWidth(line, label.fontSize)));
  if (label.anchor === 'start') return { left: label.x, right: label.x + width };
  if (label.anchor === 'end') return { left: label.x - width, right: label.x };
  return { left: label.x - width / 2, right: label.x + width / 2 };
}
