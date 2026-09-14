import { Box, Divider, MenuItem, Paper, TextField, Typography } from '@mui/material';

import { useGeoMap, type TampilkanFilter } from '../../controllers/useGeoMap';
import { DataStateBox } from '../components/DataStateBox';
import { FilterBar } from '../components/FilterBar';
import { GeoMap } from '../components/map/GeoMap';
import { MapLegend } from '../components/map/MapLegend';
import { RouteList } from '../components/map/RouteList';
import { PageTitleBar } from '../components/PageTitleBar';
import { SHELL_BAR_HEIGHT } from '../layout/constants';

const TAMPILKAN_OPTIONS: { value: TampilkanFilter; label: string }[] = [
  { value: 'SEMUA', label: 'P2H & P5M' },
  { value: 'P2H', label: 'Hanya P2H' },
  { value: 'P5M', label: 'Hanya P5M' },
];

export function MapPage(): React.JSX.Element {
  const geoMap = useGeoMap();

  return (
    <>
      <PageTitleBar title="Peta" subtitle="Lokasi pemeriksaan dan rute unit" />

      <FilterBar onGo={geoMap.applyFilters} onReset={geoMap.resetFilters}>
        <TextField
          label="Tanggal dari"
          type="date"
          value={geoMap.draft.tanggalDari}
          onChange={(event) => geoMap.setTanggalDari(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          label="Tanggal sampai"
          type="date"
          value={geoMap.draft.tanggalSampai}
          onChange={(event) => geoMap.setTanggalSampai(event.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />
        <TextField
          select
          label="Unit"
          value={geoMap.draft.unitId}
          onChange={(event) => geoMap.setUnitId(event.target.value)}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="">Semua</MenuItem>
          {geoMap.unitOptions.map((unit) => (
            <MenuItem key={unit.id} value={unit.id}>
              {unit.code} — {unit.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Tampilkan"
          value={geoMap.draft.tampilkan}
          onChange={(event) => geoMap.setTampilkan(event.target.value as TampilkanFilter)}
          sx={{ minWidth: 180 }}
        >
          {TAMPILKAN_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </FilterBar>

      <DataStateBox isLoading={geoMap.isLoading} isError={geoMap.isError} error={geoMap.error}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            height: `calc(100vh - ${SHELL_BAR_HEIGHT}px - 220px)`,
            minHeight: 520,
          }}
        >
          <Paper sx={{ flexGrow: 1, minWidth: 0, overflow: 'hidden' }}>
            <GeoMap
              p2hPoints={geoMap.p2hPoints}
              p5mPoints={geoMap.p5mPoints}
              routes={geoMap.routes}
              bounds={geoMap.bounds}
              selectedUnitId={geoMap.selectedUnitId}
            />
          </Paper>

          <Paper sx={{ width: 320, flexShrink: 0, p: 2, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
            <MapLegend />

            <Divider sx={{ my: 2 }} />

            <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
              Rute unit
            </Typography>
            <RouteList routes={geoMap.routes} selectedUnitId={geoMap.selectedUnitId} onToggle={geoMap.toggleSelectedUnit} />

            <Divider sx={{ my: 2 }} />

            <Typography variant="body2" color="text.secondary">
              {geoMap.counts.p2h} titik P2H · {geoMap.counts.p5m} titik P5M · {geoMap.counts.tanpaLokasi} data tanpa lokasi
            </Typography>
          </Paper>
        </Box>
      </DataStateBox>
    </>
  );
}
