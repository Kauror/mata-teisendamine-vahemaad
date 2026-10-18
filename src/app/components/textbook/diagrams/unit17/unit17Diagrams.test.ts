import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { UNIT17_DIAGRAMS } from '@/lib/textbook/diagrams/unit17';
import { unit17 } from '@/content/textbook/loodusopetus-opik/unit17';
import type { DiagramMode } from '@/app/components/textbook/diagrams/DiagramFrame';
import { DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams';
import { CONTINENT_PATHS, COUNTRY_PATHS, REGION_COUNTRY } from '@/app/components/textbook/diagrams/unit17/geometry';
import {
  BALTIC_MAP, HIIUMAA, PEIPUS, SAAREMAA, U17_DIAGRAM_LAYOUTS, WATERS_MAP, WORLD_ESTONIA, WORLD_MAP, type MapTransform
} from '@/app/components/textbook/diagrams/unit17/layouts';

// Unit 17 "Eesti geograafiline asend": the hemisphere schematics and the three
// Natural Earth maps rendered in every mode. The generic checks (label fit,
// 44 px tap areas at 360 px, no overlapping tap areas) are in
// ../diagramLayout.test.ts and the generic answer secrecy in
// ../hotspotNeutrality.test.ts; this file adds the unit's own answer words and
// proves the geography: which half is which, where Estonia and its
// neighbours and waters are, and that every marker sits on its own place.

function render(diagramId: string, mode: DiagramMode, extra: Record<string, unknown> = {}) {
  return renderToStaticMarkup(createElement(DIAGRAM_COMPONENTS[diagramId], { mode, onSelectRegion: () => undefined, ...extra }));
}

const stripTitle = (markup: string) => markup.replace(/<title[^>]*>[\s\S]*?<\/title>/g, '');
// Text nodes (drawn or read out, the title excluded) plus every aria-label.
function visibleText(markup: string) {
  const body = stripTitle(markup);
  const texts = [...body.matchAll(/>([^<>]+)</g)].map((match) => match[1].trim()).filter(Boolean);
  const labels = [...body.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]);
  return [...texts, ...labels];
}

