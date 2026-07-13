import { NextRequest, NextResponse } from 'next/server';
import { runSyncPullV2, runSyncPushV2 } from '@/lib/offline/server/syncService';
import type { OfflineSyncPullRequestV2, OfflineSyncPushRequestV2 } from '@/lib/shared/types';
import { parseOfflineSyncRequest, PublicRequestError, readJsonBody } from '@/lib/server/http/requestValidation';
import { runSyncRouteFaultInjector } from './faultInjection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

async function getDb() {
  return (await import('@/lib/db')).default;
}

// Unified push-before-pull sync. Untrusted client input: validated, batch-limited,
// idempotent per clientAttemptId. Behind the app-access middleware. deviceId and
// learner are identification only — never authorisation.
export async function POST(req: NextRequest) {
  await getDb();
  try {
    const body = parseOfflineSyncRequest(await readJsonBody(req));
    runSyncRouteFaultInjector();
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
