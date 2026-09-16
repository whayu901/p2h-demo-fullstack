import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import {
  hitungPesertaHadir,
  type IntegritasRecord,
  type SafetyTalkDto,
  type SafetyTalkView,
} from '@p2h/shared';
import { todayLocalDate } from '../common/date.util';
import { SafetyTalkEntity } from './safety-talk.entity';

@Injectable()
export class SafetyTalksService {
  constructor(
    @InjectRepository(SafetyTalkEntity)
    private readonly safetyTalksRepository: Repository<SafetyTalkEntity>,
  ) {}

  async findAll(tanggal?: string): Promise<SafetyTalkView[]> {
    const query = this.safetyTalksRepository.createQueryBuilder('talk').orderBy('talk.dibuatPada', 'DESC');

    if (tanggal) {
      query.andWhere('talk.tanggal = :tanggal', { tanggal });
    }

    const entities = await query.getMany();
    return entities.map((entity) => this.toView(entity));
  }

  async findByIdOrThrow(id: string): Promise<SafetyTalkView> {
    const entity = await this.safetyTalksRepository.findOneBy({ id });
    if (!entity) {
      throw new NotFoundException(`P5M dengan id ${id} tidak ditemukan`);
    }
    return this.toView(entity);
  }

  async findRecent(limit: number): Promise<SafetyTalkEntity[]> {
    return this.safetyTalksRepository.find({ order: { dibuatPada: 'DESC' }, take: limit });
  }

  async countToday(): Promise<number> {
    return this.safetyTalksRepository.count({ where: { tanggal: todayLocalDate() } });
  }

  /** Upserts by client id within the given transactional manager. */
  async upsert(
    dto: SafetyTalkDto,
    photoPath: string | null,
    integritas: IntegritasRecord,
    manager: EntityManager,
  ): Promise<'created' | 'updated'> {
    const repository = manager.getRepository(SafetyTalkEntity);
    const existing = await repository.findOneBy({ id: dto.id });

    if (existing) {
      existing.tanggal = dto.tanggal;
      existing.jamMulai = dto.jamMulai;
      existing.shift = dto.shift;
      existing.lokasiArea = dto.lokasiArea;
      existing.departemenRegu = dto.departemenRegu;
      existing.namaPemimpin = dto.namaPemimpin;
      existing.nrpPemimpin = dto.nrpPemimpin;
      existing.topik = dto.topik;
      existing.uraianSingkat = dto.uraianSingkat;
      existing.potensiBahaya = dto.potensiBahaya;
      existing.komitmenPengendalian = dto.komitmenPengendalian;
      existing.informasiPengumuman = dto.informasiPengumuman;
      existing.peserta = dto.peserta;
      // A re-sent record with no photo this time keeps whatever photo it already has.
      existing.fotoPath = photoPath ?? existing.fotoPath;
      existing.latitude = dto.latitude;
      existing.longitude = dto.longitude;
      existing.catatan = dto.catatan;
      existing.dibuatPada = dto.dibuatPada;
      existing.integritas = integritas;
      // diterimaPada is kept as the original server receive time, not overwritten.
      await repository.save(existing);
      return 'updated';
    }

    const entity = repository.create({
      id: dto.id,
      tanggal: dto.tanggal,
      jamMulai: dto.jamMulai,
      shift: dto.shift,
      lokasiArea: dto.lokasiArea,
      departemenRegu: dto.departemenRegu,
      namaPemimpin: dto.namaPemimpin,
      nrpPemimpin: dto.nrpPemimpin,
      topik: dto.topik,
      uraianSingkat: dto.uraianSingkat,
      potensiBahaya: dto.potensiBahaya,
      komitmenPengendalian: dto.komitmenPengendalian,
      informasiPengumuman: dto.informasiPengumuman,
      peserta: dto.peserta,
      fotoPath: photoPath,
      latitude: dto.latitude,
      longitude: dto.longitude,
      catatan: dto.catatan,
      dibuatPada: dto.dibuatPada,
      diterimaPada: new Date().toISOString(),
      integritas,
    });
    await repository.save(entity);
    return 'created';
  }

  private toView(entity: SafetyTalkEntity): SafetyTalkView {
    return {
      id: entity.id,
      tanggal: entity.tanggal,
      jamMulai: entity.jamMulai,
      shift: entity.shift,
      lokasiArea: entity.lokasiArea,
      departemenRegu: entity.departemenRegu,
      namaPemimpin: entity.namaPemimpin,
      nrpPemimpin: entity.nrpPemimpin,
      topik: entity.topik,
      uraianSingkat: entity.uraianSingkat,
      potensiBahaya: entity.potensiBahaya,
      komitmenPengendalian: entity.komitmenPengendalian,
      informasiPengumuman: entity.informasiPengumuman,
      peserta: entity.peserta,
      fotoUrl: entity.fotoPath,
      latitude: entity.latitude,
      longitude: entity.longitude,
      catatan: entity.catatan,
      dibuatPada: entity.dibuatPada,
      jumlahHadir: hitungPesertaHadir(entity.peserta),
      diterimaPada: entity.diterimaPada,
      integritas: entity.integritas,
    };
  }
}
