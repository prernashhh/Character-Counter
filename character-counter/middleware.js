import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    console.log('🔐 [MIDDLEWARE] Checking admin route:', pathname);

    if (pathname === '/admin/login') {
      console.log('🔐 [MIDDLEWARE] Login page - allowing access');
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;
    console.log('🔐 [MIDDLEWARE] Token found:', !!token);

    if (!token) {
      console.log('🔐 [MIDDLEWARE] No token - redirecting to /admin/login');
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const { valid } = verifyToken(token);
    console.log('🔐 [MIDDLEWARE] Token valid:', valid);

    if (!valid) {
      console.log('🔐 [MIDDLEWARE] Invalid token - redirecting to /admin/login');
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }

    console.log('🔐 [MIDDLEWARE] Token verified - allowing access to:', pathname);
    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/admin/:path*']
};
