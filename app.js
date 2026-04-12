let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;
const songs = [
  { title: "Aigiri Song", file: "songs/aigiri_song.mp3" },
  { title: "Amma Song", file: "songs/amma_song.mp3" },
  { title: "Beast Mode", file: "songs/beast_mode.mp3" },
  { title: "Desh Pehle", file: "songs/desh_pehle.mp3" },
  { title: "Heer Aasmani", file: "songs/heer_aasmani_fighter.mp3" },
  { title: "Jawan", file: "songs/intike_okkadu_kavale.mp3" },
  { title: "Jana Gana Mana", file: "songs/jana_gana_mana_major.mp3" },
  { title: "Kandhon Se Milte", file: "songs/kandhon_se_milte.mp3" },
  { title: "Mann Bharryaa", file: "songs/mann_bharryaa_shershaah.mp3" },
  { title: "Le Teri Mitti", file: "songs/mitti_fighter.mp3" },
  { title: "Prema Deshapu Yuvarani", file: "songs/prema_deshapu_yuvarani.mp3" },
  { title: "O Sainika", file: "songs/sainika.mp3" },
  { title: "Sarileru Neekevaru", file: "songs/sarileru_neekevaru.mp3" },
  { title: "Tiranga", file: "songs/tiranga_yodha.mp3" },
  { title: "Vande Mataram", file: "songs/vande_mataram.mp3" },
  { title: "Edo Oka Ragam", file: "songs/Edo_Oka_Raagam.mp3" },
  { title: "Jaamu Rathiri", file: "songs/jaamu_rathiri.mp3" },
  { title: "Kannula Logililo", file: "songs/kannula_logililo.mp3" },
  { title: "Apuroopamainadamma Aadaj", file: "songs/apuroopamainadamma_aadajanma.mp3" },
  { title: "Emaindo Emo", file: "songs/emaindo_emo.mp3" },
  { title: "Mallela Vana", file: "songs/mallela_vana.mp3" },
  { title: "Pallavinchu Toli", file: "songs/pallavinchu_toli.mp3" },
  { title: "Venky Mama", file: "songs/venky_mama.mp3" },
  { title: "Needhe Needhe", file: "songs/needhe_needhe.mp3" },
  { title: "Enduko Enduko", file: "songs/enduko_enduko.mp3" },
  { title: "Bhaje Bhaje", file: "songs/bhaje_bhaje.mp3" },
  { title: "Soundarya", file: "songs/soundarya.mp3" },
  { title: "Allantha Doorala", file: "songs/allantha_doorala.mp3" },
  { title: "Laxmi Bava", file: "songs/laxmi_bava.mp3" },
  { title: "Ade Pade", file: "songs/ade_pade.mp3" },
  { title: "Pelli Pata (2)", file: "songs/pelli_pata_2.mp3" },
  { title: "Aasa Aasaga", file: "songs/aasa_aasaga.mp3" },
  { title: "Pelli Pata", file: "songs/pelli_pata.mp3" },
  { title: "Doli Doli", file: "songs/doli_doli.mp3" },
  { title: "Hindustan Lo", file: "songs/hindustan_lo.mp3" },
  { title: "Chinni Chinni", file: "songs/chinni_chinni.mp3" },
  { title: "Boss Party", file: "songs/Boss_Party.mp3" },
  { title: "Veerayya", file: "songs/Veerayya.mp3" },
  { title: "Meesaala Pilla", file: "songs/Meesaala_Pilla.mp3" },
  { title: "Sasirekha", file: "songs/Sasirekha.mp3" },

  { title: "Bangaru Kalla", file: "songs/Bangaru_Kalla.mp3" },
  { title: "Alanati Ramachand", file: "songs/Alanati_Ramachand.mp3" },
  { title: "Cheppave Chirugali", file: "songs/Cheppave_Chirugali.mp3" },
  { title: "Nuvvemaya Chesavo", file: "songs/Nuvvemaya_Chesavo.mp3" },
  { title: "Pedave Palikina", file: "songs/Pedave_Palikina.mp3" },
  { title: "Dum Dumare", file: "songs/Dum_Dumare.mp3" },
  { title: "Madhura Madhura", file: "songs/Madhura_Madhura.mp3" },
  { title: "Adharaku", file: "songs/Adharaku.mp3" },
  { title: "Pillagali", file: "songs/Pillagali.mp3" },
  { title: "Chandamama", file: "songs/Chandamama.mp3" },
  { title: "Pilichina", file: "songs/Pilichina.mp3" },
  { title: "Ippatikinka", file: "songs/Ippatikinka.mp3" },
  { title: "Choododdu", file: "songs/Choododdu.mp3" },
  { title: "Gala Gala", file: "songs/Gala_Gala.mp3" },
  { title: "Orugalluke Pilla", file: "songs/Orugalluke_Pilla.mp3" },
  { title: "Sada Siva", file: "songs/Sada_Siva.mp3" },
  { title: "Pileche", file: "songs/Pileche.mp3" },
  { title: "Adara Adara", file: "songs/Adara_Adara.mp3" },
  { title: "Dethadi Dethadi", file: "songs/Dethadi_Dethadi.mp3" },
  { title: "Nee Dookudu", file: "songs/Nee_Dookudu.mp3" },
  { title: "Poovai Poovai", file: "songs/Poovai_Poovai.mp3" },

  { title: "Sir Osthara", file: "songs/Sir_Osthara.mp3" },
  { title: "Bad Boys", file: "songs/Bad_Boys.mp3" },
  { title: "Businessman Theme", file: "songs/Businessman_Theme.mp3" },
  { title: "Yem Cheddaam", file: "songs/Yem_Cheddaam.mp3" },
  { title: "Aaraduguluntada", file: "songs/Aaraduguluntada.mp3" },
  { title: "Seethamma Vakilto", file: "songs/Seethamma_Vakilto.mp3" },
  { title: "Inka Cheppaale", file: "songs/Inka_Cheppaale.mp3" },
  { title: "Mari Antaga", file: "songs/Mari_Antaga.mp3" },
  { title: "Vaana Chinukulu", file: "songs/Vaana_Chinukulu.mp3" },
  { title: "Meghaallo", file: "songs/Meghaallo.mp3" },
  { title: "Aagadu", file: "songs/Aagadu.mp3" },
  { title: "Aaja Saroja", file: "songs/Aaja_Saroja.mp3" },
  { title: "Bhel Poori", file: "songs/Bhel_Poori.mp3" },
  { title: "Junction Lo", file: "songs/Junction_Lo.mp3" },
  { title: "Naari Naari", file: "songs/Naari_Naari.mp3" },
  { title: "Rama Rama", file: "songs/Rama_Rama.mp3" },
  { title: "Jatha Kalise", file: "songs/Jatha_Kalise.mp3" },
  { title: "Srimanthuda", file: "songs/Srimanthuda.mp3" },
  { title: "Jaago", file: "songs/Jaago.mp3" },
  { title: "Dhimmathirigae", file: "songs/Dhimmathirigae.mp3" },
  { title: "Naidorintikada", file: "songs/Naidorintikada.mp3" },

  { title: "Brahmotsavam", file: "songs/Brahmotsavam.mp3" },
  { title: "Bharat Ane Nenu", file: "songs/Bharat_Ane_Nenu.mp3" },
  { title: "Vachaadayyo Saami", file: "songs/Vachaadayyo_Saami.mp3" },
  { title: "O Vasumathi", file: "songs/O_Vasumathi.mp3" },
  { title: "Choti Choti Baatein", file: "songs/Choti_Choti_Baatein.mp3" },
  { title: "Nuvve Samastham", file: "songs/Nuvve_Samastham.mp3" },
  { title: "Paala Pitta", file: "songs/Paala_Pitta.mp3" },
  { title: "Phir Shuru", file: "songs/Phir_Shuru.mp3" },
  { title: "Idhe Kadha", file: "songs/Idhe_Kadha.mp3" },
  { title: "Suryudivo Chandru", file: "songs/Suryudivo_Chandru.mp3" },
  { title: "He Is So Cute", file: "songs/He_Is_So_Cute.mp3" },
  { title: "Daang Daang", file: "songs/Daang_Daang.mp3" },
  { title: "SN Title", file: "songs/SN_Title.mp3" },
  { title: "Sarkaru Vaari Paata", file: "songs/Sarkaru_Vaari_Paata.mp3" },
  { title: "Dum Masala", file: "songs/Dum_Masala.mp3" },
  { title: "Kurchi Madathapetti", file: "songs/Kurchi_Madathapetti.mp3" },
  { title: "Mawaa Enthaina", file: "songs/Mawaa_Enthaina.mp3" },
  { title: "Ramana Aei", file: "songs/Ramana_Aei.mp3" },
  { title: "Amma", file: "songs/Amma.mp3" },
  { title: "Har Har Shambhu", file: "songs/Har_Har_Shambhu.mp3" },
  { title: "Hara Hara Eshwara", file: "songs/Hara_Hara_Eshwara.mp3" },
  { title: "Om Mahaprana", file: "songs/Om_Mahaprana.mp3" },
  { title: "Akhila Charachara", file: "songs/Akhila_Charachara.mp3" },
  { title: "Omkaram", file: "songs/Omkaram.mp3" },
  { title: "Akhila Characharaa", file: "songs/Akhila_Characharaa.mp3" },
  { title: "Lingashtakam", file: "songs/Lingashtakam.mp3" },
  { title: "Kala Bhairava", file: "songs/Kala_Bhairava.mp3" },
  { title: "Aigiri Nandini", file: "songs/Aigiri_Nandini.mp3" },
  { title: "Lalitha Sahasra", file: "songs/Lalitha_Sahasra.mp3" },
  { title: "Manideepavarnana", file: "songs/Manideepavarnana.mp3" },
  { title: "Amma Bhavani", file: "songs/Amma_Bhavani.mp3" },
  { title: "Sri Ramadootha", file: "songs/Sri_Ramadootha.mp3" },
  { title: "Hanuman Chalisa", file: "songs/Hanuman_Chalisa.mp3" },
  { title: "Avakaya Anjaneya", file: "songs/Avakaya_Anjaneya.mp3" },
  { title: "Anjanadri", file: "songs/Anjanadri.mp3" },
  { title: "Raghunandana", file: "songs/Raghunandana.mp3" },
  { title: "Ramachadraya", file: "songs/Ramachadraya.mp3" },
  { title: "Bhadra Sheela", file: "songs/Bhadra_Sheela.mp3" },
  { title: "Shuddha Brahma", file: "songs/Shuddha_Brahma.mp3" },
  { title: "Vinudu Vinudu", file: "songs/Vinudu_Vinudu.mp3" },
  { title: "Mukundha", file: "songs/Mukundha.mp3" },
  { title: "Jaya Janardhana", file: "songs/Jaya_Janardhana.mp3" }
];

