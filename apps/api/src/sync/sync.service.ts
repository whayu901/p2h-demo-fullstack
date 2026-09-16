import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';
import {
  evaluasiIntegritasWaktu,
  type InspectionDto,
  type IntegritasRecord,
  type PenggunaProfil,
  type SafetyTalkDto,
  type SyncBatchOutcome,
  type SyncBatchRequest,
  type SyncBatchResponse,
} from '@p2h/shared';
import { UnitsService } from '../units/units.service';
import { InspectionsService } from '../inspections/inspections.service';
import { SafetyTalksService } from '../safety-talks/safety-talks.service';
import { PhotoStorageService } from '../photos/photo-storage.service';
import { AuditService } from '../audit/audit.service';
import { IntegrationsService } from '../integrations/integrations.service';
import { hashCanonicalPayload } from '../common/canonical-json.util';

/** The subset of InspectionDto/SafetyTalkDto used to build the integrity record. */
interface IntegritasInput {
  waktuPerangkat?: string;
  lokasiMock?: boolean;
  akurasiLokasiMeter?: number | null;
}

@Injectable()
export class SyncService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly unitsService: UnitsService,
    private readonly inspectionsService: InspectionsService,
    private readonly safetyTalksService: SafetyTalksService,
    private readonly photoStorageService: PhotoStorageService,
    private readonly auditService: AuditService,
    private readonly integrationsService: IntegrationsService,
  ) {}

  async processBatch(batch: SyncBatchRequest, pengguna: PenggunaProfil): Promise<SyncBatchResponse> {
    // A single transaction so a bad record (e.g. unknown unit) never leaves a half-synced batch.
    const [inspections, safetyTalks] = await this.dataSource.transaction(async (manager) => [
      await this.processInspections(batch.inspections, manager, pengguna),
      await this.processSafetyTalks(batch.safetyTalks, manager, pengguna),
    ]);

    await this.auditService.catat({
      aksi: 'SYNC_TERIMA',
      entitas: 'SISTEM',
      entitasId: null,
      aktorId: pengguna.id,
      aktorNama: pengguna.nama,
      ringkasan: `Sinkronisasi diterima: ${inspections.received} inspeksi (${inspections.created} baru/${inspections.updated} diperbarui), ${safetyTalks.received} P5M (${safetyTalks.created} baru/${safetyTalks.updated} diperbarui)`,
    });

    return { inspections, safetyTalks, syncedAt: new Date().toISOString() };
  }

  private async processInspections(
    dtos: InspectionDto[],
    manager: EntityManager,
    pengguna: PenggunaProfil,
  ): Promise<SyncBatchOutcome> {
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
      const integritas = this.buildIntegritas(dto);
      const { outcome, statusKelayakan } = await this.inspectionsService.upsert(dto, photoPath, integritas, manager);
      if (outcome === 'created') {
        created += 1;
      } else {
        updated += 1;
      }

      await this.auditService.catat({
        aksi: outcome === 'created' ? 'INSPEKSI_DIBUAT' : 'INSPEKSI_DIPERBARUI',
        entitas: 'INSPEKSI',
        entitasId: dto.id,
        aktorId: pengguna.id,
        aktorNama: pengguna.nama,
        ringkasan: `Inspeksi ${unit.code} oleh ${dto.namaOperator} — status ${statusKelayakan}`,
      });

      if (statusKelayakan === 'STOP_OPERASI') {
        await this.integrationsService.kirimPeristiwa('INSPEKSI_STOP_OPERASI', {
          inspeksiId: dto.id,
          unit: unit.code,
          namaOperator: dto.namaOperator,
          tanggal: dto.tanggal,
        });
      }
    }

    return { received: dtos.length, created, updated };
  }

  private async processSafetyTalks(
    dtos: SafetyTalkDto[],
    manager: EntityManager,
    pengguna: PenggunaProfil,
  ): Promise<SyncBatchOutcome> {
    let created = 0;
    let updated = 0;

    for (const dto of dtos) {
      const photoPath = dto.fotoBase64
        ? this.photoStorageService.save('safety-talks', dto.id, dto.fotoBase64)
        : null;
      const integritas = this.buildIntegritas(dto);
      const outcome = await this.safetyTalksService.upsert(dto, photoPath, integritas, manager);
      if (outcome === 'created') {
        created += 1;
      } else {
        updated += 1;
      }

      await this.auditService.catat({
        aksi: 'P5M_DITERIMA',
        entitas: 'P5M',
        entitasId: dto.id,
        aktorId: pengguna.id,
        aktorNama: pengguna.nama,
        ringkasan: `P5M "${dto.topik}" oleh ${dto.namaPemimpin}`,
      });
    }

    return { received: dtos.length, created, updated };
  }

  /**
   * Builds the integrity record for a submitted record. Nothing here rejects
   * the submission — the demo mobile app may not send waktuPerangkat/lokasiMock
   * yet, and flagging suspicious values (not blocking them) is the feature.
   */
  private buildIntegritas(dto: IntegritasInput): IntegritasRecord {
    const lokasi =
      dto.lokasiMock !== undefined || dto.akurasiLokasiMeter !== undefined
        ? { mock: Boolean(dto.lokasiMock), akurasiMeter: dto.akurasiLokasiMeter ?? null }
        : null;
    const waktu = dto.waktuPerangkat ? evaluasiIntegritasWaktu(dto.waktuPerangkat, new Date().toISOString()) : null;
    return { lokasi, waktu, hashRecord: hashCanonicalPayload(dto) };
  }
}
