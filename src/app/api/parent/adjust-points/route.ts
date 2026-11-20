import { NextRequest, NextResponse } from 'next/server';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
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
    const jsonBody = await readJsonObjectRequest(req);
    if (jsonBody instanceof NextResponse) return jsonBody;
    const body = jsonBody;
    const learner = parseLearner(body.learner);
    const amount = Number(body.amount);
    if (!learner) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
    return NextResponse.json(manualPointAdjustment(learner, amount, String(body.reason || '')));
  } catch (error) {
    return NextResponse.json({ message: publicErrorMessage(error, 'Punkte ei saanud muuta.') }, { status: 400 });
  }
}
