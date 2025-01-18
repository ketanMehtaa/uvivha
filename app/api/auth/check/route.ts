import { NextResponse, NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ authenticated: false });
    }

    try {
      // Verify the token
      jwt.verify(token, JWT_SECRET);
      return NextResponse.json({ authenticated: true });
    } catch (error) {
      // Token is invalid or expired
      return NextResponse.json({ authenticated: false });
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json({ authenticated: false });
  }
} 