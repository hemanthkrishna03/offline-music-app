/* =========================================================
   MY MUSIC
   All Songs + Mini Player + Queue + Playlists + More Options
   ========================================================= */


/* =========================================================
   GLOBAL VARIABLES
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

/*
   ID of the playlist currently being viewed.

   null = All Songs / Recently Played / Favourite Hero
*/
let currentPlaylistId = null;

/*
   When true, All Songs becomes a selection screen
   for adding songs to a particular playlist.
*/
let playlistSelectionMode = false;


/* =========================================================
   DEFAULT PLAYLISTS
   =========================================================

   You can easily change these names later.

   IMPORTANT:
   These are created ONLY when there is no existing
   "playlists" data in localStorage.

   Therefore:
   - Refreshing does NOT recreate playlists.
   - Deleted playlists stay deleted.
   - Renamed playlists stay renamed.
   ========================================================= */

const DEFAULT_PLAYLISTS = [
  {
    id: "playlist-1",
    name: "Devotional Songs",
    songs: []
  },
  {
    id: "playlist-2",
    name: "Morning Songs",
    songs: []
  },
  {
    id: "playlist-3",
    name: "Vibe Songs",
    songs: []
  },
  {
    id: "playlist-4",
    name: "Item Songs",
    songs: []
  },
  {
    id: "playlist-5",
    name: "Evening Songs",
    songs: []
  },
  {
    id: "playlist-6",
    name: "Night Songs",
    songs: []
  },
  {
    id: "playlist-7",
    name: "Special Songs",
    songs: []
  },
  { 
    id: "playlist-8", 
    name: "Heroine Songs", 
    songs: [] 
  }
];


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

  return getAssetPath(
    song?.cover ||
    song?.coverArt ||
    song?.albumCover ||
    "covers/default.jpg"
  );
}


