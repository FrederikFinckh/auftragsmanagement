import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  List,
  Button,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LoadingSpinner from '../common/LoadingSpinner';
import AuftragItem from './AuftragItem';
import AuftragDialog from './AuftragDialog';
import { getAuftraege } from '../../api/auftraege';
import type { Auftrag } from '../../types/auftrag';

// Listenbereich der linken Seitenleiste für Aufträge
interface AuftraegeListeProps {
  onAuftragClick?: (auftrag: Auftrag) => void;
}

export default function AuftraegeListe({ onAuftragClick }: AuftraegeListeProps) {
  const [auftraege, setAuftraege] = useState<Auftrag[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Dialog-Zustand
  const [dialogOpen, setDialogOpen] = useState(false);

  // Aufträge laden
  const loadAuftraege = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAuftraege();
      setAuftraege(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Aufträge');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAuftraege();
  }, [loadAuftraege]);

  // Suche filtert lokal nach Auftragsnummer und Kunde
  const filtered = auftraege.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.auftragsnummer.toLowerCase().includes(q) ||
      (a.kunde && a.kunde.toLowerCase().includes(q))
    );
  });

  // Auftrag angeklickt
  const handleClick = (auftrag: Auftrag) => {
    if (onAuftragClick) {
      onAuftragClick(auftrag);
    }
  };

  // Auftrag erstellt
  const handleCreated = (_auftragId: number) => {
    loadAuftraege();
  };

  return (
    <>
      {/* Kopfbereich */}
      <Box sx={{ bgcolor: 'secondary.main', px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} gutterBottom>
          Auftragsnummern
        </Typography>
        <TextField
          size="small"
          placeholder="Suchen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
          sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* Listenbereich */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <Typography color="error" sx={{ p: 2, textAlign: 'center' }}>
            Fehler beim Laden der Aufträge
          </Typography>
        ) : filtered.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            Keine Aufträge gefunden
          </Typography>
        ) : (
          <List disablePadding>
            {filtered.map((auftrag) => (
              <AuftragItem
                key={auftrag.id}
                auftrag={auftrag}
                onClick={handleClick}
              />
            ))}
          </List>
        )}
      </Box>

      {/* Fußbereich */}
      <Box sx={{ bgcolor: 'secondary.main', px: 1.5, py: 1 }}>
        <Button
          variant="contained"
          fullWidth
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Neuer Auftrag
        </Button>
      </Box>

      {/* Auftrag-Dialog */}
      <AuftragDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
