package com.auftrag.model;

import jakarta.persistence.*;

// JPA-Entität für ein Prüfargument einer Materialnummer
@Entity
@Table(name = "pruefargument")
public class Pruefargument {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Zugehörige Materialnummer
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materialnummer_id", nullable = false)
    private Materialnummer materialnummer;

    // Bezeichnung / Label des Prüfarguments
    @Column(nullable = false)
    private String bezeichnung;

    // Typ des Prüfarguments (KONTROLLHAKEN, TOLERANZ, ZAHLWERT, TEXT)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PruefargumentTyp typ;

    // Standardwert für Typ KONTROLLHAKEN
    @Column
    private Boolean kontrollhakenWert;

    // Minimalwert für Typ TOLERANZ
    @Column
    private Double toleranzMin;

    // Maximalwert für Typ TOLERANZ
    @Column
    private Double toleranzMax;

    // Standardwert für Typ ZAHLWERT
    @Column
    private Double zahlwert;

    // Standardwert für Typ TEXT
    @Column
    private String textWert;

    // Sortierreihenfolge innerhalb der Materialnummer
    @Column(nullable = false)
    private int reihenfolge = 0;

    // --- Getter und Setter ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Materialnummer getMaterialnummer() {
        return materialnummer;
    }

    public void setMaterialnummer(Materialnummer materialnummer) {
        this.materialnummer = materialnummer;
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
