import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { UNIT21_DIAGRAMS } from '@/lib/textbook/diagrams/unit21';
import { unit21 } from '@/content/textbook/loodusopetus-opik/unit21';
import type { DiagramMode } from '@/app/components/textbook/diagrams/DiagramFrame';
import { DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams';
import { U21_DIAGRAM_FILES, U21_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit21/layouts';
import { U21_WORLD_POINTS } from '@/app/components/textbook/diagrams/unit21/WorldLocationsDiagram';

// Unit 21 "Maavärinad": the nine pictures rendered in every mode. The generic
// checks (label fit, 44 px tap areas at 360 px, no overlaps) are in
// ../diagramLayout.test.ts; this file proves answer secrecy in hotspot mode,
// that every hotspot question points at a drawn region, and the geometry the
// science depends on (epicentre straight above the focus, map points where
// the places are).

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

function hits(diagramId: string) {
  const source = readFileSync(path.join(__dirname, '..', U21_DIAGRAM_FILES[diagramId]), 'utf8');
  return Object.fromEntries([...source.matchAll(/regionId='([a-z0-9-]+)' props=\{props\} hit=\{\{ x: (\d+), y: (\d+), width: (\d+), height: (\d+) \}\}/g)]
    .map((match) => [match[1], { x: Number(match[2]), y: Number(match[3]), width: Number(match[4]), height: Number(match[5]) }]));
}

// Words that would answer a question if drawn in hotspot mode, besides the region labels.
const ANSWER_WORDS = ['kolle', 'epitsenter', 'lained', 'murrang', 'jaapan', 'island', 'tšiili', 'eesti', 'avameri', 'rannik', 'põhjus', 'nihe', 'pinge', 'takerd',
  'raputus', 'taandu', 'mühin', 'kõrgem', 'sisemaa', 'rand', 'küki', 'varju', 'hoia', 'aken', 'avatud', 'hoone', 'elektri', 'juhe', 'raadio', 'sein', 'meri'];

describe('Unit 21 diagrams', () => {
  it('registers exactly the nine diagrams with the region IDs the package names, and every region is some hotspot answer', () => {
    expect(UNIT21_DIAGRAMS.map((diagram) => [diagram.id, diagram.regions.map((region) => `${region.marker}:${region.id}`)])).toEqual([
      ['u21-plate-stress', ['A:locked', 'B:stored-stress', 'C:slip']],
      ['u21-focus-waves', ['A:focus', 'B:epicenter', 'C:waves', 'D:fault']],
      ['u21-world-locations', ['A:japan', 'B:iceland', 'C:chile', 'D:estonia']],
      ['u21-tsunami-stages', ['A:seafloor', 'B:open-ocean', 'C:coast']],
      ['u21-tsunami-warnings', ['A:strong-shaking', 'B:water-change', 'C:sea-roar']],
      ['u21-coastal-escape', ['A:high-ground', 'B:inland-route', 'C:beach']],
      ['u21-drop-cover-hold', ['A:drop', 'B:cover', 'C:hold', 'D:window']],
      ['u21-outdoors', ['A:open-area', 'B:building', 'C:power-lines']],
      ['u21-aftershock-safety', ['A:fallen-wire', 'B:damaged-wall', 'C:radio']]
    ]);
    for (const diagram of UNIT21_DIAGRAMS) expect(diagram.demo, diagram.id).toBe(false);
    const hotspots = unit21.questions.filter((question) => question.answer.type === 'diagram_hotspot');
    expect(hotspots).toHaveLength(31);
    const used = new Set<string>();
    for (const question of hotspots) {
      if (question.answer.type !== 'diagram_hotspot') continue;
      expect(getDiagram(question.answer.diagramId)?.regions.map((region) => region.id), question.id).toContain(question.answer.correctRegionId);
      expect(question.context, question.id).toEqual({ kind: 'diagram', diagramId: question.answer.diagramId });
      used.add(`${question.answer.diagramId}/${question.answer.correctRegionId}`);
    }
    expect([...used].sort()).toEqual(UNIT21_DIAGRAMS.flatMap((diagram) => diagram.regions.map((region) => `${diagram.id}/${region.id}`)).sort());
  });

  it('hotspot mode: letters only — no region name, note, caption or answer word in the drawing or its ARIA; no answer in data attributes', () => {
    for (const diagram of UNIT21_DIAGRAMS) {
      const markup = render(diagram.id, 'hotspot');
      expect(markup).not.toContain('tb-diagram-label');
      expect(markup).not.toContain('tb-diagram-note');
      expect(markup).toMatch(/<desc[^>]*>Joonisel on tähtedega märgitud kohad [A-D, ]+\.<\/desc>/);
      expect([...markup.matchAll(/role="button"/g)]).toHaveLength(diagram.regions.length);
      const texts = drawnText(markup);
      for (const region of diagram.regions) {
        expect(markup).toContain(`data-region-id="${region.id}"`);
        expect(texts).toContain(`Ala ${region.marker}`);
      }
      // Only letters are drawn.
      for (const text of texts) expect(text, `${diagram.id}: "${text}"`).toMatch(/^(Ala )?[A-D]$/);
      const forbidden = [...diagram.regions.map((region) => region.label), ...(U21_DIAGRAM_LAYOUTS[diagram.id].notes ?? []).map((note) => note.text), ...ANSWER_WORDS];
      for (const text of texts) for (const word of forbidden) expect(text.toLowerCase(), `${diagram.id}: "${text}"`).not.toContain(word.toLowerCase());
      // The only data attributes: the diagram ID, region IDs (stable, not names) and none of the reveal state.
      const attributes = new Set([...markup.matchAll(/ (data-[a-z-]+)=/g)].map((match) => match[1]));
      expect([...attributes].sort()).toEqual(['data-diagram-id', 'data-region-id']);
      // The title never names a region (a hotspot question shows it).
      const title = markup.match(/<title[^>]*>([^<]*)<\/title>/)![1].toLowerCase();
      for (const region of diagram.regions) expect(title, diagram.id).not.toContain(region.label.toLowerCase());
    }
  });

  it('lesson mode names every region; reveal adds the letter and marks the right and the wrong pick; notes never in hotspot mode', () => {
    for (const diagram of UNIT21_DIAGRAMS) {
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
      for (const note of U21_DIAGRAM_LAYOUTS[diagram.id].notes ?? []) {
        expect(lesson).toContain(note.text);
        expect(render(diagram.id, 'hotspot')).not.toContain(note.text);
      }
    }
  });

  it('focus and epicentre: the focus lies on the fault inside the rock, the epicentre on the surface straight above it', () => {
    const source = readFileSync(path.join(__dirname, 'FocusWavesDiagram.tsx'), 'utf8');
    const focus = source.match(/const FOCUS = \{ x: (\d+), y: (\d+) \}/)!.slice(1).map(Number);
    const surface = Number(source.match(/const SURFACE_Y = (\d+)/)![1]);
    const fault = source.match(/className='tb-u21-fault' d='M(\d+) (\d+) L(\d+) (\d+)'/)!.slice(1).map(Number);
    expect(focus[1]).toBeGreaterThan(surface + 60);
    // On the fault line (within a unit).
    const [x1, y1, x2, y2] = fault;
    const xAtFocus = x1 + ((y1 - focus[1]) / (y1 - y2)) * (x2 - x1);
    expect(Math.abs(xAtFocus - focus[0])).toBeLessThan(1);
    // Epicentre: same x, at the surface.
    expect(source).toMatch(/className='tb-u21-epicenter' cx=\{FOCUS\.x\} cy=\{SURFACE_Y - \d\}/);
    const layout = U21_DIAGRAM_LAYOUTS['u21-focus-waves'].regions;
    expect(layout.epicenter.marker.x).toBe(focus[0]);
    expect(layout.epicenter.marker.y).toBeLessThan(surface);
    expect(layout.focus.marker).toEqual({ x: focus[0], y: focus[1] });
  });

  it('world map: the shared Natural Earth outlines, each point at its place and inside its own tap area, no plate boundary drawn', () => {
    const source = readFileSync(path.join(__dirname, 'WorldLocationsDiagram.tsx'), 'utf8');
    expect(source).toContain("from '@/app/components/textbook/diagrams/data/world_continent_paths.json'");
    expect(source).not.toMatch(/d='M[\d. LZ]{200,}/);
    const markup = render('u21-world-locations', 'lesson');
    expect([...markup.matchAll(/class="tb-u21-continent"/g)].length).toBe(7);
    expect(markup).not.toMatch(/class="[^"]*(plate|boundary)/i);
    // x = 180 + longitude, y = 96 − latitude.
    const places = { japan: [138, 36], iceland: [-19, 65], chile: [-71, -33], estonia: [25, 58.7] } as const;
    const areas = hits('u21-world-locations');
    for (const [id, [longitude, latitude]] of Object.entries(places)) {
      const point = U21_WORLD_POINTS[id as keyof typeof places];
      expect(point).toEqual({ x: 180 + longitude, y: 96 - latitude });
      const area = areas[id];
      expect(point.x >= area.x && point.x <= area.x + area.width && point.y >= area.y && point.y <= area.y + area.height, id).toBe(true);
    }
    // Relative layout as the neutral positions say: Japan right, Chile lower left, Iceland left of Estonia, both at the top.
    const { japan, iceland, chile, estonia } = U21_WORLD_POINTS;
    expect(japan.x).toBeGreaterThan(estonia.x);
    expect(chile.y).toBeGreaterThan(japan.y);
    expect(iceland.x).toBeLessThan(estonia.x);
    expect(Math.max(iceland.y, estonia.y)).toBeLessThan(japan.y);
  });

  it('the safety pictures put each region where its neutral position says (left / centre / right, card order)', () => {
    const centreX = (diagramId: string, regionId: string) => { const hit = hits(diagramId)[regionId]; return hit.x + hit.width / 2; };
    const order = (diagramId: string, ids: string[]) => {
      const xs = ids.map((id) => centreX(diagramId, id));
      expect(xs, diagramId).toEqual([...xs].sort((left, right) => left - right));
    };
    order('u21-tsunami-stages', ['seafloor', 'open-ocean', 'coast']);
    order('u21-tsunami-warnings', ['strong-shaking', 'water-change', 'sea-roar']);
    order('u21-outdoors', ['building', 'open-area', 'power-lines']);
    order('u21-aftershock-safety', ['damaged-wall', 'fallen-wire', 'radio']);
    order('u21-coastal-escape', ['beach', 'inland-route', 'high-ground']);
    // Drop, cover, hold, window in reading order on a 2 × 2 grid.
    const grid = hits('u21-drop-cover-hold');
    expect(grid.drop.y).toBe(grid.cover.y);
    expect(grid.hold.y).toBe(grid.window.y);
    expect(grid.drop.y).toBeLessThan(grid.hold.y);
    expect(grid.drop.x).toBeLessThan(grid.cover.x);
    expect(grid.hold.x).toBeLessThan(grid.window.x);
    // The high ground is above the beach.
    const coast = hits('u21-coastal-escape');
    expect(coast['high-ground'].y + coast['high-ground'].height).toBeLessThan(coast.beach.y);
  });
});
