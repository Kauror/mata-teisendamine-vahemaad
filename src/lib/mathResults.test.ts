import { describe, expect, it } from 'vitest';
import { buildMathQuestionResults } from '@/lib/mathResults';
import type { GeneratedQuestion } from '@/lib/types';

const numeric = (id: string, correctAnswer: number): GeneratedQuestion => ({
  id,
  category: 'Arvutamine',
  difficulty: 'Lihtne',
  question: id,
  correctAnswer
});

describe('immutable mathematics answer snapshots', () => {
  it('scores and persists the exact final numeric answers in the supplied snapshot', () => {
    const staleAnswers = ['old', 'old', 'old'];
    const finalAnswers = ['12', '-4', '2,5'];
    const results = buildMathQuestionResults(
      [numeric('correct', 12), numeric('negative', 4), numeric('decimal-comma', 2.5)],
      { answers: finalAnswers, orderingAnswers: [[], [], []], choiceAnswers: ['', '', ''] },
      () => false
    );

    expect(staleAnswers).toEqual(['old', 'old', 'old']);
    expect(results.map(({ userAnswer, isCorrect }) => ({ userAnswer, isCorrect }))).toEqual([
      { userAnswer: '12', isCorrect: true },
      { userAnswer: '-4', isCorrect: false },
      { userAnswer: '2,5', isCorrect: true }
    ]);
  });
});
