import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { clearUtmSourceCookie, getUtmSource } from '@/lib/utm';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { mobile, userId } = body;
    
    // Get UTM source from cookie - add await here
    const cookieStore = await cookies();
    const utmSource = await getUtmSource(cookieStore);

    if (!mobile) {
      return NextResponse.json(
        { error: 'Mobile number is required' },
        { status: 400 }
      );
    }

    // First check if user exists
    let user = await prisma.user.findUnique({
      where: { mobile }
    });

    if (user?.deactivatedByTeam) {
      return NextResponse.json(
        { error: 'Your account has been deactivated. Please contact support for assistance. mail here : hamyuttarakhand@gmail.com' },
        { status: 403 }
      );
    }

    if (user) {
      // If user exists, only update otplessUserId if needed
      // if (user.otplessUserId !== userId) {
      //   user = await prisma.user.update({
      //     where: { mobile },
      //     data: {
      //       otplessUserId: userId,
      //       updatedAt: new Date(),
      //     }
      //   });
      // }
    } else {
      // If user doesn't exist, create new user with UTM source
      user = await prisma.user.create({
        data: {
          mobile,
          createdAt: new Date(),
          updatedAt: new Date(),
          otplessUserId: userId,
          utmSource: utmSource || 'direct', // Store UTM source or 'direct' if none
        }
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id,
        mobile: user.mobile 
      },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set JWT token in HTTP-only cookie
    //todo check isprofilecomplete we can directly get from user table
    const response = NextResponse.json(
      { 
        success: true,
        user: {
          id: user.id,
          name: user.name,
          mobile: user.mobile,
          isProfileComplete: Boolean(
            user.gender && 
            user.birthDate && 
            user.location && 
            user.height
          ),
        },
        message: 'Authentication successful'
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    // Clear UTM source cookie after use
    clearUtmSourceCookie(response);
    return response;
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 