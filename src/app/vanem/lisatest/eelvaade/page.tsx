import PreviewGate from '@/app/components/textbook/PreviewGate';
import { ParentUnitTestPreview } from '@/app/components/unitTests/ParentUnitTestReview';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The parent's check of an imported unit-test variant, answers included.
export default async function UnitTestPreviewPage({ searchParams }: { searchParams: Promise<{ unit?: string; variant?: string }> }) {
  const { unit, variant } = await searchParams;
  const unitNumber = Number(unit);
  if (!Number.isInteger(unitNumber) || unitNumber < 1 || (variant !== 'A' && variant !== 'B')) {
    return <PreviewGate><main className='parent-page'><p>Vale test.</p></main></PreviewGate>;
  }
  return <PreviewGate><ParentUnitTestPreview unit={unitNumber} variant={variant} /></PreviewGate>;
}
