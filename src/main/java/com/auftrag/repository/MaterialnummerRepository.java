package com.auftrag.repository;

import com.auftrag.model.Materialnummer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

// Repository für Materialnummer-Entitäten
@Repository
public interface MaterialnummerRepository extends JpaRepository<Materialnummer, Long> {

    // Suche nach Materialnummer anhand der Nummer
    Optional<Materialnummer> findByNummer(String nummer);

    // Prüft ob eine Materialnummer mit dieser Nummer bereits existiert
    boolean existsByNummer(String nummer);
}
