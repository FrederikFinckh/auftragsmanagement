import { Box, Typography, Divider } from '@mui/material';
import type { InstanzWert } from '../../types/instanz';
import KontrollhakenFeld from './KontrollhakenFeld';
import ToleranzFeld from './ToleranzFeld';
import ZahlwertFeld from './ZahlwertFeld';
import TextFeld from './TextFeld';

// Liste aller Prüfargument-Felder mit Auto-Save
interface PruefargumentFormularProps {
  werte: InstanzWert[];
  onChange: (wertId: number, data: Record<string, unknown>) => void;
}

// Rendert das passende Eingabefeld je nach Typ
function renderFeld(wert: InstanzWert, onChange: (wertId: number, data: Record<string, unknown>) => void) {
  switch (wert.typ) {
    case 'KONTROLLHAKEN':
      return <KontrollhakenFeld wert={wert} onChange={onChange} />;
    case 'TOLERANZ':
      return <ToleranzFeld wert={wert} onChange={onChange} />;
    case 'ZAHLWERT':
      return <ZahlwertFeld wert={wert} onChange={onChange} />;
    case 'TEXT':
      return <TextFeld wert={wert} onChange={onChange} />;
    default:
      return (
        <Typography variant="body2" color="text.secondary">
          Unbekannter Typ: {wert.typ}
        </Typography>
      );
  }
}

export default function PruefargumentFormular({ werte, onChange }: PruefargumentFormularProps) {
  if (werte.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 2, textAlign: 'center' }}>
        Keine Prüfargumente vorhanden
      </Typography>
    );
  }

  // Werte nach reihenfolge sortieren
  const sortedWerte = [...werte].sort((a, b) => a.reihenfolge - b.reihenfolge);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      {sortedWerte.map((wert, index) => (
        <Box key={wert.id}>
          {index > 0 && <Divider sx={{ mb: 2 }} />}
          {renderFeld(wert, onChange)}
        </Box>
      ))}
    </Box>
  );
}
