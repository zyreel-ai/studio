
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/contacts', '/profile', '/scan'];
const publicRoutes = ['/login', '/signup', '/', /^\/c\/[\w-]+$/];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const authed = request.cookies.has('firebaseIdToken');

  // If user is authenticated and tries to access login/signup, redirect to dashboard
  if (authed && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  // If user is not authenticated and tries to access a protected route, redirect to login
  if (!authed && protectedRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|card-bg-default.svg).*)'],
};