type Point = { x: number; y: number };
// Sub-polygons of an "M x y L x y … Z" path.
function polygons(d: string): Point[][] {
  return d.split('M').slice(1).map((part) => [...part.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map((match) => ({ x: Number(match[1]), y: Number(match[2]) })));
}
function insidePolygon(point: Point, polygon: Point[]) {
  let inside = false;
  for (let index = 0, previous = polygon.length - 1; index < polygon.length; previous = index++) {
    const a = polygon[index];
    const b = polygon[previous];
    if ((a.y > point.y) !== (b.y > point.y) && point.x < ((b.x - a.x) * (point.y - a.y)) / (b.y - a.y) + a.x) inside = !inside;
  }
  return inside;
}
const insidePath = (point: Point, d: string) => polygons(d).some((polygon) => insidePolygon(point, polygon));
// A picture point back in the map's source units.
const toSource = (map: MapTransform, point: Point) => ({ x: (point.x - map.tx) / map.s, y: (point.y - map.ty) / map.s });
function bounds(d: string) {
  const points = polygons(d).flat();
  const xs = points.map((point) => point.x);
  const ys = points.map((point) => point.y);
  return { left: Math.min(...xs), right: Math.max(...xs), top: Math.min(...ys), bottom: Math.max(...ys) };
}
const marker = (diagramId: string, regionId: string) => U17_DIAGRAM_LAYOUTS[diagramId].regions[regionId].marker;
// The tap areas as rendered (region ID → rect), in drawing order.
function hitRects(markup: string) {
  return [...markup.matchAll(/data-region-id="([a-z-]+)"[^>]*><rect class="tb-region-hit" x="(\d+)" y="(\d+)" width="(\d+)" height="(\d+)"/g)]
    .map((match) => ({ regionId: match[1], x: Number(match[2]), y: Number(match[3]), width: Number(match[4]), height: Number(match[5]) }));
}

const HEMI = 'u17-hemispheres';
const WORLD = 'u17-world-location';
const BALTIC = 'u17-baltic-region';
const WATERS = 'u17-estonia-waters';

describe('Unit 17 diagrams', () => {
  it('registers exactly the four diagrams with the region IDs the questions use', () => {
    expect(UNIT17_DIAGRAMS.map((diagram) => [diagram.id, diagram.regions.map((region) => `${region.marker}:${region.id}`)])).toEqual([
      [HEMI, ['A:north', 'B:south', 'C:west', 'D:east']],
      [WORLD, ['A:eurasia', 'B:africa', 'C:north-america', 'D:south-america', 'E:australia', 'F:antarctica']],
      [BALTIC, ['A:estonia', 'B:finland', 'C:sweden', 'D:latvia', 'E:russia', 'F:lithuania']],
      [WATERS, ['A:baltic-sea', 'B:gulf-finland', 'C:gulf-riga', 'D:lake-peipus']]
    ]);
    const used = new Set<string>();
    for (const question of unit17.questions) {
      if (question.answer.type !== 'diagram_hotspot') continue;
      expect(getDiagram(question.answer.diagramId)?.regions.map((region) => region.id), question.id).toContain(question.answer.correctRegionId);
      used.add(`${question.answer.diagramId}/${question.answer.correctRegionId}`);
    }
    expect([...used].sort()).toEqual([
      `${BALTIC}/finland`, `${BALTIC}/latvia`, `${BALTIC}/russia`, `${BALTIC}/sweden`,
      `${WATERS}/baltic-sea`, `${WATERS}/gulf-finland`,
      `${HEMI}/east`, `${HEMI}/north`, `${HEMI}/south`, `${HEMI}/west`,
      `${WORLD}/eurasia`
    ]);
    // The optional landmarks are never the answer of a scored question.
    expect(used.has(`${WATERS}/gulf-riga`) || used.has(`${WATERS}/lake-peipus`)).toBe(false);
    // Europe is a world region, not a seventh continent.
    expect(getDiagram(WORLD)!.regions.map((region) => region.label)).not.toContain('Euroopa');
  });

  it('hotspot mode: letters only — no region, land or line name in the drawing or its ARIA, and no title names a region', () => {
    const extra: Record<string, string[]> = {
      [HEMI]: ['põhja', 'lõuna', 'lääne', 'ekvaator', 'meridiaan'],
      [WORLD]: ['Eesti', 'Euroopa', 'Ameerika'],
      [BALTIC]: ['Läänemeri', 'Soome laht'],
      [WATERS]: ['Eesti', 'Soome', 'Läti', 'Venemaa', 'laht', 'järv']
    };
    for (const diagram of UNIT17_DIAGRAMS) {
      const markup = render(diagram.id, 'hotspot');
      expect(markup).not.toContain('tb-diagram-label');
      expect(markup).not.toContain('tb-diagram-note');
      expect(markup).toMatch(/<desc[^>]*>Joonisel on tähtedega märgitud kohad [A-F, ]+\.<\/desc>/);
      expect([...markup.matchAll(/role="button"/g)]).toHaveLength(diagram.regions.length);
      const texts = visibleText(markup);
      for (const region of diagram.regions) {
        expect(markup).toContain(`data-region-id="${region.id}"`);
        expect(texts).toContain(`Ala ${region.marker}`);
        expect(diagram.title.toLowerCase(), `${diagram.id} title`).not.toContain(region.label.toLowerCase());
      }
      const forbidden = [...diagram.regions.map((region) => region.label), ...(U17_DIAGRAM_LAYOUTS[diagram.id].notes ?? []).map((note) => note.text), ...extra[diagram.id]];
      for (const text of texts) {
        for (const word of forbidden) expect(text.toLowerCase(), `${diagram.id}: "${text}"`).not.toContain(word.toLowerCase());
      }
    }
  });

  it('hotspot mode: nothing marks the answer — no tinted half or continent, no yellow Estonia among the countries, no Estonia dot', () => {
    expect(render(HEMI, 'hotspot')).not.toContain('tb-u17-half-estonia');
    expect(render(WORLD, 'hotspot')).not.toContain('tb-u17-land-estonia');
    expect(render(WORLD, 'hotspot')).not.toContain('tb-u17-estonia-dot');
    expect(render(BALTIC, 'hotspot')).not.toContain('tb-u17-land-estonia');
    // Lessons do mark them.
    expect([...render(HEMI, 'lesson').matchAll(/tb-u17-half-estonia/g)]).toHaveLength(2);
    expect(render(WORLD, 'lesson')).toContain('tb-u17-estonia-dot');
    expect(render(WORLD, 'lesson')).toMatch(/data-region-id="eurasia"[\s\S]*tb-u17-land-estonia[\s\S]*data-region-id="antarctica"/);
    expect(render(BALTIC, 'lesson')).toMatch(/data-region-id="estonia"[\s\S]*tb-u17-land-estonia[\s\S]*data-region-id="latvia"/);
    // On the waters map Estonia is not a region, only the reference point: yellow in every mode.
    expect(render(WATERS, 'hotspot')).toContain('tb-u17-land-estonia');
  });

  it('lesson mode names every region; reveal adds the letter; notes only outside hotspot mode', () => {
    for (const diagram of UNIT17_DIAGRAMS) {
      const lesson = visibleText(render(diagram.id, 'lesson'));
      const revealMarkup = render(diagram.id, 'reveal', { correctRegionId: diagram.regions[0].id, selectedRegionId: diagram.regions[1].id });
      const reveal = visibleText(revealMarkup).join(' ');
      for (const region of diagram.regions) {
        expect(lesson).toContain(region.label);
        // A wrapped label is split into lines ("A –" / "põhjapoolkera").
        expect(reveal.replace(/\s+/g, ' ')).toContain(`${region.marker} – ${region.label}`);
      }
      for (const note of U17_DIAGRAM_LAYOUTS[diagram.id].notes ?? []) expect(lesson).toContain(note.text);
      expect(revealMarkup).toMatch(new RegExp(`data-region-id="${diagram.regions[0].id}"[^>]*data-correct="true"`));
      expect(revealMarkup).toMatch(new RegExp(`data-region-id="${diagram.regions[1].id}" data-selected="true"[^>]*data-wrong="true"`));
    }
  });

  it('hemispheres: the EQUATOR (horizontal) splits the left disk into north above south; the PRIME MERIDIAN (vertical) splits the right disk into west left of east', () => {
    const markup = render(HEMI, 'lesson');
    const rects = Object.fromEntries(hitRects(markup).map((rect) => [rect.regionId, rect]));
    // North and south share the left disk's columns, stacked; west and east share the right disk's rows, side by side.
    expect([rects.north.x, rects.north.width]).toEqual([rects.south.x, rects.south.width]);
    expect(rects.north.y + rects.north.height).toBe(rects.south.y);
    expect([rects.west.y, rects.west.height]).toEqual([rects.east.y, rects.east.height]);
    expect(rects.west.x + rects.west.width).toBe(rects.east.x);
    expect(rects.north.x + rects.north.width).toBeLessThan(rects.west.x);
    const lines = [...markup.matchAll(/<line class="tb-u17-dividing-line" x1="([\d.]+)" y1="([\d.]+)" x2="([\d.]+)" y2="([\d.]+)"/g)].map((match) => match.slice(1).map(Number));
    expect(lines).toHaveLength(2);
    const [equator, meridian] = lines;
    expect(equator[1]).toBe(equator[3]);
    expect(equator[1]).toBe(rects.south.y);
    expect(meridian[0]).toBe(meridian[2]);
    expect(meridian[0]).toBe(rects.east.x);
    // The notes name the lines next to their disks: "ekvaator" on the left, "nullmeridiaan" on the right.
    const notes = Object.fromEntries((U17_DIAGRAM_LAYOUTS[HEMI].notes ?? []).map((note) => [note.text, note.label]));
    expect(notes.ekvaator.x).toBeLessThan(rects.west.x);
    expect(notes.nullmeridiaan.x).toBe(meridian[0]);
  });

  it('world map: six continents, Estonia\'s dot in north-western Eurasia in the northern and eastern hemispheres, every marker on its own continent', () => {
    expect(Object.keys(CONTINENT_PATHS).sort()).toEqual(['africa', 'antarctica', 'australia', 'eurasia', 'north-america', 'south-america']);
    // 59° N, 25° E: north of the equator (y < 180), east of the prime meridian (x > 360) in 720×360 units.
    expect(WORLD_ESTONIA.y).toBeLessThan(180);
    expect(WORLD_ESTONIA.x).toBeGreaterThan(360);
    expect(insidePath(WORLD_ESTONIA, CONTINENT_PATHS.eurasia)).toBe(true);
    const eurasia = bounds(CONTINENT_PATHS.eurasia);
    // North-western part of the continent: in its upper half, in Europe's longitudes (west of 60° E).
    expect(WORLD_ESTONIA.y).toBeLessThan((eurasia.top + eurasia.bottom) / 2);
    expect(WORLD_ESTONIA.x).toBeLessThan(2 * (60 + 180));
    for (const region of getDiagram(WORLD)!.regions) {
      const point = toSource(WORLD_MAP, marker(WORLD, region.id));
      expect(Object.keys(CONTINENT_PATHS).filter((id) => insidePath(point, CONTINENT_PATHS[id])), region.id).toEqual([region.id]);
    }
    // Eurasia is drawn first: the small continents' outlines lie on top of its enlarged tap area.
    expect(hitRects(render(WORLD, 'hotspot')).map((rect) => rect.regionId)[0]).toBe('eurasia');
  });

  it('Baltic map: every marker on its own country; Finland north, Sweden west, Latvia south, Russia east of Estonia, Lithuania south of Latvia', () => {
    const centreOf = (regionId: string) => {
      const box = bounds(COUNTRY_PATHS[REGION_COUNTRY[regionId]]);
      return { x: (box.left + box.right) / 2, y: (box.top + box.bottom) / 2 };
    };
    const estonia = centreOf('estonia');
    expect(centreOf('finland').y).toBeLessThan(estonia.y);
    expect(centreOf('sweden').x).toBeLessThan(estonia.x);
    expect(centreOf('latvia').y).toBeGreaterThan(estonia.y);
    expect(centreOf('lithuania').y).toBeGreaterThan(centreOf('latvia').y);
    // Russia reaches far east of Estonia; its border with Estonia is Estonia's eastern edge.
    expect(bounds(COUNTRY_PATHS.Russia).right).toBeGreaterThan(bounds(COUNTRY_PATHS.Estonia).right);
    for (const region of getDiagram(BALTIC)!.regions) {
      const point = toSource(BALTIC_MAP, marker(BALTIC, region.id));
      const hits = Object.keys(COUNTRY_PATHS).filter((name) => insidePath(point, COUNTRY_PATHS[name]));
      expect(hits, region.id).toEqual([REGION_COUNTRY[region.id]]);
    }
    // The markers keep the same compass layout on screen.
    const at = (id: string) => marker(BALTIC, id);
    expect(at('finland').y).toBeLessThan(at('estonia').y);
    expect(at('sweden').x).toBeLessThan(at('estonia').x);
    expect(at('latvia').y).toBeGreaterThan(at('estonia').y);
    expect(at('russia').x).toBeGreaterThan(at('estonia').x);
    expect(at('lithuania').y).toBeGreaterThan(at('latvia').y);
    // Saaremaa and Hiiumaa are drawn inside Estonia's region (tapping an island picks Estonia), west of the mainland.
    const markup = render(BALTIC, 'hotspot');
    const estoniaGroup = markup.slice(markup.indexOf('data-region-id="estonia"'), markup.indexOf('data-region-id="latvia"'));
    expect(estoniaGroup).toContain(SAAREMAA);
    expect(estoniaGroup).toContain(HIIUMAA);
    expect(bounds(SAAREMAA).right).toBeLessThanOrEqual(bounds(COUNTRY_PATHS.Estonia).left);
    expect(bounds(HIIUMAA).bottom).toBeLessThanOrEqual(bounds(SAAREMAA).top);
    // Estonia, Latvia, Lithuania are drawn last, in that order, so each small country's own outline wins over a neighbour's enlarged tap area.
    expect(hitRects(markup).map((rect) => rect.regionId).slice(-3)).toEqual(['estonia', 'latvia', 'lithuania']);
  });

  it('waters map: the Baltic Sea west of Estonia, the Gulf of Finland between Estonia and Finland, the Gulf of Riga south-west, Lake Peipus an inland oval on the eastern border', () => {
    const estonia = bounds(COUNTRY_PATHS.Estonia);
    const finland = COUNTRY_PATHS.Finland;
    const source = (id: string) => toSource(WATERS_MAP, marker(WATERS, id));
    const onLand = (point: Point) => Object.keys(COUNTRY_PATHS).filter((name) => insidePath(point, COUNTRY_PATHS[name]));
    for (const id of ['baltic-sea', 'gulf-finland', 'gulf-riga']) {
      expect(onLand(source(id)), `${id} marker is on open water`).toEqual([]);
      expect(insidePath(source(id), SAAREMAA) || insidePath(source(id), HIIUMAA), id).toBe(false);
    }
    expect(source('baltic-sea').x).toBeLessThan(estonia.left);
    expect(source('baltic-sea').x).toBeLessThan(bounds(SAAREMAA).left);
    // Gulf of Finland: north of Estonia's coast, south of Finland's, within Estonia's longitudes.
    const gulf = source('gulf-finland');
    expect(gulf.y).toBeLessThan(estonia.top);
    expect(gulf.x).toBeGreaterThan(estonia.left);
    expect(gulf.x).toBeLessThan(estonia.right);
    expect(insidePath({ x: gulf.x, y: gulf.y - 20 }, finland)).toBe(true);
    // Gulf of Riga: south of Estonia's northern coast, west of Estonia's middle, above Latvia's coast.
    const riga = source('gulf-riga');
    expect(riga.y).toBeGreaterThan(estonia.top);
    expect(riga.x).toBeLessThan((estonia.left + estonia.right) / 2);
    expect(insidePath({ x: riga.x, y: riga.y + 25 }, COUNTRY_PATHS.Latvia)).toBe(true);
    // Lake Peipus: its marker on the lake, the lake straddling Estonia's eastern border with Russia.
    const lake = source('lake-peipus');
    expect(((lake.x - PEIPUS.cx) / PEIPUS.rx) ** 2 + ((lake.y - PEIPUS.cy) / PEIPUS.ry) ** 2).toBeLessThanOrEqual(1);
    expect(insidePath({ x: PEIPUS.cx - PEIPUS.rx, y: PEIPUS.cy }, COUNTRY_PATHS.Estonia)).toBe(true);
    expect(insidePath({ x: PEIPUS.cx + PEIPUS.rx, y: PEIPUS.cy }, COUNTRY_PATHS.Russia)).toBe(true);
    // The lake looks unlike the sea: its own fill and an outline.
    const css = readFileSync(path.join(__dirname, '../../../../globals.css'), 'utf8');
    const fill = (name: string) => css.match(new RegExp(`\\.${name}\\{fill:var\\(--([a-z-]+)\\)`))![1];
    expect(fill('tb-u17-lake')).not.toBe(fill('tb-u17-sea'));
    expect(css).toMatch(/\.tb-u17-lake\{[^}]*stroke:var\(--tb-dia-sea-line\)/);
  });

  it('the maps import local geometry only (nothing fetched at run time) and the shared continent file is not copied', () => {
    for (const file of ['geometry.ts', 'WorldLocationDiagram.tsx', 'BalticRegionDiagram.tsx', 'EstoniaWatersDiagram.tsx', 'HemispheresDiagram.tsx']) {
      const source = readFileSync(path.join(__dirname, file), 'utf8');
      expect(source, file).not.toMatch(/fetch\(|https?:\/\//);
    }
    const geometry = readFileSync(path.join(__dirname, 'geometry.ts'), 'utf8');
    expect(geometry).toContain("from '@/app/components/textbook/diagrams/data/world_continent_paths.json'");
    expect(geometry).toContain("from '@/app/components/textbook/diagrams/data/u17-baltic-country-paths.json'");
  });
});
