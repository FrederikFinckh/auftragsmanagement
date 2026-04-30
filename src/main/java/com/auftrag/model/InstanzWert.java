package com.auftrag.model;

import jakarta.persistence.*;

// JPA-Entität für einen ausgefüllten Prüfargument-Wert einer Instanz.
// Speichert eine Kopie von bezeichnung und typ, damit der Wert auch nach
// Löschung des Prüfarguments noch lesbar bleibt (veraltet = true).
@Entity
@Table(name = "instanz_wert")
public class InstanzWert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Zugehörige Instanz
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instanz_id", nullable = false)
    private Instanz instanz;

    // Referenz auf das Prüfargument (null wenn veraltet)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pruefargument_id", nullable = true)
    private Pruefargument pruefargument;

    // Kopie der Bezeichnung (bleibt erhalten wenn Prüfargument gelöscht wird)
    @Column(nullable = false)
    private String bezeichnung;

    // Kopie des Typs (bleibt erhalten wenn Prüfargument gelöscht wird)
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PruefargumentTyp typ;

    // Ausgefüllter Wert für Typ KONTROLLHAKEN
    @Column
    private Boolean kontrollhakenWert;

    // Ausgefüllter Minimalwert für Typ TOLERANZ
    @Column
    private Double toleranzMin;

    // Ausgefüllter Maximalwert für Typ TOLERANZ
    @Column
    private Double toleranzMax;

    // Ausgefüllter Wert für Typ ZAHLWERT
    @Column
    private Double zahlwert;

    // Ausgefüllter Wert für Typ TEXT
    @Column
    private String textWert;

    // true wenn das zugehörige Prüfargument aus der Materialnummer gelöscht wurde
    @Column(nullable = false)
    private boolean veraltet = false;

    // Sortierreihenfolge (Kopie aus Prüfargument)
    @Column(nullable = false)
    private int reihenfolge = 0;

    // --- Getter und Setter ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Instanz getInstanz() {
        return instanz;
    }

    public void setInstanz(Instanz instanz) {
        this.instanz = instanz;
    }

    public Pruefargument getPruefargument() {
        return pruefargument;
    }

    public void setPruefargument(Pruefargument pruefargument) {
        this.pruefargument = pruefargument;
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

    public boolean isVeraltet() {
        return veraltet;
    }

    public void setVeraltet(boolean veraltet) {
        this.veraltet = veraltet;
    }

    public int getReihenfolge() {
        return reihenfolge;
    }

    public void setReihenfolge(int reihenfolge) {
        this.reihenfolge = reihenfolge;
    }
}
