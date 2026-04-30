import { Box, Typography } from '@mui/material';
import { useTabContext } from '../../context/TabContext';
import AuftragTabLeiste from './AuftragTabLeiste';
import InstanzTabLeiste from './InstanzTabLeiste';
import AuftragUebersicht from './AuftragUebersicht';

// Haupt-Wrapper für den Mittelbereich mit zwei Tab-Zeilen und Inhaltsbereich
export default function MitteBereich() {
  const { auftragTabs, aktiverAuftragTabId, aktuelleAktiverInstanzTabId } = useTabContext();

  // Leerzustand: keine Tabs geöffnet
  if (auftragTabs.length === 0) {
    return (
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h6" color="text.secondary">
          Auftrag auswählen, um ihn hier zu öffnen
        </Typography>
      </Box>
    );
  }

  // Bestimmt den Inhalt der unteren Tab-Zeile:
  // - null = Übersicht, number = Instanz-Tab (wird in Phase 9 implementiert)
  const showInstanzContent = aktiverAuftragTabId !== null && aktuelleAktiverInstanzTabId !== null;

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Obere Tab-Zeile: Auftrag-Tabs */}
      <AuftragTabLeiste />

      {/* Untere Tab-Zeile: Instanz-Tabs (nur wenn ein Auftrag aktiv ist) */}
      <InstanzTabLeiste />

      {/* Tab-Inhaltsbereich */}
      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        {showInstanzContent ? (
          // Instanz-Detail wird in Phase 9 implementiert
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              Instanz-Detail (wird in Phase 9 implementiert)
            </Typography>
          </Box>
        ) : (
          // Übersicht: Karten-Grid der Instanzen
          <AuftragUebersicht />
        )}
      </Box>
    </Box>
  );
}
