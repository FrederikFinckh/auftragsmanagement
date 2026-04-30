package com.auftrag.dto;

// Request-DTO für das Patchen eines einzelnen InstanzWerts (auto-save)
// Je nach Typ wird nur das relevante Feld gesetzt
public class InstanzWertUpdateDto {

    private Boolean kontrollhakenWert;  // nur bei KONTROLLHAKEN
    private Double toleranzMin;         // nur bei TOLERANZ
    private Double toleranzMax;         // nur bei TOLERANZ
    private Double zahlwert;            // nur bei ZAHLWERT
    private String textWert;            // nur bei TEXT

    // --- Getter und Setter ---

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
}
