import ChildHomeDashboard from '@/app/components/ChildHomeDashboard';
import { ChildExerciseCard, childExerciseCards } from '@/lib/childExerciseCards';
import { getCompletedExerciseIdsToday } from '@/lib/exerciseCompletion';
import { getActiveLearningExercises, selectTodaysLearningExercises } from '@/lib/learningExercises';
import { getOpenRenderableMistakeCount, REMEDIATION_MIN_OPEN_MISTAKES } from '@/lib/remediation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Kiur's science subject is always available (not part of the rotating learning
// exercise pool), so it is added as a fixed card here. Kirsi never receives it.
const SCIENCE_CARD: ChildExerciseCard = {
  id: 'kiur.science.loodusopetus',
  childId: 'kiur',
  title: 'Loodusõpetus',
  description: 'Segaharjutus: pildid, lugemine, sobitamine, järjestamine ja andmed.',
  emoji: '🔬',
  accent: 'teal',
  route: '/kiur/loodusopetus',
  enabled: true,
  legacySubject: 'loodusopetus',
  legacyTopic: 'segaharjutus',
  legacyCategory: 'Loodusõpetus',
  completionKeys: []
};

export default function KiurPage() {
  const exercises = childExerciseCards('kiur', selectTodaysLearningExercises(getActiveLearningExercises('kiur'), 'kiur'));
  const completedExerciseIds = getCompletedExerciseIdsToday('kiur', exercises);
  const remediationHref = getOpenRenderableMistakeCount('kiur') >= REMEDIATION_MIN_OPEN_MISTAKES ? '/kiur/kordamine' : undefined;

  return (
    <ChildHomeDashboard
      child={{ learner: 'kiur', name: 'Kiur', avatar: '👦' }}
      exercises={[...exercises, SCIENCE_CARD]}
      remediationHref={remediationHref}
      completedExerciseIds={completedExerciseIds}
    />
  );
}
