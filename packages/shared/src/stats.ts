import type { StatusKelayakan } from './enums';

/** Aggregate counters shown on the dashboard's overview page. */
export interface OverviewStats {
  p2hHariIni: number;
  p5mHariIni: number;
  /** Distinct units whose latest inspection today is STOP_OPERASI. */
  unitStopOperasi: number;
  /** TIDAK_NORMAL items across today's inspections; there is no closing workflow in the demo. */
  temuanTerbuka: number;
  /** Inspections (all time) whose tindak lanjut status is not SELESAI or TIDAK_DIPERLUKAN. */
  menungguTindakLanjut: number;
}

/** A single row in the dashboard's "recent activity" feed. */
export interface RecentSubmission {
  kind: 'P2H' | 'P5M';
  id: string;
  judul: string;
  petugas: string;
  tanggal: string;
  /** ISO 8601 timestamp. */
  dibuatPada: string;
  statusKelayakan: StatusKelayakan | null;
}

/** Response payload for the dashboard overview endpoint. */
export interface OverviewResponse {
  stats: OverviewStats;
  recent: RecentSubmission[];
}
