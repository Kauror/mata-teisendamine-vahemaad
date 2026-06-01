import { NextRequest, NextResponse } from 'next/server';
import { Learner } from '@/lib/tasks';
import { purchaseStoreItem } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseLearner(value: unknown): Learner | null {
  return value === 'kiur' || value === 'kirsi' ? value : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const learner = parseLearner(body.learner);
    const itemId = Number(body.itemId);
    if (!learner || !Number.isInteger(itemId)) return NextResponse.json({ message: 'Vale ost.' }, { status: 400 });
    return NextResponse.json(purchaseStoreItem(learner, itemId));
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Ostu ei saanud teha.' }, { status: 409 });
  }
}
