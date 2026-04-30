package com.auftrag.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

// JPA-Entität für einen Fertigungsauftrag
@Entity
@Table(name = "auftrag")
public class Auftrag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Eindeutige Auftragsnummer
    @Column(nullable = false, unique = true)
    private String auftragsnummer;

    // Datum des Auftrags (Format TT.MM.JJJJ)
    @Column(nullable = false)
    private String datum;

    // Optionaler Kundenname
    @Column
    private String kunde;

    // Referenz auf das Materialnummer-Template (kann null sein)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "materialnummer_id")
    private Materialnummer materialnummer;

    // Anzahl der zu generierenden Instanzen
    @Column(nullable = false)
    private int stueckzahl;

    // Warn-Flag: wird gesetzt wenn die Materialnummer nach Auftragserstellung geändert wurde
    @Column(nullable = false)
    private boolean materialVeraendert = false;

    // Generierte Instanzen dieses Auftrags
    @OneToMany(mappedBy = "auftrag", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("nummer ASC")
    private List<Instanz> instanzen = new ArrayList<>();

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

    public Materialnummer getMaterialnummer() {
        return materialnummer;
    }

    public void setMaterialnummer(Materialnummer materialnummer) {
        this.materialnummer = materialnummer;
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

    public List<Instanz> getInstanzen() {
        return instanzen;
    }

    public void setInstanzen(List<Instanz> instanzen) {
        this.instanzen = instanzen;
    }
}
