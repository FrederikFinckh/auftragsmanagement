# UI-Layout-Spezifikation — Auftragsverwaltung

> **Geltungsbereich:** Rein visuelle / strukturelle Beschreibung. Keine Logik, kein Datenabruf, kein Zustandsmanagement.
> Alle Texte sind wörtlich so angegeben, wie sie auf dem Bildschirm erscheinen.
>
> **Sprache:** Die gesamte Benutzeroberfläche ist vollständig auf Deutsch bedienbar.
> Alle sichtbaren Labels, Platzhaltertexte, Fehlermeldungen und Schaltflächenbeschriftungen sind auf Deutsch.
> Alle Kommentare im Quellcode sind ebenfalls auf Deutsch zu verfassen.

---

## 1. Gesamtrahmen

Die Anwendung füllt den gesamten Viewport (`100vh`) und ist in drei horizontale Bereiche unterteilt, die vertikal gestapelt sind:

```
┌─────────────────────────────────────────────────────────┐
│  KOPFLEISTE                                             │
├──────────────┬──────────────────────────┬───────────────┤
│              │                          │               │
│  LINKE       │   MITTE (Tab-Bereich)    │  RECHTE       │
│  SEITENLEISTE│                          │  SEITENLEISTE │
│              │                          │               │
├──────────────┴──────────────────────────┴───────────────┤
│  FUSSLEISTE                                             │
└─────────────────────────────────────────────────────────┘
```

- **Kopfleiste** — feste Höhe, volle Breite.
- **Hauptzeile** — füllt den gesamten verbleibenden vertikalen Platz; enthält linke Seitenleiste, Mitte und rechte Seitenleiste nebeneinander.
- **Fußleiste** — feste Höhe, volle Breite.
- Linke und rechte Seitenleiste haben jeweils einen **Ziehgriff** an ihrer inneren Kante, der horizontales Vergrößern/Verkleinern ermöglicht.
- Jede Seitenleiste kann **eingeklappt** (vollständig ausgeblendet) werden; beim Einklappen wird auch der Ziehgriff ausgeblendet.

---

## 2. Kopfleiste

Volle Breite, horizontale Leiste (MUI `AppBar`).

| Element | Position | Erscheinungsbild |
|---|---|---|
| Fabrik-Icon | Links, vertikal zentriert | Kleines Icon, rechter Abstand vor dem Titel |
| Titeltext `„Auftragsverwaltung"` | Links, nach dem Icon | `h6`-Gewicht, kein Umbruch, wächst auf den verbleibenden Platz |

---

## 3. Fußleiste

Volle Breite, schmale horizontale Leiste (kleiner vertikaler Innenabstand).
Hintergrund: Papierfarbe. Oberer Rand: 1 px Trennlinie.

Drei Bereiche, mit `space-between` angeordnet:

| Bereich | Inhalt |
|---|---|
| **Linker Bereich** | Kleiner Icon-Button (Pfeil) + Beschriftungstext `„Aufträge"` |
| **Mittlerer Bereich** | Beschriftungstext `„Auftragsverwaltung"` (sekundäre Farbe) |
| **Rechter Bereich** | Beschriftungstext `„Materialien"` + kleiner Icon-Button (Pfeil) |

- Linker Pfeil zeigt **nach links**, wenn die linke Seitenleiste geöffnet ist; **nach rechts**, wenn sie geschlossen ist.
- Rechter Pfeil zeigt **nach rechts**, wenn die rechte Seitenleiste geöffnet ist; **nach links**, wenn sie geschlossen ist.

---

## 4. Linke Seitenleiste — Aufträge

Vertikale Flex-Spalte, feste Breite (Standard 350 px, per Ziehgriff 200–600 px).
Rechter Rand: 1 px Trennlinie.

### 4.1 Kopfbereich

Hintergrund: `secondary.main`.
Innenabstand: 16 px rundum.

| Element | Erscheinungsbild |
|---|---|
| Beschriftung `„Auftragsnummern"` | `subtitle2`, fett, unterer Abstand 8 px |
| Suchfeld | Volle Breite, kleine Größe, weißer Hintergrund, abgerundete Ecken; führendes Adornment: Suchicon; Platzhalter `„Suchen..."` |

### 4.2 Listenbereich

Scrollbar, füllt die verbleibende Höhe.

**Ladezustand:** zentrierter Spinner (24 px).

