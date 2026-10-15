import db from '@/lib/db';

export const SPRINT_QUALIFICATION_RULE_VERSION = 'kiur-sprint-v2';

export type SprintQualification = {
  recordBeforeRun: number;
  requiredScore: number;
  actualScore: number;
  qualified: boolean;
  // The first sprint establishes the standing record, but is not a competition
  // run. Keeping this separate prevents a one-word first run from a karikas.
  countsTowardsCompetition: boolean;
  qualificationRuleVersion: string;
};

type SprintRow = {
  id: number;
  clientAttemptId: string | null;
  effectiveCompletedAt: string | null;
  createdAt: string;
  score: number;
};

type StoredSprintRow = SprintRow & {
  recordBeforeRun: number | null;
  requiredScore: number | null;
  sprintQualified: number | null;
  qualificationRuleVersion: string | null;
};

function threshold(record: number) {
  return Math.max(1, Math.ceil(record / 2));
}

function compareRows(left: SprintRow, right: SprintRow) {
  const leftTime = left.effectiveCompletedAt ?? left.createdAt;
  const rightTime = right.effectiveCompletedAt ?? right.createdAt;
  if (leftTime !== rightTime) return leftTime.localeCompare(rightTime);
  const leftClient = left.clientAttemptId ?? '';
  const rightClient = right.clientAttemptId ?? '';
  if (leftClient !== rightClient) return leftClient.localeCompare(rightClient);
  return left.id - right.id;
}

export function qualifySprintsPure(rows: SprintRow[]): Map<number, SprintQualification> {
  const results = new Map<number, SprintQualification>();
  let record = 0;
  for (const row of [...rows].sort(compareRows)) {
    const requiredScore = threshold(record);
    const isFirstRun = record === 0;
    results.set(row.id, {
      recordBeforeRun: record,
      requiredScore,
      actualScore: row.score,
      qualified: !isFirstRun && row.score >= requiredScore,
      countsTowardsCompetition: !isFirstRun && row.score >= requiredScore,
      qualificationRuleVersion: SPRINT_QUALIFICATION_RULE_VERSION
    });
    record = Math.max(record, row.score);
  }
  return results;
}

// Recompute all authoritative Kiur sprint rows. This intentionally updates later
// rows when an older offline attempt arrives, making the result upload-order
// independent. Held/review rows never establish or raise the standing record.
// `deletedAt` is intentionally not a predicate: hiding a history row is only a
// display preference and must not rewrite the sprint record or qualification.
//
// SRV-08: the stored facts are read in the same query and a row is written only
// when one of them changes, so the usual new-sprint case writes one row instead
// of every sprint in history while the sync transaction holds the write lock.
export function recomputeSprintQualifications() {
  const rows = db.prepare(`
    SELECT id, clientAttemptId, effectiveCompletedAt, createdAt, score,
      recordBeforeRun, requiredScore, sprintQualified, qualificationRuleVersion
    FROM attempts
    WHERE learner = 'kiur' AND subject = 'inglise-keel' AND topic = 'sprint'
      AND (COALESCE(protocolVersion, 1) <> 2 OR rewardSettlementStatus = 'eligible')
  `).all() as StoredSprintRow[];
  const qualifications = qualifySprintsPure(rows);
  const stored = new Map(rows.map((row) => [row.id, row]));
  const update = db.prepare(`
    UPDATE attempts SET recordBeforeRun = ?, requiredScore = ?, sprintQualified = ?,
      qualificationRuleVersion = ? WHERE id = ?
  `);
  for (const [id, value] of qualifications) {
    const sprintQualified = value.qualified ? 1 : 0;
    const current = stored.get(id);
    if (
      current
      && current.recordBeforeRun === value.recordBeforeRun
      && current.requiredScore === value.requiredScore
      && current.sprintQualified === sprintQualified
      && current.qualificationRuleVersion === value.qualificationRuleVersion
    ) continue;
    update.run(value.recordBeforeRun, value.requiredScore, sprintQualified, value.qualificationRuleVersion, id);
  }
  return qualifications;
}

export function sprintQualificationForAttempt(attemptId: number): SprintQualification | null {
  const row = db.prepare(`
    SELECT recordBeforeRun, requiredScore, score, sprintQualified, qualificationRuleVersion
    FROM attempts WHERE id = ? AND subject = 'inglise-keel' AND topic = 'sprint'
  `).get(attemptId) as { recordBeforeRun: number | null; requiredScore: number | null; score: number; sprintQualified: number | null; qualificationRuleVersion: string | null } | undefined;
  if (!row) return null;
  return {
    recordBeforeRun: row.recordBeforeRun ?? 0,
    requiredScore: row.requiredScore ?? 1,
    actualScore: row.score,
    qualified: row.sprintQualified === 1,
    countsTowardsCompetition: row.sprintQualified === 1,
    qualificationRuleVersion: row.qualificationRuleVersion ?? SPRINT_QUALIFICATION_RULE_VERSION
  };
}
