// Only handle push notifications and cache clearing
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// Function to clear all PWA caches and storage
async function clearPWACache() {
  const errors = [];

  try {
    // 1. First unsubscribe from push notifications and clear server subscription
    try {
      const subscription = await self.registration.pushManager.getSubscription();
      if (subscription) {
        // Call the unsubscribe API first
        const response = await fetch('/api/push/unsubscribe', {
          method: 'POST',
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        if (!response.ok) {
          throw new Error('Failed to unsubscribe from server');
        }
        
        // Then unsubscribe from push manager
        await subscription.unsubscribe();
      }
    } catch (error) {
      console.error('Push unsubscription error:', error);
      errors.push('Push notification cleanup failed');
    }

    // 2. Clear all caches
    try {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map(key => caches.delete(key)));
    } catch (error) {
      console.error('Cache clearing error:', error);
      errors.push('Cache clearing failed');
    }

    // 3. Clear IndexedDB databases
    try {
      if (self.indexedDB) {
        const databases = await self.indexedDB.databases();
        await Promise.all(databases.map(db => self.indexedDB.deleteDatabase(db.name)));
      }
    } catch (error) {
      console.error('IndexedDB clearing error:', error);
      errors.push('IndexedDB clearing failed');
    }

    // 4. Clear client storage
    try {
      const clients = await self.clients.matchAll();
      await Promise.all(
        clients.map(async (client) => {
          client.postMessage({
            type: 'CLEAR_STORAGE',
            timestamp: Date.now()
          });
        })
      );
    } catch (error) {
      console.error('Client storage clearing error:', error);
      errors.push('Client storage clearing failed');
    }

    // Return result
    return {
      success: errors.length === 0,
      errors: errors.length > 0 ? errors : undefined
    };
  } catch (error) {
    console.error('Fatal error in clearPWACache:', error);
    return {
      success: false,
      errors: ['Fatal error in cache clearing']
    };
  }
}

// Listen for messages from clients
self.addEventListener('message', async (event) => {
  if (event.data === 'CLEAR_ALL_CACHES') {
    const result = await clearPWACache();
    // Notify client about the clearing result
    event.source?.postMessage({
      type: 'CLEAR_COMPLETE',
      success: result.success,
      errors: result.errors,
      timestamp: Date.now()
    });
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/android-chrome-192x192.png',
      badge: '/android-chrome-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1,
        ...data.data
      },
      actions: [{ action: 'view', title: 'View Message' }]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'New Message', options)
    );
  } catch (error) {
    console.error('Error showing notification:', error);
    event.waitUntil(
      self.registration.showNotification('New Message', {
        body: event.data.text(),
        icon: '/android-chrome-192x192.png',
        badge: '/android-chrome-192x192.png'
      })
    );
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const urlToOpen = event.notification.data?.type === 'message'
    ? `/messages/${event.notification.data.fromId}`
    : '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true })
      .then(clientList => {
        const matchingClient = clientList.find(client => 
          client.url === urlToOpen && 'focus' in client
        );

        return matchingClient
          ? matchingClient.focus()
          : clients.openWindow(urlToOpen);
      })
      .catch(error => console.error('Error handling notification click:', error))
  );
}); 