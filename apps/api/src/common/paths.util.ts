import { join } from 'node:path';

/**
 * Root of the apps/api project, resolved from this file's location rather
 * than process.cwd() so paths stay correct no matter where `node` is invoked
 * from (dist/common/paths.util.js -> apps/api).
 */
export const APP_ROOT = join(__dirname, '..', '..');

export const UPLOADS_ROOT = join(APP_ROOT, 'uploads');

export const DATA_DIR = join(APP_ROOT, 'data');

export const DB_PATH = join(DATA_DIR, 'demo.sqlite');
