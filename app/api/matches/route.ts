import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { Purpose } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as any).userId || (decoded as any).id;

    if (!userId) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    const { page = 1, limit = 10, ...filters } = await request.json();

    // Get current user's gender
    const currentUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { gender: true }
    });

    const oppositeGender = currentUser?.gender === 'Male' ? 'Female' : 'Male';
    const where: any = {
      id: { not: userId },
      isProfileComplete: true,
      gender: oppositeGender,
    };

    // Handle mode/purpose filtering
    if (filters.mode) {
      where.OR = [
        { purpose: filters.mode },  // Dating or Matrimony
        { purpose: 'Both' }        // Both should be included in either case
      ];
    }

    console.log('Filter mode:', filters.mode);
    console.log('Where clause:', JSON.stringify(where, null, 2));

    // Age range
    if (filters.ageRange) {
      const today = new Date();
      const minDate = new Date(today.getFullYear() - filters.ageRange.max, today.getMonth(), today.getDate());
      const maxDate = new Date(today.getFullYear() - filters.ageRange.min, today.getMonth(), today.getDate());
      where.birthDate = { gte: minDate, lte: maxDate };
    }

    // Height and weight ranges
    if (filters.heightRange) {
      where.height = { 
        gte: filters.heightRange.min,
        lte: filters.heightRange.max 
      };
    }

    if (filters.weightRange) {
      where.weight = { 
        gte: filters.weightRange.min,
        lte: filters.weightRange.max 
      };
    }

    // Enum and string matches
    if (filters.caste !== 'none') where.caste = filters.caste;
    // if (filters.subcaste !== 'none') where.subcaste = filters.subcaste;
    if (filters.community !== 'none') where.community = filters.community;
    if (filters.maritalStatus !== 'none') where.maritalStatus = filters.maritalStatus;
    if (filters.complexion !== 'none') where.complexion = filters.complexion;
    if (filters.physicalStatus !== 'none') where.physicalStatus = filters.physicalStatus;
    if (filters.familyType !== 'none') where.familyType = filters.familyType;
    if (filters.familyStatus !== 'none') where.familyStatus = filters.familyStatus;
    // if (filters.manglik !== 'none') where.manglik = filters.manglik;
    if (filters.employedIn !== 'none') where.employedIn = filters.employedIn;
    if (filters.hasPhotos !== 'none') where.photos = { isEmpty: filters.hasPhotos === 'No' };

    

    // Location search
    if (filters.location) {
      where.location = {
        contains: filters.location,
        mode: 'insensitive'
      };
    }

    // In the where clause section
    // if (filters.hasPhotos === 'Yes') {
    //   where.photos = {
    //     isEmpty: false
    //   };
    // }

    // Get total count for pagination
    const total = await prisma.user.count({ where });
    console.log('Total matching profiles:', total);

    // Get paginated results with debug logging
    const profiles = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        gender: true,
        birthDate: true,
        location: true,
        photos: true,
        height: true,
        weight: true,
        education: true,
        occupation: true,
        caste: true,
        subcaste: true,
        maritalStatus: true,
        complexion: true,
        employedIn: true,
        familyType: true,
        familyStatus: true,
        // manglik: true,
        community: true,
        purpose: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found profiles:', profiles.map(p => ({ id: p.id, purpose: p.purpose })));

    return NextResponse.json({
      profiles,
      pagination: {
        total,
        page,
        pageSize: limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Error in matches API:', error);
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
} 