import { Link as RouterLink, useParams } from 'react-router-dom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import {
  Box,
  Breadcrumbs,
  Chip,
  Grid,
  Link,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  alpha,
} from '@mui/material';
import {
  HASIL_ITEM_LABELS,
  PERNYATAAN_OPERATOR,
  PESAN_STOP_OPERASI,
  SHIFT_LABELS,
  UNIT_TYPE_LABELS,
} from '@p2h/shared';

import { useInspectionDetail } from '../../controllers/useInspectionDetail';
import { AnchorTabs } from '../components/AnchorTabs';
import { DataStateBox } from '../components/DataStateBox';
import { FactItem } from '../components/FactItem';
import { IntegrityChip } from '../components/IntegrityChip';
import { P2HMiniMap } from '../components/map/MiniMap';
import { ObjectStatus } from '../components/ObjectStatus';
import { PageTitleBar } from '../components/PageTitleBar';
import { Section } from '../components/Section';
import { colorForHasilItem } from '../components/statusColors';
import { TindakLanjutSection } from '../components/tindak-lanjut/TindakLanjutSection';
import { formatDate, formatDateTime, formatHashShort, formatHmKmRange, formatCoordinates } from '../format';

const ANCHOR_SECTIONS = [
  { id: 'informasi-umum', label: 'Informasi Umum' },
  { id: 'hasil-pemeriksaan', label: 'Hasil Pemeriksaan' },
  { id: 'dokumentasi', label: 'Dokumentasi' },
  { id: 'tindak-lanjut', label: 'Tindak Lanjut' },
];

