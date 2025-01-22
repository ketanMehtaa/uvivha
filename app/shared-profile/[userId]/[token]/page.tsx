'use client'

import React, { useEffect, useState } from "react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Clock,
  Eye,
  Heart,
  Loader2,
  X
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { TryAgainButton } from "@/components/shared-profile/TryAgainButton";

interface SharedProfilePageProps {
  params: { userId: string; token: string };
}

interface User {
  id: string;
  name: string;
  gender?: string;
  birthDate?: string;
  location?: string;
  bio?: string;
  photos?: string[];
  height?: number;
  weight?: number;
  complexion?: string;
  physicalStatus?: string;
  education?: string;
  educationDetails?: string;
  occupation?: string;
  employedIn?: string;
  companyName?: string;
  jobTitle?: string;
  income?: string;
  maritalStatus?: string;
  religion?: string;
  caste?: string;
  subcaste?: string;
  motherTongue?: string;
  familyType?: string;
  familyStatus?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  siblings?: string;
  familyLocation?: string;
  aboutFamily?: string;
  mobile?: string;
  email?: string;
  agePreferenceMin?: number;
  agePreferenceMax?: number;
  heightPreferenceMin?: number;
  heightPreferenceMax?: number;
  castePreference?: string;
  educationPreference?: string;
  occupationPreference?: string;
  locationPreference?: string;
  maritalStatusPreference?: string;
  isProfileComplete?: boolean;
}

interface ShareInfo {
  expiresAt: string;
  viewCount: number;
  renewalCount: number;
}

interface ProfileData {
  user: User;
  shareInfo: ShareInfo;
}

function calculateAge(birthDate: string) {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
}

// export async function generateMetadata({ params }: SharedProfilePageProps): Promise<Metadata> {
//   const { userId, token } = await params;
//   const data = await getSharedProfile(userId, token);
//   if (!data) return { title: "Profile Not Found" };
  
//   return {
//     title: `${data.user.name}'s Profile`,
//     description: `View ${data.user.name}'s matrimony profile`
//   };
// }

