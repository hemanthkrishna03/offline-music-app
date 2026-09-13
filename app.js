/* =========================================================
   MY MUSIC
   All Songs + Mini Player + Queue + Playlists + More Options
   ========================================================= */

let songs = [];
let visibleSongs = [];

let queue = [];

let currentIndex = -1;
let currentSong = null;
let currentList = [];

let isLooping = false;
let playNextEnabled = true;

let pendingPlaylistSong = null;
let contextSong = null;

let currentScreen = "home";


/* =========================================================
   ELEMENTS
   ========================================================= */

const homeScreen =
  document.getElementById("homeScreen");

const songListScreen =
  document.getElementById("songListScreen");

const songList =
  document.getElementById("songList");

const categoryTitle =
  document.getElementById("categoryTitle");

const searchInput =
  document.getElementById("search");

const searchWrap =
  document.getElementById("searchWrap");

const backButton =
  document.getElementById("backButton");

const headerMenuButton =
  document.getElementById("headerMenuButton");


/* MINI PLAYER */

const miniPlayer =
  document.getElementById("miniPlayer");

const miniCover =
  document.getElementById("miniCover");

const miniTitle =
  document.getElementById("miniTitle");

const miniArtist =
  document.getElementById("miniArtist");

const miniPlayButton =
  document.getElementById("miniPlayButton");

const miniLoopButton =
  document.getElementById("miniLoopButton");

const miniQueueButton =
  document.getElementById("miniQueueButton");

const miniSongButton =
  document.getElementById("miniSongButton");


/* FULL PLAYER */

const playerScreen =
  document.getElementById("playerScreen");

const playerBackButton =
  document.getElementById("playerBackButton");

const playerQueueButton =
  document.getElementById("playerQueueButton");

const albumCover =
  document.getElementById("albumCover");

const songTitle =
  document.getElementById("songTitle");

const songArtist =
  document.getElementById("songArtist");

const songYear =
  document.getElementById("songYear");

const progress =
  document.getElementById("progress");

const currentTimeElement =
  document.getElementById("currentTime");

const durationElement =
  document.getElementById("duration");

const playButton =
  document.getElementById("playButton");

const nextButton =
  document.getElementById("nextButton");

const previousButton =
  document.getElementById("previousButton");

const loopButton =
  document.getElementById("loopButton");

const playNextToggleButton =
  document.getElementById("playNextToggleButton");


/* AUDIO */

const audio =
  document.getElementById("audio");


/* QUEUE */

const queuePanel =
  document.getElementById("queuePanel");

const queueList =
  document.getElementById("queueList");

const closeQueueButton =
  document.getElementById("closeQueueButton");


/* PLAYLIST */

const playlistPanel =
  document.getElementById("playlistPanel");

const playlistList =
  document.getElementById("playlistList");

const closePlaylistButton =
  document.getElementById("closePlaylistButton");


/* MORE OPTIONS */

const contextMenu =
  document.getElementById("contextMenu");


/* =========================================================
   HELPERS
   ========================================================= */

function escapeHTML(value) {

  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}


function getSongId(song) {

  if (!song) return "";

  if (song.id !== undefined)
    return String(song.id);

  if (song.file)
    return String(song.file);

  return `${song.title || ""}_${song.year || ""}`;
}


function titleOf(song) {

  return String(
    song?.title ||
    "Unknown Song"
  );
}


function artistOf(song) {

  if (Array.isArray(song?.Singers))
    return song.Singers.join(", ");

  return String(
    song?.Singers ||
    song?.singers ||
    song?.artist ||
    song?.artists ||
    "Unknown Artist"
  );
}


function coverOf(song) {

  return String(
    song?.cover ||
    song?.coverArt ||
    song?.albumCover ||
    "covers/default.jpg"
  );
}


function fileOf(song) {

  return String(
    song?.file ||
    song?.url ||
    song?.src ||
    ""
  );
}


function formatTime(seconds) {

  if (
    !Number.isFinite(seconds) ||
    seconds < 0
  ) {
    return "0:00";
  }

  const minutes =
    Math.floor(seconds / 60);

  const secondsPart =
    Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");

  return `${minutes}:${secondsPart}`;
}


