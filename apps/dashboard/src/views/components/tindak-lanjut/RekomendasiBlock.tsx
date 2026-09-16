import { useState } from 'react';
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import type { KirimRekomendasiDto, RekomendasiMekanik } from '@p2h/shared';

import { FactItem } from '../FactItem';
import { formatDate, formatDateTime } from '../../format';

interface RekomendasiDisplayProps {
  rekomendasi: RekomendasiMekanik;
}

function RekomendasiDisplay({ rekomendasi }: RekomendasiDisplayProps): React.JSX.Element {
  return (
    <Stack spacing={1.5}>
      <FactItem label="Catatan" value={rekomendasi.catatan} />
      {rekomendasi.sparePart ? <FactItem label="Spare part" value={rekomendasi.sparePart} /> : null}
      {rekomendasi.estimasiSelesai ? (
        <FactItem label="Estimasi selesai" value={formatDate(rekomendasi.estimasiSelesai)} />
      ) : null}
      <Typography variant="caption" color="text.secondary">
        oleh {rekomendasi.oleh.nama} (NRP {rekomendasi.oleh.nrp}) · {formatDateTime(rekomendasi.oleh.pada)}
      </Typography>
    </Stack>
  );
}

interface RekomendasiFormProps {
  boleh: boolean;
  pending: boolean;
  onSubmit: (dto: KirimRekomendasiDto) => void;
}

function RekomendasiForm({ boleh, pending, onSubmit }: RekomendasiFormProps): React.JSX.Element {
  const [catatan, setCatatan] = useState('');
  const [sparePart, setSparePart] = useState('');
  const [estimasiSelesai, setEstimasiSelesai] = useState('');

  function handleSubmit(): void {
    onSubmit({
      catatan,
      sparePart: sparePart || null,
      estimasiSelesai: estimasiSelesai || null,
    });
  }

  return (
    <Stack spacing={2}>
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
        label="Spare part"
        value={sparePart}
        onChange={(event) => setSparePart(event.target.value)}
        disabled={!boleh}
      />
      <TextField
        label="Estimasi selesai"
        type="date"
        value={estimasiSelesai}
        onChange={(event) => setEstimasiSelesai(event.target.value)}
        slotProps={{ inputLabel: { shrink: true } }}
        disabled={!boleh}
      />
      <Box>
        <Button variant="contained" onClick={handleSubmit} disabled={!boleh || !catatan.trim() || pending}>
          Kirim rekomendasi
        </Button>
        {!boleh ? (
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
            Hanya Mekanik/Administrator yang dapat mengisi rekomendasi.
          </Typography>
        ) : null}
      </Box>
    </Stack>
  );
}

interface RekomendasiBlockProps {
  rekomendasi: RekomendasiMekanik | null;
  boleh: boolean;
  pending: boolean;
  onSubmit: (dto: KirimRekomendasiDto) => void;
}

/** The "Rekomendasi mekanik" half of the follow-up chain: read-only once filed, else a gated form. */
export function RekomendasiBlock({ rekomendasi, boleh, pending, onSubmit }: RekomendasiBlockProps): React.JSX.Element {
  return (
    <Box>
      <Typography variant="subtitle2" sx={{ mb: 1.5 }}>
        Rekomendasi mekanik
      </Typography>
      {rekomendasi ? (
        <RekomendasiDisplay rekomendasi={rekomendasi} />
      ) : (
        <RekomendasiForm boleh={boleh} pending={pending} onSubmit={onSubmit} />
      )}
    </Box>
  );
}
