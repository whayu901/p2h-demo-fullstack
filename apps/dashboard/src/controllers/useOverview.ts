import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { OverviewResponse } from '@p2h/shared';

import { fetchOverview } from '../models/api-client';

const REFRESH_INTERVAL_MS = 10_000;

export function useOverview(): UseQueryResult<OverviewResponse, Error> {
  return useQuery({
    queryKey: ['overview'],
    queryFn: fetchOverview,
    refetchOnWindowFocus: true,
    refetchInterval: REFRESH_INTERVAL_MS,
  });
}
