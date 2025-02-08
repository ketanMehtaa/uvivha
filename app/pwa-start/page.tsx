'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PWAStart() {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });

        if (response.ok) {
          // User is authenticated, redirect to dashboard
          router.replace('/dashboard');
        } else {
          // User is not authenticated, redirect to home
          router.replace('/');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // On error, safely redirect to home
        router.replace('/');
      }
    };

    checkAuth();
  }, [router]);

  // Show loading state while checking
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
    </div>
  );
} 