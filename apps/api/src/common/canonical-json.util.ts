import { createHash } from 'node:crypto';

/** Recursively sorts object keys so the same logical payload always serialises identically. */
function sortKeysDeep(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sortKeysDeep);
  }
  if (value !== null && typeof value === 'object') {
    const source = value as Record<string, unknown>;
    return Object.keys(source)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = sortKeysDeep(source[key]);
        return acc;
      }, {});
  }
  return value;
}

/** JSON.stringify with recursively sorted keys, so hashing the result is stable regardless of key order. */
export function canonicalJson(value: unknown): string {
  return JSON.stringify(sortKeysDeep(value));
}

export function sha256Hex(value: string): string {
  return createHash('sha256').update(value).digest('hex');
}

/** SHA-256 of the canonical JSON form of `payload`. Used for record integrity hashes and e-signatures. */
export function hashCanonicalPayload(payload: unknown): string {
  return sha256Hex(canonicalJson(payload));
}
