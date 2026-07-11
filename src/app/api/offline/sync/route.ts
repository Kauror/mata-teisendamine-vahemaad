import { NextRequest, NextResponse } from 'next/server';
import { runSync } from '@/lib/offline/server/syncService';
import { OFFLINE_PROTOCOL_VERSION, type OfflineSyncRequest } from '@/lib/shared/types';

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
  let body: OfflineSyncRequest;
  try {
    body = (await req.json()) as OfflineSyncRequest;
  } catch {
    return NextResponse.json({ message: 'Vigane päring.' }, { status: 400 });
  }
  if (body?.protocolVersion !== OFFLINE_PROTOCOL_VERSION) {
    return NextResponse.json({ message: 'Toetamata protokolli versioon.', protocolVersion: OFFLINE_PROTOCOL_VERSION }, { status: 400 });
  }
  if (!body.device?.deviceId || typeof body.device.deviceId !== 'string') {
    return NextResponse.json({ message: 'Seadme ID puudub.' }, { status: 400 });
  }
  const response = runSync(body);
  return NextResponse.json(response, { headers: { 'Cache-Control': 'no-store' } });
}
