import { NextRequest, NextResponse } from 'next/server';
import { Learner } from '@/lib/tasks';
import { getChildStore } from '@/lib/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function parseLearner(value: string | null): Learner | null {
  return value === 'kiur' || value === 'kirsi' ? value : null;
}

export async function GET(req: NextRequest) {
  const learner = parseLearner(req.nextUrl.searchParams.get('learner'));
  if (!learner) return NextResponse.json({ message: 'Vale laps.' }, { status: 400 });
  return NextResponse.json(getChildStore(learner));
}
