import { NextRequest, NextResponse } from 'next/server';
import { getActiveLearningExercises, isLearner } from '@/lib/learningExercises';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const learner = req.nextUrl.searchParams.get('learner');
  if (!isLearner(learner)) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
  const exercises = getActiveLearningExercises(learner);
  return NextResponse.json({ exerciseIds: exercises.map((exercise) => exercise.id), exercises });
}
