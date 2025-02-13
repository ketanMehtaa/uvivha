import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const idd = await params;
    const profile = await prisma.user.findUnique({
      where: {
        id: idd.id
      },
      select: {
        id: true,
        name: true,
        // mobile: true,
        email: true,
        gender: true,
        birthDate: true,
        location: true,
        // district: true,
        bio: true,
        photos: true,
        purpose: true,
        instagramHandle: true,

        // Basic Details
        height: true,
        weight: true,
        complexion: true,
        physicalStatus: true,
        // religion: true,
        // motherTongue: true,
        // gotra: true,
        // manglik: true,
        // horoscope: true,
        // livingWith: true,
        maritalStatus: true,

        // Career Details
        education: true,
        educationDetails: true,
        occupation: true,
        employedIn: true,
        companyName: true,
        jobTitle: true,
        income: true,

        // Community Details
        community: true,
        caste: true,
        subcaste: true,

        // Family Details
        familyType: true,
        familyStatus: true,
        familyLocation: true,
        aboutFamily: true,
        fatherOccupation: true,
        motherOccupation: true,
        siblings: true,
        onBehalf: true,
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