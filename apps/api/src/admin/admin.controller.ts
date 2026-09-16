import { Controller, Post } from '@nestjs/common';
import { API_ROUTES, type AdminResetResponse, type PenggunaProfil } from '@p2h/shared';
import { Butuh } from '../auth/butuh.decorator';
import { PenggunaSaatIni } from '../auth/pengguna-saat-ini.decorator';
import { AdminService } from './admin.service';

@Controller(API_ROUTES.adminReset)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // DEMO ONLY. Guarded by admin:reset when AUTH_ENABLED=true; unauthenticated demo mode allows it by default.
  @Butuh('admin:reset')
  @Post()
  async reset(@PenggunaSaatIni() pengguna: PenggunaProfil): Promise<AdminResetResponse> {
    return this.adminService.reset(pengguna);
  }
}
