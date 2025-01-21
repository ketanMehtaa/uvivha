import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

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

export async function POST(req: Request) {
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

    const { education, educationDetails, occupation, companyName, jobTitle, income } = await req.json();

    if (!education || !occupation) {
      return NextResponse.json({ error: 'Education and occupation are required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        education,
        educationDetails,
        occupation,
        companyName,
        jobTitle,
        income,
        updatedAt: new Date(),
        // isProfileComplete: {
        //   set: await checkProfileCompletion(userId)
        // }
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 