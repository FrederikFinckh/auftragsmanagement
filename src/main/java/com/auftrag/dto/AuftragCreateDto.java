package com.auftrag.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;

// Request-DTO für das Anlegen eines neuen Auftrags
public class AuftragCreateDto {

    @NotBlank(message = "Datum ist Pflichtfeld")
    private String datum;  // Format TT.MM.JJJJ

    @NotBlank(message = "Auftragsnummer ist Pflichtfeld")
    private String auftragsnummer;

    @Min(value = 1, message = "Stückzahl muss mindestens 1 sein")
    private int stueckzahl;

    private String kunde;  // optional

    private Long materialnummerId;  // optional – Auftrag ohne Material möglich

    // --- Getter und Setter ---

    public String getDatum() {
        return datum;
    }

    public void setDatum(String datum) {
        this.datum = datum;
    }

    public String getAuftragsnummer() {
        return auftragsnummer;
    }

    public void setAuftragsnummer(String auftragsnummer) {
        this.auftragsnummer = auftragsnummer;
    }

    public int getStueckzahl() {
        return stueckzahl;
    }

    public void setStueckzahl(int stueckzahl) {
        this.stueckzahl = stueckzahl;
    }

    public String getKunde() {
        return kunde;
    }

    public void setKunde(String kunde) {
        this.kunde = kunde;
    }

    public Long getMaterialnummerId() {
        return materialnummerId;
    }

    public void setMaterialnummerId(Long materialnummerId) {
        this.materialnummerId = materialnummerId;
    }
}
