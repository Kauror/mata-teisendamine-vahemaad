import { NextRequest, NextResponse } from 'next/server';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { hasParentSession } from '@/lib/parentAuth';
import { unitTestErrorResponse, validAttemptId } from '@/lib/server/unitTests/http';
import { cancelUnitTest, getParentReview, reviewUnitTest } from '@/lib/server/unitTests/store';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  if (!validAttemptId(id)) return NextResponse.json({ message: 'Kontrolltööd ei leitud.' }, { status: 404 });
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
  if (!validAttemptId(id)) return NextResponse.json({ message: 'Kontrolltööd ei leitud.' }, { status: 404 });
  const jsonBody = await readJsonObjectRequest(req);
  if (jsonBody instanceof NextResponse) return jsonBody;
  const body = jsonBody as { revision?: unknown; marks?: unknown; comment?: unknown; decision?: unknown };
  try {
    return NextResponse.json(reviewUnitTest(id, body));
  } catch (error) {
    return unitTestErrorResponse(error);
  }
}

// Cancels a test that is not approved yet; the unit opens again for the child.
export async function DELETE(_req: NextRequest, { params }: Params) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const { id } = await params;
  if (!validAttemptId(id)) return NextResponse.json({ message: 'Kontrolltööd ei leitud.' }, { status: 404 });
  try {
    cancelUnitTest(id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return unitTestErrorResponse(error);
  }
}
