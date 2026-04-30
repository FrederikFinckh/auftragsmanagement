import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { useTabContext } from '../../context/TabContext';
import { getInstanzenFuerAuftrag } from '../../api/instanzen';
import { getAuftraege } from '../../api/auftraege';
import InstanzKarte from './InstanzKarte';
import InstanzLoeschenDialog from '../instanz/InstanzLoeschenDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import type { InstanzUebersicht } from '../../types/instanz';

// Übersichts-Tab: Karten-Grid aller Instanzen des aktiven Auftrags
export default function AuftragUebersicht() {
  const { aktiverAuftragTabId, openInstanzTab, closeInstanzTab } = useTabContext();

  const [instanzen, setInstanzen] = useState<InstanzUebersicht[]>([]);
  const [materialnummerNummer, setMaterialnummerNummer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lösch-Dialog-Zustand
  const [deleteTarget, setDeleteTarget] = useState<InstanzUebersicht | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Instanzen und Materialnummer laden
  const loadData = useCallback(async () => {
    if (aktiverAuftragTabId === null) {
      setInstanzen([]);
      setMaterialnummerNummer(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Instanzen laden
      const instanzData = await getInstanzenFuerAuftrag(aktiverAuftragTabId);
      setInstanzen(instanzData);

      // Materialnummer aus der Auftragsliste ermitteln
      const auftragData = await getAuftraege();
      const found = auftragData.find((a) => a.id === aktiverAuftragTabId);
      setMaterialnummerNummer(found?.materialnummerNummer ?? null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Fehler beim Laden der Instanzen');
    } finally {
      setLoading(false);
    }
  }, [aktiverAuftragTabId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Klick auf Instanzkarte öffnet Instanz-Tab
  const handleKarteClick = (instanz: InstanzUebersicht) => {
    if (aktiverAuftragTabId !== null) {
      openInstanzTab(aktiverAuftragTabId, instanz.id, instanz.nummer);
    }
  };

  // Löschen starten
  const handleDelete = (instanz: InstanzUebersicht) => {
    setDeleteTarget(instanz);
    setDeleteDialogOpen(true);
  };

  // Nach Löschung: Tab schließen und Liste neu laden
  const handleDeleted = (auftragId: number, instanzId: number) => {
    closeInstanzTab(auftragId, instanzId);
    loadData();
  };

  if (aktiverAuftragTabId === null) return null;

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ p: 3, textAlign: 'center' }}>
        {error}
      </Typography>
    );
  }

  if (instanzen.length === 0) {
    return (
      <Typography color="text.secondary" sx={{ p: 3, textAlign: 'center' }}>
        Keine Instanzen vorhanden
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        {instanzen.map((instanz) => (
          <Grid key={instanz.id} size={{ xs: 12, sm: 6, md: 4, lg: 3 }}>
            <InstanzKarte
              instanz={instanz}
              materialnummerNummer={materialnummerNummer}
              onClick={() => handleKarteClick(instanz)}
              onDelete={handleDelete}
            />
          </Grid>
        ))}
      </Grid>

      {/* Lösch-Dialog */}
      <InstanzLoeschenDialog
        instanz={deleteTarget}
        auftragId={aktiverAuftragTabId}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDeleted={handleDeleted}
      />
    </Box>
  );
}
