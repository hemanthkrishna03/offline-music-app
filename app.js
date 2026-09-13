/* =========================================================
   MY MUSIC - APP.JS
   ========================================================= */


/* =========================================================
   1. GLOBAL VARIABLES
   ========================================================= */

let songs = [];

let currentSong = null;
let currentIndex = -1;

let queue = [];

let isLooping = false;
let playNextEnabled = true;


/* =========================================================
   2. DOM REFERENCES
   ========================================================= */

const homeScreen =
    document.getElementById("homeScreen");

const songListScreen =
    document.getElementById("songListScreen");

const playerScreen =
    document.getElementById("playerScreen");

const songList =
    document.getElementById("songList");

const searchInput =
    document.getElementById("search");

const categoryTitle =
    document.getElementById("categoryTitle");

const backButton =
    document.getElementById("backButton");

const playerBackButton =
    document.getElementById("playerBackButton");

const audio =
    document.getElementById("audio");


/* =========================================================
   MINI PLAYER
   ========================================================= */

const miniPlayer =
    document.getElementById("miniPlayer");

const miniCover =
    document.getElementById("miniCover");

const miniTitle =
    document.getElementById("miniTitle");

const miniArtist =
    document.getElementById("miniArtist");

const miniSongButton =
    document.getElementById("miniSongButton");

const miniQueueButton =
    document.getElementById("miniQueueButton");

const miniLoopButton =
    document.getElementById("miniLoopButton");

const miniPlayButton =
    document.getElementById("miniPlayButton");


/* =========================================================
   FULL PLAYER
   ========================================================= */

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

const currentTime =
    document.getElementById("currentTime");

const duration =
    document.getElementById("duration");

const previousButton =
    document.getElementById("previousButton");

const playButton =
    document.getElementById("playButton");

const nextButton =
    document.getElementById("nextButton");

const loopButton =
    document.getElementById("loopButton");

const playNextToggleButton =
    document.getElementById("playNextToggleButton");


/* =========================================================
   QUEUE
   ========================================================= */

const queuePanel =
    document.getElementById("queuePanel");

const queueList =
    document.getElementById("queueList");

const closeQueueButton =
    document.getElementById("closeQueueButton");

const playerQueueButton =
    document.getElementById("playerQueueButton");


/* =========================================================
   PLAYLIST
   ========================================================= */

const playlistPanel =
    document.getElementById("playlistPanel");

const playlistList =
    document.getElementById("playlistList");

const closePlaylistButton =
    document.getElementById("closePlaylistButton");


/* =========================================================
   CONTEXT MENU
   ========================================================= */

const contextMenu =
    document.getElementById("contextMenu");


let contextSong = null;


/* =========================================================
   3. ASSET PATH FIX
   ========================================================= */

/*
   Your metadata contains:

   /music/Akhanda.mp3
   /covers/Akhanda.jpg

   Your PWA contains:

   songs/Akhanda.mp3
   covers/Akhanda.jpg

   This function automatically converts
   the metadata paths to the PWA paths.
*/

function getAssetPath(path) {

    if (!path) {
        return "";
    }

    let cleanPath =
        String(path).trim();

    cleanPath =
        cleanPath.replace(
            /^\/music\//i,
            "songs/"
        );

    cleanPath =
        cleanPath.replace(
            /^\/covers\//i,
            "covers/"
        );

    cleanPath =
        cleanPath.replace(
            /^\/+/,
            ""
        );

    return encodeURI(cleanPath);
}


/* =========================================================
   4. GET SONG COVER
   ========================================================= */

function getSongCover(song) {

    if (!song) {
        return "";
    }

    const cover =
        song.cover ||
        song.coverArt ||
        song.albumCover ||
        "";

    return getAssetPath(cover);
}


/* =========================================================
   5. GET SONG FILE
   ========================================================= */

function getSongFile(song) {

    if (!song) {
        return "";
    }

    const file =
        song.file ||
        song.url ||
        song.src ||
        "";

    return getAssetPath(file);
}


/* =========================================================
   6. GET SONG ARTIST
   ========================================================= */

function getSongArtist(song) {

    if (!song) {
        return "Unknown Artist";
    }

    const artist =
        song.Singers ||
        song.singers ||
        song.artist ||
        song.artists ||
        song.albumArtist ||
        "Unknown Artist";

    if (Array.isArray(artist)) {
        return artist.join(", ");
    }

    return String(artist);
}


