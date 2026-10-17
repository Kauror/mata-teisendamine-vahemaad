import { describe, expect, it } from 'vitest';
import { textbookDemoCourse } from '@/content/textbook/textbook-demo';
import { seededRng } from '@/lib/random';
import { TextbookRuleError } from '@/lib/textbook/errors';
import { correctResponseFor } from '@/lib/textbook/grading';
import {
  createPracticeState,
  currentPracticeQuestion,
  parsePracticeState,
  practiceProgress,
  recordPracticeAnswer,
  unresolvedObjectiveIds,
  type PracticeState
} from '@/lib/textbook/practiceScheduler';
import { fixtureQuestion, fixtureUnit, randomPool } from '@/lib/textbook/testFixtures';
import type { AnswerResponse, Question } from '@/lib/textbook/types';

const course = textbookDemoCourse;
const WRONG: AnswerResponse = { type: 'single_choice', optionId: '__wrong__' };

function correctFor(state: PracticeState): AnswerResponse {
  return correctResponseFor(currentPracticeQuestion(state)!.question.answer);
}

function answer(state: PracticeState, correct: boolean) {
  const current = currentPracticeQuestion(state)!;
  return recordPracticeAnswer(state, current.question.id, correct ? correctResponseFor(current.question.answer) : WRONG);
}

function runToEnd(state: PracticeState, decide: (step: number) => boolean, limit = 500) {
  let current = state;
  const asked: string[] = [];
  for (let step = 0; !current.completed; step++) {
    if (step > limit) throw new Error('did not terminate');
    const question = currentPracticeQuestion(current);
    expect(question, 'a question is always available while incomplete').not.toBeNull();
    asked.push(question!.question.id);
    current = answer(current, decide(step)).state;
  }
  return { state: current, asked };
}

describe('practice on the demo units', () => {
  for (const unit of course.units) {
    it(`${unit.id}: the plan covers every required objective with ~practiceTarget distinct questions`, () => {
      const state = createPracticeState({ courseId: course.id, unit, settings: course.settings, seed: 5 });
      const required = unit.objectives.filter((objective) => objective.required).map((objective) => objective.id);
      expect(state.objectiveIds).toEqual(required);
      expect(state.queue).toHaveLength(course.settings.practiceTarget);
      expect(new Set(state.queue.map((entry) => entry.questionId)).size).toBe(state.queue.length);
      for (const id of required) expect(state.queue.some((entry) => entry.objectiveId === id)).toBe(true);
      expect(state.pool.every((frozen) => frozen.question.eligibility.practice)).toBe(true);
    });
  }

  it('all correct → complete after exactly the planned queue', () => {
    const state = createPracticeState({ courseId: course.id, unit: course.units[0], settings: course.settings, seed: 1 });
    const { state: done, asked } = runToEnd(state, () => true);
    expect(asked).toHaveLength(course.settings.practiceTarget);
    expect(done.completed).toBe(true);
    expect(practiceProgress(done)).toMatchObject({ satisfiedCount: 4, objectiveCount: 4, remainingCount: 0, completed: true });
  });

  it('counts questions: number on screen, done, remaining, and a total that grows with a correction', () => {
    const target = course.settings.practiceTarget;
    let state = createPracticeState({ courseId: course.id, unit: course.units[0], settings: course.settings, seed: 3 });
    expect(practiceProgress(state)).toMatchObject({ answeredCount: 0, remainingCount: target, totalQuestionCount: target, currentQuestionNumber: 1 });

    state = answer(state, true).state;
    expect(practiceProgress(state)).toMatchObject({ answeredCount: 1, remainingCount: target - 1, totalQuestionCount: target, currentQuestionNumber: 2 });

    const before = practiceProgress(state);
    const wrong = answer(state, false);
    const after = practiceProgress(wrong.state);
    expect(after.answeredCount).toBe(2);
    expect(after.currentQuestionNumber).toBe(3);
    expect(after.totalQuestionCount).toBe(after.answeredCount + after.remainingCount);
    // A correction scheduled after a wrong answer grows the run; otherwise the total stays.
    const grew = wrong.state.queue.length - (state.queue.length - 1);
    expect(after.totalQuestionCount).toBe(before.totalQuestionCount + grew);
    expect(grew).toBeGreaterThanOrEqual(0);

    const { state: done } = runToEnd(wrong.state, () => true);
    const final = practiceProgress(done);
    expect(final).toMatchObject({ remainingCount: 0, currentQuestionNumber: null, completed: true });
    expect(final.totalQuestionCount).toBe(done.answers.length);
  });

  it('is deterministic for a seed', () => {
    const a = createPracticeState({ courseId: course.id, unit: course.units[1], settings: course.settings, seed: 9 });
    const b = createPracticeState({ courseId: course.id, unit: course.units[1], settings: course.settings, seed: 9 });
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });
});

