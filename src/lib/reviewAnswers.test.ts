import { describe, expect, it } from 'vitest';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import type { GeneratedQuestion } from '@/lib/types';
import {
  NEUTRAL_REVIEW_CONTEXT,
  resolveCorrectAnswer,
  resolveCorrectOrder,
  reviewContext,
  type ReviewQuestion
} from '@/lib/reviewAnswers';

// A saved question shows a usable correct answer when it is neither empty nor the
// "no answer" placeholder. This is exactly what the review screens print.
function shownCorrectAnswer(q: GeneratedQuestion): string {
  if (q.kind === 'ordering') return resolveCorrectOrder(q as ReviewQuestion);
  return resolveCorrectAnswer(q as ReviewQuestion, NEUTRAL_REVIEW_CONTEXT);
}

describe('resolveCorrectAnswer for generated maths sessions', () => {
  // The reported bug: the "Ring ja ringjoon" exercise showed no correct answer on
  // the result / history screens. Every generated question must resolve to a real
  // answer, across several seeds so every internal question type is exercised.
  it('shows a correct answer for every "Ring ja ringjoon" question', () => {
    for (let seed = 1; seed <= 40; seed++) {
      const session = generateKiurMathSession('ring-ja-ringjoon', 'Segaharjutus', 'Lihtne', 15, seed);
      expect(session.length).toBe(15);
      for (const q of session) {
        const shown = shownCorrectAnswer(q);
        expect(shown, `seed ${seed}: "${q.question}"`).toBeTruthy();
        expect(shown, `seed ${seed}: "${q.question}"`).not.toBe('—');
      }
    }
  });

  it('shows a correct answer for every question of the other Kiur maths topics', () => {
    const topics: Array<[string, string]> = [
      ['mustrid', 'Segaharjutus'],
      ['jagamine-kahekohaline-uhekohaline', 'Segaharjutus'],
      ['arvud-10000-piires', 'Segaharjutus'],
      ['mootuhikud-pikkused', 'Segaharjutus']
    ];
    for (const [topic, category] of topics) {
      for (let seed = 1; seed <= 20; seed++) {
        const session = generateKiurMathSession(topic, category, 'Lihtne', 15, seed);
        for (const q of session) {
          const shown = shownCorrectAnswer(q);
          expect(shown, `${topic} seed ${seed}: "${q.question}"`).toBeTruthy();
          expect(shown, `${topic} seed ${seed}: "${q.question}"`).not.toBe('—');
        }
      }
    }
  });
});

describe('resolveCorrectAnswer by question shape', () => {
  it('resolves a single-choice answer from choiceOptions', () => {
    expect(resolveCorrectAnswer({ kind: 'choice', choiceOptions: ['Ring', 'Ringjoon'], correctAnswer: 1 })).toBe('Ringjoon');
  });

  it('joins multi-select answers with a slash', () => {
    expect(resolveCorrectAnswer({ kind: 'choice', choiceOptions: ['km', 'm', 'dm', 'cm', 'mm'], correctAnswer: 2, correctAnswers: [2, 3, 4] })).toBe('dm / cm / mm');
  });

  it('resolves comparison signs when a choice has no explicit options', () => {
    expect(resolveCorrectAnswer({ kind: 'choice', correctAnswer: 0 })).toBe('=');
    expect(resolveCorrectAnswer({ kind: 'choice', correctAnswer: -1 })).toBe('<');
    expect(resolveCorrectAnswer({ kind: 'choice', correctAnswer: 1 })).toBe('>');
  });

  it('resolves a plain numeric answer, including zero', () => {
    expect(resolveCorrectAnswer({ correctAnswer: 10 })).toBe('10');
    expect(resolveCorrectAnswer({ correctAnswer: 0 })).toBe('0');
  });

  it('prefers correctAnswerText when present', () => {
    expect(resolveCorrectAnswer({ correctAnswer: 3, correctAnswerText: '2 km 300 m' })).toBe('2 km 300 m');
  });

  it('uses correctWord for Kirsi reading', () => {
    const ctx = reviewContext({ learner: 'kirsi', subject: 'lugemine', category: 'Lugemine' });
    expect(resolveCorrectAnswer({ correctWord: 'kass' }, ctx)).toBe('kass');
  });

  it('uses the English word-pair label', () => {
    const ctx = reviewContext({ learner: 'kiur', subject: 'inglise-keel', category: 'Inglise keel' });
    expect(resolveCorrectAnswer({ estonian: 'kass' }, ctx)).toBe('Sõnapaar sobib');
  });

  it('falls back to the placeholder when nothing is known', () => {
    expect(resolveCorrectAnswer({})).toBe('—');
  });
});

describe('resolveCorrectOrder', () => {
  const cards = [
    { id: 'a', label: '3 cm', valueMm: 30 },
    { id: 'b', label: '12 mm', valueMm: 12 },
    { id: 'c', label: '5 cm', valueMm: 50 }
  ];

  it('sorts ascending by value', () => {
    expect(resolveCorrectOrder({ kind: 'ordering', orderingCards: cards, orderingDirection: 'asc' })).toBe('12 mm → 3 cm → 5 cm');
  });

  it('sorts descending by value', () => {
    expect(resolveCorrectOrder({ kind: 'ordering', orderingCards: cards, orderingDirection: 'desc' })).toBe('5 cm → 3 cm → 12 mm');
  });
});
