import { ListItemButton, ListItemText, Typography, Box, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import type { Auftrag } from '../../types/auftrag';

// Einzelne Auftragszeile in der linken Seitenleiste
interface AuftragItemProps {
  auftrag: Auftrag;
  onClick: (auftrag: Auftrag) => void;
  onEdit: (auftrag: Auftrag) => void;
  onDelete: (auftrag: Auftrag) => void;
}

export default function AuftragItem({ auftrag, onClick, onEdit, onDelete }: AuftragItemProps) {
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

      {/* Aktionsgruppe rechts */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onEdit(auftrag); }}
          aria-label="Auftrag bearbeiten"
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={(e) => { e.stopPropagation(); onDelete(auftrag); }}
          aria-label="Auftrag löschen"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>
    </ListItemButton>
  );
}
