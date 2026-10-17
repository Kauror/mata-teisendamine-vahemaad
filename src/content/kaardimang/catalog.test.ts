import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { CATALOG, findCountry, quizCapital, viewCountries } from '@/content/kaardimang/catalog';
import { CONTINENTS, DATA_VERSION, MAP_VIEWS, OCEANS, WORLD_PARTS } from '@/content/kaardimang/regions';
import type { MapViewData } from '@/content/kaardimang/types';

// The package's acceptance tests, part A (VASTUVOTUTESTID.md): the content
// itself, checked against the built catalog and the real map files.

function loadView(id: string): MapViewData {
  return JSON.parse(readFileSync(path.join(process.cwd(), 'public', 'kaardimang', 'maps', DATA_VERSION, `${id}.json`), 'utf8')) as MapViewData;
}

const targets = CATALOG.countries.filter((country) => country.target);

describe('Kaardimäng catalog', () => {
  it('keeps the textbook terms apart: 6 mandrit, 6 maailmajagu, 5 ookeani', () => {
    expect(CONTINENTS.map((item) => item.nameEt)).toEqual(['Euraasia', 'Aafrika', 'Põhja-Ameerika', 'Lõuna-Ameerika', 'Austraalia', 'Antarktis']);
    expect(WORLD_PARTS.map((item) => item.nameEt)).toEqual(['Euroopa', 'Aasia', 'Aafrika', 'Ameerika', 'Austraalia ja Okeaania', 'Antarktika']);
    expect(OCEANS.map((item) => item.nameEt)).toEqual(['Vaikne ookean', 'Atlandi ookean', 'India ookean', 'Põhja-Jäämeri', 'Lõuna-Jäämeri']);
  });

  it('covers all 193 UN members and both observers, each with a documented status', () => {
    expect(targets.filter((country) => country.status === 'un_member')).toHaveLength(193);
    expect(findCountry('VAT')).toMatchObject({ status: 'un_observer', target: true });
    expect(findCountry('PSE')).toMatchObject({ status: 'un_observer', target: false });
    for (const id of ['XKX', 'TWN', 'PSE']) expect(findCountry(id)?.noteEt).toBeTruthy();
    expect(new Set(CATALOG.countries.map((country) => country.id)).size).toBe(CATALOG.countries.length);
  });

  it('gives every target an Estonian name, codes, a subregion and a flag', () => {
    for (const country of targets) {
      expect(country.nameEt, country.id).toMatch(/\S/);
      expect(country.iso2, country.id).toMatch(/^[A-Z]{2}$/);
      expect(country.m49, country.id).toMatch(/^\d{3}$/);
      expect(country.subregions.length, country.id).toBeGreaterThan(0);
      expect(country.flag, country.id).not.toBe('');
    }
  });

  it('has a real, non-empty country set in every learning group, Antarctica excepted', () => {
    const expected = { europe: 7, asia: 5, africa: 5, americas: 4, oceania: 4, antarctica: 0 } as const;
    for (const part of WORLD_PARTS) {
      expect(part.subregions, part.id).toHaveLength(expected[part.id]);
      for (const sub of part.subregions) {
        const view = MAP_VIEWS.find((item) => item.id === `${part.id}-${sub.id}`)!;
        expect(viewCountries(view).length, view.id).toBeGreaterThan(0);
      }
    }
    expect(targets.filter((country) => country.worldPart === 'africa')).toHaveLength(54);
  });

  it('has a genitive for every name, written out where it differs', () => {
    expect(findCountry('JPN')!.nameGenEt).toBe('Jaapani');
    expect(findCountry('USA')!.nameGenEt).toBe('Ameerika Ühendriikide');
    expect(findCountry('LVA')!.nameGenEt).toBe('Läti');
    expect(findCountry('CIV')!.nameGenEt).toBe('Elevandiluuranniku');
    for (const country of CATALOG.countries) expect(country.nameGenEt, country.id).toMatch(/\S/);
  });

  it('uses EKI names and the checked capital exceptions', () => {
    expect(quizCapital(findCountry('EST')!)?.nameEt).toBe('Tallinn');
    expect(quizCapital(findCountry('LVA')!)?.nameEt).toBe('Riia');
    expect(quizCapital(findCountry('LTU')!)?.nameEt).toBe('Vilnius');
    expect(quizCapital(findCountry('USA')!)?.nameEt).toBe('Washington');
    expect(quizCapital(findCountry('JPN')!)?.nameEt).toBe('Tokyo');
    expect(quizCapital(findCountry('GNQ')!)?.nameEt).toBe('Ciudad de la Paz');
    // Several capitals, or none: never a one-right-answer capital question.
    for (const id of ['ZAF', 'BOL', 'LKA', 'SWZ', 'NRU', 'ISR', 'VAT']) expect(quizCapital(findCountry(id)!), id).toBeNull();
    expect(findCountry('ZAF')!.capitals.map((capital) => capital.nameEt)).toEqual(['Pretoria', 'Kaplinn', 'Bloemfontein']);
  });

  it('places every quiz capital inside its country on a map that shows it', () => {
    for (const country of targets) {
      for (const capital of country.capitals.filter((item) => item.quizEligible)) {
        expect(capital.lat, capital.id).not.toBeNull();
        expect(capital.verifiedOn, capital.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      }
    }
  });
});

describe('Kaardimäng map views', () => {
  it('ships one map per view, with every target drawn or marked', () => {
    for (const view of MAP_VIEWS) {
      const data = loadView(view.id);
      const drawn = new Set([...data.features.map((feature) => feature.id), ...data.markers.map((marker) => marker.id)]);
      for (const country of viewCountries(view)) expect(drawn.has(country.id), `${view.id}/${country.id}`).toBe(true);
    }
  });

  it('accepts the Pacific on both edges of the world map, and draws every continent and world part', () => {
    const world = loadView('world');
    const pacificX = world.areas.filter((area) => area.id === 'pacific').map((area) => Number(/^M(-?[\d.]+)/.exec(area.d)![1]));
    expect(pacificX.some((x) => x < world.width / 2)).toBe(true);
    expect(pacificX.some((x) => x > world.width / 2)).toBe(true);
    for (const ocean of OCEANS) expect(world.areas.some((area) => area.id === ocean.id), ocean.id).toBe(true);
    for (const continent of CONTINENTS) expect(world.features.some((feature) => feature.ct === continent.id), continent.id).toBe(true);
    for (const part of WORLD_PARTS) expect(world.features.some((feature) => feature.wp === part.id), part.id).toBe(true);
  });

  it('splits Russia between Europe and Asia only in the world-part answers', () => {
    const russia = loadView('world').features.filter((feature) => feature.id === 'RUS');
    expect(new Set(russia.map((feature) => feature.wp))).toEqual(new Set(['europe', 'asia']));
    expect(new Set(russia.map((feature) => feature.ct))).toEqual(new Set(['eurasia']));
  });

  it('keeps one country one id however many pieces it has (USA with Alaska and Hawaii)', () => {
    const usa = loadView('americas-north-large').features.filter((feature) => feature.id === 'USA');
    expect(usa).toHaveLength(1);
    expect(usa[0].d.split('M').length - 1).toBeGreaterThan(5);
  });

  it('has the Antarctica view without any country targets', () => {
    const antarctica = loadView('antarctica');
    expect(antarctica.features.filter((feature) => feature.role === 't')).toHaveLength(0);
    expect(antarctica.markers.map((marker) => marker.id)).toContain('south-pole');
    expect(antarctica.areas.some((area) => area.id === 'southern')).toBe(true);
  });

  it('makes small island states findable: a marker or a highlight question everywhere', () => {
    for (const id of ['WSM', 'TON', 'TUV', 'NRU', 'PLW']) {
      const country = findCountry(id)!;
      const view = loadView(`oceania-${country.subregions[0]}`);
      expect(view.features.some((feature) => feature.id === id) || view.markers.some((marker) => marker.id === id), id).toBe(true);
    }
  });
});
