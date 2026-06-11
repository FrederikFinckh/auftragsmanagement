package com.auftrag;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

// Einstiegspunkt der Spring Boot Anwendung
@SpringBootApplication
public class AuftragApplication {

    public static void main(String[] args) {
        ensureDataDirectory();
        SpringApplication.run(AuftragApplication.class, args);
    }

    // Datenverzeichnis für SQLite anlegen, falls es noch nicht existiert
    private static void ensureDataDirectory() {
        Path dataDir = Paths.get("data");
        if (!Files.isDirectory(dataDir)) {
            try {
                Files.createDirectories(dataDir);
            } catch (Exception e) {
                throw new RuntimeException("Datenverzeichnis 'data' konnte nicht erstellt werden: " + e.getMessage(), e);
            }
        }
    }
}
