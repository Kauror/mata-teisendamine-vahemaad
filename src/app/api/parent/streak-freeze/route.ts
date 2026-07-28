import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { getStreakFreezeState, grantStreakFreeze, settleStreakFreezes } from '@/lib/streakFreeze';
import type { Learner } from '@/lib/tasks';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const LEARNERS: Learner[] = ['kiur', 'kirsi'];

function parseLearner(value: unknown): Learner | null {
  return value === 'kiur' || value === 'kirsi' ? value : null;
}

export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  // Settle before reporting so the parent sees the same state the child does.
  for (const learner of LEARNERS) settleStreakFreezes(learner);
  return NextResponse.json({
    kiur: getStreakFreezeState('kiur'),
    kirsi: getStreakFreezeState('kirsi')
  });
}

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const body = await req.json();
    const learner = parseLearner(body.learner);
    if (!learner) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
    grantStreakFreeze(learner);
    return NextResponse.json({ state: getStreakFreezeState(learner) });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Külmutust ei saanud anda.' }, { status: 409 });
  }
}
