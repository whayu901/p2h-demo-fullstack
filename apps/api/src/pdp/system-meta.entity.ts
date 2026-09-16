import { Column, Entity, PrimaryColumn } from 'typeorm';

/** Small key/value store for server bookkeeping (table: system_meta) — e.g. when retention last ran. */
@Entity({ name: 'system_meta' })
export class SystemMetaEntity {
  @PrimaryColumn('text')
  key!: string;

  @Column('text')
  value!: string;
}
