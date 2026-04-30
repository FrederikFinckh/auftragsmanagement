# Phase 2 – REST API: Materialnummern CRUD

> **Status:** ✅ Abgeschlossen
> **Abhängigkeiten:** Phase 1 abgeschlossen

---

## Ziel

Vollständige REST API für Materialnummern und deren Prüfargumente. Inklusive Lösch-Schutz (blockiert wenn in Aufträgen verwendet) und Force-Lösch-Modus mit Kaskaden-Löschung.

---

## Verzeichnisstruktur (neu zu erstellen)

```
src/main/java/com/auftrag/
├── dto/
│   ├── MaterialnummerDto.java
│   ├── MaterialnummerCreateDto.java
│   ├── PruefargumentDto.java
│   └── DeleteResultDto.java
├── service/
│   └── MaterialnummerService.java
├── controller/
│   └── MaterialnummerController.java
└── exception/
    ├── MaterialnummerInUseException.java
    ├── ResourceNotFoundException.java
    └── GlobalExceptionHandler.java
```

---

## DTOs im Detail

### `PruefargumentDto`

Wird sowohl für Requests (anlegen/bearbeiten) als auch für Responses verwendet.

```java
// Felder:
Long id;                    // null bei neu anlegen
String bezeichnung;         // Pflichtfeld
PruefargumentTyp typ;       // Pflichtfeld
Boolean kontrollhakenWert;  // nur bei KONTROLLHAKEN
Double toleranzMin;         // nur bei TOLERANZ
Double toleranzMax;         // nur bei TOLERANZ
Double zahlwert;            // nur bei ZAHLWERT
String textWert;            // nur bei TEXT
int reihenfolge;
```

### `MaterialnummerDto` (Response)

```java
// Felder:
Long id;
String nummer;
String beschreibung;
List<PruefargumentDto> pruefargumente;
long auftragCount;          // Anzahl Aufträge die diese Materialnummer verwenden
```

### `MaterialnummerCreateDto` (Request – Anlegen & Bearbeiten)

```java
// Felder:
@NotBlank String nummer;
String beschreibung;
List<PruefargumentDto> pruefargumente;  // kann leer sein
```

### `DeleteResultDto` (Response beim Löschen)

```java
// Felder:
boolean success;
String message;
long affectedAuftraege;     // Anzahl gelöschter Aufträge (nur bei force)
```

---

## Service: `MaterialnummerService`

### `List<MaterialnummerDto> getAlleMaterialien()`
- Lädt alle Materialnummern mit Prüfargumenten
- Berechnet `auftragCount` pro Materialnummer via `AuftragRepository.countByMaterialnummerId()`
- Sortiert nach `nummer` ASC

### `MaterialnummerDto getMaterialById(Long id)`
- Wirft `ResourceNotFoundException` wenn nicht gefunden

### `MaterialnummerDto createMaterial(MaterialnummerCreateDto dto)`
- Validiert: `nummer` darf nicht bereits existieren → `IllegalArgumentException`
- Erstellt `Materialnummer` + alle `Pruefargument`-Einträge
- Setzt `reihenfolge` automatisch (Index in der Liste)
- Gibt gespeicherte Entität als DTO zurück

### `MaterialnummerDto updateMaterial(Long id, MaterialnummerCreateDto dto)`
- Validiert: `nummer` darf nicht von einer anderen Materialnummer verwendet werden
- **Sync-Logik (wichtig):**
  1. Bestehende Prüfargumente mit `id != null` werden aktualisiert
  2. Prüfargumente mit `id == null` werden neu hinzugefügt
  3. Prüfargumente die in der neuen Liste fehlen (anhand ID) werden gelöscht
  4. Für gelöschte Prüfargumente: alle `InstanzWert` mit dieser `pruefargument_id` werden auf `veraltet = true` gesetzt, `pruefargument` auf `null`
  5. Für neue Prüfargumente: in allen bestehenden `Instanz`-Einträgen dieser Materialnummer wird ein neuer `InstanzWert` mit Standardwerten eingefügt
  6. `materialVeraendert = true` wird auf allen betroffenen `Auftrag`- und `Instanz`-Einträgen gesetzt
- Gibt aktualisierte Entität als DTO zurück

### `DeleteResultDto deleteMaterial(Long id, boolean force)`

**Ohne force (`force = false`):**
- Prüft `AuftragRepository.countByMaterialnummerId(id)`
- Wenn > 0: wirft `MaterialnummerInUseException` mit Anzahl der betroffenen Aufträge
- Wenn 0: löscht Materialnummer (Prüfargumente werden via `cascade` mitgelöscht)

