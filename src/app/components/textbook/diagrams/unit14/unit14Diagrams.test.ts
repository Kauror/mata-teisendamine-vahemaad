import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { UNIT14_DIAGRAMS } from '@/lib/textbook/diagrams/unit14';
import { unit14 } from '@/content/textbook/loodusopetus-opik/unit14';
import type { DiagramMode } from '@/app/components/textbook/diagrams/DiagramFrame';
import { DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams';
import { labelExtent } from '@/app/components/textbook/diagrams/diagramLayout';
import { U14_DIAGRAM_LAYOUTS, U14_POPULATION_HEADING, U14_POPULATION_LEGEND, U14_POPULATION_LETTERS } from '@/app/components/textbook/diagrams/unit14/layout';

// Unit 14 "Kaartide mitmekesisus": the four fictional maps rendered in every
// mode. The generic checks (label fit, 44 px tap areas, no overlaps) are in
// ../diagramLayout.test.ts; this file proves answer secrecy in hotspot mode and
// that the population map's numbers agree everywhere.

function render(diagramId: string, mode: DiagramMode, extra: Record<string, unknown> = {}) {
  return renderToStaticMarkup(createElement(DIAGRAM_COMPONENTS[diagramId], { mode, onSelectRegion: () => undefined, ...extra }));
}

// Text nodes of the markup (what is drawn or read out), plus every aria-label.
function visibleText(markup: string) {
  const texts = [...markup.matchAll(/>([^<>]+)</g)].map((match) => match[1].trim()).filter(Boolean);
  const labels = [...markup.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]);
  return [...texts, ...labels];
}

const POPULATION = 'u14-population-map';
const EXPECTED = { a: 4000, b: 9000, c: 6000 } as const;
const number = (text: string) => Number(text.replace(/\D/g, ''));

