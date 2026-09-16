import { Column, Entity, PrimaryColumn } from 'typeorm';
import type { AksiAudit } from '@p2h/shared';

/**
 * Append-only audit trail (table: audit_log), hash-chained for SMKP
 * compliance. Rows here are NEVER updated or deleted by application code —
 * AuditService only ever appends via `catat()`. That invariant is what makes
 * the hash chain meaningful: an UPDATE/DELETE on this table (even by a DBA)
 * is exactly the kind of tampering `verifikasiRantai()` is meant to detect.
 */
@Entity({ name: 'audit_log' })
export class AuditEntity {
  @PrimaryColumn('text')
  id!: string;

  /** Monotonically increasing sequence number, the backbone of the hash chain. */
  @Column('int')
  urutan!: number;

  @Column('text')
  aksi!: AksiAudit;

  @Column('text')
  entitas!: 'INSPEKSI' | 'P5M' | 'SISTEM';

  @Column('text', { nullable: true })
  entitasId!: string | null;

  @Column('text', { nullable: true })
  aktorId!: string | null;

  @Column('text')
  aktorNama!: string;

  @Column('text')
  ringkasan!: string;

  /** ISO 8601 timestamp. */
  @Column('text')
  waktu!: string;

  @Column('text', { nullable: true })
  hashSebelumnya!: string | null;

  /** sha256(urutan|aksi|entitas|entitasId|aktorId|waktu|ringkasan|hashSebelumnya). */
  @Column('text')
  hash!: string;
}
