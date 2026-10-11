import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { vocabErrorResponse } from '@/lib/server/vocabulary/http';
import { createUnit } from '@/lib/server/vocabulary/units';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Mutations under /api/parent are also guarded by the middleware (parent
// session + CSRF token); the route checks the session again.
export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const body = await req.json().catch(() => ({})) as { unitNumber?: unknown; title?: unknown };
  try {
    return NextResponse.json({ unit: createUnit({ unitNumber: body.unitNumber, title: body.title }) }, { status: 201 });
  } catch (error) {
    return vocabErrorResponse(error);
  }
}
