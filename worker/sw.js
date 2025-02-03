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
  event.waitUntil(
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
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // Only check auth for root path
          if (new URL(event.request.url).pathname === '/') {
            // First try to check authentication
            const authCheck = await fetch('/api/auth/check', {
              credentials: 'include'
            });
            
            const authData = await authCheck.json();

            // If user is authenticated and at root path, redirect to dashboard
            if (authData.authenticated) {
              return Response.redirect('/dashboard', 302);
            }
          }

          // For other cases, try network first
          try {
            const networkResponse = await fetch(event.request);
            return networkResponse;
          } catch (error) {
            console.log('Navigation fetch failed:', error);
            
            // If network fails, try cache
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(event.request);
            
            if (cachedResponse) {
              return cachedResponse;
            }
            
            // If cache fails, return offline page
            return cache.match('/offline.html');
          }
        } catch (error) {
          console.error('Auth check failed:', error);
          // If auth check fails, proceed with normal navigation
          return fetch(event.request);
        }
      })()
    );
    return;
  }

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