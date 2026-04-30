import { CircularProgress, Box } from '@mui/material';

// Zentrierter Lade-Spinner
export default function LoadingSpinner() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
      <CircularProgress size={24} />
    </Box>
  );
}
