import { NextRequest, NextResponse } from 'next/server';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
import db from '@/lib/db';
import { hasParentSession } from '@/lib/parentAuth';
import { approveHeldRewardAttempt, listHeldRewardAttempts } from '@/lib/server/rewards/projection';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Parent review surface for reward-held attempts (RTM2-H03): list attempts that
// were withheld or flagged needs_review, and approve one so it settles exactly
// once (approval also refreshes the daily leaderboard).
export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  // The exercise's own title, so the parent reads "Korrutamine", not an id.
  const titles = new Map((db.prepare('SELECT id, title FROM learning_exercises').all() as Array<{ id: string; title: string }>).map((row) => [row.id, row.title]));
  return NextResponse.json({ held: listHeldRewardAttempts().map((item) => ({ ...item, exerciseTitle: item.exerciseId ? titles.get(item.exerciseId) ?? null : null })) });
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
    return NextResponse.json({ message: publicErrorMessage(error, 'Toimingut ei saanud teha.') }, { status: 409 });
  }
}
