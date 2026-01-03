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

songs.forEach(song => {
  const li = document.createElement("li");
  li.textContent = song.title;

  li.addEventListener("click", () => {
    audio.src = song.file;
    audio.load();   // 🔑 VERY IMPORTANT
    audio.play().catch(err => console.log(err));
  });

  playlist.appendChild(li);
});

async function saveSongToDB(url, blob) {
  const db = await new Promise((resolve, reject) => {
    const req = indexedDB.open("music-db", 1);
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore("songs");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject();
  });

  const tx = db.transaction("songs", "readwrite");
  tx.objectStore("songs").put(blob, url);
}

async function getSongFromDB(url) {
  const db = await new Promise((resolve, reject) => {
    const req = indexedDB.open("music-db", 1);
    req.onupgradeneeded = e => {
      e.target.result.createObjectStore("songs");
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject();
  });

  return new Promise(resolve => {
    const req = db.transaction("songs").objectStore("songs").get(url);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(null);
  });
}







