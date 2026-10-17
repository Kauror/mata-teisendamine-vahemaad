import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { DIAGRAMS } from '@/lib/textbook/diagramRegistry';
import { DIAGRAM_LAYOUTS, MARKER_RADIUS, estimateTextWidth, labelExtent } from '@/app/components/textbook/diagrams/diagramLayout';

// How the label fit is measured: CI renders SVG text in DejaVu Sans (no
// Nunito there), about 17 % wider than a phone. estimateTextWidth sums real
// DejaVu Sans Bold advance widths per glyph (+5 %, unknown glyphs count as the
// widest), so a label that fits here fits on CI and on the phone. Labels are
// shown in lessons as "leht" and after answering as "B – leht": both must fit.

const COMPONENT_FILES: Record<string, string> = {
  'demo-water-cycle': 'WaterCycleDiagram.tsx',
  'demo-plant-parts': 'PlantPartsDiagram.tsx'
};

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

  it('estimates conservatively', () => {
    // "m" is the widest lowercase letter; unknown glyphs count as the widest.
    expect(estimateTextWidth('m', 10)).toBeGreaterThan(estimateTextWidth('i', 10));
    expect(estimateTextWidth('€', 10)).toBeGreaterThanOrEqual(estimateTextWidth('W', 10));
  });
});
