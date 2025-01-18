import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    // Get the token from cookies
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const userId = decoded.userId;

    // Get request body
    const body = await request.json();
    const {
      name,
      email,
      gender,
      birthDate,
      religion,
      caste,
      subcaste,
      motherTongue,
    } = body;

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
        religion,
        caste,
        subcaste,
        motherTongue,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        gender: user.gender,
        birthDate: user.birthDate,
        religion: user.religion,
        caste: user.caste,
        subcaste: user.subcaste,
        motherTongue: user.motherTongue,
      },
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 