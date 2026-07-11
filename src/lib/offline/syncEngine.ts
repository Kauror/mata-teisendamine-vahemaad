import { attemptRepo, catalogRepo, historyRepo, snapshotRepo } from '@/lib/offline/repositories';
import { getCursor, setCursor, getDeviceId, getServerOffsetMs } from '@/lib/offline/meta';
import { pingServer } from '@/lib/offline/connection';
import { withSyncLock } from '@/lib/offline/syncLock';
import type { LocalAttempt } from '@/lib/offline/records';
import {
  APP_VERSION,
  OFFLINE_PROTOCOL_VERSION,
  type OfflineAttemptPayload,
  type OfflineSyncRequest,
  type OfflineSyncResponse
} from '@/lib/shared/types';

export type SyncOutcome = { ok: boolean; reason?: string; pushed: number; pulled: number };

function toPayload(a: LocalAttempt): OfflineAttemptPayload {
  return {
    clientAttemptId: a.clientAttemptId,
    deviceId: a.deviceId,
    learner: a.learner,
    subject: a.subject,
    topic: a.topic,
    category: a.category,
    difficulty: a.difficulty,
    exerciseId: a.exerciseId,
    catalogueVersion: a.catalogueVersion,
    startedAt: a.startedAt,
    rawDeviceCompletedAt: a.rawDeviceCompletedAt,
    completedAt: a.completedAt,
    clientTimeZone: a.clientTimeZone,
    clientUtcOffsetMinutes: a.clientUtcOffsetMinutes,
    questionCount: a.questionCount,
    score: a.score,
    elapsedSeconds: a.elapsedSeconds,
    questions: a.questions
  };
}

// Full push-before-pull cycle, guarded by the single-device lock.
// `reason` is accepted for call-site clarity/telemetry; the cycle itself is the
// same regardless of what triggered it.
export async function syncNow(reason: string): Promise<SyncOutcome> {
  void reason;
  const outcome = await withSyncLock(() => runSyncCycle());
  return outcome ?? { ok: false, reason: 'locked', pushed: 0, pulled: 0 };
}

async function runSyncCycle(): Promise<SyncOutcome> {
  // 1. Prove reachability (also refreshes the clock offset).
  const ping = await pingServer();
  if (!ping) return { ok: false, reason: 'offline', pushed: 0, pulled: 0 };

  const deviceId = await getDeviceId();
  const cursor = await getCursor();
  const pending = await attemptRepo.pending();

  // Mark pending → syncing so a concurrent finish doesn't double-send.
  for (const attempt of pending) {
    if (attempt.status === 'pending') {
      attempt.status = 'syncing';
      await attemptRepo.put(attempt);
    }
  }

  const request: OfflineSyncRequest = {
    protocolVersion: OFFLINE_PROTOCOL_VERSION,
    device: {
      deviceId,
      appVersion: APP_VERSION,
      timeZone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : 'Europe/Tallinn',
      clientNow: new Date().toISOString(),
      lastKnownServerOffsetMs: await getServerOffsetMs()
    },
    cursor: {
      lastServerAttemptId: cursor.lastServerAttemptId,
      historyEpoch: cursor.historyEpoch,
      catalogueVersions: cursor.catalogueVersions,
      lastSuccessfulSyncAt: cursor.lastSuccessfulSyncAt
    },
    pending: { attempts: pending.map(toPayload) }
  };

  let response: OfflineSyncResponse;
  try {
    const res = await fetch('/api/offline/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    });
    if (!res.ok) throw new Error(`sync-http-${res.status}`);
    response = (await res.json()) as OfflineSyncResponse;
  } catch (error) {
    // Transient: never mark rejected. Revert syncing → pending for retry.
    for (const attempt of pending) {
      const current = await attemptRepo.get(attempt.clientAttemptId);
      if (current && current.status === 'syncing') {
        current.status = 'pending';
        current.lastError = String(error);
        current.retryCount += 1;
        await attemptRepo.put(current);
      }
    }
    return { ok: false, reason: 'transient', pushed: 0, pulled: 0 };
  }

  // 2. Apply per-record acknowledgements.
  for (const result of response.attemptResults) {
    const attempt = await attemptRepo.get(result.clientAttemptId);
    if (!attempt) continue;
    if (result.status === 'created' || result.status === 'duplicate') {
      // Confirmed → the authoritative row now lives in history; drop the local copy.
      await attemptRepo.delete(attempt.clientAttemptId);
    } else if (result.status === 'needs_review') {
      attempt.status = 'needs_review';
      attempt.serverAttemptId = result.serverAttemptId;
      attempt.reasonCode = result.reasonCode;
      await attemptRepo.put(attempt);
    } else if (result.status === 'rejected') {
      attempt.status = 'rejected';
      attempt.reasonCode = result.reasonCode;
      attempt.lastError = result.message;
      await attemptRepo.put(attempt);
    }
  }

  // 3. Merge pulled server data (never clobbering remaining pending work).
  await catalogRepo.put(response.pull.catalogues.kiur);
  await catalogRepo.put(response.pull.catalogues.kirsi);
  await snapshotRepo.put(response.pull.dashboards.kiur);
  await snapshotRepo.put(response.pull.dashboards.kirsi);
  await historyRepo.putMany(response.pull.attempts);

  // 4. Save the new cursor + last-sync time.
  await setCursor({
    lastServerAttemptId: response.nextCursor.lastServerAttemptId,
    historyEpoch: response.nextCursor.historyEpoch,
    catalogueVersions: response.nextCursor.catalogueVersions,
    lastSuccessfulSyncAt: response.nextCursor.syncedAt,
    lastAttemptedSyncAt: response.serverTime
  });

  return { ok: true, pushed: pending.length, pulled: response.pull.attempts.length };
}
