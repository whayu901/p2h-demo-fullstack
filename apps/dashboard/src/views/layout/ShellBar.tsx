import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  IconButton,
  ListItemIcon,
  ListSubheader,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  alpha,
} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { PERAN, PERAN_LABELS, type Peran } from '@p2h/shared';

import { useSesi } from '../../controllers/useSesi';
import { formatInitials } from '../format';
import { SHELL_BAR_HEIGHT } from './constants';
import { ResetDemoDialog } from './ResetDemoDialog';

interface ShellBarProps {
  onToggleNav: () => void;
}

/** Top-level product bar, styled after SAP Fiori's ShellBar. */
export function ShellBar({ onToggleNav }: ShellBarProps): React.JSX.Element {
  const sesi = useSesi();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = useState<HTMLElement | null>(null);
  const [roleMenuAnchor, setRoleMenuAnchor] = useState<HTMLElement | null>(null);

  function openResetDialog(): void {
    setMenuAnchor(null);
    setResetDialogOpen(true);
  }

  function pickRole(peran: Peran): void {
    sesi.setPeranSimulasi(peran);
    setRoleMenuAnchor(null);
  }

  const bolehReset = sesi.boleh('admin:reset');
  const namaPengguna = sesi.pengguna?.nama ?? 'Pengguna';

  return (
    <AppBar position="fixed" sx={{ bgcolor: 'shell.main', color: 'shell.contrastText', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar variant="dense" disableGutters sx={{ minHeight: SHELL_BAR_HEIGHT, height: SHELL_BAR_HEIGHT, px: 1.5 }}>
        <IconButton onClick={onToggleNav} sx={{ color: 'inherit', mr: 1 }} aria-label="Buka/tutup navigasi">
          <MenuIcon fontSize="small" />
        </IconButton>

        <Typography variant="subtitle1" sx={{ fontWeight: 700, letterSpacing: 0.2 }}>
          Mining Field Ops
        </Typography>

        <Box sx={{ flexGrow: 1 }} />

        {!sesi.authAktif ? (
          <>
            <Chip
              label="Mode demo"
              onClick={(event) => setRoleMenuAnchor(event.currentTarget)}
              sx={{
                mr: 1.5,
                color: 'inherit',
                bgcolor: (theme) => alpha(theme.palette.common.white, 0.16),
                fontWeight: 600,
                cursor: 'pointer',
              }}
            />
            <Menu anchorEl={roleMenuAnchor} open={roleMenuAnchor !== null} onClose={() => setRoleMenuAnchor(null)}>
              <ListSubheader>Lihat sebagai</ListSubheader>
              {PERAN.map((peran) => (
                <MenuItem key={peran} selected={sesi.peranSimulasi === peran} onClick={() => pickRole(peran)}>
                  {sesi.peranSimulasi === peran ? (
                    <ListItemIcon>
                      <CheckIcon fontSize="small" />
                    </ListItemIcon>
                  ) : null}
                  <Typography sx={{ pl: sesi.peranSimulasi === peran ? 0 : 4.5 }}>{PERAN_LABELS[peran]}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </>
        ) : null}

        <IconButton sx={{ color: 'inherit' }} aria-label="Cari">
          <SearchOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton sx={{ color: 'inherit' }} aria-label="Notifikasi">
          <NotificationsNoneOutlinedIcon fontSize="small" />
        </IconButton>
        <IconButton
          sx={{ color: 'inherit' }}
          aria-label="Menu lainnya"
          onClick={(event) => setMenuAnchor(event.currentTarget)}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={menuAnchor !== null} onClose={() => setMenuAnchor(null)}>
          {bolehReset ? (
            <MenuItem onClick={openResetDialog}>Reset demo data</MenuItem>
          ) : (
            <Tooltip title="Hanya Administrator yang dapat mereset data demo.">
              <span>
                <MenuItem disabled>Reset demo data</MenuItem>
              </span>
            </Tooltip>
          )}
        </Menu>
        <ResetDemoDialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)} />

        <IconButton
          sx={{ ml: 1.5, p: 0.25 }}
          aria-label="Menu pengguna"
          onClick={(event) => setUserMenuAnchor(event.currentTarget)}
        >
          <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main', fontSize: '0.75rem' }}>
            {formatInitials(namaPengguna)}
          </Avatar>
        </IconButton>
        <Menu anchorEl={userMenuAnchor} open={userMenuAnchor !== null} onClose={() => setUserMenuAnchor(null)}>
          <Box sx={{ px: 2, py: 1, minWidth: 200 }}>
            <Typography sx={{ fontWeight: 600 }}>{namaPengguna}</Typography>
            <Typography variant="body2" color="text.secondary">
              NRP {sesi.pengguna?.nrp ?? '—'}
            </Typography>
          </Box>
          <Divider />
          {(sesi.pengguna?.peran ?? []).map((peran) => (
            <MenuItem key={peran} disabled dense>
              {PERAN_LABELS[peran]}
            </MenuItem>
          ))}
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
