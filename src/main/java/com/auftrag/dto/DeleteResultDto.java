package com.auftrag.dto;

import java.util.List;

// Response-DTO für das Löschen einer Materialnummer
public class DeleteResultDto {

    private boolean success;
    private String message;
    private long affectedAuftraege;  // Anzahl gelöschter Aufträge (nur bei force)
    private List<Long> affectedAuftragIds;  // IDs der gelöschten Aufträge (für Tab-Schließung im Frontend)

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

    public List<Long> getAffectedAuftragIds() {
        return affectedAuftragIds;
    }

    public void setAffectedAuftragIds(List<Long> affectedAuftragIds) {
        this.affectedAuftragIds = affectedAuftragIds;
    }
}
