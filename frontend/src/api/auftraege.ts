// API-Funktionen für die Aufträge-Endpunkte

import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { Auftrag, AuftragCreate } from '../types/auftrag';
import type { InstanzUebersicht } from '../types/instanz';

// Alle Aufträge abrufen (sortiert nach id DESC)
export function getAuftraege(): Promise<Auftrag[]> {
  return apiGet<Auftrag[]>('/auftraege');
}

// Neuen Auftrag anlegen (generiert N Instanzen)
export function createAuftrag(data: AuftragCreate): Promise<Auftrag> {
  return apiPost<Auftrag>('/auftraege', data);
}

// Auftrag bearbeiten (nur Metadaten)
export function updateAuftrag(id: number, data: AuftragCreate): Promise<Auftrag> {
  return apiPut<Auftrag>(`/auftraege/${id}`, data);
}

// Auftrag löschen (Cascade löscht Instanzen + Werte)
export async function deleteAuftrag(id: number): Promise<void> {
  await apiDelete(`/auftraege/${id}`);
}

// Weitere Instanzen zu einem bestehenden Auftrag hinzufügen
export function addInstanzen(auftragId: number, anzahl: number): Promise<InstanzUebersicht[]> {
  return apiPost<InstanzUebersicht[]>(`/auftraege/${auftragId}/instanzen`, { anzahl });
}
