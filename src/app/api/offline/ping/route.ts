import { NextResponse } from 'next/server';
import { APP_VERSION, type PingResponse } from '@/lib/shared/types';
import { advertisedProtocolVersion, advertisedSupportedProtocolVersions } from '@/lib/offline/protocol';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Lightweight reachability + server-clock probe. Sits behind the existing
// app-access middleware like every other non-public route. Advertises v2 only
// when v2 attempt insertion is actually enabled, so clients never negotiate a
// protocol the server would then reject (RTM-002).
export async function GET() {
  const body: PingResponse = {
    ok: true,
    serverTime: new Date().toISOString(),
    protocolVersion: advertisedProtocolVersion(),
    supportedProtocolVersions: advertisedSupportedProtocolVersions(),
    appVersion: APP_VERSION
  };
  return NextResponse.json(body, { headers: { 'Cache-Control': 'no-store' } });
}
