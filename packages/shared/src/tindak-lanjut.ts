import type { StatusKelayakan } from './enums';
import type { TandaTanganElektronik } from './tanda-tangan';

/** The SMKP follow-up chain for a flagged P2H finding. */
export const STATUS_TINDAK_LANJUT = [
  'MENUNGGU_PENGAWAS',
  'MENUNGGU_MEKANIK',
  'DALAM_PERBAIKAN',
  'SELESAI',
  'TIDAK_DIPERLUKAN',
] as const;
export type StatusTindakLanjut = (typeof STATUS_TINDAK_LANJUT)[number];

/** Indonesian display labels for follow-up status. */
export const STATUS_TINDAK_LANJUT_LABELS: Record<StatusTindakLanjut, string> = {
  MENUNGGU_PENGAWAS: 'Menunggu Pengawas',
  MENUNGGU_MEKANIK: 'Menunggu Mekanik',
  DALAM_PERBAIKAN: 'Dalam Perbaikan',
  SELESAI: 'Selesai',
  TIDAK_DIPERLUKAN: 'Tidak Diperlukan',
};

/** The supervisor's verdict when reviewing a flagged unit. */
export const KEPUTUSAN_PENGAWAS = ['IZINKAN_OPERASI', 'IZINKAN_DENGAN_SYARAT', 'TAHAN_UNIT'] as const;
export type KeputusanPengawas = (typeof KEPUTUSAN_PENGAWAS)[number];

/** Indonesian display labels for supervisor verdicts. */
export const KEPUTUSAN_PENGAWAS_LABELS: Record<KeputusanPengawas, string> = {
  IZINKAN_OPERASI: 'Izinkan Operasi',
  IZINKAN_DENGAN_SYARAT: 'Izinkan dengan Syarat',
  TAHAN_UNIT: 'Tahan Unit',
};

/** Who did what and when, attached to a follow-up step. */
export interface CatatanAktor {
  penggunaId: string;
  nama: string;
  nrp: string;
  /** ISO 8601 timestamp. */
  pada: string;
}

/** A mechanic's recommendation on a flagged finding. */
export interface RekomendasiMekanik {
  catatan: string;
  sparePart: string | null;
  /** Format: YYYY-MM-DD. */
  estimasiSelesai: string | null;
  oleh: CatatanAktor;
}

/** A supervisor's recorded decision on a flagged finding. */
export interface KeputusanPengawasRecord {
  keputusan: KeputusanPengawas;
  catatan: string;
  syarat: string | null;
  oleh: CatatanAktor;
  tandaTangan: TandaTanganElektronik | null;
}

/** The full follow-up state attached to an inspection. */
export interface TindakLanjut {
  status: StatusTindakLanjut;
  rekomendasi: RekomendasiMekanik | null;
  keputusan: KeputusanPengawasRecord | null;
}

/** Payload for POST /inspections/:id/rekomendasi. */
export interface KirimRekomendasiDto {
  catatan: string;
  sparePart?: string | null;
  estimasiSelesai?: string | null;
}

/** Payload for POST /inspections/:id/keputusan. */
export interface KirimKeputusanDto {
  keputusan: KeputusanPengawas;
  catatan: string;
  syarat?: string | null;
}

/**
 * Default follow-up state derived from the P2H verdict:
 * STOP_OPERASI → MENUNGGU_PENGAWAS, OPERASI_DENGAN_PERHATIAN → MENUNGGU_MEKANIK,
 * LAYAK_OPERASI → TIDAK_DIPERLUKAN.
 */
export function statusTindakLanjutAwal(status: StatusKelayakan): StatusTindakLanjut {
  switch (status) {
    case 'STOP_OPERASI':
      return 'MENUNGGU_PENGAWAS';
    case 'OPERASI_DENGAN_PERHATIAN':
      return 'MENUNGGU_MEKANIK';
    case 'LAYAK_OPERASI':
      return 'TIDAK_DIPERLUKAN';
  }
}
