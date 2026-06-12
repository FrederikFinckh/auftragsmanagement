import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import { addInstanzen } from '../../api/auftraege';
import type { InstanzUebersicht } from '../../types/instanz';

// Dialog zum Hinzufügen weiterer Instanzen zu einem bestehenden Auftrag
interface InstanzHinzufuegenDialogProps {
  auftragId: number | null;
  open: boolean;
  onClose: () => void;
  onAdded: (neueInstanzen: InstanzUebersicht[]) => void;
}

export default function InstanzHinzufuegenDialog({ auftragId, open, onClose, onAdded }: InstanzHinzufuegenDialogProps) {
  const [anzahl, setAnzahl] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Zurücksetzen wenn sich der Dialog öffnet
  const handleEnter = () => {
    setAnzahl('');
    setSaving(false);
    setError(null);
  };

  const handleSubmit = async () => {
    if (auftragId === null) return;

    const num = parseInt(anzahl, 10);
    if (isNaN(num) || num < 1) {
      setError('Bitte eine gültige Anzahl (mindestens 1) eingeben');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const neueInstanzen = await addInstanzen(auftragId, num);
      onAdded(neueInstanzen);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Hinzufügen der Instanzen');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={open && auftragId !== null}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        transition: {
          onEnter: handleEnter,
        },
      }}
    >
      <DialogTitle>Instanzen hinzufügen</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Anzahl neuer Instanzen"
          type="text"
          inputMode="numeric"
          value={anzahl}
          onChange={(e) => setAnzahl(e.target.value)}
          required
          size="small"
          fullWidth
          slotProps={{ htmlInput: { pattern: '[0-9]*' } }}
          sx={{ mt: 1 }}
          autoFocus
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Abbrechen
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={saving || !anzahl}>
          {saving ? 'Wird hinzugefügt...' : 'Hinzufügen'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
