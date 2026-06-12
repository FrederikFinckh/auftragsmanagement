#!/usr/bin/env bash
# Testskript für Auftragsverwaltung
# Führt TypeScript-Kompilierung, Gradle-Build und Backend-Start durch.
# WICHTIG: Dieses Skript ist das EINZIGE erlaubte Testverfahren nach jeder Änderung.

set -e  # Skript bricht bei erstem Fehler ab

echo "=== Schritt 1: TypeScript-Kompilierung ==="
cd frontend
pnpm install --frozen-lockfile
pnpm tsc --noEmit
cd ..

echo "=== Schritt 2: Gradle Build (inkl. Frontend) ==="
./gradlew build

echo "=== Schritt 3: Backend starten (Port 8080) ==="
echo "Starte Spring Boot... (Abbruch mit Ctrl+C)"
./gradlew bootRun &
PID=$!
sleep ${1:-10}
kill $PID
