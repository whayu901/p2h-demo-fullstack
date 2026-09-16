/** Personal data protection types per UU PDP 27/2022 and PP 33/2026 (berlaku 16 Jan 2027). */

/** Data subject rights supported for a personal data request. */
export const JENIS_PERMINTAAN_PDP = ['AKSES', 'PENGHAPUSAN'] as const;
export type JenisPermintaanPdp = (typeof JENIS_PERMINTAAN_PDP)[number];

/** Payload for a data subject request (access or erasure). */
export interface PermintaanPdpDto {
  jenis: JenisPermintaanPdp;
  nrp: string;
  alasan: string;
}

/** Summary of personal data held for a given NRP, shown before an access/erasure request is fulfilled. */
export interface RingkasanDataPribadi {
  nrp: string;
  jumlahInspeksi: number;
  jumlahP5M: number;
  rentangTanggal: { dari: string; sampai: string } | null;
}

/** Outcome of anonymising a person's records upon an erasure request. */
export interface HasilPenghapusanPdp {
  nrp: string;
  inspeksiDianonimkan: number;
  p5mDianonimkan: number;
  /** ISO 8601 timestamp. */
  pada: string;
}

/** Server-configured data retention policy. */
export interface KebijakanRetensi {
  hariRetensiServer: number;
  hariRetensiPerangkat: number;
  /** ISO 8601 timestamp, or null if the retention job has never run. */
  terakhirDijalankan: string | null;
  catatan: string;
}

/** Default server-side retention window, in days: 2 years, aligned with SMKP audit needs. */
export const RETENSI_SERVER_HARI_DEFAULT = 730;

/** PP 33/2026: a personal data breach must be reported within 3 x 24 hours. */
export const BATAS_LAPOR_KEBOCORAN_JAM = 72;
