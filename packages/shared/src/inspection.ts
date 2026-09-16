import type { HasilItemP2H } from './checklists';
import type { Shift, StatusKelayakan } from './enums';
import type { IntegritasRecord } from './integritas';
import type { TindakLanjut } from './tindak-lanjut';
import type { Unit } from './unit';

/** Statement the operator confirms before submitting a P2H inspection. */
export const PERNYATAAN_OPERATOR =
  'Saya menyatakan pemeriksaan ini saya lakukan sendiri dan hasilnya benar.';

/** Shown on the dashboard while a flagged inspection has not been followed up. */
export const PESAN_MENUNGGU_PENGAWAS = 'Menunggu tindak lanjut pengawas';

/** Current P2H checklist template version, bumped when the form template changes. */
export const VERSI_TEMPLATE_P2H = '2026.1';

/** The wire shape of a P2H inspection sent from the mobile app to the API. */
export interface InspectionDto {
  /** Client-generated UUID; used as the idempotency key for sync. */
  id: string;
  unitId: string;
  namaOperator: string;
  nrp: string;
  /** Local date as written on the paper form, format YYYY-MM-DD. */
  tanggal: string;
  shift: Shift;
  lokasiKerja: string;
  hmKmAwal: number;
  hmKmAkhir: number | null;
  items: HasilItemP2H[];
  pernyataanOperator: boolean;
  catatanOperator: string;
  /** Not filled in the demo; reserved for a future mechanic follow-up workflow. */
  rekomendasiMekanik: string | null;
  /** Not filled in the demo; reserved for a future supervisor decision workflow. */
  keputusanPengawas: string | null;
  fotoBase64: string | null;
  latitude: number | null;
  longitude: number | null;
  /** ISO 8601 timestamp, created on device; used for ordering. */
  dibuatPada: string;
  /** ISO 8601 timestamp reported by the device clock, for integrity checks. */
  waktuPerangkat?: string;
  /** True if the device's location provider was flagged as mocked (fake GPS). */
  lokasiMock?: boolean;
  akurasiLokasiMeter?: number | null;
  /** Checklist template version used to fill this form. */
  versiTemplate?: string;
}

/** The shape of a P2H inspection as returned by the API to the dashboard. */
export interface InspectionView extends Omit<InspectionDto, 'fotoBase64'> {
  fotoUrl: string | null;
  unit: Unit;
  statusKelayakan: StatusKelayakan;
  jumlahTemuan: number;
  /** ISO 8601 timestamp for when the API received/stored this record. */
  diterimaPada: string;
  /** SMKP follow-up state for this inspection's findings. Always supplied by the API. */
  tindakLanjut: TindakLanjut;
  /** Evidence integrity checks for this submission. Always supplied by the API. */
  integritas: IntegritasRecord | null;
}
