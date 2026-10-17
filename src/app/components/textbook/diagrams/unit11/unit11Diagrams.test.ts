import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { unit11 } from '@/content/textbook/loodusopetus-opik/unit11';
import { diagramRegionIds, getDiagram } from '@/lib/textbook/diagramRegistry';
import { UNIT11_DIAGRAMS } from '@/lib/textbook/diagrams/unit11';
import { DIAGRAM_LAYOUTS } from '@/app/components/textbook/diagrams/diagramLayout';
import { meridianPoints, parallelPoints, project, type GlobePoint } from '@/app/components/textbook/diagrams/unit11/globeProjection';
import {
  AXIS_GLOBE, ESTONIA, MERIDIANS_GLOBE, OTHER_MERIDIAN, PARALLEL_LATITUDE, PARALLELS_GLOBE, PLAIN_MERIDIAN, UNIT11_COMPONENT_FILES, axisPoint
} from '@/app/components/textbook/diagrams/unit11/layout';

// Unit 11 "Gloobus": the content names only registered diagrams and regions,
// the schematics are geometrically honest (orthographic projection), every
// marker sits on what it marks, and no component draws text of its own.
// (Hotspot rendering itself is checked in e2e/textbook-unit11.spec.ts.)

const IDS = ['u11-globe-types', 'u11-axis-poles', 'u11-equator-parallels', 'u11-meridians-estonia'];
const marker = (diagramId: string, regionId: string) => DIAGRAM_LAYOUTS[diagramId].regions[regionId].marker;

// Shortest distance from p to a polyline.
function distanceToLine(points: GlobePoint[], p: { x: number; y: number }) {
  let best = Infinity;
  for (let i = 1; i < points.length; i += 1) {
    const [a, b] = [points[i - 1], points[i]];
    const length = (b.x - a.x) ** 2 + (b.y - a.y) ** 2;
    const t = length === 0 ? 0 : Math.max(0, Math.min(1, ((p.x - a.x) * (b.x - a.x) + (p.y - a.y) * (b.y - a.y)) / length));
    best = Math.min(best, Math.hypot(p.x - (a.x + t * (b.x - a.x)), p.y - (a.y + t * (b.y - a.y))));
  }
  return best;
}

// The line's y at x (linear between samples); null where the line does not reach.
function lineYAt(points: GlobePoint[], x: number): number | null {
  for (let i = 1; i < points.length; i += 1) {
    const [a, b] = [points[i - 1], points[i]];
    if ((a.x - x) * (b.x - x) <= 0 && a.x !== b.x) return a.y + ((x - a.x) / (b.x - a.x)) * (b.y - a.y);
  }
  return null;
}

