# AGENTS.md — Auftragsverwaltung

Dieses Dokument beschreibt das Projekt, die Architektur, Konventionen und den Implementierungsplan für KI-Agenten und Entwickler.

---

## Projektübersicht

**Auftragsverwaltung** ist eine Spring Boot + React WebApp zur Verwaltung von Fertigungsaufträgen.

### Kernkonzepte

- **Materialnummer** — Template mit konfigurierbaren Prüfargumenten (Kontrollhaken, Toleranz, Zahlwert, Text)
- **Auftrag** — Enthält eine Stückzahl N einer Materialnummer + Metadaten (Datum, Auftragsnummer, Kunde)
- **Instanz** — Beim Anlegen eines Auftrags werden automatisch N Instanzen generiert (eine pro Stück)
- **InstanzWert** — Jede Instanz hat eine Kopie aller Prüfargumente des Templates zum Ausfüllen
- **Kontrolle abgeschlossen** — Checkbox am Ende jeder Instanz

### Wichtige Geschäftsregeln

1. Instanzen werden **sofort beim Anlegen** des Auftrags generiert (N Stück)
2. Instanzen werden automatisch nummeriert: Nr 1 … Nr N
3. Werte werden **auto-saved** (kein Speichern-Button, 300 ms Debounce)
4. Wenn eine Materialnummer bearbeitet wird:
   - Neue Prüfargumente → werden in **alle bestehenden Instanzen** eingefügt
   - Gelöschte Prüfargumente → werden in bestehenden Instanzen als `veraltet=true` markiert (bleiben sichtbar, read-only)
   - Betroffene Aufträge und Instanzen erhalten `materialVeraendert=true` (Warn-Icon ⚠️)
5. Materialnummer löschen:
   - Blockiert wenn in Aufträgen verwendet → `409 Conflict`
   - Force-Modus: Benutzer muss Materialnummer als Text bestätigen → löscht auch alle Aufträge

---

## Tech-Stack

| Schicht | Technologie |
|---|---|
| Backend | Spring Boot 3.4.1, Java 17, Spring Data JPA, Spring Validation |
| Datenbank | SQLite (`data/auftrag.db`) via `sqlite-jdbc` + Hibernate Community Dialects |
| Frontend | React 19, TypeScript, Vite, MUI v9 (`@mui/material`) |
| Build | Gradle (Kotlin DSL), pnpm |

---

## Projektstruktur

```
/
├── build.gradle.kts                  # Gradle Build (Backend + Frontend-Build-Tasks)
├── gradlew / gradlew.bat
├── data/                             # SQLite-Datenbankdatei (wird zur Laufzeit erstellt)
├── plans/                            # Plandokumente pro Phase
│   ├── phase1-datenmodell-backend.md
│   ├── phase2-api-materialien.md
│   ├── phase3-api-auftraege.md
│   ├── phase4-api-instanzwerte.md
│   ├── phase5-frontend-grundgeruest.md
│   ├── phase6-frontend-materialien.md
│   ├── phase7-frontend-auftraege.md
│   ├── phase8-frontend-mittelbereich.md
│   ├── phase9-frontend-instanz-tab.md
│   └── phase10-frontend-loeschmodal.md
├── ui_spec.md                        # Vollständige UI-Layout-Spezifikation
├── src/main/java/com/auftrag/
│   ├── AuftragApplication.java
│   ├── model/                        # JPA Entities
│   ├── repository/                   # Spring Data Repositories
│   ├── dto/                          # Request/Response DTOs
│   ├── service/                      # Business-Logik
│   ├── controller/                   # REST Controller
│   └── exception/                    # Exceptions + GlobalExceptionHandler
├── src/main/resources/
│   └── application.properties
└── frontend/
    ├── src/
    │   ├── api/                      # fetch-Wrapper + API-Funktionen
    │   ├── theme/                    # MUI Theme
    │   ├── context/                  # React Context (TabContext)
    │   ├── types/                    # TypeScript-Typen
    │   └── components/
    │       ├── layout/               # AppHeader, AppFooter, Sidebars, ResizeHandle
    │       ├── common/               # Wiederverwendbare Komponenten
    │       ├── materialien/          # Rechte Sidebar + Dialoge
    │       ├── auftraege/            # Linke Sidebar + Dialoge
    │       ├── mitte/                # Mittelbereich + Tab-Zeilen + Übersichtskarten
    │       └── instanz/              # Instanz-Tab + Prüfargument-Felder
    └── package.json
```

---

## Datenmodell

