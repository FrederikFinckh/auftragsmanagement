import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Alert,
  FormControlLabel,
  Checkbox,
  Divider,
  Button,
} from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import { getInstanzDetail, updateInstanzWert, setAbgeschlossen, deleteInstanz } from '../../api/instanzen';
import { useTabContext } from '../../context/TabContext';
import InstanzInfoTabelle from './InstanzInfoTabelle';
import PruefargumentFormular from './PruefargumentFormular';
import LoadingSpinner from '../common/LoadingSpinner';
import type { InstanzDetail, InstanzWert } from '../../types/instanz';

// Haupt-Wrapper des Instanz-Tabs mit Prüfformular und Auto-Save
interface InstanzTabProps {
  instanzId: number;
}

export default function InstanzTab({ instanzId }: InstanzTabProps) {
  const { closeInstanzTab } = useTabContext();
  const [instanz, setInstanz] = useState<InstanzDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Debounce-Timer und ausstehende Änderungen
  const pendingChanges = useRef<Map<number, Record<string, unknown>>>(new Map());
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Instanz-Detail laden
  const loadInstanz = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getInstanzDetail(instanzId);
      setInstanz(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Instanz');
    } finally {
      setLoading(false);
    }
  }, [instanzId]);

  useEffect(() => {
    loadInstanz();
  }, [loadInstanz]);

  // Ausstehende Änderungen an den Server senden
  const flushChanges = useCallback(async () => {
    if (pendingChanges.current.size === 0) return;

    // Alle ausstehenden Änderungen kopieren und Map leeren
    const changes = new Map(pendingChanges.current);
    pendingChanges.current.clear();

    setSaving(true);
    try {
      // Alle Änderungen parallel senden
      const promises = Array.from(changes.entries()).map(([wertId, data]) =>
        updateInstanzWert(instanzId, wertId, data)
      );
      const results = await Promise.all(promises);

      // Lokalen State mit den Server-Antworten aktualisieren
      setInstanz((prev) => {
        if (!prev) return prev;
        const updatedWerte = prev.werte.map((w) => {
          const result = results.find((r) => r.id === w.id);
          return result ?? w;
        });
        return { ...prev, werte: updatedWerte };
      });
    } catch (err) {
      // Bei Fehler: Änderungen zurück in die Queue legen
      changes.forEach((data, wertId) => {
        if (!pendingChanges.current.has(wertId)) {
          pendingChanges.current.set(wertId, data);
        }
      });
      console.error('Auto-Save Fehler:', err);
    } finally {
      setSaving(false);
    }
  }, [instanzId]);

  // Debounce-Timer aufräumen beim Unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
        flushChanges();
      }
    };
  }, [flushChanges]);

  // Handler für Feldänderungen (mit 300ms Debounce)
  const handleWertChange = useCallback((wertId: number, data: Record<string, unknown>) => {
    // Lokalen State sofort aktualisieren (optimistisch)
    setInstanz((prev) => {
      if (!prev) return prev;
      const updatedWerte = prev.werte.map((w) => {
        if (w.id !== wertId) return w;
        return { ...w, ...data } as InstanzWert;
      });
      return { ...prev, werte: updatedWerte };
    });

    // Änderung in die Queue legen (merge mit bestehenden)
    const existing = pendingChanges.current.get(wertId) ?? {};
    pendingChanges.current.set(wertId, { ...existing, ...data });

    // Debounce-Timer zurücksetzen
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      flushChanges();
    }, 300);
  }, [flushChanges]);

  // Handler für „Kontrolle abgeschlossen"
  const handleAbgeschlossenChange = useCallback(async (_e: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    if (!instanz) return;

    // Lokal sofort aktualisieren
    setInstanz((prev) => {
      if (!prev) return prev;
      return { ...prev, kontrolleAbgeschlossen: checked };
    });

    try {
      await setAbgeschlossen(instanzId, checked);
    } catch (err) {
      // Bei Fehler: zurücksetzen
      setInstanz((prev) => {
        if (!prev) return prev;
        return { ...prev, kontrolleAbgeschlossen: !checked };
      });
      console.error('Fehler beim Setzen des Abgeschlossen-Flags:', err);
    }
  }, [instanzId, instanz]);

  // Instanz löschen
  const handleDelete = useCallback(async () => {
    if (!instanz) return;
    setDeleting(true);
    try {
      await deleteInstanz(instanz.id);
      closeInstanzTab(instanz.auftragId, instanz.id);
    } catch (err) {
      console.error('Fehler beim Löschen der Instanz:', err);
    } finally {
      setDeleting(false);
    }
  }, [instanz, closeInstanzTab]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !instanz) {
    return (
      <Typography color="error" sx={{ p: 3, textAlign: 'center' }}>
        {error ?? 'Instanz nicht gefunden'}
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      {/* Warn-Banner bei materialVeraendert */}
      {instanz.materialVeraendert && (
        <Alert
          severity="warning"
          icon={<WarningIcon />}
          sx={{ mb: 2 }}
        >
          Die Materialnummer wurde seit Auftragserstellung geändert
        </Alert>
      )}

      {/* Hauptkarte */}
      <Paper variant="outlined" sx={{ maxWidth: 600 }}>
        {/* Karten-Kopfstreifen */}
        <Box
          sx={{
            bgcolor: 'secondary.main',
            px: 2,
            py: 1,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
            Nr {instanz.nummer}
          </Typography>
        </Box>

        {/* Datentabelle */}
        <Box sx={{ px: 2, pt: 1 }}>
          <InstanzInfoTabelle instanz={instanz} />
        </Box>

        <Divider />

        {/* Prüfargument-Formular */}
        <Box sx={{ px: 2, py: 2 }}>
          <PruefargumentFormular
            werte={instanz.werte}
            onChange={handleWertChange}
          />
        </Box>

        <Divider />

        {/* Kontrolle abgeschlossen */}
        <Box sx={{ px: 2, py: 1.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={instanz.kontrolleAbgeschlossen}
                onChange={handleAbgeschlossenChange}
              />
            }
            label="Kontrolle abgeschlossen"
          />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {saving && (
              <Typography variant="caption" color="text.secondary">
                Speichern…
              </Typography>
            )}
            <Button
              size="small"
              color="error"
              variant="outlined"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? 'Wird gelöscht...' : 'Löschen'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
