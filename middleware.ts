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
  '/deleteaccount',
  '/Deleteaccount',
  '/profiles',
  '/profiles/',  // Add trailing slash variant
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

// Function to check if a route is public
const isPublicRoute = (pathname: string): boolean => {
  // Check exact matches
  if (publicRoutes.includes(pathname)) {
    return true;
  }
  
  // Check static prefixes
  if (staticPrefixes.some(prefix => pathname.startsWith(prefix))) {
    return true;
  }
  
  // Check for profiles/[id] pattern
  if (pathname.match(/^\/profiles\/[^/]+\/?$/)) {
    return true;
  }
  
  // Check for shared-profile routes
  if (pathname.startsWith('/shared-profile/') || pathname.startsWith('/api/profile/share/')) {
    return true;
  }
  
  // Check for API auth routes
  if (pathname.startsWith('/api/auth/')) {
    return true;
  }
  
  return false;
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  // console.log('Middleware checking path:', pathname);

  // Check if it's a public route
  if (isPublicRoute(pathname)) {
    console.log('Public route accessed:', pathname);
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
