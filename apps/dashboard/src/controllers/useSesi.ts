import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { PERAN, bolehMelakukan, type Aksi, type Peran, type PenggunaProfil } from '@p2h/shared';

import { fetchSesi, setPeranSimulasi as setPeranSimulasiHeader } from '../models/api-client';

const STORAGE_KEY = 'p2h-peran-simulasi';

function readStoredPeran(): Peran | null {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored !== null && (PERAN as readonly string[]).includes(stored) ? (stored as Peran) : null;
}

export interface SesiController {
  pengguna: PenggunaProfil | undefined;
  /** false → API is in demo mode (no real auth); the role picker is shown. */
  authAktif: boolean;
  /** Roles the API currently treats this session as having. */
  peranAktif: Peran[];
  /** Role picked via the demo role picker, or null when none picked yet. */
  peranSimulasi: Peran | null;
  /** Switches the simulated role, persists it, and refreshes every query so permissions update app-wide. */
  setPeranSimulasi: (peran: Peran) => void;
  /** The single source of truth for "can the current role do X" — never reimplemented in views. */
  boleh: (aksi: Aksi) => boolean;
  isLoading: boolean;
}

/**
 * Loads the current session (`GET /auth/sesi`) and owns the demo role
 * simulation: which role is picked, persisting it across reloads, and
 * pushing it into `models/api-client` as the `X-Demo-Peran` request header.
 */
export function useSesi(): SesiController {
  const queryClient = useQueryClient();
  const [peranSimulasi, setPeranSimulasiState] = useState<Peran | null>(() => readStoredPeran());

  useEffect(() => {
    setPeranSimulasiHeader(peranSimulasi ? [peranSimulasi] : []);
  }, [peranSimulasi]);

  const query = useQuery({
    queryKey: ['sesi'],
    queryFn: fetchSesi,
  });

  const pengguna = query.data?.pengguna;
  const authAktif = query.data?.authAktif ?? true;
  const peranAktif = pengguna?.peran ?? [];

  function setPeranSimulasi(peran: Peran): void {
    localStorage.setItem(STORAGE_KEY, peran);
    setPeranSimulasiState(peran);
    // Set the header synchronously: the effect above only runs after the next
    // render, so invalidating first would refetch with the previous role.
    setPeranSimulasiHeader([peran]);
    void queryClient.invalidateQueries();
  }

  function boleh(aksi: Aksi): boolean {
    return bolehMelakukan(peranAktif, aksi);
  }

  return {
    pengguna,
    authAktif,
    peranAktif,
    peranSimulasi,
    setPeranSimulasi,
    boleh,
    isLoading: query.isLoading,
  };
}
