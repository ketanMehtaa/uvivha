import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const DEFAULT_PAGE_SIZE = 10;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || String(DEFAULT_PAGE_SIZE));
    const skip = (page - 1) * limit;

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
        { error: 'Invalid token format' },
        { status: 401 }
      );
    }

    // Get current user's gender
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { gender: true }
    });

    if (!currentUser?.gender) {
      return NextResponse.json(
        { error: 'User gender not set' },
        { status: 400 }
      );
    }

    const oppositeGender = currentUser.gender === 'Male' ? 'Female' : 'Male';

    // Get total count for pagination
    const totalCount = await prisma.user.count({
      where: {
        id: { not: userId },
        isProfileComplete: true,
        gender: oppositeGender
      }
    });

    // Fetch paginated profiles
    const profiles = await prisma.user.findMany({
      where: {
        id: { not: userId },
        isProfileComplete: true,
        gender: oppositeGender
      },
      select: {
        id: true,
        name: true,
        gender: true,
        birthDate: true,
        location: true,
        bio: true,
        photos: true,
        education: true,
        occupation: true,
        caste: true,
        subcaste: true,
      },
      skip,
      take: limit,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      profiles,
      pagination: {
        total: totalCount,
        page,
        pageSize: limit,
        totalPages: Math.ceil(totalCount / limit),
      }
    });

  } catch (error) {
    console.error('Error in GET /api/profiles:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 