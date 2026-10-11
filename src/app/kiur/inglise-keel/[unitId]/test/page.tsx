import { VocabularyTest } from '@/app/components/vocabulary/VocabularyTyped';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function VocabularyTestPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  return <VocabularyTest unitId={unitId} />;
}
