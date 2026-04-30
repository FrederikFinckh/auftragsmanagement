package com.auftrag.dto;

import java.util.List;

// Response-DTO für die vollständige Instanz-Detailansicht (Tab-Ansicht)
public class InstanzDetailDto {

    private Long id;
    private int nummer;
    private boolean kontrolleAbgeschlossen;
    private boolean materialVeraendert;
    private Long auftragId;
    private String auftragsnummer;
    private String datum;
    private String kunde;
    private String materialnummerNummer;
    private List<InstanzWertDto> werte;

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

    public Long getAuftragId() {
        return auftragId;
    }

    public void setAuftragId(Long auftragId) {
        this.auftragId = auftragId;
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

    public String getMaterialnummerNummer() {
        return materialnummerNummer;
    }

    public void setMaterialnummerNummer(String materialnummerNummer) {
        this.materialnummerNummer = materialnummerNummer;
    }

    public List<InstanzWertDto> getWerte() {
        return werte;
    }

    public void setWerte(List<InstanzWertDto> werte) {
        this.werte = werte;
    }
}