describe('correction rules', () => {
  it('tells the child the topic comes back when a question for it was already planned', () => {
    // Two planned questions on the same objective: a wrong first answer adds no
    // extra correction, but the topic still comes back, and the child is told.
    const planned: Question[] = [
      fixtureQuestion({ id: 'p1', objective: 'o1', group: 'g1' }),
      fixtureQuestion({ id: 'p2', objective: 'o1', group: 'g2' })
    ];
    const plannedUnit = fixtureUnit(planned, ['o1']);
    const state = createPracticeState({ courseId: 'c1', unit: plannedUnit, settings: { practiceTarget: 2 }, seed: 1 });
    expect(state.queue).toHaveLength(2);
    const first = currentPracticeQuestion(state)!.question;
    const result = recordPracticeAnswer(state, first.id, WRONG);
    expect(result.feedback.correctionScheduled).toBe(true);
    expect(result.state.queue.some((entry) => entry.objectiveId === 'o1')).toBe(true);
  });

  // Objective o1 has three questions in two groups; o2 has two.
  const pool: Question[] = [
    fixtureQuestion({ id: 'a1', objective: 'o1', group: 'ga' }),
    fixtureQuestion({ id: 'a2', objective: 'o1', group: 'ga' }),
    fixtureQuestion({ id: 'b1', objective: 'o1', group: 'gb' }),
    fixtureQuestion({ id: 'c1', objective: 'o2', group: 'gc' }),
    fixtureQuestion({ id: 'c2', objective: 'o2', group: 'gd' })
  ];
  const unit = fixtureUnit(pool, ['o1', 'o2']);
  const make = (seed: number) => createPracticeState({ courseId: 'c1', unit, settings: { practiceTarget: 2 }, seed });

  it('a wrong answer keeps the objective unresolved and schedules a different question, preferring another group', () => {
    for (let seed = 0; seed < 30; seed++) {
      let state = make(seed);
      expect(state.queue).toHaveLength(2);
      const first = currentPracticeQuestion(state)!.question;
      const result = recordPracticeAnswer(state, first.id, WRONG);
      state = result.state;
      expect(result.feedback.correct).toBe(false);
      expect(result.feedback.correctionScheduled).toBe(true);
      expect(result.feedback.explanation).toBe(first.explanation);
      expect(unresolvedObjectiveIds(state)).toContain(first.primaryObjectiveId);
      const correction = state.queue.find((entry) => entry.reason === 'correction')!;
      expect(correction.objectiveId).toBe(first.primaryObjectiveId);
      expect(correction.questionId).not.toBe(first.id);
      const correctionGroup = pool.find((question) => question.id === correction.questionId)!.variantGroupId;
      expect(correctionGroup).not.toBe(first.variantGroupId);
      expect(state.queue[0].questionId).not.toBe(first.id);
    }
  });

  it('completion needs a correct answer on every objective; related objectives never count', () => {
    const relatedPool = [
      fixtureQuestion({ id: 'r1', objective: 'o1', related: ['o2'] }),
      fixtureQuestion({ id: 'r2', objective: 'o1', related: ['o2'] }),
      fixtureQuestion({ id: 'r3', objective: 'o2' }),
      fixtureQuestion({ id: 'r4', objective: 'o2' })
    ];
    let state = createPracticeState({ courseId: 'c1', unit: fixtureUnit(relatedPool, ['o1', 'o2']), settings: { practiceTarget: 2 }, seed: 3 });
    // Answer o1 questions correctly and o2 questions wrongly, a few times.
    for (let step = 0; step < 6; step++) {
      const current = currentPracticeQuestion(state)!.question;
      state = recordPracticeAnswer(state, current.id, current.primaryObjectiveId === 'o1' ? correctFor(state) : WRONG).state;
      expect(state.completed).toBe(false);
      expect(state.satisfiedObjectiveIds).not.toContain('o2');
    }
    const { state: done } = runToEnd(state, () => true);
    expect(done.satisfiedObjectiveIds.sort()).toEqual(['o1', 'o2']);
  });

  it('never shows the same question twice in a row (random answers, many seeds)', () => {
    for (let seed = 0; seed < 60; seed++) {
      const rng = seededRng(seed);
      const { asked } = runToEnd(make(seed), (step) => step > 30 || rng() < 0.4);
      for (let index = 1; index < asked.length; index++) expect(asked[index]).not.toBe(asked[index - 1]);
    }
  });

  it('pending corrections are dropped once the objective is satisfied', () => {
    let state = make(2);
    const first = currentPracticeQuestion(state)!.question;
    state = recordPracticeAnswer(state, first.id, WRONG).state;
    // Answer everything for that objective correctly.
    while (state.satisfiedObjectiveIds.length === 0 || !state.satisfiedObjectiveIds.includes(first.primaryObjectiveId)) state = answer(state, true).state;
    expect(state.queue.some((entry) => entry.reason === 'correction' && entry.objectiveId === first.primaryObjectiveId)).toBe(false);
  });

  it('refuses an answer for a question that is not on screen, and answers after completion', () => {
    const state = make(4);
    const other = state.pool.find((frozen) => frozen.question.id !== state.queue[0].questionId)!;
    expect(() => recordPracticeAnswer(state, other.question.id, WRONG)).toThrow(TextbookRuleError);
    const { state: done } = runToEnd(state, () => true);
    expect(() => recordPracticeAnswer(done, done.pool[0].question.id, WRONG)).toThrow(/lõpetatud/u);
  });
});

