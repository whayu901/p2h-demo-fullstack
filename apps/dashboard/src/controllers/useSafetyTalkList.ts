import { useState } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { SafetyTalkView } from '@p2h/shared';

import { fetchSafetyTalks } from '../models/api-client';

const REFRESH_INTERVAL_MS = 10_000;

export interface SafetyTalkListController {
  /** Value currently shown in the filter bar, not yet applied to the query. */
  draftTanggal: string;
  setDraftTanggal: (value: string) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  safetyTalks: SafetyTalkView[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
}

/**
 * Owns the P5M list report's filter bar. The table only refetches once
 * `applyFilters` ("Go") is called.
 */
export function useSafetyTalkList(): SafetyTalkListController {
  const [draftTanggal, setDraftTanggal] = useState('');
  const [appliedTanggal, setAppliedTanggal] = useState('');

  const query: UseQueryResult<SafetyTalkView[], Error> = useQuery({
    queryKey: ['safety-talks', appliedTanggal || null],
    queryFn: () => fetchSafetyTalks({ tanggal: appliedTanggal || undefined }),
    refetchOnWindowFocus: true,
    refetchInterval: REFRESH_INTERVAL_MS,
  });

  return {
    draftTanggal,
    setDraftTanggal,
    applyFilters: () => setAppliedTanggal(draftTanggal),
    resetFilters: () => {
      setDraftTanggal('');
      setAppliedTanggal('');
    },
    safetyTalks: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  };
}
