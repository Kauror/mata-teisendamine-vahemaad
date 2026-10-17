import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { findCountry } from '@/content/kaardimang/catalog';
import { DATA_VERSION, findView, LEVELS, MAP_VIEWS, WORLD_SETS, type WorldSetId } from '@/content/kaardimang/regions';
import type { MapViewData } from '@/content/kaardimang/types';
import { seededRng } from '@/lib/random';
import { buildRound, directionHint, emptyState, gradeAnswer, NO_AREA_ANSWER, orderWithoutRepeats, ROUND_LENGTH, SEA_ANSWER, toClientQuestion, type TargetStat, type ViewGeometry } from '@/lib/kaardimang/engine';

function geometry(id: string): ViewGeometry {
  return JSON.parse(readFileSync(path.join(process.cwd(), 'public', 'kaardimang', 'maps', DATA_VERSION, `${id}.json`), 'utf8')) as MapViewData;
}

const noStats = new Map<string, TargetStat>();

function round(viewId: string, level: 'explorer' | 'traveler' | 'geographer' = 'traveler', setId: WorldSetId | null = null, seed = 7, stats = noStats) {
  return buildRound({ view: findView(viewId)!, setId, level }, geometry(viewId), stats, seededRng(seed));
}

describe('buildRound', () => {
  it('builds a playable round for every view, level and world set', () => {
    for (const view of MAP_VIEWS) {
      const sets: Array<WorldSetId | null> = view.kind === 'world' ? WORLD_SETS.map((set) => set.id) : [null];
      for (const setId of sets) {
        for (const level of LEVELS) {
          const built = round(view.id, level.id, setId);
          expect(built.questions.length, `${view.id}/${setId}/${level.id}`).toBeGreaterThan(0);
          expect(built.questions.length).toBeLessThanOrEqual(ROUND_LENGTH);
          for (let i = 1; i < built.questions.length; i++) {
            expect(built.questions[i].targetId, `${view.id} q${i}`).not.toBe(built.questions[i - 1].targetId);
          }
        }
      }
    }
  });

  it('asks Africa about real African countries, not Europe', () => {
    for (let seed = 1; seed < 20; seed++) {
      for (const question of round('africa-north', 'traveler', null, seed).questions) {
        expect(findCountry(question.targetId)!.worldPart).toBe('africa');
      }
    }
  });

  it('shortens the round for a small set instead of repeating a question', () => {
    const baltics = round('europe-baltics', 'explorer');
    expect(baltics.questions.length).toBeLessThanOrEqual(6);
    const keys = baltics.questions.map((question) => `${question.kind}:${question.targetId}`);
    expect(new Set(keys).size).toBe(keys.length);
    expect(round('world', 'traveler', 'oceans').questions).toHaveLength(5);
    expect(round('world', 'traveler', 'continents').questions).toHaveLength(6);
  });

  it('never asks a plain capital question about a country with several capitals', () => {
    for (let seed = 1; seed < 40; seed++) {
      for (const view of ['africa-south', 'americas-south', 'asia-south']) {
        for (const question of round(view, 'geographer', null, seed).questions) {
          if (question.targetType === 'capital') expect(['ZAF', 'BOL', 'LKA', 'SWZ']).not.toContain(question.targetId);
        }
      }
    }
  });

  it('asks a country too small to tap with answer buttons, never as a map tap', () => {
    for (let seed = 1; seed < 30; seed++) {
      for (const question of round('americas-caribbean', 'geographer', null, seed).questions) {
        const tappable = findCountry(question.targetId)!.tappableIn!.includes('americas-caribbean');
        if (!tappable) expect(question.answering).toBe('buttons');
      }
    }
  });

  it('prefers what was missed before', () => {
    const stats = new Map<string, TargetStat>([['country:NGA', { seen: 5, firstTryCorrect: 0, missCount: 5 }]]);
    let withNigeria = 0;
    for (let seed = 1; seed <= 30; seed++) if (round('africa-west', 'traveler', null, seed, stats).questions.some((q) => q.targetId === 'NGA')) withNigeria++;
    expect(withNigeria).toBeGreaterThan(20);
  });

  it('hides the asked capital and offers distinct button answers', () => {
    for (let seed = 1; seed < 30; seed++) {
      for (const question of round('europe', 'traveler', null, seed).questions) {
        if (question.kind === 'capital_of_country') expect(question.hideCapitalId).toBe(question.answerId);
        if (question.options) {
          expect(new Set(question.options.map((option) => option.label)).size).toBe(question.options.length);
          expect(question.options.some((option) => option.id === question.answerId)).toBe(true);
        }
      }
    }
  });
});

