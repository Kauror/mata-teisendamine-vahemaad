import { NextRequest, NextResponse } from 'next/server';
import { isLearner } from '@/lib/learningExercises';
import { getOpenRenderableMistakeCount, startRemediationSession } from '@/lib/remediation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const learner = req.nextUrl.searchParams.get('learner');
  if (!isLearner(learner)) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
  return NextResponse.json({ openCount: getOpenRenderableMistakeCount(learner) });
}

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const learner = body.learner;
  if (!isLearner(learner)) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });

  try {
    return NextResponse.json(startRemediationSession(learner), { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Kordamine ei ole praegu saadaval.' }, { status: 400 });
  }
}
