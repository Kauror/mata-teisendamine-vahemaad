import { NextRequest, NextResponse } from 'next/server';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { VOCAB_LEARNER } from '@/lib/vocabulary/constants';
import { unitTestErrorResponse, validAttemptId } from '@/lib/server/unitTests/http';
import { getChildAttempt, saveUnitTestAnswers } from '@/lib/server/unitTests/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!validAttemptId(id)) return NextResponse.json({ code: 'not_found', message: 'Kontrolltööd ei leitud.' }, { status: 404 });
  try {
    return NextResponse.json(getChildAttempt(VOCAB_LEARNER, id));
  } catch (error) {
    return unitTestErrorResponse(error);
  }
}

// Saves the answers; with `submit: true` hands the test in for the parent.
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!validAttemptId(id)) return NextResponse.json({ code: 'not_found', message: 'Kontrolltööd ei leitud.' }, { status: 404 });
  const jsonBody = await readJsonObjectRequest(req);
  if (jsonBody instanceof NextResponse) return jsonBody;
  const body = jsonBody as { revision?: unknown; answers?: unknown; submit?: unknown };
  try {
    return NextResponse.json(saveUnitTestAnswers(VOCAB_LEARNER, id, { revision: body.revision, answers: body.answers, submit: body.submit === true }));
  } catch (error) {
    return unitTestErrorResponse(error);
  }
}
