import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(req: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as any).userId || (decoded as any).id;

    if (!userId) {
      return NextResponse.json(
        { error: 'Invalid token format - no user ID found' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await req.json();
    const {
      familyType,
      familyStatus,
      fatherOccupation,
      motherOccupation,
      siblings,
      familyLocation,
      aboutFamily,
    } = body;

    // Validate required fields
    if (!familyType) {
      return NextResponse.json(
        { error: 'Family type is required' },
        { status: 400 }
      );
    }

    if (!familyStatus) {
      return NextResponse.json(
        { error: 'Family status is required' },
        { status: 400 }
      );
    }

    // Update user profile with optional fields
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        familyType,
        familyStatus,
        // Optional fields - will be null if not provided
        fatherOccupation: fatherOccupation || null,
        motherOccupation: motherOccupation || null,
        siblings: siblings || null,
        familyLocation: familyLocation || null,
        aboutFamily: aboutFamily || null,
      },
    });

    return NextResponse.json({ user });
  } catch (error: any) {
    console.error('Error in family API:', error);

    if (error.name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if (error.name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }

    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 