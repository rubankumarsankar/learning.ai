import { getToken } from 'next-auth/jwt';
import { NextResponse } from 'next/server';

const ALLOWED_LEARNING_EMAILS = [
  'srirubankumar@gmail.com',
  // Add more emails here
];

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  
  // Extract token using NextAuth's Edge-compatible JWT tool
  const token = await getToken({ 
    req, 
    secret: process.env.NEXTAUTH_SECRET,
    // ensure cookie names match what next-auth v5 uses
    secureCookie: process.env.NODE_ENV === 'production',
  });
  
  const isLoggedIn = !!token;

  // Public routes
  const publicRoutes = ['/login', '/signup'];
  if (publicRoutes.includes(pathname)) {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // Protected routes (money track requires auth)
  if (pathname.startsWith('/money')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
  }

  // Protected routes (learn track requires auth + specific email)
  if (pathname.startsWith('/learn')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/login', req.url));
    }
    if (!ALLOWED_LEARNING_EMAILS.includes(token?.email)) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
