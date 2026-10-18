# Bikin petualangan ini jadi cerita kalian

Konten personal level 1–3, foto, musik, dan surat ada di **`dist/config.js`**. Level 4–6 diatur di **`dist/config-extra.js`**. Pengguna versi lama: baca **UPGRADE.md** terlebih dahulu. Buka dengan VS Code atau editor teks lain. Simpan sebagai UTF-8. Pertahankan koma, kurung, dan tanda kutip JavaScript.

## 1. Nama dan tanggal

```js
couple: {
  from: 'Mawan',
  to: 'Nama pasangan',
  startDate: '2025-10-18'
},
title: 'Setahun, dan masih kamu.',
subtitle: 'Ada hal-hal kecil yang membuat perjalanan ini terasa istimewa. Yuk, kita temukan lagi, satu per satu.',
```

`from` menjadi penulis surat; `to` adalah penerima. `startDate` memakai `YYYY-MM-DD` dan tahunnya muncul di footer. Game memang bertema anniversary pertama; tanggal tersebut tidak mengunci waktu bermain. Ganti dengan tanggal kalian, bukan otomatis tanggal hari ini.

Jika teks mengandung apostrof, pakai tanda kutip ganda: `title: "You're my favorite person"`.

## 2. Ganti teka-teki dengan pertanyaan tentang kalian

```js
quiz: [
  {
    question: 'Di mana kita pertama kali ketemu?',
    options: ['Kampus', 'Kedai kopi', 'Kantor'],
    answer: 1,
    hint: 'Tempat yang aromanya bikin betah.',
    note: 'Ternyata satu cangkir bisa jadi awal cerita panjang.'
  },
  {
    question: 'Makanan apa yang selalu kita pesan saat bingung?',
    options: ['Bakso', 'Sate', 'Nasi goreng'],
    answer: 2,
    hint: 'Favorit kita kalau sudah malam.',
    note: 'Yang penting makannya bareng kamu.'
  },
  {
    question: 'Apa rencana kencan berikutnya?',
    options: ['Piknik', 'Museum', 'Nonton film'],
    answer: 0,
    hint: 'Ada tikar dan bekal kecil.',
    note: 'Satu janji kecil lagi untuk kita.'
  }
],
```

`answer` dihitung dari **0**: opsi pertama = 0, kedua = 1, ketiga = 2. Pertanyaan boleh ditambah/dikurangi, tetapi jangan mengosongkan array. Setiap pertanyaan harus mempunyai satu jawaban benar, petunjuk, dan pesan setelah benar. Tidak ada hukuman atas jawaban salah.

## 3. Foto dan album kenangan

Siapkan **empat foto**. Salin ke folder `dist/assets/`, contohnya:

```text
dist/assets/kenangan-1.jpg
dist/assets/kenangan-2.jpg
dist/assets/kenangan-3.jpg
dist/assets/kenangan-4.jpg
```

Edit keempat objek dalam `memories`. Contoh satu objek:

```js
{
  icon: '☕',
  title: 'Kopi pertama kita',
  date: '18 Oktober 2025',
  text: 'Awalnya cuma mau ngopi sebentar. Eh, ternyata ngobrol sampai tempatnya hampir tutup.',
  image: 'assets/kenangan-1.jpg'
}
```

Ikon dan judul tampil pada kartu pasangan. Foto, tanggal, dan cerita tampil pada album setelah kartu selesai. Gunakan nama file sederhana, huruf/angka/tanda minus, dan cocokkan huruf besar-kecil. Hindari apostrof dan karakter khusus pada nama file. `image: ''` menampilkan ilustrasi ikon; foto yang tidak ditemukan diganti simbol hati.

JPG/PNG/WebP dapat dipakai. Foto portrait atau persegi cocok untuk album; kompres ukuran file agar ringan di HP. Empat objek berarti delapan kartu, yaitu empat pasangan.

## 4. Ganti gambar puzzle

Gunakan foto **persegi (1:1)**, misalnya 900 × 900 px. Simpan sebagai `dist/assets/puzzle-kita.jpg` lalu ubah:

```js
puzzleImage: 'assets/puzzle-kita.jpg',
```

Foto dibagi menjadi 3 × 3 kepingan pada mode Santai atau 4 × 4 pada mode Tantangan. Pengguna memilih dua kepingan untuk menukar posisi. Angka urutan dan bantuan satu keping mempermudah penyusunan; mode Tantangan mempunyai dua bantuan per percobaan. Jika file tidak ditemukan, permainan memakai ilustrasi bawaan.

