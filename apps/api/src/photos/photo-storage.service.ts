import { Injectable } from '@nestjs/common';
import { getAppConfig } from '../config/app-config';
import { LocalDiskStorage } from './local-disk-storage';
import { S3Storage } from './s3-storage';
import type { PenyimpananFoto, PhotoFolder } from './penyimpanan-foto.interface';

/** Thin facade picking the configured PenyimpananFoto driver (STORAGE_DRIVER, default 'local'). */
@Injectable()
export class PhotoStorageService {
  private readonly driver: PenyimpananFoto;

  constructor(localDiskStorage: LocalDiskStorage, s3Storage: S3Storage) {
    this.driver = getAppConfig().storage.driver === 's3' ? s3Storage : localDiskStorage;
  }

  save(folder: PhotoFolder, id: string, base64: string): string {
    return this.driver.simpan(folder, id, base64);
  }

  remove(publicPath: string): void {
    this.driver.hapus(publicPath);
  }
}
