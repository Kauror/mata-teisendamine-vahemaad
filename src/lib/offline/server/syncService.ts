import db from '@/lib/db';
import { getBalance, nowIso, type Learner } from '@/lib/tasks';
import { getActiveLearningStreak } from '@/lib/learningPoints';
import { getMonthlyTrophies } from '@/lib/monthlyCompetition';
import { insertAttempt } from '@/lib/offline/server/insertAttempt';
import { getCurrentCatalogue } from '@/lib/offline/server/catalogVersions';
import { applyOfflineTaskAction, getSyncTaskAssignments, getSyncTaskTemplates } from '@/lib/offline/server/taskSync';
import { getHistoryEpoch, getTombstonesAfter } from '@/lib/offline/server/tombstones';
import { getTaskChangesAfter, MAX_TASK_CHANGES_PER_SYNC } from '@/lib/offline/server/taskChanges';
import { getChangedAttemptIdsAfter, MAX_ATTEMPT_CHANGES_PER_SYNC } from '@/lib/offline/server/attemptChanges';
import { grantCatalogueContract } from '@/lib/server/rewards/policy';
import {
  validateAttemptRecordV2,
  validateRemediationActionRecordV2,
  validateTaskActionRecordV2
} from '@/lib/server/http/requestValidation';
import {
  GENERATOR_VERSION,
  LEGACY_RUNNER_VERSION,
  MAX_HISTORY_PULL_PER_SYNC,
  MAX_PENDING_ATTEMPTS_PER_SYNC,
  type AttemptResult,
  type ChildDashboardSnapshot,
  type OfflineCatalogue,
  type OfflineSyncPullRequestV2,
  type OfflineSyncPullResponseV2,
  type OfflineSyncPushRequestV2,
  type OfflineSyncPushResponseV2,
  type OfflineSyncRequestV1,
  type OfflineSyncResponseV1,
  type RemediationActionResult,
  type ServerAttempt,
  type TaskActionResult
} from '@/lib/shared/types';

function dashboardFor(learner: Learner): ChildDashboardSnapshot {
  return {
    learner,
    balance: getBalance(learner),
    streak: getActiveLearningStreak(learner),
    trophies: getMonthlyTrophies(learner),
    updatedAt: nowIso()
  };
}

function attemptsAfter(cursorId: number): ServerAttempt[] {
  return db.prepare(`
    SELECT a.id, a.clientAttemptId, a.createdAt, a.completedAt, a.category, a.difficulty, a.questions,
           a.questionCount, a.score, a.elapsedSeconds, a.learner, a.subject, a.topic, a.exerciseId,
           -- RTM3-M03: canonical total of every current reward component, so the
           -- device history shows the same stars the ledger actually granted.
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
           ), r.awardedAmount) AS earnedStars,
           a.rewardSettlementStatus AS rewardSettlementStatus,
           COALESCE(a.reviewReasonCode,
             CASE WHEN a.clockStatus = 'needs_review' THEN 'clock_drift' ELSE NULL END) AS reviewReasonCode
    FROM attempts a
    LEFT JOIN study_attempt_rewards r ON r.attemptId = a.id
    WHERE a.id > ?
    ORDER BY a.id ASC
    LIMIT ?
  `).all(cursorId, MAX_HISTORY_PULL_PER_SYNC) as ServerAttempt[];
}

function canonicalAttempt(id: number): ServerAttempt | undefined {
  return attemptsAfter(Math.max(0, id - 1)).find((row) => row.id === id);
}

// Canonical rows for a specific set of attempt ids, used to re-deliver attempts
// whose settlement/reward changed after they were first pulled (RTM3-H01).
function canonicalAttemptsByIds(ids: number[]): ServerAttempt[] {
  if (ids.length === 0) return [];
  const placeholders = ids.map(() => '?').join(', ');
  return db.prepare(`
    SELECT a.id, a.clientAttemptId, a.createdAt, a.completedAt, a.category, a.difficulty, a.questions,
           a.questionCount, a.score, a.elapsedSeconds, a.learner, a.subject, a.topic, a.exerciseId,
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
           ), r.awardedAmount) AS earnedStars,
           a.rewardSettlementStatus AS rewardSettlementStatus,
           COALESCE(a.reviewReasonCode,
             CASE WHEN a.clockStatus = 'needs_review' THEN 'clock_drift' ELSE NULL END) AS reviewReasonCode
    FROM attempts a
    LEFT JOIN study_attempt_rewards r ON r.attemptId = a.id
    WHERE a.id IN (${placeholders})
    ORDER BY a.id ASC
  `).all(...ids) as ServerAttempt[];
}