## 5. Musik

Tanpa MP3, game sudah mempunyai melodi instrumental lembut yang dibangkitkan browser. Untuk menggantinya, taruh file audio yang boleh kamu gunakan sebagai `dist/assets/music.mp3`, lalu set:

```js
music: 'assets/music.mp3',
```

Musik diputar loop sesudah pemain menekan tombol **Musik mati**. Browser biasanya membatasi autoplay, jadi musik memang tidak dimulai sendiri. Gunakan `music: ''` untuk kembali ke melodi bawaan. File MP3 tidak termasuk di paket ini.

## 6. Surat dan hadiah akhir

```js
letter: {
  greeting: 'Untuk kamu yang selalu membuatku tersenyum.',
  paragraphs: [
    'Tulis paragraf pertamamu di sini.',
    'Terima kasih untuk satu tahun yang penuh cerita.',
    'Aku berharap kita punya lebih banyak petualangan setelah ini.'
  ],
  closing: 'Dengan sayang,',
  promise: 'Voucher satu kencan: kamu pilih tempatnya, aku siapkan waktunya. ♡'
}
```

Setiap item `paragraphs` menjadi paragraf terpisah. `promise` berada di kartu kejutan yang harus diketuk. Nama penulis diambil dari `couple.from`. Pemain bisa menyimpan surat sebagai TXT.

## 7. Pratinjau hasil edit

Dengan Compose yang sedang berjalan, refresh halaman setelah mengubah config/foto/musik. Lakukan hard refresh jika browser masih menampilkan konten lama. Jika belum berubah karena bind mount file, jalankan:

```bash
docker compose up -d --force-recreate
```

Uji dari awal dengan tombol **Ulang cerita**. Jika kamu ingin mengubah identitas penyimpanan untuk versi cerita baru, ganti `saveKey` ke nilai baru, misalnya `setahun-mawan-v2`. Ini membuat progres baru, sementara data key lama tetap ada di browser.

Jalankan dari HTTP/HTTPS (Docker atau server lokal), agar media dan penyimpanan bekerja konsisten. Jangan bergantung pada double-click `index.html` dengan URL `file://`.

## Alur hadiah

1. Mulai di dermaga → Pondok Cerita → selesaikan semua pertanyaan → hati pertama.
2. Taman Kenangan → cocokkan empat pasangan → hati kedua → baca album foto.
3. Bukit Harapan → susun puzzle → hati ketiga.
4. Telaga Waktu → urutkan timeline → baca cerita → hati keempat.
5. Pos Penjelajah → cari kerang, pita, dan tiket lewat petunjuk → kembali menyerahkan temuan → hati kelima.
6. Kebun Senja → kunjungi perangkai bunga, dapur, dan kotak hadiah → kembali menata meja → hati keenam.
7. Mercusuar Kita → surat anniversary → buka janji kecil → simpan surat jika mau.

Level 1–4 bisa dimainkan ulang tanpa menambah jumlah hati. Level 5–6 yang sudah selesai menampilkan koleksi dan persiapan yang sudah lengkap. Menutup mini game di tengah jalan mengulang mini game tersebut, tetapi level yang sudah selesai tetap tersimpan.

## 8. Timeline kenangan (level 4)

Default `timeline: []` dalam `dist/config-extra.js` menggunakan foto, judul, tanggal, dan cerita dari `memories` di `dist/config.js`. **Urutan array adalah kunci jawaban**, dari momen terawal sampai terbaru. Tidak ada pengurutan tanggal otomatis; kamu bisa memakai label seperti “Kencan pertama”.

Untuk timeline tersendiri, ganti array kosong dengan minimal dua objek (empat sampai enam disarankan):

```js
timeline: [
  { title: 'Pertama bertemu', date: '18 Oktober 2025', image: 'assets/ketemu.jpg', icon: '☕', text: 'Cerita pertemuan kita…' },
  { title: 'Jalan bersama', date: 'Desember 2025', image: 'assets/jalan.jpg', icon: '✈', text: 'Liburan kecil pertama…' },
  { title: 'Anniversary pertama', date: '18 Oktober 2026', image: 'assets/anniversary.jpg', icon: '♡', text: 'Satu tahun yang berarti…' }
],
```

