const CACHE_NAME = 'hamy-cache-v5';

// Add auth-related paths that should never be cached
const NO_CACHE_PATHS = [
  '/login',         // Login page
  '/auth',          // Auth page
  '/api',           // All API routes
  '/profile/edit',  // Profile editing
  '/my-profile',    // User profile
  '/messages',      // Real-time messages
  '/dashboard',     // Dynamic dashboard
  '/_next/data',    // Next.js data requests
];

// Static assets that can be cached
const urlsToCache = [
  '/manifest.json',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/offline.html',
  '/_next/static/'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .catch(error => console.error('Cache installation failed:', error))
  );
});

self.addEventListener('activate', (event) => {
  // Take control immediately and clear old caches
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then(cacheNames => 
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        )
      )
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Never cache auth-related paths or API requests
  if (NO_CACHE_PATHS.some(path => url.pathname.startsWith(path)) || 
      url.pathname.includes('/api/') ||
      event.request.method !== 'GET') {
    event.respondWith(
      fetch(event.request).catch(error => {
        console.error('Fetch error:', error);
        return caches.match('/offline.html');
      })
    );
    return;
  }

  // Network-first strategy for navigation requests
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(event.request);
          return cachedResponse || cache.match('/offline.html');
        })
    );
    return;
  }

  // Cache-first strategy for static assets only
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        return fetch(event.request.clone())
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Only cache static assets
            const isStaticAsset = urlsToCache.some(path => 
              url.pathname.includes(path) || url.pathname === '/'
            );

            if (isStaticAsset) {
              caches.open(CACHE_NAME)
                .then((cache) => cache.put(event.request, response.clone()));
            }

            return response;
          })
          .catch(() => caches.match('/offline.html'));
      })
  );
});

// Function to clear all PWA caches and storage
async function clearPWACache() {
  try {
    // Clear all caches
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys.map(key => caches.delete(key)));

    // Clear IndexedDB databases
    if (self.indexedDB) {
      const databases = await self.indexedDB.databases();
      await Promise.all(databases.map(db => self.indexedDB.deleteDatabase(db.name)));
    }

    // Clear client storage
    const clients = await self.clients.matchAll();
    await Promise.all(
      clients.map(client => 
        client.postMessage({
          type: 'CLEAR_STORAGE',
          timestamp: Date.now()
        })
      )
    );

    // Re-register service worker
    if (self.registration) {
      await self.registration.unregister();
      // Force a reload to ensure clean state
      clients.forEach(client => client.navigate(client.url));
    }

    return true;
  } catch (error) {
    console.error('Error clearing PWA cache:', error);
    return false;
  }
}

// Listen for messages from clients
self.addEventListener('message', async (event) => {
  if (event.data === 'CLEAR_ALL_CACHES') {
    await clearPWACache();
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