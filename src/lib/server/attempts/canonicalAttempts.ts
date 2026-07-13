import db from '@/lib/db';
import { CANONICAL_EARNED_STARS_SQL, CANONICAL_REVIEW_REASON_SQL } from '@/lib/server/attempts/canonicalAttemptProjection';
import type { ServerAttempt } from '@/lib/shared/types';

const SELECT_CANONICAL_ATTEMPT = `
  SELECT a.id, a.clientAttemptId, a.createdAt, a.completedAt, a.category, a.difficulty, a.questions,
         a.questionCount, a.score, a.elapsedSeconds, a.learner, a.subject, a.topic, a.exerciseId,
         ${CANONICAL_EARNED_STARS_SQL} AS earnedStars,
         a.rewardSettlementStatus AS rewardSettlementStatus,
         ${CANONICAL_REVIEW_REASON_SQL} AS reviewReasonCode
  FROM attempts a
  LEFT JOIN study_attempt_rewards r ON r.attemptId = a.id
`;

export function canonicalAttemptsAfter(cursorId: number, limit: number): ServerAttempt[] {
  return db.prepare(`
    ${SELECT_CANONICAL_ATTEMPT}
    WHERE a.id > ? AND a.deletedAt IS NULL
    ORDER BY a.id ASC
    LIMIT ?
  `).all(cursorId, limit) as ServerAttempt[];
}

export function canonicalAttemptById(id: number): ServerAttempt | undefined {
  return canonicalAttemptsAfter(Math.max(0, id - 1), 1).find((row) => row.id === id);
}

export function canonicalAttemptsByIds(ids: number[]): ServerAttempt[] {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => '?').join(', ');
  return db.prepare(`
    ${SELECT_CANONICAL_ATTEMPT}
    WHERE a.id IN (${placeholders}) AND a.deletedAt IS NULL
    ORDER BY a.id ASC
  `).all(...ids) as ServerAttempt[];
}
