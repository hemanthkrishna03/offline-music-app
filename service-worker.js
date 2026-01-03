const CACHE_NAME = "music-pwa-v10"; // NEW version (important)

const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./manifest.json",

  "./songs/aigiri_song.mp3",
  "./songs/amma_song.mp3",
  "./songs/beast_mode.mp3",
  "./songs/desh_pehle.mp3",
  "./songs/heer_aasmani_fighter.mp3",
  "./songs/intike_okkadu_kavale.mp3",
  "./songs/jana_gana_mana_major.mp3",
  "./songs/kandhon_se_milte.mp3",
  "./songs/mann_bharryaa_shershaah.mp3",
  "./songs/mitti_fighter.mp3",
  "./songs/prema_deshapu_yuvarani.mp3",
  "./songs/sainika.mp3",
  "./songs/sarileru_neekevaru.mp3",
  "./songs/tiranga_yodha.mp3",
  "./songs/vande_mataram.mp3"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log("Caching all files");
      return cache.addAll(FILES_TO_CACHE);
    })
  );
  self.skipWaiting(); // 🔑 force activate
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim(); // 🔑 take control immediately
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
