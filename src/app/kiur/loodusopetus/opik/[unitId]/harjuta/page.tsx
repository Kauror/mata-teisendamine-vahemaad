import TextbookPractice from '@/app/components/textbook/TextbookPractice';
import { CHILD_TEXTBOOK_COURSE_ID } from '@/app/components/textbook/pages';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function KiurTextbookPracticePage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  return <TextbookPractice scope='child' courseId={CHILD_TEXTBOOK_COURSE_ID} unitId={unitId} />;
}