export function P2HDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const detail = useInspectionDetail(id);
  const { inspection } = detail;

  return (
    <DataStateBox isLoading={detail.isLoading} isError={detail.isError} error={detail.error}>
      {inspection ? (
        <>
          <Breadcrumbs sx={{ mb: 1.5 }}>
            <Link component={RouterLink} to="/p2h" underline="hover" color="inherit">
              P2H
            </Link>
            <Typography color="text.primary">{inspection.unit.code}</Typography>
          </Breadcrumbs>

          <PageTitleBar title="Detail Inspeksi P2H" />

          <Paper sx={{ p: 3, mb: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 2 }}>
              <Box>
                <Typography variant="h4">
                  {inspection.unit.code} — {inspection.unit.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {UNIT_TYPE_LABELS[inspection.unit.type]} · {inspection.unit.site}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <IntegrityChip integritas={inspection.integritas} />
                <ObjectStatus status={inspection.statusKelayakan} size="large" />
              </Box>
            </Box>

            <Stack direction="row" spacing={4} sx={{ mt: 3, flexWrap: 'wrap', rowGap: 2 }}>
              <FactItem label="Operator" value={`${inspection.namaOperator} (NRP ${inspection.nrp})`} />
              <FactItem label="Shift" value={SHIFT_LABELS[inspection.shift]} />
              <FactItem label="HM/KM" value={formatHmKmRange(inspection.hmKmAwal, inspection.hmKmAkhir)} />
              <FactItem label="Lokasi kerja" value={inspection.lokasiKerja} />
              <FactItem label="Tanggal" value={formatDate(inspection.tanggal)} />
              <FactItem label="Dibuat" value={formatDateTime(inspection.dibuatPada)} />
              <FactItem label="Diterima" value={formatDateTime(inspection.diterimaPada)} />
            </Stack>

            {inspection.statusKelayakan === 'STOP_OPERASI' && detail.verdict ? (
              <Box
                sx={{
                  mt: 3,
                  p: 2,
                  border: '1px solid',
                  borderColor: 'error.main',
                  bgcolor: (theme) => alpha(theme.palette.error.main, 0.06),
                }}
              >
                <Typography sx={{ color: 'error.main', fontWeight: 600 }}>{PESAN_STOP_OPERASI}</Typography>
                <Box component="ul" sx={{ m: 0, mt: 1, pl: 2.5 }}>
                  {detail.verdict.itemStop.map((item) => (
                    <li key={item.key}>
                      <Typography variant="body2">{item.label}</Typography>
                    </li>
                  ))}
                </Box>
              </Box>
            ) : null}
          </Paper>

          <AnchorTabs sections={ANCHOR_SECTIONS} />

          <Section id="informasi-umum" title="Informasi Umum">
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FactItem label="Operator" value={inspection.namaOperator} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FactItem label="NRP" value={inspection.nrp} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FactItem label="Shift" value={SHIFT_LABELS[inspection.shift]} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FactItem label="Lokasi kerja" value={inspection.lokasiKerja} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FactItem label="HM/KM awal → akhir" value={formatHmKmRange(inspection.hmKmAwal, inspection.hmKmAkhir)} />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                  <FactItem label="Tanggal" value={formatDate(inspection.tanggal)} />
                </Grid>
                <Grid size={12}>
                  <Typography variant="caption" color="text.secondary" component="div">
                    Pernyataan operator
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    {inspection.pernyataanOperator ? (
                      <CheckCircleIcon fontSize="small" color="success" />
                    ) : (
                      <RadioButtonUncheckedIcon fontSize="small" color="disabled" />
                    )}
                    <Typography variant="body2">{PERNYATAAN_OPERATOR}</Typography>
                  </Box>
                </Grid>
                <Grid size={12}>
                  <FactItem label="Catatan operator" value={inspection.catatanOperator || '—'} />
                </Grid>
              </Grid>
            </Paper>
          </Section>

          <Section id="hasil-pemeriksaan" title="Hasil Pemeriksaan">
            <Stack spacing={2}>
              {detail.sections.map((group) => (
                <Paper key={group.section}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', px: 2, py: 1.5 }}>
                    <Typography sx={{ fontWeight: 600 }}>{group.label}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: group.jumlahTemuan > 0 ? 'error.main' : 'text.secondary' }}
                    >
                      {group.jumlahTemuan} temuan
                    </Typography>
                  </Box>
                  <TableContainer>
                    <Table sx={{ tableLayout: 'fixed' }}>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ width: '38%' }}>Item</TableCell>
                          <TableCell sx={{ width: '12%' }}>Kode bahaya</TableCell>
                          <TableCell sx={{ width: '14%' }}>Hasil</TableCell>
                          <TableCell>Keterangan</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {group.items.map(({ item, severity }) => (
                          <TableRow
                            key={item.key}
                            sx={{
                              bgcolor:
                                item.hasil === 'TIDAK_NORMAL'
                                  ? (theme) => alpha(theme.palette.error.main, 0.06)
                                  : 'transparent',
                            }}
                          >
                            <TableCell>{item.label}</TableCell>
                            <TableCell>
                              <Chip
                                label={item.kodeBahaya}
                                variant={severity ? 'filled' : 'outlined'}
                                color={severity === 'stop' ? 'error' : severity === 'perhatian' ? 'warning' : 'default'}
                              />
                            </TableCell>
                            <TableCell>
                              <Typography component="span" sx={{ color: `${colorForHasilItem(item.hasil)}.main`, fontWeight: 500 }}>
                                {HASIL_ITEM_LABELS[item.hasil]}
                              </Typography>
                            </TableCell>
                            <TableCell>{item.keterangan || '—'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Paper>
              ))}
            </Stack>
          </Section>

          <Section id="dokumentasi" title="Dokumentasi">
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {detail.photoUrl ? (
                    <Box
                      component="img"
                      src={detail.photoUrl}
                      alt={`Dokumentasi P2H ${inspection.unit.code}`}
                      sx={{ maxWidth: 480, width: '100%', border: '1px solid', borderColor: 'divider' }}
                    />
                  ) : (
                    <Typography color="text.secondary">Tidak ada foto</Typography>
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {inspection.latitude !== null && inspection.longitude !== null ? (
                    <P2HMiniMap
                      position={[inspection.latitude, inspection.longitude]}
                      statusKelayakan={inspection.statusKelayakan}
                      route={detail.unitRoute}
                    />
                  ) : (
                    <Typography color="text.secondary">Lokasi tidak tersedia</Typography>
                  )}
                </Box>
              </Box>
              {detail.mapsUrl ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {formatCoordinates(inspection.latitude, inspection.longitude)}
                  </Typography>
                  <Link href={detail.mapsUrl} target="_blank" rel="noreferrer">
                    Buka di Google Maps
                  </Link>
                </Box>
              ) : null}
              {inspection.integritas?.hashRecord ? (
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                  Hash bukti: <code>{formatHashShort(inspection.integritas.hashRecord)}</code>
                </Typography>
              ) : null}
            </Paper>
          </Section>

          <Section id="tindak-lanjut" title="Tindak Lanjut">
            <TindakLanjutSection inspection={inspection} />
          </Section>
        </>
      ) : null}
    </DataStateBox>
  );
}
