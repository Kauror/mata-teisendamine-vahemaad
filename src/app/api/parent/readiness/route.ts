import { NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { checkDatabaseReadiness } from '@/lib/server/database/readiness';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!await hasParentSession()) {
    return NextResponse.json({ code: 'parent_auth_required' }, { status: 401 });
  }
  try {
    const db = (await import('@/lib/db')).default;
    checkDatabaseReadiness(db);
    return NextResponse.json({ ready: true });
  } catch (error) {
    console.error('Internal readiness check failed', error);
    return NextResponse.json({ ready: false }, { status: 503 });
  }
}
