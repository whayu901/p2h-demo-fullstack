import { Box, Typography } from '@mui/material';
import { STATUS_TINDAK_LANJUT_LABELS, type StatusTindakLanjut } from '@p2h/shared';

import { colorForStatusTindakLanjut } from './statusColors';

interface TindakLanjutStatusProps {
  status: StatusTindakLanjut;
}

/** SAP Fiori "ObjectStatus"-style dot + label for the follow-up chain status. */
export function TindakLanjutStatus({ status }: TindakLanjutStatusProps): React.JSX.Element {
  const tone = colorForStatusTindakLanjut(status);
  const colorKey = tone === 'neutral' ? 'neutral.main' : `${tone}.main`;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: colorKey, flexShrink: 0 }} />
      <Typography component="span" variant="body2" sx={{ color: colorKey, fontWeight: 500 }}>
        {STATUS_TINDAK_LANJUT_LABELS[status]}
      </Typography>
    </Box>
  );
}