**Mit force (`force = true`):**
- Lädt alle `Auftrag`-Einträge mit dieser Materialnummer
- Löscht alle diese Aufträge (Instanzen + InstanzWerte werden via `cascade` mitgelöscht)
- Löscht dann die Materialnummer
- Gibt `DeleteResultDto` mit Anzahl gelöschter Aufträge zurück

---

## Controller: `MaterialnummerController`

**Base-Path:** `/api/materialien`

### `GET /api/materialien`
- Response: `200 OK`, `List<MaterialnummerDto>`

### `GET /api/materialien/{id}`
- Response: `200 OK`, `MaterialnummerDto`
- Fehler: `404 Not Found`

### `POST /api/materialien`
- Request Body: `MaterialnummerCreateDto`
- Response: `201 Created`, `MaterialnummerDto`
- Fehler: `400 Bad Request` (Validierungsfehler oder Nummer bereits vorhanden)

### `PUT /api/materialien/{id}`
- Request Body: `MaterialnummerCreateDto`
- Response: `200 OK`, `MaterialnummerDto`
- Fehler: `404 Not Found`, `400 Bad Request`

### `DELETE /api/materialien/{id}`
- Query-Parameter: `force=false` (optional, default false)
- Response: `200 OK`, `DeleteResultDto`
- Fehler: `404 Not Found`, `409 Conflict` (wenn in Verwendung und kein force)

---

## Exception Handling: `GlobalExceptionHandler`

`@RestControllerAdvice` mit folgenden Handlern:

| Exception | HTTP Status | Response Body |
|---|---|---|
| `ResourceNotFoundException` | `404 Not Found` | `{ "error": "...", "message": "..." }` |
| `MaterialnummerInUseException` | `409 Conflict` | `{ "error": "IN_USE", "message": "...", "count": N }` |
| `IllegalArgumentException` | `400 Bad Request` | `{ "error": "VALIDATION", "message": "..." }` |
| `MethodArgumentNotValidException` | `400 Bad Request` | `{ "error": "VALIDATION", "fields": { ... } }` |

---

## Beispiel-Requests / Responses

### `POST /api/materialien`

**Request:**
```json
{
  "nummer": "M-1234",
  "beschreibung": "Gehäusedeckel Typ A",
  "pruefargumente": [
    {
      "bezeichnung": "Oberflächenqualität",
      "typ": "KONTROLLHAKEN",
      "kontrollhakenWert": false,
      "reihenfolge": 0
    },
    {
      "bezeichnung": "Wandstärke",
      "typ": "TOLERANZ",
      "toleranzMin": 2.5,
      "toleranzMax": 3.5,
      "reihenfolge": 1
    }
  ]
}
```

**Response `201`:**
```json
{
  "id": 1,
  "nummer": "M-1234",
  "beschreibung": "Gehäusedeckel Typ A",
  "auftragCount": 0,
  "pruefargumente": [
    { "id": 1, "bezeichnung": "Oberflächenqualität", "typ": "KONTROLLHAKEN", "kontrollhakenWert": false, "reihenfolge": 0 },
    { "id": 2, "bezeichnung": "Wandstärke", "typ": "TOLERANZ", "toleranzMin": 2.5, "toleranzMax": 3.5, "reihenfolge": 1 }
  ]
}
```

### `DELETE /api/materialien/1` (in Verwendung, kein force)

**Response `409`:**
```json
{
  "error": "IN_USE",
  "message": "Materialnummer wird in 3 Auftrag/Aufträgen verwendet",
  "count": 3
}
```

### `DELETE /api/materialien/1?force=true`

**Response `200`:**
```json
{
  "success": true,
  "message": "Materialnummer und 3 Auftrag/Aufträge wurden gelöscht",
  "affectedAuftraege": 3
}
```

---

## Akzeptanzkriterien

- [ ] `GET /api/materialien` gibt leere Liste zurück wenn keine Materialien vorhanden
- [ ] `POST /api/materialien` erstellt Materialnummer mit Prüfargumenten korrekt
- [ ] Doppelte `nummer` wird mit `400` abgelehnt
- [ ] `PUT /api/materialien/{id}` aktualisiert Prüfargumente korrekt (add/update/delete)
- [ ] Nach `PUT`: neue Prüfargumente erscheinen in bestehenden Instanzen
- [ ] Nach `PUT`: gelöschte Prüfargumente sind in bestehenden Instanzen als `veraltet=true` markiert
- [ ] Nach `PUT`: `materialVeraendert=true` auf betroffenen Aufträgen und Instanzen
- [ ] `DELETE` ohne force gibt `409` zurück wenn Materialnummer in Aufträgen verwendet
- [ ] `DELETE?force=true` löscht Materialnummer + alle zugehörigen Aufträge/Instanzen
