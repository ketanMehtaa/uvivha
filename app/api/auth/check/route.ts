import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    console.log('Auth check - Token found:', !!token);

    if (!token) {
      console.log('Auth check - No token found');
      return NextResponse.json({ 
        authenticated: false,
        error: 'No authentication token found'
      }, { status: 401 });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = (decoded as any).userId || (decoded as any).id;

      console.log('Auth check - Token verified, userId:', userId);

      if (!userId) {
        console.log('Auth check - Invalid token format (no userId)');
        return NextResponse.json({ 
          authenticated: false,
          error: 'Invalid token format'
        }, { status: 401 });
      }

      // Set CORS headers for PWA
      return new NextResponse(
        JSON.stringify({ authenticated: true, userId }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    } catch (error) {
      console.error('Token verification failed:', error);
      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json({ 
          authenticated: false,
          error: 'Token expired'
        }, { status: 401 });
      }
      
      return NextResponse.json({ 
        authenticated: false,
        error: 'Invalid token'
      }, { status: 401 });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
} 