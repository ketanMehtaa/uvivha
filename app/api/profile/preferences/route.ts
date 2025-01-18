import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const { userId } = decoded;

    const body = await request.json();
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
    } = body;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        agePreferenceMin: agePreferenceMin ? parseInt(agePreferenceMin) : null,
        agePreferenceMax: agePreferenceMax ? parseInt(agePreferenceMax) : null,
        heightPreferenceMin: heightPreferenceMin ? parseInt(heightPreferenceMin) : null,
        heightPreferenceMax: heightPreferenceMax ? parseInt(heightPreferenceMax) : null,
        maritalStatusPreference,
        educationPreference,
        occupationPreference,
        locationPreference,
        castePreference,
      },
    });

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error('Error updating preferences:', error);
    return NextResponse.json(
      { error: 'Failed to update preferences' },
      { status: 500 }
    );
  }
} 