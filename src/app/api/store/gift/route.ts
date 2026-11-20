import { NextRequest, NextResponse } from 'next/server';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
import { Learner } from '@/lib/tasks';
import { giftPoints } from '@/lib/store';

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
    const from = parseLearner(body.from);
    const to = parseLearner(body.to);
    const amount = Number(body.amount);
    if (!from || !to) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
    return NextResponse.json(giftPoints(from, to, amount));
  } catch (error) {
    return NextResponse.json({ message: publicErrorMessage(error, 'Kinkimine ebaõnnestus.') }, { status: 409 });
  }
}
