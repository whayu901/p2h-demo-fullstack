import { useQuery } from '@tanstack/react-query';
import {
  P2H_SECTIONS,
  P2H_SECTION_LABELS,
  hitungStatusKelayakan,
  type HasilItemP2H,
  type HasilKelayakan,
  type InspectionView,
  type P2HSection,
} from '@p2h/shared';

import { fetchInspection, fetchInspections, mapsUrlFor, photoUrlFor } from '../models/api-client';
import { groupInspectionsByUnit, hasLocation } from './geo-helpers';

/** A checklist item annotated with why it counts toward the verdict (or not). */
export interface HasilItemWithSeverity {
  item: HasilItemP2H;
  /** Set from `hitungStatusKelayakan`'s itemStop/itemPerhatian groups — never recomputed here. */
  severity: 'stop' | 'perhatian' | null;
}

export interface InspectionSectionGroup {
  section: P2HSection;
  label: string;
  items: HasilItemWithSeverity[];
  jumlahTemuan: number;
}

export interface InspectionDetailController {
  inspection: InspectionView | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  photoUrl: string | null;
  mapsUrl: string | null;
  /** The one and only verdict computation, from @p2h/shared. */
  verdict: HasilKelayakan | null;
  sections: InspectionSectionGroup[];
  /**
   * This unit's other located P2H points, ordered by `dibuatPada`, for the
   * mini map's faint route. Empty when this inspection has no coordinates or
   * no other located inspection exists for the same unit.
   */
  unitRoute: [number, number][];
}

/**
 * Loads one P2H inspection and derives everything the object page needs:
 * the absolute photo URL, the Google Maps link, the operational verdict
 * (via the shared `hitungStatusKelayakan`, never reimplemented here), and
 * the checklist items grouped by section with their severity looked up
 * from that same verdict.
 */
export function useInspectionDetail(id: string | undefined): InspectionDetailController {
  const query = useQuery({
    queryKey: ['inspection', id],
    queryFn: () => fetchInspection(id ?? ''),
    enabled: id !== undefined,
  });
  const inspection = query.data;

  // Reuses the same "all inspections" query/key and the same grouping helper
  // as the Peta map (`useGeoMap`), so the mini map's route is built exactly
  // the same way everywhere — never reimplemented here.
  const allInspectionsQuery = useQuery({
    queryKey: ['inspections', {}],
    queryFn: () => fetchInspections({}),
    enabled: inspection !== undefined && hasLocation(inspection),
  });

  const unitRoute: [number, number][] = (() => {
    if (!inspection || !hasLocation(inspection)) {
      return [];
    }
    const located = (allInspectionsQuery.data ?? []).filter(hasLocation);
    const group = groupInspectionsByUnit(located).find((candidate) => candidate.unitId === inspection.unit.id);
    return group ? group.inspections.map((item): [number, number] => [item.latitude, item.longitude]) : [];
  })();

  const verdict = inspection ? hitungStatusKelayakan(inspection.items) : null;
  const stopKeys = new Set((verdict?.itemStop ?? []).map((item) => item.key));
  const perhatianKeys = new Set((verdict?.itemPerhatian ?? []).map((item) => item.key));

  const sections: InspectionSectionGroup[] = inspection
    ? P2H_SECTIONS.map((section) => {
        const items = inspection.items.filter((item) => item.section === section);
        return {
          section,
          label: P2H_SECTION_LABELS[section],
          items: items.map((item) => ({
            item,
            severity: stopKeys.has(item.key) ? ('stop' as const) : perhatianKeys.has(item.key) ? ('perhatian' as const) : null,
          })),
          jumlahTemuan: items.filter((item) => item.hasil === 'TIDAK_NORMAL').length,
        };
      })
    : [];

  return {
    inspection,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    photoUrl: inspection ? photoUrlFor(inspection.fotoUrl) : null,
    mapsUrl: inspection ? mapsUrlFor(inspection.latitude, inspection.longitude) : null,
    verdict,
    sections,
    unitRoute,
  };
}
