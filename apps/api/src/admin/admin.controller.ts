import { Controller, Post } from '@nestjs/common';
import { API_ROUTES, type AdminResetResponse } from '@p2h/shared';
import { AdminService } from './admin.service';

@Controller(API_ROUTES.adminReset)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // DEMO ONLY — no auth. Must never ship.
  @Post()
  async reset(): Promise<AdminResetResponse> {
    return this.adminService.reset();
  }
}
