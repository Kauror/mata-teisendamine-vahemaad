import TextbookLesson from '@/app/components/textbook/TextbookLesson';
import { CHILD_TEXTBOOK_COURSE_ID } from '@/app/components/textbook/pages';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function KiurTextbookLessonPage({ params }: { params: Promise<{ unitId: string; lessonId: string }> }) {
  const { unitId, lessonId } = await params;
  return <TextbookLesson scope='child' courseId={CHILD_TEXTBOOK_COURSE_ID} unitId={unitId} lessonId={lessonId} />;
}
