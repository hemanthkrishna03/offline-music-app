const songs = [
  { title: "Amma Song", file: "songs/amma_song.mp3" },
  { title: "Aigiri Song", file: "songs/aigiri_song.mp3" },
  { title: "Prema Deshapu Yuvarani", file: "songs/prema_deshapu_yuvarani.mp3" },
  { title: "Kandhon Se Milte", file: "songs/kandhon_se_milte.mp3" },
  { title: "O Sainika", file: "songs/sainika.mp3" },
  { title: "Sarileru Neekevaru", file: "songs/sarileru_neekevaru.mp3" },
  { title: "Desh Pehle", file: "songs/desh_pehle.mp3" },
  { title: "Maan Bharyaa", file: "songs/mann_bharryaa_shershaah.mp3" },
  { title: "Jawan", file: "songs/intike_okkadu_kavale.mp3" },
  { title: "Heer Aasmani", file: "songs/heer_aasmani_fighter.mp3" },
  { title: "Le Teri Mitti", file: "songs/mitti_fighter.mp3" },
  { title: "Terapai Prakasham", file: "songs/beast_mode.mp3" },
  { title: "Jana Gana Mana", file: "songs/jana_gana_mana_major.mp3" },
  { title: "Tiranga", file: "songs/tiranga_yodha.mp3" },
  { title: "Vande Mataram", file: "songs/vande_mataram.mp3" }
];

const audio = document.getElementById("audio");
const playlist = document.getElementById("playlist");

/* ===========================
   IndexedDB Helper Functions
=========================== */

async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("music-db", 1);

    request.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("songs")) {
        db.createObjectStore("songs");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("IndexedDB error");
  });
}

async function saveSongToDB(url, blob) {
  const db = await openDB();
  const tx = db.transaction("songs", "readwrite");
  tx.objectStore("songs").put(blob, url);

  await new Promise(resolve => (tx.oncomplete = resolve));
}

async function getSongFromDB(url) {
  const db = await openDB();
  return new Promise(resolve => {
    const req = db.transaction("songs").objectStore("songs").get(url);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => resolve(null);
  });
}

/* ===========================
   Playlist Rendering
=========================== */

songs.forEach(song => {
  const li = document.createElement("li");
  li.textContent = song.title;

  li.addEventListener("click", async () => {
    let blob = await getSongFromDB(song.file);

    if (!blob) {
      const response = await fetch(song.file);
      blob = await response.blob();
      await saveSongToDB(song.file, blob);
    }

    // Clean previous blob URL (important for mobile)
    if (audio.src && audio.src.startsWith("blob:")) {
      URL.revokeObjectURL(audio.src);
    }

    audio.src = URL.createObjectURL(blob);
    audio.play();
  });

  playlist.appendChild(li);
});
