'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ConversationsList from '@/components/chat/ConversationsList';
import { Skeleton } from "@/components/ui/skeleton";
import { handleUnauthorized, handleLogout } from '@/lib/auth';
import type { User } from '@prisma/client';

const LoadingSkeleton = () => (
  <div className="space-y-4 p-4">
    <Skeleton className="h-12 w-full" />
    <div className="space-y-2">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  </div>
);

export default function MessagesPage() {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Initialize from localStorage if available
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    }
    return null;
  });
  const router = useRouter();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // First check localStorage
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
          return;
        }

        const res = await fetch('/api/user/me');
        const data = await res.json();

        if (data.error) {
          if (handleUnauthorized(data.error, router)) return;
          return;
        }

        if (data.user) {
          setCurrentUser(data.user);
          // Save to localStorage
          localStorage.setItem('user', JSON.stringify(data.user));
        } else {
          handleLogout(router);
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
        handleLogout(router);
      }
    };

    fetchCurrentUser();
  }, [router]);

  // Add effect to update localStorage when user changes
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('user');
    }
  }, [currentUser]);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        {/* <h1 className="text-2xl font-bold mb-6">Messages</h1> */}
        
        {
        // loading ? (
        //   <LoadingSkeleton />
        // ) : 
        currentUser ? (
          <ConversationsList userId={currentUser.id} />
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Please log in to view your messages
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
} 