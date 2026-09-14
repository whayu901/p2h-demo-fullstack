import { Controller, Get } from '@nestjs/common';
import { API_ROUTES, type OverviewResponse } from '@p2h/shared';
import { OverviewService } from './overview.service';

@Controller(API_ROUTES.overview)
export class OverviewController {
  constructor(private readonly overviewService: OverviewService) {}

  @Get()
  async getOverview(): Promise<OverviewResponse> {
    return this.overviewService.getOverview();
  }
}
