import { useState, useEffect } from 'react';
import { Box, TextField, Typography, Tooltip } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import WarningIcon from '@mui/icons-material/Warning';
import type { InstanzWert } from '../../types/instanz';

// Toleranz-Feld: Referenz-Grenzen (Min/Max) als read-only + einzelner Eingabewert
// Wenn kontrolleAbgeschlossen:
//   - Fehlender Ist-Wert → gelbes Warndreieck
//   - Wert innerhalb der Toleranz → grünes Häkchen
//   - Wert außerhalb der Toleranz → rotes Kreuz
interface ToleranzFeldProps {
  wert: InstanzWert;
  onChange: (wertId: number, data: Record<string, unknown>) => void;
  kontrolleAbgeschlossen?: boolean;
}

export default function ToleranzFeld({ wert, onChange, kontrolleAbgeschlossen = false }: ToleranzFeldProps) {
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

  // Status-Icon wenn Kontrolle abgeschlossen
  let statusIcon: React.ReactNode = null;
  if (kontrolleAbgeschlossen && !wert.veraltet) {
    if (numValue == null) {
      // Fehlender Wert → gelbes Warndreieck
      statusIcon = <WarningIcon sx={{ color: 'warning.main', fontSize: 20 }} />;
    } else if (isWithinTolerance === true) {
      // Innerhalb der Toleranz → grünes Häkchen
      statusIcon = <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />;
    } else if (isWithinTolerance === false) {
      // Außerhalb der Toleranz → rotes Kreuz
      statusIcon = <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />;
    }
  }

  const abgeschlossenDisabled = kontrolleAbgeschlossen && !wert.veraltet;

  return (
    <Tooltip title="Bearbeiten nach abgeschlossener Kontrolle nicht möglich" disableHoverListener={!abgeschlossenDisabled}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, ...(abgeschlossenDisabled && { cursor: 'not-allowed' }) }}>
      {/* Zeile 1: Bezeichnung + Grenzen + Status-Icon */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
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
        <Typography variant="caption" color="text.secondary">
          (Grenzen: {[min != null ? 'Min: '+min : null, max != null ? 'Max: '+max : null].filter(x=>x!=null).join(', ')}
        </Typography>
        {statusIcon}
      </Box>

      {/* Zeile 2: Eingabewert + Validierung */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <TextField
          type="text"
          inputMode="decimal"
          size="small"
          label="Ist-Wert"
          value={localValue}
          onChange={(e) => handleChange(e.target.value)}
          disabled={wert.veraltet || kontrolleAbgeschlossen}
          error={isWithinTolerance === false}
          fullWidth
        />
        {!kontrolleAbgeschlossen && isWithinTolerance === true && (
          <Typography variant="caption" sx={{ color: 'success.main', whiteSpace: 'nowrap' }}>
            In Ordnung
          </Typography>
        )}
        {!kontrolleAbgeschlossen && isWithinTolerance === false && (
          <Typography variant="caption" color="error" sx={{ whiteSpace: 'nowrap' }}>
            Nicht in Ordnung
          </Typography>
        )}
      </Box>

      {wert.veraltet && (
        <Typography variant="caption" color="text.disabled">
          (veraltet)
        </Typography>
      )}
    </Box>
    </Tooltip>
  );
}
