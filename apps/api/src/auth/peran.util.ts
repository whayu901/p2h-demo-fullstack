import { PERAN, type Peran } from '@p2h/shared';

/** Keeps only the values that are valid `Peran` members, in the order given. */
export function normalizePeranList(raw: unknown): Peran[] {
  if (!Array.isArray(raw)) return [];
  return raw.filter((value): value is Peran => typeof value === 'string' && isPeran(value));
}

/** Parses a comma-separated header value (e.g. "OPERATOR, PENGAWAS") into valid roles. */
export function parsePeranHeader(header: string | undefined): Peran[] {
  if (!header) return [];
  return normalizePeranList(
    header
      .split(',')
      .map((value) => value.trim())
      .filter(Boolean),
  );
}

function isPeran(value: string): value is Peran {
  return (PERAN as readonly string[]).includes(value);
}
