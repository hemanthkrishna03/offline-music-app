/* =========================================================
   MUSIC APP - APP.JS
   =========================================================
   Main sections:
   1. Metadata
   2. Home screen
   3. Song list
   4. Player
   5. Queue
   6. Recently Played
   7. Favourite Hero
   8. Playlists
   ========================================================= */


/* =========================================================
   1. GLOBAL VARIABLES
========================================================= */

let songs = [];
let currentIndex = -1;

let queue = [];
let queueIndex = 0;

let isPlaying = false;
let isLooping = false;
let playNextEnabled = true;

let currentCategory = "allSongs";


/* =========================================================
   DOM REFERENCES
========================================================= */

const homeScreen = document.getElementById("homeScreen");
const songListScreen = document.getElementById("songListScreen");

const songList = document.getElementById("songList");
const searchInput = document.getElementById("search");

const audio = document.getElementById("audio");

const albumCover = document.getElementById("albumCover");
const songTitle = document.getElementById("songTitle");
const songArtist = document.getElementById("songArtist");
const songYear = document.getElementById("songYear");

const progress = document.getElementById("progress");

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

const queueList =
    document.getElementById("queueList");

const playNextToggle =
    document.getElementById("playNextToggle");


/* =========================================================
   2. LOAD METADATA
========================================================= */

async function loadSongs() {

    try {

        const response = await fetch("songs_metadata.json");

        if (!response.ok) {
            throw new Error(
                `Metadata loading failed: ${response.status}`
            );
        }

        songs = await response.json();

        console.log(
            `Loaded ${songs.length} songs`
        );

        initialiseApp();

    } catch (error) {

        console.error(
            "Unable to load song metadata:",
            error
        );

        showLoadingError();
    }
}


/* =========================================================
   INITIALISE APP
========================================================= */

function initialiseApp() {

    /*
       The first screen should be the Home screen.
    */

    showHomeScreen();

    /*
       Prepare the complete song collection.
    */

    queue = [...songs];

    renderQueue();
}


/* =========================================================
   ERROR MESSAGE
========================================================= */

function showLoadingError() {

    if (songList) {

        songList.innerHTML = `
            <li class="empty-state">
                Unable to load music library.
            </li>
        `;
    }
}


/* =========================================================
   3. HOME SCREEN
========================================================= */


/*
   Open a category from the Home screen.
*/

function openCategory(category) {

    currentCategory = category;

    switch (category) {

        case "allSongs":
            showAllSongs();
            break;

        case "recentlyPlayed":
            showRecentlyPlayed();
            break;

        case "favouriteHero":
            showFavouriteHeroes();
            break;

        case "playlists":
            showPlaylists();
            break;

        default:
            showAllSongs();
            break;
    }
}


/* =========================================================
   SHOW HOME
========================================================= */

function showHomeScreen() {

    if (homeScreen) {
        homeScreen.style.display = "block";
    }

    if (songListScreen) {
        songListScreen.style.display = "none";
    }
}


/* =========================================================
   SHOW SONG LIST SCREEN
========================================================= */

function showSongListScreen() {

    if (homeScreen) {
        homeScreen.style.display = "none";
    }

    if (songListScreen) {
        songListScreen.style.display = "block";
    }
}


/* =========================================================
   BACK TO HOME
========================================================= */

function goHome() {

    showHomeScreen();

    currentCategory = "allSongs";
}


/* =========================================================
   4. CATEGORY - ALL SONGS
========================================================= */

function showAllSongs() {

    showSongListScreen();

    renderSongs(songs);

    updateCategoryTitle("All Songs");
}


/* =========================================================
   5. CATEGORY - RECENTLY PLAYED
========================================================= */

function showRecentlyPlayed() {

    showSongListScreen();

    const recentlyPlayed =
        getRecentlyPlayed();

    renderSongs(recentlyPlayed);

    updateCategoryTitle("Recently Played");
}


/* =========================================================
   RECENTLY PLAYED STORAGE
========================================================= */

function getRecentlyPlayed() {

    const stored =
        localStorage.getItem("recentlyPlayed");

    if (!stored) {
        return [];
    }

    try {

        const ids = JSON.parse(stored);

        return ids
            .map(id =>
                songs.find(song =>
                    getSongId(song) === id
                )
            )
            .filter(Boolean);

    } catch {

        return [];
    }
}


/* =========================================================
   ADD RECENTLY PLAYED
========================================================= */

