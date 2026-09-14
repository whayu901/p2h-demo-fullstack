import { useQuery } from '@tanstack/react-query';
import { hitungPesertaHadir, type SafetyTalkView } from '@p2h/shared';

import { fetchSafetyTalk, mapsUrlFor, photoUrlFor } from '../models/api-client';

export interface SafetyTalkDetailController {
  safetyTalk: SafetyTalkView | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  photoUrl: string | null;
  mapsUrl: string | null;
  jumlahHadir: number;
  jumlahPeserta: number;
}

/** Loads one P5M safety talk and derives the absolute photo URL and Google Maps link. */
export function useSafetyTalkDetail(id: string | undefined): SafetyTalkDetailController {
  const query = useQuery({
    queryKey: ['safety-talk', id],
    queryFn: () => fetchSafetyTalk(id ?? ''),
    enabled: id !== undefined,
  });
  const safetyTalk = query.data;

  return {
    safetyTalk,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    photoUrl: safetyTalk ? photoUrlFor(safetyTalk.fotoUrl) : null,
    mapsUrl: safetyTalk ? mapsUrlFor(safetyTalk.latitude, safetyTalk.longitude) : null,
    jumlahHadir: safetyTalk ? hitungPesertaHadir(safetyTalk.peserta) : 0,
    jumlahPeserta: safetyTalk?.peserta.length ?? 0,
  };
}
