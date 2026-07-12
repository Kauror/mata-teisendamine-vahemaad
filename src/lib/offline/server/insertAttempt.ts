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
import { recomputeScore, AttemptContractError } from '@/lib/server/attempts/scoreVerifier';
import { catalogueGrantForAttempt, rewardPolicyByVersion, runnerContractForGrant } from '@/lib/server/rewards/policy';
import { applyRewardProjectionV2, getProjectedRewardV2 } from '@/lib/server/rewards/projection';
import { metadataMatchesContract, validateAttemptRecordV2 } from '@/lib/server/http/requestValidation';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';

// Both legacy online completion and phased protocol-v2 sync use this one
// insertion path. Protocol v2 adds strict contract validation and server score
// recomputation while v1 remains temporarily readable during the rollout.

export type InsertAttemptInput = {
  protocolVersion?: 1 | 2;
  clientAttemptId?: string | null;
  deviceId?: string | null;
  createdAt?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  clientCorrectedCompletedAt?: string | null;
  rawDeviceCompletedAt?: string | null;
  syncedAt?: string | null;
  catalogueVersion?: string | null;
  rewardPolicyVersion?: string | null;
  generatorVersion?: string | null;
  runnerId?: string | null;
  runnerVersion?: string | null;
  rotationVersion?: number | null;
  seed?: number | string | null;
  questionIds?: string[] | null;
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
const CLOCK_REVIEW_MS = 12 * 60 * 60 * 1000;

let settlementFaultInjector: ((stage: string) => void) | null = null;

export function setSettlementFaultInjectorForTests(injector: ((stage: string) => void) | null) {
  settlementFaultInjector = injector;
}

function existingByClientId(clientAttemptId: string) {
  return db.prepare('SELECT id, protocolVersion FROM attempts WHERE clientAttemptId = ?').get(clientAttemptId) as { id: number; protocolVersion: number } | undefined;
}

function rewardForExisting(row: { id: number; protocolVersion: number }) {
  return row.protocolVersion === 2 ? getProjectedRewardV2(row.id) ?? undefined : getStudyReward(row.id) ?? undefined;
}

type V2Preparation = {
  score: number;
  questionCount: number;
  questions: Array<Record<string, unknown>>;
  effectiveCompletedAt: string;
  clientCorrectedCompletedAt: string;
  rawDeviceCompletedAt: string;
  completionDate: string;
  clockStatus: 'ok' | 'corrected' | 'needs_review';
  clockSkewMs: number;
  reviewReason?: string;
};

function prepareV2(input: InsertAttemptInput, serverNow: string): V2Preparation | InsertAttemptResult {
  if (process.env.OFFLINE_PROTOCOL_V2_ENABLED !== '1') {
    return { status: 'rejected', reasonCode: 'client_upgrade_required', message: 'Offline protocol v2 is not enabled.' };
  }
  const validation = validateAttemptRecordV2(input);
  if (!validation.ok) {
    return { status: 'rejected', reasonCode: validation.reasonCode, message: validation.issues.join('; ') };
  }
  const rawDeviceCompletedAt = String(input.rawDeviceCompletedAt);
  const clientCorrectedCompletedAt = String(input.clientCorrectedCompletedAt ?? input.completedAt);
  const rawMs = Date.parse(rawDeviceCompletedAt);
  const correctedMs = Date.parse(clientCorrectedCompletedAt);
  const serverMs = Date.parse(serverNow);
  if (correctedMs > serverMs + FUTURE_SKEW_MS) {
    return { status: 'rejected', reasonCode: 'impossible_future_timestamp', message: 'Completion time is in the future.' };
  }
  const clockSkewMs = correctedMs - rawMs;
  const clockStatus = Math.abs(clockSkewMs) > CLOCK_REVIEW_MS
    ? 'needs_review'
    : clockSkewMs === 0 ? 'ok' : 'corrected';
  const completionDate = isoToAppDate(clientCorrectedCompletedAt);
  if (!completionDate) return { status: 'rejected', reasonCode: 'invalid_completion_date', message: 'Completion date is invalid.' };

  try {
    const verified = recomputeScore({
      runnerId: String(input.runnerId),
      learner: input.learner as 'kiur' | 'kirsi',
      subject: String(input.subject),
      topic: String(input.topic ?? ''),
      category: String(input.category),
      difficulty: String(input.difficulty),
      seed: input.seed as number | string,
      questionIds: input.questionIds as string[],
      questions: input.questions as unknown[]
    });
    const questions = (input.questions as unknown[]).map((question, index) => ({
      ...(question as Record<string, unknown>),
      isCorrect: verified.isCorrect[index]
    }));
    return {
      score: verified.score,
      questionCount: verified.questionCount,
      questions,
      effectiveCompletedAt: clientCorrectedCompletedAt,
      clientCorrectedCompletedAt,
      rawDeviceCompletedAt,
      completionDate,
      clockStatus,
      clockSkewMs,
      ...(clockStatus === 'needs_review' ? { reviewReason: 'clock_drift' } : {})
    };
  } catch (error) {
    if (error instanceof AttemptContractError) {
      return { status: 'rejected', reasonCode: error.code, message: error.message };
    }
    throw error;
  }
}

export function insertAttempt(input: InsertAttemptInput): InsertAttemptResult {
  const serverNow = nowIso();
  const protocolVersion = input.protocolVersion === 2 ? 2 : 1;
  const learner = isLearner(input.learner) ? input.learner : null;
  const subject = isLearningExerciseSubject(input.subject) ? input.subject : null;
  const rawSubject = typeof input.subject === 'string' ? input.subject : null;
  const topic = typeof input.topic === 'string' ? input.topic : '';
  const category = typeof input.category === 'string' ? input.category : '';
  let questions = Array.isArray(input.questions) ? input.questions : [];
  const exercise = learner && subject ? findLearningExerciseForAttempt({ learner, subject, topic, category }) : null;

  if (input.clientAttemptId) {
    const existing = existingByClientId(input.clientAttemptId);
    if (existing) return { status: 'duplicate', serverAttemptId: existing.id, reward: rewardForExisting(existing) };
  }

  let v2: V2Preparation | null = null;
  if (protocolVersion === 2) {
    const prepared = prepareV2(input, serverNow);
    if ('status' in prepared) return prepared;
    v2 = prepared;
    questions = prepared.questions;
  }

  const isLearningAttempt = rawSubject !== 'inglise-keel';
  const isTextProblems = rawSubject === 'matemaatika' && (topic === 'tekstulesanded' || category === 'Tekstülesanded');
  const usesProvidedCount = rawSubject === 'lugemine' || rawSubject === 'loodusopetus' || isTextProblems;
  const legacyQuestionCount = usesProvidedCount ? Number(input.questionCount) || 0 : isLearningAttempt ? 15 : Number(input.questionCount) || 0;
  const questionCount = v2?.questionCount ?? legacyQuestionCount;
  const score = v2?.score ?? Math.max(0, Math.min(Math.floor(Number(input.score) || 0), questionCount));
  const elapsedSeconds = Number(input.elapsedSeconds) || 0;
  const difficulty = typeof input.difficulty === 'string' && input.difficulty ? input.difficulty : 'Lihtne';
  const exerciseId = typeof input.exerciseId === 'string' && input.exerciseId ? input.exerciseId : exercise?.id ?? null;
  const rawCompleted = v2?.rawDeviceCompletedAt ?? input.rawDeviceCompletedAt ?? input.completedAt ?? input.createdAt ?? serverNow;
  const proposed = v2?.effectiveCompletedAt ?? input.completedAt ?? input.createdAt ?? serverNow;
  const effectiveCompleted = v2?.effectiveCompletedAt ?? (Date.parse(proposed) > Date.parse(serverNow) + FUTURE_SKEW_MS ? serverNow : proposed);
  const completionDate = v2?.completionDate ?? isoToAppDate(effectiveCompleted);

  let permitted = true;
  let review = Boolean(v2?.reviewReason);
  let reasonCode: string | undefined = v2?.reviewReason;
  if (protocolVersion === 2) {
    if (!learner || !input.catalogueVersion || !input.deviceId) {
      return { status: 'rejected', reasonCode: 'invalid_request', message: 'Catalogue grant identity is incomplete.' };
    }
    const grant = catalogueGrantForAttempt(learner, input.catalogueVersion, input.deviceId);
    const runnerContract = grant
      ? runnerContractForGrant(grant, String(input.runnerId))
      : getOfflineRunnerCapability(String(input.runnerId)) ?? null;
    if (!runnerContract || !runnerContract.learners.includes(learner)) {
      return { status: 'rejected', reasonCode: 'unknown_runner_contract', message: 'Runner contract is not supported.' };
    }
    if (runnerContract.runnerId !== 'math' && runnerContract.id !== exerciseId) {
      return { status: 'rejected', reasonCode: 'runner_exercise_mismatch', message: 'Runner does not own this exercise.' };
    }
    if (!grant) {
      permitted = false;
      review = true;
      reasonCode = reasonCode ?? 'unknown_catalogue_grant';
    } else if (!metadataMatchesContract(input as unknown as Record<string, unknown>, {
      learner,
      exerciseId: exerciseId ?? '',
      catalogueVersion: grant.catalogueVersion,
      rewardPolicyVersion: grant.rewardPolicyVersion,
      generatorVersion: runnerContract.generatorVersion,
      runnerVersion: runnerContract.runnerVersion,
      rotationVersion: runnerContract.rotationVersion
    })) {
      return { status: 'rejected', reasonCode: 'metadata_mismatch', message: 'Attempt metadata does not match its catalogue grant.' };
    } else if (!rewardPolicyByVersion(grant.rewardPolicyVersion)) {
      return { status: 'rejected', reasonCode: 'unknown_reward_policy', message: 'Reward policy is not available.' };
    }
  }

  if (input.catalogueVersion) {
    if (!learner) return { status: 'rejected', reasonCode: 'bad_payload', message: 'Vale laps.' };
    const validation = validateAgainstCatalogue({ learner, version: input.catalogueVersion, exerciseId, subject: rawSubject ?? '', topic, category });
    if (validation.verdict === 'accept' || validation.verdict === 'stale') {
      if (validation.verdict === 'stale') reasonCode = reasonCode ?? 'stale';
    } else {
      permitted = false;
      review = true;
      reasonCode = reasonCode ?? validation.reasonCode;
    }
  } else if (learner && subject && !isLearningExerciseActiveForAttempt({ learner, subject, topic, category })) {
    return { status: 'rejected', reasonCode: 'not_active', message: 'Harjutus ei ole praegu aktiivne.' };
  }

  const insertRow = db.prepare(`
    INSERT INTO attempts (
      createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, subject, topic, exerciseId,
      clientAttemptId, deviceId, startedAt, completedAt, rawDeviceCompletedAt, syncedAt,
      catalogueVersion, clientTimeZone, clientUtcOffsetMinutes,
      clientCorrectedCompletedAt, effectiveCompletedAt, completionDate, clockStatus, clockSkewMs,
      rewardPolicyVersion, rewardEngineVersion, generatorVersion, runnerId, runnerVersion,
      rotationVersion, runnerSeed, questionIdsJson, protocolVersion
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const run = db.transaction((): InsertAttemptResult => {
    if (input.clientAttemptId) {
      const duplicate = existingByClientId(input.clientAttemptId);
      if (duplicate) return { status: 'duplicate', serverAttemptId: duplicate.id, reward: rewardForExisting(duplicate) };
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
      input.syncedAt ?? serverNow,
      input.catalogueVersion ?? null,
      input.clientTimeZone ?? null,
      typeof input.clientUtcOffsetMinutes === 'number' ? input.clientUtcOffsetMinutes : null,
      v2?.clientCorrectedCompletedAt ?? null,
      v2?.effectiveCompletedAt ?? null,
      completionDate,
      v2?.clockStatus ?? 'legacy',
      v2?.clockSkewMs ?? null,
      input.rewardPolicyVersion ?? null,
      protocolVersion === 2 ? 2 : null,
      input.generatorVersion ?? null,
      input.runnerId ?? null,
      input.runnerVersion ?? null,
      input.rotationVersion ?? null,
      input.seed == null ? null : String(input.seed),
      input.questionIds ? JSON.stringify(input.questionIds) : null,
      protocolVersion
    );
    const attemptId = Number(result.lastInsertRowid);
    if (protocolVersion === 2) settlementFaultInjector?.('after_attempt');

    // In v2, every side effect is authoritative and must roll back with the
    // attempt. Legacy v1 keeps its prior best-effort behavior during sunset.
    if (protocolVersion === 2) {
      if (permitted) captureMistakesForAttempt({ attemptId, learner, subject, topic, category, questions });
      settlementFaultInjector?.('after_mistakes');
    } else {
      try {
        captureMistakesForAttempt({ attemptId, learner, subject, topic, category, questions });
      } catch (error) {
        console.warn('Mistake capture failed', error);
      }
    }

    const reward = permitted
      ? protocolVersion === 2 && learner
        ? applyRewardProjectionV2(learner, attemptId).rewardForTrigger
        : awardStudyPointsForAttempt(attemptId)
      : null;
    if (protocolVersion === 2) settlementFaultInjector?.('after_reward');

    if (permitted) {
      if (protocolVersion === 2) recordDailyLeaderboard(completionDate ?? undefined);
      else {
        try {
          recordDailyLeaderboard(completionDate ?? undefined);
        } catch (error) {
          console.warn('Daily leaderboard snapshot failed', error);
        }
      }
    }
    if (protocolVersion === 2) settlementFaultInjector?.('after_leaderboard');

    return { status: review ? 'needs_review' : 'created', serverAttemptId: attemptId, reward: reward ?? undefined, reasonCode };
  });

  const result = run();
  if (protocolVersion === 1 && permitted && result.status === 'created' && learner) {
    const day = isoToAppDate(effectiveCompleted);
    if (day && day < todayDateString()) {
      try {
        reconcileStudyRewards(learner, day, 'late_attempt');
      } catch (error) {
        console.warn('Reconciliation audit failed', error);
      }
    }
  }
  return result;
}
