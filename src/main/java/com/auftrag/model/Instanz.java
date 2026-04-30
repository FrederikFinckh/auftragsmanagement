package com.auftrag.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

// JPA-Entität für eine einzelne Instanz eines Auftrags (ein Stück)
@Entity
@Table(name = "instanz")
public class Instanz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Zugehöriger Auftrag
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "auftrag_id", nullable = false)
    private Auftrag auftrag;

    // Laufende Nummer der Instanz innerhalb des Auftrags (1..N)
    @Column(nullable = false)
    private int nummer;

    // Flag: Kontrolle wurde abgeschlossen
    @Column(nullable = false)
    private boolean kontrolleAbgeschlossen = false;

    // Warn-Flag: wird gesetzt wenn Prüfargumente nach Instanzerstellung geändert wurden
    @Column(nullable = false)
    private boolean materialVeraendert = false;

    // Ausgefüllte Prüfargument-Werte dieser Instanz
    @OneToMany(mappedBy = "instanz", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("reihenfolge ASC")
    private List<InstanzWert> werte = new ArrayList<>();

    // --- Getter und Setter ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Auftrag getAuftrag() {
        return auftrag;
    }

    public void setAuftrag(Auftrag auftrag) {
        this.auftrag = auftrag;
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

    public List<InstanzWert> getWerte() {
        return werte;
    }

    public void setWerte(List<InstanzWert> werte) {
        this.werte = werte;
    }
}
