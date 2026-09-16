import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import { Stack, Tooltip } from '@mui/material';
import Chip from '@mui/material/Chip';
import { adaMasalahIntegritas, type IntegritasRecord } from '@p2h/shared';

interface IntegrityChipProps {
  integritas: IntegritasRecord | null;
}

/** Formats a clock skew in seconds as a whole number of minutes, e.g. "12 menit". */
function formatSkewMinutes(selisihDetik: number): string {
  const menit = Math.max(1, Math.round(selisihDetik / 60));
  return `${menit} menit`;
}

/**
 * Warns when a submitted P2H/P5M record shows signs of tampering: a mocked
 * (fake GPS) location, or a device clock that drifted suspiciously far from
 * the server's. Renders nothing when the record's integrity is clean.
 */
export function IntegrityChip({ integritas }: IntegrityChipProps): React.JSX.Element | null {
  if (!adaMasalahIntegritas(integritas)) {
    return null;
  }

  const lokasi = integritas?.lokasi ?? null;
  const waktu = integritas?.waktu ?? null;
  const lokasiMasalah = Boolean(lokasi?.mock);
  const waktuMasalah = Boolean(waktu?.mencurigakan);

  return (
    <Stack direction="row" spacing={0.5} sx={{ display: 'inline-flex' }}>
      {lokasiMasalah ? (
        <Chip
          icon={<WarningAmberOutlinedIcon fontSize="small" />}
          label="Lokasi tidak tepercaya"
          color="warning"
          variant="outlined"
        />
      ) : null}
      {waktuMasalah && waktu ? (
        <Tooltip title={`Selisih ${formatSkewMinutes(waktu.selisihDetik)} dari jam server`}>
          <Chip
            icon={<WarningAmberOutlinedIcon fontSize="small" />}
            label="Jam perangkat menyimpang"
            color="error"
            variant="outlined"
          />
        </Tooltip>
      ) : null}
    </Stack>
  );
}
