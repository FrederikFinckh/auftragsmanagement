// API-Funktionen für die Aufträge-Endpunkte

import { apiGet, apiPost, apiDelete } from './client';
import type { Auftrag, AuftragCreate } from '../types/auftrag';

// Alle Aufträge abrufen (sortiert nach id DESC)
export function getAuftraege(): Promise<Auftrag[]> {
  return apiGet<Auftrag[]>('/auftraege');
}

// Neuen Auftrag anlegen (generiert N Instanzen)
export function createAuftrag(data: AuftragCreate): Promise<Auftrag> {
  return apiPost<Auftrag>('/auftraege', data);
}

// Auftrag löschen (Cascade löscht Instanzen + Werte)
export async function deleteAuftrag(id: number): Promise<void> {
  await apiDelete(`/auftraege/${id}`);
}
