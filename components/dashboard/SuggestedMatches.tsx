'use client';

import { useEffect, useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Heart, Star, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProfilesList from '@/components/profiles/ProfilesList';
import { FilterValues } from '@/components/dashboard/Filters';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel';
import { Skeleton } from '../ui/skeleton';

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

interface PaginationData {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

interface SuggestedMatchesProps {
  filters: FilterValues;
}

const ProfileCardSkeleton = () => {
  return (
    <Card className="overflow-hidden">
      <div className="relative aspect-[4/3]">
        <Skeleton className="w-full h-full" />
      </div>
      <CardContent className="p-4 space-y-3">
        <Skeleton className="h-6 w-2/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-3/4" />
        </div>
        <Skeleton className="h-9 w-full mt-4" />
      </CardContent>
    </Card>
  );
};

export default function SuggestedMatches({ filters }: SuggestedMatchesProps) {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });

  const fetchProfiles = useCallback(
    async (page: number = 1) => {
      try {
        setLoading(true);
        console.log('Fetching profiles for page:', page);
        const res = await fetch('/api/matches', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            ...filters,
            page: page,
            limit: pagination.pageSize
          })
        });
        const data = await res.json();

        if (!res.ok) {
          console.error('API error:', data.error);
          setError(data.error || 'Failed to load profiles');
          return;
        }

        console.log('Received profiles:', data.profiles?.length);
        console.log('Pagination:', data.pagination);

        setProfiles(data.profiles);
        setPagination(data.pagination);
      } catch (error) {
        console.error('Error fetching profiles:', error);
        setError('Failed to load profiles');
      } finally {
        setLoading(false);
      }
    },
    [filters, pagination.pageSize]
  );

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchProfiles(newPage);
    }
  };

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
                <>
                  <div className="w-full px-4">
                    <Carousel
                      opts={{
                        align: 'start',
                        loop: false
                      }}
                      className="w-full"
                    >
                      <CarouselContent className="-ml-2 md:-ml-4">
                        {[1, 2, 3, 4, 5].map((index) => (
                          <CarouselItem
                            key={index}
                            className="pl-2 md:pl-4 basis-full sm:basis-1/2 md:basis-1/3"
                          >
                            <ProfileCardSkeleton />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  </div>

                  {/* Pagination Skeleton */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm">
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-9 w-24" />
                      <Skeleton className="h-9 w-24" />
                    </div>
                  </div>
                </>
              ) : error ? (
                <div className="text-center py-8 text-destructive">{error}</div>
              ) : (
                <>
                  <ProfilesList profiles={profiles} />

                  {/* Pagination Controls */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t">
                    <div className="text-sm text-muted-foreground">
                      Page {pagination.page} of {pagination.totalPages}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page - 1)}
                        disabled={pagination.page <= 1 || loading}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(pagination.page + 1)}
                        disabled={
                          pagination.page >= pagination.totalPages || loading
                        }
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </>
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
              <p className="text-muted-foreground">
                No profiles shortlisted yet.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Use the search feature to find specific profiles.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
