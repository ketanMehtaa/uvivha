'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { handleUnauthorized, handleLogout } from '@/lib/auth';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Filters from '@/components/dashboard/Filters';
import SuggestedMatches from '@/components/dashboard/SuggestedMatches';
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserRound } from 'lucide-react';

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
  occupation?: string;
  income?: string;
  maritalStatus?: string;
  caste?: string;
  subcaste?: string;
  photos?: string[];
  isProfileComplete?: boolean;
  complexion?: string;
  physicalStatus?: string;
  familyType?: string;
  familyStatus?: string;
  employedIn?: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
       
        const userRes = await fetch('/api/user/me');
        const userData = await userRes.json();

        if (userData.error) {
          if (handleUnauthorized(userData.error, router)) return;
          setError(userData.error);
          return;
        }

        if (userData.user) {
          setUser(userData.user);
        } else {
          handleLogout(router);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        handleLogout(router);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-xl font-semibold animate-pulse">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{error}</p>
            <Button 
              onClick={() => handleLogout(router)}
              variant="destructive"
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">Please log in to access your dashboard.</p>
            <Button 
              onClick={() => handleLogout(router)}
              className="w-full"
            >
              Go to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Calculate profile completion percentage
  const requiredFields: (keyof UserProfile)[] = [
    'name', 'mobile', 'email', 'gender', 'birthDate', 'location',
    'bio', 'height', 'education', 'occupation', 'income',
    'maritalStatus', 'caste'
  ];
  
  const completedFields = requiredFields.filter(field => user[field] !== null && user[field] !== undefined);
  const completionPercentage = Math.round((completedFields.length / requiredFields.length) * 100);
  const isProfileComplete = user.isProfileComplete;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container py-6">
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold">
                    Welcome back, {user.name}! 👋
                  </h1>
                  <p className="text-muted-foreground">
                    Here&apos;s what&apos;s happening with your profile
                  </p>
                </div>
                <Button asChild>
                  <Link href="/profile/edit">
                    <UserRound className="mr-2 h-4 w-4" />
                    Edit Profile
                  </Link>
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Profile Completion</span>
                  <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
                </div>
                <Progress value={completionPercentage} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {!isProfileComplete ? (
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="text-lg font-semibold">Complete Your Profile</h2>
                    <p className="text-muted-foreground">
                      Your profile is {completionPercentage}% complete. Complete your profile to increase your chances of finding the perfect match!
                    </p>
                  </div>
                  <Button asChild>
                    <Link href="/profile/edit">Complete Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                {/* <Filters onFilterChange={(filters) => {
                  // Filter changes will be handled by the Filters component
                  console.log('Filters updated:', filters);
                }} /> */}
              </div>
              
              <div className="md:col-span-3">
                <SuggestedMatches />
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
} 