function addRecentlyPlayed(song) {

    if (!song) {
        return;
    }

    const id = getSongId(song);

    let recentlyPlayed =
        getRecentlyPlayed()
            .map(item => getSongId(item));

    recentlyPlayed =
        recentlyPlayed.filter(
            itemId => itemId !== id
        );

    recentlyPlayed.unshift(id);

    /*
       Keep only the latest 50 songs.
    */

    recentlyPlayed =
        recentlyPlayed.slice(0, 50);

    localStorage.setItem(
        "recentlyPlayed",
        JSON.stringify(recentlyPlayed)
    );
}


/* =========================================================
   6. CATEGORY - FAVOURITE HERO
========================================================= */

function showFavouriteHeroes() {

    showSongListScreen();

    const heroes =
        getFavouriteHeroes();

    renderHeroList(heroes);

    updateCategoryTitle("Favourite Hero");
}


/* =========================================================
   GET HERO LIST
========================================================= */

function getFavouriteHeroes() {

    /*
       We will use the metadata field "heroes"
       if it exists.

       Example:

       "heroes": [
           "Hero Name"
       ]
    */

    const heroMap = new Map();

    songs.forEach(song => {

        let heroes =
            song.heroes ||
            song.Heroes ||
            song.hero ||
            song.Hero ||
            [];

        if (!Array.isArray(heroes)) {

            heroes = [
                heroes
            ];
        }

        heroes.forEach(hero => {

            if (!hero) {
                return;
            }

            const name =
                String(hero).trim();

            if (!name) {
                return;
            }

            if (!heroMap.has(name)) {

                heroMap.set(name, {
                    name: name,
                    songs: []
                });
            }

            heroMap
                .get(name)
                .songs
                .push(song);
        });
    });

    return Array.from(
        heroMap.values()
    );
}


/* =========================================================
   RENDER HERO LIST
========================================================= */

function renderHeroList(heroes) {

    if (!songList) {
        return;
    }

    songList.innerHTML = "";

    if (!heroes.length) {

        songList.innerHTML = `
            <li class="empty-state">
                No heroes available.
            </li>
        `;

        return;
    }

    heroes.forEach(hero => {

        const li =
            document.createElement("li");

        li.className =
            "hero-list-item";

        li.innerHTML = `
            <div class="song-info">
                <div class="song-details">
                    <span class="title">
                        ${escapeHTML(hero.name)}
                    </span>

                    <span class="artist">
                        ${hero.songs.length} songs
                    </span>
                </div>
            </div>
        `;

        li.addEventListener(
            "click",
            () => {

                renderSongs(hero.songs);

                updateCategoryTitle(
                    hero.name
                );
            }
        );

        songList.appendChild(li);
    });
}


/* =========================================================
   7. CATEGORY - PLAYLISTS
========================================================= */

function showPlaylists() {

    showSongListScreen();

    renderPlaylists();

    updateCategoryTitle("Playlists");
}


/* =========================================================
   PLAYLIST STORAGE
========================================================= */

function getPlaylists() {

    const stored =
        localStorage.getItem("playlists");

    if (!stored) {
        return [];
    }

    try {

        return JSON.parse(stored);

    } catch {

        return [];
    }
}


/* =========================================================
   RENDER PLAYLISTS
========================================================= */

function renderPlaylists() {

    if (!songList) {
        return;
    }

    const playlists =
        getPlaylists();

    songList.innerHTML = "";

    if (!playlists.length) {

        songList.innerHTML = `
            <li class="empty-state">
                No playlists created yet.
            </li>
        `;

        return;
    }

    playlists.forEach(playlist => {

        const li =
            document.createElement("li");

        li.innerHTML = `
            <div class="song-info">
                <div class="song-details">

                    <span class="title">
                        ${escapeHTML(
                            playlist.name
                        )}
                    </span>

                    <span class="artist">
                        ${playlist.songs.length} songs
                    </span>

                </div>
            </div>
        `;

        li.addEventListener(
            "click",
            () => {

                const playlistSongs =
                    playlist.songs
                        .map(id =>
                            songs.find(
                                song =>
                                    getSongId(song) === id
                            )
                        )
                        .filter(Boolean);

                renderSongs(
                    playlistSongs
                );

                updateCategoryTitle(
                    playlist.name
                );
            }
        );

        songList.appendChild(li);
    });
}


/* =========================================================
   8. RENDER SONGS
========================================================= */

