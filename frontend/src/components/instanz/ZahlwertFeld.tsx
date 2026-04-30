import { useState, useEffect } from 'react';
import { TextField, Typography, Box } from '@mui/material';
import type { InstanzWert } from '../../types/instanz';

// Zahlwert-Feld: Einzelne Zahleneingabe
interface ZahlwertFeldProps {
  wert: InstanzWert;
  onChange: (wertId: number, data: Record<string, unknown>) => void;
}

export default function ZahlwertFeld({ wert, onChange }: ZahlwertFeldProps) {
  // Lokaler State für die Eingabe, um Flackern durch Auto-Save zu vermeiden
  const [localValue, setLocalValue] = useState<string>(wert.zahlwert != null ? String(wert.zahlwert) : '');

  // Sync: Wenn der externe Wert sich ändert (z.B. nach Server-Response), lokalen State aktualisieren
  useEffect(() => {
    const externalValue = wert.zahlwert != null ? String(wert.zahlwert) : '';
    if (externalValue !== localValue) {
      setLocalValue(externalValue);
    }
  }, [wert.zahlwert]);

  const handleChange = (value: string) => {
    setLocalValue(value);
    const numValue = value === '' ? null : parseFloat(value);
    if (value === '' || !isNaN(numValue as number)) {
      onChange(wert.id, { zahlwert: numValue });
    }
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
        value={localValue}
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
