import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  IconButton,
  Typography,
  Paper,
  Box,
  Divider,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import type { Materialnummer, Pruefargument, PruefargumentTyp, MaterialnummerCreate } from '../../types/material';
import { PRUEFARGUMENT_TYP_LABELS, createEmptyPruefargument } from '../../types/material';
import { createMaterial, updateMaterial } from '../../api/materialien';

// Dialog zum Anlegen und Bearbeiten von Materialnummern
interface MaterialDialogProps {
  open: boolean;
  material: Materialnummer | null; // null = Anlegen, sonst Bearbeiten
  onClose: () => void;
  onSaved: () => void; // Liste nach dem Speichern neu laden
}

export default function MaterialDialog({ open, material, onClose, onSaved }: MaterialDialogProps) {
  const isEdit = material !== null;

  // Formularzustand
  const [nummer, setNummer] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [pruefargumente, setPruefargumente] = useState<Pruefargument[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Prüfargument-Typ-Optionen
  const typOptions: PruefargumentTyp[] = ['KONTROLLHAKEN', 'TOLERANZ', 'ZAHLWERT', 'TEXT'];

  // Formular zurücksetzen wenn sich der Dialog öffnet
  useEffect(() => {
    if (open) {
      if (material) {
        setNummer(material.nummer);
        setBeschreibung(material.beschreibung || '');
        setPruefargumente(material.pruefargumente.map((a) => ({ ...a })));
      } else {
        setNummer('');
        setBeschreibung('');
        setPruefargumente([]);
      }
      setSaving(false);
      setError(null);
    }
  }, [open, material]);

  // Neues Prüfargument hinzufügen
  const handleAddPruefargument = () => {
    setPruefargumente([...pruefargumente, createEmptyPruefargument(pruefargumente.length)]);
  };

  // Prüfargument entfernen
  const handleRemovePruefargument = (index: number) => {
    setPruefargumente(pruefargumente.filter((_, i) => i !== index));
  };

  // Prüfargument-Feld aktualisieren
  const handlePruefargumentChange = (index: number, field: string, value: unknown) => {
    const updated = [...pruefargumente];
    updated[index] = { ...updated[index], [field]: value };

    // Wenn sich der Typ ändert, alle typspezifischen Werte zurücksetzen
    if (field === 'typ') {
      const newTyp = value as PruefargumentTyp;
      updated[index] = {
        ...updated[index],
        typ: newTyp,
        kontrollhakenWert: null,
        toleranzMin: null,
        toleranzMax: null,
        zahlwert: null,
        textWert: null,
      };
      // Standardwert für Kontrollhaken
      if (newTyp === 'KONTROLLHAKEN') {
        updated[index].kontrollhakenWert = false;
      }
    }

    setPruefargumente(updated);
  };

  // Speichern
  const handleSave = async () => {
    // Validierung
    if (!nummer.trim()) {
      setError('Materialnummer ist ein Pflichtfeld');
      return;
    }

    // Prüfargumente validieren
    for (let i = 0; i < pruefargumente.length; i++) {
      if (!pruefargumente[i].bezeichnung.trim()) {
        setError(`Prüfargument ${i + 1}: Bezeichnung ist ein Pflichtfeld`);
        return;
      }
    }

    setSaving(true);
    setError(null);

    const data: MaterialnummerCreate = {
      nummer: nummer.trim(),
      beschreibung: beschreibung.trim() || null,
      pruefargumente: pruefargumente.map((a, i) => ({
        ...a,
        bezeichnung: a.bezeichnung.trim(),
        reihenfolge: i,
      })),
    };

    try {
      if (isEdit && material) {
        await updateMaterial(material.id, data);
      } else {
        await createMaterial(data);
      }
      onSaved();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {isEdit ? 'Material bearbeiten' : 'Neues Material anlegen'}
      </DialogTitle>

      <DialogContent>
        {/* Fehler-Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Warnung bei Bearbeitung */}
        {isEdit && material && material.auftragCount > 0 && (
          <Alert severity="warning" sx={{ mb: 2 }}>
            Dieses Material wird in {material.auftragCount} Auftrag{material.auftragCount !== 1 ? 'en' : ''} verwendet. Änderungen an Prüfargumenten werden in alle bestehenden Instanzen synchronisiert.
          </Alert>
        )}

        {/* Grundfelder */}
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Materialnummer"
            value={nummer}
            onChange={(e) => setNummer(e.target.value)}
            required
            autoFocus
            size="small"
            fullWidth
          />
          <TextField
            label="Beschreibung"
            value={beschreibung}
            onChange={(e) => setBeschreibung(e.target.value)}
            multiline
            rows={2}
            size="small"
            fullWidth
          />
        </Box>

        {/* Trennlinie */}
        <Divider sx={{ my: 2 }} />

        {/* Kopfzeile Prüfargumente */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Prüfargumente
          </Typography>
          <Button
            variant="outlined"
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddPruefargument}
          >
            Prüfargument hinzufügen
          </Button>
        </Box>

        {/* Leerzustand */}
        {pruefargumente.length === 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
            Noch keine Prüfargumente hinzugefügt
          </Typography>
        )}

        {/* Prüfargument-Karten */}
        {pruefargumente.map((arg, index) => (
          <Paper key={index} variant="outlined" sx={{ p: 2, mb: 2 }}>
            {/* Karten-Kopfzeile */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Prüfargument {index + 1}
              </Typography>
              <IconButton
                size="small"
                color="error"
                onClick={() => handleRemovePruefargument(index)}
                title="Prüfargument entfernen"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Erste Feldreihe: Bezeichnung + Typ */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Bezeichnung"
                value={arg.bezeichnung}
                onChange={(e) => handlePruefargumentChange(index, 'bezeichnung', e.target.value)}
                required
                size="small"
                sx={{ flexGrow: 1, minWidth: 200 }}
              />
              <FormControl size="small" sx={{ minWidth: 180 }}>
                <InputLabel>Typ</InputLabel>
                <Select
                  value={arg.typ}
                  label="Typ"
                  onChange={(e) => handlePruefargumentChange(index, 'typ', e.target.value)}
                >
                  {typOptions.map((typ) => (
                    <MenuItem key={typ} value={typ}>
                      {PRUEFARGUMENT_TYP_LABELS[typ]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            {/* Typspezifische Felder */}
            <Box sx={{ mt: 1.5 }}>
              {arg.typ === 'KONTROLLHAKEN' && (
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={arg.kontrollhakenWert ?? false}
                      onChange={(e) => handlePruefargumentChange(index, 'kontrollhakenWert', e.target.checked)}
                    />
                  }
                  label="Kontrollhaken gesetzt"
                />
              )}
              {arg.typ === 'TOLERANZ' && (
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Min"
                    type="number"
                    value={arg.toleranzMin ?? ''}
                    onChange={(e) => handlePruefargumentChange(index, 'toleranzMin', e.target.value === '' ? null : parseFloat(e.target.value))}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                  <TextField
                    label="Max"
                    type="number"
                    value={arg.toleranzMax ?? ''}
                    onChange={(e) => handlePruefargumentChange(index, 'toleranzMax', e.target.value === '' ? null : parseFloat(e.target.value))}
                    size="small"
                    sx={{ flexGrow: 1 }}
                  />
                </Box>
              )}
              {arg.typ === 'ZAHLWERT' && (
                <TextField
                  label="Zahlwert"
                  type="number"
                  value={arg.zahlwert ?? ''}
                  onChange={(e) => handlePruefargumentChange(index, 'zahlwert', e.target.value === '' ? null : parseFloat(e.target.value))}
                  size="small"
                  fullWidth
                />
              )}
              {arg.typ === 'TEXT' && (
                <TextField
                  label="Text"
                  value={arg.textWert ?? ''}
                  onChange={(e) => handlePruefargumentChange(index, 'textWert', e.target.value)}
                  multiline
                  rows={2}
                  size="small"
                  fullWidth
                />
              )}
            </Box>
          </Paper>
        ))}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Abbrechen
        </Button>
        <Button onClick={handleSave} variant="contained" disabled={saving}>
          {saving ? 'Wird gespeichert...' : 'Speichern'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
