import { NextRequest, NextResponse } from 'next/server';
import {
  DEVICE_BINDING_COOKIE,
  deviceBindingCookieOptions,
  isDeviceBinding,
  signDeviceBinding
} from '@/lib/auth/deviceBinding';
import { hasParentSession } from '@/lib/parentAuth';
import { isDeviceBindingRequired, readDeviceBinding, readDeviceToken, setDeviceBindingRequired } from '@/lib/server/deviceAccess';
import { deviceLabel, listDevices, registerDevice, removeDevice, type DeviceApp } from '@/lib/server/deviceRegistry';
import { readJsonObjectRequest } from '@/lib/server/http/jsonRequest';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// "See seade": the parent, signed in on this device, says whose device it is.
// GET  → { binding, required, devices, thisDevice }
// POST { binding: 'kiur' | 'kirsi' | 'both' | null, app?: boolean } binds (null unbinds) this device;
//      app = the page runs as the installed home-screen app (on iPhone it keeps its own cookies).
// POST { required: boolean } switches "nõua sidumist" for every device.
// POST { remove: '<device id>' } takes a device off the list: its binding stops counting.
async function state(req: NextRequest, binding?: Awaited<ReturnType<typeof readDeviceBinding>>, thisDevice?: string | null) {
  const token = await readDeviceToken(req);
  const current = binding !== undefined ? binding : await readDeviceBinding(req);
  return {
    binding: current,
    required: isDeviceBindingRequired(),
    devices: listDevices(),
    thisDevice: thisDevice !== undefined ? thisDevice : (current ? token?.deviceId ?? null : null)
  };
}

export async function GET(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  return NextResponse.json(await state(req), { headers: { 'Cache-Control': 'no-store' } });
}

export async function POST(req: NextRequest) {
  if (!await hasParentSession()) return NextResponse.json({ message: 'Ligipääs puudub.' }, { status: 401 });
  const jsonBody = await readJsonObjectRequest(req);
  if (jsonBody instanceof NextResponse) return jsonBody;

  const has = (key: string) => Object.prototype.hasOwnProperty.call(jsonBody, key);
  const hasBinding = has('binding');
  const hasRequired = has('required');
  const hasRemove = has('remove');
  if (!hasBinding && !hasRequired && !hasRemove) return NextResponse.json({ message: 'Vali, kelle seade see on.' }, { status: 400 });
  if (hasBinding && jsonBody.binding !== null && !isDeviceBinding(jsonBody.binding)) {
    return NextResponse.json({ message: 'Vali, kelle seade see on.' }, { status: 400 });
  }
  if (hasRequired && typeof jsonBody.required !== 'boolean') {
    return NextResponse.json({ message: 'Vale seade.' }, { status: 400 });
  }
  if (hasRemove && typeof jsonBody.remove !== 'string') {
    return NextResponse.json({ message: 'Vale seade.' }, { status: 400 });
  }

  if (hasRequired) setDeviceBindingRequired(jsonBody.required as boolean);
  if (hasRemove) removeDevice(jsonBody.remove as string);

  if (!hasBinding) return NextResponse.json(await state(req));

  const token = await readDeviceToken(req);
  const binding = isDeviceBinding(jsonBody.binding) ? jsonBody.binding : null;
  let deviceId: string | null = null;
  if (binding) {
    const app: DeviceApp = jsonBody.app === true ? 'app' : jsonBody.app === false ? 'browser' : 'unknown';
    deviceId = registerDevice({ id: token?.deviceId ?? null, binding, device: deviceLabel(req.headers.get('user-agent')), app });
  } else if (token?.deviceId) {
    removeDevice(token.deviceId);
  }
  const response = NextResponse.json(await state(req, binding, deviceId));
  if (binding) response.cookies.set(DEVICE_BINDING_COOKIE, await signDeviceBinding(binding, Date.now(), deviceId ?? undefined), deviceBindingCookieOptions());
  else response.cookies.set(DEVICE_BINDING_COOKIE, '', deviceBindingCookieOptions(0));
  return response;
}
