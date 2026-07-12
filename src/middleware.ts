import { NextRequest, NextResponse } from 'next/server';
import { APP_ACCESS_COOKIE } from '@/lib/auth/constants';
import { hasExactOrigin, verifySession } from '@/lib/auth/session';

function isPublicPath(pathname: string) {
  if (pathname === '/access' || pathname === '/api/access') return true;
  if (pathname === '/sw.js' || pathname === '/manifest.webmanifest') return true;
  if (pathname.startsWith('/_next')) return true;
  return /\.(?:ico|png|jpg|jpeg|gif|svg|webp|txt|xml)$/i.test(pathname);
}

function isMutation(request: NextRequest) {
  return !['GET', 'HEAD', 'OPTIONS'].includes(request.method);
}

function requiresCsrf(pathname: string) {
  return pathname.startsWith('/api/parent/') || pathname.startsWith('/api/offline/');
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

  if (isMutation(req) && requiresCsrf(pathname) && req.headers.get('x-csrf-token') !== session.csrf) {
    return NextResponse.json({ code: 'csrf_invalid', message: 'Turvatunnus puudub või ei sobi.' }, { status: 403 });
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)']
};
