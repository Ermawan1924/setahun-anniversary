/* LEVEL 4–6 + MODE. File config.js versi lama tetap bisa dipakai tanpa perubahan. */
window.ANNIVERSARY_EXTRA = {
  // Kosong = gunakan memories dari config.js, sesuai urutan array (awal → terbaru).
  // Atau isi [{ title:'Pertemuan pertama', date:'18 Oktober 2025', image:'assets/1.jpg',
  // text:'Cerita di balik foto...', icon:'☕' }, ...] dalam urutan yang benar.
  timeline: [],
  bonusMemoryCards: [
    { icon:'☾', title:'Cerita malam' },
    { icon:'✧', title:'Harapan kita' }
  ],
  treasures: {
    shell: { name:'Kerang kecil', icon:'◔', clue:'Di ujung barat pulau, ombak menyimpan sebuah benda kecil. Telusuri pesisir di sebelah kiri pondok.', hint:'Cari pantai di kiri bawah Pondok Cerita.', note:'Hal sederhana pun bisa menjadi hadiah kalau ditemukan bersamamu.' },
    ribbon: { name:'Pita harapan', icon:'⋈', clue:'Bulan kecil menjaga harapan kita. Carilah di sebelah kanan bangunan bulan di bukit utara.', hint:'Tepat di sebelah kanan Bukit Harapan.', note:'Satu pita untuk mengikat harapan yang ingin kita jaga.' },
    ticket: { name:'Tiket berdua', icon:'▤', clue:'Setelah lelah berjalan, kita duduk di dekat taman merah muda. Ada sesuatu di sekitar bangku.', hint:'Bangku ada di selatan Taman Kenangan.', note:'Tiket ke mana pun terasa lebih berharga jika perginya bersama kamu.' }
  },
  date: {
    flowers: {
      title:'Buket kecil untukmu',
      sequence:['rose','cream','sage'],
      challengeExtra:'rose',
      options:[{id:'rose',label:'Mawar',color:'#d998ab'},{id:'cream',label:'Melati',color:'#e4cf8e'},{id:'sage',label:'Daun hijau',color:'#8baa7b'}]
    },
    food: {
      title:'Bekal favorit kita',
      recipe:'Sandwich keju dan tomat: roti + keju + tomat.',
      ingredients:['roti','keju','tomat'],
      options:[{id:'roti',label:'Roti',icon:'▱'},{id:'keju',label:'Keju',icon:'◩'},{id:'tomat',label:'Tomat',icon:'●'},{id:'cabai',label:'Cabai',icon:'♨'},{id:'cokelat',label:'Cokelat',icon:'▦'},{id:'kopi',label:'Kopi',icon:'☕'}]
    },
    gift: {
      code:'123',
      clues:['Digit 1: jumlah tahun yang kita rayakan.', 'Digit 2: jumlah orang dalam kisah ini.', 'Digit 3: jumlah perlengkapan kencan yang perlu dikumpulkan.'],
      message:'Hadiah terbaik hari ini adalah waktu yang kita luangkan untuk satu sama lain.'
    }
  }
};
