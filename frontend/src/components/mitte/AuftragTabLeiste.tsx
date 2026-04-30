import { Tabs, Tab, Box, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTabContext } from '../../context/TabContext';

// Obere Tab-Zeile: ein Tab pro geöffnetem Auftrag
export default function AuftragTabLeiste() {
  const { auftragTabs, aktiverAuftragTabId, setAktiverAuftragTab, closeAuftragTab } = useTabContext();

  if (auftragTabs.length === 0) return null;

  return (
    <Box sx={{ borderBottom: 1, borderColor: 'divider', minHeight: 42 }}>
      <Tabs
        value={aktiverAuftragTabId ?? false}
        onChange={(_e, newValue: number) => setAktiverAuftragTab(newValue)}
        variant="scrollable"
        scrollButtons="auto"
      >
        {auftragTabs.map((tab) => (
          <Tab
            key={tab.auftragId}
            value={tab.auftragId}
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
                  {tab.auftragsnummer}
                </Typography>
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    closeAuftragTab(tab.auftragId);
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
