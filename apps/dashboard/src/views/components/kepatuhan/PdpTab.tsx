import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { BATAS_LAPOR_KEBOCORAN_JAM, JENIS_PERMINTAAN_PDP, type JenisPermintaanPdp } from '@p2h/shared';

import { isHasilPenghapusan, type PdpController } from '../../../controllers/usePdp';
import { formatDate, formatDateTime } from '../../format';
import { FactItem } from '../FactItem';

interface PdpTabProps {
  controller: PdpController;
  boleh: boolean;
}

const JENIS_LABELS: Record<JenisPermintaanPdp, string> = {
  AKSES: 'Akses',
  PENGHAPUSAN: 'Penghapusan',
};

/** The "PDP" tab of the Kepatuhan page: retention policy, plus the data-subject request form. */
export function PdpTab({ controller, boleh }: PdpTabProps): React.JSX.Element {
  if (!boleh) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Anda tidak memiliki akses ke halaman ini.</Typography>
      </Paper>
    );
  }

  const { mutation } = controller;
  const result = mutation.data;

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 5 }}>
        <Paper sx={{ p: 3, mb: 2 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Kebijakan retensi
          </Typography>
          {controller.kebijakan ? (
            <Stack spacing={2}>
              <FactItem label="Retensi server" value={`${controller.kebijakan.hariRetensiServer} hari`} />
              <FactItem label="Retensi perangkat" value={`${controller.kebijakan.hariRetensiPerangkat} hari`} />
              <FactItem
                label="Terakhir dijalankan"
                value={controller.kebijakan.terakhirDijalankan ? formatDateTime(controller.kebijakan.terakhirDijalankan) : 'Belum pernah'}
              />
              <FactItem label="Catatan" value={controller.kebijakan.catatan} />
            </Stack>
          ) : (
            <Typography color="text.secondary">{controller.isLoadingKebijakan ? 'Memuat…' : '—'}</Typography>
          )}
        </Paper>
        <Alert severity="info" variant="outlined">
          Kewajiban lapor kebocoran data: maksimal {BATAS_LAPOR_KEBOCORAN_JAM} jam (PP 33/2026).
        </Alert>
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <Paper sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Permintaan subjek data
          </Typography>
          <Stack spacing={2} sx={{ maxWidth: 420 }}>
            <TextField label="NRP" value={controller.draft.nrp} onChange={(event) => controller.setNrp(event.target.value)} />
            <TextField
              select
              label="Jenis permintaan"
              value={controller.draft.jenis}
              onChange={(event) => controller.setJenis(event.target.value as JenisPermintaanPdp)}
            >
              {JENIS_PERMINTAAN_PDP.map((jenis) => (
                <MenuItem key={jenis} value={jenis}>
                  {JENIS_LABELS[jenis]}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Alasan"
              value={controller.draft.alasan}
              onChange={(event) => controller.setAlasan(event.target.value)}
              multiline
              minRows={2}
            />
            <Box>
              <Button
                variant="contained"
                onClick={controller.requestSubmit}
                disabled={mutation.isPending || !controller.draft.nrp.trim() || !controller.draft.alasan.trim()}
              >
                Ajukan permintaan
              </Button>
            </Box>
          </Stack>

          {mutation.isError ? (
            <Alert severity="error" sx={{ mt: 2 }}>
              {mutation.error.message}
            </Alert>
          ) : null}

          {result ? (
            <Alert severity="success" sx={{ mt: 2 }}>
              {isHasilPenghapusan(result) ? (
                <>
                  Data untuk NRP {result.nrp} telah dianonimkan: {result.inspeksiDianonimkan} inspeksi P2H,{' '}
                  {result.p5mDianonimkan} P5M ({formatDateTime(result.pada)}).
                </>
              ) : (
                <>
                  NRP {result.nrp} memiliki {result.jumlahInspeksi} inspeksi P2H dan {result.jumlahP5M} P5M
                  {result.rentangTanggal
                    ? ` antara ${formatDate(result.rentangTanggal.dari)} – ${formatDate(result.rentangTanggal.sampai)}`
                    : ''}
                  .
                </>
              )}
            </Alert>
          ) : null}
        </Paper>
      </Grid>

      <Dialog open={controller.confirmOpen} onClose={controller.cancelConfirm}>
        <DialogTitle>Konfirmasi penghapusan data</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Data pribadi untuk NRP {controller.draft.nrp} akan dianonimkan secara permanen. Lanjutkan?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={controller.cancelConfirm}>Batal</Button>
          <Button variant="contained" color="error" onClick={controller.confirmSubmit}>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}
