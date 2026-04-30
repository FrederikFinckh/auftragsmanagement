# Phase 1 – Datenmodell & Backend-Grundstruktur

> **Status:** ✅ Abgeschlossen
> **Abhängigkeiten:** keine

---

## Ziel

Aufbau der vollständigen JPA-Entitätsschicht, SQLite-Konfiguration und Spring Boot Grundstruktur. Am Ende dieser Phase ist die Datenbank lauffähig und alle Tabellen werden automatisch erstellt.

---

## Verzeichnisstruktur (neu zu erstellen)

```
src/
└── main/
    ├── java/com/auftrag/
    │   ├── AuftragApplication.java
    │   ├── model/
    │   │   ├── Materialnummer.java
    │   │   ├── Pruefargument.java
    │   │   ├── PruefargumentTyp.java        (Enum)
    │   │   ├── Auftrag.java
    │   │   ├── Instanz.java
    │   │   └── InstanzWert.java
    │   └── repository/
    │       ├── MaterialnummerRepository.java
    │       ├── PruefargumentRepository.java
    │       ├── AuftragRepository.java
    │       ├── InstanzRepository.java
    │       └── InstanzWertRepository.java
    └── resources/
        └── application.properties
data/
    (leer – SQLite-Datei wird hier zur Laufzeit erstellt)
```

---

## Entitäten im Detail

### `PruefargumentTyp` (Enum)

```java
public enum PruefargumentTyp {
    KONTROLLHAKEN,
    TOLERANZ,
    ZAHLWERT,
    TEXT
}
```

---

### `Materialnummer`

| Feld | Typ | Constraints | Beschreibung |
|---|---|---|---|
| `id` | `Long` | PK, auto-generated | Primärschlüssel |
| `nummer` | `String` | NOT NULL, UNIQUE | Die Materialnummer (z.B. "M-1234") |
| `beschreibung` | `String` | nullable | Optionale Beschreibung |
| `pruefargumente` | `List<Pruefargument>` | OneToMany, cascade ALL, orphanRemoval | Geordnete Liste der Prüfargumente |

**JPA-Annotationen:**
- `@Entity`, `@Table(name = "materialnummer")`
- `@OneToMany(mappedBy = "materialnummer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)`
- `@OrderBy("reihenfolge ASC")`

---

### `Pruefargument`

| Feld | Typ | Constraints | Beschreibung |
|---|---|---|---|
| `id` | `Long` | PK, auto-generated | Primärschlüssel |
| `materialnummer` | `Materialnummer` | ManyToOne, NOT NULL | Zugehörige Materialnummer |
| `bezeichnung` | `String` | NOT NULL | Label des Prüfarguments |
| `typ` | `PruefargumentTyp` | NOT NULL | Enum-Typ |
| `kontrollhakenWert` | `Boolean` | nullable | Standardwert für KONTROLLHAKEN |
| `toleranzMin` | `Double` | nullable | Minimalwert für TOLERANZ |
| `toleranzMax` | `Double` | nullable | Maximalwert für TOLERANZ |
| `zahlwert` | `Double` | nullable | Standardwert für ZAHLWERT |
| `textWert` | `String` | nullable | Standardwert für TEXT |
| `reihenfolge` | `int` | NOT NULL, default 0 | Sortierreihenfolge |

**JPA-Annotationen:**
- `@Entity`, `@Table(name = "pruefargument")`
- `@ManyToOne(fetch = FetchType.LAZY)`, `@JoinColumn(name = "materialnummer_id", nullable = false)`
- `@Enumerated(EnumType.STRING)` für `typ`

---

### `Auftrag`

| Feld | Typ | Constraints | Beschreibung |
|---|---|---|---|
| `id` | `Long` | PK, auto-generated | Primärschlüssel |
| `auftragsnummer` | `String` | NOT NULL, UNIQUE | Eindeutige Auftragsnummer |
| `datum` | `String` | NOT NULL | Datum als String (TT.MM.JJJJ) |
| `kunde` | `String` | nullable | Optionaler Kundenname |
| `materialnummer` | `Materialnummer` | ManyToOne, nullable | Referenz auf Materialnummer-Template |
| `stueckzahl` | `int` | NOT NULL, min 1 | Anzahl der zu generierenden Instanzen |
| `materialVeraendert` | `boolean` | NOT NULL, default false | Warn-Flag: Materialnummer wurde nach Auftragserstellung geändert |
| `instanzen` | `List<Instanz>` | OneToMany, cascade ALL | Generierte Instanzen |

**JPA-Annotationen:**
- `@Entity`, `@Table(name = "auftrag")`
- `@ManyToOne(fetch = FetchType.LAZY)`, `@JoinColumn(name = "materialnummer_id")`
- `@OneToMany(mappedBy = "auftrag", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)`
- `@OrderBy("nummer ASC")`

---

### `Instanz`

