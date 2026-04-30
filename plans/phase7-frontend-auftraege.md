# Phase 7 – Frontend: Linke Seitenleiste (Aufträge)

> **Status:** 🔲 Ausstehend
> **Abhängigkeiten:** Phase 5–6 abgeschlossen

---

## Ziel

Vollständige linke Seitenleiste für Aufträge: Liste, Suche, Auftrag anlegen (2-Schritt-Dialog), Auftrag anklicken öffnet Auftrag-Tab im Mittelbereich.

---

## Neue Dateien

```
frontend/src/
├── api/
│   └── auftraege.ts             # API-Funktionen für Aufträge
├── components/
│   └── auftraege/
│       ├── AuftraegeListe.tsx   # Listenbereich der linken Sidebar
│       ├── AuftragItem.tsx      # Einzelne Auftragszeile (mit Warn-Icon)
│       └── AuftragDialog.tsx    # 2-Schritt-Dialog: Eingabe + Bestätigung
└── types/
    └── auftrag.ts               # TypeScript-Typen für Aufträge
```

---

## Kernaufgaben

- `AuftraegeListe`: Lade-/Fehler-/Leerzustand, Suchfeld filtert lokal nach `auftragsnummer` und `kunde`
- `AuftragItem`: Zeigt Auftragsnummer (fett) + Kundenname + ⚠️-Icon wenn `materialVeraendert=true`
- Klick auf Auftrag → öffnet Auftrag-Tab im Mittelbereich (via Callback/Context)
- `AuftragDialog`: Schritt 1 (Formular mit Validierung) → Schritt 2 (Bestätigung) → API-Call
- Autocomplete für Materialnummer-Auswahl (lädt aus `/api/materialien`)
- Nach erfolgreichem Anlegen: Liste neu laden, neuen Auftrag-Tab öffnen

---

## Akzeptanzkriterien

- [ ] Auftragsliste lädt und zeigt alle Aufträge
- [ ] Suche filtert nach Auftragsnummer und Kunde
- [ ] Warn-Icon erscheint bei `materialVeraendert=true`
- [ ] 2-Schritt-Dialog funktioniert mit Validierung
- [ ] Materialnummer-Autocomplete zeigt verfügbare Materialien
- [ ] Klick auf Auftrag öffnet Tab im Mittelbereich
