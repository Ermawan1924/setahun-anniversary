# Bikin petualangan ini jadi cerita kalian

Semua konten personal ada di **`dist/config.js`**. Buka dengan VS Code atau editor teks lain. Simpan sebagai UTF-8. Pertahankan koma, kurung, dan tanda kutip JavaScript.

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

Foto dibagi menjadi 3 × 3 kepingan. Pengguna memilih dua kepingan untuk menukar posisi. Angka 1–9 dan bantuan satu keping membuatnya tetap santai. Jika file tidak ditemukan, permainan memakai ilustrasi bawaan.

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
3. Bukit Harapan → susun sembilan kepingan → hati ketiga.
4. Mercusuar Kita → surat anniversary → buka janji kecil → simpan surat jika mau.

Ketiga level bisa dimainkan ulang tanpa menambah jumlah hati. Menutup mini game di tengah jalan mengulang mini game tersebut, tetapi level yang sudah selesai tetap tersimpan.
