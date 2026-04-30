// TypeScript-Typen für Instanzen und InstanzWerte

// Enum für Prüfargument-Typen (wird auch aus material.ts re-exportiert)
export type PruefargumentTyp = 'KONTROLLHAKEN' | 'TOLERANZ' | 'ZAHLWERT' | 'TEXT';

// InstanzWert (entspricht Backend InstanzWertDto)
export interface InstanzWert {
  id: number;
  bezeichnung: string;
  typ: PruefargumentTyp;
  kontrollhakenWert: boolean | null;
  toleranzMin: number | null;
  toleranzMax: number | null;
  zahlwert: number | null;
  textWert: string | null;
  veraltet: boolean;
  reihenfolge: number;
}

// Instanz-Übersicht (entspricht Backend InstanzUebersichtDto)
export interface InstanzUebersicht {
  id: number;
  nummer: number;
  kontrolleAbgeschlossen: boolean;
  materialVeraendert: boolean;
  werte: InstanzWert[];
}

// Instanz-Detail (entspricht Backend InstanzDetailDto)
export interface InstanzDetail {
  id: number;
  nummer: number;
  kontrolleAbgeschlossen: boolean;
  materialVeraendert: boolean;
  auftragId: number;
  auftragsnummer: string;
  datum: string;
  kunde: string | null;
  materialnummerNummer: string | null;
  werte: InstanzWert[];
}
