import type { TindakLanjut } from '@p2h/shared';

export type TindakLanjutStepState = 'done' | 'active' | 'pending' | 'skipped';

export interface TindakLanjutStep {
  label: string;
  state: TindakLanjutStepState;
}

/**
 * Derives the four follow-up steps (Temuan → Rekomendasi mekanik → Keputusan
 * pengawas → Selesai) from the actual `TindakLanjut` record — never from
 * `status` alone — so a supervisor deciding directly on a STOP_OPERASI
 * finding (skipping the mechanic step) still renders correctly.
 */
export function computeTindakLanjutSteps(tindakLanjut: TindakLanjut): TindakLanjutStep[] {
  const punyaRekomendasi = tindakLanjut.rekomendasi !== null;
  const punyaKeputusan = tindakLanjut.keputusan !== null;
  const selesai = tindakLanjut.status === 'SELESAI';
  const tidakDiperlukan = tindakLanjut.status === 'TIDAK_DIPERLUKAN';

  return [
    { label: 'Temuan', state: 'done' },
    {
      label: 'Rekomendasi mekanik',
      state: punyaRekomendasi
        ? 'done'
        : tindakLanjut.status === 'MENUNGGU_MEKANIK'
          ? 'active'
          : tidakDiperlukan || punyaKeputusan
            ? 'skipped'
            : 'pending',
    },
    {
      label: 'Keputusan pengawas',
      state: punyaKeputusan
        ? 'done'
        : tindakLanjut.status === 'MENUNGGU_PENGAWAS'
          ? 'active'
          : tidakDiperlukan
            ? 'skipped'
            : 'pending',
    },
    {
      // While a unit is held after a TAHAN_UNIT decision the chain is not heading
      // to "Selesai" yet, so the last step says what is actually happening.
      label: tindakLanjut.status === 'DALAM_PERBAIKAN' ? 'Dalam perbaikan' : 'Selesai',
      state: selesai
        ? 'done'
        : tidakDiperlukan
          ? 'skipped'
          : tindakLanjut.status === 'DALAM_PERBAIKAN'
            ? 'active'
            : 'pending',
    },
  ];
}
