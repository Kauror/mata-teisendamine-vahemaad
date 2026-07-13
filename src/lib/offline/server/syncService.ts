import { getBalance, nowIso, type Learner } from '@/lib/tasks';
import { getActiveLearningStreak } from '@/lib/learningPoints';
import { getMonthlyTrophies } from '@/lib/monthlyCompetition';
import { insertAttempt } from '@/lib/offline/server/insertAttempt';
import { getCurrentCatalogue } from '@/lib/offline/server/catalogVersions';
import { applyOfflineTaskAction, getSyncTaskAssignments, getSyncTaskTemplates } from '@/lib/offline/server/taskSync';
import { getHistoryEpoch, getTombstonePageAfter } from '@/lib/offline/server/tombstones';
import { getTaskChangesAfter, MAX_TASK_CHANGES_PER_SYNC } from '@/lib/offline/server/taskChanges';
import { getChangedAttemptIdsAfter, MAX_ATTEMPT_CHANGES_PER_SYNC } from '@/lib/offline/server/attemptChanges';
import { canonicalAttemptById, canonicalAttemptsAfter, canonicalAttemptsByIds } from '@/lib/server/attempts/canonicalAttempts';
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
  type AttemptResult,
  type ChildDashboardSnapshot,
  type OfflineCatalogue,
  type OfflineSyncPullRequestV2,
  type OfflineSyncPullResponseV2,
  type OfflineSyncPushRequestV2,
  type OfflineSyncPushResponseV2,
  type RemediationActionResult,
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
    const canonical = result.serverAttemptId ? canonicalAttemptById(result.serverAttemptId) : undefined;
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
  const pulledAttempts = canonicalAttemptsAfter(request.cursor.lastServerAttemptId, MAX_HISTORY_PULL_PER_SYNC);
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

  const tombstonePage = getTombstonePageAfter(request.cursor.lastTombstoneId);
  const tombstones = tombstonePage.tombstones;
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
      tombstones: tombstonePage.hasMore,
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
