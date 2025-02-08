'use client';

import { useEffect, useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ConversationsList from '@/components/chat/ConversationsList';
import { Skeleton } from "@/components/ui/skeleton";

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
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await fetch('/api/user/me');
        const data = await res.json();
        setCurrentUser(data.user);
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentUser();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container py-8">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>
        
        {loading ? (
          <LoadingSkeleton />
        ) : currentUser ? (
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