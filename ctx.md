# Project Context — Auftragsverwaltung

> **Generated:** 2026-04-30  
> **Purpose:** Full project state reference for continuing development in a new task session.

---

## Project Overview

**Auftragsverwaltung** is a Spring Boot + React web app for managing manufacturing orders (Fertigungsaufträge). It runs under the `/harald` context path.

### Core Domain Concepts

- **Materialnummer** — Template with configurable Prüfargumente (inspection arguments): KONTROLLHAKEN, TOLERANZ, ZAHLWERT, TEXT
- **Auftrag** — Contains a quantity N of a Materialnummer + metadata (datum, auftragsnummer, kunde)
- **Instanz** — When an Auftrag is created, N instances are auto-generated (one per piece), numbered 1..N
- **InstanzWert** — Each instance gets a copy of all Prüfargumente from the template for filling in
- **Kontrolle abgeschlossen** — Checkbox at the end of each instance

### Key Business Rules

1. Instances are generated **immediately on Auftrag creation** (N pieces)
2. Instances are auto-numbered: Nr 1 … Nr N
3. Values are **auto-saved** (no save button, 300ms debounce)
4. When a Materialnummer is edited:
   - New Prüfargumente → inserted into **all existing instances**
   - Deleted Prüfargumente → marked as `veraltet=true` in existing instances (remain visible, read-only)
   - Affected Aufträge and Instanzen get `materialVeraendert=true` (warning icon ⚠️)
5. Deleting a Materialnummer:
   - Blocked if used in Aufträgen → `409 Conflict` with `IN_USE` error + `count`
   - Force mode: user must confirm by typing the Materialnummer text → deletes Materialnummer + all dependent Aufträge

---

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | Spring Boot 3.4.1, Java 17, Spring Data JPA, Spring Validation |
| Database | SQLite (`data/auftrag.db`) via `sqlite-jdbc` + Hibernate Community Dialects |
| Frontend | React 19, TypeScript, Vite 8, MUI v9 (`@mui/material`), `@mui/icons-material` v9 |
| Build | Gradle (Kotlin DSL), pnpm |

---

## Project Structure

