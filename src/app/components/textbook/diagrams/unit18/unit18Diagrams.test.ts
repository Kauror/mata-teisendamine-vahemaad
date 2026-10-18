import { readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { getDiagram } from '@/lib/textbook/diagramRegistry';
import { UNIT18_DIAGRAMS } from '@/lib/textbook/diagrams/unit18';
import { unit18 } from '@/content/textbook/loodusopetus-opik/unit18';
import type { DiagramMode } from '@/app/components/textbook/diagrams/DiagramFrame';
import { DIAGRAM_COMPONENTS } from '@/app/components/textbook/diagrams';
import { CONTINENT_PATHS, EUROPE_COUNTRY_PATHS } from '@/app/components/textbook/diagrams/unit18/europeMap';
import { U18_BORDERS_VIEW, U18_COUNTRIES_VIEW, U18_DIAGRAM_LAYOUTS, U18_WORLD_VIEW } from '@/app/components/textbook/diagrams/unit18/layouts';
import { U18_AREA_COUNTRIES } from '@/app/components/textbook/diagrams/unit18/EuropeAreaDiagram';
import { U18_POPULATION_COUNTRIES } from '@/app/components/textbook/diagrams/unit18/EuropePopulationDiagram';
import { U18_EUROPE_CLIP, U18_GUIANA_BOX } from '@/app/components/textbook/diagrams/unit18/EuropeWorldDiagram';

// Unit 18 "Euroopa kaart": four real (generalised Natural Earth) maps. The
// generic checks (label fit, 44 px tap areas, no overlaps) are in
// ../diagramLayout.test.ts and ../hotspotNeutrality.test.ts; this file proves
// answer secrecy, that every letter sits on the textbook's place on the real
// map, and the geography the data must get right (Crimea in Ukraine).

function render(diagramId: string, mode: DiagramMode, extra: Record<string, unknown> = {}) {
  return renderToStaticMarkup(createElement(DIAGRAM_COMPONENTS[diagramId], { mode, onSelectRegion: () => undefined, ...extra }));
}

function visibleText(markup: string) {
  const texts = [...markup.matchAll(/>([^<>]+)</g)].map((match) => match[1].trim()).filter(Boolean);
  const labels = [...markup.matchAll(/aria-label="([^"]*)"/g)].map((match) => match[1]);
  return [...texts, ...labels];
}

// Rings of an absolute M/L/Z path ("M1,2 L3,4 Z" or "M1 2 L3 4 Z").
type Point = [number, number];
function rings(d: string): Point[][] {
  return d.split('M').filter((part) => part.trim()).map((part) => [...part.matchAll(/(-?[\d.]+)[ ,](-?[\d.]+)/g)].map((match) => [Number(match[1]), Number(match[2])] as Point));
}
function inRing([x, y]: Point, ring: Point[]) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}
// Even-odd, like the fill.
const inPath = (point: Point, d: string) => rings(d).filter((ring) => inRing(point, ring)).length % 2 === 1;

// The Europe data: x = (lon + 27) · 9, y = (76 − lat) · 12.
const europePoint = (lon: number, lat: number): Point => [(lon + 27) * 9, (76 - lat) * 12];
const countriesAt = (point: Point) => Object.entries(EUROPE_COUNTRY_PATHS).filter(([, d]) => inPath(point, d)).map(([name]) => name);
// The world data: x = (lon + 180) · 2, y = (90 − lat) · 2.
const worldLonLat = ([x, y]: Point) => [x / 2 - 180, 90 - y / 2];

type View = { originX: number; originY: number; scale: number };
const toData = (view: View, marker: { x: number; y: number }): Point => [marker.x / view.scale + view.originX, marker.y / view.scale + view.originY];
const europeLonLat = ([x, y]: Point) => [x / 9 - 27, 76 - y / 12];

