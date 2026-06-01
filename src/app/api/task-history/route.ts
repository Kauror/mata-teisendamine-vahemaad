import { NextResponse } from 'next/server';
import { getTaskHistory } from '@/lib/tasks';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(getTaskHistory());
}
