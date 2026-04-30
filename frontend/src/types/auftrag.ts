// TypeScript-Typen für Aufträge

// Auftrag (entspricht Backend AuftragDto)
export interface Auftrag {
  id: number;
  auftragsnummer: string;
  datum: string;
  kunde: string | null;
  materialnummerId: number | null;
  materialnummerNummer: string | null;
  stueckzahl: number;
  materialVeraendert: boolean;
  instanzenAbgeschlossen: number;
}

// Request-DTO für das Anlegen eines Auftrags
export interface AuftragCreate {
  datum: string;
  auftragsnummer: string;
  stueckzahl: number;
  kunde: string | null;
  materialnummerId: number | null;
}
