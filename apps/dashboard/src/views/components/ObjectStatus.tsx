import { Box, Typography } from '@mui/material';
import { STATUS_KELAYAKAN_LABELS, type StatusKelayakan } from '@p2h/shared';

import { colorForStatusKelayakan } from './statusColors';

interface ObjectStatusProps {
  status: StatusKelayakan;
  size?: 'small' | 'large';
}

/** SAP Fiori "ObjectStatus": a colored dot plus label conveying the P2H verdict. */
export function ObjectStatus({ status, size = 'small' }: ObjectStatusProps): React.JSX.Element {
  const color = colorForStatusKelayakan(status);
  const dotSize = size === 'large' ? 10 : 8;

  return (
    <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Box
        sx={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          bgcolor: `${color}.main`,
          flexShrink: 0,
        }}
      />
      <Typography
        component="span"
        variant={size === 'large' ? 'h5' : 'body2'}
        sx={{ color: `${color}.main`, fontWeight: size === 'large' ? 600 : 500 }}
      >
        {STATUS_KELAYAKAN_LABELS[status]}
      </Typography>
    </Box>
  );
}
