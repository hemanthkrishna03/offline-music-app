const CACHE_NAME = "music-pwa-v11";

self.addEventListener("install", event => {
  self.skipWaiting();
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => caches.delete(key)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", event => {
  const request = event.request;

  // Only handle audio files
  if (request.url.endsWith(".mp3")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(request).then(response => {
          if (response) {
            return response; // offline play
          }
          return fetch(request).then(networkResponse => {
            cache.put(request, networkResponse.clone()); // cache on play
            return networkResponse;
          });
        })
      )
    );
    return;
  }

  // Default behavior for other files
  event.respondWith(
    caches.match(request).then(response => response || fetch(request))
  );
});
