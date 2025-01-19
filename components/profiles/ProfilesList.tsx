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
  AlertCircle 
} from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  gender?: string;
  birthDate?: string;
  location?: string;
  education?: string;
  occupation?: string;
  photos?: string[];
}

interface ProfilesListProps {
  profiles: Profile[];
}

export default function ProfilesList({ profiles }: ProfilesListProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('Profiles received:', profiles?.length);
  }, [profiles]);

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
      <div className="text-center py-8">
        <p className="text-muted-foreground">No matching profiles found.</p>
        <p className="text-sm text-muted-foreground mt-2">
          Try adjusting your preferences or check back later.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {profiles.map((profile) => (
        <Card key={profile.id} className="overflow-hidden">
          <div className="aspect-[4/3] relative">
            <Image
              src={profile.photos?.[0] || '/placeholder-avatar.jpg'}
              alt={profile.name}
              fill
              className="object-cover"
            />
          </div>
          <CardContent className="p-4">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{profile.name}</h3>
                {profile.location && (
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{profile.location}</span>
                  </div>
                )}
              </div>
              {profile.birthDate && (
                <Badge variant="secondary">
                  {profile.gender}, {calculateAge(profile.birthDate)} yrs
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
              {profile.education && (
                <div className="flex items-center gap-1">
                  <GraduationCap className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.education}</span>
                </div>
              )}
              {profile.occupation && (
                <div className="flex items-center gap-1">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <span>{profile.occupation}</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={() => handleViewProfile(profile.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View Profile
              </Button>
              <Button variant="outline" size="sm" className="w-full">
                <Heart className="h-4 w-4 mr-2" />
                Interest
              </Button>
              <Button size="sm" className="w-full">
                <Mail className="h-4 w-4 mr-2" />
                Message
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 