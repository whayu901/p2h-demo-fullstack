import { Link, useLocation } from 'react-router-dom';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import LocalShippingOutlinedIcon from '@mui/icons-material/LocalShippingOutlined';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, alpha } from '@mui/material';

import { SHELL_BAR_HEIGHT, SIDE_NAV_COLLAPSED_WIDTH, SIDE_NAV_EXPANDED_WIDTH } from './constants';

interface NavEntry {
  to: string;
  label: string;
  icon: React.ReactNode;
}

const NAV_ENTRIES: NavEntry[] = [
  { to: '/', label: 'Beranda', icon: <HomeOutlinedIcon fontSize="small" /> },
  { to: '/p2h', label: 'P2H', icon: <FactCheckOutlinedIcon fontSize="small" /> },
  { to: '/p5m', label: 'P5M', icon: <GroupsOutlinedIcon fontSize="small" /> },
  { to: '/peta', label: 'Peta', icon: <MapOutlinedIcon fontSize="small" /> },
  { to: '/unit', label: 'Unit', icon: <LocalShippingOutlinedIcon fontSize="small" /> },
];

function isSelected(pathname: string, to: string): boolean {
  if (to === '/') {
    return pathname === '/';
  }
  return pathname === to || pathname.startsWith(`${to}/`);
}

interface SideNavProps {
  collapsed: boolean;
}

/** Collapsible left navigation, icon-only when collapsed. */
export function SideNav({ collapsed }: SideNavProps): React.JSX.Element {
  const location = useLocation();
  const width = collapsed ? SIDE_NAV_COLLAPSED_WIDTH : SIDE_NAV_EXPANDED_WIDTH;

  return (
    <Drawer
      variant="permanent"
      slotProps={{
        paper: {
          sx: {
            width,
            top: SHELL_BAR_HEIGHT,
            height: `calc(100% - ${SHELL_BAR_HEIGHT}px)`,
            overflowX: 'hidden',
            borderRight: '1px solid',
            borderColor: 'divider',
            transition: (theme) => theme.transitions.create('width', { duration: theme.transitions.duration.shorter }),
          },
        },
      }}
      sx={{
        width,
        flexShrink: 0,
        transition: (theme) => theme.transitions.create('width', { duration: theme.transitions.duration.shorter }),
      }}
    >
      <List sx={{ py: 1 }}>
        {NAV_ENTRIES.map((entry) => {
          const selected = isSelected(location.pathname, entry.to);
          const item = (
            <ListItemButton
              key={entry.to}
              component={Link}
              to={entry.to}
              selected={selected}
              sx={{
                minHeight: 40,
                justifyContent: collapsed ? 'center' : 'flex-start',
                px: 2,
                borderLeft: '3px solid',
                borderLeftColor: selected ? 'primary.main' : 'transparent',
                bgcolor: selected ? (theme) => alpha(theme.palette.primary.main, 0.08) : 'transparent',
                '&:hover': {
                  bgcolor: selected
                    ? (theme) => alpha(theme.palette.primary.main, 0.12)
                    : (theme) => alpha(theme.palette.text.primary, 0.04),
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: collapsed ? 0 : 1.5,
                  color: selected ? 'primary.main' : 'text.secondary',
                }}
              >
                {entry.icon}
              </ListItemIcon>
              {!collapsed ? (
                <ListItemText
                  primary={entry.label}
                  slotProps={{
                    primary: { sx: { color: selected ? 'primary.main' : 'text.primary', fontWeight: selected ? 600 : 500 } },
                  }}
                />
              ) : null}
            </ListItemButton>
          );

          return collapsed ? (
            <Tooltip key={entry.to} title={entry.label} placement="right">
              <Box>{item}</Box>
            </Tooltip>
          ) : (
            item
          );
        })}
      </List>
    </Drawer>
  );
}
