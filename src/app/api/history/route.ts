import { NextResponse } from 'next/server';
import { decodeHistoryCursor, encodeHistoryCursor, historyPageLimit } from '@/lib/server/historyCursor';
import { queryHistoryRows } from '@/lib/server/historyRows';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const limit = historyPageLimit(search.get('limit'));
  const cursor = decodeHistoryCursor(search.get('cursor'));
  if (limit === null || cursor === undefined) {
    return NextResponse.json({ code: 'invalid_pagination' }, { status: 400 });
  }

  const rawLearner = search.get('learner');
  const learner = rawLearner === 'kiur' || rawLearner === 'kirsi' ? rawLearner : null;
  const subject = search.get('subject');
  const topic = search.get('topic');
  if ((rawLearner && !learner) || [subject, topic].some((value) => value && value.length > 64)) {
    return NextResponse.json({ code: 'invalid_filter' }, { status: 400 });
  }

  const rows = await queryHistoryRows({ learner, subject, topic, cursor, limit: limit + 1 });
  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit);
  const last = items.at(-1);
  return NextResponse.json({
    items,
    nextCursor: hasMore && last ? encodeHistoryCursor({ createdAt: last.createdAt, id: last.id }) : null
  });
}

export async function POST() {
  return NextResponse.json(
    { code: 'legacy_write_retired', message: 'Kasuta kontrollitud võrguühenduseta protokolli v2.' },
    { status: 410 }
  );
}
