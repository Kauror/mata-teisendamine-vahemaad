// When a word needs practice, and when it stops needing it.
//
// A word becomes weak the moment the child types it wrong — in a full test
// round, a correction round or "Korda eksitud sõnu". Self-assessed study swipes
// never change this: study is where not knowing a word is expected, and the
// study stage already repeats every unknown card until it is known.
//
// A weak word recovers after RECOVERY_STREAK consecutive correct answers that
// were produced unaided — a full test round, or a word's first attempt in a
// practice session. A correct answer in a correction round, or a re-ask inside
// practice, comes right after the child was shown the spelling, so it neither
// counts towards recovery nor breaks the streak.
import type { VocabEvent } from '@/lib/vocabulary/types';

export const RECOVERY_STREAK = 2;

export type WeakWordState = {
  needsPractice: boolean;
  recoveryStreak: number;
};

export function applyEventToWeakState(state: WeakWordState, event: Pick<VocabEvent, 'phase' | 'correct' | 'countsForRecovery'>): WeakWordState {
  if (event.phase === 'study') return state;
  if (!event.correct) return { needsPractice: true, recoveryStreak: 0 };
  if (!event.countsForRecovery) return state;
  const recoveryStreak = state.recoveryStreak + 1;
  return {
    needsPractice: state.needsPractice && recoveryStreak < RECOVERY_STREAK,
    recoveryStreak
  };
}
