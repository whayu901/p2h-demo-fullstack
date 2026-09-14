/** Formats a Date as a local (server timezone) YYYY-MM-DD string. */
function localDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Returns "today" on this server's local clock, formatted YYYY-MM-DD. */
export function todayLocalDate(): string {
  return localDateString(new Date());
}

/** Formats an arbitrary Date as a local YYYY-MM-DD string, used by the seed to build realistic dates. */
export function toLocalDateString(date: Date): string {
  return localDateString(date);
}
