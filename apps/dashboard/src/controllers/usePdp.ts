import { useState } from 'react';
import { useMutation, useQuery, type UseMutationResult, type UseQueryResult } from '@tanstack/react-query';
import type {
  HasilPenghapusanPdp,
  JenisPermintaanPdp,
  KebijakanRetensi,
  PermintaanPdpDto,
  RingkasanDataPribadi,
} from '@p2h/shared';

import { fetchKebijakanRetensi, postPermintaanPdp } from '../models/api-client';

/** Narrows the PDP request mutation result: PENGHAPUSAN returns this shape, AKSES returns `RingkasanDataPribadi`. */
export function isHasilPenghapusan(
  result: RingkasanDataPribadi | HasilPenghapusanPdp,
): result is HasilPenghapusanPdp {
  return 'inspeksiDianonimkan' in result;
}

import { useSesi } from './useSesi';

export interface PdpRequestDraft {
  nrp: string;
  jenis: JenisPermintaanPdp;
  alasan: string;
}

const EMPTY_DRAFT: PdpRequestDraft = { nrp: '', jenis: 'AKSES', alasan: '' };

export interface PdpController {
  kebijakan: KebijakanRetensi | undefined;
  isLoadingKebijakan: boolean;
  draft: PdpRequestDraft;
  setNrp: (value: string) => void;
  setJenis: (value: JenisPermintaanPdp) => void;
  setAlasan: (value: string) => void;
  /** True while the PENGHAPUSAN confirmation dialog is open. */
  confirmOpen: boolean;
  /** Submits directly for AKSES; opens the confirmation dialog first for PENGHAPUSAN. */
  requestSubmit: () => void;
  confirmSubmit: () => void;
  cancelConfirm: () => void;
  mutation: UseMutationResult<RingkasanDataPribadi | HasilPenghapusanPdp, Error, PermintaanPdpDto>;
}

/** Owns the "PDP" tab of the Kepatuhan page: retention policy display and the data-subject request form. */
export function usePdp(): PdpController {
  // See useAudit: the active role belongs in the key so a role switch refetches.
  const { peranAktif } = useSesi();
  const [draft, setDraft] = useState<PdpRequestDraft>(EMPTY_DRAFT);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const kebijakanQuery: UseQueryResult<KebijakanRetensi, Error> = useQuery({
    queryKey: ['kebijakan-retensi', peranAktif.join(',')],
    queryFn: fetchKebijakanRetensi,
  });

  const mutation = useMutation({
    mutationFn: postPermintaanPdp,
  });

  function submit(): void {
    mutation.mutate({ nrp: draft.nrp, jenis: draft.jenis, alasan: draft.alasan });
    setConfirmOpen(false);
  }

  function requestSubmit(): void {
    if (draft.jenis === 'PENGHAPUSAN') {
      setConfirmOpen(true);
      return;
    }
    submit();
  }

  return {
    kebijakan: kebijakanQuery.data,
    isLoadingKebijakan: kebijakanQuery.isLoading,
    draft,
    setNrp: (nrp) => setDraft((prev) => ({ ...prev, nrp })),
    setJenis: (jenis) => setDraft((prev) => ({ ...prev, jenis })),
    setAlasan: (alasan) => setDraft((prev) => ({ ...prev, alasan })),
    confirmOpen,
    requestSubmit,
    confirmSubmit: submit,
    cancelConfirm: () => setConfirmOpen(false),
    mutation,
  };
}
