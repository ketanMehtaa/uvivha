import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Types and Interfaces
export type MessageType = typeof MessageTypes[keyof typeof MessageTypes];

interface ClearResult {
  success: boolean;
  error?: string;
  message?: string;
}

interface PWAStatus {
  isInstalled: boolean;
  canInstall: boolean;
  version?: string;
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<{ outcome: 'accepted' | 'dismissed' }>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

// Constants
export const MessageTypes = {
  CLEAR_ALL_CACHES: 'CLEAR_ALL_CACHES',
  CLEAR_STORAGE: 'CLEAR_STORAGE',
  CLEAR_COMPLETE: 'CLEAR_COMPLETE',
  VERSION_CHECK: 'VERSION_CHECK'
} as const;

const CACHE_TIMEOUT = 5000;
const VERSION_CHECK_TIMEOUT = 3000;

// Utility functions
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// PWA state
let deferredPrompt: BeforeInstallPromptEvent | null = null;

// Event listeners
if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e as BeforeInstallPromptEvent;
  });
}

// Service Worker helpers
async function checkServiceWorker(): Promise<ServiceWorkerContainer | null> {
  return 'serviceWorker' in navigator ? navigator.serviceWorker : null;
}

async function getActiveController(): Promise<ServiceWorker | null> {
  const sw = await checkServiceWorker();
  return sw?.controller ?? null;
}

// PWA functions
export async function getPWAStatus(): Promise<PWAStatus> {
  const status: PWAStatus = {
    isInstalled: false,
    canInstall: false
  };

  if (typeof window === 'undefined') return status;

  status.isInstalled = window.matchMedia('(display-mode: standalone)').matches;
  status.canInstall = !!deferredPrompt;

  const controller = await getActiveController();
  if (controller) {
    try {
      const versionPromise = new Promise<string>((resolve) => {
        const handler = (event: MessageEvent) => {
          if (event.data?.type === 'VERSION') {
            navigator.serviceWorker.removeEventListener('message', handler);
            resolve(event.data.version);
          }
        };
        navigator.serviceWorker.addEventListener('message', handler);
        controller.postMessage(MessageTypes.VERSION_CHECK);
      });

      status.version = await Promise.race([
        versionPromise,
        new Promise<string>((_, reject) => 
          setTimeout(() => reject(new Error('Version check timed out')), VERSION_CHECK_TIMEOUT)
        )
      ]);
    } catch (error) {
      console.warn('Failed to get PWA version:', error);
    }
  }

  return status;
}

export async function installPWA(): Promise<boolean> {
  if (!deferredPrompt) return false;

  try {
    const result = await deferredPrompt.prompt();
    deferredPrompt = null;
    return result.outcome === 'accepted';
  } catch (error) {
    console.error('PWA installation error:', error);
    return false;
  }
}

export async function unsubscribeFromPush(): Promise<ClearResult> {
  const sw = await checkServiceWorker();
  if (!sw) {
    return { 
      success: false, 
      error: 'Service Worker not supported' 
    };
  }

  try {
    const registration = await sw.ready;
    const subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      return { 
        success: true, 
        message: 'No subscription found' 
      };
    }
    
    const response = await fetch('/api/push/unsubscribe', {
      method: 'POST',
      headers: { 
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Server unsubscribe failed: ${response.status}`);
    }
    
    const unsubscribed = await subscription.unsubscribe();
    if (!unsubscribed) {
      throw new Error('Push manager unsubscribe failed');
    }

    return { success: true };
  } catch (error) {
    console.error('Push unsubscription error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function clearCache(): Promise<ClearResult> {
  const errors: string[] = [];
  
  try {
    const sw = await checkServiceWorker();
    const controller = await getActiveController();

    // 1. Unsubscribe from push notifications first
    const unsubResult = await unsubscribeFromPush();
    if (!unsubResult.success) {
      errors.push(`Push unsubscription: ${unsubResult.error}`);
    }

    // 2. Clear service worker caches
    if (controller && sw) {
      try {
        const clearComplete = new Promise<ClearResult>((resolve, reject) => {
          const cleanup = (handler: (event: MessageEvent) => void) => {
            clearTimeout(timeoutId);
            sw.removeEventListener('message', handler);
          };

          const messageHandler = (event: MessageEvent) => {
            if (event.data?.type === MessageTypes.CLEAR_COMPLETE) {
              cleanup(messageHandler);
              if (!event.data.success) {
                reject(new Error(event.data.error || 'Cache clearing failed'));
              } else {
                resolve({ success: true });
              }
            }
          };

          const timeoutId = setTimeout(() => {
            cleanup(messageHandler);
            reject(new Error('Cache clearing timed out'));
          }, CACHE_TIMEOUT);

          sw.addEventListener('message', messageHandler);
          controller.postMessage(MessageTypes.CLEAR_ALL_CACHES);
        });

        await clearComplete;
      } catch (error) {
        errors.push(`Service worker cache: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    // 3. Clear storages
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (error) {
      errors.push(`Storage: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
    
    // 4. Clear cookies
    try {
      document.cookie.split(';').forEach(cookie => {
        const [name] = cookie.split('=');
        if (name?.trim()) {
          document.cookie = `${name.trim()}=;expires=${new Date(0).toUTCString()};path=/;domain=${window.location.hostname}`;
        }
      });
    } catch (error) {
      errors.push(`Cookies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // 5. Unregister service workers
    if (sw) {
      try {
        const registrations = await sw.getRegistrations();
        await Promise.all(registrations.map(reg => reg.unregister()));
      } catch (error) {
        errors.push(`Service worker unregister: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    return { 
      success: errors.length === 0,
      error: errors.length > 0 ? errors.join('; ') : undefined
    };
  } catch (error) {
    console.error('Fatal error in clearCache:', error);
    return { 
      success: false, 
      error: `Fatal error: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
}