describe('exhausted pools terminate', () => {
  it('an objective with a single question reuses it, but never back to back', () => {
    const pool = [fixtureQuestion({ id: 'only', objective: 'o1' }), fixtureQuestion({ id: 'x1', objective: 'o2' }), fixtureQuestion({ id: 'x2', objective: 'o2' })];
    let state = createPracticeState({ courseId: 'c1', unit: fixtureUnit(pool, ['o1', 'o2']), settings: { practiceTarget: 2 }, seed: 1 });
    const asked: string[] = [];
    for (let step = 0; step < 25; step++) {
      const current = currentPracticeQuestion(state)!.question;
      asked.push(current.id);
      state = recordPracticeAnswer(state, current.id, current.id === 'only' ? WRONG : correctFor(state)).state;
    }
    expect(state.completed).toBe(false);
    expect(asked.filter((id) => id === 'only').length).toBeGreaterThan(5);
    for (let index = 1; index < asked.length; index++) expect(asked[index]).not.toBe(asked[index - 1]);
    const { state: done } = runToEnd(state, () => true);
    expect(done.completed).toBe(true);
  });

  it('a one-question pool repeats the question (nothing else exists) and ends when correct', () => {
    let state = createPracticeState({ courseId: 'c1', unit: fixtureUnit([fixtureQuestion({ id: 'solo', objective: 'o1' })], ['o1']), settings: { practiceTarget: 12 }, seed: 1 });
    for (let step = 0; step < 10; step++) state = answer(state, false).state;
    expect(currentPracticeQuestion(state)!.question.id).toBe('solo');
    state = answer(state, true).state;
    expect(state.completed).toBe(true);
  });

  it('property: random pools and answers always terminate within queue length + 2 once answers turn correct', () => {
    for (let seed = 1; seed <= 150; seed++) {
      const rng = seededRng(seed);
      const objectives = ['a', 'b', 'c', 'd'].slice(0, 1 + Math.floor(rng() * 4));
      const pool = randomPool(rng, 2 + Math.floor(rng() * 10), objectives);
      // Every objective needs at least one practice question for a normal run.
      for (const objective of objectives) pool.push(fixtureQuestion({ id: `extra-${objective}`, objective, group: `ge-${objective}` }));
      let state = createPracticeState({ courseId: 'c1', unit: fixtureUnit(pool, objectives), settings: { practiceTarget: 1 + Math.floor(rng() * 12) }, seed });
      const wrongSteps = Math.floor(rng() * 40);
      let previous: string | null = null;
      for (let step = 0; step < wrongSteps && !state.completed; step++) {
        const current = currentPracticeQuestion(state)!.question;
        if (pool.length > 1) expect(current.id).not.toBe(previous);
        previous = current.id;
        state = recordPracticeAnswer(state, current.id, rng() < 0.5 ? correctFor(state) : WRONG).state;
        // A satisfied objective was answered correctly on its primary question.
        for (const id of state.satisfiedObjectiveIds) {
          expect(state.answers.some((record) => record.objectiveId === id && record.correct)).toBe(true);
        }
      }
      const bound = state.queue.length + 2;
      const { asked } = runToEnd(state, () => true, bound);
      expect(asked.length).toBeLessThanOrEqual(bound);
    }
  });
});