```
Materialnummer (1) ──── (N) Pruefargument
Materialnummer (1) ──── (N) Auftrag
Auftrag        (1) ──── (N) Instanz
Instanz        (1) ──── (N) InstanzWert
Pruefargument  (1) ──── (N) InstanzWert   [nullable, null wenn veraltet]
```

### Entitäten (Kurzübersicht)

| Entität | Wichtige Felder |
|---|---|
| `Materialnummer` | `id`, `nummer` (UNIQUE), `beschreibung`, `pruefargumente` |
| `Pruefargument` | `id`, `materialnummer`, `bezeichnung`, `typ` (Enum), Wertfelder, `reihenfolge` |
| `Auftrag` | `id`, `auftragsnummer` (UNIQUE), `datum`, `kunde`, `materialnummer`, `stueckzahl`, `materialVeraendert` |
| `Instanz` | `id`, `auftrag`, `nummer`, `kontrolleAbgeschlossen`, `materialVeraendert` |
| `InstanzWert` | `id`, `instanz`, `pruefargument` (nullable), `bezeichnung` (Kopie), `typ` (Kopie), Wertfelder, `veraltet`, `reihenfolge` |

### Enum `PruefargumentTyp`
```
KONTROLLHAKEN | TOLERANZ | ZAHLWERT | TEXT
```

---

## REST API Übersicht

> **Context-Path:** `/harald` — Alle API-Pfade sind relativ zum Context-Path.
> Die vollständige URL ist also `http://localhost:8080/harald/api/...`.

| Methode | Pfad | Beschreibung |
|---|---|---|
| `GET` | `/api/materialien` | Alle Materialnummern |
| `POST` | `/api/materialien` | Neue Materialnummer anlegen |
| `PUT` | `/api/materialien/{id}` | Materialnummer bearbeiten (triggert Sync) |
| `DELETE` | `/api/materialien/{id}?force=false` | Löschen (blockiert oder force) |
| `GET` | `/api/auftraege` | Alle Aufträge |
| `POST` | `/api/auftraege` | Neuen Auftrag anlegen (generiert N Instanzen) |
| `GET` | `/api/auftraege/{id}/instanzen` | Instanzen-Übersicht für Auftrag |
| `DELETE` | `/api/auftraege/{id}` | Auftrag löschen |
| `GET` | `/api/instanzen/{id}` | Instanz-Detail mit allen Werten |
| `PATCH` | `/api/instanzen/{id}/werte/{wertId}` | Einzelnen Wert speichern (auto-save) |
| `PATCH` | `/api/instanzen/{id}/abgeschlossen` | Kontrolle abgeschlossen setzen |

### Fehler-Responses

| Exception | HTTP | Body |
|---|---|---|
| `ResourceNotFoundException` | `404` | `{ "error": "NOT_FOUND", "message": "..." }` |
| `MaterialnummerInUseException` | `409` | `{ "error": "IN_USE", "message": "...", "count": N }` |
| `IllegalArgumentException` | `400` | `{ "error": "VALIDATION", "message": "..." }` |
| `MethodArgumentNotValidException` | `400` | `{ "error": "VALIDATION", "fields": { ... } }` |

---

## Frontend-Navigationsmodell

```
┌─────────────────────────────────────────────────────────────┐
│  AppBar: „Auftragsverwaltung"                               │
├──────────────┬──────────────────────────────┬───────────────┤
│ Linke Sidebar│  Tab-Zeile 1: Auftrag-Tabs   │ Rechte Sidebar│
│ (Aufträge)   ├──────────────────────────────┤ (Materialien) │
│              │  Tab-Zeile 2: Instanz-Tabs   │               │
│              │  [Übersicht][Nr1][Nr2]...    │               │
│              ├──────────────────────────────┤               │
│              │  Tab-Inhalt                  │               │
├──────────────┴──────────────────────────────┴───────────────┤
│  Footer: [← Aufträge]  Auftragsverwaltung  [Materialien →]  │
└─────────────────────────────────────────────────────────────┘
```

- **Obere Tab-Zeile**: ein Tab pro geöffnetem Auftrag
- **Untere Tab-Zeile**: erster Tab = Übersicht (Karten aller Instanzen), weitere Tabs = einzelne Instanzen
- **Übersichtskarte**: Instanz-Nr, Materialnummer, Status-Icon (grün=abgeschlossen/grau=offen), read-only Prüfargumente, ⚠️ wenn `materialVeraendert`
- **Instanz-Tab**: Instanz-Infos + ausfüllbares Prüfformular + Checkbox „Kontrolle abgeschlossen"

---

## Coding-Konventionen

