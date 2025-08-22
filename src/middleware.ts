import createMiddleware from 'next-intl/middleware';
import {routing} from './i18n/routing';
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const intlMiddleware = createMiddleware(routing);

// Auth helpers
const ALLOW_NO_AUTH = new Set(['GET','HEAD','OPTIONS']);
function isAuthed(req: NextRequest) {
  const header = req.headers.get('authorization') || '';
  const [scheme, encoded] = header.split(' ');
  if (scheme !== 'Basic' || !encoded) return false;
  try {
    const [user, pass] = atob(encoded).split(':');
    return user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS;
  } catch {
    return false;
  }
}

export function middleware(req: NextRequest) {
  const {pathname} = req.nextUrl;

  if (pathname.startsWith('/api')) {
    if (ALLOW_NO_AUTH.has(req.method)) return NextResponse.next();
    if (isAuthed(req)) return NextResponse.next();
    return new NextResponse('Admin authentication required', {status: 401});
  }

  if (pathname.startsWith('/admin')) {
    if (isAuthed(req)) return NextResponse.next();
    return new NextResponse('Authentication required', {status: 401});
  }

  // سایر مسیرها → i18n
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/((?!api|admin|trpc|_next|_vercel|.*\\..*).*)',
    '/admin/:path*',
    '/api/:path*'
  ]
};
