# Roadmap Produksi — Digitalisasi P2H & P5M

Status saat ini: **demo yang berfungsi penuh** (offline-first, sync idempoten, dashboard SAP-style, peta geotagging) plus **boilerplate produksi** (RBAC, audit trail, alur tindak lanjut, integritas bukti, PDP) yang sudah tertanam di kode tetapi **nonaktif secara default**.

Dokumen ini memetakan apa yang tinggal "dicolok" (plug-and-play) versus apa yang masih perlu dibangun.

## Ringkasan kesiapan

| Kapabilitas | Status | Yang tersisa |
|---|---|---|
| Offline-first + sync idempoten | ✅ Selesai | — |
| Aturan kelayakan unit (AA/A → STOP OPERASI) | ✅ Selesai, satu implementasi | — |
| Alur tindak lanjut (mekanik → pengawas) | 🟡 Boilerplate jalan | Notifikasi, SLA, eskalasi |
| RBAC (5 peran) | 🟡 Tabel izin final, guard aktif | Sambungkan ke IdP klien |
| Autentikasi | 🟡 Verifikasi JWT/JWKS siap, `AUTH_ENABLED=false` | Tenant Entra ID + pemetaan grup |
| Audit trail hash-chain | 🟡 Boilerplate jalan | Retensi jangka panjang, ekspor auditor |
| Integritas bukti (mock GPS, selisih jam) | 🟡 Terdeteksi & ditampilkan | Kebijakan penolakan, watermark foto |
| Tanda tangan elektronik | 🟡 Hash demo | Integrasi PSrE tersertifikasi |
| PDP (akses/penghapusan, retensi) | 🟡 Endpoint + cron siap | DPIA resmi, penunjukan DPO klien |
| Database produksi | 🔴 SQLite | Postgres + migrasi (config sudah disiapkan) |
| Penyimpanan foto | 🔴 Disk lokal | S3/MinIO (adapter sudah ada, stub) |
| Observability | 🔴 Log dasar | OpenTelemetry, alerting, backup/DR |
| Distribusi aplikasi | 🔴 Expo Go | EAS Build, OTA, wajib-update |

## Fase

### Fase 0 — Pilot satu site (6–10 minggu)
1. Aktifkan SSO: isi `AUTH_JWKS_URL`/`AUTH_ISSUER`/`AUTH_AUDIENCE`, set `AUTH_ENABLED=true`, petakan grup IdP → `Peran`.
2. Migrasi ke Postgres (`DB_TYPE=postgres`, `synchronize=false`, jalankan migrasi) + S3/MinIO (`STORAGE_DRIVER=s3`).
3. Ganti tanda tangan demo dengan PSrE tersertifikasi untuk keputusan pengawas.
4. DPIA + kebijakan privasi karyawan + prosedur insiden 3×24 jam (lihat `KEPATUHAN-PDP.md`).
5. EAS Build + OTA, hentikan pemakaian Expo Go; SQLCipher untuk DB di perangkat.
6. Backup harian + uji restore; monitoring uptime.

### Fase 1 — Skala banyak site (2–3 bulan)
- Master data (unit, checklist, lokasi, shift) dikelola dari server, bukan hardcode.
- Versi template checklist per record supaya P2H lama tetap terbaca setelah form direvisi.
- Sync latar belakang (WorkManager), retry + backoff, resume upload foto, kompresi.
- Laporan SMKP siap audit (rekap kepatuhan P2H, daftar hadir P5M, ekspor PDF/Excel).
- Notifikasi (push/WhatsApp) untuk STOP OPERASI dan tindak lanjut yang lewat SLA.

### Fase 2 — Pembeda komersial
- Integrasi SAP PM / Maximo: STOP OPERASI otomatis jadi notification/work order (webhook keluar sudah disiapkan di modul `integrations`).
- Telematik unit (KOMTRAX/VIMS/FMS) untuk mengisi HM/KM otomatis.
- Input suara untuk operator bersarung tangan; deteksi kebocoran/retak dari foto.
- Analitik leading indicator: temuan berulang, MTTR perbaikan, unit rawan STOP berulang.

## Dasar regulasi yang dipakai
- **Kepmen ESDM 1827.K/30/MEM/2018** — kaidah teknik pertambangan yang baik (struktur P2H/P5M, SMKP).
- **Kepdirjen Minerba 185.K/37.04/DJB/2019** — juknis keselamatan pertambangan & SMKP (dokumentasi, tindak lanjut temuan, audit internal).
- **UU 27/2022 (PDP)** + **PP 33/2026** (berlaku 16 Januari 2027) — dasar pemrosesan, DPIA, DPO, lapor kebocoran 3×24 jam, retensi.
- **UU ITE Pasal 11, PP 71/2019, Permenkomdigi 11/2022** — keabsahan tanda tangan elektronik tersertifikasi.
