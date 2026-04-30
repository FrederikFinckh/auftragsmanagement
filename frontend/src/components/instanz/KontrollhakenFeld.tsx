import { Checkbox, FormControlLabel, Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import type { InstanzWert } from '../../types/instanz';

// Kontrollhaken-Feld: Checkbox für ja/nein
// Wenn kontrolleAbgeschlossen: angehakt = grünes Häkchen, nicht angehakt = rotes Kreuz
interface KontrollhakenFeldProps {
  wert: InstanzWert;
  onChange: (wertId: number, data: Record<string, unknown>) => void;
  kontrolleAbgeschlossen?: boolean;
}

export default function KontrollhakenFeld({ wert, onChange, kontrolleAbgeschlossen = false }: KontrollhakenFeldProps) {
  const checked = wert.kontrollhakenWert ?? false;

  const handleChange = (_e: React.ChangeEvent<HTMLInputElement>, newChecked: boolean) => {
    onChange(wert.id, { kontrollhakenWert: newChecked });
  };

  // Status-Icon wenn Kontrolle abgeschlossen
  const statusIcon = kontrolleAbgeschlossen && !wert.veraltet && (
    checked
      ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
      : <CancelIcon sx={{ color: 'error.main', fontSize: 20 }} />
  );

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <FormControlLabel
        control={
          <Checkbox
            checked={checked}
            onChange={handleChange}
            disabled={wert.veraltet}
            size="small"
            sx={{
              // Farbliche Hervorhebung der Checkbox wenn Kontrolle abgeschlossen
              ...(kontrolleAbgeschlossen && !wert.veraltet && checked && {
                color: 'success.main',
                '&.Mui-checked': { color: 'success.main' },
              }),
              ...(kontrolleAbgeschlossen && !wert.veraltet && !checked && {
                color: 'error.main',
              }),
            }}
          />
        }
        label={wert.bezeichnung}
        sx={{
          ...(wert.veraltet && {
            opacity: 0.5,
            textDecoration: 'line-through',
          }),
        }}
      />
      {statusIcon}
    </Box>
  );
}
