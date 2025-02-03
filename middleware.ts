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
  '/shared-profile'
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow public routes
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    // Special handling for root path ONLY for PWA
    if (pathname === '/' && isPwaRequest(request)) {
      const authToken = request.cookies.get('auth-token')?.value;
      
      if (authToken) {
        try {
          // Verify token before redirecting
          jwt.verify(authToken, JWT_SECRET);
          return NextResponse.redirect(new URL('/dashboard', request.url));
        } catch (error) {
          // If token is invalid, continue to root
          console.error('Invalid token at root:', error);
        }
      }
    }
    
    return NextResponse.next();
  }

  // Rest of the existing middleware logic remains the same...
}

// Helper function to detect PWA request
function isPwaRequest(request: NextRequest): boolean {
  // Check for PWA-specific headers or conditions
  const userAgent = request.headers.get('user-agent') || '';
  const acceptHeader = request.headers.get('accept') || '';

  // Add more PWA detection logic as needed
  const isPwa = (
    userAgent.includes('WebView') || // Common in mobile PWA
    userAgent.includes('wv') || // Another WebView indicator
    request.headers.get('sec-fetch-mode') === 'navigate' || // PWA navigation mode
    acceptHeader.includes('text/html') // Typical PWA request
  );

  return isPwa;
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