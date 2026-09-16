/** RBAC single source of truth: who can do what across the P2H/P5M apps. */

/** User roles in the SMKP inspection/follow-up workflow. */
export const PERAN = ['OPERATOR', 'PENGAWAS', 'MEKANIK', 'HSE', 'ADMIN'] as const;
export type Peran = (typeof PERAN)[number];

/** Indonesian display labels for roles. */
export const PERAN_LABELS: Record<Peran, string> = {
  OPERATOR: 'Operator',
  PENGAWAS: 'Pengawas Operasional',
  MEKANIK: 'Mekanik',
  HSE: 'HSE',
  ADMIN: 'Administrator',
};

/** Fine-grained actions guarded by role-based access control. */
export const AKSI = [
  'inspeksi:baca',
  'inspeksi:kirim',
  'inspeksi:rekomendasi',
  'inspeksi:keputusan',
  'p5m:baca',
  'p5m:kirim',
  'audit:baca',
  'admin:reset',
  'pdp:kelola',
] as const;
export type Aksi = (typeof AKSI)[number];

/** Which actions each role may perform. The ONE place authorisation is defined. */
export const IZIN_PERAN: Record<Peran, readonly Aksi[]> = {
  OPERATOR: ['inspeksi:baca', 'inspeksi:kirim', 'p5m:baca', 'p5m:kirim'],
  MEKANIK: ['inspeksi:baca', 'inspeksi:rekomendasi', 'p5m:baca'],
  PENGAWAS: ['inspeksi:baca', 'inspeksi:keputusan', 'p5m:baca', 'p5m:kirim'],
  HSE: ['inspeksi:baca', 'p5m:baca', 'audit:baca'],
  ADMIN: [...AKSI],
};

/** True if at least one of the given roles is permitted to perform `aksi`. */
export function bolehMelakukan(peran: readonly Peran[], aksi: Aksi): boolean {
  return peran.some((p) => IZIN_PERAN[p].includes(aksi));
}
