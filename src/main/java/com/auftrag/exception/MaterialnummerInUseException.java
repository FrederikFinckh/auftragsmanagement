package com.auftrag.exception;

// Wird geworfen wenn eine Materialnummer gelöscht werden soll,
// die noch in Aufträgen verwendet wird (ohne Force-Modus)
public class MaterialnummerInUseException extends RuntimeException {

    private final long count;

    public MaterialnummerInUseException(String message, long count) {
        super(message);
        this.count = count;
    }

    public long getCount() {
        return count;
    }
}
