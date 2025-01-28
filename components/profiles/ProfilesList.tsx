'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { 
  Heart, 
  Mail, 
  Eye,
  MapPin, 
  GraduationCap, 
  Briefcase,
  AlertCircle,
  Users,
  ImageOff,
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

interface Profile {
  id: string;
  name: string;
  gender?: string;
  birthDate?: string;
  location?: string;
  education?: string;
  occupation?: string;
  photos?: string[];
  caste?: string;
  subcaste?: string;
  community?: string;
  mobile?: string;
  email?: string;
  bio?: string;
  height?: number;
  weight?: number;
  educationDetails?: string;
  employedIn?: string;
  companyName?: string;
  jobTitle?: string;
  income?: string;
  maritalStatus?: string;
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

interface ProfilesListProps {
  profiles: Profile[];
}

const ProfileShimmer = () => {
  return (
    <div className="space-y-8 animate-in fade-in-0">
      {/* Profile Header Shimmer */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Photo Section Shimmer */}
        <div className="md:col-span-4">
          <Skeleton className="aspect-[3/4] w-full rounded-xl" />
        </div>

        {/* Basic Info Section Shimmer */}
        <div className="md:col-span-8">
          <div className="space-y-6">
            <div>
              <Skeleton className="h-8 w-2/3 mb-2" />
              <Skeleton className="h-6 w-1/3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Details Section Shimmer */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Basic Details Shimmer */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Skeleton className="h-7 w-1/3 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Career Details Shimmer */}
        <Card className="shadow-md">
          <CardContent className="p-6">
            <Skeleton className="h-7 w-1/3 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <Skeleton className="h-5 w-1/3" />
                  <Skeleton className="h-5 w-1/4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default function ProfilesList({ profiles }: ProfilesListProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isProfileLoading, setIsProfileLoading] = useState(false);

  useEffect(() => {
    console.log('Profiles received:', profiles?.length);
    // Simulate loading for demo purposes - remove this setTimeout in production
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [profiles]);

  const calculateAge = (birthDate: string) => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleImageError = (profileId: string) => {
    setImageErrors(prev => ({ ...prev, [profileId]: true }));
  };

  const handleViewProfile = async (profileId: string) => {
    setIsDialogOpen(true);
    setIsProfileLoading(true);
    
    try {
      const res = await fetch(`/api/profiles/${profileId}`);
      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSelectedProfile(data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Failed to load profile');
    } finally {
      setIsProfileLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <p className="text-destructive">{error}</p>
      </div>
    );
  }

  if (!profiles?.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No profiles found
      </div>
    );
  }

  return (
    <>
      <div className="w-full px-4">
        <Carousel
          opts={{
            align: "start",
            loop: false,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {profiles.map((profile) => (
              <CarouselItem key={profile.id} className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3 ">
                <Card className="overflow-hidden">
                  <div className="relative aspect-[4/3]">
                    {profile.photos && profile.photos.length > 0 ? (
                      <Carousel className="w-full">
                        <CarouselContent>
                          {profile.photos.map((photo, index) => (
                            <CarouselItem key={index}>
                              <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                                {imageErrors[`${profile.id}-${index}`] ? (
                                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
                                    <ImageOff className="h-12 w-12 text-muted-foreground mb-2" />
                                    <p className="text-sm text-muted-foreground">Image not available</p>
                                  </div>
                                ) : (
                                  <Image
                                    src={photo}
                                    alt={`${profile.name} - Photo ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    onError={() => handleImageError(`${profile.id}-${index}`)}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                  />
                                )}
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-2" />
                        <CarouselNext className="right-2" />
                      </Carousel>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
                        <ImageOff className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No photos available</p>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{profile.name}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      {profile.birthDate && (
                        <div>{calculateAge(profile.birthDate)} years</div>
                      )}
                      {profile.location && (
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {profile.location}
                        </div>
                      )}
                      {profile.education && (
                        <div className="flex items-center gap-1">
                          <GraduationCap className="h-4 w-4" />
                          {profile.education}
                        </div>
                      )}
                      {profile.occupation && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="h-4 w-4" />
                          {profile.occupation}
                        </div>
                      )}
                      {(profile.caste || profile.subcaste) && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <div>
                            <span className='font-medium'>{profile.community}</span> &nbsp;
                            <span className="font-medium">{profile.caste}</span>
                            {profile.subcaste && (
                              <span className="text-muted-foreground"> ( {profile.subcaste} )</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="mt-4">
                      <Button 
                        variant="default"
                        size="sm" 
                        className="w-full"
                        onClick={() => handleViewProfile(profile.id)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Full Profile
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl h-[90vh] overflow-y-auto">
          {isProfileLoading ? (
            <ProfileShimmer />
          ) : selectedProfile && (
            <div className="space-y-8 animate-in fade-in-0">
              {/* Profile Header */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                {/* Photo Section */}
                <div className="md:col-span-4">
                  {selectedProfile?.photos && selectedProfile.photos.length > 0 ? (
                    <Carousel className="w-full">
                      <CarouselContent>
                        {selectedProfile.photos.map((photo, index) => (
                          <CarouselItem key={index}>
                            <div className="aspect-[3/4] relative rounded-xl overflow-hidden">
                              <Image
                                src={photo}
                                alt={`${selectedProfile.name} - Photo ${index + 1}`}
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
                    <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-muted flex items-center justify-center">
                      <ImageOff className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Basic Info Section */}
                <div className="md:col-span-8">
                  <div className="space-y-6">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{selectedProfile?.name}</h1>
                      <Badge variant="secondary" className="text-base px-4 py-1">
                        {selectedProfile?.gender}, {selectedProfile?.birthDate ? calculateAge(selectedProfile.birthDate) : 'N/A'} yrs
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-base">
                      {/* {selectedProfile?.mobile && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 col-span-full">
                          <Phone className="h-5 w-5 text-primary" />
                          <a 
                            href={`tel:${selectedProfile.mobile}`}
                            className="font-medium flex items-center gap-2 px-3 py-1 rounded-md hover:bg-primary/10 hover:text-primary active:bg-primary/20 transition-all"
                          >
                            {selectedProfile.mobile}
                          </a>
                        </div>
                      )} */}
                      {selectedProfile?.location && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <MapPin className="h-5 w-5 text-primary" />
                          <span>{selectedProfile.location}</span>
                        </div>
                      )}
                      {selectedProfile?.education && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <GraduationCap className="h-5 w-5 text-primary" />
                          <span>{selectedProfile.education}</span>
                        </div>
                      )}
                      {selectedProfile?.occupation && (
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <Briefcase className="h-5 w-5 text-primary" />
                          <span>{selectedProfile.occupation}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Details Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Basic Details */}
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Basic Details</h2>
                    <div className="space-y-4">
                      {selectedProfile?.height && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Height</span>
                          <span className="font-medium">{selectedProfile.height} f</span>
                        </div>
                      )}
                      {selectedProfile?.weight && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Weight</span>
                          <span className="font-medium">{selectedProfile.weight} kg</span>
                        </div>
                      )}
                      {selectedProfile?.complexion && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Complexion</span>
                          <span className="font-medium">{selectedProfile.complexion}</span>
                        </div>
                      )}
                      {selectedProfile?.maritalStatus && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Marital Status</span>
                          <span className="font-medium">{selectedProfile.maritalStatus}</span>
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
                      {selectedProfile?.education && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Education</span>
                          <span className="font-medium">{selectedProfile.education}</span>
                        </div>
                      )}
                      {selectedProfile?.educationDetails && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Education Details</span>
                          <span className="font-medium">{selectedProfile.educationDetails}</span>
                        </div>
                      )}
                      {selectedProfile?.occupation && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Occupation</span>
                          <span className="font-medium">{selectedProfile.occupation}</span>
                        </div>
                      )}
                      {selectedProfile?.income && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Income</span>
                          <span className="font-medium">{selectedProfile.income}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Family Details */}
                <Card className="shadow-md">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-6 pb-2 border-b">Family Details</h2>
                    <div className="space-y-4">
                      {selectedProfile?.familyType && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Family Type</span>
                          <span className="font-medium">{selectedProfile.familyType}</span>
                        </div>
                      )}
                      {selectedProfile?.familyStatus && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Family Status</span>
                          <span className="font-medium">{selectedProfile.familyStatus}</span>
                        </div>
                      )}
                      {selectedProfile?.fatherOccupation && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Father's Occupation</span>
                          <span className="font-medium">{selectedProfile.fatherOccupation}</span>
                        </div>
                      )}
                      {selectedProfile?.motherOccupation && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Mother's Occupation</span>
                          <span className="font-medium">{selectedProfile.motherOccupation}</span>
                        </div>
                      )}
                      {selectedProfile?.siblings && (
                        <div className="flex items-center justify-between py-2">
                          <span className="text-muted-foreground font-medium">Siblings</span>
                          <span className="font-medium">{selectedProfile.siblings}</span>
                        </div>
                      )}
                    </div>
                    {selectedProfile?.aboutFamily && (
                      <div className="mt-6 pt-4 border-t">
                        <span className="text-muted-foreground font-medium block mb-2">About Family</span>
                        <p className="text-sm leading-relaxed">{selectedProfile.aboutFamily}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* About Section */}
                {selectedProfile?.bio && (
                  <Card className="shadow-md">
                    <CardContent className="p-6">
                      <h2 className="text-xl font-semibold mb-6 pb-2 border-b">About</h2>
                      <p className="text-sm leading-relaxed">{selectedProfile.bio}</p>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Sticky Back Button */}
              <div className="sticky bottom-6   flex justify-center mt-8">
                <DialogClose asChild>
                  <Button 
                    variant="default"
                    size="lg"
                    className="shadow-lg flex items-center gap-2 px-6"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Back
                  </Button>
                </DialogClose>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 