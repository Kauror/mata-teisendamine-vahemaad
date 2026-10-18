import { NextRequest, NextResponse } from 'next/server';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
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
    return NextResponse.json({ message: publicErrorMessage(error, 'Ostu ei saanud teha.') }, { status: 409 });
  }
}