/* =========================================================
   LOAD METADATA
   ========================================================= */

async function loadSongs() {

  try {

    const response =
      await fetch(
        "metadata.json",
        {
          cache: "no-store"
        }
      );

    if (!response.ok) {

      throw new Error(
        `Metadata loading failed: ${response.status}`
      );
    }

    songs =
      await response.json();


    /* Songs deleted through the UI */

    const deleted =
      new Set(
        JSON.parse(
          localStorage.getItem(
            "deletedSongs"
          ) || "[]"
        )
      );


    songs =
      songs.filter(
        song =>
          !deleted.has(
            getSongId(song)
          )
      );


    visibleSongs =
      [...songs];


    showHome();

  }

  catch (error) {

    console.error(error);

    songList.innerHTML =
      `
      <div class="empty-state">
        Unable to load songs_metadata1.json.
      </div>
      `;
  }
}


/* =========================================================
   HOME
   ========================================================= */

function showHome() {

  currentScreen = "home";

  homeScreen.classList.remove(
    "hidden"
  );

  songListScreen.classList.add(
    "hidden"
  );

  playerScreen.classList.add(
    "hidden"
  );

  closeContextMenu();
}


/* =========================================================
   LIST PAGE
   ========================================================= */

function showList(title, list) {

  currentScreen = "list";

  homeScreen.classList.add(
    "hidden"
  );

  playerScreen.classList.add(
    "hidden"
  );

  songListScreen.classList.remove(
    "hidden"
  );


  categoryTitle.textContent =
    title;


  searchWrap.classList.remove(
    "hidden"
  );


  visibleSongs =
    [...list];


  renderSongs(
    visibleSongs
  );


  window.scrollTo(
    {
      top: 0,
      behavior: "instant"
    }
  );
}


function showAllSongs() {

  showList(
    "All Songs",
    songs
  );
}


/* =========================================================
   CATEGORY NAVIGATION
   ========================================================= */

function openCategory(category) {

  closeContextMenu();


  if (category === "allSongs") {

    showAllSongs();

    return;
  }


  if (category === "recentlyPlayed") {

    const ids =
      JSON.parse(
        localStorage.getItem(
          "recentlyPlayed"
        ) || "[]"
      );


    const list =
      ids
        .map(
          id =>
            songs.find(
              song =>
                getSongId(song) === id
            )
        )
        .filter(Boolean);


    showList(
      "Recently Played",
      list
    );

    return;
  }


  if (category === "playlists") {

    showPlaylistsPage();

    return;
  }


  if (category === "favouriteHero") {

    showFavouriteHeroes();

    return;
  }
}


/* =========================================================
   FAVOURITE HERO
   ========================================================= */

function showFavouriteHeroes() {

  const map =
    new Map();


  songs.forEach(song => {

    const raw =
      song.heroes ||
      song.Heroes ||
      song.hero ||
      song.Hero ||
      [];


    const heroes =
      Array.isArray(raw)
        ? raw
        : [raw];


    heroes
      .filter(Boolean)
      .forEach(hero => {

        const name =
          String(hero).trim();


        if (!map.has(name))
          map.set(name, []);


        map
          .get(name)
          .push(song);
      });

  });


  currentScreen = "list";

  homeScreen.classList.add(
    "hidden"
  );

  playerScreen.classList.add(
    "hidden"
  );

  songListScreen.classList.remove(
    "hidden"
  );

  searchWrap.classList.add(
    "hidden"
  );

  categoryTitle.textContent =
    "Favourite Hero";

  songList.innerHTML = "";


  if (!map.size) {

    songList.innerHTML =
      `
      <div class="empty-state">
        No favourite heroes available.
      </div>
      `;

    return;
  }


  for (
    const [hero, heroSongs]
    of map
  ) {

    const row =
      document.createElement(
        "button"
      );


    row.className =
      "playlist-item";


    row.innerHTML =
      `
      <span>
        ★ ${escapeHTML(hero)}
      </span>

      <span
        style="
          margin-left:auto;
          color:#999
        "
      >
        ${heroSongs.length}
      </span>
      `;


    row.addEventListener(
      "click",
      () =>
        showList(
          hero,
          heroSongs
        )
    );


    songList.appendChild(
      row
    );
  }
}


