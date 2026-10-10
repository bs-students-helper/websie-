// BSH (BS Students Helper) Service Worker
const CACHE_NAME = 'bsh-portal-v3';
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
    '/assets/icons/icon-192x192.webp',
    '/assets/icons/icon-512x512.webp',
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

// Activate Event - Clean up outdated caches immediately
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

// Fetch Event
self.addEventListener('fetch', (event) => {
    // Only handle GET requests
    if (event.request.method !== 'GET') return;

    // Ignore cross-origin requests like CDN scripts or analytics
    if (!event.request.url.startsWith(self.location.origin)) return;

    // 1. HTML Page Navigation - Network first, fallback to cache (prevents routing ERR_FAILED)
    if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        const responseClone = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                    }
                    return networkResponse;
                })
                .catch(async () => {
                    const cachedResponse = await caches.match(event.request);
                    if (cachedResponse) return cachedResponse;
                    const fallback = await caches.match('/index.html');
                    return fallback || fetch(event.request);
                })
        );
        return;
    }

    // 2. Static Assets (CSS, JS, Fonts, Images) - Cache first, background revalidate
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Background update
                fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200) {
                        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, networkResponse));
                    }
                }).catch(() => {});
                return cachedResponse;
            }

            return fetch(event.request).then((networkResponse) => {
                if (networkResponse && networkResponse.status === 200) {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
                }
                return networkResponse;
            });
        })
    );
});