// The push-before-pull sync cycle: process uploaded attempts idempotently (in
// effective completion order), then return newer server data and the next cursor.
export function runSyncV1(request: OfflineSyncRequestV1): OfflineSyncResponseV1 {
  const serverTime = nowIso();
  const pendingAttempts = (request.pending?.attempts ?? []).slice(0, MAX_PENDING_ATTEMPTS_PER_SYNC);

  // Deterministic processing order by effective completion time, then clientAttemptId.
  const ordered = [...pendingAttempts].sort((a, b) => {
    const at = a.completedAt || '';
    const bt = b.completedAt || '';
    if (at !== bt) return at < bt ? -1 : 1;
    return (a.clientAttemptId || '').localeCompare(b.clientAttemptId || '');
  });

  const attemptResults: AttemptResult[] = [];
  for (const payload of ordered) {
    if (!payload?.clientAttemptId || typeof payload.clientAttemptId !== 'string') {
      attemptResults.push({ clientAttemptId: String(payload?.clientAttemptId ?? ''), status: 'rejected', reasonCode: 'bad_payload' });
      continue;
    }
    attemptResults.push({
      clientAttemptId: payload.clientAttemptId,
      status: 'needs_review',
      reasonCode: 'legacy_client_upgrade_required',
      message: 'Protocol v1 attempt was preserved for manual review and was not uploaded.'
    });
  }

  // Task actions are processed after attempts (both are child activity) and in
  // submission order; each is idempotent via clientActionId.
  const taskActionResults: TaskActionResult[] = [];
  for (const action of request.pending?.taskActions ?? []) {
    if (!action?.clientActionId || typeof action.clientActionId !== 'string') {
      taskActionResults.push({ clientActionId: String(action?.clientActionId ?? ''), status: 'rejected', reasonCode: 'bad_payload' });
      continue;
    }
    taskActionResults.push(applyOfflineTaskAction(action));
  }

  const catalogues = { kiur: getCurrentCatalogue('kiur'), kirsi: getCurrentCatalogue('kirsi') } as Record<Learner, OfflineCatalogue>;
  const dashboards = { kiur: dashboardFor('kiur'), kirsi: dashboardFor('kirsi') } as Record<Learner, ChildDashboardSnapshot>;
  const taskTemplates = getSyncTaskTemplates();

  const cursorId = Number(request.cursor?.lastServerAttemptId ?? 0) || 0;
  const pulledAttempts = attemptsAfter(cursorId);
  const maxId = pulledAttempts.reduce((max, row) => Math.max(max, row.id), cursorId);

  const tombstoneCursor = Number(request.cursor?.lastTombstoneId ?? 0) || 0;
  const tombstones = getTombstonesAfter(tombstoneCursor);
  const maxTombstoneId = tombstones.reduce((max, row) => Math.max(max, row.tombstoneId), tombstoneCursor);
  const epoch = getHistoryEpoch();

  return {
    protocolVersion: 1,
    serverTime,
    historyEpoch: epoch,
    attemptResults,
    taskActionResults,
    pull: {
      attempts: pulledAttempts,
      tombstones,
      catalogues,
      dashboards,
      taskTemplates
    },
    nextCursor: {
      lastServerAttemptId: maxId,
      lastTombstoneId: maxTombstoneId,
      historyEpoch: epoch,
      catalogueVersions: { kiur: catalogues.kiur.version, kirsi: catalogues.kirsi.version },
      syncedAt: serverTime
    }
  };
}

export function runSyncPushV2(request: OfflineSyncPushRequestV2): OfflineSyncPushResponseV2 {
  const serverTime = nowIso();
  const attemptResults: AttemptResult[] = [];
  const taskActionResults: TaskActionResult[] = [];
  const remediationActionResults: RemediationActionResult[] = [];

  for (const candidate of request.pending.attempts ?? []) {
    const validation = validateAttemptRecordV2(candidate, request.device.deviceId);
    if (!validation.ok) {
      attemptResults.push({
        clientAttemptId: validation.clientAttemptId,
        status: 'rejected',
        reasonCode: validation.reasonCode,
        message: validation.issues.join('; ')
      });
      continue;
    }
    const payload = validation.value;
    const result = insertAttempt({ ...payload, protocolVersion: 2, syncedAt: serverTime });
    const canonical = result.serverAttemptId ? canonicalAttempt(result.serverAttemptId) : undefined;
    attemptResults.push({
      clientAttemptId: payload.clientAttemptId,
      status: result.status,
      serverAttemptId: result.serverAttemptId,
      canonicalAttempt: canonical,
      reward: result.reward,
      reasonCode: result.reasonCode,
      message: result.message
    });
  }

  for (const candidate of request.pending.taskActions ?? []) {
    if (!validateTaskActionRecordV2(candidate, request.device.deviceId)) {
      taskActionResults.push({ clientActionId: String((candidate as { clientActionId?: unknown })?.clientActionId ?? ''), status: 'rejected', reasonCode: 'invalid_request' });
      continue;
    }
    taskActionResults.push(applyOfflineTaskAction(candidate));
  }

  for (const candidate of request.pending.remediationActions ?? []) {
    if (!validateRemediationActionRecordV2(candidate, request.device.deviceId)) {
      remediationActionResults.push({ clientActionId: String((candidate as { clientActionId?: unknown })?.clientActionId ?? ''), status: 'rejected', reasonCode: 'invalid_request' });
      continue;
    }
    // Prepared remediation settlement is deliberately retained for parent
    // review until the server session/action domain service is available. The
    // client keeps the complete answer payload and never silently discards it.
    remediationActionResults.push({
      clientActionId: candidate.clientActionId,
      status: 'needs_review',
      reasonCode: 'remediation_settlement_unavailable',
      message: 'Remediation work was preserved for review.'
    });
  }

  return { protocolVersion: 2, phase: 'push', serverTime, attemptResults, taskActionResults, remediationActionResults };
}

