// delete this page is not used now as i am using the dialog component to show the profile
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { handleUnauthorized } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Calendar,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Phone,
  ArrowLeft
} from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { use } from 'react';

interface UserProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  gender?: string;
  birthDate?: string;
  location?: string;
  bio?: string;
  height?: number;
  weight?: number;
  education?: string;
  educationDetails?: string;
  occupation?: string;
  employedIn?: string;
  companyName?: string;
  jobTitle?: string;
  income?: string;
  maritalStatus?: string;
  caste?: string;
  subcaste?: string;
  photos?: string[];
  complexion?: string;
  physicalStatus?: string;
  familyType?: string;
  familyStatus?: string;
  familyLocation?: string;
  aboutFamily?: string;
  fatherOccupation?: string;
  motherOccupation?: string;
  siblings?: string;
}

// This type matches Next.js App Router's expected type
type PageContext = {
  params: Promise<{ id: string }>;
};

export default function ViewProfilePage(props: PageContext) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { id } = use(props.params);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`/api/profiles/${id}`);
        const data = await res.json();

        if (!res.ok) {
          setError(data.error);
          return;
        }

        setProfile(data.profile);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl font-semibold animate-pulse">Loading profile...</div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h2 className="text-lg font-semibold mb-2">Profile Not Found</h2>
            <p className="text-muted-foreground mb-4">{error || 'Profile does not exist'}</p>
            <Button onClick={() => router.back()}>Go Back</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background relative">
      <Header />
      
      <main className="flex-grow container py-8 px-4 md:px-6 lg:px-8 pb-20">
        <div className="max-w-7xl mx-auto">
          {/* Profile Header Card */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Photo Section */}
                <div className="md:col-span-4">
                  {profile?.photos && profile.photos.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {profile.photos.map((photo, index) => (
                          <CarouselItem key={index}>
                            <div className="aspect-[3/4] relative rounded-xl overflow-hidden shadow-lg">
                              <Image
                                src={photo}
                                alt={`${profile.name} - Photo ${index + 1}`}
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
                        alt={profile?.name || 'Profile'}
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
                        <h1 className="text-3xl font-bold mb-2">{profile?.name}</h1>
                        <Badge variant="secondary" className="text-base px-4 py-1">
                          {profile?.gender}, {profile?.birthDate ? calculateAge(profile.birthDate) : 'N/A'} yrs
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                      {profile?.mobile && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 col-span-full">
                          <Phone className="h-5 w-5 text-primary" />
                          <a 
                            href={`tel:${profile.mobile}`}
                            className="font-medium flex items-center gap-2 px-3 py-1 rounded-md hover:bg-primary/10 hover:text-primary active:bg-primary/20 transition-all"
                          >
                            {profile.mobile}
                          </a>
                        </div>
                      )}
                      {profile?.location && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <MapPin className="h-5 w-5 text-primary" />
                          <span>{profile.location}</span>
                        </div>
                      )}
                      {profile?.education && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <span>{profile.education}</span>
                        </div>
                      )}
                      {profile?.occupation && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Briefcase className="h-5 w-5 text-primary" />
                          <span>{profile.occupation}</span>
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
            <div className="space-y-8">
              {/* Basic Details */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Basic Details</h2>
                  <div className="space-y-4">
                    {profile?.height && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Height</span>
                        <span className="font-medium">{profile.height} f</span>
                      </div>
                    )}
                    {profile?.weight && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Weight</span>
                        <span className="font-medium">{profile.weight} kg</span>
                      </div>
                    )}
                    {profile?.complexion && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Complexion</span>
                        <span className="font-medium">{profile.complexion}</span>
                      </div>
                    )}
                    {profile?.maritalStatus && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Marital Status</span>
                        <span className="font-medium">{profile.maritalStatus}</span>
                      </div>
                    )}
                    {profile?.physicalStatus && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Physical Status</span>
                        <span className="font-medium">{profile.physicalStatus}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Career Details */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Career Details</h2>
                  <div className="space-y-4">
                    {profile?.education && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Education</span>
                        <span className="font-medium">{profile.education}</span>
                      </div>
                    )}
                    {profile?.educationDetails && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Education Details</span>
                        <span className="font-medium">{profile.educationDetails}</span>
                      </div>
                    )}
                    {profile?.occupation && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Occupation</span>
                        <span className="font-medium">{profile.occupation}</span>
                      </div>
                    )}
                    {profile?.companyName && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Company</span>
                        <span className="font-medium">{profile.companyName}</span>
                      </div>
                    )}
                    {profile?.income && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Income</span>
                        <span className="font-medium">{profile.income}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-8">
              {/* Family Details */}
              <Card className="shadow-md">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Family Details</h2>
                  <div className="space-y-4">
                    {profile?.familyType && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Family Type</span>
                        <span className="font-medium">{profile.familyType}</span>
                      </div>
                    )}
                    {profile?.familyStatus && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Family Status</span>
                        <span className="font-medium">{profile.familyStatus}</span>
                      </div>
                    )}
                    {profile?.fatherOccupation && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Father&apos;s Occupation</span>
                        <span className="font-medium">{profile.fatherOccupation}</span>
                      </div>
                    )}
                    {profile?.motherOccupation && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Mother&apos;s Occupation</span>
                        <span className="font-medium">{profile.motherOccupation}</span>
                      </div>
                    )}
                    {profile?.siblings && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Siblings</span>
                        <span className="font-medium">{profile.siblings}</span>
                      </div>
                    )}
                    {profile?.familyLocation && (
                      <div className="flex items-center justify-between py-2">
                        <span className="text-muted-foreground font-medium">Family Location</span>
                        <span className="font-medium">{profile.familyLocation}</span>
                      </div>
                    )}
                  </div>
                  {profile?.aboutFamily && (
                    <div className="mt-6 pt-4 border-t">
                      <span className="text-muted-foreground font-medium block mb-2">About Family</span>
                      <p className="text-sm leading-relaxed">{profile.aboutFamily}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* About Section */}
              {profile?.bio && (
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b">About</h2>
                    <p className="text-sm leading-relaxed">{profile.bio}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Sticky Back Button */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
        <Button 
          variant="default"
          size="lg"
          onClick={() => router.back()}
          className="shadow-lg flex items-center gap-2 px-6"
        >
          <ArrowLeft className="h-5 w-5" />
          Back
        </Button>
      </div>

      <Footer />
    </div>
  );
} 