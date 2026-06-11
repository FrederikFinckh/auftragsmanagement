import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  Checkbox,
  IconButton,
  Typography,
  Box,
  Divider,
  Alert,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Tooltip,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import type { Pruefargument, PruefargumentTyp, MaterialnummerCreate } from '../../types/material';
import { PRUEFARGUMENT_TYP_LABELS, createEmptyPruefargument } from '../../types/material';
import { createMaterial, updateMaterial, getMaterialById } from '../../api/materialien';
import { useTabContext } from '../../context/TabContext';
import type { MaterialTabData } from '../../context/TabContext';

interface MaterialTabProps {
  tab: MaterialTabData;
}

export default function MaterialTab({ tab }: MaterialTabProps) {
  const { closeTopTab, notifyMaterialSaved } = useTabContext();

  const isEdit = tab.mode === 'edit';

  const [nummer, setNummer] = useState('');
  const [beschreibung, setBeschreibung] = useState('');
  const [pruefargumente, setPruefargumente] = useState<Pruefargument[]>([]);
  const [auftragCount, setAuftragCount] = useState(0);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const typOptions: PruefargumentTyp[] = ['KONTROLLHAKEN', 'TOLERANZ', 'ZAHLWERT', 'TEXT'];

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        if (tab.mode === 'edit' && tab.materialId) {
          const data = await getMaterialById(tab.materialId);
          setNummer(data.nummer);
          setBeschreibung(data.beschreibung || '');
          setPruefargumente(data.pruefargumente.map((a) => ({ ...a })));
          setAuftragCount(data.auftragCount);
        } else if (tab.mode === 'copy' && tab.materialId) {
          const data = await getMaterialById(tab.materialId);
          setNummer('');
          setBeschreibung(data.beschreibung || '');
          setPruefargumente(data.pruefargumente.map((a) => ({ ...a, id: null })));
        } else {
          setNummer('');
          setBeschreibung('');
          setPruefargumente([]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Fehler beim Laden');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [tab]);

  const handleAddPruefargument = () => {
    setPruefargumente([...pruefargumente, createEmptyPruefargument(pruefargumente.length)]);
  };

  const handleRemovePruefargument = (index: number) => {
    setPruefargumente(pruefargumente.filter((_, i) => i !== index));
  };

  const handlePruefargumentChange = (index: number, field: string, value: unknown) => {
    const updated = [...pruefargumente];
    updated[index] = { ...updated[index], [field]: value };

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
      if (newTyp === 'KONTROLLHAKEN') {
        updated[index].kontrollhakenWert = false;
      }
    }

    setPruefargumente(updated);
  };

  const handleSave = async () => {
    if (!nummer.trim()) {
      setError('Materialnummer ist ein Pflichtfeld');
      return;
    }

    for (let i = 0; i < pruefargumente.length; i++) {
      if (!pruefargumente[i].bezeichnung.trim()) {
        setError(`Zeile ${i + 1}: Bezeichnung ist ein Pflichtfeld`);
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
      if (isEdit && tab.materialId) {
        await updateMaterial(tab.materialId, data);
      } else {
        await createMaterial(data);
      }
      notifyMaterialSaved();
      closeTopTab(tab.tabId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Speichern');
    } finally {
      setSaving(false);
    }
  };

  const renderWertCell = (arg: Pruefargument, index: number) => {
    switch (arg.typ) {
      case 'KONTROLLHAKEN':
        return (
          <Checkbox
            checked={arg.kontrollhakenWert ?? false}
            onChange={(e) => handlePruefargumentChange(index, 'kontrollhakenWert', e.target.checked)}
            size="small"
          />
        );
      case 'TOLERANZ':
        return (
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
            <TextField
              placeholder="Min"
              type="number"
              value={arg.toleranzMin ?? ''}
              onChange={(e) => handlePruefargumentChange(index, 'toleranzMin', e.target.value === '' ? null : parseFloat(e.target.value))}
              size="small"
              sx={{ width: 80 }}
            />
            <Typography variant="body2" color="text.secondary">–</Typography>
            <TextField
              placeholder="Max"
              type="number"
              value={arg.toleranzMax ?? ''}
              onChange={(e) => handlePruefargumentChange(index, 'toleranzMax', e.target.value === '' ? null : parseFloat(e.target.value))}
              size="small"
              sx={{ width: 80 }}
            />
          </Box>
        );
      case 'ZAHLWERT':
        return (
          <TextField
            placeholder="Wert"
            type="number"
            value={arg.zahlwert ?? ''}
            onChange={(e) => handlePruefargumentChange(index, 'zahlwert', e.target.value === '' ? null : parseFloat(e.target.value))}
            size="small"
            sx={{ width: 100 }}
          />
        );
      case 'TEXT':
        return (
          <TextField
            placeholder="Text"
            value={arg.textWert ?? ''}
            onChange={(e) => handlePruefargumentChange(index, 'textWert', e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          />
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography color="text.secondary">Laden...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 900 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isEdit && auftragCount > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          Dieses Material wird in {auftragCount} Auftrag{auftragCount !== 1 ? 'en' : ''} verwendet. Änderungen an Prüfargumenten werden in alle bestehenden Instanzen synchronisiert.
        </Alert>
      )}

      <Box sx={{ display: 'flex', gap: 2 }}>
        <TextField
          label="Materialnummer"
          value={nummer}
          onChange={(e) => setNummer(e.target.value)}
          required
          autoFocus
          size="small"
          sx={{ flex: 1 }}
        />
        <TextField
          label="Beschreibung"
          value={beschreibung}
          onChange={(e) => setBeschreibung(e.target.value)}
          size="small"
          sx={{ flex: 2 }}
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Prüfargumente ({pruefargumente.length})
        </Typography>
        <Button
          variant="outlined"
          size="small"
          startIcon={<AddIcon />}
          onClick={handleAddPruefargument}
        >
          Hinzufügen
        </Button>
      </Box>

      {pruefargumente.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
          Noch keine Prüfargumente hinzugefügt
        </Typography>
      ) : (
        <Table size="small" padding="none">
          <TableHead>
            <TableRow>
              <TableCell sx={{ width: 40, px: 1, py: 0.5, fontWeight: 'bold', fontSize: '0.75rem' }}>#</TableCell>
              <TableCell sx={{ px: 1, py: 0.5, fontWeight: 'bold', fontSize: '0.75rem', minWidth: 200 }}>Bezeichnung</TableCell>
              <TableCell sx={{ width: 130, px: 1, py: 0.5, fontWeight: 'bold', fontSize: '0.75rem' }}>Typ</TableCell>
              <TableCell sx={{ px: 1, py: 0.5, fontWeight: 'bold', fontSize: '0.75rem' }}>Wert</TableCell>
              <TableCell sx={{ width: 36, px: 1, py: 0.5 }} />
            </TableRow>
          </TableHead>
          <TableBody>
            {pruefargumente.map((arg, index) => (
              <TableRow key={index} hover>
                <TableCell sx={{ px: 1, py: 0.5, color: 'text.secondary', fontSize: '0.8rem' }}>
                  {index + 1}
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5 }}>
                  <TextField
                    value={arg.bezeichnung}
                    onChange={(e) => handlePruefargumentChange(index, 'bezeichnung', e.target.value)}
                    placeholder="Bezeichnung"
                    size="small"
                    fullWidth
                    variant="standard"
                  />
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5 }}>
                  <FormControl size="small" fullWidth variant="standard">
                    <Select
                      value={arg.typ}
                      onChange={(e) => handlePruefargumentChange(index, 'typ', e.target.value)}
                      disableUnderline
                    >
                      {typOptions.map((typ) => (
                        <MenuItem key={typ} value={typ} sx={{ fontSize: '0.8rem' }}>
                          {PRUEFARGUMENT_TYP_LABELS[typ]}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell sx={{ px: 1, py: 0.5 }}>
                  {renderWertCell(arg, index)}
                </TableCell>
                <TableCell sx={{ px: 0.5, py: 0.5 }}>
                  <Tooltip title="Entfernen">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleRemovePruefargument(index)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Wird gespeichert...' : 'Speichern'}
        </Button>
        <Button
          variant="outlined"
          color="inherit"
          onClick={() => closeTopTab(tab.tabId)}
        >
          Abbrechen
        </Button>
      </Box>
    </Box>
  );
}
