import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


export async function POST(
  req: Request,
  { params }: { params: { userId: string; token: string } }
) {
  try {
    
    const { userId, token } = params;

    const cookieStore = await cookies();
    const authToken = cookieStore.get('auth-token')?.value;

    if (!authToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(authToken, JWT_SECRET);
    const currentUserId = (decoded as any).userId || (decoded as any).id;
    // Only allow the profile owner to renew the link
    if (currentUserId !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Find and update the share token
    const profileShare = await prisma.profileShare.update({
      where: {
        userId,
        token
      },
      data: {
        expiresAt: addDays(new Date(), 30),
        lastRenewedAt: new Date(),
        renewalCount: { increment: 1 }
      }
    });

    if (!profileShare) {
      return NextResponse.json({ error: 'Profile share not found' }, { status: 404 });
    }

    return NextResponse.json({
      token: profileShare.token,
      userId: profileShare.userId,
      expiresAt: profileShare.expiresAt,
      renewalCount: profileShare.renewalCount,
      viewCount: profileShare.viewCount
    });

  } catch (error) {
    console.error("[PROFILE_SHARE_RENEW_ERROR]", error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
} 