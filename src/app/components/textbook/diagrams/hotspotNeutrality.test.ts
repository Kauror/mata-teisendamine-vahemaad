import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TEXTBOOK_COURSES } from '@/content/textbook/registry';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams';

// Answer secrecy of every picture used in a hotspot question of every ready
// unit, data-driven: a unit that becomes ready is covered without a new test.
// The per-unit diagram tests (unit12/…, unit14/…) add their own answer words;
// this is the generic floor. The browser smoke spec
// (e2e/textbook-real-units.spec.ts) repeats the same checks on the real page
// for the hotspot questions of one test per unit.

// Pictures whose region labels are data the learner reads off the picture
// itself (the legend of a thematic map), so the label text may appear there.
const LABELS_ARE_LEGEND_DATA = new Set(['u14-population-map']);
// Titles that name the picture's topic, which is also a region's name
// ("Kuuvarjutus" / Kuu). They say what is drawn, never which letter is which,
// so they are accepted as they are; every other title (and every new unit's)
// must not name a region at all.
const TITLE_NAMES_THE_TOPIC = new Set(['u10-lunar-eclipse', 'u11-equator-parallels', 'u11-meridians-estonia']);

const READY_UNITS = TEXTBOOK_COURSES.flatMap((course) => course.units.filter((unit) => unit.status === 'ready'));

function hotspotDiagramsOf(unitId: string) {
  const unit = READY_UNITS.find((item) => item.id === unitId)!;
  return [...new Set(unit.questions.flatMap((question) => (question.answer.type === 'diagram_hotspot' ? [question.answer.diagramId] : [])))];
}

const strip = (markup: string, tag: string) => markup.replace(new RegExp(`<${tag}[^>]*>[\\s\\S]*?</${tag}>`, 'g'), '');
const textOf = (markup: string) => [...markup.matchAll(/>([^<>]+)</g)].map((match) => match[1].trim()).filter(Boolean);

describe('hotspot pictures of every ready unit', () => {
  it('finds the ready units and at least one hotspot picture in each authored real unit', () => {
    for (const id of ['lo-opik-u10', 'lo-opik-u11', 'lo-opik-u12', 'lo-opik-u13', 'lo-opik-u14', 'lo-opik-u15', 'lo-opik-u17', 'lo-opik-u18', 'lo-opik-u19']) {
      expect(READY_UNITS.map((unit) => unit.id)).toContain(id);
      expect(hotspotDiagramsOf(id).length, id).toBeGreaterThan(0);
    }
  });

  it.each(READY_UNITS.map((unit) => unit.id))('%s: letters only in hotspot mode — no label, note or region name in the drawing, its title or its ARIA', (unitId) => {
    for (const diagramId of hotspotDiagramsOf(unitId)) {
      const definition = getDiagram(diagramId)!;
      expect(definition, diagramId).toBeTruthy();
      const markup = renderToStaticMarkup(createElement(DIAGRAM_COMPONENTS[diagramId], { mode: 'hotspot', onSelectRegion: () => undefined }));
      expect(markup, diagramId).not.toContain('tb-diagram-label');
      expect(markup, diagramId).not.toContain('tb-diagram-note');
      expect(markup).toMatch(/<desc[^>]*>Joonisel on tähtedega märgitud kohad [A-Z, ]+\.<\/desc>/);
      expect([...markup.matchAll(/role="button"/g)], diagramId).toHaveLength(definition.regions.length);
      const ariaLabels = [...markup.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]);
      for (const region of definition.regions) {
        expect(markup).toContain(`data-region-id="${region.id}"`);
        expect(ariaLabels).toContain(`Ala ${region.marker}`);
      }
      const title = markup.match(/<title[^>]*>([^<]*)<\/title>/)?.[1] ?? '';
      const drawn = textOf(strip(strip(markup, 'title'), 'desc'));
      for (const region of definition.regions) {
        const label = region.label.toLowerCase();
        // Never a letter next to a name ("A – Kuu", "A: Kuu").
        expect(title, `${diagramId} title pairs a letter with a name`).not.toMatch(new RegExp(`\\b${region.marker}\\s*[–:-]`));
        if (!TITLE_NAMES_THE_TOPIC.has(diagramId)) expect(title.toLowerCase(), `${diagramId} title names "${region.label}"`).not.toContain(label);
        for (const text of ariaLabels) expect(text.toLowerCase(), `${diagramId} ARIA names "${region.label}"`).not.toContain(label);
        if (LABELS_ARE_LEGEND_DATA.has(diagramId)) continue;
        for (const text of drawn) expect(text.toLowerCase(), `${diagramId} draws "${region.label}"`).not.toContain(label);
      }
    }
  });
});
