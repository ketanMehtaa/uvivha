const CACHE_NAME = 'hamy-cache-v1';

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
  '/offline.html'
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
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          const url = new URL(event.request.url);
          console.log('PWA Navigation - Path:', url.pathname);

          // If accessing dashboard, check auth
          if (url.pathname === '/dashboard') {
            console.log('PWA - Checking auth for dashboard');
            
            try {
              const authCheck = await fetch('/api/auth/check', {
                credentials: 'include',
                headers: {
                  'Accept': 'application/json',
                  'Cache-Control': 'no-cache'
                }
              });
              
              console.log('PWA - Auth check status:', authCheck.status);
              const authData = await authCheck.json();
              console.log('PWA - Auth data:', authData);

              if (!authData.authenticated) {
                console.log('PWA - User not authenticated, redirecting to root');
                return Response.redirect('/', 302);
              }
            } catch (authError) {
              console.error('PWA - Auth check failed:', authError);
              return Response.redirect('/', 302);
            }
          }

          // For all paths, try network first
          try {
            console.log('PWA - Fetching from network:', url.pathname);
            const networkResponse = await fetch(event.request);
            
            // Cache successful responses
            if (networkResponse.ok) {
              const cache = await caches.open(CACHE_NAME);
              cache.put(event.request, networkResponse.clone());
            }
            
            return networkResponse;
          } catch (error) {
            console.log('PWA - Navigation fetch failed:', error);
            
            // If network fails, try cache
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request);
            
            if (cachedResponse) {
              console.log('PWA - Serving from cache:', url.pathname);
              return cachedResponse;
            }
            
            // If cache fails, return offline page
            console.log('PWA - Serving offline page');
            return cache.match('/offline.html');
          }
        } catch (error) {
          console.error('PWA - Navigation error:', error);
          return fetch(event.request);
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

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
                  .catch(error => {
                    console.error('Cache put failed:', error);
                  });
              })
              .catch(error => {
                console.error('Cache open failed:', error);
              });

            return response;
          })
          .catch(error => {
            console.error('Fetch failed:', error);
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
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification(data.title || 'Uttrakhand Matrimony', options)
    );
  } catch (error) {
    // Fallback for plain text messages
    const options = {
      body: event.data.text(),
      icon: '/android-chrome-192x192.png',
      badge: '/android-chrome-192x192.png',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: 'View Details',
        }
      ]
    };

    event.waitUntil(
      self.registration.showNotification('Uttrakhand Matrimony', options)
    );
  }
});

self.addEventListener('notificationclick', function(event) {
  // Close the notification
  event.notification.close();

  // Get the action (if any) and determine URL
  
  // todo: add the notification id to the url
  const urlToOpen = new URL(
    event.action === 'explore' ? '/dashboard' : '/dashboard',
    self.location.origin
  ).href;

  // This ensures the app opens in the correct tab/window
  event.waitUntil(
    clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    }).then(function(clientList) {
      // If we have a client already open, focus it
      for (const client of clientList) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // If no client is open, open a new one
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    }).catch(function(error) {
      console.error('Error handling notification click:', error);
    })
  );
}); 