import db, { stmt } from '@/lib/db';
import { getStudyReward } from '@/lib/learningPoints';
import { findLearningExerciseForAttempt, isLearner, isLearningExerciseSubject } from '@/lib/learningExercises';
import { captureMistakesForAttempt } from '@/lib/remediation';
import { rebuildDailyLeaderboard, recordDailyLeaderboard } from '@/lib/leaderboard';
import { isoToAppDate, nowIso } from '@/lib/tasks';
import { validateAgainstCatalogue } from '@/lib/offline/server/catalogVersions';
import { recomputeScore, AttemptContractError } from '@/lib/server/attempts/scoreVerifier';
import { catalogueGrantForAttempt, rewardPolicyByVersion, runnerContractForGrant } from '@/lib/server/rewards/policy';
import { applyRewardProjectionV2, getProjectedRewardV2 } from '@/lib/server/rewards/projection';
import { recomputeSprintQualifications } from '@/lib/sprintQualification';
import { metadataMatchesContract, validateAttemptRecordV2 } from '@/lib/server/http/requestValidation';
import { getOfflineRunnerCapability } from '@/lib/offline/capabilities';
import { isOfflineProtocolV2Enabled } from '@/lib/offline/protocol';
import { validateAttemptTiming } from '@/lib/offline/server/attemptTiming';
import { MATH_GENERATOR_VERSIONS } from '@/lib/exercises/mathGeneratorVersion';
import { createHash } from 'node:crypto';

// The one insertion path for exercise attempts: protocol-v2 sync, with strict
// contract validation and server score recomputation. Rows written by the
// retired v1 path stay in the table and are still read everywhere (history,
// balances, duplicates); only writing them is gone.

export type InsertAttemptInput = {
  protocolVersion: 2;
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
  return stmt('SELECT id, protocolVersion, attemptFingerprint FROM attempts WHERE clientAttemptId = ?').get(clientAttemptId) as { id: number; protocolVersion: number; attemptFingerprint: string | null } | undefined;
}

