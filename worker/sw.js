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

          // Check auth for both root and start_url
          if (url.pathname === '/' || url.pathname === '.') {
            console.log('PWA - Checking auth for navigation');
            
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

              if (authData.authenticated) {
                console.log('PWA - User authenticated, redirecting to dashboard');
                return Response.redirect('/dashboard', 302);
              } else {
                console.log('PWA - User not authenticated, staying at root');
              }
            } catch (authError) {
              console.error('PWA - Auth check failed:', authError);
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