```
/
├── build.gradle.kts                  # Gradle Build (Backend + Frontend-Build-Tasks)
├── gradlew / gradlew.bat
├── test.sh                           # SHA256-verified test script
├── data/                             # SQLite database (runtime)
├── plans/                            # Active plan documents
│   ├── phase6-frontend-materialien.md
│   ├── phase7-frontend-auftraege.md
│   ├── phase8-frontend-mittelbereich.md
│   ├── phase9-frontend-instanz-tab.md
│   ├── phase10-frontend-loeschmodal.md
│   └── legacy/                       # Completed phase plans
│       ├── phase1-datenmodell-backend.md
│       ├── phase2-api-materialien.md
│       ├── phase3-api-auftraege.md
│       ├── phase4-api-instanzwerte.md
│       └── phase5-frontend-grundgeruest.md
├── ui_spec.md                        # Full UI layout specification
├── AGENTS.md                         # Project conventions and phase tracking
├── src/main/java/com/auftrag/
│   ├── AuftragApplication.java
│   ├── model/                        # JPA Entities
│   │   ├── Materialnummer.java
│   │   ├── Pruefargument.java
│   │   ├── PruefargumentTyp.java     # Enum: KONTROLLHAKEN, TOLERANZ, ZAHLWERT, TEXT
│   │   ├── Auftrag.java
│   │   ├── Instanz.java
│   │   └── InstanzWert.java
│   ├── repository/                   # Spring Data Repositories
│   │   ├── MaterialnummerRepository.java
│   │   ├── PruefargumentRepository.java
│   │   ├── AuftragRepository.java
│   │   ├── InstanzRepository.java
│   │   └── InstanzWertRepository.java
│   ├── dto/                          # Request/Response DTOs
│   │   ├── MaterialnummerDto.java    # Response: id, nummer, beschreibung, pruefargumente, auftragCount
│   │   ├── MaterialnummerCreateDto.java # Request: nummer, beschreibung, pruefargumente
│   │   ├── PruefargumentDto.java     # Request+Response: id, bezeichnung, typ, value fields, reihenfolge
│   │   ├── DeleteResultDto.java      # Response: success, message, affectedAuftraege
│   │   ├── AuftragDto.java           # Response: id, auftragsnummer, datum, kunde, materialnummerId, etc.
│   │   ├── AuftragCreateDto.java     # Request: datum, auftragsnummer, stueckzahl, kunde, materialnummerId
│   │   ├── InstanzUebersichtDto.java # Response: id, nummer, kontrolleAbgeschlossen, materialVeraendert, werte
│   │   ├── InstanzDetailDto.java     # Response: full detail with auftrag info + werte
│   │   ├── InstanzWertDto.java       # Response: id, bezeichnung, typ, value fields, veraltet, reihenfolge
│   │   ├── InstanzWertUpdateDto.java # Request: only value fields (kontrollhakenWert, toleranzMin/Max, zahlwert, textWert)
│   │   └── AbgeschlossenDto.java     # Request: boolean abgeschlossen
│   ├── service/                      # Business Logic
│   │   ├── MaterialnummerService.java
│   │   ├── AuftragService.java
│   │   └── InstanzService.java
│   ├── controller/                   # REST Controllers
│   │   ├── MaterialnummerController.java
│   │   ├── AuftragController.java
│   │   └── InstanzController.java
│   └── exception/                    # Exceptions + GlobalExceptionHandler
│       ├── ResourceNotFoundException.java
│       ├── MaterialnummerInUseException.java
│       └── GlobalExceptionHandler.java
├── src/main/resources/
│   └── application.properties
└── frontend/
    ├── package.json
    ├── pnpm-lock.yaml
    ├── vite.config.ts
    ├── tsconfig.app.json
    ├── tsconfig.json
    ├── tsconfig.node.json
    ├── eslint.config.js
    ├── index.html
    └── src/
        ├── main.tsx                  # StrictMode + ThemeProvider + CssBaseline
        ├── App.tsx                   # Full layout with resizable sidebars
        ├── index.css                 # Minimal global styles
        ├── api/
        │   └── client.ts            # Fetch wrapper: BASE_URL=/harald/api, exports apiGet/apiPost/apiPut/apiPatch/apiDelete
        ├── theme/
        │   └── theme.ts            # MUI theme: secondary.main=#e0e0e0, no textTransform, tab minHeight 42
        ├── components/
        │   ├── layout/
        │   │   ├── AppHeader.tsx    # AppBar with FactoryIcon + title
        │   │   ├── AppFooter.tsx    # Footer with sidebar toggle buttons
        │   │   ├── LeftSidebar.tsx  # Placeholder (Aufträge)
        │   │   ├── RightSidebar.tsx # Placeholder (Materialien)
        │   │   └── ResizeHandle.tsx # 8px col-resize handle
        │   └── common/
        │       └── LoadingSpinner.tsx # Centered CircularProgress size 24
        └── types/                    # (empty — to be created in Phase 6)
```

---

## Data Model

```
Materialnummer (1) ──── (N) Pruefargument
Materialnummer (1) ──── (N) Auftrag
Auftrag        (1) ──── (N) Instanz
Instanz        (1) ──── (N) InstanzWert
Pruefargument  (1) ──── (N) InstanzWert   [nullable, null wenn veraltet]
```

### Entity Fields (Summary)

| Entity | Key Fields |
|---|---|
| `Materialnummer` | `id`, `nummer` (UNIQUE), `beschreibung`, `pruefargumente` |
| `Pruefargument` | `id`, `materialnummer`, `bezeichnung`, `typ` (Enum), value fields, `reihenfolge` |
| `Auftrag` | `id`, `auftragsnummer` (UNIQUE), `datum`, `kunde`, `materialnummer`, `stueckzahl`, `materialVeraendert` |
| `Instanz` | `id`, `auftrag`, `nummer`, `kontrolleAbgeschlossen`, `materialVeraendert` |
| `InstanzWert` | `id`, `instanz`, `pruefargument` (nullable), `bezeichnung` (copy), `typ` (copy), value fields, `veraltet`, `reihenfolge` |

### Enum `PruefargumentTyp`
```
KONTROLLHAKEN | TOLERANZ | ZAHLWERT | TEXT
```

---

## REST API (Context-Path: `/harald`)

