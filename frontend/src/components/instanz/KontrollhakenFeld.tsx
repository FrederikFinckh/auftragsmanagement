import { Checkbox, FormControlLabel } from '@mui/material';
import type { InstanzWert } from '../../types/instanz';

// Kontrollhaken-Feld: Checkbox für ja/nein
interface KontrollhakenFeldProps {
  wert: InstanzWert;
  onChange: (wertId: number, data: Record<string, unknown>) => void;
}

export default function KontrollhakenFeld({ wert, onChange }: KontrollhakenFeldProps) {
  const checked = wert.kontrollhakenWert ?? false;

  const handleChange = (_e: React.ChangeEvent<HTMLInputElement>, newChecked: boolean) => {
    onChange(wert.id, { kontrollhakenWert: newChecked });
  };

  return (
    <FormControlLabel
      control={
        <Checkbox
          checked={checked}
          onChange={handleChange}
          disabled={wert.veraltet}
          size="small"
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
  );
}
