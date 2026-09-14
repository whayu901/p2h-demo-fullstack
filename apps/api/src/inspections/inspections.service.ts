import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  hitungJumlahTemuan,
  hitungStatusKelayakan,
  type InspectionDto,
  type InspectionFilters,
  type InspectionView,
} from '@p2h/shared';
import { todayLocalDate } from '../common/date.util';
import { InspectionEntity } from './inspection.entity';

/** Aggregate counters derived from today's inspections, used by the overview endpoint. */
export interface InspectionTodayStats {
  p2hHariIni: number;
  unitStopOperasi: number;
  temuanTerbuka: number;
}

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(InspectionEntity)
    private readonly inspectionsRepository: Repository<InspectionEntity>,
  ) {}

  async findAll(filters: InspectionFilters): Promise<InspectionView[]> {
    const query = this.inspectionsRepository
      .createQueryBuilder('inspection')
      .leftJoinAndSelect('inspection.unit', 'unit')
      .orderBy('inspection.dibuatPada', 'DESC');

    if (filters.tanggal) {
      query.andWhere('inspection.tanggal = :tanggal', { tanggal: filters.tanggal });
    }
    if (filters.unitType) {
      query.andWhere('unit.type = :unitType', { unitType: filters.unitType });
    }
    if (filters.shift) {
      query.andWhere('inspection.shift = :shift', { shift: filters.shift });
    }
    if (filters.statusKelayakan) {
      query.andWhere('inspection.statusKelayakan = :statusKelayakan', {
        statusKelayakan: filters.statusKelayakan,
      });
    }

    const entities = await query.getMany();
    return entities.map((entity) => this.toView(entity));
  }

  async findByIdOrThrow(id: string): Promise<InspectionView> {
    const entity = await this.inspectionsRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Inspeksi dengan id ${id} tidak ditemukan`);
    }
    return this.toView(entity);
  }

  async findRecent(limit: number): Promise<InspectionEntity[]> {
    return this.inspectionsRepository.find({ order: { dibuatPada: 'DESC' }, take: limit });
  }

  /** Latest inspection per unit (by dibuatPada), used to enrich the units list. */
  async findLatestPerUnit(): Promise<Map<string, InspectionEntity>> {
    const entities = await this.inspectionsRepository.find({ order: { dibuatPada: 'DESC' } });
    const latestByUnitId = new Map<string, InspectionEntity>();
    for (const entity of entities) {
      if (!latestByUnitId.has(entity.unitId)) {
        latestByUnitId.set(entity.unitId, entity);
      }
    }
    return latestByUnitId;
  }

  async getTodayStats(): Promise<InspectionTodayStats> {
    const entities = await this.inspectionsRepository.find({ where: { tanggal: todayLocalDate() } });
    const temuanTerbuka = entities.reduce((sum, entity) => sum + hitungJumlahTemuan(entity.items), 0);
    const unitStopOperasi = countUnitsWithLatestStopOperasi(entities);
    return { p2hHariIni: entities.length, unitStopOperasi, temuanTerbuka };
  }

  /** Upserts by client id within the given transactional manager. */
  async upsert(dto: InspectionDto, photoPath: string | null, manager: EntityManager): Promise<'created' | 'updated'> {
    const repository = manager.getRepository(InspectionEntity);
    const existing = await repository.findOneBy({ id: dto.id });
    const statusKelayakan = hitungStatusKelayakan(dto.items).status;

    if (existing) {
      existing.unitId = dto.unitId;
      existing.namaOperator = dto.namaOperator;
      existing.nrp = dto.nrp;
      existing.tanggal = dto.tanggal;
      existing.shift = dto.shift;
      existing.lokasiKerja = dto.lokasiKerja;
      existing.hmKmAwal = dto.hmKmAwal;
      existing.hmKmAkhir = dto.hmKmAkhir;
      existing.items = dto.items;
      existing.pernyataanOperator = dto.pernyataanOperator;
      existing.catatanOperator = dto.catatanOperator;
      existing.rekomendasiMekanik = dto.rekomendasiMekanik;
      existing.keputusanPengawas = dto.keputusanPengawas;
      // A re-sent record with no photo this time keeps whatever photo it already has.
      existing.fotoPath = photoPath ?? existing.fotoPath;
      existing.latitude = dto.latitude;
      existing.longitude = dto.longitude;
      existing.dibuatPada = dto.dibuatPada;
      existing.statusKelayakan = statusKelayakan;
      // diterimaPada is kept as the original server receive time, not overwritten.
      await repository.save(existing);
      return 'updated';
    }

    const entity = repository.create({
      id: dto.id,
      unitId: dto.unitId,
      namaOperator: dto.namaOperator,
      nrp: dto.nrp,
      tanggal: dto.tanggal,
      shift: dto.shift,
      lokasiKerja: dto.lokasiKerja,
      hmKmAwal: dto.hmKmAwal,
      hmKmAkhir: dto.hmKmAkhir,
      items: dto.items,
      pernyataanOperator: dto.pernyataanOperator,
      catatanOperator: dto.catatanOperator,
      rekomendasiMekanik: dto.rekomendasiMekanik,
      keputusanPengawas: dto.keputusanPengawas,
      fotoPath: photoPath,
      latitude: dto.latitude,
      longitude: dto.longitude,
      dibuatPada: dto.dibuatPada,
      statusKelayakan,
      diterimaPada: new Date().toISOString(),
    });
    await repository.save(entity);
    return 'created';
  }

  private toView(entity: InspectionEntity): InspectionView {
    return {
      id: entity.id,
      unitId: entity.unitId,
      namaOperator: entity.namaOperator,
      nrp: entity.nrp,
      tanggal: entity.tanggal,
      shift: entity.shift,
      lokasiKerja: entity.lokasiKerja,
      hmKmAwal: entity.hmKmAwal,
      hmKmAkhir: entity.hmKmAkhir,
      items: entity.items,
      pernyataanOperator: entity.pernyataanOperator,
      catatanOperator: entity.catatanOperator,
      rekomendasiMekanik: entity.rekomendasiMekanik,
      keputusanPengawas: entity.keputusanPengawas,
      fotoUrl: entity.fotoPath,
      latitude: entity.latitude,
      longitude: entity.longitude,
      dibuatPada: entity.dibuatPada,
      unit: entity.unit,
      statusKelayakan: entity.statusKelayakan,
      jumlahTemuan: hitungJumlahTemuan(entity.items),
      diterimaPada: entity.diterimaPada,
    };
  }
}

/** Counts distinct units whose most recent (by dibuatPada) inspection among the given entities is STOP_OPERASI. */
function countUnitsWithLatestStopOperasi(entities: readonly InspectionEntity[]): number {
  const latestByUnitId = new Map<string, InspectionEntity>();
  for (const entity of entities) {
    const current = latestByUnitId.get(entity.unitId);
    if (!current || entity.dibuatPada > current.dibuatPada) {
      latestByUnitId.set(entity.unitId, entity);
    }
  }
  let count = 0;
  for (const entity of latestByUnitId.values()) {
    if (entity.statusKelayakan === 'STOP_OPERASI') {
      count += 1;
    }
  }
  return count;
}
