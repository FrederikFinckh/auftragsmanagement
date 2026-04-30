package com.auftrag.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import java.util.List;

// Request-DTO für das Anlegen und Bearbeiten einer Materialnummer
public class MaterialnummerCreateDto {

    @NotBlank(message = "Materialnummer ist Pflichtfeld")
    private String nummer;

    private String beschreibung;

    @Valid
    private List<PruefargumentDto> pruefargumente;  // kann leer sein oder null

    // --- Getter und Setter ---

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
}
