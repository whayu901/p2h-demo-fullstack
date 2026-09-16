import 'reflect-metadata';
import type { INestApplication } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { mkdtempSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { API_ROUTES, SEED_UNITS, type InspectionDto, type SyncBatchRequest } from '@p2h/shared';
import { AppModule } from '../src/app.module';
import { resetAppConfigCacheForTests } from '../src/config/app-config';

function buildDto(id: string): InspectionDto {
  return {
    id,
    unitId: SEED_UNITS[0].id,
    namaOperator: 'Uji E2E',
    nrp: '00.00.0002',
    tanggal: '2026-01-02',
    shift: 'PAGI',
    lokasiKerja: 'Area E2E',
    hmKmAwal: 200,
    hmKmAkhir: 210,
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
  };
}

async function bootstrapTestApp(dbFile: string): Promise<INestApplication> {
  process.env.DB_NAME = dbFile;
  resetAppConfigCacheForTests();
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: false });
  await app.init();
  return app;
}

describe('API e2e (demo mode)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.AUTH_ENABLED = 'false';
    app = await bootstrapTestApp(join(mkdtempSync(join(tmpdir(), 'p2h-e2e-')), 'test.sqlite'));
  });

  afterAll(async () => {
    await app.close();
    delete process.env.DB_NAME;
    resetAppConfigCacheForTests();
  });

  it('GET /inspections succeeds unauthenticated', async () => {
    const res = await request(app.getHttpServer()).get(API_ROUTES.inspections);
    expect(res.status).toBe(200);
  });

  it('POST /sync/batch twice does not duplicate the record', async () => {
    const body: SyncBatchRequest = { inspections: [buildDto('e2e-insp-1')], safetyTalks: [] };

    const first = await request(app.getHttpServer()).post(API_ROUTES.syncBatch).send(body);
    expect(first.status).toBe(201);
    expect(first.body.inspections).toEqual({ received: 1, created: 1, updated: 0 });

    const second = await request(app.getHttpServer()).post(API_ROUTES.syncBatch).send(body);
    expect(second.body.inspections).toEqual({ received: 1, created: 0, updated: 1 });

    const list = await request(app.getHttpServer()).get(API_ROUTES.inspections);
    const matches = (list.body as Array<{ id: string }>).filter((item) => item.id === 'e2e-insp-1');
    expect(matches).toHaveLength(1);
  });

  it('POST /inspections/:id/keputusan updates the follow-up status', async () => {
    await request(app.getHttpServer())
      .post(API_ROUTES.syncBatch)
      .send({ inspections: [buildDto('e2e-insp-2')], safetyTalks: [] } satisfies SyncBatchRequest);

    const res = await request(app.getHttpServer())
      .post(`${API_ROUTES.inspections}/e2e-insp-2/keputusan`)
      .send({ keputusan: 'IZINKAN_OPERASI', catatan: 'Aman untuk beroperasi' });

    expect(res.status).toBe(201);
    expect(res.body.tindakLanjut.status).toBe('SELESAI');
    expect(res.body.tindakLanjut.keputusan.tandaTangan.hashDokumen).toEqual(expect.any(String));
  });

  it('GET /audit/verifikasi reports a valid chain', async () => {
    const res = await request(app.getHttpServer()).get(API_ROUTES.auditVerifikasi);
    expect(res.status).toBe(200);
    expect(res.body.valid).toBe(true);
  });
});

describe('API e2e (auth enabled)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    process.env.AUTH_ENABLED = 'true';
    app = await bootstrapTestApp(join(mkdtempSync(join(tmpdir(), 'p2h-e2e-auth-')), 'test.sqlite'));
  });

  afterAll(async () => {
    await app.close();
    process.env.AUTH_ENABLED = 'false';
    delete process.env.DB_NAME;
    resetAppConfigCacheForTests();
  });

  it('rejects requests without a bearer token', async () => {
    const res = await request(app.getHttpServer()).get(API_ROUTES.inspections);
    expect(res.status).toBe(401);
  });
});
