import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

interface AppFooterProps {
  leftOpen: boolean;
  rightOpen: boolean;
  onToggleLeft: () => void;
  onToggleRight: () => void;
}

// Fußleiste mit Sidebar-Toggle-Buttons
export default function AppFooter({ leftOpen, rightOpen, onToggleLeft, onToggleRight }: AppFooterProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        px: 2,
        py: 0.5,
        borderTop: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        minHeight: 40,
      }}
    >
      {/* Linker Bereich: Aufträge-Toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton size="small" onClick={onToggleLeft} aria-label="Aufträge-Seitenleiste umschalten">
          {leftOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
        <Typography variant="body2">Aufträge</Typography>
      </Box>

      {/* Mittlerer Bereich: Titel */}
      <Typography variant="body2" color="text.secondary">
        Auftragsverwaltung
      </Typography>

      {/* Rechter Bereich: Materialien-Toggle */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography variant="body2">Materialien</Typography>
        <IconButton size="small" onClick={onToggleRight} aria-label="Materialien-Seitenleiste umschalten">
          {rightOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </Box>
    </Box>
  );
}
