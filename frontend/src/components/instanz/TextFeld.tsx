import { useState, useEffect } from 'react';
import { TextField, Typography, Box } from '@mui/material';
import type { InstanzWert } from '../../types/instanz';

// Text-Feld: Mehrzeiliges Texteingabefeld
interface TextFeldProps {
  wert: InstanzWert;
  onChange: (wertId: number, data: Record<string, unknown>) => void;
}

export default function TextFeld({ wert, onChange }: TextFeldProps) {
  // Lokaler State für die Eingabe, um Flackern durch Auto-Save zu vermeiden
  const [localValue, setLocalValue] = useState<string>(wert.textWert ?? '');

  // Sync: Wenn der externe Wert sich ändert (z.B. nach Server-Response), lokalen State aktualisieren
  useEffect(() => {
    const externalValue = wert.textWert ?? '';
    if (externalValue !== localValue) {
      setLocalValue(externalValue);
    }
  }, [wert.textWert]);

  const handleChange = (value: string) => {
    setLocalValue(value);
    onChange(wert.id, { textWert: value || null });
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
        multiline
        minRows={2}
        maxRows={6}
        size="small"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={wert.veraltet}
        fullWidth
      />
      {wert.veraltet && (
        <Typography variant="caption" color="text.disabled">
          (veraltet)
        </Typography>
      )}
    </Box>
  );
}
