import { useNavigate } from 'react-router-dom';
import {
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  SHIFTS,
  SHIFT_LABELS,
  STATUS_KELAYAKAN,
  STATUS_KELAYAKAN_LABELS,
  UNIT_TYPES,
  UNIT_TYPE_LABELS,
  type Shift,
  type StatusKelayakan,
  type UnitType,
} from '@p2h/shared';

import { useInspectionList } from '../../controllers/useInspectionList';
import { DataStateBox } from '../components/DataStateBox';
import { FilterBar } from '../components/FilterBar';
import { ObjectStatus } from '../components/ObjectStatus';
import { PageTitleBar } from '../components/PageTitleBar';
import { formatDate, formatDateTime } from '../format';

export function P2HListPage(): React.JSX.Element {
  const navigate = useNavigate();
  const list = useInspectionList();

  return (
    <>
      <PageTitleBar title="P2H" subtitle="Pemeriksaan harian unit sebelum beroperasi" />

      <FilterBar onGo={list.applyFilters} onReset={list.resetFilters}>
        <TextField
          label="Tanggal"
          type="date"
          value={list.draft.tanggal}
          onChange={(event) => list.setTanggal(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          select
          label="Jenis unit"
          value={list.draft.unitType}
          onChange={(event) => list.setUnitType(event.target.value as UnitType | '')}
          sx={{ minWidth: 160 }}
        >
          <MenuItem value="">Semua</MenuItem>
          {UNIT_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {UNIT_TYPE_LABELS[type]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Shift"
          value={list.draft.shift}
          onChange={(event) => list.setShift(event.target.value as Shift | '')}
          sx={{ minWidth: 140 }}
        >
          <MenuItem value="">Semua</MenuItem>
          {SHIFTS.map((shift) => (
            <MenuItem key={shift} value={shift}>
              {SHIFT_LABELS[shift]}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Status kelayakan"
          value={list.draft.statusKelayakan}
          onChange={(event) => list.setStatusKelayakan(event.target.value as StatusKelayakan | '')}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Semua</MenuItem>
          {STATUS_KELAYAKAN.map((status) => (
            <MenuItem key={status} value={status}>
              {STATUS_KELAYAKAN_LABELS[status]}
            </MenuItem>
          ))}
        </TextField>
      </FilterBar>

      <Typography variant="h6" sx={{ mb: 1.5 }}>
        Inspeksi P2H ({list.inspections.length})
      </Typography>

      <DataStateBox
        isLoading={list.isLoading}
        isError={list.isError}
        error={list.error}
        isEmpty={list.inspections.length === 0}
        emptyMessage="Tidak ada inspeksi yang cocok dengan filter."
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tanggal</TableCell>
                <TableCell>No Unit</TableCell>
                <TableCell>Operator</TableCell>
                <TableCell>Shift</TableCell>
                <TableCell>Status Kelayakan</TableCell>
                <TableCell align="right">Temuan</TableCell>
                <TableCell>
                  <Tooltip title="Waktu data diterima server">
                    <span>Diterima</span>
                  </Tooltip>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.inspections.map((inspection) => (
                <TableRow
                  key={inspection.id}
                  hover
                  onClick={() => navigate(`/p2h/${inspection.id}`)}
                  sx={{ cursor: 'pointer' }}
                >
                  <TableCell>{formatDate(inspection.tanggal)}</TableCell>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>{inspection.unit.code}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {inspection.unit.name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography>{inspection.namaOperator}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      NRP {inspection.nrp}
                    </Typography>
                  </TableCell>
                  <TableCell>{SHIFT_LABELS[inspection.shift]}</TableCell>
                  <TableCell>
                    <ObjectStatus status={inspection.statusKelayakan} />
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ color: inspection.jumlahTemuan > 0 ? 'error.main' : 'text.primary' }}>
                      {inspection.jumlahTemuan}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDateTime(inspection.diterimaPada)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </DataStateBox>
    </>
  );
}
