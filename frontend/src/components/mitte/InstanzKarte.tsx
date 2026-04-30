import { Box, Typography, Paper, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import { PRUEFARGUMENT_TYP_LABELS } from '../../types/material';
import type { InstanzUebersicht } from '../../types/instanz';
import type { PruefargumentTyp } from '../../types/material';

// Einzelne Übersichtskarte einer Instanz
interface InstanzKarteProps {
  instanz: InstanzUebersicht;
  materialnummerNummer: string | null;
  onClick: () => void;
  onDelete: (instanz: InstanzUebersicht) => void;
}

export default function InstanzKarte({ instanz, materialnummerNummer, onClick, onDelete }: InstanzKarteProps) {
  return (
    <Paper
      variant="outlined"
      sx={{
        cursor: 'pointer',
        transition: 'box-shadow 0.2s',
        '&:hover': {
          boxShadow: 2,
        },
      }}
      onClick={onClick}
    >
      {/* Karten-Kopfstreifen */}
      <Box
        sx={{
          bgcolor: 'secondary.main',
          px: 1.5,
          py: 0.75,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
          Nr {instanz.nummer}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <IconButton
            size="small"
            onClick={(e) => { e.stopPropagation(); onDelete(instanz); }}
            aria-label="Instanz löschen"
            sx={{
              color: 'rgba(255,255,255,0.7)',
              '&:hover': { color: 'error.main', bgcolor: 'rgba(255,255,255,0.1)' },
            }}
          >
            <DeleteIcon sx={{ fontSize: 16 }} />
          </IconButton>
          {instanz.materialVeraendert && (
            <WarningIcon sx={{ color: 'warning.main', fontSize: 18 }} />
          )}
          {instanz.kontrolleAbgeschlossen ? (
            <CheckCircleIcon sx={{ color: 'success.main', fontSize: 20 }} />
          ) : (
            <RadioButtonUncheckedIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
          )}
        </Box>
      </Box>

      {/* Karten-Körper */}
      <Box sx={{ p: 1.5 }}>
        {/* Materialnummer */}
        {materialnummerNummer && (
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            {materialnummerNummer}
          </Typography>
        )}

        {/* Read-only Prüfargumente */}
        {instanz.werte.length === 0 ? (
          <Typography variant="caption" color="text.secondary">
            Keine Prüfargumente
          </Typography>
        ) : (
          instanz.werte.map((wert) => (
            <Box
              key={wert.id}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                py: 0.25,
              }}
            >
              <Typography variant="caption" sx={{ fontWeight: 500, flexGrow: 1 }}>
                {wert.bezeichnung}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {wert.veraltet ? '(veraltet)' : formatWert(wert.typ, wert)}
              </Typography>
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}

// Wert-Formatierung für read-only Anzeige in Übersichtskarten
function formatWert(typ: PruefargumentTyp, wert: { kontrollhakenWert: boolean | null; toleranzMin: number | null; toleranzMax: number | null; zahlwert: number | null; textWert: string | null }): string {
  switch (typ) {
    case 'KONTROLLHAKEN':
      return wert.kontrollhakenWert ? '✓' : '✗';
    case 'TOLERANZ': {
      // Ist-Wert anzeigen, ggf. mit Grenzen-Referenz
      const min = wert.toleranzMin;
      const max = wert.toleranzMax;
      const val = wert.zahlwert;
      if (val != null && min != null && max != null) {
        const ok = val >= min && val <= max;
        return `${val} (${min}–${max}) ${ok ? '✓' : '✗'}`;
      }
      if (min != null && max != null) {
        return `${min} – ${max}`;
      }
      return '—';
    }
    case 'ZAHLWERT':
      return wert.zahlwert != null ? String(wert.zahlwert) : '—';
    case 'TEXT':
      return wert.textWert || '—';
    default:
      return PRUEFARGUMENT_TYP_LABELS[typ];
  }
}