async function getSharedProfile(userId: string, token: string) {
  try {
    // Try to get from cache first
    const cacheKey = `profile-${userId}-${token}`;
    const cachedData = localStorage.getItem(cacheKey);
    
    if (cachedData) {
      const { data, timestamp } = JSON.parse(cachedData);
      const cacheAge = Date.now() - timestamp;
      
      // Return cached data if it's less than 5 minutes old
      if (cacheAge < 5 * 60 * 1000) {
        return data;
      }
      
      // Remove expired cache
      localStorage.removeItem(cacheKey);
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
      (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

    const response = await fetch(`${baseUrl}/api/profile/share/${userId}/${token}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'force-cache',
      next: { revalidate: 300 } // 5 minutes
    });
    
    if (!response.ok) return null;
    
    const data = await response.json();
    
    // Cache the new data
    localStorage.setItem(cacheKey, JSON.stringify({
      data,
      timestamp: Date.now()
    }));
    
    return data;
  } catch (error) {
    console.error('Error fetching shared profile:', error);
    return null;
  }
}

export default function SharedProfilePage({ 
  params: { userId, token } 
}: { 
  params: { userId: string; token: string } 
}) {
  const [data, setData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowToast(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const result = await getSharedProfile(userId, token);
        setData(result);
        setLoading(false);
      } catch (err) {
        setError(true);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container max-w-7xl py-8 px-4 md:px-6 lg:px-8 flex-grow">
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-4">
                  <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                </div>
                <div className="md:col-span-8 space-y-4">
                  <Skeleton className="h-8 w-48" />
                  <Skeleton className="h-6 w-24" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                    <Skeleton className="h-12" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (!data || error) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <div className="container max-w-2xl py-10 flex-grow">
          <Card>
            <CardContent className="pt-6 text-center">
              <h2 className="text-lg font-semibold mb-2">Profile Link Expired</h2>
              <p className="text-muted-foreground mb-4">
                This profile share link has expired. The owner needs to renew it to make it accessible again.
              </p>
              <TryAgainButton />
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const { user, shareInfo } = data;

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      {/* Floating Toast with Animation */}
      {showToast && (
        <div className="fixed bottom-4 right-4 mx-auto w-[80%] md:w-96 md:mx-0 bg-white rounded-lg shadow-2xl z-50 p-6 animate-slideUp">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-xl bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent">
              Find Your Perfect Match
            </h3>
            <button 
              onClick={() => setShowToast(false)}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <p className="text-gray-600 mb-5 text-base">
            Share you Biodata for free and find your perfect match.
          </p>
          <Link href="/auth" className="block">
            <button className="w-full relative group overflow-hidden rounded-lg">
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-pink-500 to-rose-500"></div>
              <div className="absolute -inset-[1px] bg-gradient-to-r from-pink-500 via-rose-500 to-pink-500 animate-border rounded-lg">
                <div className="w-[200%] h-full absolute animate-spin-slow"></div>
              </div>
              <div className="relative px-7 py-4 bg-white rounded-lg leading-none flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors group-hover:bg-opacity-90">
                <span className="text-gradient bg-gradient-to-r from-pink-500 to-rose-500 bg-clip-text text-transparent text-base font-semibold">
                  Start Your Journey
                </span>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-pink-500 to-rose-500 animate-pulse"></div>
              </div>
            </button>
          </Link>
        </div>
      )}

      <Header />
      <main className="flex-grow container py-8 px-4 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Photo Section */}
                <div className="md:col-span-4">
                  {user.photos && user.photos.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {user.photos.map((photo: string, index: number) => (
                          <CarouselItem key={index}>
                            <div className="aspect-[3/4] relative rounded-xl overflow-hidden shadow-lg">
                              <Image
                                src={photo}
                                alt={`${user.name} - Photo ${index + 1}`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </Carousel>
                  ) : (
                    <div className="aspect-[3/4] relative rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src="/placeholder-avatar.jpg"
                        alt={user.name || 'Profile'}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Basic Info Section */}
                <div className="md:col-span-8">
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                        <Badge variant="secondary" className="text-base px-4 py-1">
                          {user.gender}, {user.birthDate ? calculateAge(user.birthDate) : 'N/A'} yrs
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 ">
                        <Eye className="h-5 w-5 text-primary" />
                        <span>Viewed {shareInfo.viewCount} times</span>
                      </div>
                      {/* <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 ">
                        <Clock className="h-5 w-5 text-primary" />
                        <span>Expires {format(new Date(shareInfo.expiresAt), "PPP")}</span>
                      </div> */}
                      {user.location && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <MapPin className="h-5 w-5 text-primary" />
                          <span>{user.location}</span>
                        </div>
                      )}
                      {user.education && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <span>{user.education}</span>
                        </div>
                      )}
                      {user.occupation && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Briefcase className="h-5 w-5 text-primary" />
                          <span>{user.occupation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Details Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Basic Details */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Basic Details</h2>
                <div className="space-y-4">
                  {user.mobile && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Mobile</span>
                      <span className="font-medium">{user.mobile}</span>
                    </div>
                  )}
                  {user.email && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Email</span>
                      <span className="font-medium">{user.email}</span>
                    </div>
                  )}
                  {user.height && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Height</span>
                      <span className="font-medium">{user.height} cm</span>
                    </div>
                  )}
                  {user.weight && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Weight</span>
                      <span className="font-medium">{user.weight} kg</span>
                    </div>
                  )}
                  {user.complexion && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Complexion</span>
                      <span className="font-medium">{user.complexion}</span>
                    </div>
                  )}
                  {user.maritalStatus && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Marital Status</span>
                      <span className="font-medium">{user.maritalStatus}</span>
                    </div>
                  )}
                  {user.religion && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Religion</span>
                      <span className="font-medium">{user.religion}</span>
                    </div>
                  )}
                  {user.caste && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Caste</span>
                      <span className="font-medium">{user.caste}</span>
                    </div>
                  )}
                  {user.subcaste && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Subcaste</span>
                      <span className="font-medium">{user.subcaste}</span>
                    </div>
                  )}
                  {user.motherTongue && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Mother Tongue</span>
                      <span className="font-medium">{user.motherTongue}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Education & Career */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Education & Career</h2>
                <div className="space-y-4">
                  {user.education && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Education</span>
                      <span className="font-medium">{user.education}</span>
                    </div>
                  )}
                  {user.educationDetails && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Education Details</span>
                      <span className="font-medium">{user.educationDetails}</span>
                    </div>
                  )}
                  {user.occupation && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Occupation</span>
                      <span className="font-medium">{user.occupation}</span>
                    </div>
                  )}
                  {user.employedIn && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Employed In</span>
                      <span className="font-medium">{user.employedIn}</span>
                    </div>
                  )}
                  {user.companyName && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Company</span>
                      <span className="font-medium">{user.companyName}</span>
                    </div>
                  )}
                  {user.jobTitle && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Job Title</span>
                      <span className="font-medium">{user.jobTitle}</span>
                    </div>
                  )}
                  {user.income && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Income</span>
                      <span className="font-medium">{user.income}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Family Background */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Family Background</h2>
                <div className="space-y-4">
                  {user.familyType && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Family Type</span>
                      <span className="font-medium">{user.familyType}</span>
                    </div>
                  )}
                  {user.familyStatus && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Family Status</span>
                      <span className="font-medium">{user.familyStatus}</span>
                    </div>
                  )}
                  {user.fatherOccupation && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Father's Occupation</span>
                      <span className="font-medium">{user.fatherOccupation}</span>
                    </div>
                  )}
                  {user.motherOccupation && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Mother's Occupation</span>
                      <span className="font-medium">{user.motherOccupation}</span>
                    </div>
                  )}
                  {user.siblings && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Siblings</span>
                      <span className="font-medium">{user.siblings}</span>
                    </div>
                  )}
                  {user.familyLocation && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Family Location</span>
                      <span className="font-medium">{user.familyLocation}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Partner Preferences */}
            <Card className="shadow-md">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Partner Preferences</h2>
                <div className="space-y-4">
                  {(user.agePreferenceMin || user.agePreferenceMax) && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Age</span>
                      <span className="font-medium">
                        {user.agePreferenceMin && user.agePreferenceMax
                          ? `${user.agePreferenceMin} to ${user.agePreferenceMax} years`
                          : user.agePreferenceMin
                          ? `From ${user.agePreferenceMin} years`
                          : `Up to ${user.agePreferenceMax} years`}
                      </span>
                    </div>
                  )}
                  {(user.heightPreferenceMin || user.heightPreferenceMax) && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Height</span>
                      <span className="font-medium">
                        {user.heightPreferenceMin && user.heightPreferenceMax
                          ? `${user.heightPreferenceMin} to ${user.heightPreferenceMax} cm`
                          : user.heightPreferenceMin
                          ? `From ${user.heightPreferenceMin} cm`
                          : `Up to ${user.heightPreferenceMax} cm`}
                      </span>
                    </div>
                  )}
                  {user.maritalStatusPreference && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Marital Status</span>
                      <span className="font-medium">{user.maritalStatusPreference}</span>
                    </div>
                  )}
                  {user.educationPreference && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Education</span>
                      <span className="font-medium">{user.educationPreference}</span>
                    </div>
                  )}
                  {user.occupationPreference && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Occupation</span>
                      <span className="font-medium">{user.occupationPreference}</span>
                    </div>
                  )}
                  {user.locationPreference && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Location</span>
                      <span className="font-medium">{user.locationPreference}</span>
                    </div>
                  )}
                  {user.castePreference && (
                    <div className="flex items-center justify-between py-2">
                      <span className="text-muted-foreground font-medium">Caste</span>
                      <span className="font-medium">{user.castePreference}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* About */}
            {user.bio && (
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 pb-2 border-b">About</h2>
                  <p className="text-base leading-relaxed">{user.bio}</p>
                </CardContent>
              </Card>
            )}

            {/* About Family */}
            {user.aboutFamily && (
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 pb-2 border-b">About Family</h2>
                  <p className="text-base leading-relaxed">{user.aboutFamily}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* CTA Section */}
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-pink-500 to-rose-500 text-white">
              <CardContent className="p-8 space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">Ready to Find Your Perfect Match?</h2>
                <p className="text-lg text-white/90">
                  Create your profile today and start your journey to finding love
                </p>
                <Button 
                  asChild
                  size="lg" 
                  variant="secondary" 
                  className="mt-4"
                >
                  <Link href="/auth">
                    Create Your Profile
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Add this to your global CSS or as a style tag
const styles = `
@keyframes slideUp {
  0% {
    transform: translateY(20px);
  }
  100% {
    transform: translateY(0);
  }
}

@keyframes border-rotate {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(100%);
  }
}

.animate-border {
  background-size: 200% 100%;
  animation: border-rotate 3s linear infinite;
}

.animate-spin-slow {
  animation: border-rotate 3s linear infinite;
}

.animate-slideUp {
  animation: slideUp 2s ease-out forwards;
}

.text-gradient {
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
`;

// Add the styles to the document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}