import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Validation constants
const AGE_MIN = 18;
const AGE_MAX = 70;
const HEIGHT_MIN = 120;
const HEIGHT_MAX = 220;

// Valid options from frontend
const VALID_MARITAL_STATUS = ['Never Married', 'Divorced', 'Widowed', 'Any'];
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

    const data = await request.json();

    // Clean up the data - convert empty strings, "none", and undefined to null
    const cleanData = {
      agePreferenceMin: data.agePreferenceMin || null,
      agePreferenceMax: data.agePreferenceMax || null,
      heightPreferenceMin: data.heightPreferenceMin || null,
      heightPreferenceMax: data.heightPreferenceMax || null,
      maritalStatusPreference: data.maritalStatusPreference === 'none' ? null : data.maritalStatusPreference || null,
      educationPreference: data.educationPreference === 'none' ? null : data.educationPreference || null,
      occupationPreference: data.occupationPreference === 'none' ? null : data.occupationPreference || null,
      locationPreference: data.locationPreference || null,
      castePreference: data.castePreference === 'none' ? null : data.castePreference || null,
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

    // Only validate if values are provided (not null or empty)
    if (cleanData.heightPreferenceMin && cleanData.heightPreferenceMax) {
      const minHeight = parseInt(cleanData.heightPreferenceMin);
      const maxHeight = parseInt(cleanData.heightPreferenceMax);

      if (isNaN(minHeight) || minHeight < HEIGHT_MIN || minHeight > HEIGHT_MAX) {
        return NextResponse.json(
          { error: `Minimum height must be between ${HEIGHT_MIN}f and ${HEIGHT_MAX}f` },
          { status: 400 }
        );
      }

      if (isNaN(maxHeight) || maxHeight < HEIGHT_MIN || maxHeight > HEIGHT_MAX) {
        return NextResponse.json(
          { error: `Maximum height must be between ${HEIGHT_MIN}f and ${HEIGHT_MAX}f` },
          { status: 400 }
        );
      }

      if (minHeight > maxHeight) {
        return NextResponse.json(
          { error: 'Minimum height cannot be greater than maximum height' },
          { status: 400 }
        );
      }
    }

    // Only validate if values are provided (not null or empty)
    if (cleanData.maritalStatusPreference && !VALID_MARITAL_STATUS.includes(cleanData.maritalStatusPreference)) {
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
        heightPreferenceMin: cleanData.heightPreferenceMin ? parseInt(cleanData.heightPreferenceMin) : null,
        heightPreferenceMax: cleanData.heightPreferenceMax ? parseInt(cleanData.heightPreferenceMax) : null,
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