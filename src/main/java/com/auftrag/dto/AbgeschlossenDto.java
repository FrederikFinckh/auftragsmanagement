package com.auftrag.dto;

// Request-DTO für das Setzen des Kontrolle-abgeschlossen-Flags
public class AbgeschlossenDto {

    private boolean abgeschlossen;

    // --- Getter und Setter ---

    public boolean isAbgeschlossen() {
        return abgeschlossen;
    }

    public void setAbgeschlossen(boolean abgeschlossen) {
        this.abgeschlossen = abgeschlossen;
    }
}
