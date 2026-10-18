import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import worldPaths from '@/app/components/textbook/diagrams/data/world_continent_paths.json';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { UNIT15_DIAGRAMS } from '@/lib/textbook/diagrams/unit15';
import { unit15 } from '@/content/textbook/loodusopetus-opik/unit15';
import type { DiagramMode } from '@/app/components/textbook/diagrams/DiagramFrame';
import { DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/components';
import { estimateTextWidth, labelExtent } from '@/app/components/textbook/diagrams/diagramLayout';
import { boxFirstBaseline } from '@/app/components/textbook/diagrams/unit15/ContinentWorldPartLinksDiagram';
import { U15_BAR } from '@/app/components/textbook/diagrams/unit15/LandWaterDiagram';
import {
  U15_BOX_WORD_SIZE, U15_DIAGRAM_LAYOUTS, U15_LINK_BOXES, U15_LINK_LEGEND, U15_LINK_PANELS, U15_WORLD_MAP
} from '@/app/components/textbook/diagrams/unit15/layouts';

// Unit 15 "Mandrid ja maailmajaod": the four diagrams rendered in every mode.
// The generic checks (label fit, 44 px tap areas, no overlaps) are in
// ../diagramLayout.test.ts; this file proves answer secrecy in hotspot mode
// and that the maps put every continent and world part where it really is.

function render(diagramId: string, mode: DiagramMode, extra: Record<string, unknown> = {}) {
  return renderToStaticMarkup(createElement(DIAGRAM_COMPONENTS[diagramId], { mode, onSelectRegion: () => undefined, ...extra }));
}

// Text nodes of the markup (what is drawn or read out), plus every aria-label.
function visibleText(markup: string) {
  const texts = [...markup.matchAll(/>([^<>]+)</g)].map((match) => match[1].trim()).filter(Boolean);
  const labels = [...markup.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]);
  return [...texts, ...labels];
}

// Even-odd point-in-shape test on the outline data (M/L/Z polygons, 720 × 360 units).
function polygons(d: string): Array<Array<[number, number]>> {
  return d.split('M').filter((part) => part.trim()).map((part) => {
    const numbers = part.replace(/[LZ]/g, ' ').trim().split(/\s+/).map(Number);
    const points: Array<[number, number]> = [];
    for (let index = 0; index + 1 < numbers.length; index += 2) points.push([numbers[index], numbers[index + 1]]);
    return points;
  });
}
function inside(d: string, x: number, y: number) {
  let crossings = 0;
  for (const polygon of polygons(d)) {
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) crossings += 1;
    }
  }
  return crossings % 2 === 1;
}
const toData = (point: { x: number; y: number }) => [point.x / U15_WORLD_MAP.scale, point.y / U15_WORLD_MAP.scale] as const;
const PATHS = worldPaths.paths as Record<string, string>;
const marker = (diagramId: string, regionId: string) => U15_DIAGRAM_LAYOUTS[diagramId].regions[regionId].marker;

// Every place name the unit teaches; none may be drawn or read out in a hotspot question.
const PLACE_WORDS = ['euraasia', 'euroopa', 'aasia', 'aafrika', 'ameerika', 'austraalia', 'okeaania', 'antarkt', 'maismaa', 'vesi', '29', '71', 'kolmandik'];

