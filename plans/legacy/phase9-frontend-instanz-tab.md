# Phase 9 – Frontend: Instanz-Tab (Prüfargumente ausfüllen, Auto-Save)

> **Status:** ✅ Abgeschlossen
> **Abhängigkeiten:** Phase 5–8 abgeschlossen

---

## Ziel

Instanz-Tab mit vollständigem Prüfformular: Instanz-Infos oben, darunter alle Prüfargumente als ausfüllbares Formular mit Auto-Save bei jeder Änderung, am Ende Checkbox „Kontrolle abgeschlossen".

---

## Neue Dateien

```
frontend/src/
├── api/
│   └── instanzen.ts                  # API-Funktionen für Instanzen
├── components/
│   └── instanz/
│       ├── InstanzTab.tsx            # Haupt-Wrapper des Instanz-Tabs
│       ├── InstanzInfoTabelle.tsx    # Datentabelle (Datum, Auftrag, Kunde, Material)
│       ├── PruefargumentFormular.tsx # Liste aller Prüfargument-Felder
│       ├── KontrollhakenFeld.tsx     # Checkbox-Feld
│       ├── ToleranzFeld.tsx          # Min/Max Zahleneingaben
│       ├── ZahlwertFeld.tsx          # Einzelne Zahleneingabe
│       └── TextFeld.tsx              # Mehrzeiliges Textfeld
```

---

## Kernaufgaben

- `InstanzTab` lädt Instanz-Detail via `GET /harald/api/instanzen/{id}`
- `InstanzInfoTabelle`: Datentabelle mit Datum, Auftragsnummer, Kunde, Materialnummer (gemäß `ui_spec.md` Abschnitt 6.3)
- `PruefargumentFormular`: rendert je nach `typ` das passende Eingabefeld
- **Auto-Save**: bei `onChange` (mit 300 ms Debounce) → `PATCH /harald/api/instanzen/{id}/werte/{wertId}`
- Veraltete Werte (`veraltet=true`): read-only anzeigen, visuell als „veraltet" markiert (z.B. durchgestrichen oder grau mit Hinweistext)
- Warn-Banner oben wenn `materialVeraendert=true`: `„⚠️ Die Materialnummer wurde seit Auftragserstellung geändert"`
- Checkbox „Kontrolle abgeschlossen" am Ende → `PATCH /harald/api/instanzen/{id}/abgeschlossen`
- Nach Setzen von „abgeschlossen": Status-Icon in Übersichtskarte (Phase 8) aktualisieren

---

## Akzeptanzkriterien

- [ ] Instanz-Tab lädt und zeigt alle Prüfargumente korrekt
- [ ] Jeder Feldtyp rendert das passende Eingabe-Widget
- [ ] Auto-Save feuert nach Änderung (Debounce 300 ms)
- [ ] Veraltete Felder sind read-only und visuell markiert
- [ ] Warn-Banner erscheint bei `materialVeraendert=true`
- [ ] Checkbox „Kontrolle abgeschlossen" speichert korrekt
- [ ] Status-Icon in Übersichtskarte aktualisiert sich nach Abschluss
