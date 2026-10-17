import TextbookTest from '@/app/components/textbook/TextbookTest';
import { CHILD_TEXTBOOK_COURSE_ID } from '@/app/components/textbook/pages';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function KiurTextbookTestPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  return <TextbookTest scope='child' courseId={CHILD_TEXTBOOK_COURSE_ID} unitId={unitId} />;
}
