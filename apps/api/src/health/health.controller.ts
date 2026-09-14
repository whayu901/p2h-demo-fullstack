import { Controller, Get } from '@nestjs/common';
import { API_ROUTES, type HealthResponse } from '@p2h/shared';

@Controller(API_ROUTES.health)
export class HealthController {
  @Get()
  check(): HealthResponse {
    return { status: 'ok', time: new Date().toISOString() };
  }
}
