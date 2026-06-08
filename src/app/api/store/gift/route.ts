import { NextRequest, NextResponse } from 'next/server';
import { Learner } from '@/lib/tasks';
import { giftPoints } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseLearner(value: unknown): Learner | null {
  return value === 'kiur' || value === 'kirsi' ? value : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const from = parseLearner(body.from);
    const to = parseLearner(body.to);
    const amount = Number(body.amount);
    if (!from || !to) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
    return NextResponse.json(giftPoints(from, to, amount));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Kinkimine ebaõnnestus.' }, { status: 409 });
  }
}
