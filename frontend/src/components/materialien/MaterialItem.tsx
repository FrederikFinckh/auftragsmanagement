import { useState } from 'react';
import {
  Box,
  ListItemButton,
  ListItemText,
  IconButton,
  Typography,
  Collapse,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import PruefargumentItem from './PruefargumentItem';
import type { Materialnummer } from '../../types/material';

// Einzelne Materialzeile mit Aufklapp-Funktion für Prüfargumente
interface MaterialItemProps {
  material: Materialnummer;
  onEdit: (material: Materialnummer) => void;
  onDelete: (material: Materialnummer) => void;
}

export default function MaterialItem({ material, onEdit, onDelete }: MaterialItemProps) {
  const [expanded, setExpanded] = useState(false);

  const hasPruefargumente = material.pruefargumente.length > 0;

  return (
    <>
      <ListItemButton
        sx={{ borderBottom: 1, borderColor: 'divider' }}
        onClick={() => hasPruefargumente && setExpanded(!expanded)}
      >
        <ListItemText
          primary={
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {material.nummer}
            </Typography>
          }
          secondary={
            hasPruefargumente
              ? `${material.pruefargumente.length} Prüfargument${material.pruefargumente.length !== 1 ? 'e' : ''}`
              : null
          }
        />

        {/* Aktionsgruppe rechts */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 1 }}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onEdit(material); }}
            aria-label="Material bearbeiten"
          >
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => { e.stopPropagation(); onDelete(material); }}
            aria-label="Material löschen"
          >
            <DeleteIcon fontSize="small" />
          </IconButton>
          {hasPruefargumente && (
            <IconButton size="small" aria-label="Prüfargumente aufklappen">
              {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </IconButton>
          )}
        </Box>
      </ListItemButton>

      {/* Aufgeklappter Unterbereich */}
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <Box sx={{ bgcolor: 'action.hover', px: 1, py: 1, pl: 2 }}>
          {/* Beschreibung falls vorhanden */}
          {material.beschreibung && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {material.beschreibung}
            </Typography>
          )}

          {/* Prüfargumente */}
          {hasPruefargumente ? (
            material.pruefargumente.map((arg) => (
              <PruefargumentItem key={arg.id ?? arg.reihenfolge} arg={arg} />
            ))
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center' }}>
              Keine Prüfargumente
            </Typography>
          )}
        </Box>
      </Collapse>
    </>
  );
}
