// Only handle push notifications and cache clearing
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      // Clean up old caches on activation
      caches.keys().then(keys => 
        Promise.all(
          keys.map(key => caches.delete(key))
        )
      )
    ])
  );
});

// Message types enum for better type safety
const MessageTypes = {
  CLEAR_ALL_CACHES: 'CLEAR_ALL_CACHES',
  CLEAR_STORAGE: 'CLEAR_STORAGE',
  CLEAR_COMPLETE: 'CLEAR_COMPLETE'
};

// Function to unsubscribe from push notifications
async function unsubscribeFromPush() {
  try {
    const subscription = await self.registration.pushManager.getSubscription();
    if (!subscription) {
      return { success: true, message: 'No subscription found' };
    }

    // Call the unsubscribe API first
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
    
    // Then unsubscribe from push manager
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

// Function to clear all PWA caches and storage
async function clearPWACache() {
  const results = {
    clientStorage: { success: false, error: null },
    caches: { success: false, error: null },
    indexedDB: { success: false, error: null },
    pushNotifications: { success: false, error: null },
    timestamp: Date.now()
  };

  try {
    // 1. Clear client storage first
    try {
      const clients = await self.clients.matchAll();
      await Promise.all(
        clients.map(client => 
          client.postMessage({
            type: MessageTypes.CLEAR_STORAGE,
            timestamp: Date.now()
          })
        )
      );
      results.clientStorage.success = true;
    } catch (error) {
      results.clientStorage.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // 2. Clear all caches
    try {
      const cacheKeys = await caches.keys();
      await Promise.all(cacheKeys.map(key => caches.delete(key)));
      results.caches.success = true;
    } catch (error) {
      results.caches.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // 3. Clear IndexedDB
    try {
      if (self.indexedDB) {
        const databases = await self.indexedDB.databases();
        await Promise.all(
          databases.map(db => self.indexedDB.deleteDatabase(db.name))
        );
        results.indexedDB.success = true;
      }
    } catch (error) {
      results.indexedDB.error = error instanceof Error ? error.message : 'Unknown error';
    }

    // 4. Unsubscribe from push notifications last
    try {
      const unsubResult = await unsubscribeFromPush();
      results.pushNotifications = unsubResult;
    } catch (error) {
      results.pushNotifications.error = error instanceof Error ? error.message : 'Unknown error';
    }

    return {
      success: Object.values(results).every(r => r.success !== false),
      results,
      timestamp: Date.now()
    };
  } catch (error) {
    console.error('Fatal error in clearPWACache:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      results,
      timestamp: Date.now()
    };
  }
}

// Listen for messages from clients
self.addEventListener('message', async (event) => {
  if (!event.data || typeof event.data !== 'string') {
    return;
  }

  if (event.data === MessageTypes.CLEAR_ALL_CACHES) {
    const result = await clearPWACache();
    
    // Only send response if we have a client to respond to
    if (event.source) {
      event.source.postMessage({
        type: MessageTypes.CLEAR_COMPLETE,
        ...result
      });
    }
  }
});

// Push notification handling
self.addEventListener('push', (event) => {
  if (!event.data) {
    return;
  }

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
      actions: [
        { 
          action: 'view', 
          title: 'View Message'
        }
      ],
      tag: data.tag || 'default', // For notification grouping
      renotify: true // Always notify even if using same tag
    };

    event.waitUntil(
      self.registration.showNotification(
        data.title || 'New Message',
        options
      )
    );
  } catch (error) {
    console.error('Error showing notification:', error);
    // Fallback to simpler notification if JSON parsing fails
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

  // Determine the URL to open based on notification data
  const urlToOpen = event.notification.data?.type === 'message'
    ? `/messages/${event.notification.data.fromId}`
    : '/dashboard';

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    })
    .then(clientList => {
      // Try to focus an existing window first
      const matchingClient = clientList.find(client => 
        client.url.includes(urlToOpen) && 'focus' in client
      );

      if (matchingClient) {
        return matchingClient.focus();
      }
      
      // If no existing window, open a new one
      return clients.openWindow(urlToOpen);
    })
    .catch(error => {
      console.error('Error handling notification click:', error);
      // Fallback to opening dashboard on error
      return clients.openWindow('/dashboard');
    })
  );
}); 