# Kepatuhan PDP — Catatan Implementasi & Template DPIA

Acuan: UU 27/2022 tentang Pelindungan Data Pribadi dan PP 33/2026 (diundangkan 16 Juli 2026, **berlaku 16 Januari 2027**).

## Data pribadi yang diproses

| Data | Sumber | Tujuan | Catatan risiko |
|---|---|---|---|
| Nama, NRP | Input petugas / SSO | Identifikasi pelaksana P2H/P5M (kewajiban SMKP) | — |
| Foto unit/kegiatan | Kamera HP | Bukti pemeriksaan | Wajah pekerja bisa ikut terekam |
| Titik GPS + waktu | GPS HP | Bukti lokasi pemeriksaan | **Risiko tinggi**: bisa merekonstruksi pergerakan pekerja |
| Daftar hadir P5M | Input pemimpin | Bukti safety talk untuk auditor | Data kehadiran = data kepegawaian |

## Dasar hukum pemrosesan
Utamakan **pelaksanaan kewajiban hukum** (SMKP Minerba), bukan persetujuan — consent karyawan lemah karena hubungan kerja tidak setara. Persetujuan hanya untuk pemrosesan di luar kewajiban itu.

## Kewajiban PP 33/2026 dan status di produk

| Kewajiban | Status | Di mana |
|---|---|---|
| Kebijakan pemrosesan internal | 🔴 Dokumen klien | — |
| DPIA sebelum go-live | 🟡 Template di bawah | dokumen ini |
| Penunjukan Pejabat PDP (DPO) | 🔴 Tugas klien | — |
| Hak akses & penghapusan subjek data | 🟡 Endpoint siap | `POST /pdp` (AKSES / PENGHAPUSAN) |
| Retensi & pemusnahan | 🟡 Cron siap, default mati | `RETENTION_SERVER_DAYS`, `RETENTION_CRON_ENABLED` |
| Lapor kebocoran ≤ 3×24 jam | 🔴 Prosedur belum ada | audit log + alerting jadi fondasinya |
| Transfer data lintas negara | ⚪ Belum relevan | semua data on-premise/lokal |

**Catatan desain penting:** permintaan penghapusan **menganonimkan** nama/NRP dan menghapus foto, tetapi record pemeriksaannya tetap disimpan — karena kewajiban SMKP menuntut riwayat keselamatan tetap ada. Ini keseimbangan antara dua aturan dan sebaiknya dinyatakan eksplisit dalam kebijakan privasi klien.

## Template DPIA (isi bersama klien sebelum go-live)
1. **Deskripsi pemrosesan** — jenis data, jumlah subjek data, frekuensi, lama penyimpanan.
2. **Kebutuhan & proporsionalitas** — mengapa GPS dan foto diperlukan; apakah ada alternatif yang kurang invasif (mis. geofence kasar, bukan titik presisi).
3. **Risiko terhadap subjek data** — pemantauan berlebihan, penyalahgunaan data lokasi untuk penilaian kinerja, kebocoran foto.
4. **Mitigasi** — RBAC, audit trail, retensi otomatis, anonimisasi, enkripsi saat transit & saat disimpan, larangan penggunaan untuk penilaian kinerja (tertulis).
5. **Sisa risiko & persetujuan** — tanda tangan pemilik proses dan DPO.

## Checklist teknis sebelum go-live
- [ ] `AUTH_ENABLED=true` dengan IdP klien; tidak ada endpoint terbuka
- [ ] `POST /admin/reset` dinonaktifkan total di produksi
- [ ] TLS di semua jalur (HP ↔ API ↔ dashboard)
- [ ] Enkripsi DB perangkat (SQLCipher) dan enkripsi at-rest di server
- [ ] Retensi aktif + uji pemusnahan
- [ ] Audit log diarsipkan terpisah dan tidak bisa diubah
- [ ] Uji coba prosedur lapor kebocoran 3×24 jam (tabletop exercise)
