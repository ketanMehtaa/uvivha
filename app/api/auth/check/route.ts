import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ 
        authenticated: false,
        error: 'No authentication token found'
      });
    }

    try {
      // Verify the token
      const decoded = jwt.verify(token, JWT_SECRET);
      const userId = (decoded as any).userId || (decoded as any).id;

      if (!userId) {
        return NextResponse.json({ 
          authenticated: false,
          error: 'Invalid token format'
        });
      }

      return NextResponse.json({ 
        authenticated: true,
        userId 
      });
    } catch (error) {
      // Token is invalid or expired
      if (error instanceof jwt.TokenExpiredError) {
        return NextResponse.json({ 
          authenticated: false,
          error: 'Token expired'
        });
      }
      
      return NextResponse.json({ 
        authenticated: false,
        error: 'Invalid token'
      });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ 
      authenticated: false,
      error: 'Internal server error'
    });
  }
} 