import { Box } from '@mui/material';
import AuftraegeListe from '../auftraege/AuftraegeListe';

// Wrapper für die linke Seitenleiste (Aufträge)
export default function LeftSidebar() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        borderRight: 1,
        borderColor: 'divider',
      }}
    >
      <AuftraegeListe />
    </Box>
  );
}
