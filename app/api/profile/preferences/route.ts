import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';
import { MaritalStatus } from '@prisma/client';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Validation constants
const AGE_MIN = 18;
const AGE_MAX = 70;
const HEIGHT_MIN = 120;
const HEIGHT_MAX = 220;

// Valid options from frontend
const VALID_EDUCATION = ["Bachelor's and above", "Master's and above", 'Doctorate', 'Any'];
const VALID_OCCUPATION = ['Private Job', 'Government Job', 'Business', 'Self Employed', 'Any'];

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
    const {
      agePreferenceMin,
      agePreferenceMax,
      heightPreferenceMin,
      heightPreferenceMax,
      maritalStatusPreference,
      educationPreference,
      occupationPreference,
      locationPreference,
      castePreference,
    } = data;

    // Clean up the data - convert empty strings, "none", and undefined to null
    const cleanData = {
      agePreferenceMin: agePreferenceMin || null,
      agePreferenceMax: agePreferenceMax || null,
      heightPreferenceMin: heightPreferenceMin || null,
      heightPreferenceMax: heightPreferenceMax || null,
      maritalStatusPreference: maritalStatusPreference === 'none' ? null : maritalStatusPreference || null,
      educationPreference: educationPreference === 'none' ? null : educationPreference || null,
      occupationPreference: occupationPreference === 'none' ? null : occupationPreference || null,
      locationPreference: locationPreference || null,
      castePreference: castePreference === 'none' ? null : castePreference || null,
    };

    // Only validate if values are provided (not null or empty)
    if (cleanData.agePreferenceMin && cleanData.agePreferenceMax) {
      const minAge = parseInt(cleanData.agePreferenceMin);
      const maxAge = parseInt(cleanData.agePreferenceMax);

      if (isNaN(minAge) || minAge < AGE_MIN || minAge > AGE_MAX) {
        return NextResponse.json(
          { error: `Minimum age must be between ${AGE_MIN} and ${AGE_MAX}` },
          { status: 400 }
        );
      }

      if (isNaN(maxAge) || maxAge < AGE_MIN || maxAge > AGE_MAX) {
        return NextResponse.json(
          { error: `Maximum age must be between ${AGE_MIN} and ${AGE_MAX}` },
          { status: 400 }
        );
      }

      if (minAge > maxAge) {
        return NextResponse.json(
          { error: 'Minimum age cannot be greater than maximum age' },
          { status: 400 }
        );
      }
    }

    // Validate height ranges if provided
    if (cleanData.heightPreferenceMin && cleanData.heightPreferenceMax) {
      const minHeight = Number(cleanData.heightPreferenceMin);
      const maxHeight = Number(cleanData.heightPreferenceMax);
      
      if (isNaN(minHeight) || isNaN(maxHeight) || minHeight < 3 || maxHeight > 8 || minHeight > maxHeight) {
        return NextResponse.json(
          { error: 'Invalid height range' },
          { status: 400 }
        );
      }
    }

    // Only validate if values are provided (not null or empty)
    if (cleanData.maritalStatusPreference && 
        !Object.values(MaritalStatus).includes(cleanData.maritalStatusPreference as MaritalStatus)) {
      return NextResponse.json(
        { error: 'Invalid marital status preference' },
        { status: 400 }
      );
    }

    if (cleanData.educationPreference && !VALID_EDUCATION.includes(cleanData.educationPreference)) {
      return NextResponse.json(
        { error: 'Invalid education preference' },
        { status: 400 }
      );
    }

    if (cleanData.occupationPreference && !VALID_OCCUPATION.includes(cleanData.occupationPreference)) {
      return NextResponse.json(
        { error: 'Invalid occupation preference' },
        { status: 400 }
      );
    }

    // Update user preferences - all fields are optional
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        agePreferenceMin: cleanData.agePreferenceMin ? parseInt(cleanData.agePreferenceMin) : null,
        agePreferenceMax: cleanData.agePreferenceMax ? parseInt(cleanData.agePreferenceMax) : null,
        heightPreferenceMin: cleanData.heightPreferenceMin ? Number(cleanData.heightPreferenceMin) : null,
        heightPreferenceMax: cleanData.heightPreferenceMax ? Number(cleanData.heightPreferenceMax) : null,
        maritalStatusPreference: cleanData.maritalStatusPreference,
        educationPreference: cleanData.educationPreference,
        occupationPreference: cleanData.occupationPreference,
        locationPreference: cleanData.locationPreference,
        castePreference: cleanData.castePreference,
        updatedAt: new Date(),
        isProfileComplete: {
          set: true
        }
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error updating preferences:', error);
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

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

    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
} 