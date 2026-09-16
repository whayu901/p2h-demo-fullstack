import 'reflect-metadata';
import type { INestApplicationContext } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SEED_UNITS, type InspectionDto, type PenggunaProfil } from '@p2h/shared';
import { AppModule } from '../app.module';
import { getAppConfig, resetAppConfigCacheForTests } from '../config/app-config';
import { InspectionsService } from '../inspections/inspections.service';
import { SyncService } from './sync.service';

const PENGGUNA: PenggunaProfil = {
  id: 'tester',
  nama: 'Penguji Otomatis',
  nrp: '00.00.0001',
  email: null,
  jabatan: null,
  peran: ['ADMIN'],
};

function buildDto(id: string, override: Partial<InspectionDto> = {}): InspectionDto {
  return {
    id,
    unitId: SEED_UNITS[0].id,
    namaOperator: 'Uji Coba',
    nrp: '00.00.0001',
    tanggal: '2026-01-01',
    shift: 'PAGI',
    lokasiKerja: 'Area Uji',
    hmKmAwal: 100,
    hmKmAkhir: 110,
    items: [
      { key: 'rem_utama', label: 'Rem utama', section: 'TEST_FUNGSI', kodeBahaya: 'AA', hasil: 'NORMAL' },
    ],
    pernyataanOperator: true,
    catatanOperator: '',
    rekomendasiMekanik: null,
    keputusanPengawas: null,
    fotoBase64: null,
    latitude: null,
    longitude: null,
    dibuatPada: new Date().toISOString(),
    ...override,
  };
}

describe('SyncService', () => {
  let app: INestApplicationContext;
  let syncService: SyncService;

  beforeAll(async () => {
    process.env.DB_NAME = ':memory:';
    process.env.AUTH_ENABLED = 'false';
    resetAppConfigCacheForTests();
    expect(getAppConfig().db.name).toBe(':memory:');

    app = await NestFactory.createApplicationContext(AppModule, { logger: false });
    syncService = app.get(SyncService);
  });

  afterAll(async () => {
    await app.close();
    delete process.env.DB_NAME;
    resetAppConfigCacheForTests();
  });

  it('is idempotent by client id: same id twice -> created 1 then updated 1', async () => {
    const dto = buildDto('unit-test-insp-1');

    const first = await syncService.processBatch({ inspections: [dto], safetyTalks: [] }, PENGGUNA);
    expect(first.inspections).toEqual({ received: 1, created: 1, updated: 0 });

    const second = await syncService.processBatch({ inspections: [dto], safetyTalks: [] }, PENGGUNA);
    expect(second.inspections).toEqual({ received: 1, created: 0, updated: 1 });
  });

  it('recomputes statusKelayakan from items on the server, ignoring any client-sent value', async () => {
    const dto = {
      ...buildDto('unit-test-insp-2', {
        items: [
          { key: 'rem_utama', label: 'Rem utama', section: 'TEST_FUNGSI', kodeBahaya: 'AA', hasil: 'TIDAK_NORMAL' },
        ],
      }),
      // A buggy/malicious client trying to smuggle a verdict; the server must ignore it.
      statusKelayakan: 'LAYAK_OPERASI',
    } as unknown as InspectionDto;

    await syncService.processBatch({ inspections: [dto], safetyTalks: [] }, PENGGUNA);

    const view = await app.get(InspectionsService).findByIdOrThrow('unit-test-insp-2');
    expect(view.statusKelayakan).toBe('STOP_OPERASI');
  });
});
