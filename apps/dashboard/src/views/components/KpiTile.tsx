import { Paper, Typography } from '@mui/material';

interface KpiTileProps {
  label: string;
  value: number;
  footer?: string;
  /** 'danger' draws attention with error color, 'warning' with warning color. */
  tone?: 'default' | 'danger' | 'warning';
}

const TONE_COLOR: Record<'danger' | 'warning', string> = {
  danger: 'error.main',
  warning: 'warning.main',
};

/** A flat Fiori-style numeric KPI tile: label, big number, optional footer. */
export function KpiTile({ label, value, footer, tone = 'default' }: KpiTileProps): React.JSX.Element {
  const accentColor = tone === 'default' ? undefined : TONE_COLOR[tone];

  return (
    <Paper
      sx={{
        p: 2,
        height: '100%',
        borderTopWidth: 3,
        borderTopStyle: 'solid',
        borderTopColor: accentColor ?? 'transparent',
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
          color: accentColor ?? 'text.primary',
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
