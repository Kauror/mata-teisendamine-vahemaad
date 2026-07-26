import ChildHomeDashboard from '@/app/components/ChildHomeDashboard';
import { childExerciseCards } from '@/lib/childExerciseCards';
import { getCompletedExerciseIdsToday } from '@/lib/exerciseCompletion';
import { getActiveLearningExercises, getLearningExerciseCatalog, selectTodaysLearningExercises } from '@/lib/learningExercises';
import { getOpenRenderableMistakeCount, REMEDIATION_MIN_OPEN_MISTAKES } from '@/lib/remediation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function KiurPage() {
  // The full catalogue (not just the active pool) so a fixed exercise the
  // parent hid stays hidden — getActiveLearningExercises already drops it.
  const catalogue = getLearningExerciseCatalog();
  const exercises = childExerciseCards('kiur', selectTodaysLearningExercises(getActiveLearningExercises('kiur'), 'kiur'), catalogue);
  const completedExerciseIds = getCompletedExerciseIdsToday('kiur', exercises);
  const openMistakeCount = getOpenRenderableMistakeCount('kiur');
  const remediationHref = openMistakeCount >= REMEDIATION_MIN_OPEN_MISTAKES ? '/kiur/kordamine' : undefined;

  return (
    <ChildHomeDashboard
      child={{ learner: 'kiur', name: 'Kiur', avatar: '👦' }}
      exercises={exercises}
      remediationHref={remediationHref}
      remediationCount={openMistakeCount}
      completedExerciseIds={completedExerciseIds}
    />
  );
}
