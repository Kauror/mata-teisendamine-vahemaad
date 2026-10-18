import { describe, expect, it } from 'vitest';
import { TEXTBOOK_COURSES } from '@/content/textbook/registry';
import { seededRng, shuffleWithRng, type RNG } from '@/lib/random';
import { toClientQuestion } from '@/lib/textbook/clientQuestion';
import { correctResponseFor, gradeAnswer, hotspotRegionIds, isResponseComplete, parseResponse } from '@/lib/textbook/grading';
import { createPracticeState, currentPracticeQuestion, practiceProgress, recordPracticeAnswer } from '@/lib/textbook/practiceScheduler';
import { freezeQuestionWithSeed } from '@/lib/textbook/presentation';
import { buildTestSnapshot, historyFromSnapshots, type TestSnapshot } from '@/lib/textbook/testSelection';
import type { AnswerResponse, AnswerSpec, Course, Question } from '@/lib/textbook/types';
import { isDraftComplete } from '@/app/components/textbook/responses';

const real = TEXTBOOK_COURSES.find((course) => course.id === 'loodusopetus-opik') as Course;
const readyUnits = real.units.filter((unit) => unit.status === 'ready');

function randomResponse(rng: RNG, answer: AnswerSpec): unknown {
  const pick = <T,>(items: readonly T[]) => items[Math.floor(rng() * items.length)];
  const subset = <T,>(items: readonly T[]) => items.filter(() => rng() < 0.5);
  switch (answer.type) {
    case 'single_choice':
      return { type: answer.type, optionId: pick(answer.options).id };
    case 'multiple_selection':
      return { type: answer.type, optionIds: shuffleWithRng(rng, subset(answer.options.map((option) => option.id))) };
    case 'matching': {
      const choices = shuffleWithRng(rng, answer.choices.map((choice) => choice.id));
      return { type: answer.type, pairs: Object.fromEntries(subset(answer.prompts).map((prompt, index) => [prompt.id, choices[index]])) };
    }
    case 'grouping':
      return { type: answer.type, assignments: Object.fromEntries(subset(answer.items).map((item) => [item.id, pick(answer.groups).id])) };
    case 'ordering': {
      const order = shuffleWithRng(rng, answer.items.map((item) => item.id));
      return { type: answer.type, order: rng() < 0.3 ? order.slice(1) : order };
    }
    case 'diagram_hotspot':
      return { type: answer.type, regionId: pick(hotspotRegionIds(answer)) };
  }
}

// Property checks of the pure engine over every ready unit of the real course
// (Units 15–21 are covered automatically once they turn ready). Each test has
// a generous timeout because the pool grows with every unit.
const SLOW = 60_000;

describe('engine audit on the real ready units', () => {
  it('UI completeness and server completeness agree, and only a complete answer can be correct', () => {
    const rng = seededRng(42);
    for (const unit of readyUnits) {
      for (const question of unit.questions) {
        const view = toClientQuestion(freezeQuestionWithSeed(question, 7)).answer;
        for (let round = 0; round < 12; round++) {
          const raw = randomResponse(rng, question.answer);
          const parsed = parseResponse(question.answer, raw);
          const server = isResponseComplete(question.answer, raw);
          expect(isDraftComplete(view, parsed), `${question.id} ${JSON.stringify(raw)}`).toBe(server);
          if (gradeAnswer(question, raw).correct) expect(server, question.id).toBe(true);
        }
        expect(isDraftComplete(view, correctResponseFor(question.answer)), question.id).toBe(true);
      }
    }
  }, SLOW);

  it('a frozen ordering question never starts solved', () => {
    for (const unit of readyUnits) {
      for (const question of unit.questions.filter((item) => item.answer.type === 'ordering')) {
        for (let seed = 0; seed < 40; seed++) {
          const frozen = freezeQuestionWithSeed(question, seed);
          expect(frozen.order.items, question.id).not.toEqual((question.answer as Extract<AnswerSpec, { type: 'ordering' }>).correctOrder);
        }
      }
    }
  }, SLOW);

  it('strict tests for many seeds and three retakes, distinct groups, 8/7/5, full coverage', () => {
    for (const unit of readyUnits) {
      const required = unit.objectives.filter((objective) => objective.required).map((objective) => objective.id);
      for (let seed = 1; seed <= 3; seed++) {
        const history: TestSnapshot[] = [];
        for (let attempt = 0; attempt < 3; attempt++) {
          const snapshot = buildTestSnapshot({ courseId: real.id, unit, settings: real.settings, seed: seed * 100 + attempt, history: historyFromSnapshots(history) });
          const questions = snapshot.questions.map((frozen) => frozen.question);
          expect(snapshot.relaxations, unit.id).toEqual([]);
          expect(new Set(questions.map((question) => question.variantGroupId)).size).toBe(20);
          expect(snapshot.levelCounts).toEqual({ factual: 8, understanding: 7, application: 5 });
          for (const id of required) expect(questions.some((question) => question.primaryObjectiveId === id)).toBe(true);
          history.push(snapshot);
        }
      }
    }
  }, SLOW);

  it('practice with random mistakes terminates, satisfies every objective and keeps honest counters', () => {
    for (const unit of readyUnits) {
      for (let seed = 1; seed <= 4; seed++) {
        const rng = seededRng(seed * 31);
        let state = createPracticeState({ courseId: real.id, unit, settings: real.settings, seed });
        let previous: string | null = null;
        for (let step = 0; !state.completed; step++) {
          expect(step, unit.id).toBeLessThan(400);
          const progress = practiceProgress(state);
          expect(progress.currentQuestionNumber).toBe(state.answers.length + 1);
          expect(progress.totalQuestionCount).toBe(state.answers.length + state.queue.length);
          const current = currentPracticeQuestion(state)!;
          expect(current.question.id).not.toBe(previous);
          previous = current.question.id;
          const wrong = step < 40 && rng() < 0.5;
          const response: AnswerResponse = wrong ? (randomResponse(rng, current.question.answer) as AnswerResponse) : correctResponseFor(current.question.answer);
          state = recordPracticeAnswer(state, current.question.id, response).state;
        }
        for (const id of state.objectiveIds) {
          expect(state.answers.some((answer) => answer.correct && answer.objectiveId === id && unit.questions.find((q: Question) => q.id === answer.questionId)!.primaryObjectiveId === id)).toBe(true);
        }
      }
    }
  }, SLOW);
});
