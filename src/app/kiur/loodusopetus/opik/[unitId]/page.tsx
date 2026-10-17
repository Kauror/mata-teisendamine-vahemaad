import TextbookUnit from '@/app/components/textbook/TextbookUnit';
import { CHILD_TEXTBOOK_COURSE_ID } from '@/app/components/textbook/pages';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function KiurTextbookUnitPage({ params }: { params: Promise<{ unitId: string }> }) {
  const { unitId } = await params;
  return <TextbookUnit scope='child' courseId={CHILD_TEXTBOOK_COURSE_ID} unitId={unitId} />;
}
