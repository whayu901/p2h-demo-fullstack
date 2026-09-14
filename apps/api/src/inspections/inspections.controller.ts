import { Controller, Get, Param, Query } from '@nestjs/common';
import { API_ROUTES, type InspectionFilters, type InspectionView } from '@p2h/shared';
import { InspectionsService } from './inspections.service';

@Controller(API_ROUTES.inspections)
export class InspectionsController {
  constructor(private readonly inspectionsService: InspectionsService) {}

  @Get()
  async findAll(@Query() filters: InspectionFilters): Promise<InspectionView[]> {
    return this.inspectionsService.findAll(filters);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<InspectionView> {
    return this.inspectionsService.findByIdOrThrow(id);
  }
}
