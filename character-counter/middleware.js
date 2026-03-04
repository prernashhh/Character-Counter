import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextResponse } from 'next/server';
import { verifyToken } from './src/lib/auth';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const { valid } = verifyToken(token);

    if (!valid) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }

    return NextResponse.next();
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};
