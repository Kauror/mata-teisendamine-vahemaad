import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { listOfflineTaskReviews, resolveOfflineTaskReview } from '@/lib/offline/server/taskReviews';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  return NextResponse.json({ reviews: listOfflineTaskReviews() });
}

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  if (typeof body.clientActionId !== 'string' || (body.action !== 'approve' && body.action !== 'reject')) return NextResponse.json({ message: 'Vale tegevus.' }, { status: 400 });
  try { return NextResponse.json(resolveOfflineTaskReview(body.clientActionId, body.action)); }
  catch (error) { return NextResponse.json({ message: error instanceof Error ? error.message : 'Toiming ebaõnnestus.' }, { status: 409 }); }
}
