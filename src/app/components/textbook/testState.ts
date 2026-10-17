// Pure helpers for the test runner: where a resumed test opens and how many
// questions count as answered (saved on the server, or answered on screen and
// about to be saved).

import type { TestSessionView } from '@/lib/textbook/api';
import { isDraftComplete, type AnswerDraft } from '@/app/components/textbook/responses';

export function firstOpenQuestion(view: Pick<TestSessionView, 'questions' | 'answers'>): number {
  const index = view.questions.findIndex((question) => !view.answers[question.id]);
  return index === -1 ? 0 : index;
}

export function testAnsweredCount(view: Pick<TestSessionView, 'questions'>, draftFor: (questionId: string) => AnswerDraft): number {
  return view.questions.filter((question) => isDraftComplete(question.answer, draftFor(question.id))).length;
}
