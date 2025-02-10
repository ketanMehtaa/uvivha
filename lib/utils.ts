import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function clearCache() {
  // First try to use service worker
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage('CLEAR_ALL_CACHES');
  }
  
  // Always clear local storage and session storage as a fallback
  localStorage.clear();
  sessionStorage.clear();
  
  // Clear all cookies
  document.cookie.split(';').forEach(cookie => {
    document.cookie = cookie
      .replace(/^ +/, '')
      .replace(/=.*/, `=;expires=${new Date(0).toUTCString()};path=/`);
  });
  
  // Force reload without cache if needed
  // if (typeof window !== 'undefined') {
  //   window.location.reload();
  // }
}
