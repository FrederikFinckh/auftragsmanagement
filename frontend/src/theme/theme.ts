import { createTheme } from '@mui/material/styles';

// MUI-Theme für die Auftragsverwaltung
// Sekundärfarbe als getönter Akzent für Kopf-/Fußleisten und Seitenleisten-Header
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#e0e0e0',
      contrastText: '#424242',
    },
    background: {
      default: '#fafafa',
    },
  },
  typography: {
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 600,
    },
    subtitle2: {
      fontWeight: 700,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          minHeight: 42,
        },
      },
    },
  },
});

export default theme;
