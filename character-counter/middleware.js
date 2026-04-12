import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';
import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const intlMiddleware = createMiddleware(routing);

async function verifyAdminToken(token) {
  const JWT_SECRET = process.env.JWT_SECRET;

  if (!JWT_SECRET) {
    return { valid: false };
  }

  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    return { valid: true, payload };
  } catch {
    return { valid: false };
  }
}

export default async function middleware(request) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith('/admin')) {
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = request.cookies.get('admin_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    const { valid } = await verifyAdminToken(token);

    if (!valid) {
      const response = NextResponse.redirect(new URL('/admin/login', request.url));
      response.cookies.delete('admin_token');
      return response;
    }

    return NextResponse.next();
  }

  if (pathname === '/') {
    const url = request.nextUrl.clone();
    url.pathname = '/en';

    return intlMiddleware(
      new Request(url, request)
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/', '/((?!api|_next|_vercel|.*\\..*).*)']
};