import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { PesertaP5M, Shift } from '@p2h/shared';

/** A submitted P5M safety talk (table: safety_talks). */
@Entity({ name: 'safety_talks' })
export class SafetyTalkEntity {
  /** Client-generated UUID; used as the idempotency key for sync. */
  @PrimaryColumn('text')
  id!: string;

  /** Local date, format YYYY-MM-DD. */
  @Column('text')
  tanggal!: string;

  /** Local time, format HH:mm. */
  @Column('text')
  jamMulai!: string;

  @Column('text')
  shift!: Shift;

  @Column('text')
  lokasiArea!: string;

  @Column('text')
  departemenRegu!: string;

  @Column('text')
  namaPemimpin!: string;

  @Column('text')
  nrpPemimpin!: string;

  @Column('text')
  topik!: string;

  @Column('text', { default: '' })
  uraianSingkat!: string;

  @Column('simple-json')
  potensiBahaya!: string[];

  @Column('simple-json')
  komitmenPengendalian!: string[];

  @Column('text', { default: '' })
  informasiPengumuman!: string;

  @Column('simple-json')
  peserta!: PesertaP5M[];

  @Column('text', { nullable: true })
  fotoPath!: string | null;

  @Column('real', { nullable: true })
  latitude!: number | null;

  @Column('real', { nullable: true })
  longitude!: number | null;

  @Column('text', { default: '' })
  catatan!: string;

  /** ISO 8601 timestamp. */
  @Column('text')
  dibuatPada!: string;

  /** ISO 8601 timestamp for when the API first stored this record. */
  @Column('text')
  diterimaPada!: string;
}
