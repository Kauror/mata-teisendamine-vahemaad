import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { UNIT19_DIAGRAMS } from '@/lib/textbook/diagrams/unit19';
import { unit19 } from '@/content/textbook/loodusopetus-opik/unit19';
import type { DiagramMode } from '@/app/components/textbook/diagrams/DiagramFrame';
import { DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams';
import { U19_CRUST_KM, U19_DIAGRAM_LAYOUTS, U19_EARTH, U19_EARTH_ROWS } from '@/app/components/textbook/diagrams/unit19/layouts';

// Unit 19 "Maakera siseehitus": the six pictures rendered in every mode. The
// generic checks (label fit, 44 px tap areas on a 360 px phone, no overlaps)
// are in ../diagramLayout.test.ts and ../hotspotNeutrality.test.ts; this file
// proves answer secrecy with the unit's own answer words, the science the
// pictures must not get wrong, and that the optional p 73 picture stays out of
// every question.

function render(diagramId: string, mode: DiagramMode, extra: Record<string, unknown> = {}) {
  return renderToStaticMarkup(createElement(DIAGRAM_COMPONENTS[diagramId], { mode, onSelectRegion: () => undefined, ...extra }));
}

// Text nodes of the markup (what is drawn or read out), plus every aria-label.
function visibleText(markup: string) {
  const texts = [...markup.matchAll(/>([^<>]+)</g)].map((match) => match[1].trim()).filter(Boolean);
  const labels = [...markup.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]);
  return [...texts, ...labels];
}

const OPTIONAL = 'u19-continental-drift';
const blocks = unit19.lessons.flatMap((lesson) => lesson.sections.flatMap((section) => section.blocks.map((block) => ({ lesson, block }))));

