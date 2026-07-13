import { NextResponse } from 'next/server';
import { decodeHistoryCursor, encodeHistoryCursor, historyPageLimit } from '@/lib/server/historyCursor';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getDb() {
  return (await import('@/lib/db')).default;
}

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const limit = historyPageLimit(search.get('limit'));
  const cursor = decodeHistoryCursor(search.get('cursor'));
  if (limit === null || cursor === undefined) {
    return NextResponse.json({ code: 'invalid_pagination' }, { status: 400 });
  }

  const learner = search.get('learner');
  const subject = search.get('subject');
  const topic = search.get('topic');
  if ((learner && learner !== 'kiur' && learner !== 'kirsi') || [subject, topic].some((value) => value && value.length > 64)) {
    return NextResponse.json({ code: 'invalid_filter' }, { status: 400 });
  }

  const db = await getDb();
  const clauses = ['a.deletedAt IS NULL'];
  const params: Array<string | number> = [];
  if (learner) { clauses.push('a.learner = ?'); params.push(learner); }
  if (subject) { clauses.push('a.subject = ?'); params.push(subject); }
  if (topic) { clauses.push('a.topic = ?'); params.push(topic); }
  if (cursor) {
    clauses.push('(a.createdAt < ? OR (a.createdAt = ? AND a.id < ?))');
    params.push(cursor.createdAt, cursor.createdAt, cursor.id);
  }
  params.push(limit + 1);
  const rows = db.prepare(`
    SELECT
      a.id, a.clientAttemptId, a.createdAt, a.category, a.difficulty, a.questionCount, a.score, a.elapsedSeconds, a.learner, a.subject, a.topic,
      a.exerciseId,
      -- RTM3-M03: the displayed "stars earned" must reflect the whole canonical
      -- ledger for the attempt (study + streak + configurable rule components),
      -- not only the study component. Fall back to the legacy study reward for v1
      -- rows that have no canonical components.
      COALESCE((
        SELECT SUM(latest.canonicalAmount)
        FROM attempt_reward_components latest
        JOIN (
          SELECT componentKey, MAX(revision) AS revision
          FROM attempt_reward_components
          WHERE attemptId = a.id
          GROUP BY componentKey
        ) mx ON mx.componentKey = latest.componentKey AND mx.revision = latest.revision
        WHERE latest.attemptId = a.id
      ), r.awardedAmount) as earnedStars,
      r.dailyCap as learningDailyCap,
      r.dailyLearningEarnedAfter as dailyLearningEarnedAfter,
      -- RTM3-H02: settlement so the child sees a held result as awaiting approval,
      -- not as an ordinary zero-star completion.
      a.rewardSettlementStatus as rewardSettlementStatus,
      COALESCE(a.reviewReasonCode,
        CASE WHEN a.clockStatus = 'needs_review' THEN 'clock_drift' ELSE NULL END) as reviewReasonCode
    FROM attempts a
    LEFT JOIN study_attempt_rewards r ON r.attemptId = a.id
    WHERE ${clauses.join(' AND ')}
    ORDER BY a.createdAt DESC, a.id DESC
    LIMIT ?
  `).all(...params) as Array<{ id: number; createdAt: string }>;
  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit);
  const last = items.at(-1);
  return NextResponse.json({
    items,
    nextCursor: hasMore && last ? encodeHistoryCursor({ createdAt: last.createdAt, id: last.id }) : null
  });
}

export async function POST() {
  return NextResponse.json(
    { code: 'legacy_write_retired', message: 'Kasuta kontrollitud võrguühenduseta protokolli v2.' },
    { status: 410 }
  );
}
