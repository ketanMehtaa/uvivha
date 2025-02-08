'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Messages from '@/components/chat/Messages';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import type { User } from '@prisma/client';

interface ChatPageProps {
  params: {
    userId: string;
  };
}

const MessageSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex justify-start">
        <div className="max-w-[70%] rounded-lg p-3 bg-muted">
          <Skeleton className="h-4 w-48 mb-2" />
          <Skeleton className="h-3 w-24" />
        </div>
      </div>
    ))}
  </div>
);

export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const [otherUser, setOtherUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // First check localStorage for current user
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        } else {
          // Fetch current user if not in localStorage
          const currentUserRes = await fetch('/api/user/me');
          const currentUserData = await currentUserRes.json();
          setCurrentUser(currentUserData.user);
          localStorage.setItem('user', JSON.stringify(currentUserData.user));
        }

        // Fetch other user
        const otherUserRes = await fetch(`/api/profiles/${params.userId}`);
        const otherUserData = await otherUserRes.json();
        setOtherUser(otherUserData.profile);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [params.userId]);

  if (!currentUser) {
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
        {loading ? (
          <Card className="flex flex-col h-[600px]">
            <div className="p-4 border-b">
              <Skeleton className="h-6 w-32" />
            </div>
            <div className="flex-grow p-4">
              <MessageSkeleton />
            </div>
            <div className="p-4 border-t flex gap-2">
              <Skeleton className="h-10 flex-grow" />
              <Skeleton className="h-10 w-20" />
            </div>
          </Card>
        ) : otherUser ? (
          <Messages
            currentUserId={currentUser.id}
            otherUserId={otherUser.id}
            otherUserName={otherUser.name}
          />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            User not found
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}