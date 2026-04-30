# Phase 8 – Frontend: Mittelbereich (Doppelte Tab-Zeile + Übersichtskarten)

> **Status:** 🔲 Ausstehend
> **Abhängigkeiten:** Phase 5–7 abgeschlossen

---

## Ziel

Mittelbereich mit zwei Tab-Zeilen: obere Zeile für Aufträge, untere Zeile für Instanzen des aktiven Auftrags. Übersichts-Tab zeigt Karten aller Instanzen mit Status und read-only Prüfargumenten.

---

## Neue Dateien

```
frontend/src/
├── components/
│   └── mitte/
│       ├── MitteBereich.tsx         # Haupt-Wrapper mit zwei Tab-Zeilen
│       ├── AuftragTabLeiste.tsx     # Obere Tab-Zeile (Aufträge)
│       ├── InstanzTabLeiste.tsx     # Untere Tab-Zeile (Instanzen + Übersicht)
│       ├── AuftragUebersicht.tsx    # Übersichts-Tab: Karten-Grid
│       └── InstanzKarte.tsx         # Einzelne Übersichtskarte einer Instanz
└── context/
    └── TabContext.tsx               # Globaler State: offene Tabs, aktiver Tab
```

---

## Navigationsmodell (State)

```
TabContext:
  auftragTabs: AuftragTab[]          // offene Auftrag-Tabs (obere Zeile)
  aktiverAuftragTabId: Long | null
  instanzTabs: Map<Long, InstanzTab[]>  // pro Auftrag: offene Instanz-Tabs
  aktiverInstanzTabId: Map<Long, Long | null>
```

- Auftrag aus linker Sidebar anklicken → `auftragTabs` hinzufügen (falls nicht vorhanden), aktivieren
- Instanzkarte anklicken → `instanzTabs[auftragId]` hinzufügen, aktivieren
- Tab schließen (×) → aus Liste entfernen, vorherigen Tab aktivieren

---

## Kernaufgaben

- Leerzustand (keine Tabs): zentrierte Meldung `„Auftrag auswählen, um ihn hier zu öffnen"`
- Obere Tab-Zeile: horizontal scrollbar, jeder Tab mit Schließen-Button
- Untere Tab-Zeile: erster Tab immer „Übersicht" (nicht schließbar), dann Instanz-Tabs
- `AuftragUebersicht`: lädt Instanzen via `GET /harald/api/auftraege/{id}/instanzen`, zeigt Karten-Grid
- `InstanzKarte`: Instanz-Nr, Materialnummer, Status-Icon (grün ✓ / grau ○), read-only Prüfargumente darunter, Warn-Icon wenn `materialVeraendert=true`
- Klick auf Karte → öffnet Instanz-Tab in unterer Zeile

---

## Akzeptanzkriterien

- [ ] Leerzustand zeigt korrekte Meldung
- [ ] Auftrag-Tab öffnet sich beim Klick in der linken Sidebar
- [ ] Mehrere Auftrag-Tabs können gleichzeitig offen sein
- [ ] Untere Tab-Zeile zeigt Übersicht-Tab + Instanz-Tabs des aktiven Auftrags
- [ ] Übersichtskarten zeigen korrekte Status-Icons
- [ ] Warn-Icon erscheint bei `materialVeraendert=true`
- [ ] Klick auf Karte öffnet Instanz-Tab
- [ ] Tabs können geschlossen werden (×-Button)
