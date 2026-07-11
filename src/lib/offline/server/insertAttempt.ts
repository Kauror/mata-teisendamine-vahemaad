import db from '@/lib/db';
import { awardStudyPointsForAttempt, getStudyReward } from '@/lib/learningPoints';
import {
  findLearningExerciseForAttempt,
  isLearner,
  isLearningExerciseActiveForAttempt,
  isLearningExerciseSubject
} from '@/lib/learningExercises';
import { captureMistakesForAttempt } from '@/lib/remediation';
import { recordDailyLeaderboard } from '@/lib/leaderboard';
import { isoToAppDate, nowIso, todayDateString } from '@/lib/tasks';
import { validateAgainstCatalogue } from '@/lib/offline/server/catalogVersions';
import { reconcileStudyRewards } from '@/lib/offline/server/reconcile';

// The one authoritative, idempotent attempt-insertion path. Both the online
// /api/history POST and the offline /api/offline/sync endpoint call this, so
// there is exactly one reward/history/leaderboard code path.

export type InsertAttemptInput = {
  clientAttemptId?: string | null;
  deviceId?: string | null;
  createdAt?: string | null; // legacy online path: client "now"
  startedAt?: string | null;
  completedAt?: string | null; // effective completion (offline)
  rawDeviceCompletedAt?: string | null;
  syncedAt?: string | null;
  catalogueVersion?: string | null;
  clientTimeZone?: string | null;
  clientUtcOffsetMinutes?: number | null;
  learner?: unknown;
  subject?: unknown;
  topic?: unknown;
  category?: unknown;
  difficulty?: unknown;
  questionCount?: unknown;
  score?: unknown;
  elapsedSeconds?: unknown;
  questions?: unknown;
  exerciseId?: unknown;
};

export type InsertAttemptResult = {
  status: 'created' | 'duplicate' | 'rejected' | 'needs_review';
  serverAttemptId?: number;
  reward?: unknown;
  reasonCode?: string;
  message?: string;
};

const FUTURE_SKEW_MS = 2 * 60 * 1000;

function existingByClientId(clientAttemptId: string) {
  return db.prepare('SELECT id FROM attempts WHERE clientAttemptId = ?').get(clientAttemptId) as { id: number } | undefined;
}

