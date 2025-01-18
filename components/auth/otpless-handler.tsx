'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface OTPlessResponse {
  token: string;
  status: string;
  userId: string;
  timestamp: string;
  identities: Array<{
    identityType: string;
    identityValue: string;
    verified: boolean;
  }>;
}

declare global {
  interface Window {
    otpless: any;
  }
}

export function OtplessHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleOtplessResponse = async (response: OTPlessResponse) => {
      try {
        console.log('1. OTPless response received:', response);

        if (response.status !== 'SUCCESS' || !response.identities?.[0]?.identityValue) {
          throw new Error('Authentication failed');
        }

        // Extract mobile number without country code
        const mobileWithCountryCode = response.identities[0].identityValue;
        const mobile = mobileWithCountryCode.slice(-10);
        console.log('2. Extracted mobile:', mobile);

        const res = await fetch('/api/auth', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: 'New User',
            mobile,
            timestamp: response.timestamp,
            userId: response.userId,
          }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Authentication failed');
        }

        const data = await res.json();
        console.log('3. Auth API response:', data);

        if (data.success) {
          console.log('4. Authentication successful, redirecting...');
          router.push('/dashboard');
        } else {
          throw new Error('Invalid response from server');
        }
      } catch (error) {
        console.error('Auth error:', error);
        alert(error instanceof Error ? error.message : 'Authentication failed');
      }
    };

    window.otpless = handleOtplessResponse;

    return () => {
      window.otpless = null;
    };
  }, [router]);

  return null;
} 