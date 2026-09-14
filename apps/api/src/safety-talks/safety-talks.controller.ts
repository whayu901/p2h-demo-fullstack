import { Controller, Get, Param, Query } from '@nestjs/common';
import { API_ROUTES, type SafetyTalkView } from '@p2h/shared';
import { SafetyTalksService } from './safety-talks.service';

@Controller(API_ROUTES.safetyTalks)
export class SafetyTalksController {
  constructor(private readonly safetyTalksService: SafetyTalksService) {}

  @Get()
  async findAll(@Query('tanggal') tanggal?: string): Promise<SafetyTalkView[]> {
    return this.safetyTalksService.findAll(tanggal);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<SafetyTalkView> {
    return this.safetyTalksService.findByIdOrThrow(id);
  }
}