**Fehlerzustand:** fehlerfarben hervorgehobener Text `„Fehler beim Laden der Aufträge"`, mit Innenabstand.

**Leerzustand:** zentrierter, sekundärfarbener `body2`-Text `„Keine Aufträge gefunden"`.

**Normalzustand:** kompakte MUI-`List`.
Jede Zeile ist ein `ListItemButton` mit:
- Unterem Rand: 1 px Trennlinie.
- Primärtext: Auftragsbezeichnung (fett).
- Sekundärtext: Kundenname (nur angezeigt, wenn vorhanden).
- Hover: `action.hover`-Hintergrund.

### 4.3 Fußbereich

Hintergrund: `secondary.main`.
Innenabstand: 12 px.

| Element | Erscheinungsbild |
|---|---|
| Schaltfläche `„Neuer Auftrag"` | Volle Breite, `contained`-Variante, führendes `+`-Icon |

---

## 5. Ziehgriff

Ein schmaler vertikaler Streifen (8 px breit), der zwischen einer Seitenleiste und dem Mittelbereich platziert ist.
Cursor wechselt bei Hover zu `col-resize`.
Im Ruhezustand keine sichtbare Farbe; dezente Hervorhebung bei Hover.

---

## 6. Mittelbereich — Tab-Arbeitsbereich

Füllt den gesamten verbleibenden horizontalen Platz. Vertikale Flex-Spalte.

### 6.1 Leerzustand

Wenn keine Tabs geöffnet sind, zeigt der gesamte Mittelbereich eine einzige zentrierte `h6`-Meldung:

> `„Doppelklick auf einen Auftrag, um ihn hier zu öffnen"`

Textfarbe: sekundär.

### 6.2 Tab-Leiste (wenn Tabs vorhanden)

Horizontal scrollbare MUI-`Tabs`-Leiste.
Unterer Rand: 1 px Trennlinie. Mindesthöhe: 42 px.

Jeder Tab-Chip enthält:
- Text: Instanzbezeichnung, `body2`, max. Breite 200 px, kein Umbruch, mit Ellipse abgeschnitten.
- Schließen-Button: kleiner Icon-Button mit `×`-Icon, Fehlerfarbe; bei Hover: fehlerfarben-heller Hintergrund, weißes Icon.

### 6.3 Tab-Inhaltsbereich

Scrollbarer Bereich unterhalb der Tab-Leiste, Innenabstand 24 px.

Enthält eine einzelne umrandete `Paper`-Karte, max. Breite 600 px:

**Karten-Kopfstreifen**
Hintergrund: `secondary.main`. Innenabstand: 8 px 16 px.
Inhalt: Instanzbezeichnung, `subtitle1`, fett.

**Karten-Körper — Datentabelle**
Kleine MUI-`Table`, kein äußerer Rahmen.

| Zeile | Linke Zelle (Bezeichnung) | Rechte Zelle (Wert) |
|---|---|---|
| 1 | `„Datum:"` | Datumszeichenkette |
| 2 | `„Auftragsnummer:"` | Auftragsnummer-Zeichenkette |
| 3 | `„Kunde:"` | Kundenname oder `„—"` |
| 4 | `„Materialnummer:"` | Materialnummer oder `„—"` |

Linke Zellen: fett, `secondary.main`-Hintergrund, Breite 40 %.
Rechte Zellen: normales Gewicht, weißer Hintergrund.

---

## 7. Rechte Seitenleiste — Materialien

Spiegelstruktur der linken Seitenleiste.
Feste Breite (Standard 350 px, per Ziehgriff 200–600 px).
Linker Rand: 1 px Trennlinie.

### 7.1 Kopfbereich

Hintergrund: `secondary.main`. Innenabstand: 16 px.

| Element | Erscheinungsbild |
|---|---|
| Beschriftung `„Materialnummern"` | `subtitle2`, fett, unterer Abstand 8 px |
| Suchfeld | Gleiches Erscheinungsbild wie das Suchfeld der linken Seitenleiste |

### 7.2 Listenbereich

Scrollbar, füllt die verbleibende Höhe.

**Lade- / Fehler- / Leerzustände:** gleiches Muster wie linke Seitenleiste (mit Texten `„Fehler beim Laden der Materialien"` / `„Keine Materialien gefunden"`).

**Normalzustand:** kompakte `List`.

