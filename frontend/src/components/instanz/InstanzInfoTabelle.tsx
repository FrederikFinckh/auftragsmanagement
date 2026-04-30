import { Table, TableBody, TableCell, TableRow } from '@mui/material';
import type { InstanzDetail } from '../../types/instanz';

// Datentabelle mit Instanz-Infos (Datum, Auftragsnummer, Kunde, Materialnummer)
// Gemäß ui_spec.md Abschnitt 6.3
interface InstanzInfoTabelleProps {
  instanz: InstanzDetail;
}

export default function InstanzInfoTabelle({ instanz }: InstanzInfoTabelleProps) {
  return (
    <Table size="small">
      <TableBody>
        <TableRow>
          <TableCell
            sx={{
              fontWeight: 'bold',
              bgcolor: 'secondary.main',
              width: '40%',
              border: 0,
            }}
          >
            Datum:
          </TableCell>
          <TableCell sx={{ border: 0 }}>
            {instanz.datum}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            sx={{
              fontWeight: 'bold',
              bgcolor: 'secondary.main',
              width: '40%',
              border: 0,
            }}
          >
            Auftragsnummer:
          </TableCell>
          <TableCell sx={{ border: 0 }}>
            {instanz.auftragsnummer}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            sx={{
              fontWeight: 'bold',
              bgcolor: 'secondary.main',
              width: '40%',
              border: 0,
            }}
          >
            Kunde:
          </TableCell>
          <TableCell sx={{ border: 0 }}>
            {instanz.kunde || '—'}
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell
            sx={{
              fontWeight: 'bold',
              bgcolor: 'secondary.main',
              width: '40%',
              border: 0,
            }}
          >
            Materialnummer:
          </TableCell>
          <TableCell sx={{ border: 0 }}>
            {instanz.materialnummerNummer || '—'}
          </TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
