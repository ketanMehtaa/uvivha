const CACHE_NAME = 'hamy-cache-v3';

// Add auth-related paths that should never be cached
const NO_CACHE_PATHS = [
  '/login',
  '/auth',
  '/api/auth',
  '/api/login',
  '/api/logout',
  '/api/profile/share',
  '/shared-profile',
  '/_next/data', // Prevent caching of Next.js data requests
];

const urlsToCache = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/favicon.ico',
  '/android-chrome-192x192.png',
  '/android-chrome-512x512.png',
  '/apple-touch-icon.png',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/offline.html',
  '/_next/static/',
];

self.addEventListener('install', (event) => {
  // Skip waiting to activate the new service worker immediately
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('Cache installation failed:', error);
      })
  );
});

self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(
    Promise.all([
      self.clients.claim(),
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Never cache auth-related paths
  if (NO_CACHE_PATHS.some(path => url.pathname.startsWith(path))) {
    return event.respondWith(fetch(event.request));
  }

  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // For navigation requests, try network first
          const networkResponse = await fetch(event.request);
          return networkResponse;
        } catch (error) {
          console.log('PWA - Navigation fetch failed:', error);
          
          // If network fails, try cache
          const cache = await caches.open(CACHE_NAME);
          const cachedResponse = await cache.match(event.request);
          
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // If cache fails, return offline page
          return cache.match('/offline.html');
        }
      })()
    );
    return;
  }

  // Handle non-navigation requests
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest)
          .then((response) => {
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Don't cache if the path is in NO_CACHE_PATHS
            if (!NO_CACHE_PATHS.some(path => url.pathname.startsWith(path))) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          })
          .catch(() => {
            return caches.match(event.request);
          });
      })
  );
});

self.addEventListener('push', function(event) {
  try {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/android-chrome-192x192.png',
      badge: '/android-chrome-192x192.png',
      vibrate: [100, 50, 100],
      data: data.data || {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'view',
          title: 'View Message',
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'New Message', options)
    );
  } catch (error) {
    console.error('Error showing notification:', error);
    // Fallback for plain text messages
    const options = {
      body: event.data.text(),
      icon: '/android-chrome-192x192.png',
      badge: '/android-chrome-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      }
    };

    event.waitUntil(
      self.registration.showNotification('New Message', options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const notificationData = event.notification.data;
  let urlToOpen;

  if (notificationData?.type === 'message') {
    // Open the specific chat
    urlToOpen = new URL(`/messages/${notificationData.fromId}`, self.location.origin).href;
  } else {
    // Default fallback
    urlToOpen = new URL('/dashboard', self.location.origin).href;
  }

  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }).catch(function(error) {
      console.error('Error handling notification click:', error);
    })
  );
}); 