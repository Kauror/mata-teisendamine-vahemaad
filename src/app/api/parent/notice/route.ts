import { NextRequest, NextResponse } from 'next/server';
import { publicErrorMessage } from '@/lib/server/http/requestValidation';
import { hasParentSession } from '@/lib/parentAuth';
import { setFamilyNotice } from '@/lib/noticeboard';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const body = await req.json();
    const text = setFamilyNotice(String(body.text ?? ''));
    return NextResponse.json({ text });
  } catch (error) {
    return NextResponse.json({ message: publicErrorMessage(error, 'Teksti ei saanud salvestada.') }, { status: 400 });
  }
}
