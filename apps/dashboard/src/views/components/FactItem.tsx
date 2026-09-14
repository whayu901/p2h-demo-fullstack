import { Box, Typography } from '@mui/material';

interface FactItemProps {
  label: string;
  value: React.ReactNode;
  emphasize?: boolean;
}

/** Label-above-value pair used in Fiori-style "key facts" strips. */
export function FactItem({ label, value, emphasize = false }: FactItemProps): React.JSX.Element {
  return (
    <Box>
      <Typography variant="caption" color="text.secondary" component="div">
        {label}
      </Typography>
      <Typography
        component="div"
        sx={{ fontWeight: emphasize ? 600 : 500, fontSize: emphasize ? '1.125rem' : '0.875rem' }}
      >
        {value}
      </Typography>
    </Box>
  );
}
