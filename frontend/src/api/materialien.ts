// API-Funktionen für die Materialien-Endpunkte

import { apiGet, apiPost, apiPut, apiDelete } from './client';
import type { Materialnummer, MaterialnummerCreate, DeleteResult } from '../types/material';

// Alle Materialien abrufen
export function getMaterialien(): Promise<Materialnummer[]> {
  return apiGet<Materialnummer[]>('/materialien');
}

// Einzelne Materialnummer anhand der ID abrufen
export function getMaterialById(id: number): Promise<Materialnummer> {
  return apiGet<Materialnummer>(`/materialien/${id}`);
}

// Neue Materialnummer anlegen
export function createMaterial(data: MaterialnummerCreate): Promise<Materialnummer> {
  return apiPost<Materialnummer>('/materialien', data);
}

// Materialnummer bearbeiten (triggert Sync-Logik)
export function updateMaterial(id: number, data: MaterialnummerCreate): Promise<Materialnummer> {
  return apiPut<Materialnummer>(`/materialien/${id}`, data);
}

// Materialnummer löschen (blockiert oder force)
export function deleteMaterial(id: number, force: boolean = false): Promise<DeleteResult> {
  return apiDelete<DeleteResult>(`/materialien/${id}?force=${force}`);
}
