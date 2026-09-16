# apps/api — production-readiness notes

Everything in this section is **off/permissive by default** — the Friday
demo flow (`POST /sync/batch`, `GET /inspections`, etc. with no headers)
keeps working exactly as before. See `.env.example` for every env var.

## Auth (`src/auth`)

`AUTH_ENABLED=false` (default): every request is allowed and a demo user is
injected (`GET /health`, `POST /sync/batch`, ... all work unauthenticated).
The demo user's roles come from `X-Demo-Peran` (comma-separated, e.g.
`X-Demo-Peran: OPERATOR`), defaulting to **all** roles. `GET /auth/sesi`
always reports the current user and `authAktif`.

`AUTH_ENABLED=true`: a bearer token is required, verified via `jose` — JWKS
remote set (`AUTH_JWKS_URL`, for an OIDC IdP such as Entra ID) or HS256 with
`AUTH_DEV_SECRET`. RBAC on top of that is `@Butuh(aksi)` + `PeranGuard`,
which only ever calls `bolehMelakukan` from `@p2h/shared` — the permission
table itself lives in one place (`packages/shared/src/peran.ts`).

## Audit trail (`src/audit`)

`audit_log` is **append-only**: `AuditService.catat()` is the only way rows
are written, and rows are never updated or deleted by application code. Each
row hashes in the previous row's hash, so `GET /audit/verifikasi` can detect
tampering anywhere in the chain.

**`POST /admin/reset` does NOT wipe `audit_log`.** An audit trail that the
same button it's supposed to be auditing could erase would defeat its
purpose — the reset itself is recorded as a new `ADMIN_RESET` entry instead.

## Follow-up workflow, e-signature, integrity, PDP

See `src/inspections` (`tindakLanjut`), `src/tanda-tangan` (demo hash
"signature", `PenyediaTandaTangan` interface for a real PSrE later),
`src/sync` + `packages/shared/src/integritas.ts` (GPS-mock / clock-skew /
payload-hash flags — never blocking, only flagging), and `src/pdp` (access /
erasure requests, retention policy, `RetentionService`).

## Database (`src/database`)

`synchronize: true` is only ever used for the sqlite demo path. Postgres
always uses migrations (`npm run migration:generate` / `migration:run`
against `src/database/data-source.ts`); `src/database/migrations/` has a
hand-written baseline matching the current schema.

## Tests

`npm test -w api` (Jest + ts-jest + supertest): unit tests for `SyncService`
idempotency/server-side verdict recomputation and `AuditService` chain
tampering detection, plus an e2e suite covering the sync → keputusan → audit
flow and the `AUTH_ENABLED=true` 401 case.

## Stubs / TODOs

- `src/photos/s3-storage.ts` — throws `Not implemented`; swap in
  `@aws-sdk/client-s3` when `STORAGE_DRIVER=s3` is actually needed.
- `src/tanda-tangan/penyedia-tanda-tangan.interface.ts` — demo hash today;
  TODO comment points at a certified PSrE integration (UU ITE Pasal 11, PP
  71/2019, Permenkomdigi 11/2022).
- `src/integrations/integrations.service.ts` — generic webhook today; TODO
  comment points at a SAP PM / Maximo work-order adaptor.
- `src/auth/auth.service.ts` — claim → role mapping assumes a `peran`/`roles`/
  `groups` claim; TODO comment flags that the client's real IdP (Entra ID)
  will likely need a group-id → `Peran` lookup table instead.
