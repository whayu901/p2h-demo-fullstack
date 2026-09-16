import { Module } from '@nestjs/common';
import { TandaTanganService } from './tanda-tangan.service';

@Module({
  providers: [TandaTanganService],
  exports: [TandaTanganService],
})
export class TandaTanganModule {}
