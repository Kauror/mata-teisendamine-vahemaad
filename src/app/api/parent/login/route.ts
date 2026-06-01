import { NextRequest, NextResponse } from 'next/server';
import { isParentPasswordConfigured, setParentSession, verifyParentPassword } from '@/lib/parentAuth';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isParentPasswordConfigured()) {
    return NextResponse.json({ message: 'PARENT_PASSWORD puudub.' }, { status: 500 });
  }

  const body = await req.json();
  if (!verifyParentPassword(String(body.password || ''))) {
    return NextResponse.json({ message: 'Vale parool.' }, { status: 401 });
  }

  await setParentSession();
  return NextResponse.json({ ok: true });
}
