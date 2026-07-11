import db from '@/lib/db';
import { isoToAppDate, nowIso, type Learner } from '@/lib/tasks';
import { getLearningPointSettings, type LearningPointSettings } from '@/lib/learningPoints';
import { sprintAttemptQualifies } from '@/lib/sprintReward';

// Reward reconciliation for late-arriving offline attempts.
//
// SAFETY: this ships in SHADOW mode. It recomputes what a learner's study-derived
// stars SHOULD be from a given date (deterministically, using each attempt's own
// stored policy snapshot — never today's settings), compares that to the actual
// awarded total, and records the proposed delta in `reconciliation_audits`. It
// writes NOTHING to the point ledger. Existing ledger rows stay immutable, and
// history-deletion semantics (stars are never removed) are untouched.
//
// Live mode (compensating adjustments) is a SEPARATE, explicitly-enabled release
// that must first be validated against a copied production database.

export type ReconciliationMode = 'shadow' | 'live';

// Default is shadow. A live rollout flips this via env only after copied-DB tests.
export function reconciliationMode(): ReconciliationMode {
  return process.env.OFFLINE_RECONCILIATION_MODE === 'live' ? 'live' : 'shadow';
}

const MIN_REWARD_SCORE_PERCENT = 0.5;

type RewardRow = {
  attemptId: number;
  exerciseKey: string;
  score: number;
  questionCount: number;
  awardedAmount: number;
  metadataJson: string | null;
  effCreatedAt: string;
  completedAt: string | null;
  subject: string | null;
  topic: string | null;
};

function settingsOf(row: RewardRow, fallback: LearningPointSettings): LearningPointSettings {
  if (!row.metadataJson) return fallback;
  try {
    const parsed = JSON.parse(row.metadataJson) as { settings?: LearningPointSettings };
    return parsed.settings ?? fallback;
  } catch {
    return fallback;
  }
}

// Deterministically recompute the expected study_exercise total per completion
// day (Tallinn), independent of the order attempts were synced in.
export function computeExpectedStudyTotal(learner: Learner, fromDate: string) {
  const fallback = getLearningPointSettings();
  const rows = db.prepare(`
    SELECT r.attemptId, r.exerciseKey, r.score, r.questionCount, r.awardedAmount, r.metadataJson,
           a.createdAt AS effCreatedAt, a.completedAt, a.subject, a.topic
    FROM study_attempt_rewards r
    JOIN attempts a ON a.id = r.attemptId
    WHERE r.learner = ?
  `).all(learner) as RewardRow[];

  const inWindow = rows.filter((row) => {
    const day = isoToAppDate(row.effCreatedAt);
    return day !== null && day >= fromDate;
  });

  // Group by day → exerciseKey, in completion order, applying decay/threshold/cap.
  const byDay = new Map<string, RewardRow[]>();
  for (const row of inWindow) {
    const day = isoToAppDate(row.effCreatedAt)!;
    byDay.set(day, [...(byDay.get(day) ?? []), row]);
  }

  let expectedTotal = 0;
  let actualTotal = 0;
  const perDay: Array<{ date: string; expected: number; actual: number }> = [];

  for (const [day, dayRows] of byDay) {
    const cap = settingsOf(dayRows[0], fallback).dailyCap;
    const byKey = new Map<string, RewardRow[]>();
    for (const row of dayRows) byKey.set(row.exerciseKey, [...(byKey.get(row.exerciseKey) ?? []), row]);

    let dayExpectedBeforeCap = 0;
    for (const keyRows of byKey.values()) {
      const ordered = [...keyRows].sort((a, b) => (a.completedAt || a.effCreatedAt).localeCompare(b.completedAt || b.effCreatedAt));
      ordered.forEach((row, index) => {
        const settings = settingsOf(row, fallback);
        const decayedBase = Math.max(settings.minimumValue, settings.baseValue - settings.decayStep * index);
        const scorePercent = row.questionCount > 0 ? Math.max(0, Math.min(1, row.score / row.questionCount)) : 0;
        const meetsMinimumWork = sprintAttemptQualifies({ id: row.attemptId, subject: row.subject, topic: row.topic, score: row.score });
        const meets = settings.learningPointsEnabled && meetsMinimumWork && scorePercent >= MIN_REWARD_SCORE_PERCENT;
        if (meets) dayExpectedBeforeCap += decayedBase;
      });
    }
    const dayExpected = Math.round(Math.min(cap, dayExpectedBeforeCap) * 100) / 100;
    const dayActual = Math.round(dayRows.reduce((sum, row) => sum + row.awardedAmount, 0) * 100) / 100;
    expectedTotal += dayExpected;
    actualTotal += dayActual;
    perDay.push({ date: day, expected: dayExpected, actual: dayActual });
  }

  return {
    expectedTotal: Math.round(expectedTotal * 100) / 100,
    actualTotal: Math.round(actualTotal * 100) / 100,
    perDay
  };
}

export type ReconciliationAudit = {
  learner: Learner;
  fromDate: string;
  expectedStudyTotal: number;
  actualStudyTotal: number;
  delta: number;
  mode: ReconciliationMode;
};

// Records a proposed reconciliation. Shadow mode changes no stars. Live mode
// (only after copied-DB validation) would additionally write a
// `reconciliation_adjustment` ledger entry for the delta.
export function reconcileStudyRewards(learner: Learner, fromDate: string, trigger = 'manual'): ReconciliationAudit {
  const { expectedTotal, actualTotal, perDay } = computeExpectedStudyTotal(learner, fromDate);
  const delta = Math.round((expectedTotal - actualTotal) * 100) / 100;
  const mode = reconciliationMode();

  db.prepare(`
    INSERT INTO reconciliation_audits (learner, fromDate, expectedStudyTotal, actualStudyTotal, delta, mode, trigger, detailJson, createdAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(learner, fromDate, expectedTotal, actualTotal, delta, mode, trigger, JSON.stringify(perDay), nowIso());

  if (mode === 'live' && delta !== 0) {
    // Compensating adjustment: keep every existing ledger row immutable and add a
    // single delta entry. Guarded so it stays disabled until explicitly enabled.
    db.prepare(`
      INSERT INTO point_ledger (learner, amount, source, description, createdAt, metadataJson)
      VALUES (?, ?, 'reconciliation_adjustment', ?, ?, ?)
    `).run(learner, delta, `Reconciliation ${fromDate}`, nowIso(), JSON.stringify({ fromDate, trigger, expectedTotal, actualTotal }));
  }

  return { learner, fromDate, expectedStudyTotal: expectedTotal, actualStudyTotal: actualTotal, delta, mode };
}
