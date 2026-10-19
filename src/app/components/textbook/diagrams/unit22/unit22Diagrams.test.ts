import { readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { UNIT22_DIAGRAMS } from '@/lib/textbook/diagrams/unit22';
import { unit22 } from '@/content/textbook/loodusopetus-opik/unit22';
import type { DiagramMode } from '@/app/components/textbook/diagrams/DiagramFrame';
import { DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/components';
import { U22_DIAGRAM_FILES, U22_DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/unit22/layouts';
import { U22_DIP_Y, U22_STREET_Y, U22_WATER_Y } from '@/app/components/textbook/diagrams/unit22/RainFloodDiagram';
import { U22_HIGH_GROUND_Y, U22_RAISED_SEA_Y, U22_USUAL_SEA_Y } from '@/app/components/textbook/diagrams/unit22/CoastalFloodDiagram';

// Unit 22 "Loodusõnnetused": the seven pictures rendered in every mode. The
// generic checks (label fit, 44 px tap areas at 360 px, no overlaps) are in
// ../diagramLayout.test.ts; this file proves answer secrecy in hotspot mode,
// that every hotspot question points at a drawn region, and the layout the
// questions depend on (neutral positions, the raised sea above the low shore
// but below the house, water collecting in the dip of the road).

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
  const source = readFileSync(path.join(__dirname, '..', U22_DIAGRAM_FILES[diagramId]), 'utf8');
  return Object.fromEntries([...source.matchAll(/regionId='([a-z0-9-]+)' props=\{props\} hit=\{\{ x: (\d+), y: (\d+), width: (\d+), height: (\d+) \}\}/g)]
    .map((match) => [match[1], { x: Number(match[2]), y: Number(match[3]), width: Number(match[4]), height: Number(match[5]) }]));
}

// Words that would answer a question if drawn in hotspot mode, besides the region labels.
const ANSWER_WORDS = ['vihm', 'sabin', 'üleujut', 'päike', 'torm', 'kahju', 'äravool', 'katus', 'kõrge', 'kott', 'padu', 'tuul', 'tuisk', 'pakane', 'kuum',
  'pilv', 'vesi', 'tee', 'meri', 'rannik', 'hoone', 'kuiv', 'elektri', 'juhe', 'varju', 'joogi', 'lamp', 'raadio', 'telefon', 'hoiatus', 'veepiir'];

describe('Unit 22 diagrams', () => {
  it('registers exactly the seven diagrams with the region IDs the package names, and every hotspot answer is a drawn region', () => {
    expect(UNIT22_DIAGRAMS.map((diagram) => [diagram.id, diagram.regions.map((region) => `${region.marker}:${region.id}`)])).toEqual([
      ['u22-hazard-scenarios', ['A:mild-rain', 'B:flood', 'C:sunny', 'D:storm-damage']],
      ['u22-prepared-home', ['A:drain', 'B:roof', 'C:high-storage', 'D:kit']],
      ['u22-estonia-weather', ['A:downpour', 'B:wind', 'C:blizzard', 'D:frost', 'E:heat']],
      ['u22-rain-flood', ['A:cloud', 'B:runoff', 'C:drain', 'D:flooded-road']],
      ['u22-coastal-flood', ['A:sea', 'B:wind', 'C:low-shore', 'D:shore-house']],
      ['u22-flood-safety', ['A:high-ground', 'B:floodwater', 'C:power-line', 'D:dry-shelter']],
      ['u22-prepared-kit', ['A:water', 'B:flashlight', 'C:radio', 'D:phone', 'E:warning']]
    ]);
    expect(UNIT22_DIAGRAMS.flatMap((diagram) => diagram.regions)).toHaveLength(30);
    for (const diagram of UNIT22_DIAGRAMS) expect(diagram.demo, diagram.id).toBe(false);
    const hotspots = unit22.questions.filter((question) => question.answer.type === 'diagram_hotspot');
    expect(hotspots).toHaveLength(17);
    for (const question of hotspots) {
      if (question.answer.type !== 'diagram_hotspot') continue;
      expect(getDiagram(question.answer.diagramId)?.regions.map((region) => region.id), question.id).toContain(question.answer.correctRegionId);
      expect(question.context, question.id).toEqual({ kind: 'diagram', diagramId: question.answer.diagramId });
      expect(render(question.answer.diagramId, 'hotspot'), question.id).toContain(`data-region-id="${question.answer.correctRegionId}"`);
    }
    // Every picture is shown in a lesson.
    const lessonDiagrams = new Set(unit22.lessons.flatMap((lesson) => lesson.sections.flatMap((section) => section.blocks.flatMap((block) => (block.type === 'diagram' ? [block.diagramId] : [])))));
    expect([...lessonDiagrams].sort()).toEqual(UNIT22_DIAGRAMS.map((diagram) => diagram.id).sort());
  });

  it('hotspot mode: letters only — no region name, note or answer word in the drawing or its ARIA; no answer in data attributes or the title', () => {
    for (const diagram of UNIT22_DIAGRAMS) {
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
      for (const text of texts) expect(text, `${diagram.id}: "${text}"`).toMatch(/^(Ala )?[A-E]$/);
      const forbidden = [...diagram.regions.map((region) => region.label), ...(U22_DIAGRAM_LAYOUTS[diagram.id].notes ?? []).map((note) => note.text), ...ANSWER_WORDS];
      for (const text of texts) for (const word of forbidden) expect(text.toLowerCase(), `${diagram.id}: "${text}"`).not.toContain(word.toLowerCase());
      const attributes = new Set([...markup.matchAll(/ (data-[a-z-]+)=/g)].map((match) => match[1]));
      expect([...attributes].sort()).toEqual(['data-diagram-id', 'data-region-id']);
      // The title never names a region, not even one word of its label (a hotspot question shows it).
      const title = markup.match(/<title[^>]*>([^<]*)<\/title>/)![1].toLowerCase();
      for (const region of diagram.regions) {
        for (const word of region.label.toLowerCase().split(' ').filter((item) => item.length > 4)) expect(title, `${diagram.id}: ${word}`).not.toContain(word);
      }
    }
  });

  it('lesson mode names every region; reveal adds the letter and marks the right and the wrong pick; notes never in hotspot mode', () => {
    for (const diagram of UNIT22_DIAGRAMS) {
      const lesson = render(diagram.id, 'lesson');
      const reveal = render(diagram.id, 'reveal', { correctRegionId: diagram.regions[0].id, selectedRegionId: diagram.regions[1].id });
      const lessonText = lesson.replace(/<tspan[^>]*>/g, ' ').replace(/<\/tspan>/g, '').replace(/\s+/g, ' ');
      const revealText = reveal.replace(/<tspan[^>]*>/g, ' ').replace(/<\/tspan>/g, '').replace(/\s+/g, ' ');
      for (const region of diagram.regions) {
        expect(lessonText, diagram.id).toContain(region.label);
        expect(revealText, diagram.id).toContain(`${region.marker} – ${region.label}`);
      }
      expect(reveal).toMatch(new RegExp(`data-region-id="${diagram.regions[0].id}"[^>]*data-correct="true"`));
      expect(reveal).toMatch(new RegExp(`data-region-id="${diagram.regions[1].id}" data-selected="true"[^>]*data-wrong="true"`));
      for (const note of U22_DIAGRAM_LAYOUTS[diagram.id].notes ?? []) {
        expect(lesson).toContain(note.text);
        expect(render(diagram.id, 'hotspot')).not.toContain(note.text);
      }
    }
  });

  it('puts each region where its neutral position says', () => {
    const centre = (diagramId: string, regionId: string) => { const hit = hits(diagramId)[regionId]; return { x: hit.x + hit.width / 2, y: hit.y + hit.height / 2 }; };
    const leftOf = (diagramId: string, a: string, b: string) => expect(centre(diagramId, a).x, `${diagramId}: ${a} left of ${b}`).toBeLessThan(centre(diagramId, b).x);
    const above = (diagramId: string, a: string, b: string) => expect(centre(diagramId, a).y, `${diagramId}: ${a} above ${b}`).toBeLessThan(centre(diagramId, b).y);
    // The 2 × 2 card pictures.
    for (const [diagramId, [topLeft, topRight, bottomLeft, bottomRight]] of [
      ['u22-hazard-scenarios', ['mild-rain', 'flood', 'sunny', 'storm-damage']],
      ['u22-flood-safety', ['high-ground', 'dry-shelter', 'floodwater', 'power-line']],
      ['u22-rain-flood', ['cloud', 'drain', 'runoff', 'flooded-road']],
      ['u22-coastal-flood', ['wind', 'shore-house', 'sea', 'low-shore']]
    ] as const) {
      leftOf(diagramId, topLeft, topRight);
      leftOf(diagramId, bottomLeft, bottomRight);
      above(diagramId, topLeft, bottomLeft);
      above(diagramId, topRight, bottomRight);
    }
    // Five weather symbols left to right; the supplies three on top, two below.
    const weather = ['downpour', 'wind', 'blizzard', 'frost', 'heat'];
    for (let index = 1; index < weather.length; index++) leftOf('u22-estonia-weather', weather[index - 1], weather[index]);
    for (const [a, b] of [['water', 'flashlight'], ['flashlight', 'radio'], ['phone', 'warning']]) leftOf('u22-prepared-kit', a, b);
    above('u22-prepared-kit', 'water', 'phone');
    above('u22-prepared-kit', 'radio', 'warning');
    // The house: roof on top, drain at the lower left, the bag at the lower right.
    above('u22-prepared-home', 'roof', 'high-storage');
    leftOf('u22-prepared-home', 'drain', 'high-storage');
    leftOf('u22-prepared-home', 'high-storage', 'kit');
  });

  it('coastal flood: the wind blows towards the shore, the raised sea covers the low shore, the house stands above it', () => {
    const source = readFileSync(path.join(__dirname, 'CoastalFloodDiagram.tsx'), 'utf8');
    // Every wind arrow ends to the right of where it starts (from the sea towards the land).
    const arrows = [...source.matchAll(/className='tb-u22-wind-arrow' d='M(\d+) \d+ Q\d+ \d+ (\d+) \d+'/g)];
    expect(arrows).toHaveLength(3);
    for (const arrow of arrows) expect(Number(arrow[2])).toBeGreaterThan(Number(arrow[1]) + 100);
    // Water rises above its usual line; the house's ground is above the raised water.
    expect(U22_RAISED_SEA_Y).toBeLessThan(U22_USUAL_SEA_Y);
    expect(U22_HIGH_GROUND_Y).toBeLessThan(U22_RAISED_SEA_Y);
    const area = hits('u22-coastal-flood');
    expect(area['shore-house'].y + area['shore-house'].height).toBeLessThanOrEqual(U22_HIGH_GROUND_Y + 2);
    expect(area['low-shore'].y).toBeGreaterThan(U22_RAISED_SEA_Y);
    expect(U22_DIAGRAM_LAYOUTS['u22-coastal-flood'].notes?.map((note) => note.text)).toEqual(['tavaline veepiir']);
  });

  it('rain flood: the street dips on the right and the water stands in the dip, above the road and below the street level', () => {
    expect(U22_DIP_Y).toBeGreaterThan(U22_STREET_Y);
    expect(U22_WATER_Y).toBeGreaterThan(U22_STREET_Y);
    expect(U22_WATER_Y).toBeLessThan(U22_DIP_Y);
    const area = hits('u22-rain-flood');
    expect(area['flooded-road'].x).toBeGreaterThan(area.drain.x + area.drain.width - 1);
  });
});
