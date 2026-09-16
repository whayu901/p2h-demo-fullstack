import { Injectable } from '@nestjs/common';
import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { UPLOADS_ROOT } from '../common/paths.util';
import type { PenyimpananFoto, PhotoFolder } from './penyimpanan-foto.interface';

/** Matches an optional `data:image/...;base64,` prefix on an incoming photo string. */
const DATA_URL_PREFIX = /^data:image\/\w+;base64,/;

/** Current (demo) behaviour: writes photos to the local uploads/ directory, served statically. */
@Injectable()
export class LocalDiskStorage implements PenyimpananFoto {
  simpan(folder: PhotoFolder, id: string, base64: string): string {
    const dir = join(UPLOADS_ROOT, folder);
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
    const raw = base64.replace(DATA_URL_PREFIX, '');
    const filePath = join(dir, `${id}.jpg`);
    writeFileSync(filePath, Buffer.from(raw, 'base64'));
    return `/uploads/${folder}/${id}.jpg`;
  }

  hapus(publicPath: string): void {
    const relative = publicPath.replace(/^\/uploads\//, '');
    rmSync(join(UPLOADS_ROOT, relative), { force: true });
  }
}
