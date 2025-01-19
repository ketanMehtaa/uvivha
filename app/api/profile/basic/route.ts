import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

const checkProfileCompletion = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      mobile: true,
      email: true,
      gender: true,
      birthDate: true,
      location: true,
      bio: true,
      height: true,
      education: true,
      occupation: true,
      income: true,
      maritalStatus: true,
      religion: true,
      caste: true,
      motherTongue: true,
    }
  });

  if (!user) return false;

  return Object.values(user).every(value => value !== null && value !== undefined);
};

export async function POST(request: Request) {
  try {
    // Get token from cookies
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and get user ID
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as any).userId || (decoded as any).id;

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    const data = await request.json();
    const { name, email, gender, birthDate, location, bio, caste, subcaste, photos } = data;

    // Validate required fields
    if (!name || !email || !gender || !birthDate || !location || !caste) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate photos
    if (!photos || !Array.isArray(photos) || photos.length < 2) {
      return NextResponse.json(
        { error: 'At least 2 profile photos are required' },
        { status: 400 }
      );
    }

    // Update user data
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        email,
        gender,
        birthDate: new Date(birthDate),
        location,
        bio,
        caste,
        subcaste,
        photos,
        isProfileComplete: true,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating profile:', error);
    
    if ((error as any).name === 'JsonWebTokenError') {
      return NextResponse.json(
        { error: 'Invalid token' },
        { status: 401 }
      );
    }

    if ((error as any).name === 'TokenExpiredError') {
      return NextResponse.json(
        { error: 'Token expired' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update profile' },
      { status: 500 }
    );
  }
} 