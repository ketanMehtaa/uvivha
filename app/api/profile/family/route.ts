import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { checkProfileCompletion } from '@/lib/profile-utils';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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

    const { familyType, familyStatus, fatherOccupation, motherOccupation, siblings, familyLocation, aboutFamily } = await req.json();

    if (!familyType || !familyStatus) {
      return NextResponse.json({ error: 'Family type and status are required' }, { status: 400 });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        familyType,
        familyStatus,
        fatherOccupation: fatherOccupation || null,
        motherOccupation: motherOccupation || null,
        siblings: siblings || null,
        familyLocation: familyLocation || null,
        aboutFamily: aboutFamily || null,
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