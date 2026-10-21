import { NextResponse } from 'next/server';
import { pointsRules } from '@/lib/server/pointsRules';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// "Mille eest tähti saab", built from the live settings on every request.
export async function GET() {
  return NextResponse.json({ sections: pointsRules() });
}
