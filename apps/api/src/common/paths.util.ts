import { mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';

/**
 * Root of the apps/api project, resolved from this file's location rather
 * than process.cwd() so paths stay correct no matter where `node` is invoked
 * from (dist/common/paths.util.js -> apps/api).
 */
export const APP_ROOT = join(__dirname, '..', '..');

export const UPLOADS_ROOT = join(APP_ROOT, 'uploads');

export const DATA_DIR = join(APP_ROOT, 'data');

export const DB_PATH = join(DATA_DIR, 'demo.sqlite');

/**
 * Resolves the sqlite database file path. `nameOverride` (DB_NAME) lets
 * tests/tooling point at an alternate file or ':memory:'; an empty override
 * falls back to the default demo path, creating its directory as needed.
 */
export function resolveSqliteDatabasePath(nameOverride: string): string {
  if (nameOverride) {
    if (nameOverride !== ':memory:') {
      mkdirSync(dirname(nameOverride), { recursive: true });
    }
    return nameOverride;
  }
  mkdirSync(DATA_DIR, { recursive: true });
  return DB_PATH;
}
