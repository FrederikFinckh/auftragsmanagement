package com.auftrag.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

// Request-DTO zum Hinzufügen weiterer Instanzen zu einem bestehenden Auftrag
public class InstanzCreateDto {

    @NotNull(message = "Anzahl ist ein Pflichtfeld")
    @Min(value = 1, message = "Anzahl muss mindestens 1 sein")
    private Integer anzahl;

    // --- Getter und Setter ---

    public Integer getAnzahl() {
        return anzahl;
    }

    public void setAnzahl(Integer anzahl) {
        this.anzahl = anzahl;
    }
}
