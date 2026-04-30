package com.auftrag.controller;

import com.auftrag.dto.DeleteResultDto;
import com.auftrag.dto.MaterialnummerCreateDto;
import com.auftrag.dto.MaterialnummerDto;
import com.auftrag.service.MaterialnummerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// REST-Controller für die Materialnummern-API
@RestController
@RequestMapping("/api/materialien")
public class MaterialnummerController {

    private final MaterialnummerService materialnummerService;

    public MaterialnummerController(MaterialnummerService materialnummerService) {
        this.materialnummerService = materialnummerService;
    }

    // Alle Materialnummern abrufen
    @GetMapping
    public ResponseEntity<List<MaterialnummerDto>> getAlleMaterialien() {
        return ResponseEntity.ok(materialnummerService.getAlleMaterialien());
    }

    // Einzelne Materialnummer anhand der ID abrufen
    @GetMapping("/{id}")
    public ResponseEntity<MaterialnummerDto> getMaterialById(@PathVariable Long id) {
        return ResponseEntity.ok(materialnummerService.getMaterialById(id));
    }

    // Neue Materialnummer anlegen
    @PostMapping
    public ResponseEntity<MaterialnummerDto> createMaterial(@Valid @RequestBody MaterialnummerCreateDto dto) {
        MaterialnummerDto created = materialnummerService.createMaterial(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    // Materialnummer bearbeiten (triggert Sync-Logik für bestehende Instanzen)
    @PutMapping("/{id}")
    public ResponseEntity<MaterialnummerDto> updateMaterial(@PathVariable Long id,
                                                              @Valid @RequestBody MaterialnummerCreateDto dto) {
        return ResponseEntity.ok(materialnummerService.updateMaterial(id, dto));
    }

    // Materialnummer löschen (blockiert wenn in Aufträgen verwendet, Force-Modus möglich)
    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResultDto> deleteMaterial(@PathVariable Long id,
                                                           @RequestParam(defaultValue = "false") boolean force) {
        return ResponseEntity.ok(materialnummerService.deleteMaterial(id, force));
    }
}
