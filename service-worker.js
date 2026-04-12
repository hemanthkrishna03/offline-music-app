const CACHE_NAME = "music-v301"; // change version every update

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json"
];

// INSTALL → cache basic files
self.addEventListener("install", event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(FILES_TO_CACHE);
    })
  );
});

// ACTIVATE → clean old cache
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// FETCH → smart caching (IMPORTANT)
self.addEventListener("fetch", event => {
  const req = event.request;

  // 🎵 Handle MP3 separately
  if (req.url.endsWith(".mp3")) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(req).then(res => {
          return (
            res ||
            fetch(req).then(networkRes => {
              cache.put(req, networkRes.clone());
              return networkRes;
            })
          );
        })
      )
    );
    return;
  }

  // 🌐 Default behavior
  event.respondWith(
    fetch(req).catch(() => caches.match(req))
  );
});
