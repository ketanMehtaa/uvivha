'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-red-50 flex items-center justify-center">
      <div className="text-xl font-semibold text-gray-700">Redirecting to login...</div>
    </div>
  );
} 