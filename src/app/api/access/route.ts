import { NextRequest, NextResponse } from 'next/server';
import {
  APP_ACCESS_COOKIE,
  APP_CSRF_COOKIE,
  createAppAccessSession,
  FAMILY_SESSION_MAX_AGE_SECONDS,
  isValidAppAccessPin
} from '@/lib/appAccess';
import { assertLoginAllowed, clearLoginFailures, loginIdentity, recordLoginFailure } from '@/lib/auth/rateLimit';
import { hasExactOrigin } from '@/lib/auth/session';
import { PublicRequestError, readJsonBody } from '@/lib/server/http/requestValidation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!hasExactOrigin(req.headers.get('origin'))) {
    return NextResponse.json({ code: 'invalid_origin', message: 'Päringu päritolu ei sobi.' }, { status: 403 });
  }
  const identity = loginIdentity(req.headers);
  try {
    assertLoginAllowed('family_login', identity);
  } catch (error) {
    const retryAfter = Number((error as { retryAfterSeconds?: number }).retryAfterSeconds ?? 60);
    return NextResponse.json({ code: 'rate_limited', message: 'Liiga palju katseid.' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
  }
  let body: unknown;
  try {
    body = await readJsonBody(req);
  } catch (error) {
    if (error instanceof PublicRequestError) {
      return NextResponse.json({ code: error.code, message: error.message }, { status: error.status });
    }
    throw error;
  }
  const record = typeof body === 'object' && body !== null ? body as Record<string, unknown> : {};
  const pin = typeof record.pin === 'string' ? record.pin : '';

  if (!isValidAppAccessPin(pin)) {
    recordLoginFailure('family_login', identity);
    return NextResponse.json({ message: 'Vale PIN.' }, { status: 401 });
  }

  clearLoginFailures('family_login', identity);
  const session = await createAppAccessSession();
  const response = NextResponse.json({ ok: true });
  const cookieOptions = {
    sameSite: 'strict' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: FAMILY_SESSION_MAX_AGE_SECONDS
  };
  response.cookies.set(APP_ACCESS_COOKIE, session.token, {
    ...cookieOptions,
    httpOnly: true,
  });
  response.cookies.set(APP_CSRF_COOKIE, session.payload.csrf, { ...cookieOptions, httpOnly: false });
  return response;
}
