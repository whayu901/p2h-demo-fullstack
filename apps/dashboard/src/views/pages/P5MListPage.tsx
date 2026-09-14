import { useNavigate } from 'react-router-dom';
import {
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

import { useSafetyTalkList } from '../../controllers/useSafetyTalkList';
import { DataStateBox } from '../components/DataStateBox';
import { FilterBar } from '../components/FilterBar';
import { PageTitleBar } from '../components/PageTitleBar';
import { formatDate } from '../format';

export function P5MListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const list = useSafetyTalkList();

  return (
    <>
      <PageTitleBar title="P5M" subtitle="Pertemuan 5 menit sebelum bekerja" />

      <FilterBar onGo={list.applyFilters} onReset={list.resetFilters}>
        <TextField
          label="Tanggal"
          type="date"
          value={list.draftTanggal}
          onChange={(event) => list.setDraftTanggal(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
      </FilterBar>

      <Typography variant="h6" sx={{ mb: 1.5 }}>
        Safety Talk P5M ({list.safetyTalks.length})
      </Typography>

      <DataStateBox
        isLoading={list.isLoading}
        isError={list.isError}
        error={list.error}
        isEmpty={list.safetyTalks.length === 0}
        emptyMessage="Tidak ada safety talk yang cocok dengan filter."
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tanggal</TableCell>
                <TableCell>Topik</TableCell>
                <TableCell>Pemimpin</TableCell>
                <TableCell>Lokasi</TableCell>
                <TableCell align="right">Peserta hadir</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.safetyTalks.map((talk) => (
                <TableRow key={talk.id} hover onClick={() => navigate(`/p5m/${talk.id}`)} sx={{ cursor: 'pointer' }}>
                  <TableCell>
                    <Typography>{formatDate(talk.tanggal)}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {talk.jamMulai}
                    </Typography>
                  </TableCell>
                  <TableCell>{talk.topik}</TableCell>
                  <TableCell>
                    <Typography>{talk.namaPemimpin}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      NRP {talk.nrpPemimpin}
                    </Typography>
                  </TableCell>
                  <TableCell>{talk.lokasiArea}</TableCell>
                  <TableCell align="right">
                    {talk.jumlahHadir} / {talk.peserta.length}
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
