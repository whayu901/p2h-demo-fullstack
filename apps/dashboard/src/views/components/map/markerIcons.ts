import { divIcon, type CircleMarkerOptions, type DivIcon } from 'leaflet';

/**
 * Shared marker styling helpers for the Peta map and the object-page mini
 * maps, so both read the same visual language. Colors are always passed in
 * (read from the MUI theme by the caller) — never hardcoded here.
 */

/** Path options for a P2H `CircleMarker`: filled with the verdict color, white border. */
export function p2hCircleMarkerOptions(fillColor: string, borderColor: string): CircleMarkerOptions {
  return {
    radius: 8,
    color: borderColor,
    weight: 2,
    fillColor,
    fillOpacity: 1,
  };
}

/** A small diamond `DivIcon` for P5M safety talk markers, visually distinct from P2H circles. */
export function p5mDivIcon(fillColor: string, borderColor: string): DivIcon {
  return divIcon({
    className: 'p2h-p5m-marker',
    html: `<span style="display:block;width:100%;height:100%;background:${fillColor};border:2px solid ${borderColor};transform:rotate(45deg);border-radius:2px;box-sizing:border-box;"></span>`,
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -7],
  });
}