function renderSongs(songArray) {

    if (!songList) {
        return;
    }

    songList.innerHTML = "";

    if (!songArray.length) {

        songList.innerHTML = `
            <li class="empty-state">
                No songs available.
            </li>
        `;

        return;
    }

    songArray.forEach(
        (song, index) => {

            const li =
                document.createElement("li");

            li.dataset.songId =
                getSongId(song);

            /*
               Song cover
            */

            const cover =
                song.cover ||
                song.coverArt ||
                song.albumCover ||
                "";

            /*
               Artist / singer
            */

            const artist =
                song.Singers ||
                song.singers ||
                song.artist ||
                song.artists ||
                song.albumArtist ||
                "Unknown Artist";

            /*
               Year
            */

            const year =
                song.year ||
                song.Year ||
                "";

            li.innerHTML = `
                <div class="song-info">

                    ${
                        cover
                        ?
                        `
                        <img
                            src="${escapeAttribute(
                                cover
                            )}"
                            alt=""
                        >
                        `
                        :
                        ""
                    }

                    <div class="song-details">

                        <span class="title">
                            ${escapeHTML(
                                song.title ||
                                "Unknown Song"
                            )}
                        </span>

                        <span class="artist">
                            ${escapeHTML(
                                formatArtist(
                                    artist
                                )
                            )}
                            ${
                                year
                                ?
                                ` • ${escapeHTML(
                                    String(year)
                                )}`
                                :
                                ""
                            }
                        </span>

                    </div>

                </div>
            `;

            li.addEventListener(
                "click",
                () => {

                    playSong(
                        song,
                        songArray
                    );
                }
            );

            songList.appendChild(li);
        }
    );

    highlightCurrentSong();
}


/* =========================================================
   UPDATE CATEGORY TITLE
========================================================= */

function updateCategoryTitle(title) {

    const heading =
        document.getElementById(
            "categoryTitle"
        );

    if (heading) {
        heading.textContent = title;
    }
}


/* =========================================================
   9. SEARCH
========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const filtered =
                songs.filter(song => {

                    const title =
                        String(
                            song.title || ""
                        ).toLowerCase();

                    const artist =
                        String(
                            song.Singers ||
                            song.singers ||
                            song.artist ||
                            ""
                        ).toLowerCase();

                    const album =
                        String(
                            song.album ||
                            ""
                        ).toLowerCase();

                    return (
                        title.includes(query) ||
                        artist.includes(query) ||
                        album.includes(query)
                    );
                });

            renderSongs(filtered);
        }
    );
}


/* =========================================================
   10. PLAY SONG
========================================================= */

function playSong(song, songArray = songs) {

    if (!song) {
        return;
    }

    /*
       Make the current list the playback list.
    */

    queue = [...songArray];

    currentIndex =
        queue.findIndex(
            item =>
                getSongId(item) ===
                getSongId(song)
        );

    if (currentIndex < 0) {
        currentIndex = 0;
    }

    const file =
        song.file ||
        song.url ||
        song.src;

    if (!file) {

        console.error(
            "Song file not found:",
            song
        );

        return;
    }

    /*
       Set audio source.
    */

    if (audio) {

        audio.src = file;

        audio.load();

        audio.play()
            .then(() => {

                isPlaying = true;

                updatePlayButton();

            })
            .catch(error => {

                console.error(
                    "Playback failed:",
                    error
                );
            });
    }

    /*
       Update player information.
    */

    updatePlayer(song);

    /*
       Store recently played.
    */

    addRecentlyPlayed(song);

    /*
       Highlight the current song.
    */

    highlightCurrentSong();

    /*
       Update queue.
    */

    renderQueue();
}


/* =========================================================
   UPDATE PLAYER
========================================================= */

function updatePlayer(song) {

    if (!song) {
        return;
    }

    if (albumCover) {

        const cover =
            song.cover ||
            song.coverArt ||
            song.albumCover ||
            "";

        if (cover) {

            albumCover.src =
                cover;

            albumCover.alt =
                song.title ||
                "Album cover";
        }
    }


    if (songTitle) {

        songTitle.textContent =
            song.title ||
            "Unknown Song";
    }


    if (songArtist) {

        const artist =
            song.Singers ||
            song.singers ||
            song.artist ||
            song.artists ||
            song.albumArtist ||
            "Unknown Artist";

        songArtist.textContent =
            formatArtist(artist);
    }


    if (songYear) {

        songYear.textContent =
            song.year ||
            song.Year ||
            "";
    }
}


