import KiurEnglishPageClient from '@/app/kiur/inglise-keel/KiurEnglishPageClient';
import { hasActiveLearningExercise } from '@/lib/learningExercises';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default function KiurEnglishPage() {
  return <KiurEnglishPageClient sprintActive={hasActiveLearningExercise('kiur', 'kiur.english.sprint')} />;
}
