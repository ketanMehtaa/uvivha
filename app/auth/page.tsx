'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { OtplessHandler } from '@/components/auth/otpless-handler';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    // Clear all caches and storage
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage('CLEAR_ALL_CACHES');
    }

    // Clear local storage and session storage directly
    localStorage.clear();
    sessionStorage.clear();

    // Check if user is already authenticated
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/auth/check', { 
          cache: 'no-store',  // Prevent caching of auth check
          headers: { 'Cache-Control': 'no-cache' }
        });
        const data = await res.json();
        
        if (data.authenticated) {
          router.replace('/dashboard');
          return;
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }

      // Only load OTPless if user is not authenticated
      const script = document.createElement('script');
      script.src = 'https://otpless.com/v4/auth.js';
      script.id = 'otpless-sdk';
      script.type = 'text/javascript';
      script.setAttribute('data-appid', process.env.NEXT_PUBLIC_OTPLESS_APP_ID || '');
      script.setAttribute('data-method', 'sms');
      script.setAttribute('data-platform', 'web');
      document.head.appendChild(script);
    };

    checkAuth();

    return () => {
      const existingScript = document.getElementById('otpless-sdk');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-pink-50 to-red-50 flex items-center justify-center p-4 rounded-lg">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
        {/* <h1 className="text-2xl font-bold text-center mb-6">Welcome to Uttrakhand Matrimony</h1> */}
        <div id="otpless-login-page"></div>
      </div>
      <OtplessHandler />
    </div>
  );
} 