import { VocabularyPractice } from '@/app/components/vocabulary/VocabularyTyped';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// "Korda eksitud sõnu": every weak word, or one unit's with ?unit=<id>.
export default async function VocabularyPracticePage({ searchParams }: { searchParams: Promise<{ unit?: string | string[] }> }) {
  const { unit } = await searchParams;
  const unitId = typeof unit === 'string' && unit ? unit : null;
  return <VocabularyPractice unitId={unitId} />;
}
