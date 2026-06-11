# Auftragsverwaltung

Programm zur Verwaltung von Fertigungsaufträgen, Materialnummern und Prüfargumenten.

## Voraussetzung

Auf dem Computer muss **Java 17** installiert sein.

Um das zu prüfen, ein Terminal (Eingabeaufforderung / Kommandozeile) öffnen und eingeben:

```
java -version
```

Es sollte eine Meldung erscheinen, die `17` enthält – zum Beispiel:

```
openjdk version "17.0.19"
```

Falls Java 17 noch nicht installiert ist, kann es hier kostenlos heruntergeladen werden:
https://adoptium.net/ – die Version **17 (LTS)** wählen, herunterladen und installieren.

## Programm starten

1. Die Datei **HaraldAuftrag-1.0.0.jar** in einen beliebigen Ordner kopieren.
2. Ein Terminal öffnen.
3. In den Ordner wechseln, in dem die JAR-Datei liegt.
4. Folgenden Befehl eingeben und mit Enter bestätigen:

```
java -jar HaraldAuftrag-1.0.0.jar
```

5. Kurz warten, bis im Terminal eine Zeile wie diese erscheint:

```
Started AuftragApplication in x.xxx seconds
```

6. Einen Webbrowser öffnen und diese Adresse aufrufen:

```
http://localhost:8080/harald/
```

Die Anwendung ist jetzt bereit.

## Programm beenden

Im Terminal die Tastenkombination **Strg + C** drücken. Das Programm wird heruntergefahren.

## Hinweise

- Beim ersten Start wird automatisch ein Ordner **data** angelegt, der die Datenbankdatei **auftrag.db** enthält. Alle eingegebenen Daten werden dort gespeichert.
- Die JAR-Datei kann in einen anderen Ordner verschoben werden – die Datenbank wird immer dort angelegt, von wo aus das Programm gestartet wird.
- Es darf nur eine Instanz des Programms gleichzeitig laufen (Port 8080 ist belegt, wenn bereits eine Instanz läuft).
