import { NextRequest, NextResponse } from 'next/server';
import { assertDeviceMayActAs } from '@/lib/server/deviceAccess';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
import { Learner } from '@/lib/tasks';
import { purchaseStreakFreeze } from '@/lib/streakFreeze';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseLearner(value: unknown): Learner | null {
  return value === 'kiur' || value === 'kirsi' ? value : null;
}

export async function POST(req: NextRequest) {
  try {
    const jsonBody = await readJsonObjectRequest(req);
    if (jsonBody instanceof NextResponse) return jsonBody;
    const body = jsonBody;
    const learner = parseLearner(body.learner);
    if (!learner) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
    const deviceDenied = await assertDeviceMayActAs(req, learner);
    if (deviceDenied) return deviceDenied;
    return NextResponse.json(purchaseStreakFreeze(learner));
  } catch (error) {
    return NextResponse.json({ message: publicErrorMessage(error, 'Ostu ei saanud teha.') }, { status: 409 });
  }
}
