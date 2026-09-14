import { Box, Stack, Typography, useTheme } from '@mui/material';
import { STATUS_KELAYAKAN, STATUS_KELAYAKAN_LABELS } from '@p2h/shared';

import { colorForStatusKelayakan } from '../statusColors';

/**
 * Explains what the map's marker shapes/colors and lines mean. Rendered
 * inside the Peta page's right-hand panel (which owns the outlined Paper).
 */
export function MapLegend(): React.JSX.Element {
  const theme = useTheme();

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
        Legenda
      </Typography>
      <Stack spacing={1}>
        {STATUS_KELAYAKAN.map((status) => (
          <Box key={status} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Box
              sx={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                flexShrink: 0,
                bgcolor: `${colorForStatusKelayakan(status)}.main`,
                border: '2px solid',
                borderColor: 'background.paper',
                boxShadow: `0 0 0 1px ${theme.palette.divider}`,
              }}
            />
            <Typography variant="body2">P2H — {STATUS_KELAYAKAN_LABELS[status]}</Typography>
          </Box>
        ))}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              flexShrink: 0,
              bgcolor: 'info.main',
              border: '2px solid',
              borderColor: 'background.paper',
              boxShadow: `0 0 0 1px ${theme.palette.divider}`,
              transform: 'rotate(45deg)',
            }}
          />
          <Typography variant="body2">P5M — Safety talk</Typography>
        </Box>
        <Typography variant="body2" color="text.secondary">
          Garis = rute unit (urut waktu pemeriksaan)
        </Typography>
      </Stack>
    </Box>
  );
}
