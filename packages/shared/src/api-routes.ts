import type { Shift, StatusKelayakan, UnitType } from './enums';

/** Central registry of API route paths, shared by the API, dashboard, and mobile app. */
export const API_ROUTES = {
  health: '/health',
  syncBatch: '/sync/batch',
  units: '/units',
  inspections: '/inspections',
  safetyTalks: '/safety-talks',
  overview: '/overview',
  adminReset: '/admin/reset',
} as const;

/** Query filters accepted by list endpoints such as GET /inspections. */
export interface InspectionFilters {
  /** Format: YYYY-MM-DD. */
  tanggal?: string;
  unitType?: UnitType;
  shift?: Shift;
  statusKelayakan?: StatusKelayakan;
}

/** Query filters accepted by list endpoints such as GET /safety-talks. */
export interface SafetyTalkFilters {
  /** Format: YYYY-MM-DD. */
  tanggal?: string;
}
