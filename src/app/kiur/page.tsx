import ChildHomeDashboard from '@/app/components/ChildHomeDashboard';
import { childExerciseCards } from '@/lib/childExerciseCards';
import { getCompletedExerciseIdsToday } from '@/lib/exerciseCompletion';
import { getActiveLearningExercises, selectTodaysLearningExercises } from '@/lib/learningExercises';
import { getOpenRenderableMistakeCount, REMEDIATION_MIN_OPEN_MISTAKES } from '@/lib/remediation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function KiurPage() {
  const exercises = childExerciseCards('kiur', selectTodaysLearningExercises(getActiveLearningExercises('kiur'), 'kiur'));
  const completedExerciseIds = getCompletedExerciseIdsToday('kiur', exercises);
  const remediationHref = getOpenRenderableMistakeCount('kiur') >= REMEDIATION_MIN_OPEN_MISTAKES ? '/kiur/kordamine' : undefined;

  return (
    <ChildHomeDashboard
      child={{ learner: 'kiur', name: 'Kiur', avatar: '👦' }}
      exercises={exercises}
      remediationHref={remediationHref}
      completedExerciseIds={completedExerciseIds}
    />
  );
}
