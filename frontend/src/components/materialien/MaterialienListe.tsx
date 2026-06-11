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
import MaterialLoeschenDialog from './MaterialLoeschenDialog';
import { getMaterialien } from '../../api/materialien';
import { useTabContext } from '../../context/TabContext';
import type { Materialnummer, DeleteResult } from '../../types/material';

export default function MaterialienListe() {
  const { closeTopTab, openMaterialTab, materialSavedVersion } = useTabContext();

  const [materialien, setMaterialien] = useState<Materialnummer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [deleteTarget, setDeleteTarget] = useState<Materialnummer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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
  }, [loadMaterialien, materialSavedVersion]);

  const filtered = materialien.filter((m) =>
    m.nummer.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (material: Materialnummer) => {
    openMaterialTab('edit', material);
  };

  const handleCreate = () => {
    openMaterialTab('create');
  };

  const handleCopy = (material: Materialnummer) => {
    openMaterialTab('copy', material);
  };

  const handleDelete = (material: Materialnummer) => {
    setDeleteTarget(material);
    setDeleteDialogOpen(true);
  };

  const handleDeleted = (result: DeleteResult) => {
    if (result.affectedAuftragIds && result.affectedAuftragIds.length > 0) {
      result.affectedAuftragIds.forEach((auftragId) => {
        closeTopTab(`auftrag-${auftragId}`);
      });
    }
    loadMaterialien();
  };

  return (
    <>
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

      <MaterialLoeschenDialog
        material={deleteTarget}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDeleted={handleDeleted}
      />
    </>
  );
}
