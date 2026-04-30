# Phase 6 – Frontend: Rechte Seitenleiste (Materialien)

> **Status:** 🔲 Ausstehend
> **Abhängigkeiten:** Phase 5 abgeschlossen

---

## Ziel

Vollständige rechte Seitenleiste für Materialnummern: Liste, Suche, aufklappbare Prüfargumente, Anlegen/Bearbeiten-Dialog, Lösch-Dialog (einfach + force).

---

## Neue Dateien

```
frontend/src/
├── api/
│   └── materialien.ts           # API-Funktionen für Materialien
├── components/
│   └── materialien/
│       ├── MaterialienListe.tsx  # Listenbereich der rechten Sidebar
│       ├── MaterialItem.tsx      # Einzelne Materialzeile mit Expand
│       ├── PruefargumentItem.tsx # Einzelne Prüfargument-Zeile (read-only)
│       └── MaterialDialog.tsx   # Anlegen/Bearbeiten-Dialog
└── types/
    └── material.ts              # TypeScript-Typen für Materialien
```

---

## Kernaufgaben

- `MaterialienListe`: Lade-/Fehler-/Leerzustand, Suchfeld filtert lokal nach `nummer`
- `MaterialItem`: Expand/Collapse für Prüfargumente, Bearbeiten/Löschen-Buttons
- Prüfargument-Typen korrekt anzeigen (Chip + Wertanzeige je nach Typ)
- `MaterialDialog`: Formular mit dynamischer Prüfargument-Liste (hinzufügen/entfernen/sortieren), typspezifische Felder
- Lösch-Dialog: zeigt Anzahl betroffener Aufträge, Force-Modus mit Bestätigungseingabe der Materialnummer
- State-Management: lokaler `useState` + API-Calls, nach Mutation Liste neu laden

---

## Akzeptanzkriterien

- [ ] Materialliste lädt und zeigt alle Materialien mit Prüfargument-Anzahl
- [ ] Suche filtert die Liste korrekt
- [ ] Expand zeigt Prüfargumente mit korrekten Typ-Chips und Wertanzeigen
- [ ] Neues Material anlegen funktioniert (Dialog + API)
- [ ] Material bearbeiten füllt Dialog vor und speichert Änderungen
- [ ] Löschen zeigt Warnung wenn in Aufträgen verwendet
- [ ] Force-Lösch mit Bestätigungseingabe funktioniert
