import { Box, Typography } from '@mui/material';

interface PageTitleBarProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
}

/** Title bar shown at the top of every page: title/subtitle left, actions right. */
export function PageTitleBar({ title, subtitle, actions }: PageTitleBarProps): React.JSX.Element {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: 2,
        mb: 2,
      }}
    >
      <Box>
        <Typography variant="h4">{title}</Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Box>
      {actions ? <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>{actions}</Box> : null}
    </Box>
  );
}
