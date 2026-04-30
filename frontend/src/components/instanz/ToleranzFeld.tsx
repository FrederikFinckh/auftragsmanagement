import { Box, TextField, Typography } from '@mui/material';
import type { InstanzWert } from '../../types/instanz';

// Toleranz-Feld: Min/Max Zahleneingaben nebeneinander
interface ToleranzFeldProps {
  wert: InstanzWert;
  onChange: (wertId: number, data: Record<string, unknown>) => void;
}

export default function ToleranzFeld({ wert, onChange }: ToleranzFeldProps) {
  const handleChange = (field: 'toleranzMin' | 'toleranzMax', value: string) => {
    const numValue = value === '' ? null : parseFloat(value);
    onChange(wert.id, { [field]: numValue });
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
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
        <TextField
          label="Min"
          type="number"
          size="small"
          value={wert.toleranzMin ?? ''}
          onChange={(e) => handleChange('toleranzMin', e.target.value)}
          disabled={wert.veraltet}
          sx={{ flex: 1 }}
          slotProps={{
            htmlInput: { step: 'any' },
          }}
        />
        <Typography variant="body2" color="text.secondary">–</Typography>
        <TextField
          label="Max"
          type="number"
          size="small"
          value={wert.toleranzMax ?? ''}
          onChange={(e) => handleChange('toleranzMax', e.target.value)}
          disabled={wert.veraltet}
          sx={{ flex: 1 }}
          slotProps={{
            htmlInput: { step: 'any' },
          }}
        />
      </Box>
      {wert.veraltet && (
        <Typography variant="caption" color="text.disabled">
          (veraltet)
        </Typography>
      )}
    </Box>
  );
}
