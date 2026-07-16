import { describe, expect, it } from 'vitest';
import { childExerciseCards } from '@/lib/childExerciseCards';
import type { CatalogueEntry, Learner, LearningExerciseStatus } from '@/lib/shared/types';
import {
  STUDY_PAGE_BY_EXERCISE_ID,
  exerciseStartRoute,
  isStudyKey,
  studyBackRoute,
  studyPageRoute
} from '@/lib/studyPages';

function entry(overrides: Partial<CatalogueEntry> & Pick<CatalogueEntry, 'id' | 'topic' | 'category'>): CatalogueEntry {
  const status: Record<Learner, LearningExerciseStatus | null> = { kiur: 'rotation', kirsi: 'rotation' };
  return {
    title: 'Test',
    learnerScope: ['kiur', 'kirsi'],
    subject: 'matemaatika',
    routePath: '/kiur/matemaatika',
    sortOrder: 1,
    childStatus: status,
    ...overrides
  } as CatalogueEntry;
}

describe('studyPages helpers', () => {
  it('maps the study exercises to study keys', () => {
    expect(STUDY_PAGE_BY_EXERCISE_ID['kiur.math.ring-ja-ringjoon']).toBe('ring-ja-ringjoon');
    expect(STUDY_PAGE_BY_EXERCISE_ID['kirsi.math.kellaaeg']).toBe('kellaaeg');
    expect(STUDY_PAGE_BY_EXERCISE_ID['kiur.math.mootuhikud-pikkused']).toBe('mootuhikud-pikkused');
    expect(STUDY_PAGE_BY_EXERCISE_ID['kiur.science.loodusopetus']).toBe('loodusopetus');
  });

  it('recognises valid study keys', () => {
    expect(isStudyKey('ring-ja-ringjoon')).toBe(true);
    expect(isStudyKey('kellaaeg')).toBe(true);
    expect(isStudyKey('mootuhikud-pikkused')).toBe(true);
    expect(isStudyKey('loodusopetus')).toBe(true);
    expect(isStudyKey('mustrid')).toBe(false);
    expect(isStudyKey(null)).toBe(false);
  });

  it('builds a study route carrying the exercise params but no seed', () => {
    const route = studyPageRoute('ring-ja-ringjoon', {
      learner: 'kiur', subject: 'matemaatika', topic: 'ring-ja-ringjoon', category: 'Segaharjutus', exerciseId: 'kiur.math.ring-ja-ringjoon', count: 15
    });
    expect(route.startsWith('/opi/ring-ja-ringjoon?')).toBe(true);
    expect(route).toContain('learner=kiur');
    expect(route).toContain('category=Segaharjutus');
    expect(route).toContain('exerciseId=kiur.math.ring-ja-ringjoon');
    expect(route).not.toContain('seed=');
  });

  it('builds an exercise start route with a fresh seed', () => {
    const params = { learner: 'kirsi', subject: 'matemaatika', topic: 'kellaaeg', category: 'Kellaaeg', count: 15 };
    expect(exerciseStartRoute(params, 4242)).toBe('/test?learner=kirsi&subject=matemaatika&topic=kellaaeg&category=Kellaaeg&count=15&seed=4242');
    const a = exerciseStartRoute(params);
    const b = exerciseStartRoute(params);
    // Default seed is time-based; two calls should not obviously collide on value shape.
    expect(a.startsWith('/test?')).toBe(true);
    expect(b.startsWith('/test?')).toBe(true);
  });

  it('starts loodusõpetus on its own runner route, not /test', () => {
    const params = { learner: 'kiur', subject: 'loodusopetus', topic: 'segaharjutus', category: 'Loodusõpetus', exerciseId: 'kiur.science.loodusopetus', count: 10 };
    expect(exerciseStartRoute(params, 99)).toBe('/kiur/loodusopetus/test?count=10&seed=99');
  });

  it('returns the learner home as the back route', () => {
    expect(studyBackRoute('kiur')).toBe('/kiur');
    expect(studyBackRoute('kirsi')).toBe('/kirsi');
    expect(studyBackRoute('')).toBe('/');
  });
});

describe('childExerciseCards study-page routing', () => {
  it('routes the circle exercise card to its study page', () => {
    const cards = childExerciseCards('kiur', [entry({ id: 'kiur.math.ring-ja-ringjoon', topic: 'ring-ja-ringjoon', category: 'Segaharjutus', learnerScope: ['kiur'] })]);
    const card = cards.find((c) => c.id === 'kiur.math.ring-ja-ringjoon');
    expect(card?.route.startsWith('/opi/ring-ja-ringjoon?')).toBe(true);
  });

  it('routes the clock exercise card to its study page', () => {
    const cards = childExerciseCards('kirsi', [entry({ id: 'kirsi.math.kellaaeg', topic: 'kellaaeg', category: 'Kellaaeg', learnerScope: ['kirsi'] })]);
    const card = cards.find((c) => c.id === 'kirsi.math.kellaaeg');
    expect(card?.route.startsWith('/opi/kellaaeg?')).toBe(true);
  });

  it('routes the lengths exercise card to its study page', () => {
    const cards = childExerciseCards('kiur', [entry({ id: 'kiur.math.mootuhikud-pikkused', topic: 'mootuhikud-pikkused', category: 'Segaharjutus', learnerScope: ['kiur'] })]);
    const card = cards.find((c) => c.id === 'kiur.math.mootuhikud-pikkused');
    expect(card?.route.startsWith('/opi/mootuhikud-pikkused?')).toBe(true);
  });

  it('routes the fixed science card to its study page carrying loodusopetus params', () => {
    // Science is a fixed card (route overridden after merge); the study rewrite must still apply.
    const cards = childExerciseCards('kiur', []);
    const card = cards.find((c) => c.id === 'kiur.science.loodusopetus');
    expect(card?.route.startsWith('/opi/loodusopetus?')).toBe(true);
    expect(card?.route).toContain('subject=loodusopetus');
    expect(card?.route).toContain('count=10');
  });

  it('still routes an ordinary maths exercise straight to the runner', () => {
    const cards = childExerciseCards('kiur', [entry({ id: 'kiur.math.mustrid', topic: 'mustrid', category: 'Segaharjutus', learnerScope: ['kiur'] })]);
    const card = cards.find((c) => c.id === 'kiur.math.mustrid');
    expect(card?.route.startsWith('/test?')).toBe(true);
  });
});
