import VocabularyStudy from '@/app/components/vocabulary/VocabularyStudy';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function VocabularyStudyPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  return <VocabularyStudy unitId={unitId} />;
}
