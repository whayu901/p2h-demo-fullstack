import { useNavigate } from 'react-router-dom';
import {
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import type { RecentSubmission } from '@p2h/shared';

import { useOverview } from '../../controllers/useOverview';
import { DataStateBox } from '../components/DataStateBox';
import { KpiTile } from '../components/KpiTile';
import { ObjectStatus } from '../components/ObjectStatus';
import { PageTitleBar } from '../components/PageTitleBar';
import { RefreshAction } from '../components/RefreshAction';
import { formatDate } from '../format';

function recentPath(row: RecentSubmission): string {
  return row.kind === 'P2H' ? `/p2h/${row.id}` : `/p5m/${row.id}`;
}

export function OverviewPage(): React.JSX.Element {
  const navigate = useNavigate();
  const overview = useOverview();
  const stats = overview.data?.stats;
  const recent = overview.data?.recent ?? [];

  return (
    <>
      <PageTitleBar
        title="Beranda"
        subtitle="Ringkasan operasional hari ini"
        actions={
          <RefreshAction
            onRefresh={() => void overview.refetch()}
            updatedAt={overview.dataUpdatedAt}
            isFetching={overview.isFetching}
          />
        }
      />

      <DataStateBox isLoading={overview.isLoading} isError={overview.isError} error={overview.error}>
        {stats ? (
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiTile label="P2H hari ini" value={stats.p2hHariIni} footer="Inspeksi masuk" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiTile label="P5M hari ini" value={stats.p5mHariIni} footer="Safety talk terlaksana" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiTile
                label="Unit STOP OPERASI"
                value={stats.unitStopOperasi}
                footer="Perlu tindak lanjut segera"
                tone={stats.unitStopOperasi > 0 ? 'danger' : 'default'}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiTile label="Temuan terbuka" value={stats.temuanTerbuka} footer="Item tidak normal hari ini" />
            </Grid>
          </Grid>
        ) : null}

        <Typography variant="h6" sx={{ mb: 1.5 }}>
          Aktivitas terbaru
        </Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Jenis</TableCell>
                <TableCell>Judul</TableCell>
                <TableCell>Petugas</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {recent.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
                      Belum ada aktivitas hari ini.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                recent.map((row) => (
                  <TableRow
                    key={`${row.kind}-${row.id}`}
                    hover
                    onClick={() => navigate(recentPath(row))}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TableCell>{row.kind}</TableCell>
                    <TableCell>{row.judul}</TableCell>
                    <TableCell>{row.petugas}</TableCell>
                    <TableCell>{formatDate(row.tanggal)}</TableCell>
                    <TableCell>
                      {row.statusKelayakan ? (
                        <ObjectStatus status={row.statusKelayakan} />
                      ) : (
                        <Typography color="text.secondary">—</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </DataStateBox>
    </>
  );
}
