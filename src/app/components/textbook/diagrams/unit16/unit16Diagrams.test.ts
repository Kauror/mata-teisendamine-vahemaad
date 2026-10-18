import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement, isValidElement, type ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { UNIT16_DIAGRAMS } from '@/lib/textbook/diagrams/unit16';
import { unit16 } from '@/content/textbook/loodusopetus-opik/unit16';
import { DiagramRegion, type DiagramMode } from '@/app/components/textbook/diagrams/DiagramFrame';
import { DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams';
import { MARKER_RADIUS, labelExtent, labelLines, type MarkerLayout } from '@/app/components/textbook/diagrams/diagramLayout';
import world from '@/app/components/textbook/diagrams/data/world_continent_paths.json';
import { U16_DIAGRAM_LAYOUTS, U16_MAP, U16_MAP_SCALE, U16_PACIFIC_TWIN } from '@/app/components/textbook/diagrams/unit16/layouts';
import { U16_BAR } from '@/app/components/textbook/diagrams/unit16/LandWaterDiagram';
import { U16_WATER_FORMS } from '@/app/components/textbook/diagrams/unit16/WaterFormsDiagram';

// Unit 16 "Maailmameri": the four pictures in every mode. The generic checks
// (label fit, 44 px tap areas, no overlaps) are in ../diagramLayout.test.ts;
// this file adds the Pacific's second tap area, answer secrecy, and the
// geography: every ocean marker lies in open water of the right ocean on the
// real coastlines.

function render(diagramId: string, mode: DiagramMode, extra: Record<string, unknown> = {}) {
  return renderToStaticMarkup(createElement(DIAGRAM_COMPONENTS[diagramId], { mode, onSelectRegion: () => undefined, ...extra }));
}

function visibleText(markup: string) {
  const texts = [...markup.matchAll(/>([^<>]+)</g)].map((match) => match[1].trim()).filter(Boolean);
  const labels = [...markup.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]);
  return [...texts, ...labels];
}

// The markup of one region's <g> (up to the next region or the end).
function regionMarkup(markup: string, regionId: string) {
  const start = markup.indexOf(`data-region-id="${regionId}"`);
  const next = markup.indexOf('data-region-id=', start + 1);
  return markup.slice(start, next === -1 ? undefined : next);
}

/* ---- tiny path geometry: M/L/H/V/C/Z, cubic curves flattened ---- */
type Point = [number, number];
function polygons(d: string, scale = 1): Point[][] {
  const out: Point[][] = [];
  const tokens = d.match(/[MLHVCZ]|-?\d*\.?\d+/g) ?? [];
  let current: Point[] = [];
  let at: Point = [0, 0];
  let command = '';
  let index = 0;
  const num = () => Number(tokens[index++]);
  while (index < tokens.length) {
    if (/[MLHVCZ]/.test(tokens[index])) command = tokens[index++];
    if (command === 'M') {
      if (current.length) out.push(current);
      at = [num(), num()];
      current = [at];
      command = 'L';
    } else if (command === 'L') {
      at = [num(), num()];
      current.push(at);
    } else if (command === 'H') {
      at = [num(), at[1]];
      current.push(at);
    } else if (command === 'V') {
      at = [at[0], num()];
      current.push(at);
    } else if (command === 'C') {
      const [c1, c2, end]: Point[] = [[num(), num()], [num(), num()], [num(), num()]];
      for (let step = 1; step <= 12; step++) {
        const t = step / 12;
        const u = 1 - t;
        current.push([
          u * u * u * at[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * end[0],
          u * u * u * at[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * end[1]
        ]);
      }
      at = end;
    } else if (command === 'Z') {
      if (current.length) out.push(current);
      current = [];
    }
  }
  if (current.length) out.push(current);
  return out.map((polygon) => polygon.map(([x, y]) => [x * scale, y * scale] as Point));
}
function insideAny(polys: Point[][], [x, y]: Point) {
  let inside = false;
  for (const polygon of polys) {
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];
      if ((yi > y) !== (yj > y) && x < xi + ((y - yi) * (xj - xi)) / (yj - yi)) inside = !inside;
    }
  }
  return inside;
}

