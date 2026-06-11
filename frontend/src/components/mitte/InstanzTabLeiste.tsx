import { Tabs, Tab, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTabContext } from '../../context/TabContext';

export default function InstanzTabLeiste() {
  const { aktiverAuftragTabId, aktuelleInstanzTabs, aktuelleAktiverInstanzTabId, setAktiverInstanzTab, closeInstanzTab } = useTabContext();

  if (aktiverAuftragTabId === null) return null;

  const tabValue = aktuelleAktiverInstanzTabId ?? 'overview';

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 42 }}>
      <Tabs
        value={tabValue}
        onChange={(_e, newValue: string | number) => {
          if (newValue === 'overview') {
            setAktiverInstanzTab(aktiverAuftragTabId, null);
          } else {
            setAktiverInstanzTab(aktiverAuftragTabId, newValue as number);
          }
        }}
        variant="scrollable"
        scrollButtons="auto"
      >
        <Tab
          value="overview"
          label={
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Übersicht
            </Typography>
          }
          sx={{ minHeight: 36, textTransform: 'none' }}
        />

        {aktuelleInstanzTabs.map((tab) => (
          <Tab
            key={tab.instanzId}
            value={tab.instanzId}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography
                  variant="body2"
                  sx={{
                    maxWidth: 200,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Nr {tab.nummer}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeInstanzTab(aktiverAuftragTabId, tab.instanzId);
                  }}
                  sx={{
                    color: 'error.main',
                    ml: 0.5,
                    '&:hover': {
                      bgcolor: 'error.light',
                      color: 'white',
                    },
                  }}
                >
                  <CloseIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Box>
            }
            sx={{ minHeight: 36, textTransform: 'none' }}
          />
        ))}
      </Tabs>
    </Box>
  );
}