/* ===========================
   DATABASE
=========================== */
async function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open("music-db", 2);

    request.onupgradeneeded = e => {
      const db = e.target.result;

      if (!db.objectStoreNames.contains("songs")) {
        db.createObjectStore("songs");
      }

      if (!db.objectStoreNames.contains("folders")) {
        db.createObjectStore("folders");
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject("DB error");
  });
}

/* ===========================
   PLAYER
=========================== */
const audio = document.getElementById("audio");
const playlist = document.getElementById("playlist");

// 👇 ADD HERE
audio.addEventListener("ended", () => {
  currentIndex++;

  if (currentIndex >= songs.length) {
    currentIndex = 0;
  }

  const nextSong = songs[currentIndex];
  playSong(nextSong.file);
});
/* ===========================
   PLAY FUNCTION
=========================== */
function playSong(file, element = null) {
  audio.src = file;
  audio.load();
  audio.play();

  // remove old highlight
  document.querySelectorAll("li").forEach(li => li.classList.remove("playing"));

  // highlight current
  if (element) element.classList.add("playing");
}

// ✅ 👉 ADD YOUR FUNCTIONS HERE
function playNext() {
  if (isShuffle) {
    currentIndex = Math.floor(Math.random() * songs.length);
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }

  playSong(songs[currentIndex].file);
}

