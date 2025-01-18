import { NextResponse } from 'next/server';
import { PrismaClient, Prisma } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Simple password validation
const validatePassword = (password: string): string | null => {
  if (password.length < 6) {
    return 'Password must be at least 6 characters long';
  }
  return null;
};

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
      name,
      password,
      email,
      gender,
      birthDate,
      location,
      bio,
      caste,
      subcaste,
    } = body;

    // Validate required fields
    if (!name || !password || !email || !gender || !birthDate || !location || !caste) {
      return NextResponse.json(
        { error: 'Please fill in all required fields' },
        { status: 400 }
      );
    }

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      return NextResponse.json(
        { error: passwordError },
        { status: 400 }
      );
    }

    try {
      // Update user profile
      const user = await prisma.user.update({
        where: { id: userId },
        data: {
          name,
          password,
          email,
          gender,
          birthDate: birthDate ? new Date(birthDate) : null,
          location,
          bio,
          caste,
          subcaste,
          updatedAt: new Date(),
        },
      });

      // Remove sensitive data from response
    //   const userResponse = {
    //     id: user.id,
    //     name: user.name,
    //     email: user.email,
    //     password: user.password,
    //     gender: user.gender,
    //     birthDate: user.birthDate,
    //     location: user.location,
    //     bio: user.bio,
    //     caste: user.caste,
    //     subcaste: user.subcaste,
    //   };

      return NextResponse.json({
        success: true,
        user: user
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