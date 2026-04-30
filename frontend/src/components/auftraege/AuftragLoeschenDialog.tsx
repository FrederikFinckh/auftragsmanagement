import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { deleteAuftrag } from '../../api/auftraege';
import type { Auftrag } from '../../types/auftrag';

// Lösch-Bestätigungsdialog für Aufträge
interface AuftragLoeschenDialogProps {
  auftrag: Auftrag | null;
  open: boolean;
  onClose: () => void;
  onDeleted: () => void;
}

export default function AuftragLoeschenDialog({ auftrag, open, onClose, onDeleted }: AuftragLoeschenDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zurücksetzen wenn sich der Dialog öffnet
  const handleEnter = () => {
    setDeleting(false);
    setError(null);
  };

  const handleDelete = async () => {
    if (!auftrag) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteAuftrag(auftrag.id);
      onDeleted();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog
      open={open && auftrag !== null}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        transition: {
          onEnter: handleEnter,
        },
      }}
    >
      <DialogTitle>Auftrag löschen?</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          Soll der Auftrag „{auftrag?.auftragsnummer}" wirklich gelöscht werden?
          Alle zugehörigen Instanzen und Werte werden ebenfalls gelöscht.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Abbrechen
        </Button>
        <Button onClick={handleDelete} color="error" variant="contained" disabled={deleting}>
          {deleting ? 'Wird gelöscht...' : 'Löschen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