function attemptFingerprint(input: InsertAttemptInput, prepared: V2Preparation) {
  const data = JSON.stringify({ id: input.clientAttemptId, device: input.deviceId, learner: input.learner, runner: input.runnerId, exercise: input.exerciseId, catalogue: input.catalogueVersion, policy: input.rewardPolicyVersion, generator: input.generatorVersion, version: input.runnerVersion, rotation: input.rotationVersion, seed: input.seed, ids: input.questionIds, answers: prepared.questions.map((row) => [row.id, row.userAnswer ?? row.selectedAnswer ?? row.selectedLetter ?? row.selectedWord ?? row.answer ?? '']), completed: prepared.clientCorrectedCompletedAt, raw: prepared.rawDeviceCompletedAt });
  return createHash('sha256').update(data).digest('hex');
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
  if (!isOfflineProtocolV2Enabled()) {
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
      generatorVersion: String(input.generatorVersion),
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
  const learner = isLearner(input.learner) ? input.learner : null;
  const subject = isLearningExerciseSubject(input.subject) ? input.subject : null;
  const rawSubject = typeof input.subject === 'string' ? input.subject : null;
  const topic = typeof input.topic === 'string' ? input.topic : '';
  const category = typeof input.category === 'string' ? input.category : '';
  const exercise = learner && subject ? findLearningExerciseForAttempt({ learner, subject, topic, category }) : null;

  const v2 = prepareV2(input, serverNow);
  if ('status' in v2) return v2;
  const questions = v2.questions;
  if (input.clientAttemptId) {
    const existing = existingByClientId(input.clientAttemptId);
    if (existing) {
      if (existing.attemptFingerprint === attemptFingerprint(input, v2)) return { status: 'duplicate', serverAttemptId: existing.id, reward: rewardForExisting(existing) };
      return { status: 'needs_review', serverAttemptId: existing.id, reasonCode: 'attempt_id_conflict', message: 'Attempt ID already exists with different data.' };
    }
  }

  const { questionCount, score } = v2;
  const elapsedSeconds = Number(input.elapsedSeconds) || 0;
  const difficulty = typeof input.difficulty === 'string' && input.difficulty ? input.difficulty : 'Lihtne';
  const exerciseId = typeof input.exerciseId === 'string' && input.exerciseId ? input.exerciseId : exercise?.id ?? null;
  const effectiveCompleted = v2.effectiveCompletedAt;
  const completionDate = v2.completionDate;

  let permitted = true;
  let review = Boolean(v2.reviewReason);
  let reasonCode: string | undefined = v2.reviewReason;
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
    acceptedGeneratorVersions: runnerContract.runnerId === 'math' ? MATH_GENERATOR_VERSIONS : undefined,
    runnerVersion: runnerContract.runnerVersion,
    rotationVersion: runnerContract.rotationVersion
  })) {
    return { status: 'rejected', reasonCode: 'metadata_mismatch', message: 'Attempt metadata does not match its catalogue grant.' };
  } else if (!rewardPolicyByVersion(grant.rewardPolicyVersion)) {
    return { status: 'rejected', reasonCode: 'unknown_reward_policy', message: 'Reward policy is not available.' };
  } else {
    const timing = validateAttemptTiming({
      serverReceivedAt: serverNow,
      rawDeviceCompletedAt: v2.rawDeviceCompletedAt,
      clientCorrectedCompletedAt: v2.clientCorrectedCompletedAt,
      startedAt: input.startedAt,
      grant,
      lastKnownServerOffsetMs: null
    });
    if (timing.verdict === 'reject') return { status: 'rejected', reasonCode: timing.reasonCode, message: 'Attempt completion time is not acceptable.' };
    if (timing.verdict === 'review') {
      review = true;
      reasonCode = timing.reasonCode;
    }
  }

  const validation = validateAgainstCatalogue({ learner, version: input.catalogueVersion, exerciseId, subject: rawSubject ?? '', topic, category });
  if (validation.verdict === 'accept' || validation.verdict === 'stale') {
    if (validation.verdict === 'stale') reasonCode = reasonCode ?? 'stale';
  } else {
    permitted = false;
    review = true;
    reasonCode = reasonCode ?? validation.reasonCode;
  }

  // Authoritative reward eligibility, persisted on the row. Only 'eligible'
  // attempts ever enter the canonical reward projection; unpermitted attempts are
  // 'withheld' and clock-drift / policy holds are 'needs_review'. Neither awards,
  // affects the daily cap/decay, nor contributes to a streak until separately
  // approved (RTM-003).
  const eligible = permitted && !review;
  const settlementStatus = eligible ? 'eligible' : review ? 'needs_review' : 'withheld';
  // RTM3-M02: persist the actual hold reason so the parent review surface can
  // explain a held attempt regardless of whether the hold came from clock drift,
  // an unknown catalogue grant, a not-permitted exercise or any other check. An
  // eligible attempt carrying a soft 'stale' note is not a review case and
  // keeps a NULL reason.
  const persistedReviewReasonCode = !eligible ? reasonCode ?? null : null;

  const insertRow = stmt(`
    INSERT INTO attempts (
      createdAt, category, difficulty, questionCount, score, elapsedSeconds, questions,
      learner, subject, topic, exerciseId,
      clientAttemptId, deviceId, startedAt, completedAt, rawDeviceCompletedAt, syncedAt,
      catalogueVersion, clientTimeZone, clientUtcOffsetMinutes,
      clientCorrectedCompletedAt, effectiveCompletedAt, completionDate, clockStatus, clockSkewMs,
      rewardPolicyVersion, rewardEngineVersion, generatorVersion, runnerId, runnerVersion,
      rotationVersion, runnerSeed, questionIdsJson, protocolVersion, rewardSettlementStatus, reviewReasonCode, attemptFingerprint
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  // Every side effect is authoritative and rolls back with the attempt.
  const run = db.transaction((): InsertAttemptResult => {
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
      v2.rawDeviceCompletedAt,
      input.syncedAt ?? serverNow,
      input.catalogueVersion ?? null,
      input.clientTimeZone ?? null,
      typeof input.clientUtcOffsetMinutes === 'number' ? input.clientUtcOffsetMinutes : null,
      v2.clientCorrectedCompletedAt,
      v2.effectiveCompletedAt,
      completionDate,
      v2.clockStatus,
      v2.clockSkewMs,
      input.rewardPolicyVersion ?? null,
      2,
      input.generatorVersion ?? null,
      input.runnerId ?? null,
      input.runnerVersion ?? null,
      input.rotationVersion ?? null,
      input.seed == null ? null : String(input.seed),
      input.questionIds ? JSON.stringify(input.questionIds) : null,
      2,
      settlementStatus,
      persistedReviewReasonCode,
      attemptFingerprint(input, v2)
    );
    const attemptId = Number(result.lastInsertRowid);
    const isKiurSprint = learner === 'kiur' && (subject ?? rawSubject) === 'inglise-keel' && topic === 'sprint';
    if (isKiurSprint) {
      recomputeSprintQualifications();
    }
    settlementFaultInjector?.('after_attempt');

    if (permitted) captureMistakesForAttempt({ attemptId, learner, subject, topic, category, questions });
    settlementFaultInjector?.('after_mistakes');

    // Award only when the attempt is eligible (permitted and not held for review).
    const reward = eligible ? applyRewardProjectionV2(learner, attemptId).rewardForTrigger : null;
    settlementFaultInjector?.('after_reward');

    if (eligible) {
      recordDailyLeaderboard(completionDate ?? undefined);
      // An older offline sprint can revise qualification on a later day, so a
      // one-day refresh is insufficient. Rebuild all derived daily/monthly state.
      if (isKiurSprint) rebuildDailyLeaderboard();
    }
    settlementFaultInjector?.('after_leaderboard');

    return { status: review ? 'needs_review' : 'created', serverAttemptId: attemptId, reward: reward ?? undefined, reasonCode };
  });

  return run();
}
