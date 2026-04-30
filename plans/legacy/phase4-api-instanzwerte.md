# Phase 4 – REST API: Instanz-Werte Auto-Save & Instanz-Details

> **Status:** ✅ Abgeschlossen
> **Abhängigkeiten:** Phase 1–3 abgeschlossen

---

## Ziel

API-Endpunkte für das Abrufen und Speichern einzelner Instanz-Werte (auto-save bei jeder Änderung) sowie das Setzen des „Kontrolle abgeschlossen"-Flags.

---

## Neue Dateien

```
src/main/java/com/auftrag/
├── dto/
│   ├── InstanzDetailDto.java
│   ├── InstanzWertDto.java
│   └── InstanzWertUpdateDto.java
├── service/
│   └── InstanzService.java
└── controller/
    └── InstanzController.java
```

---

## DTOs

### `InstanzDetailDto` (Response – vollständige Instanz für Tab-Ansicht)
- `Long id`, `int nummer`, `boolean kontrolleAbgeschlossen`, `boolean materialVeraendert`
- `Long auftragId`, `String auftragsnummer`, `String datum`, `String kunde`
- `String materialnummerNummer`
- `List<InstanzWertDto> werte`

### `InstanzWertDto` (Response)
- `Long id`, `String bezeichnung`, `PruefargumentTyp typ`
- `Boolean kontrollhakenWert`, `Double toleranzMin`, `Double toleranzMax`
- `Double zahlwert`, `String textWert`
- `boolean veraltet`, `int reihenfolge`

### `InstanzWertUpdateDto` (Request – PATCH)
- Nur die Wertfelder (je nach Typ wird nur das relevante Feld gesetzt):
- `Boolean kontrollhakenWert`
- `Double toleranzMin`, `Double toleranzMax`
- `Double zahlwert`
- `String textWert`

---

## Service: `InstanzService`

### `InstanzDetailDto getInstanzDetail(Long instanzId)`
- Lädt Instanz mit allen Werten, sortiert nach `reihenfolge`

### `InstanzWertDto updateWert(Long instanzId, Long wertId, InstanzWertUpdateDto dto)`
- Validiert: `wertId` gehört zu `instanzId`
- Aktualisiert nur die relevanten Felder (je nach `typ`)
- Gibt aktualisierten Wert zurück

### `InstanzDetailDto setKontrolleAbgeschlossen(Long instanzId, boolean abgeschlossen)`
- Setzt `kontrolleAbgeschlossen` auf der Instanz
- Gibt aktualisierte Instanz zurück

---

## Controller: `InstanzController`

**Base-Path:** `/api/instanzen`

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/instanzen/{id}` | Instanz-Detail mit allen Werten |
| `PATCH` | `/api/instanzen/{id}/werte/{wertId}` | Einzelnen Wert speichern (auto-save) |
| `PATCH` | `/api/instanzen/{id}/abgeschlossen` | Kontrolle abgeschlossen setzen |

**`PATCH /api/instanzen/{id}/abgeschlossen`** — Request Body: `{ "abgeschlossen": true }`

---

## Akzeptanzkriterien

- [ ] `GET /api/instanzen/{id}` gibt vollständige Instanz mit Werten zurück
- [ ] `PATCH` auf Wert speichert korrekt (nur relevante Felder je nach Typ)
- [ ] Veraltete Werte (`veraltet=true`) werden zurückgegeben aber können nicht mehr geändert werden (`400`)
- [ ] `PATCH abgeschlossen` setzt Flag korrekt
