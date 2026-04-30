package com.auftrag.service;

import com.auftrag.dto.*;
import com.auftrag.exception.MaterialnummerInUseException;
import com.auftrag.exception.ResourceNotFoundException;
import com.auftrag.model.*;
import com.auftrag.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

// Service für die Geschäftslogik der Materialnummern
@Service
public class MaterialnummerService {

    private final MaterialnummerRepository materialnummerRepository;
    private final PruefargumentRepository pruefargumentRepository;
    private final AuftragRepository auftragRepository;
    private final InstanzRepository instanzRepository;
    private final InstanzWertRepository instanzWertRepository;

    public MaterialnummerService(MaterialnummerRepository materialnummerRepository,
                                  PruefargumentRepository pruefargumentRepository,
                                  AuftragRepository auftragRepository,
                                  InstanzRepository instanzRepository,
                                  InstanzWertRepository instanzWertRepository) {
        this.materialnummerRepository = materialnummerRepository;
        this.pruefargumentRepository = pruefargumentRepository;
        this.auftragRepository = auftragRepository;
        this.instanzRepository = instanzRepository;
        this.instanzWertRepository = instanzWertRepository;
    }

    // Alle Materialnummern abrufen, sortiert nach nummer ASC
    @Transactional(readOnly = true)
    public List<MaterialnummerDto> getAlleMaterialien() {
        return materialnummerRepository.findAll().stream()
                .sorted(Comparator.comparing(Materialnummer::getNummer))
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // Einzelne Materialnummer anhand der ID abrufen
    @Transactional(readOnly = true)
    public MaterialnummerDto getMaterialById(Long id) {
        Materialnummer mat = findOrThrow(id);
        return toDto(mat);
    }

    // Neue Materialnummer anlegen
    @Transactional
    public MaterialnummerDto createMaterial(MaterialnummerCreateDto dto) {
        // Prüfen ob Nummer bereits existiert
        if (materialnummerRepository.existsByNummer(dto.getNummer())) {
            throw new IllegalArgumentException("Materialnummer '" + dto.getNummer() + "' existiert bereits");
        }

        Materialnummer mat = new Materialnummer();
        mat.setNummer(dto.getNummer());
        mat.setBeschreibung(dto.getBeschreibung());

        // Prüfargumente anlegen
        if (dto.getPruefargumente() != null) {
            List<Pruefargument> args = new ArrayList<>();
            for (int i = 0; i < dto.getPruefargumente().size(); i++) {
                PruefargumentDto argDto = dto.getPruefargumente().get(i);
                Pruefargument arg = toEntity(argDto, mat);
                arg.setReihenfolge(i);
                args.add(arg);
            }
            mat.setPruefargumente(args);
        }

        Materialnummer saved = materialnummerRepository.save(mat);
        return toDto(saved);
    }

    // Materialnummer bearbeiten (mit Sync-Logik für bestehende Instanzen)
    @Transactional
    public MaterialnummerDto updateMaterial(Long id, MaterialnummerCreateDto dto) {
        Materialnummer mat = findOrThrow(id);

        // Prüfen ob Nummer von einer anderen Materialnummer verwendet wird
        Optional<Materialnummer> existing = materialnummerRepository.findByNummer(dto.getNummer());
        if (existing.isPresent() && !existing.get().getId().equals(id)) {
            throw new IllegalArgumentException("Materialnummer '" + dto.getNummer() + "' wird bereits von einer anderen Materialnummer verwendet");
        }

        mat.setNummer(dto.getNummer());
        mat.setBeschreibung(dto.getBeschreibung());

        // Sync-Logik: Bestehende Prüfargumente aktualisieren, neue hinzufügen, gelöschte entfernen
        List<Pruefargument> currentArgs = mat.getPruefargumente();
        Map<Long, Pruefargument> currentMap = currentArgs.stream()
                .filter(a -> a.getId() != null)
                .collect(Collectors.toMap(Pruefargument::getId, a -> a));

        List<PruefargumentDto> newArgs = dto.getPruefargumente() != null ? dto.getPruefargumente() : Collections.emptyList();

        // IDs der neuen Prüfargumente aus dem Request
        Set<Long> newIds = newArgs.stream()
                .map(PruefargumentDto::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toSet());

        // 1. Gelöschte Prüfargumente identifizieren (in der neuen Liste nicht mehr vorhanden)
        List<Pruefargument> removedArgs = currentArgs.stream()
                .filter(a -> a.getId() != null && !newIds.contains(a.getId()))
                .collect(Collectors.toList());

        // 2. Für gelöschte Prüfargumente: InstanzWerte als veraltet markieren
        for (Pruefargument removed : removedArgs) {
            List<InstanzWert> werte = instanzWertRepository.findByPruefargumentId(removed.getId());
            for (InstanzWert wert : werte) {
                wert.setVeraltet(true);
                wert.setPruefargument(null);
                instanzWertRepository.save(wert);
            }
        }

        // 3. Bestehende Prüfargumente aktualisieren und neue hinzufügen
        List<Pruefargument> updatedArgs = new ArrayList<>();
        for (int i = 0; i < newArgs.size(); i++) {
            PruefargumentDto argDto = newArgs.get(i);
            Pruefargument arg;

            if (argDto.getId() != null && currentMap.containsKey(argDto.getId())) {
                // Bestehendes Prüfargument aktualisieren
                arg = currentMap.get(argDto.getId());
                updatePruefargument(arg, argDto);
            } else {
                // Neues Prüfargument anlegen
                arg = toEntity(argDto, mat);
                // In alle bestehenden Instanzen dieser Materialnummer einfügen
                addPruefargumentToExistingInstanzen(mat, arg);
            }
            arg.setReihenfolge(i);
            updatedArgs.add(arg);
        }

        // Alte Prüfargumente aus der Liste entfernen (gelöschte)
        currentArgs.removeIf(a -> a.getId() != null && !newIds.contains(a.getId()));

        // Liste aktualisieren
        currentArgs.clear();
        currentArgs.addAll(updatedArgs);

        // 4. materialVeraendert-Flag setzen wenn es Aufträge mit dieser Materialnummer gibt
        if (!removedArgs.isEmpty() || newArgs.stream().anyMatch(a -> a.getId() == null)) {
            // Es wurden Prüfargumente gelöscht oder neue hinzugefügt
            List<Auftrag> auftraege = auftragRepository.findByMaterialnummerId(id);
            for (Auftrag auftrag : auftraege) {
                auftrag.setMaterialVeraendert(true);
                auftragRepository.save(auftrag);
                // Auch alle Instanzen markieren
                List<Instanz> instanzen = instanzRepository.findByAuftragIdOrderByNummerAsc(auftrag.getId());
                for (Instanz instanz : instanzen) {
                    instanz.setMaterialVeraendert(true);
                    instanzRepository.save(instanz);
                }
            }
        }

        Materialnummer saved = materialnummerRepository.save(mat);
        return toDto(saved);
    }

    // Materialnummer löschen (mit Force-Modus)
    @Transactional
    public DeleteResultDto deleteMaterial(Long id, boolean force) {
        Materialnummer mat = findOrThrow(id);
        long count = auftragRepository.countByMaterialnummerId(id);

        if (count > 0 && !force) {
            throw new MaterialnummerInUseException(
                    "Materialnummer wird in " + count + " Auftrag/Aufträgen verwendet", count);
        }

        if (force && count > 0) {
            // Alle Aufträge mit dieser Materialnummer löschen (Cascade löscht Instanzen + Werte)
            List<Auftrag> auftraege = auftragRepository.findByMaterialnummerId(id);
            auftragRepository.deleteAll(auftraege);
        }

        materialnummerRepository.delete(mat);

        DeleteResultDto result = new DeleteResultDto();
        result.setSuccess(true);
        if (force && count > 0) {
            result.setMessage("Materialnummer und " + count + " Auftrag/Aufträge wurden gelöscht");
        } else {
            result.setMessage("Materialnummer wurde gelöscht");
        }
        result.setAffectedAuftraege(force ? count : 0);
        return result;
    }

    // --- Hilfsmethoden ---

    // Materialnummer anhand ID suchen oder 404 werfen
    private Materialnummer findOrThrow(Long id) {
        return materialnummerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Materialnummer mit ID " + id + " nicht gefunden"));
    }

    // Entity zu DTO konvertieren
    private MaterialnummerDto toDto(Materialnummer mat) {
        MaterialnummerDto dto = new MaterialnummerDto();
        dto.setId(mat.getId());
        dto.setNummer(mat.getNummer());
        dto.setBeschreibung(mat.getBeschreibung());
        dto.setAuftragCount(auftragRepository.countByMaterialnummerId(mat.getId()));

        List<PruefargumentDto> argDtos = mat.getPruefargumente().stream()
                .sorted(Comparator.comparingInt(Pruefargument::getReihenfolge))
                .map(this::toDto)
                .collect(Collectors.toList());
        dto.setPruefargumente(argDtos);

        return dto;
    }

    // Prüfargument-Entity zu DTO konvertieren
    private PruefargumentDto toDto(Pruefargument arg) {
        PruefargumentDto dto = new PruefargumentDto();
        dto.setId(arg.getId());
        dto.setBezeichnung(arg.getBezeichnung());
        dto.setTyp(arg.getTyp());
        dto.setKontrollhakenWert(arg.getKontrollhakenWert());
        dto.setToleranzMin(arg.getToleranzMin());
        dto.setToleranzMax(arg.getToleranzMax());
        dto.setZahlwert(arg.getZahlwert());
        dto.setTextWert(arg.getTextWert());
        dto.setReihenfolge(arg.getReihenfolge());
        return dto;
    }

    // DTO zu Entity konvertieren
    private Pruefargument toEntity(PruefargumentDto dto, Materialnummer mat) {
        Pruefargument arg = new Pruefargument();
        arg.setMaterialnummer(mat);
        arg.setBezeichnung(dto.getBezeichnung());
        arg.setTyp(dto.getTyp());
        arg.setKontrollhakenWert(dto.getKontrollhakenWert());
        arg.setToleranzMin(dto.getToleranzMin());
        arg.setToleranzMax(dto.getToleranzMax());
        arg.setZahlwert(dto.getZahlwert());
        arg.setTextWert(dto.getTextWert());
        arg.setReihenfolge(dto.getReihenfolge());
        return arg;
    }

    // Bestehendes Prüfargument mit DTO-Werten aktualisieren
    private void updatePruefargument(Pruefargument arg, PruefargumentDto dto) {
        arg.setBezeichnung(dto.getBezeichnung());
        arg.setTyp(dto.getTyp());
        arg.setKontrollhakenWert(dto.getKontrollhakenWert());
        arg.setToleranzMin(dto.getToleranzMin());
        arg.setToleranzMax(dto.getToleranzMax());
        arg.setZahlwert(dto.getZahlwert());
        arg.setTextWert(dto.getTextWert());
    }

    // Neues Prüfargument in alle bestehenden Instanzen dieser Materialnummer einfügen
    private void addPruefargumentToExistingInstanzen(Materialnummer mat, Pruefargument arg) {
        List<Auftrag> auftraege = auftragRepository.findByMaterialnummerId(mat.getId());
        for (Auftrag auftrag : auftraege) {
            List<Instanz> instanzen = instanzRepository.findByAuftragIdOrderByNummerAsc(auftrag.getId());
            for (Instanz instanz : instanzen) {
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
        }
    }
}
