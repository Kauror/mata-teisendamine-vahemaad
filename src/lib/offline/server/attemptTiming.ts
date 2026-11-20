import type { CatalogueGrantContract } from '@/lib/server/rewards/policy';

// A completed offline exercise may arrive late, but its client clock must not be
// allowed to manufacture historical reward eligibility.  These values are kept
// deliberately small: a family device can be offline for two weeks, while a
// grant boundary is only softened enough to tolerate normal clock correction.
export const DEFAULT_MAX_OFFLINE_ATTEMPT_AGE_DAYS = 14;
const GRANT_CLOCK_TOLERANCE_MS = 5 * 60 * 1000;
const GRANT_OFFLINE_GRACE_MS = 60 * 60 * 1000;
const START_TOLERANCE_MS = 60 * 1000;

export type AttemptTimingVerdict =
  | { verdict: 'accept' }
  | { verdict: 'review'; reasonCode: 'completion_before_grant' | 'completion_after_grant' | 'clock_drift' }
  | { verdict: 'reject'; reasonCode: 'completion_too_old' | 'completion_before_start' | 'impossible_future_timestamp' };

// Plausibility of an attempt's active time (B3). Generators ship to the browser,
// so a script can post a perfect attempt in 0 seconds. An attempt that could
// earn stars (at least half right) and whose active time is below this floor is
// kept, but its stars wait for the parent ('too_fast').
//
// The floors are deliberately low so a fast child is never caught: reading a
// question and typing or tapping an answer takes well over a second, so 1.5 s
// per question on average is already far below a real session (the children's
// 15-question maths sessions take minutes). The matching sprints are timed
// games of quick taps, so they get a much lower floor of 0.5 s per matched item.
export const MIN_SECONDS_PER_QUESTION = 1.5;
export const MIN_SECONDS_PER_SPRINT_ITEM = 0.5;
const SPRINT_RUNNERS = new Set(['kiur-english-sprint', 'kirsi-picture-word']);

export function attemptIsImplausiblyFast(input: { runnerId: string; questionCount: number; score: number; elapsedSeconds: number }): boolean {
  if (input.questionCount <= 0 || input.score * 2 < input.questionCount) return false;
  const floor = SPRINT_RUNNERS.has(input.runnerId) ? MIN_SECONDS_PER_SPRINT_ITEM : MIN_SECONDS_PER_QUESTION;
  const elapsed = Number.isFinite(input.elapsedSeconds) ? input.elapsedSeconds : 0;
  return elapsed < input.questionCount * floor;
}

export function maxOfflineAttemptAgeDays(value = process.env.MAX_OFFLINE_ATTEMPT_AGE_DAYS): number {
  if (value === undefined || value === '') return DEFAULT_MAX_OFFLINE_ATTEMPT_AGE_DAYS;
  if (!/^\d+$/.test(value) || Number(value) < 1 || Number(value) > 90) throw new Error('MAX_OFFLINE_ATTEMPT_AGE_DAYS must be an integer from 1 to 90.');
  return Number(value);
}

export function validateAttemptTiming(input: {
  serverReceivedAt: string;
  rawDeviceCompletedAt: string;
  clientCorrectedCompletedAt: string;
  startedAt?: string | null;
  grant: Pick<CatalogueGrantContract, 'issuedAt' | 'validUntil'>;
  lastKnownServerOffsetMs?: number | null;
}): AttemptTimingVerdict {
  const received = Date.parse(input.serverReceivedAt);
  const raw = Date.parse(input.rawDeviceCompletedAt);
  const completed = Date.parse(input.clientCorrectedCompletedAt);
  const started = input.startedAt ? Date.parse(input.startedAt) : Number.NaN;
  const issued = Date.parse(input.grant.issuedAt);
  const validUntil = Date.parse(input.grant.validUntil);
  if (completed > received + 2 * 60 * 1000) return { verdict: 'reject', reasonCode: 'impossible_future_timestamp' };
  if (completed < received - maxOfflineAttemptAgeDays() * 86_400_000) return { verdict: 'reject', reasonCode: 'completion_too_old' };
  if (Number.isFinite(started) && completed < started - START_TOLERANCE_MS) return { verdict: 'reject', reasonCode: 'completion_before_start' };
  if (Number.isFinite(issued) && completed < issued - GRANT_CLOCK_TOLERANCE_MS) return { verdict: 'review', reasonCode: 'completion_before_grant' };
  if (Number.isFinite(validUntil) && completed > validUntil + GRANT_OFFLINE_GRACE_MS) return { verdict: 'review', reasonCode: 'completion_after_grant' };
  const offset = input.lastKnownServerOffsetMs;
  if (Math.abs(completed - raw) > 12 * 60 * 60 * 1000 || (typeof offset === 'number' && Math.abs((completed - raw) - offset) > 12 * 60 * 60 * 1000)) {
    return { verdict: 'review', reasonCode: 'clock_drift' };
  }
  return { verdict: 'accept' };
}
