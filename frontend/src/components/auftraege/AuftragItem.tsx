import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Collapse,
  List,
  ListItemButton,
  ListItemText,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import type { Auftrag } from '../../types/auftrag';
import type { InstanzUebersicht } from '../../types/instanz';
import { getInstanzenFuerAuftrag } from '../../api/instanzen';

interface AuftragItemProps {
  auftrag: Auftrag;
  onEdit: (auftrag: Auftrag) => void;
  onDelete: (auftrag: Auftrag) => void;
  onInstanzClick: (auftrag: Auftrag, instanzId: number, instanzNr: number) => void;
}

export default function AuftragItem({ auftrag, onEdit, onDelete, onInstanzClick }: AuftragItemProps) {
  const [expanded, setExpanded] = useState(true);
  const [instanzen, setInstanzen] = useState<InstanzUebersicht[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getInstanzenFuerAuftrag(auftrag.id).then((data) => {
      if (!cancelled) {
        setInstanzen(data);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [auftrag.id]);

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
      {/* Section Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          px: 1.5,
          py: 0.75,
          bgcolor: 'action.hover',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(!expanded)}
      >
        <IconButton
          size="small"
          sx={{
            mr: 0.5,
            transform: expanded ? 'rotate(0deg)' : 'rotate(-90deg)',
            transition: 'transform 0.2s',
          }}
        >
          <ExpandMoreIcon fontSize="small" />
        </IconButton>
        <Typography variant="body2" sx={{ fontWeight: 'bold', flex: 1 }}>
          {auftrag.auftragsnummer}
        </Typography>
        {auftrag.materialVeraendert && (
          <WarningIcon sx={{ color: 'warning.main', fontSize: 16, mr: 0.5 }} />
        )}
        <IconButton
          size="small"
          onClick={(e) => { e.stopPropagation(); onEdit(auftrag); }}
        >
          <EditIcon fontSize="small" />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={(e) => { e.stopPropagation(); onDelete(auftrag); }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Instance Sub-Items */}
      <Collapse in={expanded} timeout="auto">
        <List disablePadding>
          {loading ? (
            <Typography variant="caption" color="text.secondary" sx={{ px: 4, py: 0.5 }}>
              Laden...
            </Typography>
          ) : (
            instanzen.map((inst) => (
              <ListItemButton
                key={inst.id}
                sx={{ pl: 4, py: 0.25 }}
                onClick={() => onInstanzClick(auftrag, inst.id, inst.nummer)}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Typography variant="body2">
                        {auftrag.auftragsnummer} – {inst.nummer}
                      </Typography>
                      {inst.kontrolleAbgeschlossen ? (
                        <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
                      ) : (
                        <RadioButtonUncheckedIcon sx={{ color: 'text.disabled', fontSize: 16 }} />
                      )}
                      {inst.materialVeraendert && (
                        <WarningIcon sx={{ color: 'warning.main', fontSize: 16 }} />
                      )}
                    </Box>
                  }
                />
              </ListItemButton>
            ))
          )}
        </List>
      </Collapse>
    </Box>
  );
}
