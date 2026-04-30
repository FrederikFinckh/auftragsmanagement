# Phase 10 – Frontend: Lösch-Modal mit Force-Modus

> **Status:** 🔲 Ausstehend
> **Abhängigkeiten:** Phase 5–9 abgeschlossen

---

## Ziel

Wiederverwendbares Lösch-Modal für Materialnummern: zeigt Anzahl betroffener Aufträge, bietet Force-Modus mit Bestätigungseingabe der Materialnummer.

---

## Neue Dateien

```
frontend/src/
└── components/
    └── materialien/
        └── MaterialLoeschenDialog.tsx   # Lösch-Modal (einfach + force)
```

---

## Ablauf des Dialogs

```
Schritt 1 – Prüfung:
  Backend antwortet mit 409 → Dialog zeigt:
  „Materialnummer M-1234 wird in 3 Auftrag/Aufträgen verwendet."
  [Abbrechen]  [Trotzdem löschen (Force)]

Schritt 2 – Force-Bestätigung (nach Klick auf „Trotzdem löschen"):
  Eingabefeld: „Bitte Materialnummer zur Bestätigung eingeben:"
  Textfeld (Placeholder: Materialnummer)
  [Abbrechen]  [Endgültig löschen] (nur aktiv wenn Eingabe == Materialnummer)

Nach Bestätigung:
  API-Call DELETE /api/materialien/{id}?force=true
  Erfolgsmeldung: „Materialnummer und N Aufträge wurden gelöscht"
  Dialog schließt, Liste wird neu geladen
```

---

## Kernaufgaben

- Dialog erhält Props: `materialnummer`, `onClose`, `onDeleted`
- Erster API-Call `DELETE` ohne force → bei `409` in Force-Modus wechseln
- Bei `200` (kein Konflikt): direkt erfolgreich schließen
- Force-Schritt: Eingabe wird gegen `materialnummer.nummer` validiert (Schaltfläche deaktiviert bis Übereinstimmung)
- Ladezustand während API-Call (Button-Beschriftung „Wird gelöscht...")
- Fehler-Alert bei unerwartetem API-Fehler

---

## Akzeptanzkriterien

- [ ] Einfaches Löschen (kein Konflikt) funktioniert direkt
- [ ] Bei Konflikt erscheint Warnung mit korrekter Auftragsanzahl
- [ ] Force-Schritt zeigt Bestätigungseingabe
- [ ] „Endgültig löschen"-Button ist deaktiviert bis Eingabe korrekt
- [ ] Nach Force-Löschung: Liste wird aktualisiert, betroffene Auftrag-Tabs werden geschlossen
- [ ] Ladezustand während API-Call korrekt angezeigt
