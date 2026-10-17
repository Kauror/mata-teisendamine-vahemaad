// Builders for synthetic pools in the textbook unit tests. Not used by the app.

import { seededRng, type RNG } from '@/lib/random';
import { DEFAULT_COURSE_SETTINGS, type CognitiveLevel, type CourseSettings, type LearningObjective, type Question, type Unit } from '@/lib/textbook/types';

export type FixtureQuestion = {
  id: string;
  objective: string;
  group?: string;
  level?: CognitiveLevel;
  practice?: boolean;
  test?: boolean;
  related?: string[];
};

export function fixtureQuestion(spec: FixtureQuestion, unitId = 'u1'): Question {
  return {
    id: spec.id,
    unitId,
    stem: `Küsimus ${spec.id}?`,
    primaryObjectiveId: spec.objective,
    ...(spec.related ? { relatedObjectiveIds: spec.related } : {}),
    variantGroupId: spec.group ?? `g-${spec.id}`,
    cognitiveLevel: spec.level ?? 'factual',
    difficulty: 1,
    eligibility: { practice: spec.practice ?? true, test: spec.test ?? true },
    explanation: `Selgitus ${spec.id}.`,
    sources: [{ kind: 'supplementary', attribution: 'test' }],
    answer: { type: 'single_choice', options: [{ id: 'a', text: 'Õige' }, { id: 'b', text: 'Vale' }], correctOptionId: 'a' }
  };
}

export function fixtureObjectives(ids: string[], required = true): LearningObjective[] {
  return ids.map((id) => ({ id, description: `Eesmärk ${id}`, required, sources: [] }));
}

export function fixtureUnit(questions: Question[], objectiveIds: string[], extra: Partial<Unit> = {}): Unit {
  return {
    id: 'u1',
    courseId: 'c1',
    number: 1,
    title: 'Test',
    status: 'ready',
    contentVersion: '1',
    objectives: fixtureObjectives(objectiveIds),
    lessons: [],
    questions,
    ...extra
  };
}

export function settings(overrides: Partial<CourseSettings> = {}): CourseSettings {
  return { ...DEFAULT_COURSE_SETTINGS, ...overrides };
}

// A random pool: `groups` variant groups, each 1–3 questions of one or two
// levels, spread over `objectives` objectives.
export function randomPool(rng: RNG, groups: number, objectives: string[], options: { mixedLevels?: boolean } = {}): Question[] {
  const levels: CognitiveLevel[] = ['factual', 'understanding', 'application'];
  const questions: Question[] = [];
  for (let group = 0; group < groups; group++) {
    const size = 1 + Math.floor(rng() * 3);
    const objective = objectives[Math.floor(rng() * objectives.length)];
    const baseLevel = levels[Math.floor(rng() * 3)];
    for (let index = 0; index < size; index++) {
      const level = options.mixedLevels && rng() < 0.4 ? levels[Math.floor(rng() * 3)] : baseLevel;
      const obj = rng() < 0.2 ? objectives[Math.floor(rng() * objectives.length)] : objective;
      questions.push(fixtureQuestion({ id: `q${group}-${index}`, objective: obj, group: `g${group}`, level }));
    }
  }
  return questions;
}

export function rngFor(seed: number) {
  return seededRng(seed);
}
