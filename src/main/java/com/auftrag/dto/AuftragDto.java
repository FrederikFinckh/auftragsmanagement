package com.auftrag.dto;

// Response-DTO für einen Auftrag
public class AuftragDto {

    private Long id;
    private String auftragsnummer;
    private String datum;
    private String kunde;
    private Long materialnummerId;
    private String materialnummerNummer;
    private int stueckzahl;
    private boolean materialVeraendert;
    private int instanzenAbgeschlossen;  // Anzahl Instanzen mit kontrolleAbgeschlossen=true

    // --- Getter und Setter ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getAuftragsnummer() {
        return auftragsnummer;
    }

    public void setAuftragsnummer(String auftragsnummer) {
        this.auftragsnummer = auftragsnummer;
    }

    public String getDatum() {
        return datum;
    }

    public void setDatum(String datum) {
        this.datum = datum;
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

    public String getMaterialnummerNummer() {
        return materialnummerNummer;
    }

    public void setMaterialnummerNummer(String materialnummerNummer) {
        this.materialnummerNummer = materialnummerNummer;
    }

    public int getStueckzahl() {
        return stueckzahl;
    }

    public void setStueckzahl(int stueckzahl) {
        this.stueckzahl = stueckzahl;
    }

    public boolean isMaterialVeraendert() {
        return materialVeraendert;
    }

    public void setMaterialVeraendert(boolean materialVeraendert) {
        this.materialVeraendert = materialVeraendert;
    }

    public int getInstanzenAbgeschlossen() {
        return instanzenAbgeschlossen;
    }

    public void setInstanzenAbgeschlossen(int instanzenAbgeschlossen) {
        this.instanzenAbgeschlossen = instanzenAbgeschlossen;
    }
}
