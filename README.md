# Demo Digitalisasi P2H & P5M

Throwaway demo for the client meeting. Three apps in one npm-workspaces monorepo:

| Part | Path | Tech | Port |
|---|---|---|---|
| Shared types + checklists | `packages/shared` | TypeScript | – |
| API | `apps/api` | NestJS 11, TypeORM, SQLite file | 3000 (bound to `0.0.0.0`) |
| Dashboard | `apps/dashboard` | React 19, Vite 8, TanStack Query, MUI 9 (SAP Fiori theme) | 5173 |
| Mobile | `apps/mobile-app` | Expo SDK 57, expo-router, expo-sqlite | Expo Go |

The point of the demo: **the mobile app works with zero internet, and data appears on the dashboard once the phone can reach the laptop again.**

```
   [ Android phone ]                  [ MacBook ]
   Expo app                           NestJS API   :3000  (bind 0.0.0.0)
   SQLite lokal                       SQLite file
        |                             React dashboard :5173
        |  Wi-Fi LAN (no internet needed)   |
        +-----------------------------------+
                    both on the same Wi-Fi
```

## Prerequisites

- **Node 20.19+** (pinned in `.nvmrc`). Node 14 / npm 6 will NOT work (no workspaces support).
- **Android** phone with **Expo Go** installed and updated (must support SDK 57). The demo targets Android only.
- Laptop and phone on the **same Wi-Fi** (a phone hotspot works too — no internet required).

## Run it — in this order

```bash
nvm use                 # uses Node 20.20.2 from .nvmrc
npm install             # installs everything and builds packages/shared
```

**1. API** (terminal 1)

```bash
npm run api
```

On start it prints the URLs, e.g. `Untuk HP (EXPO_PUBLIC_API_URL): http://192.168.18.231:3000`.
First boot seeds 8 units, 6 P2H (incl. one `STOP OPERASI` today) and 3 P5M records, some dated "today".

**2. Dashboard** (terminal 2) → open http://localhost:5173

```bash
npm run dashboard
```

**3. Mobile** (terminal 3)

Find the laptop's LAN IP:

```bash
ipconfig getifaddr en0
```

Put it in `apps/mobile-app/.env` (copy from `.env.example`):

```
EXPO_PUBLIC_API_URL=http://<LAN-IP>:3000
```

Then start Expo and scan the QR code with Expo Go (Android):

```bash
npm run mobile
```

If you change `.env`, restart Expo with a clean cache: `npm run start -w mobile -- --clear`.

The Home screen shows the API URL in use and a green/red dot. **Red dot = networking problem** (wrong IP, different Wi-Fi, API not running, or macOS firewall blocking Node).

The URL can also be changed on the phone in **Pengaturan** without restarting Expo — the override is stored on the device; "Pakai default (.env)" goes back to `EXPO_PUBLIC_API_URL`.

## Resetting between demo runs

Nothing needs reinstalling.

| Where | How | Effect |
|---|---|---|
| Dashboard | Shell bar **⋮ → Reset demo data** (calls `POST /admin/reset`) | Wipes the server DB + uploaded photos and re-seeds 8 units, P2H (incl. one `STOP OPERASI` today) and P5M records dated relative to *now* |
| Phone | **Pengaturan → Reset semua data lokal** | Drops and recreates the SQLite tables, deletes local photos, re-seeds the 8 units, zero submissions. Keeps the API URL override. |
| Terminal (fallback) | `npm run db:reset -w api`, then restart the API | Same as the dashboard reset |

> ⚠️ `POST /admin/reset` has **no authentication**. It exists for this demo only and must never ship.

Run the dashboard reset on the morning of the meeting so the "hari ini" tiles are not zero.

## Data lifecycle on the phone

- **Create / edit / delete** are allowed only while a record is `PENDING`. Updates are a real `UPDATE … WHERE id = ? AND sync_status = 'PENDING'`, so the UUID survives and re-sync stays idempotent. Once `SYNCED`, a record is read-only on the device (audit trail).
- **Retention:** on app start, `SYNCED` records older than the retention window (7 days default; 14 / 30 in Pengaturan) are deleted together with their photo files. `PENDING` records are never auto-deleted. "Bersihkan data lama" runs the same routine on demand.
- To test retention by hand: Pengaturan → **Buat contoh data lama (10 hari)** creates one old `SYNCED` record (with a photo file) and one old `PENDING` record; restart the app — the synced one and its photo are gone, the pending one survives.

## Useful commands

```bash
npm run typecheck        # tsc --noEmit in all workspaces
npm run build:shared     # rebuild packages/shared after changing it
```

## Architecture

Same MVC shape in mobile and dashboard:

```
models/        types, SQLite/repositories (mobile), API client — the only place SQL or fetch lives
controllers/   hooks + services: business logic, validation, sync orchestration
views/         screens and presentational components
app/           (mobile) thin expo-router route files
```

API: one Nest module per domain (`units`, `inspections`, `safety-talks`, `sync`, `overview`, `health`, `photos`, `seed`, `admin`). Controllers only call services.

### Status kelayakan (verdict)

