import { NextRequest, NextResponse } from 'next/server';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { hasParentSession } from '@/lib/parentAuth';
import { vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { addWord } from '@/lib/server/vocabulary/units';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  const jsonBody = await readJsonObjectRequest(req);
  if (jsonBody instanceof NextResponse) return jsonBody;
  const body = jsonBody as Record<string, unknown>;
  try {
    return NextResponse.json({ word: addWord(id, body) }, { status: 201 });
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
