package com.auftrag.dto;

import java.util.List;

// Response-DTO für Materialnummer
public class MaterialnummerDto {

    private Long id;
    private String nummer;
    private String beschreibung;
    private List<PruefargumentDto> pruefargumente;
    private long auftragCount;  // Anzahl Aufträge die diese Materialnummer verwenden

    // --- Getter und Setter ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNummer() {
        return nummer;
    }

    public void setNummer(String nummer) {
        this.nummer = nummer;
    }

    public String getBeschreibung() {
        return beschreibung;
    }

    public void setBeschreibung(String beschreibung) {
        this.beschreibung = beschreibung;
    }

    public List<PruefargumentDto> getPruefargumente() {
        return pruefargumente;
    }

    public void setPruefargumente(List<PruefargumentDto> pruefargumente) {
        this.pruefargumente = pruefargumente;
    }

    public long getAuftragCount() {
        return auftragCount;
    }

    public void setAuftragCount(long auftragCount) {
        this.auftragCount = auftragCount;
    }
}
