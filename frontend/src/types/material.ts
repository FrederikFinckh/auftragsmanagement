// TypeScript-Typen für Materialien und Prüfargumente

// Enum für Prüfargument-Typen (entspricht Backend PruefargumentTyp)
export type PruefargumentTyp = 'KONTROLLHAKEN' | 'TOLERANZ' | 'ZAHLWERT' | 'TEXT';

// Typbezeichnungen für die Anzeige
export const PRUEFARGUMENT_TYP_LABELS: Record<PruefargumentTyp, string> = {
  KONTROLLHAKEN: 'Haken',
  TOLERANZ: 'Toleranz',
  ZAHLWERT: 'Zahlwert',
  TEXT: 'Text',
};

// Prüfargument (entspricht Backend PruefargumentDto)
export interface Pruefargument {
  id: number | null;
  bezeichnung: string;
  typ: PruefargumentTyp;
  kontrollhakenWert: boolean | null;
  toleranzMin: number | null;
  toleranzMax: number | null;
  zahlwert: number | null;
  textWert: string | null;
  reihenfolge: number;
}

// Materialnummer (entspricht Backend MaterialnummerDto)
export interface Materialnummer {
  id: number;
  nummer: string;
  beschreibung: string | null;
  pruefargumente: Pruefargument[];
  auftragCount: number;
}

// Request-DTO für das Anlegen/Bearbeiten einer Materialnummer
export interface MaterialnummerCreate {
  nummer: string;
  beschreibung: string | null;
  pruefargumente: Pruefargument[];
}

// Response-DTO für das Löschen einer Materialnummer
export interface DeleteResult {
  success: boolean;
  message: string;
  affectedAuftraege: number;
  affectedAuftragIds: number[];
}

// Hilfsfunktion: Leeres Prüfargument erstellen
export function createEmptyPruefargument(index: number): Pruefargument {
  return {
    id: null,
    bezeichnung: '',
    typ: 'KONTROLLHAKEN',
    kontrollhakenWert: null,
    toleranzMin: null,
    toleranzMax: null,
    zahlwert: null,
    textWert: null,
    reihenfolge: index,
  };
}