/* =========================================================
   7. GET SONG ID
   ========================================================= */

function getSongId(song) {

    if (!song) {
        return "";
    }

    if (song.id !== undefined) {
        return String(song.id);
    }

    if (song.file) {
        return String(song.file);
    }

    return (
        String(song.title || "") +
        "|" +
        String(song.year || "")
    );
}


/* =========================================================
   8. ESCAPE HTML
   ========================================================= */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


/* =========================================================
   9. LOAD SONG METADATA
   ========================================================= */

async function loadSongs() {

    try {

        const response =
            await fetch(
                "songs_metadata1.json"
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load songs_metadata1.json"
            );
        }

        const data =
            await response.json();

        if (!Array.isArray(data)) {

            throw new Error(
                "Metadata file does not contain an array"
            );
        }

        songs = data;

        console.log(
            "Songs loaded:",
            songs.length
        );

        queue = [...songs];

        renderQueue();

        setupCategoryButtons();

        showHomeScreen();

    } catch (error) {

        console.error(
            "Music library loading error:",
            error
        );

        if (songList) {

            songList.innerHTML = `
                <div class="empty-state">
                    Unable to load music library.
                </div>
            `;
        }
    }
}


/* =========================================================
   10. CATEGORY BUTTONS
   ========================================================= */

function setupCategoryButtons() {

    const buttons =
        document.querySelectorAll(
            ".category-card"
        );

    buttons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const category =
                    button.dataset.category;

                openCategory(category);
            }
        );
    });
}


/* =========================================================
   11. OPEN CATEGORY
   ========================================================= */

function openCategory(category) {

    if (category === "allSongs") {

        showAllSongs();

        return;
    }

    if (category === "recentlyPlayed") {

        showRecentlyPlayed();

        return;
    }

    if (category === "favouriteHero") {

        showFavouriteHeroes();

        return;
    }

    if (category === "playlists") {

        showPlaylists();

        return;
    }

    showAllSongs();
}


/* =========================================================
   12. HOME SCREEN
   ========================================================= */

function showHomeScreen() {

    if (homeScreen) {
        homeScreen.classList.remove("hidden");
        homeScreen.style.display = "block";
    }

    if (songListScreen) {
        songListScreen.classList.add("hidden");
        songListScreen.style.display = "none";
    }

    if (playerScreen) {
        playerScreen.classList.add("hidden");
        playerScreen.style.display = "none";
    }
}


/* =========================================================
   13. SONG LIST SCREEN
   ========================================================= */

function showSongListScreen() {

    if (homeScreen) {
        homeScreen.classList.add("hidden");
        homeScreen.style.display = "none";
    }

    if (songListScreen) {
        songListScreen.classList.remove("hidden");
        songListScreen.style.display = "block";
    }

    if (playerScreen) {
        playerScreen.classList.add("hidden");
        playerScreen.style.display = "none";
    }
}


/* =========================================================
   14. FULL PLAYER SCREEN
   ========================================================= */

function showPlayerScreen() {

    if (homeScreen) {
        homeScreen.classList.add("hidden");
        homeScreen.style.display = "none";
    }

    if (songListScreen) {
        songListScreen.classList.add("hidden");
        songListScreen.style.display = "none";
    }

    if (playerScreen) {
        playerScreen.classList.remove("hidden");
        playerScreen.style.display = "block";
    }
}


/* =========================================================
   15. BACK BUTTON
   ========================================================= */

if (backButton) {

    backButton.addEventListener(
        "click",
        () => {

            showHomeScreen();
        }
    );
}


if (playerBackButton) {

    playerBackButton.addEventListener(
        "click",
        () => {

            if (songListScreen) {

                showSongListScreen();

            } else {

                showHomeScreen();
            }
        }
    );
}


/* =========================================================
   16. ALL SONGS
   ========================================================= */

function showAllSongs() {

    showSongListScreen();

    if (categoryTitle) {
        categoryTitle.textContent =
            "All Songs";
    }

    renderSongs(songs);
}


/* =========================================================
   17. RENDER SONGS
   ========================================================= */

