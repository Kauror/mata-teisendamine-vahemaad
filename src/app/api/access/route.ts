import { NextRequest, NextResponse } from 'next/server';
import { APP_ACCESS_COOKIE, APP_ACCESS_TOKEN, isValidAppAccessPin } from '@/lib/appAccess';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const pin = typeof body.pin === 'string' ? body.pin : '';

  if (!isValidAppAccessPin(pin)) {
    return NextResponse.json({ message: 'Vale PIN.' }, { status: 401 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(APP_ACCESS_COOKIE, APP_ACCESS_TOKEN, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 30
  });
  return response;
}
