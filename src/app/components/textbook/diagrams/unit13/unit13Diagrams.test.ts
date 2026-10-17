import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { unit13 } from '@/content/textbook/loodusopetus-opik/unit13';
import { DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/diagramLayout';
import type { DiagramMode } from '@/app/components/textbook/diagrams/DiagramFrame';
import { UNIT13_DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams/unit13';
import {
  AREA_INSET, AREA_PANEL, AREA_ZOOM, MAP_CM, MEASURED_END, MEASURED_MAP_CM, MEASURED_PANEL_BAR, MEASURED_RATIO, MEASURED_START,
  ROUTE_FROM, ROUTE_PATH, ROUTE_TO, SCALE_BAR, SCALE_FORMS_RATIO, kmPerMapCm, measuredKm, ratioText, routeLength, routePoint, verbalText
} from '@/app/components/textbook/diagrams/unit13/geometry';

// Unit 13 "Kaardi mõõtkava": the scale pictures must be right, not just look
// right. Lengths are compared in diagram units (one map centimetre = MAP_CM),
// never in screen centimetres.

function render(id: string, mode: DiagramMode) {
  return renderToStaticMarkup(createElement(UNIT13_DIAGRAM_COMPONENTS[id], { mode, onSelectRegion: () => undefined }));
}

// Text drawn inside the SVG, excluding <title>/<desc> and the hotspot letters.
function drawnText(markup: string) {
  return [...markup.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((match) => match[1]).filter((text) => !/^[A-D]$/.test(text));
}

const inside = (point: { x: number; y: number }, hit: { x: number; y: number; width: number; height: number }) =>
  point.x >= hit.x && point.x <= hit.x + hit.width && point.y >= hit.y && point.y <= hit.y + hit.height;

describe('Unit 13 diagrams', () => {
  it('registers exactly the region IDs the questions use', () => {
    const used = new Map<string, Set<string>>();
    for (const question of unit13.questions) {
      if (question.answer.type !== 'diagram_hotspot') continue;
      const set = used.get(question.answer.diagramId) ?? new Set<string>();
      set.add(question.answer.correctRegionId);
      used.set(question.answer.diagramId, set);
    }
    expect([...used.keys()].sort()).toEqual(['u13-area-detail', 'u13-direct-vs-route', 'u13-measured-distance', 'u13-scale-forms']);
    expect([...used.get('u13-area-detail')!].sort()).toEqual(['large-area', 'neighbourhood']);
    expect([...used.get('u13-scale-forms')!].sort()).toEqual(['bar', 'numeric', 'verbal']);
    expect([...used.get('u13-measured-distance')!].sort()).toEqual(['scale', 'segment']);
    expect([...used.get('u13-direct-vs-route')!].sort()).toEqual(['direct', 'road']);
    for (const [diagramId, regions] of used) {
      const ids = getDiagram(diagramId)!.regions.map((region) => region.id);
      for (const region of regions) expect(ids).toContain(region);
    }
  });

  it('scale forms: the bar, the words and the ratio all say 1 cm = 50 km', () => {
    expect(kmPerMapCm(SCALE_FORMS_RATIO)).toBe(50);
    expect(SCALE_BAR.x1 - SCALE_BAR.x0).toBe(MAP_CM);
    expect(ratioText(SCALE_FORMS_RATIO)).toBe('1 : 5 000 000');
    expect(verbalText(SCALE_FORMS_RATIO)).toBe('1 cm – 50 km');
    const text = drawnText(render('u13-scale-forms', 'hotspot'));
    expect(text).toEqual(['0', '25', '50 km', '1 cm – 50 km', '1 : 5 000 000']);
    // The same forms the lesson table shows.
    const table = JSON.stringify(unit13.lessons[1].sections[1].blocks);
    expect(table).toContain('1 cm – 50 km');
    expect(table).toContain('1 : 5 000 000');
  });

  it('measured distance: the segment is exactly 2 map centimetres, the panel bar 1, and 2 × 30 km = 60 km', () => {
    expect(MEASURED_END.y).toBe(MEASURED_START.y);
    expect(MEASURED_END.x - MEASURED_START.x).toBe(MEASURED_MAP_CM * MAP_CM);
    expect(MEASURED_PANEL_BAR.x1 - MEASURED_PANEL_BAR.x0).toBe(MAP_CM);
    expect((MEASURED_END.x - MEASURED_START.x) / (MEASURED_PANEL_BAR.x1 - MEASURED_PANEL_BAR.x0)).toBe(2);
    expect(kmPerMapCm(MEASURED_RATIO)).toBe(30);
    expect(measuredKm()).toBe(60);
    expect(DIAGRAM_LAYOUTS['u13-measured-distance'].notes?.map((note) => note.text)).toEqual([`${MEASURED_MAP_CM} × ${kmPerMapCm(MEASURED_RATIO)} km = ${measuredKm()} km`]);
    const hotspot = drawnText(render('u13-measured-distance', 'hotspot'));
    expect(hotspot).toEqual(['1 cm', '1 cm', 'kaardil: 2 cm', '1 : 3 000 000', '1 cm – 30 km', '0', '30 km']);
    // The textbook example in the lesson says the same.
    expect(JSON.stringify(unit13.lessons[2].sections[1].blocks)).toContain('2 × 30 km = 60 km');
  });

  it('direct vs route: the same endpoints, and the road is longer than the straight line', () => {
    expect(ROUTE_FROM.y).toBe(ROUTE_TO.y);
    expect(routePoint(0)).toEqual(ROUTE_FROM);
    expect(routePoint(1)).toEqual(ROUTE_TO);
    expect(ROUTE_PATH.startsWith(`M${ROUTE_FROM.x} ${ROUTE_FROM.y} `)).toBe(true);
    expect(ROUTE_PATH.endsWith(` ${ROUTE_TO.x} ${ROUTE_TO.y}`)).toBe(true);
    const direct = Math.hypot(ROUTE_TO.x - ROUTE_FROM.x, ROUTE_TO.y - ROUTE_FROM.y);
    expect(routeLength()).toBeGreaterThan(direct * 1.1);
    // The road stays below the straight line between the endpoints.
    for (let t = 0.05; t < 1; t += 0.05) expect(routePoint(t).y).toBeGreaterThan(ROUTE_FROM.y);
    // Each tap area holds a part of its own line and none of the other one.
    const markup = render('u13-direct-vs-route', 'hotspot');
    expect(drawnText(markup)).toEqual([]);
    const directHit = { x: 120, y: 60, width: 160, height: 60 };
    const roadHit = { x: 125, y: 135, width: 150, height: 78 };
    expect(inside({ x: 200, y: ROUTE_FROM.y }, directHit)).toBe(true);
    expect(inside(routePoint(0.5), roadHit)).toBe(true);
    for (let t = 0; t <= 1; t += 0.01) expect(inside(routePoint(t), directHit)).toBe(false);
    expect(ROUTE_FROM.y < roadHit.y).toBe(true);
  });

  it('area detail: each wider view marks the next view with a box of the same proportions, 8× smaller', () => {
    expect(AREA_INSET.width * AREA_ZOOM).toBe(AREA_PANEL.width);
    expect(AREA_INSET.height * AREA_ZOOM).toBe(AREA_PANEL.height);
    const markup = render('u13-area-detail', 'hotspot');
    const insets = [...markup.matchAll(/class="tb-u13-inset" x="([\d.]+)" y="([\d.]+)"/g)].map((match) => ({ x: Number(match[1]), y: Number(match[2]) }));
    expect(insets).toHaveLength(2);
    insets.forEach((inset, index) => {
      const left = AREA_PANEL.xs[index];
      expect(inset.x).toBeGreaterThan(left);
      expect(inset.x + AREA_INSET.width).toBeLessThan(left + AREA_PANEL.width);
      expect(inset.y).toBeGreaterThan(AREA_PANEL.y);
      expect(inset.y + AREA_INSET.height).toBeLessThan(AREA_PANEL.y + AREA_PANEL.height);
    });
    // No words in the picture at all: the amount of detail is the clue.
    expect(drawnText(markup)).toEqual([]);
  });

  it('hotspot mode never shows a region name; lesson mode shows them all', () => {
    for (const id of Object.keys(UNIT13_DIAGRAM_COMPONENTS)) {
      const definition = getDiagram(id)!;
      const hotspot = render(id, 'hotspot');
      expect(hotspot).not.toContain('tb-diagram-label');
      expect(hotspot).not.toContain('tb-diagram-note');
      expect(hotspot).toContain('Joonisel on tähtedega märgitud kohad');
      const text = drawnText(hotspot).join(' ').toLowerCase();
      for (const region of definition.regions) {
        expect(text, `${id}: ${region.label}`).not.toContain(region.label.toLowerCase());
        // "kaardil: 2 cm" is the authored measurement the spec asks for above the segment.
        for (const word of region.label.split(' ').filter((item) => item.length > 4 && item !== 'kaardil')) expect(text, `${id}: ${word}`).not.toContain(word.toLowerCase());
        expect(region.position.toLowerCase()).not.toContain(region.label.toLowerCase());
      }
      expect((hotspot.match(/role="button"/g) ?? []).length).toBe(definition.regions.length);
      const lesson = render(id, 'lesson');
      for (const region of definition.regions) expect(lesson).toContain(`>${region.label}</text>`);
    }
  });
});
