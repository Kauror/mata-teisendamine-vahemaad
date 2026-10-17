import PreviewGate from '@/app/components/textbook/PreviewGate';
import TextbookTest from '@/app/components/textbook/TextbookTest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function TextbookPreviewTestPage({ params }: { params: Promise<{ courseId: string; unitId: string }> }) {
  const { courseId, unitId } = await params;
  return <PreviewGate><TextbookTest scope='preview' courseId={courseId} unitId={unitId} /></PreviewGate>;
}
