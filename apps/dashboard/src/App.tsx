import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { theme } from './theme';
import { Shell } from './views/layout/Shell';
import { MapPage } from './views/pages/MapPage';
import { OverviewPage } from './views/pages/OverviewPage';
import { P2HDetailPage } from './views/pages/P2HDetailPage';
import { P2HListPage } from './views/pages/P2HListPage';
import { P5MDetailPage } from './views/pages/P5MDetailPage';
import { P5MListPage } from './views/pages/P5MListPage';
import { UnitPage } from './views/pages/UnitPage';

const queryClient = new QueryClient();

function App(): React.JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route element={<Shell />}>
              <Route path="/" element={<OverviewPage />} />
              <Route path="/p2h" element={<P2HListPage />} />
              <Route path="/p2h/:id" element={<P2HDetailPage />} />
              <Route path="/p5m" element={<P5MListPage />} />
              <Route path="/p5m/:id" element={<P5MDetailPage />} />
              <Route path="/peta" element={<MapPage />} />
              <Route path="/unit" element={<UnitPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
