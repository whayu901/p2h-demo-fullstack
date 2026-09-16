import type { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Hand-written baseline matching the entities as of this change: units,
 * inspections, safety_talks, audit_log, system_meta. Written in
 * cross-dialect-friendly SQL (targets Postgres; the sqlite demo uses
 * `synchronize: true` instead and never runs this).
 */
export class InitialSchema1758000000000 implements MigrationInterface {
  name = 'InitialSchema1758000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "units" (
        "id" text PRIMARY KEY,
        "code" text NOT NULL,
        "name" text NOT NULL,
        "type" text NOT NULL,
        "site" text NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "inspections" (
        "id" text PRIMARY KEY,
        "unitId" text NOT NULL REFERENCES "units"("id"),
        "namaOperator" text NOT NULL,
        "nrp" text NOT NULL,
        "tanggal" text NOT NULL,
        "shift" text NOT NULL,
        "lokasiKerja" text NOT NULL,
        "hmKmAwal" real NOT NULL,
        "hmKmAkhir" real,
        "items" text NOT NULL,
        "pernyataanOperator" boolean NOT NULL DEFAULT false,
        "catatanOperator" text NOT NULL DEFAULT '',
        "rekomendasiMekanik" text,
        "keputusanPengawas" text,
        "fotoPath" text,
        "latitude" real,
        "longitude" real,
        "dibuatPada" text NOT NULL,
        "statusKelayakan" text NOT NULL,
        "diterimaPada" text NOT NULL,
        "tindakLanjut" text NOT NULL,
        "integritas" text
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "safety_talks" (
        "id" text PRIMARY KEY,
        "tanggal" text NOT NULL,
        "jamMulai" text NOT NULL,
        "shift" text NOT NULL,
        "lokasiArea" text NOT NULL,
        "departemenRegu" text NOT NULL,
        "namaPemimpin" text NOT NULL,
        "nrpPemimpin" text NOT NULL,
        "topik" text NOT NULL,
        "uraianSingkat" text NOT NULL DEFAULT '',
        "potensiBahaya" text NOT NULL,
        "komitmenPengendalian" text NOT NULL,
        "informasiPengumuman" text NOT NULL DEFAULT '',
        "peserta" text NOT NULL,
        "fotoPath" text,
        "latitude" real,
        "longitude" real,
        "catatan" text NOT NULL DEFAULT '',
        "dibuatPada" text NOT NULL,
        "diterimaPada" text NOT NULL,
        "integritas" text
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "audit_log" (
        "id" text PRIMARY KEY,
        "urutan" integer NOT NULL,
        "aksi" text NOT NULL,
        "entitas" text NOT NULL,
        "entitasId" text,
        "aktorId" text,
        "aktorNama" text NOT NULL,
        "ringkasan" text NOT NULL,
        "waktu" text NOT NULL,
        "hashSebelumnya" text,
        "hash" text NOT NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "system_meta" (
        "key" text PRIMARY KEY,
        "value" text NOT NULL
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "system_meta"`);
    await queryRunner.query(`DROP TABLE "audit_log"`);
    await queryRunner.query(`DROP TABLE "safety_talks"`);
    await queryRunner.query(`DROP TABLE "inspections"`);
    await queryRunner.query(`DROP TABLE "units"`);
  }
}
