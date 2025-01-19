'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Mail, 
  Eye,
  MapPin, 
  GraduationCap, 
  Briefcase,
  AlertCircle,
  Users,
  ImageOff
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
}

interface ProfilesListProps {
  profiles: Profile[];
}

export default function ProfilesList({ profiles }: ProfilesListProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    console.log('Profiles received:', profiles?.length);
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

  const handleViewProfile = (profileId: string) => {
    router.push('/profile/' + profileId);
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
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {profiles.map((profile) => (
        <Card key={profile.id} className="overflow-hidden">
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
                onClick={() => router.push(`/profile/${profile.id}`)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Full Profile
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 