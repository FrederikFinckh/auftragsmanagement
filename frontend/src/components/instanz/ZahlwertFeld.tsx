import { TextField, Typography, Box } from '@mui/material';
import type { InstanzWert } from '../../types/instanz';

// Zahlwert-Feld: Einzelne Zahleneingabe
interface ZahlwertFeldProps {
  wert: InstanzWert;
  onChange: (wertId: number, data: Record<string, unknown>) => void;
}

export default function ZahlwertFeld({ wert, onChange }: ZahlwertFeldProps) {
  const handleChange = (value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    onChange(wert.id, { zahlwert: numValue });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
      <Typography
        variant="body2"
        sx={{
          fontWeight: 500,
          ...(wert.veraltet && {
            opacity: 0.5,
            textDecoration: 'line-through',
          }),
        }}
      >
        {wert.bezeichnung}
      </Typography>
      <TextField
        type="number"
        size="small"
        value={wert.zahlwert ?? ''}
        onChange={(e) => handleChange(e.target.value)}
        disabled={wert.veraltet}
        fullWidth
        slotProps={{
          htmlInput: { step: 'any' },
        }}
      />
      {wert.veraltet && (
        <Typography variant="caption" color="text.disabled">
          (veraltet)
        </Typography>
      )}
    </Box>
  );
}
