import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { AdminResetResponse } from '@p2h/shared';

import { postAdminReset } from '../models/api-client';

/**
 * Wipes and re-seeds the demo dataset on the server, then invalidates every
 * cached query so the whole dashboard reflects the fresh data.
 */
export function useAdminReset(): UseMutationResult<AdminResetResponse, Error, void> {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: postAdminReset,
    onSuccess: () => {
      void queryClient.invalidateQueries();
    },
  });
}
