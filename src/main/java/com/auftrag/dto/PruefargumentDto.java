package com.auftrag.dto;

import com.auftrag.model.PruefargumentTyp;

// DTO für Prüfargumente (Request und Response)
public class PruefargumentDto {

    private Long id;                    // null bei neu anlegen
    private String bezeichnung;         // Pflichtfeld
    private PruefargumentTyp typ;       // Pflichtfeld
    private Boolean kontrollhakenWert;  // nur bei KONTROLLHAKEN
    private Double toleranzMin;         // nur bei TOLERANZ
    private Double toleranzMax;         // nur bei TOLERANZ
    private Double zahlwert;            // nur bei ZAHLWERT
    private String textWert;            // nur bei TEXT
    private int reihenfolge;

    // --- Getter und Setter ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getBezeichnung() {
        return bezeichnung;
    }

    public void setBezeichnung(String bezeichnung) {
        this.bezeichnung = bezeichnung;
    }

    public PruefargumentTyp getTyp() {
        return typ;
    }

    public void setTyp(PruefargumentTyp typ) {
        this.typ = typ;
    }

    public Boolean getKontrollhakenWert() {
        return kontrollhakenWert;
    }

    public void setKontrollhakenWert(Boolean kontrollhakenWert) {
        this.kontrollhakenWert = kontrollhakenWert;
    }

    public Double getToleranzMin() {
        return toleranzMin;
    }

    public void setToleranzMin(Double toleranzMin) {
        this.toleranzMin = toleranzMin;
    }

    public Double getToleranzMax() {
        return toleranzMax;
    }

    public void setToleranzMax(Double toleranzMax) {
        this.toleranzMax = toleranzMax;
    }

    public Double getZahlwert() {
        return zahlwert;
    }

    public void setZahlwert(Double zahlwert) {
        this.zahlwert = zahlwert;
    }

    public String getTextWert() {
        return textWert;
    }

    public void setTextWert(String textWert) {
        this.textWert = textWert;
    }

    public int getReihenfolge() {
        return reihenfolge;
    }

    public void setReihenfolge(int reihenfolge) {
        this.reihenfolge = reihenfolge;
    }
}
