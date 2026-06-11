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
import MaterialItem from './MaterialItem';
import MaterialDialog from './MaterialDialog';
import MaterialLoeschenDialog from './MaterialLoeschenDialog';
import { getMaterialien } from '../../api/materialien';
import { useTabContext } from '../../context/TabContext';
import type { Materialnummer, DeleteResult } from '../../types/material';

// Listenbereich der rechten Seitenleiste für Materialien
export default function MaterialienListe() {
  const { closeAuftragTab } = useTabContext();

  const [materialien, setMaterialien] = useState<Materialnummer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  // Dialog-Zustand
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editMaterial, setEditMaterial] = useState<Materialnummer | null>(null);
  const [templateMaterial, setTemplateMaterial] = useState<Materialnummer | null>(null);

  // Lösch-Zustand
  const [deleteTarget, setDeleteTarget] = useState<Materialnummer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
    setTemplateMaterial(null);
    setDialogOpen(true);
  };

  // Als Vorlage verwenden
  const handleCopy = (material: Materialnummer) => {
    setEditMaterial(null);
    setTemplateMaterial(material);
    setDialogOpen(true);
  };

  // Dialog geschlossen → Liste neu laden
  const handleDialogClose = () => {
    setDialogOpen(false);
    setEditMaterial(null);
    setTemplateMaterial(null);
  };

  const handleSaved = () => {
    loadMaterialien();
  };

  // Löschen starten
  const handleDelete = (material: Materialnummer) => {
    setDeleteTarget(material);
    setDeleteDialogOpen(true);
  };

  // Nach Löschung: betroffene Auftrag-Tabs schließen, Liste neu laden
  const handleDeleted = (result: DeleteResult) => {
    // Betroffene Auftrag-Tabs schließen
    if (result.affectedAuftragIds && result.affectedAuftragIds.length > 0) {
      result.affectedAuftragIds.forEach((auftragId) => {
        closeAuftragTab(auftragId);
      });
    }
    loadMaterialien();
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
                onCopy={handleCopy}
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
        template={templateMaterial}
        onClose={handleDialogClose}
        onSaved={handleSaved}
      />

      {/* Lösch-Dialog (einfach + Force) */}
      <MaterialLoeschenDialog
        material={deleteTarget}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDeleted={handleDeleted}
      />
    </>
  );
}
