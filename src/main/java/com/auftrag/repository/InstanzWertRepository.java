package com.auftrag.repository;

import com.auftrag.model.InstanzWert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository für InstanzWert-Entitäten
@Repository
public interface InstanzWertRepository extends JpaRepository<InstanzWert, Long> {

    // Alle Werte einer Instanz, sortiert nach Reihenfolge
    List<InstanzWert> findByInstanzIdOrderByReihenfolgeAsc(Long instanzId);

    // Alle Werte die auf ein bestimmtes Prüfargument verweisen
    // (wird beim Löschen/Veralten von Prüfargumenten benötigt)
    List<InstanzWert> findByPruefargumentId(Long pruefargumentId);
}
