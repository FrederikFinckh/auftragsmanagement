// API-Funktionen für die Instanzen-Endpunkte

import { apiGet, apiPatch } from './client';
import type { InstanzUebersicht, InstanzDetail, InstanzWert } from '../types/instanz';

// Instanzen-Übersicht für einen Auftrag abrufen
export function getInstanzenFuerAuftrag(auftragId: number): Promise<InstanzUebersicht[]> {
  return apiGet<InstanzUebersicht[]>(`/auftraege/${auftragId}/instanzen`);
}

// Instanz-Detail mit allen Werten abrufen
export function getInstanzDetail(instanzId: number): Promise<InstanzDetail> {
  return apiGet<InstanzDetail>(`/instanzen/${instanzId}`);
}

// Einzelnen Wert speichern (auto-save)
export function updateInstanzWert(instanzId: number, wertId: number, data: Record<string, unknown>): Promise<InstanzWert> {
  return apiPatch<InstanzWert>(`/instanzen/${instanzId}/werte/${wertId}`, data);
}

// Kontrolle abgeschlossen Flag setzen
export function setAbgeschlossen(instanzId: number, abgeschlossen: boolean): Promise<InstanzDetail> {
  return apiPatch<InstanzDetail>(`/instanzen/${instanzId}/abgeschlossen`, { abgeschlossen });
}
