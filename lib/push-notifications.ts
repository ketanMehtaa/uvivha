const publicVapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY as string;

export async function registerServiceWorker() {
  if (!('serviceWorker' in navigator)) {
    throw new Error('Service Worker not supported');
  }

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    console.log('Service Worker registered:', registration.scope);
    return registration;
  } catch (err) {
    console.error('Service Worker registration failed:', err);
    throw err;
  }
}

export async function subscribeUserToPush() {
  try {
    // Wait for service worker installation
    const registration = await navigator.serviceWorker.ready;
    console.log('Service Worker ready');

    // Get existing subscription or create new one
    let subscription = await registration.pushManager.getSubscription();
    
    if (!subscription) {
      // Create new subscription only if one doesn't exist
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(publicVapidKey)
      });
      console.log('Created new push subscription');
    } else {
      console.log('Using existing push subscription');
    }

    // Send the subscription to server
    const response = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subscription)
    });

    if (!response.ok) {
      throw new Error('Failed to store subscription on server');
    }

    return subscription;
  } catch (err) {
    console.error('Error subscribing to push notifications:', err);
    throw err;
  }
}

// Helper function to convert VAPID key
function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
} 