/* =========================================================
   FORMAT ARTIST
========================================================= */

function formatArtist(artist) {

    if (Array.isArray(artist)) {

        return artist.join(", ");
    }

    return String(artist);
}


/* =========================================================
   11. PLAY / PAUSE
========================================================= */

function togglePlayPause() {

    if (!audio) {
        return;
    }

    if (!audio.src) {

        if (queue.length) {

            playSong(
                queue[0],
                queue
            );
        }

        return;
    }

    if (audio.paused) {

        audio.play();

        isPlaying = true;

    } else {

        audio.pause();

        isPlaying = false;
    }

    updatePlayButton();
}


/* =========================================================
   PLAY BUTTON
========================================================= */

if (playButton) {

    playButton.addEventListener(
        "click",
        togglePlayPause
    );
}


/* =========================================================
   AUDIO PLAY
========================================================= */

if (audio) {

    audio.addEventListener(
        "play",
        () => {

            isPlaying = true;

            updatePlayButton();
        }
    );


    audio.addEventListener(
        "pause",
        () => {

            isPlaying = false;

            updatePlayButton();
        }
    );


    audio.addEventListener(
        "ended",
        () => {

            isPlaying = false;

            handleSongEnded();
        }
    );


    audio.addEventListener(
        "loadedmetadata",
        () => {

            updateDuration();
        }
    );


    audio.addEventListener(
        "timeupdate",
        () => {

            updateProgress();
        }
    );
}


/* =========================================================
   UPDATE PLAY BUTTON
========================================================= */

function updatePlayButton() {

    if (!playButton) {
        return;
    }

    playButton.textContent =
        isPlaying
        ? "❚❚"
        : "▶";
}


/* =========================================================
   12. NEXT SONG
========================================================= */

function playNext() {

    if (!queue.length) {
        return;
    }

    /*
       If play-next is disabled,
       don't automatically advance.
    */

    if (
        !playNextEnabled &&
        !isLooping
    ) {
        return;
    }

    /*
       Loop current song.
    */

    if (isLooping) {

        const currentSong =
            queue[currentIndex];

        playSong(
            currentSong,
            queue
        );

        return;
    }

    currentIndex++;

    /*
       End of queue.
    */

    if (currentIndex >= queue.length) {

        currentIndex = 0;
    }

    playSong(
        queue[currentIndex],
        queue
    );
}


if (nextButton) {

    nextButton.addEventListener(
        "click",
        playNext
    );
}


/* =========================================================
   13. PREVIOUS SONG
========================================================= */

