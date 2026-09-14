import type { InspectionDto } from './inspection';
import type { SafetyTalkDto } from './safety-talk';

/** Batch of locally-pending records the mobile app pushes to the API. */
export interface SyncBatchRequest {
  inspections: InspectionDto[];
  safetyTalks: SafetyTalkDto[];
}

/** Per-collection outcome of a sync batch. */
export interface SyncBatchOutcome {
  received: number;
  created: number;
  updated: number;
}

/** API response after processing a sync batch. */
export interface SyncBatchResponse {
  inspections: SyncBatchOutcome;
  safetyTalks: SyncBatchOutcome;
  /** ISO 8601 timestamp. */
  syncedAt: string;
}

/** Simple liveness check response. */
export interface HealthResponse {
  status: 'ok';
  /** ISO 8601 timestamp. */
  time: string;
}

/** Response after wiping and re-seeding the demo dataset. */
export interface AdminResetResponse {
  ok: true;
  /** ISO 8601 timestamp. */
  resetAt: string;
  seeded: {
    units: number;
    inspections: number;
    safetyTalks: number;
  };
}
