import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { editWord, setWordRetired } from '@/lib/server/vocabulary/units';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Editing keeps the word's id and statistics; `retired` hides or restores it.
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  const body = await req.json().catch(() => ({})) as Record<string, unknown>;
  try {
    if (typeof body.retired === 'boolean') {
      setWordRetired(id, body.retired);
      return NextResponse.json({ ok: true });
    }
    return NextResponse.json({ word: editWord(id, body) });
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
