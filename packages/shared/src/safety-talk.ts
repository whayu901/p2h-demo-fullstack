import type { Shift } from './enums';
import type { IntegritasRecord } from './integritas';

/** One attendee of a P5M safety talk. */
export interface PesertaP5M {
  nama: string;
  nrp: string;
  hadir: boolean;
}

/** Preset topics offered when creating a P5M safety talk, in no particular priority. */
export const TOPIK_P5M_PRESET: readonly string[] = [
  'Bahaya Blind Spot Alat Berat',
  'Fatigue Management',
  'Penggunaan APD Lengkap',
  'Bekerja di Ketinggian',
  'Penanganan Tumpahan B3',
  'Jarak Aman Iring-iringan Unit',
  'Prosedur LOTO (Lock Out Tag Out)',
  'Bahaya Petir di Area Terbuka',
  'Kesiapsiagaan Tanggap Darurat',
  'Housekeeping Area Kerja',
];

/** The wire shape of a P5M safety talk sent from the mobile app to the API. */
export interface SafetyTalkDto {
  /** Client-generated UUID; used as the idempotency key for sync. */
  id: string;
  /** Local date, format YYYY-MM-DD. */
  tanggal: string;
  /** Local time, format HH:mm. */
  jamMulai: string;
  shift: Shift;
  lokasiArea: string;
  departemenRegu: string;
  namaPemimpin: string;
  nrpPemimpin: string;
  topik: string;
  uraianSingkat: string;
  potensiBahaya: string[];
  komitmenPengendalian: string[];
  informasiPengumuman: string;
  peserta: PesertaP5M[];
  fotoBase64: string | null;
  latitude: number | null;
  longitude: number | null;
  catatan: string;
  /** ISO 8601 timestamp. */
  dibuatPada: string;
  /** ISO 8601 timestamp reported by the device clock, for integrity checks. */
  waktuPerangkat?: string;
  /** True if the device's location provider was flagged as mocked (fake GPS). */
  lokasiMock?: boolean;
  akurasiLokasiMeter?: number | null;
}

/** The shape of a P5M safety talk as returned by the API to the dashboard. */
export interface SafetyTalkView extends Omit<SafetyTalkDto, 'fotoBase64'> {
  fotoUrl: string | null;
  jumlahHadir: number;
  /** ISO 8601 timestamp for when the API received/stored this record. */
  diterimaPada: string;
  /** Evidence integrity checks for this submission. Always supplied by the API. */
  integritas: IntegritasRecord | null;
}

/** Counts how many listed attendees were marked present. */
export function hitungPesertaHadir(peserta: readonly PesertaP5M[]): number {
  return peserta.filter((p) => p.hadir).length;
}