Game mengacak kartu, pemain mengurutkan dengan ↑/↓, lalu memeriksa jawabannya. Mode Santai menampilkan label tanggal; Tantangan menyembunyikannya dan membatasi bantuan menjadi satu penempatan. Cerita lengkap muncul setelah urutannya benar. Siapkan petunjuk pada judul bila tanggal disembunyikan, agar pasangan dapat mengenali momen tersebut.

## 9. Berburu hadiah (level 5)

Edit `treasures.shell`, `treasures.ribbon`, dan `treasures.ticket` di `config-extra.js`. Masing-masing mempunyai `name`, `icon`, `clue`, `hint`, dan `note`.

- `clue`: petunjuk utama dari NPC.
- `hint`: penjelasan lokasi saat pemain meminta bantuan.
- `note`: pesan setelah menemukan benda.

Pertahankan ID `shell`, `ribbon`, `ticket`. Lokasi sudah ditentukan di `engine.js`: kerang di pantai barat, pita di kanan Bukit Harapan, tiket di dekat bangku taman. Jika hanya mengubah teks, pastikan petunjuk tetap sesuai lokasi. Benda ditemukan berurutan, disimpan di tas, lalu diserahkan ke Pos Penjelajah. Mode Tantangan menyembunyikan benda sampai pemain dekat atau meminta petunjuk; mode Santai menampilkan benda aktif dan menyediakan navigasi otomatis.

## 10. Siapkan kencan (level 6)

Tiga tugas memakai data `date` di `config-extra.js`:

1. **`flowers`** — pemain merangkai urutan bunga. `sequence` berisi ID dari `options`. Mode Tantangan menambahkan `challengeExtra`, menampilkan urutan selama empat detik, lalu menyembunyikannya. Pemain boleh melihat urutan kembali dengan mengulang tugas bunga.
2. **`food`** — `recipe` berisi petunjuk resep; `ingredients` berisi ID bahan yang benar; `options` berisi seluruh pilihan. Jawaban harus tepat, tanpa bahan tambahan. Cocokkan setiap ID bahan dengan opsi yang tersedia.
3. **`gift`** — `code` adalah string angka (contoh `'123'`), `clues` berisi petunjuk setiap digit, dan `message` ditampilkan setelah kotak terbuka. Jangan mengubah kode tanpa menyesuaikan petunjuk.

Bunga, bekal, dan hadiah tersimpan di tas. Kembali ke Kebun Senja lalu tekan **Tata meja & rayakan** untuk mendapat hati keenam. Surat terbuka sesudah enam hati terkumpul.

## 11. Mode dan timer

Pemain memilih mode lewat tombol di atas peta:

| Fitur | Santai | Tantangan |
| --- | --- | --- |
| Kartu pasangan | 4 pasangan | 6 pasangan |
| Puzzle | 3×3 | 4×4 |
| Petunjuk tebak-tebakan | Bebas | 2 untuk seluruh level |
| Bantuan puzzle | Bebas | 2 per percobaan |
| Bantuan timeline | Bebas | 1 per percobaan |
| Urutan bunga | Tetap terlihat | Diperlihatkan 4 detik |
| Timer | Tidak ada | Opsional; default mati |

Dua kartu tambahan untuk mode Tantangan berasal dari `bonusMemoryCards`. Untuk variasi sendiri, edit ikon dan judulnya. Album foto tetap menggunakan `memories`.

Timer hanya berjalan pada kartu (3 menit), puzzle (5 menit), dan timeline (3 menit). Timer berhenti saat tab tidak aktif atau dialog ditutup. Waktu habis membuka pilihan mencoba lagi atau beralih ke Santai; hati dan inventaris sebelumnya tetap tersimpan. Mode bisa diubah tanpa menghapus progres. Percobaan mini game yang ditutup dimulai ulang saat dibuka kembali.

## 12. Jika JPG belum tampil

Pastikan `puzzleImage: 'assets/nyanyu.jpg'` dan file benar-benar ada di `dist/assets/nyanyu.jpg`. Buka `/assets/nyanyu.jpg` dan `/config.js` pada host/port Docker yang sama. Perhatikan huruf besar-kecil, lalu recreate container jika konfigurasi lama masih terpasang:

```bash
docker compose up -d --build --force-recreate
```

Versi ini menunjukkan nama file yang gagal dimuat di dalam puzzle, menyediakan tautan file, serta tombol **Coba muat ulang**. Pastikan gambar dapat dibuka browser (mengganti ekstensi file HEIC menjadi JPG saja tidak mengonversi format). Perubahan lokal Docker tidak mengubah tautan game yang dihosting terpisah.
