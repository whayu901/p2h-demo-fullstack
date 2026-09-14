import { useState } from 'react';
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
} from '@mui/material';

import { useAdminReset } from '../../controllers/useAdminReset';

interface ResetDemoDialogProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Confirmation dialog for "Reset demo data", plus the result Snackbar.
 * Rendered outside the overflow Menu so it survives the menu closing.
 */
export function ResetDemoDialog({ open, onClose }: ResetDemoDialogProps): React.JSX.Element {
  const [feedback, setFeedback] = useState<'success' | 'error' | null>(null);
  const resetMutation = useAdminReset();

  function handleConfirm(): void {
    resetMutation.mutate(undefined, {
      onSuccess: () => setFeedback('success'),
      onError: () => setFeedback('error'),
    });
    onClose();
  }

  return (
    <>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Reset demo data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Semua data di server akan dihapus dan diisi ulang dengan data contoh. Lanjutkan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Batal</Button>
          <Button variant="contained" color="error" onClick={handleConfirm}>
            Reset
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={feedback !== null}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={feedback ?? 'success'}
          variant="filled"
          onClose={() => setFeedback(null)}
          sx={{ width: '100%' }}
        >
          {feedback === 'success' ? 'Data demo berhasil direset' : 'Gagal mereset data demo.'}
        </Alert>
      </Snackbar>
    </>
  );
}
