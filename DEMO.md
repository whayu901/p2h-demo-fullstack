# Skrip Demo — Digitalisasi P2H & P5M (± 6 menit)

## Persiapan (sebelum klien masuk ruangan)

- [ ] `npm run api` dan `npm run dashboard` jalan. Dashboard dibuka di http://localhost:5173, halaman **Beranda**.
- [ ] Dashboard → menu **⋮** di shell bar → **Reset demo data**. Data contoh kembali, termasuk satu unit **STOP OPERASI** hari ini.
- [ ] HP (Android, Expo Go): **Pengaturan → Reset semua data lokal**. Home menunjukkan tertunda **0**.
- [ ] Pengaturan: URL server benar, indikator hijau **"Server terjangkau"**.
- [ ] Izin kamera & lokasi sudah pernah diberikan (supaya tidak muncul pop-up saat demo).
- [ ] Mirror layar HP ke laptop (scrcpy / Vysor) supaya klien bisa melihat.

---

## 1. Pembuka — dashboard (30 detik)

**Tunjukkan:** Beranda. Tile merah **Unit STOP OPERASI**.

> "Ini tampilan untuk pengawas dan HSE. Semua P2H dan P5M yang masuk hari ini terlihat di sini. Tile merah ini artinya ada unit yang tidak boleh jalan — dan kita tahu itu tanpa menunggu kertas P2H dikumpulkan akhir shift."

## 2. Matikan internet (20 detik)

**Lakukan:** di HP, nyalakan **mode pesawat**. Titik di Home berubah merah **"Server tidak terjangkau"**.

> "Di pit sinyal sering tidak ada. Kita mulai dari kondisi terburuk: HP sama sekali tidak terhubung."

## 3. Isi P2H — momen utama (2 menit)

**Lakukan:** **P2H** → pilih **DT-014** → isi nama operator, NRP, shift, lokasi kerja, HM awal.

> "Header-nya sama dengan form kertas yang sekarang: nama, NRP, shift, lokasi, HM. Checklist-nya mengikuti jenis unit — dump truck 21 item, dalam tiga bagian: keliling unit, dalam kabin, test fungsi. Setiap item punya kode bahaya: AA sangat bahaya, sampai C bahaya rendah."

**Lakukan:** tekan **Semua Normal** di bagian A dan B. Status: **LAYAK OPERASI** (hijau).

**Lakukan:** di bagian C, tandai **Rem utama (service brake)** = **Tidak Normal**, keterangan "Pedal rem terasa dalam".

**Tunjukkan:** status langsung berubah jadi **STOP OPERASI** merah — *"Unit tidak layak operasi. Segera laporkan ke pengawas."* — dengan item Rem utama (AA) tercantum.

> "Ini bedanya dengan kertas. Di kertas, operator memberi tanda X, dan keputusan unit boleh jalan atau tidak tergantung apakah foreman sempat membaca lembar itu — seringnya tidak, atau terlambat. Di sini aturannya dijalankan saat itu juga: satu temuan kode AA atau A, unit berhenti. Aturan yang sama dipakai di HP, di server, dan di dashboard — tidak ada yang bisa menafsirkan beda."

**Lakukan:** centang pernyataan operator → ambil foto → **Simpan**. Tersimpan seketika, tertunda jadi **1**.

> "Tersimpan langsung di HP. Tidak ada loading, tidak menunggu server."

## 4. Isi P5M (60 detik)

**Lakukan:** **P5M** → pilih topik preset "Bahaya blind spot alat berat" → lokasi, departemen/regu, pemimpin + NRP → tambah 1 potensi bahaya dan 1 komitmen → tambah 3 peserta (nama + NRP), tandai satu **tidak hadir** → **Simpan**.

> "Daftar hadir yang biasanya ditandatangani di kertas sekarang tercatat per nama dan NRP — dan jumlah yang benar-benar hadir itulah yang dicek auditor."

## 5. Koreksi sebelum terkirim (30 detik)

**Lakukan:** **Riwayat** → tekan lama data P5M (label **Menunggu**) → **Ubah** → tandai peserta tadi **hadir** → Simpan.

> "Selama belum terkirim, operator masih bisa memperbaiki salah ketik. Begitu terkirim, data terkunci."

