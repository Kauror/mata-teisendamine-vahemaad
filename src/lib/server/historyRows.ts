import { CANONICAL_EARNED_STARS_SQL, CANONICAL_REVIEW_REASON_SQL } from '@/lib/server/attempts/canonicalAttemptProjection';
import { historyLearnerClause } from '@/lib/server/historyLearnerFilter';
import type { Learner } from '@/lib/tasks';

export type HistoryRowFilter = {
  learner?: Learner | null;
  subject?: string | null;
  topic?: string | null;
  cursor?: { createdAt: string; id: number } | null;
  limit: number;
};

export type HistoryRow = { id: number; createdAt: string };

async function getDb() {
  return (await import('@/lib/db')).default;
}

// The history row shape, shared by /api/history and /api/home-summary so the
// home cards show exactly what the history page does, with the same learner
// rule for legacy rows. Newest first, at most `limit` rows.
export async function queryHistoryRows({ learner, subject, topic, cursor, limit }: HistoryRowFilter): Promise<HistoryRow[]> {
  const db = await getDb();
  const clauses = ['a.deletedAt IS NULL'];
  const params: Array<string | number> = [];
  if (learner) {
    const filter = historyLearnerClause(learner);
    clauses.push(filter.sql);
    params.push(...filter.params);
  }
  if (subject) { clauses.push('a.subject = ?'); params.push(subject); }
  if (topic) { clauses.push('a.topic = ?'); params.push(topic); }
  if (cursor) {
    clauses.push('(a.createdAt < ? OR (a.createdAt = ? AND a.id < ?))');
    params.push(cursor.createdAt, cursor.createdAt, cursor.id);
  }
  params.push(limit);
  return db.prepare(`
    SELECT
      a.id, a.clientAttemptId, a.createdAt, a.category, a.difficulty, a.questionCount, a.score, a.elapsedSeconds, a.learner, a.subject, a.topic,
      a.exerciseId,
      -- RTM3-M03: the displayed "stars earned" must reflect the whole canonical
      -- ledger for the attempt (study + streak + configurable rule components),
      -- not only the study component. Fall back to the legacy study reward for v1
      -- rows that have no canonical components.
      ${CANONICAL_EARNED_STARS_SQL} as earnedStars,
      r.dailyCap as learningDailyCap,
      r.dailyLearningEarnedAfter as dailyLearningEarnedAfter,
      -- RTM3-H02: settlement so the child sees a held result as awaiting approval,
      -- not as an ordinary zero-star completion.
      a.rewardSettlementStatus as rewardSettlementStatus,
      ${CANONICAL_REVIEW_REASON_SQL} as reviewReasonCode
    FROM attempts a
    LEFT JOIN study_attempt_rewards r ON r.attemptId = a.id
    WHERE ${clauses.join(' AND ')}
    ORDER BY a.createdAt DESC, a.id DESC
    LIMIT ?
  `).all(...params) as HistoryRow[];
}
