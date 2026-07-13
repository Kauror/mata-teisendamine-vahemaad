export const CANONICAL_EARNED_STARS_SQL = `
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
  ), r.awardedAmount)
`;

export const CANONICAL_REVIEW_REASON_SQL = `
  COALESCE(a.reviewReasonCode,
    CASE WHEN a.clockStatus = 'needs_review' THEN 'clock_drift' ELSE NULL END)
`;
