import { NextRequest, NextResponse } from 'next/server';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
import { hasParentSession } from '@/lib/parentAuth';
import { createStoreItem, getParentStoreDashboard, StoreStockType, StoreVisibility } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseBody(body: Record<string, unknown>) {
  return {
    title: String(body.title || ''),
    description: String(body.description || ''),
    price: Number(body.price || 15),
    visibility: body.visibility as StoreVisibility,
    stockType: body.stockType as StoreStockType,
    fixedStockRemaining: body.fixedStockRemaining === '' || body.fixedStockRemaining === null ? null : Number(body.fixedStockRemaining),
    dailyStockLimit: body.dailyStockLimit === '' || body.dailyStockLimit === null ? null : Number(body.dailyStockLimit),
    availableFrom: body.availableFrom ? String(body.availableFrom) : null,
    availableUntil: body.availableUntil ? String(body.availableUntil) : null,
    availableWeekdays: Array.isArray(body.availableWeekdays) ? body.availableWeekdays.map(Number) : [],
    isActive: body.isActive !== false
  };
}

export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  return NextResponse.json(getParentStoreDashboard());
}

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const jsonBody = await readJsonObjectRequest(req);
    if (jsonBody instanceof NextResponse) return jsonBody;
    const id = createStoreItem(parseBody(jsonBody));
    return NextResponse.json({ id }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: publicErrorMessage(error, 'Poe eset ei saanud salvestada.') }, { status: 400 });
  }
}
