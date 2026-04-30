package com.auftrag.dto;

// Response-DTO für das Löschen einer Materialnummer
public class DeleteResultDto {

    private boolean success;
    private String message;
    private long affectedAuftraege;  // Anzahl gelöschter Aufträge (nur bei force)

    // --- Getter und Setter ---

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public long getAffectedAuftraege() {
        return affectedAuftraege;
    }

    public void setAffectedAuftraege(long affectedAuftraege) {
        this.affectedAuftraege = affectedAuftraege;
    }
}
