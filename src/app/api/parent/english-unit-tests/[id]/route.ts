import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { unitTestErrorResponse, validAttemptId } from '@/lib/server/unitTests/http';
import { getParentReview, reviewUnitTest } from '@/lib/server/unitTests/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  if (!validAttemptId(id)) return NextResponse.json({ message: 'Lisatesti ei leitud.' }, { status: 404 });
  try {
    return NextResponse.json(getParentReview(id));
  } catch (error) {
    return unitTestErrorResponse(error);
  }
}

// The parent's marks and decision: 'save', 'approve' or 'return'.
export async function POST(req: NextRequest, { params }: Params) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  if (!validAttemptId(id)) return NextResponse.json({ message: 'Lisatesti ei leitud.' }, { status: 404 });
  const body = await req.json().catch(() => ({})) as { revision?: unknown; marks?: unknown; comment?: unknown; decision?: unknown };
  try {
    return NextResponse.json(reviewUnitTest(id, body));
  } catch (error) {
    return unitTestErrorResponse(error);
  }
}
