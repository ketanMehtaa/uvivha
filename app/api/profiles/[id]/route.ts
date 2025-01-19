import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const profile = await prisma.user.findUnique({
      where: {
        id: params.id
      },
      select: {
        id: true,
        name: true,
        mobile: true,
        email: true,
        gender: true,
        birthDate: true,
        location: true,
        bio: true,
        height: true,
        weight: true,
        education: true,
        educationDetails: true,
        occupation: true,
        employedIn: true,
        companyName: true,
        jobTitle: true,
        income: true,
        maritalStatus: true,
        caste: true,
        subcaste: true,
        photos: true,
        complexion: true,
        physicalStatus: true,
        familyType: true,
        familyStatus: true,
        familyLocation: true,
        aboutFamily: true,
        fatherOccupation: true,
        motherOccupation: true,
        siblings: true,
      }
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ profile });
  } catch (error) {
    console.error('Error in profile route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 