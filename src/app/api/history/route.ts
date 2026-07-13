import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getDb() {
  return (await import('@/lib/db')).default;
}

export async function GET() {
  const db = await getDb();
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
    WHERE a.deletedAt IS NULL
    ORDER BY a.createdAt DESC
  `).all();
  return NextResponse.json(rows);
}

export async function POST() {
  return NextResponse.json(
    { code: 'legacy_write_retired', message: 'Kasuta kontrollitud võrguühenduseta protokolli v2.' },
    { status: 410 }
  );
}
