const songs = [
  { title: "Amma Song", file: "songs/Amma_song.mp3" },
  { title: "Aigiri Song", file: "songs/Aigiri_song.mp3" },
  { title: "Prema Deshapu yuvarani", file: "songs/Prema_Deshapu_yuvarani.mp3" }
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
