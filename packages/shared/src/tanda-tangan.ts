/**
 * Electronic signature placeholder for supervisor decisions.
 * Legal basis: UU ITE Pasal 11, PP 71/2019, Permenkomdigi 11/2022.
 */

/** DEMO_HASH is a hash-only stand-in used in this demo; TTE_TERSERTIFIKASI is issued by a registered PSrE (electronic certification authority). */
export const JENIS_TANDA_TANGAN = ['DEMO_HASH', 'TTE_TERSERTIFIKASI'] as const;
export type JenisTandaTangan = (typeof JENIS_TANDA_TANGAN)[number];

/** An electronic signature attached to a supervisor decision or other record. */
export interface TandaTanganElektronik {
  jenis: JenisTandaTangan;
  penandaTanganId: string;
  nama: string;
  nrp: string;
  /** ISO 8601 timestamp. */
  pada: string;
  /** SHA-256 of the signed payload. */
  hashDokumen: string;
  /** Filled only by a real PSrE integration. */
  sertifikatId: string | null;
  /** Filled only by a real PSrE integration. */
  penerbit: string | null;
}

/** Disclaimer shown next to demo signatures. */
export const CATATAN_TTE_DEMO =
  'Tanda tangan demo (hash dokumen). Produksi: TTE tersertifikasi melalui PSrE terdaftar.';
