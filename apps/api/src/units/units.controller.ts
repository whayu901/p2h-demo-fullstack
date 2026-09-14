import { Controller, Get } from '@nestjs/common';
import { API_ROUTES, type UnitDenganStatus } from '@p2h/shared';
import { UnitsService } from './units.service';

@Controller(API_ROUTES.units)
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Get()
  async findAll(): Promise<UnitDenganStatus[]> {
    return this.unitsService.findAllWithStatus();
  }
}
