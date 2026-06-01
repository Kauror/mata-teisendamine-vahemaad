import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession } from '@/lib/parentAuth';
import { getLearningPointSettings, updateLearningPointSettings } from '@/lib/learningPoints';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  return NextResponse.json(getLearningPointSettings());
}

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    updateLearningPointSettings(await req.json());
    return NextResponse.json(getLearningPointSettings());
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Seadeid ei saanud salvestada.' }, { status: 400 });
  }
}
