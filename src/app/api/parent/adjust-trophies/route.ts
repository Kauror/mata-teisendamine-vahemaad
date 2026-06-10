import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { adjustTrophies } from '@/lib/monthlyCompetition';
import type { Learner } from '@/lib/tasks';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseLearner(value: unknown): Learner | null {
  return value === 'kiur' || value === 'kirsi' ? value : null;
}

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const body = await req.json();
    const learner = parseLearner(body.learner);
    if (!learner) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
    const standing = adjustTrophies(learner, Number(body.amount), String(body.reason || ''));
    return NextResponse.json({ standing });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Karikaid ei saanud muuta.' }, { status: 400 });
  }
}
