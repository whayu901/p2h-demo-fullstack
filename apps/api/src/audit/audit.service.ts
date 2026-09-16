import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { randomUUID } from 'node:crypto';
import type { AksiAudit, AuditFilters, CatatanAudit, VerifikasiRantaiAudit } from '@p2h/shared';
import { sha256Hex } from '../common/canonical-json.util';
import { AuditEntity } from './audit.entity';

export interface CatatEntryInput {
  aksi: AksiAudit;
  entitas: 'INSPEKSI' | 'P5M' | 'SISTEM';
  entitasId: string | null;
  aktorId: string | null;
  aktorNama: string;
  ringkasan: string;
}

const DEFAULT_LIMIT = 100;

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditEntity)
    private readonly auditRepository: Repository<AuditEntity>,
  ) {}

  /** Appends one entry to the hash-chained audit log. Never updates or deletes existing rows. */
  async catat(input: CatatEntryInput): Promise<CatatanAudit> {
    const last = await this.auditRepository.findOne({ where: {}, order: { urutan: 'DESC' } });
    const urutan = (last?.urutan ?? 0) + 1;
    const waktu = new Date().toISOString();
    const hashSebelumnya = last?.hash ?? null;
    const hash = computeHash({
      urutan,
      waktu,
      hashSebelumnya,
      aksi: input.aksi,
      entitas: input.entitas,
      entitasId: input.entitasId,
      aktorId: input.aktorId,
      ringkasan: input.ringkasan,
    });

    const entity = this.auditRepository.create({
      id: randomUUID(),
      urutan,
      waktu,
      hashSebelumnya,
      hash,
      ...input,
    });
    await this.auditRepository.save(entity);
    return toCatatanAudit(entity);
  }

  async cari(filters: AuditFilters): Promise<CatatanAudit[]> {
    const query = this.auditRepository.createQueryBuilder('audit').orderBy('audit.urutan', 'DESC');
    if (filters.entitasId) {
      query.andWhere('audit.entitasId = :entitasId', { entitasId: filters.entitasId });
    }
    if (filters.aksi) {
      query.andWhere('audit.aksi = :aksi', { aksi: filters.aksi });
    }
    query.take(filters.batas ?? DEFAULT_LIMIT);
    const entities = await query.getMany();
    return entities.map(toCatatanAudit);
  }

  /** Recomputes every hash in urutan order; reports the first row (by urutan) where it no longer matches. */
  async verifikasiRantai(): Promise<VerifikasiRantaiAudit> {
    const entities = await this.auditRepository.find({ order: { urutan: 'ASC' } });
    let previousHash: string | null = null;

    for (const entity of entities) {
      const expected = computeHash({
        urutan: entity.urutan,
        aksi: entity.aksi,
        entitas: entity.entitas,
        entitasId: entity.entitasId,
        aktorId: entity.aktorId,
        ringkasan: entity.ringkasan,
        waktu: entity.waktu,
        hashSebelumnya: previousHash,
      });
      if (expected !== entity.hash || entity.hashSebelumnya !== previousHash) {
        return { valid: false, jumlahDiperiksa: entities.length, rusakPadaUrutan: entity.urutan };
      }
      previousHash = entity.hash;
    }

    return { valid: true, jumlahDiperiksa: entities.length, rusakPadaUrutan: null };
  }
}

interface HashInput {
  urutan: number;
  aksi: AksiAudit;
  entitas: string;
  entitasId: string | null;
  aktorId: string | null;
  waktu: string;
  ringkasan: string;
  hashSebelumnya: string | null;
}

function computeHash(input: HashInput): string {
  const payload = [
    input.urutan,
    input.aksi,
    input.entitas,
    input.entitasId ?? '',
    input.aktorId ?? '',
    input.waktu,
    input.ringkasan,
    input.hashSebelumnya ?? '',
  ].join('|');
  return sha256Hex(payload);
}

function toCatatanAudit(entity: AuditEntity): CatatanAudit {
  return {
    id: entity.id,
    urutan: entity.urutan,
    aksi: entity.aksi,
    entitas: entity.entitas,
    entitasId: entity.entitasId,
    aktorId: entity.aktorId,
    aktorNama: entity.aktorNama,
    ringkasan: entity.ringkasan,
    waktu: entity.waktu,
    hashSebelumnya: entity.hashSebelumnya,
    hash: entity.hash,
  };
}
