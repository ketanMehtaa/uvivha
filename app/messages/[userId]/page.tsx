'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Messages from '@/components/chat/Messages';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";

interface ChatPageProps {
  params: {
    userId: string;
  };
}

const LoadingSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-12 w-full" />
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-3/4" />
      ))}
    </div>
  </div>
);

export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        
        // Fetch current user
        const currentUserRes = await fetch('/api/user/me');
        const currentUserData = await currentUserRes.json();

        // Fetch other user
        const otherUserRes = await fetch(`/api/profiles/${params.userId}`);
        const otherUserData = await otherUserRes.json();

        setCurrentUser(currentUserData.user);
        setOtherUser(otherUserData.profile);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [params.userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container py-8">
          <Button 
            variant="ghost" 
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <LoadingSkeleton />
        </main>
        <Footer />
      </div>
    );
  }

  if (!currentUser || !otherUser) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container flex items-center justify-center py-8">
          <div className="text-center">
            <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-grow container py-8">
        <Button 
          variant="ghost" 
          onClick={() => router.back()}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Messages
          currentUserId={currentUser.id}
          otherUserId={otherUser.id}
          otherUserName={otherUser.name}
        />
      </main>

      <Footer />
    </div>
  );
}