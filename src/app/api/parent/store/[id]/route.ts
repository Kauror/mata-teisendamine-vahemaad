import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { deleteStoreItem, hideStoreItemToday, showStoreItemToday, StoreStockType, StoreVisibility, updateStoreItem } from '@/lib/store';

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

async function storeId(params: Promise<{ id: string }>) {
  const { id } = await params;
  const itemId = Number(id);
  return Number.isInteger(itemId) ? itemId : null;
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const id = await storeId(params);
  if (!id) return NextResponse.json({ message: 'Vale ese.' }, { status: 400 });
  try {
    updateStoreItem(id, parseBody(await req.json()));
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Poe eset ei saanud muuta.' }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const id = await storeId(params);
  if (!id) return NextResponse.json({ message: 'Vale ese.' }, { status: 400 });
  const body = await req.json();
  if (body.action === 'hide_today') hideStoreItemToday(id);
  if (body.action === 'show_today') showStoreItemToday(id);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const id = await storeId(params);
  if (!id) return NextResponse.json({ message: 'Vale ese.' }, { status: 400 });
  deleteStoreItem(id);
  return NextResponse.json({ ok: true });
}
