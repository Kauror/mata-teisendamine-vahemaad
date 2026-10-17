import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIAGRAMS } from '@/lib/textbook/diagramRegistry';
import { DIAGRAM_LAYOUTS, MARKER_RADIUS, estimateTextWidth, labelExtent } from '@/app/components/textbook/diagrams/diagramLayout';
import { aboveSightLine, above, surfacePoint } from '@/app/components/textbook/diagrams/curvedSurface';
import {
  BEACH_EYE_POINT, BEACH_HORIZON, BEACH_X, FAR_SHIP_X, HEIGHT_SEA, NEAR_SHIP_X, SHIP_EYE, SHIP_HORIZON, SHIP_HULL_TOP, SHIP_MAST_TOP, SHIP_SEA,
  TOWER_EYE_POINT, TOWER_HORIZON, TOWER_X
} from '@/app/components/textbook/diagrams/horizonGeometry';
import { UNIT13_COMPONENT_FILES } from '@/app/components/textbook/diagrams/unit13/layout';

// How the label fit is measured: CI renders SVG text in DejaVu Sans (no
// Nunito there), about 17 % wider than a phone. estimateTextWidth sums real
// DejaVu Sans Bold advance widths per glyph (+5 %, unknown glyphs count as the
// widest), so a label that fits here fits on CI and on the phone. Labels are
// shown in lessons as "leht" and after answering as "B – leht": both must fit.

const COMPONENT_FILES: Record<string, string> = {
  'demo-water-cycle': 'WaterCycleDiagram.tsx',
  'demo-plant-parts': 'PlantPartsDiagram.tsx',
  'u10-ancient-earth': 'AncientEarthDiagram.tsx',
  'u10-lunar-eclipse': 'LunarEclipseDiagram.tsx',
  'u10-ship-horizon': 'ShipHorizonDiagram.tsx',
  'u10-observer-height': 'ObserverHeightDiagram.tsx',
  ...UNIT13_COMPONENT_FILES
};

// The narrowest picture a phone draws: 360 px screen − page, card and diagram
// padding (16 + 16 + 6 on each side) = 284 px; the SVG never exceeds 360 px.
const NARROWEST_PX = 360 - 2 * (16 + 16 + 6);
const MIN_TARGET_PX = 44;

function hitAreas(diagramId: string) {
  const source = readFileSync(path.join(__dirname, COMPONENT_FILES[diagramId]), 'utf8');
  return [...source.matchAll(/regionId='([a-z0-9-]+)' props=\{props\} hit=\{\{ x: (\d+), y: (\d+), width: (\d+), height: (\d+) \}\}/g)]
    .map((match) => ({ regionId: match[1], x: Number(match[2]), y: Number(match[3]), width: Number(match[4]), height: Number(match[5]) }));
}

const EDGE = 2;

