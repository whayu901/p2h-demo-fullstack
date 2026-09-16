/** Pure, presentation-only date/time/number formatting helpers (Indonesian locale). */

// `tanggal` fields are plain YYYY-MM-DD strings (no time, no timezone), so
// they're parsed and formatted in UTC to avoid an off-by-one day shift.
const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
});

const longDateFormatter = new Intl.DateTimeFormat('id-ID', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

const dateTimeFormatter = new Intl.DateTimeFormat('id-ID', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const timeFormatter = new Intl.DateTimeFormat('id-ID', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
  hour12: false,
});

const numberFormatter = new Intl.NumberFormat('id-ID');

/** Formats a YYYY-MM-DD date string as "14 Sep 2026". */
export function formatDate(tanggal: string): string {
  return dateFormatter.format(new Date(`${tanggal}T00:00:00Z`));
}

/** Formats a YYYY-MM-DD date string as "Senin, 14 September 2026". */
export function formatLongDate(tanggal: string): string {
  return longDateFormatter.format(new Date(`${tanggal}T00:00:00Z`));
}

/** Formats an ISO timestamp as "14 Sep 2026, 08.30". */
export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso)).replace(/(\d{2}):(\d{2})$/, '$1.$2');
}

/** Formats an ISO timestamp (or epoch millis) as "hh:mm:ss" for a "last updated" hint. */
export function formatClockTime(value: string | number): string {
  return timeFormatter.format(new Date(value));
}

/** Formats a plain number using Indonesian grouping. */
export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}

/** Formats an HM/KM range, e.g. "1.204 → 1.298" (or just "1.204 →" while in progress). */
export function formatHmKmRange(awal: number, akhir: number | null): string {
  return akhir === null ? `${formatNumber(awal)} →` : `${formatNumber(awal)} → ${formatNumber(akhir)}`;
}

/** Formats a coordinate pair as "-0.62310, 117.11230", or null when unavailable. */
export function formatCoordinates(latitude: number | null, longitude: number | null): string | null {
  if (latitude === null || longitude === null) {
    return null;
  }
  return `${latitude.toFixed(5)}, ${longitude.toFixed(5)}`;
}

/** Formats a person's name as up to two uppercase initials, e.g. "Budi Santoso" → "BS", for an avatar. */
export function formatInitials(nama: string): string {
  const parts = nama.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) {
    return '?';
  }
  const first = parts[0][0] ?? '';
  const last = parts.length > 1 ? (parts[parts.length - 1][0] ?? '') : '';
  return `${first}${last}`.toUpperCase();
}

/** Shortens a hash/hex string to its first N characters followed by an ellipsis, e.g. "a1b2c3d4e5f6…". */
export function formatHashShort(hash: string, length = 12): string {
  return `${hash.slice(0, length)}…`;
}