/* =========================================================
   RENDER SONGS
   ========================================================= */

function renderSongs(list) {

  songList.innerHTML = "";


  if (!list.length) {

    songList.innerHTML =
      `
      <div class="empty-state">
        No songs available.
      </div>
      `;

    return;
  }


  list.forEach(song => {

    const row =
      document.createElement(
        "div"
      );


    row.className =
      "song-row";


    row.dataset.songId =
      getSongId(song);


    row.innerHTML =
      `
      <img
        class="song-cover"
        src="${escapeHTML(coverOf(song))}"
        alt=""
      >

      <div class="song-details">

        <span class="song-title">
          ${escapeHTML(
            titleOf(song)
          )}
        </span>

        <span class="song-artist">
          ${escapeHTML(
            artistOf(song)
          )}
        </span>

      </div>

      <button
        class="more-button"
        aria-label="More options"
        title="More options"
      >
        ⋮
      </button>
      `;


    row.addEventListener(
      "click",
      () =>
        playSong(
          song,
          list
        )
    );


    row
      .querySelector(
        ".more-button"
      )
      .addEventListener(
        "click",
        event => {

          event.stopPropagation();

          openContextMenu(
            event.currentTarget,
            song
          );
        }
      );


    songList.appendChild(
      row
    );

  });


  highlightCurrentSong();
}


/* =========================================================
   HIGHLIGHT CURRENT SONG
   ========================================================= */

function highlightCurrentSong() {

  document
    .querySelectorAll(
      ".song-row"
    )
    .forEach(row => {

      row.classList.toggle(
        "playing",

        currentSong &&
        row.dataset.songId ===
          getSongId(currentSong)
      );

    });
}


/* =========================================================
   MORE OPTIONS
   ========================================================= */

function openContextMenu(
  button,
  song
) {

  contextSong =
    song;


  contextMenu.innerHTML =
    `
    <button data-action="download">
      ↓ &nbsp; Download
    </button>

    <button data-action="loop">
      ↻ &nbsp; Loop
    </button>

    <button data-action="playNext">
      ⏭ &nbsp; Play Next
    </button>

    <button data-action="queue">
      ☷ &nbsp; Add to Queue
    </button>

    <button data-action="playlist">
      + &nbsp; Add to Playlist
    </button>

    <button data-action="delete">
      🗑 &nbsp; Delete
    </button>

    <button
      data-action="deleteDatabase"
      class="danger"
    >
      ⚠ &nbsp; Delete from Database
    </button>
    `;


  const rect =
    button.getBoundingClientRect();


  contextMenu.classList.remove(
    "hidden"
  );


  const menuWidth =
    Math.min(
      280,
      window.innerWidth - 28
    );


  let left =
    rect.right - menuWidth;


  let top =
    rect.bottom + 6;


  if (
    left < 14
  ) {
    left = 14;
  }


  if (
    top + 340 >
    window.innerHeight
  ) {

    top =
      rect.top - 340;
  }


  if (top < 14)
    top = 14;


  contextMenu.style.left =
    `${left}px`;

  contextMenu.style.top =
    `${top}px`;


  contextMenu
    .querySelectorAll(
      "button"
    )
    .forEach(button => {

      button.addEventListener(
        "click",
        () =>
          handleContextAction(
            button.dataset.action
          )
      );

    });
}


function closeContextMenu() {

  contextMenu.classList.add(
    "hidden"
  );

  contextSong = null;
}


/* =========================================================
   MORE OPTIONS ACTIONS
   ========================================================= */

function handleContextAction(
  action
) {

  const song =
    contextSong;


  closeContextMenu();


  if (!song)
    return;


  switch (action) {

    case "download":
      downloadSong(song);
      break;


    case "loop":

      currentSong = song;

      isLooping = true;

      updateLoopUI();

      break;


    case "playNext":

      addPlayNext(song);

      break;


    case "queue":

      addToQueue(song);

      break;


    case "playlist":

      openPlaylistPicker(song);

      break;


    case "delete":

      deleteSongFromCurrentView(
        song
      );

      break;


    case "deleteDatabase":

      deleteSongFromDatabase(
        song
      );

      break;
  }
}


