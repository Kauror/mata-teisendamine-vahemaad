import { NextRequest, NextResponse } from 'next/server';
import { runSyncPullV2, runSyncPushV2 } from '@/lib/offline/server/syncService';
import type { OfflineSyncPullRequestV2, OfflineSyncPushRequestV2 } from '@/lib/shared/types';
import { parseOfflineSyncRequest, PublicRequestError, readJsonBody } from '@/lib/server/http/requestValidation';
import { runSyncRouteFaultInjector } from './faultInjection';
import { PEEK_READ_ONLY_ACTION_MESSAGE, PEEK_READ_ONLY_CODE } from '@/lib/peekMode';
import { isPeekingRequest } from '@/lib/server/peekRequest';
import { assertDeviceMayActAs } from '@/lib/server/deviceAccess';
import type { ChildLearner } from '@/lib/auth/deviceBinding';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getDb() {
  return (await import('@/lib/db')).default;
}

// The learners a push would write for, as the records claim them.
function pushLearners(body: OfflineSyncPushRequestV2): ChildLearner[] {
  const pending = body.pending as unknown as Record<string, unknown>;
  const learners = new Set<ChildLearner>();
  for (const key of ['attempts', 'taskActions', 'remediationActions']) {
    const records = Array.isArray(pending?.[key]) ? pending[key] as unknown[] : [];
    for (const record of records) {
      const learner = (record as { learner?: unknown } | null)?.learner;
      if (learner === 'kiur' || learner === 'kirsi') learners.add(learner);
    }
  }
  return [...learners];
}

// Unified push-before-pull sync. Untrusted client input: validated, batch-limited,
// idempotent per clientAttemptId. Behind the app-access middleware. deviceId and
// learner are identification only — never authorisation.
export async function POST(req: NextRequest) {
  await getDb();
  try {
    const body = parseOfflineSyncRequest(await readJsonBody(req));
    runSyncRouteFaultInjector();
    if (body.phase === 'push') {
      // Peek mode is read-only: a signed-in parent (not "Vaata nagu laps")
      // may pull, but never push attempts or task actions for a child (C3b).
      if (await isPeekingRequest(req)) {
        return NextResponse.json({ code: PEEK_READ_ONLY_CODE, message: PEEK_READ_ONLY_ACTION_MESSAGE }, { status: 403 });
      }
      // A device bound to one child cannot push records for the other (B4).
      // The whole batch is refused so the rows stay in the device outbox.
      const deviceDenied = await assertDeviceMayActAs(req, pushLearners(body as OfflineSyncPushRequestV2));
      if (deviceDenied) return deviceDenied;
    }
    const response = body.phase === 'push'
      ? runSyncPushV2(body as OfflineSyncPushRequestV2)
      : runSyncPullV2(body as OfflineSyncPullRequestV2);
    return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    if (error instanceof PublicRequestError) {
      return NextResponse.json({ code: error.code, message: error.message, issues: error.issues }, { status: error.status });
    }
    console.error('offline sync failed', error);
    return NextResponse.json(
      { code: 'internal_error', message: 'Sync is temporarily unavailable.' },
      { status: 500 }
    );
  }
}
