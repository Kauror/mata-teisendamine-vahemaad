import KiurMathPageClient from '@/app/kiur/matemaatika/KiurMathPageClient';
import { getActiveLearningExercises } from '@/lib/learningExercises';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function MatemaatikaPage() {
  const activeTopicIds = getActiveLearningExercises('kiur')
    .filter((exercise) => exercise.subject === 'matemaatika')
    .map((exercise) => exercise.topic);

  return <KiurMathPageClient activeTopicIds={activeTopicIds} />;
}
