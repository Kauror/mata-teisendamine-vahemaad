import PreviewGate from '@/app/components/textbook/PreviewGate';
import TextbookCourse from '@/app/components/textbook/TextbookCourse';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent preview of a textbook course (the demo included): the child's screens
// against the isolated preview learner.
export default async function TextbookPreviewCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  return <PreviewGate><TextbookCourse scope='preview' courseId={courseId} /></PreviewGate>;
}
