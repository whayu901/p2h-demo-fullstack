import { useMemo, useState } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import {
  hitungPesertaHadir,
  type InspectionView,
  type IntegritasRecord,
  type SafetyTalkView,
  type StatusKelayakan,
} from '@p2h/shared';

import { fetchInspections, fetchSafetyTalks } from '../models/api-client';
import {
  assignRouteColorIndex,
  buildUnitOptions,
  computeBounds,
  groupInspectionsByUnit,
  hasLocation,
  isWithinDateRange,
  unitLabelFor,
  type GeoBounds,
  type GeoUnitOption,
} from './geo-helpers';

const REFRESH_INTERVAL_MS = 10_000;

/** Must match the number of colors in `theme.ts`'s `palette.routePalette.colors`. */
export const ROUTE_PALETTE_SIZE = 8;

export type TampilkanFilter = 'SEMUA' | 'P2H' | 'P5M';

/** Draft (not-yet-applied) shape of the Peta page's filter bar. */
export interface GeoMapFilterDraft {
  tanggalDari: string;
  tanggalSampai: string;
  unitId: string;
  tampilkan: TampilkanFilter;
}

const EMPTY_DRAFT: GeoMapFilterDraft = {
  tanggalDari: '',
  tanggalSampai: '',
  unitId: '',
  tampilkan: 'SEMUA',
};

export interface P2HGeoPoint {
  id: string;
  position: [number, number];
  unitId: string;
  unitLabel: string;
  tanggal: string;
  namaOperator: string;
  statusKelayakan: StatusKelayakan;
  jumlahTemuan: number;
  /** 1-based position of this point within its unit's route, in time order. */
  sequence: number;
  totalInUnit: number;
  integritas: IntegritasRecord | null;
}

export interface P5MGeoPoint {
  id: string;
  position: [number, number];
  topik: string;
  tanggal: string;
  jamMulai: string;
  namaPemimpin: string;
  jumlahHadir: number;
  jumlahPeserta: number;
  integritas: IntegritasRecord | null;
}

export interface GeoRoute {
  unitId: string;
  unitLabel: string;
  colorIndex: number;
  positions: [number, number][];
  pointCount: number;
  latestStatus: StatusKelayakan;
}

export interface GeoCounts {
  p2h: number;
  p5m: number;
  tanpaLokasi: number;
}

