import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InspectionEntity } from '../inspections/inspection.entity';
import { SafetyTalkEntity } from '../safety-talks/safety-talk.entity';
import { AuditService } from '../audit/audit.service';
import { PhotoStorageService } from '../photos/photo-storage.service';
import { getAppConfig } from '../config/app-config';
import { SystemMetaEntity } from './system-meta.entity';

const META_KEY_TERAKHIR_RETENSI = 'retensi.terakhirDijalankan';

export interface HasilRetensi {
  inspeksiDihapus: number;
  p5mDihapus: number;
}

/**
 * Deletes inspections/safety talks older than RETENTION_SERVER_DAYS, plus
 * their photo files, recording an audit entry. The @Cron handler below is
 * only ever actually scheduled when RETENTION_CRON_ENABLED=true — AppModule
 * only imports ScheduleModule in that case, so otherwise this decorator's
 * metadata just sits unused. `jalankan()` is also exposed directly so it can
 * be triggered on demand (e.g. from tests, or a future admin action).
 */
@Injectable()
export class RetentionService {
  private readonly logger = new Logger(RetentionService.name);

  constructor(
    @InjectRepository(InspectionEntity)
    private readonly inspectionsRepository: Repository<InspectionEntity>,
    @InjectRepository(SafetyTalkEntity)
    private readonly safetyTalksRepository: Repository<SafetyTalkEntity>,
    @InjectRepository(SystemMetaEntity)
    private readonly systemMetaRepository: Repository<SystemMetaEntity>,
    private readonly auditService: AuditService,
    private readonly photoStorageService: PhotoStorageService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async jalankanTerjadwal(): Promise<void> {
    if (!getAppConfig().retention.cronEnabled) return;
    this.logger.log('Menjalankan retensi data terjadwal...');
    await this.jalankan();
  }

  async jalankan(): Promise<HasilRetensi> {
    const batas = new Date();
    batas.setDate(batas.getDate() - getAppConfig().retention.serverDays);
    const batasIso = batas.toISOString();

    const inspeksiKedaluwarsa = await this.inspectionsRepository.find({
      where: { diterimaPada: LessThan(batasIso) },
    });
    const p5mKedaluwarsa = await this.safetyTalksRepository.find({
      where: { diterimaPada: LessThan(batasIso) },
    });

    for (const entity of [...inspeksiKedaluwarsa, ...p5mKedaluwarsa]) {
      if (entity.fotoPath) this.photoStorageService.remove(entity.fotoPath);
    }
    if (inspeksiKedaluwarsa.length > 0) await this.inspectionsRepository.remove(inspeksiKedaluwarsa);
    if (p5mKedaluwarsa.length > 0) await this.safetyTalksRepository.remove(p5mKedaluwarsa);

    await this.catatWaktuJalan();
    await this.auditService.catat({
      aksi: 'DATA_DIHAPUS',
      entitas: 'SISTEM',
      entitasId: null,
      aktorId: null,
      aktorNama: 'Sistem (retensi otomatis)',
      ringkasan: `Retensi data: ${inspeksiKedaluwarsa.length} inspeksi dan ${p5mKedaluwarsa.length} P5M lebih dari ${getAppConfig().retention.serverDays} hari dihapus`,
    });

    return { inspeksiDihapus: inspeksiKedaluwarsa.length, p5mDihapus: p5mKedaluwarsa.length };
  }

  async terakhirDijalankan(): Promise<string | null> {
    const row = await this.systemMetaRepository.findOneBy({ key: META_KEY_TERAKHIR_RETENSI });
    return row?.value ?? null;
  }

  private async catatWaktuJalan(): Promise<void> {
    await this.systemMetaRepository.save({ key: META_KEY_TERAKHIR_RETENSI, value: new Date().toISOString() });
  }
}
