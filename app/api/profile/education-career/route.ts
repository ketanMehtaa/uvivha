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
      education,
      educationDetails,
      occupation,
      employedIn,
      companyName,
      jobTitle,
      income,
    } = body;

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        education,
        educationDetails,
        occupation,
        employedIn,
        companyName,
        jobTitle,
        income,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        education: user.education,
        educationDetails: user.educationDetails,
        occupation: user.occupation,
        employedIn: user.employedIn,
        companyName: user.companyName,
        jobTitle: user.jobTitle,
        income: user.income,
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