/* =========================================================
   DOWNLOAD
   ========================================================= */

function downloadSong(song) {

  const file =
    fileOf(song);


  if (!file) {

    alert(
      "No audio file is available for this song."
    );

    return;
  }


  const link =
    document.createElement(
      "a"
    );


  link.href = file;

  link.download =
    titleOf(song);


  document.body.appendChild(
    link
  );

  link.click();

  link.remove();
}


/* =========================================================
   PLAY NEXT
   ========================================================= */

function addPlayNext(song) {

  if (!currentSong) {

    playSong(
      song,
      songs
    );

    return;
  }


  const currentId =
    getSongId(
      currentSong
    );


  const index =
    queue.findIndex(
      item =>
        getSongId(item) ===
        currentId
    );


  if (index < 0) {

    queue.push(song);

  } else {

    queue.splice(
      index + 1,
      0,
      song
    );
  }


  renderQueue();
}


/* =========================================================
   QUEUE
   ========================================================= */

function addToQueue(song) {

  const exists =
    queue.some(
      item =>
        getSongId(item) ===
        getSongId(song)
    );


  if (!exists) {

    queue.push(song);

    renderQueue();

    alert(
      `"${titleOf(song)}" added to queue.`
    );

  } else {

    alert(
      "This song is already in the queue."
    );
  }
}


/* =========================================================
   DELETE FROM CURRENT VIEW
   ========================================================= */

function deleteSongFromCurrentView(
  song
) {

  const id =
    getSongId(song);


  visibleSongs =
    visibleSongs.filter(
      item =>
        getSongId(item) !== id
    );


  renderSongs(
    visibleSongs
  );
}


/* =========================================================
   DELETE FROM DATABASE
   ========================================================= */

function deleteSongFromDatabase(
  song
) {

  const confirmed =
    confirm(
      `Delete "${titleOf(song)}" from the database?`
    );


  if (!confirmed)
    return;


  const id =
    getSongId(song);


  const deleted =
    new Set(
      JSON.parse(
        localStorage.getItem(
          "deletedSongs"
        ) || "[]"
      )
    );


  deleted.add(id);


  localStorage.setItem(
    "deletedSongs",
    JSON.stringify(
      [...deleted]
    )
  );


  songs =
    songs.filter(
      item =>
        getSongId(item) !== id
    );


  visibleSongs =
    visibleSongs.filter(
      item =>
        getSongId(item) !== id
    );


  queue =
    queue.filter(
      item =>
        getSongId(item) !== id
    );


  if (
    currentSong &&
    getSongId(currentSong) === id
  ) {

    audio.pause();

    currentSong = null;

    currentIndex = -1;

    miniPlayer.classList.add(
      "hidden"
    );
  }


  renderSongs(
    visibleSongs
  );


  renderQueue();
}


/* =========================================================
   PLAYLISTS
   ========================================================= */

function getPlaylists() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "playlists"
      ) || "[]"
    );

  } catch {

    return [];
  }
}


function savePlaylists(
  playlists
) {

  localStorage.setItem(
    "playlists",
    JSON.stringify(
      playlists
    )
  );
}


/* =========================================================
   PLAYLIST PAGE
   ========================================================= */

function showPlaylistsPage() {

  currentScreen = "list";

  homeScreen.classList.add(
    "hidden"
  );

  playerScreen.classList.add(
    "hidden"
  );

  songListScreen.classList.remove(
    "hidden"
  );

  searchWrap.classList.add(
    "hidden"
  );

  categoryTitle.textContent =
    "Playlists";

  songList.innerHTML = "";


  const playlists =
    getPlaylists();


  if (!playlists.length) {

    songList.innerHTML =
      `
      <div class="empty-state">
        No playlists created yet.
      </div>
      `;

    return;
  }


  playlists.forEach(
    playlist => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "playlist-item";


      button.innerHTML =
        `
        <span>
          📁 ${escapeHTML(
            playlist.name
          )}
        </span>

        <span
          style="
            margin-left:auto;
            color:#999
          "
        >
          ${playlist.songs.length}
        </span>
        `;


      button.addEventListener(
        "click",
        () => {

          const playlistSongs =
            playlist.songs
              .map(
                id =>
                  songs.find(
                    song =>
                      getSongId(song) === id
                  )
              )
              .filter(Boolean);


          showList(
            playlist.name,
            playlistSongs
          );
        }
      );


      songList.appendChild(
        button
      );

    }
  );
}


