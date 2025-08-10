import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// List of public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth',
  '/auth/',  // Add trailing slash variant
  '/api/auth',  // Base API auth route
  '/api/auth/',  // API auth with trailing slash
  '/login',
  '/termsandconditions',
  '/privacy',
  '/login/',  // Add trailing slash variant
  '/api/auth/check',
  '/api/auth/login',
  '/api/auth/register',
  '/_next/static',
  '/_next/image',
  '/_next/webpack-hmr',
  '/favicon.ico',
  '/manifest.json',
  '/android-chrome-192x192.png',
  '/shared-profile',
  '/sw.js',  // Add service worker
  '/workbox-*.js',  // Add workbox scripts
  '/offline'  // Add offline page
];

// Static asset prefixes that should always be public
const staticPrefixes = [
  '/_next/',
  '/static/',
  '/images/',
  '/assets/'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // console.log('Middleware checking path:', pathname);

  // First check if it's a static asset
  if (staticPrefixes.some(prefix => pathname.startsWith(prefix))) {
    // console.log('Static asset accessed:', pathname);
    return NextResponse.next();
  }

  // Check for API auth routes
  if (pathname.startsWith('/api/auth/')) {
    return NextResponse.next();
  }

  // Then check public routes with exact matching
  if (publicRoutes.includes(pathname)) {
    console.log('Public route accessed:', pathname);
    return NextResponse.next();
  }

  // For shared-profile and its API routes, allow the dynamic routes
  if (pathname.startsWith('/shared-profile/') || pathname.startsWith('/api/profile/share/')) {
    console.log('Shared profile route accessed:', pathname);
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const authToken = request.cookies.get('auth-token')?.value;

  if (!authToken) {
    console.log('No auth token found for path:', pathname);
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete({
      name: 'auth-token',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    return response;
  }

  try {
    // Create secret key for jose
    const secret = new TextEncoder().encode(JWT_SECRET);
    
    // Verify JWT token
    console.log('Verifying token for path:', pathname);
    const { payload } = await jose.jwtVerify(authToken, secret);
    
    // Check if decoded token has the required fields
    if (!payload || typeof payload !== 'object' || !(payload.userId || payload.id)) {
      console.error('Token validation failed:', {
        path: pathname,
        hasPayload: !!payload,
        type: typeof payload,
        hasUserId: payload && typeof payload === 'object' && (payload.userId || payload.id)
      });
      throw new Error('Invalid token structure');
    }
    
    console.log('Token verified successfully for path:', pathname);
    return NextResponse.next();
  } catch (error) {
    // If token is invalid
    console.error('Token verification failed:', {
      path: pathname,
      error: error instanceof Error ? error.message : 'Unknown error'
    });

    // Clear the invalid token and force redirect
    const response = NextResponse.redirect(new URL('/login', request.url), {
      status: 302,
      statusText: 'Found'
    });
    
    response.cookies.delete({
      name: 'auth-token',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    return response;
  }
}

export const config = {
  matcher: [
    // Match all routes
    '/:path*'
  ]
};