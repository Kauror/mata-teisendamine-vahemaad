import { NextRequest, NextResponse } from 'next/server';
import { hasParentSession, setParentSession, updateParentPassword, verifyParentPassword } from '@/lib/parentAuth';
import { assertLoginAllowed, clearLoginFailures, loginIdentity, recordLoginFailure } from '@/lib/auth/rateLimit';
import { PublicRequestError, readJsonBody } from '@/lib/server/http/requestValidation';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// The current-password check is a password oracle for whoever holds an open
// parent session (a parent signed in on the child's phone), so it shares the
// parent sign-in throttle: wrong guesses count as sign-in failures, and while
// the source is blocked even the right password is refused.
export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const identity = loginIdentity(req.headers);
  try {
    assertLoginAllowed('parent_login', identity);
  } catch (error) {
    const retryAfter = Number((error as { retryAfterSeconds?: number }).retryAfterSeconds ?? 60);
    return NextResponse.json({ code: 'rate_limited', message: 'Liiga palju katseid.' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
  }

  let body: Record<string, unknown>;
  try {
    const parsed = await readJsonBody(req);
    body = typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch (error) {
    if (error instanceof PublicRequestError) return NextResponse.json({ code: error.code, message: 'Päring on vigane.' }, { status: error.status });
    throw error;
  }
  const currentPassword = typeof body.currentPassword === 'string' ? body.currentPassword : '';
  const nextPassword = typeof body.nextPassword === 'string' ? body.nextPassword : '';

  if (!verifyParentPassword(currentPassword)) {
    recordLoginFailure('parent_login', identity);
    return NextResponse.json({ message: 'Praegune parool on vale.' }, { status: 400 });
  }
  clearLoginFailures('parent_login', identity);
  try {
    updateParentPassword(currentPassword, nextPassword);
  } catch (error) {
    // updateParentPassword's own messages are the Estonian rule texts.
    return NextResponse.json({ message: error instanceof Error && error.constructor === Error ? error.message : 'Parooli ei saanud muuta.' }, { status: 400 });
  }
  await setParentSession();
  return NextResponse.json({ ok: true });
}
