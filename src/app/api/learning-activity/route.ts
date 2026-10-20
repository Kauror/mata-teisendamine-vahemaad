import { NextResponse } from 'next/server';
import { queryLearningActivity } from '@/lib/server/learningActivity';
import { timelineResponse } from '@/lib/server/timelinePage';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// English and Loodusõpetus work that is not a passed test, star-free, newest
// first. `?limit=&cursor=` returns one page as { items, nextCursor }, like
// /api/task-history; `?learner=kiur|kirsi` narrows it to one child.
export async function GET(request: Request) {
  const search = new URL(request.url).searchParams;
  const rawLearner = search.get('learner');
  const learner = rawLearner === 'kiur' || rawLearner === 'kirsi' ? rawLearner : null;
  if (rawLearner && !learner) return NextResponse.json({ code: 'invalid_filter' }, { status: 400 });
  const page = timelineResponse(search, ({ limit, before }) => queryLearningActivity({ learner, limit, before }), (row) => row.createdAt);
  return NextResponse.json(page.body, { status: page.status });
}
