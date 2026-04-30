import { Box } from '@mui/material';
import MaterialienListe from '../materialien/MaterialienListe';

// Wrapper für die rechte Seitenleiste (Materialien)
export default function RightSidebar() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderLeft: 1,
        borderColor: 'divider',
      }}
    >
      <MaterialienListe />
    </Box>
  );
}
