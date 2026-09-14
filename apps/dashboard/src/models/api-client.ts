import {
  API_ROUTES,
  type AdminResetResponse,
  type InspectionFilters,
  type InspectionView,
  type OverviewResponse,
  type SafetyTalkFilters,
  type SafetyTalkView,
  type UnitDenganStatus,
} from '@p2h/shared';

import { API_BASE_URL } from './config';

/**
 * This module is the only place in the dashboard that calls `fetch`. Every
 * other layer (controllers, views) goes through the typed functions below.
 */

async function getJson<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`);
  } catch (cause) {
    throw new Error(`Tidak dapat terhubung ke API (${API_BASE_URL}).`, { cause });
  }

  if (!response.ok) {
    throw new Error(`API mengembalikan status ${response.status} untuk ${path}`);
  }

  return (await response.json()) as T;
}

async function postJson<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { method: 'POST' });
  } catch (cause) {
    throw new Error(`Tidak dapat terhubung ke API (${API_BASE_URL}).`, { cause });
  }

  if (!response.ok) {
    throw new Error(`API mengembalikan status ${response.status} untuk ${path}`);
  }

  return (await response.json()) as T;
}

function buildQuery(params: Record<string, string | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }
  const query = searchParams.toString();
  return query ? `?${query}` : '';
}

export function fetchOverview(): Promise<OverviewResponse> {
  return getJson<OverviewResponse>(API_ROUTES.overview);
}

export function fetchInspections(filters: InspectionFilters): Promise<InspectionView[]> {
  const query = buildQuery({
    tanggal: filters.tanggal,
    unitType: filters.unitType,
    shift: filters.shift,
    statusKelayakan: filters.statusKelayakan,
  });
  return getJson<InspectionView[]>(`${API_ROUTES.inspections}${query}`);
}

export function fetchInspection(id: string): Promise<InspectionView> {
  return getJson<InspectionView>(`${API_ROUTES.inspections}/${id}`);
}

export function fetchSafetyTalks(filters: SafetyTalkFilters): Promise<SafetyTalkView[]> {
  const query = buildQuery({ tanggal: filters.tanggal });
  return getJson<SafetyTalkView[]>(`${API_ROUTES.safetyTalks}${query}`);
}

export function fetchSafetyTalk(id: string): Promise<SafetyTalkView> {
  return getJson<SafetyTalkView>(`${API_ROUTES.safetyTalks}/${id}`);
}

export function fetchUnits(): Promise<UnitDenganStatus[]> {
  return getJson<UnitDenganStatus[]>(API_ROUTES.units);
}

export function postAdminReset(): Promise<AdminResetResponse> {
  return postJson<AdminResetResponse>(API_ROUTES.adminReset);
}

/** Turns a relative photo path (as stored by the API) into an absolute URL. */
export function photoUrlFor(path: string | null): string | null {
  if (!path) {
    return null;
  }
  return `${API_BASE_URL}${path}`;
}

/** Builds a Google Maps link for a coordinate pair, or null when unavailable. */
export function mapsUrlFor(latitude: number | null, longitude: number | null): string | null {
  if (latitude === null || longitude === null) {
    return null;
  }
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
}
