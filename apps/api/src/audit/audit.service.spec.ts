import 'reflect-metadata';
import { Module, type INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import type { Repository } from 'typeorm';
import { AuditEntity } from './audit.entity';
import { AuditModule } from './audit.module';
import { AuditService } from './audit.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({ type: 'better-sqlite3', database: ':memory:', entities: [AuditEntity], synchronize: true }),
    AuditModule,
  ],
})
class TestModule {}

describe('AuditService', () => {
  let app: INestApplicationContext;
  let auditService: AuditService;
  let repository: Repository<AuditEntity>;

  beforeAll(async () => {
    app = await NestFactory.createApplicationContext(TestModule, { logger: false });
    auditService = app.get(AuditService);
    repository = app.get(getRepositoryToken(AuditEntity));
  });

  afterAll(async () => {
    await app.close();
  });

  it('verifies a clean chain as valid', async () => {
    await auditService.catat({
      aksi: 'SYNC_TERIMA',
      entitas: 'SISTEM',
      entitasId: null,
      aktorId: null,
      aktorNama: 'Sistem',
      ringkasan: 'Uji 1',
    });
    await auditService.catat({
      aksi: 'SYNC_TERIMA',
      entitas: 'SISTEM',
      entitasId: null,
      aktorId: null,
      aktorNama: 'Sistem',
      ringkasan: 'Uji 2',
    });

    const hasil = await auditService.verifikasiRantai();
    expect(hasil.valid).toBe(true);
    expect(hasil.rusakPadaUrutan).toBeNull();
  });

  it('detects a tampered row', async () => {
    const entry = await auditService.catat({
      aksi: 'SYNC_TERIMA',
      entitas: 'SISTEM',
      entitasId: null,
      aktorId: null,
      aktorNama: 'Sistem',
      ringkasan: 'Uji 3',
    });

    const target = await repository.findOneByOrFail({ urutan: entry.urutan });
    target.ringkasan = 'Diubah tanpa izin';
    await repository.save(target);

    const hasil = await auditService.verifikasiRantai();
    expect(hasil.valid).toBe(false);
    expect(hasil.rusakPadaUrutan).toBe(entry.urutan);
  });
});