/* =========================================================
   PLAYLIST PICKER
   ========================================================= */

function openPlaylistPicker(
  song
) {

  pendingPlaylistSong =
    song;


  const playlists =
    getPlaylists();


  playlistList.innerHTML =
    "";


  if (!playlists.length) {

    playlistList.innerHTML =
      `
      <div class="empty-state">
        No playlist folders exist yet.
      </div>
      `;

  } else {

    playlists.forEach(
      playlist => {

        const button =
          document.createElement(
            "button"
          );


        button.className =
          "playlist-item";


        button.innerHTML =
          `
          <span>
            📁 ${escapeHTML(
              playlist.name
            )}
          </span>

          <span
            style="
              margin-left:auto;
              color:#999
            "
          >
            ${playlist.songs.length}
          </span>
          `;


        button.addEventListener(
          "click",
          () =>
            addPendingSongToPlaylist(
              playlist.name
            )
        );


        playlistList.appendChild(
          button
        );

      }
    );
  }


  playlistPanel.classList.remove(
    "hidden"
  );
}


/* =========================================================
   ADD SONG TO PLAYLIST
   ========================================================= */

function addPendingSongToPlaylist(
  name
) {

  if (!pendingPlaylistSong)
    return;


  const playlists =
    getPlaylists();


  const playlist =
    playlists.find(
      item =>
        item.name === name
    );


  if (!playlist)
    return;


  const id =
    getSongId(
      pendingPlaylistSong
    );


  if (
    !playlist.songs.includes(id)
  ) {

    playlist.songs.push(id);

  }


  savePlaylists(
    playlists
  );


  const addedSong =
    pendingPlaylistSong;


  pendingPlaylistSong =
    null;


  playlistPanel.classList.add(
    "hidden"
  );


  alert(
    `"${titleOf(addedSong)}" added to ${name}.`
  );
}


/* =========================================================
   QUEUE UI
   ========================================================= */

function renderQueue() {

  queueList.innerHTML =
    "";


  if (!queue.length) {

    queueList.innerHTML =
      `
      <div class="empty-state">
        Queue is empty.
      </div>
      `;

    return;
  }


  queue.forEach(
    song => {

      const button =
        document.createElement(
          "button"
        );


      button.className =
        "queue-item";


      button.innerHTML =
        `
        <img
          src="${escapeHTML(
            coverOf(song)
          )}"
          alt=""
        >

        <span
          style="
            min-width:0
          "
        >

          <strong
            style="
              display:block;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap
            "
          >
            ${escapeHTML(
              titleOf(song)
            )}
          </strong>

          <small
            style="
              display:block;
              overflow:hidden;
              text-overflow:ellipsis;
              white-space:nowrap
            "
          >
            ${escapeHTML(
              artistOf(song)
            )}
          </small>

        </span>
        `;


      button.addEventListener(
        "click",
        () => {

          playSong(
            song,
            queue
          );

          closeQueue();
        }
      );


      queueList.appendChild(
        button
      );

    }
  );
}


function openQueue() {

  renderQueue();

  queuePanel.classList.remove(
    "hidden"
  );
}


function closeQueue() {

  queuePanel.classList.add(
    "hidden"
  );
}


/* =========================================================
   PLAY SONG
   ========================================================= */

function playSong(
  song,
  list = songs
) {

  if (!song)
    return;


  currentSong =
    song;


  currentList =
    [...list];


  queue =
    [...list];


  const id =
    getSongId(song);


  currentIndex =
    queue.findIndex(
      item =>
        getSongId(item) === id
    );


  if (currentIndex < 0)
    currentIndex = 0;


  const file =
    fileOf(song);


  if (!file) {

    alert(
      "This song does not have an audio file path in the metadata."
    );

    return;
  }


  audio.src =
    file;


  audio.load();


  audio.play()
    .catch(
      error =>
        console.warn(
          "Playback was not started automatically:",
          error
        )
    );


  addRecentlyPlayed(
    song
  );


  updatePlayer(
    song
  );


  updateMiniPlayer();

  highlightCurrentSong();

  renderQueue();
}