All paths below are relative to `http://localhost:8080/harald`.

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/materialien` | All Materialnummern (sorted by nummer ASC) |
| `GET` | `/api/materialien/{id}` | Single Materialnummer by ID |
| `POST` | `/api/materialien` | Create new Materialnummer (201 Created) |
| `PUT` | `/api/materialien/{id}` | Update Materialnummer (triggers sync logic) |
| `DELETE` | `/api/materialien/{id}?force=false` | Delete (blocked or force) |
| `GET` | `/api/auftraege` | All Aufträge (sorted by id DESC) |
| `POST` | `/api/auftraege` | Create Auftrag (generates N instances) |
| `GET` | `/api/auftraege/{id}/instanzen` | Instance overview for Auftrag |
| `DELETE` | `/api/auftraege/{id}` | Delete Auftrag (204 No Content) |
| `GET` | `/api/instanzen/{id}` | Instance detail with all values |
| `PATCH` | `/api/instanzen/{id}/werte/{wertId}` | Update single value (auto-save) |
| `PATCH` | `/api/instanzen/{id}/abgeschlossen` | Set kontrolle abgeschlossen flag |

### Error Responses

| Exception | HTTP | Body Shape |
|---|---|---|
| `ResourceNotFoundException` | `404` | `{ "error": "NOT_FOUND", "message": "..." }` |
| `MaterialnummerInUseException` | `409` | `{ "error": "IN_USE", "message": "...", "count": N }` |
| `IllegalArgumentException` | `400` | `{ "error": "VALIDATION", "message": "..." }` |
| `MethodArgumentNotValidException` | `400` | `{ "error": "VALIDATION", "fields": { "field": "message" } }` |

### DTO Details for API Integration

**MaterialnummerDto** (Response):
```json
{
  "id": 1,
  "nummer": "MAT-001",
  "beschreibung": "Beschreibungstext",
  "pruefargumente": [PruefargumentDto...],
  "auftragCount": 3
}
```

**MaterialnummerCreateDto** (Request for POST/PUT):
```json
{
  "nummer": "MAT-001",
  "beschreibung": "Beschreibungstext",
  "pruefargumente": [PruefargumentDto...]
}
```

**PruefargumentDto** (Request+Response):
```json
{
  "id": null,           // null for new, existing ID for update
  "bezeichnung": "Check 1",
  "typ": "KONTROLLHAKEN",
  "kontrollhakenWert": true,
  "toleranzMin": null,
  "toleranzMax": null,
  "zahlwert": null,
  "textWert": null,
  "reihenfolge": 0
}
```

**DeleteResultDto** (Response for DELETE):
```json
{
  "success": true,
  "message": "Materialnummer wurde gelöscht",
  "affectedAuftraege": 0
}
```

**AuftragCreateDto** (Request):
```json
{
  "datum": "30.04.2026",
  "auftragsnummer": "A-2026-001",
  "stueckzahl": 5,
  "kunde": "Kunde GmbH",
  "materialnummerId": 1
}
```

**AuftragDto** (Response):
```json
{
  "id": 1,
  "auftragsnummer": "A-2026-001",
  "datum": "30.04.2026",
  "kunde": "Kunde GmbH",
  "materialnummerId": 1,
  "materialnummerNummer": "MAT-001",
  "stueckzahl": 5,
  "materialVeraendert": false,
  "instanzenAbgeschlossen": 2
}
```

**InstanzUebersichtDto** (Response):
```json
{
  "id": 1,
  "nummer": 1,
  "kontrolleAbgeschlossen": false,
  "materialVeraendert": false,
  "werte": [InstanzWertDto...]
}
```

**InstanzDetailDto** (Response):
```json
{
  "id": 1,
  "nummer": 1,
  "kontrolleAbgeschlossen": false,
  "materialVeraendert": false,
  "auftragId": 1,
  "auftragsnummer": "A-2026-001",
  "datum": "30.04.2026",
  "kunde": "Kunde GmbH",
  "materialnummerNummer": "MAT-001",
  "werte": [InstanzWertDto...]
}
```

**InstanzWertDto** (Response):
```json
{
  "id": 1,
  "bezeichnung": "Check 1",
  "typ": "KONTROLLHAKEN",
  "kontrollhakenWert": true,
  "toleranzMin": null,
  "toleranzMax": null,
  "zahlwert": null,
  "textWert": null,
  "veraltet": false,
  "reihenfolge": 0
}
```

**InstanzWertUpdateDto** (Request for PATCH):
```json
{
  "kontrollhakenWert": true,
  "toleranzMin": 1.5,
  "toleranzMax": 2.5,
  "zahlwert": 42.0,
  "textWert": "OK"
}
```

**AbgeschlossenDto** (Request for PATCH):
```json
{
  "abgeschlossen": true
}
```

---

## Frontend Layout (Current State)

```
┌─────────────────────────────────────────────────────────────┐
│  AppBar: FactoryIcon + „Auftragsverwaltung"                 │
├──────────────┬──────────────────────────────┬───────────────┤
│ Linke Sidebar│  Mittelbereich               │ Rechte Sidebar│
│ (Aufträge)   │  Leerzustand:                │ (Materialien) │
│ Placeholder  │  „Auftrag auswählen..."      │ Placeholder   │
│              │                              │               │
├──────────────┴──────────────────────────────┴───────────────┤
│  Footer: [← Aufträge]  Auftragsverwaltung  [Materialien →]  │
└─────────────────────────────────────────────────────────────┘
```

- Sidebars are resizable (200–600px, default 350px) via drag handles
- Footer toggles sidebar visibility
- Center area shows empty state text

### Existing Frontend Files

| File | Description |
|---|---|
| `frontend/src/main.tsx` | Entry: StrictMode + ThemeProvider + CssBaseline |
| `frontend/src/App.tsx` | Layout: 100vh flex, sidebars + resize + center |
| `frontend/src/index.css` | Global: box-sizing, height 100%, overflow hidden |
| `frontend/src/api/client.ts` | Fetch wrapper with BASE_URL=/harald/api |
| `frontend/src/theme/theme.ts` | MUI theme config |
| `frontend/src/components/layout/AppHeader.tsx` | AppBar with FactoryIcon |
| `frontend/src/components/layout/AppFooter.tsx` | Footer with toggle buttons |
| `frontend/src/components/layout/LeftSidebar.tsx` | Placeholder for Aufträge |
| `frontend/src/components/layout/RightSidebar.tsx` | Placeholder for Materialien |
| `frontend/src/components/layout/ResizeHandle.tsx` | 8px col-resize handle |
| `frontend/src/components/common/LoadingSpinner.tsx` | Centered CircularProgress |

### MUI v9 Important Note

MUI v9 Typography does **NOT** accept `fontWeight` or `textAlign` as direct props. Use `sx` prop instead:
```tsx
// WRONG:
<Typography fontWeight="bold" textAlign="center">

