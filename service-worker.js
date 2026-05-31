const CACHE_NAME = "music-pwa-v602";

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json"
];

// Install → cache core files
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Fetch handler
self.addEventListener("fetch", event => {
  const req = event.request;

  // 🎵 Handle MP3 files
  if (req.url.endsWith(".mp3")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(req).then(res => {
          if (res) return res;

          return fetch(req).then(networkRes => {
            fetch(event.request).then(networkResponse => {
                if (networkResponse.ok && networkResponse.status === 200) {
                    cache.put(event.request, networkResponse.clone());
                }
                return networkResponse;
            });
            return networkRes;
          });
        })
      )
    );
    return;
  }

  // 🌐 Handle app files
  event.respondWith(
    caches.match(req).then(res => {
      return res || fetch(req);
    })
  );
});
