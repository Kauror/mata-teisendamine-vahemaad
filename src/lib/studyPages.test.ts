import { describe, expect, it } from 'vitest';
import { childExerciseCards } from '@/lib/childExerciseCards';
import type { CatalogueEntry, Learner, LearningExerciseStatus } from '@/lib/shared/types';
import {
  STUDY_EXERCISE_BY_KEY,
  STUDY_PAGE_BY_EXERCISE_ID,
  exerciseStartRoute,
  isStudyKey,
  studyBackRoute,
  studyExerciseParams,
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

  it('keeps the canonical exercise context with each study key', () => {
    expect(studyExerciseParams('kellaaeg')).toEqual({
      learner: 'kirsi', subject: 'matemaatika', topic: 'kellaaeg', category: 'Kellaaeg', exerciseId: 'kirsi.math.kellaaeg', count: 15
    });
    expect(STUDY_EXERCISE_BY_KEY.loodusopetus).toEqual({
      learner: 'kiur', subject: 'loodusopetus', topic: 'segaharjutus', category: 'Loodusõpetus', exerciseId: 'kiur.science.loodusopetus', count: 10
    });
  });

  it('builds a stable study route without editable exercise parameters', () => {
    expect(studyPageRoute('ring-ja-ringjoon')).toBe('/opi/ring-ja-ringjoon');
  });

  it('builds an exercise start route with a fresh seed', () => {
    expect(exerciseStartRoute('kellaaeg', 4242)).toBe('/test?learner=kirsi&subject=matemaatika&topic=kellaaeg&category=Kellaaeg&exerciseId=kirsi.math.kellaaeg&count=15&seed=4242');
    const a = exerciseStartRoute('kellaaeg');
    const b = exerciseStartRoute('kellaaeg');
    // Default seed is time-based; two calls should not obviously collide on value shape.
    expect(a.startsWith('/test?')).toBe(true);
    expect(b.startsWith('/test?')).toBe(true);
  });

  it('starts loodusõpetus on its own runner route, not /test', () => {
    expect(exerciseStartRoute('loodusopetus', 99)).toBe('/kiur/loodusopetus/test?count=10&seed=99');
  });

  it('returns the learner home as the back route', () => {
    expect(studyBackRoute('ring-ja-ringjoon')).toBe('/kiur');
    expect(studyBackRoute('kellaaeg')).toBe('/kirsi');
  });
});

describe('childExerciseCards study-page routing', () => {
  it('routes the circle exercise card to its study page', () => {
    const cards = childExerciseCards('kiur', [entry({ id: 'kiur.math.ring-ja-ringjoon', topic: 'ring-ja-ringjoon', category: 'Segaharjutus', learnerScope: ['kiur'] })]);
    const card = cards.find((c) => c.id === 'kiur.math.ring-ja-ringjoon');
    expect(card?.route).toBe('/opi/ring-ja-ringjoon');
  });

  it('routes the clock exercise card to its study page', () => {
    const cards = childExerciseCards('kirsi', [entry({ id: 'kirsi.math.kellaaeg', topic: 'kellaaeg', category: 'Kellaaeg', learnerScope: ['kirsi'] })]);
    const card = cards.find((c) => c.id === 'kirsi.math.kellaaeg');
    expect(card?.route).toBe('/opi/kellaaeg');
  });

  it('routes the lengths exercise card to its study page', () => {
    const cards = childExerciseCards('kiur', [entry({ id: 'kiur.math.mootuhikud-pikkused', topic: 'mootuhikud-pikkused', category: 'Segaharjutus', learnerScope: ['kiur'] })]);
    const card = cards.find((c) => c.id === 'kiur.math.mootuhikud-pikkused');
    expect(card?.route).toBe('/opi/mootuhikud-pikkused');
  });

  it('routes the fixed science card to its canonical study page', () => {
    // Science is a fixed card (route overridden after merge); the study rewrite must still apply.
    const cards = childExerciseCards('kiur', []);
    const card = cards.find((c) => c.id === 'kiur.science.loodusopetus');
    expect(card?.route).toBe('/opi/loodusopetus');
  });

  it('still routes an ordinary maths exercise straight to the runner', () => {
    const cards = childExerciseCards('kiur', [entry({ id: 'kiur.math.mustrid', topic: 'mustrid', category: 'Segaharjutus', learnerScope: ['kiur'] })]);
    const card = cards.find((c) => c.id === 'kiur.math.mustrid');
    expect(card?.route.startsWith('/test?')).toBe(true);
  });
});
