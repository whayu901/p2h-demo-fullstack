import { useState } from 'react';
import { Box, Button, MenuItem, Stack, TextField, Typography } from '@mui/material';
import {
  CATATAN_TTE_DEMO,
  KEPUTUSAN_PENGAWAS,
  KEPUTUSAN_PENGAWAS_LABELS,
  type KeputusanPengawas,
  type KeputusanPengawasRecord,
  type KirimKeputusanDto,
} from '@p2h/shared';

import { FactItem } from '../FactItem';
import { formatDateTime, formatHashShort } from '../../format';
import { colorForKeputusanPengawas } from '../statusColors';

interface KeputusanDisplayProps {
  keputusan: KeputusanPengawasRecord;
}

function KeputusanDisplay({ keputusan }: KeputusanDisplayProps): React.JSX.Element {
  const color = colorForKeputusanPengawas(keputusan.keputusan);

  return (
    <Stack spacing={1.5}>
      <Typography sx={{ color: `${color}.main`, fontWeight: 600 }}>
        {KEPUTUSAN_PENGAWAS_LABELS[keputusan.keputusan]}
      </Typography>
      <FactItem label="Catatan" value={keputusan.catatan} />
      {keputusan.syarat ? <FactItem label="Syarat" value={keputusan.syarat} /> : null}
      <Typography variant="caption" color="text.secondary">
        oleh {keputusan.oleh.nama} (NRP {keputusan.oleh.nrp}) · {formatDateTime(keputusan.oleh.pada)}
      </Typography>
      {keputusan.tandaTangan ? (
        <Box sx={{ pt: 0.5 }}>
          <Typography variant="body2">
            Ditandatangani elektronik · hash <code>{formatHashShort(keputusan.tandaTangan.hashDokumen)}</code>
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {CATATAN_TTE_DEMO}
          </Typography>
        </Box>
      ) : null}
    </Stack>
  );
}

interface KeputusanFormProps {
  boleh: boolean;
  pending: boolean;
  onSubmit: (dto: KirimKeputusanDto) => void;
}

function KeputusanForm({ boleh, pending, onSubmit }: KeputusanFormProps): React.JSX.Element {
  const [keputusan, setKeputusan] = useState<KeputusanPengawas>('IZINKAN_OPERASI');
  const [catatan, setCatatan] = useState('');
  const [syarat, setSyarat] = useState('');

  function handleSubmit(): void {
    onSubmit({ keputusan, catatan, syarat: syarat || null });
  }

  return (
    <Stack spacing={2}>
      <TextField
        select
        label="Keputusan"
        value={keputusan}
        onChange={(event) => setKeputusan(event.target.value as KeputusanPengawas)}
        disabled={!boleh}
      >
        {KEPUTUSAN_PENGAWAS.map((option) => (
          <MenuItem key={option} value={option}>
            {KEPUTUSAN_PENGAWAS_LABELS[option]}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Catatan"
        value={catatan}
        onChange={(event) => setCatatan(event.target.value)}
        multiline
        minRows={2}
        required
        disabled={!boleh}
      />
      <TextField
        label="Syarat"
        value={syarat}
        onChange={(event) => setSyarat(event.target.value)}
        disabled={!boleh}
      />
      <Box>
        <Button variant="contained" onClick={handleSubmit} disabled={!boleh || !catatan.trim() || pending}>
          Kirim keputusan
        </Button>
        {!boleh ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Hanya Pengawas Operasional/Administrator yang dapat mengisi keputusan.
          </Typography>
        ) : null}
      </Box>
    </Stack>
  );
}

interface KeputusanBlockProps {
  keputusan: KeputusanPengawasRecord | null;
  boleh: boolean;
  pending: boolean;
  onSubmit: (dto: KirimKeputusanDto) => void;
}

/** The "Keputusan pengawas" half of the follow-up chain: read-only once decided, else a gated form. */
export function KeputusanBlock({ keputusan, boleh, pending, onSubmit }: KeputusanBlockProps): React.JSX.Element {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Keputusan pengawas
      </Typography>
      {keputusan ? <KeputusanDisplay keputusan={keputusan} /> : <KeputusanForm boleh={boleh} pending={pending} onSubmit={onSubmit} />}
    </Box>
  );
}