describe('gradeAnswer', () => {
  const question = round('europe-baltics', 'explorer', null, 3).questions.find((q) => q.answering === 'map')!;

  it('accepts the right id on the first try', () => {
    const result = gradeAnswer(question, emptyState(), question.answerId);
    expect(result.outcome).toBe('correct');
    expect(result.state.firstTry).toBe(true);
  });

  it('gives a hint after the first miss and reveals after the second', () => {
    const wrong = ['EST', 'LVA', 'LTU'].find((id) => id !== question.answerId)!;
    const first = gradeAnswer(question, emptyState(), wrong);
    expect(first.outcome).toBe('wrong_retry');
    expect(first.messageEt).toMatch(/Proovi veel/);
    expect(first.messageEt).toMatch(/Vihje/);
    expect(toClientQuestion(question, first.state).correctId).toBeNull();
    const second = gradeAnswer(question, first.state, wrong);
    expect(second.outcome).toBe('revealed');
    expect(toClientQuestion(question, second.state).correctId).toBe(question.answerId);
  });

  it('never counts a tap in open sea, or on land outside any continent, as wrong', () => {
    const ocean = round('world', 'traveler', 'oceans').questions[0];
    expect(gradeAnswer(ocean, emptyState(), SEA_ANSWER).outcome).toBe('neutral');
    expect(gradeAnswer(ocean, emptyState(), 'FRA').outcome).toBe('neutral');
    const continent = round('world', 'traveler', 'continents').questions[0];
    expect(gradeAnswer(continent, emptyState(), NO_AREA_ANSWER).outcome).toBe('neutral');
  });

  it('removes one wrong option after a button miss', () => {
    const buttons = round('europe-nordic', 'traveler', null, 5).questions.find((q) => q.answering === 'buttons')!;
    const wrong = buttons.options!.find((option) => option.id !== buttons.answerId)!.id;
    const result = gradeAnswer(buttons, emptyState(), wrong);
    expect(result.state.removedOptionIds).toContain(wrong);
    expect(result.state.removedOptionIds.length).toBeGreaterThanOrEqual(1);
    expect(result.state.removedOptionIds).not.toContain(buttons.answerId);
  });

  it('refuses an id that is not one of the buttons', () => {
    const buttons = round('europe-nordic', 'traveler', null, 5).questions.find((q) => q.answering === 'buttons')!;
    expect(() => gradeAnswer(buttons, emptyState(), 'XYZ')).toThrow();
  });

  it('keeps the answer key out of an unresolved client question', () => {
    const view = toClientQuestion(question, emptyState());
    expect(JSON.stringify(view)).not.toContain('"answerId"');
    expect(view.correctId).toBeNull();
    expect(view.hintEt).toBeNull();
  });
});

describe('Estonian wording', () => {
  it('uses the genitive: "Mis on Jaapani pealinn?" and "Tokyo on Jaapani pealinn."', () => {
    const prompts = new Set<string>();
    const explains = new Set<string>();
    for (let seed = 1; seed < 60; seed++) {
      for (const question of round('asia-east', 'geographer', null, seed).questions) {
        prompts.add(question.prompt);
        explains.add(question.explainEt);
      }
    }
    expect(prompts).toContain('Mis on Jaapani pealinn?');
    expect(prompts).toContain('Mis on Hiina pealinn?');
    expect(explains).toContain('Tokyo on Jaapani pealinn.');
    expect([...prompts, ...explains].some((text) => /(Mis on|on) riigi /.test(text))).toBe(false);
  });

  it('names the continent before "manner" and the world part before "maailmajagu"', () => {
    const continents = round('world', 'traveler', 'continents').questions.map((question) => question.prompt);
    expect(continents).toEqual(expect.arrayContaining(['Leia Austraalia manner.', 'Leia Antarktise manner.', 'Leia Euraasia manner.']));
    expect(round('world', 'traveler', 'worldParts').questions.map((question) => question.prompt)).toContain('Leia Aasia maailmajagu.');
  });
});

describe('helpers', () => {
  it('describes where on the map a place is', () => {
    expect(directionHint({ width: 900, height: 900, labels: { X: [100, 100, 10] }, markers: [] }, 'X', 'Eesti')).toBe('Vihje: Eesti asub kaardi loodeosas.');
    expect(directionHint({ width: 900, height: 900, labels: { X: [800, 800, 10] }, markers: [] }, 'X', 'Eesti')).toBe('Vihje: Eesti asub kaardi kaguosas.');
  });

  it('orders without putting the same target twice in a row when possible', () => {
    expect(orderWithoutRepeats(['A', 'A', 'B', 'B'], (item) => item)).toEqual(['A', 'B', 'A', 'B']);
  });
});
