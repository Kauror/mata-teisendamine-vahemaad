import { describe, expect, it } from 'vitest';
import { completedTodayFromHistory, type ClientCompletionAttempt } from '@/lib/clientExerciseCompletion';

const TODAY = new Date().toISOString();

function attempt(overrides: Partial<ClientCompletionAttempt> = {}): ClientCompletionAttempt {
  return {
    createdAt: TODAY,
    learner: 'kirsi',
    subject: 'matemaatika',
    topic: 'arvutamine',
    category: 'Arvutamine 10 piires',
    exerciseId: 'kirsi.math.arvutamine.1',
    ...overrides
  };
}

// The card this runner is asking about.
const CARD = { subject: 'matemaatika', topic: 'arvutamine', category: 'Arvutamine 20 piires' };
const CARD_ID = 'kirsi.math.arvutamine.2';

describe('completedTodayFromHistory', () => {
  it('reports done for the card the child actually finished', () => {
    const done = completedTodayFromHistory(
      [attempt({ category: 'Arvutamine 20 piires', exerciseId: CARD_ID })],
      'kirsi',
      CARD_ID,
      CARD
    );
    expect(done).toBe(true);
  });

  it('does not report done for a sibling card sharing the same topic', () => {
    // Finishing "Arvutamine 10 piires" must not close "Arvutamine 20 piires".
    expect(completedTodayFromHistory([attempt()], 'kirsi', CARD_ID, CARD)).toBe(false);
  });

  it('resolves a legacy attempt without an exerciseId by its category', () => {
    const done = completedTodayFromHistory(
      [attempt({ category: 'Arvutamine 20 piires', exerciseId: null })],
      'kirsi',
      CARD_ID,
      CARD
    );
    expect(done).toBe(true);
  });

  it('falls back to the topic when the card has no category to match on', () => {
    const done = completedTodayFromHistory(
      [attempt({ topic: 'loe-ja-vasta', subject: 'lugemine', category: 'ükskõik', exerciseId: null })],
      'kirsi',
      'kiur.reading.loe-ja-vasta',
      { subject: 'lugemine', topic: 'loe-ja-vasta' }
    );
    expect(done).toBe(true);
  });

  it('ignores the other child and yesterday', () => {
    const yesterday = new Date(Date.now() - 36 * 60 * 60 * 1000).toISOString();
    const finished = attempt({ category: 'Arvutamine 20 piires', exerciseId: CARD_ID });
    expect(completedTodayFromHistory([{ ...finished, learner: 'kiur' }], 'kirsi', CARD_ID, CARD)).toBe(false);
    expect(completedTodayFromHistory([{ ...finished, createdAt: yesterday }], 'kirsi', CARD_ID, CARD)).toBe(false);
  });
});