function fileOf(song) {

  return getAssetPath(
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


function getAssetPath(path) {

  if (!path) return "";

  return String(path)
    .replace(/^\/music\//, "songs/")
    .replace(/^\/covers\//, "covers/")
    .replace(/^\//, "");
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
        ).map(id => String(id))
      );


    songs =
      songs.filter(
        song =>
          !deleted.has(
            String(getSongId(song))
          )
      );


    visibleSongs =
      [...songs];


    /*
       Make sure the default playlists are created
       if this is the first time the playlist system
       is being used.
    */
    initializePlaylists();


    showHome();

  }

  catch (error) {

    console.error(error);

    songList.innerHTML =
      `
      <div class="empty-state">
        Unable to load metadata.json.
      </div>
      `;
  }
}


/* =========================================================
   HOME
   ========================================================= */

function showHome() {

  currentScreen = "home";

  currentPlaylistId = null;
  playlistSelectionMode = false;

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

function showList(
  title,
  list,
  playlistId = null
) {

  currentScreen = "list";

  currentPlaylistId =
    playlistId;

  playlistSelectionMode =
    false;


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

  currentPlaylistId = null;
  playlistSelectionMode = false;

  showList(
    "All Songs",
    songs,
    null
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

    currentPlaylistId = null;
    playlistSelectionMode = false;


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
                String(getSongId(song)) ===
                String(id)
            )
        )
        .filter(Boolean);


    showList(
      "Recently Played",
      list,
      null
    );

    return;
  }


  if (category === "playlists") {

    currentPlaylistId = null;
    playlistSelectionMode = false;

    showPlaylistsPage();

    return;
  }


  if (category === "favouriteHero") {

    currentPlaylistId = null;
    playlistSelectionMode = false;

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


        if (!name)
          return;


        if (!map.has(name))
          map.set(name, []);


        map
          .get(name)
          .push(song);
      });

  });


  currentScreen = "list";

  currentPlaylistId = null;
  playlistSelectionMode = false;

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
          heroSongs,
          null
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


  /*
     Selection toolbar
  */

  if (playlistSelectionMode) {

    const toolbar =
      document.createElement(
        "div"
      );


    toolbar.id =
      "playlistSelectionToolbar";


    toolbar.style.cssText =
      `
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      padding:10px 4px 14px;
      `;


    toolbar.innerHTML =
      `
      <span
        style="
          color:#aaa;
          font-size:14px;
        "
      >
        Select songs to add
      </span>

      <button
        id="addSelectedSongsButton"
        type="button"
        style="
          border:0;
          border-radius:10px;
          padding:9px 14px;
          cursor:pointer;
          font-weight:600;
        "
      >
        Add Selected
      </button>
      `;


    songList.appendChild(
      toolbar
    );


    document
      .getElementById(
        "addSelectedSongsButton"
      )
      .addEventListener(
        "click",
        addSelectedSongsToPlaylist
      );
  }


  if (!list.length) {

    const empty =
      document.createElement(
        "div"
      );

    empty.className =
      "empty-state";

    empty.textContent =
      "No songs available.";

    songList.appendChild(
      empty
    );

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


    /*
       Selection mode checkbox
    */

    let checkboxHTML =
      "";


    if (playlistSelectionMode) {

      checkboxHTML =
        `
        <input
          type="checkbox"
          class="playlist-song-checkbox"
          data-song-id="${escapeHTML(
            getSongId(song)
          )}"
          style="
            width:18px;
            height:18px;
            flex:0 0 auto;
            margin-right:4px;
            cursor:pointer;
          "
        >
        `;
    }


    row.innerHTML =
      `
      ${checkboxHTML}

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


    /*
       Normal mode:
       clicking song plays it.

       Selection mode:
       clicking anywhere except More Options toggles
       the checkbox instead.
    */

    row.addEventListener(
      "click",
      event => {

        if (
          event.target.closest(
            ".more-button"
          )
        ) {
          return;
        }


        if (playlistSelectionMode) {

          const checkbox =
            row.querySelector(
              ".playlist-song-checkbox"
            );


          if (
            event.target !== checkbox
          ) {
            checkbox.checked =
              !checkbox.checked;
          }

          return;
        }


        playSong(
          song,
          list
        );
      }
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


  /*
     If a playlist is currently open,
     provide an additional action:
     Go to All Songs.

     This is the important playlist workflow:
     Playlist → ⋮ → Go to All Songs
    */

  const playlistNavigation =
    currentPlaylistId
      ?
        `
        <button data-action="goToAllSongs">
          ♪ &nbsp; Go to All Songs
        </button>
        `
      :
        "";


  /*
     If we are in selection mode, there is no need
     to add a song through this individual menu.
  */

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

    ${
      playlistSelectionMode
        ? ""
        :
        `
        <button data-action="playlist">
          + &nbsp; Add to Playlist
        </button>
        `
    }

    ${playlistNavigation}

    <button data-action="delete">
      🗑 &nbsp;
      ${
        currentPlaylistId
          ? "Remove from Playlist"
          : "Delete"
      }
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


  /*
     Calculate actual menu height after rendering.
  */

  const menuHeight =
    contextMenu.offsetHeight || 340;


  if (
    top + menuHeight >
    window.innerHeight
  ) {

    top =
      rect.top - menuHeight;
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
    .forEach(menuButton => {

      menuButton.addEventListener(
        "click",
        () =>
          handleContextAction(
            menuButton.dataset.action
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


  if (
    action === "goToAllSongs"
  ) {

    goToAllSongsForPlaylist();

    return;
  }


  if (!song)
    return;


  switch (action) {

    case "download":

      downloadSong(song);

      break;


    case "loop":

      currentSong =
        song;

      isLooping =
        true;

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


  link.href =
    file;

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
   DELETE / REMOVE SONG
   ========================================================= */

function deleteSongFromCurrentView(
  song
) {

  /*
     IMPORTANT:

     If we are inside a playlist,
     Delete means:

     REMOVE FROM THIS PLAYLIST ONLY.

     It does NOT delete the actual song.
  */

  if (currentPlaylistId) {

    removeSongFromPlaylist(
      currentPlaylistId,
      song
    );

    return;
  }


  /*
     Normal All Songs / other list behavior.
  */

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
   REMOVE SONG FROM PLAYLIST
   ========================================================= */

function removeSongFromPlaylist(
  playlistId,
  song
) {

  const id =
    String(
      getSongId(song)
    );


  const playlists =
    getPlaylists();


  const playlist =
    playlists.find(
      item =>
        String(item.id) ===
        String(playlistId)
    );


  if (!playlist)
    return;


  const confirmed =
    confirm(
      `Remove "${titleOf(song)}" from "${playlist.name}"?`
    );


  if (!confirmed)
    return;


  playlist.songs =
    playlist.songs.filter(
      songId =>
        String(songId) !== id
    );


  savePlaylists(
    playlists
  );


  /*
     Refresh the current playlist.
  */

  refreshCurrentPlaylist();


  alert(
    `"${titleOf(song)}" removed from "${playlist.name}".`
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
    String(
      getSongId(song)
    );


  /*
     Save deleted song ID.
  */

  const deleted =
    new Set(
      JSON.parse(
        localStorage.getItem(
          "deletedSongs"
        ) || "[]"
      ).map(
        item =>
          String(item)
      )
    );


  deleted.add(id);


  localStorage.setItem(
    "deletedSongs",
    JSON.stringify(
      [...deleted]
    )
  );


  /*
     Remove from actual in-memory library.
  */

  songs =
    songs.filter(
      item =>
        String(getSongId(item)) !== id
    );


  visibleSongs =
    visibleSongs.filter(
      item =>
        String(getSongId(item)) !== id
    );


  queue =
    queue.filter(
      item =>
        String(getSongId(item)) !== id
    );


  /*
     Remove references from ALL playlists.

     This is different from "Remove from Playlist".

     Delete from Database means the actual song
     is removed from the library, so its references
     should also be removed from playlists.
  */

  const playlists =
    getPlaylists();


  playlists.forEach(
    playlist => {

      playlist.songs =
        playlist.songs.filter(
          songId =>
            String(songId) !== id
        );

    }
  );


  savePlaylists(
    playlists
  );


  /*
     If this was the currently playing song,
     stop it.
  */

  if (
    currentSong &&
    String(
      getSongId(currentSong)
    ) === id
  ) {

    audio.pause();

    audio.removeAttribute(
      "src"
    );

    audio.load();

    currentSong = null;

    currentIndex = -1;

    miniPlayer.classList.add(
      "hidden"
    );
  }


  /*
     Refresh the current screen.
  */

  if (currentPlaylistId) {

    refreshCurrentPlaylist();

  } else {

    renderSongs(
      visibleSongs
    );

    renderQueue();
  }
}


/* =========================================================
   PLAYLIST STORAGE
   ========================================================= */

/*
   Create the 7 default playlists ONLY when the
   "playlists" localStorage key does not exist.
*/
function initializePlaylists() {

  const stored =
    localStorage.getItem(
      "playlists"
    );


  /*
     IMPORTANT:

     null means this is the first initialization.

     [] is NOT treated as first initialization.

     Therefore if the user deletes every playlist,
     the folders will NOT come back after refresh.
  */

  if (stored === null) {

    savePlaylists(
      DEFAULT_PLAYLISTS.map(
        playlist => ({
          id: playlist.id,
          name: playlist.name,
          songs: []
        })
      )
    );

    return;
  }


  /*
     If existing data is invalid,
     safely recreate the defaults.
  */

  try {

    const parsed =
      JSON.parse(stored);


    if (!Array.isArray(parsed)) {

      savePlaylists(
        DEFAULT_PLAYLISTS.map(
          playlist => ({
            id: playlist.id,
            name: playlist.name,
            songs: []
          })
        )
      );

    }

  } catch {

    savePlaylists(
      DEFAULT_PLAYLISTS.map(
        playlist => ({
          id: playlist.id,
          name: playlist.name,
          songs: []
        })
      )
    );
  }
}


function getPlaylists() {

  try {

    const playlists =
      JSON.parse(
        localStorage.getItem(
          "playlists"
        ) || "[]"
      );


    if (!Array.isArray(playlists))
      return [];


    return playlists.map(
      playlist => ({
        id:
          String(
            playlist.id ||
            crypto.randomUUID()
          ),

        name:
          String(
            playlist.name ||
            "Untitled Playlist"
          ),

        songs:
          Array.isArray(
            playlist.songs
          )
            ?
              playlist.songs.map(
                id => String(id)
              )
            :
              []
      })
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
   FIND PLAYLIST
   ========================================================= */

function getPlaylistById(
  playlistId
) {

  return getPlaylists()
    .find(
      playlist =>
        String(playlist.id) ===
        String(playlistId)
    );
}


/* =========================================================
   PLAYLIST PAGE
   ========================================================= */

function showPlaylistsPage() {

  currentScreen = "list";

  currentPlaylistId = null;
  playlistSelectionMode = false;

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

      const container =
        document.createElement(
          "div"
        );


      container.className =
        "playlist-item";


      container.style.cssText =
        `
        display:flex;
        align-items:center;
        width:100%;
        box-sizing:border-box;
        gap:10px;
        `;


      /*
         Main folder button
      */

      const folderButton =
        document.createElement(
          "button"
        );


      folderButton.type =
        "button";


      folderButton.style.cssText =
        `
        flex:1;
        min-width:0;
        border:0;
        background:transparent;
        color:inherit;
        padding:0;
        text-align:left;
        cursor:pointer;
        display:flex;
        align-items:center;
        gap:10px;
        `;


      folderButton.innerHTML =
        `
        <span>
          📁
        </span>

        <span
          style="
            overflow:hidden;
            text-overflow:ellipsis;
            white-space:nowrap;
          "
        >
          ${escapeHTML(
            playlist.name
          )}
        </span>

        <span
          style="
            margin-left:auto;
            color:#999;
          "
        >
          ${playlist.songs.length}
        </span>
        `;


      folderButton.addEventListener(
        "click",
        () =>
          openPlaylist(
            playlist.id
          )
      );


      /*
         Rename button
      */

      const renameButton =
        document.createElement(
          "button"
        );


      renameButton.type =
        "button";


      renameButton.title =
        "Rename playlist";


      renameButton.setAttribute(
        "aria-label",
        "Rename playlist"
      );


      renameButton.textContent =
        "✎";


      renameButton.style.cssText =
        `
        border:0;
        background:transparent;
        color:inherit;
        cursor:pointer;
        font-size:17px;
        padding:7px;
        `;


      renameButton.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          renamePlaylist(
            playlist.id
          );
        }
      );


      /*
         Delete folder button
      */

      const deleteButton =
        document.createElement(
          "button"
        );


      deleteButton.type =
        "button";


      deleteButton.title =
        "Delete playlist";


      deleteButton.setAttribute(
        "aria-label",
        "Delete playlist"
      );


      deleteButton.textContent =
        "🗑";


      deleteButton.style.cssText =
        `
        border:0;
        background:transparent;
        color:inherit;
        cursor:pointer;
        font-size:16px;
        padding:7px;
        `;


      deleteButton.addEventListener(
        "click",
        event => {

          event.stopPropagation();

          deletePlaylist(
            playlist.id
          );
        }
      );


      container.appendChild(
        folderButton
      );

      container.appendChild(
        renameButton
      );

      container.appendChild(
        deleteButton
      );


      songList.appendChild(
        container
      );

    }
  );
}


/* =========================================================
   OPEN PLAYLIST
   ========================================================= */

function openPlaylist(
  playlistId
) {

  const playlist =
    getPlaylistById(
      playlistId
    );


  if (!playlist)
    return;


  currentPlaylistId =
    String(
      playlist.id
    );


  const playlistSongs =
    playlist.songs
      .map(
        id =>
          songs.find(
            song =>
              String(
                getSongId(song)
              ) ===
              String(id)
          )
      )
      .filter(Boolean);


  showList(
    playlist.name,
    playlistSongs,
    playlist.id
  );
}


/* =========================================================
   REFRESH CURRENT PLAYLIST
   ========================================================= */

function refreshCurrentPlaylist() {

  if (!currentPlaylistId)
    return;


  const playlist =
    getPlaylistById(
      currentPlaylistId
    );


  if (!playlist) {

    showPlaylistsPage();

    return;
  }


  const playlistSongs =
    playlist.songs
      .map(
        id =>
          songs.find(
            song =>
              String(
                getSongId(song)
              ) ===
              String(id)
          )
      )
      .filter(Boolean);


  showList(
    playlist.name,
    playlistSongs,
    playlist.id
  );
}


/* =========================================================
   RENAME PLAYLIST
   ========================================================= */

function renamePlaylist(
  playlistId
) {

  const playlists =
    getPlaylists();


  const playlist =
    playlists.find(
      item =>
        String(item.id) ===
        String(playlistId)
    );


  if (!playlist)
    return;


  const newName =
    prompt(
      "Enter a new playlist name:",
      playlist.name
    );


  if (newName === null)
    return;


  const trimmed =
    newName.trim();


  if (!trimmed) {

    alert(
      "Playlist name cannot be empty."
    );

    return;
  }


  /*
     Prevent duplicate names.
  */

  const duplicate =
    playlists.some(
      item =>
        String(item.id) !==
          String(playlistId) &&
        item.name.toLowerCase() ===
          trimmed.toLowerCase()
    );


  if (duplicate) {

    alert(
      "A playlist with this name already exists."
    );

    return;
  }


  playlist.name =
    trimmed;


  savePlaylists(
    playlists
  );


  showPlaylistsPage();
}


/* =========================================================
   DELETE PLAYLIST
   ========================================================= */

function deletePlaylist(
  playlistId
) {

  const playlists =
    getPlaylists();


  const playlist =
    playlists.find(
      item =>
        String(item.id) ===
        String(playlistId)
    );


  if (!playlist)
    return;


  const confirmed =
    confirm(
      `Delete playlist "${playlist.name}"?\n\nThe songs themselves will NOT be deleted.`
    );


  if (!confirmed)
    return;


  const remaining =
    playlists.filter(
      item =>
        String(item.id) !==
        String(playlistId)
    );


  savePlaylists(
    remaining
  );


  /*
     If somehow the deleted playlist was open,
     go back to playlist folders.
  */

  if (
    String(currentPlaylistId) ===
    String(playlistId)
  ) {

    currentPlaylistId =
      null;

    playlistSelectionMode =
      false;
  }


  showPlaylistsPage();
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
              playlist.id
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
   ADD SINGLE SONG TO PLAYLIST
   ========================================================= */

function addPendingSongToPlaylist(
  playlistId
) {

  if (!pendingPlaylistSong)
    return;


  const playlists =
    getPlaylists();


  const playlist =
    playlists.find(
      item =>
        String(item.id) ===
        String(playlistId)
    );


  if (!playlist)
    return;


  const id =
    String(
      getSongId(
        pendingPlaylistSong
      )
    );


  /*
     Do not duplicate a song in the same playlist.
  */

  const alreadyExists =
    playlist.songs.some(
      songId =>
        String(songId) === id
    );


  if (alreadyExists) {

    const name =
      playlist.name;


    pendingPlaylistSong =
      null;

    playlistPanel.classList.add(
      "hidden"
    );


    alert(
      `"${titleOf(
        pendingPlaylistSong
      )}" is already in ${name}.`
    );

    return;
  }


  playlist.songs.push(
    id
  );


  savePlaylists(
    playlists
  );


  const addedSong =
    pendingPlaylistSong;


  const playlistName =
    playlist.name;


  pendingPlaylistSong =
    null;


  playlistPanel.classList.add(
    "hidden"
  );


  /*
     If the playlist is currently open,
     refresh it immediately.
  */

  if (
    String(currentPlaylistId) ===
    String(playlistId)
  ) {

    refreshCurrentPlaylist();
  }


  alert(
    `"${titleOf(addedSong)}" added to ${playlistName}.`
  );
}


