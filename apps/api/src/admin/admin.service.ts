import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import type { AdminResetResponse, PenggunaProfil } from '@p2h/shared';
import { UPLOADS_ROOT } from '../common/paths.util';
import { UnitEntity } from '../units/unit.entity';
import { InspectionEntity } from '../inspections/inspection.entity';
import { SafetyTalkEntity } from '../safety-talks/safety-talk.entity';
import { SeedService } from '../seed/seed.service';
import { AuditService } from '../audit/audit.service';

/** Demo-only reset: wipes every domain table and uploaded photo, then re-seeds. */
@Injectable()
export class AdminService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly seedService: SeedService,
    private readonly auditService: AuditService,
  ) {}

  async reset(pengguna: PenggunaProfil): Promise<AdminResetResponse> {
    await this.dataSource.transaction(async (manager) => {
      // Inspections reference units, so they must go first.
      await manager.createQueryBuilder().delete().from(InspectionEntity).execute();
      await manager.createQueryBuilder().delete().from(SafetyTalkEntity).execute();
      await manager.createQueryBuilder().delete().from(UnitEntity).execute();
      // audit_log is intentionally NOT touched here — an audit trail that the
      // same "reset" button could wipe would defeat its purpose. The reset
      // itself is recorded as a new ADMIN_RESET entry below instead.
    });

    this.removeUploadedPhotos();

    const seeded = await this.seedService.seed();

    await this.auditService.catat({
      aksi: 'ADMIN_RESET',
      entitas: 'SISTEM',
      entitasId: null,
      aktorId: pengguna.id,
      aktorNama: pengguna.nama,
      ringkasan: `Reset demo: ${seeded.units} unit, ${seeded.inspections} inspeksi, ${seeded.safetyTalks} P5M di-seed ulang`,
    });

    return { ok: true, resetAt: new Date().toISOString(), seeded };
  }

  private removeUploadedPhotos(): void {
    rmSync(join(UPLOADS_ROOT, 'inspections'), { recursive: true, force: true });
    rmSync(join(UPLOADS_ROOT, 'safety-talks'), { recursive: true, force: true });
  }
}
