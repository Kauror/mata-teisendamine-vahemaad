import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { Learner, manualPointAdjustment } from '@/lib/tasks';

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
    const amount = Number(body.amount);
    if (!learner) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
    return NextResponse.json(manualPointAdjustment(learner, amount, String(body.reason || '')));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Punkte ei saanud muuta.' }, { status: 400 });
  }
}
