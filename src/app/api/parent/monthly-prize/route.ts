import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { ensureMonthlyPrizeAwarded, getMonthlyPrizeStars, getMonthlyStanding, setMonthlyPrizeStars } from '@/lib/monthlyCompetition';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

function payload() {
  ensureMonthlyPrizeAwarded();
  return { prizeStars: getMonthlyPrizeStars(), standing: getMonthlyStanding() };
}

export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  return NextResponse.json(payload());
}

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const body = await req.json();
    setMonthlyPrizeStars(Number(body.prizeStars));
    return NextResponse.json(payload());
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Auhinda ei saanud salvestada.' }, { status: 400 });
  }
}
