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

    const subscription = await request.json();

    // Store the subscription in the database
    await prisma.pushSubscription.upsert({
      where: {
        userId_endpoint: {
          userId: userId as string,
          endpoint: subscription.endpoint
        }
      },
      update: {
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh
      },
      create: {
        userId: userId as string,
        endpoint: subscription.endpoint,
        auth: subscription.keys.auth,
        p256dh: subscription.keys.p256dh
      }
    });

    return NextResponse.json({ message: 'Subscription added successfully' });
  } catch (error) {
    console.error('Push subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe to push notifications' },
      { status: 500 }
    );
  }
} 