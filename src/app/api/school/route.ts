import { NextRequest, NextResponse } from 'next/server';
import { childSchoolTasks } from '@/lib/schoolFeed';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// A child's own coming tests and homework (from Minu's school feed).
export async function GET(req: NextRequest) {
  const learner = req.nextUrl.searchParams.get('learner');
  if (learner !== 'kiur' && learner !== 'kirsi') return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
  return NextResponse.json(childSchoolTasks(learner));
}