export function runSyncPullV2(request: OfflineSyncPullRequestV2): OfflineSyncPullResponseV2 {
  const serverTime = nowIso();
  const catalogues = { kiur: getCurrentCatalogue('kiur'), kirsi: getCurrentCatalogue('kirsi') } as Record<Learner, OfflineCatalogue>;
  const grants = {
    kiur: grantCatalogueContract({
      learner: 'kiur', catalogueVersion: catalogues.kiur.version, deviceId: request.device.deviceId,
      generatorVersion: GENERATOR_VERSION, runnerVersion: LEGACY_RUNNER_VERSION,
      rotationVersion: catalogues.kiur.algorithmVersion, issuedAt: catalogues.kiur.issuedAt, validUntil: catalogues.kiur.validUntil
    }),
    kirsi: grantCatalogueContract({
      learner: 'kirsi', catalogueVersion: catalogues.kirsi.version, deviceId: request.device.deviceId,
      generatorVersion: GENERATOR_VERSION, runnerVersion: LEGACY_RUNNER_VERSION,
      rotationVersion: catalogues.kirsi.algorithmVersion, issuedAt: catalogues.kirsi.issuedAt, validUntil: catalogues.kirsi.validUntil
    })
  };
  const pulledAttempts = attemptsAfter(request.cursor.lastServerAttemptId);
  const lastServerAttemptId = pulledAttempts.reduce((max, row) => Math.max(max, row.id), request.cursor.lastServerAttemptId);

  // RTM3-H01: re-deliver attempts whose settlement/reward changed after they were
  // first pulled (parent approval, or a late attempt revising an earlier reward).
  // Only those the device could already have cached (id <= new attempt cursor) need
  // resending; anything newer is already in pulledAttempts above.
  const attemptChangeCursor = getChangedAttemptIdsAfter(request.cursor.lastAttemptChangeId ?? 0, MAX_ATTEMPT_CHANGES_PER_SYNC);
  const alreadyPulled = new Set(pulledAttempts.map((row) => row.id));
  const changedIds = attemptChangeCursor.attemptIds.filter((id) => id <= lastServerAttemptId && !alreadyPulled.has(id));
  const changedAttempts = canonicalAttemptsByIds(changedIds);
  const attempts = [...pulledAttempts, ...changedAttempts];

  const tombstones = getTombstonesAfter(request.cursor.lastTombstoneId);
  const taskChanges = getTaskChangesAfter(request.cursor.lastTaskChangeId, MAX_TASK_CHANGES_PER_SYNC);
  const lastTombstoneId = tombstones.reduce((max, row) => Math.max(max, row.tombstoneId), request.cursor.lastTombstoneId);
  const lastTaskChangeId = taskChanges.reduce((max, row) => Math.max(max, row.changeId), request.cursor.lastTaskChangeId);
  const epoch = getHistoryEpoch();

  return {
    protocolVersion: 2,
    phase: 'pull',
    serverTime,
    historyEpoch: epoch,
    pull: {
      attempts,
      tombstones,
      taskChanges,
      remediationChanges: [],
      catalogues,
      catalogueGrants: grants,
      dashboards: { kiur: dashboardFor('kiur'), kirsi: dashboardFor('kirsi') },
      taskTemplates: getSyncTaskTemplates(),
      taskAssignments: getSyncTaskAssignments(),
      remediationBundles: []
    },
    hasMore: {
      // Keep paging while either fresh attempts or attempt-update notices remain.
      attempts: pulledAttempts.length >= MAX_HISTORY_PULL_PER_SYNC || attemptChangeCursor.attemptIds.length >= MAX_ATTEMPT_CHANGES_PER_SYNC,
      tombstones: false,
      taskChanges: taskChanges.length >= MAX_TASK_CHANGES_PER_SYNC,
      remediationChanges: false,
      historyBackfill: false
    },
    nextCursor: {
      ...request.cursor,
      lastServerAttemptId,
      lastTombstoneId,
      lastTaskChangeId,
      lastAttemptChangeId: attemptChangeCursor.lastChangeId,
      historyEpoch: epoch,
      catalogueVersions: { kiur: catalogues.kiur.version, kirsi: catalogues.kirsi.version },
      syncedAt: serverTime
    }
  };
}
