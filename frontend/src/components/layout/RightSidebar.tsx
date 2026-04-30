import { Box, Typography } from '@mui/material';

// Wrapper für die rechte Seitenleiste (Materialien)
// Wird in späteren Phasen mit Inhalt gefüllt
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
      {/* Kopfbereich */}
      <Box sx={{ bgcolor: 'secondary.main', px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} gutterBottom>
          Materialnummern
        </Typography>
      </Box>

      {/* Listenbereich – Platzhalter */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Keine Materialien gefunden
        </Typography>
      </Box>

      {/* Fußbereich */}
      <Box sx={{ bgcolor: 'secondary.main', px: 1.5, py: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
          Neue Materialnummer
        </Typography>
      </Box>
    </Box>
  );
}
