import { NextResponse } from 'next/server';
import { getStorePurchaseHistory } from '@/lib/store';
import { timelineResponse } from '@/lib/server/timelinePage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// `?limit=&cursor=` returns one newest-first page as { items, nextCursor }.
export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const page = timelineResponse(search, (options) => getStorePurchaseHistory(options), (row) => row.purchasedAt);
  return NextResponse.json(page.body, { status: page.status });
}
