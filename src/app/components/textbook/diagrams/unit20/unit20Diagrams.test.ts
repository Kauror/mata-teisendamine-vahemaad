import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { UNIT20_DIAGRAMS } from '@/lib/textbook/diagrams/unit20';
import { unit20 } from '@/content/textbook/loodusopetus-opik/unit20';
import type { DiagramMode } from '@/app/components/textbook/diagrams/DiagramFrame';
import { DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/components';
import { U20_DIAGRAM_FILES, U20_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit20/layouts';
import { U20_HOT_X, U20_SEAM_X } from '@/app/components/textbook/diagrams/unit20/VolcanoLocationsDiagram';

// Unit 20 "Vulkaanid": the seven pictures rendered in every mode. The generic
// checks (label fit, 44 px tap areas at 360 px, no overlaps) are in
// ../diagramLayout.test.ts; this file proves answer secrecy in hotspot mode,
// that every hotspot question points at a drawn region, and the drawing facts
// the science depends on (magma below the ground, lava on it; the geyser
// throws water, not lava; the location picture's volcanoes on the seam and
// inside a plate).

function render(diagramId: string, mode: DiagramMode, extra: Record<string, unknown> = {}) {
  return renderToStaticMarkup(createElement(DIAGRAM_COMPONENTS[diagramId], { mode, onSelectRegion: () => undefined, ...extra }));
}

const strip = (markup: string, tag: string) => markup.replace(new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`, 'g'), '');

// Text nodes of the drawing (title and description aside), plus every aria-label.
function drawnText(markup: string) {
  const body = strip(strip(markup, 'title'), 'desc');
  const texts = [...body.matchAll(/>([^<>]+)</g)].map((match) => match[1].trim()).filter(Boolean);
  const labels = [...markup.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]);
  return [...texts, ...labels];
}

function source(diagramId: string) {
  return readFileSync(path.join(__dirname, '..', U20_DIAGRAM_FILES[diagramId]), 'utf8');
}

function hits(diagramId: string) {
  return Object.fromEntries([...source(diagramId).matchAll(/regionId='([a-z0-9-]+)' props=\{props\} hit=\{\{ x: (\d+), y: (\d+), width: (\d+), height: (\d+) \}\}/g)]
    .map((match) => [match[1], { x: Number(match[2]), y: Number(match[3]), width: Number(match[4]), height: Number(match[5]) }]));
}

// The markup of one region's <g> (its drawing, hit area and marker or label).
function regionMarkup(markup: string, regionId: string) {
  const start = markup.indexOf(`data-region-id="${regionId}"`);
  expect(start, regionId).toBeGreaterThan(-1);
  const next = markup.indexOf('data-region-id="', start + 1);
  return markup.slice(start, next === -1 ? undefined : next);
}

// Words that would answer a question if drawn in hotspot mode, besides the region labels.
const ANSWER_WORDS = ['magma', 'laava', 'maakoor', 'kraater', 'lõõr', 'kolle', 'tuhk', 'tuha', 'pilv', 'kivim', 'tard', 'värske', 'kiht', 'etapp', 'laam', 'piir',
  'kuum', 'täpp', 'vahevöö', 'purs', 'uinu', 'kustu', 'vaikne', 'geiser', 'allikas', 'põhja', 'vesi', 'aur', 'maapind'];

describe('Unit 20 diagrams', () => {
  it('registers exactly the seven diagrams with the region IDs the package names; every hotspot answer is a drawn region', () => {
    expect(UNIT20_DIAGRAMS.map((diagram) => [diagram.id, diagram.regions.map((region) => `${region.marker}:${region.id}`)])).toEqual([
      ['u20-magma-lava', ['A:underground', 'B:surface', 'C:crust']],
      ['u20-volcano-cutaway', ['A:crater', 'B:conduit', 'C:chamber', 'D:lava-flow', 'E:ash-cloud']],
      ['u20-eruption-products', ['A:ash', 'B:lava', 'C:rocks']],
      ['u20-layers-growth', ['A:fresh', 'B:cooled', 'C:new-layer']],
      ['u20-volcano-locations', ['A:boundary', 'B:hotspot', 'C:quiet-interior']],
      ['u20-volcano-states', ['A:erupting', 'B:dormant', 'C:extinct']],
      ['u20-geysers', ['A:geyser', 'B:spring', 'C:groundwater', 'D:heated-rock']]
    ]);
    for (const diagram of UNIT20_DIAGRAMS) expect(diagram.demo, diagram.id).toBe(false);
    const hotspots = unit20.questions.filter((question) => question.answer.type === 'diagram_hotspot');
    expect(hotspots).toHaveLength(19);
    const used = new Set<string>();
    for (const question of hotspots) {
      if (question.answer.type !== 'diagram_hotspot') continue;
      expect(getDiagram(question.answer.diagramId)?.regions.map((region) => region.id), question.id).toContain(question.answer.correctRegionId);
      expect(question.context, question.id).toEqual({ kind: 'diagram', diagramId: question.answer.diagramId });
      used.add(`${question.answer.diagramId}/${question.answer.correctRegionId}`);
    }
    // Every picture is asked about; the regions no question names are the wrong choices the package lists.
    expect(new Set([...used].map((key) => key.split('/')[0]))).toEqual(new Set(UNIT20_DIAGRAMS.map((diagram) => diagram.id)));
    const unasked = UNIT20_DIAGRAMS.flatMap((diagram) => diagram.regions.map((region) => `${diagram.id}/${region.id}`)).filter((key) => !used.has(key));
    expect(unasked.sort()).toEqual(['u20-geysers/heated-rock', 'u20-layers-growth/fresh', 'u20-layers-growth/new-layer', 'u20-magma-lava/crust', 'u20-volcano-locations/quiet-interior']);
    // Every picture a lesson or question names is registered.
    const lessonDiagrams = unit20.lessons.flatMap((lesson) => lesson.sections.flatMap((section) => section.blocks.flatMap((block) => (block.type === 'diagram' ? [block.diagramId] : []))));
    expect(new Set(lessonDiagrams)).toEqual(new Set(UNIT20_DIAGRAMS.map((diagram) => diagram.id)));
  });

  it('hotspot mode: letters only — no region name, note or answer word in the drawing or its ARIA; no answer in data attributes', () => {
    for (const diagram of UNIT20_DIAGRAMS) {
      const markup = render(diagram.id, 'hotspot');
      expect(markup).not.toContain('tb-diagram-label');
      expect(markup).not.toContain('tb-diagram-note');
      expect(markup).toMatch(/<desc[^>]*>Joonisel on tähtedega märgitud kohad [A-E, ]+\.<\/desc>/);
      expect([...markup.matchAll(/role="button"/g)]).toHaveLength(diagram.regions.length);
      const texts = drawnText(markup);
      for (const region of diagram.regions) {
        expect(markup).toContain(`data-region-id="${region.id}"`);
        expect(texts).toContain(`Ala ${region.marker}`);
      }
      // Only letters are drawn.
      for (const text of texts) expect(text, `${diagram.id}: "${text}"`).toMatch(/^(Ala )?[A-E]$/);
      const forbidden = [...diagram.regions.map((region) => region.label), ...(U20_DIAGRAM_LAYOUTS[diagram.id].notes ?? []).map((note) => note.text), ...ANSWER_WORDS];
      for (const text of texts) for (const word of forbidden) expect(text.toLowerCase(), `${diagram.id}: "${text}"`).not.toContain(word.toLowerCase());
      // The only data attributes: the diagram ID, region IDs (stable, not names) and none of the reveal state.
      const attributes = new Set([...markup.matchAll(/ (data-[a-z-]+)=/g)].map((match) => match[1]));
      expect([...attributes].sort()).toEqual(['data-diagram-id', 'data-region-id']);
      // The title never names a region (a hotspot question shows it), nor a word that answers one.
      const title = markup.match(/<title[^>]*>([^<]*)<\/title>/)![1].toLowerCase();
      for (const region of diagram.regions) expect(title, diagram.id).not.toContain(region.label.toLowerCase());
      for (const word of ['magma', 'laava', 'kraater', 'geiser', 'allikas', 'põhjavesi', 'purskav', 'uinunud', 'kustunud', 'tardunud', 'piir', 'täpp']) expect(title, diagram.id).not.toContain(word);
    }
  });

  it('lesson mode names every region; reveal adds the letter and marks the right and the wrong pick; notes never in hotspot mode', () => {
    for (const diagram of UNIT20_DIAGRAMS) {
      const lesson = render(diagram.id, 'lesson');
      const reveal = render(diagram.id, 'reveal', { correctRegionId: diagram.regions[0].id, selectedRegionId: diagram.regions[1].id });
      const lessonText = lesson.replace(/<tspan[^>]*>/g, ' ').replace(/<\/tspan>/g, '');
      const revealText = reveal.replace(/<tspan[^>]*>/g, ' ').replace(/<\/tspan>/g, '');
      for (const region of diagram.regions) {
        expect(lessonText.replace(/\s+/g, ' '), diagram.id).toContain(region.label);
        expect(revealText.replace(/\s+/g, ' '), diagram.id).toContain(`${region.marker} – ${region.label}`);
      }
      expect(reveal).toMatch(new RegExp(`data-region-id="${diagram.regions[0].id}"[^>]*data-correct="true"`));
      expect(reveal).toMatch(new RegExp(`data-region-id="${diagram.regions[1].id}" data-selected="true"[^>]*data-wrong="true"`));
      // A right pick is only marked right; no other region is marked at all.
      const right = render(diagram.id, 'reveal', { correctRegionId: diagram.regions[0].id, selectedRegionId: diagram.regions[0].id });
      expect([...right.matchAll(/data-correct="true"/g)]).toHaveLength(1);
      expect(right).not.toContain('data-wrong');
      for (const note of U20_DIAGRAM_LAYOUTS[diagram.id].notes ?? []) {
        expect(lesson).toContain(note.text);
        expect(render(diagram.id, 'hotspot')).not.toContain(note.text);
      }
    }
  });

  it('magma and lava: the magma pocket and the crust are under the ground line, the lava runs on the surface', () => {
    const area = hits('u20-magma-lava');
    const ground = Number(source('u20-magma-lava').match(/const GROUND_Y = (\d+)/)![1]);
    expect(area.underground.y).toBeGreaterThan(ground);
    expect(area.crust.y).toBeGreaterThan(ground);
    expect(area.surface.y).toBeLessThan(ground);
    expect(area.surface.y + area.surface.height).toBeGreaterThan(ground);
    // Same colour for both: the place gives the name, not the colour.
    const markup = render('u20-magma-lava', 'lesson');
    expect(regionMarkup(markup, 'underground')).toContain('tb-u20-magma');
    expect(regionMarkup(markup, 'surface')).toContain('tb-u20-lava');
    const css = readFileSync(path.join(process.cwd(), 'src/app/globals.css'), 'utf8');
    expect(css).toMatch(/\.tb-u20-magma,\.tb-u20-lava\{/);
  });

  it('cutaway: ash cloud above the crater, conduit below it inside the cone, the chamber under the ground, the lava flow on the right slope', () => {
    const area = hits('u20-volcano-cutaway');
    const ground = Number(source('u20-volcano-cutaway').match(/const GROUND_Y = (\d+)/)![1]);
    expect(area['ash-cloud'].y + area['ash-cloud'].height).toBeLessThanOrEqual(area.crater.y);
    expect(area.crater.y + area.crater.height).toBeLessThanOrEqual(area.conduit.y);
    expect(area.chamber.y).toBeGreaterThan(ground);
    expect(area['lava-flow'].x).toBeGreaterThan(area.crater.x + area.crater.width);
  });

  it('eruption products: the ash is grey dust (no lava or fire colour), the rocks fly upper right, the lava is low right', () => {
    const markup = render('u20-eruption-products', 'lesson');
    const ash = regionMarkup(markup, 'ash');
    expect(ash).toContain('tb-u20-ash');
    expect(ash).not.toMatch(/tb-u20-(lava|magma)/);
    expect(regionMarkup(markup, 'rocks')).toContain('tb-u20-lump');
    const area = hits('u20-eruption-products');
    expect(area.rocks.y + area.rocks.height).toBeLessThanOrEqual(area.lava.y);
    expect(area.ash.y).toBeLessThan(area.rocks.y);
  });

  it('layer growth: three steps left to right, the cooled step solid, the last one taller with a new hot layer on top', () => {
    const area = hits('u20-layers-growth');
    expect(area.fresh.x).toBeLessThan(area.cooled.x);
    expect(area.cooled.x).toBeLessThan(area['new-layer'].x);
    const markup = render('u20-layers-growth', 'hotspot');
    expect(regionMarkup(markup, 'fresh')).toContain('tb-u20-lava');
    expect(regionMarkup(markup, 'fresh')).not.toContain('tb-u20-solid');
    expect(regionMarkup(markup, 'cooled')).toContain('tb-u20-solid');
    expect(regionMarkup(markup, 'cooled')).not.toContain('tb-u20-lava');
    expect(regionMarkup(markup, 'new-layer')).toContain('tb-u20-solid');
    expect(regionMarkup(markup, 'new-layer')).toContain('tb-u20-lava');
    // The step arrows give the order without words (notes are not drawn in a question).
    expect(markup).toContain('tb-u20-step');
  });

  it('locations: an invented cross-section, one volcano on the plate seam, one inside a plate over a hot blob, a quiet stretch without one', () => {
    const area = hits('u20-volcano-locations');
    const centre = (id: string) => area[id].x + area[id].width / 2;
    expect(centre('boundary')).toBe(U20_SEAM_X);
    expect(centre('hotspot')).toBe(U20_HOT_X);
    // The hot spot is well inside the right plate, away from the seam and the edge.
    expect(U20_HOT_X - U20_SEAM_X).toBeGreaterThan(60);
    expect(360 - U20_HOT_X).toBeGreaterThan(40);
    expect(area['quiet-interior'].x + area['quiet-interior'].width).toBeLessThan(U20_SEAM_X - 60);
    const markup = render('u20-volcano-locations', 'lesson');
    expect(regionMarkup(markup, 'hotspot')).toContain('tb-u20-plume');
    expect(regionMarkup(markup, 'boundary')).not.toContain('tb-u20-plume');
    expect(regionMarkup(markup, 'quiet-interior')).not.toContain('tb-u20-cone');
    // Not a map: no continents or coastlines.
    expect(markup).not.toMatch(/class="[^"]*(continent|coast|ocean)/);
  });

  it('volcano states: only the first card erupts; the last is a worn forested hill; no card names its state in a question', () => {
    const markup = render('u20-volcano-states', 'hotspot');
    expect(regionMarkup(markup, 'erupting')).toContain('tb-u20-lava');
    expect(regionMarkup(markup, 'erupting')).toContain('tb-u20-ash');
    for (const id of ['dormant', 'extinct']) expect(regionMarkup(markup, id), id).not.toMatch(/tb-u20-(lava|ash|magma)/);
    expect(regionMarkup(markup, 'extinct')).toContain('tb-u20-tree');
    expect(regionMarkup(markup, 'extinct')).toContain('tb-u20-lake');
    expect(regionMarkup(markup, 'dormant')).toContain('tb-u20-old-flow');
  });

  it('geysers: water and steam, never lava; the groundwater lies away from the hot rock; the spring is calm', () => {
    const markup = render('u20-geysers', 'lesson');
    expect(markup).not.toMatch(/tb-u20-(lava|magma)/);
    const geyser = regionMarkup(markup, 'geyser');
    expect(geyser).toContain('tb-u20-jet');
    expect(geyser).toContain('tb-u20-steam');
    expect(regionMarkup(markup, 'spring')).not.toContain('tb-u20-jet');
    expect(regionMarkup(markup, 'groundwater')).toContain('tb-u20-cool-water');
    const area = hits('u20-geysers');
    expect(area.groundwater.x + area.groundwater.width).toBeLessThan(area['heated-rock'].x);
    expect(area['heated-rock'].y).toBeGreaterThan(area.groundwater.y);
    expect(area.geyser.x).toBeGreaterThan(area.spring.x + area.spring.width);
  });
});
