package com.auftrag.controller;

import com.auftrag.dto.*;
import com.auftrag.service.InstanzService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

// REST-Controller für die Instanzen-API
@RestController
@RequestMapping("/api/instanzen")
public class InstanzController {

    private final InstanzService instanzService;

    public InstanzController(InstanzService instanzService) {
        this.instanzService = instanzService;
    }

    // Instanz-Detail mit allen Werten abrufen
    @GetMapping("/{id}")
    public ResponseEntity<InstanzDetailDto> getInstanzDetail(@PathVariable Long id) {
        return ResponseEntity.ok(instanzService.getInstanzDetail(id));
    }

    // Einzelnen Wert speichern (auto-save)
    @PatchMapping("/{id}/werte/{wertId}")
    public ResponseEntity<InstanzWertDto> updateWert(@PathVariable Long id,
                                                      @PathVariable Long wertId,
                                                      @RequestBody InstanzWertUpdateDto dto) {
        return ResponseEntity.ok(instanzService.updateWert(id, wertId, dto));
    }

    // Kontrolle abgeschlossen Flag setzen
    @PatchMapping("/{id}/abgeschlossen")
    public ResponseEntity<InstanzDetailDto> setAbgeschlossen(@PathVariable Long id,
                                                              @RequestBody AbgeschlossenDto dto) {
        return ResponseEntity.ok(instanzService.setKontrolleAbgeschlossen(id, dto.isAbgeschlossen()));
    }
}
