package com.auftrag.exception;

// Wird geworfen wenn eine Ressource anhand ihrer ID nicht gefunden wird
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }
}
