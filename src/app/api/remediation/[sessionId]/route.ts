import { NextRequest, NextResponse } from 'next/server';
import { isLearner } from '@/lib/learningExercises';
import { getRemediationSession, submitRemediationSession } from '@/lib/remediation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const learner = req.nextUrl.searchParams.get('learner');
  const { sessionId } = await params;
  const id = Number(sessionId);
  if (!isLearner(learner) || !Number.isInteger(id)) return NextResponse.json({ message: 'Vale kordamine.' }, { status: 400 });
  const session = getRemediationSession(id, learner);
  if (!session) return NextResponse.json({ message: 'Kordamist ei leitud.' }, { status: 404 });
  return NextResponse.json(session);
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ sessionId: string }> }) {
  const { sessionId } = await params;
  const id = Number(sessionId);
  const body = await req.json().catch(() => ({}));
  const learner = body.learner;
  const answers = Array.isArray(body.answers) ? body.answers : [];
  const elapsedSeconds = Number(body.elapsedSeconds) || 0;

  if (!isLearner(learner) || !Number.isInteger(id)) return NextResponse.json({ message: 'Vale kordamine.' }, { status: 400 });

  try {
    // The daily leaderboard is refreshed inside the submission transaction, for
    // the attempt's own completion day (SRV-06).
    const result = submitRemediationSession({ learner, sessionId: id, answers, elapsedSeconds });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Kordamist ei saanud salvestada.' }, { status: 400 });
  }
}
