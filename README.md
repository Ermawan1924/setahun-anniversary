# Setahun — Petualangan Kita, versi 2.0

Mini game anniversary satu tahun berbahasa Indonesia: pulau pixel art, enam chapter, dua mode permainan, dan surat cinta. Tanpa database, tanpa npm install, tanpa build frontend, dan tanpa CDN.

**Sudah memakai versi tiga level? Baca [UPGRADE.md](UPGRADE.md) sebelum menyalin file.** Konfigurasi dan foto personal lama tetap bisa digunakan.

## Enam level

| Level | Challenge | Hadiah |
| --- | --- | --- |
| 1. Awal cerita | Tebak-tebakan dengan petunjuk | Hati pertama |
| 2. Jejak kenangan | Cocokkan 4/6 pasang kartu | Album foto + hati kedua |
| 3. Kepingan kita | Puzzle gambar 3×3 / 4×4 | Hati ketiga |
| 4. Urutan cerita | Susun timeline dari awal sampai terbaru | Cerita setiap momen + hati keempat |
| 5. Berburu hadiah | Cari kerang, pita, dan tiket lewat petunjuk NPC; kembali menyerahkan temuan | Hati kelima |
| 6. Kencan untuk kita | Rangkai buket, pilih bahan resep, pecahkan kode kotak hadiah, lalu kembali menata meja | Hati keenam |
| Epilog | Kunjungi mercusuar setelah enam hati | Surat, janji kencan, confetti, unduh TXT |

Peta dapat dijelajahi dengan WASD/panah, tombol sentuh, atau klik. Pemilihan level menavigasikan karakter otomatis. Level 5 dan 6 menggunakan lokasi dan inventaris nyata dalam game.

## Mulai dengan Docker

Memerlukan Docker Engine + Compose plugin atau Docker Desktop dengan Linux containers. Jalankan dari folder proyek:

```bash
docker compose up -d --build
```

Buka **http://localhost:8080**. Dari HP di jaringan sama, gunakan `http://IP-KOMPUTER:8080`. Untuk VM bridged, gunakan IP VM. Sesuaikan firewall jaringan lokal jika diperlukan.

Port opsional: salin `.env.example` menjadi `.env`, ubah `PORT=8080` (misalnya 8088), lalu jalankan `docker compose up -d`.

```bash
docker compose ps
docker compose logs --tail=100 -f anniversary
docker compose exec anniversary nginx -t
docker compose exec anniversary wget -qO- http://127.0.0.1:8080/healthz
docker compose down
```

`/healthz` menghasilkan `ok`. Container menggunakan Nginx non-root pada port internal 8080, root filesystem read-only, temporary directory `/tmp`, serta health check bawaan image proyek.

Compose memasang `dist/config.js`, `dist/config-extra.js`, dan `dist/assets/` sebagai bind mount read-only. Edit konten lalu refresh browser. Jika editor mengganti inode file dan perubahan belum terbaca, recreate:

```bash
docker compose up -d --build --force-recreate
```

Perubahan `index.html`, `app.js`, `engine.js`, atau CSS memerlukan rebuild. Konfigurasi Docker memakai HTTP; untuk hosting internet gunakan reverse proxy/domain HTTPS sendiri.

Dockerfile langsung juga didukung:

```bash
docker build -t setahun-anniversary:local .
docker run --rm -p 8080:8080 --name setahun-anniversary setahun-anniversary:local
```

Dalam mode langsung ini, konten mengikuti saat build (tanpa bind mount Compose).

## Personalisasi

- **`dist/config.js`**: nama, tanggal, soal, foto/teks kenangan, gambar puzzle, musik, surat akhir.
- **`dist/config-extra.js`**: timeline khusus, petunjuk berburu, kartu tambahan, urutan bunga, resep, kode hadiah.
- **`dist/assets/`**: foto dan musik milikmu. JPG/PNG/WebP didukung; puzzle sebaiknya memakai gambar persegi.
- **[PANDUAN-EDIT.md](PANDUAN-EDIT.md)**: contoh lengkap.

Konten paket masih contoh. Foto `nyanyu.jpg` dan MP3 personal tidak termasuk; salin dari proyek milikmu. Melodi instrumental bawaan bisa diaktifkan tanpa file audio tambahan. Tidak ada autoplay.

## Mode permainan

**Santai:** empat pasang kartu, puzzle 3×3, petunjuk bebas, tanggal timeline terlihat, navigasi bantuan berburu tersedia, urutan bunga tetap terlihat, tanpa timer.

**Tantangan:** enam pasang kartu, puzzle 4×4, dua petunjuk untuk level tebak-tebakan, dua bantuan puzzle, satu bantuan timeline, tanggal timeline disembunyikan, benda buruan baru terlihat dari dekat atau setelah petunjuk lokasi dibuka, dan urutan bunga ditampilkan empat detik sebelum diingat kembali.

Timer opsional (default mati) hanya berlaku untuk kartu 3 menit, puzzle 5 menit, dan timeline 3 menit. Tab tidak aktif menjeda waktu. Saat habis, pilih coba lagi atau beralih ke Santai. Hati/inventaris sebelumnya tidak hilang. Mode dapat diganti lewat tombol di atas peta.

## Progres dan privasi

Level selesai, mode, posisi, inventaris berburu, dan perlengkapan kencan disimpan di `localStorage`. Tidak disinkronkan antar-browser atau alamat website. Progres versi satu otomatis dimigrasikan dengan `saveKey` dan origin yang sama. Mini game yang ditutup sebelum selesai dimulai ulang saat dibuka lagi; hati dan barang yang diperoleh tetap tersimpan. Jika penyimpanan browser diblokir, permainan tetap berjalan selama halaman terbuka. Tombol Ulang cerita meminta konfirmasi.

Tidak ada akun, admin panel, backend, analytics, atau pengiriman progres. Foto, teks, dan jawaban adalah file statis yang bisa dibaca pengunjung yang punya akses. Jangan menyimpan kredensial di konfigurasi.

## Menjalankan tanpa Docker

Dengan Python 3:

```bash
python3 -m http.server 8080 --directory dist
```

Di Windows dapat memakai `py -m http.server 8080 --directory dist`. Node.js tidak diperlukan untuk bermain. Folder `dist/` dapat dipasang di hosting statis.

## Verifikasi

Dengan Node.js 18+, tanpa install dependency:

```bash
npm test
npm run check
```

18 pengujian logika mencakup seluruh rute, collision, unlock berurutan, migrasi progres, inventaris dan pengantaran barang, urutan timeline, recipe, konten default, serta solvabilitas puzzle 3×3/4×4. Syntax JavaScript, referensi asset/HTML, dan YAML Compose diperiksa.

**Batas verifikasi:** browser interaktif dan Docker tidak tersedia lewat jalur QA yang didukung di lingkungan pembuatan. Container belum dibuild/dijalankan langsung dan tampilan browser belum diverifikasi secara visual. Coba satu putaran penuh pada browser target sebelum dipakai sebagai kejutan.

Referensi: [Docker Compose](https://docs.docker.com/reference/compose-file/services/) dan [Nginx](https://nginx.org/en/docs/http/ngx_http_core_module.html).
