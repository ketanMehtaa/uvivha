import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { checkProfileCompletion } from '@/lib/profile-utils';

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

    // Parse height and weight to numbers
    const heightNum = parseFloat(height);
    const weightNum = weight ? parseFloat(weight) : null;

    // Validate parsed values
    if (isNaN(heightNum) || heightNum < 3 || heightNum > 8) {
      return NextResponse.json({ error: 'Height must be between 3ft  and 8ft' }, { status: 400 });
    }

    if (weightNum !== null && (isNaN(weightNum) || weightNum < 30 || weightNum > 200)) {
      return NextResponse.json({ error: 'Weight must be between 30kg and 200kg' }, { status: 400 });
    }

    // Update user profile
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        height: heightNum,
        weight: weightNum,
        complexion: complexion ,
        physicalStatus: physicalStatus ,
        updatedAt: new Date(),
        // isProfileComplete: {
        //   set: await checkProfileCompletion(userId)
        // }
      },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    console.error('Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 