// CORRECT:
<Typography sx={{ fontWeight: 'bold', textAlign: 'center' }}>
```

---

## Configuration

### application.properties
```properties
spring.datasource.url=jdbc:sqlite:data/auftrag.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=update
server.port=8080
server.servlet.context-path=/harald
```

### vite.config.ts
```typescript
base: '/harald/',
server: {
  proxy: {
    '/harald/api': { target: 'http://localhost:8080', changeOrigin: true }
  }
}
```

### API Client
```typescript
const BASE_URL = '/harald/api';
// Exports: apiGet, apiPost, apiPut, apiPatch, apiDelete
// Error handling: parses JSON body for `message` field, throws Error
// 204 No Content returns undefined
```

---

## Testing

**Mandatory test command after each phase:**
```bash
if [[ $(sha256sum test.sh) == "88e87cdd6ee2f1af0405a455786e5e771d08005f4190c351055d8074d01dd0ea  test.sh" ]]; then ./test.sh ; fi
```

The script runs:
1. `tsc --noEmit` — TypeScript type checking
2. `./gradlew build` — Full build (Backend + Frontend)
3. `./gradlew bootRun` — Starts server on port 8080

Exit code 137 (SIGKILL) on bootRun is expected — the script kills the process after verifying startup.

---

## Development Commands

```bash
# Backend only
./gradlew bootRun

# Frontend dev server (port 5173, proxies API to 8080)
cd frontend && pnpm dev

# Full production build
./gradlew build
```

- Production: `http://localhost:8080/harald/`
- Dev mode: `http://localhost:5173/harald/`

---

## Phase Status

| Phase | Description | Status |
|---|---|---|
| 1 | Datenmodell & Backend-Grundstruktur | ✅ Completed |
| 2 | REST API — Materialnummern CRUD + Sync + Force-Löschung | ✅ Completed |
| 3 | REST API — Aufträge + Instanz-Generierung | ✅ Completed |
| 4 | REST API — Instanz-Werte Auto-Save + Abgeschlossen-Flag | ✅ Completed |
| 5 | Frontend-Grundgerüst — Layout, MUI Theme, Sidebar-Resize | ✅ Completed |
| 6 | Frontend — Rechte Seitenleiste: Materialnummern | 🔲 **Next to implement** |
| 7 | Frontend — Linke Seitenleiste: Aufträge | 🔲 Pending |
| 8 | Frontend — Mittelbereich: Doppelte Tab-Zeile + Übersichtskarten | 🔲 Pending |
| 9 | Frontend — Instanz-Tab: Prüfargumente ausfüllen, Auto-Save | 🔲 Pending |
| 10 | Frontend — Lösch-Modal mit Force-Bestätigung | 🔲 Pending |

