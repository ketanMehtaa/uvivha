'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { handleUnauthorized } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Users,
  Calendar,
  User,
  Star,
  AlertCircle
} from 'lucide-react';

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

export default function ViewProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const profileId = params.id;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profiles/' + profileId);
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
  }, [profileId]);

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
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container py-6">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Profile Header */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Card className="overflow-hidden">
                <div className="aspect-square relative">
                  <Image
                    src={profile.photos?.[0] || '/placeholder-avatar.jpg'}
                    alt={profile.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardContent className="p-4 space-y-4">
                  <div className="flex justify-between">
                    <Button variant="outline" size="lg" className="w-[48%]">
                      <Heart className="mr-2 h-4 w-4" />
                      Interest
                    </Button>
                    <Button size="lg" className="w-[48%]">
                      <Mail className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="md:col-span-2">
              <Card>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h1 className="text-2xl font-bold mb-2">{profile.name}</h1>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{profile.location || 'Location not specified'}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {profile.gender}, {profile.birthDate ? calculateAge(profile.birthDate) : 'N/A'} yrs
                    </Badge>
                  </div>

                  <Separator className="my-4" />

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.education || 'Education not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.occupation || 'Occupation not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.caste || 'Caste not specified'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{profile.maritalStatus || 'Marital status not specified'}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Profile Details */}
          <Card>
            <CardContent className="p-6">
              <Tabs defaultValue="about" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="about" className="gap-2">
                    <User className="h-4 w-4" />
                    About
                  </TabsTrigger>
                  <TabsTrigger value="career" className="gap-2">
                    <Briefcase className="h-4 w-4" />
                    Career & Education
                  </TabsTrigger>
                  <TabsTrigger value="family" className="gap-2">
                    <Users className="h-4 w-4" />
                    Family Details
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="gap-2">
                    <Star className="h-4 w-4" />
                    Preferences
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="about" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Basic Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Height</span>
                          <span>{profile.height ? profile.height + ' cm' : 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Weight</span>
                          <span>{profile.weight ? profile.weight + ' kg' : 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Complexion</span>
                          <span>{profile.complexion || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Physical Status</span>
                          <span>{profile.physicalStatus || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">About Me</h3>
                      <p className="text-muted-foreground">{profile.bio || 'No bio provided'}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="career" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Education</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Highest Education</span>
                          <span>{profile.education || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Details</span>
                          <span>{profile.educationDetails || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">Career</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Occupation</span>
                          <span>{profile.occupation || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Employed In</span>
                          <span>{profile.employedIn || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Company</span>
                          <span>{profile.companyName || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Job Title</span>
                          <span>{profile.jobTitle || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Annual Income</span>
                          <span>{profile.income || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="family" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Family Background</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Family Type</span>
                          <span>{profile.familyType || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Family Status</span>
                          <span>{profile.familyStatus || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Family Location</span>
                          <span>{profile.familyLocation || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Father's Occupation</span>
                          <span>{profile.fatherOccupation || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Mother's Occupation</span>
                          <span>{profile.motherOccupation || 'Not specified'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Siblings</span>
                          <span>{profile.siblings || 'Not specified'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="font-semibold">About Family</h3>
                      <p className="text-muted-foreground">{profile.aboutFamily || 'No family description provided'}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="preferences" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="font-semibold">Partner Preferences</h3>
                      <p className="text-muted-foreground">Partner preferences section coming soon...</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
} 