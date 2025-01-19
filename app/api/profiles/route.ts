import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET() {
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
        { error: 'Invalid token format' },
        { status: 401 }
      );
    }

    // Fetch current user with all details
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        mobile: true,
        email: true,
        gender: true,
        birthDate: true,
        location: true,
        bio: true,
        photos: true,
        height: true,
        weight: true,
        complexion: true,
        physicalStatus: true,
        education: true,
        educationDetails: true,
        occupation: true,
        employedIn: true,
        companyName: true,
        jobTitle: true,
        income: true,
        maritalStatus: true,
        religion: true,
        caste: true,
        subcaste: true,
        motherTongue: true,
        familyType: true,
        familyStatus: true,
        fatherOccupation: true,
        motherOccupation: true,
        siblings: true,
        familyLocation: true,
        aboutFamily: true,
        agePreferenceMin: true,
        agePreferenceMax: true,
        heightPreferenceMin: true,
        heightPreferenceMax: true,
        castePreference: true,
        educationPreference: true,
        occupationPreference: true,
        locationPreference: true,
        maritalStatusPreference: true,
        isProfileComplete: true
      }
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    if (!currentUser.gender || !currentUser.isProfileComplete) {
      return NextResponse.json(
        { error: 'Please complete your profile first' },
        { status: 400 }
      );
    }

    const oppositeGender = currentUser.gender === 'Male' ? 'Female' : 'Male';

    const profiles = await prisma.user.findMany({
      where: {
        id: { not: userId },
        gender: oppositeGender,
        isProfileComplete: true,
      },
      select: {
        id: true,
        name: true,
        gender: true,
        birthDate: true,
        location: true,
        education: true,
        occupation: true,
        photos: true,
        height: true,
        caste: true,
        maritalStatus: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });

    return NextResponse.json({ 
      profiles,
      meta: {
        total: profiles.length,
        currentUserGender: currentUser.gender,
        lookingFor: oppositeGender
      }
    });

  } catch (error: any) {
    console.error('Error in profiles route:', error);

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