/* =========================================================
   GO TO ALL SONGS FOR CURRENT PLAYLIST
   ========================================================= */

function goToAllSongsForPlaylist() {

  if (!currentPlaylistId)
    return;


  const playlist =
    getPlaylistById(
      currentPlaylistId
    );


  if (!playlist)
    return;


  /*
     Remember which playlist we came from.
  */

  playlistSelectionMode =
    true;


  currentScreen =
    "list";


  homeScreen.classList.add(
    "hidden"
  );

  playerScreen.classList.add(
    "hidden"
  );

  songListScreen.classList.remove(
    "hidden"
  );


  searchWrap.classList.remove(
    "hidden"
  );


  categoryTitle.textContent =
    `Add Songs to ${playlist.name}`;


  visibleSongs =
    [...songs];


  /*
     Clear old search.
  */

  searchInput.value =
    "";


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


/* =========================================================
   ADD SELECTED SONGS TO CURRENT PLAYLIST
   ========================================================= */

function addSelectedSongsToPlaylist() {

  if (!currentPlaylistId) {

    alert(
      "No playlist is selected."
    );

    return;
  }


  const playlist =
    getPlaylistById(
      currentPlaylistId
    );


  if (!playlist)
    return;


  const checkboxes =
    songList.querySelectorAll(
      ".playlist-song-checkbox:checked"
    );


  if (!checkboxes.length) {

    alert(
      "Please select at least one song."
    );

    return;
  }


  const selectedIds =
    Array.from(
      checkboxes
    ).map(
      checkbox =>
        String(
          checkbox.dataset.songId
        )
    );


  let addedCount =
    0;


  selectedIds.forEach(
    id => {

      const exists =
        playlist.songs.some(
          songId =>
            String(songId) === id
        );


      if (!exists) {

        playlist.songs.push(
          id
        );

        addedCount++;
      }
    }
  );


  savePlaylists(
    getPlaylists().map(
      item =>
        String(item.id) ===
        String(playlist.id)
          ?
            playlist
          :
            item
    )
  );


  playlistSelectionMode =
    false;


  /*
     Return directly to the playlist.
  */

  refreshCurrentPlaylist();


  if (addedCount === 0) {

    alert(
      "All selected songs are already in this playlist."
    );

  } else {

    alert(
      `${addedCount} song${
        addedCount === 1
          ? ""
          : "s"
      } added to "${playlist.name}".`
    );
  }
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

function addRecentlyPlayed(song) {

  const id =
    String(
      getSongId(song)
    );


  const ids =
    JSON.parse(
      localStorage.getItem(
        "recentlyPlayed"
      ) || "[]"
    ).map(
      item =>
        String(item)
    );


  /*
     Remove existing occurrence
     so the song moves to the top.
  */

  const updatedIds =
    ids.filter(
      item =>
        item !== id
    );


  updatedIds.unshift(
    id
  );


  /*
     Maximum 100 songs.
  */

  localStorage.setItem(
    "recentlyPlayed",
    JSON.stringify(
      updatedIds.slice(
        0,
        100
      )
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

  miniPlayer.classList.add(
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

    updateMiniPlayer();
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


  if (
    !playerScreen.classList.contains(
      "hidden"
    )
  ) {

    miniPlayer.classList.add(
      "hidden"
    );

  } else {

    miniPlayer.classList.remove(
      "hidden"
    );
  }


  const newCover =
    coverOf(currentSong);


  if (
    miniCover.getAttribute(
      "src"
    ) !== newCover
  ) {

    miniCover.src =
      newCover;
  }


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


  playButton.textContent =
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

    audio.currentTime =
      0;

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

    audio.currentTime =
      0;

    return;
  }


  currentIndex--;


  if (
    currentIndex < 0
  ) {

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
   SEARCH
   ========================================================= */

searchInput.addEventListener(
  "input",
  () => {

    const q =
      searchInput.value
        .trim()
        .toLowerCase();


    /*
       In normal lists, search only within
       the current visible list.

       In playlist selection mode,
       search all songs.
    */

    const source =
      playlistSelectionMode
        ? songs
        : visibleSongs;


    const filtered =
      source.filter(song => {

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


    renderSongs(
      filtered
    );
  }
);


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


/* HEADER MENU */

headerMenuButton.addEventListener(
  "click",
  () => {

    /*
       When inside a playlist,
       the header ⋮ gives playlist navigation.
    */

    if (currentPlaylistId) {

      const playlist =
        getPlaylistById(
          currentPlaylistId
        );


      if (!playlist)
        return;


      contextMenu.innerHTML =
        `
        <button data-action="goToAllSongs">
          ♪ &nbsp; Go to All Songs
        </button>

        <button data-action="playlistHome">
          📁 &nbsp; Back to Playlists
        </button>
        `;


      const rect =
        headerMenuButton
          .getBoundingClientRect();


      contextMenu.classList.remove(
        "hidden"
      );


      const menuWidth =
        Math.min(
          280,
          window.innerWidth - 28
        );


      let left =
        rect.right -
        menuWidth;


      let top =
        rect.bottom + 6;


      if (left < 14)
        left = 14;


      if (
        top + 120 >
        window.innerHeight
      ) {

        top =
          rect.top - 120;
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
            () => {

              const action =
                button.dataset.action;


              closeContextMenu();


              if (
                action ===
                "goToAllSongs"
              ) {

                goToAllSongsForPlaylist();

              } else if (
                action ===
                "playlistHome"
              ) {

                showPlaylistsPage();
              }

            }
          );

        });


      return;
    }


    /*
       Normal lists keep existing Queue behavior.
    */

    openQueue();
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
      ) &&
      event.target !==
        headerMenuButton
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