describe('Unit 19 diagrams', () => {
  it('registers exactly the six diagrams with the region IDs the questions use', () => {
    expect(UNIT19_DIAGRAMS.map((diagram) => [diagram.id, diagram.regions.map((region) => `${region.marker}:${region.id}`)])).toEqual([
      ['u19-earth-layers', ['A:crust', 'B:mantle', 'C:outer-core', 'D:inner-core']],
      ['u19-crust-thickness', ['A:oceanic', 'B:continental', 'C:mountain']],
      ['u19-evidence', ['A:borehole', 'B:waves', 'C:volcano']],
      ['u19-plate-motion', ['A:left-plate', 'B:right-plate', 'C:boundary', 'D:mantle']],
      ['u19-plate-world', ['A:pacific', 'B:north-america', 'C:south-america', 'D:eurasia', 'E:africa', 'F:australia', 'G:antarctica']],
      [OPTIONAL, ['A:pangaea', 'B:today']]
    ]);
    for (const diagram of UNIT19_DIAGRAMS) expect(diagram.demo, diagram.id).toBe(false);
    const used = new Set<string>();
    for (const question of unit19.questions) {
      if (question.answer.type !== 'diagram_hotspot') continue;
      expect(getDiagram(question.answer.diagramId)?.regions.map((region) => region.id), question.id).toContain(question.answer.correctRegionId);
      used.add(`${question.answer.diagramId}/${question.answer.correctRegionId}`);
    }
    // Every region of the five required pictures is asked somewhere; the optional one never.
    const expected = UNIT19_DIAGRAMS.filter((diagram) => diagram.id !== OPTIONAL).flatMap((diagram) => diagram.regions.map((region) => `${diagram.id}/${region.id}`));
    expect([...used].sort()).toEqual(expected.sort());
  });

  it('the optional p 73 picture (Pangaea) appears only in the optional lesson and in no question or context', () => {
    const uses = blocks.filter(({ block }) => block.type === 'diagram' && block.diagramId === OPTIONAL);
    expect(uses.length).toBeGreaterThan(0);
    for (const { lesson } of uses) expect(lesson.required, lesson.id).toBe(false);
    for (const question of unit19.questions) expect(JSON.stringify(question), question.id).not.toContain(OPTIONAL);
    // Every other picture is shown in a required lesson.
    for (const diagram of UNIT19_DIAGRAMS.filter((item) => item.id !== OPTIONAL)) {
      expect(blocks.some(({ lesson, block }) => lesson.required && block.type === 'diagram' && block.diagramId === diagram.id), diagram.id).toBe(true);
    }
  });

  it('hotspot mode: letters only — no region name, note, km figure or answer word in the drawing or its ARIA', () => {
    for (const diagram of UNIT19_DIAGRAMS) {
      const markup = render(diagram.id, 'hotspot');
      const texts = visibleText(markup);
      expect(markup).not.toContain('tb-diagram-label');
      expect(markup).not.toContain('tb-diagram-note');
      expect(markup).toMatch(/<desc[^>]*>Joonisel on tähtedega märgitud kohad [A-G, ]+\.<\/desc>/);
      expect([...markup.matchAll(/role="button"/g)]).toHaveLength(diagram.regions.length);
      for (const region of diagram.regions) {
        expect(markup).toContain(`data-region-id="${region.id}"`);
        expect(texts).toContain(`Ala ${region.marker}`);
      }
      // Apart from the title and the neutral description, the only drawn text is the marker letters.
      const drawn = visibleText(markup.replace(/<title[^>]*>[\s\S]*?<\/title>/, '').replace(/<desc[^>]*>[\s\S]*?<\/desc>/, ''));
      for (const text of drawn) expect(text, `${diagram.id}: "${text}"`).toMatch(/^(Ala )?[A-G]$/);
      const words = [
        ...diagram.regions.map((region) => region.label),
        ...(U19_DIAGRAM_LAYOUTS[diagram.id].notes ?? []).map((note) => note.text),
        'maakoor', 'vahevöö', 'tuum', 'laam', 'ookean', 'mandri', 'mäestik', 'puur', 'vulkaan', 'lain', 'km', 'Pangaea'
      ];
      const title = markup.match(/<title[^>]*>([^<]*)<\/title>/)![1].toLowerCase();
      for (const region of diagram.regions) expect(title, diagram.id).not.toContain(region.label.toLowerCase());
      const ariaAndData = [...markup.matchAll(/(?:aria-[a-z]+|data-(?!region-id|diagram-id|selected|correct|wrong)[a-z-]+)="([^"]*)"/g)].map((match) => match[1]);
      for (const text of [...drawn, ...ariaAndData]) {
        for (const word of words) expect(text.toLowerCase(), `${diagram.id}: "${text}"`).not.toContain(word.toLowerCase());
      }
    }
  });

  it('lesson mode names every region and shows the notes; reveal adds the letter and marks the right and the chosen region', () => {
    for (const diagram of UNIT19_DIAGRAMS) {
      const lesson = visibleText(render(diagram.id, 'lesson')).join(' | ');
      const reveal = visibleText(render(diagram.id, 'reveal', { correctRegionId: diagram.regions[0].id, selectedRegionId: diagram.regions[1].id })).join(' | ');
      // Labels may wrap onto lines (one <tspan> per line): compare word by word.
      for (const region of diagram.regions) {
        for (const word of region.label.split(' ')) expect(lesson, `${diagram.id}/${region.id}`).toContain(word);
        expect(reveal, `${diagram.id}/${region.id}`).toContain(`${region.marker} –`);
      }
      for (const note of U19_DIAGRAM_LAYOUTS[diagram.id].notes ?? []) expect(lesson).toContain(note.text);
    }
    const reveal = render('u19-earth-layers', 'reveal', { correctRegionId: 'outer-core', selectedRegionId: 'mantle' });
    expect(reveal).toMatch(/data-region-id="outer-core"[^>]*data-correct="true"/);
    expect(reveal).toMatch(/data-region-id="mantle" data-selected="true"[^>]*data-wrong="true"/);
  });

  it('Earth\'s layers: crust → mantle → outer core → inner core from the outside in, the mantle thickest, rows in the same order', () => {
    const { crust, mantle, outerCore, innerCore } = U19_EARTH;
    expect(crust).toBeGreaterThan(mantle);
    expect(mantle).toBeGreaterThan(outerCore);
    expect(outerCore).toBeGreaterThan(innerCore);
    // Real thicknesses ≈ 2 900 km mantle, 2 200 km outer core, 1 200 km inner-core radius.
    expect(mantle - outerCore).toBeGreaterThan(outerCore - innerCore);
    expect(outerCore - innerCore).toBeGreaterThan(innerCore);
    // The crust is exaggerated but still the thinnest layer.
    expect(crust - mantle).toBeLessThan(innerCore);
    const markup = render('u19-earth-layers', 'lesson');
    const order = ['crust', 'mantle', 'outer-core', 'inner-core'];
    const radii = order.map((id) => Number(markup.match(new RegExp(`data-region-id="${id}"[\\s\\S]*?<circle class="tb-u19-layer[^"]*"[^>]* r="([\\d.]+)"`))![1]));
    expect(radii).toEqual([crust, mantle, outerCore, innerCore]);
    // Rows (tap areas) sit right of the disk, top to bottom A–D.
    const layout = U19_DIAGRAM_LAYOUTS['u19-earth-layers'];
    expect(U19_EARTH_ROWS.x).toBeGreaterThan(U19_EARTH.cx + crust);
    const markerYs = order.map((id) => layout.regions[id].marker.y);
    expect([...markerYs].sort((first, second) => first - second)).toEqual(markerYs);
  });

  it('crust thickness: bar lengths are proportional to 7 : 40 : 80 km, the figures the lesson and the notes use', () => {
    const markup = render('u19-crust-thickness', 'lesson');
    const height = (id: string) => Number(markup.match(new RegExp(`tb-u19-bar-${id}"[^>]* height="([\\d.]+)"`))![1]);
    const [oceanic, continental, mountain] = (['oceanic', 'continental', 'mountain'] as const).map(height);
    expect(U19_CRUST_KM).toEqual({ oceanic: 7, continental: 40, mountain: 80 });
    expect(oceanic / 7).toBeCloseTo(continental / 40, 6);
    expect(mountain / 80).toBeCloseTo(continental / 40, 6);
    const notes = (U19_DIAGRAM_LAYOUTS['u19-crust-thickness'].notes ?? []).map((note) => note.text).join(' | ');
    expect(notes).toMatch(/umbes 7 km.*umbes 40 km.*kuni 80 km/);
    const text = JSON.stringify(blocks.filter(({ lesson }) => lesson.required).map(({ block }) => block));
    for (const figure of ['7 km', '40 km', '80 km']) expect(text).toContain(figure);
  });

  it('plate motion: plates are crust plus rigid upper mantle, the mantle is drawn solid (not magma), one example boundary', () => {
    const markup = render('u19-plate-motion', 'lesson');
    for (const id of ['left-plate', 'right-plate']) {
      const plate = markup.slice(markup.indexOf(`data-region-id="${id}"`));
      expect(plate.slice(0, plate.indexOf('</g>'))).toMatch(/tb-u19-lithosphere[\s\S]*tb-u19-plate-crust/);
    }
    expect(markup).toContain('kuum, valdavalt tahke kivim');
    expect(getDiagram('u19-plate-motion')!.description).toMatch(/valdavalt tahke/);
    expect(getDiagram('u19-plate-motion')!.description).toMatch(/põrkuvad või libisevad/);
  });

  it('world map: shared Natural Earth outlines (no copy here), approximate dots only — no boundaries, one Pacific region', () => {
    const source = readFileSync(path.join(__dirname, 'PlateWorldDiagram.tsx'), 'utf8');
    expect(source).toContain("from '@/app/components/textbook/diagrams/data/world_continent_paths.json'");
    expect(readFileSync(path.join(__dirname, 'ContinentalDriftDiagram.tsx'), 'utf8')).toContain("from '@/app/components/textbook/diagrams/data/world_continent_paths.json'");
    expect(readdirSync(__dirname).filter((file) => file.endsWith('.json'))).toEqual([]);
    expect(source).not.toMatch(/className='[^']*(boundary|border|rift)/);
    const markup = render('u19-plate-world', 'hotspot');
    expect([...markup.matchAll(/tb-u19-plate-dot/g)]).toHaveLength(7);
    expect([...markup.matchAll(/data-region-id="pacific"/g)]).toHaveLength(1);
    expect(getDiagram('u19-plate-world')!.description).toMatch(/ei kattu rannajoontega/);
    const notes = (U19_DIAGRAM_LAYOUTS['u19-plate-world'].notes ?? []).map((note) => note.text).join(' ');
    expect(notes).toMatch(/ligikaudset/);
    expect(notes).toMatch(/piire kaardil ei ole/);
  });
});