### Post-Phase Workflow
1. Mark plan document with `✅ Abgeschlossen`
2. Move completed plan to `plans/legacy/`
3. Update AGENTS.md phase table
4. Git commit with descriptive message (e.g. `feat: Phase 6 – Frontend Rechte Seitenleiste Materialnummern`)

---

## Phase 6 Plan Details (Next to Implement)

**Source:** `plans/phase6-frontend-materialien.md`

### New Files to Create

```
frontend/src/
├── api/
│   └── materialien.ts           # API functions for Materialien
├── components/
│   └── materialien/
│       ├── MaterialienListe.tsx  # List area of right sidebar
│       ├── MaterialItem.tsx      # Single material row with expand
│       ├── PruefargumentItem.tsx # Single Prüfargument row (read-only)
│       └── MaterialDialog.tsx   # Create/Edit dialog
└── types/
    └── material.ts              # TypeScript types for Materialien
```

### Key Tasks

1. **`material.ts`** — TypeScript types matching backend DTOs:
   - `Materialnummer` (id, nummer, beschreibung, pruefargumente, auftragCount)
   - `Pruefargument` (id, bezeichnung, typ, value fields, reihenfolge)
   - `PruefargumentTyp` enum
   - `MaterialnummerCreate` (nummer, beschreibung, pruefargumente)
   - `DeleteResult` (success, message, affectedAuftraege)

2. **`materialien.ts`** — API functions:
   - `getMaterialien()` → `Materialnummer[]`
   - `getMaterialById(id)` → `Materialnummer`
   - `createMaterial(data)` → `Materialnummer`
   - `updateMaterial(id, data)` → `Materialnummer`
   - `deleteMaterial(id, force?)` → `DeleteResult`

3. **`MaterialienListe`** — Main list component:
   - Loads data on mount, shows loading/error/empty states
   - Search field filters locally by `nummer`
   - Renders list of `MaterialItem` components
   - Footer button opens `MaterialDialog` in create mode

4. **`MaterialItem`** — Expandable list item:
   - Primary text: Materialnummer
   - Secondary text: "N Prüfargument(e)" (only if > 0)
   - Right action group: Edit icon, Delete icon, Expand arrow (only if ≥1 Prüfargument)
   - Expanded sub-area: `action.hover` background, shows description + PruefargumentItem list
   - Edit opens `MaterialDialog` in edit mode
   - Delete triggers delete flow (simple delete or force confirmation)

5. **`PruefargumentItem`** — Read-only Prüfargument display:
   - Outlined Chip with type label (min width 90px)
   - Type labels: KONTROLLHAKEN→"Kontrollhaken", TOLERANZ→"Toleranz", ZAHLWERT→"Zahlwert", TEXT→"Text"
   - Bezeichnung text (body2, fontWeight 500, flex-grow)
   - Value display (right-aligned):
     - KONTROLLHAKEN: green CheckIcon or red CloseIcon
     - TOLERANZ: "min … max"
     - ZAHLWERT: numeric text
     - TEXT: text string

6. **`MaterialDialog`** — Create/Edit dialog (max width md, fullWidth):
   - Title: "Neues Material anlegen" or "Material bearbeiten"
   - Fields: Materialnummer (required, auto-focus), Beschreibung (multiline 2 rows)
   - Divider
   - Prüfargumente section header: "Prüfargumente" (subtitle1, bold) + "Prüfargument hinzufügen" button (outlined, small, + icon)
   - Empty state: "Noch keine Prüfargumente hinzugefügt"
   - Each Prüfargument card (outlined Paper, padding 16px):
     - Card header: "Prüfargument N" (subtitle2, secondary) + delete icon button (error color)
     - First row: Bezeichnung (small, flex-grow, min-width 200px, required) + Typ select (small, min-width 180px)
     - Type-specific fields (margin-top 12px):
       - KONTROLLHAKEN: Checkbox "Kontrollhaken gesetzt"
       - TOLERANZ: Two number inputs "Min" and "Max"
       - ZAHLWERT: Full-width number input "Zahlwert"
       - TEXT: Full-width multiline input (2 rows) "Text"
   - Actions: "Abbrechen" (inherit), "Speichern" (contained, shows "Wird gespeichert..." while saving)
   - Error Alert at top if API error
   - Warning Alert if materialVeraendert (edit mode)

