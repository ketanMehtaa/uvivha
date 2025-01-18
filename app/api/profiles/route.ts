import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (decoded as any).userId || (decoded as any).id;
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get current user's gender
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { gender: true }
    });

    if (!currentUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Fetch profiles of opposite gender who have completed their profiles
    const profiles = await prisma.user.findMany({
      where: {
        id: { not: userId },
        gender: currentUser.gender === 'Male' ? 'Female' : 'Male',
        isProfileComplete: true,
      },
      select: {
        id: true,
        name: true,
        birthDate: true,
        gender: true,
        location: true,
        education: true,
        occupation: true,
        bio: true,
        height: true,
        caste: true,
        subcaste: true,
        maritalStatus: true,
        photos: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });

    // Calculate age for each profile
    const profilesWithAge = profiles.map(profile => {
      const age = profile.birthDate ? 
        Math.floor((new Date().getTime() - new Date(profile.birthDate).getTime()) / 31557600000) : 
        null;
      
      return {
        ...profile,
        age,
      };
    });

    return NextResponse.json({ success: true, profiles: profilesWithAge });
  } catch (error) {
    console.error('Error fetching profiles:', error);
    return NextResponse.json({ error: 'Failed to fetch profiles' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 