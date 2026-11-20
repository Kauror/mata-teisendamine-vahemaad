import { NextResponse } from 'next/server';
import { databaseHealth } from '@/lib/server/databaseHealth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Public liveness probe (see lib/server/databaseHealth.ts). Marked public in
// middleware, reveals nothing private, and is unhealthy when SQLite is not.
export async function GET() {
  const health = databaseHealth();
  return NextResponse.json(
    { ok: health.ok },
    { status: health.ok ? 200 : 503, headers: { 'Cache-Control': 'no-store' } }
  );
}
