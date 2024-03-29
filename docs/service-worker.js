const cacheName = 'cache-v1';
const precacheResources = ['/passpad', '/passpad/index.html', '/passpad/styles.min.css', '/passpad/scripts.min.js'];

self.addEventListener('install', (event) => {
    event.waitUntil(caches.open(cacheName)
        .then((cache) => cache.addAll(precacheResources)));
});

self.addEventListener('activate', (event) => {
});

self.addEventListener('fetch', (event) => {

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request);
        }),
    );
});
