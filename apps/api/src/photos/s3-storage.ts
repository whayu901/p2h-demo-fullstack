import { Injectable } from '@nestjs/common';
import type { PenyimpananFoto, PhotoFolder } from './penyimpanan-foto.interface';

/**
 * TODO: implement with @aws-sdk/client-s3 (PutObjectCommand/DeleteObjectCommand),
 * credentials/bucket from the S3_* env vars (see src/config/app-config.ts).
 * Not wired up in this demo — selecting STORAGE_DRIVER=s3 without finishing
 * this class will fail loudly instead of silently doing nothing.
 */
@Injectable()
export class S3Storage implements PenyimpananFoto {
  simpan(_folder: PhotoFolder, _id: string, _base64: string): string {
    throw new Error('S3Storage belum diimplementasikan (STORAGE_DRIVER=s3). Lihat TODO di s3-storage.ts.');
  }

  hapus(_publicPath: string): void {
    throw new Error('S3Storage belum diimplementasikan (STORAGE_DRIVER=s3). Lihat TODO di s3-storage.ts.');
  }
}
