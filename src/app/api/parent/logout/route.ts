import { NextResponse } from 'next/server';
import { clearParentSession } from '@/lib/parentAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST() {
  await clearParentSession();
  return NextResponse.json({ ok: true });
}
