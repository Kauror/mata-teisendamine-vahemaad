import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { VOCAB_LEARNER } from '@/lib/vocabulary/constants';
import { vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { getParentUnitWords } from '@/lib/server/vocabulary/overview';
import { deleteUnit, getUnit, setManualUnlock, updateUnit, VocabNotFoundError } from '@/lib/server/vocabulary/units';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  try {
    if (!getUnit(id)) throw new VocabNotFoundError('Õppetükki ei leitud.');
    return NextResponse.json(getParentUnitWords(VOCAB_LEARNER, id));
  } catch (error) {
    return vocabErrorResponse(error);
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => ({})) as { unitNumber?: unknown; title?: unknown; published?: unknown; manualUnlock?: unknown };
  try {
    if (body.manualUnlock !== undefined) {
      if (typeof body.manualUnlock !== 'boolean') return NextResponse.json({ message: 'Avamise väärtus on vigane.' }, { status: 400 });
      setManualUnlock(VOCAB_LEARNER, id, body.manualUnlock);
    }
    if (body.unitNumber !== undefined || body.title !== undefined || body.published !== undefined) {
      updateUnit(id, { unitNumber: body.unitNumber, title: body.title, published: body.published });
    }
    return NextResponse.json({ unit: getUnit(id) });
  } catch (error) {
    return vocabErrorResponse(error);
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  try {
    deleteUnit(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
