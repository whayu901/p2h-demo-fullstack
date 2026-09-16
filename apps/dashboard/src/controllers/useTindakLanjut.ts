import { useMutation, useQueryClient, type UseMutationResult } from '@tanstack/react-query';
import type { InspectionView, KirimKeputusanDto, KirimRekomendasiDto } from '@p2h/shared';

import { postKeputusan, postRekomendasi } from '../models/api-client';

export interface TindakLanjutController {
  rekomendasi: UseMutationResult<InspectionView, Error, KirimRekomendasiDto>;
  keputusan: UseMutationResult<InspectionView, Error, KirimKeputusanDto>;
}

/**
 * Owns the P2H follow-up chain mutations for one inspection: a mechanic's
 * recommendation and a supervisor's decision. Both invalidate the inspection
 * detail, every inspection list, and the overview KPIs, so the whole
 * dashboard reflects the new follow-up state immediately.
 */
export function useTindakLanjut(id: string): TindakLanjutController {
  const queryClient = useQueryClient();

  function invalidateRelated(): void {
    void queryClient.invalidateQueries({ queryKey: ['inspection', id] });
    void queryClient.invalidateQueries({ queryKey: ['inspections'] });
    void queryClient.invalidateQueries({ queryKey: ['overview'] });
  }

  const rekomendasi = useMutation({
    mutationFn: (dto: KirimRekomendasiDto) => postRekomendasi(id, dto),
    onSuccess: invalidateRelated,
  });

  const keputusan = useMutation({
    mutationFn: (dto: KirimKeputusanDto) => postKeputusan(id, dto),
    onSuccess: invalidateRelated,
  });

  return { rekomendasi, keputusan };
}
