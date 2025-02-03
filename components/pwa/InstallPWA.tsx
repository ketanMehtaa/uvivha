'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

let deferredPrompt: any;

export function InstallPWA() {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if device is iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOS(ios);

    // Check if app is already installed
    const standalone = window.matchMedia('(display-mode: standalone)').matches;
    setIsStandalone(standalone);

    // Show prompt immediately if not installed
    if (!standalone) {
      setShowPrompt(true);
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
        // Keep showing the prompt even after dismissal
        setShowPrompt(true);
      }
      
      deferredPrompt = null;
    }
  };

  // Don't show if already installed
  if (isStandalone) return null;

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install Hamy App</DialogTitle>
          <DialogDescription>
            {isIOS ? (
              <>
                To install Hamy on your iPhone:
                <ol className="mt-2 list-decimal pl-4">
                  <li>Tap the Share button below</li>
                  <li>Scroll down and tap "Add to Home Screen"</li>
                </ol>
              </>
            ) : (
              'Install Hamy for a better experience. You can add it to your home screen for quick access.'
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end space-x-4 mt-4">
          <Button variant="outline" onClick={() => setShowPrompt(false)}>
            Maybe Later
          </Button>
          {!isIOS && (
            <Button onClick={handleInstallClick}>
              Install Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 