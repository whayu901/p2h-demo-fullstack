import type { HasilItemP2H } from './checklists';
import type { KodeBahaya, StatusKelayakan } from './enums';

/** Result of evaluating a completed P2H checklist against the hazard rules. */
export interface HasilKelayakan {
  status: StatusKelayakan;
  /** TIDAK_NORMAL items with kode AA or A — the reason for STOP OPERASI. */
  itemStop: HasilItemP2H[];
  /** TIDAK_NORMAL items with kode B or C. */
  itemPerhatian: HasilItemP2H[];
}

/** Message shown to the operator/supervisor when a unit must stop operating. */
export const PESAN_STOP_OPERASI = 'Unit tidak layak operasi. Segera laporkan ke pengawas.';

/** AA and A are the hazard codes severe enough to force a stop of operation. */
function isKritis(kode: KodeBahaya): boolean {
  return kode === 'AA' || kode === 'A';
}

function isTidakNormal(item: HasilItemP2H): boolean {
  return item.hasil === 'TIDAK_NORMAL';
}

/** Counts how many checklist items were flagged as TIDAK_NORMAL. */
export function hitungJumlahTemuan(items: readonly HasilItemP2H[]): number {
  return items.filter(isTidakNormal).length;
}

/**
 * Determines the operational verdict for a unit from its completed checklist:
 * a TIDAK_NORMAL critical (AA/A) item stops the unit; a TIDAK_NORMAL
 * moderate/low (B/C) item requires attention; otherwise it's fit to operate.
 */
export function hitungStatusKelayakan(items: readonly HasilItemP2H[]): HasilKelayakan {
  const temuan = items.filter(isTidakNormal);
  const itemStop = temuan.filter((item) => isKritis(item.kodeBahaya));
  const itemPerhatian = temuan.filter((item) => !isKritis(item.kodeBahaya));

  const status: StatusKelayakan =
    itemStop.length > 0
      ? 'STOP_OPERASI'
      : itemPerhatian.length > 0
        ? 'OPERASI_DENGAN_PERHATIAN'
        : 'LAYAK_OPERASI';

  return { status, itemStop, itemPerhatian };
}
