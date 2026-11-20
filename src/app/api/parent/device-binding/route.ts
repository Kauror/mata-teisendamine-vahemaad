import { NextRequest, NextResponse } from 'next/server';
import {
  DEVICE_BINDING_COOKIE,
  deviceBindingCookieOptions,
  isDeviceBinding,
  signDeviceBinding
} from '@/lib/auth/deviceBinding';
import { hasParentSession } from '@/lib/parentAuth';
import { isDeviceBindingRequired, readDeviceBinding, setDeviceBindingRequired } from '@/lib/server/deviceAccess';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// "See seade": the parent, signed in on this device, says whose device it is.
// GET  → { binding: 'kiur' | 'kirsi' | 'both' | null, required }
// POST { binding: 'kiur' | 'kirsi' | 'both' | null } binds (null unbinds) this device;
// POST { required: boolean } switches "nõua sidumist" for every device.
export async function GET(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  return NextResponse.json(
    { binding: await readDeviceBinding(req), required: isDeviceBindingRequired() },
    { headers: { 'Cache-Control': 'no-store' } }
  );
}

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const jsonBody = await readJsonObjectRequest(req);
  if (jsonBody instanceof NextResponse) return jsonBody;

  const hasBinding = Object.prototype.hasOwnProperty.call(jsonBody, 'binding');
  const hasRequired = Object.prototype.hasOwnProperty.call(jsonBody, 'required');
  if (!hasBinding && !hasRequired) return NextResponse.json({ message: 'Vali, kelle seade see on.' }, { status: 400 });
  if (hasBinding && jsonBody.binding !== null && !isDeviceBinding(jsonBody.binding)) {
    return NextResponse.json({ message: 'Vali, kelle seade see on.' }, { status: 400 });
  }
  if (hasRequired && typeof jsonBody.required !== 'boolean') {
    return NextResponse.json({ message: 'Vale seade.' }, { status: 400 });
  }

  if (hasRequired) setDeviceBindingRequired(jsonBody.required as boolean);
  const binding = hasBinding
    ? (isDeviceBinding(jsonBody.binding) ? jsonBody.binding : null)
    : await readDeviceBinding(req);
  const response = NextResponse.json({ binding, required: isDeviceBindingRequired() });
  if (hasBinding) {
    if (binding) response.cookies.set(DEVICE_BINDING_COOKIE, await signDeviceBinding(binding), deviceBindingCookieOptions());
    else response.cookies.set(DEVICE_BINDING_COOKIE, '', deviceBindingCookieOptions(0));
  }
  return response;
}
