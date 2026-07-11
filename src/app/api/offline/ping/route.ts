import { NextResponse } from 'next/server';
import { APP_VERSION, OFFLINE_PROTOCOL_VERSION, type PingResponse } from '@/lib/shared/types';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lightweight reachability + server-clock probe. Sits behind the existing
// app-access middleware like every other non-public route.
export async function GET() {
  const body: PingResponse = {
    ok: true,
    serverTime: new Date().toISOString(),
    protocolVersion: OFFLINE_PROTOCOL_VERSION,
    appVersion: APP_VERSION
  };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
}
