// Zentraler fetch-Wrapper für alle API-Aufrufe
// Basis-URL: /harald/api (Context-Path wird vom Vite-Proxy bzw. Spring Boot aufgelöst)

const BASE_URL = '/harald/api';

// Optionen für einen API-Aufruf
interface ApiOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

// Allgemeiner API-Fetch mit Fehlerbehandlung
export async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { method = 'GET', body, headers = {} } = options;

  const init: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body !== undefined) {
    init.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${path}`, init);

  // Fehlerbehandlung
  if (!response.ok) {
    let errorMessage = `Fehler: ${response.status} ${response.statusText}`;

    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      }
    } catch {
      // JSON-Parsing fehlgeschlagen – Standardfehlermeldung verwenden
    }

    throw new Error(errorMessage);
  }

  // 204 No Content (z.B. bei DELETE)
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// GET-Anfrage
export function apiGet<T>(path: string): Promise<T> {
  return apiFetch<T>(path);
}

// POST-Anfrage
export function apiPost<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'POST', body });
}

// PUT-Anfrage
export function apiPut<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'PUT', body });
}

// PATCH-Anfrage
export function apiPatch<T>(path: string, body: unknown): Promise<T> {
  return apiFetch<T>(path, { method: 'PATCH', body });
}

// DELETE-Anfrage
export function apiDelete<T>(path: string): Promise<T> {
  return apiFetch<T>(path, { method: 'DELETE' });
}
