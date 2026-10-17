import { describe, expect, it } from 'vitest';
import { textbookDemoCourse } from '@/content/textbook/textbook-demo';
import { TextbookRuleError } from '@/lib/textbook/errors';
import { correctResponseFor } from '@/lib/textbook/grading';
import { buildTestSnapshot } from '@/lib/textbook/testSelection';
import { answeredCount, createTestState, saveTestAnswer, submitTest, unansweredQuestionIds, type TestRunState } from '@/lib/textbook/testSession';
import type { AnswerResponse, AnswerSpec } from '@/lib/textbook/types';

const course = textbookDemoCourse;
const unit = course.units[0];

// A complete but wrong response of the right shape.
function wrongResponse(answer: AnswerSpec): AnswerResponse {
  switch (answer.type) {
    case 'single_choice':
      return { type: 'single_choice', optionId: answer.options.find((option) => option.id !== answer.correctOptionId)!.id };
    case 'multiple_selection':
      return { type: 'multiple_selection', optionIds: answer.options.filter((option) => !answer.correctOptionIds.includes(option.id)).map((option) => option.id) };
    case 'matching': {
      const prompts = answer.prompts.map((prompt) => prompt.id);
      const pairs = Object.fromEntries(prompts.map((prompt, index) => [prompt, answer.correctPairs[prompts[(index + 1) % prompts.length]]]));
      return { type: 'matching', pairs };
    }
    case 'grouping': {
      const [first, second] = answer.groups.map((group) => group.id);
      return { type: 'grouping', assignments: Object.fromEntries(answer.items.map((item) => [item.id, answer.correctGroupByItem[item.id] === first ? second : first])) };
    }
    case 'ordering':
      return { type: 'ordering', order: [...answer.correctOrder].reverse() };
    case 'diagram_hotspot':
      return { type: 'diagram_hotspot', regionId: answer.regionIds!.find((id) => id !== answer.correctRegionId)! };
  }
}

function answerAll(state: TestRunState, wrongCount: number) {
  let current = state;
  state.snapshot.questions.forEach((frozen, index) => {
    const response = index < wrongCount ? wrongResponse(frozen.question.answer) : correctResponseFor(frozen.question.answer);
    current = saveTestAnswer(current, frozen.question.id, response);
  });
  return current;
}

const fresh = (seed = 1) => createTestState(buildTestSnapshot({ courseId: course.id, unit, settings: course.settings, seed }));

describe('final test session', () => {
  it('19/20 passes', () => {
    const { result } = submitTest(answerAll(fresh(), 1));
    expect(result).toMatchObject({ correct: 19, total: 20, requiredCorrect: 19, passed: true, percent: 95 });
    expect(result.missedObjectiveIds).toHaveLength(1);
  });

  it('18/20 fails and lists the missed objectives', () => {
    const state = answerAll(fresh(2), 2);
    const { result, state: submitted } = submitTest(state);
    expect(result).toMatchObject({ correct: 18, total: 20, passed: false, percent: 90 });
    const missedPrimaries = state.snapshot.questions.slice(0, 2).map((frozen) => frozen.question.primaryObjectiveId);
    expect(result.missedObjectiveIds).toEqual([...new Set(missedPrimaries)]);
    expect(result.missedQuestionIds).toEqual(state.snapshot.questions.slice(0, 2).map((frozen) => frozen.question.id));
    expect(submitted.submitted).toBe(true);
  });

  it('all 20 must be answered before submit', () => {
    let state = fresh(3);
    for (const frozen of state.snapshot.questions.slice(0, 19)) state = saveTestAnswer(state, frozen.question.id, correctResponseFor(frozen.question.answer));
    expect(answeredCount(state)).toBe(19);
    expect(unansweredQuestionIds(state)).toHaveLength(1);
    expect(() => submitTest(state)).toThrow(TextbookRuleError);
  });

  it('answers can be changed before submit; nothing after', () => {
    let state = answerAll(fresh(4), 20);
    for (const frozen of state.snapshot.questions) state = saveTestAnswer(state, frozen.question.id, correctResponseFor(frozen.question.answer));
    const { state: submitted, result } = submitTest(state);
    expect(result.correct).toBe(20);
    expect(() => submitTest(submitted)).toThrow(/esitatud/u);
    expect(() => saveTestAnswer(submitted, submitted.snapshot.questions[0].question.id, correctResponseFor(submitted.snapshot.questions[0].question.answer))).toThrow(TextbookRuleError);
  });

  it('refuses unknown questions, malformed and incomplete responses', () => {
    const state = fresh(5);
    const frozen = state.snapshot.questions[0];
    expect(() => saveTestAnswer(state, 'nope', correctResponseFor(frozen.question.answer))).toThrow(/küsimust/u);
    expect(() => saveTestAnswer(state, frozen.question.id, { type: 'other' })).toThrow(TextbookRuleError);
    const matching = state.snapshot.questions.find((item) => item.question.answer.type === 'matching');
    if (matching) expect(() => saveTestAnswer(state, matching.question.id, { type: 'matching', pairs: {} })).toThrow(/lõpuni/u);
  });

  it('a submitted round keeps its questions and keys even if the content changes later', () => {
    const editable = structuredClone(unit);
    const state = answerAll(createTestState(buildTestSnapshot({ courseId: course.id, unit: editable, settings: course.settings, seed: 6 })), 0);
    const { state: submitted } = submitTest(state);
    const stored = JSON.stringify(submitted);
    for (const question of editable.questions) question.answer = { type: 'single_choice', options: [{ id: 'z', text: 'z' }, { id: 'y', text: 'y' }], correctOptionId: 'z' };
    expect(JSON.stringify(submitted)).toBe(stored);
    expect(submitted.result!.correct).toBe(20);
  });
});
