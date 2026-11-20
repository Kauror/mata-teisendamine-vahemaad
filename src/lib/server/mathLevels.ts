import db from '@/lib/db';
import {
  ADAPTIVE_MATH_TOPICS,
  difficultyRank,
  isAdaptiveMathTopic,
  mathLevelAfter,
  type MathLevelSession,
  type MathLevelState
} from '@/lib/mathDifficulty';
import type { Learner } from '@/lib/tasks';

// Kiur's maths level per topic, worked out from the attempts the server holds
// (see mathDifficulty.ts for the rule). Only settled, eligible attempts count:
// a held or withheld attempt moves nothing until the parent approves it.

const COMPLETED_AT = 'COALESCE(effectiveCompletedAt, completedAt, createdAt)';

function sessions(learner: Learner, topic: string, options: { completedBefore?: string; syncedBy?: string } = {}): MathLevelSession[] {
  return db.prepare(`
    SELECT difficulty, score, questionCount
    FROM attempts
    WHERE learner = ? AND subject = 'matemaatika' AND topic = ?
      AND COALESCE(rewardSettlementStatus, 'eligible') = 'eligible'
      AND (? IS NULL OR ${COMPLETED_AT} < ?)
      AND (? IS NULL OR COALESCE(syncedAt, createdAt) <= ?)
    ORDER BY ${COMPLETED_AT} ASC, id ASC
  `).all(learner, topic, options.completedBefore ?? null, options.completedBefore ?? null, options.syncedBy ?? null, options.syncedBy ?? null) as MathLevelSession[];
}

export function getMathLevel(learner: Learner, topic: string, options: { completedBefore?: string; syncedBy?: string } = {}): MathLevelState {
  return mathLevelAfter(sessions(learner, topic, options));
}

// For the dashboard snapshot the device starts its runs from.
export function getMathLevels(learner: Learner): Record<string, MathLevelState> | undefined {
  if (learner !== 'kiur') return undefined;
  return Object.fromEntries(ADAPTIVE_MATH_TOPICS.map((topic) => [topic, getMathLevel(learner, topic)]));
}

// Whether an attempt was made at a level the rule allowed when it started. The
// device decides from its last snapshot plus its own unsynced attempts, so two
// readings of «allowed» are fair: the level after every attempt completed
// before the run started, and the level after only those the server had by
// then. A harder level than both is never a gain (stars do not depend on the
// level), so it passes; an easier one is held for the parent, never rejected.
export function mathDifficultyAllowed(learner: Learner, topic: string, difficulty: string, startedAt: string) {
  if (!isAdaptiveMathTopic(learner, topic)) return true;
  const full = getMathLevel(learner, topic, { completedBefore: startedAt }).level;
  const known = getMathLevel(learner, topic, { completedBefore: startedAt, syncedBy: startedAt }).level;
  const rank = difficultyRank(difficulty);
  if (rank < 0) return false;
  return difficulty === full || difficulty === known || rank > Math.max(difficultyRank(full), difficultyRank(known));
}
