package com.auftrag.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

// JPA-Entität für eine Materialnummer (Template für Aufträge)
@Entity
@Table(name = "materialnummer")
public class Materialnummer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Eindeutige Materialnummer (z.B. "M-1234")
    @Column(nullable = false, unique = true)
    private String nummer;

    // Optionale Beschreibung
    @Column
    private String beschreibung;

    // Geordnete Liste der Prüfargumente dieses Templates
    @OneToMany(mappedBy = "materialnummer", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("reihenfolge ASC")
    private List<Pruefargument> pruefargumente = new ArrayList<>();

    // --- Getter und Setter ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public List<Pruefargument> getPruefargumente() {
        return pruefargumente;
    }

    public void setPruefargumente(List<Pruefargument> pruefargumente) {
        this.pruefargumente = pruefargumente;
    }
}
