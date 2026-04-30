import { ListItemButton, ListItemText, Typography, Box } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import type { Auftrag } from '../../types/auftrag';

// Einzelne Auftragszeile in der linken Seitenleiste
interface AuftragItemProps {
  auftrag: Auftrag;
  onClick: (auftrag: Auftrag) => void;
}

export default function AuftragItem({ auftrag, onClick }: AuftragItemProps) {
  return (
    <ListItemButton
      sx={{ borderBottom: 1, borderColor: 'divider' }}
      onClick={() => onClick(auftrag)}
    >
      <ListItemText
        primary={
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {auftrag.auftragsnummer}
            </Typography>
            {auftrag.materialVeraendert && (
              <WarningIcon sx={{ color: 'warning.main', fontSize: 18 }} />
            )}
          </Box>
        }
        secondary={auftrag.kunde || null}
      />
    </ListItemButton>
  );
}
