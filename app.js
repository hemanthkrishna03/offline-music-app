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
  { title: "Edo Oka Ragam", file: "songs/Edo_Oka_Raagam.mp3" }
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

/* ===========================
   PLAY FUNCTION
=========================== */
function playSong(file) {
  audio.src = file;
  audio.load();
  audio.play();
}

/* ===========================
   RENDER SONGS
=========================== */
function renderSongs(songList, currentFolder = null) {
  playlist.innerHTML = "";

  songList.forEach(song => {
    const li = document.createElement("li");

    li.innerHTML = `
      <span>${song.title}</span>
      <div>
        <button onclick="playSong('${song.file}')">▶</button>
        <button onclick="addToFolder('${song.file}')">➕</button>
        ${currentFolder ? `<button onclick="removeFromFolder('${currentFolder}', '${song.file}')">❌</button>` : ""}
      </div>
    `;

    playlist.appendChild(li);
  });
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
