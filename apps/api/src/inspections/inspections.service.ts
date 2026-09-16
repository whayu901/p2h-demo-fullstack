import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  hitungJumlahTemuan,
  hitungStatusKelayakan,
  statusTindakLanjutAwal,
  type IntegritasRecord,
  type InspectionDto,
  type InspectionFilters,
  type InspectionView,
  type KeputusanPengawasRecord,
  type KirimKeputusanDto,
  type KirimRekomendasiDto,
  type PenggunaProfil,
  type RekomendasiMekanik,
  type StatusKelayakan,
  type StatusTindakLanjut,
  type TandaTanganElektronik,
} from '@p2h/shared';
import { todayLocalDate } from '../common/date.util';
import { AuditService } from '../audit/audit.service';
import { TandaTanganService } from '../tanda-tangan/tanda-tangan.service';
import { InspectionEntity } from './inspection.entity';

/** Aggregate counters derived from today's inspections, used by the overview endpoint. */
export interface InspectionTodayStats {
  p2hHariIni: number;
  unitStopOperasi: number;
  temuanTerbuka: number;
}

/** Outcome of a sync upsert: what happened, and the recomputed verdict (for downstream integration events). */
export interface UpsertResult {
  outcome: 'created' | 'updated';
  statusKelayakan: StatusKelayakan;
}

const STATUS_TINDAK_LANJUT_SELESAI: readonly StatusTindakLanjut[] = ['SELESAI', 'TIDAK_DIPERLUKAN'];

@Injectable()
export class InspectionsService {
  constructor(
    @InjectRepository(InspectionEntity)
    private readonly inspectionsRepository: Repository<InspectionEntity>,
    private readonly auditService: AuditService,
    private readonly tandaTanganService: TandaTanganService,
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

    let entities = await query.getMany();
    if (filters.statusTindakLanjut) {
      // tindakLanjut is stored as simple-json; filtering in-memory keeps this
      // correct regardless of how the underlying DB serialises the column.
      entities = entities.filter((entity) => entity.tindakLanjut.status === filters.statusTindakLanjut);
    }

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

  /** Inspections (all time) whose follow-up isn't SELESAI/TIDAK_DIPERLUKAN yet — feeds OverviewStats.menungguTindakLanjut. */
  async countMenungguTindakLanjut(): Promise<number> {
    const entities = await this.inspectionsRepository.find();
    return entities.filter((entity) => !STATUS_TINDAK_LANJUT_SELESAI.includes(entity.tindakLanjut.status)).length;
  }

  /** Upserts by client id within the given transactional manager. */
  async upsert(
    dto: InspectionDto,
    photoPath: string | null,
    integritas: IntegritasRecord,
    manager: EntityManager,
  ): Promise<UpsertResult> {
    const repository = manager.getRepository(InspectionEntity);
    const existing = await repository.findOneBy({ id: dto.id });
    // Verdict is always recomputed from the checklist items server-side — a
    // client-sent verdict (if any snuck into the payload) is never trusted.
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
      existing.integritas = integritas;
      // tindakLanjut intentionally left untouched — see the field's doc comment.
      // diterimaPada is kept as the original server receive time, not overwritten.
      await repository.save(existing);
      return { outcome: 'updated', statusKelayakan };
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
      integritas,
      tindakLanjut: { status: statusTindakLanjutAwal(statusKelayakan), rekomendasi: null, keputusan: null },
      diterimaPada: new Date().toISOString(),
    });
    await repository.save(entity);
    return { outcome: 'created', statusKelayakan };
  }

  /** Records a mechanic's recommendation; moves the follow-up into DALAM_PERBAIKAN. */
  async tambahRekomendasi(
    id: string,
    dto: KirimRekomendasiDto,
    pengguna: PenggunaProfil,
  ): Promise<InspectionView> {
    const entity = await this.findEntityOrThrow(id);

    const rekomendasi: RekomendasiMekanik = {
      catatan: dto.catatan,
      sparePart: dto.sparePart ?? null,
      estimasiSelesai: dto.estimasiSelesai ?? null,
      oleh: { penggunaId: pengguna.id, nama: pengguna.nama, nrp: pengguna.nrp, pada: new Date().toISOString() },
    };
    entity.tindakLanjut = { ...entity.tindakLanjut, rekomendasi, status: 'DALAM_PERBAIKAN' };
    await this.inspectionsRepository.save(entity);

    await this.auditService.catat({
      aksi: 'REKOMENDASI_DITAMBAHKAN',
      entitas: 'INSPEKSI',
      entitasId: entity.id,
      aktorId: pengguna.id,
      aktorNama: pengguna.nama,
      ringkasan: `Rekomendasi mekanik ditambahkan untuk inspeksi ${entity.id}`,
    });

    return this.toView(entity);
  }

  /**
   * Records a supervisor's decision and signs it. A keputusan on an
   * inspection with no rekomendasi yet is allowed — a supervisor may decide
   * directly (e.g. a minor finding, or inspecting the unit personally)
   * without waiting for a mechanic's write-up.
   */
  async tambahKeputusan(id: string, dto: KirimKeputusanDto, pengguna: PenggunaProfil): Promise<InspectionView> {
    const entity = await this.findEntityOrThrow(id);

    const oleh = { penggunaId: pengguna.id, nama: pengguna.nama, nrp: pengguna.nrp, pada: new Date().toISOString() };
    const tandaTangan: TandaTanganElektronik = this.tandaTanganService.tandaTangani(
      { inspeksiId: entity.id, ...dto, oleh },
      pengguna,
    );
    const keputusan: KeputusanPengawasRecord = {
      keputusan: dto.keputusan,
      catatan: dto.catatan,
      syarat: dto.syarat ?? null,
      oleh,
      tandaTangan,
    };

    const status: StatusTindakLanjut = dto.keputusan === 'TAHAN_UNIT' ? 'DALAM_PERBAIKAN' : 'SELESAI';
    entity.tindakLanjut = { ...entity.tindakLanjut, keputusan, status };
    await this.inspectionsRepository.save(entity);

    await this.auditService.catat({
      aksi: 'KEPUTUSAN_DITAMBAHKAN',
      entitas: 'INSPEKSI',
      entitasId: entity.id,
      aktorId: pengguna.id,
      aktorNama: pengguna.nama,
      ringkasan: `Keputusan pengawas "${dto.keputusan}" ditambahkan untuk inspeksi ${entity.id}`,
    });

    return this.toView(entity);
  }

  private async findEntityOrThrow(id: string): Promise<InspectionEntity> {
    const entity = await this.inspectionsRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`Inspeksi dengan id ${id} tidak ditemukan`);
    }
    return entity;
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
      tindakLanjut: entity.tindakLanjut,
      integritas: entity.integritas,
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
