import { Box, Typography } from '@mui/material';
import { useTabContext } from '../../context/TabContext';
import AuftragTabLeiste from './AuftragTabLeiste';
import InstanzTabLeiste from './InstanzTabLeiste';
import AuftragUebersicht from './AuftragUebersicht';
import InstanzTab from '../instanz/InstanzTab';
import MaterialTab from '../materialien/MaterialTab';

export default function MitteBereich() {
  const { topTabs, aktiverAuftragTabId, aktuelleAktiverInstanzTabId, isMaterialTabActive, aktiveMaterialTab } = useTabContext();

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
      <AuftragTabLeiste />

      {!isMaterialTabActive && <InstanzTabLeiste />}

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
        ) : showInstanzContent && aktuelleAktiverInstanzTabId !== null ? (
          <InstanzTab instanzId={aktuelleAktiverInstanzTabId} />
        ) : aktiverAuftragTabId !== null ? (
          <AuftragUebersicht />
        ) : null}
      </Box>
    </Box>
  );
}
