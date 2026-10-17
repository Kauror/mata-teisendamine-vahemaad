import TextbookCourse from '@/app/components/textbook/TextbookCourse';
import { CHILD_TEXTBOOK_COURSE_ID } from '@/app/components/textbook/pages';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Kiur's "Õpiku õppetükid": the published units of the textbook course.
export default function KiurTextbookPage() {
  return <TextbookCourse scope='child' courseId={CHILD_TEXTBOOK_COURSE_ID} />;
}
