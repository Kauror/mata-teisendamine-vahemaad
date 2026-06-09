import { NextResponse } from 'next/server';
import { getLeaderboardHistory } from '@/lib/leaderboard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json(getLeaderboardHistory());
}
