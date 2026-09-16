import { Controller, Get, Query } from '@nestjs/common';
import { API_ROUTES, type AuditFilters, type CatatanAudit, type VerifikasiRantaiAudit } from '@p2h/shared';
import { Butuh } from '../auth/butuh.decorator';
import { AuditService } from './audit.service';

@Controller()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Butuh('audit:baca')
  @Get(API_ROUTES.audit)
  async cari(@Query() query: AuditFilters): Promise<CatatanAudit[]> {
    // Query params arrive as strings; `batas` needs coercing back to a number.
    const batas = query.batas ? Number(query.batas) : undefined;
    return this.auditService.cari({ ...query, batas });
  }

  @Butuh('audit:baca')
  @Get(API_ROUTES.auditVerifikasi)
  async verifikasi(): Promise<VerifikasiRantaiAudit> {
    return this.auditService.verifikasiRantai();
  }
}
