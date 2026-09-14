import type { InspectionView } from '@p2h/shared';

/** An inspection or safety talk narrowed to the case where coordinates are present. */
export type WithLocation<T extends { latitude: number | null; longitude: number | null }> = T & {
  latitude: number;
  longitude: number;
};

/** An inspection narrowed to the case where coordinates are present. */
export type LocatedInspection = WithLocation<InspectionView>;

/** Option shown in the "Unit" filter select: one entry per unit present in the P2H data. */
export interface GeoUnitOption {
  id: string;
  code: string;
  name: string;
}

/** A route built from one unit's located P2H inspections, ordered by `dibuatPada`. */
export interface UnitRouteGroup {
  unitId: string;
  unitLabel: string;
  inspections: LocatedInspection[];
}

/**
 * Type guard narrowing a record with nullable coordinates to one where both
 * `latitude` and `longitude` are present numbers.
 */
export function hasLocation<T extends { latitude: number | null; longitude: number | null }>(
  record: T,
): record is WithLocation<T> {
  return record.latitude !== null && record.longitude !== null;
}

/**
 * True when `tanggal` (a plain YYYY-MM-DD string) falls within [from, to]
 * inclusive. An empty bound means unbounded on that side ("semua").
 */
export function isWithinDateRange(tanggal: string, from: string, to: string): boolean {
  if (from && tanggal < from) {
    return false;
  }
  if (to && tanggal > to) {
    return false;
  }
  return true;
}

/** Builds the "Unit" filter options from the units present among inspections, sorted by code. */
export function buildUnitOptions(inspections: readonly InspectionView[]): GeoUnitOption[] {
  const byId = new Map<string, GeoUnitOption>();
  for (const inspection of inspections) {
    if (!byId.has(inspection.unit.id)) {
      byId.set(inspection.unit.id, {
        id: inspection.unit.id,
        code: inspection.unit.code,
        name: inspection.unit.name,
      });
    }
  }
  return Array.from(byId.values()).sort((a, b) => a.code.localeCompare(b.code));
}

/** Builds the readable "code — name" label used for units on the map/legend. */
export function unitLabelFor(unit: { code: string; name: string }): string {
  return `${unit.code} — ${unit.name}`;
}

/**
 * Groups located P2H inspections by unit, each group's inspections sorted by
 * `dibuatPada` ascending (oldest first) — the order the unit actually moved
 * through its checkpoints.
 */
export function groupInspectionsByUnit(inspections: readonly LocatedInspection[]): UnitRouteGroup[] {
  const groups = new Map<string, LocatedInspection[]>();
  for (const inspection of inspections) {
    const existing = groups.get(inspection.unit.id);
    if (existing) {
      existing.push(inspection);
    } else {
      groups.set(inspection.unit.id, [inspection]);
    }
  }

  const result: UnitRouteGroup[] = [];
  for (const [unitId, group] of groups) {
    const sorted = [...group].sort((a, b) => a.dibuatPada.localeCompare(b.dibuatPada));
    result.push({ unitId, unitLabel: unitLabelFor(sorted[0].unit), inspections: sorted });
  }
  return result.sort((a, b) => a.unitLabel.localeCompare(b.unitLabel));
}

/**
 * Deterministically assigns a route palette index to each unit, ordered by
 * unit code so the same unit always gets the same color across reloads.
 */
export function assignRouteColorIndex(unitOptions: readonly GeoUnitOption[], paletteSize: number): Map<string, number> {
  const map = new Map<string, number>();
  unitOptions.forEach((unit, index) => {
    map.set(unit.id, index % paletteSize);
  });
  return map;
}

/** A Leaflet-friendly bounding box: [southWest, northEast]. */
export type GeoBounds = [[number, number], [number, number]];

/** Computes the bounding box for a set of [lat, lng] points, or null when empty. */
export function computeBounds(positions: readonly [number, number][]): GeoBounds | null {
  if (positions.length === 0) {
    return null;
  }

  let minLat = positions[0][0];
  let maxLat = positions[0][0];
  let minLng = positions[0][1];
  let maxLng = positions[0][1];

  for (const [lat, lng] of positions) {
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  }

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
}
