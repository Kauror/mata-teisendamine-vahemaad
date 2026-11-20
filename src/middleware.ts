import { NextRequest, NextResponse } from 'next/server';
import { APP_ACCESS_COOKIE, APP_CSRF_COOKIE, FAMILY_SESSION_MAX_AGE_SECONDS, PARENT_SESSION_COOKIE } from '@/lib/auth/constants';
import {
  DEVICE_BINDING_COOKIE,
  DEVICE_BINDING_REFRESH_SECONDS,
  deviceBindingCookieOptions,
  redirectForBoundDevice,
  signDeviceBinding,
  verifyDeviceBindingToken
} from '@/lib/auth/deviceBinding';
import { hasExactOrigin, isLegacyFamilySession, issueSession, verifySession, type SignedSession } from '@/lib/auth/session';
import { isChildWritePath, isPeekReadOnlyRequest, PARENT_PEEK_COOKIE, PARENT_PEEK_COOKIE_VALUE, PARENT_PEEK_MAX_AGE_SECONDS, PEEK_READ_ONLY_ACTION_MESSAGE, PEEK_READ_ONLY_CODE } from '@/lib/peekMode';

function isPublicPath(pathname: string) {
  if (pathname === '/access' || pathname === '/api/access') return true;
  if (pathname === '/api/healthz') return true;
  if (pathname === '/sw.js' || pathname === '/manifest.webmanifest') return true;
  if (pathname.startsWith('/_next')) return true;
  // Static files by extension: only root-level files (icons, manifest images,
  // favicon) and the two public image folders. A bare extension test let any
  // dynamic API route or page whose last segment ends in ".png" skip the
  // family session (/api/history/1.png reached its handler unauthenticated).
  return STATIC_FILE.test(pathname);
}

const STATIC_FILE = /^\/(?:(?:textbook-images|kaardimang)\/(?:[^/]+\/)*)?[^/]+\.(?:ico|png|jpg|jpeg|gif|svg|webp|txt|xml)$/i;

function isMutation(request: NextRequest) {
  return !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
}

// Mirror "a parent is signed in on this browser" into a cookie the child pages
// can read, so peeking at a child's screen never consumes their one-shot
// notifications. See src/lib/peekMode.ts for why this is a cookie and not a
// server-rendered prop. Only document navigations carry it: they are what the
// child pages render from, and it keeps the flag off cacheable API responses.
async function applyParentPeekCookie(request: NextRequest, response: NextResponse) {
  if (request.method !== 'GET' || request.nextUrl.pathname.startsWith('/api/')) return response;
  const parent = await verifySession(request.cookies.get(PARENT_SESSION_COOKIE)?.value, 'parent');
  const alreadySet = request.cookies.get(PARENT_PEEK_COOKIE)?.value === PARENT_PEEK_COOKIE_VALUE;
  if (!parent && !alreadySet) return response;
  response.cookies.set(PARENT_PEEK_COOKIE, parent ? PARENT_PEEK_COOKIE_VALUE : '', {
    // Readable from the page — it is a UI hint, never an authorisation decision.
    httpOnly: false,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: parent ? PARENT_PEEK_MAX_AGE_SECONDS : 0
  });
  return response;
}

// Family sessions issued before the family epoch existed are re-signed with
// the current epoch (same CSRF token, same expiry), so they become revocable by
// a PIN change without asking any child for the PIN again.
async function upgradeLegacyFamilySession(session: SignedSession, response: NextResponse) {
  if (!isLegacyFamilySession(session)) return response;
  const remaining = session.expiresAt - Math.floor(Date.now() / 1000);
  if (remaining <= 0) return response;
  const upgraded = await issueSession('family', {
    maxAgeSeconds: Math.min(remaining, FAMILY_SESSION_MAX_AGE_SECONDS),
    expiresAt: session.expiresAt,
    csrf: session.csrf
  });
  const options = { sameSite: 'strict' as const, secure: process.env.NODE_ENV === 'production', path: '/', maxAge: remaining };
  response.cookies.set(APP_ACCESS_COOKIE, upgraded.token, { ...options, httpOnly: true });
  response.cookies.set(APP_CSRF_COOKIE, session.csrf, { ...options, httpOnly: false });
  return response;
}

