import { NextRequest, NextResponse } from 'next/server';
import { VOCAB_LEARNER } from '@/lib/vocabulary/constants';
import { vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { startOrResumeSession } from '@/lib/server/vocabulary/sessions';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Starts a study, test or practice session, or returns the one in progress.
// Every lock is checked on the server; the request only names the unit.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { unitId?: unknown; mode?: unknown };
  const mode = body.mode;
  if (mode !== 'study' && mode !== 'test' && mode !== 'practice') {
    return NextResponse.json({ code: 'invalid', message: 'Vale harjutusviis.' }, { status: 400 });
  }
  const unitId = typeof body.unitId === 'string' && body.unitId.length <= 64 ? body.unitId : null;
  try {
    return NextResponse.json(startOrResumeSession(VOCAB_LEARNER, { unitId, mode }));
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
