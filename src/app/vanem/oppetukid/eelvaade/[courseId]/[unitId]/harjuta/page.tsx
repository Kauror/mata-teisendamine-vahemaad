import PreviewGate from '@/app/components/textbook/PreviewGate';
import TextbookPractice from '@/app/components/textbook/TextbookPractice';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function TextbookPreviewPracticePage({ params }: { params: Promise<{ courseId: string; unitId: string }> }) {
  const { courseId, unitId } = await params;
  return <PreviewGate><TextbookPractice scope='preview' courseId={courseId} unitId={unitId} /></PreviewGate>;
}