`hitungStatusKelayakan()` in `packages/shared/src/kelayakan.ts` is the single implementation: any `TIDAK_NORMAL` on an AA/A item → `STOP OPERASI`; only B/C findings → `OPERASI DENGAN PERHATIAN`; none → `LAYAK OPERASI`. The mobile form shows it live, the API recomputes and stores it on sync (it never trusts the client's value), and the dashboard uses it for the detail page.

### Sync design

1. Every record is saved to local SQLite immediately with `syncStatus: 'PENDING'`; the ID is a UUID generated on the device.
2. **Sinkronisasi** sends all pending records in one `POST /sync/batch` with photos as base64.
3. The API upserts by ID inside one transaction — sending the same record twice updates, never duplicates.
4. On success the phone marks records `SYNCED`; on failure they stay `PENDING` and a plain error is shown.

## Decisions & deviations (noted as the spec asked)

- **Subagents:** `typescript-specialist` and `nodejs-developer` did not exist in the build environment; `typescript-pro` and `node-specialist` were used instead. Mobile was built by `expo-react-native-expert`. The separate `frontend-developer` design pass was dropped: the dashboard's look is now defined by the SAP Fiori MUI theme (change request #2).
- **NestJS 11 / TypeORM 0.3**, not the newest majors: NestJS 12 tooling requires Node 22, and TypeORM 1.x is too new to trust for a live demo.
- **`@p2h/shared`** compiles to CommonJS for Nest and Metro; the dashboard's Vite config aliases it to the TypeScript source to avoid CJS interop issues in dev.
- **Photos** are written to `apps/api/uploads/` and served statically at `/uploads`; the JSON body limit is raised to 25 MB for base64 payloads.
- **"Today"** on the dashboard means the laptop's local calendar day.
- **P2H/P5M forms** follow the structure of real site forms (Kepmen ESDM 1827.K/30/MEM/2018, Kepdirjen Minerba 185.K/37.04/DJB/2019): header with NRP and HM/KM, three-section checklist with hazard codes, operator statement. `rekomendasiMekanik` / `keputusanPengawas` exist in the model but are intentionally empty — approval is out of scope.
- **Type names stay English** (`InspectionDto`, `/sync/batch`); form field names are Indonesian as on paper.
- **Dashboard "Diterima" column** replaces a "Sinkron" column: every record on the server is synced by definition, so it shows when the server received it.
- **"Temuan terbuka"** = `TIDAK_NORMAL` items on today's inspections (there is no closing workflow in the demo).
- **Edit / Hapus** in History via long-press (not swipe), to avoid adding gesture wiring.
- **Local schema** is versioned with `PRAGMA user_version`; upgrading from the first demo build drops and recreates the phone's tables.
- **SAP "72" font** is bundled from `@sap-theming/theming-base-content` (Apache-2.0).
- **Peta (map)**: Leaflet with Esri satellite / OpenStreetMap tiles — the *laptop* needs internet for map imagery (markers and routes still draw without it). Each unit's P2H points are joined in time order as its route. Seed data includes earlier inspections per unit so routes are visible on first open.
- **Dashboard auto-refreshes** every 10 s (plus a "Muat ulang" button), so synced records appear without touching the laptop.

## Out of scope

Auth, roles, approvals, user management, push notifications, background sync, offline maps, image storage service, tests, CI, Docker, dark mode, i18n, form builder.

## Boilerplate produksi (aktif tapi default mati)

Lihat `docs/ROADMAP-PRODUKSI.md` dan `docs/KEPATUHAN-PDP.md`. Ringkasnya:

| Kapabilitas | Cara mengaktifkan | Catatan |
|---|---|---|
| Autentikasi + RBAC | `AUTH_ENABLED=true` + `AUTH_JWKS_URL`/`AUTH_ISSUER`/`AUTH_AUDIENCE` | Default mati → demo jalan tanpa login. Tabel izin ada di `packages/shared/src/peran.ts` (satu sumber, dipakai API + dashboard) |
| Simulasi peran (demo) | Chip **Mode demo** di dashboard | Mengirim header `X-Demo-Peran`; hanya dihormati saat `AUTH_ENABLED=false` |
| Alur tindak lanjut | Aktif | `POST /inspections/:id/rekomendasi` (Mekanik) → `/keputusan` (Pengawas) |
| Audit trail hash-chain | Aktif | `GET /audit`, `GET /audit/verifikasi`. Append-only; **tidak ikut terhapus** saat reset demo |
| Tanda tangan elektronik | Aktif sebagai `DEMO_HASH` | Ganti dengan PSrE tersertifikasi lewat `PenyediaTandaTangan` |
| Integritas bukti | Aktif | HP mengirim `lokasiMock`, akurasi, dan `waktuPerangkat`; server menandai GPS palsu / jam menyimpang |
| Retensi server + hak subjek data | `RETENTION_CRON_ENABLED=true` | `GET /pdp/retensi`, `POST /pdp` (akses / penghapusan → anonimisasi) |
| Postgres | `DB_TYPE=postgres` + migrasi | `synchronize` dipaksa mati di luar SQLite |
| Penyimpanan S3 | `STORAGE_DRIVER=s3` | Adapter masih stub |
| Webhook ERP/CMMS | `INTEGRATION_WEBHOOK_URL=...` | Dipicu saat inspeksi `STOP_OPERASI` masuk |

Semua env var didokumentasikan di `apps/api/.env.example`. Test: `npm test -w api`. CI: `.github/workflows/ci.yml`.