function renderSongs(songArray) {

    if (!songList) {
        return;
    }

    songList.innerHTML = "";

    if (!songArray || !songArray.length) {

        songList.innerHTML = `
            <div class="empty-state">
                No songs available.
            </div>
        `;

        return;
    }


    songArray.forEach(
        (song, index) => {

            const item =
                document.createElement("div");

            item.className =
                "song-item";

            item.dataset.songId =
                getSongId(song);


            const cover =
                getSongCover(song);

            const artist =
                getSongArtist(song);

            const title =
                song.title ||
                "Unknown Song";

            const year =
                song.year ||
                "";


            /*
               IMPORTANT:

               The image is always created
               when a cover path exists.
            */

            item.innerHTML = `

                <div class="song-cover">

                    ${
                        cover
                        ?
                        `
                        <img
                            src="${escapeHTML(cover)}"
                            alt=""
                            loading="lazy"
                            onerror="
                                this.style.display='none';
                            "
                        >
                        `
                        :
                        ""
                    }

                </div>


                <div class="song-info">

                    <div class="song-title">

                        ${escapeHTML(title)}

                    </div>


                    <div class="song-artist">

                        ${escapeHTML(artist)}

                        ${
                            year &&
                            year !== "Unknown"
                            ?
                            `
                            <span>
                                •
                                ${escapeHTML(year)}
                            </span>
                            `
                            :
                            ""
                        }

                    </div>

                </div>


                <button
                    class="song-more"
                    type="button"
                    aria-label="More options"
                >
                    ⋮
                </button>

            `;


            /*
               Clicking the three dots
               should NOT play the song.
            */

            const moreButton =
                item.querySelector(
                    ".song-more"
                );


            if (moreButton) {

                moreButton.addEventListener(
                    "click",
                    event => {

                        event.stopPropagation();

                        openContextMenu(
                            song,
                            event
                        );
                    }
                );
            }


            /*
               Clicking anywhere else
               on the song plays it.
            */

            item.addEventListener(
                "click",
                event => {

                    if (
                        event.target.closest(
                            ".song-more"
                        )
                    ) {
                        return;
                    }

                    playSong(
                        song,
                        songArray
                    );
                }
            );


            songList.appendChild(item);
        }
    );


    highlightCurrentSong();
}


/* =========================================================
   18. PLAY SONG
   ========================================================= */

async function playSong(
    song,
    songArray = songs
) {

    if (!song) {
        return;
    }

    const file =
        getSongFile(song);


    /*
       IMPORTANT:

       Stop here if metadata doesn't
       contain a valid file.
    */

    if (!file) {

        console.error(
            "No audio file found:",
            song
        );

        return;
    }


    /*
       Set the playback queue.
    */

    queue =
        Array.isArray(songArray)
        ? [...songArray]
        : [...songs];


    /*
       Find the current song
       inside the queue.
    */

    currentIndex =
        queue.findIndex(
            item =>
                getSongId(item) ===
                getSongId(song)
        );


    if (currentIndex < 0) {
        currentIndex = 0;
    }


    currentSong = song;


    console.log(
        "Playing:",
        song.title
    );

    console.log(
        "Audio path:",
        file
    );


    /*
       Update player UI
       before starting audio.
    */

    updatePlayer(song);

    updateMiniPlayer(song);


    /*
       Set actual audio source.
    */

    if (!audio) {
        return;
    }


    try {

        audio.pause();

        audio.src = file;

        audio.load();


        /*
           Start playback.
        */

        await audio.play();


        updatePlayButton();

    } catch (error) {

        console.error(
            "Unable to play song:",
            error
        );

        /*
           Even if autoplay is blocked,
           the song is loaded and the
           play button can start it.
        */

        updatePlayButton();
    }


    /*
       Save Recently Played.
    */

    addRecentlyPlayed(song);


    /*
       Refresh UI.
    */

    highlightCurrentSong();

    renderQueue();

    showMiniPlayer();
}


/* =========================================================
   19. UPDATE FULL PLAYER
   ========================================================= */

