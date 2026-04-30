import { TextField, Typography, Box } from '@mui/material';
import type { InstanzWert } from '../../types/instanz';

// Text-Feld: Mehrzeiliges Texteingabefeld
interface TextFeldProps {
  wert: InstanzWert;
  onChange: (wertId: number, data: Record<string, unknown>) => void;
}

export default function TextFeld({ wert, onChange }: TextFeldProps) {
  const handleChange = (value: string) => {
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
        value={wert.textWert ?? ''}
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
