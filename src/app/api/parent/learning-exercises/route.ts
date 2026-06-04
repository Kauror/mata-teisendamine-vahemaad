import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import {
  getLearningExerciseCatalog,
  isLearner,
  isLearningExerciseStatus,
  updateChildLearningExerciseStatus
} from '@/lib/learningExercises';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  return NextResponse.json({ exercises: getLearningExerciseCatalog() });
}

export async function PATCH(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const exerciseId = typeof body.exerciseId === 'string' ? body.exerciseId : '';
  const learner = body.learner;
  const status = body.status;

  if (!exerciseId || !isLearner(learner) || !isLearningExerciseStatus(status)) {
    return NextResponse.json({ message: 'Vigane harjutuse muudatus.' }, { status: 400 });
  }

  try {
    updateChildLearningExerciseStatus(exerciseId, learner, status);
    return NextResponse.json({ exercises: getLearningExerciseCatalog() });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Harjutust ei saanud muuta.' }, { status: 400 });
  }
}
