import PreviewGate from '@/app/components/textbook/PreviewGate';
import { ParentUnitTestReview } from '@/app/components/unitTests/ParentUnitTestReview';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The parent's review of one handed-in English unit test.
export default async function UnitTestReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PreviewGate><ParentUnitTestReview attemptId={id} /></PreviewGate>;
}