/* =========================================================
   RECENTLY PLAYED
   ========================================================= */

function addRecentlyPlayed(
  song
) {

  const id =
    getSongId(song);


  const ids =
    JSON.parse(
      localStorage.getItem(
        "recentlyPlayed"
      ) || "[]"
    )
    .filter(
      item =>
        item !== id
    );


  ids.unshift(id);


  localStorage.setItem(
    "recentlyPlayed",
    JSON.stringify(
      ids.slice(0, 50)
    )
  );
}


/* =========================================================
   FULL PLAYER
   ========================================================= */

function updatePlayer(
  song
) {

  albumCover.src =
    coverOf(song);

  albumCover.alt =
    titleOf(song);


  songTitle.textContent =
    titleOf(song);


  songArtist.textContent =
    artistOf(song);


  songYear.textContent =
    song.year &&
    song.year !== "Unknown"
      ? song.year
      : "";
}


function openFullPlayer() {

  if (!currentSong)
    return;


  playerScreen.classList.remove(
    "hidden"
  );

  homeScreen.classList.add(
    "hidden"
  );

  songListScreen.classList.add(
    "hidden"
  );


  updatePlayer(
    currentSong
  );
}


function closeFullPlayer() {

  playerScreen.classList.add(
    "hidden"
  );


  if (
    currentScreen ===
    "home"
  ) {

    showHome();

  } else {

    homeScreen.classList.add(
      "hidden"
    );

    songListScreen.classList.remove(
      "hidden"
    );
  }
}


/* =========================================================
   MINI PLAYER
   ========================================================= */

function updateMiniPlayer() {

  if (!currentSong) {

    miniPlayer.classList.add(
      "hidden"
    );

    return;
  }


  miniPlayer.classList.remove(
    "hidden"
  );


  miniCover.src =
    coverOf(currentSong);


  miniCover.alt =
    titleOf(currentSong);


  miniTitle.textContent =
    titleOf(currentSong);


  miniArtist.textContent =
    artistOf(currentSong);


  miniPlayButton.textContent =
    audio.paused
      ? "▶"
      : "❚❚";


  updateLoopUI();
}


function updateLoopUI() {

  miniLoopButton.classList.toggle(
    "mini-loop-active",
    isLooping
  );


  loopButton.classList.toggle(
    "active",
    isLooping
  );
}


/* =========================================================
   PLAYBACK
   ========================================================= */

function togglePlayPause() {

  if (!currentSong) {

    if (songs.length) {

      playSong(
        songs[0],
        songs
      );
    }

    return;
  }


  if (audio.paused) {

    audio.play();

  } else {

    audio.pause();
  }
}


function playNext() {

  if (!queue.length)
    return;


  if (isLooping) {

    audio.currentTime = 0;

    audio.play();

    return;
  }


  if (!playNextEnabled) {

    audio.pause();

    updateMiniPlayer();

    return;
  }


  currentIndex++;


  if (
    currentIndex >=
    queue.length
  ) {

    currentIndex = 0;
  }


  playSong(
    queue[currentIndex],
    queue
  );
}


function playPrevious() {

  if (!queue.length)
    return;


  if (
    audio.currentTime > 3
  ) {

    audio.currentTime = 0;

    return;
  }


  currentIndex--;


  if (currentIndex < 0) {

    currentIndex =
      queue.length - 1;
  }


  playSong(
    queue[currentIndex],
    queue
  );
}


/* =========================================================
   PROGRESS
   ========================================================= */

function updateProgress() {

  if (!audio.duration)
    return;


  progress.value =
    (
      audio.currentTime /
      audio.duration
    ) * 100;


  currentTimeElement.textContent =
    formatTime(
      audio.currentTime
    );
}


function updateDuration() {

  durationElement.textContent =
    formatTime(
      audio.duration
    );
}


/* =========================================================
   EVENTS
   ========================================================= */


/* HOME CATEGORIES */

