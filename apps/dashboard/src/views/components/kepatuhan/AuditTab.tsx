import VerifiedOutlinedIcon from '@mui/icons-material/VerifiedOutlined';
import {
  Alert,
  Box,
  Button,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material';
import { AKSI_AUDIT, AKSI_AUDIT_LABELS, type AksiAudit } from '@p2h/shared';

import type { AuditController } from '../../../controllers/useAudit';
import { formatDateTime, formatHashShort } from '../../format';
import { DataStateBox } from '../DataStateBox';

interface AuditTabProps {
  controller: AuditController;
  boleh: boolean;
}

/** The "Audit" tab of the Kepatuhan page: the append-only audit trail plus on-demand chain verification. */
export function AuditTab({ controller, boleh }: AuditTabProps): React.JSX.Element {
  if (!boleh) {
    return (
      <Paper sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">Anda tidak memiliki akses ke halaman ini.</Typography>
      </Paper>
    );
  }

  return (
    <>
      <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
        <TextField
          select
          label="Aksi"
          value={controller.aksiFilter}
          onChange={(event) => controller.setAksiFilter(event.target.value as AksiAudit | '')}
          sx={{ minWidth: 220 }}
        >
          <MenuItem value="">Semua</MenuItem>
          {AKSI_AUDIT.map((aksi) => (
            <MenuItem key={aksi} value={aksi}>
              {AKSI_AUDIT_LABELS[aksi]}
            </MenuItem>
          ))}
        </TextField>
        <Box sx={{ ml: 'auto' }}>
          <Button
            variant="outlined"
            startIcon={<VerifiedOutlinedIcon fontSize="small" />}
            onClick={controller.verifikasiRantai}
            disabled={controller.isVerifying}
          >
            Verifikasi rantai
          </Button>
        </Box>
      </Paper>

      {controller.verifikasi ? (
        controller.verifikasi.valid ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            Rantai audit valid ({controller.verifikasi.jumlahDiperiksa} catatan diperiksa)
          </Alert>
        ) : (
          <Alert severity="error" sx={{ mb: 2 }}>
            Rantai audit rusak pada urutan {controller.verifikasi.rusakPadaUrutan} ({controller.verifikasi.jumlahDiperiksa} catatan
            diperiksa)
          </Alert>
        )
      ) : null}
      {controller.verifikasiError ? (
        <Alert severity="error" sx={{ mb: 2 }}>
          {controller.verifikasiError.message}
        </Alert>
      ) : null}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
        Log audit bersifat tambah-saja (append-only) dan tidak ikut terhapus saat reset demo.
      </Typography>

      <DataStateBox
        isLoading={controller.isLoading}
        isError={controller.isError}
        error={controller.error}
        isEmpty={controller.catatan.length === 0}
        emptyMessage="Tidak ada catatan audit."
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Waktu</TableCell>
                <TableCell>Aksi</TableCell>
                <TableCell>Entitas</TableCell>
                <TableCell>Aktor</TableCell>
                <TableCell>Ringkasan</TableCell>
                <TableCell>Hash</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {controller.catatan.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{formatDateTime(entry.waktu)}</TableCell>
                  <TableCell>{AKSI_AUDIT_LABELS[entry.aksi]}</TableCell>
                  <TableCell>
                    {entry.entitas}
                    {entry.entitasId ? ` · ${entry.entitasId}` : ''}
                  </TableCell>
                  <TableCell>{entry.aktorNama}</TableCell>
                  <TableCell>{entry.ringkasan}</TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                      {formatHashShort(entry.hash)}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DataStateBox>
    </>
  );
}