describe('serialisation and targeted mode', () => {
  it('resumes from JSON with unresolved objectives intact and continues identically', () => {
    const unit = course.units[0];
    let live = createPracticeState({ courseId: course.id, unit, settings: course.settings, seed: 21 });
    for (let step = 0; step < 5; step++) live = answer(live, step % 2 === 0).state;
    const stored = JSON.stringify(live);
    let resumed = parsePracticeState(stored);
    expect(unresolvedObjectiveIds(resumed)).toEqual(unresolvedObjectiveIds(live));
    expect(currentPracticeQuestion(resumed)!.question.id).toBe(currentPracticeQuestion(live)!.question.id);
    for (let step = 0; step < 6; step++) {
      live = answer(live, step % 3 !== 0).state;
      resumed = answer(resumed, step % 3 !== 0).state;
    }
    expect(JSON.stringify(resumed)).toBe(JSON.stringify(live));
    expect(() => parsePracticeState('{"kind":"test"}')).toThrow(TextbookRuleError);
  });

  it('targeted practice covers only the missed objectives and prefers questions not in the failed test', () => {
    const unit = course.units[0];
    const missed = ['demo-vesi-o2', 'demo-vesi-o4'];
    const avoid = unit.questions.filter((question) => question.primaryObjectiveId === 'demo-vesi-o2').slice(0, 3).map((question) => question.id);
    const state = createPracticeState({ courseId: course.id, unit, settings: course.settings, seed: 2, mode: 'targeted', objectiveIds: missed, avoidQuestionIds: avoid });
    expect(state.mode).toBe('targeted');
    expect(state.objectiveIds).toEqual(missed);
    expect(state.queue).toHaveLength(2);
    expect(state.queue.every((entry) => missed.includes(entry.objectiveId))).toBe(true);
    expect(state.queue.some((entry) => avoid.includes(entry.questionId))).toBe(false);
    const { state: done, asked } = runToEnd(state, () => true);
    expect(asked).toHaveLength(2);
    expect(done.satisfiedObjectiveIds.sort()).toEqual([...missed].sort());
  });

  it('targeted mode skips objectives without practice questions', () => {
    const unit = fixtureUnit([fixtureQuestion({ id: 'q1', objective: 'o1' }), fixtureQuestion({ id: 'q2', objective: 'o1' })], ['o1', 'o2']);
    const state = createPracticeState({ courseId: 'c1', unit, settings: { practiceTarget: 5 }, seed: 1, mode: 'targeted', objectiveIds: ['o1', 'o2'] });
    expect(state.objectiveIds).toEqual(['o1']);
    expect(state.skippedObjectiveIds).toEqual(['o2']);
    const empty = createPracticeState({ courseId: 'c1', unit, settings: { practiceTarget: 5 }, seed: 1, mode: 'targeted', objectiveIds: ['o2'] });
    expect(empty.completed).toBe(true);
    expect(() => createPracticeState({ courseId: 'c1', unit, settings: { practiceTarget: 5 }, seed: 1 })).toThrow(TextbookRuleError);
  });
});
