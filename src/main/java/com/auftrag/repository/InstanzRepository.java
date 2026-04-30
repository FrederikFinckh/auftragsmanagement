package com.auftrag.repository;

import com.auftrag.model.Instanz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

// Repository für Instanz-Entitäten
@Repository
public interface InstanzRepository extends JpaRepository<Instanz, Long> {

    // Alle Instanzen eines Auftrags, sortiert nach laufender Nummer
    List<Instanz> findByAuftragIdOrderByNummerAsc(Long auftragId);
}
