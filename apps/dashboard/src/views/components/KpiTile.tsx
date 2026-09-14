import { Paper, Typography } from '@mui/material';

interface KpiTileProps {
  label: string;
  value: number;
  footer?: string;
  /** 'danger' draws attention (used for the STOP OPERASI tile when it's non-zero). */
  tone?: 'default' | 'danger';
}

/** A flat Fiori-style numeric KPI tile: label, big number, optional footer. */
export function KpiTile({ label, value, footer, tone = 'default' }: KpiTileProps): React.JSX.Element {
  const isDanger = tone === 'danger';

  return (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        borderTopWidth: 3,
        borderTopStyle: 'solid',
        borderTopColor: isDanger ? 'error.main' : 'transparent',
      }}
    >
      <Typography variant="body2" color="text.secondary">
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 40,
          fontWeight: 300,
          lineHeight: 1.2,
          mt: 1,
          color: isDanger ? 'error.main' : 'text.primary',
        }}
      >
        {value}
      </Typography>
      {footer ? (
        <Typography variant="caption" color="text.secondary">
          {footer}
        </Typography>
      ) : null}
    </Paper>
  );
}