## 6. Sinkronisasi (45 detik)

**Lakukan:** matikan mode pesawat, tunggu titik hijau, tekan **Sinkronisasi**. Di Riwayat, dua data berubah jadi **Tersinkron**. Buka salah satunya — tidak ada tombol ubah/hapus, muncul *"Data sudah terkirim dan tidak bisa diubah. Koreksi harus melalui pengawas."*

> "Satu tombol, semua data tertunda terkirim sekaligus. Setelah terkirim, HP tidak bisa mengubahnya — ini yang membuat data layak jadi bukti audit."

## 7. Kembali ke dashboard (60 detik)

**Tunjukkan:** Beranda (otomatis diperbarui tiap 10 detik, atau **Muat ulang**). **Unit STOP OPERASI** bertambah.

**Lakukan:** **P2H** → filter Status kelayakan = STOP OPERASI → **Go** → klik DT-014 → halaman detail: status besar merah, item Rem utama tersorot dengan kode AA, foto, **Buka di Google Maps**, bagian **Tindak Lanjut** "Menunggu tindak lanjut pengawas".

> "Pengawas langsung melihat unit mana yang harus berhenti, kenapa, fotonya, dan di mana. Bagian tindak lanjut ini tempat rekomendasi mekanik dan keputusan pengawas — alur approval-nya kita bahas setelah alur dasarnya disepakati."

**Lakukan:** **P5M** → kolom **Peserta hadir** menunjukkan 3 / 3 (hasil koreksi tadi, bukan baris baru).

## 8. Tekan Sinkronisasi sekali lagi (15 detik)

**Lakukan:** tekan **Sinkronisasi** lagi → "Tidak ada data tertunda". Dashboard tidak berubah.

> "Tidak ada yang dobel. Setiap form punya ID unik yang dibuat di HP, jadi kalaupun sinyal putus di tengah pengiriman dan data terkirim ulang, server tahu itu data yang sama dan hanya memperbaruinya."

## Penutup

> "Yang ingin kami sepakati hari ini adalah alurnya: isi di lapangan tanpa sinyal, keputusan kelayakan unit langsung di tempat, kirim saat terhubung, pantau di dashboard. Login, approval, dan laporan kita bahas setelah alurnya pas."

---

## Pertanyaan yang kemungkinan muncul

**"Kalau HP-nya hilang gimana?"**
Data yang sudah disinkronkan aman di server — server menyimpan seluruh riwayat, HP hanya menyimpan data terbaru (default 7 hari). Yang hilang hanya data yang belum sempat dikirim, dan jendelanya kecil karena operator bisa sinkron setiap lewat area Wi-Fi. Untuk produksi: login per operator, data lokal terenkripsi, dan peringatan kalau ada data tertunda terlalu lama.

**"Kalau dua orang isi form untuk unit yang sama?"**
Keduanya tersimpan sebagai dua pemeriksaan terpisah, tidak ada yang tertimpa, karena setiap form punya ID sendiri. Dashboard menunjukkan siapa dan jam berapa. Status unit di halaman **Unit** mengikuti pemeriksaan terakhir. Kalau aturannya "satu P2H per unit per shift", itu bisa jadi validasi di versi berikutnya.

**"Memori HP penuh lama-lama?"** *(bonus)*
Data yang sudah terkirim dibersihkan otomatis setelah 7/14/30 hari, termasuk fotonya. Data yang belum terkirim tidak pernah dihapus otomatis, berapa pun umurnya.

---

## Kalau demo bermasalah

| Gejala | Cek |
|---|---|
| Titik merah padahal Wi-Fi nyala | URL di Pengaturan sama dengan `ipconfig getifaddr en0`? HP & laptop satu Wi-Fi? Firewall macOS mengizinkan Node? |
| Dashboard "Tidak dapat terhubung ke API" | Terminal API masih jalan? `curl localhost:3000/health` |
| Tile "hari ini" nol | Data contoh dibuat hari lain → ⋮ → **Reset demo data** |
| Foto tidak muncul | Sinkron ulang; cek folder `apps/api/uploads/` |
| Perlu mulai dari nol lagi | Dashboard ⋮ → Reset demo data; HP → Pengaturan → Reset semua data lokal |