function updatePlayer(song) {

    if (!song) {
        return;
    }


    const cover =
        getSongCover(song);

    const artist =
        getSongArtist(song);


    if (albumCover) {

        if (cover) {

            albumCover.src =
                cover;

            albumCover.alt =
                song.title ||
                "Album cover";

        } else {

            albumCover.removeAttribute(
                "src"
            );
        }
    }


    if (songTitle) {

        songTitle.textContent =
            song.title ||
            "Unknown Song";
    }


    if (songArtist) {

        songArtist.textContent =
            artist;
    }


    if (songYear) {

        songYear.textContent =
            song.year ||
            "";
    }


    if (currentTime) {

        currentTime.textContent =
            "0:00";
    }


    if (duration) {

        duration.textContent =
            "0:00";
    }


    if (progress) {

        progress.value = 0;
    }
}


/* =========================================================
   20. MINI PLAYER
   ========================================================= */

function updateMiniPlayer(song) {

    if (!song) {
        return;
    }


    const cover =
        getSongCover(song);

    const artist =
        getSongArtist(song);


    if (miniCover) {

        if (cover) {

            miniCover.src =
                cover;

        } else {

            miniCover.removeAttribute(
                "src"
            );
        }
    }


    if (miniTitle) {

        miniTitle.textContent =
            song.title ||
            "Unknown Song";
    }


    if (miniArtist) {

        miniArtist.textContent =
            artist;
    }


    updateMiniPlayButton();

    updateMiniLoopButton();
}


/* =========================================================
   21. SHOW MINI PLAYER
   ========================================================= */

function showMiniPlayer() {

    if (!miniPlayer) {
        return;
    }

    miniPlayer.classList.remove(
        "hidden"
    );

    miniPlayer.style.display =
        "flex";
}


/* =========================================================
   22. MINI PLAYER - OPEN FULL PLAYER
   ========================================================= */

if (miniSongButton) {

    miniSongButton.addEventListener(
        "click",
        () => {

            if (!currentSong) {
                return;
            }

            showPlayerScreen();
        }
    );
}


/* =========================================================
   23. PLAY / PAUSE
   ========================================================= */

function togglePlayPause() {

    if (!audio) {
        return;
    }


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

        audio.play()
            .then(() => {

                updatePlayButton();

            })
            .catch(
                error => {

                    console.error(
                        "Play error:",
                        error
                    );
                }
            );

    } else {

        audio.pause();

        updatePlayButton();
    }
}


if (playButton) {

    playButton.addEventListener(
        "click",
        togglePlayPause
    );
}


if (miniPlayButton) {

    miniPlayButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            togglePlayPause();
        }
    );
}


/* =========================================================
   24. UPDATE PLAY BUTTON
   ========================================================= */

function updatePlayButton() {

    const playing =
        audio &&
        !audio.paused;


    if (playButton) {

        playButton.textContent =
            playing
            ? "❚❚"
            : "▶";
    }


    updateMiniPlayButton();
}


function updateMiniPlayButton() {

    if (!miniPlayButton) {
        return;
    }

    const playing =
        audio &&
        !audio.paused;


    miniPlayButton.textContent =
        playing
        ? "❚❚"
        : "▶";
}


/* =========================================================
   25. NEXT SONG
   ========================================================= */

function playNextSong() {

    if (!queue.length) {
        return;
    }


    if (
        currentIndex < 0
    ) {
        currentIndex = 0;
    }


    let nextIndex =
        currentIndex + 1;


    if (
        nextIndex >= queue.length
    ) {

        nextIndex = 0;
    }


    currentIndex =
        nextIndex;


    playSong(
        queue[currentIndex],
        queue
    );
}


if (nextButton) {

    nextButton.addEventListener(
        "click",
        playNextSong
    );
}


/* =========================================================
   26. PREVIOUS SONG
   ========================================================= */

function playPreviousSong() {

    if (!queue.length) {
        return;
    }


    /*
       If current song has played
       more than 3 seconds,
       restart it.
    */

    if (
        audio &&
        audio.currentTime > 3
    ) {

        audio.currentTime = 0;

        return;
    }


    let previousIndex =
        currentIndex - 1;


    if (
        previousIndex < 0
    ) {

        previousIndex =
            queue.length - 1;
    }


    currentIndex =
        previousIndex;


    playSong(
        queue[currentIndex],
        queue
    );
}


if (previousButton) {

    previousButton.addEventListener(
        "click",
        playPreviousSong
    );
}


/* =========================================================
   27. AUDIO EVENTS
   ========================================================= */

