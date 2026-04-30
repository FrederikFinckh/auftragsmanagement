package com.auftrag.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

// Zentrale Ausnahmebehandlung für alle REST-Controller
@RestControllerAdvice
public class GlobalExceptionHandler {

    // Ressource nicht gefunden → 404
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(ResourceNotFoundException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "NOT_FOUND");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
    }

    // Materialnummer wird in Aufträgen verwendet → 409
    @ExceptionHandler(MaterialnummerInUseException.class)
    public ResponseEntity<Map<String, Object>> handleMaterialnummerInUse(MaterialnummerInUseException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "IN_USE");
        body.put("message", ex.getMessage());
        body.put("count", ex.getCount());
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body);
    }

    // Validierungsfehler (IllegalArgumentException) → 400
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "VALIDATION");
        body.put("message", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }

    // Bean-Validierungsfehler (@Valid) → 400 mit Feld-Details
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleMethodArgumentNotValid(MethodArgumentNotValidException ex) {
        Map<String, Object> body = new HashMap<>();
        body.put("error", "VALIDATION");
        Map<String, String> fields = new HashMap<>();
        for (FieldError fieldError : ex.getBindingResult().getFieldErrors()) {
            fields.put(fieldError.getField(), fieldError.getDefaultMessage());
        }
        body.put("fields", fields);
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
    }
}
