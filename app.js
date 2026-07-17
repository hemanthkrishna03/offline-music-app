const songs = window.songs
let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;
let playNextQueue = [];

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
const progress = document.getElementById("progress");
const songTitle = document.getElementById("songTitle");
const playlist = document.getElementById("playlist");

// 👇 ADD HERE
const playPauseBtn = document.getElementById("playPauseBtn");

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
  } else {
    audio.pause();
    playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
  }
}

function toggleMoreMenu() {
    const menu = document.getElementById("morePopup");

    if (menu.style.display === "block") {
        menu.style.display = "none";
    } else {
        menu.style.display = "block";
    }
}


document.addEventListener("click", function(event){

    const menu = document.getElementById("morePopup");
    const more = document.querySelector(".more-menu");

    if(!more.contains(event.target)){
        menu.style.display="none";
    }

});

audio.addEventListener("play", () => {
  playPauseBtn.innerHTML = '<i class="bi bi-pause-fill"></i>';
});

audio.addEventListener("pause", () => {
  playPauseBtn.innerHTML = '<i class="bi bi-play-fill"></i>';
});
/* ===========================
   PLAY FUNCTION
=========================== */
function playSong(file, element = null) {
  currentIndex = songs.findIndex(song => song.file === file);

  audio.src = file;
  audio.load();
  audio.play();

  songTitle.textContent = "🎵 " + songs[currentIndex].title;
  
  document.querySelectorAll("li").forEach(li =>
    li.classList.remove("playing")
  );

  if (element) {
    element.classList.add("playing");
  }
}
audio.addEventListener("timeupdate", () => {
  if (audio.duration) {
    progress.value = (audio.currentTime / audio.duration) * 100;
  }
});

progress.addEventListener("input", () => {
  audio.currentTime = (progress.value / 100) * audio.duration;
});

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

function addToPlayNext(songFile) {

    // Don't add duplicates
    if (playNextQueue.includes(songFile)) {
        alert("Song is already in the Play Next queue.");
        return;
    }

    playNextQueue.push(songFile);

    alert(
        songs.find(s => s.file === songFile).title +
        " added to Play Next."
    );
}

function showQueue(){
    alert("Play Queue will be added in the next step.");
}



audio.addEventListener("ended", () => {
  if (isRepeat) {
    playSong(songs[currentIndex].file);
  } else {
    playNext();
  }
});

function goTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// Show button only after scrolling down
window.addEventListener("scroll", () => {
  const button = document.getElementById("topButton");

  if (window.scrollY > 300) {
    button.style.display = "block";
  } else {
    button.style.display = "none";
  }
});

function downloadSong(file, title) {

  const link = document.createElement("a");

  link.href = file;

  link.download = title + ".mp3";

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);
}

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

        <button onclick="event.stopPropagation(); addToPlayNext('${song.file}')">↪</button>
        <button onclick="event.stopPropagation(); addToFolder('${song.file}')">➕</button>
        <button onclick="event.stopPropagation(); downloadSong('${song.file}', '${song.title}')">↓</button>
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
