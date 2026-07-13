import type { GeneratedQuestion, QuestionResult } from '@/lib/types';
import { isAnswerCorrect } from '@/lib/validation';

export type MathAnswerSnapshot = Readonly<{
  answers: readonly string[];
  orderingAnswers: ReadonlyArray<readonly string[]>;
  choiceAnswers: readonly string[];
}>;

export function mathChoiceLabels(question: GeneratedQuestion) {
  const options = question.choiceOptions;
  if (!options?.length) {
    return [question.correctAnswer === -1 ? '<' : question.correctAnswer === 0 ? '=' : '>'];
  }

  const indexes = question.correctAnswers?.length ? question.correctAnswers : [question.correctAnswer];
  return indexes.map((index) => options[index]).filter((answer): answer is string => Boolean(answer));
}

export function buildMathQuestionResults(
  questions: readonly GeneratedQuestion[],
  snapshot: MathAnswerSnapshot,
  isTextAnswerCorrect: (answer: string, question: GeneratedQuestion) => boolean
): QuestionResult[] {
  return questions.map((question, index) => {
    if (question.kind === 'ordering') {
      const orderedCards = [...(question.orderingCards ?? [])]
        .sort((a, b) => question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm);
      const expectedIds = orderedCards.map((card) => card.id);
      const userOrder = snapshot.orderingAnswers[index] ?? [];
      const labelMap = new Map((question.orderingCards ?? []).map((card) => [card.id, card.label]));
      return {
        ...question,
        userAnswer: userOrder.map((id) => labelMap.get(id) ?? id).join(' → '),
        isCorrect: JSON.stringify(userOrder) === JSON.stringify(expectedIds),
        correctAnswer: 0
      };
    }
    if (question.kind === 'choice') {
      const answer = snapshot.choiceAnswers[index] ?? '';
      return { ...question, userAnswer: answer, isCorrect: mathChoiceLabels(question).includes(answer) };
    }
    const answer = snapshot.answers[index] ?? '';
    if (question.kind === 'text') {
      return { ...question, userAnswer: answer, correctAnswer: 0, isCorrect: isTextAnswerCorrect(answer, question) };
    }
    return { ...question, userAnswer: answer, isCorrect: isAnswerCorrect(answer, question.correctAnswer) };
  });
}
