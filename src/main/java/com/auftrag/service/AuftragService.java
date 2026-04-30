package com.auftrag.service;

import com.auftrag.dto.*;
import com.auftrag.exception.ResourceNotFoundException;
import com.auftrag.model.*;
import com.auftrag.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

// Service für die Geschäftslogik der Aufträge
@Service
public class AuftragService {

    private final AuftragRepository auftragRepository;
    private final MaterialnummerRepository materialnummerRepository;
    private final PruefargumentRepository pruefargumentRepository;
    private final InstanzRepository instanzRepository;
    private final InstanzWertRepository instanzWertRepository;

    public AuftragService(AuftragRepository auftragRepository,
                          MaterialnummerRepository materialnummerRepository,
                          PruefargumentRepository pruefargumentRepository,
                          InstanzRepository instanzRepository,
                          InstanzWertRepository instanzWertRepository) {
        this.auftragRepository = auftragRepository;
        this.materialnummerRepository = materialnummerRepository;
        this.pruefargumentRepository = pruefargumentRepository;
        this.instanzRepository = instanzRepository;
        this.instanzWertRepository = instanzWertRepository;
    }

    // Alle Aufträge abrufen, sortiert nach id DESC (neueste zuerst)
    @Transactional(readOnly = true)
    public List<AuftragDto> getAlleAuftraege() {
        return auftragRepository.findAll().stream()
                .sorted(Comparator.comparing(Auftrag::getId).reversed())
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Neuen Auftrag anlegen (generiert N Instanzen mit InstanzWerten)
    @Transactional
    public AuftragDto createAuftrag(AuftragCreateDto dto) {
        // Prüfen ob Auftragsnummer bereits existiert
        if (auftragRepository.existsByAuftragsnummer(dto.getAuftragsnummer())) {
            throw new IllegalArgumentException("Auftragsnummer '" + dto.getAuftragsnummer() + "' existiert bereits");
        }

        Auftrag auftrag = new Auftrag();
        auftrag.setAuftragsnummer(dto.getAuftragsnummer());
        auftrag.setDatum(dto.getDatum());
        auftrag.setKunde(dto.getKunde());
        auftrag.setStueckzahl(dto.getStueckzahl());

        // Materialnummer laden falls angegeben
        Materialnummer materialnummer = null;
        if (dto.getMaterialnummerId() != null) {
            materialnummer = materialnummerRepository.findById(dto.getMaterialnummerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Materialnummer mit ID " + dto.getMaterialnummerId() + " nicht gefunden"));
            auftrag.setMaterialnummer(materialnummer);
        }

        // Auftrag speichern
        Auftrag savedAuftrag = auftragRepository.save(auftrag);

        // Prüfargumente der Materialnummer laden
        List<Pruefargument> pruefargumente = List.of();
        if (materialnummer != null) {
            pruefargumente = pruefargumentRepository.findByMaterialnummerIdOrderByReihenfolgeAsc(materialnummer.getId());
        }

        // N Instanzen generieren
        for (int i = 1; i <= dto.getStueckzahl(); i++) {
            Instanz instanz = new Instanz();
            instanz.setAuftrag(savedAuftrag);
            instanz.setNummer(i);
            instanzRepository.save(instanz);

            // Pro Instanz: für jedes Prüfargument einen InstanzWert anlegen
            for (Pruefargument arg : pruefargumente) {
                InstanzWert wert = new InstanzWert();
                wert.setInstanz(instanz);
                wert.setPruefargument(arg);
                wert.setBezeichnung(arg.getBezeichnung());
                wert.setTyp(arg.getTyp());
                // Standardwerte aus dem Prüfargument übernehmen
                wert.setKontrollhakenWert(arg.getKontrollhakenWert());
                wert.setToleranzMin(arg.getToleranzMin());
                wert.setToleranzMax(arg.getToleranzMax());
                wert.setZahlwert(arg.getZahlwert());
                wert.setTextWert(arg.getTextWert());
                wert.setReihenfolge(arg.getReihenfolge());
                wert.setVeraltet(false);
                instanzWertRepository.save(wert);
            }
        }

        return toDto(savedAuftrag);
    }

    // Auftrag bearbeiten (nur Metadaten, keine Stückzahl-Änderung)
    @Transactional
    public AuftragDto updateAuftrag(Long id, AuftragCreateDto dto) {
        Auftrag auftrag = findOrThrow(id);

        // Auftragsnummer-Änderung prüfen (kein Duplikat)
        if (!auftrag.getAuftragsnummer().equals(dto.getAuftragsnummer())) {
            if (auftragRepository.existsByAuftragsnummer(dto.getAuftragsnummer())) {
                throw new IllegalArgumentException("Auftragsnummer '" + dto.getAuftragsnummer() + "' existiert bereits");
            }
        }

        auftrag.setAuftragsnummer(dto.getAuftragsnummer());
        auftrag.setDatum(dto.getDatum());
        auftrag.setKunde(dto.getKunde());

        // Materialnummer ändern
        Materialnummer materialnummer = null;
        if (dto.getMaterialnummerId() != null) {
            materialnummer = materialnummerRepository.findById(dto.getMaterialnummerId())
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Materialnummer mit ID " + dto.getMaterialnummerId() + " nicht gefunden"));
        }
        auftrag.setMaterialnummer(materialnummer);

        Auftrag saved = auftragRepository.save(auftrag);
        return toDto(saved);
    }

    // Instanzen-Übersicht für einen Auftrag (für Übersichtskarten)
    @Transactional(readOnly = true)
    public List<InstanzUebersichtDto> getInstanzenFuerAuftrag(Long auftragId) {
        Auftrag auftrag = findOrThrow(auftragId);
        List<Instanz> instanzen = instanzRepository.findByAuftragIdOrderByNummerAsc(auftragId);
        return instanzen.stream()
                .map(this::toUebersichtDto)
                .collect(Collectors.toList());
    }

    // Auftrag löschen (Cascade löscht Instanzen + Werte)
    @Transactional
    public void deleteAuftrag(Long id) {
        Auftrag auftrag = findOrThrow(id);
        auftragRepository.delete(auftrag);
    }

    // Weitere Instanzen zu einem bestehenden Auftrag hinzufügen
    @Transactional
    public List<InstanzUebersichtDto> addInstanzen(Long auftragId, InstanzCreateDto dto) {
        Auftrag auftrag = findOrThrow(auftragId);

        // Höchste bestehende Instanz-Nummer ermitteln
        List<Instanz> bestehendeInstanzen = instanzRepository.findByAuftragIdOrderByNummerAsc(auftragId);
        int hoechsteNummer = bestehendeInstanzen.stream()
                .mapToInt(Instanz::getNummer)
                .max()
                .orElse(0);

        // Prüfargumente der Materialnummer laden
        Materialnummer materialnummer = auftrag.getMaterialnummer();
        List<Pruefargument> pruefargumente = List.of();
        if (materialnummer != null) {
            pruefargumente = pruefargumentRepository.findByMaterialnummerIdOrderByReihenfolgeAsc(materialnummer.getId());
        }

        // Neue Instanzen generieren
        List<Instanz> neueInstanzen = new java.util.ArrayList<>();
        for (int i = 1; i <= dto.getAnzahl(); i++) {
            Instanz instanz = new Instanz();
            instanz.setAuftrag(auftrag);
            instanz.setNummer(hoechsteNummer + i);
            instanzRepository.save(instanz);

            // Pro Instanz: für jedes Prüfargument einen InstanzWert anlegen
            for (Pruefargument arg : pruefargumente) {
                InstanzWert wert = new InstanzWert();
                wert.setInstanz(instanz);
                wert.setPruefargument(arg);
                wert.setBezeichnung(arg.getBezeichnung());
                wert.setTyp(arg.getTyp());
                wert.setKontrollhakenWert(arg.getKontrollhakenWert());
                wert.setToleranzMin(arg.getToleranzMin());
                wert.setToleranzMax(arg.getToleranzMax());
                wert.setZahlwert(arg.getZahlwert());
                wert.setTextWert(arg.getTextWert());
                wert.setReihenfolge(arg.getReihenfolge());
                wert.setVeraltet(false);
                instanzWertRepository.save(wert);
            }

            neueInstanzen.add(instanz);
        }

        // Stückzahl aktualisieren
        auftrag.setStueckzahl(auftrag.getStueckzahl() + dto.getAnzahl());
        auftragRepository.save(auftrag);

        return neueInstanzen.stream()
                .map(this::toUebersichtDto)
                .collect(Collectors.toList());
    }

    // --- Hilfsmethoden ---

    // Auftrag anhand ID suchen oder 404 werfen
    private Auftrag findOrThrow(Long id) {
        return auftragRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Auftrag mit ID " + id + " nicht gefunden"));
    }

    // Auftrag-Entity zu DTO konvertieren
    private AuftragDto toDto(Auftrag auftrag) {
        AuftragDto dto = new AuftragDto();
        dto.setId(auftrag.getId());
        dto.setAuftragsnummer(auftrag.getAuftragsnummer());
        dto.setDatum(auftrag.getDatum());
        dto.setKunde(auftrag.getKunde());
        dto.setStueckzahl(auftrag.getStueckzahl());
        dto.setMaterialVeraendert(auftrag.isMaterialVeraendert());

        if (auftrag.getMaterialnummer() != null) {
            dto.setMaterialnummerId(auftrag.getMaterialnummer().getId());
            dto.setMaterialnummerNummer(auftrag.getMaterialnummer().getNummer());
        }

        // Anzahl abgeschlossener Instanzen zählen
        List<Instanz> instanzen = instanzRepository.findByAuftragIdOrderByNummerAsc(auftrag.getId());
        long abgeschlossen = instanzen.stream()
                .filter(Instanz::isKontrolleAbgeschlossen)
                .count();
        dto.setInstanzenAbgeschlossen((int) abgeschlossen);

        return dto;
    }

    // Instanz-Entity zu Übersichts-DTO konvertieren
    private InstanzUebersichtDto toUebersichtDto(Instanz instanz) {
        InstanzUebersichtDto dto = new InstanzUebersichtDto();
        dto.setId(instanz.getId());
        dto.setNummer(instanz.getNummer());
        dto.setKontrolleAbgeschlossen(instanz.isKontrolleAbgeschlossen());
        dto.setMaterialVeraendert(instanz.isMaterialVeraendert());

        // Werte laden und zu DTO konvertieren
        List<InstanzWert> werte = instanzWertRepository.findByInstanzIdOrderByReihenfolgeAsc(instanz.getId());
        List<InstanzWertDto> wertDtos = werte.stream()
                .map(this::toWertDto)
                .collect(Collectors.toList());
        dto.setWerte(wertDtos);

        return dto;
    }

    // InstanzWert-Entity zu DTO konvertieren
    private InstanzWertDto toWertDto(InstanzWert wert) {
        InstanzWertDto dto = new InstanzWertDto();
        dto.setId(wert.getId());
        dto.setBezeichnung(wert.getBezeichnung());
        dto.setTyp(wert.getTyp());
        dto.setKontrollhakenWert(wert.getKontrollhakenWert());
        dto.setToleranzMin(wert.getToleranzMin());
        dto.setToleranzMax(wert.getToleranzMax());
        dto.setZahlwert(wert.getZahlwert());
        dto.setTextWert(wert.getTextWert());
        dto.setVeraltet(wert.isVeraltet());
        dto.setReihenfolge(wert.getReihenfolge());
        return dto;
    }
}
