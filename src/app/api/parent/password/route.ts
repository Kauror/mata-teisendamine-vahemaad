import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession, setParentSession, updateParentPassword } from '@/lib/parentAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  try {
    const body = await req.json();
    updateParentPassword(String(body.currentPassword || ''), String(body.nextPassword || ''));
    await setParentSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ message: error instanceof Error ? error.message : 'Parooli ei saanud muuta.' }, { status: 400 });
  }
}
