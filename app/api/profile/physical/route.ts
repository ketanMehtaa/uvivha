import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { checkProfileCompletion } from '@/lib/profile-utils';

const prisma = new PrismaClient();
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

    const { height, weight, complexion, physicalStatus } = await request.json();

    // Validate required fields
    if (!height) {
      return NextResponse.json({ error: 'Height is required' }, { status: 400 });
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        height,
        weight: weight || null,
        complexion: complexion || null,
        physicalStatus: physicalStatus || null,
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
  } finally {
    await prisma.$disconnect();
  }
} 