if (audio) {

    audio.addEventListener(
        "play",
        () => {

            updatePlayButton();
        }
    );


    audio.addEventListener(
        "pause",
        () => {

            updatePlayButton();
        }
    );


    audio.addEventListener(
        "timeupdate",
        () => {

            updateProgress();
        }
    );


    audio.addEventListener(
        "loadedmetadata",
        () => {

            updateDuration();
        }
    );


    audio.addEventListener(
        "ended",
        () => {

            handleSongEnded();
        }
    );
}


/* =========================================================
   28. SONG ENDED
   ========================================================= */

function handleSongEnded() {

    if (!currentSong) {
        return;
    }


    /*
       Loop ON:
       play same song again.
    */

    if (isLooping) {

        audio.currentTime = 0;

        audio.play();

        return;
    }


    /*
       Play Next OFF:
       stop after current song.
    */

    if (!playNextEnabled) {

        updatePlayButton();

        return;
    }


    /*
       Play Next ON:
       continue to next song.
    */

    playNextSong();
}


/* =========================================================
   29. LOOP
   ========================================================= */

function toggleLoop() {

    isLooping =
        !isLooping;

    updateLoopButton();

    updateMiniLoopButton();
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


function updateMiniLoopButton() {

    if (!miniLoopButton) {
        return;
    }

    miniLoopButton.classList.toggle(
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


if (miniLoopButton) {

    miniLoopButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            toggleLoop();
        }
    );
}


/* =========================================================
   30. PLAY NEXT ON / OFF
   ========================================================= */

if (playNextToggleButton) {

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
}


/* =========================================================
   31. PROGRESS
   ========================================================= */

function updateProgress() {

    if (
        !audio ||
        !progress ||
        !audio.duration
    ) {
        return;
    }


    const percentage =
        (
            audio.currentTime /
            audio.duration
        ) * 100;


    progress.value =
        percentage;


    if (currentTime) {

        currentTime.textContent =
            formatTime(
                audio.currentTime
            );
    }
}


function updateDuration() {

    if (
        !audio ||
        !duration
    ) {
        return;
    }


    duration.textContent =
        formatTime(
            audio.duration
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
        Math.floor(
            seconds / 60
        );


    const secondsPart =
        Math.floor(
            seconds % 60
        );


    return (
        minutes +
        ":" +
        String(
            secondsPart
        ).padStart(2, "0")
    );
}


/* =========================================================
   32. SEEK
   ========================================================= */

if (progress) {

    progress.addEventListener(
        "input",
        () => {

            if (
                !audio ||
                !audio.duration
            ) {
                return;
            }


            const percentage =
                Number(
                    progress.value
                );


            audio.currentTime =
                (
                    percentage /
                    100
                ) *
                audio.duration;
        }
    );
}


/* =========================================================
   33. QUEUE
   ========================================================= */

function renderQueue() {

    if (!queueList) {
        return;
    }


    queueList.innerHTML = "";


    if (!queue.length) {

        queueList.innerHTML = `
            <div class="empty-state">
                Queue is empty.
            </div>
        `;

        return;
    }


    queue.forEach(
        (song, index) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "queue-item";


            item.dataset.songId =
                getSongId(song);


            const cover =
                getSongCover(song);


            const artist =
                getSongArtist(song);


            item.innerHTML = `

                <div class="queue-cover">

                    ${
                        cover
                        ?
                        `
                        <img
                            src="${escapeHTML(cover)}"
                            alt=""
                        >
                        `
                        :
                        ""
                    }

                </div>

                <div class="queue-info">

                    <div class="queue-title">

                        ${escapeHTML(
                            song.title ||
                            "Unknown Song"
                        )}

                    </div>

                    <div class="queue-artist">

                        ${escapeHTML(
                            artist
                        )}

                    </div>

                </div>

            `;


            item.addEventListener(
                "click",
                () => {

                    playSong(
                        song,
                        queue
                    );
                }
            );


            queueList.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   34. OPEN QUEUE
   ========================================================= */

function openQueue() {

    if (!queuePanel) {
        return;
    }

    queuePanel.classList.remove(
        "hidden"
    );

    queuePanel.style.display =
        "block";

    renderQueue();
}


if (miniQueueButton) {

    miniQueueButton.addEventListener(
        "click",
        event => {

            event.stopPropagation();

            openQueue();
        }
    );
}


if (playerQueueButton) {

    playerQueueButton.addEventListener(
        "click",
        openQueue
    );
}


/* =========================================================
   35. CLOSE QUEUE
   ========================================================= */

if (closeQueueButton) {

    closeQueueButton.addEventListener(
        "click",
        () => {

            if (queuePanel) {

                queuePanel.classList.add(
                    "hidden"
                );

                queuePanel.style.display =
                    "none";
            }
        }
    );
}


/* =========================================================
   36. HIGHLIGHT CURRENT SONG
   ========================================================= */

function highlightCurrentSong() {

    if (!songList) {
        return;
    }


    const items =
        songList.querySelectorAll(
            "[data-song-id]"
        );


    items.forEach(item => {

        const active =
            currentSong &&
            item.dataset.songId ===
            getSongId(
                currentSong
            );


        item.classList.toggle(
            "playing",
            Boolean(active)
        );
    });
}


/* =========================================================
   37. SEARCH
   ========================================================= */

if (searchInput) {

    searchInput.addEventListener(
        "input",
        () => {

            const query =
                searchInput.value
                    .trim()
                    .toLowerCase();


            if (!query) {

                renderSongs(songs);

                return;
            }


            const filtered =
                songs.filter(
                    song => {

                        const title =
                            String(
                                song.title ||
                                ""
                            )
                                .toLowerCase();


                        const artist =
                            getSongArtist(
                                song
                            )
                                .toLowerCase();


                        const album =
                            String(
                                song.album ||
                                ""
                            )
                                .toLowerCase();


                        return (
                            title.includes(
                                query
                            ) ||
                            artist.includes(
                                query
                            ) ||
                            album.includes(
                                query
                            )
                        );
                    }
                );


            renderSongs(
                filtered
            );
        }
    );
}


/* =========================================================
   38. RECENTLY PLAYED
   ========================================================= */

function getRecentlyPlayedIds() {

    try {

        const saved =
            localStorage.getItem(
                "recentlyPlayed"
            );


        if (!saved) {
            return [];
        }


        const ids =
            JSON.parse(saved);


        return Array.isArray(ids)
            ? ids
            : [];

    } catch {

        return [];
    }
}


function addRecentlyPlayed(song) {

    if (!song) {
        return;
    }


    const id =
        getSongId(song);


    let ids =
        getRecentlyPlayedIds();


    ids =
        ids.filter(
            savedId =>
                savedId !== id
        );


    ids.unshift(id);


    ids =
        ids.slice(0, 50);


    localStorage.setItem(
        "recentlyPlayed",
        JSON.stringify(ids)
    );
}


function getRecentlyPlayed() {

    const ids =
        getRecentlyPlayedIds();


    return ids
        .map(
            id =>
                songs.find(
                    song =>
                        getSongId(song) ===
                        id
                )
        )
        .filter(Boolean);
}


function showRecentlyPlayed() {

    showSongListScreen();


    if (categoryTitle) {

        categoryTitle.textContent =
            "Recently Played";
    }


    renderSongs(
        getRecentlyPlayed()
    );
}


/* =========================================================
   39. FAVOURITE HERO
   ========================================================= */

function getFavouriteHeroes() {

    const map =
        new Map();


    songs.forEach(song => {

        let heroes =
            song.heroes ||
            song.Heroes ||
            song.hero ||
            song.Hero ||
            [];


        if (!Array.isArray(heroes)) {

            heroes = [heroes];
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


            if (!map.has(name)) {

                map.set(
                    name,
                    []
                );
            }


            map.get(name).push(
                song
            );
        });
    });


    return Array.from(
        map.entries()
    ).map(
        ([name, songArray]) => ({
            name,
            songs: songArray
        })
    );
}


function showFavouriteHeroes() {

    showSongListScreen();


    if (categoryTitle) {

        categoryTitle.textContent =
            "Favourite Hero";
    }


    const heroes =
        getFavouriteHeroes();


    renderHeroList(
        heroes
    );
}


function renderHeroList(heroes) {

    if (!songList) {
        return;
    }


    songList.innerHTML = "";


    if (!heroes.length) {

        songList.innerHTML = `
            <div class="empty-state">
                No heroes available.
            </div>
        `;

        return;
    }


    heroes.forEach(hero => {

        const item =
            document.createElement(
                "div"
            );


        item.className =
            "hero-list-item";


        item.innerHTML = `

            <div class="song-info">

                <div class="song-title">

                    ${escapeHTML(
                        hero.name
                    )}

                </div>

                <div class="song-artist">

                    ${hero.songs.length}
                    songs

                </div>

            </div>

        `;


        item.addEventListener(
            "click",
            () => {

                if (categoryTitle) {

                    categoryTitle.textContent =
                        hero.name;
                }


                renderSongs(
                    hero.songs
                );
            }
        );


        songList.appendChild(
            item
        );
    });
}


/* =========================================================
   40. PLAYLISTS
   ========================================================= */

function getPlaylists() {

    try {

        const saved =
            localStorage.getItem(
                "playlists"
            );


        if (!saved) {
            return [];
        }


        const playlists =
            JSON.parse(saved);


        return Array.isArray(
            playlists
        )
            ? playlists
            : [];

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


function showPlaylists() {

    showSongListScreen();


    if (categoryTitle) {

        categoryTitle.textContent =
            "Playlists";
    }


    renderPlaylists();
}


function renderPlaylists() {

    if (!songList) {
        return;
    }


    const playlists =
        getPlaylists();


    songList.innerHTML = "";


    if (!playlists.length) {

        songList.innerHTML = `
            <div class="empty-state">
                No playlists created yet.
            </div>
        `;

        return;
    }


    playlists.forEach(
        playlist => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "playlist-item";


            const playlistSongs =
                (playlist.songs || [])
                    .map(
                        id =>
                            songs.find(
                                song =>
                                    getSongId(
                                        song
                                    ) === id
                            )
                    )
                    .filter(Boolean);


            item.innerHTML = `

                <div class="song-info">

                    <div class="song-title">

                        ${escapeHTML(
                            playlist.name ||
                            "Playlist"
                        )}

                    </div>

                    <div class="song-artist">

                        ${playlistSongs.length}
                        songs

                    </div>

                </div>

            `;


            item.addEventListener(
                "click",
                () => {

                    if (categoryTitle) {

                        categoryTitle.textContent =
                            playlist.name;
                    }


                    renderSongs(
                        playlistSongs
                    );
                }
            );


            songList.appendChild(
                item
            );
        }
    );
}


/* =========================================================
   41. CONTEXT MENU
   ========================================================= */

function openContextMenu(
    song,
    event
) {

    if (!contextMenu) {
        return;
    }


    contextSong =
        song;


    contextMenu.innerHTML = `

        <button data-action="download">
            Download
        </button>

        <button data-action="loop">
            Loop
        </button>

        <button data-action="playnext">
            Play Next
        </button>

        <button data-action="queue">
            Add to Queue
        </button>

        <button data-action="playlist">
            Add to Playlist
        </button>

        <button data-action="delete">
            Delete
        </button>

        <button data-action="database">
            Delete from Database
        </button>

    `;


    contextMenu.classList.remove(
        "hidden"
    );


    contextMenu.style.display =
        "flex";


    const x =
        event.clientX;


    const y =
        event.clientY;


    contextMenu.style.left =
        `${x}px`;


    contextMenu.style.top =
        `${y}px`;
}


/* =========================================================
   42. CONTEXT MENU ACTIONS
   ========================================================= */

if (contextMenu) {

    contextMenu.addEventListener(
        "click",
        event => {

            const button =
                event.target.closest(
                    "button"
                );


            if (!button) {
                return;
            }


            const action =
                button.dataset.action;


            handleContextAction(
                action,
                contextSong
            );


            closeContextMenu();
        }
    );
}


function handleContextAction(
    action,
    song
) {

    if (!song) {
        return;
    }


    if (action === "download") {

        downloadSong(song);

        return;
    }


    if (action === "loop") {

        toggleLoop();

        return;
    }


    if (action === "playnext") {

        playNextAfterCurrent(
            song
        );

        return;
    }


    if (action === "queue") {

        queue.push(song);

        renderQueue();

        return;
    }


    if (action === "playlist") {

        openPlaylistPicker(
            song
        );

        return;
    }


    if (action === "delete") {

        removeSongFromLibrary(
            song
        );

        return;
    }


    if (action === "database") {

        removeSongFromDatabase(
            song
        );
    }
}


/* =========================================================
   43. CLOSE CONTEXT MENU
   ========================================================= */

function closeContextMenu() {

    if (!contextMenu) {
        return;
    }


    contextMenu.classList.add(
        "hidden"
    );


    contextMenu.style.display =
        "none";


    contextSong = null;
}


document.addEventListener(
    "click",
    event => {

        if (
            contextMenu &&
            !event.target.closest(
                "#contextMenu"
            ) &&
            !event.target.closest(
                ".song-more"
            )
        ) {

            closeContextMenu();
        }
    }
);


/* =========================================================
   44. DOWNLOAD
   ========================================================= */

function downloadSong(song) {

    const file =
        getSongFile(song);


    if (!file) {
        return;
    }


    const link =
        document.createElement(
            "a"
        );


    link.href =
        file;


    link.download =
        song.title ||
        "song";


    document.body.appendChild(
        link
    );


    link.click();


    link.remove();
}


/* =========================================================
   45. PLAY NEXT
   ========================================================= */

function playNextAfterCurrent(
    song
) {

    if (!song) {
        return;
    }


    const existingIndex =
        queue.findIndex(
            item =>
                getSongId(item) ===
                getSongId(song)
        );


    if (
        existingIndex >= 0
    ) {

        queue.splice(
            existingIndex,
            1
        );
    }


    const insertIndex =
        currentIndex >= 0
        ? currentIndex + 1
        : 0;


    queue.splice(
        insertIndex,
        0,
        song
    );


    renderQueue();
}


/* =========================================================
   46. PLAYLIST PICKER
   ========================================================= */

function openPlaylistPicker(
    song
) {

    if (!playlistPanel) {
        return;
    }


    if (!playlistList) {
        return;
    }


    contextSong =
        song;


    const playlists =
        getPlaylists();


    playlistList.innerHTML =
        "";


    if (!playlists.length) {

        playlistList.innerHTML = `
            <div class="empty-state">
                No playlists created yet.
            </div>
        `;

    } else {

        playlists.forEach(
            playlist => {

                const button =
                    document.createElement(
                        "button"
                    );


                button.textContent =
                    playlist.name;


                button.addEventListener(
                    "click",
                    () => {

                        addSongToPlaylist(
                            song,
                            playlist.name
                        );
                    }
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


    playlistPanel.style.display =
        "block";
}


function addSongToPlaylist(
    song,
    playlistName
) {

    const playlists =
        getPlaylists();


    const playlist =
        playlists.find(
            item =>
                item.name ===
                playlistName
        );


    if (!playlist) {
        return;
    }


    if (!Array.isArray(
        playlist.songs
    )) {

        playlist.songs = [];
    }


    const id =
        getSongId(song);


    if (
        !playlist.songs.includes(
            id
        )
    ) {

        playlist.songs.push(
            id
        );
    }


    savePlaylists(
        playlists
    );


    closePlaylistPicker();
}


function closePlaylistPicker() {

    if (!playlistPanel) {
        return;
    }


    playlistPanel.classList.add(
        "hidden"
    );


    playlistPanel.style.display =
        "none";
}


if (closePlaylistButton) {

    closePlaylistButton.addEventListener(
        "click",
        closePlaylistPicker
    );
}


/* =========================================================
   47. DELETE SONG
   ========================================================= */

function removeSongFromLibrary(
    song
) {

    const id =
        getSongId(song);


    songs =
        songs.filter(
            item =>
                getSongId(item) !==
                id
        );


    queue =
        queue.filter(
            item =>
                getSongId(item) !==
                id
        );


    renderSongs(
        songs
    );


    renderQueue();
}


/* =========================================================
   48. DELETE FROM DATABASE
   ========================================================= */

function removeSongFromDatabase(
    song
) {

    /*
       Browser JavaScript cannot directly
       delete a physical file from your
       server/project folder.

       For now we remove it from the
       application's stored library.

       A real database backend can be
       connected later.
    */

    removeSongFromLibrary(
        song
    );
}


/* =========================================================
   49. KEYBOARD CONTROLS
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.target.tagName ===
            "INPUT"
        ) {
            return;
        }


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

            playNextSong();
        }


        if (
            event.code ===
            "ArrowLeft"
        ) {

            playPreviousSong();
        }
    }
);


/* =========================================================
   50. START APPLICATION
   ========================================================= */

loadSongs();