describe('Unit 15 diagrams', () => {
  it('registers exactly the four diagrams with the region IDs the questions use', () => {
    expect(UNIT15_DIAGRAMS.map((diagram) => [diagram.id, diagram.regions.map((region) => `${region.marker}:${region.id}`)])).toEqual([
      ['u15-land-water', ['A:land', 'B:water']],
      ['u15-world-continents', ['A:north-america', 'B:south-america', 'C:eurasia', 'D:africa', 'E:australia', 'F:antarctica']],
      ['u15-world-parts', ['A:america', 'B:europe', 'C:asia', 'D:africa', 'E:australia-oceania', 'F:antarctica']],
      ['u15-continent-worldpart-links', ['A:eurasia', 'B:america']]
    ]);
    const used = new Set<string>();
    for (const question of unit15.questions) {
      if (question.context?.kind === 'diagram') expect(getDiagram(question.context.diagramId), question.id).toBeTruthy();
      if (question.answer.type !== 'diagram_hotspot') continue;
      expect(getDiagram(question.answer.diagramId)?.regions.map((region) => region.id), question.id).toContain(question.answer.correctRegionId);
      used.add(`${question.answer.diagramId}/${question.answer.correctRegionId}`);
    }
    // Every region of every diagram is asked somewhere.
    expect([...used].sort()).toEqual(UNIT15_DIAGRAMS.flatMap((diagram) => diagram.regions.map((region) => `${diagram.id}/${region.id}`)).sort());
    // The textbook names: six continents (Antarktis) and six world parts (Antarktika).
    expect(getDiagram('u15-world-continents')!.regions.map((region) => region.label)).toEqual(['Põhja-Ameerika', 'Lõuna-Ameerika', 'Euraasia', 'Aafrika', 'Austraalia', 'Antarktis']);
    expect(getDiagram('u15-world-parts')!.regions.map((region) => region.label)).toEqual(['Ameerika', 'Euroopa', 'Aasia', 'Aafrika', 'Austraalia ja Okeaania', 'Antarktika']);
  });

  it('hotspot mode: letters only — no place name, share, note or box word in the drawing, its title, description or ARIA', () => {
    for (const diagram of UNIT15_DIAGRAMS) {
      const markup = render(diagram.id, 'hotspot');
      expect(markup).not.toContain('tb-diagram-label');
      expect(markup).not.toContain('tb-diagram-note');
      expect(markup).not.toContain('tb-u15-box-text');
      expect(markup).toMatch(/<desc[^>]*>Joonisel on tähtedega märgitud kohad [A-F, ]+\.<\/desc>/);
      expect([...markup.matchAll(/role="button"/g)]).toHaveLength(diagram.regions.length);
      for (const region of diagram.regions) {
        expect(markup).toContain(`data-region-id="${region.id}"`);
        expect(visibleText(markup)).toContain(`Ala ${region.marker}`);
      }
      for (const text of visibleText(markup)) {
        for (const word of PLACE_WORDS) expect(text.toLowerCase(), `${diagram.id}: "${text}"`).not.toContain(word);
      }
      // The only words left are the title, the neutral description, the A–F letters and the scheme's two-word legend.
      const words = visibleText(markup).filter((text) => !/^(Ala )?[A-F]$/.test(text) && !text.startsWith('Joonisel on'));
      expect(words, diagram.id).toEqual([diagram.title, ...(diagram.id === 'u15-continent-worldpart-links' ? ['manner', 'maailmajagu'] : [])]);
    }
  });

  it('lesson mode names every region; reveal adds the letter; the scheme names its boxes outside hotspot mode', () => {
    for (const diagram of UNIT15_DIAGRAMS) {
      const lesson = visibleText(render(diagram.id, 'lesson')).join(' | ');
      const reveal = visibleText(render(diagram.id, 'reveal', { correctRegionId: diagram.regions[0].id, selectedRegionId: diagram.regions[1].id })).join(' ');
      for (const region of diagram.regions) {
        // Long labels wrap onto tspans: compare word by word.
        for (const word of region.label.split(' ')) expect(lesson, `${diagram.id}/${region.id}`).toContain(word);
        expect(reveal, `${diagram.id}/${region.id}`).toContain(`${region.marker} –`);
      }
      for (const note of U15_DIAGRAM_LAYOUTS[diagram.id].notes ?? []) expect(lesson).toContain(note.text);
    }
    const scheme = visibleText(render('u15-continent-worldpart-links', 'lesson'));
    for (const word of ['Euraasia', 'Euroopa', 'Aasia', 'Põhja-', 'Lõuna-', 'Ameerika']) expect(scheme).toContain(word);
    const reveal = render('u15-world-continents', 'reveal', { correctRegionId: 'africa', selectedRegionId: 'eurasia' });
    expect(reveal).toMatch(/data-region-id="africa"[^>]*data-correct="true"/);
    expect(reveal).toMatch(/data-region-id="eurasia" data-selected="true"[^>]*data-wrong="true"/);
  });

  it('draws the six real continent outlines from the one shared data file — Eurasia as one shape, no seventh continent', () => {
    expect(Object.keys(worldPaths.paths).sort()).toEqual(['africa', 'antarctica', 'australia', 'eurasia', 'north-america', 'south-america']);
    expect(Object.keys(worldPaths.supplementaryPaths)).toEqual(['oceania-islands']);
    const markup = render('u15-world-continents', 'lesson');
    for (const [id, d] of Object.entries(PATHS)) {
      const region = markup.slice(markup.indexOf(`data-region-id="${id}"`));
      expect(region.slice(0, region.indexOf('</g>')), id).toContain(`d="${d}"`);
    }
    expect([...markup.matchAll(/class="tb-u15-continent /g)]).toHaveLength(6);
    // The Oceania islands belong to the world-part map only, in the same neutral land colour.
    expect(markup).not.toContain(worldPaths.supplementaryPaths['oceania-islands']);
    const parts = render('u15-world-parts', 'lesson');
    expect(parts).toContain(worldPaths.supplementaryPaths['oceania-islands']);
    expect([...parts.matchAll(/class="tb-u15-neutral-land"/g)]).toHaveLength(7);
    // One local copy of the outlines, imported at build time (never fetched).
    const dataDir = path.join(__dirname, '../data');
    expect(readdirSync(dataDir).filter((file) => file.startsWith('world_continent'))).toEqual(['world_continent_paths.json']);
    for (const file of readdirSync(__dirname).filter((name) => name.endsWith('.tsx') || name === 'worldMap.ts')) {
      expect(readFileSync(path.join(__dirname, file), 'utf8'), file).not.toMatch(/fetch\(|https?:\/\//);
    }
  });

  it('the map is the right way up: north at the top, Antarctica at the bottom, America west and Australia south-east', () => {
    const bounds = (d: string) => {
      const points = polygons(d).flat();
      return { minX: Math.min(...points.map((p) => p[0])), maxX: Math.max(...points.map((p) => p[0])), minY: Math.min(...points.map((p) => p[1])), maxY: Math.max(...points.map((p) => p[1])) };
    };
    const box = Object.fromEntries(Object.entries(PATHS).map(([id, d]) => [id, bounds(d)]));
    expect(box.antarctica.minY).toBeGreaterThan(300);
    for (const id of ['eurasia', 'north-america', 'africa', 'south-america', 'australia']) expect(box[id].maxY, id).toBeLessThan(box.antarctica.minY);
    expect(box['north-america'].maxY).toBeLessThan(box['south-america'].maxY);
    expect(box['south-america'].maxX).toBeLessThan(box.africa.minX);
    expect(box.australia.minX).toBeGreaterThan(box.africa.maxX);
    expect(box.australia.minY).toBeGreaterThan(180); // south of the equator
    expect(box.eurasia.minY).toBeLessThan(box.africa.minY);
  });

  it('every continent letter sits on that continent; Europe and Asia sit on the one Eurasian landmass, Europe to the west', () => {
    for (const region of getDiagram('u15-world-continents')!.regions) {
      const [x, y] = toData(marker('u15-world-continents', region.id));
      expect(inside(PATHS[region.id], x, y), region.id).toBe(true);
      for (const other of Object.keys(PATHS).filter((id) => id !== region.id)) expect(inside(PATHS[other], x, y), `${region.id} on ${other}`).toBe(false);
    }
    const on = (regionId: string, continent: string) => inside(PATHS[continent], ...toData(marker('u15-world-parts', regionId)));
    expect(on('europe', 'eurasia')).toBe(true);
    expect(on('asia', 'eurasia')).toBe(true);
    expect(marker('u15-world-parts', 'europe').x).toBeLessThan(marker('u15-world-parts', 'asia').x);
    expect(on('africa', 'africa')).toBe(true);
    expect(on('australia-oceania', 'australia')).toBe(true);
    expect(on('antarctica', 'antarctica')).toBe(true);
    // America's letter lies between the two American continents, with a pointer to each.
    const america = marker('u15-world-parts', 'america');
    const [, ay] = toData(america);
    expect(ay).toBeGreaterThan(worldPathsCentre('north-america').y);
    expect(ay).toBeLessThan(worldPathsCentre('south-america').y);
    const parts = render('u15-world-parts', 'hotspot');
    expect(parts).toContain('class="tb-u15-pointer"');
  });

  it('the world-part map draws no line between Europe and Asia and paints no world part as a shape', () => {
    const markup = render('u15-world-parts', 'lesson');
    const paths = [...markup.matchAll(/<path class="([^"]+)"/g)].map((match) => match[1]);
    expect(paths.filter((name) => name !== 'tb-u15-neutral-land')).toEqual(['tb-u15-pointer']);
    expect(markup).not.toContain('tb-u15-continent');
  });

  it('land and water bar: 29 of 100 cells are land, so the land part is the smaller one on the left', () => {
    expect(U15_BAR.cells).toBe(100);
    expect(U15_BAR.landCells).toBe(29);
    const markup = render('u15-land-water', 'lesson');
    const width = (className: string) => Number(markup.match(new RegExp(`class="${className}"[^>]*width="([\\d.]+)"`))![1]);
    expect(width('tb-u15-bar-land') / U15_BAR.width).toBeCloseTo(0.29, 5);
    expect(width('tb-u15-bar-water') / U15_BAR.width).toBeCloseTo(0.71, 5);
  });

  it('the scheme: one continent box to two world-part boxes on the left, two to one on the right; words fit their boxes', () => {
    const kinds = (id: string) => U15_LINK_BOXES[id].map((box) => box.kind);
    expect(kinds('eurasia')).toEqual(['continent', 'part', 'part']);
    expect(kinds('america')).toEqual(['continent', 'continent', 'part']);
    for (const [id, boxes] of Object.entries(U15_LINK_BOXES)) {
      const panel = U15_LINK_PANELS[id];
      for (const box of boxes) {
        expect(box.x >= panel.x && box.x + box.width <= panel.x + panel.width && box.y >= panel.y && box.y + box.height <= panel.y + panel.height, `${id} box in its panel`).toBe(true);
        for (const word of box.words) expect(estimateTextWidth(word, U15_BOX_WORD_SIZE), word).toBeLessThanOrEqual(box.width - 8);
        const first = boxFirstBaseline(box);
        expect(first - U15_BOX_WORD_SIZE).toBeGreaterThanOrEqual(box.y);
        expect(first + (box.words.length - 1) * U15_BOX_WORD_SIZE * 1.15).toBeLessThanOrEqual(box.y + box.height);
      }
    }
    const layout = U15_DIAGRAM_LAYOUTS['u15-continent-worldpart-links'];
    for (const item of U15_LINK_LEGEND) {
      const extent = labelExtent(item.label, item.text);
      expect(extent.right).toBeLessThanOrEqual(layout.width - 2);
      expect(item.swatch.y + item.swatch.height).toBeLessThan(U15_LINK_PANELS.eurasia.y);
    }
  });
});

function worldPathsCentre(id: string) {
  const points = polygons(PATHS[id]).flat();
  const ys = points.map((point) => point[1]);
  return { y: (Math.min(...ys) + Math.max(...ys)) / 2 };
}
