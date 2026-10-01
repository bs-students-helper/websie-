// BSH (BS Students Helper) Service Worker
const CACHE_NAME = 'bsh-portal-v1';
const STATIC_ASSETS = [
    '/',
    '/index.html',
    '/quiz_practice.html',
    '/quiz_1_practice.html',
    '/quiz_2_practice.html',
    '/end_term_practice.html',
    '/calculator.html',
    '/assets/css/style.css',
    '/assets/css/quiz-portal.css',
    '/assets/js/components.js',
    '/assets/js/main.js',
    '/assets/icons/favicon.ico',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-512x512.png',
    '/site.webmanifest'
];

// Install Event - Pre-cache core static assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(STATIC_ASSETS).catch((err) => {
                console.warn('[BSH SW] Pre-cache warning:', err);
            });
        }).then(() => self.skipWaiting())
    );
});

// Activate Event - Clean up outdated caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        return caches.delete(cache);
                    }
                })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch Event - Stale-While-Revalidate / Network-First Strategy
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    // Ignore cross-origin requests like CDN scripts or analytics
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        fetch(event.request)
            .then((networkResponse) => {
                // If response is valid, update cache asynchronously
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseClone);
                    });
                }
                return networkResponse;
            })
            .catch(() => {
                // Fallback to cached response when offline
                return caches.match(event.request).then((cachedResponse) => {
                    return cachedResponse || caches.match('/index.html');
                });
            })
    );
});
