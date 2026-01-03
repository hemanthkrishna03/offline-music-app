const songs = [
  { title: "Amma Song", file: "songs/Amma_song.mp3" },
  { title: "Aigiri Song", file: "songs/Aigiri_song.mp3" },
  { title: "Prema Deshapu yuvarani", file: "songs/Prema_Deshapu_yuvarani.mp3" }
  { title: "Kandhon Se Milte", file: "songs/Kandhon Se Milte Hain Kandhe Lakshya.mp3" },
  { title: "O sainika", file: "songs/sainika.mp3" },
  { title: "Sarileru Neekevaru", file: "songs/Sarileru_Neekevvaru.mp3" },
  { title: "Desh Pehle", file: "songs/Desh_Pehle.mp3" },
  { title: "Maan Bharyaa", file: "songs/Mann Bharryaa 2.0 Shershaah.mp3" },
  { title: "Jawan", file: "songs/Intiki Okkadu Kavale.mp3" },
  { title: "Heer Aasmani", file: "songs/Heer Aasmani Fighter.mp3" },
  { title: "Le teri Mitti", file: "songs/Mitti Fighter.mp3" },
  { title: "terapai prakasham", file: "songs/Beast Mode.mp3" },
  { title: "Jana Gana Mana", file: "songs/Jana Gana Mana major.mp3" },
  { title: "Tiranga", file: "songs/Tiranga Yodha.mp3" },
  { title: "Vande Mataram", file: "songs/Vande Mataram.mp3" }
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