export interface GeoMapController {
  draft: GeoMapFilterDraft;
  setTanggalDari: (value: string) => void;
  setTanggalSampai: (value: string) => void;
  setUnitId: (value: string) => void;
  setTampilkan: (value: TampilkanFilter) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  unitOptions: GeoUnitOption[];
  p2hPoints: P2HGeoPoint[];
  p5mPoints: P5MGeoPoint[];
  routes: GeoRoute[];
  counts: GeoCounts;
  selectedUnitId: string | null;
  toggleSelectedUnit: (unitId: string) => void;
  bounds: GeoBounds | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Owns the "Peta" page. Fetches the full P2H and P5M lists (no server-side
 * filters — the API returns everything), then derives everything the view
 * needs: date/unit/kind filtering, points with and without location,
 * per-unit routes with deterministic colors, and the bounds to fit the map
 * to. All grouping/sorting/route-building lives here, never in the views.
 */
export function useGeoMap(): GeoMapController {
  const [draft, setDraft] = useState<GeoMapFilterDraft>(EMPTY_DRAFT);
  const [applied, setApplied] = useState<GeoMapFilterDraft>(EMPTY_DRAFT);
  const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

  const inspectionsQuery: UseQueryResult<InspectionView[], Error> = useQuery({
    queryKey: ['inspections', {}],
    queryFn: () => fetchInspections({}),
    refetchOnWindowFocus: true,
    refetchInterval: REFRESH_INTERVAL_MS,
  });

  const safetyTalksQuery: UseQueryResult<SafetyTalkView[], Error> = useQuery({
    queryKey: ['safety-talks', null],
    queryFn: () => fetchSafetyTalks({}),
    refetchOnWindowFocus: true,
    refetchInterval: REFRESH_INTERVAL_MS,
  });

  const inspections = useMemo(() => inspectionsQuery.data ?? [], [inspectionsQuery.data]);
  const safetyTalks = useMemo(() => safetyTalksQuery.data ?? [], [safetyTalksQuery.data]);

  const unitOptions = useMemo(() => buildUnitOptions(inspections), [inspections]);
  const colorIndexByUnit = useMemo(
    () => assignRouteColorIndex(unitOptions, ROUTE_PALETTE_SIZE),
    [unitOptions],
  );

  const filteredInspections = useMemo(
    () =>
      applied.tampilkan === 'P5M'
        ? []
        : inspections.filter(
            (inspection) =>
              isWithinDateRange(inspection.tanggal, applied.tanggalDari, applied.tanggalSampai) &&
              (applied.unitId === '' || inspection.unit.id === applied.unitId),
          ),
    [inspections, applied],
  );

  const filteredSafetyTalks = useMemo(
    () =>
      applied.tampilkan === 'P2H'
        ? []
        : safetyTalks.filter((talk) => isWithinDateRange(talk.tanggal, applied.tanggalDari, applied.tanggalSampai)),
    [safetyTalks, applied],
  );

  const locatedInspections = useMemo(() => filteredInspections.filter(hasLocation), [filteredInspections]);
  const locatedSafetyTalks = useMemo(() => filteredSafetyTalks.filter(hasLocation), [filteredSafetyTalks]);

  const routeGroups = useMemo(() => groupInspectionsByUnit(locatedInspections), [locatedInspections]);

  const p2hPoints: P2HGeoPoint[] = useMemo(
    () =>
      routeGroups.flatMap((group) =>
        group.inspections.map((inspection, index) => ({
          id: inspection.id,
          position: [inspection.latitude, inspection.longitude],
          unitId: group.unitId,
          unitLabel: group.unitLabel,
          tanggal: inspection.tanggal,
          namaOperator: inspection.namaOperator,
          statusKelayakan: inspection.statusKelayakan,
          jumlahTemuan: inspection.jumlahTemuan,
          sequence: index + 1,
          totalInUnit: group.inspections.length,
          integritas: inspection.integritas,
        })),
      ),
    [routeGroups],
  );

  const routes: GeoRoute[] = useMemo(
    () =>
      routeGroups.map((group) => ({
        unitId: group.unitId,
        unitLabel: group.unitLabel,
        colorIndex: colorIndexByUnit.get(group.unitId) ?? 0,
        positions: group.inspections.map((inspection): [number, number] => [inspection.latitude, inspection.longitude]),
        pointCount: group.inspections.length,
        latestStatus: group.inspections[group.inspections.length - 1].statusKelayakan,
      })),
    [routeGroups, colorIndexByUnit],
  );

  const p5mPoints: P5MGeoPoint[] = useMemo(
    () =>
      locatedSafetyTalks.map((talk) => ({
        id: talk.id,
        position: [talk.latitude, talk.longitude],
        topik: talk.topik,
        tanggal: talk.tanggal,
        jamMulai: talk.jamMulai,
        namaPemimpin: talk.namaPemimpin,
        jumlahHadir: hitungPesertaHadir(talk.peserta),
        jumlahPeserta: talk.peserta.length,
        integritas: talk.integritas,
      })),
    [locatedSafetyTalks],
  );

  const counts: GeoCounts = useMemo(
    () => ({
      p2h: p2hPoints.length,
      p5m: p5mPoints.length,
      tanpaLokasi:
        (filteredInspections.length - locatedInspections.length) +
        (filteredSafetyTalks.length - locatedSafetyTalks.length),
    }),
    [p2hPoints, p5mPoints, filteredInspections, locatedInspections, filteredSafetyTalks, locatedSafetyTalks],
  );

  const bounds = useMemo(() => {
    const selectedRoute = selectedUnitId ? routes.find((route) => route.unitId === selectedUnitId) : undefined;
    const visiblePositions: [number, number][] = selectedRoute
      ? selectedRoute.positions
      : [...p2hPoints.map((point) => point.position), ...p5mPoints.map((point) => point.position)];
    return computeBounds(visiblePositions);
  }, [selectedUnitId, routes, p2hPoints, p5mPoints]);

  return {
    draft,
    setTanggalDari: (value) => setDraft((prev) => ({ ...prev, tanggalDari: value })),
    setTanggalSampai: (value) => setDraft((prev) => ({ ...prev, tanggalSampai: value })),
    setUnitId: (value) => setDraft((prev) => ({ ...prev, unitId: value })),
    setTampilkan: (value) => setDraft((prev) => ({ ...prev, tampilkan: value })),
    applyFilters: () => setApplied(draft),
    resetFilters: () => {
      setDraft(EMPTY_DRAFT);
      setApplied(EMPTY_DRAFT);
      setSelectedUnitId(null);
    },
    unitOptions,
    p2hPoints,
    p5mPoints,
    routes,
    counts,
    selectedUnitId,
    toggleSelectedUnit: (unitId) => setSelectedUnitId((prev) => (prev === unitId ? null : unitId)),
    bounds,
    isLoading: inspectionsQuery.isLoading || safetyTalksQuery.isLoading,
    isError: inspectionsQuery.isError || safetyTalksQuery.isError,
    error: inspectionsQuery.error ?? safetyTalksQuery.error ?? null,
  };
}

// Re-exported so views only need to import from this controller module.
export type { GeoBounds, GeoUnitOption } from './geo-helpers';
export { unitLabelFor };
