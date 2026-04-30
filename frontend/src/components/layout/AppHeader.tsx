import { AppBar, Toolbar, Typography } from '@mui/material';
import FactoryIcon from '@mui/icons-material/Factory';

// Kopfleiste der Anwendung (MUI AppBar)
export default function AppHeader() {
  return (
    <AppBar position="static" elevation={0} sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar variant="dense">
        <FactoryIcon sx={{ mr: 1.5 }} />
        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Auftragsverwaltung
        </Typography>
      </Toolbar>
    </AppBar>
  );
}
