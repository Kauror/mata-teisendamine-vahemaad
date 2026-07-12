import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Public liveness probe for orchestration (docker compose healthcheck, uptime
// checks). Deliberately reveals nothing private and touches no database — it
// only proves the server process is accepting requests. Marked public in
// middleware so it never requires a family session (RTM2-H02).
export async function GET() {
  return NextResponse.json({ ok: true }, { headers: { 'Cache-Control': 'no-store' } });
}