describe('unit 11 diagrams', () => {
  it('registers exactly the four diagrams the content uses, with the region IDs its questions need', () => {
    expect(UNIT11_DIAGRAMS.map((diagram) => diagram.id)).toEqual(IDS);
    const used = new Set<string>();
    for (const lesson of unit11.lessons) {
      for (const block of lesson.sections.flatMap((section) => section.blocks)) {
        if (block.type === 'diagram') used.add(block.diagramId);
      }
    }
    const hotspots = unit11.questions.flatMap((question) => question.answer.type === 'diagram_hotspot' ? [question.answer] : []);
    expect(hotspots).toHaveLength(12);
    for (const answer of hotspots) {
      used.add(answer.diagramId);
      expect(getDiagram(answer.diagramId), answer.diagramId).not.toBeNull();
      expect(diagramRegionIds(answer.diagramId)).toContain(answer.correctRegionId);
    }
    expect([...used].sort()).toEqual([...IDS].sort());
    expect(new Set(hotspots.map((answer) => `${answer.diagramId}/${answer.correctRegionId}`))).toEqual(new Set([
      'u11-globe-types/relief-globe', 'u11-globe-types/political-globe',
      'u11-axis-poles/north-pole', 'u11-axis-poles/south-pole', 'u11-axis-poles/axis',
      'u11-equator-parallels/equator', 'u11-equator-parallels/north-hemisphere', 'u11-equator-parallels/south-hemisphere', 'u11-equator-parallels/north-parallel',
      'u11-meridians-estonia/other-meridian', 'u11-meridians-estonia/prime-meridian', 'u11-meridians-estonia/estonia'
    ]));
  });

  it('axis: the dashed axis runs through the centre and meets the sphere at the two pole markers, north above south', () => {
    const north = axisPoint(AXIS_GLOBE.r);
    const south = axisPoint(-AXIS_GLOBE.r);
    for (const pole of [north, south]) expect(Math.hypot(pole.x - AXIS_GLOBE.cx, pole.y - AXIS_GLOBE.cy)).toBeCloseTo(AXIS_GLOBE.r, 6);
    expect((north.x + south.x) / 2).toBeCloseTo(AXIS_GLOBE.cx, 6);
    expect((north.y + south.y) / 2).toBeCloseTo(AXIS_GLOBE.cy, 6);
    expect(north.y).toBeLessThan(south.y);
    // Tilted, not upright.
    expect(Math.abs(north.x - south.x)).toBeGreaterThan(40);
    expect(Math.hypot(marker('u11-axis-poles', 'north-pole').x - north.x, marker('u11-axis-poles', 'north-pole').y - north.y)).toBeLessThan(1);
    expect(Math.hypot(marker('u11-axis-poles', 'south-pole').x - south.x, marker('u11-axis-poles', 'south-pole').y - south.y)).toBeLessThan(1);
    expect(marker('u11-axis-poles', 'axis')).toEqual({ x: AXIS_GLOBE.cx, y: AXIS_GLOBE.cy });
  });

  it('equator and parallels: the parallels never meet the equator; the markers sit on their line or in their hemisphere', () => {
    const G = PARALLELS_GLOBE;
    const equator = parallelPoints(G, 0);
    const north = parallelPoints(G, PARALLEL_LATITUDE);
    const south = parallelPoints(G, -PARALLEL_LATITUDE);
    // The equator spans the whole globe (its widest part); parallels are shorter.
    expect(equator[0].x).toBeCloseTo(G.cx - G.r, 6);
    expect(equator[equator.length - 1].x).toBeCloseTo(G.cx + G.r, 6);
    for (let x = G.cx - G.r + 2; x <= G.cx + G.r - 2; x += 2) {
      const e = lineYAt(equator, x)!;
      const n = lineYAt(north, x);
      const s = lineYAt(south, x);
      if (n !== null) expect(e - n, `north parallel at x=${x}`).toBeGreaterThan(40);
      if (s !== null) expect(s - e, `south parallel at x=${x}`).toBeGreaterThan(40);
    }
    const id = 'u11-equator-parallels';
    expect(distanceToLine(equator, marker(id, 'equator'))).toBeLessThan(2);
    expect(distanceToLine(north, marker(id, 'north-parallel'))).toBeLessThan(2);
    expect(distanceToLine(south, marker(id, 'south-parallel'))).toBeLessThan(2);
    const d = marker(id, 'north-hemisphere');
    const e = marker(id, 'south-hemisphere');
    expect(d.y).toBeLessThan(lineYAt(equator, d.x)! - 20);
    expect(d.y).toBeGreaterThan(lineYAt(north, d.x)! + 20);
    expect(e.y).toBeGreaterThan(lineYAt(equator, e.x)! + 20);
    expect(e.y).toBeLessThan(lineYAt(south, e.x)! - 20);
  });

  it('meridians: all meet at both poles; Estonia is north of the equator and east of the prime meridian', () => {
    const G = MERIDIANS_GLOBE;
    for (const longitude of [OTHER_MERIDIAN, 0, PLAIN_MERIDIAN]) {
      const points = meridianPoints(G, longitude);
      expect(points[0].x).toBeCloseTo(G.cx, 6);
      expect(points[0].y).toBeCloseTo(G.cy - G.r, 6);
      expect(points[points.length - 1].x).toBeCloseTo(G.cx, 6);
      expect(points[points.length - 1].y).toBeCloseTo(G.cy + G.r, 6);
    }
    // The prime meridian is the straight middle line.
    expect(meridianPoints(G, 0).every((point) => Math.abs(point.x - G.cx) < 1e-9)).toBe(true);
    const eesti = project(G, ESTONIA.latitude, ESTONIA.longitude);
    expect(eesti.visible).toBe(true);
    expect(eesti.y).toBeLessThan(G.cy - 60);
    expect(eesti.x).toBeGreaterThan(G.cx + 15);
    const id = 'u11-meridians-estonia';
    expect(Math.hypot(marker(id, 'estonia').x - eesti.x, marker(id, 'estonia').y - eesti.y)).toBeLessThan(1);
    expect(distanceToLine(meridianPoints(G, OTHER_MERIDIAN), marker(id, 'other-meridian'))).toBeLessThan(2);
    expect(marker(id, 'other-meridian').x).toBeLessThan(G.cx);
    expect(marker(id, 'prime-meridian').x).toBe(G.cx);
    expect(marker(id, 'west-hemisphere').x).toBeLessThan(G.cx - 20);
    expect(marker(id, 'east-hemisphere').x).toBeGreaterThan(G.cx + 20);
  });

  it('draws no text of its own: every word comes from the registry labels or lesson notes, which hotspot mode hides', () => {
    // DiagramRegion hides labels and DiagramNotes hides notes in hotspot mode;
    // a <text> written into a component would bypass that and could leak the answer.
    for (const file of Object.values(UNIT11_COMPONENT_FILES)) {
      const source = readFileSync(path.join(__dirname, '..', file), 'utf8');
      expect(source, file).not.toMatch(/<text|<tspan/);
      expect(source, file).toMatch(/<DiagramSvg diagramId=\{ID\} mode=\{props\.mode\}/);
    }
    expect(Object.keys(UNIT11_COMPONENT_FILES)).toEqual(IDS);
    // Lesson notes never name a region (they stay visible after answering too, but never in hotspot mode).
    for (const id of IDS) {
      for (const note of DIAGRAM_LAYOUTS[id].notes ?? []) {
        for (const region of getDiagram(id)!.regions) expect(note.text.toLowerCase()).not.toBe(region.label.toLowerCase());
      }
    }
  });
});
