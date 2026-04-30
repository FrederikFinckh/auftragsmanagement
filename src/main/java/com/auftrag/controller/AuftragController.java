package com.auftrag.controller;

import com.auftrag.dto.AuftragCreateDto;
import com.auftrag.dto.AuftragDto;
import com.auftrag.dto.InstanzUebersichtDto;
import com.auftrag.service.AuftragService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST-Controller für die Aufträge-API
@RestController
@RequestMapping("/api/auftraege")
public class AuftragController {

    private final AuftragService auftragService;

    public AuftragController(AuftragService auftragService) {
        this.auftragService = auftragService;
    }

    // Alle Aufträge abrufen
    @GetMapping
    public ResponseEntity<List<AuftragDto>> getAlleAuftraege() {
        return ResponseEntity.ok(auftragService.getAlleAuftraege());
    }

    // Neuen Auftrag anlegen (generiert N Instanzen)
    @PostMapping
    public ResponseEntity<AuftragDto> createAuftrag(@Valid @RequestBody AuftragCreateDto dto) {
        AuftragDto created = auftragService.createAuftrag(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Instanzen-Übersicht für einen Auftrag (für Übersichtskarten)
    @GetMapping("/{id}/instanzen")
    public ResponseEntity<List<InstanzUebersichtDto>> getInstanzenFuerAuftrag(@PathVariable Long id) {
        return ResponseEntity.ok(auftragService.getInstanzenFuerAuftrag(id));
    }

    // Auftrag bearbeiten (Metadaten, keine Stückzahl-Änderung)
    @PutMapping("/{id}")
    public ResponseEntity<AuftragDto> updateAuftrag(@PathVariable Long id,
                                                      @Valid @RequestBody AuftragCreateDto dto) {
        return ResponseEntity.ok(auftragService.updateAuftrag(id, dto));
    }

    // Auftrag löschen (Cascade löscht Instanzen + Werte)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAuftrag(@PathVariable Long id) {
        auftragService.deleteAuftrag(id);
        return ResponseEntity.noContent().build();
    }
}
