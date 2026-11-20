import { NextRequest, NextResponse } from 'next/server';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { VOCAB_LEARNER } from '@/lib/vocabulary/constants';
import { vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { applySessionAction, getSessionView } from '@/lib/server/vocabulary/sessions';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

function validId(id: string) {
  return /^vs_[0-9a-f-]{36}$/u.test(id);
}

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!validId(id)) return NextResponse.json({ code: 'not_found', message: 'Harjutuskorda ei leitud.' }, { status: 404 });
  try {
    return NextResponse.json(getSessionView(VOCAB_LEARNER, id));
  } catch (error) {
    return vocabErrorResponse(error);
  }
}

// One child action. `actionId` makes a retried request harmless; `revision`
// refuses an action from a tab that fell behind.
export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;
  if (!validId(id)) return NextResponse.json({ code: 'not_found', message: 'Harjutuskorda ei leitud.' }, { status: 404 });
  const jsonBody = await readJsonObjectRequest(req);
  if (jsonBody instanceof NextResponse) return jsonBody;
  const body = jsonBody as { actionId?: unknown; revision?: unknown; action?: unknown };
  try {
    return NextResponse.json(applySessionAction(VOCAB_LEARNER, id, { actionId: body.actionId, revision: body.revision, action: body.action }));
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
