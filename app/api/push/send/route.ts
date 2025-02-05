import { NextResponse } from 'next/server';
import webpush from 'web-push';
import { prisma } from '@/lib/prisma';

// Configure web-push with your VAPID keys
webpush.setVapidDetails(
  `mailto:${process.env.VAPID_EMAIL || 'your-email@example.com'}`,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json();

    // If userId is provided, send to specific user, otherwise send to all
    const subscriptions = await prisma.pushSubscription.findMany({
      where: userId ? { userId } : undefined
    });

    const notifications = subscriptions.map(async (subscription) => {
      try {
        await webpush.sendNotification(
          {
            endpoint: subscription.endpoint,
            keys: {
              auth: subscription.auth,
              p256dh: subscription.p256dh
            }
          },
          message
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
      }
    });

    await Promise.all(notifications);

    return NextResponse.json({ message: 'Notifications sent successfully' });
  } catch (error) {
    console.error('Push notification error:', error);
    return NextResponse.json(
      { error: 'Failed to send push notifications' },
      { status: 500 }
    );
  }
} 