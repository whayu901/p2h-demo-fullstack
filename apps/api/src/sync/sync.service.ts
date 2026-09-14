import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import type {
  InspectionDto,
  SafetyTalkDto,
  SyncBatchOutcome,
  SyncBatchRequest,
  SyncBatchResponse,
} from '@p2h/shared';
import { UnitsService } from '../units/units.service';
import { InspectionsService } from '../inspections/inspections.service';
import { SafetyTalksService } from '../safety-talks/safety-talks.service';
import { PhotoStorageService } from '../photos/photo-storage.service';

@Injectable()
export class SyncService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly unitsService: UnitsService,
    private readonly inspectionsService: InspectionsService,
    private readonly safetyTalksService: SafetyTalksService,
    private readonly photoStorageService: PhotoStorageService,
  ) {}

  async processBatch(batch: SyncBatchRequest): Promise<SyncBatchResponse> {
    // A single transaction so a bad record (e.g. unknown unit) never leaves a half-synced batch.
    const [inspections, safetyTalks] = await this.dataSource.transaction(async (manager) => [
      await this.processInspections(batch.inspections, manager),
      await this.processSafetyTalks(batch.safetyTalks, manager),
    ]);

    return { inspections, safetyTalks, syncedAt: new Date().toISOString() };
  }

  private async processInspections(dtos: InspectionDto[], manager: EntityManager): Promise<SyncBatchOutcome> {
    let created = 0;
    let updated = 0;

    for (const dto of dtos) {
      const unit = await this.unitsService.findById(dto.unitId);
      if (!unit) {
        throw new BadRequestException(
          `Unit dengan id ${dto.unitId} tidak ditemukan, inspeksi ${dto.id} tidak bisa disimpan`,
        );
      }
      const photoPath = dto.fotoBase64 ? this.photoStorageService.save('inspections', dto.id, dto.fotoBase64) : null;
      const outcome = await this.inspectionsService.upsert(dto, photoPath, manager);
      if (outcome === 'created') {
        created += 1;
      } else {
        updated += 1;
      }
    }

    return { received: dtos.length, created, updated };
  }

  private async processSafetyTalks(dtos: SafetyTalkDto[], manager: EntityManager): Promise<SyncBatchOutcome> {
    let created = 0;
    let updated = 0;

    for (const dto of dtos) {
      const photoPath = dto.fotoBase64
        ? this.photoStorageService.save('safety-talks', dto.id, dto.fotoBase64)
        : null;
      const outcome = await this.safetyTalksService.upsert(dto, photoPath, manager);
      if (outcome === 'created') {
        created += 1;
      } else {
        updated += 1;
      }
    }

    return { received: dtos.length, created, updated };
  }
}
