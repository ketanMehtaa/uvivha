'use client';

import { Suspense, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { UTM_COOKIE_NAME, UTM_COOKIE_MAX_AGE } from '@/lib/utm';

function UtmTrackerContent() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const utmSource = searchParams.get('utmSource');
    if (utmSource) {
      const cookieValue = `${UTM_COOKIE_NAME}=${encodeURIComponent(utmSource)}; path=/; max-age=${UTM_COOKIE_MAX_AGE}`;
      
      if (process.env.NODE_ENV === 'production') {
        document.cookie = `${cookieValue}; domain=.hamy.in; secure; samesite=lax`;
      } else {
        document.cookie = `${cookieValue}; samesite=lax`;
      }
    }
  }, [searchParams]);

  return null;
}

export default function UtmTracker() {
  return (
    <Suspense fallback={null}>
      <UtmTrackerContent />
    </Suspense>
  );
}