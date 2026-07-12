import { NextRequest, NextResponse } from 'next/server';
import { isParentPasswordConfigured, setParentSession, verifyParentPassword } from '@/lib/parentAuth';
import { assertLoginAllowed, clearLoginFailures, loginIdentity, recordLoginFailure } from '@/lib/auth/rateLimit';
import { PublicRequestError, readJsonBody } from '@/lib/server/http/requestValidation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  if (!isParentPasswordConfigured()) {
    return NextResponse.json({ message: 'Lapsevanema parooli räsi puudub.' }, { status: 503 });
  }

  const identity = loginIdentity(req.headers);
  try {
    assertLoginAllowed('parent_login', identity);
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
  const password = typeof body === 'object' && body !== null ? String((body as Record<string, unknown>).password ?? '') : '';
  if (!verifyParentPassword(password)) {
    recordLoginFailure('parent_login', identity);
    return NextResponse.json({ message: 'Vale parool.' }, { status: 401 });
  }

  clearLoginFailures('parent_login', identity);
  await setParentSession();
  return NextResponse.json({ ok: true });
}
