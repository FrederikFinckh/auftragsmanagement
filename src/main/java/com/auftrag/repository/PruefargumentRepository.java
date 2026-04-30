package com.auftrag.repository;

import com.auftrag.model.Pruefargument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository für Prüfargument-Entitäten
@Repository
public interface PruefargumentRepository extends JpaRepository<Pruefargument, Long> {

    // Alle Prüfargumente einer Materialnummer, sortiert nach Reihenfolge
    List<Pruefargument> findByMaterialnummerIdOrderByReihenfolgeAsc(Long materialnummerId);
}
