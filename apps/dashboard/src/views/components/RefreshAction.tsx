import RefreshIcon from '@mui/icons-material/Refresh';
import { Box, Button, Typography } from '@mui/material';

import { formatClockTime } from '../format';

interface RefreshActionProps {
  onRefresh: () => void;
  /** Epoch millis of the last successful fetch, or 0 when never fetched. */
  updatedAt: number;
  isFetching?: boolean;
}

/** "Muat ulang" button paired with a small "Diperbarui hh:mm:ss" hint. */
export function RefreshAction({ onRefresh, updatedAt, isFetching = false }: RefreshActionProps): React.JSX.Element {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
      <Button
        size="small"
        variant="outlined"
        startIcon={<RefreshIcon fontSize="small" />}
        onClick={onRefresh}
        disabled={isFetching}
      >
        Muat ulang
      </Button>
      {updatedAt > 0 ? (
        <Typography variant="caption" color="text.secondary">
          Diperbarui {formatClockTime(updatedAt)}
        </Typography>
      ) : null}
    </Box>
  );
}
