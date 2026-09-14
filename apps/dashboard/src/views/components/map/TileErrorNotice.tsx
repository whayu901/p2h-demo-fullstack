import { Paper, Typography } from '@mui/material';

interface TileErrorNoticeProps {
  visible: boolean;
}

/**
 * Small non-blocking notice overlaid on the map when the base tile layer
 * fails to load (e.g. no internet). Markers and routes still render.
 */
export function TileErrorNotice({ visible }: TileErrorNoticeProps): React.JSX.Element | null {
  if (!visible) {
    return null;
  }

  return (
    <Paper
      sx={{
        position: 'absolute',
        top: 8,
        left: 8,
        zIndex: 1000,
        px: 1.5,
        py: 1,
        maxWidth: 280,
        pointerEvents: 'none',
      }}
    >
      <Typography variant="caption" color="text.secondary">
        Peta dasar tidak dapat dimuat (butuh internet). Titik dan rute tetap ditampilkan.
      </Typography>
    </Paper>
  );
}
