import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Autocomplete,
  Alert,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Box,
} from '@mui/material';
import type { Auftrag, AuftragCreate } from '../../types/auftrag';
import type { Materialnummer } from '../../types/material';
import { createAuftrag, updateAuftrag } from '../../api/auftraege';
import { getMaterialien } from '../../api/materialien';

// Dialog zum Anlegen oder Bearbeiten eines Auftrags
interface AuftragDialogProps {
  open: boolean;
  auftrag: Auftrag | null; // null = neuer Auftrag, sonst Bearbeitung
  onClose: () => void;
  onCreated: (auftragId: number) => void; // Neuen Auftrag-Tab öffnen
  onSaved: () => void; // Nach Bearbeitung: Liste neu laden
}

export default function AuftragDialog({ open, auftrag, onClose, onCreated, onSaved }: AuftragDialogProps) {
  const isEdit = auftrag !== null;

  // Schritt-Zustand (nur beim Anlegen relevant)
  const [step, setStep] = useState<1 | 2>(1);

  // Formularfelder
  const [datum, setDatum] = useState('');
  const [auftragsnummer, setAuftragsnummer] = useState('');
  const [stueckzahl, setStueckzahl] = useState('');
  const [kunde, setKunde] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<Materialnummer | null>(null);

  // Materialien für Autocomplete
  const [materialien, setMaterialien] = useState<Materialnummer[]>([]);

  // UI-Zustand
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Validierungsfehler
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Materialien laden wenn Dialog öffnet
  useEffect(() => {
    if (open) {
      getMaterialien().then(setMaterialien).catch(() => {});
    }
  }, [open]);

  // Beim Bearbeiten: Formular mit bestehenden Werten füllen
  useEffect(() => {
    if (open && auftrag) {
      setDatum(auftrag.datum || '');
      setAuftragsnummer(auftrag.auftragsnummer || '');
      setStueckzahl(String(auftrag.stueckzahl));
      setKunde(auftrag.kunde || '');
      // Materialnummer setzen wenn Materialien geladen sind
      if (auftrag.materialnummerId && materialien.length > 0) {
        const mat = materialien.find((m) => m.id === auftrag.materialnummerId);
        setSelectedMaterial(mat ?? null);
      }
    }
  }, [open, auftrag, materialien]);

  // Formular zurücksetzen
  const resetForm = () => {
    setStep(1);
    setDatum('');
    setAuftragsnummer('');
    setStueckzahl('');
    setKunde('');
    setSelectedMaterial(null);
    setSaving(false);
    setError(null);
    setFieldErrors({});
  };

  // Dialog schließen
  const handleClose = () => {
    resetForm();
    onClose();
  };

  // Schritt 1 validieren
  const validateStep1 = (): boolean => {
    const errors: Record<string, string> = {};

    if (!datum.trim()) {
      errors.datum = 'Datum ist ein Pflichtfeld';
    }
    if (!auftragsnummer.trim()) {
      errors.auftragsnummer = 'Auftragsnummer ist ein Pflichtfeld';
    }
    if (!isEdit) {
      // Stückzahl nur beim Anlegen pflicht
      if (!stueckzahl.trim()) {
        errors.stueckzahl = 'Stückzahl ist ein Pflichtfeld';
      } else {
        const num = parseInt(stueckzahl, 10);
        if (isNaN(num) || num < 1) {
          errors.stueckzahl = 'Stückzahl muss mindestens 1 sein';
        }
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Weiter zu Schritt 2 (nur beim Anlegen)
  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
      setError(null);
    }
  };

  // Zurück zu Schritt 1
  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  // Auftrag anlegen (Schritt 2)
  const handleCreate = async () => {
    setSaving(true);
    setError(null);

    const data: AuftragCreate = {
      datum: datum.trim(),
      auftragsnummer: auftragsnummer.trim(),
      stueckzahl: parseInt(stueckzahl, 10),
      kunde: kunde.trim() || null,
      materialnummerId: selectedMaterial?.id ?? null,
    };

    try {
      const created = await createAuftrag(data);
      onCreated(created.id);
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Anlegen des Auftrags');
    } finally {
      setSaving(false);
    }
  };

  // Auftrag bearbeiten (direkt speichern)
  const handleEditSave = async () => {
    if (!auftrag) return;

    if (!validateStep1()) return;

    setSaving(true);
    setError(null);

    const data: AuftragCreate = {
      datum: datum.trim(),
      auftragsnummer: auftragsnummer.trim(),
      stueckzahl: auftrag.stueckzahl, // Stückzahl nicht änderbar
      kunde: kunde.trim() || null,
      materialnummerId: selectedMaterial?.id ?? null,
    };

    try {
      await updateAuftrag(auftrag.id, data);
      onSaved();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern des Auftrags');
    } finally {
      setSaving(false);
    }
  };

  // Titel je nach Modus
  const dialogTitle = isEdit
    ? 'Auftrag bearbeiten'
    : (step === 1 ? 'Neuen Auftrag anlegen' : 'Eingaben überprüfen');

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{dialogTitle}</DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isEdit || step === 1 ? (
          /* Eingabefelder */
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <TextField
              label="Datum"
              placeholder="TT.MM.JJJJ"
              value={datum}
              onChange={(e) => setDatum(e.target.value)}
              required
              size="small"
              fullWidth
              error={!!fieldErrors.datum}
              helperText={fieldErrors.datum}
            />
            <TextField
              label="Auftragsnummer"
              value={auftragsnummer}
              onChange={(e) => setAuftragsnummer(e.target.value)}
              required
              size="small"
              fullWidth
              error={!!fieldErrors.auftragsnummer}
              helperText={fieldErrors.auftragsnummer}
            />
            {!isEdit && (
              <TextField
                label="Stückzahl"
                type="text"
                inputMode="numeric"
                value={stueckzahl}
                onChange={(e) => setStueckzahl(e.target.value)}
                required
                size="small"
                fullWidth
                slotProps={{ htmlInput: { pattern: '[0-9]*' } }}
                error={!!fieldErrors.stueckzahl}
                helperText={fieldErrors.stueckzahl}
              />
            )}
            <TextField
              label="Kunde"
              value={kunde}
              onChange={(e) => setKunde(e.target.value)}
              size="small"
              fullWidth
            />
            <Autocomplete
              options={materialien}
              getOptionLabel={(option) => option.nummer}
              value={selectedMaterial}
              onChange={(_, newValue) => setSelectedMaterial(newValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Materialnummer"
                  placeholder="Material auswählen..."
                  size="small"
                />
              )}
              noOptionsText="Keine Materialien gefunden"
              fullWidth
            />
          </Box>
        ) : (
          /* Schritt 2: Bestätigung (nur beim Anlegen) */
          <Paper variant="outlined" sx={{ mt: 1 }}>
            <Table size="small">
              <TableBody>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Datum:</TableCell>
                  <TableCell>{datum}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Auftragsnummer:</TableCell>
                  <TableCell>{auftragsnummer}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Stückzahl:</TableCell>
                  <TableCell>{stueckzahl}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Kunde:</TableCell>
                  <TableCell>{kunde || '—'}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold', width: '40%' }}>Materialnummer:</TableCell>
                  <TableCell>{selectedMaterial?.nummer || '—'}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Paper>
        )}
      </DialogContent>

      <DialogActions>
        {isEdit ? (
          /* Bearbeitungsmodus: direkt speichern */
          <>
            <Button onClick={handleClose} color="inherit">
              Abbrechen
            </Button>
            <Button onClick={handleEditSave} variant="contained" disabled={saving}>
              {saving ? 'Wird gespeichert...' : 'Speichern'}
            </Button>
          </>
        ) : step === 1 ? (
          /* Anlegen Schritt 1 */
          <>
            <Button onClick={handleClose} color="inherit">
              Abbrechen
            </Button>
            <Button onClick={handleNext} variant="contained">
              Weiter
            </Button>
          </>
        ) : (
          /* Anlegen Schritt 2 */
          <>
            <Button onClick={handleBack} color="inherit">
              Zurück
            </Button>
            <Button onClick={handleCreate} variant="contained" disabled={saving}>
              {saving ? 'Wird gespeichert...' : 'OK'}
            </Button>
            <Button onClick={handleClose} color="inherit">
              Abbrechen
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
