import { Tabs, Tab, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FactoryIcon from '@mui/icons-material/Factory';
import CategoryIcon from '@mui/icons-material/Category';
import { useTabContext, type TopTab } from '../../context/TabContext';

function getTabId(tab: TopTab): string {
  return tab.type === 'auftrag' ? `auftrag-${tab.auftragId}` : tab.tabId;
}

export default function AuftragTabLeiste() {
  const { topTabs, aktiverTopTabId, setAktiverTopTab, closeTopTab } = useTabContext();

  if (topTabs.length === 0) return null;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 42, bgcolor: 'background.paper' }}>
      <Tabs
        value={aktiverTopTabId ?? false}
        onChange={(_e, newValue: string) => setAktiverTopTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {topTabs.map((tab) => {
          const tabId = getTabId(tab);
          const isAuftrag = tab.type === 'auftrag';
          const label = isAuftrag ? tab.auftragsnummer : (
            tab.mode === 'edit' ? tab.nummer : (
              tab.mode === 'copy' ? `Kopie: ${tab.nummer}` : 'Neues Material'
            )
          );

          return (
            <Tab
              key={tabId}
              value={tabId}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {isAuftrag ? (
                    <FactoryIcon sx={{ fontSize: 18, color: '#1976d2' }} />
                  ) : (
                    <CategoryIcon sx={{ fontSize: 18, color: '#00897b' }} />
                  )}
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 180,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: isAuftrag ? 400 : 600,
                    }}
                  >
                    {label}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTopTab(tabId);
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
              sx={{
                minHeight: 36,
                textTransform: 'none',
                bgcolor: isAuftrag ? '#e3f2fd' : '#e0f2f1',
                borderRight: 1,
                borderColor: 'divider',
                '&.Mui-selected': {
                  bgcolor: isAuftrag ? '#bbdefb' : '#b2dfdb',
                },
              }}
            />
          );
        })}
      </Tabs>
    </Box>
  );
}
