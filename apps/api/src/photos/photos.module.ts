import { Module } from '@nestjs/common';
import { PhotoStorageService } from './photo-storage.service';
import { LocalDiskStorage } from './local-disk-storage';
import { S3Storage } from './s3-storage';

@Module({
  providers: [LocalDiskStorage, S3Storage, PhotoStorageService],
  exports: [PhotoStorageService],
})
export class PhotosModule {}
