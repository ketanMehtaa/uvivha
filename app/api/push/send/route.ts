import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import * as jose from 'jose';

// Configure web-push with your VAPID keys
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL || 'your-email@example.com'}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    // Verify authentication
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

    const { userId: targetUserId, notification } = await request.json();

    // Get user's subscription
    const subscription = await prisma.pushSubscription.findFirst({
      where: { userId: targetUserId }
    });

    if (!subscription) {
      return NextResponse.json(
        { message: 'No subscription found for user' },
        { status: 200 }
      );
    }

    try {
      await webpush.sendNotification(
        {
          endpoint: subscription.endpoint,
          keys: {
            auth: subscription.auth,
            p256dh: subscription.p256dh
          }
        },
        JSON.stringify(notification)
      );
    } catch (error) {
      console.error('Error sending notification:', error);
      // If subscription is invalid, remove it
      if ((error as any).statusCode === 410) {
        await prisma.pushSubscription.delete({
          where: {
            userId_endpoint: {
              userId: subscription.userId,
              endpoint: subscription.endpoint
            }
          }
        });
      }
      throw error;
    }

    return NextResponse.json({ message: 'Notification sent successfully' });
  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send push notification' },
      { status: 500 }
    );
  }
} 