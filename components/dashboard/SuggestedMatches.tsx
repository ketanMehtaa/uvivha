'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Star, Search } from 'lucide-react';
import ProfilesList from '@/components/profiles/ProfilesList';

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

export default function SuggestedMatches() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        console.log('Fetching profiles...');
        const res = await fetch('/api/profiles');
        const data = await res.json();
        console.log('API Response:', data);

        if (!res.ok) {
          setError(data.error);
          return;
        }

        setProfiles(data.profiles || []);
        console.log('Profiles set:', data.profiles?.length);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setError('Failed to load profiles');
      } finally {
        setLoading(false);
      }
    };

    fetchProfiles();
  }, []);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="matches">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="matches" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            Matches
          </TabsTrigger>
          <TabsTrigger value="shortlisted" className="flex items-center gap-2">
            <Star className="h-4 w-4" />
            Shortlisted
          </TabsTrigger>
          <TabsTrigger value="search" className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search Results
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="matches" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Suggested Matches</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground animate-pulse">
                  Loading profiles...
                </div>
              ) : error ? (
                <div className="text-center py-8 text-destructive">
                  {error}
                </div>
              ) : (
                <ProfilesList profiles={profiles} />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="shortlisted">
          <Card>
            <CardHeader>
              <CardTitle>Shortlisted Profiles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No profiles shortlisted yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Use filters to search profiles.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 