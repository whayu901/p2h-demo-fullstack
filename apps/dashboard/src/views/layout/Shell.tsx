import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';

import { useSideNav } from '../../controllers/useSideNav';
import { SHELL_BAR_HEIGHT } from './constants';
import { ShellBar } from './ShellBar';
import { SideNav } from './SideNav';

/** Application shell: fixed ShellBar + collapsible SideNav around the routed page content. */
export function Shell(): React.JSX.Element {
  const sideNav = useSideNav();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <ShellBar onToggleNav={sideNav.toggle} />
      <SideNav collapsed={sideNav.collapsed} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          mt: `${SHELL_BAR_HEIGHT}px`,
          p: 3,
          minWidth: 0,
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
