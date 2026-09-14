import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { UNIT_TYPE_LABELS } from '@p2h/shared';

import { useUnits } from '../../controllers/useUnits';
import { DataStateBox } from '../components/DataStateBox';
import { ObjectStatus } from '../components/ObjectStatus';
import { PageTitleBar } from '../components/PageTitleBar';
import { formatDate } from '../format';

export function UnitPage(): React.JSX.Element {
  const units = useUnits();
  const data = units.data ?? [];

  return (
    <>
      <PageTitleBar title="Unit" subtitle="Daftar unit dan status inspeksi terakhirnya" />

      <DataStateBox
        isLoading={units.isLoading}
        isError={units.isError}
        error={units.error}
        isEmpty={data.length === 0}
      >
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>No Unit</TableCell>
                <TableCell>Nama</TableCell>
                <TableCell>Jenis</TableCell>
                <TableCell>Site</TableCell>
                <TableCell>Inspeksi terakhir</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((unit) => (
                <TableRow key={unit.id}>
                  <TableCell sx={{ fontWeight: 600 }}>{unit.code}</TableCell>
                  <TableCell>{unit.name}</TableCell>
                  <TableCell>{UNIT_TYPE_LABELS[unit.type]}</TableCell>
                  <TableCell>{unit.site}</TableCell>
                  <TableCell>
                    {unit.inspeksiTerakhir ? (
                      <>
                        <Typography variant="body2">{formatDate(unit.inspeksiTerakhir.tanggal)}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {unit.inspeksiTerakhir.namaOperator}
                        </Typography>
                      </>
                    ) : (
                      <Typography color="text.secondary">Belum diperiksa</Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {unit.inspeksiTerakhir ? (
                      <ObjectStatus status={unit.inspeksiTerakhir.statusKelayakan} />
                    ) : (
                      <Typography color="text.secondary">—</Typography>
                    )}
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