// Map units are degrees: x = longitude + 180, y = 90 − latitude.
const CONTINENTS = Object.fromEntries(Object.entries(world.paths).map(([name, d]) => [name, polygons(d, U16_MAP_SCALE)]));
const ISLANDS = polygons(world.supplementaryPaths['oceania-islands'], U16_MAP_SCALE);
const ALL_LAND = [...Object.values(CONTINENTS).flat(), ...ISLANDS];
const isLand = (point: Point) => insideAny(ALL_LAND, point);
const continentAt = (point: Point) => Object.keys(CONTINENTS).find((name) => insideAny(CONTINENTS[name], point)) ?? (insideAny(ISLANDS, point) ? 'islands' : null);
const lonLat = ({ x, y }: { x: number; y: number }) => ({ lon: x - 180, lat: 90 - y });
// The first continent met walking from a point west (dx = −1) or east (+1) along its parallel, wrapping round the map.
function firstLand(point: { x: number; y: number }, dx: -1 | 1) {
  for (let step = 1; step < U16_MAP.width; step++) {
    const x = (point.x + dx * step + U16_MAP.width) % U16_MAP.width;
    const found = continentAt([x, point.y]);
    if (found && found !== 'islands') return found;
  }
  return null;
}

const OCEANS = U16_DIAGRAM_LAYOUTS['u16-five-oceans'];