| Feld | Typ | Constraints | Beschreibung |
|---|---|---|---|
| `id` | `Long` | PK, auto-generated | Primärschlüssel |
| `auftrag` | `Auftrag` | ManyToOne, NOT NULL | Zugehöriger Auftrag |
| `nummer` | `int` | NOT NULL | Laufende Nummer (1..N) |
| `kontrolleAbgeschlossen` | `boolean` | NOT NULL, default false | Ob die Kontrolle abgeschlossen ist |
| `materialVeraendert` | `boolean` | NOT NULL, default false | Warn-Flag: Prüfargumente wurden nach Instanzerstellung geändert |
| `werte` | `List<InstanzWert>` | OneToMany, cascade ALL | Ausgefüllte Prüfargument-Werte |

**JPA-Annotationen:**
- `@Entity`, `@Table(name = "instanz")`
- `@ManyToOne(fetch = FetchType.LAZY)`, `@JoinColumn(name = "auftrag_id", nullable = false)`
- `@OneToMany(mappedBy = "instanz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)`

---

### `InstanzWert`

> **Designentscheidung:** `InstanzWert` speichert eine Kopie von `bezeichnung` und `typ` aus dem `Pruefargument`. Dadurch bleibt der Wert lesbar, auch wenn das `Pruefargument` später gelöscht wird (`veraltet = true`).

| Feld | Typ | Constraints | Beschreibung |
|---|---|---|---|
| `id` | `Long` | PK, auto-generated | Primärschlüssel |
| `instanz` | `Instanz` | ManyToOne, NOT NULL | Zugehörige Instanz |
| `pruefargument` | `Pruefargument` | ManyToOne, nullable | Referenz auf Prüfargument (null wenn veraltet) |
| `bezeichnung` | `String` | NOT NULL | Kopie der Bezeichnung (für veraltet-Fall) |
| `typ` | `PruefargumentTyp` | NOT NULL | Kopie des Typs (für veraltet-Fall) |
| `kontrollhakenWert` | `Boolean` | nullable | Ausgefüllter Wert für KONTROLLHAKEN |
| `toleranzMin` | `Double` | nullable | Ausgefüllter Min-Wert für TOLERANZ |
| `toleranzMax` | `Double` | nullable | Ausgefüllter Max-Wert für TOLERANZ |
| `zahlwert` | `Double` | nullable | Ausgefüllter Wert für ZAHLWERT |
| `textWert` | `String` | nullable | Ausgefüllter Wert für TEXT |
| `veraltet` | `boolean` | NOT NULL, default false | true wenn das Pruefargument gelöscht wurde |
| `reihenfolge` | `int` | NOT NULL, default 0 | Sortierreihenfolge (Kopie aus Pruefargument) |

**JPA-Annotationen:**
- `@Entity`, `@Table(name = "instanz_wert")`
- `@ManyToOne(fetch = FetchType.LAZY)`, `@JoinColumn(name = "instanz_id", nullable = false)`
- `@ManyToOne(fetch = FetchType.LAZY)`, `@JoinColumn(name = "pruefargument_id", nullable = true)`
- `@Enumerated(EnumType.STRING)` für `typ`

---

## Repositories

Alle Repositories erweitern `JpaRepository<T, Long>`. Zusätzliche Query-Methoden:

### `MaterialnummerRepository`
```java
Optional<Materialnummer> findByNummer(String nummer);
boolean existsByNummer(String nummer);
```

### `PruefargumentRepository`
```java
List<Pruefargument> findByMaterialnummerIdOrderByReihenfolgeAsc(Long materialnummerId);
```

### `AuftragRepository`
```java
Optional<Auftrag> findByAuftragsnummer(String auftragsnummer);
boolean existsByAuftragsnummer(String auftragsnummer);
List<Auftrag> findByMaterialnummerId(Long materialnummerId);
long countByMaterialnummerId(Long materialnummerId);
```

### `InstanzRepository`
```java
List<Instanz> findByAuftragIdOrderByNummerAsc(Long auftragId);
```

### `InstanzWertRepository`
```java
List<InstanzWert> findByInstanzIdOrderByReihenfolgeAsc(Long instanzId);
List<InstanzWert> findByPruefargumentId(Long pruefargumentId);
```

---

## `application.properties`

```properties
# SQLite Datenbank unter data/auftrag.db
spring.datasource.url=jdbc:sqlite:data/auftrag.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# Server
server.port=8080

# Statische Ressourcen (Frontend)
spring.web.resources.static-locations=classpath:/static/
spring.mvc.throw-exception-if-no-handler-found=true
spring.web.resources.add-mappings=false
```

---

## Akzeptanzkriterien

- [ ] Anwendung startet ohne Fehler (`./gradlew bootRun`)
- [ ] Datei `data/auftrag.db` wird beim ersten Start automatisch erstellt
- [ ] Alle 5 Tabellen sind in der SQLite-Datenbank vorhanden
- [ ] Alle Repositories sind als Spring Beans verfügbar
