import { Box, List, ListItemButton, ListItemText, Typography, useTheme } from '@mui/material';

import type { GeoRoute } from '../../../controllers/useGeoMap';
import { ObjectStatus } from '../ObjectStatus';

interface RouteListProps {
  routes: readonly GeoRoute[];
  selectedUnitId: string | null;
  onToggle: (unitId: string) => void;
}

/**
 * "Rute unit" list: one row per unit with its route color swatch, label,
 * point count, and latest status. Clicking a row fits/highlights that
 * unit's route on the map (selection state lives in the controller).
 */
export function RouteList({ routes, selectedUnitId, onToggle }: RouteListProps): React.JSX.Element {
  const theme = useTheme();

  if (routes.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        Tidak ada rute unit untuk filter ini.
      </Typography>
    );
  }

  return (
    <List dense disablePadding>
      {routes.map((route) => (
        <ListItemButton
          key={route.unitId}
          selected={route.unitId === selectedUnitId}
          onClick={() => onToggle(route.unitId)}
          sx={{ alignItems: 'flex-start', gap: 1, borderRadius: 1, mb: 0.5 }}
        >
          <Box
            sx={{
              width: 14,
              height: 3,
              borderRadius: 1,
              flexShrink: 0,
              mt: '9px',
              bgcolor: theme.palette.routePalette.colors[route.colorIndex],
            }}
          />
          <ListItemText
            primary={route.unitLabel}
            secondary={
              <>
                <Box component="span" sx={{ display: 'block' }}>{`${route.pointCount} titik`}</Box>
                <ObjectStatus status={route.latestStatus} />
              </>
            }
            slotProps={{ primary: { sx: { fontWeight: 500 } }, secondary: { component: 'div' } }}
          />
        </ListItemButton>
      ))}
    </List>
  );
}
