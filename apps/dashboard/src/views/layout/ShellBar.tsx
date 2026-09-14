import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { AppBar, Avatar, Box, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material';

import { SHELL_BAR_HEIGHT } from './constants';
import { ResetDemoDialog } from './ResetDemoDialog';

interface ShellBarProps {
  onToggleNav: () => void;
}

/** Top-level product bar, styled after SAP Fiori's ShellBar. */
export function ShellBar({ onToggleNav }: ShellBarProps): React.JSX.Element {
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  function openResetDialog(): void {
    setMenuAnchor(null);
    setResetDialogOpen(true);
  }

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
          <MenuItem onClick={openResetDialog}>Reset demo data</MenuItem>
        </Menu>
        <ResetDemoDialog open={resetDialogOpen} onClose={() => setResetDialogOpen(false)} />

        <Avatar sx={{ width: 28, height: 28, ml: 1.5, bgcolor: 'primary.main', fontSize: '0.75rem' }}>WS</Avatar>
      </Toolbar>
    </AppBar>
  );
}
