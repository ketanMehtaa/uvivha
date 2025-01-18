import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, mobile, timestamp, userId } = body;

    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // Find or create user
    const user = await prisma.user.upsert({
      where: { mobile },
      update: {
        name: name || undefined,
        updatedAt: new Date(),
        otplessUserId: userId,
      },
      create: {
        name: name || 'New User',
        mobile,
        password: '', // Empty password since we're using OTPless
        createdAt: new Date(),
        updatedAt: new Date(),
        otplessUserId: userId,
        // Initialize other fields with defaults
        photos: [],
        gender: null,
        birthDate: null,
        location: null,
        bio: null,
        height: null,
        education: null,
        occupation: null,
        income: null,
        maritalStatus: null,
        religion: null,
        caste: null,
        motherTongue: null,
        agePreferenceMin: null,
        agePreferenceMax: null,
        heightPreferenceMin: null,
        heightPreferenceMax: null,
      },
    });

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        mobile: user.mobile 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set JWT token in HTTP-only cookie
    const response = NextResponse.json(
      { 
        success: true,
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          isProfileComplete: Boolean(
            user.gender && 
            user.birthDate && 
            user.location && 
            user.height
          ),
        },
        message: 'Authentication successful'
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days in seconds
    });

    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 