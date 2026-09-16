import type { Database } from './database';

const LAST_SYNC_AT_KEY = 'last_sync_at';
const RETENTION_DAYS_KEY = 'retention_days';
const API_URL_OVERRIDE_KEY = 'api_url_override';
const PETUGAS_NAMA_KEY = 'petugas_nama';
const PETUGAS_NRP_KEY = 'petugas_nrp';

/** The retention window offered in Pengaturan, and used when none is stored yet. */
export const DEFAULT_RETENTION_DAYS = 7;
export const RETENTION_DAYS_OPTIONS = [7, 14, 30] as const;
export type RetentionDays = (typeof RETENTION_DAYS_OPTIONS)[number];

async function getMetaValue(db: Database, key: string): Promise<string | null> {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM meta WHERE key = ?', [
    key,
  ]);
  return row?.value ?? null;
}

async function setMetaValue(db: Database, key: string, value: string): Promise<void> {
  await db.runAsync(
    'INSERT INTO meta (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value',
    [key, value]
  );
}

async function deleteMetaValue(db: Database, key: string): Promise<void> {
  await db.runAsync('DELETE FROM meta WHERE key = ?', [key]);
}

/** Reads the ISO timestamp of the last successful sync, or `null` if never synced. */
export async function getLastSyncAt(db: Database): Promise<string | null> {
  return getMetaValue(db, LAST_SYNC_AT_KEY);
}

/** Stores the ISO timestamp of the most recent successful sync. */
export async function setLastSyncAt(db: Database, isoTimestamp: string): Promise<void> {
  await setMetaValue(db, LAST_SYNC_AT_KEY, isoTimestamp);
}

/** Reads the user-configured API URL override, or `null` if using the build-time default. */
export async function getApiUrlOverride(db: Database): Promise<string | null> {
  return getMetaValue(db, API_URL_OVERRIDE_KEY);
}

/** Stores a user-configured API URL override. */
export async function setApiUrlOverride(db: Database, url: string): Promise<void> {
  await setMetaValue(db, API_URL_OVERRIDE_KEY, url);
}

/** Clears the API URL override so the build-time default is used again. */
export async function clearApiUrlOverride(db: Database): Promise<void> {
  await deleteMetaValue(db, API_URL_OVERRIDE_KEY);
}

/** The petugas (officer) identity used to prefill P2H/P5M forms — foundation for real SSO later. */
export interface PetugasIdentitas {
  nama: string;
  nrp: string;
}

/** Reads the saved petugas identity, or blank strings if never set. */
export async function getPetugasIdentitas(db: Database): Promise<PetugasIdentitas> {
  const [nama, nrp] = await Promise.all([
    getMetaValue(db, PETUGAS_NAMA_KEY),
    getMetaValue(db, PETUGAS_NRP_KEY),
  ]);
  return { nama: nama ?? '', nrp: nrp ?? '' };
}

/** Stores the petugas identity used to prefill new P2H/P5M forms. */
export async function setPetugasIdentitas(db: Database, identitas: PetugasIdentitas): Promise<void> {
  await Promise.all([
    setMetaValue(db, PETUGAS_NAMA_KEY, identitas.nama),
    setMetaValue(db, PETUGAS_NRP_KEY, identitas.nrp),
  ]);
}

/** Reads the configured retention window in days, defaulting to `DEFAULT_RETENTION_DAYS`. */
export async function getRetentionDays(db: Database): Promise<number> {
  const stored = await getMetaValue(db, RETENTION_DAYS_KEY);
  const parsed = stored ? Number.parseInt(stored, 10) : NaN;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_RETENTION_DAYS;
}

/** Stores the retention window in days. */
export async function setRetentionDays(db: Database, days: number): Promise<void> {
  await setMetaValue(db, RETENTION_DAYS_KEY, String(days));
}

/**
 * Resets sync/retention bookkeeping for the "Reset semua data lokal" demo
 * action: clears the last-sync timestamp and restores the default retention
 * window. Deliberately leaves `api_url_override` and the petugas identity
 * (`petugas_nama` / `petugas_nrp`) untouched — a server address or officer
 * identity the user configured are device/session settings, not app data,
 * and survive a local data reset.
 */
export async function resetSyncAndRetentionMeta(db: Database): Promise<void> {
  await deleteMetaValue(db, LAST_SYNC_AT_KEY);
  await setRetentionDays(db, DEFAULT_RETENTION_DAYS);
}
