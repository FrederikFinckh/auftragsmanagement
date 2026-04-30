import { useState, useEffect } from 'react';
import { Box, TextField, Typography } from '@mui/material';
import type { InstanzWert } from '../../types/instanz';

// Toleranz-Feld: Referenz-Grenzen (Min/Max) als read-only + einzelner Eingabewert
// Der Eingabewert wird gegen die Grenzen validiert (grün wenn innerhalb, rot wenn außerhalb)
interface ToleranzFeldProps {
  wert: InstanzWert;
  onChange: (wertId: number, data: Record<string, unknown>) => void;
}

export default function ToleranzFeld({ wert, onChange }: ToleranzFeldProps) {
  // Der eingegebene Ist-Wert wird in zahlwert gespeichert
  // (toleranzMin/toleranzMax bleiben als Referenz-Grenzen erhalten)
  const min = wert.toleranzMin;
  const max = wert.toleranzMax;

  // Lokaler State für die Eingabe, um Flackern durch Auto-Save zu vermeiden
  const [localValue, setLocalValue] = useState<string>(wert.zahlwert != null ? String(wert.zahlwert) : '');

  // Sync: Wenn der externe Wert sich ändert (z.B. nach Server-Response), lokalen State aktualisieren
  useEffect(() => {
    const externalValue = wert.zahlwert != null ? String(wert.zahlwert) : '';
    // Nur aktualisieren wenn sich der Wert wirklich geändert hat (Server-Bestätigung)
    if (externalValue !== localValue) {
      setLocalValue(externalValue);
    }
  }, [wert.zahlwert]);

  // Validierung: Wert muss innerhalb der Grenzen liegen
  const numValue = localValue !== '' ? parseFloat(localValue) : null;
  const isWithinTolerance = numValue != null && min != null && max != null
    ? numValue >= min && numValue <= max
    : null; // null = noch kein Wert eingegeben

  const handleChange = (value: string) => {
    setLocalValue(value);
    const parsed = value === '' ? null : parseFloat(value);
    // Nur senden wenn es eine gültige Zahl ist oder leer
    if (value === '' || !isNaN(parsed as number)) {
      onChange(wert.id, { zahlwert: parsed });
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

      {/* Referenz-Grenzen als read-only Anzeige */}
      <Typography variant="body2" color="text.secondary">
        Grenzen: {min != null ? min : '—'} – {max != null ? max : '—'}
      </Typography>

      {/* Einzelner Eingabewert mit Validierung */}
      <TextField
        type="number"
        size="small"
        label="Ist-Wert"
        value={localValue}
        onChange={(e) => handleChange(e.target.value)}
        disabled={wert.veraltet}
        error={isWithinTolerance === false}
        fullWidth
        slotProps={{
          htmlInput: { step: 'any' },
        }}
      />

      {/* Statusanzeige unter dem Feld */}
      {isWithinTolerance === true && (
        <Typography variant="caption" sx={{ color: 'success.main' }}>
          In Ordnung – innerhalb der Grenzen
        </Typography>
      )}
      {isWithinTolerance === false && (
        <Typography variant="caption" color="error">
          Nicht in Ordnung – außerhalb der Grenzen
        </Typography>
      )}

      {wert.veraltet && (
        <Typography variant="caption" color="text.disabled">
          (veraltet)
        </Typography>
      )}
    </Box>
  );
}
