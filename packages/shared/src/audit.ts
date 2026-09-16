/** Append-only audit trail types for SMKP compliance. */

/** Actions recorded in the audit trail. */
export const AKSI_AUDIT = [
  'SYNC_TERIMA',
  'INSPEKSI_DIBUAT',
  'INSPEKSI_DIPERBARUI',
  'REKOMENDASI_DITAMBAHKAN',
  'KEPUTUSAN_DITAMBAHKAN',
  'P5M_DITERIMA',
  'ADMIN_RESET',
  'DATA_DIEKSPOR',
  'DATA_DIHAPUS',
] as const;
export type AksiAudit = (typeof AKSI_AUDIT)[number];

/** Indonesian display labels for audit actions. */
export const AKSI_AUDIT_LABELS: Record<AksiAudit, string> = {
  SYNC_TERIMA: 'Sinkronisasi Diterima',
  INSPEKSI_DIBUAT: 'Inspeksi Dibuat',
  INSPEKSI_DIPERBARUI: 'Inspeksi Diperbarui',
  REKOMENDASI_DITAMBAHKAN: 'Rekomendasi Ditambahkan',
  KEPUTUSAN_DITAMBAHKAN: 'Keputusan Ditambahkan',
  P5M_DITERIMA: 'P5M Diterima',
  ADMIN_RESET: 'Reset Admin',
  DATA_DIEKSPOR: 'Data Diekspor',
  DATA_DIHAPUS: 'Data Dihapus',
};

/** Append-only audit entry; `hash` chains to `hashSebelumnya` so tampering is detectable. */
export interface CatatanAudit {
  id: string;
  urutan: number;
  aksi: AksiAudit;
  entitas: 'INSPEKSI' | 'P5M' | 'SISTEM';
  entitasId: string | null;
  aktorId: string | null;
  aktorNama: string;
  ringkasan: string;
  /** ISO 8601 timestamp. */
  waktu: string;
  hashSebelumnya: string | null;
  hash: string;
}

/** Query filters accepted by GET /audit. */
export interface AuditFilters {
  entitasId?: string;
  aksi?: AksiAudit;
  batas?: number;
}

/** Result of verifying the audit hash chain end to end. */
export interface VerifikasiRantaiAudit {
  valid: boolean;
  jumlahDiperiksa: number;
  rusakPadaUrutan: number | null;
}
