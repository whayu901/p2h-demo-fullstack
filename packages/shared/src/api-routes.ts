import type { Shift, StatusKelayakan, UnitType } from './enums';
import type { StatusTindakLanjut } from './tindak-lanjut';

/** Central registry of API route paths, shared by the API, dashboard, and mobile app. */
export const API_ROUTES = {
  health: '/health',
  syncBatch: '/sync/batch',
  units: '/units',
  inspections: '/inspections',
  safetyTalks: '/safety-talks',
  overview: '/overview',
  adminReset: '/admin/reset',
  sesi: '/auth/sesi',
  audit: '/audit',
  auditVerifikasi: '/audit/verifikasi',
  pdp: '/pdp',
  kebijakanRetensi: '/pdp/retensi',
} as const;

/**
 * Follow-up endpoints for a specific inspection are not registered in
 * API_ROUTES (they're parameterised): POST /inspections/:id/rekomendasi and
 * POST /inspections/:id/keputusan. Use the helpers below to build the path.
 */
export function inspeksiRekomendasi(id: string): string {
  return `${API_ROUTES.inspections}/${id}/rekomendasi`;
}

export function inspeksiKeputusan(id: string): string {
  return `${API_ROUTES.inspections}/${id}/keputusan`;
}

/** Query filters accepted by list endpoints such as GET /inspections. */
export interface InspectionFilters {
  /** Format: YYYY-MM-DD. */
  tanggal?: string;
  unitType?: UnitType;
  shift?: Shift;
  statusKelayakan?: StatusKelayakan;
  statusTindakLanjut?: StatusTindakLanjut;
}

/** Query filters accepted by list endpoints such as GET /safety-talks. */
export interface SafetyTalkFilters {
  /** Format: YYYY-MM-DD. */
  tanggal?: string;
}
