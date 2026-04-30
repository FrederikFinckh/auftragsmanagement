import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  TextField,
  List,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import LoadingSpinner from '../common/LoadingSpinner';
import MaterialItem from './MaterialItem';
import MaterialDialog from './MaterialDialog';
import { getMaterialien, deleteMaterial } from '../../api/materialien';
import type { Materialnummer } from '../../types/material';

// Listenbereich der rechten Seitenleiste für Materialien
export default function MaterialienListe() {
  const [materialien, setMaterialien] = useState<Materialnummer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Dialog-Zustand
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMaterial, setEditMaterial] = useState<Materialnummer | null>(null);

  // Lösch-Zustand
  const [deleteTarget, setDeleteTarget] = useState<Materialnummer | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleteForceOpen, setDeleteForceOpen] = useState(false);
  const [deleteForceCount, setDeleteForceCount] = useState(0);
  const [deleteForceInput, setDeleteForceInput] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // Materialien laden
  const loadMaterialien = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMaterialien();
      setMaterialien(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Materialien');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMaterialien();
  }, [loadMaterialien]);

  // Suche filtert lokal nach Nummer
  const filtered = materialien.filter((m) =>
    m.nummer.toLowerCase().includes(search.toLowerCase())
  );

  // Bearbeiten öffnen
  const handleEdit = (material: Materialnummer) => {
    setEditMaterial(material);
    setDialogOpen(true);
  };

  // Neues Material anlegen öffnen
  const handleCreate = () => {
    setEditMaterial(null);
    setDialogOpen(true);
  };

  // Dialog geschlossen → Liste neu laden
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditMaterial(null);
  };

  const handleSaved = () => {
    loadMaterialien();
  };

  // Löschen starten
  const handleDelete = (material: Materialnummer) => {
    setDeleteTarget(material);
    setDeleteError(null);
    setDeleteConfirmOpen(true);
  };

  // Einfaches Löschen bestätigen
  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteMaterial(deleteTarget.id, false);
      setDeleteConfirmOpen(false);
      setDeleteTarget(null);
      loadMaterialien();
    } catch (err) {
      // Prüfen ob IN_USE Fehler (409)
      const message = err instanceof Error ? err.message : '';
      if (message.includes('verwendet') || message.includes('409')) {
        // Force-Lösch-Dialog öffnen
        setDeleteConfirmOpen(false);
        // Versuche die Anzahl aus der Fehlermeldung zu extrahieren
        const countMatch = message.match(/(\d+)/);
        setDeleteForceCount(countMatch ? parseInt(countMatch[1], 10) : 0);
        setDeleteForceInput('');
        setDeleteForceOpen(true);
      } else {
        setDeleteError(message || 'Fehler beim Löschen');
      }
    } finally {
      setDeleting(false);
    }
  };

  // Force-Löschung bestätigen
  const handleForceDelete = async () => {
    if (!deleteTarget) return;

    setDeleting(true);
    setDeleteError(null);

    try {
      await deleteMaterial(deleteTarget.id, true);
      setDeleteForceOpen(false);
      setDeleteTarget(null);
      loadMaterialien();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Fehler beim Löschen');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {/* Kopfbereich */}
      <Box sx={{ bgcolor: 'secondary.main', px: 2, py: 1.5 }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }} gutterBottom>
          Materialnummern
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
            Fehler beim Laden der Materialien
          </Typography>
        ) : filtered.length === 0 ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2, textAlign: 'center' }}>
            Keine Materialien gefunden
          </Typography>
        ) : (
          <List disablePadding>
            {filtered.map((material) => (
              <MaterialItem
                key={material.id}
                material={material}
                onEdit={handleEdit}
                onDelete={handleDelete}
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
          onClick={handleCreate}
        >
          Neue Materialnummer
        </Button>
      </Box>

      {/* Anlegen/Bearbeiten-Dialog */}
      <MaterialDialog
        open={dialogOpen}
        material={editMaterial}
        onClose={handleDialogClose}
        onSaved={handleSaved}
      />

      {/* Einfacher Lösch-Bestätigungsdialog */}
      <Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Material löschen?</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Typography>
            Soll die Materialnummer „{deleteTarget?.nummer}" wirklich gelöscht werden?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)} color="inherit">
            Abbrechen
          </Button>
          <Button onClick={handleDeleteConfirm} color="error" variant="contained" disabled={deleting}>
            {deleting ? 'Wird gelöscht...' : 'Löschen'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Force-Lösch-Bestätigungsdialog */}
      <Dialog open={deleteForceOpen} onClose={() => setDeleteForceOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Material wird verwendet</DialogTitle>
        <DialogContent>
          {deleteError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {deleteError}
            </Alert>
          )}
          <Alert severity="warning" sx={{ mb: 2 }}>
            Diese Materialnummer wird in {deleteForceCount} Auftrag{deleteForceCount !== 1 ? 'en' : ''} verwendet.
            Beim erzwungenen Löschen werden auch alle diese Aufträge gelöscht!
          </Alert>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Geben Sie „{deleteTarget?.nummer}" ein, um das Löschen zu bestätigen:
          </Typography>
          <TextField
            size="small"
            fullWidth
            value={deleteForceInput}
            onChange={(e) => setDeleteForceInput(e.target.value)}
            placeholder={deleteTarget?.nummer || ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteForceOpen(false)} color="inherit">
            Abbrechen
          </Button>
          <Button
            onClick={handleForceDelete}
            color="error"
            variant="contained"
            disabled={deleting || deleteForceInput !== deleteTarget?.nummer}
          >
            {deleting ? 'Wird gelöscht...' : 'Löschen erzwingen'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
