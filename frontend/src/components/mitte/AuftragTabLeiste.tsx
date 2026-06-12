import { Tabs, Tab, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import FactoryIcon from '@mui/icons-material/Factory';
import CategoryIcon from '@mui/icons-material/Category';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { useTabContext, type TopTab } from '../../context/TabContext';

function getTabId(tab: TopTab): string {
  return tab.type === 'auftrag' ? `auftrag-${tab.auftragId}` : tab.tabId;
}

export default function AuftragTabLeiste() {
  const { topTabs, aktiverTopTabId, setAktiverTopTab, closeTopTab } = useTabContext();

  if (topTabs.length === 0) return null;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 36, bgcolor: 'background.paper' }}>
      <Tabs
        value={aktiverTopTabId ?? false}
        onChange={(_e, newValue: string) => setAktiverTopTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {topTabs.map((tab) => {
          const tabId = getTabId(tab);
          let icon;
          let label: string;
          let bgColor: string;
          let selectedBgColor: string;

          if (tab.type === 'auftrag') {
            icon = <FactoryIcon sx={{ fontSize: 18, color: '#1976d2' }} />;
            label = tab.auftragsnummer;
            bgColor = '#e3f2fd';
            selectedBgColor = '#bbdefb';
          } else if (tab.type === 'instanz') {
            icon = <AssignmentIcon sx={{ fontSize: 18, color: '#7b1fa2' }} />;
            label = `${tab.auftragsnummer} – ${tab.nummer}`;
            bgColor = '#f3e5f5';
            selectedBgColor = '#e1bee7';
          } else {
            icon = <CategoryIcon sx={{ fontSize: 18, color: '#00897b' }} />;
            label = tab.mode === 'edit' ? tab.nummer : (
              tab.mode === 'copy' ? `Kopie: ${tab.nummer}` : 'Neues Material'
            );
            bgColor = '#e0f2f1';
            selectedBgColor = '#b2dfdb';
          }

          return (
            <Tab
              key={tabId}
              value={tabId}
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  {icon}
                  <Typography
                    variant="body2"
                    sx={{
                      maxWidth: 180,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      fontWeight: tab.type === 'auftrag' ? 400 : 600,
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
                minHeight: 32,
                textTransform: 'none',
                bgcolor: bgColor,
                borderRight: 1,
                borderColor: 'divider',
                '&.Mui-selected': {
                  bgcolor: selectedBgColor,
                },
              }}
            />
          );
        })}
      </Tabs>
    </Box>
  );
}
