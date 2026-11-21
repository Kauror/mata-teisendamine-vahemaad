import { NextRequest, NextResponse } from 'next/server';
import { DEVICE_BINDING_COOKIE, deviceBindingCookieOptions, isDeviceBinding, signDeviceBinding } from '@/lib/auth/deviceBinding';
import { assertLoginAllowed, clearLoginFailures, loginIdentity, recordLoginFailure, waitForLoginSlowdown } from '@/lib/auth/rateLimit';
import { isParentPasswordConfigured, verifyParentPassword } from '@/lib/parentAuth';
import { readDeviceToken } from '@/lib/server/deviceAccess';
import { deviceLabel, registerDevice } from '@/lib/server/deviceRegistry';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// "Vaheta seadet" on the stop page (src/app/vale-seade): a device shared by
// both children is handed over with the parent password, without signing the
// parent in. Failures count against the same limit as the parent login, so
// this is no second door for guessing the password.
// POST { password, binding: 'kiur' | 'kirsi' | 'both', app?: boolean } -> { binding }
export async function POST(req: NextRequest) {
  if (!isParentPasswordConfigured()) {
    return NextResponse.json({ message: 'Lapsevanema parooli räsi puudub.' }, { status: 503 });
  }
  const identity = loginIdentity(req.headers);
  let slowdownMs = 0;
  try {
    ({ slowdownMs } = assertLoginAllowed('parent_login', identity));
  } catch (error) {
    const retryAfter = Number((error as { retryAfterSeconds?: number }).retryAfterSeconds ?? 60);
    return NextResponse.json({ code: 'rate_limited', message: 'Liiga palju katseid. Proovi hiljem uuesti.' }, { status: 429, headers: { 'Retry-After': String(retryAfter) } });
  }
  await waitForLoginSlowdown(slowdownMs);

  const body = await readJsonObjectRequest(req);
  if (body instanceof NextResponse) return body;
  if (!isDeviceBinding(body.binding)) return NextResponse.json({ message: 'Vali, kelle seade see on.' }, { status: 400 });
  if (!verifyParentPassword(String(body.password ?? ''))) {
    recordLoginFailure('parent_login', identity);
    return NextResponse.json({ message: 'Vale parool.' }, { status: 401 });
  }
  clearLoginFailures('parent_login', identity);

  const token = await readDeviceToken(req);
  const app = body.app === true ? 'app' : body.app === false ? 'browser' : 'unknown';
  const deviceId = registerDevice({ id: token?.deviceId ?? null, binding: body.binding, device: deviceLabel(req.headers.get('user-agent')), app });
  const response = NextResponse.json({ binding: body.binding });
  response.cookies.set(DEVICE_BINDING_COOKIE, await signDeviceBinding(body.binding, Date.now(), deviceId), deviceBindingCookieOptions());
  return response;
}
