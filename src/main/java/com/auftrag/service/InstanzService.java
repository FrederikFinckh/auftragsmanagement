package com.auftrag.service;

import com.auftrag.dto.*;
import com.auftrag.exception.ResourceNotFoundException;
import com.auftrag.model.*;
import com.auftrag.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

// Service für die Geschäftslogik der Instanzen und InstanzWerte
@Service
public class InstanzService {

    private final InstanzRepository instanzRepository;
    private final InstanzWertRepository instanzWertRepository;

    public InstanzService(InstanzRepository instanzRepository,
                          InstanzWertRepository instanzWertRepository) {
        this.instanzRepository = instanzRepository;
        this.instanzWertRepository = instanzWertRepository;
    }

    // Instanz-Detail mit allen Werten abrufen (für Tab-Ansicht)
    @Transactional(readOnly = true)
    public InstanzDetailDto getInstanzDetail(Long instanzId) {
        Instanz instanz = findInstanzOrThrow(instanzId);
        return toDetailDto(instanz);
    }

    // Einzelnen InstanzWert speichern (auto-save)
    @Transactional
    public InstanzWertDto updateWert(Long instanzId, Long wertId, InstanzWertUpdateDto dto) {
        InstanzWert wert = instanzWertRepository.findById(wertId)
                .orElseThrow(() -> new ResourceNotFoundException("InstanzWert mit ID " + wertId + " nicht gefunden"));

        // Validierung: Wert muss zur Instanz gehören
        if (!wert.getInstanz().getId().equals(instanzId)) {
            throw new IllegalArgumentException("InstanzWert " + wertId + " gehört nicht zu Instanz " + instanzId);
        }

        // Veraltete Werte dürfen nicht mehr geändert werden
        if (wert.isVeraltet()) {
            throw new IllegalArgumentException("Veralteter InstanzWert kann nicht mehr geändert werden");
        }

        // Nur die relevanten Felder je nach Typ aktualisieren
        // xxxSet-Flags unterscheiden zwischen "Feld nicht im JSON" und "Feld = null"
        switch (wert.getTyp()) {
            case KONTROLLHAKEN:
                if (dto.isKontrollhakenWertSet()) {
                    wert.setKontrollhakenWert(dto.getKontrollhakenWert());
                }
                break;
            case TOLERANZ:
                if (dto.isToleranzMinSet()) {
                    wert.setToleranzMin(dto.getToleranzMin());
                }
                if (dto.isToleranzMaxSet()) {
                    wert.setToleranzMax(dto.getToleranzMax());
                }
                // Ist-Wert wird in zahlwert gespeichert
                if (dto.isZahlwertSet()) {
                    wert.setZahlwert(dto.getZahlwert());
                }
                break;
            case ZAHLWERT:
                if (dto.isZahlwertSet()) {
                    wert.setZahlwert(dto.getZahlwert());
                }
                break;
            case TEXT:
                if (dto.isTextWertSet()) {
                    wert.setTextWert(dto.getTextWert());
                }
                break;
        }

        InstanzWert saved = instanzWertRepository.save(wert);
        return toWertDto(saved);
    }

    // Kontrolle abgeschlossen Flag setzen
    @Transactional
    public InstanzDetailDto setKontrolleAbgeschlossen(Long instanzId, boolean abgeschlossen) {
        Instanz instanz = findInstanzOrThrow(instanzId);
        instanz.setKontrolleAbgeschlossen(abgeschlossen);
        instanzRepository.save(instanz);
        return toDetailDto(instanz);
    }

    // Einzelne Instanz löschen (Cascade löscht Werte)
    @Transactional
    public void deleteInstanz(Long instanzId) {
        Instanz instanz = findInstanzOrThrow(instanzId);
        instanzRepository.delete(instanz);
    }

    // --- Hilfsmethoden ---

    // Instanz anhand ID suchen oder 404 werfen
    private Instanz findInstanzOrThrow(Long id) {
        return instanzRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Instanz mit ID " + id + " nicht gefunden"));
    }

    // Instanz-Entity zu Detail-DTO konvertieren
    private InstanzDetailDto toDetailDto(Instanz instanz) {
        InstanzDetailDto dto = new InstanzDetailDto();
        dto.setId(instanz.getId());
        dto.setNummer(instanz.getNummer());
        dto.setKontrolleAbgeschlossen(instanz.isKontrolleAbgeschlossen());
        dto.setMaterialVeraendert(instanz.isMaterialVeraendert());

        // Auftrag-Daten
        Auftrag auftrag = instanz.getAuftrag();
        dto.setAuftragId(auftrag.getId());
        dto.setAuftragsnummer(auftrag.getAuftragsnummer());
        dto.setDatum(auftrag.getDatum());
        dto.setKunde(auftrag.getKunde());

        // Materialnummer
        if (auftrag.getMaterialnummer() != null) {
            dto.setMaterialnummerNummer(auftrag.getMaterialnummer().getNummer());
        }

        // Werte laden und konvertieren
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
