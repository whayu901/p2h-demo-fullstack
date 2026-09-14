import { useMemo, useState } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { InspectionFilters, InspectionView, Shift, StatusKelayakan, UnitType } from '@p2h/shared';

import { fetchInspections } from '../models/api-client';

const REFRESH_INTERVAL_MS = 10_000;

/** Draft (not-yet-applied) shape of the P2H list report filter bar. */
export interface InspectionFilterDraft {
  tanggal: string;
  unitType: UnitType | '';
  shift: Shift | '';
  statusKelayakan: StatusKelayakan | '';
}

const EMPTY_DRAFT: InspectionFilterDraft = {
  tanggal: '',
  unitType: '',
  shift: '',
  statusKelayakan: '',
};

function toApiFilters(draft: InspectionFilterDraft): InspectionFilters {
  const filters: InspectionFilters = {};
  if (draft.tanggal) {
    filters.tanggal = draft.tanggal;
  }
  if (draft.unitType) {
    filters.unitType = draft.unitType;
  }
  if (draft.shift) {
    filters.shift = draft.shift;
  }
  if (draft.statusKelayakan) {
    filters.statusKelayakan = draft.statusKelayakan;
  }
  return filters;
}

export interface InspectionListController {
  /** Values currently shown in the filter bar inputs, not yet applied to the query. */
  draft: InspectionFilterDraft;
  setTanggal: (value: string) => void;
  setUnitType: (value: UnitType | '') => void;
  setShift: (value: Shift | '') => void;
  setStatusKelayakan: (value: StatusKelayakan | '') => void;
  /** Applies the draft filters, triggering a refetch ("Go"). */
  applyFilters: () => void;
  /** Clears both draft and applied filters ("Reset"). */
  resetFilters: () => void;
  inspections: InspectionView[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Owns the P2H list report's filter bar. The table only refetches once
 * `applyFilters` ("Go") is called, so typing into the date field or flipping
 * a select does not spam the API.
 */
export function useInspectionList(): InspectionListController {
  const [draft, setDraft] = useState<InspectionFilterDraft>(EMPTY_DRAFT);
  const [applied, setApplied] = useState<InspectionFilterDraft>(EMPTY_DRAFT);

  const apiFilters = useMemo(() => toApiFilters(applied), [applied]);

  const query: UseQueryResult<InspectionView[], Error> = useQuery({
    queryKey: ['inspections', apiFilters],
    queryFn: () => fetchInspections(apiFilters),
    refetchOnWindowFocus: true,
    refetchInterval: REFRESH_INTERVAL_MS,
  });

  return {
    draft,
    setTanggal: (tanggal) => setDraft((prev) => ({ ...prev, tanggal })),
    setUnitType: (unitType) => setDraft((prev) => ({ ...prev, unitType })),
    setShift: (shift) => setDraft((prev) => ({ ...prev, shift })),
    setStatusKelayakan: (statusKelayakan) => setDraft((prev) => ({ ...prev, statusKelayakan })),
    applyFilters: () => setApplied(draft),
    resetFilters: () => {
      setDraft(EMPTY_DRAFT);
      setApplied(EMPTY_DRAFT);
    },
    inspections: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
