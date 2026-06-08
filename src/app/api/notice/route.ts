import { NextResponse } from 'next/server';
import { getFamilyNotice } from '@/lib/noticeboard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ text: getFamilyNotice() });
}
