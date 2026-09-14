import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { UnitDenganStatus } from '@p2h/shared';

import { fetchUnits } from '../models/api-client';

const REFRESH_INTERVAL_MS = 10_000;

export function useUnits(): UseQueryResult<UnitDenganStatus[], Error> {
  return useQuery({
    queryKey: ['units'],
    queryFn: fetchUnits,
    refetchOnWindowFocus: true,
    refetchInterval: REFRESH_INTERVAL_MS,
  });
}
