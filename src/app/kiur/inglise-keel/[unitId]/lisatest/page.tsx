import UnitTestRunner from '@/app/components/unitTests/UnitTestRunner';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The unit's additional workbook test. Without ?katse= it starts (or resumes)
// the test; with it, it shows that attempt (waiting, sent back or graded).
export default async function UnitTestPage({ params, searchParams }: {
  params: Promise<{ unitId: string }>;
  searchParams: Promise<{ katse?: string | string[] }>;
}) {
  const { unitId } = await params;
  const { katse } = await searchParams;
  const attemptId = typeof katse === 'string' && /^ut_[0-9a-f-]{36}$/u.test(katse) ? katse : null;
  return <UnitTestRunner unitId={unitId} attemptId={attemptId} />;
}
