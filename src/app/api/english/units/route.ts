import { NextResponse } from 'next/server';
import { hasActiveLearningExercise } from '@/lib/learningExercises';
import { VOCAB_LEARNER } from '@/lib/vocabulary/constants';
import { vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { getChildVocabularyHome } from '@/lib/server/vocabulary/overview';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The child's unit list. Unpublished units are never included.
export async function GET() {
  try {
    return NextResponse.json({
      ...getChildVocabularyHome(VOCAB_LEARNER),
      sprintActive: hasActiveLearningExercise(VOCAB_LEARNER, 'kiur.english.sprint')
    });
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
