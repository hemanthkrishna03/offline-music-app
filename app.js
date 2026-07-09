let currentIndex = 0;
let isShuffle = false;
let isRepeat = false;
const songs = [
  { title: "Aigiri Song", file: "songs/aigiri_song.mp3" },
  { title: "Amma Song", file: "songs/amma_song.mp3" },
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
  { title: "Srirasthu Subham", file: "songs/Srirasthu_Subham.mp3" },
  { title: "Malli Malli", file: "songs/Malli_Malli.mp3" },
  { title: "Subhalekha", file: "songs/Subhalekha.mp3" },
  { title: "Abbanee", file: "songs/Abbanee.mp3" },
  { title: "Yamaho Nee", file: "songs/Yamaho_Nee.mp3" },
  { title: "Ee Petaku Nene", file: "songs/Ee_Petaku_Nene.mp3" },
  { title: "Anjanee Puthruda", file: "songs/Anjanee_Puthruda.mp3" },
  { title: "Ramma Chilakamma", file: "songs/Ramma_Chilakamma.mp3" },
  { title: "Radhe Govinda", file: "songs/Radhe_Govinda.mp3" },
  { title: "Ghallu Ghallu", file: "songs/Ghallu_Ghallu.mp3" },
  { title: "Chinnaga Chinnage", file: "songs/Chinnaga_Chinnage.mp3" },
  { title: "Nenusaitham", file: "songs/Nenusaitham.mp3" },
  { title: "Jai Jai Ganesha", file: "songs/Jai_Jai_Ganesha.mp3" },
  { title: "Sooryudinye", file: "songs/Sooryudinye.mp3" },
  { title: "Ratthaalu", file: "songs/Ratthaalu.mp3" },
  { title: "Sundari", file: "songs/Sundari.mp3" },
  { title: "Jaago Narasimhaa", file: "songs/Jaago_Narasimhaa.mp3" },
  { title: "Sye Raa", file: "songs/Sye_Raa.mp3" },
  { title: "Laahe Laahe", file: "songs/Laahe_Laahe.mp3" },
  { title: "Bhale Bhale Banjara", file: "songs/Bhale_Bhale_Banjara.mp3" },
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
  { title: "Jaya Janardhana", file: "songs/Jaya_Janardhana.mp3" },
  { title: "I Wanna Fly", file: "songs/I_Wanna_Fly.mp3" },
  { title: "Inthaku Nuvvevaru", file: "songs/Inthaku_Nuvvevaru.mp3" },
  { title: "Laka Laka Lakumikara", file: "songs/Laka_Laka_Lakumikara.mp3" },
  { title: "Manasedo Vethukuthu", file: "songs/Manasedo_Vethukuthu.mp3" },
  { title: "Meenakshi Meenakshi", file: "songs/Meenakshi_Meenakshi.mp3" },
  { title: "My World Fly", file: "songs/My_World_fly.mp3" },
  { title: "Native Place", file: "songs/Native_Place.mp3" },
  { title: "Nee Choopule", file: "songs/Nee_Choopule.mp3" },
  { title: "Odiyamma", file: "songs/Odiyamma.mp3" },
  { title: "Pandaga Chesko", file: "songs/Pandaga_Chesko.mp3" },
  { title: "Raa Chilaka", file: "songs/Raa_Chilaka.mp3" },
  { title: "Raja Maharaja", file: "songs/Raja_Maharaja.mp3" },
  { title: "Rayyi Rayyi", file: "songs/Rayyi_Rayyi.mp3" },
  { title: "Rise of Shyam", file: "songs/Rise_of_Shyam.mp3" },
  { title: "Shiva Thandavame", file: "songs/Shiva_Thandavame.mp3" },
  { title: "Thalabadi", file: "songs/Thalabadi.mp3" },
  { title: "Thu Go Jilla", file: "songs/Thu_Go_Jilla.mp3" },
  { title: "Trend Maarina", file: "songs/Trend_Maarina.mp3" },
  { title: "Urime Manase", file: "songs/Urime_Manase.mp3" },
  { title: "Vunnadhi Okate", file: "songs/Vunnadhi_Okate.mp3" },
  { title: "Sailaja Sailaja", file: "songs/Sailaja_Sailaja.mp3" },
  { title: "Manasu Maree", file: "songs/Manasu_Maree.mp3" },
  { title: "Aadinchi Ashta", file: "songs/Aadinchi_Ashta.mp3" },
  { title: "Sirivennala", file: "songs/Sirivennala.mp3" },
  { title: "Ninne Pelladukoni", file: "songs/Ninne_Pelladukoni.mp3" },
  { title: "Om Namaste Bolo", file: "songs/Om_Namaste_Bolo.mp3" },
  { title: "Aaya Sher", file: "songs/Aaya_Sher.mp3" },
  { title: "Bullet Song", file: "songs/Bullet_Song.mp3" },
  { title: "Chuda Chakkagunnave", file: "songs/Chuda_chakkagunnave.mp3" },
  { title: "Crazy Feeling", file: "songs/Crazy_feeling.mp3" },
  { title: "Dhaari Choodu", file: "songs/Dhaari_Choodu.mp3" },
  { title: "Dinchak", file: "songs/Dinchak.mp3" },
  { title: "Em Cheppanu", file: "songs/Em_Cheppanu.mp3" },
  { title: "Family Party", file: "songs/Family_Party.mp3" },
  { title: "Gandarabai", file: "songs/Gandarabai.mp3" },
  { title: "Changure", file: "songs/Changure.mp3" },
  { title: "Patala Pallakivai", file: "songs/Patala_Pallakivai.mp3" },
  { title: "Snehamante", file: "songs/Snehamante.mp3" },
  { title: "Ye Swasalo", file: "songs/Ye_Swasalo.mp3" },
  { title: "Nenunnanani", file: "songs/Nenunnanani.mp3" },
  { title: "Neekosam", file: "songs/Neekosam.mp3" },
  { title: "Rama Rama", file: "songs/Rama_Rama.mp3" },
  { title: "Velutunnaa", file: "songs/Velutunnaa.mp3" },
  { title: "Dhada Puttistha", file: "songs/Dhada_Puttistha.mp3" },
  { title: "Nuvu Ready", file: "songs/Nuvu_Ready.mp3" },
  { title: "King", file: "songs/King.mp3" },
  { title: "Dheemtana", file: "songs/Dheemtana.mp3" },
  { title: "Kanyakumari", file: "songs/Kanyakumari.mp3" },
  { title: "Laali Laali", file: "songs/Laali_Laali.mp3" },
  { title: "Sakkubaai Garam", file: "songs/Sakkubaai_Garam.mp3" },
  { title: "Shiva Shiva Shankara", file: "songs/Shiva_Shiva_Shankara.mp3" },
  { title: "I Hate Love", file: "songs/I_Hate_Love.mp3" },
  { title: "Kani Penchina", file: "songs/Kani_Penchina.mp3" },
  { title: "Edhi Prema", file: "songs/Edhi_Prema.mp3" },
  { title: "Dikka Dikka Dum", file: "songs/Dikka_Dikka_Dum.mp3" },
  { title: "Nee Navve", file: "songs/Nee_Navve.mp3" },
  { title: "Untale Untale", file: "songs/Untale_Untale.mp3" },
  { title: "Vasthane Vasthane", file: "songs/Vasthane_Vasthane.mp3" },
  { title: "Soggade Chinni Nayana", file: "songs/Soggade_Chinni_Nayana.mp3" },
  { title: "Door Number", file: "songs/Door_Number.mp3" },
  { title: "Eppudu", file: "songs/Eppudu.mp3" },
  { title: "Bangaara", file: "songs/Bangaara.mp3" },
  { title: "Vaasivaadi Tassadiyya", file: "songs/Vaasivaadi_Tassadiyya.mp3" },
  { title: "Naa Kosam", file: "songs/Naa_Kosam.mp3" },
  { title: "Amma Avanee", file: "songs/Amma_Avanee.mp3" },
  { title: "Okka Kshanam", file: "songs/Okka_Kshanam.mp3" },
  { title: "Rajanna DOle", file: "songs/Rajanna_DOle.mp3" },
  { title: "Bangarukonda", file: "songs/Bangarukonda.mp3" },
  { title: "Simhamanti", file: "songs/Simhamanti.mp3" },
  { title: "Jagadhananda Karaka", file: "songs/Jagadhananda_Karaka.mp3" },
  { title: "Lasku Tapa", file: "songs/Lasku_Tapa.mp3" },
  { title: "Legend", file: "songs/Legend.mp3" },
  { title: "Nee Kanti", file: "songs/Nee_Kanti.mp3" },
  { title: "Tanjavuru", file: "songs/Tanjavuru.mp3" },
  { title: "Paisa Vasool", file: "songs/Paisa_Vasool.mp3" },
  { title: "Mama EKpagala", file: "songs/Mama_EKpagala.mp3" },
  { title: "Senior NTR", file: "songs/Senior_NTR.mp3" },
  { title: "Jajikaya Jajikaya", file: "songs/Jajikaya_Jajikaya.mp3" },
  { title: "The Thaandavam", file: "songs/The_Thaandavam.mp3" },
  { title: "Akhanda Thandavam", file: "songs/Akhanda_Thandavam.mp3" },
  { title: "Akhanda Haindhavam", file: "songs/Akhanda_Haindhavam.mp3" },
  { title: "Jai Balayya", file: "songs/Jai_Balayya.mp3" },
  { title: "Akhanda", file: "songs/Akhanda.mp3" },
  { title: "Rage of Daaku", file: "songs/Rage_of_Daaku.mp3" },
  { title: "Dabidi Dibidi", file: "songs/Dabidi_Dibidi.mp3" },
  { title: "Gokula Krshna", file: "songs/Gokula_Krshna.mp3" },
  { title: "Happy Birthdaylu", file: "songs/Happy_Birthdaylu.mp3" },
  { title: "Ye Swapna Lokala", file: "songs/Ye_Swapna_Lokala.mp3" },
  { title: "Annayya Annavante", file: "songs/Annayya_Annavante.mp3" },
  { title: "Ammaye sannaga", file: "songs/Ammaye_sannaga.mp3" },
  { title: "Chiguraku Chaatu", file: "songs/Chiguraku_Chaatu.mp3" },
  { title: "Naaraju Gakura", file: "songs/Naaraju_Gakura.mp3" },
  { title: "Panja", file: "songs/Panja.mp3" },
  { title: "Paparayudu", file: "songs/Paparayudu.mp3" },
  { title: "Akasam Ammayaithe", file: "songs/Akasam_Ammayaithe.mp3" },
  { title: "Gabbar title", file: "songs/Gabbar_title.mp3" },
  { title: "DilSe", file: "songs/DilSe.mp3" },
  { title: "Kevvu Keka", file: "songs/Kevvu_Keka.mp3" },
  { title: "Mandu Baabulam", file: "songs/Mandu_Baabulam.mp3" },
  { title: "Pillaa", file: "songs/Pillaa.mp3" },
  { title: "Aaradugula Bullettu", file: "songs/Aaradugula_Bullettu.mp3" },
  { title: "Ninnu Chudaganne", file: "songs/Ninnu_Chudaganne.mp3" },
  { title: "Deva Devam", file: "songs/Deva_Devam.mp3" },
  { title: "Bapu Gari", file: "songs/Bapu_Gari.mp3" },
  { title: "Time To Party", file: "songs/Time_To_Party.mp3" },
  { title: "Katamarayuda", file: "songs/Katamarayuda.mp3" },
  { title: "Aadevadanna Eedevadanna", file: "songs/Aadevadanna_Eedevadanna.mp3" },
  { title: "O Pilla Shubhanalla", file: "songs/O_Pilla_Shubhanalla.mp3" },
  { title: "Tauba Tauba", file: "songs/Tauba_Tauba.mp3" },
  { title: "Mira Mira Meesam", file: "songs/Mira_Mira_Meesam.mp3" },
  { title: "Netha Cheera", file: "songs/Netha_Cheera.mp3" },
  { title: "Sathyameva Jayathe", file: "songs/Sathyameva_Jayathe.mp3" },
  { title: "Maguva Maguva", file: "songs/Maguva_Maguva.mp3" },
  { title: "Taxi Vaala", file: "songs/Taxi_Vaala.mp3" },
  { title: "Anjaneyudu Neevadu", file: "songs/Anjaneyudu_Neevadu.mp3" },
  { title: "Arere Vaanaa", file: "songs/Arere_Vaanaa.mp3" },
  { title: "Nee Yadalo Naaku", file: "songs/Nee_Yadalo_Naaku.mp3" },
  { title: "Chinnadana Neekosam", file: "songs/Chinnadana_Neekosam.mp3" },
  { title: "Bugga Chinnadana Neekosam", file: "songs/Bugga_Buggagili.mp3" },
  { title: "Rang De", file: "songs/Rang_De.mp3" },
  { title: "Yaa Yaa", file: "songs/Yaa_Yaa.mp3" },
  { title: "Priyathama", file: "songs/Priyathama.mp3" },
  { title: "Nadume lJyyala", file: "songs/Nadume_Uyyala.mp3" },
  { title: "Nelathalli Gundelo", file: "songs/Nelathalli_Gundelo.mp3" },
  { title: "Anukunte Kanidi", file: "songs/Anukunte_Kanidi.mp3" },
  { title: "Punnami Puvvai", file: "songs/Punnami_Puvvai.mp3" },
  { title: "Ambadhari", file: "songs/Ambadhari.mp3" },
  { title: "Nath Nath", file: "songs/Nath_Nath.mp3" },
  { title: "Omkareswari", file: "songs/Omkareswari.mp3" },
  { title: "Aa Ante Amalapuram", file: "songs/Aa_Ante_Amalapuram.mp3" },
  { title: "Nuvvunte", file: "songs/Nuvvunte.mp3" },
  { title: "Ring Ringa", file: "songs/Ring_Ringa.mp3" },
  { title: "Bunny Bunny", file: "songs/Bunny_Bunny.mp3" },
  { title: "Attantode", file: "songs/Attantode.mp3" },
  { title: "Vallanki Pitta", file: "songs/Vallanki_Pitta.mp3" },
  { title: "Railu Bandi", file: "songs/Railu_Bandi.mp3" },
  { title: "Oka Thotalo", file: "songs/Oka_Thotalo.mp3" },
  { title: "Nuvvu Nenu Kalisunte", file: "songs/Nuvvu_Nenu_Kalisunte.mp3" },
  { title: "Mavayyadhi Mogalturu", file: "songs/Mavayyadhi_Mogalturu.mp3" },
  { title: "Ganga", file: "songs/Ganga.mp3" },
  { title: "Yegire Mabbulona", file: "songs/Yegire_Mabbulona.mp3" },
  { title: "Julayi", file: "songs/Julayi.mp3" },
  { title: "Mee Intiki Mundhu", file: "songs/Mee_Intiki_Mundhu.mp3" },
  { title: "Pakado Pakado", file: "songs/Pakado_Pakado.mp3" },
  { title: "Bhoochadae", file: "songs/Bhoochadae.mp3" },
  { title: "Cinema Choopistha", file: "songs/Cinema_Choopistha.mp3" },
  { title: "Down Down Duppa", file: "songs/Down_Down_Duppa.mp3" },
  { title: "Race Gurram", file: "songs/Race_Gurram.mp3" },
  { title: "Sweety", file: "songs/Sweety.mp3" },
  { title: "Top Lesi Poddi", file: "songs/Top_Lesi_Poddi.mp3" },
  { title: "Chai Chalo", file: "songs/Chal_Chalo.mp3" },
  { title: "Seethakaalam", file: "songs/Seethakaalam.mp3" },
  { title: "Super Machi", file: "songs/Super_Machi.mp3" },
  { title: "Athiloka Sundari", file: "songs/Athiloka_Sundari.mp3" },
  { title: "Your Are My Mla", file: "songs/Your_Are_My_Mla.mp3" },
  { title: "Private Party", file: "songs/Private_Party.mp3" },
  { title: "Blockbuster", file: "songs/Blockbuster.mp3" },
  { title: "Telusaa Telusaa", file: "songs/Telusaa_Telusaa.mp3" },
  { title: "Sarrainodu", file: "songs/Sarrainodu.mp3" },
  { title: "DJTitle", file: "songs/DJTitle.mp3" },
  { title: "Gudilo Badilo", file: "songs/Gudilo_Badilo.mp3" },
  { title: "Seeti Maar", file: "songs/Seeti_Maar.mp3" },
  { title: "Sainika", file: "songs/Sainika.mp3" },
  { title: "Lover Also Fighter Also", file: "songs/Lover _Also_Fighter_Also.mp3" },
  { title: "Beautiful Love", file: "songs/Beautiful_Love.mp3" },
  { title: "Yenniyello Yenniyello", file: "songs/Yenniyello_Yenniyello.mp3" },
  { title: "Iraga Iraga", file: "songs/Iraga_Iraga.mp3" },
  { title: "Samajavaragamana", file: "songs/Samajavaragamana.mp3" },
  { title: "Ramuloo Ramula", file: "songs/Ramuloo_Ramula.mp3" },
  { title: "Buttabomma", file: "songs/Buttabomma.mp3" },
  { title: "Sittharala Sirapadu", file: "songs/Sittharala_Sirapadu.mp3" },
  { title: "Dakko Dakko", file: "songs/Dakko_Dakko.mp3" },
  { title: "Saami Saami", file: "songs/Saami_Saami.mp3" },
  { title: "Eyy Bidda", file: "songs/Eyy_Bidda.mp3" },
  { title: "O Antava", file: "songs/Oo_Antava.mp3" },
  { title: "Pushpa Pushpa", file: "songs/Pushpa_Pushpa.mp3" },
  { title: "Sooseki", file: "songs/Sooseki.mp3" },
  { title: "Kissik", file: "songs/Kissik.mp3" },
  { title: "Peelings", file: "songs/Peelings.mp3" },
  { title: "Gango Renuka", file: "songs/Gango_Renuka.mp3" },
  { title: "Bavagari Choope", file: "songs/Bavagari_Choope.mp3" },
  { title: "Neeli Rangu Cheeralona", file: "songs/Neeli_Rangu_Cheeralona.mp3" },
  { title: "Laila O Lailaa", file: "songs/Laila_O_Lailaa.mp3" },
  { title: "Subhalekha Rasukunna", file: "songs/Subhalekha_Rasukunna.mp3" },
  { title: "Nellorae", file: "songs/Nellorae.mp3" },
  { title: "Hey Naayak", file: "songs/Hey_Naayak.mp3" },
  { title: "Rooba Rooba", file: "songs/Rooba_Rooba.mp3" },
  { title: "Hello Rammante", file: "songs/Hello_Rammante.mp3" },
  { title: "Dheera Dheera", file: "songs/Dheera_Dheera.mp3" },
  { title: "Jorsey", file: "songs/Jorsey.mp3" },
  { title: "Panchadhara Bomma", file: "songs/Panchadhara_Bomma.mp3" },
  { title: "Pimple DimpIe", file: "songs/Pimple_DimpIe.mp3" },
  { title: "Cheliya", file: "songs/Cheliya.mp3" },
  { title: "Ayyo Paapam", file: "songs/Ayyo_Paapam.mp3" },
  { title: "Nee Jathaga", file: "songs/Nee_Jathaga.mp3" },
  { title: "Freedom", file: "songs/Freedom.mp3" },
  { title: "Singareniundhi", file: "songs/Singareniundhi.mp3" },
  { title: "Oka Paadam", file: "songs/Oka_Paadam.mp3" },
  { title: "Dillaku Dillaku", file: "songs/Dillaku_Dillaku.mp3" },
  { title: "Racha", file: "songs/Racha.mp3" },
  { title: "Vaana Vaana", file: "songs/Vaana_Vaana.mp3" },
  { title: "Chamka Chamka", file: "songs/Chamka_Chamka.mp3" },
  { title: "Endhuko Pichi", file: "songs/Endhuko_Pichi.mp3" },
  { title: "Run", file: "songs/Run.mp3" },
  { title: "Ria", file: "songs/Ria.mp3" },
  { title: "Laychalo", file: "songs/Laychalo.mp3" },
  { title: "Kung Fu", file: "songs/Kung_Fu.mp3" },
  { title: "Bruce Lee", file: "songs/Bruce_Lee.mp3" },
  { title: "Dhruva", file: "songs/Dhruva.mp3" },
  { title: "Choosa Choosa", file: "songs/Choosa_Choosa.mp3" },
  { title: "Manishi Musugulo", file: "songs/Manishi_Musugulo.mp3" },
  { title: "Neethoney Dance", file: "songs/Neethoney_Dance.mp3" },
  { title: "Ranga Ranga", file: "songs/Ranga_Ranga.mp3" },
  { title: "Rangamma Mangamma", file: "songs/Rangamma_Mangamma.mp3" },
  { title: "Aa Gattununtaava", file: "songs/Aa_Gattununtaava.mp3" },
  { title: "Jigelu Rani", file: "songs/Jigelu_Rani.mp3" },
  { title: "Thandaane Thandaane", file: "songs/Thandaane_Thandaane.mp3" },
  { title: "Thassadiyya", file: "songs/Thassadiyya.mp3" },
  { title: "Rama Loves Sita", file: "songs/Rama_Loves_Sita.mp3" },
  { title: "Amma Naana", file: "songs/Amma_Naana.mp3" },
  { title: "Dosti", file: "songs/Dosti.mp3" },
  { title: "Nattu Nattu", file: "songs/Nattu_Nattu.mp3" },
  { title: "Komuram Bheemudo", file: "songs/Komuram_Bheemudo.mp3" },
  { title: "Raa Macha Macha", file: "songs/Raa_Macha_Macha.mp3" },
  { title: "Jaragandi", file: "songs/Jaragandi.mp3" },
  { title: "Chinnadho", file: "songs/Chinnadho.mp3" },
  { title: "Eyi Raja", file: "songs/Eyi_Raja.mp3" },
  { title: "Vachadura", file: "songs/Vachadura.mp3" },
  { title: "Assalaa Valekum", file: "songs/Assalaa_Valekum.mp3" },
  { title: "Rakaasi Rakaasi", file: "songs/Rakaasi_Rakaasi.mp3" },
  { title: "Dam Damare", file: "songs/Dam_Damare.mp3" },
  { title: "Idhi Ranaragam", file: "songs/Idhi_Ranaragam.mp3" },
  { title: "Kurrayeedu", file: "songs/Kurrayeedu.mp3" },
  { title: "Neneppudaina", file: "songs/Neneppudaina.mp3" },
  { title: "Brathakaali", file: "songs/Brathakaali.mp3" },
  { title: "Dandiya India", file: "songs/Dandiya_India.mp3" },
  { title: "Oosaravelli (Theme)", file: "songs/Oosaravelli (Theme).mp3" },
  { title: "Young Yama", file: "songs/Young_Yama.mp3" },
  { title: "Rabbaru Gaajulu", file: "songs/Rabbaru_Gaajulu.mp3" },
  { title: "Baadshah", file: "songs/Baadshah.mp3" },
  { title: "Banthi Poola", file: "songs/Banthi_Poola.mp3" },
  { title: "Welcome Kanakam", file: "songs/Welcome_Kanakam.mp3" },
  { title: "Vaasthu Bagundhe", file: "songs/Vaasthu_Bagundhe.mp3" },
  { title: "Temper", file: "songs/Temper.mp3" },
  { title: "Ittage Recchipodham", file: "songs/Ittage_Recchipodham.mp3" },
  { title: "Dont Stop", file: "songs/Dont_Stop.mp3" },
  { title: "Love Me Again", file: "songs/Love_Me_Again.mp3" },
  { title: "Nannaku", file: "songs/Nannaku.mp3" },
  { title: "Pranaamam", file: "songs/Pranaamam.mp3" },
  { title: "Rock On", file: "songs/Rock_On.mp3" },
  { title: "Apple Beauty", file: "songs/Apple_Beauty.mp3" },
  { title: "Jayaho Janatha", file: "songs/Jayaho_Janatha.mp3" },
  { title: "Pakka LocaI", file: "songs/Pakka_Local.mp3" },
  { title: "Raavana", file: "songs/Raavana.mp3" },
  { title: "Tring Tring", file: "songs/Tring_Tring.mp3" },
  { title: "Nee kallona", file: "songs/Nee_kallona.mp3" },
  { title: "Swing Zara", file: "songs/Swing_Zara.mp3" },
  { title: "Dochestha", file: "songs/Dochestha.mp3" },
  { title: "Anaganaganaga", file: "songs/Anaganaganaga.mp3" },
  { title: "Peniviti", file: "songs/Peniviti.mp3" },
  { title: "Reddy Ikkada Soodu", file: "songs/Reddy_Ikkada_Soodu.mp3" },
  { title: "Vinavamma Toorupu", file: "songs/Vinavamma_Toorupu.mp3" },
  { title: "Kalynam Song", file: "songs/Kalynam_Song.mp3" },
  { title: "Deewangi", file: "songs/Deewangi.mp3" },
  { title: "Hawa Hawa", file: "songs/Hawa_Hawa.mp3" },
  { title: "First Class", file: "songs/First_Class.mp3" },
  { title: "Breathless", file: "songs/Breathless.mp3" },
  { title: "Mere Rashke Qamar", file: "songs/Mere_Rashke_Qamar.mp3" },
  { title: "Saibo", file: "songs/Saibo.mp3" },
  { title: "Sajde", file: "songs/Sajde.mp3" },
  { title: "Gun Gun Guna", file: "songs/Gun_Gun_Guna.mp3" },
  { title: "Chikni Chameli", file: "songs/Chikni_Chameli.mp3" },
  { title: "Salaam Rocky", file: "songs/Salaam_Rocky.mp3" },
  { title: "Evvadikevvadu Ba", file: "songs/Evvadikevvadu_Ba.mp3" },
  { title: "Dochai", file: "songs/Dochai.mp3" },
  { title: "Toofan", file: "songs/Toofan.mp3" },
  { title: "Yadagara Yadagara", file: "songs/Yadagara_Yadagara.mp3" },
  { title: "Sulthana", file: "songs/Sulthana.mp3" },
  { title: "Mehabooba", file: "songs/Mehabooba.mp3" },
  { title: "Monster", file: "songs/Monster.mp3" },
  { title: "O Pilaga Venkati", file: "songs/O_Pilaga_Venkati.mp3" },
  { title: "Thumak Thumak", file: "songs/Thumak_Thumak.mp3" },
  { title: "Chaiyya Chaiyya", file: "songs/Chaiyya_Chaiyya.mp3" },
  { title: "Uyi Amma", file: "songs/Uyi_Amma.mp3" },
  { title: "Raataan_Lambiyan", file: "songs/Raataan_Lambiyan.mp3" },
  { title: "Ranjha", file: "songs/Ranjha.mp3" },
  { title: "Ye Tune Kya Kiya", file: "songs/Ye_Tune_Kya_Kiya.mp3" },
  { title: "Qismat Badalti", file: "songs/Qismat_Badalti.mp3" },
  { title: "Tumse Milke", file: "songs/Tumse_Milke.mp3" },
  { title: "Aakaasam Nee", file: "songs/Aakaasam_Nee.mp3" },
  { title: "Kaatuka Kanule", file: "songs/Kaatuka_Kanule.mp3" },
  { title: "Thappalle Unna", file: "songs/Thappalle_Unna.mp3" }
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
const progress = document.getElementById("progress");
const songTitle = document.getElementById("songTitle");
const playlist = document.getElementById("playlist");

// 👇 ADD HERE
const playPauseBtn = document.getElementById("playPauseBtn");

function togglePlayPause() {
  if (audio.paused) {
    audio.play();
    playPauseBtn.innerHTML = "⏸";
  } else {
    audio.pause();
    playPauseBtn.innerHTML = "▶";
  }
}

audio.addEventListener("play", () => {
  playPauseBtn.innerHTML = "⏸";
});

audio.addEventListener("pause", () => {
  playPauseBtn.innerHTML = "▶";
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
