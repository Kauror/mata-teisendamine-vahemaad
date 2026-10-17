import PreviewGate from '@/app/components/textbook/PreviewGate';
import TextbookUnit from '@/app/components/textbook/TextbookUnit';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function TextbookPreviewUnitPage({ params }: { params: Promise<{ courseId: string; unitId: string }> }) {
  const { courseId, unitId } = await params;
  return <PreviewGate><TextbookUnit scope='preview' courseId={courseId} unitId={unitId} /></PreviewGate>;
}
