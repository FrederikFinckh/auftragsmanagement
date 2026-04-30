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
import { deleteInstanz } from '../../api/instanzen';
import type { InstanzUebersicht } from '../../types/instanz';

// Lösch-Bestätigungsdialog für einzelne Instanzen
interface InstanzLoeschenDialogProps {
  instanz: InstanzUebersicht | null;
  auftragId: number | null;
  open: boolean;
  onClose: () => void;
  onDeleted: (auftragId: number, instanzId: number) => void;
}

export default function InstanzLoeschenDialog({ instanz, auftragId, open, onClose, onDeleted }: InstanzLoeschenDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zurücksetzen wenn sich der Dialog öffnet
  const handleEnter = () => {
    setDeleting(false);
    setError(null);
  };

  const handleDelete = async () => {
    if (!instanz || auftragId === null) return;

    setDeleting(true);
    setError(null);

    try {
      await deleteInstanz(instanz.id);
      onDeleted(auftragId, instanz.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Dialog
      open={open && instanz !== null}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        transition: {
          onEnter: handleEnter,
        },
      }}
    >
      <DialogTitle>Instanz löschen?</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Typography>
          Soll die Instanz Nr {instanz?.nummer} wirklich gelöscht werden?
          Alle zugehörigen Werte werden ebenfalls gelöscht.
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
