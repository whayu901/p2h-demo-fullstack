import { Injectable, Logger, type OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  getChecklist,
  hitungStatusKelayakan,
  statusTindakLanjutAwal,
  SEED_UNITS,
  type HasilItemP2H,
  type UnitType,
} from '@p2h/shared';
import { toLocalDateString } from '../common/date.util';
import { UnitEntity } from '../units/unit.entity';
import { InspectionEntity } from '../inspections/inspection.entity';
import { SafetyTalkEntity } from '../safety-talks/safety-talk.entity';
import { SEED_INSPECTIONS, SEED_SAFETY_TALKS, type SeedItemOverride } from './seed-data';

/** Counts of records created by a seed run. */
export interface SeedCounts {
  units: number;
  inspections: number;
  safetyTalks: number;
}

/** Seeds demo data: once automatically on first boot, or on demand via admin reset. */
@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(UnitEntity)
    private readonly unitsRepository: Repository<UnitEntity>,
    @InjectRepository(InspectionEntity)
    private readonly inspectionsRepository: Repository<InspectionEntity>,
    @InjectRepository(SafetyTalkEntity)
    private readonly safetyTalksRepository: Repository<SafetyTalkEntity>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    await this.seedIfEmpty();
  }

  /** Seeds demo data only if the database is currently empty. */
  async seedIfEmpty(): Promise<void> {
    const existingUnits = await this.unitsRepository.count();
    if (existingUnits > 0) {
      return;
    }
    await this.seed();
  }

  /** Seeds demo data unconditionally, returning how many records of each kind were created. */
  async seed(): Promise<SeedCounts> {
    await this.seedUnits();
    const inspections = await this.seedInspections();
    const safetyTalks = await this.seedSafetyTalks();
    this.logger.log('Data awal (seed) berhasil dibuat.');
    return { units: SEED_UNITS.length, inspections, safetyTalks };
  }

  private async seedUnits(): Promise<void> {
    const units = SEED_UNITS.map((unit) => this.unitsRepository.create(unit));
    await this.unitsRepository.save(units);
  }

  private async seedInspections(): Promise<number> {
    const now = new Date();
    const unitsById = new Map(SEED_UNITS.map((unit) => [unit.id, unit]));

    const entities = SEED_INSPECTIONS.map((template) => {
      const unit = unitsById.get(template.unitId);
      if (!unit) {
        throw new Error(`Seed inspeksi mereferensikan unit yang tidak ada: ${template.unitId}`);
      }
      const dibuatPadaDate = hoursBefore(now, template.hoursAgo);
      const dibuatPada = dibuatPadaDate.toISOString();
      const items = buildChecklistItems(unit.type, template.overrides);
      const statusKelayakan = hitungStatusKelayakan(items).status;

      return this.inspectionsRepository.create({
        id: template.id,
        unitId: template.unitId,
        namaOperator: template.namaOperator,
        nrp: template.nrp,
        tanggal: toLocalDateString(dibuatPadaDate),
        shift: template.shift,
        lokasiKerja: template.lokasiKerja,
        hmKmAwal: template.hmKmAwal,
        hmKmAkhir: template.hmKmAkhir,
        items,
        pernyataanOperator: true,
        catatanOperator: template.catatanOperator,
        rekomendasiMekanik: null,
        keputusanPengawas: null,
        fotoPath: null,
        latitude: template.latitude,
        longitude: template.longitude,
        dibuatPada,
        statusKelayakan,
        // Seed records are treated as already synced at the moment they occurred.
        diterimaPada: dibuatPada,
        tindakLanjut: { status: statusTindakLanjutAwal(statusKelayakan), rekomendasi: null, keputusan: null },
        // Integrity checks only apply to records actually submitted through sync.
        integritas: null,
      });
    });

    await this.inspectionsRepository.save(entities);
    return entities.length;
  }

  private async seedSafetyTalks(): Promise<number> {
    const now = new Date();

    const entities = SEED_SAFETY_TALKS.map((template) => {
      const dibuatPadaDate = hoursBefore(now, template.hoursAgo);
      const dibuatPada = dibuatPadaDate.toISOString();
      return this.safetyTalksRepository.create({
        id: template.id,
        tanggal: toLocalDateString(dibuatPadaDate),
        jamMulai: template.jamMulai,
        shift: template.shift,
        lokasiArea: template.lokasiArea,
        departemenRegu: template.departemenRegu,
        namaPemimpin: template.namaPemimpin,
        nrpPemimpin: template.nrpPemimpin,
        topik: template.topik,
        uraianSingkat: template.uraianSingkat,
        potensiBahaya: template.potensiBahaya,
        komitmenPengendalian: template.komitmenPengendalian,
        informasiPengumuman: template.informasiPengumuman,
        peserta: template.peserta,
        fotoPath: null,
        latitude: template.latitude,
        longitude: template.longitude,
        catatan: template.catatan,
        dibuatPada,
        diterimaPada: dibuatPada,
        // Integrity checks only apply to records actually submitted through sync.
        integritas: null,
      });
    });

    await this.safetyTalksRepository.save(entities);
    return entities.length;
  }
}

function hoursBefore(now: Date, hours: number): Date {
  return new Date(now.getTime() - hours * 60 * 60 * 1000);
}

function buildChecklistItems(type: UnitType, overrides: readonly SeedItemOverride[]): HasilItemP2H[] {
  const overrideByKey = new Map(overrides.map((override) => [override.key, override]));
  return getChecklist(type).map((definition) => {
    const override = overrideByKey.get(definition.key);
    return {
      ...definition,
      hasil: override?.hasil ?? 'NORMAL',
      keterangan: override?.keterangan,
    };
  });
}
