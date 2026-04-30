# Phase 5 – Frontend-Grundgerüst

> **Status:** 🔲 Ausstehend
> **Abhängigkeiten:** Phase 1–4 abgeschlossen (Backend läuft)

---

## Ziel

Aufbau des vollständigen Layout-Grundgerüsts gemäß `ui_spec.md`: AppBar, Footer, linke/rechte Sidebar mit Resize-Griff, MUI Theme. Noch keine echten Daten – nur Struktur und Navigation.

---

## Neue Dateien / Struktur

```
frontend/src/
├── api/
│   └── client.ts               # fetch-Wrapper, Basis-URL, Fehlerbehandlung
├── theme/
│   └── theme.ts                # MUI Theme (secondary.main, Typografie)
├── components/
│   ├── layout/
│   │   ├── AppHeader.tsx        # MUI AppBar mit Fabrik-Icon + Titel
│   │   ├── AppFooter.tsx        # Footer mit Sidebar-Toggle-Buttons
│   │   ├── ResizeHandle.tsx     # Ziehgriff-Komponente
│   │   ├── LeftSidebar.tsx      # Wrapper linke Sidebar (Aufträge)
│   │   └── RightSidebar.tsx     # Wrapper rechte Sidebar (Materialien)
│   └── common/
│       └── LoadingSpinner.tsx   # Zentrierter Spinner
└── App.tsx                      # Haupt-Layout-Komposition
```

---

## Kernaufgaben

- MUI `ThemeProvider` mit `secondary.main` als getönter Akzentfarbe einrichten
- Layout: `100vh`, Flex-Column (Header + Hauptzeile + Footer)
- Hauptzeile: Flex-Row (LeftSidebar + ResizeHandle + Mitte + ResizeHandle + RightSidebar)
- Sidebar-Breite als `useState` (200–600 px, Standard 350 px)
- Sidebar ein-/ausklappen via Footer-Buttons
- `ResizeHandle`: `onMouseDown` → `mousemove`/`mouseup` auf `document`
- Vite Dev-Proxy: `/harald/api` → `http://localhost:8080` in `vite.config.ts` (bereits konfiguriert)
- Vite `base: '/harald/'` (bereits konfiguriert)
- `api/client.ts`: Basis-URL `/harald/api`, JSON-Header, Fehler als `Error` werfen

---

## Akzeptanzkriterien

- [ ] Layout füllt `100vh` ohne Scrollbalken auf Hauptebene
- [ ] Sidebars können per Footer-Button ein-/ausgeklappt werden
- [ ] Resize-Griff funktioniert (Drag ändert Sidebar-Breite)
- [ ] MUI Theme ist aktiv (secondary.main sichtbar in Header/Footer)
- [ ] API-Proxy leitet `/harald/api/*` korrekt an Backend weiter
