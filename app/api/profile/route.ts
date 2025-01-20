import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';



export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('auth-token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Verify token and get user ID
        let decoded;
        try {
            decoded = jwt.verify(token, JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = (decoded as any).userId || (decoded as any).id;

        const profile = await prisma.user.findUnique({
            where: { id: userId },
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
                isProfileComplete: true,
                profileShare: {
                    select: {
                        token: true,
                        expiresAt: true,
                        viewCount: true,
                        renewalCount: true
                    }
                }
            }
        });

        if (!profile) {
            return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
        }

        return NextResponse.json({ profile });

    } catch (error) {
        console.error("[PROFILE_GET_ERROR]", error);
        return NextResponse.json({ error: 'Internal Error' }, { status: 500 });
    }
} 