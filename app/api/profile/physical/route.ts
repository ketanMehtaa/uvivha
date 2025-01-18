import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
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
    const body = await request.json();
    const {
      height,
      weight,
      complexion,
      physicalStatus,
    } = body;

    // Validate required fields
    if (!height || !physicalStatus) {
      return NextResponse.json(
        { error: 'Height and physical status are required' },
        { status: 400 }
      );
    }

    // Validate height range (120cm - 220cm)
    const heightNum = Number(height);
    if (isNaN(heightNum) || heightNum < 120 || heightNum > 220) {
      return NextResponse.json(
        { error: 'Height must be between 120cm and 220cm' },
        { status: 400 }
      );
    }

    // Validate weight if provided
    let weightNum = null;
    if (weight) {
      weightNum = Number(weight);
      if (isNaN(weightNum) || weightNum < 30 || weightNum > 200) {
        return NextResponse.json(
          { error: 'Weight must be between 30kg and 200kg' },
          { status: 400 }
        );
      }
    }

    // Validate complexion if provided
    const validComplexions = ['Very Fair', 'Fair', 'Wheatish', 'Dark'];
    if (complexion && !validComplexions.includes(complexion)) {
      return NextResponse.json(
        { error: 'Invalid complexion value' },
        { status: 400 }
      );
    }

    // Validate physical status
    const validPhysicalStatuses = ['Normal', 'Physically Challenged'];
    if (!validPhysicalStatuses.includes(physicalStatus)) {
      return NextResponse.json(
        { error: 'Invalid physical status' },
        { status: 400 }
      );
    }

    try {
      // Update user profile
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          height: heightNum ? heightNum : null,
          weight: weightNum ? weightNum : null,
          complexion,
          physicalStatus,
          updatedAt: new Date(),
        },
      });

      return NextResponse.json({
        success: true,
        user
      });
    } catch (error: any) {
      console.error('Database error:', error);
      
      if (error.code === 'P2025') {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { error: 'Failed to update profile' },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Error:', error);

    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 