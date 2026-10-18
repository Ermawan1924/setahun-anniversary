# Upgrade dari 3 level ke 6 level tanpa kehilangan personalisasi

**Jangan menimpa satu folder proyek lama langsung dengan seluruh isi ZIP.** `dist/config.js` di paket ini masih berisi contoh, sedangkan konfigurasi dan foto yang kamu edit berada di komputermu.

1. Buat salinan folder proyek lama sebagai cadangan. Simpan juga `.env` jika portnya sudah diubah.
2. Ekstrak ZIP baru ke folder terpisah.
3. Salin **`dist/config.js` milikmu dari proyek lama** ke `dist/config.js` proyek baru. File lama kompatibel; nama, surat, musik, dan `puzzleImage: 'assets/nyanyu.jpg'` tetap bisa digunakan.
4. Salin **isi folder `dist/assets/` lama** ke folder `dist/assets/` baru. Gabungkan isinya; pertahankan `our-world.svg` dan `favicon.svg` bawaan jika tidak ada pengganti. Pastikan `nyanyu.jpg`, foto album, dan MP3 ikut tersalin.
5. Gunakan **`config-extra.js` baru** untuk pengaturan level 4–6. Default timeline mengikuti urutan `memories` dari konfigurasi lama. Sesuaikan jika perlu.
6. Salin `.env` lama ke folder baru jika sebelumnya digunakan. Jika Compose lama punya pengaturan khusus, gabungkan dengan Compose baru; Compose baru menambahkan mount `config-extra.js`.
7. Dari folder lama, hentikan container agar port bebas:

   ```bash
   docker compose down
   ```

8. Dari folder proyek baru, jalankan:

   ```bash
   docker compose up -d --build --force-recreate
   ```

9. Buka host dan port yang sama, lalu tekan **Ctrl + Shift + R**. Cek `/config.js` dan `/assets/nyanyu.jpg` bila gambar belum berubah.

## Bagaimana dengan progres lama?

Pertahankan `saveKey` dalam `config.js`, serta browser dan alamat website yang sama. Progres tiga level dimigrasikan otomatis: tiga hati tetap ada, dan pemain bisa lanjut ke level 4. Surat kembali mengikuti syarat baru, yaitu enam hati. Data permainan disimpan di browser, sehingga pergantian container sendiri tidak menghapusnya. Berpindah browser, domain, protokol, atau port berarti memakai penyimpanan berbeda.

Inventaris berburu hadiah dan perlengkapan kencan disimpan juga. Untuk benar-benar memulai dari awal, gunakan **Ulang cerita** dan konfirmasikan pilihan.

## Yang baru

- Level 4: urutkan timeline foto dan buka cerita di baliknya.
- Level 5: cari tiga benda lewat petunjuk NPC dan serahkan hasilnya.
- Level 6: rangkai buket, siapkan resep, pecahkan kode hadiah, lalu tata meja kencan.
- Mode Santai/Tantangan, puzzle 4×4, enam pasangan kartu, dan timer opsional.
- Pesan kegagalan gambar yang lebih jelas dan tombol muat ulang.

Tidak perlu memindahkan `.git` atau metadata hosting. Paket ini siap untuk Docker sendiri. Tautan game online yang dibuat lewat ChatGPT merupakan salinan terpisah; edit di Docker lokal tidak otomatis mengubah salinan online.
