import { Box, Button, Paper } from '@mui/material';

interface FilterBarProps {
  children: React.ReactNode;
  onGo: () => void;
  onReset: () => void;
}

/** Flat Fiori-style filter bar shell: filter fields plus Go/Reset actions. */
export function FilterBar({ children, onGo, onReset }: FilterBarProps): React.JSX.Element {
  return (
    <Paper sx={{ p: 2, mb: 2, display: 'flex', gap: 2, alignItems: 'flex-end', flexWrap: 'wrap' }}>
      {children}
      <Box sx={{ display: 'flex', gap: 1, ml: 'auto' }}>
        <Button variant="contained" onClick={onGo}>
          Go
        </Button>
        <Button variant="text" onClick={onReset}>
          Reset
        </Button>
      </Box>
    </Paper>
  );
}
