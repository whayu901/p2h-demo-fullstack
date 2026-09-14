import { Body, Controller, Post } from '@nestjs/common';
import { API_ROUTES, type SyncBatchRequest, type SyncBatchResponse } from '@p2h/shared';
import { SyncService } from './sync.service';

@Controller()
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  @Post(API_ROUTES.syncBatch)
  async batch(@Body() body: SyncBatchRequest): Promise<SyncBatchResponse> {
    return this.syncService.processBatch(body);
  }
}
