'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { UTM_COOKIE_MAX_AGE } from '@/lib/utm';

export default function UtmTracker() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const utmSource = searchParams.get('utmSource');
    if (utmSource) {
      document.cookie = `utmSource=${utmSource}; path=/; max-age=${UTM_COOKIE_MAX_AGE}`;
    }
  }, [searchParams]);

  return null;
} 