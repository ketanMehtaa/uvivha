import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { addDays } from "date-fns";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';


export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as any).userId || (decoded as any).id;
    // Get current share token if exists
    const profileShare = await prisma.profileShare.findUnique({
      where: { userId }
    });

    if (!profileShare) {
      return NextResponse.json(null);
    }

    return NextResponse.json({
      token: profileShare.token,
      userId: profileShare.userId,
      expiresAt: profileShare.expiresAt,
      viewCount: profileShare.viewCount,
      renewalCount: profileShare.renewalCount
    });

  } catch (error) {
    console.error("[PROFILE_SHARE_GET_ERROR]", error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
}

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = (decoded as any).userId || (decoded as any).id;

    // Check if user already has a share token
    let profileShare = await prisma.profileShare.findUnique({
      where: { userId }
    });

    if (profileShare) {
      // If token exists but expired, update it
      if (profileShare.expiresAt < new Date()) {
        profileShare = await prisma.profileShare.update({
          where: { userId },
          data: {
            expiresAt: addDays(new Date(), 30),
            lastRenewedAt: new Date(),
            renewalCount: { increment: 1 }
          }
        });
      }
    } else {
      // Create new share token
      profileShare = await prisma.profileShare.create({
        data: {
          userId,
          expiresAt: addDays(new Date(), 30)
        }
      });
    }

    return NextResponse.json({
      token: profileShare.token,
      userId: profileShare.userId,
      expiresAt: profileShare.expiresAt,
      viewCount: profileShare.viewCount,
      renewalCount: profileShare.renewalCount
    });

  } catch (error) {
    console.error("[PROFILE_SHARE_ERROR]", error);
    return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
  }
} 