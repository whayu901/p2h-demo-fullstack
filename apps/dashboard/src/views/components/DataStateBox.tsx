import { Box, CircularProgress, Typography } from '@mui/material';

interface DataStateBoxProps {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
  isEmpty?: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
}

/**
 * Wraps a list/table with loading, error, and empty states so pages don't
 * repeat the same three branches. Only renders `children` on the happy path.
 */
export function DataStateBox({
  isLoading,
  isError,
  error,
  isEmpty = false,
  emptyMessage = 'Tidak ada data.',
  children,
}: DataStateBoxProps): React.JSX.Element {
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 6 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  if (isError) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="error.main">{error?.message ?? 'Terjadi kesalahan.'}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Pastikan server API berjalan.
        </Typography>
      </Box>
    );
  }

  if (isEmpty) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return <>{children}</>;
}
