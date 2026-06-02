import { NextRequest, NextResponse } from 'next/server';
import { APP_ACCESS_COOKIE, hasValidAppAccessToken } from '@/lib/appAccess';

function isPublicPath(pathname: string) {
  if (pathname === '/access' || pathname === '/api/access') return true;
  if (pathname.startsWith('/_next')) return true;
  return /\.(?:ico|png|jpg|jpeg|gif|svg|webp|txt|xml)$/i.test(pathname);
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (isPublicPath(pathname)) return NextResponse.next();

  const hasAccess = hasValidAppAccessToken(req.cookies.get(APP_ACCESS_COOKIE)?.value);
  if (hasAccess) return NextResponse.next();

  if (pathname.startsWith('/api/')) {
    return NextResponse.json({ message: 'PIN on vajalik.' }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = '/access';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)']
};
