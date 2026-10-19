import { parseHaldaTab } from '@/app/components/parent/views';
import ParentAreaPage from '@/app/vanem/ParentAreaPage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export default async function ParentManagePage({ searchParams }: { searchParams: Promise<{ tab?: string | string[] }> }) {
  const { tab } = await searchParams;
  return <ParentAreaPage view='halda' tab={parseHaldaTab(tab)} />;
}
