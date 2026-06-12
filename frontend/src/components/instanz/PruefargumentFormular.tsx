import { Typography, Grid } from '@mui/material';
import type { InstanzWert } from '../../types/instanz';
import KontrollhakenFeld from './KontrollhakenFeld';
import ToleranzFeld from './ToleranzFeld';
import ZahlwertFeld from './ZahlwertFeld';
import TextFeld from './TextFeld';

// Liste aller Prüfargument-Felder mit Auto-Save (2 Spalten)
interface PruefargumentFormularProps {
  werte: InstanzWert[];
  onChange: (wertId: number, data: Record<string, unknown>) => void;
  kontrolleAbgeschlossen?: boolean;
}

// Rendert das passende Eingabefeld je nach Typ
function renderFeld(
  wert: InstanzWert,
  index: number,
  onChange: (wertId: number, data: Record<string, unknown>) => void,
  kontrolleAbgeschlossen: boolean,
) {
  const label = `${index + 1}: ${wert.bezeichnung}`;
  const wertWithLabel = { ...wert, bezeichnung: label };
  switch (wert.typ) {
    case 'KONTROLLHAKEN':
      return <KontrollhakenFeld wert={wertWithLabel} onChange={onChange} kontrolleAbgeschlossen={kontrolleAbgeschlossen} />;
    case 'TOLERANZ':
      return <ToleranzFeld wert={wertWithLabel} onChange={onChange} kontrolleAbgeschlossen={kontrolleAbgeschlossen} />;
    case 'ZAHLWERT':
      return <ZahlwertFeld wert={wertWithLabel} onChange={onChange} kontrolleAbgeschlossen={kontrolleAbgeschlossen} />;
    case 'TEXT':
      return <TextFeld wert={wertWithLabel} onChange={onChange} kontrolleAbgeschlossen={kontrolleAbgeschlossen} />;
    default:
      return (
        <Typography variant="body2" color="text.secondary">
          Unbekannter Typ: {wert.typ}
        </Typography>
      );
  }
}

export default function PruefargumentFormular({ werte, onChange, kontrolleAbgeschlossen = false }: PruefargumentFormularProps) {
  if (werte.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ py: 1, textAlign: 'center' }}>
        Keine Prüfargumente vorhanden
      </Typography>
    );
  }

  const sortedWerte = [...werte].sort((a, b) => a.reihenfolge - b.reihenfolge);

  return (
    <Grid container spacing={1.5}>
      {sortedWerte.map((wert, index) => (
        <Grid key={wert.id} size={{ xs: 12, sm: 6 }}>
          {renderFeld(wert, index, onChange, kontrolleAbgeschlossen)}
        </Grid>
      ))}
    </Grid>
  );
}
