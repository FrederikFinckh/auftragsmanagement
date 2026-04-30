# Phase 3 – REST API: Aufträge & Instanz-Generierung

> **Status:** ✅ Abgeschlossen
> **Abhängigkeiten:** Phase 1 + 2 abgeschlossen

---

## Ziel

REST API für Aufträge anlegen, abrufen und löschen. Beim Anlegen eines Auftrags werden automatisch N Instanzen mit je einem `InstanzWert` pro `Pruefargument` der gewählten Materialnummer generiert.

---

## Neue Dateien

```
src/main/java/com/auftrag/
├── dto/
│   ├── AuftragDto.java
│   ├── AuftragCreateDto.java
│   ├── InstanzDto.java
│   └── InstanzUebersichtDto.java
├── service/
│   └── AuftragService.java
└── controller/
    └── AuftragController.java
```

---

## DTOs

### `AuftragCreateDto` (Request)
- `@NotBlank String datum` — Format TT.MM.JJJJ
- `@NotBlank String auftragsnummer`
- `@Min(1) int stueckzahl`
- `String kunde` — optional
- `Long materialnummerId` — optional (Auftrag ohne Material möglich)

### `AuftragDto` (Response)
- `Long id`, `String auftragsnummer`, `String datum`, `String kunde`
- `Long materialnummerId`, `String materialnummerNummer`
- `int stueckzahl`, `boolean materialVeraendert`
- `int instanzenAbgeschlossen` — Anzahl Instanzen mit `kontrolleAbgeschlossen=true`

### `InstanzUebersichtDto` (Response – für Übersichtskarten)
- `Long id`, `int nummer`
- `boolean kontrolleAbgeschlossen`, `boolean materialVeraendert`
- `List<InstanzWertDto> werte` — read-only Snapshot

---

## Service: `AuftragService`

### `List<AuftragDto> getAlleAuftraege()`
- Sortiert nach `id` DESC (neueste zuerst)

### `AuftragDto createAuftrag(AuftragCreateDto dto)`
1. Validiert: `auftragsnummer` eindeutig
2. Erstellt `Auftrag`-Entität
3. Wenn `materialnummerId` gesetzt: lädt Prüfargumente
4. Generiert `stueckzahl` × `Instanz`-Einträge (Nummer 1..N)
5. Pro Instanz: für jedes `Pruefargument` einen `InstanzWert` mit kopierten Feldern (`bezeichnung`, `typ`, `reihenfolge`) und Standardwerten anlegen
6. Speichert alles in einer Transaktion (`@Transactional`)

### `List<InstanzUebersichtDto> getInstanzenFuerAuftrag(Long auftragId)`
- Lädt alle Instanzen mit Werten für den Übersichts-Tab

### `void deleteAuftrag(Long id)`
- Löscht Auftrag + Instanzen + Werte via Cascade

---

## Controller: `AuftragController`

**Base-Path:** `/api/auftraege`

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/auftraege` | Alle Aufträge |
| `POST` | `/api/auftraege` | Neuen Auftrag anlegen |
| `GET` | `/api/auftraege/{id}/instanzen` | Instanzen-Übersicht für Auftrag |
| `DELETE` | `/api/auftraege/{id}` | Auftrag löschen |

---

## Akzeptanzkriterien

- [ ] Auftrag anlegen generiert korrekt N Instanzen mit Werten
- [ ] Auftrag ohne Materialnummer ist möglich (keine Instanz-Werte)
- [ ] Doppelte `auftragsnummer` wird mit `400` abgelehnt
- [ ] `GET /api/auftraege/{id}/instanzen` gibt alle Instanzen mit Werten zurück
- [ ] Löschen eines Auftrags entfernt alle Instanzen und Werte
