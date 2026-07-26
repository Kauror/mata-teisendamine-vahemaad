import ChildHomeDashboard from '@/app/components/ChildHomeDashboard';
import { childExerciseCards } from '@/lib/childExerciseCards';
import { getCompletedExerciseIdsToday } from '@/lib/exerciseCompletion';
import { getActiveLearningExercises, getLearningExerciseCatalog, selectTodaysLearningExercises } from '@/lib/learningExercises';
import { getOpenRenderableMistakeCount, REMEDIATION_MIN_OPEN_MISTAKES } from '@/lib/remediation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function KirsiPage() {
  // See KiurPage: the full catalogue keeps a hidden fixed exercise hidden.
  const catalogue = getLearningExerciseCatalog();
  const exercises = childExerciseCards('kirsi', selectTodaysLearningExercises(getActiveLearningExercises('kirsi'), 'kirsi'), catalogue);
  const completedExerciseIds = getCompletedExerciseIdsToday('kirsi', exercises);
  const openMistakeCount = getOpenRenderableMistakeCount('kirsi');
  const remediationHref = openMistakeCount >= REMEDIATION_MIN_OPEN_MISTAKES ? '/kirsi/kordamine' : undefined;

  return (
    <ChildHomeDashboard
      child={{ learner: 'kirsi', name: 'Kirsi', avatar: '👧' }}
      exercises={exercises}
      remediationHref={remediationHref}
      remediationCount={openMistakeCount}
      completedExerciseIds={completedExerciseIds}
    />
  );
}
