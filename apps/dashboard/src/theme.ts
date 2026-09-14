import { createTheme } from '@mui/material/styles';

import font72Bold from '@sap-theming/theming-base-content/content/Base/baseLib/baseTheme/fonts/72-Bold.woff2';
import font72Regular from '@sap-theming/theming-base-content/content/Base/baseLib/baseTheme/fonts/72-Regular.woff2';

/**
 * This is the ONLY place colors, spacing, and typography are defined for the
 * dashboard. Everywhere else must reference theme tokens (`theme.palette.*`,
 * `theme.spacing`, etc.) rather than hardcoded values, so the app reads like
 * SAP Fiori 3 / Horizon rather than a generic Material admin template.
 */

interface ShellPaletteColor {
  main: string;
  contrastText: string;
}

interface NeutralPaletteColor {
  main: string;
  contrastText: string;
}

interface TableHeaderPalette {
  background: string;
}

interface RoutePalette {
  /** Ordered, distinct, sober colors assigned to unit routes on the Peta map. */
  colors: readonly string[];
}

declare module '@mui/material/styles' {
  interface Palette {
    /** Dark blue-grey used by the top ShellBar, like SAP Fiori's shell header. */
    shell: ShellPaletteColor;
    /** Muted grey for "N/A" / not-applicable / unknown states. */
    neutral: NeutralPaletteColor;
    /** Background used behind table header cells. */
    tableHeader: TableHeaderPalette;
    /** Colors assigned deterministically (by unit code order) to unit routes on the map. */
    routePalette: RoutePalette;
  }

  interface PaletteOptions {
    shell?: ShellPaletteColor;
    neutral?: NeutralPaletteColor;
    tableHeader?: TableHeaderPalette;
    routePalette?: RoutePalette;
  }
}

const fontFaceStyles = `
  @font-face {
    font-family: '72';
    src: url(${font72Regular}) format('woff2');
    font-weight: 400;
    font-style: normal;
    font-display: swap;
  }
  @font-face {
    font-family: '72';
    src: url(${font72Bold}) format('woff2');
    font-weight: 700;
    font-style: normal;
    font-display: swap;
  }
`;

const borderRadiusPx = 4;

/**
 * Palette defined up front (instead of inline in `createTheme`) so the
 * Leaflet CSS overrides below can reference the same tokens (e.g. `divider`)
 * without duplicating a color literal.
 */
const palette = {
  mode: 'light' as const,
  primary: { main: '#0A6ED1' },
  background: { default: '#F5F6F7', paper: '#FFFFFF' },
  success: { main: '#107E3E' },
  warning: { main: '#E9730C' },
  error: { main: '#BB0000' },
  info: { main: '#0A6ED1' },
  text: { primary: '#32363A', secondary: '#6A6D70' },
  divider: '#E5E5E5',
  shell: { main: '#354A5F', contrastText: '#FFFFFF' },
  neutral: { main: '#6A6D70', contrastText: '#FFFFFF' },
  tableHeader: { background: '#F5F6F7' },
  routePalette: {
    colors: [
      '#5B8FF9',
      '#5AD8A6',
      '#F6BD16',
      '#9270CA',
      '#6DC8EC',
      '#FF9D4D',
      '#269A99',
      '#B37FEB',
    ],
  },
};

/**
 * Minimal overrides so Leaflet's own popup/control chrome reads as flat
 * Fiori rather than default Leaflet styling: small radius, no heavy shadow.
 */
const leafletOverrides = `
  .leaflet-popup-content-wrapper {
    border-radius: ${borderRadiusPx}px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.16);
  }
  .leaflet-popup-tip {
    box-shadow: none;
  }
  .leaflet-control-layers {
    border-radius: ${borderRadiusPx}px;
    border: 1px solid ${palette.divider};
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.16);
  }
  .leaflet-control-layers-toggle {
    border-radius: ${borderRadiusPx}px;
  }
  .leaflet-bar {
    border-radius: ${borderRadiusPx}px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.16);
  }
  .leaflet-bar a {
    border-radius: 0;
  }
`;

export const theme = createTheme({
  palette,
  typography: {
    fontFamily: '"72", "72full", Arial, Helvetica, sans-serif',
    fontSize: 14,
    h1: { fontWeight: 600, fontSize: '2rem' },
    h2: { fontWeight: 600, fontSize: '1.625rem' },
    h3: { fontWeight: 600, fontSize: '1.375rem' },
    h4: { fontWeight: 600, fontSize: '1.125rem' },
    h5: { fontWeight: 600, fontSize: '1rem' },
    h6: { fontWeight: 600, fontSize: '0.9375rem' },
    button: { fontWeight: 600 },
  },
  shape: {
    borderRadius: borderRadiusPx,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `${fontFaceStyles}\n${leafletOverrides}`,
    },
    MuiPaper: {
      defaultProps: {
        elevation: 0,
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          boxShadow: 'none',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.16)',
        },
      },
    },
    MuiPopover: {
      styleOverrides: {
        paper: {
          boxShadow: '0 1px 4px rgba(0, 0, 0, 0.16)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 4,
        },
      },
    },
    MuiTable: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: ({ theme }) => ({
          '& .MuiTableCell-root': {
            backgroundColor: theme.palette.tableHeader.background,
            fontWeight: 600,
            borderBottom: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.primary,
          },
        }),
      },
    },
    MuiTableRow: {
      styleOverrides: {
        root: {
          '&:last-child .MuiTableCell-root': {
            borderBottom: 'none',
          },
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
      },
    },
    MuiSelect: {
      defaultProps: {
        size: 'small',
      },
    },
    MuiChip: {
      defaultProps: {
        size: 'small',
      },
      styleOverrides: {
        root: {
          borderRadius: 4,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});