export function insertAttempt(input: InsertAttemptInput): InsertAttemptResult {
  const serverNow = nowIso();
  const learner = isLearner(input.learner) ? input.learner : null;
  const subject = isLearningExerciseSubject(input.subject) ? input.subject : null;
  const rawSubject = typeof input.subject === 'string' ? input.subject : null;
  const topic = typeof input.topic === 'string' ? input.topic : '';
  const category = typeof input.category === 'string' ? input.category : '';
  const questions = Array.isArray(input.questions) ? input.questions : [];

  const exercise = learner && subject ? findLearningExerciseForAttempt({ learner, subject, topic, category }) : null;

  // Session-length normalisation, identical to the existing /api/history route.
  const isLearningAttempt = rawSubject !== 'inglise-keel';
  const isTextProblems = rawSubject === 'matemaatika' && (topic === 'tekstulesanded' || category === 'Tekstülesanded');
  const usesProvidedCount = rawSubject === 'lugemine' || rawSubject === 'loodusopetus' || isTextProblems;
  const questionCount = usesProvidedCount ? Number(input.questionCount) || 0 : isLearningAttempt ? 15 : Number(input.questionCount) || 0;
  const score = Math.max(0, Math.min(Math.floor(Number(input.score) || 0), questionCount));
  const elapsedSeconds = Number(input.elapsedSeconds) || 0;
  const difficulty = typeof input.difficulty === 'string' && input.difficulty ? input.difficulty : 'Lihtne';
  const exerciseId = typeof input.exerciseId === 'string' && input.exerciseId ? input.exerciseId : exercise?.id ?? null;

  // Effective completion time drives day-based reward logic. Suspicious future
  // timestamps are clamped to server time, but the raw device time is retained.
  const rawCompleted = input.rawDeviceCompletedAt || input.completedAt || input.createdAt || serverNow;
  const proposed = input.completedAt || input.createdAt || serverNow;
  const effectiveCompleted = new Date(proposed).getTime() > new Date(serverNow).getTime() + FUTURE_SKEW_MS ? serverNow : proposed;

  // Idempotency (fast path outside the transaction).
  if (input.clientAttemptId) {
    const existing = existingByClientId(input.clientAttemptId);
    if (existing) return { status: 'duplicate', serverAttemptId: existing.id, reward: getStudyReward(existing.id) ?? undefined };
  }

  // Permission / catalogue validation.
  let permitted = true;
  let review = false;
  let reasonCode: string | undefined;
  if (input.catalogueVersion) {
    if (!learner) return { status: 'rejected', reasonCode: 'bad_payload', message: 'Vale laps.' };
    const validation = validateAgainstCatalogue({ learner, version: input.catalogueVersion, exerciseId, subject: rawSubject ?? '', topic, category });
    if (validation.verdict === 'accept' || validation.verdict === 'stale') {
      permitted = true;
      if (validation.verdict === 'stale') reasonCode = 'stale';
    } else {
      // Preserve the child's work as history, but award nothing and flag it.
      permitted = false;
      review = true;
      reasonCode = validation.reasonCode;
    }
  } else if (learner && subject && !isLearningExerciseActiveForAttempt({ learner, subject, topic, category })) {
    // Online direct completion of an exercise that is not currently active keeps
    // the existing 403 semantics (no row inserted).
    return { status: 'rejected', reasonCode: 'not_active', message: 'Harjutus ei ole praegu aktiivne.' };
  }

  const insertRow = db.prepare(`
    INSERT INTO attempts (
      createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, subject, topic, exerciseId,
      clientAttemptId, deviceId, startedAt, completedAt, rawDeviceCompletedAt, syncedAt,
      catalogueVersion, clientTimeZone, clientUtcOffsetMinutes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const run = db.transaction((): InsertAttemptResult => {
    if (input.clientAttemptId) {
      const dup = existingByClientId(input.clientAttemptId);
      if (dup) return { status: 'duplicate', serverAttemptId: dup.id, reward: getStudyReward(dup.id) ?? undefined };
    }

    const result = insertRow.run(
      effectiveCompleted,
      category,
      difficulty,
      questionCount,
      score,
      elapsedSeconds,
      JSON.stringify(questions),
      learner,
      subject ?? rawSubject ?? null,
      topic || null,
      exerciseId,
      input.clientAttemptId ?? null,
      input.deviceId ?? null,
      input.startedAt ?? null,
      effectiveCompleted,
      rawCompleted,
      input.syncedAt ?? null,
      input.catalogueVersion ?? null,
      input.clientTimeZone ?? null,
      typeof input.clientUtcOffsetMinutes === 'number' ? input.clientUtcOffsetMinutes : null
    );
    const attemptId = Number(result.lastInsertRowid);

    try {
      captureMistakesForAttempt({ attemptId, learner, subject, topic, category, questions });
    } catch (error) {
      console.warn('Mistake capture failed', error);
    }

    const reward = permitted ? awardStudyPointsForAttempt(attemptId) : null;

    try {
      // Record the leaderboard for the attempt's completion date (Tallinn), so a
      // late offline attempt updates the right day, not just "today".
      recordDailyLeaderboard(isoToAppDate(effectiveCompleted) ?? undefined);
    } catch (error) {
      console.warn('Daily leaderboard snapshot failed', error);
    }

    return { status: review ? 'needs_review' : 'created', serverAttemptId: attemptId, reward: reward ?? undefined, reasonCode };
  });

  const result = run();

  // A late arrival (completed on a past Tallinn day) can affect that day's derived
  // rewards; record a shadow reconciliation audit. This never changes stars.
  if (permitted && result.status === 'created' && learner) {
    const completionDay = isoToAppDate(effectiveCompleted);
    if (completionDay && completionDay < todayDateString()) {
      try {
        reconcileStudyRewards(learner, completionDay, 'late_attempt');
      } catch (error) {
        console.warn('Reconciliation audit failed', error);
      }
    }
  }

  return result;
}
