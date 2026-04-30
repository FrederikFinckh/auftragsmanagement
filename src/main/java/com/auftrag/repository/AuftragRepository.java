package com.auftrag.repository;

import com.auftrag.model.Auftrag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

// Repository für Auftrag-Entitäten
@Repository
public interface AuftragRepository extends JpaRepository<Auftrag, Long> {

    // Suche nach Auftrag anhand der Auftragsnummer
    Optional<Auftrag> findByAuftragsnummer(String auftragsnummer);

    // Prüft ob ein Auftrag mit dieser Auftragsnummer bereits existiert
    boolean existsByAuftragsnummer(String auftragsnummer);

    // Alle Aufträge die eine bestimmte Materialnummer verwenden
    List<Auftrag> findByMaterialnummerId(Long materialnummerId);

    // Anzahl der Aufträge die eine bestimmte Materialnummer verwenden
    long countByMaterialnummerId(Long materialnummerId);
}