function playPrevious() {
  currentIndex = (currentIndex - 1 + songs.length) % songs.length;
  playSong(songs[currentIndex].file);
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  alert("Shuffle: " + (isShuffle ? "ON" : "OFF"));
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  alert("Repeat: " + (isRepeat ? "ON" : "OFF"));
}

audio.addEventListener("ended", () => {
  if (isRepeat) {
    playSong(songs[currentIndex].file);
  } else {
    playNext();
  }
});
// rest of your code (folders, render, etc...)


/* ===========================
   RENDER SONGS
=========================== */
let currentViewSongs = [...songs]; // songs currently shown
let baseSongs = [...songs]; // original reference

function renderSongs(songList, currentFolder = null) {
  playlist.innerHTML = "";

  songList.forEach(song => {
    const li = document.createElement("li");

    // 👉 CLICK ANYWHERE → PLAY
    li.onclick = () => playSong(song.file);

    li.innerHTML = `
      <span>${song.title}</span>
      <div>
        <button onclick="event.stopPropagation(); playSong('${song.file}')">▶</button>
        <button onclick="event.stopPropagation(); addToFolder('${song.file}')">➕</button>
        ${currentFolder ? `<button onclick="event.stopPropagation(); removeFromFolder('${currentFolder}', '${song.file}')">❌</button>` : ""}
      </div>
    `;

    playlist.appendChild(li);
  });
}

