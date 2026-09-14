import { Link as RouterLink, useParams } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
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
} from '@mui/material';
import { SHIFT_LABELS } from '@p2h/shared';

import { useSafetyTalkDetail } from '../../controllers/useSafetyTalkDetail';
import { AnchorTabs } from '../components/AnchorTabs';
import { DataStateBox } from '../components/DataStateBox';
import { FactItem } from '../components/FactItem';
import { P5MMiniMap } from '../components/map/MiniMap';
import { PageTitleBar } from '../components/PageTitleBar';
import { Section } from '../components/Section';
import { formatDate, formatCoordinates } from '../format';

const ANCHOR_SECTIONS = [
  { id: 'materi', label: 'Materi' },
  { id: 'peserta', label: 'Peserta' },
  { id: 'dokumentasi', label: 'Dokumentasi' },
  { id: 'catatan', label: 'Catatan' },
];

export function P5MDetailPage(): React.JSX.Element {
  const { id } = useParams<{ id: string }>();
  const detail = useSafetyTalkDetail(id);
  const { safetyTalk } = detail;

  return (
    <DataStateBox isLoading={detail.isLoading} isError={detail.isError} error={detail.error}>
      {safetyTalk ? (
        <>
          <Breadcrumbs sx={{ mb: 1.5 }}>
            <Link component={RouterLink} to="/p5m" underline="hover" color="inherit">
              P5M
            </Link>
            <Typography color="text.primary">{safetyTalk.topik}</Typography>
          </Breadcrumbs>

          <PageTitleBar title="Detail Safety Talk P5M" />

          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4">{safetyTalk.topik}</Typography>
            <Typography variant="body2" color="text.secondary">
              {safetyTalk.departemenRegu}
            </Typography>

            <Stack direction="row" spacing={4} sx={{ mt: 3, flexWrap: 'wrap', rowGap: 2 }}>
              <FactItem label="Tanggal & jam" value={`${formatDate(safetyTalk.tanggal)} · ${safetyTalk.jamMulai}`} />
              <FactItem label="Shift" value={SHIFT_LABELS[safetyTalk.shift]} />
              <FactItem label="Lokasi area" value={safetyTalk.lokasiArea} />
              <FactItem label="Pemimpin" value={`${safetyTalk.namaPemimpin} (NRP ${safetyTalk.nrpPemimpin})`} />
              <FactItem
                label="Peserta hadir"
                value={`${detail.jumlahHadir} dari ${detail.jumlahPeserta}`}
                emphasize
              />
            </Stack>
          </Paper>

          <AnchorTabs sections={ANCHOR_SECTIONS} />

          <Section id="materi" title="Materi">
            <Paper sx={{ p: 3 }}>
              <Grid container spacing={3}>
                <Grid size={12}>
                  <FactItem label="Uraian singkat" value={safetyTalk.uraianSingkat || '—'} />
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" component="div">
                    Potensi bahaya
                  </Typography>
                  {safetyTalk.potensiBahaya.length > 0 ? (
                    <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
                      {safetyTalk.potensiBahaya.map((bahaya) => (
                        <li key={bahaya}>
                          <Typography variant="body2">{bahaya}</Typography>
                        </li>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </Grid>
                <Grid size={{ xs: 12, md: 6 }}>
                  <Typography variant="caption" color="text.secondary" component="div">
                    Komitmen pengendalian
                  </Typography>
                  {safetyTalk.komitmenPengendalian.length > 0 ? (
                    <Box component="ul" sx={{ m: 0, mt: 0.5, pl: 2.5 }}>
                      {safetyTalk.komitmenPengendalian.map((komitmen) => (
                        <li key={komitmen}>
                          <Typography variant="body2">{komitmen}</Typography>
                        </li>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      —
                    </Typography>
                  )}
                </Grid>
                <Grid size={12}>
                  <FactItem label="Informasi / pengumuman" value={safetyTalk.informasiPengumuman || '—'} />
                </Grid>
              </Grid>
            </Paper>
          </Section>

          <Section id="peserta" title="Peserta">
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>No</TableCell>
                    <TableCell>Nama</TableCell>
                    <TableCell>NRP</TableCell>
                    <TableCell>Kehadiran</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {safetyTalk.peserta.map((peserta, index) => (
                    <TableRow key={`${peserta.nrp}-${index}`}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{peserta.nama}</TableCell>
                      <TableCell>{peserta.nrp}</TableCell>
                      <TableCell>
                        <Typography component="span" sx={{ color: peserta.hadir ? 'success.main' : 'error.main', fontWeight: 500 }}>
                          {peserta.hadir ? 'Hadir' : 'Tidak hadir'}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Section>

          <Section id="dokumentasi" title="Dokumentasi">
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {detail.photoUrl ? (
                    <Box
                      component="img"
                      src={detail.photoUrl}
                      alt={`Dokumentasi P5M ${safetyTalk.topik}`}
                      sx={{ maxWidth: 480, width: '100%', border: '1px solid', borderColor: 'divider' }}
                    />
                  ) : (
                    <Typography color="text.secondary">Tidak ada foto</Typography>
                  )}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  {safetyTalk.latitude !== null && safetyTalk.longitude !== null ? (
                    <P5MMiniMap position={[safetyTalk.latitude, safetyTalk.longitude]} />
                  ) : (
                    <Typography color="text.secondary">Lokasi tidak tersedia</Typography>
                  )}
                </Box>
              </Box>
              {detail.mapsUrl ? (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 0.5 }}>
                    {formatCoordinates(safetyTalk.latitude, safetyTalk.longitude)}
                  </Typography>
                  <Link href={detail.mapsUrl} target="_blank" rel="noreferrer">
                    Buka di Google Maps
                  </Link>
                </Box>
              ) : null}
            </Paper>
          </Section>

          <Section id="catatan" title="Catatan">
            <Paper sx={{ p: 3 }}>
              <Typography variant="body2" color={safetyTalk.catatan ? 'text.primary' : 'text.secondary'}>
                {safetyTalk.catatan || '—'}
              </Typography>
            </Paper>
          </Section>
        </>
      ) : null}
    </DataStateBox>
  );
}