describe('Unit 14 diagrams', () => {
  it('registers exactly the four diagrams with the region IDs the questions use', () => {
    expect(UNIT14_DIAGRAMS.map((diagram) => [diagram.id, diagram.regions.map((region) => `${region.marker}:${region.id}`)])).toEqual([
      ['u14-physical-features', ['A:mountains', 'B:river', 'C:lake', 'D:island']],
      ['u14-political-elements', ['A:country', 'B:border', 'C:capital', 'D:city']],
      ['u14-map-pair', ['A:physical', 'B:political']],
      [POPULATION, ['A:a', 'B:b', 'C:c']]
    ]);
    const used = new Set<string>();
    for (const question of unit14.questions) {
      if (question.answer.type !== 'diagram_hotspot') continue;
      expect(getDiagram(question.answer.diagramId)?.regions.map((region) => region.id), question.id).toContain(question.answer.correctRegionId);
      used.add(`${question.answer.diagramId}/${question.answer.correctRegionId}`);
    }
    expect([...used].sort()).toEqual([
      'u14-map-pair/physical', 'u14-map-pair/political',
      'u14-physical-features/lake', 'u14-physical-features/mountains', 'u14-physical-features/river',
      'u14-political-elements/border', 'u14-political-elements/capital',
      'u14-population-map/a', 'u14-population-map/b', 'u14-population-map/c'
    ]);
  });

  it('hotspot mode: letters only — no region name, note, lesson number or answer-giving caption in the drawing or its ARIA', () => {
    for (const diagram of UNIT14_DIAGRAMS) {
      const markup = render(diagram.id, 'hotspot');
      const texts = visibleText(markup);
      expect(markup).not.toContain('tb-diagram-label');
      expect(markup).not.toContain('tb-diagram-note');
      expect(markup).not.toContain('tb-u14-letter');
      expect(markup).toMatch(/<desc[^>]*>Joonisel on tähtedega märgitud kohad [A-D, ]+\.<\/desc>/);
      expect([...markup.matchAll(/role="button"/g)]).toHaveLength(diagram.regions.length);
      for (const region of diagram.regions) {
        expect(markup).toContain(`data-region-id="${region.id}"`);
        expect(texts).toContain(`Ala ${region.marker}`);
      }
      const words = diagram.id === POPULATION ? [] : diagram.regions.map((region) => region.label);
      // The map pair asks which view is which: no caption may name the kind of map (the titles of the others may).
      const pair = diagram.id === 'u14-map-pair' ? ['füüsiline', 'poliitiline', 'loodus', 'riigid', 'mäed ja veed'] : [];
      const forbidden = [...words, ...pair, 'Lepamaa', 'Kivimaa'];
      for (const text of texts) {
        for (const word of forbidden) expect(text.toLowerCase(), `${diagram.id}: "${text}"`).not.toContain(word.toLowerCase());
      }
    }
  });

  it('population map in hotspot mode keeps its heading and legend (the data to read), but no number on a region', () => {
    const texts = visibleText(render(POPULATION, 'hotspot'));
    expect(texts).toContain('Elanike arv piirkondades');
    for (const item of U14_POPULATION_LEGEND) expect(texts).toContain(item.text);
    // Each figure appears once: in its legend row.
    for (const value of ['4 000', '6 000', '9 000']) expect(texts.filter((text) => text.includes(value))).toHaveLength(1);
  });

  it('lesson mode names every region; reveal adds the letter; notes only outside hotspot mode', () => {
    for (const diagram of UNIT14_DIAGRAMS) {
      const lesson = visibleText(render(diagram.id, 'lesson'));
      const reveal = visibleText(render(diagram.id, 'reveal', { correctRegionId: diagram.regions[0].id, selectedRegionId: diagram.regions[1].id }));
      for (const region of diagram.regions) {
        expect(lesson).toContain(region.label);
        expect(reveal).toContain(`${region.marker} – ${region.label}`);
      }
      for (const note of U14_DIAGRAM_LAYOUTS[diagram.id].notes ?? []) {
        expect(lesson).toContain(note.text);
        expect(visibleText(render(diagram.id, 'hotspot'))).not.toContain(note.text);
      }
    }
    expect(visibleText(render(POPULATION, 'lesson'))).toEqual(expect.arrayContaining(['A', 'B', 'C', '4 000', '9 000', '6 000']));
    const reveal = render('u14-political-elements', 'reveal', { correctRegionId: 'capital', selectedRegionId: 'city' });
    expect(reveal).toMatch(/data-region-id="capital"[^>]*data-correct="true"/);
    expect(reveal).toMatch(/data-region-id="city" data-selected="true"[^>]*data-wrong="true"/);
  });

  it('population figures agree everywhere: registry, legend, lesson table, description and answer keys (A 4 000, B 9 000, C 6 000)', () => {
    const regions = getDiagram(POPULATION)!.regions;
    for (const region of regions) expect(number(region.label)).toBe(EXPECTED[region.id as keyof typeof EXPECTED]);
    for (const item of U14_POPULATION_LEGEND) {
      expect(number(item.text)).toBe(EXPECTED[item.regionId]);
      expect(item.text).toMatch(/^\d \d{3} elanikku$/);
    }
    // Legend rows run from fewest to most residents (light → dark).
    expect(U14_POPULATION_LEGEND.map((item) => EXPECTED[item.regionId])).toEqual([4000, 6000, 9000]);

    const blocks = unit14.lessons.flatMap((lesson) => lesson.sections.flatMap((section) => section.blocks));
    const table = blocks.find((block) => block.id === 'lo-opik-u14-b045');
    expect(table?.type).toBe('table');
    if (table?.type !== 'table') return;
    expect(table.rows.map((row) => [row[0].charAt(0), number(String(row[1]))])).toEqual([['A', 4000], ['B', 9000], ['C', 6000]]);
    const diagramBlock = blocks.find((block) => block.type === 'diagram' && block.diagramId === POPULATION);
    expect(diagramBlock?.type === 'diagram' ? diagramBlock.description : '').toMatch(/A: 4 000.*B: 9 000.*C: 6 000/);

    const key = (id: string) => {
      const answer = unit14.questions.find((question) => question.id === id)!.answer;
      return answer.type === 'diagram_hotspot' ? answer.correctRegionId : '';
    };
    const byValue = Object.entries(EXPECTED).sort((first, second) => first[1] - second[1]).map(([id]) => id);
    expect(key('lo-opik-u14-q098')).toBe(byValue[2]); // kõige rohkem
    expect(key('lo-opik-u14-q099')).toBe(byValue[0]); // kõige vähem
    expect(key('lo-opik-u14-q100')).toBe(byValue[1]); // A < C < B
  });

  it('population tints get darker as the number grows (not by hue alone: each also has its own pattern)', () => {
    const css = readFileSync(path.join(__dirname, '../../../../globals.css'), 'utf8');
    const token = (name: string) => css.match(new RegExp(`--${name}:(#[0-9a-f]{6})`))![1];
    const fill = (id: string) => token(css.match(new RegExp(`\\.tb-u14-pop-${id}\\{fill:var\\(--([a-z-]+)\\)\\}`))![1]);
    const luminance = (hex: string) => {
      const [r, g, b] = [1, 3, 5].map((at) => parseInt(hex.slice(at, at + 2), 16) / 255).map((c) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [a, c, b] = ['a', 'c', 'b'].map((id) => luminance(fill(id)));
    expect(a).toBeGreaterThan(c * 2);
    expect(c).toBeGreaterThan(b * 1.5);
    const source = readFileSync(path.join(__dirname, 'PopulationMapDiagram.tsx'), 'utf8');
    for (const id of ['a', 'b', 'c']) expect(source).toContain(`<pattern id='tb-u14-pattern-${id}'`);
  });

  it('the heading, legend and lesson letters fit inside the picture and below the map', () => {
    const layout = U14_DIAGRAM_LAYOUTS[POPULATION];
    const texts = [
      { text: U14_POPULATION_HEADING.text, label: U14_POPULATION_HEADING.label },
      ...U14_POPULATION_LEGEND.map((item) => ({ text: item.text, label: item.label })),
      ...Object.entries(U14_POPULATION_LETTERS).map(([id, label]) => ({ text: id.toUpperCase(), label }))
    ];
    for (const { text, label } of texts) {
      const extent = labelExtent(label, text);
      expect(extent.left, text).toBeGreaterThanOrEqual(2);
      expect(extent.right, text).toBeLessThanOrEqual(layout.width - 2);
      expect(label.y - label.fontSize, text).toBeGreaterThanOrEqual(0);
      expect(label.y, text).toBeLessThanOrEqual(layout.height - 2);
    }
    // The heading sits above the map frame (y 32–200), the legend below it, rows apart.
    expect(U14_POPULATION_HEADING.label.y).toBeLessThan(32);
    U14_POPULATION_LEGEND.forEach((item, index) => {
      expect(item.swatch.y).toBeGreaterThan(200);
      expect(item.swatch.y + item.swatch.height).toBeLessThanOrEqual(layout.height);
      expect(item.swatch.x + item.swatch.width).toBeLessThan(item.label.x);
      if (index > 0) expect(item.swatch.y).toBeGreaterThanOrEqual(U14_POPULATION_LEGEND[index - 1].swatch.y + U14_POPULATION_LEGEND[index - 1].swatch.height);
    });
  });

  it('the map pair draws the same coastline in both views', () => {
    const source = readFileSync(path.join(__dirname, 'MapPairDiagram.tsx'), 'utf8');
    // One LAND path, used by both panels (land in the left, countries + coast in the right).
    expect([...source.matchAll(/const LAND = /g)]).toHaveLength(1);
    expect([...source.matchAll(/d=\{LAND\}/g)].length).toBeGreaterThanOrEqual(4);
    const markup = render('u14-map-pair', 'lesson');
    const left = markup.slice(markup.indexOf('data-region-id="physical"'), markup.indexOf('data-region-id="political"'));
    const right = markup.slice(markup.indexOf('data-region-id="political"'));
    const land = source.match(/const LAND = '([^']+)'/)![1];
    expect(left).toContain(`d="${land}"`);
    expect(right).toContain(`d="${land}"`);
    expect(left).toContain('tb-u14-mountain');
    expect(left).not.toContain('tb-u14-border');
    expect(right).toContain('tb-u14-border');
    expect(right).not.toContain('tb-u14-mountain');
  });
});
