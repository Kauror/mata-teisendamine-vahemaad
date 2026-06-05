import ChildHomeDashboard from '@/app/components/ChildHomeDashboard';
import { childExerciseCards } from '@/lib/childExerciseCards';
import { getCompletedExerciseIdsToday } from '@/lib/exerciseCompletion';
import { getActiveLearningExercises } from '@/lib/learningExercises';
import { getOpenRenderableMistakeCount, REMEDIATION_MIN_OPEN_MISTAKES } from '@/lib/remediation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function KirsiPage() {
  const exercises = childExerciseCards('kirsi', getActiveLearningExercises('kirsi'));
  const completedExerciseIds = getCompletedExerciseIdsToday('kirsi', exercises);
  const remediationHref = getOpenRenderableMistakeCount('kirsi') >= REMEDIATION_MIN_OPEN_MISTAKES ? '/kirsi/kordamine' : undefined;

  return (
    <ChildHomeDashboard
      child={{ learner: 'kirsi', name: 'Kirsi', avatar: '👧' }}
      exercises={exercises}
      remediationHref={remediationHref}
      completedExerciseIds={completedExerciseIds}
    />
  );
}
