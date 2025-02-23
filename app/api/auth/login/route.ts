import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { mobile, password } = await request.json();

    // Validate required fields
    if (!mobile || !password) {
      return NextResponse.json(
        { error: 'Mobile and password are required' },
        { status: 400 }
      );
    }

    // Find user by mobile number
    const user = await prisma.user.findUnique({
      where: { mobile }
    });

    // Check if user exists and password matches
    if (!user || user.password !== password) {
      return NextResponse.json(
        { error: 'Invalid mobile number or password' },
        { status: 401 }
      );
    }

    // Check if account is deactivated by team
    if (user.deactivatedByTeam) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support for assistance. mail here : hamyuttarakhand@gmail.com' },
        { status: 403 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response with token in cookie
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        mobile: user.mobile,
        email: user.email,
        isProfileComplete: Boolean(user.name && user.email && user.gender && user.birthDate),
      }
    });

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 