describe('Unit 16 diagrams', () => {
  it('registers exactly the four diagrams with the region IDs the questions use, each with a component', () => {
    expect(UNIT16_DIAGRAMS.map((diagram) => [diagram.id, diagram.regions.map((region) => `${region.marker}:${region.id}`)])).toEqual([
      ['u16-land-water', ['A:land', 'B:water']],
      ['u16-five-oceans', ['A:pacific', 'B:atlantic', 'C:indian', 'D:arctic', 'E:southern']],
      ['u16-water-forms', ['A:sea', 'B:strait', 'C:bay']],
      ['u16-baltic-connection', ['A:baltic', 'B:straits', 'C:north-sea', 'D:atlantic']]
    ]);
    for (const diagram of UNIT16_DIAGRAMS) expect(DIAGRAM_COMPONENTS[diagram.id], diagram.id).toBeDefined();
    const used = new Set<string>();
    const referenced = new Set<string>();
    for (const question of unit16.questions) {
      if (question.context?.kind === 'diagram') referenced.add(question.context.diagramId);
      if (question.answer.type !== 'diagram_hotspot') continue;
      expect(getDiagram(question.answer.diagramId)?.regions.map((region) => region.id), question.id).toContain(question.answer.correctRegionId);
      used.add(`${question.answer.diagramId}/${question.answer.correctRegionId}`);
    }
    for (const block of unit16.lessons.flatMap((lesson) => lesson.sections.flatMap((section) => section.blocks))) {
      if (block.type === 'diagram') referenced.add(block.diagramId);
    }
    expect([...referenced].sort()).toEqual(UNIT16_DIAGRAMS.map((diagram) => diagram.id).sort());
    // Every region of every picture is asked for somewhere.
    expect([...used].sort()).toEqual(UNIT16_DIAGRAMS.flatMap((diagram) => diagram.regions.map((region) => `${diagram.id}/${region.id}`)).sort());
  });

  it('hotspot mode: letters only — no name, share, note or caption in the drawing, its title or its ARIA', () => {
    const forbidden = ['ookean', 'meri', 'väin', 'laht', 'maismaa', 'vesi', '%', '29', '71', 'Maa pind', 'pidi', 'Taani', 'Atlandi', 'Vaikne', 'India'];
    for (const diagram of UNIT16_DIAGRAMS) {
      const markup = render(diagram.id, 'hotspot');
      expect(markup).not.toContain('tb-diagram-label');
      expect(markup).not.toContain('tb-diagram-note');
      expect(markup).toMatch(/<desc[^>]*>Joonisel on tähtedega märgitud kohad [A-E, ]+\.<\/desc>/);
      expect([...markup.matchAll(/role="button"/g)]).toHaveLength(diagram.regions.length);
      const title = markup.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? '';
      const texts = visibleText(markup.replace(/<title[^>]*>[^<]*<\/title>/, '').replace(/<desc[^>]*>[^<]*<\/desc>/, ''));
      for (const region of diagram.regions) {
        expect(texts.filter((text) => text === `Ala ${region.marker}`), `${diagram.id} one button per region`).toHaveLength(1);
        expect(title.toLowerCase()).not.toContain(region.label.toLowerCase());
      }
      for (const text of texts) {
        expect(text, `${diagram.id}: "${text}" is a marker or a button name`).toMatch(/^(Ala )?[A-E]$/);
        for (const word of forbidden) expect(text.toLowerCase()).not.toContain(word.toLowerCase());
      }
      // The neutral positions the accessible list reads out never name the answer.
      for (const region of diagram.regions) {
        for (const other of diagram.regions) expect(region.position.toLowerCase(), `${diagram.id}/${region.id}`).not.toContain(other.label.toLowerCase());
      }
    }
  });

  it('the Pacific is one region with two tap areas and two A markers in ONE button; both select `pacific` by touch, mouse and keyboard', () => {
    const markup = render('u16-five-oceans', 'hotspot');
    const pacific = regionMarkup(markup, 'pacific');
    expect([...pacific.matchAll(/class="tb-region-hit"/g)]).toHaveLength(2);
    expect([...pacific.matchAll(/<circle/g)]).toHaveLength(2);
    expect([...pacific.matchAll(/>A</g)]).toHaveLength(2);
    expect(pacific).toMatch(/^data-region-id="pacific"[^>]*role="button"/);
    for (const other of ['atlantic', 'indian', 'arctic', 'southern']) {
      expect([...regionMarkup(markup, other).matchAll(/class="tb-region-hit"/g)], other).toHaveLength(1);
    }
    // Both tap areas sit inside the one element that carries the handlers.
    const onSelectRegion = vi.fn();
    const element = DiagramRegion({
      diagramId: 'u16-five-oceans', regionId: 'pacific', props: { mode: 'hotspot', onSelectRegion },
      hit: { x: 8, y: 58, width: 60, height: 60 }, twin: U16_PACIFIC_TWIN, children: null
    }) as ReactElement<{ onClick: () => void; onKeyDown: (event: { key: string; preventDefault: () => void }) => void; children: unknown[] }>;
    const hits = (element.props.children as unknown[]).filter((child): child is ReactElement<{ className: string; x: number }> => isValidElement(child) && (child.props as { className?: string }).className === 'tb-region-hit');
    expect(hits.map((hit) => hit.props.x)).toEqual([8, U16_PACIFIC_TWIN.hit.x]);
    element.props.onClick();
    element.props.onKeyDown({ key: 'Enter', preventDefault: () => undefined });
    element.props.onKeyDown({ key: ' ', preventDefault: () => undefined });
    expect(onSelectRegion.mock.calls).toEqual([['pacific'], ['pacific'], ['pacific']]);
  });

  it('the Pacific twin is a 44 px tap area at the right edge, holding its marker, overlapping no other region', () => {
    const scale = (360 - 2 * (16 + 16 + 6)) / OCEANS.width;
    const twin = U16_PACIFIC_TWIN;
    expect(Math.min(twin.hit.width, twin.hit.height) * scale).toBeGreaterThanOrEqual(44);
    expect(twin.hit.x + twin.hit.width).toBeLessThanOrEqual(OCEANS.width);
    expect(twin.hit.x).toBeGreaterThan(OCEANS.width * 0.8);
    expect(OCEANS.regions.pacific.marker.x).toBeLessThan(OCEANS.width * 0.2);
    const { marker } = twin;
    expect(marker.x >= twin.hit.x && marker.x <= twin.hit.x + twin.hit.width && marker.y >= twin.hit.y && marker.y <= twin.hit.y + twin.hit.height).toBe(true);
    expect(marker.x + MARKER_RADIUS).toBeLessThanOrEqual(OCEANS.width);
    const source = readFileSync(path.join(__dirname, 'FiveOceansDiagram.tsx'), 'utf8');
    const hits = [...source.matchAll(/regionId='([a-z-]+)' props=\{props\} hit=\{\{ x: (\d+), y: (\d+), width: (\d+), height: (\d+) \}\}/g)]
      .map((match) => ({ id: match[1], x: Number(match[2]), y: Number(match[3]), width: Number(match[4]), height: Number(match[5]) }));
    expect(hits).toHaveLength(5);
    for (const other of hits) {
      const overlap = twin.hit.x < other.x + other.width && other.x < twin.hit.x + twin.hit.width && twin.hit.y < other.y + other.height && other.y < twin.hit.y + twin.hit.height;
      expect(overlap, `twin overlaps ${other.id}`).toBe(false);
    }
    // Its label fits inside the picture (also as "A – Vaikne ookean").
    for (const text of ['Vaikne ookean', 'A – Vaikne ookean']) {
      const extent = labelExtent(twin.label, text);
      expect(extent.left).toBeGreaterThanOrEqual(2);
      expect(extent.right).toBeLessThanOrEqual(OCEANS.width - 2);
    }
  });

  it('every ocean marker lies in open water of the right ocean on the real coastlines', () => {
    const markers: Record<string, MarkerLayout> = { ...Object.fromEntries(Object.entries(OCEANS.regions).map(([id, region]) => [id, region.marker])), 'pacific-twin': U16_PACIFIC_TWIN.marker };
    for (const [id, marker] of Object.entries(markers)) {
      // The centre and a ring around it are water.
      expect(isLand([marker.x, marker.y]), `${id} centre on land`).toBe(false);
      for (let angle = 0; angle < 360; angle += 45) {
        const radians = (angle * Math.PI) / 180;
        expect(isLand([marker.x + 4 * Math.cos(radians), marker.y + 4 * Math.sin(radians)]), `${id} near land`).toBe(false);
      }
    }
    const at = (id: string) => lonLat(markers[id]);
    // Pacific: west of the Americas (left edge), east of Asia/Australia (right edge).
    expect(at('pacific').lon).toBeLessThan(-120);
    expect(firstLand(markers.pacific, 1)).toMatch(/america/);
    expect(at('pacific-twin').lon).toBeGreaterThan(150);
    expect(['eurasia', 'australia']).toContain(firstLand(markers['pacific-twin'], -1));
    expect(Math.abs(at('pacific').lat)).toBeLessThan(30);
    expect(Math.abs(at('pacific-twin').lat)).toBeLessThan(30);
    // Atlantic: Americas to the west, Africa to the east.
    // (8 units south: on the marker's own parallel the first coast west is French
    // Guiana, which this Natural Earth country data files under France, i.e. 'eurasia'.)
    expect(firstLand({ x: markers.atlantic.x, y: markers.atlantic.y + 8 }, -1)).toMatch(/america/);
    expect(firstLand(markers.atlantic, 1)).toBe('africa');
    expect(Math.abs(at('atlantic').lat)).toBeLessThan(30);
    // Indian: Africa to the west, Australia to the east, south of Asia.
    expect(firstLand(markers.indian, -1)).toBe('africa');
    expect(firstLand(markers.indian, 1)).toBe('australia');
    expect(at('indian').lat).toBeLessThan(0);
    expect(at('indian').lat).toBeGreaterThan(-40);
    // Arctic: the far north, north of Europe/Asia.
    expect(at('arctic').lat).toBeGreaterThan(75);
    // Southern: round Antarctica, south of 60° S, with Antarctica the land straight to its south.
    expect(at('southern').lat).toBeLessThan(-60);
    let south = markers.southern.y;
    while (south < U16_MAP.height && !continentAt([markers.southern.x, south])) south++;
    expect(continentAt([markers.southern.x, south])).toBe('antarctica');
  });

  it('every ocean name in lessons is written on water, and the Pacific is named at both edges', () => {
    for (const region of getDiagram('u16-five-oceans')!.regions) {
      const label = OCEANS.regions[region.id].label;
      const lines = labelLines(label, region.label).length;
      const extent = labelExtent(label, region.label);
      const middle: Point = [(extent.left + extent.right) / 2, label.y - label.fontSize / 2 + ((lines - 1) * label.fontSize) / 2];
      expect(isLand(middle), `${region.id} label on land`).toBe(false);
    }
    const lesson = visibleText(render('u16-five-oceans', 'lesson'));
    expect(lesson.filter((text) => text === 'Vaikne')).toHaveLength(2);
    const reveal = render('u16-five-oceans', 'reveal', { correctRegionId: 'pacific', selectedRegionId: 'pacific' });
    expect([...regionMarkup(reveal, 'pacific').matchAll(/A –/g)]).toHaveLength(2);
    // No ocean boundary lines: the ocean is one surface, the only land is the real outlines.
    const source = readFileSync(path.join(__dirname, 'FiveOceansDiagram.tsx'), 'utf8');
    expect(source).not.toMatch(/<line|<polyline|stroke-dasharray/);
    expect(render('u16-five-oceans', 'lesson').match(/<path d="M/g)?.length).toBe(Object.keys(world.paths).length + 1);
  });

  it('land and water: water is the longer part (about 71 %), and no exact share is ever asked', () => {
    const land = U16_BAR.split - U16_BAR.left;
    const water = U16_BAR.right - U16_BAR.split;
    expect(water).toBeGreaterThan(2 * land);
    expect(water / (land + water)).toBeCloseTo(0.71, 2);
    const lesson = visibleText(render('u16-land-water', 'lesson'));
    expect(lesson).toEqual(expect.arrayContaining(['maismaa', 'vesi', 'umbes 29%', 'umbes 71%']));
    // Percentages are supplementary: no stem asks for one and no right answer is one.
    for (const question of unit16.questions) {
      expect(question.stem, question.id).not.toMatch(/%|protsent/);
      const answer = question.answer;
      if (answer.type === 'single_choice') expect(answer.options.find((option) => option.id === answer.correctOptionId)!.text, question.id).not.toMatch(/%/);
      if (answer.type === 'multiple_selection') for (const option of answer.options.filter((item) => answer.correctOptionIds.includes(item.id))) expect(option.text, question.id).not.toMatch(/%/);
    }
  });

  it('water forms: open sea, a strait open at both ends between two lands, and a bay closed at its inner end', () => {
    const sea = polygons(U16_WATER_FORMS.seaLand);
    expect(insideAny(sea, [44, 78])).toBe(false);
    expect(insideAny(sea, [112, 78])).toBe(true);
    const strait = [...polygons(U16_WATER_FORMS.straitLandTop), ...polygons(U16_WATER_FORMS.straitLandBottom)];
    expect(insideAny(strait, [180, 78])).toBe(false); // the channel
    expect(insideAny(strait, [180, 30])).toBe(true); // land above
    expect(insideAny(strait, [180, 130])).toBe(true); // land below
    // Broad water at both ends, joined only through the channel.
    for (const point of [[130, 20], [130, 140], [230, 20], [230, 140]] as Point[]) expect(insideAny(strait, point)).toBe(false);
    const channel = [60, 70, 80, 90].filter((y) => !insideAny(strait, [180, y])).length;
    expect(channel).toBeGreaterThanOrEqual(2);
    const bay = polygons(U16_WATER_FORMS.bayLand);
    expect(insideAny(bay, [298, 96])).toBe(false); // the inlet
    expect(insideAny(bay, [298, 26])).toBe(false); // the open sea it opens to
    expect(insideAny(bay, [298, 140])).toBe(true); // closed at its inner end
    expect(insideAny(bay, [258, 96])).toBe(true);
    expect(insideAny(bay, [340, 96])).toBe(true);
    const layout = U16_DIAGRAM_LAYOUTS['u16-water-forms'];
    expect(layout.regions.sea.marker.x).toBeLessThan(layout.regions.strait.marker.x);
    expect(layout.regions.strait.marker.x).toBeLessThan(layout.regions.bay.marker.x);
  });

  it('Baltic chain: Baltic → Danish straits → North Sea → Atlantic, two-way arrows, never called a current or a map', () => {
    const layout = U16_DIAGRAM_LAYOUTS['u16-baltic-connection'];
    const ys = ['baltic', 'straits', 'north-sea', 'atlantic'].map((id) => layout.regions[id].marker.y);
    expect(ys).toEqual([...ys].sort((a, b) => a - b));
    const markup = render('u16-baltic-connection', 'lesson');
    // Three links, each with an arrowhead at both ends.
    const heads = [...markup.matchAll(/class="tb-u16-link-head" d="([^"]+)"/g)].map((match) => (match[1].match(/M/g) ?? []).length);
    expect(heads).toEqual([2, 2, 2]);
    expect(visibleText(markup)).toEqual(expect.arrayContaining(['Läänemeri', 'Taani väinad', 'Põhjameri', 'Atlandi ookean', 'vesi liigub mõlemat pidi']));
    const definition = getDiagram('u16-baltic-connection')!;
    expect(definition.description).toMatch(/mitte kaart/);
    expect(definition.description).toMatch(/mõlemas suunas/);
    expect(`${definition.description} ${definition.title}`.toLowerCase()).not.toMatch(/hoovus|vool|kilomeet|marsruut/);
  });

  it('lesson mode names every region; reveal adds the letter and marks the right and the wrong choice', () => {
    for (const diagram of UNIT16_DIAGRAMS) {
      const lessonMarkup = render(diagram.id, 'lesson');
      const lesson = visibleText(lessonMarkup).join(' ');
      const reveal = render(diagram.id, 'reveal', { correctRegionId: diagram.regions[0].id, selectedRegionId: diagram.regions[1].id });
      const revealText = visibleText(reveal).join(' ');
      for (const region of diagram.regions) {
        // Wrapped labels are split into lines; compare the words.
        for (const word of region.label.split(' ')) expect(lesson).toContain(word);
        expect(revealText.replace(/\s+/g, ' ')).toContain(`${region.marker} –`);
      }
      expect(reveal).toMatch(new RegExp(`data-region-id="${diagram.regions[0].id}"[^>]*data-correct="true"`));
      expect(reveal).toMatch(new RegExp(`data-region-id="${diagram.regions[1].id}" data-selected="true"[^>]*data-wrong="true"`));
      expect(lessonMarkup).not.toContain('role="button"');
    }
  });
});
