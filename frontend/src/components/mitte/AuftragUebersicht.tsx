import { useState, useEffect, useCallback } from 'react';
import { Box, Typography, Grid, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTabContext, type AuftragTab } from '../../context/TabContext';
import { getInstanzenFuerAuftrag } from '../../api/instanzen';
import { getAuftraege } from '../../api/auftraege';
import InstanzKarte from './InstanzKarte';
import InstanzLoeschenDialog from '../instanz/InstanzLoeschenDialog';
import InstanzHinzufuegenDialog from './InstanzHinzufuegenDialog';
import LoadingSpinner from '../common/LoadingSpinner';
import type { InstanzUebersicht } from '../../types/instanz';
import type { Auftrag } from '../../types/auftrag';

// Übersichts-Tab: Karten-Grid aller Instanzen des aktiven Auftrags
export default function AuftragUebersicht() {
  const { topTabs, aktiverTopTabId, openInstanzTab, closeTopTab } = useTabContext();

  const aktiverAuftragTab = topTabs.find(t =>
    t.type === 'auftrag' && `auftrag-${t.auftragId}` === aktiverTopTabId
  ) as AuftragTab | undefined;
  const aktiverAuftragTabId = aktiverAuftragTab?.auftragId ?? null;
  const [instanzen, setInstanzen] = useState<InstanzUebersicht[]>([]);
  const [materialnummerNummer, setMaterialnummerNummer] = useState<string | null>(null);
  const [aktuellerAuftrag, setAktuellerAuftrag] = useState<Auftrag | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Lösch-Dialog-Zustand
  const [deleteTarget, setDeleteTarget] = useState<InstanzUebersicht | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Hinzufügen-Dialog-Zustand
  const [addDialogOpen, setAddDialogOpen] = useState(false);

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

      const auftragData = await getAuftraege();
      const found = auftragData.find((a) => a.id === aktiverAuftragTabId);
      setMaterialnummerNummer(found?.materialnummerNummer ?? null);
      setAktuellerAuftrag(found ?? null);
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
    if (aktuellerAuftrag) {
      openInstanzTab(aktuellerAuftrag, instanz.id, instanz.nummer);
    }
  };

  // Löschen starten
  const handleDelete = (instanz: InstanzUebersicht) => {
    setDeleteTarget(instanz);
    setDeleteDialogOpen(true);
  };

  // Nach Löschung: Tab schließen und Liste neu laden
  const handleDeleted = (_auftragId: number, instanzId: number) => {
    closeTopTab(`instanz-${instanzId}`);
    loadData();
  };

  // Nach Hinzufügen: Liste neu laden
  const handleInstanzenAdded = (_neueInstanzen: InstanzUebersicht[]) => {
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

  return (
    <Box sx={{ p: 2 }}>
      {/* Kopfzeile mit Instanzen-Anzahl und Hinzufügen-Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2" color="text.secondary">
          {instanzen.length} {instanzen.length === 1 ? 'Instanz' : 'Instanzen'}
        </Typography>
        <Button
          size="small"
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={() => setAddDialogOpen(true)}
        >
          Hinzufügen
        </Button>
      </Box>

      {instanzen.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
          Keine Instanzen vorhanden
        </Typography>
      ) : (
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
      )}

      {/* Lösch-Dialog */}
      <InstanzLoeschenDialog
        instanz={deleteTarget}
        auftragId={aktiverAuftragTabId}
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onDeleted={handleDeleted}
      />

      {/* Hinzufügen-Dialog */}
      <InstanzHinzufuegenDialog
        auftragId={aktiverAuftragTabId}
        open={addDialogOpen}
        onClose={() => setAddDialogOpen(false)}
        onAdded={handleInstanzenAdded}
      />
    </Box>
  );
}
