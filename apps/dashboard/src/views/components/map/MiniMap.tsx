import { useEffect } from 'react';
import { Box, useTheme } from '@mui/material';
import type { LatLngTuple } from 'leaflet';
import { CircleMarker, MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet';
import type { StatusKelayakan } from '@p2h/shared';

import { colorForStatusKelayakan } from '../statusColors';
import { p2hCircleMarkerOptions, p5mDivIcon } from './markerIcons';

const MINI_MAP_ZOOM = 15;
const MINI_MAP_HEIGHT = 260;
const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

interface RecenterProps {
  center: LatLngTuple;
}

/** Keeps the mini map centered on `center` if the record it shows changes. */
function Recenter({ center }: RecenterProps): null {
  const map = useMap();
  useEffect(() => {
    map.setView(center, MINI_MAP_ZOOM);
  }, [map, center]);
  return null;
}

interface MiniMapShellProps {
  center: LatLngTuple;
  children: React.ReactNode;
}

/** Shared non-interactive-ish map shell (fixed small height, no scroll-wheel zoom) for object pages. */
function MiniMapShell({ center, children }: MiniMapShellProps): React.JSX.Element {
  return (
    <Box sx={{ height: MINI_MAP_HEIGHT, width: '100%', border: '1px solid', borderColor: 'divider' }}>
      <MapContainer center={center} zoom={MINI_MAP_ZOOM} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer url={OSM_URL} attribution="&copy; OpenStreetMap contributors" />
        <Recenter center={center} />
        {children}
      </MapContainer>
    </Box>
  );
}

interface P2HMiniMapProps {
  position: [number, number];
  statusKelayakan: StatusKelayakan;
  /** This unit's full route (including `position`); rendered faintly, current point emphasized. */
  route: [number, number][];
}

/** Mini map shown in the P2H object page's Dokumentasi section. */
export function P2HMiniMap({ position, statusKelayakan, route }: P2HMiniMapProps): React.JSX.Element {
  const theme = useTheme();
  const color = theme.palette[colorForStatusKelayakan(statusKelayakan)].main;

  return (
    <MiniMapShell center={position}>
      {route.length > 1 ? <Polyline positions={route} pathOptions={{ color, weight: 3, opacity: 0.4 }} /> : null}
      <CircleMarker center={position} pathOptions={p2hCircleMarkerOptions(color, theme.palette.common.white)} />
    </MiniMapShell>
  );
}

interface P5MMiniMapProps {
  position: [number, number];
}

/** Mini map shown in the P5M object page's Dokumentasi section. */
export function P5MMiniMap({ position }: P5MMiniMapProps): React.JSX.Element {
  const theme = useTheme();

  return (
    <MiniMapShell center={position}>
      <Marker position={position} icon={p5mDivIcon(theme.palette.info.main, theme.palette.common.white)} />
    </MiniMapShell>
  );
}
