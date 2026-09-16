import { useState } from 'react';
import { Alert, Grid, Paper, Snackbar, Typography } from '@mui/material';
import type { InspectionView } from '@p2h/shared';

import { computeTindakLanjutSteps } from '../../../controllers/tindakLanjutSteps';
import { useSesi } from '../../../controllers/useSesi';
import { useTindakLanjut } from '../../../controllers/useTindakLanjut';
import { KeputusanBlock } from './KeputusanBlock';
import { RekomendasiBlock } from './RekomendasiBlock';
import { TindakLanjutStepper } from './TindakLanjutStepper';

interface TindakLanjutSectionProps {
  inspection: InspectionView;
}

interface Feedback {
  severity: 'success' | 'error';
  message: string;
}

/** The P2H object page's "Tindak Lanjut" section: chain stepper, plus the live rekomendasi/keputusan forms. */
export function TindakLanjutSection({ inspection }: TindakLanjutSectionProps): React.JSX.Element {
  const sesi = useSesi();
  const mutations = useTindakLanjut(inspection.id);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const { tindakLanjut } = inspection;
  const steps = computeTindakLanjutSteps(tindakLanjut);

  return (
    <Paper sx={{ p: 3 }}>
      <TindakLanjutStepper steps={steps} />

      {tindakLanjut.status === 'TIDAK_DIPERLUKAN' ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3, fontStyle: 'italic' }}>
          Tidak ada temuan yang memerlukan tindak lanjut.
        </Typography>
      ) : (
        <Grid container spacing={4} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <RekomendasiBlock
              rekomendasi={tindakLanjut.rekomendasi}
              boleh={sesi.boleh('inspeksi:rekomendasi')}
              pending={mutations.rekomendasi.isPending}
              onSubmit={(dto) =>
                mutations.rekomendasi.mutate(dto, {
                  onSuccess: () => setFeedback({ severity: 'success', message: 'Rekomendasi berhasil dikirim.' }),
                  onError: (error) => setFeedback({ severity: 'error', message: error.message }),
                })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <KeputusanBlock
              keputusan={tindakLanjut.keputusan}
              boleh={sesi.boleh('inspeksi:keputusan')}
              pending={mutations.keputusan.isPending}
              onSubmit={(dto) =>
                mutations.keputusan.mutate(dto, {
                  onSuccess: () => setFeedback({ severity: 'success', message: 'Keputusan berhasil dikirim.' }),
                  onError: (error) => setFeedback({ severity: 'error', message: error.message }),
                })
              }
            />
          </Grid>
        </Grid>
      )}

      <Snackbar
        open={feedback !== null}
        autoHideDuration={4000}
        onClose={() => setFeedback(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={feedback?.severity ?? 'success'} variant="filled" onClose={() => setFeedback(null)} sx={{ width: '100%' }}>
          {feedback?.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
}
