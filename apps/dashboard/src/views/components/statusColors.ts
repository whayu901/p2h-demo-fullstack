import type { HasilItemValue, StatusKelayakan } from '@p2h/shared';

/** Palette keys used to color verdict/result text — never raw hex outside theme.ts. */
export type SeverityColor = 'success' | 'warning' | 'error';
export type ToneColor = SeverityColor | 'neutral';

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
