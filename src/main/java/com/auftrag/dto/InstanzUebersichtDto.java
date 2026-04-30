package com.auftrag.dto;

import java.util.List;

// Response-DTO für die Instanz-Übersicht (Übersichtskarten im Mittelbereich)
public class InstanzUebersichtDto {

    private Long id;
    private int nummer;
    private boolean kontrolleAbgeschlossen;
    private boolean materialVeraendert;
    private List<InstanzWertDto> werte;  // read-only Snapshot der Prüfargument-Werte

    // --- Getter und Setter ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getNummer() {
        return nummer;
    }

    public void setNummer(int nummer) {
        this.nummer = nummer;
    }

    public boolean isKontrolleAbgeschlossen() {
        return kontrolleAbgeschlossen;
    }

    public void setKontrolleAbgeschlossen(boolean kontrolleAbgeschlossen) {
        this.kontrolleAbgeschlossen = kontrolleAbgeschlossen;
    }

    public boolean isMaterialVeraendert() {
        return materialVeraendert;
    }

    public void setMaterialVeraendert(boolean materialVeraendert) {
        this.materialVeraendert = materialVeraendert;
    }

    public List<InstanzWertDto> getWerte() {
        return werte;
    }

    public void setWerte(List<InstanzWertDto> werte) {
        this.werte = werte;
    }
}
