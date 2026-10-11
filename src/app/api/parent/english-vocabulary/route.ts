import { NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { VOCAB_LEARNER } from '@/lib/vocabulary/constants';
import { vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { getParentVocabularyOverview } from '@/lib/server/vocabulary/overview';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    return NextResponse.json(getParentVocabularyOverview(VOCAB_LEARNER));
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
