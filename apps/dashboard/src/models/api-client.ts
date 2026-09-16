import {
  API_ROUTES,
  inspeksiKeputusan,
  inspeksiRekomendasi,
  type AdminResetResponse,
  type AksiAudit,
  type CatatanAudit,
  type HasilPenghapusanPdp,
  type InspectionFilters,
  type InspectionView,
  type KebijakanRetensi,
  type KirimKeputusanDto,
  type KirimRekomendasiDto,
  type OverviewResponse,
  type PermintaanPdpDto,
  type Peran,
  type RingkasanDataPribadi,
  type SafetyTalkFilters,
  type SafetyTalkView,
  type SesiResponse,
  type UnitDenganStatus,
  type VerifikasiRantaiAudit,
} from '@p2h/shared';

import { API_BASE_URL } from './config';

/**
 * This module is the only place in the dashboard that calls `fetch`. Every
 * other layer (controllers, views) goes through the typed functions below.
 */

/**
 * The role(s) currently being simulated, set by `useSesi`'s `setPeranSimulasi`.
 * Sent as `X-Demo-Peran` on every request; the API only honours it while
 * `authAktif` is false (demo mode). Module-level so every request — issued
 * from every controller — carries the same simulated role without threading
 * it through every call site.
 */
let peranSimulasiAktif: readonly Peran[] = [];

/** Sets the role(s) simulated via the `X-Demo-Peran` request header. */
export function setPeranSimulasi(peran: readonly Peran[]): void {
  peranSimulasiAktif = peran;
}

interface RequestOptions {
  method?: 'GET' | 'POST';
  body?: unknown;
}

function buildHeaders(hasBody: boolean): HeadersInit {
  const headers: Record<string, string> = {};
  if (hasBody) {
    headers['Content-Type'] = 'application/json';
  }
  if (peranSimulasiAktif.length > 0) {
    headers['X-Demo-Peran'] = peranSimulasiAktif.join(',');
  }
  return headers;
}

/** Reads `{ message }` from a JSON error body, when present, for a user-facing Indonesian message. */
async function extractErrorMessage(response: Response, path: string): Promise<string> {
  try {
    const data: unknown = await response.json();
    if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
      return data.message;
    }
  } catch {
    // Body wasn't JSON (or was empty) — fall back to a generic message below.
  }
  return `API mengembalikan status ${response.status} untuk ${path}`;
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: options.method ?? 'GET',
      headers: buildHeaders(options.body !== undefined),
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    });
  } catch (cause) {
    throw new Error(`Tidak dapat terhubung ke API (${API_BASE_URL}).`, { cause });
  }

  if (!response.ok) {
    throw new Error(await extractErrorMessage(response, path));
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
  return request<OverviewResponse>(API_ROUTES.overview);
}

export function fetchInspections(filters: InspectionFilters): Promise<InspectionView[]> {
  const query = buildQuery({
    tanggal: filters.tanggal,
    unitType: filters.unitType,
    shift: filters.shift,
    statusKelayakan: filters.statusKelayakan,
    statusTindakLanjut: filters.statusTindakLanjut,
  });
  return request<InspectionView[]>(`${API_ROUTES.inspections}${query}`);
}

export function fetchInspection(id: string): Promise<InspectionView> {
  return request<InspectionView>(`${API_ROUTES.inspections}/${id}`);
}

export function postRekomendasi(id: string, dto: KirimRekomendasiDto): Promise<InspectionView> {
  return request<InspectionView>(inspeksiRekomendasi(id), { method: 'POST', body: dto });
}

export function postKeputusan(id: string, dto: KirimKeputusanDto): Promise<InspectionView> {
  return request<InspectionView>(inspeksiKeputusan(id), { method: 'POST', body: dto });
}

export function fetchSafetyTalks(filters: SafetyTalkFilters): Promise<SafetyTalkView[]> {
  const query = buildQuery({ tanggal: filters.tanggal });
  return request<SafetyTalkView[]>(`${API_ROUTES.safetyTalks}${query}`);
}

export function fetchSafetyTalk(id: string): Promise<SafetyTalkView> {
  return request<SafetyTalkView>(`${API_ROUTES.safetyTalks}/${id}`);
}

export function fetchUnits(): Promise<UnitDenganStatus[]> {
  return request<UnitDenganStatus[]>(API_ROUTES.units);
}

export function postAdminReset(): Promise<AdminResetResponse> {
  return request<AdminResetResponse>(API_ROUTES.adminReset, { method: 'POST' });
}

export function fetchSesi(): Promise<SesiResponse> {
  return request<SesiResponse>(API_ROUTES.sesi);
}

export interface AuditQuery {
  entitasId?: string;
  aksi?: AksiAudit;
  batas?: number;
}

export function fetchAudit(filters: AuditQuery): Promise<CatatanAudit[]> {
  const query = buildQuery({
    entitasId: filters.entitasId,
    aksi: filters.aksi,
    batas: filters.batas !== undefined ? String(filters.batas) : undefined,
  });
  return request<CatatanAudit[]>(`${API_ROUTES.audit}${query}`);
}

export function fetchVerifikasiAudit(): Promise<VerifikasiRantaiAudit> {
  return request<VerifikasiRantaiAudit>(API_ROUTES.auditVerifikasi);
}

export function fetchKebijakanRetensi(): Promise<KebijakanRetensi> {
  return request<KebijakanRetensi>(API_ROUTES.kebijakanRetensi);
}

export function postPermintaanPdp(dto: PermintaanPdpDto): Promise<RingkasanDataPribadi | HasilPenghapusanPdp> {
  return request<RingkasanDataPribadi | HasilPenghapusanPdp>(API_ROUTES.pdp, { method: 'POST', body: dto });
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
