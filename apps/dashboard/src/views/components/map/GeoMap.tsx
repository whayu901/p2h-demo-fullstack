import { useEffect, useMemo, useState } from 'react';
import { Box, useTheme } from '@mui/material';
import type { LatLngBoundsExpression, LatLngTuple } from 'leaflet';
import { CircleMarker, LayersControl, MapContainer, Marker, Polyline, Popup, TileLayer, Tooltip, useMap } from 'react-leaflet';

import type { GeoBounds, GeoRoute, P2HGeoPoint, P5MGeoPoint } from '../../../controllers/useGeoMap';
import { colorForStatusKelayakan } from '../statusColors';
import { P2HPopupContent, P5MPopupContent } from './MapPopupContent';
import { p2hCircleMarkerOptions, p5mDivIcon } from './markerIcons';
import { TileErrorNotice } from './TileErrorNotice';

/** Default view centered on the East Kalimantan mining sites, used when there are no points. */
const DEFAULT_CENTER: LatLngTuple = [-0.85, 117.15];
const DEFAULT_ZOOM = 10;

const ESRI_SATELLITE_URL = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

interface FitToBoundsProps {
  bounds: GeoBounds | null;
}

/** Fits the map to `bounds` (or falls back to the default view) whenever it changes. */
function FitToBounds({ bounds }: FitToBoundsProps): null {
  const map = useMap();

  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds as LatLngBoundsExpression, { padding: [32, 32], maxZoom: 16 });
    } else {
      map.setView(DEFAULT_CENTER, DEFAULT_ZOOM);
    }
  }, [map, bounds]);

  return null;
}

/** Keeps Leaflet's internal size in sync when its container is resized (e.g. side nav collapse). */
function InvalidateSizeOnResize(): null {
  const map = useMap();

  useEffect(() => {
    const container = map.getContainer();
    const observer = new ResizeObserver(() => map.invalidateSize());
    observer.observe(container);
    return () => observer.disconnect();
  }, [map]);

  return null;
}

interface GeoMapProps {
  p2hPoints: readonly P2HGeoPoint[];
  p5mPoints: readonly P5MGeoPoint[];
  routes: readonly GeoRoute[];
  bounds: GeoBounds | null;
  selectedUnitId: string | null;
}

/**
 * The interactive Leaflet map: satellite/road base layers, P2H circle
 * markers, P5M diamond markers, per-unit route lines, and fit-to-bounds.
 * Purely presentational — all point/route data comes from `useGeoMap`.
 */
export function GeoMap({ p2hPoints, p5mPoints, routes, bounds, selectedUnitId }: GeoMapProps): React.JSX.Element {
  const theme = useTheme();
  const [tileError, setTileError] = useState(false);

  const tileEventHandlers = useMemo(
    () => ({
      tileerror: () => setTileError(true),
      load: () => setTileError(false),
    }),
    [],
  );

  return (
    <Box sx={{ position: 'relative', height: '100%', width: '100%' }}>
      <MapContainer center={DEFAULT_CENTER} zoom={DEFAULT_ZOOM} style={{ height: '100%', width: '100%' }}>
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Satelit">
            <TileLayer url={ESRI_SATELLITE_URL} attribution="Tiles &copy; Esri" eventHandlers={tileEventHandlers} />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Peta jalan">
            <TileLayer url={OSM_URL} attribution="&copy; OpenStreetMap contributors" eventHandlers={tileEventHandlers} />
          </LayersControl.BaseLayer>
        </LayersControl>

        {routes
          .filter((route) => route.positions.length > 1)
          .map((route) => {
            const isSelected = route.unitId === selectedUnitId;
            const isDimmed = selectedUnitId !== null && !isSelected;
            return (
              <Polyline
                key={route.unitId}
                positions={route.positions}
                pathOptions={{
                  color: theme.palette.routePalette.colors[route.colorIndex],
                  weight: isSelected ? 5 : 3,
                  opacity: isDimmed ? 0.25 : 0.85,
                }}
              />
            );
          })}

        {p2hPoints.map((point) => {
          const isDimmed = selectedUnitId !== null && selectedUnitId !== point.unitId;
          return (
            <CircleMarker
              key={point.id}
              center={point.position}
              pathOptions={{
                ...p2hCircleMarkerOptions(theme.palette[colorForStatusKelayakan(point.statusKelayakan)].main, theme.palette.common.white),
                opacity: isDimmed ? 0.3 : 1,
                fillOpacity: isDimmed ? 0.3 : 1,
              }}
            >
              <Tooltip direction="top" offset={[0, -8]}>
                #{point.sequence} dari {point.totalInUnit}
              </Tooltip>
              <Popup>
                <P2HPopupContent point={point} />
              </Popup>
            </CircleMarker>
          );
        })}

        {p5mPoints.map((point) => (
          <Marker key={point.id} position={point.position} icon={p5mDivIcon(theme.palette.info.main, theme.palette.common.white)}>
            <Popup>
              <P5MPopupContent point={point} />
            </Popup>
          </Marker>
        ))}

        <FitToBounds bounds={bounds} />
        <InvalidateSizeOnResize />
      </MapContainer>
      <TileErrorNotice visible={tileError} />
    </Box>
  );
}