function playPrevious() {

    if (!queue.length) {
        return;
    }

    /*
       If song has already played
       for more than 3 seconds,
       restart it.
    */

    if (
        audio &&
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


if (previousButton) {

    previousButton.addEventListener(
        "click",
        playPrevious
    );
}


/* =========================================================
   SONG ENDED
========================================================= */

function handleSongEnded() {

    if (isLooping) {

        playNext();

        return;
    }

    if (!playNextEnabled) {

        updatePlayButton();

        return;
    }

    playNext();
}


/* =========================================================
   14. LOOP
========================================================= */

function toggleLoop() {

    isLooping =
        !isLooping;

    updateLoopButton();
}


function updateLoopButton() {

    if (!loopButton) {
        return;
    }

    loopButton.classList.toggle(
        "active",
        isLooping
    );
}


if (loopButton) {

    loopButton.addEventListener(
        "click",
        toggleLoop
    );
}


/* =========================================================
   15. PROGRESS BAR
========================================================= */

function updateProgress() {

    if (!audio || !progress) {
        return;
    }

    if (!audio.duration) {
        return;
    }

    const percentage =
        (
            audio.currentTime /
            audio.duration
        ) * 100;

    progress.value =
        percentage;

    updateCurrentTime();
}


function updateCurrentTime() {

    if (!audio || !currentTimeElement) {
        return;
    }

    currentTimeElement.textContent =
        formatTime(
            audio.currentTime
        );
}


function updateDuration() {

    if (!audio || !durationElement) {
        return;
    }

    durationElement.textContent =
        formatTime(
            audio.duration
        );
}


/* =========================================================
   SEEK
========================================================= */

if (progress) {

    progress.addEventListener(
        "input",
        () => {

            if (!audio || !audio.duration) {
                return;
            }

            const percentage =
                Number(
                    progress.value
                );

            audio.currentTime =
                (
                    percentage / 100
                ) *
                audio.duration;
        }
    );
}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(seconds) {

    if (
        !Number.isFinite(seconds) ||
        seconds < 0
    ) {
        return "0:00";
    }

    const minutes =
        Math.floor(
            seconds / 60
        );

    const remainingSeconds =
        Math.floor(
            seconds % 60
        );

    return (
        `${minutes}:` +
        `${String(
            remainingSeconds
        ).padStart(2, "0")}`
    );
}


/* =========================================================
   16. QUEUE
========================================================= */

function addToQueue(song) {

    if (!song) {
        return;
    }

    queue.push(song);

    renderQueue();
}


/* =========================================================
   REMOVE FROM QUEUE
========================================================= */

function removeFromQueue(index) {

    if (
        index < 0 ||
        index >= queue.length
    ) {
        return;
    }

    queue.splice(
        index,
        1
    );

    if (
        currentIndex >= queue.length
    ) {
        currentIndex =
            queue.length - 1;
    }

    renderQueue();
}


/* =========================================================
   RENDER QUEUE
========================================================= */

function renderQueue() {

    if (!queueList) {
        return;
    }

    queueList.innerHTML = "";

    queue.forEach(
        (song, index) => {

            const li =
                document.createElement("li");

            li.dataset.index =
                index;

            const artist =
                song.Singers ||
                song.singers ||
                song.artist ||
                song.albumArtist ||
                "Unknown Artist";

            li.innerHTML = `
                <div class="song-info">

                    <div class="song-details">

                        <span class="title">
                            ${escapeHTML(
                                song.title ||
                                "Unknown Song"
                            )}
                        </span>

                        <span class="artist">
                            ${escapeHTML(
                                formatArtist(
                                    artist
                                )
                            )}
                        </span>

                    </div>

                </div>
            `;

            li.addEventListener(
                "click",
                () => {

                    playSong(
                        song,
                        queue
                    );
                }
            );

            queueList.appendChild(li);
        }
    );
}


/* =========================================================
   PLAY NEXT TOGGLE
========================================================= */

function updatePlayNextState() {

    if (!playNextToggle) {
        return;
    }

    playNextEnabled =
        playNextToggle.checked;
}


if (playNextToggle) {

    playNextToggle.addEventListener(
        "change",
        updatePlayNextState
    );
}


/* =========================================================
   17. HIGHLIGHT CURRENT SONG
========================================================= */

function highlightCurrentSong() {

    if (!songList) {
        return;
    }

    const items =
        songList.querySelectorAll(
            "li[data-song-id]"
        );

    items.forEach(item => {

        const isCurrent =
            currentIndex >= 0 &&
            queue[currentIndex] &&
            item.dataset.songId ===
            getSongId(
                queue[currentIndex]
            );

        item.classList.toggle(
            "playing",
            isCurrent
        );
    });
}


/* =========================================================
   18. SONG ID
========================================================= */

function getSongId(song) {

    if (!song) {
        return "";
    }

    /*
       Prefer an explicit ID.
    */

    if (song.id !== undefined) {

        return String(song.id);
    }

    /*
       Otherwise use the file path.
    */

    if (song.file) {

        return String(song.file);
    }

    /*
       Last fallback:
       title + year
    */

    return (
        `${song.title || ""}` +
        "_" +
        `${song.year || ""}`
    );
}


/* =========================================================
   19. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}


function escapeAttribute(value) {

    return escapeHTML(value);
}


/* =========================================================
   20. KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /*
           Don't interfere while typing.
        */

        if (
            event.target.tagName ===
            "INPUT"
        ) {
            return;
        }


        /*
           Space = Play / Pause
        */

        if (
            event.code ===
            "Space"
        ) {

            event.preventDefault();

            togglePlayPause();
        }


        /*
           Arrow Right = Next
        */

        if (
            event.code ===
            "ArrowRight"
        ) {

            playNext();
        }


        /*
           Arrow Left = Previous
        */

        if (
            event.code ===
            "ArrowLeft"
        ) {

            playPrevious();
        }
    }
);


/* =========================================================
   21. PAGE VISIBILITY
========================================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        /*
           We intentionally DO NOT pause
           music when the browser tab becomes
           hidden.

           This allows normal background playback.
        */

    }
);


/* =========================================================
   22. START APPLICATION
========================================================= */

loadSongs();