import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth',
  '/login',
  '/api/auth/check',
  '/api/auth',
  '/_next',
  '/favicon.ico',
  '/shared-profile'  // Only the shared profile view is public
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const authToken = request.cookies.get('auth-token')?.value;

  if (!authToken) {
    // If API route, return 401
    if (pathname.startsWith('/api/')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    // For pages, redirect to login
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    // Verify JWT token
    jwt.verify(authToken, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    // If token is invalid
    console.error('Invalid token:', error);
    
    // Clear the invalid token
    const response = pathname.startsWith('/api/')
      ? NextResponse.json({ error: 'Invalid token' }, { status: 401 })
      : NextResponse.redirect(new URL('/auth', request.url));

    response.cookies.delete('auth-token');
    return response;
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - auth (auth page)
     * - api/auth (authentication endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - / (root page)
     */
    '/((?!auth|api/auth|_next/static|_next/image|favicon.ico|$).*)',
  ],
};
