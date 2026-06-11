import { Box, Typography } from '@mui/material';
import { useTabContext } from '../../context/TabContext';
import AuftragTabLeiste from './AuftragTabLeiste';
import AuftragUebersicht from './AuftragUebersicht';
import InstanzTab from '../instanz/InstanzTab';
import MaterialTab from '../materialien/MaterialTab';

export default function MitteBereich() {
  const { topTabs, aktiverInstanzTabId, isMaterialTabActive, aktiveMaterialTab, aktiverTopTabId } = useTabContext();

  if (topTabs.length === 0) {
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
          Auftrag oder Material auswählen, um ihn hier zu öffnen
        </Typography>
      </Box>
    );
  }

  const activeTab = topTabs.find((t) =>
    t.type === 'auftrag' ? `auftrag-${t.auftragId}` === aktiverTopTabId :
    t.type === 'instanz' ? t.tabId === aktiverTopTabId :
    t.tabId === aktiverTopTabId
  );

  return (
    <Box
      sx={{
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      <AuftragTabLeiste />

      <Box
        sx={{
          flexGrow: 1,
          overflow: 'auto',
        }}
      >
        {isMaterialTabActive && aktiveMaterialTab ? (
          <MaterialTab
            key={aktiveMaterialTab.tabId}
            tab={aktiveMaterialTab}
          />
        ) : aktiverInstanzTabId !== null ? (
          <InstanzTab instanzId={aktiverInstanzTabId} />
        ) : activeTab?.type === 'auftrag' ? (
          <AuftragUebersicht />
        ) : null}
      </Box>
    </Box>
  );
}
