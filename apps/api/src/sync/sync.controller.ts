import { Body, Controller, Post } from '@nestjs/common';
import { API_ROUTES, type PenggunaProfil, type SyncBatchRequest, type SyncBatchResponse } from '@p2h/shared';
import { PenggunaSaatIni } from '../auth/pengguna-saat-ini.decorator';
import { SyncService } from './sync.service';

@Controller()
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post(API_ROUTES.syncBatch)
  async batch(
    @Body() body: SyncBatchRequest,
    @PenggunaSaatIni() pengguna: PenggunaProfil,
  ): Promise<SyncBatchResponse> {
    return this.syncService.processBatch(body, pengguna);
  }
}