7. **Delete flow** (integrated into MaterialItem, NOT a separate dialog component yet — Phase 10 will extract):
   - Simple delete: calls `DELETE /api/materialien/{id}?force=false`
   - If 409 IN_USE: shows warning with count, offers force option
   - Force: user must type the Materialnummer to confirm, then calls `DELETE /api/materialien/{id}?force=true`

8. **RightSidebar** — Replace placeholder with `MaterialienListe`

### UI Spec References for Right Sidebar

- **Section 7.1** — Header: `secondary.main` bg, padding 16px, "Materialnummern" subtitle2 bold, search field (full width, small, white bg, rounded, search icon adornment, placeholder "Suchen...")
- **Section 7.2** — List: scrollable, loading spinner, error text "Fehler beim Laden der Materialien", empty text "Keine Materialien gefunden", ListItemButton with 1px border bottom, primary=Materialnummer, secondary="N Prüfargument(e)", right actions: edit icon, delete icon (error color), expand arrow (only if ≥1 Prüfargument). Expanded: `action.hover` bg, padding 8/8/8/16, optional description (body2, secondary), one row per Prüfargument with type chip + bezeichnung + value display
- **Section 7.3** — Footer: `secondary.main` bg, padding 12px, "Neue Materialnummer" button (full width, contained, + icon)
- **Section 9** — Material Dialog spec (detailed above)
- **Section 10** — Visual theme hints: secondary.main for header/footer bg, divider borders, icon buttons size="small", contained for primary actions, inherit for cancel

---

## Coding Conventions

### Backend (Java)
- All code comments in **German**
- Package: `com.auftrag`
- DTOs are plain Java classes (no records, for validation compatibility)
- Services are `@Transactional` where needed
- Controllers always return `ResponseEntity<T>`
- No Lombok — manual getters/setters

### Frontend (TypeScript/React)
- All visible text, labels, error messages in **German**
- All code comments in **German**
- Functional components with hooks
- MUI components per `ui_spec.md`
- API calls centralized in `src/api/`
- No global state management framework — React Context + `useState`
- Auto-save with 300ms debounce via `useEffect` + `setTimeout`
- MUI v9: use `sx` prop for `fontWeight`, `textAlign`, and other CSS properties not accepted as direct props

---

## Git History

```
feat: Phase 1 – Datenmodell & Backend-Grundstruktur
feat: Phase 2 – REST API Materialnummern CRUD + Sync-Logik
feat: Phase 3 – REST API Aufträge + Instanz-Generierung
feat: Phase 4 – REST API Instanz-Werte Auto-Save + Abgeschlossen-Flag
feat: configure /harald context path for frontend bundling
feat: Phase 5 – Frontend-Grundgerüst (Layout, MUI Theme, Sidebar-Resize)
```

---

## Remaining Phases (7–10) Summary

### Phase 7 — Linke Seitenleiste (Aufträge)
- New files: `api/auftraege.ts`, `types/auftrag.ts`, `components/auftraege/AuftraegeListe.tsx`, `AuftragItem.tsx`, `AuftragDialog.tsx`
- Auftrag list with search, 2-step create dialog (input step + confirmation step)
- Replace LeftSidebar placeholder

### Phase 8 — Mittelbereich (Doppelte Tab-Zeile + Übersichtskarten)
- New files: `context/TabContext.tsx`, `components/mitte/AuftragTabs.tsx`, `InstanzTabs.tsx`, `UebersichtKarten.tsx`, `InstanzKarte.tsx`
- Upper tab row: one tab per open Auftrag
- Lower tab row: first tab = Übersicht (cards), further tabs = individual instances
- Clicking Auftrag in left sidebar opens a tab
- Overview cards show instance number, material, status icon, read-only Prüfargumente, ⚠️ if materialVeraendert

### Phase 9 — Instanz-Tab (Prüfargumente ausfüllen, Auto-Save)
- New files: `api/instanzen.ts`, `types/instanz.ts`, `components/instanz/InstanzTab.tsx`, `PruefargumentFeld.tsx`
- Instance detail view with fillable Prüfargument form
- Auto-save with 300ms debounce
- "Kontrolle abgeschlossen" checkbox
- Read-only display for veraltet values

### Phase 10 — Lösch-Modal mit Force-Modus
- New files: `components/common/DeleteConfirmDialog.tsx`
- Extract delete confirmation from MaterialItem into reusable component
- Force mode: text input confirmation
- Used for both Materialnummer and Auftrag deletion
