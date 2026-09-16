import type { HasilItemValue, KeputusanPengawas, StatusKelayakan, StatusTindakLanjut } from '@p2h/shared';

/** Palette keys used to color verdict/result text — never raw hex outside theme.ts. */
export type SeverityColor = 'success' | 'warning' | 'error';
export type ToneColor = SeverityColor | 'neutral';
/** Tone including 'info', used for follow-up chain status ("in progress"). */
export type StatusTone = SeverityColor | 'neutral' | 'info';

/** Maps the operational verdict to the palette color that represents it. */
export function colorForStatusKelayakan(status: StatusKelayakan): SeverityColor {
  switch (status) {
    case 'LAYAK_OPERASI':
      return 'success';
    case 'OPERASI_DENGAN_PERHATIAN':
      return 'warning';
    case 'STOP_OPERASI':
      return 'error';
  }
}

/** Maps a single checklist item's result to the palette color that represents it. */
export function colorForHasilItem(hasil: HasilItemValue): ToneColor {
  switch (hasil) {
    case 'NORMAL':
      return 'success';
    case 'TIDAK_NORMAL':
      return 'error';
    case 'NA':
      return 'neutral';
  }
}

/** Maps the SMKP follow-up chain status to the palette color that represents it. */
export function colorForStatusTindakLanjut(status: StatusTindakLanjut): StatusTone {
  switch (status) {
    case 'MENUNGGU_PENGAWAS':
    case 'MENUNGGU_MEKANIK':
      return 'warning';
    case 'DALAM_PERBAIKAN':
      return 'info';
    case 'SELESAI':
      return 'success';
    case 'TIDAK_DIPERLUKAN':
      return 'neutral';
  }
}

/** Maps a supervisor's verdict to the palette color that represents it. */
export function colorForKeputusanPengawas(keputusan: KeputusanPengawas): SeverityColor {
  switch (keputusan) {
    case 'IZINKAN_OPERASI':
      return 'success';
    case 'IZINKAN_DENGAN_SYARAT':
      return 'warning';
    case 'TAHAN_UNIT':
      return 'error';
  }
}