Jede Materialzeile ist ein `ListItemButton`:
- Unterer Rand: 1 px Trennlinie.
- Primärtext: Materialnummer.
- Sekundärtext: `„N Prüfargument(e)"` Anzahl (nur angezeigt, wenn > 0).
- Rechte Aktionsgruppe:
  - Bearbeiten-Icon-Button (Stift).
  - Löschen-Icon-Button (Papierkorb, Fehlerfarbe).
  - Aufklapp-Pfeil-Icon (auf/ab) — nur angezeigt, wenn das Material ≥ 1 Prüfargument hat.

**Aufgeklappter Unterbereich** (einklappbar, gleitet unterhalb der Zeile auf):
Hintergrund: `action.hover`. Innenabstand: 8 px 8 px 8 px 16 px.

- Optionaler Beschreibungstext (`body2`, sekundäre Farbe, unterer Abstand 8 px).
- Eine Zeile pro Prüfargument:
  - Unterer Rand: 1 px Trennlinie.
  - Umrandeter Chip mit Typbezeichnung (Mindestbreite 90 px). Typbezeichnungen:
    - `KONTROLLHAKEN` → `„Kontrollhaken"`
    - `TOLERANZ` → `„Toleranz"`
    - `ZAHLWERT` → `„Zahlwert"`
    - `TEXT` → `„Text"`
  - Bezeichnungstext (`body2`, mittleres Gewicht, flex-grow).
  - Wertanzeige (rechtsbündig):
    - `KONTROLLHAKEN`: grünes Häkchen-Icon oder rotes ×-Icon.
    - `TOLERANZ`: Text `„min … max"`.
    - `ZAHLWERT`: numerischer Text.
    - `TEXT`: Textzeichenkette.
- Wenn keine Prüfargumente vorhanden: sekundärfarbener Text `„Keine Prüfargumente"`.

### 7.3 Fußbereich

Hintergrund: `secondary.main`. Innenabstand: 12 px.

| Element | Erscheinungsbild |
|---|---|
| Schaltfläche `„Neue Materialnummer"` | Volle Breite, `contained`-Variante, führendes `+`-Icon |

---

## 8. Dialog — Neuen Auftrag anlegen

Modaler Dialog, max. Breite `sm`, volle Breite.

### 8.1 Eingabeschritt

**Titel:** `„Neuen Auftrag anlegen"`

**Körper:** vertikaler Stapel von Formularfeldern, Abstand 16 px, oberer Abstand 8 px.

| Feld | Typ | Bezeichnung | Hinweise |
|---|---|---|---|
| Datum | Texteingabe | `„Datum"` | Platzhalter `„TT.MM.JJJJ"`, Pflichtfeld |
| Auftragsnummer | Texteingabe | `„Auftragsnummer"` | Pflichtfeld |
| Stückzahl | Zahleneingabe | `„Stückzahl"` | Pflichtfeld, Mindestwert 1 |
| Kunde | Texteingabe | `„Kunde"` | Optional |
| Materialnummer | Autocomplete | `„Materialnummer"` | Platzhalter `„Material auswählen..."`, Kein-Ergebnis-Text `„Keine Materialien gefunden"` |

Felder mit Validierungsfehlern zeigen roten Rahmen + Hilfstext darunter.
Ein Fehler-`Alert` (Schweregrad `error`) erscheint oben im Körper, wenn ein API-Fehler vorliegt.

**Aktionen (rechtsbündig):**
- `„Abbrechen"` — geerbte Farbe.
- `„Weiter"` — `contained`.

### 8.2 Bestätigungsschritt

**Titel:** `„Eingaben überprüfen"`

**Körper:** umrandetes `Paper` mit einer kleinen Tabelle, die die eingegebenen Werte zusammenfasst.

| Zeile | Bezeichnung | Wert |
|---|---|---|
| 1 | `„Datum:"` | eingegebenes Datum |
| 2 | `„Auftragsnummer:"` | eingegebene Nummer |
| 3 | `„Stückzahl:"` | eingegebene Anzahl |
| 4 | `„Kunde:"` | eingegebener Kunde oder `„—"` |
| 5 | `„Materialnummer:"` | eingegebenes Material oder `„—"` |

Bezeichnungszellen: fett, Breite 40 %.
Ein Fehler-`Alert` erscheint unterhalb der Tabelle, wenn ein API-Fehler vorliegt.

