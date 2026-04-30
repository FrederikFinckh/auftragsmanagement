import { Box, Chip, Typography } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import type { Pruefargument } from '../../types/material';
import { PRUEFARGUMENT_TYP_LABELS } from '../../types/material';

// Read-only Anzeige eines einzelnen Prüfarguments
interface PruefargumentItemProps {
  arg: Pruefargument;
}

export default function PruefargumentItem({ arg }: PruefargumentItemProps) {
  // Wert-Anzeige je nach Typ
  const renderValue = () => {
    switch (arg.typ) {
      case 'KONTROLLHAKEN':
        return arg.kontrollhakenWert ? (
          <CheckIcon sx={{ color: 'success.main', fontSize: 20 }} />
        ) : (
          <CloseIcon sx={{ color: 'error.main', fontSize: 20 }} />
        );
      case 'TOLERANZ':
        return (
          <Typography variant="body2" color="text.secondary">
            {arg.toleranzMin != null && arg.toleranzMax != null
              ? `min ${arg.toleranzMin} max ${arg.toleranzMax}`
              : '—'}
          </Typography>
        );
      case 'ZAHLWERT':
        return (
          <Typography variant="body2" color="text.secondary">
            {arg.zahlwert != null ? String(arg.zahlwert) : '—'}
          </Typography>
        );
      case 'TEXT':
        return (
          <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {arg.textWert || '—'}
          </Typography>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        py: 0.5,
        borderBottom: 1,
        borderColor: 'divider',
      }}
    >
      {/* Typ-Chip */}
      <Chip
        label={PRUEFARGUMENT_TYP_LABELS[arg.typ]}
        variant="outlined"
        size="small"
        sx={{ minWidth: 90 }}
      />

      {/* Bezeichnung */}
      <Typography
        variant="body2"
        sx={{ fontWeight: 500, flexGrow: 1 }}
      >
        {arg.bezeichnung}
      </Typography>

      {/* Wert-Anzeige (rechtsbündig) */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', minWidth: 60 }}>
        {renderValue()}
      </Box>
    </Box>
  );
}
