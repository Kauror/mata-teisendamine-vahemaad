import { NextRequest, NextResponse } from 'next/server';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
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
  const jsonBody = await readJsonObjectRequest(req);
  if (jsonBody instanceof NextResponse) return jsonBody;
  const body = jsonBody;
  if (typeof body.clientActionId !== 'string' || (body.action !== 'approve' && body.action !== 'reject')) return NextResponse.json({ message: 'Vale tegevus.' }, { status: 400 });
  try { return NextResponse.json(resolveOfflineTaskReview(body.clientActionId, body.action)); }
  catch (error) { return NextResponse.json({ message: publicErrorMessage(error, 'Toiming ebaõnnestus.') }, { status: 409 }); }
}
