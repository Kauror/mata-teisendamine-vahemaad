import { NextRequest, NextResponse } from 'next/server';
import { VOCAB_LEARNER } from '@/lib/vocabulary/constants';
import { unitTestErrorResponse } from '@/lib/server/unitTests/http';
import { startOrResumeUnitTest } from '@/lib/server/unitTests/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Starts the unit's additional test (a random variant) or returns the one
// under way. Every rule is checked on the server.
export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({})) as { unitId?: unknown };
  const unitId = typeof body.unitId === 'string' && body.unitId.length <= 64 ? body.unitId : null;
  if (!unitId) return NextResponse.json({ code: 'invalid', message: 'Õppetükk puudub.' }, { status: 400 });
  try {
    return NextResponse.json(startOrResumeUnitTest(VOCAB_LEARNER, unitId));
  } catch (error) {
    return unitTestErrorResponse(error);
  }
}