**Aktionen (rechtsbündig):**
- `„Zurück"` — Text.
- `„OK"` — `contained`; Beschriftung wechselt zu `„Wird gespeichert..."` während des Speichervorgangs.
- `„Abbrechen"` — geerbte Farbe.

---

## 9. Dialog — Neues Material anlegen / Material bearbeiten

Modaler Dialog, max. Breite `md`, volle Breite.

**Titel:** `„Neues Material anlegen"` oder `„Material bearbeiten"` (im Bearbeitungsmodus).

**Körper:** vertikaler Stapel, Abstand 16 px, oberer Abstand 8 px.

Fehler-`Alert` (Schweregrad `error`) und Warn-`Alert` (Schweregrad `warning`) erscheinen oben, wenn vorhanden.

| Feld | Typ | Bezeichnung | Hinweise |
|---|---|---|---|
| Materialnummer | Texteingabe | `„Materialnummer"` | Pflichtfeld, automatisch fokussiert |
| Beschreibung | Mehrzeiliger Text (2 Zeilen) | `„Beschreibung"` | Optional |

**Trennlinie** (horizontale Linie, vertikaler Abstand 8 px).

**Kopfzeile des Prüfargumente-Abschnitts:**
- Links: Beschriftung `„Prüfargumente"`, `subtitle1`, fett.
- Rechts: Schaltfläche `„Prüfargument hinzufügen"`, klein, `outlined`, führendes `+`-Icon.

**Leerzustand:** zentrierter, sekundärfarbener `body2`-Text `„Noch keine Prüfargumente hinzugefügt"`.

**Jede Prüfargument-Karte** — umrandetes `Paper`, Innenabstand 16 px:

*Karten-Kopfzeile:*
- Links: Beschriftung `„Prüfargument N"`, `subtitle2`, sekundäre Farbe.
- Rechts: Löschen-Icon-Button (Papierkorb, Fehlerfarbe), Titel `„Prüfargument entfernen"`.

*Erste Feldreihe* (umschließendes Flex, Abstand 16 px):
- Texteingabe `„Bezeichnung"`, klein, flex-grow, Mindestbreite 200 px, Pflichtfeld.
- Auswahlfeld `„Typ"`, klein, Mindestbreite 180 px. Optionen: `„Kontrollhaken"`, `„Toleranz"`, `„Zahlwert"`, `„Text"`.

*Typspezifische Felder* (oberer Abstand 12 px):

| Typ | Angezeigte Felder |
|---|---|
| `KONTROLLHAKEN` | Kontrollkästchen mit Beschriftung `„Kontrollhaken gesetzt"` |
| `TOLERANZ` | Zwei nebeneinander liegende Zahleneingaben: `„Min"` und `„Max"` |
| `ZAHLWERT` | Einzelne, volle Breite, Zahleneingabe `„Zahlwert"` |
| `TEXT` | Volle Breite, mehrzeiliger Text (2 Zeilen) `„Text"` |

**Aktionen (rechtsbündig):**
- `„Abbrechen"` — geerbte Farbe.
- `„Speichern"` — `contained`; Beschriftung wechselt zu `„Wird gespeichert..."` während des Speichervorgangs.

---

## 10. Visuelle Themenhinweise

- **Farbrolle `secondary.main`** wird als getönter Hintergrund für Seitenleisten-Kopfbereiche, Seitenleisten-Fußbereiche und Tabellen-Bezeichnungszellen verwendet — und erzeugt so ein einheitliches „Kopfstreifen"-Erscheinungsbild in der gesamten Anwendung.
- **Trennlinien** (`borderColor: 'divider'`) trennen Listenzeilen, Seitenleistenkanten und die Fußleiste vom Hauptbereich.
- **Verwendete Typografie-Skala:** `h6` (App-Titel), `subtitle1` (Karten-/Abschnittsüberschriften), `subtitle2` (Seitenleisten-Überschriften), `body2` (sekundärer Listentext, Prüfargument-Details), `caption` (Fußleisten-Beschriftungen).
- Alle Icon-Buttons haben `size="small"`.
- Alle primären Aktionsschaltflächen haben `variant="contained"`.
- Sekundäre / Abbrechen-Aktionen haben `color="inherit"` oder sind einfache Text-Schaltflächen.
- **Alle Quellcode-Kommentare sind auf Deutsch zu verfassen.**