### Backend (Java)
- Alle Kommentare im Quellcode auf **Deutsch**
- Package: `com.auftrag`
- DTOs sind einfache Java-Klassen (keine Records, für Kompatibilität mit Validierung)
- Services sind `@Transactional` wo nötig
- Controller geben immer `ResponseEntity<T>` zurück
- Keine Lombok-Abhängigkeit — Getter/Setter manuell oder via IDE

### Frontend (TypeScript/React)
- Alle sichtbaren Texte, Labels, Fehlermeldungen auf **Deutsch**
- Alle Kommentare im Quellcode auf **Deutsch**
- Funktionale Komponenten mit Hooks
- MUI-Komponenten gemäß `ui_spec.md`
- API-Calls in `src/api/` zentralisiert
- Kein globales State-Management-Framework — React Context + `useState`
- Auto-Save mit 300 ms Debounce via `useEffect` + `setTimeout`

---

## Implementierungsphasen

| Phase | Dokument | Inhalt | Status |
|---|---|---|---|
| 1 | `plans/phase1-datenmodell-backend.md` | JPA Entities, Repositories, SQLite-Config | ✅ |
| 2 | `plans/phase2-api-materialien.md` | Materialien CRUD + Sync-Logik + Force-Löschung | ✅ |
| 3 | `plans/phase3-api-auftraege.md` | Aufträge + Instanz-Generierung | ✅ |
| 4 | `plans/phase4-api-instanzwerte.md` | Instanz-Werte Auto-Save + Abgeschlossen-Flag | ✅ |
| 5 | `plans/phase5-frontend-grundgeruest.md` | Layout, MUI Theme, Sidebar-Resize | ✅ |
| 6 | `plans/phase6-frontend-materialien.md` | Rechte Sidebar: Materialliste + Dialog | ✅ |
| 7 | `plans/phase7-frontend-auftraege.md` | Linke Sidebar: Auftragsliste + 2-Schritt-Dialog | ✅ |
| 8 | `plans/phase8-frontend-mittelbereich.md` | Doppelte Tab-Zeile + Übersichtskarten | ✅ |
| 9 | `plans/phase9-frontend-instanz-tab.md` | Instanz-Tab: Prüfformular + Auto-Save | ✅ |
| 10 | `plans/phase10-frontend-loeschmodal.md` | Lösch-Modal mit Force-Bestätigung | 🔲 |

> **Workflow:** Nach Abschluss jeder Phase:
> 1. Das jeweilige Plandokument wird mit `✅ Abgeschlossen` markiert und ggf. aktualisiert.
> 2. Das abgeschlossene Plandokument wird in den Ordner `plans/legacy/` verschoben.
> 3. Es wird ein Git-Commit mit einer deskriptiven Nachricht erstellt, z.B. `feat: Phase 1 – Datenmodell & Backend-Grundstruktur`.

---

## Testen von Änderungen

> ⚠️ **PFLICHT:** Nach jeder Implementierungsphase MUSS **ausschließlich** das Skript `test.sh` zum Testen verwendet werden. Kein anderes Testverfahren ist erlaubt.

```bash
if [[ $(sha256sum test.sh) == "88e87cdd6ee2f1af0405a455786e5e771d08005f4190c351055d8074d01dd0ea  test.sh" ]]; then ./test.sh ; fi
```

Das Skript führt folgende Schritte in dieser Reihenfolge aus:
1. **TypeScript-Kompilierung** (`tsc --noEmit`) — prüft das Frontend auf Typfehler
2. **Gradle Build** (`./gradlew build`) — kompiliert Backend + Frontend, führt Tests aus
3. **Backend starten** (`./gradlew bootRun`) — startet den Server auf Port 8080

Das Skript bricht bei jedem Fehler sofort ab (`set -e`).
Der SHA256-Check stellt sicher, dass `test.sh` nicht verändert wurde.

---

## Entwicklung starten

> **Context-Path:** Die App wird unter `/harald` ausgeliefert.
> - Produktion: `http://localhost:8080/harald/` (Frontend wird in `static/` kopiert)
> - Dev-Modus: `http://localhost:5173/harald/` (Vite Proxy → `localhost:8080`)

```bash
# Backend starten (Port 8080, Context-Path /harald)
./gradlew bootRun

# Frontend Dev-Server starten (Port 5173, Proxy → 8080/harald/api)
cd frontend && pnpm dev

# Vollständigen Build erstellen (Frontend wird in static/ kopiert)
./gradlew build
```

Die SQLite-Datenbank wird automatisch unter `data/auftrag.db` erstellt.

# Always use pnpm NOT npm NOT npx NOT something else!