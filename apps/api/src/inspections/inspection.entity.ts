import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';
import type { HasilItemP2H, Shift, StatusKelayakan } from '@p2h/shared';
import { UnitEntity } from '../units/unit.entity';

/** A submitted P2H inspection (table: inspections). */
@Entity({ name: 'inspections' })
export class InspectionEntity {
  /** Client-generated UUID; used as the idempotency key for sync. */
  @PrimaryColumn('text')
  id!: string;

  @Column('text')
  unitId!: string;

  @ManyToOne(() => UnitEntity, { eager: true })
  @JoinColumn({ name: 'unitId' })
  unit!: UnitEntity;

  @Column('text')
  namaOperator!: string;

  @Column('text')
  nrp!: string;

  /** Local date as written on the paper form, format YYYY-MM-DD. */
  @Column('text')
  tanggal!: string;

  @Column('text')
  shift!: Shift;

  @Column('text')
  lokasiKerja!: string;

  @Column('real')
  hmKmAwal!: number;

  @Column('real', { nullable: true })
  hmKmAkhir!: number | null;

  @Column('simple-json')
  items!: HasilItemP2H[];

  @Column('boolean', { default: false })
  pernyataanOperator!: boolean;

  @Column('text', { default: '' })
  catatanOperator!: string;

  /** Not filled in the demo; reserved for a future mechanic follow-up workflow. */
  @Column('text', { nullable: true })
  rekomendasiMekanik!: string | null;

  /** Not filled in the demo; reserved for a future supervisor decision workflow. */
  @Column('text', { nullable: true })
  keputusanPengawas!: string | null;

  @Column('text', { nullable: true })
  fotoPath!: string | null;

  @Column('real', { nullable: true })
  latitude!: number | null;

  @Column('real', { nullable: true })
  longitude!: number | null;

  /** ISO 8601 timestamp, created on device; used for ordering. */
  @Column('text')
  dibuatPada!: string;

  /**
   * Operational verdict, recomputed by the server on every upsert via
   * hitungStatusKelayakan — stored so list views don't need to recompute it.
   */
  @Column('text')
  statusKelayakan!: StatusKelayakan;

  /** ISO 8601 timestamp for when the API first stored this record. */
  @Column('text')
  diterimaPada!: string;
}
