import PreviewGate from '@/app/components/textbook/PreviewGate';
import TextbookLesson from '@/app/components/textbook/TextbookLesson';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function TextbookPreviewLessonPage({ params }: { params: Promise<{ courseId: string; unitId: string; lessonId: string }> }) {
  const { courseId, unitId, lessonId } = await params;
  return <PreviewGate><TextbookLesson scope='preview' courseId={courseId} unitId={unitId} lessonId={lessonId} /></PreviewGate>;
}