document
  .querySelectorAll(
    ".category-card"
  )
  .forEach(button => {

    button.addEventListener(
      "click",
      () =>
        openCategory(
          button.dataset.category
        )
    );

  });


/* BACK */

backButton.addEventListener(
  "click",
  showHome
);


/* HEADER QUEUE */

headerMenuButton.addEventListener(
  "click",
  openQueue
);


/* SEARCH */

searchInput.addEventListener(
  "input",
  () => {

    const q =
      searchInput.value
        .trim()
        .toLowerCase();


    const filtered =
      songs.filter(song => {

        const title =
          titleOf(song)
            .toLowerCase();


        const artist =
          artistOf(song)
            .toLowerCase();


        const album =
          String(
            song.album || ""
          ).toLowerCase();


        return (
          title.includes(q) ||
          artist.includes(q) ||
          album.includes(q)
        );
      });


    visibleSongs =
      filtered;


    renderSongs(
      filtered
    );
  }
);


/* MINI PLAYER */

miniSongButton.addEventListener(
  "click",
  openFullPlayer
);


miniPlayButton.addEventListener(
  "click",
  event => {

    event.stopPropagation();

    togglePlayPause();
  }
);


miniLoopButton.addEventListener(
  "click",
  event => {

    event.stopPropagation();

    isLooping =
      !isLooping;

    updateLoopUI();
  }
);


miniQueueButton.addEventListener(
  "click",
  event => {

    event.stopPropagation();

    openQueue();
  }
);


/* FULL PLAYER */

playerBackButton.addEventListener(
  "click",
  closeFullPlayer
);


playerQueueButton.addEventListener(
  "click",
  openQueue
);


playButton.addEventListener(
  "click",
  togglePlayPause
);


nextButton.addEventListener(
  "click",
  playNext
);


previousButton.addEventListener(
  "click",
  playPrevious
);


loopButton.addEventListener(
  "click",
  () => {

    isLooping =
      !isLooping;

    updateLoopUI();
  }
);


playNextToggleButton.addEventListener(
  "click",
  () => {

    playNextEnabled =
      !playNextEnabled;


    playNextToggleButton.classList.toggle(
      "active",
      playNextEnabled
    );
  }
);


/* PROGRESS */

progress.addEventListener(
  "input",
  () => {

    if (audio.duration) {

      audio.currentTime =
        (
          Number(
            progress.value
          ) / 100
        ) *
        audio.duration;
    }
  }
);


/* QUEUE */

closeQueueButton.addEventListener(
  "click",
  closeQueue
);


queuePanel.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      queuePanel
    ) {

      closeQueue();
    }
  }
);


/* PLAYLIST */

closePlaylistButton.addEventListener(
  "click",
  () =>
    playlistPanel.classList.add(
      "hidden"
    )
);


playlistPanel.addEventListener(
  "click",
  event => {

    if (
      event.target ===
      playlistPanel
    ) {

      playlistPanel.classList.add(
        "hidden"
      );
    }
  }
);


/* AUDIO */

audio.addEventListener(
  "play",
  updateMiniPlayer
);


audio.addEventListener(
  "pause",
  updateMiniPlayer
);


audio.addEventListener(
  "loadedmetadata",
  updateDuration
);


audio.addEventListener(
  "timeupdate",
  updateProgress
);


audio.addEventListener(
  "ended",
  playNext
);


/* CLOSE MENU WHEN CLICKING OUTSIDE */

document.addEventListener(
  "click",
  event => {

    if (
      !contextMenu.contains(
        event.target
      ) &&
      !event.target.closest(
        ".more-button"
      )
    ) {

      closeContextMenu();
    }
  }
);


/* KEYBOARD */

document.addEventListener(
  "keydown",
  event => {

    if (
      event.target.tagName ===
      "INPUT"
    )
      return;


    if (
      event.code ===
      "Space"
    ) {

      event.preventDefault();

      togglePlayPause();
    }


    if (
      event.code ===
      "ArrowRight"
    ) {

      playNext();
    }


    if (
      event.code ===
      "ArrowLeft"
    ) {

      playPrevious();
    }
  }
);


/* =========================================================
   START APP
   ========================================================= */

loadSongs();