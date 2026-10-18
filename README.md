# Setahun — Petualangan Kita

Mini game anniversary satu tahun dengan nuansa pulau pixel art, warna sage, kertas krem, dan surat cinta. Bahasa Indonesia, tanpa database, tanpa npm install, tanpa build frontend, dan tanpa CDN.

## Isi permainan

| Bagian | Permainan / hadiah |
| --- | --- |
| RPG sederhana | Jalan-jalan di pulau, collision, interaksi dengan NPC, serta rute otomatis ke tujuan |
| Level 1 — Awal cerita | Tiga teka-teki pilihan ganda; jawaban salah bisa dicoba lagi; petunjuk tersedia |
| Level 2 — Jejak kenangan | Cocokkan empat pasang kartu untuk membuka empat cerita dan foto kenangan |
| Level 3 — Kepingan kita | Susun puzzle gambar 3 × 3 dengan menukar dua kepingan; tersedia gambar acuan dan bantuan |
| Epilog | Surat anniversary, kejutan janji kencan, confetti, dan unduh surat sebagai TXT |

Ada musik instrumental bawaan yang diaktifkan melalui tombol Musik. Bisa diganti MP3 milikmu. Peta, ilustrasi puzzle, dan ikon dibuat dengan kode/SVG; paket tidak bergantung pada font, gambar, atau audio eksternal.

**Nama pasangan, tanggal, dan kenangan masih berupa contoh.** Edit `dist/config.js` sebelum diberikan ke pasangan. Panduan lengkap: [PANDUAN-EDIT.md](PANDUAN-EDIT.md).

## Jalankan dengan Docker Compose

Prasyarat: Docker Engine + Compose plugin atau Docker Desktop dengan Linux containers. Jalankan dari folder yang berisi `docker-compose.yml`:

```bash
docker compose up -d --build
```

Buka **http://localhost:8080**. Dari HP dalam jaringan yang sama, gunakan `http://IP-KOMPUTER:8080` dan izinkan port tersebut pada firewall jaringan lokal jika diperlukan. Jika memakai VM Ubuntu bridged, gunakan IP VM.

Mengubah port bersifat opsional. Salin `.env.example` menjadi `.env`, lalu ubah `PORT=8080` menjadi misalnya `PORT=8088`:

```bash
# Linux / macOS
cp .env.example .env

# PowerShell (gunakan ini sebagai pengganti cp di atas)
Copy-Item .env.example .env
```

Setelah mengubah `.env`:

```bash
docker compose up -d
```

Perintah operasional:

```bash
docker compose ps
docker compose logs --tail=100 -f anniversary
docker compose exec anniversary nginx -t
docker compose exec anniversary wget -qO- http://127.0.0.1:8080/healthz
docker compose down
```

Endpoint `/healthz` mengembalikan `ok`. Image mempunyai health check. Container menggunakan Nginx non-root pada port internal 8080, root filesystem read-only, dan direktori temporary di `/tmp`.

`dist/config.js` dan folder `dist/assets/` di-bind mount oleh Compose. Sesudah mengedit teks atau menambah foto/musik, refresh browser. Jika editor mengganti file dengan cara rename dan perubahan belum terlihat, jalankan `docker compose up -d --force-recreate`. Jika mengubah HTML/CSS/JS permainan, jalankan kembali `docker compose up -d --build`.

## Jalankan Dockerfile langsung

```bash
docker build -t setahun-anniversary:local .
docker run --rm -p 8080:8080 --name setahun-anniversary setahun-anniversary:local
```

Mode ini mengambil konfigurasi saat build. Ulangi build jika isi berubah, atau tambahkan bind mount sendiri.

## Tanpa Docker

Semua frontend berada di `dist/`. Jika sudah memiliki Python 3:

```bash
python3 -m http.server 8080 --directory dist
```

Di Windows dapat menggunakan `py -m http.server 8080 --directory dist`. Tidak perlu Node.js untuk menjalankan game. Folder `dist/` juga dapat ditempatkan di hosting statis.

## Kontrol

- Desktop: klik Mulai, WASD / panah untuk berjalan, E untuk berinteraksi.
- Mouse / HP: ketuk lokasi yang dapat dilalui di peta, atau gunakan tombol arah.
- Klik salah satu level di **Perjalanan kita** untuk berjalan ke lokasinya secara otomatis.
- Semua mini game memakai tombol yang bisa dioperasikan dengan Tab dan Enter. Escape menutup dialog.
- Musik harus dinyalakan dengan klik; tidak autoplay.

## Progres dan data

- Level yang selesai serta posisi karakter tersimpan di `localStorage` browser. Progres tidak disinkronkan antar-HP/browser/domain.
- Jika penyimpanan browser diblokir, game tetap dapat dimainkan selama halaman masih terbuka.
- Mini game yang ditutup sebelum selesai akan mulai ulang; kepingan hati dari level sebelumnya tetap tersimpan.
- Tombol **Ulang cerita** meminta konfirmasi sebelum menghapus progres pada browser ini.
- Tidak ada akun, admin panel, backend, database, analytics, atau pengiriman data permainan.
- Semua teks, foto, dan jawaban merupakan file statis yang dapat dibaca pengunjung yang bisa mengakses game. Jangan menaruh password atau rahasia akun di konfigurasi. Docker Compose ini menyediakan HTTP; bila dipublikasikan di internet, gunakan reverse proxy/domain HTTPS milikmu.

## Struktur source

```text
setahun-anniversary/
  dist/
    index.html       # Halaman permainan
    style.css        # Tampilan responsif
    app.js           # UI, map renderer, audio, mini games
    engine.js        # Pergerakan, route, puzzle, progress
    config.js        # Seluruh konten personal
    assets/
      our-world.svg  # Gambar puzzle bawaan
      favicon.svg
  tests/game.test.cjs
  Dockerfile
  docker-compose.yml
  nginx.conf
  .env.example
  package.json
  README.md
  PANDUAN-EDIT.md
```

## Pemeriksaan

Jika Node.js 18+ tersedia, tanpa install dependency:

```bash
npm test
npm run check
```

Paket telah melewati sembilan pengujian logika: konektivitas semua tujuan, collision, urutan unlock, reward idempotent, pemulihan progres, solvabilitas 300 puzzle acak, pertukaran kepingan, pasangan kartu, validitas konfigurasi, dan pembatasan path asset (sebagian diuji dalam test yang sama). Syntax JavaScript juga diperiksa.

**Batas verifikasi saat pembuatan:** lingkungan pengerjaan tidak menyediakan Docker maupun jalur QA browser yang didukung. Build/start container dan tampilan/interaksi browser belum diuji langsung. Jalankan perintah Compose di atas lalu coba satu putaran penuh pada browser target sebelum dipakai untuk kejutan.

Referensi konfigurasi: [Docker Compose services](https://docs.docker.com/reference/compose-file/services/) dan [Nginx HTTP core module](https://nginx.org/en/docs/http/ngx_http_core_module.html).
