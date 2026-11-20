import { NextRequest, NextResponse } from 'next/server';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
import { Learner } from '@/lib/tasks';
import { purchaseStoreItem } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseLearner(value: unknown): Learner | null {
  return value === 'kiur' || value === 'kirsi' ? value : null;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const learner = parseLearner(body.learner);
    const itemId = Number(body.itemId);
    // Optional for clients from before the retry key; when present it must be a
    // UUID so it cannot collide by accident.
    const clientPurchaseId = body.clientPurchaseId == null ? null : String(body.clientPurchaseId);
    if (!learner || !Number.isInteger(itemId)) return NextResponse.json({ message: 'Vale ost.' }, { status: 400 });
    if (clientPurchaseId !== null && !UUID.test(clientPurchaseId)) return NextResponse.json({ message: 'Vale ost.' }, { status: 400 });
    return NextResponse.json(purchaseStoreItem(learner, itemId, undefined, clientPurchaseId));
  } catch (error) {
    return NextResponse.json({ message: publicErrorMessage(error, 'Ostu ei saanud teha.') }, { status: 409 });
  }
}
