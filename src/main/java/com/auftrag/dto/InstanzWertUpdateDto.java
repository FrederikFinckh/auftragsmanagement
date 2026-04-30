package com.auftrag.dto;

// Request-DTO für das Patchen eines einzelnen InstanzWerts (auto-save)
// Je nach Typ wird nur das relevante Feld gesetzt.
// Boolean-Flags (xxxSet) tracken, welche Felder im JSON vorhanden waren,
// damit null-Werte von abwesenden Feldern unterschieden werden können.
public class InstanzWertUpdateDto {

    private Boolean kontrollhakenWert;  // nur bei KONTROLLHAKEN
    private boolean kontrollhakenWertSet = false;

    private Double toleranzMin;         // nur bei TOLERANZ
    private boolean toleranzMinSet = false;

    private Double toleranzMax;         // nur bei TOLERANZ
    private boolean toleranzMaxSet = false;

    private Double zahlwert;            // bei ZAHLWERT und TOLERANZ (Ist-Wert)
    private boolean zahlwertSet = false;

    private String textWert;            // nur bei TEXT
    private boolean textWertSet = false;

    // --- Getter und Setter (Setter markieren das Feld als vorhanden) ---

    public Boolean getKontrollhakenWert() {
        return kontrollhakenWert;
    }

    public void setKontrollhakenWert(Boolean kontrollhakenWert) {
        this.kontrollhakenWert = kontrollhakenWert;
        this.kontrollhakenWertSet = true;
    }

    public boolean isKontrollhakenWertSet() {
        return kontrollhakenWertSet;
    }

    public Double getToleranzMin() {
        return toleranzMin;
    }

    public void setToleranzMin(Double toleranzMin) {
        this.toleranzMin = toleranzMin;
        this.toleranzMinSet = true;
    }

    public boolean isToleranzMinSet() {
        return toleranzMinSet;
    }

    public Double getToleranzMax() {
        return toleranzMax;
    }

    public void setToleranzMax(Double toleranzMax) {
        this.toleranzMax = toleranzMax;
        this.toleranzMaxSet = true;
    }

    public boolean isToleranzMaxSet() {
        return toleranzMaxSet;
    }

    public Double getZahlwert() {
        return zahlwert;
    }

    public void setZahlwert(Double zahlwert) {
        this.zahlwert = zahlwert;
        this.zahlwertSet = true;
    }

    public boolean isZahlwertSet() {
        return zahlwertSet;
    }

    public String getTextWert() {
        return textWert;
    }

    public void setTextWert(String textWert) {
        this.textWert = textWert;
        this.textWertSet = true;
    }

    public boolean isTextWertSet() {
        return textWertSet;
    }
}
