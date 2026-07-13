import type { GeneratedQuestion, QuestionResult } from '@/lib/types';
import { mathChoiceAnswerLabels, verifyGeneratedMathAnswer } from '@/lib/shared/answerVerification';

export type MathAnswerSnapshot = Readonly<{
  answers: readonly string[];
  orderingAnswers: ReadonlyArray<readonly string[]>;
  choiceAnswers: readonly string[];
}>;

export const mathChoiceLabels = mathChoiceAnswerLabels;

export function buildMathQuestionResults(
  questions: readonly GeneratedQuestion[],
  snapshot: MathAnswerSnapshot
): QuestionResult[] {
  return questions.map((question, index) => {
    if (question.kind === 'ordering') {
      const userOrder = snapshot.orderingAnswers[index] ?? [];
      const labelMap = new Map((question.orderingCards ?? []).map((card) => [card.id, card.label]));
      const userLabels = userOrder.map((id) => labelMap.get(id) ?? id);
      return {
        ...question,
        userAnswer: userLabels.join(' → '),
        isCorrect: verifyGeneratedMathAnswer(question, userLabels.join('|')),
        correctAnswer: 0
      };
    }
    if (question.kind === 'choice') {
      const answer = snapshot.choiceAnswers[index] ?? '';
      return { ...question, userAnswer: answer, isCorrect: verifyGeneratedMathAnswer(question, answer) };
    }
    const answer = snapshot.answers[index] ?? '';
    if (question.kind === 'text') {
      return { ...question, userAnswer: answer, correctAnswer: 0, isCorrect: verifyGeneratedMathAnswer(question, answer) };
    }
    return { ...question, userAnswer: answer, isCorrect: verifyGeneratedMathAnswer(question, answer) };
  });
}
