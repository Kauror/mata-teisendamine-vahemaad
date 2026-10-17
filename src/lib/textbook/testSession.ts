// The final test as a pure state machine over a frozen TestSnapshot. Answers
// are saved without feedback (and may be changed until submit); submit
// requires every question answered completely and grades the whole round at
// once. Every function returns a new state.

import { TextbookRuleError } from '@/lib/textbook/errors';
import { gradeAnswer,isResponseComplete, parseResponse } from '@/lib/textbook/grading';
import { displayPercent, passes } from '@/lib/textbook/scoring';
import type { TestSnapshot } from '@/lib/textbook/testSelection';
import type { AnswerResponse } from '@/lib/textbook/types';

export type TestQuestionResult = {
  questionId: string;
  primaryObjectiveId: string;
  variantGroupId: string;
  correct: boolean;
  response: AnswerResponse;
  correctResponse: AnswerResponse;
};

export type TestResult = {
  correct: number;
  total: number;
  requiredCorrect: number;
  passed: boolean;
  // Display only (rounded down).
  percent: number;
  questions: TestQuestionResult[];
  // Primary objectives of the wrongly answered questions, in first-miss order.
  missedObjectiveIds: string[];
  missedQuestionIds: string[];
};

export type TestRunState = {
  kind: 'test_run';
  version: 1;
  snapshot: TestSnapshot;
  answers: Record<string, AnswerResponse>;
  submitted: boolean;
  result: TestResult | null;
};

export function createTestState(snapshot: TestSnapshot): TestRunState {
  return { kind: 'test_run', version: 1, snapshot, answers: {}, submitted: false, result: null };
}

function findQuestion(state: TestRunState, questionId: string) {
  const frozen = state.snapshot.questions.find((item) => item.question.id === questionId);
  if (!frozen) throw new TextbookRuleError('unknown_question', 'Seda küsimust selles testis ei ole.');
  return frozen;
}

// Save (or replace) one answer. No grading, no feedback.
export function saveTestAnswer(state: TestRunState, questionId: string, raw: unknown): TestRunState {
  if (state.submitted) throw new TextbookRuleError('already_submitted', 'Test on juba esitatud.');
  const frozen = findQuestion(state, questionId);
  const response = parseResponse(frozen.question.answer, raw);
  if (!response) throw new TextbookRuleError('invalid_response', 'Vastus ei sobi selle küsimusega.');
  if (!isResponseComplete(frozen.question.answer, response)) throw new TextbookRuleError('incomplete_response', 'Vasta küsimusele lõpuni.');
  return { ...state, answers: { ...state.answers, [questionId]: response } };
}

export function answeredCount(state: TestRunState): number {
  return state.snapshot.questions.filter((frozen) => frozen.question.id in state.answers).length;
}

export function unansweredQuestionIds(state: TestRunState): string[] {
  return state.snapshot.questions.filter((frozen) => !(frozen.question.id in state.answers)).map((frozen) => frozen.question.id);
}

// Grade the whole round. Every question must have a saved answer.
export function submitTest(state: TestRunState): { state: TestRunState; result: TestResult } {
  if (state.submitted || state.result) throw new TextbookRuleError('already_submitted', 'Test on juba esitatud.');
  const missing = unansweredQuestionIds(state);
  if (missing.length > 0) throw new TextbookRuleError('not_all_answered', 'Vasta enne esitamist kõigile küsimustele.');

  const questions: TestQuestionResult[] = state.snapshot.questions.map((frozen) => {
    const response = state.answers[frozen.question.id];
    const grade = gradeAnswer(frozen.question, response);
    return {
      questionId: frozen.question.id,
      primaryObjectiveId: frozen.question.primaryObjectiveId,
      variantGroupId: frozen.question.variantGroupId,
      correct: grade.correct,
      response,
      correctResponse: grade.correctResponse
    };
  });
  const correct = questions.filter((item) => item.correct).length;
  const total = questions.length;
  const rule = { passNumerator: state.snapshot.passNumerator, passDenominator: state.snapshot.passDenominator };
  const missed = questions.filter((item) => !item.correct);
  const result: TestResult = {
    correct,
    total,
    requiredCorrect: state.snapshot.requiredCorrect,
    passed: total === state.snapshot.testLength && passes(correct, total, rule),
    percent: displayPercent(correct, total),
    questions,
    missedObjectiveIds: [...new Set(missed.map((item) => item.primaryObjectiveId))],
    missedQuestionIds: missed.map((item) => item.questionId)
  };
  return { state: { ...state, submitted: true, result }, result };
}
