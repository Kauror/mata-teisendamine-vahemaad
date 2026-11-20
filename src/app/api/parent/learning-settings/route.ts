import { NextRequest, NextResponse } from 'next/server';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
import { hasParentSession } from '@/lib/parentAuth';
import { getLearningPointSettings, updateLearningPointSettings, type LearningPointSettings } from '@/lib/learningPoints';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET() {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  return NextResponse.json(getLearningPointSettings());
}

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const jsonBody = await readJsonObjectRequest(req);
    if (jsonBody instanceof NextResponse) return jsonBody;
    updateLearningPointSettings(jsonBody as unknown as LearningPointSettings);
    return NextResponse.json(getLearningPointSettings());
  } catch (error) {
    return NextResponse.json({ message: publicErrorMessage(error, 'Seadeid ei saanud salvestada.') }, { status: 400 });
  }
}
