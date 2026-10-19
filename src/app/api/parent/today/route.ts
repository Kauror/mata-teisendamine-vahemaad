import { NextResponse } from 'next/server';
import { childExerciseCards } from '@/lib/childExerciseCards';
import { getCompletedExerciseCountsToday } from '@/lib/exerciseCompletion';
import { getActiveLearningExercises, getLearningExerciseCatalog, selectTodaysLearningExercises } from '@/lib/learningExercises';
import { hasParentSession } from '@/lib/parentAuth';
import { parentTodayChild, type ParentToday } from '@/lib/parentToday';
import { getChildDashboard, todayDateString, type Learner } from '@/lib/tasks';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const LEARNERS: Learner[] = ['kiur', 'kirsi'];

// The parent's "Täna": each child's exercises and tasks for today, read the
// same way as the child's own page (/kiur, /kirsi) so the two always agree.
export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const date = todayDateString();
  const catalogue = getLearningExerciseCatalog();
  const children = {} as ParentToday['children'];
  for (const learner of LEARNERS) {
    const exercises = childExerciseCards(learner, selectTodaysLearningExercises(getActiveLearningExercises(learner), learner), catalogue);
    const counts = getCompletedExerciseCountsToday(learner, exercises);
    const dashboard = getChildDashboard(learner, date);
    children[learner] = parentTodayChild(learner, dashboard.balance, exercises, counts, dashboard.tasks);
  }
  return NextResponse.json({ date, children } satisfies ParentToday);
}
