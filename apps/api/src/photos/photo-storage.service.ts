import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { UPLOADS_ROOT } from '../common/paths.util';

/** Matches an optional `data:image/...;base64,` prefix on an incoming photo string. */
const DATA_URL_PREFIX = /^data:image\/\w+;base64,/;

/** A folder under uploads/, one per record kind. */
export type PhotoFolder = 'inspections' | 'safety-talks';

/**
 * Writes base64-encoded JPEG photos to disk and returns the public,
 * web-servable path (relative to the /uploads static prefix).
 */
@Injectable()
export class PhotoStorageService {
  save(folder: PhotoFolder, id: string, base64: string): string {
    const dir = join(UPLOADS_ROOT, folder);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const raw = base64.replace(DATA_URL_PREFIX, '');
    const filePath = join(dir, `${id}.jpg`);
    writeFileSync(filePath, Buffer.from(raw, 'base64'));
    return `/uploads/${folder}/${id}.jpg`;
  }
}
