import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { approveHeldRewardAttempt, listHeldRewardAttempts } from '@/lib/server/rewards/projection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent review surface for reward-held attempts (RTM2-H03): list attempts that
// were withheld or flagged needs_review, and approve one so it settles exactly
// once (approval also refreshes the daily leaderboard).
export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  return NextResponse.json({ held: listHeldRewardAttempts() });
}

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const body = await req.json();
    const attemptId = Number(body.attemptId);
    if (!Number.isInteger(attemptId)) return NextResponse.json({ message: 'Vale harjutus.' }, { status: 400 });
    if (body.action !== 'approve') return NextResponse.json({ message: 'Vale tegevus.' }, { status: 400 });
    const result = approveHeldRewardAttempt(attemptId);
    return NextResponse.json({ ok: true, applied: result });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Toimingut ei saanud teha.' }, { status: 409 });
  }
}
