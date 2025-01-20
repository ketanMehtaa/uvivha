import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ userId: string; token: string }> }
) {
  try {
    const { userId, token } = await params;

    // Find the share token and increment view count
    const profileShare = await prisma.profileShare.update({
      where: {
        userId,
        token,
        expiresAt: {
          gt: new Date() // Check if not expired
        }
      },
      data: {
        viewCount: { increment: 1 }
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mobile: true,
            email: true,
            gender: true,
            birthDate: true,
            location: true,
            bio: true,
            photos: true,
            height: true,
            weight: true,
            complexion: true,
            physicalStatus: true,
            education: true,
            educationDetails: true,
            occupation: true,
            employedIn: true,
            companyName: true,
            jobTitle: true,
            income: true,
            maritalStatus: true,
            religion: true,
            caste: true,
            subcaste: true,
            motherTongue: true,
            familyType: true,
            familyStatus: true,
            fatherOccupation: true,
            motherOccupation: true,
            siblings: true,
            familyLocation: true,
            aboutFamily: true,
            agePreferenceMin: true,
            agePreferenceMax: true,
            heightPreferenceMin: true,
            heightPreferenceMax: true,
            castePreference: true,
            educationPreference: true,
            occupationPreference: true,
            locationPreference: true,
            maritalStatusPreference: true,
            isProfileComplete: true
          }
        }
      }
    });

    if (!profileShare) {
      return new NextResponse("Profile share not found or expired", { status: 404 });
    }

    return NextResponse.json({
      user: profileShare.user,
      shareInfo: {
        expiresAt: profileShare.expiresAt,
        viewCount: profileShare.viewCount,
        renewalCount: profileShare.renewalCount
      }
    });

  } catch (error) {
    console.error("[PROFILE_SHARE_VIEW_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
} 