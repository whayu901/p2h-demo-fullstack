import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { rmSync } from 'node:fs';
import { join } from 'node:path';
import type { AdminResetResponse } from '@p2h/shared';
import { UPLOADS_ROOT } from '../common/paths.util';
import { UnitEntity } from '../units/unit.entity';
import { InspectionEntity } from '../inspections/inspection.entity';
import { SafetyTalkEntity } from '../safety-talks/safety-talk.entity';
import { SeedService } from '../seed/seed.service';

/** Demo-only reset: wipes every domain table and uploaded photo, then re-seeds. */
@Injectable()
export class AdminService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly seedService: SeedService,
  ) {}

  async reset(): Promise<AdminResetResponse> {
    await this.dataSource.transaction(async (manager) => {
      // Inspections reference units, so they must go first.
      await manager.createQueryBuilder().delete().from(InspectionEntity).execute();
      await manager.createQueryBuilder().delete().from(SafetyTalkEntity).execute();
      await manager.createQueryBuilder().delete().from(UnitEntity).execute();
    });

    this.removeUploadedPhotos();

    const seeded = await this.seedService.seed();

    return { ok: true, resetAt: new Date().toISOString(), seeded };
  }

  private removeUploadedPhotos(): void {
    rmSync(join(UPLOADS_ROOT, 'inspections'), { recursive: true, force: true });
    rmSync(join(UPLOADS_ROOT, 'safety-talks'), { recursive: true, force: true });
  }
}
