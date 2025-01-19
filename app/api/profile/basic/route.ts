import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

const prisma = new PrismaClient();
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

    const body = await request.json();
    const { 
      name, password, email, gender, birthDate, location, bio, 
       caste, subcaste, 
    } = body;

    // Validate required fields
    if (!name || !email || !gender || !birthDate || !location ||  !caste) {
      return NextResponse.json({ error: 'Required fields missing' }, { status: 400 });
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        password,
        email,
        gender,
        birthDate: birthDate ? new Date(birthDate) : null,
        location,
        bio,
        caste,
        subcaste,
        updatedAt: new Date(),
        isProfileComplete: {
          set: await checkProfileCompletion(userId)
        }
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 