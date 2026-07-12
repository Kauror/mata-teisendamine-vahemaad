import { describe, expect, it } from 'vitest';
import { generateKiurMathSession } from '@/lib/exercises/kiurMath';
import { KIRSI_FIRST_SOUND_TASKS } from '@/lib/kirsiFirstSoundTasks';
import { AttemptContractError, recomputeScore } from '@/lib/server/attempts/scoreVerifier';
import type { GeneratedQuestion } from '@/lib/types';

function answerFor(question: GeneratedQuestion) {
  if (question.kind === 'ordering' && question.orderingCards) {
    return [...question.orderingCards]
      .sort((a, b) => question.orderingDirection === 'desc' ? b.valueMm - a.valueMm : a.valueMm - b.valueMm)
      .map((card) => card.label)
      .join(' → ');
  }
  if (question.kind === 'choice' && question.choiceOptions) return question.choiceOptions[question.correctAnswer];
  if (question.kind === 'text' || question.correctAnswerText) return question.correctAnswerText;
  return String(question.correctAnswer);
}

describe('server-owned score recomputation', () => {
  it('regenerates math questions and ignores forged score/isCorrect flags', () => {
    const expected = generateKiurMathSession('pikkused', 'Teisendamine', 'Lihtne', 5, 42);
    const results = expected.map((question, index) => ({
      ...question,
      userAnswer: index === 0 ? 'definitely wrong' : answerFor(question),
      isCorrect: true
    }));
    const verified = recomputeScore({
      runnerId: 'math', learner: 'kiur', subject: 'matemaatika', topic: 'pikkused', category: 'Teisendamine',
      difficulty: 'Lihtne', seed: 42, questionIds: expected.map((question) => question.id), questions: results
    });
    expect(verified.score).toBe(4);
    expect(verified.isCorrect[0]).toBe(false);
  });

  it('rejects a changed generated question payload', () => {
    const expected = generateKiurMathSession('pikkused', 'Teisendamine', 'Lihtne', 1, 42);
    expect(() => recomputeScore({
      runnerId: 'math', learner: 'kiur', subject: 'matemaatika', topic: 'pikkused', category: 'Teisendamine',
      difficulty: 'Lihtne', seed: 42, questionIds: [expected[0].id], questions: [{ ...expected[0], question: 'forged', userAnswer: '0' }]
    })).toThrowError(AttemptContractError);
  });

  it('uses the fixed first-sound dataset instead of client isCorrect', () => {
    const tasks = KIRSI_FIRST_SOUND_TASKS.slice(0, 2);
    const verified = recomputeScore({
      runnerId: 'kirsi-first-sound', learner: 'kirsi', subject: 'lugemine', topic: 'esimene-haalik', category: 'first',
      difficulty: 'normal', seed: 1, questionIds: tasks.map((task) => task.id), questions: tasks.map((task, index) => ({
        id: task.id, selectedLetter: index === 0 ? task.correctLetter : '!', isCorrect: true
      }))
    });
    expect(verified.score).toBe(1);
  });
});
