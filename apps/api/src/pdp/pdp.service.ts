import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
  HasilPenghapusanPdp,
  KebijakanRetensi,
  PenggunaProfil,
  PermintaanPdpDto,
  RingkasanDataPribadi,
} from '@p2h/shared';
import { InspectionEntity } from '../inspections/inspection.entity';
import { SafetyTalkEntity } from '../safety-talks/safety-talk.entity';
import { AuditService } from '../audit/audit.service';
import { PhotoStorageService } from '../photos/photo-storage.service';
import { getAppConfig } from '../config/app-config';
import { RetentionService } from './retention.service';

const NAMA_DIHAPUS = '[dihapus]';

/** Data subject rights (UU PDP 27/2022): access and erasure requests for a given NRP. */
@Injectable()
export class PdpService {
  constructor(
    @InjectRepository(InspectionEntity)
    private readonly inspectionsRepository: Repository<InspectionEntity>,
    @InjectRepository(SafetyTalkEntity)
    private readonly safetyTalksRepository: Repository<SafetyTalkEntity>,
    private readonly auditService: AuditService,
    private readonly photoStorageService: PhotoStorageService,
    private readonly retentionService: RetentionService,
  ) {}

  async proses(dto: PermintaanPdpDto, pengguna: PenggunaProfil): Promise<RingkasanDataPribadi | HasilPenghapusanPdp> {
    return dto.jenis === 'AKSES' ? this.akses(dto, pengguna) : this.hapus(dto, pengguna);
  }

  async kebijakanRetensi(): Promise<KebijakanRetensi> {
    return {
      hariRetensiServer: getAppConfig().retention.serverDays,
      // Documented default; device-side retention is managed by the mobile app, not the server.
      hariRetensiPerangkat: 7,
      terakhirDijalankan: await this.retentionService.terakhirDijalankan(),
      catatan:
        'Retensi perangkat (HP) dikelola oleh aplikasi mobile dan tidak dapat dipantau dari server dalam demo ini.',
    };
  }

  private async akses(dto: PermintaanPdpDto, pengguna: PenggunaProfil): Promise<RingkasanDataPribadi> {
    const inspeksi = await this.inspectionsRepository.find({ where: { nrp: dto.nrp } });
    const p5m = await this.safetyTalksRepository.find({ where: { nrpPemimpin: dto.nrp } });
    const tanggal = [...inspeksi.map((entity) => entity.tanggal), ...p5m.map((entity) => entity.tanggal)].sort();
    const rentangTanggal =
      tanggal.length > 0 ? { dari: tanggal[0], sampai: tanggal[tanggal.length - 1] } : null;

    await this.auditService.catat({
      aksi: 'DATA_DIEKSPOR',
      entitas: 'SISTEM',
      entitasId: dto.nrp,
      aktorId: pengguna.id,
      aktorNama: pengguna.nama,
      ringkasan: `Permintaan akses data pribadi untuk NRP ${dto.nrp} (alasan: ${dto.alasan})`,
    });

    return { nrp: dto.nrp, jumlahInspeksi: inspeksi.length, jumlahP5M: p5m.length, rentangTanggal };
  }

  /**
   * Anonymises personal data for the given NRP: name/NRP are replaced,
   * photos are deleted. The underlying safety record itself is kept — SMKP
   * requires the inspection/P5M history to remain auditable, while UU PDP
   * requires removing the personal data tied to it. Anonymising (not
   * deleting the row) satisfies both at once.
   */
  private async hapus(dto: PermintaanPdpDto, pengguna: PenggunaProfil): Promise<HasilPenghapusanPdp> {
    const inspeksi = await this.inspectionsRepository.find({ where: { nrp: dto.nrp } });
    const p5m = await this.safetyTalksRepository.find({ where: { nrpPemimpin: dto.nrp } });

    for (const entity of inspeksi) {
      if (entity.fotoPath) this.photoStorageService.remove(entity.fotoPath);
      entity.namaOperator = NAMA_DIHAPUS;
      entity.nrp = NAMA_DIHAPUS;
      entity.fotoPath = null;
    }
    if (inspeksi.length > 0) await this.inspectionsRepository.save(inspeksi);

    for (const entity of p5m) {
      if (entity.fotoPath) this.photoStorageService.remove(entity.fotoPath);
      entity.namaPemimpin = NAMA_DIHAPUS;
      entity.nrpPemimpin = NAMA_DIHAPUS;
      entity.fotoPath = null;
    }
    if (p5m.length > 0) await this.safetyTalksRepository.save(p5m);

    await this.auditService.catat({
      aksi: 'DATA_DIHAPUS',
      entitas: 'SISTEM',
      entitasId: dto.nrp,
      aktorId: pengguna.id,
      aktorNama: pengguna.nama,
      ringkasan: `Data pribadi untuk NRP ${dto.nrp} dianonimkan (alasan: ${dto.alasan}); catatan inspeksi/P5M tetap disimpan`,
    });

    return {
      nrp: dto.nrp,
      inspeksiDianonimkan: inspeksi.length,
      p5mDianonimkan: p5m.length,
      pada: new Date().toISOString(),
    };
  }
}
