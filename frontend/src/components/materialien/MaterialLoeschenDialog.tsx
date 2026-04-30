import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  TextField,
  Alert,
} from '@mui/material';
import { deleteMaterial } from '../../api/materialien';
import type { Materialnummer, DeleteResult } from '../../types/material';

// Lösch-Modal für Materialnummern: einfach + Force-Modus mit Bestätigungseingabe
interface MaterialLoeschenDialogProps {
  material: Materialnummer | null;
  open: boolean;
  onClose: () => void;
  onDeleted: (result: DeleteResult) => void;
}

export default function MaterialLoeschenDialog({ material, open, onClose, onDeleted }: MaterialLoeschenDialogProps) {
  // Phase: 'confirm' = einfache Bestätigung, 'force' = Force-Bestätigung mit Eingabe
  const [phase, setPhase] = useState<'confirm' | 'force'>('confirm');
  const [forceCount, setForceCount] = useState(0);
  const [forceInput, setForceInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zurücksetzen wenn sich das Material ändert oder der Dialog sich öffnet
  const handleEnter = () => {
    setPhase('confirm');
    setForceCount(0);
    setForceInput('');
    setDeleting(false);
    setError(null);
  };

  // Einfaches Löschen bestätigen
  const handleDeleteConfirm = async () => {
    if (!material) return;

    setDeleting(true);
    setError(null);

    try {
      const result = await deleteMaterial(material.id, false);
      onDeleted(result);
      onClose();
    } catch (err) {
      const message = err instanceof Error ? err.message : '';
      // Prüfen ob IN_USE Fehler (409)
      if (message.includes('verwendet') || message.includes('409')) {
        // Anzahl aus der Fehlermeldung extrahieren
        const countMatch = message.match(/(\d+)/);
        setForceCount(countMatch ? parseInt(countMatch[1], 10) : 0);
        setForceInput('');
        setPhase('force');
      } else {
        setError(message || 'Fehler beim Löschen');
      }
    } finally {
      setDeleting(false);
    }
  };

  // Force-Löschung bestätigen
  const handleForceDelete = async () => {
    if (!material) return;

    setDeleting(true);
    setError(null);

    try {
      const result = await deleteMaterial(material.id, true);
      onDeleted(result);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Löschen');
    } finally {
      setDeleting(false);
    }
  };

  // Force-Bestätigung: Eingabe muss mit Materialnummer übereinstimmen
  const forceInputValid = material && forceInput === material.nummer;

  return (
    <Dialog
      open={open && material !== null}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        transition: {
          onEnter: handleEnter,
        },
      }}
    >
      {phase === 'confirm' && (
        <>
          <DialogTitle>Material löschen?</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Typography>
              Soll die Materialnummer „{material?.nummer}" wirklich gelöscht werden?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Abbrechen
            </Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleting}>
              {deleting ? 'Wird gelöscht...' : 'Löschen'}
            </Button>
          </DialogActions>
        </>
      )}

      {phase === 'force' && (
        <>
          <DialogTitle>Material wird verwendet</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <Alert severity="warning" sx={{ mb: 2 }}>
              Diese Materialnummer wird in {forceCount} Auftrag{forceCount !== 1 ? 'en' : ''} verwendet.
              Beim erzwungenen Löschen werden auch alle diese Aufträge gelöscht!
            </Alert>
            <Typography variant="body2" sx={{ mb: 1 }}>
              Geben Sie „{material?.nummer}" ein, um das Löschen zu bestätigen:
            </Typography>
            <TextField
              size="small"
              fullWidth
              value={forceInput}
              onChange={(e) => setForceInput(e.target.value)}
              placeholder={material?.nummer || ''}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose} color="inherit">
              Abbrechen
            </Button>
            <Button
              onClick={handleForceDelete}
              color="error"
              variant="contained"
              disabled={deleting || !forceInputValid}
            >
              {deleting ? 'Wird gelöscht...' : 'Endgültig löschen'}
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
}
