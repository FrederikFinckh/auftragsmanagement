import { Box, Typography, Paper, IconButton } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import WarningIcon from '@mui/icons-material/Warning';
import DeleteIcon from '@mui/icons-material/Delete';
import { PRUEFARGUMENT_TYP_LABELS } from '../../types/material';
import type { InstanzUebersicht, InstanzWert } from '../../types/instanz';
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
              {wert.veraltet ? (
                <Typography variant="caption" color="text.secondary">
                  (veraltet)
                </Typography>
              ) : instanz.kontrolleAbgeschlossen ? (
                <WertStatusIcon typ={wert.typ} wert={wert} />
              ) : (
                <Typography variant="caption" color="text.secondary">
                  {formatWertText(wert.typ, wert)}
                </Typography>
              )}
            </Box>
          ))
        )}
      </Box>
    </Paper>
  );
}

// Text-Formatierung für read-only Anzeige wenn Kontrolle NICHT abgeschlossen
function formatWertText(typ: PruefargumentTyp, wert: { kontrollhakenWert: boolean | null; toleranzMin: number | null; toleranzMax: number | null; zahlwert: number | null; textWert: string | null }): string {
  switch (typ) {
    case 'KONTROLLHAKEN':
      return wert.kontrollhakenWert ? '✓' : '✗';
    case 'TOLERANZ': {
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

// Status-Icon für abgeschlossene Kontrolle in Übersichtskarten
function WertStatusIcon({ typ, wert }: { typ: PruefargumentTyp; wert: InstanzWert }) {
  switch (typ) {
    case 'KONTROLLHAKEN':
      return wert.kontrollhakenWert
        ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
        : <CancelIcon sx={{ color: 'error.main', fontSize: 16 }} />;
    case 'TOLERANZ': {
      const min = wert.toleranzMin;
      const max = wert.toleranzMax;
      const val = wert.zahlwert;
      if (val == null) {
        // Fehlender Wert → gelbes Warndreieck
        return <WarningIcon sx={{ color: 'warning.main', fontSize: 16 }} />;
      }
      if (min != null && max != null) {
        const ok = val >= min && val <= max;
        return ok
          ? <CheckCircleIcon sx={{ color: 'success.main', fontSize: 16 }} />
          : <CancelIcon sx={{ color: 'error.main', fontSize: 16 }} />;
      }
      // Keine Grenzen definiert → nur Wert anzeigen
      return <Typography variant="caption" color="text.secondary">{val}</Typography>;
    }
    case 'ZAHLWERT':
      return <Typography variant="caption" color="text.secondary">{wert.zahlwert != null ? String(wert.zahlwert) : '—'}</Typography>;
    case 'TEXT':
      return <Typography variant="caption" color="text.secondary">{wert.textWert || '—'}</Typography>;
    default:
      return <Typography variant="caption" color="text.secondary">{PRUEFARGUMENT_TYP_LABELS[typ]}</Typography>;
  }
}
