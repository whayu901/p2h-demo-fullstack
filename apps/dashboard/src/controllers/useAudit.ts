import { useState } from 'react';
import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import type { AksiAudit, CatatanAudit, VerifikasiRantaiAudit } from '@p2h/shared';

import { fetchAudit, fetchVerifikasiAudit } from '../models/api-client';

import { useSesi } from './useSesi';

export interface AuditController {
  aksiFilter: AksiAudit | '';
  setAksiFilter: (value: AksiAudit | '') => void;
  catatan: CatatanAudit[];
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  verifikasi: VerifikasiRantaiAudit | undefined;
  isVerifying: boolean;
  verifikasiError: Error | null;
  verifikasiRantai: () => void;
}

/**
 * Owns the "Audit" tab of the Kepatuhan page: the append-only audit trail
 * (optionally filtered by action) and an on-demand hash-chain verification.
 */
export function useAudit(): AuditController {
  // The active role is part of the key: switching roles must refetch, because
  // the API answers these endpoints differently per role (403 vs data).
  const { peranAktif } = useSesi();
  const [aksiFilter, setAksiFilter] = useState<AksiAudit | ''>('');

  const query: UseQueryResult<CatatanAudit[], Error> = useQuery({
    queryKey: ['audit', peranAktif.join(','), aksiFilter || null],
    queryFn: () => fetchAudit(aksiFilter ? { aksi: aksiFilter } : {}),
  });

  const verifikasiQuery: UseQueryResult<VerifikasiRantaiAudit, Error> = useQuery({
    queryKey: ['audit-verifikasi', peranAktif.join(',')],
    queryFn: fetchVerifikasiAudit,
    enabled: false,
  });

  return {
    aksiFilter,
    setAksiFilter,
    catatan: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    verifikasi: verifikasiQuery.data,
    isVerifying: verifikasiQuery.isFetching,
    verifikasiError: verifikasiQuery.error,
    verifikasiRantai: () => void verifikasiQuery.refetch(),
  };
}
