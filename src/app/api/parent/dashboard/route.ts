import { NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { getParentDashboard } from '@/lib/tasks';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  return NextResponse.json(getParentDashboard());
}
