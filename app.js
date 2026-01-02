const songs = [
  { title: "Amma Song", file: "songs/Amma_song.mp3" },
  { title: "Aigiri Song", file: "songs/Aigiri_song.mp3" },
  { title: "Prema Deshapu yuvarani", file: "songs/Prema_Deshapu_yuvarani.mp3" }
  { title: "Kadam Kadam", file: "songs/laksya.mp3" },
  { title: "O sainika", file: "songs/npsnii.mp3" },
  { title: "Sarileru Neekevaru", file: "songs/sneekevaru.mp3" },
  { title: "Agar Dil Raazi", file: "songs/raazi.mp3" },
  { title: "Desh Pehle", file: "songs/vajpyee.mp3" },
  { title: "Maan Bharyaa", file: "songs/shershaah.mp3" },
  { title: "Jawan", file: "songs/jawan_dharam.mp3" },
  { title: "Kaam nahi", file: "songs/fighter.mp3" },
  { title: "Le teri Mitti", file: "songs/fighter.mp3" },
  { title: "terapai prakasham", file: "songs/beast.mp3" }

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

