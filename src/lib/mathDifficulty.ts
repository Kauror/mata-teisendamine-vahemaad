import { DIFFICULTIES, type Difficulty } from '@/lib/types';

// Kiur's maths difficulty, per topic, from his own results. The same rule runs
// on the server (dashboard snapshot, attempt check) and in the browser (to
// carry the server's state over attempts not synced yet), so it lives here.
//
//   - Every topic starts at Lihtne.
//   - Two sessions in a row at the current level with at least 90 % move up a
//     level (Lihtne → Keskmine → Raske).
//   - A session at the current level below 60 % moves down a level.
//   - Anything in between keeps the level and restarts the count of good
//     sessions. Sessions at another level than the current one do not count.

export const MATH_LEVEL_UP_PERCENT = 0.9;
export const MATH_LEVEL_DOWN_PERCENT = 0.6;
export const MATH_LEVEL_UP_SESSIONS = 2;

// The generated Kiur topics whose questions depend on the difficulty
// (maths generator v5). Multiplication facts and the text problems do not.
export const ADAPTIVE_MATH_TOPICS = [
  'jagamine-kahekohaline-uhekohaline',
  'arvud-10000-piires',
  'ring-ja-ringjoon',
  'mustrid',
  'mootuhikud-pikkused'
] as const;

export function isAdaptiveMathTopic(learner: string | null | undefined, topic: string | null | undefined) {
  return learner === 'kiur' && (ADAPTIVE_MATH_TOPICS as readonly string[]).includes(topic ?? '');
}

export function isDifficulty(value: unknown): value is Difficulty {
  return typeof value === 'string' && (DIFFICULTIES as readonly string[]).includes(value);
}

export type MathLevelState = { level: Difficulty; goodSessions: number };
export type MathLevelSession = { difficulty: string; score: number; questionCount: number };

export const INITIAL_MATH_LEVEL: MathLevelState = { level: 'Lihtne', goodSessions: 0 };

export function advanceMathLevel(state: MathLevelState, session: MathLevelSession): MathLevelState {
  if (session.difficulty !== state.level || session.questionCount <= 0) return state;
  const share = session.score / session.questionCount;
  const rank = DIFFICULTIES.indexOf(state.level);
  if (share >= MATH_LEVEL_UP_PERCENT) {
    const goodSessions = state.goodSessions + 1;
    if (goodSessions >= MATH_LEVEL_UP_SESSIONS && rank < DIFFICULTIES.length - 1) return { level: DIFFICULTIES[rank + 1], goodSessions: 0 };
    return { level: state.level, goodSessions };
  }
  if (share < MATH_LEVEL_DOWN_PERCENT) return { level: DIFFICULTIES[Math.max(0, rank - 1)], goodSessions: 0 };
  return { level: state.level, goodSessions: 0 };
}

// `sessions` oldest first.
export function mathLevelAfter(sessions: MathLevelSession[], from: MathLevelState = INITIAL_MATH_LEVEL): MathLevelState {
  return sessions.reduce(advanceMathLevel, from);
}

export function isMathLevelState(value: unknown): value is MathLevelState {
  if (typeof value !== 'object' || value === null) return false;
  const state = value as MathLevelState;
  return isDifficulty(state.level) && Number.isInteger(state.goodSessions) && state.goodSessions >= 0;
}

export function difficultyRank(value: string) {
  return (DIFFICULTIES as readonly string[]).indexOf(value);
}