describe('textbook diagrams', () => {
  it('has a layout and a component for every registered diagram, with exactly its regions', () => {
    for (const diagram of DIAGRAMS) {
      const layout = DIAGRAM_LAYOUTS[diagram.id];
      expect(layout, diagram.id).toBeDefined();
      expect(Object.keys(layout.regions).sort()).toEqual(diagram.regions.map((region) => region.id).sort());
      const file = COMPONENT_FILES[diagram.id];
      expect(file, `component for ${diagram.id}`).toBeDefined();
      const source = readFileSync(path.join(__dirname, file), 'utf8');
      const drawn = [...source.matchAll(/regionId='([a-z0-9-]+)'/g)].map((match) => match[1]).sort();
      expect(drawn).toEqual(diagram.regions.map((region) => region.id).sort());
    }
  });

  it('fits every label and marker inside the picture at DejaVu Sans Bold widths', () => {
    for (const diagram of DIAGRAMS) {
      const layout = DIAGRAM_LAYOUTS[diagram.id];
      for (const region of diagram.regions) {
        const { label, marker } = layout.regions[region.id];
        for (const text of [region.label, `${region.marker} – ${region.label}`]) {
          const extent = labelExtent(label, text);
          expect(extent.left, `${diagram.id}/${region.id} "${text}" left`).toBeGreaterThanOrEqual(EDGE);
          expect(extent.right, `${diagram.id}/${region.id} "${text}" right`).toBeLessThanOrEqual(layout.width - EDGE);
        }
        expect(label.y - label.fontSize).toBeGreaterThanOrEqual(0);
        expect(label.y).toBeLessThanOrEqual(layout.height);
        expect(marker.x - MARKER_RADIUS).toBeGreaterThanOrEqual(0);
        expect(marker.x + MARKER_RADIUS).toBeLessThanOrEqual(layout.width);
        expect(marker.y - MARKER_RADIUS).toBeGreaterThanOrEqual(0);
        expect(marker.y + MARKER_RADIUS).toBeLessThanOrEqual(layout.height);
      }
    }
  });

  it('fits every lesson note inside the picture', () => {
    for (const diagram of DIAGRAMS) {
      const layout = DIAGRAM_LAYOUTS[diagram.id];
      for (const note of layout.notes ?? []) {
        const extent = labelExtent(note.label, note.text);
        expect(extent.left, `${diagram.id} note "${note.text}"`).toBeGreaterThanOrEqual(EDGE);
        expect(extent.right, `${diagram.id} note "${note.text}"`).toBeLessThanOrEqual(layout.width - EDGE);
        expect(note.label.y - note.label.fontSize).toBeGreaterThanOrEqual(0);
        expect(note.label.y).toBeLessThanOrEqual(layout.height);
      }
    }
  });

  it('gives every region a tap area of at least 44 px on a 360 px phone, holding its marker, without overlaps', () => {
    for (const diagram of DIAGRAMS) {
      const layout = DIAGRAM_LAYOUTS[diagram.id];
      const scale = Math.min(360, NARROWEST_PX) / layout.width;
      const hits = hitAreas(diagram.id);
      expect(hits.map((hit) => hit.regionId).sort()).toEqual(diagram.regions.map((region) => region.id).sort());
      for (const hit of hits) {
        expect(Math.min(hit.width, hit.height) * scale, `${diagram.id}/${hit.regionId} px`).toBeGreaterThanOrEqual(MIN_TARGET_PX);
        expect(hit.x).toBeGreaterThanOrEqual(0);
        expect(hit.x + hit.width).toBeLessThanOrEqual(layout.width);
        expect(hit.y + hit.height).toBeLessThanOrEqual(layout.height);
        const marker = layout.regions[hit.regionId].marker;
        expect(marker.x >= hit.x && marker.x <= hit.x + hit.width && marker.y >= hit.y && marker.y <= hit.y + hit.height, `${diagram.id}/${hit.regionId} marker inside its tap area`).toBe(true);
        // The demo plant overlaps on purpose (leaves drawn over the stem); unit diagrams do not.
        for (const other of diagram.demo ? [] : hits.filter((item) => item.regionId !== hit.regionId)) {
          const overlap = hit.x < other.x + other.width && other.x < hit.x + hit.width && hit.y < other.y + other.height && other.y < hit.y + hit.height;
          expect(overlap, `${diagram.id}: ${hit.regionId} overlaps ${other.regionId}`).toBe(false);
        }
      }
    }
  });

  it('never names a region in the hotspot description', () => {
    // DiagramSvg replaces the description by a neutral one in hotspot mode.
    const frame = readFileSync(path.join(__dirname, 'DiagramFrame.tsx'), 'utf8');
    expect(frame).toMatch(/mode === 'hotspot' \? neutralDiagramDescription\(definition\)/);
    for (const diagram of DIAGRAMS) {
      const source = readFileSync(path.join(__dirname, COMPONENT_FILES[diagram.id]), 'utf8');
      expect(source, diagram.id).toMatch(/<DiagramSvg diagramId=\{ID\} mode=\{props\.mode\}/);
    }
  });

  it('ship diagram: the far ship hides its hull behind the curve but shows its mast top; the near ship is fully visible', () => {
    // Points straight up from the surface at x, h units high.
    const visible = (x: number, h: number) => aboveSightLine(SHIP_EYE, SHIP_HORIZON, above(SHIP_SEA, x, h));
    expect(SHIP_HORIZON.x).toBeGreaterThan(NEAR_SHIP_X + 26);
    expect(SHIP_HORIZON.x).toBeLessThan(FAR_SHIP_X - 26);
    // Far ship (beyond the horizon): waterline and hull top hidden, mast top visible.
    expect(visible(FAR_SHIP_X, 0)).toBe(false);
    expect(visible(FAR_SHIP_X, SHIP_HULL_TOP)).toBe(false);
    expect(visible(FAR_SHIP_X, SHIP_MAST_TOP)).toBe(true);
    // The horizon touches the sea surface.
    const touch = surfacePoint(SHIP_SEA, SHIP_HORIZON.x);
    expect(Math.abs(touch.y - SHIP_HORIZON.y)).toBeLessThan(0.01);
  });

  it('observer-height diagram: both have a horizon, the tower one is farther away along the sea', () => {
    const arc = (fromX: number, horizon: { x: number; y: number }) => {
      const base = surfacePoint(HEIGHT_SEA, fromX);
      const angle = (point: { x: number; y: number }) => Math.atan2(point.y - HEIGHT_SEA.cy, point.x - HEIGHT_SEA.cx);
      return Math.abs(angle(horizon) - angle(base)) * HEIGHT_SEA.r;
    };
    const beach = arc(BEACH_X, BEACH_HORIZON);
    const tower = arc(TOWER_X, TOWER_HORIZON);
    expect(beach).toBeGreaterThan(40);
    expect(tower).toBeGreaterThan(beach * 1.3);
    expect(TOWER_EYE_POINT.y).toBeLessThan(BEACH_EYE_POINT.y);
    for (const point of [BEACH_HORIZON, TOWER_HORIZON]) {
      expect(point.x).toBeGreaterThan(4);
      expect(point.x).toBeLessThan(356);
      expect(point.y).toBeLessThan(266);
      expect(Math.abs(surfacePoint(HEIGHT_SEA, point.x).y - point.y)).toBeLessThan(0.01);
    }
  });

  it('never lets two labels or notes of one unit diagram overlap (feedback text "B – leht" included)', () => {
    type Box = { name: string; left: number; right: number; top: number; bottom: number };
    for (const diagram of DIAGRAMS.filter((item) => !item.demo)) {
      const layout = DIAGRAM_LAYOUTS[diagram.id];
      const boxes: Box[] = [
        ...diagram.regions.map((region) => {
          const label = layout.regions[region.id].label;
          return { name: region.id, ...labelExtent(label, `${region.marker} – ${region.label}`), top: label.y - label.fontSize, bottom: label.y };
        }),
        ...(layout.notes ?? []).map((note) => ({ name: `note "${note.text}"`, ...labelExtent(note.label, note.text), top: note.label.y - note.label.fontSize, bottom: note.label.y }))
      ];
      for (const [index, box] of boxes.entries()) {
        for (const other of boxes.slice(index + 1)) {
          const overlap = box.left < other.right && other.left < box.right && box.top < other.bottom && other.top < box.bottom;
          expect(overlap, `${diagram.id}: ${box.name} overlaps ${other.name}`).toBe(false);
        }
      }
    }
  });

  it('estimates conservatively', () => {
    // "m" is the widest lowercase letter; unknown glyphs count as the widest.
    expect(estimateTextWidth('m', 10)).toBeGreaterThan(estimateTextWidth('i', 10));
    expect(estimateTextWidth('€', 10)).toBeGreaterThanOrEqual(estimateTextWidth('W', 10));
  });
});
