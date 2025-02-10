import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import * as jose from 'jose';
import { prisma } from '@/lib/prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Verify JWT token
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    const userId = payload.userId || payload.id;

    // Delete all push subscriptions for the user
    await prisma.pushSubscription.deleteMany({
      where: { userId: userId as string }
    });

    return NextResponse.json({ message: 'Successfully unsubscribed from push notifications' });
  } catch (error) {
    console.error('Push unsubscription error:', error);
    return NextResponse.json(
      { error: 'Failed to unsubscribe from push notifications' },
      { status: 500 }
    );
  }
} 