// The textbook package's marker coordinates (UNIT18_DIAGRAMS.md), lon/lat.
const TEXTBOOK_PLACES: Record<string, Record<string, [number, number]>> = {
  'u18-europe-borders': { atlantic: [-18, 52], arctic: [17, 73], mediterranean: [13, 35.5], 'black-sea': [35, 43], caspian: [52, 42], ural: [60, 61] },
  'u18-europe-area': { russia: [45, 56], ukraine: [31, 49], france: [2, 47], spain: [-4, 40], sweden: [16, 63] },
  'u18-europe-population': { russia: [45, 56], germany: [10, 51], uk: [-3, 54], france: [2, 46], italy: [12.5, 42.5] }
};

describe('Unit 18 diagrams', () => {
  it('registers exactly the four diagrams with the region IDs the questions use', () => {
    expect(UNIT18_DIAGRAMS.map((diagram) => [diagram.id, diagram.regions.map((region) => `${region.marker}:${region.id}`)])).toEqual([
      ['u18-europe-world', ['A:europe', 'B:asia', 'C:africa', 'D:north-america']],
      ['u18-europe-borders', ['A:atlantic', 'B:arctic', 'C:mediterranean', 'D:black-sea', 'E:caspian', 'F:ural']],
      ['u18-europe-area', ['A:russia', 'B:ukraine', 'C:france', 'D:spain', 'E:sweden']],
      ['u18-europe-population', ['A:russia', 'B:germany', 'C:uk', 'D:france', 'E:italy']]
    ]);
    const used = new Set<string>();
    for (const question of unit18.questions) {
      if (question.answer.type !== 'diagram_hotspot') continue;
      expect(getDiagram(question.answer.diagramId)?.regions.map((region) => region.id), question.id).toContain(question.answer.correctRegionId);
      used.add(`${question.answer.diagramId}/${question.answer.correctRegionId}`);
    }
    // Every region is the answer to some question, except North America (a
    // distractor on the world map).
    const all = UNIT18_DIAGRAMS.flatMap((diagram) => diagram.regions.map((region) => `${diagram.id}/${region.id}`));
    expect([...used].sort()).toEqual(all.filter((id) => id !== 'u18-europe-world/north-america').sort());
  });

  it('hotspot mode: letters only — no name, note, tint, divide or mountain ridge; every region looks the same', () => {
    const countryNames = Object.keys(EUROPE_COUNTRY_PATHS);
    for (const diagram of UNIT18_DIAGRAMS) {
      const markup = render(diagram.id, 'hotspot');
      const texts = visibleText(markup);
      for (const forbidden of ['tb-diagram-label', 'tb-diagram-note', 'tb-u18-tint', 'tb-u18-europe', 'tb-u18-asia', 'tb-u18-divide', 'tb-u18-ridge', 'tb-u18-peak']) {
        expect(markup, `${diagram.id}: ${forbidden}`).not.toContain(forbidden);
      }
      expect(markup).toMatch(/<desc[^>]*>Joonisel on tähtedega märgitud kohad [A-F, ]+\.<\/desc>/);
      expect([...markup.matchAll(/role="button"/g)]).toHaveLength(diagram.regions.length);
      for (const region of diagram.regions) {
        expect(markup).toContain(`data-region-id="${region.id}"`);
        expect(texts).toContain(`Ala ${region.marker}`);
      }
      // Drawn text is exactly the title, the neutral description and the letters.
      expect(texts.sort()).toEqual([diagram.title, `Joonisel on tähtedega märgitud kohad ${diagram.regions.map((region) => region.marker).join(', ')}.`, ...diagram.regions.map((region) => region.marker), ...diagram.regions.map((region) => `Ala ${region.marker}`)].sort());
      const lower = markup.toLowerCase();
      for (const region of diagram.regions) expect(lower, `${diagram.id} names ${region.label}`).not.toContain(region.label.toLowerCase());
      // The data's English country names never reach the markup (keys only).
      for (const name of countryNames) expect(markup, `${diagram.id} contains ${name}`).not.toContain(`"${name}"`);
      expect(markup).not.toMatch(/Russia|Ukraine|Germany|Kingdom|France|Italy|Spain|Sweden/);
      // No attribute other than the framework's own carries data.
      const dataAttributes = new Set([...markup.matchAll(/ (data-[a-z-]+)=/g)].map((match) => match[1]));
      expect([...dataAttributes].sort()).toEqual(['data-diagram-id', 'data-region-id']);
      // The shapes of all regions share one class: no tone gives the answer away.
      const targets = [...markup.matchAll(/class="([^"]*tb-u18-target[^"]*)"/g)].map((match) => match[1]);
      expect(new Set(targets).size, diagram.id).toBeLessThanOrEqual(1);
    }
  });

  it('lesson mode names every region; reveal adds the letter; notes and tints only outside hotspot mode', () => {
    for (const diagram of UNIT18_DIAGRAMS) {
      const lesson = visibleText(render(diagram.id, 'lesson'));
      const reveal = render(diagram.id, 'reveal', { correctRegionId: diagram.regions[0].id, selectedRegionId: diagram.regions[1].id });
      for (const region of diagram.regions) {
        expect(lesson.join(' ')).toContain(region.label.split(' ')[0]);
        expect(visibleText(reveal).join(' ')).toContain(`${region.marker} –`);
      }
      expect(reveal).toMatch(new RegExp(`data-region-id="${diagram.regions[0].id}"[^>]*data-correct="true"`));
      expect(reveal).toMatch(new RegExp(`data-region-id="${diagram.regions[1].id}" data-selected="true"[^>]*data-wrong="true"`));
      for (const note of U18_DIAGRAM_LAYOUTS[diagram.id].notes ?? []) {
        expect(lesson).toContain(note.text);
        expect(visibleText(render(diagram.id, 'hotspot'))).not.toContain(note.text);
      }
    }
    expect(render('u18-europe-world', 'lesson')).toContain('tb-u18-divide');
    expect(render('u18-europe-borders', 'lesson')).toContain('tb-u18-ridge');
    for (const id of ['u18-europe-area', 'u18-europe-population']) {
      expect([...render(id, 'lesson').matchAll(/tb-u18-tint-(\d)/g)].map((match) => match[1]).sort()).toEqual(['1', '2', '3', '4', '5']);
    }
  });

  it('the data draws Crimea as Ukraine, Northern Cyprus as Cyprus and every capital in its own country', () => {
    expect(countriesAt(europePoint(34.1, 45.0))).toEqual(['Ukraine']); // Crimea
    expect(countriesAt(europePoint(33.6, 44.6))).toEqual(['Ukraine']); // Sevastopol
    expect(countriesAt(europePoint(36.2, 45.3))).toEqual(['Ukraine']); // Kerch
    expect(countriesAt(europePoint(33.4, 35.2))).toEqual(['Cyprus']); // Nicosia
    expect(Object.keys(EUROPE_COUNTRY_PATHS)).not.toContain('N. Cyprus');
    const capitals: Array<[string, number, number]> = [
      ['Russia', 37.6, 55.75], ['Russia', 20.5, 54.7], ['Ukraine', 30.5, 50.45], ['France', 2.35, 48.85], ['Spain', -3.7, 40.4], ['Sweden', 18.05, 59.33],
      ['Germany', 13.4, 52.5], ['United Kingdom', -0.13, 51.5], ['Italy', 12.5, 41.9], ['Estonia', 24.75, 59.44], ['Poland', 21.0, 52.23], ['Norway', 10.75, 59.9]
    ];
    for (const [country, lon, lat] of capitals) expect(countriesAt(europePoint(lon, lat)), `${country} ${lon} ${lat}`).toEqual([country]);
    // The data's own record of what was changed.
    const data = JSON.parse(readFileSync(path.join(__dirname, '../data/u18-europe-country-paths.json'), 'utf8'));
    expect(data.changes.join(' ')).toMatch(/Crimea is joined to Ukraine/);
    expect(data.source).toMatch(/Natural Earth/);
  });

  it('puts every letter on the textbook place of the real map: countries on their country, waters on water, the Urals in Russia', () => {
    const views: Record<string, View> = { 'u18-europe-borders': U18_BORDERS_VIEW, 'u18-europe-area': U18_COUNTRIES_VIEW, 'u18-europe-population': U18_COUNTRIES_VIEW };
    const countryOf: Record<string, Record<string, string>> = { 'u18-europe-area': U18_AREA_COUNTRIES, 'u18-europe-population': U18_POPULATION_COUNTRIES };
    for (const [diagramId, places] of Object.entries(TEXTBOOK_PLACES)) {
      for (const [regionId, [lon, lat]] of Object.entries(places)) {
        const point = toData(views[diagramId], U18_DIAGRAM_LAYOUTS[diagramId].regions[regionId].marker);
        const [markerLon, markerLat] = europeLonLat(point);
        expect(Math.abs(markerLon - lon), `${diagramId}/${regionId} lon`).toBeLessThan(1);
        expect(Math.abs(markerLat - lat), `${diagramId}/${regionId} lat`).toBeLessThan(1);
        const under = countriesAt(point);
        if (countryOf[diagramId]) expect(under, `${diagramId}/${regionId}`).toEqual([countryOf[diagramId][regionId]]);
        else expect(under, `${diagramId}/${regionId}`).toEqual(regionId === 'ural' ? ['Russia'] : []);
      }
    }
  });

  it('world map: six continents; Europe is the west of Eurasia, Asia the rest; French Guiana is no part of either', () => {
    expect(Object.keys(CONTINENT_PATHS).sort()).toEqual(['africa', 'antarctica', 'australia', 'eurasia', 'north-america', 'south-america']);
    const layout = U18_DIAGRAM_LAYOUTS['u18-europe-world'];
    const at = (regionId: string) => toData(U18_WORLD_VIEW, layout.regions[regionId].marker);
    const europe = at('europe');
    const asia = at('asia');
    expect(inPath(europe, CONTINENT_PATHS.eurasia) && inPath(europe, U18_EUROPE_CLIP)).toBe(true);
    expect(inPath(asia, CONTINENT_PATHS.eurasia) && !inPath(asia, U18_EUROPE_CLIP)).toBe(true);
    expect(inPath(at('africa'), CONTINENT_PATHS.africa)).toBe(true);
    expect(inPath(at('north-america'), CONTINENT_PATHS['north-america'])).toBe(true);
    // The package's marker places (720 × 360 units).
    expect([europe, asia, at('africa'), at('north-america')]).toEqual([[390, 78], [560, 118], [400, 204], [140, 114]]);
    // Europe: Paris, Madrid, Rome, Reykjavik, Moscow; Asia: Ankara, Tbilisi side of the divide, Yekaterinburg, Beijing.
    const world = (lon: number, lat: number): Point => [(lon + 180) * 2, (90 - lat) * 2];
    for (const [lon, lat] of [[2.35, 48.85], [-3.7, 40.4], [12.5, 41.9], [-21.9, 64.1], [37.6, 55.75], [28.97, 41.1]]) expect(inPath(world(lon, lat), U18_EUROPE_CLIP), `${lon} ${lat}`).toBe(true);
    for (const [lon, lat] of [[32.85, 39.93], [44.8, 41.7], [60.6, 56.8], [116.4, 39.9]]) expect(inPath(world(lon, lat), U18_EUROPE_CLIP), `${lon} ${lat}`).toBe(false);
    // French Guiana (in the data's Eurasia outline, as part of France) lies in the box drawn as plain land.
    expect(worldLonLat([253, 172])[0]).toBeCloseTo(-53.5, 0);
    expect(inPath([253, 172], U18_GUIANA_BOX) && inPath([253, 172], CONTINENT_PATHS.eurasia)).toBe(true);
  });

  it('ships its map data locally and small: no network, one shared continent file', () => {
    const dir = path.join(__dirname, '../data');
    expect(statSync(path.join(dir, 'u18-europe-country-paths.json')).size).toBeLessThan(40_000);
    for (const file of ['europeMap.tsx', 'EuropeWorldDiagram.tsx', 'EuropeBordersDiagram.tsx', 'EuropeAreaDiagram.tsx', 'EuropePopulationDiagram.tsx']) {
      const source = readFileSync(path.join(__dirname, file), 'utf8');
      expect(source, file).not.toMatch(/fetch\(|https?:\/\//);
    }
    expect(readFileSync(path.join(__dirname, 'europeMap.tsx'), 'utf8')).toContain("from '@/app/components/textbook/diagrams/data/world_continent_paths.json'");
  });
});
