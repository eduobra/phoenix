// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value; // adjust based on how you store auth token
  const url = req.nextUrl.clone();

  const isAuthPage = url.pathname.startsWith('/login');
  const isProtectedPage = url.pathname.startsWith('/chat');

  // Redirect to login if accessing protected page without token  
  if (isProtectedPage && !token) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Redirect to home if user is logged in but tries to access login  
  if (isAuthPage && token) {
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Define which paths should use this middleware
export const config = {
  matcher: ['/chat/:path*', '/login'],
};
