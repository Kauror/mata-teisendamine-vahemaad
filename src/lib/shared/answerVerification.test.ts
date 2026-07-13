import { describe, expect, it } from 'vitest';
import { normalizeMathAnswer, verifyGeneratedMathAnswer, verifyMathTextAnswer } from '@/lib/shared/answerVerification';
import type { GeneratedQuestion } from '@/lib/types';

function textQuestion(correctAnswerText: string, acceptedAnswers: string[] = []): GeneratedQuestion {
  return {
    id: 'text', category: 'Tekstülesanded', difficulty: 'Lihtne', question: 'Vasta', correctAnswer: 0,
    kind: 'text', correctAnswerText, acceptedAnswers
  };
}

describe('shared mathematics answer verification', () => {
  it.each([
    ['3 m 20 cm', '3 m 20 cm', true],
    ['3 m 20 cm', '  3m   20cm ', true],
    ['3 m 20 cm', '3 meetrit ja 20 sentimeetrit', true],
    ['3 m 20 cm', '3 km 20 mm', false],
    ['3 m 20 cm', '3 m 20 mm', false],
    ['2,5 kg', '2.5 kg', true],
    ['2,5 kg', '2,5 g', false]
  ])('compares %s with %s', (expected, submitted, correct) => {
    expect(verifyMathTextAnswer(textQuestion(expected), submitted)).toBe(correct);
  });

  it('normalizes Unicode, Estonian case, and repeated whitespace', () => {
    expect(normalizeMathAnswer('  O\u0303IGE   VASTUS ')).toBe(normalizeMathAnswer('õige vastus'));
  });

  it('accepts only explicitly configured textual and clock aliases', () => {
    expect(verifyMathTextAnswer(textQuestion('Eve', ['Eevike']), 'EEVIKE')).toBe(true);
    expect(verifyMathTextAnswer(textQuestion('15:05', ['15.05']), '15.05')).toBe(true);
    expect(verifyMathTextAnswer(textQuestion('15:05'), '15.05')).toBe(false);
  });

  it('verifies ordering and comparison choices through the same entry point', () => {
    const ordering = {
      id: 'order', category: 'Järjestamine', difficulty: 'Lihtne', question: 'Järjesta', correctAnswer: 0,
      kind: 'ordering', orderingDirection: 'asc', orderingCards: [
        { id: 'b', label: '2 cm', valueMm: 20 }, { id: 'a', label: '10 mm', valueMm: 10 }
      ]
    } satisfies GeneratedQuestion;
    const comparison = {
      id: 'compare', category: 'Võrdlemine', difficulty: 'Lihtne', question: 'Võrdle', correctAnswer: -1,
      kind: 'choice'
    } satisfies GeneratedQuestion;
    expect(verifyGeneratedMathAnswer(ordering, '10 mm → 2 cm')).toBe(true);
    expect(verifyGeneratedMathAnswer(ordering, '2 cm → 10 mm')).toBe(false);
    expect(verifyGeneratedMathAnswer(comparison, '<')).toBe(true);
    expect(verifyGeneratedMathAnswer(comparison, '>')).toBe(false);
  });
});
