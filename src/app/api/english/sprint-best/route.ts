import { NextResponse } from 'next/server';
import { bestEnglishSprintScore } from '@/lib/server/englishSprintBest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The sprint page's "Rekord": one aggregate instead of paging the whole sprint
// history to the client to take its maximum (PAR-11).
export async function GET() {
  return NextResponse.json({ best: bestEnglishSprintScore() });
}
