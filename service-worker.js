const CACHE_NAME = "music-pwa-v500";

// Install → cache basic files
self.addEventListener("install", event => {
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  event.waitUntil(self.clients.claim());
});

// Fetch handler (VERY IMPORTANT)
self.addEventListener("fetch", event => {
  const req = event.request;

  // 🎵 Handle MP3 files (offline support)
  if (req.url.endsWith(".mp3")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(req).then(res => {
          if (res) return res;

          return fetch(req).then(networkRes => {
            cache.put(req, networkRes.clone());
            return networkRes;
          });
        })
      )
    );
    return;
  }

  // 🌐 Default (HTML/CSS/JS)
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