function searchSongs() {
  const query = document.getElementById("search").value.toLowerCase();

  if (query === "") {
    renderSongs(baseSongs); // 👈 restore full list
    return;
  }

  const filtered = baseSongs.filter(song =>
    song.title.toLowerCase().includes(query)
  );

  renderSongs(filtered);
} 

function toggleSearch() {
  const searchBox = document.getElementById("search");

  if (searchBox.style.display === "block") {
    searchBox.style.display = "none";
    searchBox.value = "";
    renderSongs(baseSongs); // reset songs
  } else {
    searchBox.style.display = "block";
    searchBox.focus(); // auto focus
  }
}

// Initial load
renderSongs(songs);

/* ===========================
   FOLDER FUNCTIONS
=========================== */

async function saveFolder(name, songsList) {
  const db = await openDB();
  const tx = db.transaction("folders", "readwrite");
  tx.objectStore("folders").put(songsList, name);

  await new Promise(res => tx.oncomplete = res);
}

async function getFolders() {
  const db = await openDB();
  return new Promise(resolve => {
    const req = db.transaction("folders").objectStore("folders").getAllKeys();
    req.onsuccess = () => resolve(req.result);
  });
}

async function getFolderSongs(name) {
  const db = await openDB();
  return new Promise(resolve => {
    const req = db.transaction("folders").objectStore("folders").get(name);
    req.onsuccess = () => resolve(req.result || []);
  });
}

/* ===========================
   CREATE FOLDER
=========================== */
async function createFolder() {
  const name = prompt("Enter folder name:");
  if (!name) return;

  await saveFolder(name, []);
  renderFolders();
}

/* ===========================
   RENDER FOLDERS
=========================== */
async function renderFolders() {
  const folderList = document.getElementById("folders");
  folderList.innerHTML = "";

  const folders = await getFolders();

  folders.forEach(folder => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span onclick="openFolder('${folder}')">📁 ${folder}</span>
      <button onclick="deleteFolder('${folder}')">🗑</button>
    `;

    folderList.appendChild(li);
  });
}

/* ===========================
   OPEN FOLDER
=========================== */
async function openFolder(folderName) {
  const paths = await getFolderSongs(folderName);
  const filteredSongs = songs.filter(s => paths.includes(s.file));

  baseSongs = filteredSongs; // 👈 important
  renderSongs(filteredSongs, folderName);
}

/* ===========================
   DELETE FOLDER
=========================== */
async function deleteFolder(folderName) {
  const confirmDelete = confirm("Delete folder: " + folderName + "?");
  if (!confirmDelete) return;

  const db = await openDB();
  const tx = db.transaction("folders", "readwrite");
  tx.objectStore("folders").delete(folderName);

  await new Promise(res => tx.oncomplete = res);

  renderFolders();
}

/* ===========================
   ADD TO FOLDER
=========================== */
async function addToFolder(songFile) {
  const folders = await getFolders();

  if (folders.length === 0) {
    alert("No folders available. Create one first.");
    return;
  }

  let menu = "Select folder:\n";
  folders.forEach((f, i) => {
    menu += `${i + 1}. ${f}\n`;
  });

  const choice = prompt(menu);
  const folder = folders[choice - 1];
  if (!folder) return;

  let list = await getFolderSongs(folder);

  if (!list.includes(songFile)) {
    list.push(songFile);
    await saveFolder(folder, list);
  }

  alert("Added to " + folder);
}

/* ===========================
   REMOVE FROM FOLDER (NEW FEATURE)
=========================== */
async function removeFromFolder(folderName, songFile) {
  let list = await getFolderSongs(folderName);

  list = list.filter(file => file !== songFile);

  await saveFolder(folderName, list);

  alert("Removed from " + folderName);

  openFolder(folderName); // refresh UI
}

/* ===========================
   INIT
=========================== */
renderFolders();