// Each phone remembers its child (src/lib/auth/deviceBinding.ts): a page of
// the other child redirects to this device's own child, and the binding cookie
// is re-signed now and then so it never reaches the browsers' 400-day cap.
async function applyDeviceBinding(request: NextRequest): Promise<{ redirect: string | null; refresh: string | null }> {
  if (request.method !== 'GET' || request.nextUrl.pathname.startsWith('/api/')) return { redirect: null, refresh: null };
  const bound = await verifyDeviceBindingToken(request.cookies.get(DEVICE_BINDING_COOKIE)?.value);
  if (!bound) return { redirect: null, refresh: null };
  const stale = Math.floor(Date.now() / 1000) - bound.issuedAt > DEVICE_BINDING_REFRESH_SECONDS;
  // Only a real navigation is redirected. The service worker precaches both
  // children's pages with fetch() (Sec-Fetch-Dest: empty), and a redirect there
  // would fail its install and take offline use away from the bound phone.
  const navigation = request.headers.get('sec-fetch-dest') === 'document';
  return {
    redirect: navigation ? redirectForBoundDevice(request.nextUrl.pathname, bound.binding) : null,
    refresh: stale ? await signDeviceBinding(bound.binding) : null
  };
}

function requiresFamilyCsrf(pathname: string) {
  return pathname === '/api/parent/login' || pathname.startsWith('/api/offline/');
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isMutation(req) && !hasExactOrigin(req.headers.get('origin'))) {
    return NextResponse.json({ code: 'invalid_origin', message: 'Päringu päritolu ei sobi.' }, { status: 403 });
  }
  if (isPublicPath(pathname)) return NextResponse.next();

  const session = await verifySession(req.cookies.get(APP_ACCESS_COOKIE)?.value, 'family');
  if (!session) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ code: 'reauth_required', message: 'PIN on vajalik.' }, { status: 401 });
    }
    const url = req.nextUrl.clone();
    url.pathname = '/access';
    url.search = '';
    return NextResponse.redirect(url);
  }

  if (isMutation(req) && requiresFamilyCsrf(pathname) && req.headers.get('x-csrf-token') !== session.csrf) {
    return NextResponse.json({ code: 'csrf_invalid', message: 'Turvatunnus puudub või ei sobi.' }, { status: 403 });
  }
  if (isMutation(req) && pathname.startsWith('/api/parent/') && pathname !== '/api/parent/login') {
    const parent = await verifySession(req.cookies.get(PARENT_SESSION_COOKIE)?.value, 'parent');
    if (!parent) {
      return NextResponse.json({ code: 'parent_auth_required', message: 'Vanema sisselogimine on vajalik.' }, { status: 401 });
    }
    if (req.headers.get('x-csrf-token') !== parent.csrf) {
      return NextResponse.json({ code: 'csrf_invalid', message: 'Turvatunnus puudub või ei sobi.' }, { status: 403 });
    }
  }
  // Peek mode is read-only for the child's data: a parent signed in on this
  // browser cannot start a session, tick a task or buy on the child's behalf,
  // whatever the page does. "Vaata nagu laps" (the opt-out cookie) lifts it.
  if (isMutation(req) && isChildWritePath(pathname)) {
    const parent = await verifySession(req.cookies.get(PARENT_SESSION_COOKIE)?.value, 'parent');
    if (isPeekReadOnlyRequest({ parentSession: Boolean(parent), cookieHeader: req.headers.get('cookie') })) {
      return NextResponse.json({ code: PEEK_READ_ONLY_CODE, message: PEEK_READ_ONLY_ACTION_MESSAGE }, { status: 403 });
    }
  }
  const device = await applyDeviceBinding(req);
  if (device.redirect) {
    const url = req.nextUrl.clone();
    url.pathname = device.redirect;
    url.search = '';
    return upgradeLegacyFamilySession(session, NextResponse.redirect(url));
  }
  const response = withBuildId(req, await applyParentPeekCookie(req, NextResponse.next()));
  if (device.refresh) response.cookies.set(DEVICE_BINDING_COOKIE, device.refresh, deviceBindingCookieOptions());
  return upgradeLegacyFamilySession(session, response);
}

// Inlined at build time (scripts/build-app.mjs sets it to the same id as
// .next/BUILD_ID, which build-sw.mjs bakes into the worker). The worker caches
// a navigation only when this header equals its own build, so a waiting new
// build's HTML never lands in the old worker's shell cache (OFF-03).
const APP_BUILD_ID_HEADER = 'X-App-Build-Id';

function withBuildId(request: NextRequest, response: NextResponse) {
  const buildId = process.env.NEXT_PUBLIC_APP_BUILD_ID;
  if (buildId && request.method === 'GET' && !request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set(APP_BUILD_ID_HEADER, buildId);
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)']
};
