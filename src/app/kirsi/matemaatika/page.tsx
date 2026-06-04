import KirsiMathPageClient from '@/app/kirsi/matemaatika/KirsiMathPageClient';
import { getActiveLearningExercises } from '@/lib/learningExercises';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function KirsiMathPage() {
  const activeModes = getActiveLearningExercises('kirsi')
    .filter((exercise) => exercise.subject === 'matemaatika')
    .map((exercise) => exercise.category);

  return <KirsiMathPageClient activeModes={activeModes} />;
}
